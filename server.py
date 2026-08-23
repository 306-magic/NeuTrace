"""
NeuTrace Enterprise DevSecOps API Gateway
Production FastAPI Server with Zero-Trust Telemetry Logging & Google Cloud Run Compatibility
"""

import os
import uuid
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Internal engine and database modules
import engine
import database

# Initialize SQLite Zero-Trust Audit Ledger on boot
database.init_db()

app = FastAPI(
    title="NeuTrace DevSecOps API Gateway",
    description="Autonomous Zero-Trust Self-Healing Pipeline powered by Google Gemini & Gemma",
    version="1.0.0"
)

# Open CORS configuration for global frontend access & Cloud Run
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RemediationRequest(BaseModel):
    code: str
    threat_type: Optional[str] = "GENERIC_PAYLOAD"


@app.get("/")
def health_check():
    """Health probe endpoint for Cloud Run and monitoring systems."""
    return {
        "status": "ONLINE",
        "system": "NeuTrace Autonomous Remediation Gateway",
        "cloud_provider": "Google Cloud Run",
        "models": ["Gemma-2-9b-IT", "Gemini-2.5-Flash"]
    }


@app.get("/health")
def health_probe():
    return {"status": "HEALTHY"}


@app.post("/remediate")
@app.post("/api/remediate")
@app.post("/scan")
@app.post("/api/scan")
async def execute_remediation_pipeline(payload: RemediationRequest) -> Dict[str, Any]:
    """
    Executes the tri-agent remediation loop:
    1. Gemma Pre-Flight Triage
    2. AST Sentinel Gatekeeper
    3. Gemini Self-Healing Patch Generation
    4. Immutable SQLite Audit Logging
    """
    if not payload.code or not payload.code.strip():
        raise HTTPException(status_code=400, detail="Target source buffer cannot be empty.")

    event_id = str(uuid.uuid4())

    try:
        # Run autonomous engine pipeline
        result = engine.run_devsecops_pipeline(payload.code)

        # Log immutable record to SQLite database
        database.log_pipeline_event(
            event_id=event_id,
            threat_type=payload.threat_type,
            status=result.get("status", "SUCCESS"),
            original_code=payload.code,
            refactored_code=result.get("code", payload.code),
            analysis_log=result.get("analysis", "")
        )

        return {
            "event_id": event_id,
            "status": result.get("status", "SUCCESS"),
            "analysis": result.get("analysis", ""),
            "code": result.get("code", payload.code)
        }

    except Exception as exc:
        # Fallback logging in case of unhandled execution error
        database.log_pipeline_event(
            event_id=event_id,
            threat_type=payload.threat_type,
            status="ERROR",
            original_code=payload.code,
            refactored_code="",
            analysis_log=f"Execution error encountered: {str(exc)}"
        )
        raise HTTPException(status_code=500, detail=f"Pipeline processing error: {str(exc)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"[+] Booting NeuTrace API Gateway on port {port}...")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)