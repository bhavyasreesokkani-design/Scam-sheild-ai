# Scam Shield AI – API Reference Documentation

Base URL: `http://127.0.0.1:8000/api`

---

## 1. Health Endpoint

### `GET /health`
Returns system and database connection status.

**Response (200 OK):**
```json
{
  "status": "online",
  "app": "Scam Shield AI",
  "version": "1.0.0",
  "database": "connected"
}
```

---

## 2. Authentication Endpoints

### `POST /auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

### `POST /auth/login`
Authenticate existing user and retrieve JWT token.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

---

## 3. Scam Detection Endpoints

### `POST /scan/text`
Scan text message or SMS content.

**Request Body:**
```json
{
  "text": "URGENT! Your bank account will be locked. Click http://sbi-login.xyz immediately."
}
```

### `POST /scan/email`
Scan email message content.

**Request Body:**
```json
{
  "subject": "Account Security Notice",
  "body": "Your account has been restricted. Verify your credentials.",
  "sender": "support@bank-update.xyz"
}
```

### `POST /scan/url`
Analyze domain reputation and URL safety.

**Request Body:**
```json
{
  "url": "http://sbi-kyc-verify-update.xyz/login"
}
```

### `POST /scan/image`
Upload screenshot image (JPG, PNG, WEBP) for OCR text analysis.

**Form Data:** `file` (multipart/form-data)

---

## 4. History, Reports & Dashboard

### `GET /scans`
Retrieve historical scan audit logs.

### `GET /dashboard`
Retrieve real-time metrics, risk distribution, category breakdown, and recent feeds.

### `POST /reports`
Submit community scam report.

### `POST /feedback`
Log user feedback (`Correct` / `Incorrect`) for model fine-tuning.
