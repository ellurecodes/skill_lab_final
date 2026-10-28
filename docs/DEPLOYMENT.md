# EduPulse Deployment Guide

This document details the deployment procedures for running EduPulse in local containerized environments and on cloud hosting providers (e.g., Render, Vercel, MongoDB Atlas).

---

## 1. Prerequisites for Deployment
- Node.js (v18+)
- MongoDB Community Server (v4.4+) or a MongoDB Atlas Cloud connection URI
- Docker & Docker Compose (optional for containerized deployment)

---

## 2. Local Production Deployment (Single Server Mode)
The Node.js Express server is configured to serve the pre-compiled React 18 production build (`client/dist`) as static assets while hosting the `/api` REST endpoints.

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Seed the Database
```bash
npm run seed
```

### Step 3: Compile React Frontend
```bash
npm run build
```

### Step 4: Launch Production Server
```bash
npm start
```
The unified application will be accessible at `http://localhost:5000`.

---

## 3. Containerized Deployment with Docker & Docker Compose
EduPulse includes a multi-stage `Dockerfile` and a `docker-compose.yml` configuration:

```bash
# Build and start both app and MongoDB containers in background
docker-compose up --build -d

# Verify container status
docker-compose ps

# View live container logs
docker-compose logs -f app
```

To stop containers:
```bash
docker-compose down
```

---

## 4. Cloud Deployment (Render + MongoDB Atlas)

### Step 1: Provision MongoDB Atlas Cluster
1. Create a free shared M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a database user and password.
3. Under **Network Access**, whitelist `0.0.0.0/0` (allow access from anywhere) or specific Render IP ranges.
4. Copy the connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/edupulse?retryWrites=true&w=majority`).

### Step 2: Deploy to Render (Web Service)
1. Link your GitHub repository to [Render](https://render.com).
2. Select **Web Service** with the following parameters:
   - **Environment**: Node
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
3. Configure **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Generate a random 32-character string>`
4. Deploy the service. Once built, verify status via `https://<your-render-subdomain>.onrender.com/api/health`.

---

## 5. Production Health Check & Monitoring
EduPulse includes a built-in health check endpoint:
```http
GET /api/health
```
Monitors:
- Database connection state (`Connected` vs `Disconnected`)
- Node.js process uptime in seconds
- Environment mode (`production` vs `development`)
- Service identification
