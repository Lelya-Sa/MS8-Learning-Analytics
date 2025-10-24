const request = require('supertest')
const app = require('../server')

describe('Multi-Role Analytics API', () => {
  let multiRoleToken
  let superAdminToken

  beforeAll(async () => {
    // Login as multi-role user
    const multiRoleLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'multi@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123'
      })
    multiRoleToken = multiRoleLogin.body.token

    // Login as super admin
    const superAdminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'superadmin@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123'
      })
    superAdminToken = superAdminLogin.body.token
  })

  describe('Multi-Role User (Learner + Trainer)', () => {
    it('should fetch learner analytics for multi-role user', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/learner/multi-role-202')
        .set('Authorization', `Bearer ${multiRoleToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('learning_velocity')
      expect(response.body).toHaveProperty('mastery_progress')
      expect(response.body).toHaveProperty('engagement_score')
      expect(response.body.learning_velocity).toBeGreaterThan(0)
    })

    it('should fetch trainer analytics for multi-role user', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/trainer/multi-role-202')
        .set('Authorization', `Bearer ${multiRoleToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('course_performance')
      expect(response.body).toHaveProperty('course_health')
      expect(response.body).toHaveProperty('teaching_effectiveness')
      expect(response.body).toHaveProperty('student_distribution')
      expect(response.body.course_performance).toBeGreaterThan(0)
    })
  })

  describe('Super Admin (All Roles)', () => {
    it('should fetch learner analytics for super admin', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/learner/super-admin-303')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('learning_velocity')
      expect(response.body).toHaveProperty('mastery_progress')
      expect(response.body).toHaveProperty('engagement_score')
      expect(response.body.learning_velocity).toBeGreaterThan(0)
    })

    it('should fetch trainer analytics for super admin', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/trainer/super-admin-303')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('course_performance')
      expect(response.body).toHaveProperty('course_health')
      expect(response.body).toHaveProperty('teaching_effectiveness')
      expect(response.body).toHaveProperty('student_distribution')
      expect(response.body.course_performance).toBeGreaterThan(0)
    })

    it('should fetch organization analytics for super admin', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/organization/org-123')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('learning_velocity')
      expect(response.body).toHaveProperty('strategic_alignment')
      expect(response.body).toHaveProperty('learning_culture')
    })
  })

  describe('Analytics Data Quality', () => {
    it('should return different analytics for different multi-role users', async () => {
      const multiRoleResponse = await request(app)
        .get('/api/v1/analytics/learner/multi-role-202')
        .set('Authorization', `Bearer ${multiRoleToken}`)

      const superAdminResponse = await request(app)
        .get('/api/v1/analytics/learner/super-admin-303')
        .set('Authorization', `Bearer ${superAdminToken}`)

      expect(multiRoleResponse.body.learning_velocity).not.toBe(
        superAdminResponse.body.learning_velocity
      )
    })

    it('should return trainer analytics with student distribution', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/trainer/multi-role-202')
        .set('Authorization', `Bearer ${multiRoleToken}`)

      expect(response.body.student_distribution).toHaveProperty('total_students')
      expect(response.body.student_distribution).toHaveProperty('active_students')
      expect(response.body.student_distribution).toHaveProperty('at_risk_students')
      expect(response.body.student_distribution.total_students).toBeGreaterThan(0)
    })
  })
})

