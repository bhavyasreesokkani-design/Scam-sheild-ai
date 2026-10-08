# Scam Shield – Intelligent Digital Fraud Detection and Protection System

> **Tagline:** *Detect. Analyze. Protect.*

## Domain

**Domain 5 – AI for Cybersecurity**

[![Python](https://img.shields.io/badge/Python-3.13+-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Scam Shield** is a web-based cybersecurity platform designed to help users identify and understand potential digital scams. It analyzes suspicious messages, URLs, and image screenshots, assesses the potential risk, and provides understandable safety recommendations.

---

## 1. Problem Statement

Digital scams such as phishing SMS, fake job offers, fraudulent UPI payment requests, impersonation messages, malicious URLs, lottery scams, and fake customer-support messages can cause financial and credential-related losses.

Many users find it difficult to determine whether a message, link, or screenshot is genuine or fraudulent.

**Scam Shield** provides an easy-to-use platform that:

* Detects suspicious content across text, email-style messages, URLs, and image screenshots.
* Assesses the potential scam risk.
* Identifies suspicious indicators.
* Explains why content may be risky.
* Provides actionable safety recommendations.
* Maintains scan history for previously analyzed content.
* Supports community scam reporting and feedback.

---

## 2. Key Features

### 🛡️ Scam Scanner

Analyze suspicious SMS, WhatsApp-style messages, emails, and other text content for potential scam indicators.

### 🌐 URL & Domain Checker

Analyze URLs and identify potentially suspicious characteristics such as unusual domain structures, insecure connections, and other risk indicators.

### 🖼️ Image & Screenshot Scanner

Upload JPG, PNG, or WEBP screenshots. OCR is used to extract text from the image before analyzing the extracted content.

### 📊 Security Dashboard

View security statistics, recent scan activity, and scam-related information through a centralized dashboard.

### 📜 Scan History

View and review previously performed scans and their risk assessments.

### 🚩 Community Scam Reports

Allow users to submit and view scam-related reports and advisories.

### 📚 Scam Education

Provides educational information about common scams such as phishing, UPI scams, OTP fraud, job scams, and investment scams.

### 📞 Call Analysis Preview

Includes a future-oriented interface concept for real-time voice-call transcription and scam-risk analysis.

---

## 3. Technology Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* Axios
* Lucide Icons
* Recharts
* Custom CSS

### Backend

* Python 3.13
* FastAPI
* Pydantic
* SQLAlchemy
* Uvicorn
* PyJWT
* Passlib
* Pillow
* Pytesseract

### Analysis

* Text/NLP-based scam analysis
* URL and domain analysis
* OCR-based image text extraction

### Database

* SQLite for local development
* PostgreSQL capability through environment configuration

### Testing

* Pytest
* FastAPI TestClient
* Frontend production build testing

---

## 4. Project Structure

```text
scam-shield-ai/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── security/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── data/
├── docs/
└── README.md
```

---

## 5. System Workflow

```text
USER
  ↓
SCAM SHIELD WEB APPLICATION
  ↓
SELECT ANALYSIS TYPE
  ├── Scam Message
  ├── URL
  └── Image / Screenshot
  ↓
CONTENT ANALYSIS
  ├── Text / NLP Analysis
  ├── URL Analysis
  └── OCR + Text Analysis
  ↓
SCAM INDICATOR DETECTION
  ↓
RISK ASSESSMENT
  ↓
LOW / MEDIUM / HIGH / CRITICAL
  ↓
EXPLANATION + SAFETY RECOMMENDATION
  ↓
SCAN HISTORY / REPORTING
```

---

## 6. Quick Start Guide

### Prerequisites

* Python 3.10+
* Node.js 18+
* npm

### 1. Run the Backend API

```bash
cd backend

python -m venv venv
```

#### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

#### Start the backend

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend API will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 2. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 7. Running Tests

### Backend Tests

```bash
cd backend
python -m pytest
```

### Frontend Production Build

```bash
cd frontend
npm run build
```

A successful production build confirms that the frontend can be compiled successfully.

---

## 8. Example Scenarios

Scam Shield can be tested using realistic but safe demonstration scenarios such as:

* Banking phishing message
* Fake job offer
* Lottery/prize scam
* Suspicious payment request
* Impersonation message
* Suspicious URL
* Normal college-related message
* Safe public website URL
* Screenshot containing a suspicious message

**Important:** Never use real banking credentials, OTPs, PINs, CVVs, passwords, or private financial information during demonstrations.

---

## 9. Security & Privacy

* Do not store API keys, passwords, tokens, or other secrets in source code.
* Use environment variables for sensitive configuration.
* Do not upload real financial credentials or authentication information for testing.
* Keep local database files and secret configuration files out of GitHub.
* Use safe demonstration data for hackathon testing.
* Validate user input before processing it.
* Protect authenticated routes using appropriate authentication mechanisms.

---

## 10. Future Roadmap

* 📱 WhatsApp and Telegram bot integration
* 🧩 Browser extension for real-time URL protection
* 📞 Real-time voice-call scam analysis
* 🌍 Multilingual and Indic-language scam detection
* 🏛️ Integration with appropriate cybercrime reporting services
* 🔎 More advanced threat-intelligence and domain analysis

---

## 11. Developer

**Scam Shield** is independently designed and developed by **Bhavya Sree**, with a focus on building an accessible and practical cybersecurity solution for detecting and analyzing online scams and phishing threats.

---

## 12. License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete license terms.

