# EduPulse 5-to-10 Minute Academic Demonstration Script
## Step-by-Step Live Walkthrough for Examiners

**Presenter**: Vishal Ellure (`1RV23CS001`)  
**Project**: EduPulse — Student Academic Productivity & Placement Preparation Ecosystem  
**Target Duration**: 8 minutes

---

### Step 1: Introduction & Architecture Overview (Minute 0:00 – 1:30)
1. **Open the browser**: Navigate to `http://localhost:5000`.
2. **Statement to Evaluator**:
   > *"Good morning/afternoon, esteemed evaluators. My name is Vishal Ellure, USN 1RV23CS001. Today I am presenting **EduPulse**, a complete full-stack web application built using the MERN stack—MongoDB, Express.js, React 18, and Node.js. EduPulse solves a real-world dilemma faced by engineering undergraduates: integrating daily academic task tracking with campus placement preparation and eligibility validation."*
3. **Show Landing Page**:
   - Highlight the responsive glassmorphism aesthetic, dual-theme toggle (switch from Dark to Light mode and back to prove persistence), and live metric badges (100% syllabus coverage, 34/34 passing automated tests).
   - Point out the semantic HTML5 structure: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.

---

### Step 2: One-Click Demo Authentication & Role Access (Minute 1:30 – 2:30)
1. Click **Sign In** in the top navbar.
2. Demonstrate the modal:
   - Point out the **Fast Demo Access** buttons engineered specifically for rapid evaluation.
   - Click **Student Demo**: The system instantly authenticates as **Vishal Ellure** (`1RV23CS001`), displays the role badge, and redirects to the **Dashboard**.
3. **Explain to Evaluator**:
   > *"The authentication utilizes JSON Web Tokens (JWT) and bcryptjs password encryption. Passwords are never stored in plaintext, and all protected API endpoints enforce Bearer token verification."*

---

### Step 3: Analytics Dashboard & Live Metrics (Minute 2:30 – 4:00)
1. **Show Top Welcome Banner**: Displays the student's name, USN, and quick alert of pending tasks and drives.
2. **Show the 4 Summary Stat Cards**:
   - **Task Completion Rate**: Shows dynamic completion percentage with an animated visual progress bar.
   - **Pending Tasks**: Highlights high-priority items due soon.
   - **Campus Placement Drives**: Displays total active drives and average CTC package (e.g., ₹25.0 LPA).
   - **Submitted Applications**: Displays count of submitted, shortlisted, and offered applications.
3. **Show Urgent Deadlines & Featured Drives**: Demonstrates Mongoose sorting and limiting logic (`.sort({ dueDate: 1 }).limit(5)`).

---

### Step 4: Academic Task Management & LocalStorage-Cloud Sync (Minute 4:00 – 5:30)
1. Navigate to **Academic Tasks**:
   - Show the dynamic task table/card list.
   - Click the status checkbox on a task: It toggles from `Pending` to `Completed` instantly, updating the completion counter in real time.
2. **Demonstrate Multi-Criteria Search & Filtering**:
   - Type `"FSD"` in the search bar: tasks filter dynamically in real time.
   - Change Status filter to `Completed` or Priority filter to `High`.
3. **Demonstrate Task Creation (CRUD Create)**:
   - Click **Add Task**.
   - Input: Title: `"Demo Lab Evaluation"`, Category: `Lab Experiment`, Priority: `High`, Due Date: Tomorrow.
   - Click **Create Task**: The modal closes, and the newly inserted task appears at the top directly from MongoDB.
4. **Demonstrate LocalStorage ↔ Cloud Synchronization**:
   - Explain: *"If a student is in an offline lab environment without internet, tasks are automatically cached in browser LocalStorage. When back online, clicking 'Sync LocalStorage ↔ Cloud' sends all cached tasks in a single bulk request to `/api/tasks/bulk-sync` to persist them to MongoDB."*

---

### Step 5: Campus Placement Portal & Eligibility Engine (Minute 5:30 – 7:00)
1. Navigate to **Placement Drives**:
   - Show company cards: Google (34.0 LPA), Microsoft (28.5 LPA), Amazon (22.0 LPA), Cisco (18.0 LPA).
2. **Highlight the Eligibility Engine**:
   - Point to the green **Eligible to Apply** badge:
     > *"Notice that the application automatically evaluates my current CGPA (9.28) against the company's minimum CGPA threshold (e.g., Google requires 8.5, Cisco requires 7.0). If a student's CGPA was below the threshold, the system disables the Apply button and marks it in red."*
3. **Demonstrate Application Workflow**:
   - Click **Apply Now** on a company drive.
   - Confirm applicant details (USN, Name, CGPA) and enter a cover note.
   - Click **Confirm & Apply**: The drive badge changes to `Status: Applied`.
4. Switch to the **My Applications** tab:
   - Shows the live status of submitted applications (`Applied`, `OA Cleared`, `Interview Scheduled`).

---

### Step 6: Code Evidence, Tests & Conclusion (Minute 7:00 – 8:00)
1. Navigate to **Syllabus Matrix**:
   - Show the examiner the direct mapping table between Unit 1, Unit 2, Unit 3, Capstone, and the exact files in the codebase.
2. **Terminal Proof (if requested)**:
   - Run `npm test` in the terminal to show all **34 automated integration tests passing**.
   - Show `/api/health` returning live database connectivity.
3. **Concluding Statement**:
   > *"EduPulse demonstrates responsive frontend design with React 18, persistent REST API backend with Express and MongoDB, JWT security, and automated testing, fulfilling 100% of the Semester 3 syllabus requirements. Thank you, and I am ready for any questions."*
