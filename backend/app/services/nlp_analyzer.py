import re
from typing import Dict, List, Any

# Keywords and patterns by category
URGENCY_KEYWORDS = [
    "immediately", "urgent", "urgently", "account blocked", "blocked", "action required",
    "within 24 hours", "24 hours", "last warning", "expire", "expires today", "final notice",
    "suspend", "suspended", "terminate", "deactivate", "deactivated", "hurry", "limited time",
    "act now", "instant", "emergency"
]

FINANCIAL_KEYWORDS = [
    "bank", "account", "transfer", "pay", "payment", "fee", "registration fee", "deposit",
    "refundable", "credit card", "debit card", "upi", "gpay", "phonepe", "paytm", "wallet",
    "prize", "reward", "cashback", "fund", "amount", "rupees", "inr", "₹", "dollar", "$",
    "lottery", "jackpot", "commission", "profit", "crypto", "bitcoin", "investment", "return"
]

CREDENTIAL_KEYWORDS = [
    "otp", "password", "passcode", "pin", "cvv", "verify", "verification", "log in",
    "login", "authenticate", "confirm details", "kyc", "update kyc", "ssn", "aadhaar",
    "pan card", "bank details", "credentials", "security code"
]

IMPERSONATION_KEYWORDS = [
    "rbi", "sbi", "hdfc", "icici", "axis bank", "income tax", "customs", "police",
    "cbi", "amazon", "flipkart", "fedex", "dhl", "courier", "netflix", "apple",
    "microsoft", "google", "whatsapp", "customer care", "support team", "helpdesk",
    "department of telecommunication", "trai"
]

REWARD_KEYWORDS = [
    "congratulations", "congrats", "winner", "you won", "lucky", "selected",
    "free gift", "claim now", "claim your prize", "offer", "voucher", "bonus"
]

THREAT_KEYWORDS = [
    "legal action", "court", "warrant", "arrest", "police complaint", "penalty",
    "fine", "prosecution", "seized", "fir", "lawyer"
]

JOB_SCAM_KEYWORDS = [
    "work from home", "part time job", "earn money daily", "daily income",
    "no experience needed", "typing job", "data entry", "earn ₹", "earn $",
    "registration charge", "hr department", "hiring manager"
]


def analyze_text(text: str) -> Dict[str, Any]:
    text_lower = text.lower()
    
    found_urgency = [kw for kw in URGENCY_KEYWORDS if kw in text_lower]
    found_financial = [kw for kw in FINANCIAL_KEYWORDS if kw in text_lower]
    found_credentials = [kw for kw in CREDENTIAL_KEYWORDS if kw in text_lower]
    found_impersonation = [kw for kw in IMPERSONATION_KEYWORDS if kw in text_lower]
    found_rewards = [kw for kw in REWARD_KEYWORDS if kw in text_lower]
    found_threats = [kw for kw in THREAT_KEYWORDS if kw in text_lower]
    found_job_scams = [kw for kw in JOB_SCAM_KEYWORDS if kw in text_lower]

    # Calculate sub-scores
    urgency_score = min(len(found_urgency) * 20, 100)
    financial_score = min(len(found_financial) * 15, 100)
    credential_score = min(len(found_credentials) * 25, 100)
    impersonation_score = min(len(found_impersonation) * 20, 100)
    reward_score = min(len(found_rewards) * 20, 100)
    threat_score = min(len(found_threats) * 25, 100)
    job_score = min(len(found_job_scams) * 20, 100)

    # Highlighted words/phrases list
    all_highlights = list(set(
        found_urgency + found_financial + found_credentials + 
        found_impersonation + found_rewards + found_threats + found_job_scams
    ))

    # Base NLP Risk Calculation
    nlp_risk_score = (
        urgency_score * 0.20 +
        financial_score * 0.15 +
        credential_score * 0.25 +
        impersonation_score * 0.15 +
        reward_score * 0.10 +
        threat_score * 0.15
    )

    return {
        "nlp_risk_score": round(min(nlp_risk_score, 100.0), 1),
        "urgency_found": found_urgency,
        "financial_found": found_financial,
        "credentials_found": found_credentials,
        "impersonation_found": found_impersonation,
        "rewards_found": found_rewards,
        "threats_found": found_threats,
        "job_scams_found": found_job_scams,
        "highlighted_phrases": all_highlights
    }
