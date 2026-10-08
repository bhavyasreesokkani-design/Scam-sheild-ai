from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import Scan, ScanResult, UrlAnalysis, User
from app.schemas import ScanResponse
from app.security.auth_handler import get_current_user_optional
from app.services.detector import detector

router = APIRouter(prefix="/scan", tags=["Image OCR Scanner"])

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}

@router.post("/image", response_model=ScanResponse)
async def scan_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    filename = file.filename or ""
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: JPG, JPEG, PNG, WEBP."
        )

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    analysis = detector.predict_image(content)

    scan = Scan(
        user_id=current_user.id if current_user else None,
        input_type="image",
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
