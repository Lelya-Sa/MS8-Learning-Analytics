const request = require('supertest')
const app = require('../server')

describe('Reports API', () => {
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

  describe('GET /api/v1/reports', () => {
    it('should return user reports', async () => {
      const response = await request(app)
        .get('/api/v1/reports')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id')
        expect(response.body[0]).toHaveProperty('type')
        expect(response.body[0]).toHaveProperty('format')
        expect(response.body[0]).toHaveProperty('status')
        expect(response.body[0]).toHaveProperty('created_at')
        expect(response.body[0]).toHaveProperty('expires_at')
      }
    })

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/reports')
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/reports?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('POST /api/v1/reports/generate', () => {
    it('should generate new report', async () => {
      const reportData = {
        type: 'learner',
        format: 'pdf',
        user_id: 'user-123'
      }

      const response = await request(app)
        .post('/api/v1/reports/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reportData)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('type', 'learner')
      expect(response.body).toHaveProperty('format', 'pdf')
      expect(response.body).toHaveProperty('status', 'processing')
      expect(response.body).toHaveProperty('created_at')
      expect(response.body).toHaveProperty('expires_at')
    })

    it('should validate report generation request', async () => {
      const response = await request(app)
        .post('/api/v1/reports/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'invalid-type',
          format: 'invalid-format'
        })
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('validation')
    })

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/reports/generate')
        .send({
          type: 'learner',
          format: 'pdf'
        })
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /api/v1/reports/:reportId/download', () => {
    it('should download completed report', async () => {
      // Use a pre-existing completed report
      const reportId = 'completed-report-id'

      const response = await request(app)
        .get(`/api/v1/reports/${reportId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.headers['content-type']).toContain('application/pdf')
    })

    it('should return 404 for non-existent report', async () => {
      const response = await request(app)
        .get('/api/v1/reports/non-existent-id/download')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('not found')
    })

    it('should return 400 for processing report', async () => {
      // Generate a report (status: processing)
      const generateResponse = await request(app)
        .post('/api/v1/reports/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'learner',
          format: 'pdf',
          user_id: 'user-123'
        })

      const reportId = generateResponse.body.id

      const response = await request(app)
        .get(`/api/v1/reports/${reportId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('processing')
    })
  })

  describe('DELETE /api/v1/reports/:reportId', () => {
    it('should delete report', async () => {
      // First generate a report
      const generateResponse = await request(app)
        .post('/api/v1/reports/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'learner',
          format: 'pdf',
          user_id: 'user-123'
        })

      const reportId = generateResponse.body.id

      const response = await request(app)
        .delete(`/api/v1/reports/${reportId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('deleted')
    })

    it('should return 404 for non-existent report', async () => {
      const response = await request(app)
        .delete('/api/v1/reports/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })
})
