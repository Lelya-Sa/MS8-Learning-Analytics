import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import StudentsPage from '../../pages/StudentsPage'
import CoursesPage from '../../pages/CoursesPage'
import OrganizationPage from '../../pages/OrganizationPage'
import UsersPage from '../../pages/UsersPage'
import SettingsPage from '../../pages/SettingsPage'

// Mock the auth hook
const mockUseAuth = vi.fn()
vi.mock('../../components/auth/AuthProvider', () => ({
  useAuth: () => mockUseAuth()
}))

describe('Navigation Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'trainer',
        roles: ['trainer'],
        organization_id: 'org-123'
      }
    })
  })

  describe('StudentsPage', () => {
    it('should render students page', () => {
      render(
        <BrowserRouter>
          <StudentsPage />
        </BrowserRouter>
      )
      expect(screen.getByText(/Students/i)).toBeInTheDocument()
    })

    it('should have proper page structure', () => {
      const { container } = render(
        <BrowserRouter>
          <StudentsPage />
        </BrowserRouter>
      )
      expect(container.querySelector('.students-page')).toBeInTheDocument()
    })
  })

  describe('CoursesPage', () => {
    it('should render courses page', () => {
      render(
        <BrowserRouter>
          <CoursesPage />
        </BrowserRouter>
      )
      expect(screen.getByText(/Courses/i)).toBeInTheDocument()
    })

    it('should have proper page structure', () => {
      const { container } = render(
        <BrowserRouter>
          <CoursesPage />
        </BrowserRouter>
      )
      expect(container.querySelector('.courses-page')).toBeInTheDocument()
    })
  })

  describe('OrganizationPage', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 'admin-101',
          email: 'admin@example.com',
          role: 'org_admin',
          roles: ['org_admin'],
          organization_id: 'org-123'
        }
      })
    })

    it('should render organization page', () => {
      render(
        <BrowserRouter>
          <OrganizationPage />
        </BrowserRouter>
      )
      expect(screen.getByText(/Organization/i)).toBeInTheDocument()
    })

    it('should have proper page structure', () => {
      const { container } = render(
        <BrowserRouter>
          <OrganizationPage />
        </BrowserRouter>
      )
      expect(container.querySelector('.organization-page')).toBeInTheDocument()
    })
  })

  describe('UsersPage', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 'admin-101',
          email: 'admin@example.com',
          role: 'org_admin',
          roles: ['org_admin'],
          organization_id: 'org-123'
        }
      })
    })

    it('should render users page', () => {
      render(
        <BrowserRouter>
          <UsersPage />
        </BrowserRouter>
      )
      expect(screen.getByText(/Users/i)).toBeInTheDocument()
    })

    it('should have proper page structure', () => {
      const { container } = render(
        <BrowserRouter>
          <UsersPage />
        </BrowserRouter>
      )
      expect(container.querySelector('.users-page')).toBeInTheDocument()
    })
  })

  describe('SettingsPage', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 'admin-101',
          email: 'admin@example.com',
          role: 'org_admin',
          roles: ['org_admin'],
          organization_id: 'org-123'
        }
      })
    })

    it('should render settings page', () => {
      render(
        <BrowserRouter>
          <SettingsPage />
        </BrowserRouter>
      )
      expect(screen.getByText(/Settings/i)).toBeInTheDocument()
    })

    it('should have proper page structure', () => {
      const { container } = render(
        <BrowserRouter>
          <SettingsPage />
        </BrowserRouter>
      )
      expect(container.querySelector('.settings-page')).toBeInTheDocument()
    })
  })
})

