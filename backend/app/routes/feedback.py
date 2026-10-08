from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Feedback, Scan, User
from app.schemas import FeedbackCreate, FeedbackOut
from app.security.auth_handler import get_current_user_optional

router = APIRouter(prefix="/feedback", tags=["Feedback Loop"])

@router.post("", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
def submit_feedback(
    fb_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    scan = db.query(Scan).filter(Scan.id == fb_in.scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    is_correct = fb_in.user_feedback.lower() == "correct"
    
    fb = Feedback(
        scan_id=fb_in.scan_id,
        user_id=current_user.id if current_user else None,
        user_feedback=fb_in.user_feedback,
        correct_prediction=is_correct,
        comments=fb_in.comments
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb
