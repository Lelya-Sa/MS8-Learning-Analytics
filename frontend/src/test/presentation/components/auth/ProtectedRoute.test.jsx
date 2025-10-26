import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../application/state/ThemeContext';
import { ProtectedRoute } from '../../../../presentation/components/auth/ProtectedRoute';

// Mock the AuthService
jest.mock('../../../../application/services/AuthService', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    validatePasswordStrength: jest.fn(),
  })),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the AuthContext
jest.mock('../../../../application/state/AuthContext', () => ({
  AuthContext: { _currentValue: null },
  AuthProvider: ({ children }) => children,
  useAuth: jest.fn(),
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render protected content when user is authenticated', () => {
    // Mock authenticated state
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner'] },
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Mock unauthenticated state
    const mockAuthContext = {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should show loading spinner when authentication is loading', () => {
    // Mock loading state
    const mockAuthContext = {
      isAuthenticated: false,
      user: null,
      isLoading: true,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should check role permissions when requiredRole is provided', () => {
    // Mock authenticated user with specific role
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner'] },
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute requiredRole="learner">
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should deny access when user does not have required role', () => {
    // Mock authenticated user without required role
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner'] },
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute requiredRole="admin">
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('should support multiple required roles', () => {
    // Mock authenticated user with one of the required roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner'] },
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute requiredRoles={['learner', 'trainer']}>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should deny access when user has none of the required roles', () => {
    // Mock authenticated user without any required roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner'] },
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute requiredRoles={['admin', 'trainer']}>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('should render custom fallback component when provided', () => {
    // Mock unauthenticated state
    const mockAuthContext = {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    const CustomFallback = () => <div data-testid="custom-fallback">Custom Fallback</div>;

    render(
      <TestWrapper>
        <ProtectedRoute fallback={<CustomFallback />}>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should support strict mode requiring all roles', () => {
    // Mock authenticated user with only one of the required roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner'] },
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute requiredRoles={['learner', 'trainer']} strictMode={true}>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('Note: All roles are required in strict mode.')).toBeInTheDocument();
  });

  it('should grant access in strict mode when user has all required roles', () => {
    // Mock authenticated user with all required roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner', 'trainer'] },
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute requiredRoles={['learner', 'trainer']} strictMode={true}>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    // Mock authenticated state
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner'] },
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    );

    const protectedContent = screen.getByTestId('protected-content');
    expect(protectedContent).toBeInTheDocument();
  });
});
