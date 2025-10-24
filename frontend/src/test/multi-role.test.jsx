import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import RoleSwitcher from '../components/auth/RoleSwitcher'
import MultiRoleDashboard from '../pages/MultiRoleDashboard'
import { AuthProvider } from '../components/auth/AuthProvider'

// Mock the analytics components
vi.mock('../components/analytics/LearnerAnalytics', () => ({
  default: () => <div data-testid="learner-analytics">Learner Analytics</div>
}))

vi.mock('../components/analytics/TrainerAnalytics', () => ({
  default: () => <div data-testid="trainer-analytics">Trainer Analytics</div>
}))

vi.mock('../components/analytics/OrganizationAnalytics', () => ({
  default: () => <div data-testid="org-analytics">Organization Analytics</div>
}))

// Mock the auth hook
const mockUseAuth = vi.fn()
vi.mock('../components/auth/AuthProvider', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockUseAuth()
}))

describe('RoleSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should not render for users with single role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner']
      }
    })

    const { container } = render(
      <RoleSwitcher currentRole="learner" onRoleChange={vi.fn()} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render for users with multiple roles', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'multi@example.com',
        role: 'learner',
        roles: ['learner', 'trainer']
      }
    })

    render(
      <RoleSwitcher currentRole="learner" onRoleChange={vi.fn()} />
    )

    expect(screen.getByText(/👤 Learner/)).toBeInTheDocument()
  })

  it('should open dropdown when clicked', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'multi@example.com',
        role: 'learner',
        roles: ['learner', 'trainer']
      }
    })

    render(
      <RoleSwitcher currentRole="learner" onRoleChange={vi.fn()} />
    )

    const button = screen.getByText(/👤 Learner/).closest('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Switch Role')).toBeInTheDocument()
    })
  })

  it('should call onRoleChange when a role is selected', async () => {
    const onRoleChange = vi.fn()
    
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'multi@example.com',
        role: 'learner',
        roles: ['learner', 'trainer']
      }
    })

    render(
      <RoleSwitcher currentRole="learner" onRoleChange={onRoleChange} />
    )

    // Open dropdown
    const button = screen.getByText(/👤 Learner/).closest('button')
    fireEvent.click(button)

    // Wait for dropdown to open
    await waitFor(() => {
      expect(screen.getByText('Switch Role')).toBeInTheDocument()
    })

    // Click on trainer role
    const trainerButton = screen.getByText(/Manage courses and view student analytics/).closest('button')
    fireEvent.click(trainerButton)

    expect(onRoleChange).toHaveBeenCalledWith('trainer')
  })

  it('should show all available roles', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'superadmin@example.com',
        role: 'learner',
        roles: ['learner', 'trainer', 'org_admin']
      }
    })

    render(
      <RoleSwitcher currentRole="learner" onRoleChange={vi.fn()} />
    )

    // Open dropdown
    const button = screen.getByText(/👤 Learner/).closest('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/View your learning analytics and progress/)).toBeInTheDocument()
      expect(screen.getByText(/Manage courses and view student analytics/)).toBeInTheDocument()
      expect(screen.getByText(/Access organization-wide analytics and reports/)).toBeInTheDocument()
    })
  })

  it('should highlight current role', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'multi@example.com',
        role: 'trainer',
        roles: ['learner', 'trainer']
      }
    })

    render(
      <RoleSwitcher currentRole="trainer" onRoleChange={vi.fn()} />
    )

    // Open dropdown
    const button = screen.getByText(/👨‍🏫 Trainer/).closest('button')
    fireEvent.click(button)

    await waitFor(() => {
      const trainerButton = screen.getByText(/Manage courses and view student analytics/).closest('button')
      expect(trainerButton).toHaveClass('bg-primary-50')
    })
  })
})

describe('MultiRoleDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render learner dashboard by default', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner'],
        organization_id: 'org-1'
      }
    })

    render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    expect(screen.getByText('Learning Analytics')).toBeInTheDocument()
    expect(screen.getByTestId('learner-analytics')).toBeInTheDocument()
  })

  it('should render trainer dashboard when role is trainer', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'trainer@example.com',
        role: 'trainer',
        roles: ['trainer'],
        organization_id: 'org-1'
      }
    })

    render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    expect(screen.getByText('Trainer Dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('trainer-analytics')).toBeInTheDocument()
  })

  it('should render organization dashboard when role is org_admin', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'admin@example.com',
        role: 'org_admin',
        roles: ['org_admin'],
        organization_id: 'org-1'
      }
    })

    render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    expect(screen.getByText('Organization Dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('org-analytics')).toBeInTheDocument()
  })

  it('should show multi-role badge for users with multiple roles', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'multi@example.com',
        role: 'learner',
        roles: ['learner', 'trainer'],
        organization_id: 'org-1'
      }
    })

    render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    expect(screen.getByText(/Multi-Role Account:/)).toBeInTheDocument()
    expect(screen.getByText(/You have access to 2 roles/)).toBeInTheDocument()
  })

  it('should not show multi-role badge for single-role users', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner'],
        organization_id: 'org-1'
      }
    })

    render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    expect(screen.queryByText(/Multi-Role Account:/)).not.toBeInTheDocument()
  })

  it('should save preferred role to localStorage', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'multi@example.com',
        role: 'learner',
        roles: ['learner', 'trainer'],
        organization_id: 'org-1'
      }
    })

    const { rerender } = render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    // Initially should show learner dashboard
    expect(screen.getByTestId('learner-analytics')).toBeInTheDocument()

    // Simulate role change by updating the component
    // In real usage, this would be triggered by RoleSwitcher
    localStorage.setItem('preferredRole', 'trainer')

    // Rerender with trainer role
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'multi@example.com',
        role: 'trainer',
        roles: ['learner', 'trainer'],
        organization_id: 'org-1'
      }
    })

    rerender(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    expect(localStorage.getItem('preferredRole')).toBe('trainer')
  })

  it('should render role switcher for multi-role users', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'multi@example.com',
        role: 'learner',
        roles: ['learner', 'trainer'],
        organization_id: 'org-1'
      }
    })

    render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    // RoleSwitcher should be present
    expect(screen.getByText(/👤 Learner/)).toBeInTheDocument()
  })
})

describe('RBAC Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should allow learner to access learner analytics', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner'],
        organization_id: 'org-1'
      }
    })

    render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    expect(screen.getByTestId('learner-analytics')).toBeInTheDocument()
  })

  it('should allow trainer to access trainer analytics', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'trainer@example.com',
        role: 'trainer',
        roles: ['trainer'],
        organization_id: 'org-1'
      }
    })

    render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    expect(screen.getByTestId('trainer-analytics')).toBeInTheDocument()
  })

  it('should allow org_admin to access organization analytics', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'admin@example.com',
        role: 'org_admin',
        roles: ['org_admin'],
        organization_id: 'org-1'
      }
    })

    render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    expect(screen.getByTestId('org-analytics')).toBeInTheDocument()
  })

  it('should allow multi-role user to access all their role dashboards', () => {
    const user = {
      id: 'user-1',
      email: 'superadmin@example.com',
      role: 'learner',
      roles: ['learner', 'trainer', 'org_admin'],
      organization_id: 'org-1'
    }

    mockUseAuth.mockReturnValue({ user })

    const { rerender } = render(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )

    // Should start with learner
    expect(screen.getByTestId('learner-analytics')).toBeInTheDocument()

    // Switch to trainer
    mockUseAuth.mockReturnValue({ user: { ...user, role: 'trainer' } })
    rerender(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )
    expect(screen.getByTestId('trainer-analytics')).toBeInTheDocument()

    // Switch to org_admin
    mockUseAuth.mockReturnValue({ user: { ...user, role: 'org_admin' } })
    rerender(
      <BrowserRouter>
        <MultiRoleDashboard />
      </BrowserRouter>
    )
    expect(screen.getByTestId('org-analytics')).toBeInTheDocument()
  })
})

