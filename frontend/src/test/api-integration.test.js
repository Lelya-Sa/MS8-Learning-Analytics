import { describe, it, expect, beforeEach, vi } from 'vitest'
import TEST_CONFIG, { getEnvironmentInfo } from './config'

// Set environment variables before importing API
process.env.NODE_ENV = 'test'
process.env.VITE_API_BASE_URL = TEST_CONFIG.API_BASE_URL

// Log environment info
const envInfo = getEnvironmentInfo()
console.log('🧪 Running tests against:', envInfo.isCloud ? 'CLOUD' : 'LOCAL', 'environment')
console.log('🔗 API URL:', envInfo.apiUrl)

// Import API functions to test
import * as api from '../services/api'

describe('API Integration Tests (Real Backend)', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('Authentication API', () => {
    it('should login user successfully with real backend', async () => {
      const { email, password } = TEST_CONFIG
      const result = await api.login(email, password)
      
      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('user')
      expect(result.user.email).toBe(email)
      expect(result.user.role).toBe('learner')
      
      // Store token for subsequent tests
      localStorage.setItem('auth_token', result.token)
    })

    it('should handle login errors with real backend', async () => {
      await expect(api.login('wrong@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials')
    })

    it('should logout user successfully with real backend', async () => {
      // First login to get a token
      const loginResult = await api.login('test@example.com', 'test-password-123')
      localStorage.setItem('auth_token', loginResult.token)
      
      const result = await api.logout()
      
      expect(result).toHaveProperty('message')
      expect(result.message).toBe('Logged out successfully')
    })

    it('should refresh token successfully with real backend', async () => {
      // First login to get a token
      const loginResult = await api.login('test@example.com', 'test-password-123')
      localStorage.setItem('auth_token', loginResult.token)
      
      const result = await api.refreshToken()
      
      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('expires_in')
    })
  })

  describe('Analytics API', () => {
    beforeEach(async () => {
      // Login before each analytics test
      const loginResult = await api.login('test@example.com', 'test-password-123')
      localStorage.setItem('auth_token', loginResult.token)
    })

    it('should fetch learner analytics successfully with real backend', async () => {
      const result = await api.getAnalytics('user-123')
      
      expect(result).toHaveProperty('learning_velocity')
      expect(result).toHaveProperty('mastery_progress')
      expect(result).toHaveProperty('engagement_score')
      expect(result).toHaveProperty('skill_gaps')
    })

    it('should fetch trainer analytics successfully with real backend', async () => {
      // Login as trainer
      const loginResult = await api.login('trainer@example.com', 'test-password-123')
      localStorage.setItem('auth_token', loginResult.token)
      
      const result = await api.getTrainerAnalytics('trainer-789')
      
      expect(result).toHaveProperty('course_performance')
      expect(result).toHaveProperty('course_health')
      expect(result).toHaveProperty('teaching_effectiveness')
    })

    it('should fetch organization analytics successfully with real backend', async () => {
      // Login as org admin
      const loginResult = await api.login('admin@example.com', 'test-password-123')
      localStorage.setItem('auth_token', loginResult.token)
      
      const result = await api.getOrganizationAnalytics('org-123')
      
      expect(result).toHaveProperty('learning_velocity')
      expect(result).toHaveProperty('strategic_alignment')
      expect(result).toHaveProperty('learning_culture')
    })

    it('should refresh analytics successfully with real backend', async () => {
      const result = await api.refreshAnalytics('user-123', 'learner')
      
      expect(result).toHaveProperty('collection_id')
      expect(result).toHaveProperty('status')
      expect(result.status).toBe('started')
    })
  })

  describe('Reports API', () => {
    beforeEach(async () => {
      // Login before each reports test
      const loginResult = await api.login('test@example.com', 'test-password-123')
      localStorage.setItem('auth_token', loginResult.token)
    })

    it('should fetch user reports successfully with real backend', async () => {
      const result = await api.getReports('user-123')
      
      expect(Array.isArray(result)).toBe(true)
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id')
        expect(result[0]).toHaveProperty('status')
      }
    })

    it('should generate new report successfully with real backend', async () => {
      const result = await api.generateReport('learner', 'csv', 'user-123')
      
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('format')
      expect(result).toHaveProperty('status')
      expect(result.format).toBe('csv')
    })

    it('should download report successfully with real backend', async () => {
      // First generate a report
      const report = await api.generateReport('learner', 'pdf', 'user-123')
      
      // Wait a moment for processing
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Try to download (this might fail if report is still processing)
      try {
        const result = await api.downloadReport(report.id)
        expect(result).toBeDefined()
      } catch (error) {
        // Expected if report is still processing
        expect(error.message).toContain('processing')
      }
    })

    it('should delete report successfully with real backend', async () => {
      // First generate a report
      const report = await api.generateReport('learner', 'pdf', 'user-123')
      
      const result = await api.deleteReport(report.id)
      
      expect(result).toHaveProperty('message')
      expect(result.message).toBe('Report deleted successfully')
    })
  })

  describe('Data Collection API', () => {
    beforeEach(async () => {
      // Login before each data collection test
      const loginResult = await api.login('test@example.com', 'test-password-123')
      localStorage.setItem('auth_token', loginResult.token)
    })

    it('should trigger data collection successfully with real backend', async () => {
      const result = await api.triggerDataCollection('user-123', 'full', ['directory', 'course-builder'])
      
      expect(result).toHaveProperty('collection_id')
      expect(result).toHaveProperty('status')
      expect(result.status).toBe('started')
    })

    it('should get collection status successfully with real backend', async () => {
      // First trigger a collection
      const collection = await api.triggerDataCollection('user-123', 'full', ['directory'])
      
      const result = await api.getCollectionStatus(collection.collection_id)
      
      expect(result).toHaveProperty('collection_id')
      expect(result).toHaveProperty('status')
      expect(result.collection_id).toBe(collection.collection_id)
    })

    it('should get collection results successfully with real backend', async () => {
      // Use the pre-existing completed collection
      const result = await api.getCollectionResults('completed-collection-id')
      
      expect(result).toHaveProperty('collection_id')
      expect(result).toHaveProperty('status')
      expect(result.status).toBe('completed')
    })

    it('should cancel collection successfully with real backend', async () => {
      // First trigger a collection
      const collection = await api.triggerDataCollection('user-123', 'full', ['directory'])
      
      const result = await api.cancelCollection(collection.collection_id)
      
      expect(result).toHaveProperty('message')
      expect(result.message).toBe('Collection cancelled successfully')
    })
  })
})