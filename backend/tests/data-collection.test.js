const request = require('supertest')
const app = require('../server')

describe('Data Collection API', () => {
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

  describe('POST /api/v1/data-collection/trigger', () => {
    it('should trigger data collection', async () => {
      const collectionData = {
        user_id: 'user-123',
        collection_type: 'full',
        services: ['directory', 'course-builder', 'assessment']
      }

      const response = await request(app)
        .post('/api/v1/data-collection/trigger')
        .set('Authorization', `Bearer ${authToken}`)
        .send(collectionData)
        .expect(202)

      expect(response.body).toHaveProperty('collection_id')
      expect(response.body).toHaveProperty('status', 'started')
      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('estimated_duration')
    })

    it('should validate collection request', async () => {
      const response = await request(app)
        .post('/api/v1/data-collection/trigger')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('validation')
    })

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/data-collection/trigger')
        .send({
          user_id: 'user-123'
        })
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /api/v1/data-collection/:collectionId/status', () => {
    it('should return collection status', async () => {
      // First trigger a collection
      const triggerResponse = await request(app)
        .post('/api/v1/data-collection/trigger')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          collection_type: 'full'
        })

      const collectionId = triggerResponse.body.collection_id

      const response = await request(app)
        .get(`/api/v1/data-collection/${collectionId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('collection_id')
      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('progress')
      expect(response.body).toHaveProperty('records_processed')
      expect(response.body).toHaveProperty('started_at')
      expect(response.body).toHaveProperty('updated_at')
    })

    it('should return 404 for non-existent collection', async () => {
      const response = await request(app)
        .get('/api/v1/data-collection/non-existent-id/status')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /api/v1/data-collection/:collectionId/results', () => {
    it('should return collection results when completed', async () => {
      // Use a pre-existing completed collection
      const collectionId = 'completed-collection-id'

      const response = await request(app)
        .get(`/api/v1/data-collection/${collectionId}/results`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('collection_id')
      expect(response.body).toHaveProperty('status', 'completed')
      expect(response.body).toHaveProperty('total_records')
      expect(response.body).toHaveProperty('services_processed')
      expect(response.body).toHaveProperty('analytics_generated')
      expect(response.body).toHaveProperty('completed_at')
    })

    it('should return 400 for incomplete collection', async () => {
      // Trigger a collection (status: started)
      const triggerResponse = await request(app)
        .post('/api/v1/data-collection/trigger')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          collection_type: 'full'
        })

      const collectionId = triggerResponse.body.collection_id

      const response = await request(app)
        .get(`/api/v1/data-collection/${collectionId}/results`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('not completed')
    })
  })

  describe('POST /api/v1/data-collection/:collectionId/cancel', () => {
    it('should cancel running collection', async () => {
      // First trigger a collection
      const triggerResponse = await request(app)
        .post('/api/v1/data-collection/trigger')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          collection_type: 'full'
        })

      const collectionId = triggerResponse.body.collection_id

      const response = await request(app)
        .post(`/api/v1/data-collection/${collectionId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('cancelled')
    })

    it('should return 400 for completed collection', async () => {
      // Mock a completed collection
      const response = await request(app)
        .post('/api/v1/data-collection/completed-collection-id/cancel')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('Cannot cancel')
    })
  })
})
