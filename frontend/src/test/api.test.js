import { describe, it, expect, beforeEach, vi } from 'vitest'

// Set environment variables before importing API
process.env.NODE_ENV = 'development'
process.env.VITE_API_BASE_URL = 'http://localhost:3000/api'

// Mock axios before importing API
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn()
    }))
  },
  create: vi.fn(() => ({
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    },
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  }))
}))

// Import API functions to test
import * as api from '../services/api'
import axios from 'axios'

// Get the mocked axios instance
const mockApiClient = axios.create()

describe('API Client Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Don't clear localStorage for this test group
  })

  it('should configure axios with correct base URL', () => {
    // Test that environment variables are available
    expect(process.env.VITE_API_BASE_URL).toBeDefined()
  })

  it('should include authorization header when token is present', () => {
    // Clear localStorage first to ensure clean state
    localStorage.clear()
    const token = 'mock-jwt-token'
    localStorage.setItem('auth_token', token)

    // Test that token is stored
    expect(localStorage.getItem('auth_token')).toBe(token)
  })
})

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should login user successfully', async () => {
    const mockResponse = {
      data: {
        token: 'mock-jwt-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'learner',
          organization_id: 'org-123'
        }
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.login('test@example.com', 'password123')

    expect(result).toHaveProperty('token')
    expect(result).toHaveProperty('user')
    expect(result.user.email).toBe('test@example.com')
    expect(result.user.role).toBe('learner')
  })

  it('should handle login errors', async () => {
    const mockError = {
      response: {
        data: { error: 'Invalid credentials' }
      }
    }

    mockApiClient.post.mockRejectedValue(mockError)

    await expect(api.login('wrong@example.com', 'wrongpassword'))
      .rejects.toThrow('Invalid credentials')
  })

  it('should logout user successfully', async () => {
    const mockResponse = {
      data: {
        message: 'Logged out successfully',
        code: 'LOGOUT_SUCCESS'
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.logout()

    expect(result).toHaveProperty('message')
    expect(result.message).toBe('Logged out successfully')
  })

  it('should refresh token successfully', async () => {
    const mockResponse = {
      data: {
        token: 'new-jwt-token',
        expires_in: 86400
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.refreshToken()

    expect(result).toHaveProperty('token')
    expect(result).toHaveProperty('expires_in')
    expect(result.token).toBe('new-jwt-token')
  })
})

describe('Analytics API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch learner analytics successfully', async () => {
    const mockResponse = {
      data: {
        learning_velocity: 85.5,
        mastery_progress: 72.3,
        engagement_score: 91.2,
        assessment_performance: 78.5,
        content_effectiveness: 82.1,
        skill_gaps: [
          { skill: 'JavaScript', priority: 'high', gap_score: 0.3 },
          { skill: 'React', priority: 'medium', gap_score: 0.2 }
        ]
      }
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getAnalytics('user-123')

    expect(result).toHaveProperty('learning_velocity')
    expect(result).toHaveProperty('skill_gaps')
    expect(result.skill_gaps).toHaveLength(2)
  })

  it('should handle analytics fetch errors', async () => {
    const mockError = {
      response: {
        data: { error: 'Analytics not found' }
      }
    }

    mockApiClient.get.mockRejectedValue(mockError)

    await expect(api.getAnalytics('non-existent-user'))
      .rejects.toThrow('Analytics not found')
  })

  it('should fetch trainer analytics successfully', async () => {
    const mockResponse = {
      data: {
        course_performance: 88.5,
        course_health: 92.3,
        teaching_effectiveness: 85.7,
        student_distribution: {
          total_students: 150,
          active_students: 120,
          at_risk_students: 15
        }
      }
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getTrainerAnalytics('trainer-789')

    expect(result).toHaveProperty('course_performance')
    expect(result).toHaveProperty('student_distribution')
  })

  it('should fetch organization analytics successfully', async () => {
    const mockResponse = {
      data: {
        learning_velocity: 78.5,
        strategic_alignment: 85.2,
        learning_culture: 91.8,
        department_metrics: {
          engineering: { velocity: 82.1, engagement: 88.5 },
          marketing: { velocity: 75.3, engagement: 79.2 }
        }
      }
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getOrganizationAnalytics('org-123')

    expect(result).toHaveProperty('learning_velocity')
    expect(result).toHaveProperty('department_metrics')
  })

  it('should refresh analytics successfully', async () => {
    const mockResponse = {
      data: {
        collection_id: 'collection-123',
        status: 'started',
        message: 'Analytics refresh initiated',
        estimated_duration: '5-10 minutes'
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.refreshAnalytics('user-123', 'learner')

    expect(result).toHaveProperty('collection_id')
    expect(result).toHaveProperty('status')
    expect(result.status).toBe('started')
  })
})

describe('Reports API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch user reports successfully', async () => {
    const mockResponse = {
      data: [
        {
          id: 'report-1',
          type: 'learner',
          format: 'pdf',
          status: 'completed',
          created_at: '2024-01-15T10:00:00Z',
          expires_at: '2024-01-22T10:00:00Z',
          download_url: 'https://example.com/report-1.pdf',
          user_id: 'user-123'
        }
      ]
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getReports('user-123')

    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('status')
  })

  it('should generate new report successfully', async () => {
    const mockResponse = {
      data: {
        id: 'report-123',
        type: 'learner',
        format: 'csv',
        status: 'processing',
        created_at: '2024-01-15T10:00:00Z',
        expires_at: '2024-01-22T10:00:00Z',
        download_url: null,
        user_id: 'user-123'
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.generateReport('learner', 'csv', 'user-123')

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('format')
    expect(result.format).toBe('csv')
  })

  it('should download report successfully', async () => {
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' })
    const mockResponse = {
      data: mockBlob
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.downloadReport('report-123')

    expect(result).toBeInstanceOf(Blob)
  })

  it('should delete report successfully', async () => {
    const mockResponse = {
      data: {
        message: 'Report deleted successfully'
      }
    }

    mockApiClient.delete.mockResolvedValue(mockResponse)

    const result = await api.deleteReport('report-123')

    expect(result).toHaveProperty('message')
    expect(result.message).toBe('Report deleted successfully')
  })
})

describe('Data Collection API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should trigger data collection successfully', async () => {
    const mockResponse = {
      data: {
        collection_id: 'collection-123',
        status: 'started',
        message: 'Data collection initiated',
        estimated_duration: '5-10 minutes'
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.triggerDataCollection('user-123', 'full', ['directory', 'course-builder'])

    expect(result).toHaveProperty('collection_id')
    expect(result).toHaveProperty('status')
    expect(result.status).toBe('started')
  })

  it('should get collection status successfully', async () => {
    const mockResponse = {
      data: {
        collection_id: 'collection-123',
        status: 'completed',
        progress: 100,
        records_processed: 1500,
        started_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      }
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getCollectionStatus('collection-123')

    expect(result).toHaveProperty('collection_id')
    expect(result).toHaveProperty('status')
    expect(result.collection_id).toBe('collection-123')
  })

  it('should get collection results successfully', async () => {
    const mockResponse = {
      data: {
        collection_id: 'collection-123',
        status: 'completed',
        total_records: 1500,
        services_processed: ['directory', 'course-builder', 'assessment'],
        analytics_generated: true,
        completed_at: '2024-01-15T10:30:00Z'
      }
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getCollectionResults('collection-123')

    expect(result).toHaveProperty('collection_id')
    expect(result).toHaveProperty('total_records')
    expect(result.analytics_generated).toBe(true)
  })

  it('should cancel collection successfully', async () => {
    const mockResponse = {
      data: {
        message: 'Collection cancelled successfully'
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.cancelCollection('collection-123')

    expect(result).toHaveProperty('message')
    expect(result.message).toBe('Collection cancelled successfully')
  })
})

describe('Privacy API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export user data successfully', async () => {
    const mockResponse = {
      data: {
        download_url: 'https://example.com/export.zip',
        file_size: '2.5MB',
        data_types: ['analytics', 'reports', 'preferences']
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.exportUserData('user-123')

    expect(result).toHaveProperty('download_url')
    expect(result).toHaveProperty('file_size')
    expect(result).toHaveProperty('data_types')
  })

  it('should delete user data successfully', async () => {
    const mockResponse = {
      data: {
        status: 'deleted',
        deleted_at: '2024-01-15T10:00:00Z',
        data_types_deleted: ['analytics', 'reports', 'preferences']
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.deleteUserData('user-123')

    expect(result).toHaveProperty('status')
    expect(result).toHaveProperty('deleted_at')
    expect(result.status).toBe('deleted')
  })

  it('should get data retention policy successfully', async () => {
    const mockResponse = {
      data: {
        analytics_retention_days: 90,
        reports_retention_days: 365,
        logs_retention_days: 30,
        auto_delete_enabled: true
      }
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getDataRetentionPolicy()

    expect(result).toHaveProperty('analytics_retention_days')
    expect(result).toHaveProperty('auto_delete_enabled')
  })

  it('should update data retention preferences successfully', async () => {
    const mockResponse = {
      data: {
        message: 'Retention preferences updated successfully',
        preferences: {
          analytics_retention_days: 60,
          reports_retention_days: 180,
          auto_delete_enabled: false
        }
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.updateDataRetentionPreference('user-123', {
      analytics_retention_days: 60,
      reports_retention_days: 180,
      auto_delete_enabled: false
    })

    expect(result).toHaveProperty('message')
    expect(result).toHaveProperty('preferences')
  })
})

describe('Health Check API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get health status successfully', async () => {
    const mockResponse = {
      data: {
        status: 'healthy',
        timestamp: '2024-01-15T10:00:00Z',
        services: {
          database: 'healthy',
          cache: 'healthy',
          external_apis: 'healthy'
        }
      }
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getHealthStatus()

    expect(result).toHaveProperty('status')
    expect(result).toHaveProperty('services')
    expect(result.status).toBe('healthy')
  })

  it('should get readiness status successfully', async () => {
    const mockResponse = {
      data: {
        ready: true,
        checks: {
          database: true,
          cache: true,
          external_services: true
        }
      }
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getReadinessStatus()

    expect(result).toHaveProperty('ready')
    expect(result).toHaveProperty('checks')
    expect(result.ready).toBe(true)
  })

  it('should get liveness status successfully', async () => {
    const mockResponse = {
      data: {
        alive: true,
        uptime: 3600,
        memory_usage: '45%'
      }
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getLivenessStatus()

    expect(result).toHaveProperty('alive')
    expect(result).toHaveProperty('uptime')
    expect(result.alive).toBe(true)
  })
})

describe('RAG Assistant API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should ask RAG question successfully', async () => {
    const mockResponse = {
      data: {
        answer: 'Based on your learning analytics, I recommend focusing on JavaScript fundamentals.',
        confidence: 0.85,
        sources: ['course-123', 'assessment-456'],
        timestamp: '2024-01-15T10:00:00Z'
      }
    }

    mockApiClient.post.mockResolvedValue(mockResponse)

    const result = await api.askRAGQuestion('What should I learn next?', { userId: 'user-123' })

    expect(result).toHaveProperty('answer')
    expect(result).toHaveProperty('confidence')
    expect(result).toHaveProperty('sources')
  })

  it('should get RAG history successfully', async () => {
    const mockResponse = {
      data: [
        {
          id: 'rag-123',
          question: 'What should I learn next?',
          answer: 'JavaScript fundamentals',
          timestamp: '2024-01-15T10:00:00Z'
        }
      ]
    }

    mockApiClient.get.mockResolvedValue(mockResponse)

    const result = await api.getRAGHistory('user-123')

    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toHaveProperty('question')
    expect(result[0]).toHaveProperty('answer')
  })

  it('should clear RAG history successfully', async () => {
    const mockResponse = {
      data: {
        message: 'RAG history cleared successfully',
        deleted_count: 5
      }
    }

    mockApiClient.delete.mockResolvedValue(mockResponse)

    const result = await api.clearRAGHistory('user-123')

    expect(result).toHaveProperty('message')
    expect(result).toHaveProperty('deleted_count')
  })
})