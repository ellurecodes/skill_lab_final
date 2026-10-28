# EduPulse Git & Version Control Workflow

This document details the version control principles, repository branching structure, commit standards, and pull-request collaboration workflows used in developing the **EduPulse** Full Stack Capstone project.

---

## 1. Git Fundamentals & Version Control Strategy
As taught in **Unit 1 & Unit 2** of the syllabus:
- **Working Directory**: Local files on the developer filesystem.
- **Staging Area (`git add`)**: Prepares selected changes into indexed snapshots.
- **Local Repository (`git commit`)**: Records permanent, cryptographically hashed commit records.
- **Remote Repository (`git push` / GitHub)**: Centralizes collaborative team branches and pull requests.

---

## 2. Branching Strategy (Git Flow Model)

```
main (Production-ready releases)
  ▲
  │ Pull Request & Code Review
feature/placement-tracker ──► Merge into main
  ▲
feature/task-manager ────────► Merge into main
  ▲
feature/rest-api-backend ────► Merge into main
```

### Core Branches
1. **`main`**: Represents production-ready, thoroughly tested codebase. Only merged after all tests pass.
2. **`feature/*`**: Dedicated feature branches branched off `main` for modular development:
   - `feature/rest-api-backend`: Node.js Express server, Mongoose models, and JWT middleware.
   - `feature/task-manager`: React interactive task management, multi-filters, and LocalStorage sync.
   - `feature/placement-tracker`: Campus placement portal, eligibility engine, and application workflows.

---

## 3. Pull Request (PR) Workflow & Team Collaboration
When a feature is complete, developers adhere to the standard pull-request workflow:
1. **Branch Creation**:
   ```bash
   git checkout -b feature/placement-tracker
   ```
2. **Local Commits**: Maintain focused, semantic commit messages (e.g., `feat:`, `fix:`, `docs:`, `test:`).
3. **Automated Verification**: Run integration tests prior to pushing:
   ```bash
   npm test
   ```
4. **Push & Create PR**:
   ```bash
   git push origin feature/placement-tracker
   ```
5. **Code Review & Merge**: Peer review conducted; branch merged via `git merge --no-ff feature/placement-tracker` into `main`.

---

## 4. Commit History Log in EduPulse
The repository maintains clean, meaningful commits reflecting each milestone of the project:

```
* feat(docs): add comprehensive academic documentation and viva preparation guides
* feat(placement): implement campus hiring drives, eligibility engine, and application tracking
* feat(tasks): build academic task manager with LocalStorage sync and MongoDB persistence
* feat(client): build responsive React 18 UI with glassmorphic dual-theme design system
* feat(api): implement Node.js Express REST API, Mongoose schemas, JWT auth, and 34 integration tests
* feat(init): scaffold monorepo architecture, environment templates, and Docker configs
```

---

## 5. Security & Credentials Policy
- Real database credentials, API keys, and session secrets are **never** committed to version control.
- An example template file (`server/.env.example`) is committed with dummy placeholders.
- A comprehensive `.gitignore` excludes `node_modules/`, `client/dist/`, `.env`, and operating system cache files.
