import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.services.seed_data import seed_initial_data

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_initial_data(db)
    db.close()

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_scan_text_api():
    payload = {"text": "URGENT! Your account ending in 9812 will be locked. Click http://bank-update.xyz to verify."}
    response = client.post("/api/scan/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 50.0
    assert "risk_level" in data
    assert "result" in data

def test_dashboard_api():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_scans" in data
    assert "scam_categories" in data

def test_education_api():
    response = client.get("/api/education")
    assert response.status_code == 200
    data = response.json()
    assert "scam_guides" in data
    assert len(data["scam_guides"]) > 0
