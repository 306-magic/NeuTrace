import time
import json
from database import SessionLocal
from models import PullRequestRecord
from engine import CodeAnalyzer
from sandbox import SecuritySandbox

def process_next_job():
    """
    Simulates a background worker polling the task queue, 
    running the code analyzer, and updating DB state.
    """
    db = SessionLocal()
    try:
        # Find the oldest pending Pull Request record
        pending_record = db.query(PullRequestRecord).filter_by(status="pending").first()
        
        if not pending_record:
            print("[Worker] No pending jobs found in queue.")
            return

        print(f"\n[Worker] Picked up Job ID {pending_record.id} for PR #{pending_record.pr_number} ({pending_record.repository})")
        
        # 1. Update status to 'analyzing'
        pending_record.status = "analyzing"
        db.commit()

        # 2. Run AST Structural Analysis (Simulating pull request code review)
        sample_pr_code = """
def process_data(data_list):
    results = []
    for item in data_list:
        results.append(item * 2)
    return results
"""
        analyzer = CodeAnalyzer("python")
        analysis_result = analyzer.analyze_code(sample_pr_code)
        
        print(f"[Worker] AST Analysis Complete: Found {analysis_result['function_count']} functions.")

        # 3. Save findings to DB and mark as 'completed'
        pending_record.has_syntax_errors = analysis_result["has_syntax_error"]
        pending_record.status = "completed"
        pending_record.ai_summary = f"AST parsed successfully. Functions detected: {analysis_result['functions']}"
        
        db.commit()
        print(f"[Worker] Job ID {pending_record.id} successfully updated to status='completed' in DB!\n")

    except Exception as e:
        db.rollback()
        print(f"[Worker Error] Processing failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("--- Spectra CI: Starting Background Worker ---")
    process_next_job()