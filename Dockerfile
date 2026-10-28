# Multi-stage Docker build for EduPulse MERN application

# Stage 1: Build React Frontend
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:18-alpine
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server code
COPY server/ ./server/

# Copy built frontend assets from Stage 1 into client/dist
COPY --from=client-builder /app/client/dist ./client/dist

# Expose backend port
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

# Start production server
CMD ["node", "server/server.js"]
