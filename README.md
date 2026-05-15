# AyurCure 🌿

**Integrated Ayurvedic Healthcare & E-Commerce Platform**

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

AyurCure is a full-stack web application designed to bridge traditional Ayurvedic practices with modern digital convenience. The platform features a **personalized Prakriti Assessment**, a **Virtual Consultation module** for BAMS/MD doctors, and a comprehensive **E-Commerce store** for Ayurvedic products.

---

## 🚀 Project Architecture

The backend is built using **Node.js** and **PostgreSQL**, following a strict **Model-View-Controller (MVC)** pattern to ensure scalability and security.

- **Database**: PostgreSQL (Relational) with UUID identifiers and ENUM types for strict data integrity
- **Authentication**: JWT-based stateless sessions with 5-minute OTP verification for local registration
- **Security**: Password and OTP hashing using bcrypt

---

## 📁 Folder Structure

```
ayurcure/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection pool (pg)
│   │   ├── controllers/    # Request handling logic (Auth, Patient, Doctor)
│   │   ├── models/         # SQL Data Access Layer (PostgreSQL)
│   │   ├── routes/         # Express endpoint definitions
│   │   ├── services/       # Business logic (Payments, Notifications)
│   │   ├── middlewares/    # JWT & RBAC (Role-Based Access Control)
│   │   └── utils/          # PDF Generation, Cron Jobs, Logger
│   ├── database/
│   │   └── migrations/     # 01_init_schema.sql
│   └── .env                # Environment variables (Ignored by Git)
└── frontend/               # React Application (To be initialized)
```

---

## 🛠️ Local Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### 1. Database Setup

Ensure PostgreSQL is installed and running. Create a database named `ayurcure_db`.

Execute the migration script to build the schema:

```bash
cd backend
node database/migrate.js
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory with the following keys:

```env
PORT=5000
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=ayurcure_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_super_secret_key
GOOGLE_CLIENT_ID=your_google_id
```

### 3. Installation

Install dependencies:

```bash
npm install
```

### 4. Running the Server

Start the development server:

```bash
npm run dev
```

The server should now be running on `http://localhost:5000`.

---

## 🔑 Key Functional Requirements

### User Module
- Secure sign-up/SSO (Google OAuth)
- Prakriti Assessment (Vata/Pitta/Kapha)
- Personalized health trackers

### Doctor Module
- Verification workflow for BAMS/MD practitioners
- Appointment management
- Digital prescriptions

### Consultation
- Video/Audio/Chat modes
- Pre-consultation symptom forms
- Consultation history

### E-Commerce
- Product catalog filtered by Prakriti suitability
- Prescription-linked recommendations
- Secure payment integration

### Admin
- User management
- Doctor verification
- Financial payout analytics

---

## 🤝 Collaborative Workflow

### Branching Strategy
- **Never push directly to `main`**
- Use feature branches: `feature/feature-name`
- Bug fixes: `bugfix/bug-description`
- Hotfixes: `hotfix/issue-description`

### Commit Guidelines
Use descriptive commit messages following conventional commits:

```
feat: add otp resend logic
fix: resolve jwt token expiration issue
docs: update README with setup instructions
refactor: optimize database queries
```

### Pull Requests
- Open a Pull Request for code review before merging into `main`
- Ensure all tests pass
- Request at least one reviewer
- Resolve all comments before merging

---

**Built with ❤️ for Ayurvedic Healthcare**
