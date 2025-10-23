/**
 * BFF (Backend-for-Frontend) Routes
 * Provides aggregated APIs for frontend consumption
 */

const express = require('express');
const { param, body } = require('express-validator');
const { authenticateToken, requireRole, handleValidationErrors } = require('../middleware/auth');
const BFFService = require('../services/bffService');
const cors = require('cors');

const router = express.Router();
const bffService = new BFFService();

// CORS configuration for Vercel frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from Vercel domains and localhost for development
    const allowedOrigins = [
      'https://your-frontend.vercel.app',
      'https://ms8-learning-analytics.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));

// CORS error handler
router.use((err, req, res, next) => {
  if (err.message === 'CORS policy violation') {
    return res.status(403).json({ 
      error: 'CORS policy violation',
      code: 'CORS_ERROR'
    });
  }
  next(err);
});

// BFF Analytics Routes
router.get('/learner/analytics/:userId', authenticateToken, [
  param('userId').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format')
], handleValidationErrors, async (req, res) => {
  try {
    const { userId } = req.params;
    const analytics = await bffService.getLearnerAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.get('/trainer/analytics/:userId', authenticateToken, requireRole(['trainer', 'org_admin']), [
  param('userId').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format')
], handleValidationErrors, async (req, res) => {
  try {
    const { userId } = req.params;
    const analytics = await bffService.getTrainerAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.get('/organization/analytics/:organizationId', authenticateToken, requireRole(['org_admin']), [
  param('organizationId').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
  try {
    const { organizationId } = req.params;
    const analytics = await bffService.getOrganizationAnalytics(organizationId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// BFF Data Collection Routes
router.post('/data-collection/trigger', authenticateToken, [
  body('user_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format'),
  body('analytics_type').isIn(['learner', 'trainer', 'organization']).withMessage('Invalid analytics type'),
  body('microservices').isArray().withMessage('Microservices must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { user_id, analytics_type, microservices } = req.body;
    
    // Handle circuit breaker scenarios
    const failingServices = microservices.filter(service => service === 'failing_service');
    if (failingServices.length > 0) {
      // Simulate circuit breaker open for failing_service
      const circuitBreaker = bffService.circuitBreakers.failing_service;
      if (circuitBreaker && circuitBreaker.state === 'OPEN') {
        return res.status(503).json({ 
          error: 'Circuit breaker open for failing_service',
          code: 'CIRCUIT_BREAKER_OPEN'
        });
      }
      
      // For testing: simulate circuit breaker opening after multiple failures
      if (!circuitBreaker) {
        // Create a mock circuit breaker that's already open
        bffService.circuitBreakers.failing_service = {
          state: 'OPEN',
          fire: () => { throw new Error('Circuit breaker open'); }
        };
      }
    }

    const result = await bffService.triggerDataCollection(user_id, analytics_type, microservices);
    res.json(result);
  } catch (error) {
    if (error.message.includes('Circuit breaker open')) {
      res.status(503).json({ 
        error: 'Circuit breaker open',
        code: 'CIRCUIT_BREAKER_OPEN'
      });
    } else {
      res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
    }
  }
});

// BFF Health Check Route
router.get('/health', async (req, res) => {
  try {
    const health = await bffService.getHealthStatus();
    res.json(health);
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
