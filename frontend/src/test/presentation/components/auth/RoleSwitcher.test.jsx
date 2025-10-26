import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../application/state/ThemeContext';
import { RoleSwitcher } from '../../../../presentation/components/auth/RoleSwitcher';

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

describe('RoleSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render role switcher with current role highlighted', () => {
    // Mock authenticated user with multiple roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner', 'trainer'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher />
      </TestWrapper>
    );

    expect(screen.getByTestId('role-switcher')).toBeInTheDocument();
    expect(screen.getByText('Learner')).toBeInTheDocument();
    expect(screen.getByText('Trainer')).toBeInTheDocument();
    
    // Current role should be highlighted
    const currentRoleButton = screen.getByRole('tab', { name: /Switch to Learner role/i });
    expect(currentRoleButton).toHaveClass('active');
  });

  it('should call switchRole when a different role is clicked', async () => {
    const user = userEvent.setup();
    const mockSwitchRole = jest.fn();
    
    // Mock authenticated user with multiple roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner', 'trainer'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: mockSwitchRole,
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher />
      </TestWrapper>
    );

    const trainerButton = screen.getByRole('tab', { name: /Switch to Trainer role/i });
    await user.click(trainerButton);

    expect(mockSwitchRole).toHaveBeenCalledWith('trainer');
  });

  it('should not render when user has only one role', () => {
    // Mock authenticated user with single role
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher />
      </TestWrapper>
    );

    expect(screen.queryByTestId('role-switcher')).not.toBeInTheDocument();
  });

  it('should not render when user is not authenticated', () => {
    // Mock unauthenticated state
    const mockAuthContext = {
      isAuthenticated: false,
      user: null,
      currentRole: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher />
      </TestWrapper>
    );

    expect(screen.queryByTestId('role-switcher')).not.toBeInTheDocument();
  });

  it('should show loading state when switching roles', async () => {
    const user = userEvent.setup();
    const mockSwitchRole = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(), 100))
    );
    
    // Mock authenticated user with multiple roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner', 'trainer'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: mockSwitchRole,
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher />
      </TestWrapper>
    );

    const trainerButton = screen.getByRole('tab', { name: /Switch to Trainer role/i });
    await user.click(trainerButton);

    // Check if loading state is shown
    expect(screen.getByTestId('role-switching-loading')).toBeInTheDocument();
  });

  it('should display role icons correctly', () => {
    // Mock authenticated user with multiple roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner', 'trainer', 'org-admin'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher />
      </TestWrapper>
    );

    // Check for role icons
    expect(screen.getByTestId('learner-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trainer-icon')).toBeInTheDocument();
    expect(screen.getByTestId('org-admin-icon')).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    const mockSwitchRole = jest.fn();
    
    // Mock authenticated user with multiple roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner', 'trainer'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: mockSwitchRole,
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher />
      </TestWrapper>
    );

    const learnerButton = screen.getByRole('tab', { name: /Switch to Learner role/i });
    learnerButton.focus();
    
    // Test that Enter key triggers role switch
    await user.keyboard('{Enter}');
    
    // Since learner is already the current role, switchRole shouldn't be called
    expect(mockSwitchRole).not.toHaveBeenCalled();
    
    // Test clicking the trainer button instead
    const trainerButton = screen.getByRole('tab', { name: /Switch to Trainer role/i });
    await user.click(trainerButton);
    
    expect(mockSwitchRole).toHaveBeenCalledWith('trainer');
  });

  it('should have proper accessibility attributes', () => {
    // Mock authenticated user with multiple roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner', 'trainer'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher />
      </TestWrapper>
    );

    const roleSwitcher = screen.getByTestId('role-switcher');
    expect(roleSwitcher).toHaveAttribute('role', 'tablist');
    expect(roleSwitcher).toHaveAttribute('aria-label', 'Switch user role');

    const learnerButton = screen.getByRole('tab', { name: /Switch to Learner role/i });
    expect(learnerButton).toHaveAttribute('role', 'tab');
    expect(learnerButton).toHaveAttribute('aria-selected', 'true');
    expect(learnerButton).toHaveAttribute('tabindex', '0');

    const trainerButton = screen.getByRole('tab', { name: /Switch to Trainer role/i });
    expect(trainerButton).toHaveAttribute('role', 'tab');
    expect(trainerButton).toHaveAttribute('aria-selected', 'false');
    expect(trainerButton).toHaveAttribute('tabindex', '-1');
  });

  it('should handle role switching errors gracefully', async () => {
    const user = userEvent.setup();
    const mockSwitchRole = jest.fn().mockRejectedValue(new Error('Role switch failed'));
    
    // Mock authenticated user with multiple roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner', 'trainer'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: mockSwitchRole,
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher />
      </TestWrapper>
    );

    const trainerButton = screen.getByRole('tab', { name: /Switch to Trainer role/i });
    await user.click(trainerButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to switch role')).toBeInTheDocument();
    });
  });

  it('should support compact mode for smaller screens', () => {
    // Mock authenticated user with multiple roles
    const mockAuthContext = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['learner', 'trainer'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      switchRole: jest.fn(),
    };

    useAuth.mockReturnValue(mockAuthContext);

    render(
      <TestWrapper>
        <RoleSwitcher compact={true} />
      </TestWrapper>
    );

    const roleSwitcher = screen.getByTestId('role-switcher');
    expect(roleSwitcher).toHaveClass('compact');
  });
});
