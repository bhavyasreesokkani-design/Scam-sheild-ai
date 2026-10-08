from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime
import re

def validate_email_format(email: str) -> str:
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        raise ValueError("Invalid email format")
    return email.lower()

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6)

    @field_validator('email')

    def check_email(cls, v):
        return validate_email_format(v)

class UserLogin(BaseModel):
    email: str
    password: str

    @field_validator('email')

    def check_email(cls, v):
        return validate_email_format(v)

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# --- Scan Schemas ---
class TextScanRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=10000, description="Text message or SMS to scan")

class EmailScanRequest(BaseModel):
    subject: Optional[str] = ""
    body: str = Field(..., min_length=3, max_length=20000)
    sender: Optional[str] = ""

class UrlScanRequest(BaseModel):
    url: str = Field(..., min_length=3, description="URL string to analyze")

class UrlAnalysisDetail(BaseModel):
    url: str
    domain: str
    https_status: bool
    reputation: str
    risk_score: float
    suspicious_indicators: List[str]

class ScanResultDetail(BaseModel):
    indicators: List[str]
    explanation: str
    recommendation: str
    highlighted_phrases: List[str]

class ScanResponse(BaseModel):
    id: Optional[int] = None
    input_type: str
    input_text: str
    risk_score: float
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    scam_type: str
    confidence: float
    extracted_url: Optional[str] = None
    created_at: Optional[datetime] = None
    result: ScanResultDetail
    url_details: Optional[UrlAnalysisDetail] = None

    class Config:
        from_attributes = True

class ScanHistoryItem(BaseModel):
    id: int
    input_type: str
    input_text: str
    risk_score: float
    risk_level: str
    scam_type: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True

# --- Report Schemas ---
class ReportCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    content: str = Field(..., min_length=10, max_length=5000)
    category: str = Field(..., min_length=2, max_length=100)
    scam_url: Optional[str] = None

class ReportOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    title: str
    content: str
    category: str
    scam_url: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Feedback Schemas ---
class FeedbackCreate(BaseModel):
    scan_id: int
    user_feedback: str  # "Correct" or "Incorrect"
    comments: Optional[str] = None

class FeedbackOut(BaseModel):
    id: int
    scan_id: int
    user_feedback: str
    correct_prediction: bool
    comments: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Dashboard Schemas ---
class DashboardStatsResponse(BaseModel):
    total_scans: int
    scams_detected: int
    safe_scans: int
    critical_alerts: int
    recent_scans: List[ScanHistoryItem]
    recent_reports: List[ReportOut]
    scam_categories: dict
    risk_distribution: dict
