# Scam Shield AI – AI-Powered Scam Detection and Real-Time Protection

> **Tagline:** *Detect. Analyze. Protect.*

[![Python](https://img.shields.io/badge/Python-3.13+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

Scam Shield AI is an end-to-end cybersecurity platform designed to protect users against phishing messages, fraudulent URLs, fake job offers, banking scams, and malicious screenshots before financial or credential loss occurs.

---

## 1. Problem Statement

Digital scams such as phishing SMS, fake job offers, fraudulent UPI payment requests, impersonation messages, malicious URLs, lottery scams, and fake customer-support numbers are increasing rapidly. Existing spam filters often block content without explaining *why* something is dangerous. 

**Scam Shield AI** provides an easy-to-use, transparent platform that:
- Detects suspicious content across Text, Email, URLs, and Image Screenshots.
- Calculates a transparent **0–100 Risk Score** (LOW, MEDIUM, HIGH, CRITICAL).
- Classifies scam types into 12 distinct categories.
- Highlights exact suspicious words and provides Explainable AI (XAI) security reasons.
- Displays actionable protective guidelines (e.g. "Do NOT share OTP").
- Integrates community threat reporting and user feedback loops.

---

## 2. Key Features

- 🛡️ **Scam Scanner (Text & Email)**: Real-time analysis of SMS, WhatsApp, and Email messages.
- 🌐 **URL & Domain Checker**: Domain structure breakdown, HTTPS verification, typosquatting, and risky TLD detection.
- 🖼️ **Image & Screenshot OCR Scanner**: Upload screenshot images (JPG, PNG, WEBP) to extract text and analyze risk.
- 📊 **Security Dashboard**: Real-time threat analytics, scam category breakdown charts, and recent activity feeds.
- 📜 **Scan History Audit Log**: Searchable and filterable history table with risk level controls.
- 🚩 **Community Scam Reports**: User-submitted scam advisories with verification status tags.
- 📚 **Scam Education Module**: Interactive guides explaining Phishing, UPI, OTP, Job, and Investment scams with golden safety rules.
- 📞 **Future-Ready Call Shield**: Interactive architecture preview for live voice call transcription and threat alert HUDs.

---

## 3. Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Lucide Icons, Recharts, Custom Dark Cybersecurity CSS Theme.
- **Backend**: Python 3.13, FastAPI, Pydantic v2, SQLAlchemy ORM, PyJWT, Passlib, Uvicorn, Pillow, Pytesseract.
- **Database**: SQLite (Zero-config default) with PostgreSQL capability via `.env` configuration.
- **Testing**: Pytest, FastAPI TestClient.

---

## 4. Project Structure

```
scam-shield-ai/
├── frontend/
│   ├── src/
│   │   ├── components/       # AlertBadge, RiskMeter, HighlightedText, StatCard, Navbar, Footer
│   │   ├── context/          # AuthContext
│   │   ├── pages/            # Dashboard, ScamScanner, UrlChecker, ImageScanner, History, Reports, Education, CallAnalysis, Settings
│   │   ├── services/         # API Axios Client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── models/           # User, Scan, ScanResult, UrlAnalysis, ScamReport, Feedback
│   │   ├── routes/           # Auth, Scan, URL, Image, Report, Feedback, Dashboard, Education
│   │   ├── schemas/          # Pydantic Request/Response models
│   │   ├── security/         # Password hashing & JWT auth handlers
│   │   ├── services/         # ScamDetector, NLP Analyzer, URL Analyzer, OCR Service, Seed Data
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/                # Test suite (test_api.py, test_detection.py, test_url.py)
│   ├── requirements.txt
│   └── .env.example
├── data/                     # Sample JSON data & processed datasets
├── docs/                     # Architecture, API, and Project description documentation
└── README.md
```

---

## 5. Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Run the Backend API

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
> The API will start at `http://127.0.0.1:8000` and automatically populate SQLite database with 50+ realistic demo records!

### 2. Run the Frontend App

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
> The frontend application will start at `http://localhost:5173`.

---

## 6. Running Tests

To run the backend test suite:

```bash
cd backend
python -m pytest
```

To run the frontend production build test:

```bash
cd frontend
npm run build
```

---

## 7. Future Roadmap & Enhancements

- 📱 **WhatsApp & Telegram Bot Integration**: Direct scam scanning inside messaging apps.
- 🧩 **Browser Extension**: Real-time URL protection for Chrome and Firefox.
- 📞 **Real-Time Voice Call Monitoring**: Cellular SIP stream speech-to-text integration.
- 🌍 **Multilingual & Indic Language Support**: Telugu, Hindi, Tamil, and Bengali scam detection.
- 🏛️ **National Cybercrime Reporting Integration**: One-click submission to government cybercrime portals.

---

## 8. License & Team

Developed with ❤️ by the **Scam Shield AI Engineering Team**.  
Licensed under the [MIT License](LICENSE).
