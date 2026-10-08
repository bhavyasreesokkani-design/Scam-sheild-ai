import pytest
from app.services.detector import detector

def test_safe_message_detection():
    safe_msg = "Your college meeting is scheduled for tomorrow at 10 AM in Room 304."
    res = detector.predict_text(safe_msg)
    assert res["risk_score"] < 30.0
    assert res["risk_level"] == "LOW"
    assert "Safe" in res["scam_type"]

def test_phishing_scam_detection():
    phish_msg = "URGENT! Your bank account will be blocked within 24 hours. Verify your account password immediately using http://sbi-login-verify.xyz"
    res = detector.predict_text(phish_msg)
    assert res["risk_score"] >= 75.0
    assert res["risk_level"] in ["HIGH", "CRITICAL"]
    assert res["scam_type"] == "Phishing"
    assert len(res["result"]["indicators"]) > 0

def test_job_scam_detection():
    job_msg = "Congratulations! You have been selected for a work-from-home job. Earn ₹50,000/month typing captcha codes. Pay ₹2,000 registration fee."
    res = detector.predict_text(job_msg)
    assert res["risk_score"] >= 70.0
    assert res["scam_type"] == "Job Scam"

def test_otp_scam_detection():
    otp_msg = "Your OTP is 482193. Share this OTP with customer support immediately to activate your account."
    res = detector.predict_text(otp_msg)
    assert res["risk_score"] >= 70.0
    assert "OTP" in " ".join(res["result"]["highlighted_phrases"]).upper() or "OTP" in res["result"]["explanation"].upper() or len(res["result"]["indicators"]) > 0
