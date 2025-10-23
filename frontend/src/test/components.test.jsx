import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the API module
vi.mock('../services/api', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn()
}))

// Import components to test (these will fail initially - RED phase)
import AuthProvider from '../components/auth/AuthProvider'
import Dashboard from '../components/dashboard/Dashboard'
import LearnerAnalytics from '../components/analytics/LearnerAnalytics'
import TrainerAnalytics from '../components/analytics/TrainerAnalytics'
import OrganizationAnalytics from '../components/analytics/OrganizationAnalytics'
import AnalyticsChart from '../components/charts/AnalyticsChart'
import DataTable from '../components/tables/DataTable'
import ReportGenerator from '../components/reports/ReportGenerator'

// Import the mocked API
import * as api from '../services/api'

describe('AuthProvider Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form when user is not authenticated', () => {
    // RED: This test will fail because AuthProvider doesn't exist yet
    render(<AuthProvider />)
    
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should authenticate user with valid credentials', async () => {
    const user = userEvent.setup()
    
    // Mock successful authentication
    api.login.mockResolvedValueOnce({
      token: 'mock-jwt-token',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'learner',
        organization_id: 'org-123'
      }
    })

    render(<AuthProvider />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should show error message for invalid credentials', async () => {
    const user = userEvent.setup()
    
    // Mock failed authentication
    api.login.mockRejectedValueOnce(new Error('Invalid credentials'))

    render(<AuthProvider />)
    
    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render learner dashboard for learner role', () => {
    // RED: This test will fail because Dashboard doesn't exist yet
    const mockUser = {
      id: 'user-123',
      role: 'learner',
      organization_id: 'org-123'
    }

    render(<Dashboard user={mockUser} />)
    
    expect(screen.getByText(/my learning analytics/i)).toBeInTheDocument()
    expect(screen.getByText(/learning velocity/i)).toBeInTheDocument()
    expect(screen.getByText(/mastery progress/i)).toBeInTheDocument()
    expect(screen.getByText(/skill gaps/i)).toBeInTheDocument()
    expect(screen.getByText(/engagement score/i)).toBeInTheDocument()
  })

  it('should render trainer dashboard for trainer role', () => {
    const mockUser = {
      id: 'user-123',
      role: 'trainer',
      organization_id: 'org-123'
    }

    render(<Dashboard user={mockUser} />)
    
    expect(screen.getByText(/course analytics/i)).toBeInTheDocument()
    expect(screen.getByText(/student performance/i)).toBeInTheDocument()
    expect(screen.getByText(/at-risk students/i)).toBeInTheDocument()
  })

  it('should render organization dashboard for org_admin role', () => {
    const mockUser = {
      id: 'user-123',
      role: 'org_admin',
      organization_id: 'org-123'
    }

    render(<Dashboard user={mockUser} />)
    
    expect(screen.getByText(/organization analytics/i)).toBeInTheDocument()
    expect(screen.getByText(/learning velocity/i)).toBeInTheDocument()
    expect(screen.getByText(/strategic alignment/i)).toBeInTheDocument()
  })

  it('should show loading state while fetching data', () => {
    const mockUser = {
      id: 'user-123',
      role: 'learner',
      organization_id: 'org-123'
    }

    // Mock SWR to return loading state
    vi.doMock('swr', () => ({
      default: vi.fn(() => ({
        data: undefined,
        error: null,
        isLoading: true,
        mutate: vi.fn(),
      })),
      SWRConfig: ({ children }) => children,
    }))

    render(<Dashboard user={mockUser} />)
    
    expect(screen.getByText(/loading analytics/i)).toBeInTheDocument()
  })
})

describe('LearnerAnalytics Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display learning velocity chart', () => {
    // RED: This test will fail because LearnerAnalytics doesn't exist yet
    const mockData = {
      learning_velocity: 85.5,
      mastery_progress: 72.3,
      engagement_score: 91.2,
      skill_gaps: [
        { skill: 'JavaScript', priority: 'high', gap_score: 0.3 },
        { skill: 'React', priority: 'medium', gap_score: 0.2 }
      ]
    }

    render(<LearnerAnalytics data={mockData} />)
    
    expect(screen.getByText(/learning velocity/i)).toBeInTheDocument()
    expect(screen.getByText(/85.5%/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /learning velocity chart/i })).toBeInTheDocument()
  })

  it('should display skill gaps with priority indicators', () => {
    const mockData = {
      skill_gaps: [
        { skill: 'JavaScript', priority: 'high', gap_score: 0.3 },
        { skill: 'React', priority: 'medium', gap_score: 0.2 },
        { skill: 'Node.js', priority: 'low', gap_score: 0.1 }
      ]
    }

    render(<LearnerAnalytics data={mockData} />)
    
    expect(screen.getByText(/skill gaps/i)).toBeInTheDocument()
    expect(screen.getByText(/javascript/i)).toBeInTheDocument()
    expect(screen.getByText(/react/i)).toBeInTheDocument()
    expect(screen.getByText(/node\.js/i)).toBeInTheDocument()
    
    // Check priority indicators
    expect(screen.getByText(/high priority/i)).toBeInTheDocument()
    expect(screen.getByText(/medium priority/i)).toBeInTheDocument()
    expect(screen.getByText(/low priority/i)).toBeInTheDocument()
  })

  it('should allow manual refresh with cooldown', async () => {
    const user = userEvent.setup()
    const mockRefresh = vi.fn()

    render(<LearnerAnalytics data={{}} onRefresh={mockRefresh} />)
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    await user.click(refreshButton)
    
    expect(mockRefresh).toHaveBeenCalledTimes(1)
    
    // Try to click again immediately (should be disabled)
    await user.click(refreshButton)
    expect(mockRefresh).toHaveBeenCalledTimes(1) // Should not call again
  })
})

describe('AnalyticsChart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render Chart.js chart with provided data', () => {
    // RED: This test will fail because AnalyticsChart doesn't exist yet
    const mockData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [{
        label: 'Learning Velocity',
        data: [65, 72, 78, 85],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)'
      }]
    }

    render(<AnalyticsChart data={mockData} type="line" />)
    
    expect(screen.getByRole('img', { name: /chart/i })).toBeInTheDocument()
  })

  it('should handle different chart types', () => {
    const mockData = {
      labels: ['A', 'B', 'C'],
      datasets: [{
        data: [30, 50, 20]
      }]
    }

    const { rerender } = render(<AnalyticsChart data={mockData} type="bar" />)
    expect(screen.getByRole('img', { name: /bar chart/i })).toBeInTheDocument()

    rerender(<AnalyticsChart data={mockData} type="pie" />)
    expect(screen.getByRole('img', { name: /pie chart/i })).toBeInTheDocument()

    rerender(<AnalyticsChart data={mockData} type="doughnut" />)
    expect(screen.getByRole('img', { name: /doughnut chart/i })).toBeInTheDocument()
  })

  it('should show loading state while chart is rendering', () => {
    render(<AnalyticsChart data={null} type="line" />)
    
    expect(screen.getByText(/loading chart/i)).toBeInTheDocument()
  })
})

describe('DataTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render table with provided data', () => {
    // RED: This test will fail because DataTable doesn't exist yet
    const mockData = [
      { id: 1, skill: 'JavaScript', progress: 85, priority: 'high' },
      { id: 2, skill: 'React', progress: 72, priority: 'medium' },
      { id: 3, skill: 'Node.js', progress: 60, priority: 'low' }
    ]

    render(<DataTable data={mockData} columns={['skill', 'progress', 'priority']} />)
    
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText(/javascript/i)).toBeInTheDocument()
    expect(screen.getByText(/react/i)).toBeInTheDocument()
    expect(screen.getByText(/node\.js/i)).toBeInTheDocument()
  })

  it('should support sorting by columns', async () => {
    const user = userEvent.setup()
    const mockData = [
      { id: 1, skill: 'JavaScript', progress: 85 },
      { id: 2, skill: 'React', progress: 72 },
      { id: 3, skill: 'Node.js', progress: 60 }
    ]

    render(<DataTable data={mockData} columns={['skill', 'progress']} sortable />)
    
    const progressHeader = screen.getByRole('columnheader', { name: /progress/i })
    await user.click(progressHeader)
    
    // Check if data is sorted (this will depend on implementation)
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('60') // Lowest progress first
  })

  it('should support pagination', async () => {
    const user = userEvent.setup()
    const mockData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      skill: `Skill ${i + 1}`,
      progress: Math.floor(Math.random() * 100)
    }))

    render(<DataTable data={mockData} columns={['skill', 'progress']} pageSize={10} />)
    
    expect(screen.getByText(/showing 1-10 of 25/i)).toBeInTheDocument()
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)
    
    expect(screen.getByText(/showing 11-20 of 25/i)).toBeInTheDocument()
  })
})

describe('ReportGenerator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render report generation form', () => {
    // RED: This test will fail because ReportGenerator doesn't exist yet
    render(<ReportGenerator />)
    
    expect(screen.getByText(/generate report/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/report type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/format/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  it('should generate PDF report', async () => {
    const user = userEvent.setup()
    
    // Mock successful report generation
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        report_id: 'report-123',
        status: 'processing',
        download_url: null
      })
    })

    render(<ReportGenerator />)
    
    await user.selectOptions(screen.getByLabelText(/report type/i), 'learner')
    await user.selectOptions(screen.getByLabelText(/format/i), 'pdf')
    await user.click(screen.getByRole('button', { name: /generate/i }))

    await waitFor(() => {
      expect(screen.getByText(/report is being generated/i)).toBeInTheDocument()
    })
  })

  it('should show download link when report is ready', async () => {
    const user = userEvent.setup()
    
    // Mock report ready
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        report_id: 'report-123',
        status: 'completed',
        download_url: 'https://example.com/report-123.pdf',
        expires_at: '2024-12-31T23:59:59Z'
      })
    })

    render(<ReportGenerator />)
    
    await user.selectOptions(screen.getByLabelText(/report type/i), 'learner')
    await user.selectOptions(screen.getByLabelText(/format/i), 'pdf')
    await user.click(screen.getByRole('button', { name: /generate/i }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /download report/i })).toBeInTheDocument()
    })
  })
})
