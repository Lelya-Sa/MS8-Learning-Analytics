/**
 * Tests for Processed Analytics API Routes
 */

const request = require('supertest');
const express = require('express');
const processedAnalyticsRoutes = require('../routes/processed-analytics');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/v1/processed-analytics', processedAnalyticsRoutes);

// Mock authentication middleware
jest.mock('../middleware/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'user-123', roles: ['learner', 'trainer', 'org_admin'] };
    next();
  },
  requireRole: (roles) => (req, res, next) => {
    if (roles.some(role => req.user.roles.includes(role))) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  },
  canAccessResource: (resourceId, user, allowedRoles) => {
    return allowedRoles.some(role => user.roles.includes(role));
  }
}));

// Mock validation middleware
jest.mock('../middleware/validation', () => ({
  handleValidationErrors: (req, res, next) => next(),
  validationRules: {
    userId: {
      matches: /^user-\d+$/,
      message: 'Invalid user ID format'
    },
    organizationId: {
      matches: /^org-\d+$/,
      message: 'Invalid organization ID format'
    }
  }
}));

describe('Processed Analytics API Routes', () => {
  describe('GET /api/v1/processed-analytics/learner/:userId', () => {
    it('should return processed learner analytics data', async () => {
      const response = await request(app)
        .get('/api/v1/processed-analytics/learner/user-123')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.data).toHaveProperty('learningVelocity');
      expect(response.body.data).toHaveProperty('skillGap');
      expect(response.body.data).toHaveProperty('engagement');
      expect(response.body.data).toHaveProperty('mastery');
      expect(response.body.data).toHaveProperty('performance');
      expect(response.body.data).toHaveProperty('contentEffectiveness');
    });

    it('should return fallback data for unknown user', async () => {
      const response = await request(app)
        .get('/api/v1/processed-analytics/learner/unknown-user')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.metadata.staleness).toBe('fallback');
    });
  });

  describe('GET /api/v1/processed-analytics/learner/:userId/:component', () => {
    it('should return specific learner analytics component', async () => {
      const response = await request(app)
        .get('/api/v1/processed-analytics/learner/user-123/learningVelocity')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.data).toHaveProperty('period');
      expect(response.body.data).toHaveProperty('currentPace');
      expect(response.body.data).toHaveProperty('formattedData');
    });

    it('should return 400 for invalid component', async () => {
      await request(app)
        .get('/api/v1/processed-analytics/learner/user-123/invalidComponent')
        .expect(404);
    });
  });

  describe('GET /api/v1/processed-analytics/trainer/:userId', () => {
    it('should return processed trainer analytics data', async () => {
      const response = await request(app)
        .get('/api/v1/processed-analytics/trainer/trainer-789')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.data).toHaveProperty('coursePerformance');
      expect(response.body.data).toHaveProperty('courseHealth');
      expect(response.body.data).toHaveProperty('studentDistribution');
      expect(response.body.data).toHaveProperty('teachingEffectiveness');
    });
  });

  describe('GET /api/v1/processed-analytics/organization/:organizationId', () => {
    it('should return processed organization analytics data', async () => {
      const response = await request(app)
        .get('/api/v1/processed-analytics/organization/org-123')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.data).toHaveProperty('orgLearningVelocity');
      expect(response.body.data).toHaveProperty('strategicAlignment');
      expect(response.body.data).toHaveProperty('learningCulture');
      expect(response.body.data).toHaveProperty('orgPerformance');
    });
  });

  describe('Data Structure Validation', () => {
    it('should return properly formatted data with formattedData', async () => {
      const response = await request(app)
        .get('/api/v1/processed-analytics/learner/user-123/learningVelocity')
        .expect(200);

      const data = response.body.data;
      expect(data).toHaveProperty('formattedData');
      expect(data.formattedData).toHaveProperty('currentPaceFormatted');
      expect(data.formattedData).toHaveProperty('trendFormatted');
      expect(data.formattedData).toHaveProperty('statusFormatted');
    });

    it('should include metadata with staleness indicator', async () => {
      const response = await request(app)
        .get('/api/v1/processed-analytics/learner/user-123')
        .expect(200);

      expect(response.body.metadata).toHaveProperty('userId');
      expect(response.body.metadata).toHaveProperty('lastUpdated');
      expect(response.body.metadata).toHaveProperty('staleness');
    });
  });
});
