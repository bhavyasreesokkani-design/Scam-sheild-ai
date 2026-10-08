import pytest
from app.services.url_analyzer import analyze_url

def test_legitimate_url():
    res = analyze_url("https://www.google.com")
    assert res["risk_score"] < 30.0
    assert res["https_status"] is True
    assert "Google" in res["reputation"] or "Legitimate" in res["reputation"]

def test_malicious_url_tld():
    res = analyze_url("http://sbi-login-verify.xyz")
    assert res["risk_score"] >= 60.0
    assert res["https_status"] is False
    assert any("TLD" in ind or "brand" in ind.lower() for ind in res["suspicious_indicators"])

def test_ip_address_url():
    res = analyze_url("http://192.168.1.1/login.php")
    assert res["risk_score"] >= 35.0
    assert any("IP address" in ind for ind in res["suspicious_indicators"])
