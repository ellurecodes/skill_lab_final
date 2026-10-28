# Experiential Learning (EL) Poster Content
## RV College of Engineering, Bengaluru – 560059
**Department of Computer Science & Engineering**

---

### Poster Header
- **Project Title**: EduPulse: Student Academic Productivity & Placement Preparation Ecosystem
- **Theme**: Full Stack Web Development & Academic Productivity Systems
- **Student Name**: Vishal Ellure
- **USN**: `1RV23CS001`
- **Department**: Computer Science & Engineering, RVCE
- **Academic Year**: 2026–2027

---

### 1. Problem Definition
Undergraduate engineering students frequently struggle to balance course deliverables (lab experiments, assignments, CIE exams) with competitive campus recruitment preparation. Information is fragmented across disparate platforms, leading to missed deadlines, lack of visibility into eligibility criteria (CGPA thresholds and eligible branches), and loss of unpersisted work when network connectivity drops.

---

### 2. Objectives
1. Build an integrated MERN stack web application demonstrating 100% of the Semester 3 Full Stack Development curriculum.
2. Provide an Academic Productivity Hub with multi-criteria task filtering and LocalStorage-to-MongoDB cloud synchronization.
3. Deliver a Campus Placement Portal with an automated CGPA eligibility engine and application lifecycle tracking.
4. Architect a secure RESTful API with JSON Web Token (JWT) authentication, role-based authorization, and centralized error handling.
5. Validate software reliability via 34 automated integration tests and a comprehensive Postman API test collection.

---

### 3. Methodology & Tools Used
- **Architecture**: 3-Tier Client-Server Architecture (React 18 SPA ↔ Express REST API ↔ MongoDB NoSQL).
- **Frontend Tools**: React 18, Vite, Context API (Auth, Theme), Semantic HTML5, CSS3 Glassmorphism, CSS Grid, Flexbox.
- **Backend Tools**: Node.js, Express.js, JWT, bcryptjs, Morgan logger, CORS.
- **Database Tools**: MongoDB, Mongoose 7.x Object Data Modeling with compound indexing and validation.
- **Testing & DevOps**: Automated Node.js integration test runner, Postman v2.1.0, Git version control, Docker multi-stage containerization.

---

### 4. Strategic Flowchart / Workflow
```
[Student / User] 
       │
       ▼
[React 18 Frontend] ──── (Offline Mode) ───► [Browser LocalStorage]
       │                                              │
       ▼ (Fetch API with Bearer JWT)                  ▼ (Bulk Sync)
[Express.js REST API] ◄───────────────────────────────┘
       │
  [Auth & Error Middleware]
       │
       ▼
[Mongoose Schemas & Controllers]
       │
       ▼
[MongoDB Persistence (Users, Tasks, Drives, Applications)]
```

---

### 5. Results & Discussion
- **100% Syllabus Verification**: Every topic from Unit 1, Unit 2, Unit 3, and Capstone is implemented and mapped to source files.
- **Automated QA**: 34/34 integration tests passed, covering health checks, authentication, task CRUD, placement eligibility, and boundary conditions.
- **Dual-Theme Glassmorphic UI**: Fully responsive mobile-friendly interface with sub-100ms API response times.
- **Robust Security**: bcryptjs password hashing and JWT token expiration prevent unauthorized access and data tampering.

---

### 6. Outcome of the Work
- **Product Development**: Production-ready, containerized full-stack web application with complete documentation.
- **Demonstration Deliverable**: 5–10 minute demonstration sequence ready for the SEE evaluation panel.
- **Extensible Foundation**: Architecture prepared for future WebSocket real-time interview notifications and automated resume generation.

---

### 7. References
1. Semester 3 Full Stack Development Scheme of Conduct and Evaluation, Dept. of CSE, RVCE.
2. React 18 Documentation: https://react.dev/
3. Express.js API Reference: https://expressjs.com/
4. MongoDB & Mongoose Object Modeling: https://mongoosejs.com/
5. MDN Web Docs (HTML5 Semantic Elements & CSS Grid): https://developer.mozilla.org/
