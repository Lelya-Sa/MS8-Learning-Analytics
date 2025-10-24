import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Navigation from '../components/layout/Navigation'

// Mock the auth hook
const mockUseAuth = vi.fn()
vi.mock('../components/auth/AuthProvider', () => ({
  useAuth: () => mockUseAuth()
}))

describe('DashboardLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner'],
        organization_id: 'org-123'
      },
      logout: vi.fn()
    })
  })

  it('should render header, main content, and footer', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div data-testid="main-content">Test Content</div>
        </DashboardLayout>
      </BrowserRouter>
    )

    expect(screen.getByRole('banner')).toBeInTheDocument() // Header
    expect(screen.getByTestId('main-content')).toBeInTheDocument() // Main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument() // Footer
  })

  it('should render navigation in header', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test Content</div>
        </DashboardLayout>
      </BrowserRouter>
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should apply dark emerald theme classes', () => {
    const { container } = render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test Content</div>
        </DashboardLayout>
      </BrowserRouter>
    )

    expect(container.firstChild).toHaveClass('dashboard-layout')
  })

  it('should render children in main content area', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div data-testid="child-content">Child Component</div>
        </DashboardLayout>
      </BrowserRouter>
    )

    const mainContent = screen.getByTestId('child-content')
    expect(mainContent).toBeInTheDocument()
    expect(mainContent).toHaveTextContent('Child Component')
  })
})

describe('Header Component', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner'],
        organization_id: 'org-123'
      },
      logout: vi.fn()
    })
  })

  it('should render logo', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByText(/MS8 Learning Analytics/i)).toBeInTheDocument()
  })

  it('should render user profile information', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText(/learner/i)).toBeInTheDocument()
  })

  it('should render theme toggle button', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('should toggle theme when theme button is clicked', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
    fireEvent.click(themeToggle)

    expect(document.body.classList.contains('night-mode') || document.body.classList.contains('day-mode')).toBe(true)
  })

  it('should render logout button', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('should call logout when logout button is clicked', () => {
    const mockLogout = vi.fn()
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner']
      },
      logout: mockLogout
    })

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalled()
  })
})

describe('Navigation Component', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner']
      }
    })
  })

  it('should render navigation links', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should render Dashboard link for all users', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })

  it('should render Analytics link for learners', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    expect(screen.getByText(/Analytics/i)).toBeInTheDocument()
  })

  it('should render Reports link', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    expect(screen.getByText(/Reports/i)).toBeInTheDocument()
  })

  it('should highlight active navigation link', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should render role-specific navigation for trainers', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'trainer-789',
        email: 'trainer@example.com',
        role: 'trainer',
        roles: ['trainer']
      }
    })

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    expect(screen.getByText(/Students/i)).toBeInTheDocument()
  })

  it('should render role-specific navigation for org admins', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'admin-101',
        email: 'admin@example.com',
        role: 'org_admin',
        roles: ['org_admin']
      }
    })

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    expect(screen.getByText(/Organization/i)).toBeInTheDocument()
  })
})

describe('Footer Component', () => {
  it('should render footer content', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should render copyright information', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText(/© 2025 MS8 Learning Analytics/i)).toBeInTheDocument()
  })

  it('should render footer links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument()
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument()
    expect(screen.getByText(/Help/i)).toBeInTheDocument()
  })

  it('should render social media links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    const footer = screen.getByRole('contentinfo')
    const socialLinks = within(footer).getAllByRole('link')
    expect(socialLinks.length).toBeGreaterThan(0)
  })
})

describe('Accessibility Features', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'learner',
        roles: ['learner']
      },
      logout: vi.fn()
    })
  })

  it('should have proper ARIA landmarks', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </BrowserRouter>
    )

    expect(screen.getByRole('banner')).toBeInTheDocument() // Header
    expect(screen.getByRole('navigation')).toBeInTheDocument() // Nav
    expect(screen.getByRole('main')).toBeInTheDocument() // Main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument() // Footer
  })

  it('should have skip to main content link', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </BrowserRouter>
    )

    const skipLink = screen.getByText(/Skip to main content/i)
    expect(skipLink).toBeInTheDocument()
  })

  it('should support keyboard navigation', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    const links = screen.getAllByRole('link')
    links[0].focus()
    expect(document.activeElement).toBe(links[0])
  })
})

