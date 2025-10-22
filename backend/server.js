const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'MS8 Learning Analytics Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to MS8 Learning Analytics API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      analytics: '/api/analytics',
      students: '/api/students',
      courses: '/api/courses'
    }
  });
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  res.json({
    message: 'Analytics endpoint ready',
    data: {
      totalStudents: 0,
      totalCourses: 0,
      activeUsers: 0,
      lastUpdated: new Date().toISOString()
    }
  });
});

// Students endpoint
app.get('/api/students', (req, res) => {
  res.json({
    message: 'Students endpoint ready',
    data: []
  });
});

// Courses endpoint
app.get('/api/courses', (req, res) => {
  res.json({
    message: 'Courses endpoint ready',
    data: []
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MS8 Learning Analytics Backend running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
  console.log(`🔗 API documentation at: http://localhost:${PORT}/api`);
});

module.exports = app;
