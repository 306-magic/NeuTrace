from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime, timezone
from database import Base
from pydantic import BaseModel, Field

# ==========================================
# 1. SQLALCHEMY DATABASE MODELS (For Storage)
# ==========================================
class PullRequestRecord(Base):
    """
    Database table to store incoming Pull Requests and their analysis results.
    """
    __tablename__ = "pull_requests"

    id = Column(Integer, primary_key=True, index=True)
    pr_number = Column(Integer, index=True, nullable=False)
    repository = Column(String, index=True, nullable=False)
    commit_sha = Column(String, nullable=False)
    
    # Tracking the CI Pipeline status
    status = Column(String, default="pending")  # pending, analyzing, completed, failed
    
    # Engine Results
    has_syntax_errors = Column(Boolean, default=False)
    
    # AI Brain Results
    ai_summary = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ==========================================
# 2. PYDANTIC API SCHEMAS (For Network Validation)
# ==========================================
class ThreatAnalysisEvent(BaseModel):
    """
    Validates the structured JSON payload sent by the NeuTrace React UI.
    """
    event_id: str = Field(..., description="Unique identifier for the audit event")
    timestamp: int = Field(..., description="Unix timestamp of execution")
    file_name: str = Field(..., description="Target file being analyzed")
    scenario_id: str = Field(..., description="Internal ID of the threat vector")
    scenario_title: str = Field(..., description="Display title of the scenario")
    threat_level: str = Field(..., description="Severity level (e.g., CRITICAL, HIGH)")
    diagnostic_goal: str = Field(..., description="Specific objective for the Gemini agent")
    code: str = Field(..., description="Raw source code payload")
# ==========================================
# PYDANTIC API SCHEMAS (For Network Validation)
# ==========================================
class ThreatAnalysisEvent(BaseModel):
    """
    Validates the structured JSON payload sent by the NeuTrace React UI.
    """
    event_id: str = Field(..., description="Unique identifier for the audit event")
    timestamp: int = Field(..., description="Unix timestamp of execution")
    file_name: str = Field(..., description="Target file being analyzed")
    scenario_id: str = Field(..., description="Internal ID of the threat vector")
    scenario_title: str = Field(..., description="Display title of the scenario")
    threat_level: str = Field(..., description="Severity level (e.g., CRITICAL, HIGH)")
    diagnostic_goal: str = Field(..., description="Specific objective for the Gemini agent")
    code: str = Field(..., description="Raw source code payload")