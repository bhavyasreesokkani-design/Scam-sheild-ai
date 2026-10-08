import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    scans = relationship("Scan", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("ScamReport", back_populates="user", cascade="all, delete-orphan")


class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    input_type = Column(String(50), nullable=False)  # text, email, url, image
    input_text = Column(Text, nullable=False)
    risk_score = Column(Float, nullable=False)  # 0 to 100
    risk_level = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    scam_type = Column(String(100), nullable=False)  # Phishing, Financial Scam, etc.
    confidence = Column(Float, default=90.0)
    extracted_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="scans")
    result = relationship("ScanResult", back_populates="scan", uselist=False, cascade="all, delete-orphan")
    url_details = relationship("UrlAnalysis", back_populates="scan", uselist=False, cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="scan", cascade="all, delete-orphan")


class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False, unique=True)
    indicators = Column(JSON, nullable=False)  # List of string reasons/flags
    explanation = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    highlighted_phrases = Column(JSON, nullable=True)  # Matched suspicious words

    scan = relationship("Scan", back_populates="result")


class UrlAnalysis(Base):
    __tablename__ = "url_analysis"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=True, unique=True)
    url = Column(String(1000), nullable=False)
    domain = Column(String(255), nullable=False)
    https_status = Column(Boolean, default=False)
    reputation = Column(String(100), default="Unknown")
    risk_score = Column(Float, default=0.0)
    suspicious_indicators = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    scan = relationship("Scan", back_populates="url_details")


class ScamReport(Base):
    __tablename__ = "scam_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False, default="Suspicious Scam Report")
    content = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    scam_url = Column(String(500), nullable=True)
    status = Column(String(50), default="Under Review")  # Under Review, Verified, Dismissed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reports")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_feedback = Column(String(50), nullable=False)  # "Correct", "Incorrect"
    correct_prediction = Column(Boolean, nullable=False)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    scan = relationship("Scan", back_populates="feedbacks")
