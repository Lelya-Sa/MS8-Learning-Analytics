import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ReportsPage from '../../pages/ReportsPage'

// Mock the auth hook
const mockUseAuth = vi.fn()
vi.mock('../../components/auth/AuthProvider', () => ({
  useAuth: () => mockUseAuth()
}))

// Mock ReportGenerator
vi.mock('../../components/reports/ReportGenerator', () => ({
  default: () => <div data-testid="report-generator">Report Generator Component</div>
}))

describe('ReportsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner'],
        organization_id: 'org-123'
      }
    })
  })

  it('should render reports page', () => {
    render(
      <BrowserRouter>
        <ReportsPage />
      </BrowserRouter>
    )

    expect(screen.getByRole('heading', { name: /Reports/i })).toBeInTheDocument()
  })

  it('should render page title', () => {
    render(
      <BrowserRouter>
        <ReportsPage />
      </BrowserRouter>
    )

    expect(screen.getByRole('heading', { name: /Reports/i })).toBeInTheDocument()
  })

  it('should render page description', () => {
    render(
      <BrowserRouter>
        <ReportsPage />
      </BrowserRouter>
    )

    expect(screen.getByText(/Generate and download analytics reports/i)).toBeInTheDocument()
  })

  it('should render ReportGenerator component', () => {
    render(
      <BrowserRouter>
        <ReportsPage />
      </BrowserRouter>
    )

    expect(screen.getByTestId('report-generator')).toBeInTheDocument()
  })

  it('should have proper page structure', () => {
    const { container } = render(
      <BrowserRouter>
        <ReportsPage />
      </BrowserRouter>
    )

    expect(container.querySelector('.reports-page')).toBeInTheDocument()
  })
})

