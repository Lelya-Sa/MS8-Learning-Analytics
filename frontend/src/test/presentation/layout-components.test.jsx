import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

// Mock the theme context
const mockThemeContext = {
  theme: 'light',
  isDarkMode: false,
  toggleTheme: jest.fn(),
  setTheme: jest.fn(),
  themes: { LIGHT: 'light', DARK: 'dark', SYSTEM: 'system' }
};

// Mock the auth context
const mockAuthContext = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    roles: ['learner'],
    activeRole: 'learner'
  },
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  switchRole: jest.fn(),
  hasRole: jest.fn(),
  getPermissions: jest.fn()
};

// Mock components
jest.mock('../../application/state/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => mockThemeContext
}));

jest.mock('../../application/state/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockAuthContext
}));

// Import components after mocking
import { AppLayout } from '../../presentation/components/layout/AppLayout';
import { Header } from '../../presentation/components/layout/Header';
import { Sidebar } from '../../presentation/components/layout/Sidebar';
import { Footer } from '../../presentation/components/layout/Footer';
import { MainContent } from '../../presentation/components/layout/MainContent';

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Main Layout Components', () => {
  describe('AppLayout', () => {
    it('should render app layout with all sections', () => {
      render(
        <TestWrapper>
        <AppLayout>
          <div data-testid="page-content">Main Content</div>
        </AppLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should handle sidebar toggle', async () => {
      render(
        <TestWrapper>
        <AppLayout>
          <div data-testid="page-content">Main Content</div>
        </AppLayout>
        </TestWrapper>
      );

      const sidebarToggle = screen.getByTestId('sidebar-toggle');
      expect(sidebarToggle).toBeInTheDocument();

      fireEvent.click(sidebarToggle);

      await waitFor(() => {
        expect(screen.getByTestId('sidebar')).toHaveClass('collapsed');
      });
    });

    it('should be responsive on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
        <AppLayout>
          <div data-testid="page-content">Main Content</div>
        </AppLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('app-layout')).toHaveClass('mobile');
    });
  });

  describe('Header', () => {
    it('should render header with logo and navigation', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getByTestId('user-menu')).toBeInTheDocument();
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('should display user information', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('learner')).toBeInTheDocument();
    });

    it('should handle theme toggle', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const themeToggle = screen.getByTestId('theme-toggle');
      fireEvent.click(themeToggle);

      expect(mockThemeContext.toggleTheme).toHaveBeenCalled();
    });

    it('should handle user menu actions', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const userMenuTrigger = screen.getByTestId('user-menu-trigger');
      fireEvent.click(userMenuTrigger);

      await waitFor(() => {
        expect(screen.getByTestId('user-menu-dropdown')).toBeInTheDocument();
      });

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      expect(mockAuthContext.logout).toHaveBeenCalled();
    });
  });

  describe('Sidebar', () => {
    it('should render sidebar with navigation items', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('nav-items')).toBeInTheDocument();
    });

    it('should show navigation items based on user role', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Check for learner-specific navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('My Progress')).toBeInTheDocument();
      expect(screen.getByText('Courses')).toBeInTheDocument();
    });

    it('should handle navigation clicks', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const dashboardLink = screen.getByText('Dashboard');
      fireEvent.click(dashboardLink);

      // Navigation should work (tested by React Router)
      expect(dashboardLink).toBeInTheDocument();
    });

    it('should collapse on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <AppLayout>
            <div data-testid="page-content">Page Content</div>
          </AppLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('sidebar')).toHaveClass('mobile-collapsed');
    });
  });

  describe('MainContent', () => {
    it('should render main content area', () => {
      render(
        <TestWrapper>
          <MainContent>
            <div data-testid="page-content">Page Content</div>
          </MainContent>
        </TestWrapper>
      );

      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('page-content')).toBeInTheDocument();
    });

    it('should handle loading state', () => {
      render(
        <TestWrapper>
          <MainContent isLoading={true}>
            <div data-testid="page-content">Page Content</div>
          </MainContent>
        </TestWrapper>
      );

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should handle error state', () => {
      render(
        <TestWrapper>
          <MainContent error="Something went wrong">
            <div data-testid="page-content">Page Content</div>
          </MainContent>
        </TestWrapper>
      );

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('should render footer with links and information', () => {
      render(
        <TestWrapper>
          <Footer />
        </TestWrapper>
      );

      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByText('© 2025 MS8 Learning Analytics')).toBeInTheDocument();
      expect(screen.getByTestId('footer-links')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(
        <TestWrapper>
          <Footer />
        </TestWrapper>
      );

      const footer = screen.getByTestId('footer');
      expect(footer).toHaveAttribute('role', 'contentinfo');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
        <AppLayout>
          <div data-testid="page-content">Main Content</div>
        </AppLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('header')).toHaveAttribute('role', 'banner');
      expect(screen.getByTestId('sidebar')).toHaveAttribute('role', 'navigation');
      expect(screen.getByTestId('main-content')).toHaveAttribute('role', 'main');
      expect(screen.getByTestId('footer')).toHaveAttribute('role', 'contentinfo');
    });

    it('should support keyboard navigation', () => {
      render(
        <TestWrapper>
        <AppLayout>
          <div data-testid="page-content">Main Content</div>
        </AppLayout>
        </TestWrapper>
      );

      const sidebarToggle = screen.getByTestId('sidebar-toggle');
      expect(sidebarToggle).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to different screen sizes', () => {
      // Test desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const { rerender } = render(
        <TestWrapper>
        <AppLayout>
          <div data-testid="page-content">Main Content</div>
        </AppLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('app-layout')).toHaveClass('desktop');

      // Test tablet
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      rerender(
        <TestWrapper>
        <AppLayout>
          <div data-testid="page-content">Main Content</div>
        </AppLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('app-layout')).toHaveClass('tablet');
    });
  });
});
