const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Request logging middleware in dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development
      }
    },
    credentials: true,
  })
);

// Mount API routes
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Root API welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to EduPulse REST API',
    version: '1.0.0',
    documentation: '/docs/API_DOCUMENTATION.md',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        demoLogin: 'POST /api/auth/demo-login',
        me: 'GET /api/auth/me',
        profile: 'PUT /api/auth/profile',
      },
      tasks: {
        list: 'GET /api/tasks',
        create: 'POST /api/tasks',
        get: 'GET /api/tasks/:id',
        update: 'PUT /api/tasks/:id',
        toggle: 'PATCH /api/tasks/:id/status',
        delete: 'DELETE /api/tasks/:id',
        bulkSync: 'POST /api/tasks/bulk-sync',
      },
      placements: {
        list: 'GET /api/placements',
        get: 'GET /api/placements/:id',
        create: 'POST /api/placements',
        update: 'PUT /api/placements/:id',
        delete: 'DELETE /api/placements/:id',
        apply: 'POST /api/placements/:id/apply',
        myApplications: 'GET /api/placements/my/applications',
      },
      stats: {
        dashboard: 'GET /api/stats/dashboard',
      },
    },
  });
});

// Serve frontend build if exists in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If client not built yet, redirect or show message
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>EduPulse Full Stack API</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0b0f19; color: #f8fafc; padding: 40px; text-align: center; }
            .card { max-width: 600px; margin: 40px auto; background: #161f33; padding: 32px; border-radius: 12px; border: 1px solid #334155; }
            h1 { color: #6366f1; }
            a { color: #06b6d4; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>EduPulse Backend API Running</h1>
            <p>Node.js & Express REST API is active on port ${process.env.PORT || 5000}.</p>
            <p>Visit <a href="/api/health">/api/health</a> or <a href="/api">/api</a> for available endpoints.</p>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] EduPulse API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Server Error] Unhandled rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
