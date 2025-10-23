const request = require('supertest')
const app = require('../server')

describe('Analytics API', () => {
  let authToken

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123'
      })
    
    authToken = loginResponse.body.token
  })

  describe('GET /api/v1/analytics/learner/:userId', () => {
    it('should return learner analytics', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/learner/user-123')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('learning_velocity')
      expect(response.body).toHaveProperty('mastery_progress')
      expect(response.body).toHaveProperty('engagement_score')
      expect(response.body).toHaveProperty('assessment_performance')
      expect(response.body).toHaveProperty('content_effectiveness')
      expect(response.body).toHaveProperty('skill_gaps')
      expect(Array.isArray(response.body.skill_gaps)).toBe(true)
    })

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/learner/user-123')
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })

    it('should validate user ID parameter', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/learner/invalid@id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /api/v1/analytics/trainer/:userId', () => {
    it.skip('should return trainer analytics', async () => {
      // Login as trainer for this test
      const trainerLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'trainer@example.com',
          password: process.env.TEST_USER_PASSWORD || 'test-password-123'
        })
      
      const response = await request(app)
        .get('/api/v1/analytics/trainer/trainer-789')
        .set('Authorization', `Bearer ${trainerLogin.body.token}`)
        .expect(200)

      expect(response.body).toHaveProperty('course_performance')
      expect(response.body).toHaveProperty('course_health')
      expect(response.body).toHaveProperty('teaching_effectiveness')
      expect(response.body).toHaveProperty('student_distribution')
      expect(response.body.student_distribution).toHaveProperty('total_students')
      expect(response.body.student_distribution).toHaveProperty('active_students')
      expect(response.body.student_distribution).toHaveProperty('at_risk_students')
    })

    it('should require trainer role', async () => {
      // Login as learner
      const learnerLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'learner@example.com',
          password: process.env.TEST_USER_PASSWORD || 'test-password-123'
        })

      const response = await request(app)
        .get('/api/v1/analytics/trainer/trainer-123')
        .set('Authorization', `Bearer ${learnerLogin.body.token}`)
        .expect(403)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('permission')
    })
  })

  describe('GET /api/v1/analytics/organization/:organizationId', () => {
    it('should return organization analytics', async () => {
      // Login as org admin for this test
      const adminLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: process.env.TEST_USER_PASSWORD || 'test-password-123'
        })
      
      const response = await request(app)
        .get('/api/v1/analytics/organization/org-123')
        .set('Authorization', `Bearer ${adminLogin.body.token}`)
        .expect(200)

      expect(response.body).toHaveProperty('learning_velocity')
      expect(response.body).toHaveProperty('strategic_alignment')
      expect(response.body).toHaveProperty('learning_culture')
      expect(response.body).toHaveProperty('department_metrics')
      expect(typeof response.body.department_metrics).toBe('object')
    })

    it('should require organization admin role', async () => {
      // Login as learner
      const learnerLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'learner@example.com',
          password: process.env.TEST_USER_PASSWORD || 'test-password-123'
        })

      const response = await request(app)
        .get('/api/v1/analytics/organization/org-123')
        .set('Authorization', `Bearer ${learnerLogin.body.token}`)
        .expect(403)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('permission')
    })
  })

  describe('POST /api/v1/analytics/refresh', () => {
    it('should trigger analytics refresh', async () => {
      const response = await request(app)
        .post('/api/v1/analytics/refresh')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          analytics_type: 'learner'
        })
        .expect(202)

      expect(response.body).toHaveProperty('collection_id')
      expect(response.body).toHaveProperty('status')
      expect(response.body.status).toBe('started')
    })

    it('should validate refresh request body', async () => {
      const response = await request(app)
        .post('/api/v1/analytics/refresh')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('validation')
    })
  })
})
