# EduPulse — Student Academic Productivity & Placement Preparation Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg)](https://www.mongodb.com/)
[![Tests](https://img.shields.io/badge/Tests-34%20Passed-success.svg)](./docs/TESTING.md)

**EduPulse** is a complete, full-stack web application engineered for the **Semester 3 Full Stack Development (CS&E)** curriculum. It bridges the gap between academic task management and campus placement preparation, integrating student portfolio profiles, task trackers, company placement drives, and recruiter dashboards into a single responsive, production-ready MERN platform.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Syllabus & Curriculum Mapping](#-syllabus--curriculum-mapping)
- [Architecture & Technology Stack](#-architecture--technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Quick Start](#-installation--quick-start)
- [Automated Testing & Quality Assurance](#-automated-testing--quality-assurance)
- [Postman API Collection](#-postman-api-collection)
- [Git & Version Control Workflow](#-git--version-control-workflow)
- [Docker & Production Deployment](#-docker--production-deployment)
- [Documentation Index](#-documentation-index)
- [Student & Academic Attribution](#-student--academic-attribution)

---

## 🌟 Project Overview
Engineering undergraduates frequently juggle heavy course workloads, lab experiments, CIE tests, and upcoming campus placement drives. Existing tools fragment these workflows across generic to-do apps, spreadsheets, and departmental bulletin boards.

**EduPulse solves this by providing:**
1. **Academic Productivity Hub**: Tracks lab experiments, assignments, project demos, and exams with priority badges, deadlines, and LocalStorage-to-MongoDB synchronization.
2. **Placement & Hiring Portal**: Features top campus recruitment drives (Google, Microsoft, Amazon, Cisco, etc.), automated CGPA/branch eligibility verification, and application status workflows.
3. **Student Portfolio Showcase**: Highlights academic records, cumulative CGPA, verified skills, GitHub projects, and resume credentials.
4. **Interactive Dashboard**: Delivers real-time analytics including task completion percentages, upcoming deadlines, average CTC statistics, and interview alerts.

---

## 🚀 Key Features

### 1. Responsive Modern User Interface
- **Semantic HTML5 & CSS3**: Glassmorphism aesthetic with CSS custom variables, Flexbox, and CSS Grid.
- **Dual Theme Support**: Instant toggle between Dark Mode and Light Mode with persistent local storage.
- **Mobile-First Responsive Layout**: Collapsible hamburger navigation drawer and responsive cards tailored for mobile, tablet, and desktop screens.

### 2. Academic Task Manager (Unit 2 + Unit 3)
- **Full CRUD Operations**: Create, read, update, and delete academic tasks with confirmation dialogs.
- **Multi-Filter & Instant Search**: Filter by Status (`Pending`, `In Progress`, `Completed`), Category (`Lab Experiment`, `Assignment`, `Exam Prep`, `Project Work`), or Priority (`High`, `Medium`, `Low`).
- **Offline Cache & Cloud Sync**: Seamlessly falls back to `localStorage` when offline and synchronizes cached tasks to cloud MongoDB upon reconnecting.

### 3. Placement Drive & Opportunity Tracker (Capstone & Unit 3)
- **Campus Hiring Drives**: Detailed company listings with role titles, CTC packages (LPA), selection rounds, and drive dates.
- **Eligibility Engine**: Verifies applicant CGPA and branch in real time before allowing submissions.
- **Application Workflow**: Lifecycle tracking from `Applied` → `Shortlisted` → `OA Cleared` → `Interview Scheduled` → `Offered`.

### 4. Secure Authentication & Role-Based Access
- **JWT & bcryptjs**: Encrypted password storage and token-based API authentication.
- **Role Permissions**: Differentiates between Student applicants and Placement Coordinators/Administrators.
- **One-Click Fast Demo Login**: Instant evaluation buttons for both student and admin roles without typing credentials.

---

## 🎓 Syllabus & Curriculum Mapping

EduPulse directly addresses and demonstrates all units in the **Department of Computer Science & Engineering Semester 3 Full Stack Development Scheme**:

| Syllabus Unit | Core Topics | EduPulse Concrete Implementation | Verification Source |
|---|---|---|---|
| **Unit 1** | HTML5, CSS3, Flexbox, Grid, Responsive Design, Git Basics | Semantic markup, dual-theme glassmorphic design system, mobile navbar | `client/index.html`, `client/src/index.css` |
| **Unit 2** | JavaScript ES6+, DOM Manipulation, JSON, Form Validation, LocalStorage | Interactive task manager, regex checks, instant search, dynamic cards | `client/src/pages/TasksPage.jsx`, `client/src/services/api.js` |
| **Unit 3** | Node.js, Express.js, REST API CRUD, MongoDB Mongoose, Postman | Express REST routes, Mongoose schemas, JWT auth, 34 automated API tests | `server/server.js`, `server/models/`, `server/controllers/` |
| **Capstone** | End-to-End System, Testing, Deployment, Documentation, Viva | Full MERN integration, Dockerfile, comprehensive academic reports | `Dockerfile`, `docs/PROJECT_REPORT.md` |

---

## 🏗️ Architecture & Technology Stack

```
EduPulse Full Stack Architecture:
┌────────────────────────────────────────────────────────┐
│               React 18 Frontend (Vite)                 │
│  - Context API (Auth, Theme)   - Semantic HTML5 / CSS3 │
│  - Custom Glassmorphism UI    - Fetch API + JWT Auth   │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON Requests
                           ▼
┌────────────────────────────────────────────────────────┐
│             Node.js & Express REST API Server          │
│  - Modular Controllers & Routes  - JWT Auth Middleware  │
│  - Centralized Error Handling   - Morgan Logger & CORS │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose ODM Driver
                           ▼
┌────────────────────────────────────────────────────────┐
│                 MongoDB NoSQL Database                 │
│  - Users (Students/Admin)       - Placement Drives     │
│  - Academic Tasks              - Student Applications │
└────────────────────────────────────────────────────────┘
```

- **Frontend**: React 18, Vite, Lucide Icons, Custom CSS Variables & Glassmorphism.
- **Backend**: Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `morgan`.
- **Database**: MongoDB (Local `127.0.0.1:27017` or MongoDB Atlas), Mongoose 7.x.
- **Testing**: Node.js Automated Integration Test Suite (34 assertions), Postman v2.1.0 Collection.
- **DevOps**: Docker, Docker Compose, Git Feature-Branch Workflow.

---

## 📁 Project Structure

```
skill_lab_final/
├── client/                           # React 18 Frontend Application
│   ├── index.html                    # Semantic HTML5 Entry
│   ├── vite.config.js                # Vite Bundler & API Proxy Config
│   ├── package.json                  # Frontend Dependencies
│   └── src/
│       ├── main.jsx                  # React Root Render
│       ├── App.jsx                   # Main Router & Layout View
│       ├── index.css                 # Glassmorphic Dual-Theme Design System
│       ├── context/
│       │   ├── AuthContext.jsx       # Global Authentication & Token State
│       │   └── ThemeContext.jsx      # Dark/Light Mode Theme Provider
│       ├── components/
│       │   ├── Navbar.jsx            # Responsive Header & Navigation
│       │   ├── Footer.jsx            # Academic Project Attribution Footer
│       │   └── AuthModal.jsx         # Sign In, Register & Demo Login Modal
│       ├── pages/
│       │   ├── LandingPage.jsx       # Hero, Features & Overview
│       │   ├── DashboardPage.jsx     # Aggregated Metrics & Live Counters
│       │   ├── TasksPage.jsx         # Academic Tasks CRUD & LocalStorage Sync
│       │   ├── PlacementsPage.jsx    # Placement Drives & Eligibility Portal
│       │   ├── ProfilePage.jsx       # Student Profile & Portfolio Editor
│       │   └── SyllabusMappingPage.jsx # Academic Compliance & Audit Matrix
│       └── services/
│           └── api.js                # Centralized Fetch Client with JWT Headers
├── server/                           # Node.js & Express REST Backend
│   ├── package.json                  # Backend Dependencies
│   ├── server.js                     # Express Application Entry & Static Server
│   ├── .env.example                  # Environment Variables Template
│   ├── config/
│   │   └── db.js                     # Mongoose MongoDB Connection
│   ├── models/
│   │   ├── User.js                   # Student & Coordinator Mongoose Schema
│   │   ├── Task.js                   # Academic Task Mongoose Schema
│   │   ├── PlacementDrive.js         # Campus Hiring Drive Schema
│   │   └── Application.js            # Student Placement Application Schema
│   ├── controllers/
│   │   ├── authController.js         # Registration, Login, Profile Updates
│   │   ├── taskController.js         # Tasks CRUD, Filtering & Sync
│   │   ├── placementController.js    # Drives CRUD, Eligibility & Apply
│   │   └── statsController.js        # Dashboard Aggregation Metrics
│   ├── routes/
│   │   ├── authRoutes.js             # /api/auth Endpoints
│   │   ├── taskRoutes.js             # /api/tasks Endpoints
│   │   ├── placementRoutes.js        # /api/placements Endpoints
│   │   ├── statsRoutes.js            # /api/stats Endpoints
│   │   └── healthRoutes.js           # /api/health Diagnostic Endpoint
│   ├── middleware/
│   │   ├── auth.js                   # JWT Verification & Role Authorization
│   │   └── errorHandler.js           # Centralized JSON Error Handler
│   ├── utils/
│   │   └── seed.js                   # Realistic Database Seeding Script
│   └── tests/
│       └── run-tests.js              # 34-Test Automated Integration Suite
├── postman/
│   ├── EduPulse_API.postman_collection.json # Complete API Test Export
│   └── EduPulse_Environment.postman_environment.json
├── docs/                             # Full Academic Documentation Deliverables
│   ├── PROJECT_REPORT.md             # Formal Capstone Engineering Report
│   ├── API_DOCUMENTATION.md          # REST API Specification & Status Codes
│   ├── TESTING.md                    # Test Plan & Execution Proof
│   ├── GIT_WORKFLOW.md               # Version Control & Branching Workflow
│   ├── DEPLOYMENT.md                 # Deployment & Hosting Guide
│   ├── VIVA_PREPARATION.md           # Examiner Questions & Model Answers
│   ├── DEMO_SCRIPT.md                # 5-10 Minute Presentation Script
│   ├── REQUIREMENTS_AND_USER_STORIES.md
│   └── ARCHITECTURE.md               # Mermaid Architecture & ER Diagrams
├── Dockerfile                        # Multi-stage Container Build
├── docker-compose.yml                # Multi-container App & MongoDB Service
├── .gitignore
├── package.json                      # Unified Monorepo Execution Scripts
└── README.md
```

---

## ⚡ Installation & Quick Start

### Prerequisites
- **Node.js**: v18.x or later installed
- **MongoDB**: MongoDB Community Server running locally on port `27017` (or MongoDB Atlas connection URI)
- **Git**: Installed and configured

### 1. Clone & Setup Workspace
```bash
cd /home/vishal/skill_lab_final
```

### 2. Install All Dependencies
Install dependencies for both server and client with a single command:
```bash
npm run install-all
```

### 3. Seed Database with Realistic Academic Data
Seed the MongoDB database with student accounts, placement drives, and academic tasks:
```bash
npm run seed
```

### 4. Run Automated Test Suite
Verify that all 34 backend API endpoints and security checks pass:
```bash
npm test
```

### 5. Build & Launch Application
Build the React production frontend and start the combined production server:
```bash
npm run build
npm start
```

Access the live application in your browser:
- **Web Application**: [http://localhost:5000](http://localhost:5000)
- **Health Check API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **REST Endpoints Guide**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🧪 Automated Testing & Quality Assurance

EduPulse includes an automated API integration test runner (`server/tests/run-tests.js`) that verifies:
- Health check and database connectivity diagnostics.
- JWT authentication, password hashing, invalid credential handling, and token verification.
- Full CRUD lifecycle for academic tasks.
- Placement drive listing, retrieval, and applicant eligibility rules.
- Aggregated dashboard statistics calculations.
- Boundary condition validation (e.g., malformed ObjectIds, missing required fields).

**Test Execution Results:**
```
========================================
   EduPulse Automated API Test Suite   
========================================

[Group 1: Health & System Diagnostics]
  ✓ PASS: GET /api/health returns 200 OK
  ✓ PASS: Database status is OK
  ✓ PASS: Service identity matches

[Group 2: Authentication & Authorization]
  ✓ PASS: POST /api/auth/demo-login returns 200
  ✓ PASS: JWT token returned on demo login
  ✓ PASS: POST /api/auth/login with valid credentials returns 200
  ✓ PASS: User profile populated
  ✓ PASS: POST /api/auth/login with wrong password returns 401 Unauthorized
  ✓ PASS: GET /api/auth/me returns 200 with Bearer token
  ✓ PASS: Current user USN matches
  ✓ PASS: GET /api/auth/me without token returns 401

[Group 3: Academic Task Management CRUD]
  ✓ PASS: GET /api/tasks returns 200
  ✓ PASS: Returns array of tasks
  ✓ PASS: POST /api/tasks returns 201 Created
  ✓ PASS: Created task title matches
  ✓ PASS: GET /api/tasks/:id returns 200
  ✓ PASS: Initial task status is Pending
  ✓ PASS: PATCH /api/tasks/:id/status returns 200
  ✓ PASS: Task status updated to Completed
  ✓ PASS: GET /api/tasks?status=Completed returns 200
  ✓ PASS: Filtered results contain only Completed tasks
  ✓ PASS: DELETE /api/tasks/:id returns 200 OK
  ✓ PASS: GET deleted task returns 404 Not Found

[Group 4: Placement Drives & Applications]
  ✓ PASS: GET /api/placements returns 200
  ✓ PASS: Drives list is populated
  ✓ PASS: GET /api/placements/:id returns 200
  ✓ PASS: Drive details match
  ✓ PASS: GET /api/placements/my/applications returns 200
  ✓ PASS: Returns student applications

[Group 5: Dashboard Analytics & Statistics]
  ✓ PASS: GET /api/stats/dashboard returns 200
  ✓ PASS: Academic completion rate calculated
  ✓ PASS: Placement total drives counted

[Group 6: Robust Error Handling & Boundaries]
  ✓ PASS: Invalid ObjectId handled with 404
  ✓ PASS: Missing required fields returns 400 Validation Error

========================================
  Tests Completed: 34 | Passed: 34 | Failed: 0
========================================
```

For complete test matrix documentation, see [docs/TESTING.md](./docs/TESTING.md).

---

## 📮 Postman API Collection
The complete Postman collection and environment files are available under `postman/`:
- `postman/EduPulse_API.postman_collection.json`
- `postman/EduPulse_Environment.postman_environment.json`

Import these files into Postman to test all endpoints interactively with pre-configured request bodies and auto-saving JWT environment scripts.

---

## 🚢 Docker & Production Deployment

### Run via Docker Compose
```bash
docker-compose up --build -d
```
This spins up:
1. `app`: Multi-stage built Node.js & React container on port `5000`.
2. `mongodb`: Persistent MongoDB container on port `27017`.

For detailed cloud deployment steps (Render, Vercel, MongoDB Atlas), see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

---

## 📚 Documentation Index

The `docs/` folder contains the complete set of academic deliverables required for the Semester 3 evaluation:

1. [docs/PROJECT_REPORT.md](./docs/PROJECT_REPORT.md) — Comprehensive technical capstone report.
2. [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) — REST API endpoint schemas and status codes.
3. [docs/TESTING.md](./docs/TESTING.md) — Test cases, automation results, and boundary analysis.
4. [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) — Version control branching and PR documentation.
5. [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) — Deployment manual and production guide.
6. [docs/VIVA_PREPARATION.md](./docs/VIVA_PREPARATION.md) — Examiner viva questions and model answers.
7. [docs/DEMO_SCRIPT.md](./docs/DEMO_SCRIPT.md) — 5–10 minute demonstration walkthrough script.
8. [docs/REQUIREMENTS_AND_USER_STORIES.md](./docs/REQUIREMENTS_AND_USER_STORIES.md) — Requirements and user stories.
9. [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Mermaid architecture, component, and ER diagrams.

---

## 👨‍💻 Student & Academic Attribution

- **Student Developer**: Vishal Ellure
- **USN**: `1RV23CS001`
- **Department**: Computer Science & Engineering
- **Institution**: RV College of Engineering (RVCE), Bengaluru
- **Course**: Full Stack Development (Semester 3)
- **GitHub**: [github.com/ellurecodes](https://github.com/ellurecodes)
- **Email**: vishal797577@gmail.com
