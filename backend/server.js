const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: '🚀 MS8 Learning Analytics Backend API',
        version: '1.0.0',
        status: 'operational',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Import route modules
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const reportsRoutes = require('./routes/reports');
const dataCollectionRoutes = require('./routes/data-collection');
const bffRoutes = require('./routes/bff');
const integrationRoutes = require('./routes/integration');

// API routes
app.get('/api/status', (req, res) => {
    res.json({
        service: 'MS8 Learning Analytics Backend',
        status: 'operational',
        services: {
            database: 'connected',
            frontend: 'connected',
            analytics: 'active'
        },
        timestamp: new Date().toISOString()
    });
});

// Mount API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/data-collection', dataCollectionRoutes);
app.use('/api/v1/bff', bffRoutes);
app.use('/api/v1/integration', integrationRoutes);

// Legacy Learning Analytics API endpoints (for backward compatibility)
app.get('/api/analytics/overview', (req, res) => {
    res.json({
        totalStudents: 1250,
        activeCourses: 45,
        completionRate: 87.5,
        averageScore: 82.3,
        lastUpdated: new Date().toISOString()
    });
});

app.get('/api/analytics/students', (req, res) => {
    res.json({
        students: [
            { id: 1, name: 'John Doe', progress: 85, lastActivity: '2024-01-15' },
            { id: 2, name: 'Jane Smith', progress: 92, lastActivity: '2024-01-14' },
            { id: 3, name: 'Mike Johnson', progress: 78, lastActivity: '2024-01-13' }
        ],
        total: 3,
        page: 1,
        limit: 10
    });
});

app.get('/api/analytics/courses', (req, res) => {
    res.json({
        courses: [
            { id: 1, title: 'Introduction to Data Science', enrollment: 245, completion: 89 },
            { id: 2, title: 'Machine Learning Fundamentals', enrollment: 189, completion: 76 },
            { id: 3, title: 'Advanced Analytics', enrollment: 156, completion: 82 }
        ],
        total: 3
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
        path: req.originalUrl,
        method: req.method
    });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 MS8 Learning Analytics Backend running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: ${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${PORT}`}/api/health`);
    });
}

module.exports = app;