import re
import math
from urllib.parse import urlparse
from typing import Dict, Any, List

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".work", ".click",
    ".buzz", ".cn", ".pw", ".cc", ".site", ".online", ".tech", ".website", ".fun", ".info", ".icu"
]

URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly", "rb.gy", "shorturl.at", "cutt.ly"
]

BRAND_KEYWORDS = [
    "sbi", "rbi", "hdfc", "icici", "axis", "paytm", "gpay", "phonepe", "amazon", "flipkart",
    "apple", "google", "microsoft", "netflix", "paypal", "fedex", "dhl", "whatsapp", "facebook", "instagram"
]

LEGITIMATE_DOMAINS = [
    "amazon.com", "amazon.in", "google.com", "microsoft.com", "apple.com", "paypal.com",
    "sbi.co.in", "rbi.org.in", "hdfcbank.com", "icicibank.com", "paytm.com", "phonepe.com",
    "flipkart.com", "netflix.com", "fedex.com", "dhl.com", "whatsapp.com", "facebook.com"
]

def calculate_entropy(text: str) -> float:
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in set(text)]
    return -sum(p * math.log2(p) for p in prob)

def extract_urls(text: str) -> List[str]:
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+|[a-zA-Z0-9-]+\.(?:xyz|top|tk|com|net|org|info|co|in|site|online)[^\s<>"]*'
    return re.findall(url_pattern, text)

def analyze_url(url_string: str) -> Dict[str, Any]:
    url = url_string.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        parsed_url = urlparse("http://" + url)
    else:
        parsed_url = urlparse(url)

    domain = parsed_url.netloc.split(":")[0].lower() if parsed_url.netloc else parsed_url.path.split("/")[0].lower()
    path = parsed_url.path.lower()
    
    indicators = []
    risk_score = 0.0

    # 1. HTTPS Check
    has_https = url.startswith("https://")
    if not has_https:
        indicators.append("Uses unencrypted HTTP protocol (No HTTPS)")
        risk_score += 15

    # 2. IP Address in Hostname
    ip_pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
    if re.match(ip_pattern, domain):
        indicators.append("URL uses raw IP address instead of domain name")
        risk_score += 35

    # 3. URL Shorteners
    if any(shortener in domain for shortener in URL_SHORTENERS):
        indicators.append("Uses URL shortener which masks actual destination")
        risk_score += 25

    # 4. Known Risky TLDs
    if any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
        indicators.append(f"Domain uses high-risk TLD associated with scams")
        risk_score += 30

    # 5. Brand Impersonation / Typosquatting
    is_legit = any(domain == legit or domain.endswith("." + legit) for legit in LEGITIMATE_DOMAINS)
    if not is_legit:
        for brand in BRAND_KEYWORDS:
            if brand in domain or brand in path:
                indicators.append(f"Possible brand spoofing targeting '{brand.upper()}'")
                risk_score += 35
                break

    # 6. Excessive subdomains or hyphens
    subdomains = domain.split(".")
    if len(subdomains) > 3:
        indicators.append("Excessive subdomains detected (phishing pattern)")
        risk_score += 20

    if domain.count("-") >= 2:
        indicators.append("Multiple hyphens in domain name (typosquatting indicator)")
        risk_score += 15

    # 7. Suspicious characters (@ or encoded symbols)
    if "@" in url:
        indicators.append("URL contains '@' symbol, often used for credential redirection")
        risk_score += 40

    # 8. URL Length and Entropy
    if len(url) > 75:
        indicators.append("Unusually long URL (>75 chars)")
        risk_score += 10

    entropy = calculate_entropy(domain)
    if entropy > 4.2:
        indicators.append("High domain randomness / entropy (algorithmic domain)")
        risk_score += 15

    # Final Reputation Tag
    final_score = min(round(risk_score, 1), 100.0)
    if is_legit and len(indicators) == 0:
        reputation = "Verified Legitimate Domain"
        final_score = 5.0
    elif final_score >= 70:
        reputation = "High-Risk Malicious/Phishing Domain"
    elif final_score >= 35:
        reputation = "Suspicious Domain"
    else:
        reputation = "Neutral / Low Risk Domain"

    return {
        "url": url_string,
        "domain": domain or url_string,
        "https_status": has_https,
        "reputation": reputation,
        "risk_score": final_score,
        "suspicious_indicators": indicators
    }
