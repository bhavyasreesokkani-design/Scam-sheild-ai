from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Scan, ScamReport
from app.schemas import DashboardStatsResponse, ScanHistoryItem, ReportOut

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_scans = db.query(Scan).count()
    scams_detected = db.query(Scan).filter(Scan.risk_score >= 30.0).count()
    safe_scans = db.query(Scan).filter(Scan.risk_score < 30.0).count()
    critical_alerts = db.query(Scan).filter(Scan.risk_score >= 80.0).count()

    recent_scans_db = db.query(Scan).order_by(Scan.created_at.desc()).limit(6).all()
    recent_reports_db = db.query(ScamReport).order_by(ScamReport.created_at.desc()).limit(5).all()

    # Scam categories breakdown
    scam_type_counts = (
        db.query(Scan.scam_type, func.count(Scan.id))
        .filter(Scan.risk_score >= 30.0)
        .group_by(Scan.scam_type)
        .all()
    )
    scam_categories = {st: count for st, count in scam_type_counts}

    # Risk level distribution
    risk_level_counts = (
        db.query(Scan.risk_level, func.count(Scan.id))
        .group_by(Scan.risk_level)
        .all()
    )
    risk_distribution = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    for rl, count in risk_level_counts:
        if rl in risk_distribution:
            risk_distribution[rl] = count

    recent_scans = [ScanHistoryItem.model_validate(s) for s in recent_scans_db]
    recent_reports = [ReportOut.model_validate(r) for r in recent_reports_db]

    return {
        "total_scans": total_scans,
        "scams_detected": scams_detected,
        "safe_scans": safe_scans,
        "critical_alerts": critical_alerts,
        "recent_scans": recent_scans,
        "recent_reports": recent_reports,
        "scam_categories": scam_categories,
        "risk_distribution": risk_distribution
    }
