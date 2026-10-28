# EduPulse Requirements Specification & User Stories

## 1. Stakeholder Personas

### Persona 1: Vishal Ellure (Engineering Undergraduate Student)
- **Role**: 3rd Semester Computer Science Student at RVCE.
- **Goals**: Stay on top of lab assignments and CIE exam prep, monitor campus recruitment drives, verify eligibility criteria, and submit applications on time.
- **Frustrations**: Lost deadlines due to multiple WhatsApp groups and confusing CGPA criteria across various recruitment PDFs.

### Persona 2: Placement Coordinator / Department Admin
- **Role**: Placement and Training Officer.
- **Goals**: Broadcast upcoming recruitment drives with accurate eligibility thresholds, monitor applicant counts, and update interview rounds and candidate statuses.
- **Frustrations**: Receiving applications from ineligible candidates and dealing with manual spreadsheet data entry.

---

## 2. User Stories & Acceptance Criteria

### Epics Overview
- **Epic 1**: Authentication, Profile & Identity
- **Epic 2**: Academic Task Productivity & LocalStorage Sync
- **Epic 3**: Placement Drives, Eligibility & Applications
- **Epic 4**: Analytics Dashboard & Diagnostics

---

### Epic 1: Authentication, Profile & Identity

#### US-1.1: Student Registration
- **As a** student,
- **I want to** register an account with my name, email, USN, branch, semester, and CGPA,
- **So that** I have a personalized profile with automated eligibility validation.
- **Acceptance Criteria**:
  - Email and USN must be unique in the system.
  - Password must be at least 6 characters and hashed with bcrypt.
  - Generates and returns a JWT Bearer token upon successful creation.

#### US-1.2: One-Click Demo Login
- **As an** academic evaluator or student in viva,
- **I want to** click a single demo login button for student or admin roles,
- **So that** I can explore the platform without typing credentials.
- **Acceptance Criteria**:
  - Provides instant access to pre-seeded Student and Admin accounts.
  - Auto-populates all authentication states and navigates directly to the dashboard.

#### US-1.3: Profile Editing & Portfolio Links
- **As a** student,
- **I want to** update my CGPA, technical skills list, phone, and GitHub/LinkedIn links,
- **So that** recruiters and coordinators see accurate academic credentials.
- **Acceptance Criteria**:
  - Updates persist immediately in MongoDB via `PUT /api/auth/profile`.
  - Skills are entered as comma-separated tags and rendered as interactive chips.

---

### Epic 2: Academic Task Productivity & LocalStorage Sync

#### US-2.1: Task Creation & Categorization
- **As a** student,
- **I want to** create tasks specifying title, subject, category, priority, and due date,
- **So that** I can organize my academic deadlines.
- **Acceptance Criteria**:
  - Title and due date are mandatory fields.
  - Category supports `Lab Experiment`, `Assignment`, `Exam Prep`, `Project Work`, `Personal`.
  - Priority supports `High`, `Medium`, `Low`.

#### US-2.2: Multi-Criteria Filter & Instant Search
- **As a** student,
- **I want to** filter my tasks by status, category, or priority and search by title,
- **So that** I can locate specific course deliverables quickly.
- **Acceptance Criteria**:
  - Filter changes trigger immediate query recalculations.
  - Substring search operates across task title, subject, and notes.

#### US-2.3: Task Status Toggle & Deletion
- **As a** student,
- **I want to** toggle tasks between pending and completed and delete finished tasks,
- **So that** I can track my academic progress.
- **Acceptance Criteria**:
  - Clicking the task checkbox updates status and records `completedAt` timestamp.
  - Deletion prompts a confirmation dialog before permanent removal from MongoDB.

#### US-2.4: Offline LocalStorage Cache & Cloud Sync
- **As a** student with intermittent connectivity,
- **I want to** save tasks to browser LocalStorage and sync them to MongoDB when online,
- **So that** I never lose my work during lab sessions.
- **Acceptance Criteria**:
  - Works seamlessly offline with LocalStorage fallback.
  - Single-click sync button posts cached items to `/api/tasks/bulk-sync` and updates MongoDB.

---

### Epic 3: Placement Drives, Eligibility & Applications

#### US-3.1: View Company Recruitment Drives
- **As a** student,
- **I want to** view all upcoming campus hiring drives with role, CTC (LPA), and drive dates,
- **So that** I can plan my career applications.
- **Acceptance Criteria**:
  - Displays company name, role, CTC in LPA, and selection rounds.
  - Displays application deadline and countdown.

#### US-3.2: Automated CGPA Eligibility Engine
- **As a** student,
- **I want to** see whether I meet the minimum CGPA and branch requirements for each drive,
- **So that** I only apply to opportunities for which I qualify.
- **Acceptance Criteria**:
  - Compares student CGPA against company's `minCgpa`.
  - Renders green **Eligible to Apply** badge if qualified.
  - Renders red **CGPA Criteria Unmet** badge and disables apply action if unqualified.

#### US-3.3: Submit Application & Track Status
- **As a** student,
- **I want to** submit an application with an optional cover note and monitor its status,
- **So that** I know where I stand in the hiring process.
- **Acceptance Criteria**:
  - Prevents duplicate applications for the same drive.
  - Enforces deadline restrictions.
  - Tracks status through `Applied`, `Shortlisted`, `OA Cleared`, `Interview Scheduled`, `Offered`.

#### US-3.4: Post Drive (Coordinator Role)
- **As a** placement coordinator,
- **I want to** create and publish new recruitment drives,
- **So that** students are notified of upcoming company visits.
- **Acceptance Criteria**:
  - Restricts endpoint access to `admin` and `coordinator` roles.
  - Validates required company, role, package, and date inputs.

---

### Epic 4: Analytics Dashboard & Diagnostics

#### US-4.1: Live Completion Analytics
- **As a** student,
- **I want to** view my overall task completion percentage and application metrics,
- **So that** I can measure my productivity.
- **Acceptance Criteria**:
  - Calculates dynamic percentage: `(completedTasks / totalTasks) * 100`.
  - Displays count of pending, high-priority, shortlisted, and offered positions.

#### US-4.2: System Health Diagnostics
- **As an** administrator or evaluator,
- **I want to** query `/api/health` to inspect system uptime and database connection,
- **So that** I can verify operational reliability.
- **Acceptance Criteria**:
  - Returns JSON with database connection state, uptime, and service status.
