const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @desc    Health check & system status endpoint
// @route   GET /api/health
// @access  Public
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const status = dbState === 1 ? 'OK' : 'DEGRADED';
  const statusCode = dbState === 1 ? 200 : 503;

  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: stateMap[dbState] || 'Unknown',
      host: mongoose.connection.host || 'localhost',
      name: mongoose.connection.name || 'edupulse',
    },
    version: '1.0.0',
    service: 'EduPulse Full Stack API',
  });
});

module.exports = router;
