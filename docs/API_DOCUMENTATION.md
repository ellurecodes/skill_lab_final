# EduPulse REST API Documentation

Base URL: `http://localhost:5000/api`

All requests expecting JSON must include the header:
```
Content-Type: application/json
```
Protected endpoints require a Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. System Health & Diagnostics

### `GET /health`
Returns live system uptime, database connection state, and server environment.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "status": "OK",
  "timestamp": "2026-10-28T07:36:02.633Z",
  "uptime": 128.45,
  "environment": "development",
  "database": {
    "status": "Connected",
    "host": "127.0.0.1",
    "name": "edupulse"
  },
  "version": "1.0.0",
  "service": "EduPulse Full Stack API"
}
```

---

## 2. Authentication & Student Profile

### `POST /auth/register`
Register a new student account.
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Vishal Ellure",
  "email": "vishal797577@gmail.com",
  "password": "student123",
  "usn": "1RV23CS001",
  "branch": "Computer Science & Engineering",
  "semester": 3,
  "cgpa": 9.28
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "id": "671e...",
    "name": "Vishal Ellure",
    "email": "vishal797577@gmail.com",
    "usn": "1RV23CS001",
    "role": "student",
    "cgpa": 9.28
  },
  "message": "Student account registered successfully"
}
```

### `POST /auth/login`
Authenticate user with email and password.
- **Access**: Public
- **Request Body**:
```json
{
  "email": "vishal797577@gmail.com",
  "password": "student123"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { ... },
  "message": "Authentication successful"
}
```

### `POST /auth/demo-login`
One-click fast sign-in for viva and evaluation.
- **Access**: Public
- **Request Body**: `{ "role": "student" }` or `{ "role": "admin" }`
- **Response `200 OK`**: Returns valid JWT token and user profile.

### `GET /auth/me`
Retrieve authenticated student's profile.
- **Access**: Private (Bearer Token)
- **Response `200 OK`**: Returns user document without password.

### `PUT /auth/profile`
Update student academic details and portfolio links.
- **Access**: Private (Bearer Token)
- **Request Body**:
```json
{
  "name": "Vishal Ellure",
  "phone": "+91 9380421476",
  "cgpa": 9.32,
  "skills": ["React", "Express", "MongoDB", "Node.js", "Tailwind CSS"],
  "bio": "Updated bio..."
}
```
- **Response `200 OK`**: Returns updated user object.

---

## 3. Academic Tasks Management

### `GET /tasks`
Retrieve tasks for current user with optional query filters and sorting.
- **Access**: Private (Bearer Token)
- **Query Parameters**:
  - `status`: `All`, `Pending`, `In Progress`, `Completed`
  - `category`: `All`, `Lab Experiment`, `Assignment`, `Exam Prep`, `Project Work`, `Personal`
  - `priority`: `All`, `High`, `Medium`, `Low`
  - `search`: search substring matching title, subject, or notes
  - `sortBy`: `dueDate`, `priority`, `createdAt`
  - `sortOrder`: `asc`, `desc`
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 7,
  "tasks": [ ... ]
}
```

### `POST /tasks`
Create a new academic task.
- **Access**: Private (Bearer Token)
- **Request Body**:
```json
{
  "title": "Complete FSD Lab 5: Node.js Express REST API",
  "category": "Lab Experiment",
  "priority": "High",
  "status": "In Progress",
  "dueDate": "2026-10-30",
  "subject": "Full Stack Development",
  "notes": "Include Postman testing screenshots."
}
```
- **Response `201 Created`**: Returns created task document.

### `GET /tasks/:id`
Retrieve a single task by ID.
- **Access**: Private (Bearer Token)
- **Response `200 OK`** or `404 Not Found`.

### `PUT /tasks/:id`
Update an existing task.
- **Access**: Private (Bearer Token)
- **Response `200 OK`**: Returns updated task.

### `PATCH /tasks/:id/status`
Toggle or update status between `Pending` and `Completed`.
- **Access**: Private (Bearer Token)
- **Request Body**: `{ "status": "Completed" }`
- **Response `200 OK`**: Returns updated task with updated `completedAt` timestamp.

### `DELETE /tasks/:id`
Permanently remove a task.
- **Access**: Private (Bearer Token)
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "id": "671e..."
}
```

### `POST /tasks/bulk-sync`
Synchronize cached tasks from browser LocalStorage into MongoDB.
- **Access**: Private (Bearer Token)
- **Request Body**:
```json
{
  "tasks": [
    {
      "title": "Offline Created Task",
      "category": "Assignment",
      "priority": "Medium",
      "dueDate": "2026-11-02"
    }
  ]
}
```
- **Response `200 OK`**: Returns count of newly inserted tasks.

---

## 4. Placement Drives & Applications

### `GET /placements`
List all campus recruitment drives.
- **Access**: Public (Enriched with student eligibility if authenticated)
- **Query Parameters**:
  - `search`: Filter by company, role, location, or description
  - `jobType`: `Full Time`, `Internship`, `FTE + Internship`
  - `minCtc`: Minimum package in LPA
  - `eligibleOnly`: `true` to filter drives matching current student's CGPA
- **Response `200 OK`**: Returns array of drives.

### `GET /placements/:id`
View drive details and check if current student has already applied.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "success": true,
  "drive": { ... },
  "userApplication": { ... } // or null
}
```

### `POST /placements`
Post a new hiring drive.
- **Access**: Private (Admin/Coordinator only)
- **Request Body**:
```json
{
  "companyName": "Google",
  "role": "Software Engineer",
  "ctc": 34.0,
  "minCgpa": 8.5,
  "eligibleBranches": ["CSE", "ISE", "ECE"],
  "jobType": "Full Time",
  "location": "Bengaluru",
  "driveDate": "2026-11-15",
  "deadline": "2026-11-10",
  "selectionRounds": ["OA", "Tech 1", "Tech 2", "Leadership"],
  "description": "Core software engineering role."
}
```
- **Response `201 Created`**.

### `POST /placements/:id/apply`
Student applies for a placement drive.
- **Access**: Private (Student only)
- **Request Body**: `{ "notes": "Cover letter / portfolio note" }`
- **Validation**: Enforces CGPA check, deadline check, and duplicate check.
- **Response `201 Created`** or `400 Bad Request` if criteria are not met.

### `GET /placements/my/applications`
Retrieve all applications submitted by current student.
- **Access**: Private (Student only)
- **Response `200 OK`**: Returns applications with populated drive details.

---

## 5. Dashboard Aggregations

### `GET /stats/dashboard`
Returns calculated metrics for the user's dashboard.
- **Access**: Private (Bearer Token)
- **Response `200 OK`**:
```json
{
  "success": true,
  "stats": {
    "academic": {
      "totalTasks": 7,
      "completedTasks": 3,
      "pendingTasks": 4,
      "inProgressTasks": 2,
      "highPriorityTasks": 2,
      "completionRate": 43,
      "categoryBreakdown": [ ... ]
    },
    "placement": {
      "totalDrives": 6,
      "upcomingDrives": 5,
      "avgCtc": 25.0,
      "totalApplied": 3,
      "shortlistedCount": 2,
      "interviewsCount": 1,
      "offersCount": 0
    },
    "urgentTasks": [ ... ],
    "featuredDrives": [ ... ]
  }
}
```

---

## 6. HTTP Status Codes & Error Envelope

All error responses adhere to a consistent JSON envelope:
```json
{
  "success": false,
  "message": "Human-readable error explanation",
  "errors": ["Specific field error 1", "..."]
}
```

| HTTP Status Code | Meaning | Example Trigger |
|---|---|---|
| `200 OK` | Request succeeded | `GET /api/tasks` |
| `201 Created` | Resource created | `POST /api/tasks`, `POST /api/auth/register` |
| `400 Bad Request` | Missing required fields / Validation failure | CGPA below minimum required, duplicate email/USN |
| `401 Unauthorized` | Missing or invalid Bearer token | Expired JWT or protected endpoint access without token |
| `403 Forbidden` | Insufficient role permissions | Student attempting to create placement drive |
| `404 Not Found` | Resource not found | Malformed or nonexistent `ObjectId` |
| `500 Server Error` | Unexpected server fault | Database connection dropout |
