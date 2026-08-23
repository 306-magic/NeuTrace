from database import SessionLocal
from models import CodeAnalysisLog

def check_database():
    print("\n--- SPECTRA DATABASE QUERY ---")
    db = SessionLocal()
    try:
        logs = db.query(CodeAnalysisLog).all()
        print(f"Total historical records found: {len(logs)}\n")
        
        for log in logs:
            print(f"Record ID: {log.id}")
            print(f"  - Nodes Parsed: {log.nodes_parsed}")
            print(f"  - Complexity: {log.asymptotic_complexity}")
            print(f"  - Stability: {log.stability_index}")
            print(f"  - Timestamp: {log.timestamp}")
            print("-" * 30)
    finally:
        db.close()

if __name__ == "__main__":
    check_database()