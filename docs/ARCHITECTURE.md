# EduPulse Architectural Design & Component Models

This document details the software architecture, data flow pipelines, component hierarchy, and database entity relationships for the **EduPulse** full-stack application.

---

## 1. System Architecture Flowchart

```mermaid
flowchart TD
    subgraph ClientTier ["Frontend Tier (Browser / React 18 SPA)"]
        UI["React Single Page App (Vite)"]
        AuthCtx["AuthContext (JWT Session)"]
        ThemeCtx["ThemeContext (Dark/Light)"]
        LocalStorage["Browser LocalStorage (Offline Cache)"]
        FetchAPI["Centralized Fetch API Client"]
        
        UI --> AuthCtx
        UI --> ThemeCtx
        UI --> LocalStorage
        UI --> FetchAPI
    end

    subgraph ServerTier ["Application Tier (Node.js & Express REST API)"]
        Router["Express Router (/api)"]
        AuthMW["JWT Protect & Role Authorize Middleware"]
        ErrMW["Centralized Error Handler Middleware"]
        
        subgraph Controllers ["Controllers"]
            AC["authController"]
            TC["taskController"]
            PC["placementController"]
            SC["statsController"]
            HC["healthController"]
        end

        FetchAPI -- "HTTP REST (JSON + Bearer Token)" --> Router
        Router --> AuthMW
        AuthMW --> Controllers
        Controllers -. "Errors" .-> ErrMW
    end

    subgraph DatabaseTier ["Database Tier (MongoDB Engine)"]
        Mongoose["Mongoose 7.x ODM"]
        
        subgraph Collections ["MongoDB Collections"]
            U[("Users Collection")]
            T[("Tasks Collection")]
            PD[("PlacementDrives Collection")]
            A[("Applications Collection")]
        end

        Controllers --> Mongoose
        Mongoose --> Collections
    end
```

---

## 2. Database Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ TASK : "manages"
    USER ||--o{ APPLICATION : "submits"
    PLACEMENT_DRIVE ||--o{ APPLICATION : "receives"
    USER ||--o{ PLACEMENT_DRIVE : "creates (admin)"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password "hashed with bcrypt"
        string usn UK
        string role "student | admin | coordinator"
        string branch
        number semester
        number cgpa
        stringArray skills
        string phone
        string github
        string linkedin
        date createdAt
    }

    TASK {
        ObjectId _id PK
        ObjectId user FK
        string title
        string category "Lab | Assignment | Exam | Project"
        string priority "High | Medium | Low"
        string status "Pending | In Progress | Completed"
        date dueDate
        string subject
        string notes
        date completedAt
        date createdAt
    }

    PLACEMENT_DRIVE {
        ObjectId _id PK
        string companyName
        string role
        number ctc "LPA"
        number minCgpa
        stringArray eligibleBranches
        string jobType "Full Time | Internship"
        string location
        date driveDate
        date deadline
        stringArray selectionRounds
        string description
        string status "Upcoming | Ongoing | Completed"
        ObjectId createdBy FK
    }

    APPLICATION {
        ObjectId _id PK
        ObjectId student FK
        ObjectId drive FK
        string status "Applied | Shortlisted | OA Cleared | Interview | Offered"
        date appliedAt
        date interviewDate
        string currentRound
        string notes
    }
```

---

## 3. Sequence Diagram: Student Placement Application Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (Browser)
    participant Client as React App (PlacementsPage)
    participant API as Express API (/api/placements)
    participant MW as Auth Middleware (protect)
    participant DB as MongoDB (Mongoose)

    Student->>Client: Click "Apply Now" (Company Drive)
    Client->>Client: Check user.cgpa >= drive.minCgpa
    Client->>Student: Open Confirmation Modal with Cover Note
    Student->>Client: Submit Application
    Client->>API: POST /api/placements/:id/apply (Bearer Token)
    API->>MW: Verify JWT Token
    MW-->>API: Attach req.user to Request
    API->>DB: Query PlacementDrive.findById(id)
    DB-->>API: Return Drive Details
    API->>API: Verify Deadline & Check (req.user.cgpa >= drive.minCgpa)
    API->>DB: Query Application.findOne({ student, drive })
    alt Already Applied
        DB-->>API: Existing Application Found
        API-->>Client: 400 Bad Request ("Already applied")
    else Eligible & Not Applied
        API->>DB: Application.create({ student, drive, status: 'Applied' })
        DB-->>API: Created Application Document
        API-->>Client: 201 Created (Success Payload)
        Client-->>Student: Display Success Alert & Update Badge to "Applied"
    end
```

---

## 4. State Diagram: Application Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Applied: Student Submits Application
    Applied --> Shortlisted: Coordinator Reviews Resume & CGPA
    Applied --> Rejected: Ineligible or Capacity Reached
    Shortlisted --> OACleared: Clears Online Assessment
    OACleared --> InterviewScheduled: Technical Round Slot Allotted
    InterviewScheduled --> Offered: Clears Technical & HR Rounds
    InterviewScheduled --> Rejected: Did Not Clear Interview
    Offered --> [*]: Student Accepts Campus Offer
    Rejected --> [*]
```

---

## 5. Directory Structure & Separation of Concerns

- **`client/`**: Pure presentation and client-side routing. Vite abstracts the build process, while CSS variables establish consistent styling. React Context isolates authorization and theme state from visual components.
- **`server/`**: Pure stateless RESTful API. Express mounts routers which delegate business operations to dedicated controllers. Mongoose models validate business invariants before committing to MongoDB. Centralized error handling catches all exceptions.
- **`postman/`**: Pre-configured test suites for independent API verification.
- **`docs/`**: Academic reports, syllabus mapping, viva notes, and deployment manuals.
