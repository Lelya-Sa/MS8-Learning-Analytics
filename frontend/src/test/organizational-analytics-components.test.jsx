/**
 * AS-003: Organizational Analytics Frontend Component Tests
 * Using direct component props with mock data
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import OrganizationLearningVelocity from '../components/analytics/organization/OrganizationLearningVelocity'
import StrategicAlignmentTracking from '../components/analytics/organization/StrategicAlignmentTracking'
import DepartmentAnalytics from '../components/analytics/organization/DepartmentAnalytics'
import LearningCultureMetrics from '../components/analytics/organization/LearningCultureMetrics'
import * as analyticsHooks from '../hooks/useAnalytics'

// Mock data matching backend structure exactly
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
      departmentBreakdown: [
        {
          departmentId: 'dept_engineering',
          departmentName: 'Engineering',
          totalEmployees: 120,
          participationRate: 92,
          completionRate: 75,
          skillsAcquired: 456,
          trend: '+10% from last quarter'
        }
      ],
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
      strategicGoals: [
        {
          goalId: 'goal_1',
          goalName: 'Digital Transformation',
          alignmentScore: 88,
          progress: 72,
          requiredSkills: ['Cloud Computing', 'DevOps', 'Microservices'],
          skillsCovered: 65,
          employeesOnTrack: 145,
          totalEmployeesNeeded: 200,
          status: 'on_track',
          recommendations: ['Increase focus on Microservices training']
        }
      ],
      gapAnalysis: {
        criticalGaps: 3,
        mediumGaps: 7,
        lowGaps: 12,
        topMissingSkills: [
          { skill: 'Kubernetes', gap: 45, priority: 'critical' }
        ]
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
          topPerformers: [
            { userId: 'user-123', name: 'John Doe', skillsAcquired: 12 }
          ],
          teamComparison: {
            vsOrgAverage: '+8%',
            ranking: 1,
            totalDepartments: 5
          },
          trends: {
            last30Days: '+5%',
            last90Days: '+12%'
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
          voluntaryLearning: 65,
          peerCollaboration: 72
        },
        knowledgeSharing: {
          score: 85,
          mentorshipPrograms: 12,
          activeMentors: 45,
          knowledgeBaseSessions: 28
        },
        innovationMetrics: {
          score: 82,
          newIdeasSubmitted: 156,
          ideasImplemented: 42,
          innovationProjects: 18
        },
        continuousImprovement: {
          score: 90,
          feedbackLoops: 'strong',
          courseCompletionTrend: '+15%',
          skillApplicationRate: 78
        }
      },
      culturalIndicators: {
        managerSupport: 92,
        learningTimeAllocation: 85,
        recognitionPrograms: 88,
        careerDevelopmentOpportunities: 86
      },
      benchmarks: {
        industryAverage: 72,
        vsIndustry: '+15 points',
        topQuartile: 90,
        standing: 'Above Average'
      },
      recommendations: [
        'Increase voluntary learning incentives',
        'Expand peer mentorship programs'
      ]
    }
  }
}

describe('✅ AS-003 Organizational Analytics Components', () => {
  beforeEach(() => {
    // Mock all the hooks before each test
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

  describe('AS-003 #11: Organization Learning Velocity', () => {
    it('should render component title', () => {
      render(<OrganizationLearningVelocity organizationId="org-123" />)
      expect(screen.getByText(/Learning Velocity/i)).toBeInTheDocument()
    })

    it('should display overview metrics', () => {
      render(<OrganizationLearningVelocity organizationId="org-123" />)
      
      expect(screen.getByText('500')).toBeInTheDocument()
      expect(screen.getByText('90%')).toBeInTheDocument()
      expect(screen.getByText('1247')).toBeInTheDocument()
    })

    it('should display ROI metrics', () => {
      render(<OrganizationLearningVelocity organizationId="org-123" />)
      expect(screen.getByText('172%')).toBeInTheDocument()
    })
  })

  describe('AS-003 #12: Strategic Alignment Tracking', () => {
    it('should render component title', () => {
      render(<StrategicAlignmentTracking organizationId="org-123" />)
      expect(screen.getByText(/Strategic Alignment/i)).toBeInTheDocument()
    })

    it('should display alignment score', () => {
      render(<StrategicAlignmentTracking organizationId="org-123" />)
      
      expect(screen.getByText('85')).toBeInTheDocument()
      expect(screen.getByText(/Excellent/i)).toBeInTheDocument()
    })

    it('should display strategic goals', () => {
      render(<StrategicAlignmentTracking organizationId="org-123" />)
      expect(screen.getByText(/Digital Transformation/i)).toBeInTheDocument()
    })

    it('should display gap analysis', () => {
      render(<StrategicAlignmentTracking organizationId="org-123" />)
      expect(screen.getByText(/Kubernetes/i)).toBeInTheDocument()
    })
  })

  describe('AS-003 #13: Department Analytics', () => {
    it('should render component title', () => {
      render(<DepartmentAnalytics organizationId="org-123" />)
      expect(screen.getByText(/Department Analytics/i)).toBeInTheDocument()
    })

    it('should display department list', () => {
      render(<DepartmentAnalytics organizationId="org-123" />)
      
      expect(screen.getByText(/Engineering/i)).toBeInTheDocument()
      expect(screen.getByText('120')).toBeInTheDocument()
    })

    it('should display department metrics', () => {
      render(<DepartmentAnalytics organizationId="org-123" />)
      
      expect(screen.getByText('92%')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  })

  describe('AS-003 #14: Learning Culture Metrics', () => {
    it('should render component title', () => {
      render(<LearningCultureMetrics organizationId="org-123" />)
      expect(screen.getByText(/Learning Culture/i)).toBeInTheDocument()
    })

    it('should display culture score', () => {
      render(<LearningCultureMetrics organizationId="org-123" />)
      
      expect(screen.getByText('87')).toBeInTheDocument()
      expect(screen.getByText(/Strong/i)).toBeInTheDocument()
    })

    it('should display culture metrics', () => {
      render(<LearningCultureMetrics organizationId="org-123" />)
      // Check for Learning Engagement which has score 88
      expect(screen.getByText(/Learning Engagement/i)).toBeInTheDocument()
    })

    it('should display benchmarks', () => {
      render(<LearningCultureMetrics organizationId="org-123" />)
      expect(screen.getByText(/Above Average/i)).toBeInTheDocument()
    })
  })
})
