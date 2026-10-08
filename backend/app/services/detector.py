from typing import Dict, Any, List, Optional
from app.services.nlp_analyzer import analyze_text
from app.services.url_analyzer import analyze_url, extract_urls
from app.services.ocr_service import extract_text_from_image

class ScamDetector:
    def predict_text(self, text: str, input_type: str = "text") -> Dict[str, Any]:
        nlp_res = analyze_text(text)
        urls = extract_urls(text)
        
        url_details = None
        url_risk = 0.0
        extracted_url = None

        if urls:
            extracted_url = urls[0]
            url_details = analyze_url(extracted_url)
            url_risk = url_details["risk_score"]

        # Rule-based Engine & Weight Aggregation
        nlp_risk = nlp_res["nlp_risk_score"]
        
        # Base Combined Score
        if urls:
            combined_risk = (nlp_risk * 0.55) + (url_risk * 0.45)
        else:
            combined_risk = nlp_risk

        # Rule Engine Overrides
        indicators = []
        
        # Check specific combinations
        has_otp_cred = len(nlp_res["credentials_found"]) > 0
        has_urgency = len(nlp_res["urgency_found"]) > 0
        has_financial = len(nlp_res["financial_found"]) > 0
        has_rewards = len(nlp_res["rewards_found"]) > 0
        has_impersonation = len(nlp_res["impersonation_found"]) > 0
        has_threats = len(nlp_res["threats_found"]) > 0
        has_job_keywords = len(nlp_res["job_scams_found"]) > 0

        if has_otp_cred and (has_urgency or urls):
            combined_risk = max(combined_risk, 85.0)
            indicators.append("Requests sensitive credentials or OTP under urgent pressure")

        if has_rewards and (urls or has_financial):
            combined_risk = max(combined_risk, 80.0)
            indicators.append("Promises unrealistic prizes/lottery rewards with external link or payment request")

        if has_job_keywords and has_financial:
            combined_risk = max(combined_risk, 82.0)
            indicators.append("Demands advance fee or registration charge for job opportunity")

        if has_impersonation and (has_urgency or urls or has_otp_cred):
            combined_risk = max(combined_risk, 78.0)
            indicators.append(f"Impersonates trusted institution ({', '.join(nlp_res['impersonation_found']).upper()})")

        if has_threats:
            combined_risk = max(combined_risk, 75.0)
            indicators.append("Uses legal threats or law enforcement pressure tactics")

        if url_details and url_details["suspicious_indicators"]:
            indicators.extend(url_details["suspicious_indicators"])

        # Determine Scam Classification
        scam_type = "Safe / Low Risk"
        if combined_risk >= 30:
            if has_job_keywords:
                scam_type = "Job Scam"
            elif has_rewards:
                scam_type = "Lottery/Prize Scam"
            elif has_otp_cred or (has_impersonation and urls):
                scam_type = "Phishing"
            elif has_impersonation and not urls:
                scam_type = "Impersonation"
            elif "loan" in text.lower() or "instant approval" in text.lower():
                scam_type = "Loan Scam"
            elif "crypto" in text.lower() or "investment" in text.lower() or "double your money" in text.lower():
                scam_type = "Investment Scam"
            elif has_financial:
                scam_type = "Financial Scam"
            elif urls and url_risk >= 60:
                scam_type = "Malware/Malicious Link"
            elif "support" in text.lower() or "customer care" in text.lower():
                scam_type = "Fake Customer Support"
            else:
                scam_type = "Phishing"

        # Determine Risk Level
        final_risk_score = round(min(max(combined_risk, 0.0), 100.0), 1)
        if final_risk_score < 30:
            risk_level = "LOW"
            confidence = round(92.0 + (30 - final_risk_score) * 0.2, 1)
        elif final_risk_score < 60:
            risk_level = "MEDIUM"
            confidence = 88.0
        elif final_risk_score < 80:
            risk_level = "HIGH"
            confidence = 93.0
        else:
            risk_level = "CRITICAL"
            confidence = 96.5

        # Format Indicators & Recommendations
        if not indicators:
            if final_risk_score >= 30:
                indicators = ["Suspicious message pattern detected by Scam Shield AI engine"]
            else:
                indicators = ["No dangerous security indicators detected in message"]

        # Deduplicate indicators
        unique_indicators = list(dict.fromkeys(indicators))

        # Build Explanation & Recommendation
        if final_risk_score >= 80:
            explanation = (
                f"CRITICAL WARNING: This message matches severe scam and phishing patterns. "
                f"It attempts to manipulate you using {', '.join(nlp_res['highlighted_phrases'][:4]) or 'suspicious triggers'}."
            )
            recommendation = (
                "🚨 DO NOT CLICK ANY LINKS. Never share OTPs, passwords, or bank details. "
                "Do not transfer money or pay registration fees. Block the sender and report the scam immediately."
            )
        elif final_risk_score >= 60:
            explanation = (
                f"HIGH RISK WARNING: High probability of fraudulent intent detected. "
                f"The content displays red flags including {', '.join(unique_indicators[:2])}."
            )
            recommendation = (
                "⚠️ Exercise extreme caution. Do not click unverified links or provide personal information. "
                "Verify the claim directly through the official website or customer care number of the institution."
            )
        elif final_risk_score >= 30:
            explanation = (
                f"MODERATE RISK: Message contains mildly suspicious indicators that require verification."
            )
            recommendation = (
                "⚡ Be cautious before responding. Double-check sender identity and domain legitimacy."
            )
        else:
            explanation = "No malicious patterns found. The message appears safe."
            recommendation = "✅ Content appears legitimate. Standard digital safety practices apply."

        return {
            "input_type": input_type,
            "input_text": text,
            "risk_score": final_risk_score,
            "risk_level": risk_level,
            "scam_type": scam_type,
            "confidence": min(confidence, 99.0),
            "extracted_url": extracted_url,
            "result": {
                "indicators": unique_indicators,
                "explanation": explanation,
                "recommendation": recommendation,
                "highlighted_phrases": nlp_res["highlighted_phrases"]
            },
            "url_details": url_details
        }

    def predict_url(self, url: str) -> Dict[str, Any]:
        url_details = analyze_url(url)
        risk_score = url_details["risk_score"]
        
        if risk_score < 30:
            risk_level = "LOW"
            scam_type = "Safe / Low Risk Domain"
            confidence = 94.0
        elif risk_score < 60:
            risk_level = "MEDIUM"
            scam_type = "Suspicious Domain"
            confidence = 89.0
        elif risk_score < 80:
            risk_level = "HIGH"
            scam_type = "Phishing / Malicious Domain"
            confidence = 94.5
        else:
            risk_level = "CRITICAL"
            scam_type = "Malware / Malicious Link"
            confidence = 97.0

        indicators = url_details["suspicious_indicators"] or ["Domain structure analyzed successfully"]
        
        if risk_score >= 60:
            explanation = f"Domain '{url_details['domain']}' exhibits high-risk indicators associated with fake or malicious websites."
            recommendation = "🚨 DO NOT VISIT THIS URL. Close your browser tab and do not enter credentials."
        elif risk_score >= 30:
            explanation = f"Domain '{url_details['domain']}' has unverified security credentials or suspicious formatting."
            recommendation = "⚠️ Proceed with caution. Verify the official web address before entering any data."
        else:
            explanation = f"Domain '{url_details['domain']}' appears safe with clean security indicators."
            recommendation = "✅ Domain appears legitimate."

        return {
            "input_type": "url",
            "input_text": url,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "scam_type": scam_type,
            "confidence": confidence,
            "extracted_url": url,
            "result": {
                "indicators": indicators,
                "explanation": explanation,
                "recommendation": recommendation,
                "highlighted_phrases": [url_details["domain"]]
            },
            "url_details": url_details
        }

    def predict_image(self, image_bytes: bytes) -> Dict[str, Any]:
        ocr_result = extract_text_from_image(image_bytes)
        ocr_text = ocr_result["text"]
        
        res = self.predict_text(ocr_text, input_type="image")
        if ocr_result.get("error") and ocr_result.get("method") == "demo_ocr_fallback":
            res["result"]["indicators"].insert(0, ocr_result["error"])
            
        return res

detector = ScamDetector()
