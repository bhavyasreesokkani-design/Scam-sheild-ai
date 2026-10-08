# Scam Shield AI – System Architecture Documentation

**Tagline**: *Detect. Analyze. Protect.*

---

## 1. System Overview

Scam Shield AI is an end-to-end cybersecurity intelligence platform designed to detect, classify, and explain fraudulent messages, URLs, emails, and image screenshots in real time.

```
+-----------------------------------------------------------------------+
|                            USER INTERFACE                             |
|       React + Vite Frontend (Dashboard, Scanner, URL, OCR, History)   |
+-----------------------------------------------------------------------+
                                   | HTTP REST API
                                   v
+-----------------------------------------------------------------------+
|                            FASTAPI BACKEND                            |
|    Auth (JWT) | Scan Router | Report Router | Dashboard Analytics     |
+-----------------------------------------------------------------------+
                                   |
           +-----------------------+-----------------------+
           |                                               |
           v                                               v
+-----------------------------------+     +-----------------------------------+
|        AI DETECTION ENGINE        |     |         PERSISTENCE LAYER         |
|  - NLP Analyzer (Urgency, OTPs)   |     |  SQLAlchemy ORM + SQLite / Postgres|
|  - URL Analyzer (HTTPS, TLDs)     |     |  - Users, Scans, ScanResults      |
|  - OCR Engine (Image Text)        |     |  - UrlAnalysis, Reports, Feedback |
|  - Hybrid Rule Engine (0-100 Score)|    +-----------------------------------+
|  - Explainable AI Generator       |
+-----------------------------------+
```

---

## 2. Layer Architecture

### Layer 1 – User Interface (React + Vite)
- Single Page Application (SPA) with dark cybersecurity theme.
- Components: Navbar, Footer, RiskMeter (0-100 Gauge), HighlightedText, AlertBadge, StatCard.
- Pages: Dashboard, Scam Scanner, URL Checker, Image Scanner, Scan History, Scam Reports, Education, Call Analysis Preview, Settings.

### Layer 2 – API Backend (Python FastAPI)
- Asynchronous API endpoints with Pydantic schema validation.
- JWT bearer authentication with hashed passwords (HMAC SHA-256 / Pbkdf2).
- Automatic database schema creation & seeding on initialization.

### Layer 3 – AI & Detection Engine (`ScamDetector`)
- **NLP Analyzer**: Extracts urgency keywords, financial triggers, credential/OTP requests, impersonation flags, lottery reward language, and threats.
- **URL Analyzer**: Checks HTTPS status, IP hostnames, URL shorteners, risky TLDs (`.xyz`, `.top`), typosquatting/brand spoofing.
- **OCR Engine**: Reads image files (JPG/PNG/WEBP) using `pytesseract` with fallback handling.
- **Hybrid Rule Engine**: Aggregates sub-scores with deterministic rules (e.g. OTP + Urgency = 85+ CRITICAL).
- **Explainable AI**: Generates bulleted indicators, highlighted text, and recommended security actions.

---

## 3. Database Schema

- `users`: User registration and credentials.
- `scans`: Primary scan log records.
- `scan_results`: Detailed indicators, explanation, and recommendations.
- `url_analysis`: URL domain security breakdown.
- `scam_reports`: Community reported scams and verification status.
- `feedback`: User feedback loop (`Correct` / `Incorrect`) for continuous improvement.
