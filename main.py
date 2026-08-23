import hmac
import hashlib
import os
import time
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException, Header, status, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from engine import CodeAnalyzer
from sandbox import SecuritySandbox
from database import engine, Base, get_db
from models import PullRequestRecord
from task_queue import TaskQueue

# Automatically create database tables
Base.metadata.create_all(bind=engine)

load_dotenv()

app = FastAPI(
    title="NovaTrace CI Gateway",
    description="Continuous Intelligence for Zero-Trust Code Reviews"
)

WEBHOOK_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET", "spectra_ci_secret_key_2026")

def verify_github_signature(payload_body: bytes, signature_header: str):
    if not WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook secret is not configured on the server."
        )
    if not signature_header:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing X-Hub-Signature-256 header."
        )
        
    parts = signature_header.split("=")
    if len(parts) != 2 or parts[0] != "sha256":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signature format. Expected sha256=<hash>."
        )

    signature = parts[1]
    mac = hmac.new(WEBHOOK_SECRET.encode("utf-8"), msg=payload_body, digestmod=hashlib.sha256)
    expected_signature = mac.hexdigest()

    if not hmac.compare_digest(expected_signature, signature):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid HMAC signature. Request rejected."
        )

# --- REST API Endpoints ---
@app.get("/")
async def root():
    return {"system": "NovaTrace CI Gateway", "status": "operational", "mcp_native": True}

@app.get("/api/prs")
async def get_all_pull_requests(db: Session = Depends(get_db)):
    records = db.query(PullRequestRecord).order_by(PullRequestRecord.id.desc()).all()
    return [
        {
            "id": r.id,
            "pr_number": r.pr_number,
            "repository": r.repository,
            "commit_sha": r.commit_sha,
            "status": r.status,
            "has_syntax_errors": r.has_syntax_errors,
            "ai_summary": r.ai_summary,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else None
        }
        for r in records
    ]

class CodeAnalysisRequest(BaseModel):
    code: str

@app.post("/api/analyze")
async def analyze_code_live(req: CodeAnalysisRequest):
    start_time = time.time()
    
    analyzer = CodeAnalyzer("python")
    ast_result = analyzer.analyze_code(req.code)
    
    sandbox = SecuritySandbox()
    sandbox_result = sandbox.execute_in_sandbox(req.code)
    
    execution_time = round((time.time() - start_time) * 1000, 2)
    
    return {
        "ast_analysis": ast_result,
        "sandbox_execution": sandbox_result,
        "performance": {
            "execution_time_ms": execution_time,
            "status": "SECURE" if sandbox_result.get("success") else "VIOLATION_DETECTED"
        }
    }

@app.post("/api/trigger-test-webhook")
async def trigger_test_webhook(db: Session = Depends(get_db)):
    pr_num = int(time.time()) % 10000
    repo_name = "novatrace-core/security-kernel"
    commit_hash = hashlib.sha256(str(time.time()).encode()).hexdigest()

    pr_record = PullRequestRecord(
        pr_number=pr_num,
        repository=repo_name,
        commit_sha=commit_hash,
        status="pending"
    )
    db.add(pr_record)
    db.commit()
    db.refresh(pr_record)

    pr_data = {
        "db_id": pr_record.id,
        "action": "opened",
        "repo": repo_name,
        "pr_number": pr_num,
        "commit_sha": commit_hash,
    }
    TaskQueue.enqueue_pr_analysis(pr_data)

    return {"status": "success", "message": "Webhook dispatched", "pr_record_id": pr_record.id}

# --- REAL-TIME TELEMETRY (SSE STREAM) ---
@app.get("/api/telemetry/stream")
async def telemetry_stream(request: Request):
    """
    Server-Sent Events endpoint for real-time execution logs and AST updates.
    Your React Three Fiber frontend will connect to this.
    """
    async def event_generator():
        while True:
            # Drop connection if client disconnects
            if await request.is_disconnected():
                break
                
            # TODO: Replace heartbeat with actual TaskQueue / Redis pub-sub consumption
            payload = f'{{"type": "heartbeat", "timestamp": {time.time()}}}'
            yield f"data: {payload}\n\n"
            
            await asyncio.sleep(2)
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")