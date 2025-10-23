const request = require('supertest')
const app = require('../server')

describe('Authentication API', () => {
  describe('POST /api/v1/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user).toHaveProperty('id')
      expect(response.body.user).toHaveProperty('email')
      expect(response.body.user).toHaveProperty('role')
      expect(response.body.user).toHaveProperty('organization_id')
    })

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'wrong-password-for-testing'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('Invalid credentials')
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('validation')
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('should logout authenticated user', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: process.env.TEST_USER_PASSWORD || 'test-password-123'
        })

      const token = loginResponse.body.token

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('successfully')
    })

    it('should reject logout without token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(401)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('token')
    })
  })

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh valid token', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: process.env.TEST_USER_PASSWORD || 'test-password-123'
        })

      const token = loginResponse.body.token

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('expires_in')
    })

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403)

      expect(response.body).toHaveProperty('error')
    })
  })
})
