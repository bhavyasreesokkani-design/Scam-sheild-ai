from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Scan, ScanResult, UrlAnalysis, User
from app.schemas import TextScanRequest, EmailScanRequest, ScanResponse, ScanHistoryItem
from app.security.auth_handler import get_current_user_optional
from app.services.detector import detector

router = APIRouter(tags=["Scan Engine"])

@router.post("/scan/text", response_model=ScanResponse)
def scan_text(
    payload: TextScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    analysis = detector.predict_text(text, input_type="text")
    
    scan = Scan(
        user_id=current_user.id if current_user else None,
        input_type=analysis["input_type"],
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

    if analysis["url_details"]:
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

@router.post("/scan/email", response_model=ScanResponse)
def scan_email(
    payload: EmailScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    full_email_text = f"Subject: {payload.subject or ''}\nSender: {payload.sender or ''}\n\n{payload.body}"
    analysis = detector.predict_text(full_email_text, input_type="email")
    
    scan = Scan(
        user_id=current_user.id if current_user else None,
        input_type="email",
        input_text=full_email_text,
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

    if analysis["url_details"]:
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

@router.get("/scans", response_model=List[ScanHistoryItem])
def get_scans_history(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    scans = db.query(Scan).order_by(Scan.created_at.desc()).limit(limit).all()
    return scans

@router.get("/scans/{scan_id}", response_model=ScanResponse)
def get_scan_details(
    scan_id: int,
    db: Session = Depends(get_db)
):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan

@router.delete("/scans/{scan_id}")
def delete_scan(
    scan_id: int,
    db: Session = Depends(get_db)
):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    db.delete(scan)
    db.commit()
    return {"message": f"Scan {scan_id} deleted successfully"}
