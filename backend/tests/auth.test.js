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

  describe('Multi-Role Authentication', () => {
    it('should login multi-role user (learner + trainer)', async () => {
      const loginData = {
        email: 'multi@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user).toHaveProperty('roles')
      expect(response.body.user.roles).toEqual(['learner', 'trainer'])
      expect(response.body.user.role).toBe('learner') // Primary role
    })

    it('should login super admin with all roles', async () => {
      const loginData = {
        email: 'superadmin@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user).toHaveProperty('roles')
      expect(response.body.user.roles).toEqual(['learner', 'trainer', 'org_admin'])
      expect(response.body.user.role).toBe('org_admin') // Primary role
    })

    it('should include roles array in JWT token for multi-role users', async () => {
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'multi@example.com',
          password: process.env.TEST_USER_PASSWORD || 'test-password-123'
        })

      const token = loginResponse.body.token
      expect(token).toBeDefined()

      // Decode JWT to verify roles are included
      const jwt = require('jsonwebtoken')
      const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret-key-DO-NOT-USE-IN-PRODUCTION'
      const decoded = jwt.verify(token, JWT_SECRET)

      expect(decoded).toHaveProperty('roles')
      expect(decoded.roles).toEqual(['learner', 'trainer'])
    })

    it('should allow single-role users to have roles array', async () => {
      const loginData = {
        email: 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body.user).toHaveProperty('roles')
      expect(response.body.user.roles).toEqual(['learner'])
    })
  })
})
