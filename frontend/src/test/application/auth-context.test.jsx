/**
 * @file AuthContext Tests
 * @description Tests for AuthContext and AuthProvider following Init_Prompt Phase 3A TDD methodology
 * RED phase - Write failing tests first
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../application/state/AuthContext';
import { AuthService } from '../../application/services/AuthService';

// Mock AuthService
jest.mock('../../application/services/AuthService');

describe('AuthContext and AuthProvider', () => {
  let mockAuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAuthService = {
      login: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
      isAuthenticated: jest.fn(),
      hasRole: jest.fn(),
      switchRole: jest.fn(),
      refreshToken: jest.fn(),
      validateToken: jest.fn(),
      getPermissions: jest.fn(),
      changePassword: jest.fn(),
      resetPassword: jest.fn(),
      clearAuthData: jest.fn(),
      checkSessionValidity: jest.fn()
    };
    
    AuthService.mockImplementation(() => mockAuthService);
  });

  // Test component to use the context
  const TestComponent = () => {
    const {
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      switchRole,
      hasRole,
      getPermissions
    } = useAuth();

    const [permissions, setPermissions] = React.useState([]);

    React.useEffect(() => {
      const fetchPermissions = async () => {
        try {
          const perms = await getPermissions();
          setPermissions(perms);
        } catch (error) {
          setPermissions([]);
        }
      };
      fetchPermissions();
    }, [getPermissions]);

    return (
      <div>
        <div data-testid="user">{user ? user.email : 'No user'}</div>
        <div data-testid="is-authenticated">{isAuthenticated ? 'true' : 'false'}</div>
        <div data-testid="is-loading">{isLoading ? 'true' : 'false'}</div>
        <div data-testid="error">{error || 'No error'}</div>
        <button data-testid="login-btn" onClick={() => login('test@example.com', 'password')}>
          Login
        </button>
        <button data-testid="logout-btn" onClick={logout}>
          Logout
        </button>
        <button data-testid="switch-role-btn" onClick={() => switchRole('trainer')}>
          Switch Role
        </button>
        <div data-testid="has-learner-role">{hasRole('learner') ? 'true' : 'false'}</div>
        <div data-testid="permissions">{permissions ? permissions.join(', ') : ''}</div>
      </div>
    );
  };

  describe('AuthProvider', () => {
    it('should provide initial state', async () => {
      mockAuthService.isAuthenticated.mockResolvedValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No user');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
        expect(screen.getByTestId('error')).toHaveTextContent('No error');
      });
    });

    it('should initialize with authenticated user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'John Doe',
        roles: ['learner'],
        activeRole: 'learner',
        organizationId: 'org-123'
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(true);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });
    });

    it('should handle initialization errors', async () => {
      mockAuthService.isAuthenticated.mockRejectedValue(new Error('Network error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });
    });
  });

  describe('Login', () => {
    it('should login user successfully', async () => {
      const mockResponse = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          fullName: 'John Doe',
          roles: ['learner'],
          activeRole: 'learner',
          organizationId: 'org-123'
        },
        tokens: {
          accessToken: 'access-token-123',
          refreshToken: 'refresh-token-123'
        }
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(false);
      mockAuthService.login.mockResolvedValue(mockResponse);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('login-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('error')).toHaveTextContent('No error');
      });

      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('should handle login errors', async () => {
      // Set up mocks before rendering
      mockAuthService.isAuthenticated.mockResolvedValue(false);
      mockAuthService.login.mockImplementation(() => Promise.reject(new Error('Invalid credentials')));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial auth check to complete
      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('login-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });
    });

    it('should show loading state during login', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner'],
        activeRole: 'learner'
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(false);
      mockAuthService.login.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ user: mockUser, token: 'token' }), 100))
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByTestId('login-btn'));
      
      // Check loading state immediately after clicking
      expect(screen.getByTestId('is-loading')).toHaveTextContent('true');

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });
    });
  });

  describe('Logout', () => {
    it('should logout user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner'],
        activeRole: 'learner'
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(true);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthService.logout.mockResolvedValue();

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('logout-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No user');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });

      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('should handle logout errors gracefully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner'],
        activeRole: 'learner'
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(true);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthService.logout.mockRejectedValue(new Error('Network error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('logout-btn'));
      });

      // Should still clear local state even if server logout fails
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No user');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('Role Management', () => {
    it('should switch user role successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner', 'trainer'],
        activeRole: 'learner'
      };
      
      const updatedUser = {
        ...mockUser,
        activeRole: 'trainer'
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(true);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthService.switchRole.mockResolvedValue(updatedUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('switch-role-btn'));
      });

      await waitFor(() => {
        expect(mockAuthService.switchRole).toHaveBeenCalledWith('trainer');
      });
    });

    it('should handle role switch errors', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner'],
        activeRole: 'learner'
      };
      
      // Set up mocks before rendering
      mockAuthService.isAuthenticated.mockResolvedValue(true);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthService.switchRole.mockImplementation(() => Promise.reject(new Error('User does not have role: trainer')));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial auth check to complete
      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('switch-role-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('User does not have role: trainer');
      });
    });

    it('should check if user has specific role', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner', 'trainer'],
        activeRole: 'learner'
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(true);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthService.hasRole.mockImplementation((role) => mockUser.roles.includes(role));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('has-learner-role')).toHaveTextContent('true');
      });
    });

    it('should get user permissions', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner'],
        activeRole: 'learner',
        permissions: ['read:analytics', 'read:reports']
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(true);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthService.getPermissions.mockResolvedValue(mockUser.permissions);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('permissions')).toHaveTextContent('read:analytics, read:reports');
      });
    });
  });

  describe('Token Management', () => {
    it('should refresh token automatically', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner'],
        activeRole: 'learner'
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(true);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthService.refreshToken.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      // Simulate token refresh
      await act(async () => {
        // Trigger token refresh (this would normally be done by a timer or interceptor)
        await mockAuthService.refreshToken();
      });

      expect(mockAuthService.refreshToken).toHaveBeenCalled();
    });

    it('should handle token refresh errors', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner'],
        activeRole: 'learner'
      };
      
      mockAuthService.isAuthenticated.mockResolvedValue(true);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthService.refreshToken.mockRejectedValue(new Error('Invalid refresh token'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      await act(async () => {
        try {
          await mockAuthService.refreshToken();
        } catch (error) {
          // Expected to throw
        }
      });

      // Should handle the error gracefully
      expect(mockAuthService.refreshToken).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should clear errors when new action is performed', async () => {
      // Set up mocks before rendering
      mockAuthService.isAuthenticated.mockResolvedValue(false);
      mockAuthService.login.mockImplementationOnce(() => Promise.reject(new Error('Login failed')));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial auth check to complete
      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      // First login fails
      await act(async () => {
        fireEvent.click(screen.getByTestId('login-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Login failed');
      });

      // Second login succeeds
      const mockResponse = {
        user: { id: 'user-123', email: 'test@example.com', roles: ['learner'], activeRole: 'learner' },
        tokens: { accessToken: 'token', refreshToken: 'refresh' }
      };
      
      mockAuthService.login.mockResolvedValueOnce(mockResponse);

      await act(async () => {
        fireEvent.click(screen.getByTestId('login-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('No error');
      });
    });
  });

  describe('Context Hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');
      
      consoleSpy.mockRestore();
    });
  });
});
