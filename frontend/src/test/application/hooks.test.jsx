import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { SWRConfig } from 'swr';

// Import hooks to test (these will fail initially - RED phase)
import { useAnalytics, useLearnerAnalytics, useTrainerAnalytics, useOrganizationAnalytics } from '../../application/hooks/useAnalytics';
import { useAuth } from '../../application/hooks/useAuth';
import { useReports } from '../../application/hooks/useReports';

// Mock API functions
import * as api from '../../application/services/api';

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return initial auth state', () => {
    // RED: This test will fail because useAuth doesn't exist yet
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should login user successfully', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'learner',
      organization_id: 'org-123'
    }

    // Mock successful login
    jest.spyOn(api, 'login').mockResolvedValueOnce({
      token: 'mock-jwt-token',
      user: mockUser
    })

    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })
    
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.error).toBeNull()
    })
  })

  it('should handle login errors', async () => {
    // Mock failed login
    jest.spyOn(api, 'login').mockRejectedValueOnce(new Error('Invalid credentials'))

    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      try {
        await result.current.login('wrong@example.com', 'wrongpassword')
      } catch (error) {
        // Expected to throw
      }
    })
    
    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.error).toEqual('Invalid credentials')
    })
  })

  it('should logout user', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'learner',
      organization_id: 'org-123'
    }

    // Mock successful login first
    jest.spyOn(api, 'login').mockResolvedValueOnce({
      token: 'mock-jwt-token',
      user: mockUser
    })

    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    // Now logout
    await act(async () => {
      await result.current.logout()
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})

describe('useAnalytics Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch analytics data', async () => {
    // RED: This test will fail because useAnalytics doesn't exist yet
    const mockAnalytics = {
      learning_velocity: 85.5,
      mastery_progress: 72.3,
      engagement_score: 91.2,
      skill_gaps: [
        { skill: 'JavaScript', priority: 'high', gap_score: 0.3 }
      ],
      source: 'api',
      timestamp: new Date().toISOString()
    }

    // Mock successful API call
    jest.spyOn(api, 'getAnalytics').mockResolvedValueOnce(mockAnalytics)

    const { result } = renderHook(() => useAnalytics({ id: 'user-123', role: 'learner', organization_id: 'org-123' }))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockAnalytics)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('should handle analytics fetch errors', async () => {
    // Mock failed API call
    jest.spyOn(api, 'getAnalytics').mockRejectedValueOnce(new Error('Failed to fetch analytics'))

    const { result } = renderHook(() => useAnalytics({ id: 'user-123', role: 'learner', organization_id: 'org-123' }))

    await waitFor(() => {
      expect(result.current.data).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toEqual('Failed to fetch analytics')
    })
  })

  it('should refresh analytics data', async () => {
    const mockAnalytics = {
      learning_velocity: 85.5,
      mastery_progress: 72.3,
      source: 'api',
      timestamp: new Date().toISOString()
    }

    jest.spyOn(api, 'getAnalytics').mockResolvedValue(mockAnalytics)

    const { result } = renderHook(() => useAnalytics({ id: 'user-123', role: 'learner', organization_id: 'org-123' }))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockAnalytics)
    })

    // Trigger refresh
    await act(async () => {
      await result.current.refresh()
    })

    await waitFor(() => {
      expect(api.getAnalytics).toHaveBeenCalledTimes(2)
    })
  })
})

describe('useLearnerAnalytics Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch learner-specific analytics', async () => {
    // RED: This test will fail because useLearnerAnalytics doesn't exist yet
    const mockLearnerData = {
      learning_velocity: 85.5,
      mastery_progress: 72.3,
      engagement_score: 91.2,
      skill_gaps: [
        { skill: 'JavaScript', priority: 'high', gap_score: 0.3 },
        { skill: 'React', priority: 'medium', gap_score: 0.2 }
      ],
      assessment_performance: 78.5,
      content_effectiveness: 82.1,
      source: 'api',
      timestamp: new Date().toISOString()
    }

    jest.spyOn(api, 'getLearnerAnalytics').mockResolvedValueOnce(mockLearnerData)

    const { result } = renderHook(() => useLearnerAnalytics('user-123'))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockLearnerData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('should handle learner analytics errors', async () => {
    jest.spyOn(api, 'getLearnerAnalytics').mockRejectedValueOnce(new Error('Access denied'))

    const { result } = renderHook(() => useLearnerAnalytics('user-123'))

    await waitFor(() => {
      expect(result.current.data).toBeNull()
      expect(result.current.error).toEqual('Access denied')
    })
  })
})

describe('useTrainerAnalytics Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch trainer-specific analytics', async () => {
    // RED: This test will fail because useTrainerAnalytics doesn't exist yet
    const mockTrainerData = {
      course_performance: 88.5,
      course_health: 92.3,
      student_distribution: {
        total_students: 150,
        active_students: 120,
        at_risk_students: 15
      },
      teaching_effectiveness: 85.7,
      source: 'api',
      timestamp: new Date().toISOString()
    }

    jest.spyOn(api, 'getTrainerAnalytics').mockResolvedValueOnce(mockTrainerData)

    const { result } = renderHook(() => useTrainerAnalytics('trainer-123'))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockTrainerData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })
})

describe('useOrganizationAnalytics Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch organization-specific analytics', async () => {
    // RED: This test will fail because useOrganizationAnalytics doesn't exist yet
    const mockOrgData = {
      learning_velocity: 78.5,
      strategic_alignment: 85.2,
      department_metrics: {
        engineering: { velocity: 82.1, engagement: 88.5 },
        marketing: { velocity: 75.3, engagement: 79.2 }
      },
      learning_culture: 91.8
    }

    jest.spyOn(api, 'getOrganizationAnalytics').mockResolvedValueOnce(mockOrgData)

    const { result } = renderHook(() => useOrganizationAnalytics('org-123'))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockOrgData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })
})

describe('useReports Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch user reports', async () => {
    // RED: This test will fail because useReports doesn't exist yet
    const mockReports = [
      {
        id: 'report-1',
        type: 'learner',
        format: 'pdf',
        status: 'completed',
        created_at: '2024-01-15T10:00:00Z',
        expires_at: '2024-01-22T10:00:00Z',
        download_url: 'https://example.com/report-1.pdf'
      },
      {
        id: 'report-2',
        type: 'learner',
        format: 'csv',
        status: 'processing',
        created_at: '2024-01-15T11:00:00Z',
        expires_at: '2024-01-22T11:00:00Z',
        download_url: null
      }
    ]

    jest.spyOn(api, 'getReports').mockResolvedValueOnce(mockReports)

    const { result } = renderHook(() => useReports('user-123'))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockReports)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('should generate new report', async () => {
    const mockReport = {
      id: 'report-3',
      type: 'learner',
      format: 'pdf',
      status: 'processing',
      created_at: '2024-01-15T12:00:00Z',
      expires_at: '2024-01-22T12:00:00Z',
      download_url: null
    }

    jest.spyOn(api, 'generateReport').mockResolvedValueOnce(mockReport)

    const { result } = renderHook(() => useReports('user-123'))

    await result.current.generateReport('learner', 'pdf')

    await waitFor(() => {
      expect(result.current.data).toContainEqual(mockReport)
    })
  })

  it('should handle report generation errors', async () => {
    jest.spyOn(api, 'generateReport').mockRejectedValueOnce(new Error('Report generation failed'))

    const { result } = renderHook(() => useReports('user-123'))

    await result.current.generateReport('learner', 'pdf')

    await waitFor(() => {
      expect(result.current.error).toEqual('Report generation failed')
    })
  })
})

// Test SWR configuration
describe('SWR Configuration', () => {
  it('should use correct SWR configuration', () => {
    const wrapper = ({ children }) => (
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
          refreshInterval: 300000, // 5 minutes
          dedupingInterval: 2000, // 2 seconds
          errorRetryCount: 3,
          errorRetryInterval: 5000, // 5 seconds
          onError: (error) => {
            console.error('SWR Error:', error)
          }
        }}
      >
        {children}
      </SWRConfig>
    )

    const { result } = renderHook(() => useAnalytics('user-123'), { wrapper })

    expect(result.current).toBeDefined()
  })
})
