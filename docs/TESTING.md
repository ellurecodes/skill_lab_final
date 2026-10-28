# EduPulse Quality Assurance & Testing Report

This document reports the systematic testing methodology, test suites, execution commands, and verified results for the **EduPulse** full-stack capstone project.

---

## 1. Test Strategy & Levels
Quality assurance for EduPulse was conducted across three distinct tiers:
1. **Backend Integration & Endpoint Automation**: Automated Node.js integration test suite executing 34 assertions against a live Express server and MongoDB instance.
2. **Frontend UI & Build Verification**: Production asset transpilation, component dependency resolution, and JSX syntax validation via Vite.
3. **Manual Exploratory & Boundary Testing**: Verification of responsive layouts, mobile viewport responsiveness, LocalStorage caching, and offline-online recovery.

---

## 2. Automated Test Execution & Results

### Execution Command
```bash
npm test
# or
cd server && npm test
```

### Verified Test Log Output
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

---

## 3. Detailed Test Matrix

| Test ID | Test Category | Target Endpoint | Input Condition | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-01 | Diagnostics | `GET /api/health` | None | Status 200, DB 'Connected' | 200 OK, DB Connected | PASS |
| TC-02 | Auth | `POST /api/auth/demo-login` | `{ role: 'student' }` | Status 200, valid JWT | Token received | PASS |
| TC-03 | Auth | `POST /api/auth/login` | Valid email & password | Status 200, user profile | Profile loaded | PASS |
| TC-04 | Auth | `POST /api/auth/login` | Incorrect password | Status 401 Unauthorized | 401 returned | PASS |
| TC-05 | Auth | `GET /api/auth/me` | Valid Bearer token | Status 200, user USN | Match confirmed | PASS |
| TC-06 | Auth | `GET /api/auth/me` | No token | Status 401 Unauthorized | 401 returned | PASS |
| TC-07 | Tasks | `GET /api/tasks` | Bearer token | Status 200, array of tasks | 7 tasks returned | PASS |
| TC-08 | Tasks | `POST /api/tasks` | Valid title, category, dueDate | Status 201 Created | Task inserted | PASS |
| TC-09 | Tasks | `GET /api/tasks/:id` | Valid newly created ID | Status 200, status 'Pending' | Task retrieved | PASS |
| TC-10 | Tasks | `PATCH /api/tasks/:id/status` | `{ status: 'Completed' }` | Status 200, status updated | Status is Completed | PASS |
| TC-11 | Tasks | `GET /api/tasks?status=Completed` | Query param filter | Status 200, only completed | Filter verified | PASS |
| TC-12 | Tasks | `DELETE /api/tasks/:id` | Valid task ID | Status 200 OK | Deleted | PASS |
| TC-13 | Tasks | `GET /api/tasks/:id` | Deleted ID | Status 404 Not Found | 404 returned | PASS |
| TC-14 | Placements | `GET /api/placements` | Public request | Status 200, drive array | 6 drives returned | PASS |
| TC-15 | Placements | `GET /api/placements/:id` | Valid drive ID | Status 200, company details | Google verified | PASS |
| TC-16 | Placements | `GET /api/placements/my/applications` | Bearer token | Status 200, student submissions | 3 apps returned | PASS |
| TC-17 | Analytics | `GET /api/stats/dashboard` | Bearer token | Status 200, completion rate | Integer % returned | PASS |
| TC-18 | Boundary | `GET /api/tasks/invalid-object-id` | Non-hex ID | Status 404 (CastError handled) | 404 returned | PASS |
| TC-19 | Boundary | `POST /api/tasks` | Missing required title | Status 400 Validation Error | 400 returned | PASS |

---

## 4. Postman API Testing Collection
The Postman collection (`postman/EduPulse_API.postman_collection.json`) mirrors the automated test suite and includes:
1. Environment variables for `base_url` (`http://localhost:5000`) and dynamic `token`.
2. Test scripts attached to `POST /api/auth/demo-login` that automatically extract the returned token and populate `pm.environment.set("token", ...)`.
3. Pre-populated request bodies for task creation, profile editing, and drive queries.

---

## 5. Frontend Build & Responsiveness Testing
- **Vite Build Verification**: `npm run build` completed in **17.35s** with zero warnings or errors.
- **Mobile Responsive Testing**: Verified using Chrome DevTools device mode on:
  - Mobile Small: 375px width (iPhone SE) — hamburger menu collapses properly; tables convert into card view.
  - Tablet: 768px width (iPad Mini) — 2-column grid layout functions cleanly.
  - Desktop: 1280px+ width — full 4-column metrics grid and side-by-side dashboard cards.
