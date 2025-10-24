/**
 * Analytics Service with Mock Data Fallback
 * Implements hybrid approach: SWR caching + centralized fallback logic
 */

import * as api from './api'
import { mockLearnerAnalytics } from './mockAnalyticsData'

// Mock data that matches the expected API responses
const mockAnalyticsData = {
  learner: {
    learning_velocity: 85.5,
    mastery_progress: 72.3,
    engagement_score: 91.2,
    skill_gaps: [
      { skill: 'JavaScript', gap_score: 0.3, priority: 'high' },
      { skill: 'React', gap_score: 0.2, priority: 'medium' },
      { skill: 'Node.js', gap_score: 0.1, priority: 'low' }
    ],
    assessment_performance: 78.5,
    content_effectiveness: 82.1,
    learning_path_progress: [
      { topic: 'JavaScript Fundamentals', progress: 85, completed: true },
      { topic: 'React Components', progress: 72, completed: false },
      { topic: 'State Management', progress: 45, completed: false }
    ],
    chart_data: {
      learning_velocity_trend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Learning Velocity',
          data: [75, 80, 85, 85.5],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.4
        }]
      },
      skill_levels: {
        labels: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        datasets: [{
          label: 'Skill Levels',
          data: [85, 78, 92, 65],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ]
        }]
      }
    }
  },
  trainer: {
    course_performance: 88.5,
    course_health: 92.3,
    teaching_effectiveness: 85.7,
    student_distribution: {
      total_students: 150,
      active_students: 120,
      at_risk_students: 15,
      completed_students: 95
    },
    course_metrics: [
      { course: 'JavaScript Basics', completion_rate: 85, satisfaction: 4.2 },
      { course: 'React Fundamentals', completion_rate: 78, satisfaction: 4.5 },
      { course: 'Advanced Patterns', completion_rate: 65, satisfaction: 4.0 }
    ],
    chart_data: {
      student_progress: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Active Students',
            data: [120, 125, 118, 120],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)'
          },
          {
            label: 'At Risk',
            data: [20, 18, 22, 15],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)'
          }
        ]
      }
    }
  },
  organization: {
    learning_velocity: 78.5,
    strategic_alignment: 85.2,
    learning_culture: 91.8,
    department_metrics: {
      engineering: { velocity: 82.1, engagement: 88.5, completion_rate: 85 },
      marketing: { velocity: 75.3, engagement: 79.2, completion_rate: 78 },
      sales: { velocity: 80.1, engagement: 85.3, completion_rate: 82 }
    },
    chart_data: {
      department_performance: {
        labels: ['Engineering', 'Marketing', 'Sales'],
        datasets: [{
          label: 'Learning Velocity',
          data: [82.1, 75.3, 80.1],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 205, 86, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)'
          ]
        }]
      }
    }
  }
}

const mockReportsData = [
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

/**
 * Analytics Service Class
 * Handles API calls with automatic fallback to mock data
 */
class AnalyticsService {
  constructor() {
    this.useMockData = false
    this.mockDelay = 500 // Simulate API delay
  }

  /**
   * Enable mock data mode (for testing or API failures)
   */
  enableMockData() {
    this.useMockData = true
    console.log('🔧 Analytics Service: Using mock data')
  }

  /**
   * Disable mock data mode (use real API)
   */
  disableMockData() {
    this.useMockData = false
    console.log('🔧 Analytics Service: Using real API')
  }

  /**
   * Simulate API delay for realistic behavior
   */
  async delay(ms = this.mockDelay) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get learner analytics with fallback
   */
  async getLearnerAnalytics(userId, filters = {}) {
    try {
      if (this.useMockData) {
        await this.delay()
        return {
          ...mockAnalyticsData.learner,
          userId,
          filters,
          timestamp: new Date().toISOString(),
          source: 'mock'
        }
      }

      const response = await api.getLearnerAnalytics(userId)
      return {
        ...response,
        source: 'api',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.warn('API failed, using mock data:', error.message)
      await this.delay()
      return {
        ...mockAnalyticsData.learner,
        userId,
        filters,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        error: error.message
      }
    }
  }

  /**
   * Get trainer analytics with fallback
   */
  async getTrainerAnalytics(userId, filters = {}) {
    try {
      if (this.useMockData) {
        await this.delay()
        return {
          ...mockAnalyticsData.trainer,
          userId,
          filters,
          timestamp: new Date().toISOString(),
          source: 'mock'
        }
      }

      const response = await api.getTrainerAnalytics(userId)
      return {
        ...response,
        source: 'api',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.warn('API failed, using mock data:', error.message)
      await this.delay()
      return {
        ...mockAnalyticsData.trainer,
        userId,
        filters,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        error: error.message
      }
    }
  }

  /**
   * Get organization analytics with fallback
   */
  async getOrganizationAnalytics(organizationId, filters = {}) {
    try {
      if (this.useMockData) {
        await this.delay()
        return {
          ...mockAnalyticsData.organization,
          organizationId,
          filters,
          timestamp: new Date().toISOString(),
          source: 'mock'
        }
      }

      const response = await api.getOrganizationAnalytics(organizationId)
      return {
        ...response,
        source: 'api',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.warn('API failed, using mock data:', error.message)
      await this.delay()
      return {
        ...mockAnalyticsData.organization,
        organizationId,
        filters,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        error: error.message
      }
    }
  }

  /**
   * Get reports with fallback
   */
  async getReports(userId) {
    try {
      if (this.useMockData) {
        await this.delay()
        return {
          reports: mockReportsData,
          userId,
          timestamp: new Date().toISOString(),
          source: 'mock'
        }
      }

      const response = await api.getReports(userId)
      return {
        ...response,
        source: 'api',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.warn('API failed, using mock data:', error.message)
      await this.delay()
      return {
        reports: mockReportsData,
        userId,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        error: error.message
      }
    }
  }

  /**
   * Generate report with fallback
   */
  async generateReport(type, format, userId) {
    try {
      if (this.useMockData) {
        await this.delay(1000) // Longer delay for report generation
        const newReport = {
          id: `report-${Date.now()}`,
          type,
          format,
          status: 'processing',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          download_url: null
        }
        return {
          ...newReport,
          source: 'mock'
        }
      }

      const response = await api.generateReport(type, format, userId)
      return {
        ...response,
        source: 'api'
      }
    } catch (error) {
      console.warn('API failed, using mock data:', error.message)
      await this.delay(1000)
      const newReport = {
        id: `report-${Date.now()}`,
        type,
        format,
        status: 'processing',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        download_url: null
      }
      return {
        ...newReport,
        source: 'fallback',
        error: error.message
      }
    }
  }

  /**
   * Refresh analytics data
   */
  async refreshAnalytics(userId, analyticsType) {
    try {
      if (this.useMockData) {
        await this.delay()
        return {
          collection_id: `collection-${Date.now()}`,
          status: 'started',
          user_id: userId,
          analytics_type: analyticsType,
          source: 'mock'
        }
      }

      const response = await api.refreshAnalytics(userId, analyticsType)
      return {
        ...response,
        source: 'api'
      }
    } catch (error) {
      console.warn('API failed, using mock data:', error.message)
      await this.delay()
      return {
        collection_id: `collection-${Date.now()}`,
        status: 'started',
        user_id: userId,
        analytics_type: analyticsType,
        source: 'fallback',
        error: error.message
      }
    }
  }

  /**
   * ========================================
   * AS-001: INDIVIDUAL LEARNER ANALYTICS METHODS
   * ========================================
   */

  /**
   * AS-001 #1: Learning Velocity & Momentum
   */
  async getLearnerVelocity(userId) {
    try {
      if (this.useMockData) {
        await this.delay()
        const data = mockLearnerAnalytics.velocity[userId] || mockLearnerAnalytics.velocity['user-123']
        return {
          success: true,
          data: { learningVelocity: data },
          source: 'mock'
        }
      }

      const response = await api.get(`/analytics/learner/${userId}/velocity`)
      return { ...response, source: 'api' }
    } catch (error) {
      console.warn('API failed, using mock fallback:', error.message)
      await this.delay()
      const data = mockLearnerAnalytics.velocity[userId] || mockLearnerAnalytics.velocity['user-123']
      return {
        success: true,
        data: { learningVelocity: data },
        source: 'fallback'
      }
    }
  }

  /**
   * AS-001 #2: Skill Gap Matrix with Prioritization
   */
  async getLearnerSkillGaps(userId) {
    try {
      if (this.useMockData) {
        await this.delay()
        const data = mockLearnerAnalytics.skillGaps[userId] || mockLearnerAnalytics.skillGaps['user-123']
        return {
          success: true,
          data: { skillGapMatrix: data },
          source: 'mock'
        }
      }

      const response = await api.get(`/analytics/learner/${userId}/skill-gaps`)
      return { ...response, source: 'api' }
    } catch (error) {
      console.warn('API failed, using mock fallback:', error.message)
      await this.delay()
      const data = mockLearnerAnalytics.skillGaps[userId] || mockLearnerAnalytics.skillGaps['user-123']
      return {
        success: true,
        data: { skillGapMatrix: data },
        source: 'fallback'
      }
    }
  }

  /**
   * AS-001 #3: Engagement Score with Behavioral Insights
   */
  async getLearnerEngagement(userId) {
    try {
      if (this.useMockData) {
        await this.delay()
        const data = mockLearnerAnalytics.engagement[userId] || mockLearnerAnalytics.engagement['user-123']
        return {
          success: true,
          data: { engagementAnalytics: data },
          source: 'mock'
        }
      }

      const response = await api.get(`/analytics/learner/${userId}/engagement`)
      return { ...response, source: 'api' }
    } catch (error) {
      console.warn('API failed, using mock fallback:', error.message)
      await this.delay()
      const data = mockLearnerAnalytics.engagement[userId] || mockLearnerAnalytics.engagement['user-123']
      return {
        success: true,
        data: { engagementAnalytics: data },
        source: 'fallback'
      }
    }
  }

  /**
   * AS-001 #4: Mastery Progress Tracking
   */
  async getLearnerMastery(userId) {
    try {
      if (this.useMockData) {
        await this.delay()
        const data = mockLearnerAnalytics.mastery[userId] || mockLearnerAnalytics.mastery['user-123']
        return {
          success: true,
          data: { masteryTracking: data },
          source: 'mock'
        }
      }

      const response = await api.get(`/analytics/learner/${userId}/mastery`)
      return { ...response, source: 'api' }
    } catch (error) {
      console.warn('API failed, using mock fallback:', error.message)
      await this.delay()
      const data = mockLearnerAnalytics.mastery[userId] || mockLearnerAnalytics.mastery['user-123']
      return {
        success: true,
        data: { masteryTracking: data },
        source: 'fallback'
      }
    }
  }

  /**
   * AS-001 #5: Performance & Assessment Analytics
   */
  async getLearnerPerformance(userId) {
    try {
      if (this.useMockData) {
        await this.delay()
        const data = mockLearnerAnalytics.performance[userId] || mockLearnerAnalytics.performance['user-123']
        return {
          success: true,
          data: data,
          source: 'mock'
        }
      }

      const response = await api.get(`/analytics/learner/${userId}/performance`)
      return { ...response, source: 'api' }
    } catch (error) {
      console.warn('API failed, using mock fallback:', error.message)
      await this.delay()
      const data = mockLearnerAnalytics.performance[userId] || mockLearnerAnalytics.performance['user-123']
      return {
        success: true,
        data: data,
        source: 'fallback'
      }
    }
  }

  /**
   * AS-001 #6: Course & Content Effectiveness
   */
  async getLearnerContentEffectiveness(userId, filters = {}) {
    try {
      if (this.useMockData) {
        await this.delay()
        const data = mockLearnerAnalytics.contentEffectiveness[userId] || mockLearnerAnalytics.contentEffectiveness['user-123']
        return {
          success: true,
          data: data,
          source: 'mock'
        }
      }

      const queryParams = new URLSearchParams(filters).toString()
      const url = `/analytics/learner/${userId}/content-effectiveness${queryParams ? `?${queryParams}` : ''}`
      const response = await api.get(url)
      return { ...response, source: 'api' }
    } catch (error) {
      console.warn('API failed, using mock fallback:', error.message)
      await this.delay()
      const data = mockLearnerAnalytics.contentEffectiveness[userId] || mockLearnerAnalytics.contentEffectiveness['user-123']
      return {
        success: true,
        data: data,
        source: 'fallback'
      }
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService()

// Export mock data for testing
export { mockAnalyticsData, mockReportsData }

// Enable mock data by default for development
if (process.env.NODE_ENV === 'development') {
  analyticsService.enableMockData()
}

export default analyticsService
