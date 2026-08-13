# QuickCheck AI — Fraud Certificate Verification Platform

**QuickCheck AI** is a production-ready, full-stack SaaS application designed to detect fraudulent certificates and verify credential authenticity using multi-stage AI document analysis (OCR extraction, PDF/Exif metadata inspection, Error Level Analysis (ELA) forensics, and cryptographic database matching).

---

## 🌟 Key Capabilities

1. **Multi-Stage AI Verification Pipeline**:
   - **OCR Text Extraction**: Extracts Certificate ID, Holder Name, Issuer, and Issue Date from PDFs or images via Tesseract OCR and string parsing.
   - **Metadata Analysis**: Detects editing software footprints (Adobe Photoshop, Canva, GIMP, Acrobat) and creation vs modification timestamp discrepancies.
   - **Image Forensics (ELA)**: Computes Error Level Analysis pixel re-compression variance to spot spliced text, altered names, and pasted logos.
   - **Cryptographic Master Hash Matching**: Verifies uploaded document SHA-256 signatures against official organization records.
   - **Weighted Risk Scoring Engine**: Produces confidence score (0–100%) categorized into:
     - **90–100% → Original** (Green Seal)
     - **60–89% → Suspicious** (Yellow Flag — sent to Org Review Inbox)
     - **0–59% → Fake** (Red Alert)

2. **Role-Based Workflows**:
   - **End User**: Upload PDF/JPG/PNG, inspect live AI scanning progress, view detailed result gauge, download PDF audit reports, and share public QR codes.
   - **Organization**: Register official master certificate records, view issued credentials, review AI-flagged suspicious cases manually, and approve/reject credentials.
   - **Platform Admin**: Monitor system analytics, original vs. fake pie charts, daily verifications timeline, organization approvals, and security audit logs.

3. **Public Verification & QR Sharing**:
   - Standalone public verification links (`/verify/public/:id`) and downloadable QR code badges.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, `qrcode.react`, `jspdf`, `canvas-confetti`.
- **Backend API**: Node.js + Express.js, JWT Authentication, Multer file upload handler, persistent file-backed store (`db_store.json`), optional Supabase SDK.
- **AI Microservice**: Python FastAPI, Uvicorn, Pillow, NumPy, OpenCV, PyTesseract.
- **Embedded JS Fallback Engine**: Built-in fallback on Node.js Express backend ensuring 100% uptime even if Python microservice is offline.
- **Containerization**: Docker & `docker-compose.yml`.

---

## 📁 Repository Folder Structure

```
QuickCheck/
├── client/                      # React + Vite Frontend (Tailwind CSS, Framer Motion)
│   ├── src/
│   │   ├── components/          # Navbar, Footer, StatusBadge, ScoreGauge, QRModal, ReportPDFModal
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── pages/               # LandingPage, UserDashboard, UploadVerifyPage, VerifyResultPage, HistoryPage, OrgDashboard, OrgUploadCertPage, PublicVerifyPage, AdminDashboard
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                      # Express.js REST API Backend
│   ├── src/
│   │   ├── db/                  # Persistent store & seed dataset
│   │   ├── middleware/          # JWT auth & role guards
│   │   ├── routes/              # Auth, Certificates, Verify, Org, Admin, User routes
│   │   ├── services/            # AI microservice integration & JS forensic fallback
│   │   └── index.js
│   ├── uploads/                 # Uploaded static documents
│   └── package.json
├── ai_service/                  # Python FastAPI Microservice
│   ├── app/                     # Metadata, ELA Forensics, OCR, Risk Scorer modules
│   └── requirements.txt
├── sample_data/                 # Sample certificate test dataset & guide
├── docker-compose.yml           # Full containerized stack orchestration
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ and **npm**
- **Python**: 3.9+ (Optional for FastAPI AI microservice; Node fallback executes automatically if absent)

---

### Step 1: Start Express API Backend Server

```bash
cd server
npm install
npm run dev
```

*Backend server will start at `http://localhost:5000`*

---

### Step 2: Start React Frontend Client

In a new terminal window:

```bash
cd client
npm install
npm run dev
```

*Client web app will start at `http://localhost:3000`*

---

### Step 3: (Optional) Start Python FastAPI AI Microservice

In a third terminal window:

```bash
cd ai_service
python -m venv venv
# On Windows: venv\Scripts\activate | On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

*Python AI Microservice will run at `http://localhost:8000`*

---

## 🔑 One-Click Preset Demo Credentials

Directly available on the **Sign In** screen:

| Role | Email | Password | Dashboard Route |
|---|---|---|---|
| **End User** | `user@quickcheck.ai` | `password123` | `/dashboard` |
| **Organization Admin** | `org@stanford.edu` | `password123` | `/org/dashboard` |
| **Platform Admin** | `admin@quickcheck.ai` | `password123` | `/admin/dashboard` |

---

## ⚡ API Endpoints Reference

### Authentication
- `POST /api/auth/register`: Create user or organization account.
- `POST /api/auth/login`: Authenticate and obtain JWT token.
- `GET /api/auth/me`: Fetch current logged-in user profile.

### Document Verification & Upload
- `POST /api/certificates/upload`: Upload certificate document file.
- `POST /api/verify`: Trigger AI analysis pipeline and store result.
- `GET /api/verify/:id`: Fetch verification audit report details.
- `GET /api/public/verify/:idOrHash`: Public verification endpoint (no auth required).

### Organization Management
- `GET /api/org/certificates`: List organization's issued master certificates.
- `POST /api/org/certificates`: Register new official certificate record.
- `PATCH /api/org/certificates/:id/review`: Approve or reject suspicious verification requests.
- `GET /api/org/stats`: Fetch organization dashboard metrics.

### Platform Admin
- `GET /api/admin/stats`: System-wide verification statistics & verdict ratios.
- `GET /api/admin/orgs`: Registered partner organizations.
- `GET /api/admin/logs`: Immutable system audit logs.

---

## 🐳 Docker Deployment

To run the entire QuickCheck AI stack with Docker Compose:

```bash
docker-compose up --build
```

Access:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Python AI Service: `http://localhost:8000`
