from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import ScamReport, User
from app.schemas import ReportCreate, ReportOut
from app.security.auth_handler import get_current_user_optional

router = APIRouter(prefix="/reports", tags=["Scam Reports"])

@router.post("", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def submit_report(
    report_in: ReportCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    report = ScamReport(
        user_id=current_user.id if current_user else None,
        title=report_in.title,
        content=report_in.content,
        category=report_in.category,
        scam_url=report_in.scam_url,
        status="Under Review"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("", response_model=List[ReportOut])
def get_reports(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    reports = db.query(ScamReport).order_by(ScamReport.created_at.desc()).limit(limit).all()
    return reports
