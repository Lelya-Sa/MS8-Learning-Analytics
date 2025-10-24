/**
 * AS-003: Organizational Analytics Frontend Component Tests
 * TDD: RED Phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import OrganizationLearningVelocity from '../components/analytics/organization/OrganizationLearningVelocity'
import StrategicAlignmentTracking from '../components/analytics/organization/StrategicAlignmentTracking'
import DepartmentAnalytics from '../components/analytics/organization/DepartmentAnalytics'
import LearningCultureMetrics from '../components/analytics/organization/LearningCultureMetrics'

// Mock SWR cache
const swrConfig = {
  dedupingInterval: 0,
  provider: () => new Map(),
}

// Mock data matching backend structure
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
          skillsAcquired: 456
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
          employeesOnTrack: 145,
          totalEmployeesNeeded: 200,
          status: 'on_track'
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
        }
      },
      benchmarks: {
        industryAverage: 72,
        vsIndustry: '+15 points',
        standing: 'Above Average'
      }
    }
  }
}

describe('🔴 RED: AS-003 Organizational Analytics Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AS-003 #11: Organization Learning Velocity', () => {
    it('should render component title', () => {
      render(
        <SWRConfig value={swrConfig}>
          <OrganizationLearningVelocity organizationId="org-123" />
        </SWRConfig>
      )
      expect(screen.getByText(/Learning Velocity/i)).toBeInTheDocument()
    })

    it('should display overview metrics', async () => {
      vi.mock('../services/analyticsService', () => ({
        default: {
          getOrgLearningVelocity: vi.fn(() => Promise.resolve(mockOrgLearningVelocity))
        }
      }))

      render(
        <SWRConfig value={swrConfig}>
          <OrganizationLearningVelocity organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/500/)).toBeInTheDocument() // Total employees
        expect(screen.getByText(/90%/)).toBeInTheDocument() // Participation rate
        expect(screen.getByText(/1247/)).toBeInTheDocument() // Skills acquired
      })
    })

    it('should display ROI metrics', async () => {
      render(
        <SWRConfig value={swrConfig}>
          <OrganizationLearningVelocity organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/172%/)).toBeInTheDocument() // ROI
      })
    })

    it('should show loading state', () => {
      render(
        <SWRConfig value={swrConfig}>
          <OrganizationLearningVelocity organizationId="org-123" />
        </SWRConfig>
      )
      expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    })

    it('should handle error state', async () => {
      render(
        <SWRConfig value={{ ...swrConfig, shouldRetryOnError: false }}>
          <OrganizationLearningVelocity organizationId="org-invalid" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/error|failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('AS-003 #12: Strategic Alignment Tracking', () => {
    it('should render component title', () => {
      render(
        <SWRConfig value={swrConfig}>
          <StrategicAlignmentTracking organizationId="org-123" />
        </SWRConfig>
      )
      expect(screen.getByText(/Strategic Alignment/i)).toBeInTheDocument()
    })

    it('should display alignment score', async () => {
      render(
        <SWRConfig value={swrConfig}>
          <StrategicAlignmentTracking organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/85/)).toBeInTheDocument() // Overall alignment
        expect(screen.getByText(/Excellent/i)).toBeInTheDocument() // Grade
      })
    })

    it('should display strategic goals', async () => {
      render(
        <SWRConfig value={swrConfig}>
          <StrategicAlignmentTracking organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/Digital Transformation/i)).toBeInTheDocument()
      })
    })

    it('should display gap analysis', async () => {
      render(
        <SWRConfig value={swrConfig}>
          <StrategicAlignmentTracking organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/Kubernetes/i)).toBeInTheDocument()
      })
    })

    it('should show loading state', () => {
      render(
        <SWRConfig value={swrConfig}>
          <StrategicAlignmentTracking organizationId="org-123" />
        </SWRConfig>
      )
      expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    })
  })

  describe('AS-003 #13: Department Analytics', () => {
    it('should render component title', () => {
      render(
        <SWRConfig value={swrConfig}>
          <DepartmentAnalytics organizationId="org-123" />
        </SWRConfig>
      )
      expect(screen.getByText(/Department Analytics/i)).toBeInTheDocument()
    })

    it('should display department list', async () => {
      render(
        <SWRConfig value={swrConfig}>
          <DepartmentAnalytics organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/Engineering/i)).toBeInTheDocument()
        expect(screen.getByText(/120/)).toBeInTheDocument() // Total employees
      })
    })

    it('should display department metrics', async () => {
      render(
        <SWRConfig value={swrConfig}>
          <DepartmentAnalytics organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/92%/)).toBeInTheDocument() // Participation rate
        expect(screen.getByText(/75%/)).toBeInTheDocument() // Completion rate
      })
    })

    it('should show loading state', () => {
      render(
        <SWRConfig value={swrConfig}>
          <DepartmentAnalytics organizationId="org-123" />
        </SWRConfig>
      )
      expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    })
  })

  describe('AS-003 #14: Learning Culture Metrics', () => {
    it('should render component title', () => {
      render(
        <SWRConfig value={swrConfig}>
          <LearningCultureMetrics organizationId="org-123" />
        </SWRConfig>
      )
      expect(screen.getByText(/Learning Culture/i)).toBeInTheDocument()
    })

    it('should display culture score', async () => {
      render(
        <SWRConfig value={swrConfig}>
          <LearningCultureMetrics organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/87/)).toBeInTheDocument() // Overall score
        expect(screen.getByText(/Strong/i)).toBeInTheDocument() // Grade
      })
    })

    it('should display culture metrics', async () => {
      render(
        <SWRConfig value={swrConfig}>
          <LearningCultureMetrics organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/88/)).toBeInTheDocument() // Engagement score
      })
    })

    it('should display benchmarks', async () => {
      render(
        <SWRConfig value={swrConfig}>
          <LearningCultureMetrics organizationId="org-123" />
        </SWRConfig>
      )

      await waitFor(() => {
        expect(screen.getByText(/Above Average/i)).toBeInTheDocument()
      })
    })

    it('should show loading state', () => {
      render(
        <SWRConfig value={swrConfig}>
          <LearningCultureMetrics organizationId="org-123" />
        </SWRConfig>
      )
      expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    })
  })
})

