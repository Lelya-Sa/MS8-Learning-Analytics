/**
 * BFF (Backend-for-Frontend) Integration Tests
 * Tests the BFF layer that aggregates data from microservices
 */

const request = require('supertest');
const app = require('../server');

describe('BFF Integration Layer', () => {
  let authToken;

  beforeAll(async () => {
    // Login as admin to get auth token with proper permissions
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123'
      });
    
    authToken = loginResponse.body.token;
  });

  describe('BFF Analytics Aggregation', () => {
    it('should aggregate learner analytics from multiple microservices', async () => {
      const response = await request(app)
        .get('/api/v1/bff/learner/analytics/user-123')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('learning_velocity');
      expect(response.body).toHaveProperty('mastery_progress');
      expect(response.body).toHaveProperty('engagement_score');
      expect(response.body).toHaveProperty('skill_gaps');
      expect(response.body).toHaveProperty('recommendations');
      expect(response.body).toHaveProperty('data_sources');
      
      // Verify aggregated data structure
      expect(response.body.data_sources).toContain('directory');
      expect(response.body.data_sources).toContain('course_builder');
      expect(response.body.data_sources).toContain('assessment');
    });

    it('should aggregate trainer analytics with course performance data', async () => {
      const response = await request(app)
        .get('/api/v1/bff/trainer/analytics/trainer-789')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('course_performance');
      expect(response.body).toHaveProperty('teaching_effectiveness');
      expect(response.body).toHaveProperty('student_distribution');
      expect(response.body).toHaveProperty('content_effectiveness');
      expect(response.body).toHaveProperty('data_sources');
      
      // Verify microservice data integration
      expect(response.body.data_sources).toContain('course_builder');
      expect(response.body.data_sources).toContain('content_studio');
      expect(response.body.data_sources).toContain('assessment');
    });

    it('should aggregate organization analytics with department metrics', async () => {
      const response = await request(app)
        .get('/api/v1/bff/organization/analytics/org-123')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('learning_velocity');
      expect(response.body).toHaveProperty('strategic_alignment');
      expect(response.body).toHaveProperty('learning_culture');
      expect(response.body).toHaveProperty('department_metrics');
      expect(response.body).toHaveProperty('data_sources');
      
      // Verify all microservices are integrated
      expect(response.body.data_sources.length).toBeGreaterThan(5);
    });
  });

  describe('BFF Data Collection', () => {
    it('should collect data from all microservices in parallel', async () => {
      const response = await request(app)
        .post('/api/v1/bff/data-collection/trigger')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          analytics_type: 'learner',
          microservices: ['directory', 'course_builder', 'assessment', 'skills_engine']
        })
        .expect(200);

      expect(response.body).toHaveProperty('collection_id');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('microservices_status');
      expect(response.body.microservices_status).toHaveProperty('directory');
      expect(response.body.microservices_status).toHaveProperty('course_builder');
      expect(response.body.microservices_status).toHaveProperty('assessment');
      expect(response.body.microservices_status).toHaveProperty('skills_engine');
    });

    it('should handle partial failures gracefully', async () => {
      const response = await request(app)
        .post('/api/v1/bff/data-collection/trigger')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          analytics_type: 'learner',
          microservices: ['directory', 'unavailable_service']
        })
        .expect(200);

      expect(response.body.status).toBe('partial_success');
      expect(response.body.microservices_status.directory).toBe('success');
      expect(response.body.microservices_status.unavailable_service).toBe('failed');
    });
  });

  describe('BFF Circuit Breaker', () => {
    it('should implement circuit breaker for failing microservices', async () => {
      // First, trigger multiple failures
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/v1/bff/data-collection/trigger')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            user_id: 'user-123',
            analytics_type: 'learner',
            microservices: ['failing_service']
          });
      }

      // Circuit should be open now
      const response = await request(app)
        .post('/api/v1/bff/data-collection/trigger')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          analytics_type: 'learner',
          microservices: ['failing_service']
        })
        .expect(503);

      expect(response.body.error).toContain('Circuit breaker open');
    });
  });

  describe('BFF Health Check', () => {
    it('should provide comprehensive health status', async () => {
      const response = await request(app)
        .get('/api/v1/bff/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('microservices');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('cache');
      
      // Verify microservice health
      expect(response.body.microservices).toHaveProperty('directory');
      expect(response.body.microservices).toHaveProperty('course_builder');
      expect(response.body.microservices).toHaveProperty('assessment');
    });
  });

  describe('BFF CORS Configuration', () => {
    it('should allow requests from Vercel frontend domain', async () => {
      const response = await request(app)
        .get('/api/v1/bff/health')
        .set('Origin', 'https://your-frontend.vercel.app')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('https://your-frontend.vercel.app');
    });

    it('should reject requests from unauthorized domains', async () => {
      const response = await request(app)
        .get('/api/v1/bff/health')
        .set('Origin', 'https://malicious-site.com')
        .expect(403);

      expect(response.body.error).toContain('CORS policy violation');
    });
  });
});
