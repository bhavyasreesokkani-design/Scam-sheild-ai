from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import Scan, ScanResult, UrlAnalysis, User
from app.schemas import UrlScanRequest, ScanResponse
from app.security.auth_handler import get_current_user_optional
from app.services.detector import detector

router = APIRouter(prefix="/scan", tags=["URL Checker"])

@router.post("/url", response_model=ScanResponse)
def scan_url(
    payload: UrlScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    raw_url = payload.url.strip()
    if not raw_url:
        raise HTTPException(status_code=400, detail="URL cannot be empty")

    analysis = detector.predict_url(raw_url)

    scan = Scan(
        user_id=current_user.id if current_user else None,
        input_type="url",
        input_text=analysis["input_text"],
        risk_score=analysis["risk_score"],
        risk_level=analysis["risk_level"],
        scam_type=analysis["scam_type"],
        confidence=analysis["confidence"],
        extracted_url=analysis["extracted_url"]
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    scan_result = ScanResult(
        scan_id=scan.id,
        indicators=analysis["result"]["indicators"],
        explanation=analysis["result"]["explanation"],
        recommendation=analysis["result"]["recommendation"],
        highlighted_phrases=analysis["result"]["highlighted_phrases"]
    )
    db.add(scan_result)

    ud = analysis["url_details"]
    url_rec = UrlAnalysis(
        scan_id=scan.id,
        url=ud["url"],
        domain=ud["domain"],
        https_status=ud["https_status"],
        reputation=ud["reputation"],
        risk_score=ud["risk_score"],
        suspicious_indicators=ud["suspicious_indicators"]
    )
    db.add(url_rec)

    db.commit()
    db.refresh(scan)

    return scan
