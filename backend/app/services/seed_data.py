from sqlalchemy.orm import Session
from app.models import User, Scan, ScanResult, UrlAnalysis, ScamReport
from app.security.password import hash_password
from app.services.detector import detector
import datetime

SAMPLE_SCAMS = [
    # Safe examples (10)
    {"text": "Your college meeting is scheduled for tomorrow at 10 AM in Room 304.", "type": "text"},
    {"text": "Hi Mom, please remember to buy milk and bread on your way home.", "type": "text"},
    {"text": "Your Amazon order #402-892123-112 has been delivered. Thank you for shopping with us.", "type": "text"},
    {"text": "Dear customer, your monthly bank statement for August is now available on your netbanking portal.", "type": "email"},
    {"text": "Reminder: Your dentist appointment is confirmed for Thursday at 3 PM at City Care Dental Clinic.", "type": "text"},
    {"text": "Hey team, the project status update meeting will start in 15 minutes on Google Meet.", "type": "email"},
    {"text": "Your electricity bill of ₹1,450 for August is due on Sep 15. Pay using your official utility portal.", "type": "email"},
    {"text": "Flight status update: Your Indigo flight 6E-204 is on time. Web check-in is now open.", "type": "email"},
    {"text": "Thank you for visiting SBI branch. Please rate your experience by replying with 1 to 5.", "type": "text"},
    {"text": "Your train ticket PNR 2415829103 has been confirmed. Seat B3-42. Have a safe journey.", "type": "text"},

    # Phishing examples (10)
    {"text": "URGENT! Your SBI account has been suspended due to pending KYC. Click http://sbi-kyc-verify-update.xyz/login immediately to unblock.", "type": "text"},
    {"text": "SECURITY ALERT: Unauthorized access detected on your HDFC Bank account. Verify your account password now at http://hdfc-security-check.net", "type": "email"},
    {"text": "Dear user, your Netflix subscription expired. Update your credit card details at http://netflix-billing-renew.top to avoid account deactivation.", "type": "email"},
    {"text": "Paytm KYC Update: Dear customer your Paytm wallet will be locked in 2 hours. Submit Aadhaar & Pan at http://paytm-kyc-portal.click", "type": "text"},
    {"text": "Income Tax Department Notice: You are eligible for an urgent tax refund of ₹15,400. Claim now: http://incometax-refund-gov.site", "type": "email"},
    {"text": "Apple ID Alert: Someone tried logging into your iCloud account from Russia. Reset password immediately: http://apple-id-verify.online", "type": "email"},
    {"text": "Your Amazon account has been restricted. Confirm your login credentials within 12 hours at http://amazon-account-verify.tech", "type": "email"},
    {"text": "PayPal Alert: You sent $450 to unknown merchant. If this was not you, cancel transaction immediately at http://paypal-dispute-auth.site", "type": "email"},
    {"text": "FedEx Express: Package delivery failed due to incorrect address. Pay ₹50 redelivery fee at http://fedex-tracking-parcel.buzz", "type": "text"},
    {"text": "Google Security Warning: Your Gmail account is compromised. Click http://google-auth-login.xyz to verify ownership.", "type": "email"},

    # Financial Scam (10)
    {"text": "Congratulations! Your mobile number won ₹500,000 in Kaun Banega Crorepati lucky draw. Deposit ₹2,500 registration fee to claim prize.", "type": "text"},
    {"text": "Instant Loan Approved! Get ₹2,00,000 loan with 0% interest without income proof. Pay ₹999 processing charge to get instant transfer.", "type": "text"},
    {"text": "URGENT: Your UPI account has received ₹25,000 by mistake. Click this link and enter your UPI PIN to refund the sender.", "type": "text"},
    {"text": "Double your money in 7 days! Guarantee 200% return on crypto trading. Contact Telegram @CryptoMasterRich now.", "type": "text"},
    {"text": "RBI Notification: You have been selected for ₹10 Lakh interest-free business grant. Transfer ₹5,000 document charges to unlock funds.", "type": "email"},
    {"text": "Congratulations! You won iPhone 15 Pro in Spin Wheel contest. Pay ₹399 shipping fee at http://free-gift-claim.top to receive phone.", "type": "text"},
    {"text": "Exclusive Stock Market Tip: Guaranteed 500% profit in next 24 hours. Join VIP Whatsapp group and invest ₹10,000 today.", "type": "text"},
    {"text": "Dear customer, your credit card rewards points (48,200 pts = ₹24,100) will expire today. Redeem into bank account: http://card-points-redeem.site", "type": "text"},
    {"text": "Government Relief Scheme: Receive ₹50,000 direct bank transfer under PM scheme. Enter bank details & OTP at http://pm-relief-fund.xyz", "type": "email"},
    {"text": "Receive $1,000 daily working 2 hours online! No risk, 100% legal payout guaranteed. Transfer $50 activation deposit.", "type": "text"},

    # Job Scam (10)
    {"text": "Work From Home Job Offer: International company hiring Data Entry Operators. Salary ₹45,000/month. Pay ₹1,500 registration fee to get work kit.", "type": "text"},
    {"text": "Part Time Online Job: Earn ₹2,000 to ₹5,000 daily by rating hotels on Google. Contact HR manager on WhatsApp immediately.", "type": "text"},
    {"text": "Amazon Part-Time Hiring: Earn ₹800/hour doing simple online tasks from mobile. Pay ₹500 refundable security deposit to start.", "type": "email"},
    {"text": "Congratulations! You are shortlisted for HR Executive position at Tech Corp. Salary ₹8 Lakh/yr. Pay ₹3,200 interview processing fee.", "type": "email"},
    {"text": "Govt Job Notification: Direct recruitment for Railway Clerk without examination. Pay ₹1,200 application fee at http://railway-recruitment-job.site", "type": "email"},
    {"text": "SMS Typing Job: Earn ₹30,000 per month typing capcha codes from home. Laptop provided free after ₹999 registration.", "type": "text"},
    {"text": "Airlines Ground Staff Recruitment: 500 vacancies open. High salary + free flight ticket. Pay ₹2,500 uniform fee to book slot.", "type": "text"},
    {"text": "Google Map Reviewer Job: Earn ₹500 per review. Daily payout via UPI. Contact telegram channel @FastMoneyJobs.", "type": "text"},
    {"text": "Work from home envelope packing job. Daily ₹1,500 earnings. Send ₹499 postal charge to receive materials.", "type": "text"},
    {"text": "Urgent Requirement: YouTube video liker. Earn ₹150 per like. Pay ₹1,000 VIP membership fee to receive daily task list.", "type": "text"},

    # Impersonation Scam (10)
    {"text": "TRAI Alert: Your mobile SIM card will be deactivated within 2 hours due to illegal activity. Contact customer care at 9812345678 to stop.", "type": "text"},
    {"text": "Electricity Department Warning: Power supply to your residence will be cut off tonight at 9:30 PM due to unpaid bill. Call 9988776655 immediately.", "type": "text"},
    {"text": "CBI Cyber Cell Investigation Notice: Your IP address was found involved in financial fraud. Pay fine of ₹25,000 to avoid arrest warrant.", "type": "email"},
    {"text": "Customs Duty Department: Your international courier parcel from UK containing gold and cash is seized at Mumbai Airport. Pay ₹18,000 clearance tax.", "type": "text"},
    {"text": "WhatsApp Support: Your WhatsApp account will be deleted for terms violation. Share your 6-digit verification code to keep account active.", "type": "text"},
    {"text": "Department of Telecom (DoT): 14 mobile connections registered under your Aadhaar. Verify immediately at http://dot-sim-verify.xyz or face legal action.", "type": "email"},
    {"text": "SBI Customer Support: I am calling from SBI main branch. Your ATM card is blocked. Tell me your 16-digit card number and OTP to unblock.", "type": "text"},
    {"text": "Police Cyber Crime Cell: A formal harassment complaint is filed against your name. Call investigating officer at 9777712345 immediately.", "type": "text"},
    {"text": "High Court Legal Notice: You failed to appear for jury summons. Pay ₹10,000 bail penalty via UPI to avoid immediate arrest.", "type": "email"},
    {"text": "FedEx Officer: Your parcel contains illegal narcotics. Connect to Skype call with Senior IPS officer to resolve case.", "type": "text"}
]

REPORTS_DATA = [
    {
        "title": "Fake SBI KYC Suspension SMS",
        "content": "Received an SMS claiming my SBI bank account was blocked and asking to click http://sbi-kyc-verify-update.xyz. Total scam!",
        "category": "Phishing",
        "scam_url": "http://sbi-kyc-verify-update.xyz",
        "status": "Verified"
    },
    {
        "title": "WhatsApp Part-Time Job Registration Fee Scam",
        "content": "A recruiter on WhatsApp offered ₹3,000/day for rating YouTube videos but demanded ₹1,500 upfront registration fee.",
        "category": "Job Scam",
        "scam_url": "http://fast-job-pay.top",
        "status": "Verified"
    },
    {
        "title": "Fake TRAI SIM Deactivation Threat Call",
        "content": "Received automated voice call claiming my mobile number will be disconnected in 2 hours by TRAI unless I press 9 and share OTP.",
        "category": "Impersonation",
        "scam_url": None,
        "status": "Verified"
    },
    {
        "title": "Electricity Bill Cut-off Fraud",
        "content": "SMS stating electricity will be disconnected tonight at 9:30 PM due to unpaid bill of ₹1,450 with a personal phone number to call.",
        "category": "Financial Scam",
        "scam_url": "http://power-bill-pay.site",
        "status": "Under Review"
    },
    {
        "title": "Fake Income Tax Refund Portal",
        "content": "Phishing email asking to claim ₹15,400 tax refund by entering bank debit card details and OTP.",
        "category": "Phishing",
        "scam_url": "http://incometax-refund-gov.site",
        "status": "Verified"
    }
]

def seed_initial_data(db: Session):
    # Seed Demo Admin User
    existing_user = db.query(User).filter(User.email == "demo@scamshield.ai").first()
    if not existing_user:
        admin_user = User(
            name="Demo Security Analyst",
            email="demo@scamshield.ai",
            password_hash=hash_password("scamshield2026")
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        user_id = admin_user.id
    else:
        user_id = existing_user.id

    # Check existing scans
    existing_scans_count = db.query(Scan).count()
    if existing_scans_count == 0:
        for idx, item in enumerate(SAMPLE_SCAMS):
            analysis = detector.predict_text(item["text"], input_type=item["type"])
            
            scan = Scan(
                user_id=user_id if idx % 2 == 0 else None,
                input_type=analysis["input_type"],
                input_text=analysis["input_text"],
                risk_score=analysis["risk_score"],
                risk_level=analysis["risk_level"],
                scam_type=analysis["scam_type"],
                confidence=analysis["confidence"],
                extracted_url=analysis["extracted_url"],
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=idx * 2)
            )
            db.add(scan)
            db.commit()
            db.refresh(scan)

            scan_res = ScanResult(
                scan_id=scan.id,
                indicators=analysis["result"]["indicators"],
                explanation=analysis["result"]["explanation"],
                recommendation=analysis["result"]["recommendation"],
                highlighted_phrases=analysis["result"]["highlighted_phrases"]
            )
            db.add(scan_res)

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

    # Seed Reports if empty
    existing_reports_count = db.query(ScamReport).count()
    if existing_reports_count == 0:
        for rep in REPORTS_DATA:
            report = ScamReport(
                user_id=user_id,
                title=rep["title"],
                content=rep["content"],
                category=rep["category"],
                scam_url=rep["scam_url"],
                status=rep["status"],
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
            )
            db.add(report)
        db.commit()
