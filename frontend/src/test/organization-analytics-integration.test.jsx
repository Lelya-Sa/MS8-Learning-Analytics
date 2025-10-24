/**
 * AS-003: Organization Analytics Dashboard Integration Tests
 * Tests the OrganizationAnalytics container component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import OrganizationAnalytics from '../components/analytics/OrganizationAnalytics'
import * as analyticsHooks from '../hooks/useAnalytics'
import * as AuthProvider from '../components/auth/AuthProvider'

// Mock data for all 4 organizational analytics
const mockOrgLearningVelocity = {
  success: true,
  data: {
    orgLearningVelocity: {
      organizationId: 'org-123',
      period: 'Q4 2024',
      overview: {
        totalEmployees: 500,
        activelyLearning: 450,
        participationRate: 90,
        averageCompletionRate: 68,
        skillsAcquiredThisQuarter: 1247,
        certificationsEarned: 89
      },
      roiMetrics: {
        trainingInvestment: 125000,
        productivityGains: 340000,
        roi: '172%',
        costPerSkillAcquired: 100.24,
        averageTimeToSkill: '3.2 weeks'
      },
      departmentBreakdown: [],
      trends: {
        quarterOverQuarter: '+15%',
        yearOverYear: '+42%',
        peakLearningMonth: 'November 2024'
      }
    }
  }
}

const mockStrategicAlignment = {
  success: true,
  data: {
    strategicAlignment: {
      organizationId: 'org-123',
      overallAlignment: 85,
      alignmentGrade: 'Excellent',
      strategicGoals: [],
      gapAnalysis: {
        criticalGaps: 3,
        mediumGaps: 7,
        lowGaps: 12,
        topMissingSkills: []
      }
    }
  }
}

const mockDepartmentAnalytics = {
  success: true,
  data: {
    departmentAnalytics: {
      organizationId: 'org-123',
      departments: [
        {
          departmentId: 'dept_engineering',
          departmentName: 'Engineering',
          totalEmployees: 120,
          metrics: {
            participationRate: 92,
            completionRate: 75,
            averageScore: 82.5,
            skillsAcquired: 456
          },
          topPerformers: [],
          teamComparison: {
            vsOrgAverage: '+8%',
            ranking: 1,
            totalDepartments: 5
          }
        }
      ]
    }
  }
}

const mockLearningCulture = {
  success: true,
  data: {
    learningCulture: {
      organizationId: 'org-123',
      overallCultureScore: 87,
      cultureGrade: 'Strong',
      metrics: {
        learningEngagement: {
          score: 88,
          activeParticipation: 90,
          voluntaryLearning: 65
        },
        knowledgeSharing: {
          score: 85,
          mentorshipPrograms: 12,
          activeMentors: 45
        },
        innovationMetrics: {
          score: 82,
          newIdeasSubmitted: 156,
          ideasImplemented: 42
        },
        continuousImprovement: {
          score: 90,
          feedbackLoops: 'strong',
          courseCompletionTrend: '+15%'
        }
      },
      culturalIndicators: {},
      benchmarks: {
        industryAverage: 72,
        vsIndustry: '+15 points',
        standing: 'Above Average'
      },
      recommendations: []
    }
  }
}

describe('✅ AS-003 Organization Analytics Dashboard Integration', () => {
  beforeEach(() => {
    // Mock auth context
    vi.spyOn(AuthProvider, 'useAuth').mockReturnValue({
      user: {
        id: 'admin-123',
        email: 'admin@example.com',
        roles: ['org_admin'],
        organizationId: 'org-123'
      }
    })

    // Mock all analytics hooks
    vi.spyOn(analyticsHooks, 'useOrgLearningVelocity').mockReturnValue({
      data: mockOrgLearningVelocity,
      error: null,
      isLoading: false,
      mutate: vi.fn()
    })

    vi.spyOn(analyticsHooks, 'useStrategicAlignment').mockReturnValue({
      data: mockStrategicAlignment,
      error: null,
      isLoading: false,
      mutate: vi.fn()
    })

    vi.spyOn(analyticsHooks, 'useDepartmentAnalytics').mockReturnValue({
      data: mockDepartmentAnalytics,
      error: null,
      isLoading: false,
      mutate: vi.fn()
    })

    vi.spyOn(analyticsHooks, 'useLearningCulture').mockReturnValue({
      data: mockLearningCulture,
      error: null,
      isLoading: false,
      mutate: vi.fn()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render the dashboard header', () => {
    render(<OrganizationAnalytics organizationId="org-123" />)
    expect(screen.getByText(/Organization Dashboard/i)).toBeInTheDocument()
  })

  it('should render all 4 analytics components', () => {
    render(<OrganizationAnalytics organizationId="org-123" />)
    
    // Check for each analytics section
    expect(screen.getByText(/Learning Velocity/i)).toBeInTheDocument()
    expect(screen.getByText(/Strategic Alignment/i)).toBeInTheDocument()
    expect(screen.getByText(/Department Analytics/i)).toBeInTheDocument()
    expect(screen.getByText(/Learning Culture/i)).toBeInTheDocument()
  })

  it('should display refresh and privacy controls', () => {
    render(<OrganizationAnalytics organizationId="org-123" />)
    
    expect(screen.getByText(/🔄 Refresh/i)).toBeInTheDocument()
    expect(screen.getByText(/🔒 Privacy Controls/i)).toBeInTheDocument()
  })

  it('should render organizational learning velocity data', () => {
    render(<OrganizationAnalytics organizationId="org-123" />)
    
    expect(screen.getByText('500')).toBeInTheDocument() // Total employees
    expect(screen.getByText('90%')).toBeInTheDocument() // Participation rate
    expect(screen.getByText('172%')).toBeInTheDocument() // ROI
  })

  it('should render strategic alignment data', () => {
    render(<OrganizationAnalytics organizationId="org-123" />)
    
    expect(screen.getByText('85')).toBeInTheDocument() // Overall alignment
    expect(screen.getByText(/Excellent/i)).toBeInTheDocument() // Grade
  })

  it('should render department analytics data', () => {
    render(<OrganizationAnalytics organizationId="org-123" />)
    
    expect(screen.getByText(/Engineering/i)).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument() // Total employees
  })

  it('should render learning culture data', () => {
    render(<OrganizationAnalytics organizationId="org-123" />)
    
    expect(screen.getByText('87')).toBeInTheDocument() // Overall score
    expect(screen.getByText(/Strong/i)).toBeInTheDocument() // Grade
  })

  it('should display info footer with data retention notice', () => {
    render(<OrganizationAnalytics organizationId="org-123" />)
    
    expect(screen.getByText(/About Your Organization Analytics/i)).toBeInTheDocument()
    expect(screen.getByText(/7 years/i)).toBeInTheDocument()
  })

  it('should show authentication required message when no organizationId', () => {
    vi.spyOn(AuthProvider, 'useAuth').mockReturnValue({
      user: null
    })

    render(<OrganizationAnalytics />)
    
    expect(screen.getByText(/Authentication Required/i)).toBeInTheDocument()
  })
})

