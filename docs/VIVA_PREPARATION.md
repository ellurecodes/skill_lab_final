# EduPulse Comprehensive Viva Voce Preparation Guide
## Semester 3 Full Stack Development — Common Questions & Expert Answers

This guide is designed for the student (Vishal Ellure) to confidently answer technical questions from academic examiners and evaluators during the **CIE Test** and **SEE Project Demonstration (60 min)**.

---

### Q1: What is the client-server architecture, and how does EduPulse implement it?
**Answer:**
Client-server architecture is a distributed computing model where workload is partitioned between service requesters (clients) and service providers (servers).
- **Client (Frontend)**: React 18 single-page application executing inside the user's web browser. It renders the UI, handles user interaction events, and sends asynchronous HTTP requests with JWT tokens via the Fetch API.
- **Server (Backend)**: Node.js with Express.js listening on port 5000. It processes incoming requests, enforces authentication middleware, queries the MongoDB database using Mongoose ODM, and returns standard JSON responses.
- **Communication Protocol**: Stateless HTTP/HTTPS over RESTful endpoints (`/api/auth`, `/api/tasks`, `/api/placements`, `/api/stats`).

---

### Q2: What is the difference between Local Storage, Session Storage, and Cookies? How is Local Storage used in EduPulse?
**Answer:**
- **Local Storage**: Persists key-value data in the client browser with no expiration date (survives page refresh and browser restart). Holds ~5–10MB.
- **Session Storage**: Retains data only for the duration of the current browser tab session; data is wiped when tab closes.
- **Cookies**: Small data packets (up to 4KB) sent automatically with every HTTP request, typically used for session tracking.
- **In EduPulse**:
  1. We store the user's JWT authorization token (`edupulse_token`) and UI theme preference (`edupulse_theme`).
  2. In the Academic Task Manager, we maintain a client-side cache (`edupulse_local_tasks_cache`). When offline, tasks are cached in LocalStorage using `JSON.stringify()`. When reconnected, the user can click **Sync LocalStorage ↔ Cloud**, invoking the `/api/tasks/bulk-sync` REST endpoint to persist them to MongoDB.

---

### Q3: Explain the role of JSON in modern full-stack web applications.
**Answer:**
JSON (JavaScript Object Notation) is a lightweight, human-readable data-interchange format.
- In JavaScript, objects reside in memory. To transmit them over an HTTP network, we serialize them into a text string using `JSON.stringify(object)`.
- On receipt, the Express server parses the JSON text payload into a native JavaScript object using the `express.json()` body-parsing middleware.
- When retrieving data in the frontend using `fetch()`, we deserialize the response stream using `await response.json()`.

---

### Q4: What is a REST API and what are standard HTTP methods and status codes?
**Answer:**
REST (Representational State Transfer) is an architectural style for networked applications utilizing standard HTTP methods to perform operations on URI-identified resources:
- **`GET`**: Retrieve resources (e.g., `GET /api/tasks` — returns 200 OK).
- **`POST`**: Create a new resource (e.g., `POST /api/tasks` — returns 201 Created).
- **`PUT`**: Replace an entire existing resource (e.g., `PUT /api/tasks/:id` — returns 200 OK).
- **`PATCH`**: Partially modify an existing resource (e.g., `PATCH /api/tasks/:id/status` — returns 200 OK).
- **`DELETE`**: Remove a resource (e.g., `DELETE /api/tasks/:id` — returns 200 OK).
- **Status Codes**:
  - `200`: OK
  - `201`: Created
  - `400`: Bad Request (Client input validation failure)
  - `401`: Unauthorized (Missing/invalid JWT)
  - `403`: Forbidden (User lacks role permissions)
  - `404`: Not Found (Invalid ID / resource missing)
  - `500`: Internal Server Error

---

### Q5: How does authentication and authorization work in EduPulse?
**Answer:**
- **Password Security**: Passwords are never stored in plaintext. In the Mongoose `User` schema pre-save hook, we generate a cryptographic salt and hash the password using `bcryptjs.hash()`.
- **Authentication**: On login, if `bcrypt.compare()` succeeds, the server signs a JSON Web Token (JWT) containing the user ID, secret key, and an expiration timestamp (`30d`).
- **Authorization Middleware (`protect`)**: Extracts the Bearer token from the `Authorization` request header, verifies the signature using `jwt.verify()`, and attaches the authenticated user record to `req.user`.
- **Role-Based Access (`authorize`)**: Middleware checks `req.user.role`. For instance, only users with `admin` or `coordinator` roles can invoke `POST /api/placements`.

---

### Q6: What are Mongoose Schemas and Models? How are relationships modeled in MongoDB?
**Answer:**
MongoDB is a schemaless NoSQL document database. Mongoose is an Object Data Modeling (ODM) library that enforces schema structure, validation rules, default values, and lifecycle hooks on application layer data.
- **Relationships in EduPulse**: We use **Normalized Document Referencing**:
  - The `Task` schema references the `User` schema via `user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }`.
  - The `Application` schema connects student and company drive via `student: { type: ObjectId, ref: 'User' }` and `drive: { type: ObjectId, ref: 'PlacementDrive' }`.
  - When querying, we utilize Mongoose `.populate('drive')` to join documents dynamically.

---

### Q7: Why use React instead of vanilla DOM manipulation for modern web applications?
**Answer:**
- **Declarative vs Imperative**: Vanilla JS requires imperative DOM manipulation (`document.getElementById`, `createElement`, `appendChild`), which becomes complex, error-prone, and hard to synchronize as state grows.
- **Component Reusability**: React encapsulates structure, styles, and logic into reusable, modular UI components (`Navbar`, `Footer`, `AuthModal`).
- **Virtual DOM & Reconciliation**: React maintains an in-memory Virtual DOM. When state changes (`useState`), React calculates the minimum diff (reconciliation) and updates only the necessary DOM nodes, optimizing rendering speed.
- **Unidirectional Data Flow**: Props pass data down from parent to child, while callbacks or Context API propagate state updates predictably.

---

### Q8: What are React Hooks? Which ones are used in EduPulse?
**Answer:**
Hooks are functions that allow functional components to manage state and lifecycle features:
1. `useState`: Holds component state (e.g., tasks list, search text, active filters, form inputs).
2. `useEffect`: Executes side effects after render (e.g., fetching tasks from backend on mount, synchronizing theme with HTML attributes).
3. `useContext`: Consumes global context data without prop-drilling (`useAuth` for user state, `useTheme` for dark/light mode).
4. `useCallback` / Custom Hooks: Encapsulate reusable logic.

---

### Q9: How does EduPulse handle responsive web design?
**Answer:**
1. **Viewport Meta Tag**: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` ensures proper pixel scaling.
2. **CSS Flexbox**: Used for 1-dimensional layouts (navbars, card headers, badge rows, action button clusters).
3. **CSS Grid**: Used for 2-dimensional layouts (`.grid-cols-4`, `.grid-cols-2`, task filter bars).
4. **Media Queries**: Responsive breakpoints at `1024px`, `860px`, `768px`, and `640px` dynamically reconfigure 4-column grids into 2-column or 1-column layouts, and swap horizontal desktop navigation for a collapsible mobile drawer.
5. **Fluid Typography & Variables**: Custom CSS variables for spacing, border radii, and `clamp()` font scaling.

---

### Q10: How was EduPulse tested, and how do you ensure edge cases don't crash the server?
**Answer:**
- We developed an automated test runner (`server/tests/run-tests.js`) that tests 34 specific integration assertions against live server endpoints.
- We implemented a **Centralized Error Handler Middleware** (`server/middleware/errorHandler.js`):
  - Catches Mongoose `CastError` (e.g., user inputs `GET /api/tasks/abc-invalid-id`) and returns a clean `404 Not Found` instead of an unhandled crash.
  - Catches duplicate key code `11000` (e.g., registering duplicate email or USN) and returns `400 Bad Request`.
  - Catches Mongoose `ValidationError` and extracts exact missing field messages into a clean array.
  - Catches `JsonWebTokenError` and `TokenExpiredError`, returning `401 Unauthorized`.
