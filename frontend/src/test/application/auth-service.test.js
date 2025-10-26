/**
 * @file Authentication Service Tests
 * @description Tests for authentication service following Init_Prompt Phase 3A TDD methodology
 * RED phase - Write failing tests first
 */

import { AuthService } from '../../application/services/AuthService';
import { UnifiedApiClient } from '../../infrastructure/api/UnifiedApiClient';
import { LocalStorageCacheAdapter } from '../../infrastructure/api/LocalStorageCacheAdapter';

// Mock dependencies
jest.mock('../../infrastructure/api/UnifiedApiClient');
jest.mock('../../infrastructure/api/LocalStorageCacheAdapter');

describe('Authentication Service', () => {
  let authService;
  let mockApiClient;
  let mockCacheAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockApiClient = {
      post: jest.fn(),
      get: jest.fn(),
      setAuthToken: jest.fn(),
      removeAuthToken: jest.fn(),
      setActiveRole: jest.fn()
    };
    
    mockCacheAdapter = {
      set: jest.fn(),
      get: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    };
    
    UnifiedApiClient.mockImplementation(() => mockApiClient);
    LocalStorageCacheAdapter.mockImplementation(() => mockCacheAdapter);
    
    authService = new AuthService();
  });

  describe('Login', () => {
    it('should login user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockResponse = {
        token: 'access-token-123',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          fullName: 'John Doe',
          roles: ['learner'],
          activeRole: 'learner',
          organizationId: 'org-123'
        }
      };
      
      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login(credentials);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(mockApiClient.setAuthToken).toHaveBeenCalledWith('access-token-123');
      expect(mockCacheAdapter.set).toHaveBeenCalledWith('user', mockResponse.user, 3600);
      expect(mockCacheAdapter.set).toHaveBeenCalledWith('tokens', { accessToken: 'access-token-123' }, 3600);
      expect(result).toEqual(mockResponse);
    });

    it('should handle login errors', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };
      
      mockApiClient.post.mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should validate login credentials', async () => {
      const invalidCredentials = {
        email: 'invalid-email',
        password: '123'
      };

      await expect(authService.login(invalidCredentials)).rejects.toThrow('Invalid email format');
    });
  });

  describe('Logout', () => {
    it('should logout user successfully', async () => {
      mockApiClient.post.mockResolvedValueOnce({ success: true });

      await authService.logout();

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(mockApiClient.removeAuthToken).toHaveBeenCalled();
      expect(mockCacheAdapter.remove).toHaveBeenCalledWith('user');
      expect(mockCacheAdapter.remove).toHaveBeenCalledWith('tokens');
    });

    it('should handle logout errors gracefully', async () => {
      mockApiClient.post.mockRejectedValueOnce(new Error('Network error'));

      // Should still clear local data even if server logout fails
      await authService.logout();

      expect(mockApiClient.removeAuthToken).toHaveBeenCalled();
      expect(mockCacheAdapter.remove).toHaveBeenCalledWith('user');
      expect(mockCacheAdapter.remove).toHaveBeenCalledWith('tokens');
    });
  });

  describe('Token Management', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        token: 'new-access-token-123'
      };
      
      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.refreshToken();

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/refresh');
      expect(mockApiClient.setAuthToken).toHaveBeenCalledWith('new-access-token-123');
      expect(mockCacheAdapter.set).toHaveBeenCalledWith('tokens', { accessToken: 'new-access-token-123' }, 3600);
      expect(result).toEqual({ accessToken: 'new-access-token-123' });
    });

    it('should handle refresh token errors', async () => {
      mockApiClient.post.mockRejectedValueOnce(new Error('Invalid refresh token'));

      await expect(authService.refreshToken()).rejects.toThrow('Invalid refresh token');
    });

    it('should validate token', async () => {
      const mockValidation = { valid: true, user: { id: 'user-123' } };
      
      mockApiClient.get.mockResolvedValueOnce(mockValidation);

      const result = await authService.validateToken();

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/validate');
      expect(result).toEqual(mockValidation);
    });
  });

  describe('User Management', () => {
    it('should get current user from cache', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'John Doe',
        roles: ['learner'],
        activeRole: 'learner',
        organizationId: 'org-123'
      };
      
      mockCacheAdapter.get.mockResolvedValueOnce(mockUser);

      const result = await authService.getCurrentUser();

      expect(mockCacheAdapter.get).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockUser);
    });

    it('should fetch current user from API if not in cache', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'John Doe',
        roles: ['learner'],
        activeRole: 'learner',
        organizationId: 'org-123'
      };
      
      mockCacheAdapter.get.mockResolvedValueOnce(null);
      mockApiClient.get.mockResolvedValueOnce({ user: mockUser });

      const result = await authService.getCurrentUser();

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(mockCacheAdapter.set).toHaveBeenCalledWith('user', mockUser, 3600);
      expect(result).toEqual(mockUser);
    });

    it('should switch user role', async () => {
      const currentUser = {
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'John Doe',
        roles: ['learner', 'trainer'],
        activeRole: 'learner',
        organizationId: 'org-123'
      };
      
      const mockResponse = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          fullName: 'John Doe',
          roles: ['learner', 'trainer'],
          activeRole: 'trainer',
          organizationId: 'org-123'
        }
      };
      
      mockCacheAdapter.get.mockResolvedValueOnce(currentUser);

      const result = await authService.switchRole('trainer');

      expect(mockApiClient.setActiveRole).toHaveBeenCalledWith('trainer');
      expect(mockCacheAdapter.set).toHaveBeenCalledWith('user', expect.objectContaining({
        ...currentUser,
        role: 'trainer'
      }), 3600);
      expect(result).toEqual(expect.objectContaining({
        ...currentUser,
        role: 'trainer'
      }));
    });

    it('should validate role switch', async () => {
      const currentUser = {
        id: 'user-123',
        roles: ['learner'],
        activeRole: 'learner'
      };
      
      mockCacheAdapter.get.mockResolvedValueOnce(currentUser);

      await expect(authService.switchRole('trainer')).rejects.toThrow('User does not have role: trainer');
    });
  });

  describe('Authentication State', () => {
    it('should check if user is authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        roles: ['learner'],
        activeRole: 'learner'
      };
      
      mockCacheAdapter.get.mockResolvedValueOnce(mockUser);

      const result = await authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if user is not authenticated', async () => {
      mockCacheAdapter.get.mockResolvedValueOnce(null);

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should check if user has specific role', async () => {
      const mockUser = {
        id: 'user-123',
        roles: ['learner', 'trainer'],
        activeRole: 'learner'
      };
      
      mockCacheAdapter.get.mockResolvedValueOnce(mockUser);

      const hasLearnerRole = await authService.hasRole('learner');
      const hasAdminRole = await authService.hasRole('admin');

      expect(hasLearnerRole).toBe(true);
      expect(hasAdminRole).toBe(false);
    });

    it('should get user permissions', async () => {
      const mockUser = {
        id: 'user-123',
        roles: ['learner'],
        activeRole: 'learner',
        permissions: ['read:analytics', 'read:reports']
      };
      
      mockCacheAdapter.get.mockResolvedValueOnce(mockUser);

      const result = await authService.getPermissions();

      expect(result).toEqual(['read:analytics', 'read:reports']);
    });
  });

  describe('Password Management', () => {
    it('should change password successfully', async () => {
      const passwordData = {
        currentPassword: 'oldpassword123',
        newPassword: 'NewPassword123'
      };
      
      mockApiClient.post.mockResolvedValueOnce({ success: true });

      await authService.changePassword(passwordData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/change-password', passwordData);
    });

    it('should validate password strength', async () => {
      const weakPassword = {
        currentPassword: 'oldpassword123',
        newPassword: '123'
      };

      await expect(authService.changePassword(weakPassword)).rejects.toThrow('Password must be at least 8 characters');
    });

    it('should reset password', async () => {
      const resetData = {
        email: 'test@example.com'
      };
      
      mockApiClient.post.mockResolvedValueOnce({ success: true });

      await authService.resetPassword(resetData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/reset-password', resetData);
    });
  });

  describe('Session Management', () => {
    it('should clear all authentication data', async () => {
      await authService.clearAuthData();

      expect(mockApiClient.removeAuthToken).toHaveBeenCalled();
      expect(mockCacheAdapter.clear).toHaveBeenCalled();
    });

    it('should check session validity', async () => {
      const mockValidation = { valid: true, expiresAt: Date.now() + 3600000 };
      
      mockApiClient.get.mockResolvedValueOnce(mockValidation);

      const result = await authService.checkSessionValidity();

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/session/validate');
      expect(result).toEqual(mockValidation);
    });
  });
});
