/**
 * Phase 3B: Backend API Endpoints Tests (TDD - RED Phase)
 * Tests for all 30+ API endpoints with mock data fallback
 */

const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

// Mock JWT secret for testing
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

// Test user tokens
const learnerToken = jwt.sign({
  userId: 'learner-123',
  email: 'learner@test.com',
  role: 'learner',
  roles: ['learner'],
  organizationId: 'org-123'
}, JWT_SECRET, { expiresIn: '1h' });

const trainerToken = jwt.sign({
  userId: 'trainer-456',
  email: 'trainer@test.com',
  role: 'trainer',
  roles: ['trainer'],
  organizationId: 'org-123'
}, JWT_SECRET, { expiresIn: '1h' });

const orgAdminToken = jwt.sign({
  userId: 'admin-789',
  email: 'admin@test.com',
  role: 'org-admin',
  roles: ['org-admin'],
  organizationId: 'org-123'
}, JWT_SECRET, { expiresIn: '1h' });

describe('Phase 3B: API Endpoints with Mock Data', () => {
  
  describe('Authentication Endpoints', () => {
    
    test('POST /api/v1/auth/login - should authenticate user and return token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'learner@test.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('roles');
    });

    test('POST /api/v1/auth/refresh - should refresh JWT token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test('GET /api/v1/auth/me - should return current user info', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe('learner-123');
    });

    test('POST /api/v1/auth/logout - should logout user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Learner Analytics Endpoints', () => {
    
    test('GET /api/v1/learner/analytics/velocity/:userId - should return learning velocity', async () => {
      const response = await request(app)
        .get('/api/v1/learner/analytics/velocity/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('currentPace');
      expect(response.body.data).toHaveProperty('targetPace');
      expect(response.body.data).toHaveProperty('trend');
      expect(response.body).toHaveProperty('cached');
      expect(response.body).toHaveProperty('lastUpdated');
      expect(response.body).toHaveProperty('expiresAt');
    });

    test('GET /api/v1/learner/analytics/skill-gap/:userId - should return skill gap matrix', async () => {
      const response = await request(app)
        .get('/api/v1/learner/analytics/skill-gap/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('currentSkills');
      expect(response.body.data).toHaveProperty('requiredSkills');
      expect(response.body.data).toHaveProperty('gaps');
      expect(response.body.data).toHaveProperty('recommendations');
    });

    test('GET /api/v1/learner/analytics/engagement/:userId - should return engagement score', async () => {
      const response = await request(app)
        .get('/api/v1/learner/analytics/engagement/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallScore');
      expect(response.body.data).toHaveProperty('weeklyEngagement');
      expect(response.body.data).toHaveProperty('activityBreakdown');
      expect(response.body.data).toHaveProperty('trends');
    });

    test('GET /api/v1/learner/analytics/mastery/:userId - should return mastery progress', async () => {
      const response = await request(app)
        .get('/api/v1/learner/analytics/mastery/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallMastery');
      expect(response.body.data).toHaveProperty('skillMastery');
      expect(response.body.data).toHaveProperty('courseMastery');
      expect(response.body.data).toHaveProperty('learningPath');
    });

    test('GET /api/v1/learner/analytics/performance/:userId - should return performance analytics', async () => {
      const response = await request(app)
        .get('/api/v1/learner/analytics/performance/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallPerformance');
      expect(response.body.data).toHaveProperty('assessmentScores');
      expect(response.body.data).toHaveProperty('courseProgress');
      expect(response.body.data).toHaveProperty('timeSpent');
    });

    test('GET /api/v1/learner/analytics/content-effectiveness/:userId - should return content effectiveness', async () => {
      const response = await request(app)
        .get('/api/v1/learner/analytics/content-effectiveness/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('contentEffectiveness');
      expect(response.body.data).toHaveProperty('contentTypes');
      expect(response.body.data).toHaveProperty('preferredLearningStyle');
      expect(response.body.data).toHaveProperty('recommendations');
    });
  });

  describe('Trainer Analytics Endpoints', () => {
    
    test('GET /api/v1/trainer/analytics/course-performance/:trainerId - should return course performance', async () => {
      const response = await request(app)
        .get('/api/v1/trainer/analytics/course-performance/trainer-456')
        .set('Authorization', `Bearer ${trainerToken}`)
        .set('X-Active-Role', 'trainer');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallPerformance');
      expect(response.body.data).toHaveProperty('courses');
      expect(response.body.data).toHaveProperty('trends');
      expect(response.body.data).toHaveProperty('insights');
    });

    test('GET /api/v1/trainer/analytics/course-health/:trainerId - should return course health', async () => {
      const response = await request(app)
        .get('/api/v1/trainer/analytics/course-health/trainer-456')
        .set('Authorization', `Bearer ${trainerToken}`)
        .set('X-Active-Role', 'trainer');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallHealth');
      expect(response.body.data).toHaveProperty('courses');
      expect(response.body.data).toHaveProperty('alerts');
    });

    test('GET /api/v1/trainer/analytics/student-distribution/:trainerId - should return student distribution', async () => {
      const response = await request(app)
        .get('/api/v1/trainer/analytics/student-distribution/trainer-456')
        .set('Authorization', `Bearer ${trainerToken}`)
        .set('X-Active-Role', 'trainer');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalStudents');
      expect(response.body.data).toHaveProperty('distribution');
      expect(response.body.data).toHaveProperty('demographics');
    });

    test('GET /api/v1/trainer/analytics/teaching-effectiveness/:trainerId - should return teaching effectiveness', async () => {
      const response = await request(app)
        .get('/api/v1/trainer/analytics/teaching-effectiveness/trainer-456')
        .set('Authorization', `Bearer ${trainerToken}`)
        .set('X-Active-Role', 'trainer');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallEffectiveness');
      expect(response.body.data).toHaveProperty('metrics');
      expect(response.body.data).toHaveProperty('strengths');
      expect(response.body.data).toHaveProperty('areasForImprovement');
    });
  });

  describe('Organizational Analytics Endpoints', () => {
    
    test('GET /api/v1/org-admin/analytics/learning-velocity/:orgId - should return org learning velocity', async () => {
      const response = await request(app)
        .get('/api/v1/org-admin/analytics/learning-velocity/org-123')
        .set('Authorization', `Bearer ${orgAdminToken}`)
        .set('X-Active-Role', 'org-admin');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallVelocity');
      expect(response.body.data).toHaveProperty('departmentBreakdown');
      expect(response.body.data).toHaveProperty('trends');
      expect(response.body.data).toHaveProperty('benchmarks');
    });

    test('GET /api/v1/org-admin/analytics/strategic-alignment/:orgId - should return strategic alignment', async () => {
      const response = await request(app)
        .get('/api/v1/org-admin/analytics/strategic-alignment/org-123')
        .set('Authorization', `Bearer ${orgAdminToken}`)
        .set('X-Active-Role', 'org-admin');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallAlignment');
      expect(response.body.data).toHaveProperty('strategicGoals');
      expect(response.body.data).toHaveProperty('skillGaps');
      expect(response.body.data).toHaveProperty('resourceAllocation');
    });

    test('GET /api/v1/org-admin/analytics/learning-culture/:orgId - should return learning culture', async () => {
      const response = await request(app)
        .get('/api/v1/org-admin/analytics/learning-culture/org-123')
        .set('Authorization', `Bearer ${orgAdminToken}`)
        .set('X-Active-Role', 'org-admin');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallCulture');
      expect(response.body.data).toHaveProperty('cultureDimensions');
      expect(response.body.data).toHaveProperty('engagementMetrics');
      expect(response.body.data).toHaveProperty('learningBehaviors');
    });

    test('GET /api/v1/org-admin/analytics/org-performance/:orgId - should return org performance', async () => {
      const response = await request(app)
        .get('/api/v1/org-admin/analytics/org-performance/org-123')
        .set('Authorization', `Bearer ${orgAdminToken}`)
        .set('X-Active-Role', 'org-admin');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('overallPerformance');
      expect(response.body.data).toHaveProperty('performanceMetrics');
      expect(response.body.data).toHaveProperty('departmentPerformance');
      expect(response.body.data).toHaveProperty('businessImpact');
    });
  });

  describe('Comparison Analytics Endpoints', () => {
    
    test('GET /api/v1/comparison/peer/:userId - should return peer comparison', async () => {
      const response = await request(app)
        .get('/api/v1/comparison/peer/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('userRanking');
      expect(response.body.data).toHaveProperty('skillComparisons');
      expect(response.body.data).toHaveProperty('performanceComparisons');
      expect(response.body.data).toHaveProperty('anonymizedPeerData');
    });

    test('GET /api/v1/comparison/skill-demand - should return skill demand data', async () => {
      const response = await request(app)
        .get('/api/v1/comparison/skill-demand')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('skillDemand');
      expect(response.body.data).toHaveProperty('marketInsights');
      expect(response.body.data).toHaveProperty('industryTrends');
      expect(response.body.data).toHaveProperty('salaryRanges');
    });
  });

  describe('Predictive Analytics Endpoints', () => {
    
    test('GET /api/v1/predictive/drop-off-risk/:userId - should return drop-off risk', async () => {
      const response = await request(app)
        .get('/api/v1/predictive/drop-off-risk/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('riskScore');
      expect(response.body.data).toHaveProperty('riskLevel');
      expect(response.body.data).toHaveProperty('riskFactors');
      expect(response.body.data).toHaveProperty('predictions');
      expect(response.body.data).toHaveProperty('interventions');
    });

    test('GET /api/v1/predictive/forecast/:userId - should return performance forecast', async () => {
      const response = await request(app)
        .get('/api/v1/predictive/forecast/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('forecastPeriod');
      expect(response.body.data).toHaveProperty('predictions');
      expect(response.body.data).toHaveProperty('scenarios');
      expect(response.body.data).toHaveProperty('influencingFactors');
    });

    test('GET /api/v1/predictive/recommendations/:userId - should return recommendations', async () => {
      const response = await request(app)
        .get('/api/v1/predictive/recommendations/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('recommendations');
      expect(response.body.data).toHaveProperty('personalizedInsights');
      expect(response.body.data).toHaveProperty('learningPreferences');
      expect(response.body.data).toHaveProperty('careerAlignment');
    });
  });

  describe('Gamification Endpoints', () => {
    
    test('GET /api/v1/gamification/stats/:userId - should return gamification stats', async () => {
      const response = await request(app)
        .get('/api/v1/gamification/stats/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalPoints');
      expect(response.body.data).toHaveProperty('level');
      expect(response.body.data).toHaveProperty('badges');
      expect(response.body.data).toHaveProperty('achievements');
      expect(response.body.data).toHaveProperty('streaks');
    });

    test('GET /api/v1/gamification/achievements/:userId - should return achievements', async () => {
      const response = await request(app)
        .get('/api/v1/gamification/achievements/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('earnedAchievements');
      expect(response.body.data).toHaveProperty('availableAchievements');
      expect(response.body.data).toHaveProperty('categories');
      expect(response.body.data).toHaveProperty('statistics');
    });

    test('GET /api/v1/gamification/leaderboard - should return leaderboard', async () => {
      const response = await request(app)
        .get('/api/v1/gamification/leaderboard')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('leaderboard');
      expect(response.body.data).toHaveProperty('userRanking');
      expect(response.body.data).toHaveProperty('statistics');
    });

    test('GET /api/v1/gamification/streak/:userId - should return streak data', async () => {
      const response = await request(app)
        .get('/api/v1/gamification/streak/learner-123')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('currentStreak');
      expect(response.body.data).toHaveProperty('longestStreak');
      expect(response.body.data).toHaveProperty('streakHistory');
      expect(response.body.data).toHaveProperty('milestones');
    });
  });

  describe('System Endpoints', () => {
    
    test('GET /api/health - should return health status', async () => {
      const response = await request(app)
        .get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('services');
    });

    test('GET /api/status - should return service status', async () => {
      const response = await request(app)
        .get('/api/status');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('services');
    });

    test('POST /api/v1/analytics/refresh - should trigger manual refresh', async () => {
      const response = await request(app)
        .post('/api/v1/analytics/refresh')
        .set('Authorization', `Bearer ${orgAdminToken}`)
        .set('X-Active-Role', 'org-admin')
        .send({
          userId: 'learner-123',
          role: 'learner',
          analytics: ['velocity', 'skill-gap', 'engagement']
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jobId');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('estimatedCompletion');
      expect(response.body).toHaveProperty('queuedAnalytics');
    });
  });

  describe('Integration Endpoints', () => {
    
    test('GET /api/v1/integration/health - should return integration health', async () => {
      const response = await request(app)
        .get('/api/v1/integration/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('services');
      expect(response.body).toHaveProperty('circuitBreakers');
    });

    test('GET /api/v1/integration/services/:serviceName/status - should return service status', async () => {
      const response = await request(app)
        .get('/api/v1/integration/services/directory/status');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('circuitBreaker');
      expect(response.body).toHaveProperty('endpoints');
    });

    test('GET /api/v1/integration/mock-data/:serviceName - should return mock data', async () => {
      const response = await request(app)
        .get('/api/v1/integration/mock-data/directory')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('mockData');
      expect(response.body).toHaveProperty('metadata');
    });

    test('GET /api/v1/integration/metrics - should return integration metrics', async () => {
      const response = await request(app)
        .get('/api/v1/integration/metrics')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('timeframe');
      expect(response.body).toHaveProperty('services');
      expect(response.body).toHaveProperty('summary');
    });
  });

  describe('Error Handling Tests', () => {
    
    test('Should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/api/v1/learner/analytics/velocity/learner-123');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Should return 403 for wrong role', async () => {
      const response = await request(app)
        .get('/api/v1/trainer/analytics/course-performance/trainer-456')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    test('Should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/v1/learner/analytics/velocity/non-existent-user')
        .set('Authorization', `Bearer ${learnerToken}`)
        .set('X-Active-Role', 'learner');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('Should return 403 for invalid request body', async () => {
      const response = await request(app)
        .post('/api/v1/analytics/refresh')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          invalidField: 'invalid'
        });
      
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });
});
