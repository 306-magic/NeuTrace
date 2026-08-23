import sqlite3
from datetime import datetime

# Provide Base to satisfy imports in models.py
try:
    from sqlalchemy.orm import declarative_base
    Base = declarative_base()
except Exception:
    class Base:
        pass

DB_NAME = "neutrace_telemetry.db"

def initialize_db():
    """Creates the audit log table if it doesn't exist."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT UNIQUE,
            timestamp TEXT,
            scenario_title TEXT,
            threat_level TEXT,
            status TEXT,
            original_code TEXT,
            remediation_code TEXT
        )
    """)
    conn.commit()
    conn.close()

def log_security_event(event_data, engine_result):
    """Inserts a completed security scan into the database."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO audit_logs 
        (event_id, timestamp, scenario_title, threat_level, status, original_code, remediation_code)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        event_data.event_id,
        datetime.now().isoformat(),
        event_data.scenario_title,
        event_data.threat_level,
        engine_result.get("status", "FAILED"),
        event_data.code,
        engine_result.get("code", "")
    ))
    
    conn.commit()
    conn.close()

# Initialize the database table on load
initialize_db()