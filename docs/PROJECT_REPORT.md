# EduPulse: Student Academic Productivity & Placement Preparation Ecosystem
## Capstone Project Report — Semester 3 Full Stack Development

**Department of Computer Science & Engineering**  
**RV College of Engineering (RVCE), Bengaluru**

---

### Student Details
- **Student Name**: Vishal Ellure
- **USN**: `1RV23CS001`
- **Department**: Computer Science & Engineering
- **Semester**: 3
- **Course**: Full Stack Development (Course Code: CS301 / FSD Lab)
- **Academic Year**: 2026–2027

---

## 1. Abstract
The modern engineering educational paradigm demands that undergraduate students maintain high academic rigor—completing regular laboratory experiments, term papers, and continuous internal evaluations (CIE)—while simultaneously preparing for competitive campus recruitment drives. Conventional tools often segregate these dual responsibilities: students utilize isolated to-do list applications for coursework and separate bulletin boards or spreadsheets for placement notifications, leading to missed deadlines and disjointed preparation.

**EduPulse** is a unified, full-stack web application engineered to bridge this gap. Developed using the MERN architecture (MongoDB, Express.js, React 18, and Node.js), EduPulse provides an integrated environment where students manage course-specific academic tasks, synchronize offline LocalStorage cache with cloud databases, monitor campus recruitment drives, verify eligibility against minimum CGPA criteria in real time, and track application lifecycles from initial submission to final job offer. 

The application implements semantic HTML5, CSS3 Glassmorphism with dark/light themes, ES6+ JavaScript, React component state management with Context API, RESTful API architecture, JSON Web Token (JWT) authentication, and Mongoose object modeling with centralized error handling. EduPulse exhibits 100% compliance with the VTU/RVCE Semester 3 Full Stack Development syllabus, validated through 34 passing automated integration tests and a comprehensive Postman API test collection.

---

## 2. Problem Statement
Undergraduate engineering students face critical challenges in organizing their academic deliverables and campus placement preparation:
1. **Fragmented Workflows**: Academic assignments, laboratory experiment deadlines, and company placement notifications are maintained across disparate platforms (emails, messaging apps, spreadsheets).
2. **Eligibility Mismatches**: Students often spend significant time applying for campus drives without immediate clarity on complex eligibility criteria (e.g., minimum CGPA thresholds and eligible branches).
3. **Lack of Synchronized Persistence**: Basic web utilities either fail when internet connectivity drops or do not persist data to centralized servers, risking data loss.
4. **Administrative Overhead**: Placement coordinators lack lightweight tools to broadcast drives and monitor real-time applicant qualification distributions across academic branches.

EduPulse resolves these issues by delivering a centralized, responsive web platform featuring role-based dashboards, automated eligibility validation, offline-capable task caching, and database persistence.

---

## 3. Project Objectives
- **Demonstrate Full Stack Syllabus Mastery**: Implement every theoretical concept and practical activity from Units 1, 2, and 3 of the Semester 3 syllabus.
- **Architect a Modular MERN Application**: Establish clear separation of concerns across presentation (React 18), business logic (Node.js/Express controllers), and data storage (MongoDB/Mongoose).
- **Deliver Responsive UI/UX**: Develop an accessible, mobile-friendly interface featuring semantic HTML5, CSS custom variables, Flexbox, CSS Grid, and dual-theme glassmorphism.
- **Implement Robust Security**: Protect API endpoints using JWT authentication, bcrypt password hashing, and role-based authorization (Student vs Admin/Coordinator).
- **Ensure Quality & Reliability**: Validate system endpoints with automated integration tests, Postman API collections, and centralized error handling.
- **Enable Production Readiness**: Provide containerized Docker configurations, health check endpoints, and comprehensive academic documentation.

---

## 4. Requirements Specification

### 4.1 Functional Requirements
1. **User Authentication & Authorization**:
   - Secure student and coordinator registration, login, and profile retrieval using JWT.
   - One-click demo sign-in for seamless academic viva evaluation.
2. **Academic Task Management**:
   - Full CRUD: Create, read, update, and delete academic tasks.
   - Categorization by type (`Lab Experiment`, `Assignment`, `Exam Prep`, `Project Work`, `Personal`).
   - Priority labeling (`High`, `Medium`, `Low`) and due date tracking.
   - Instant search and multi-criteria filtering by status, category, and priority.
   - LocalStorage offline caching with one-click bulk synchronization to MongoDB.
3. **Placement Drive & Opportunity Hub**:
   - Placement drive creation and management with company name, job role, CTC (LPA), selection rounds, and drive dates.
   - Dynamic eligibility engine evaluating student CGPA and branch in real time.
   - Student application submission workflow (`Applied`, `Shortlisted`, `OA Cleared`, `Interview Scheduled`, `Offered`, `Rejected`).
   - "My Applications" real-time status tracker.
4. **Interactive Dashboard**:
   - Live aggregated metrics: Task completion percentage, pending tasks, high-priority alerts, active placement drives, and average CTC.
   - Urgent deadlines feed and upcoming drive cards.
5. **Student Profile & Portfolio Showcase**:
   - Editable academic profile capturing USN, branch, semester, CGPA, technical skills, GitHub repository, and LinkedIn URL.

### 4.2 Non-Functional Requirements
- **Performance**: Sub-100ms API response times on local MongoDB queries with indexed schema fields.
- **Usability**: Consistent glassmorphic visual language, smooth CSS transitions, and dual dark/light themes.
- **Responsiveness**: Fully responsive layout adapting from 320px mobile screens to 4K displays.
- **Reliability & Availability**: Continuous uptime with `/api/health` diagnostic endpoint and graceful offline fallback.
- **Maintainability**: Clean MVC folder structure on the backend and modular reusable components on the frontend.

---

## 5. System Architecture & Database Design

### 5.1 Architecture Diagram
```
Client Tier (Browser)
   ├── React 18 SPA (Vite Bundler)
   ├── Context Providers (AuthContext, ThemeContext)
   ├── Responsive Components & Pages
   └── Fetch API Client (Bearer Token Interceptor)
            │
            ▼ HTTP REST (JSON)
Application Tier (Express / Node.js)
   ├── CORS & Morgan Logger Middleware
   ├── JWT Auth & Role Authorization Middleware
   ├── Centralized Error Handler Middleware
   └── Route Controllers (Auth, Task, Placement, Stats, Health)
            │
            ▼ Mongoose ODM
Database Tier (MongoDB)
   ├── users Collection (Students & Coordinators)
   ├── tasks Collection (Academic Tasks)
   ├── placementdrives Collection (Hiring Drives)
   └── applications Collection (Submissions & Status)
```

### 5.2 Database Schemas
- **User Schema**: Fields for `name`, `email` (unique), `password` (hashed with salt), `usn` (unique, uppercase regex validated), `role` (`student`, `admin`), `branch`, `semester`, `cgpa`, `skills` (array of strings), `phone`, `college`, `github`, `linkedin`, `bio`.
- **Task Schema**: Fields for `user` (ref: User), `title`, `category`, `priority`, `status`, `dueDate`, `subject`, `notes`, `completedAt`. Indexed by `{ user: 1, status: 1, dueDate: 1 }`.
- **PlacementDrive Schema**: Fields for `companyName`, `role`, `ctc` (Number, LPA), `minCgpa`, `eligibleBranches` (array), `jobType`, `location`, `driveDate`, `deadline`, `selectionRounds` (array), `description`, `status`.
- **Application Schema**: Fields for `student` (ref: User), `drive` (ref: PlacementDrive), `status`, `appliedAt`, `interviewDate`, `currentRound`, `notes`. Compound unique index `{ student: 1, drive: 1 }` prevents duplicate applications.

---

## 6. Implementation Details

### 6.1 Frontend Implementation
- **Component Architecture**: Organized into reusable presentation components (`Navbar`, `Footer`, `AuthModal`) and view pages (`LandingPage`, `DashboardPage`, `TasksPage`, `PlacementsPage`, `ProfilePage`, `SyllabusMappingPage`).
- **State Management**: Implemented using React Hooks (`useState`, `useEffect`, `useContext`, `useCallback`) without unnecessary heavy external dependencies.
- **Design System**: Reused and refined color variables and glassmorphism from Phase 1 (`proj.css`), providing fluid dark and light modes, responsive cards, and clean status badges.

### 6.2 Backend Implementation
- **Node.js & Express**: Modular routing pattern with separated controller functions for clean business logic.
- **RESTful Endpoints**: Standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) returning uniform JSON envelopes `{ success: true, ... }`.
- **Centralized Error Middleware**: Intercepts Mongoose `CastError`, duplicate key `11000`, `ValidationError`, and JWT authentication errors to produce human-readable client feedback.

---

## 7. Testing & Quality Assurance
- **Automated Integration Tests**: 34 automated assertions covering health checks, authentication, task CRUD, placement eligibility, dashboard calculations, and boundary error conditions.
- **Results**: 34 passed, 0 failed.
- **Postman Collection**: Exported collection containing pre-configured requests and auto-saving authorization environment variables.

---

## 8. Limitations & Future Scope
- **Current Limitations**: Automated resume parsing is not yet integrated; notifications rely on dashboard polling rather than WebSockets.
- **Future Enhancements**:
  1. Real-time WebSocket notifications for interview slot allocations.
  2. PDF resume generator directly compiling student profile details.
  3. Integrated peer coding mock-interview scheduling.

---

## 9. Conclusion
EduPulse successfully demonstrates the complete scope of the Semester 3 Full Stack Development curriculum. By synthesizing concepts from web fundamentals, JavaScript ES6+, DOM manipulation, Express REST APIs, MongoDB Mongoose, and React 18 into a single functional, verified application, EduPulse serves as a comprehensive capstone deliverable and a practical tool for engineering students.
