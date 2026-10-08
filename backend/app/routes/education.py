from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter(prefix="/education", tags=["Scam Education"])

SCAM_GUIDES = [
    {
        "id": "phishing",
        "title": "Phishing & Fake Links",
        "icon": "ShieldAlert",
        "description": "Deceptive emails or messages with fraudulent links designed to steal passwords, bank credentials, or credit card info.",
        "red_flags": ["Suspicious URLs with fake TLDs (.xyz, .top)", "Generic greetings or urgent threats", "Unrequested password reset prompts"],
        "prevention": "Never click on direct link in SMS/Email. Always navigate to the official app or type website URL manually."
    },
    {
        "id": "upi",
        "title": "UPI & Payment Scams",
        "icon": "CreditCard",
        "description": "Fraudsters trick users into entering their UPI PIN on payment requests claiming they are receiving money.",
        "red_flags": ["Prompt to enter UPI PIN to receive money", "Overpayment mistakes on OLX/Marketplace", "Request for QR code scan to accept cash"],
        "prevention": "Remember: You NEVER need to enter your UPI PIN to RECEIVE money. Entering PIN always deducts money."
    },
    {
        "id": "otp",
        "title": "OTP & Credential Hijacking",
        "icon": "Key",
        "description": "Scammers pose as bank officials or technical support demanding One-Time Passwords to authorize unauthorized transactions.",
        "red_flags": ["Callers claiming your SIM or bank account is blocked", "Urgent request for 4-digit or 6-digit OTP", "Requests for screen sharing app installation (AnyDesk, TeamViewer)"],
        "prevention": "Bank officials and customer support will NEVER ask for your OTP or password over the phone."
    },
    {
        "id": "job",
        "title": "Part-Time & Work-From-Home Job Scams",
        "icon": "Briefcase",
        "description": "Fake recruitment offers promising lucrative daily income for completing simple tasks like liking YouTube videos or typing.",
        "red_flags": ["Requirement to pay 'registration fee' or 'security deposit'", "Unsolicited WhatsApp/Telegram job offers", "Guaranteed high daily salary with zero experience"],
        "prevention": "Legitimate employers never charge candidates money for job offers or recruitment process."
    },
    {
        "id": "investment",
        "title": "Crypto & High-Yield Investment Scams",
        "icon": "TrendingUp",
        "description": "Ponzi schemes promising double returns, guaranteed profits, or insider trading crypto advice via Telegram groups.",
        "red_flags": ["Guaranteed zero-risk 200%+ profit returns", "Pressure to invest immediately before slot fills", "Unregulated trading platforms"],
        "prevention": "Avoid schemes offering guaranteed abnormally high returns. Verify SEBI/RBI registered financial advisors."
    },
    {
        "id": "impersonation",
        "title": "Law Enforcement & Authority Impersonation",
        "icon": "UserCheck",
        "description": "Threatening calls or notices pretending to be CBI, Police, Customs, TRAI, or Income Tax claiming legal action.",
        "red_flags": ["Threats of immediate arrest warrant or court summons", "Demands for digital arrest or video call verification", "Request for money transfer to 'clear investigation'"],
        "prevention": "Indian law enforcement does not conduct 'Digital Arrests' via WhatsApp/Skype calls or demand online fines."
    }
]

SAFETY_RULES = [
    "Never share One-Time Passwords (OTPs) or PINs with anyone.",
    "Verify website URLs carefully before entering login details.",
    "Do not trust urgent payment or fine requests over phone or SMS.",
    "Independently verify unknown callers through official helpline numbers.",
    "Use official bank apps and official government portals only.",
    "Report suspicious messages and scam numbers to National Cyber Crime Reporting Portal (cybercrime.gov.in)."
]

@router.get("")
def get_education_data() -> Dict[str, Any]:
    return {
        "scam_guides": SCAM_GUIDES,
        "safety_rules": SAFETY_RULES
    }
