/**
 * @file AuthService
 * @description Authentication service following Onion Architecture
 * @author MS8 Learning Analytics Team
 * @version 1.0.0
 */

import { UnifiedApiClient } from '../../infrastructure/api/UnifiedApiClient';
import { LocalStorageCacheAdapter } from '../../infrastructure/api/LocalStorageCacheAdapter';

/**
 * @class AuthService
 * @description Authentication service with comprehensive auth management
 */
export class AuthService {
  constructor(apiClient = null, cacheAdapter = null) {
    this.apiClient = apiClient || new UnifiedApiClient();
    this.cacheAdapter = cacheAdapter || new LocalStorageCacheAdapter();
  }

  /**
   * Login user with email and password
   * @param {string|Object} emailOrCredentials - User email or credentials object
   * @param {string} password - User password (if first param is email)
   * @returns {Promise<Object>} Login response with user and tokens
   */
  async login(emailOrCredentials, password) {
    let credentials;
    
    // Handle both formats: login(email, password) and login({email, password})
    if (typeof emailOrCredentials === 'string') {
      credentials = { email: emailOrCredentials, password };
    } else {
      credentials = emailOrCredentials;
    }
    
    this.validateCredentials(credentials);
    
    try {
      const response = await this.apiClient.post('/auth/login', credentials);
      
      // Store token and user data
      this.apiClient.setAuthToken(response.token);
      await this.cacheAdapter.set('tokens', { accessToken: response.token }, 3600);
      await this.cacheAdapter.set('user', response.user, 3600);
      
      // Also store in sessionStorage for easier access
      if (response.user) {
        sessionStorage.setItem('current_user', JSON.stringify(response.user));
        
        // Set active role based on user's roles
        const user = response.user;
        if (user.roles && user.roles.length > 0 && !user.role) {
          user.role = user.roles[0]; // Default to first role
        }
        if (user.role) {
          this.apiClient.setActiveRole(user.role);
          sessionStorage.setItem('current_user', JSON.stringify(user));
        }
      }

      return {
        token: response.token,
        user: response.user
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await this.apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with local cleanup even if server logout fails
      console.warn('Server logout failed:', error.message);
    }
    
    // Clear local authentication data
    this.apiClient.removeAuthToken();
    await this.cacheAdapter.remove('user');
    await this.cacheAdapter.remove('tokens');
    
    // Clear sessionStorage
    sessionStorage.removeItem('current_user');
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken() {
    try {
      const response = await this.apiClient.post('/auth/refresh');
      
      // Backend returns { token, expires_in } format
      // Update stored tokens
      if (response.token) {
        this.apiClient.setAuthToken(response.token);
        await this.cacheAdapter.set('tokens', { accessToken: response.token }, 3600);
      }
      
      return { accessToken: response.token };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Validate current token
   * @returns {Promise<Object>} Token validation result
   */
  async validateToken() {
    try {
      const response = await this.apiClient.get('/auth/validate');
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Get current user
   * @returns {Promise<Object|null>} Current user or null
   */
  async getCurrentUser() {
    try {
      // Try to get user from cache first
      let user = await this.cacheAdapter.get('user');
      
      if (!user) {
        // Fetch from API if not in cache
        const response = await this.apiClient.get('/auth/me');
        user = response.user;
        
        // Cache the user data
        await this.cacheAdapter.set('user', user, 3600);
      }
      
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error.message);
      return null;
    }
  }

  /**
   * Switch user role
   * @param {string} role - New active role
   * @returns {Promise<Object>} Updated user data
   */
  async switchRole(role) {
    const currentUser = await this.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }
    
    if (!currentUser.roles.includes(role)) {
      throw new Error(`User does not have role: ${role}`);
    }
    
    try {
      // Update active role locally
      this.apiClient.setActiveRole(role);
      
      // Update cached user data with new active role
      const updatedUser = { ...currentUser, role: role };
      await this.cacheAdapter.set('user', updatedUser, 3600);
      
      // Update sessionStorage
      sessionStorage.setItem('current_user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} True if authenticated
   */
  async isAuthenticated() {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {Promise<boolean>} True if user has role
   */
  async hasRole(role) {
    try {
      const user = await this.getCurrentUser();
      return !!(user && user.roles && user.roles.includes(role));
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user permissions
   * @returns {Promise<Array>} User permissions
   */
  async getPermissions() {
    try {
      const user = await this.getCurrentUser();
      return user ? user.permissions || [] : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<void>}
   */
  async changePassword(passwordData) {
    this.validatePasswordStrength(passwordData.newPassword);
    
    try {
      await this.apiClient.post('/auth/change-password', passwordData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Reset password
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.email - User email
   * @returns {Promise<void>}
   */
  async resetPassword(resetData) {
    try {
      await this.apiClient.post('/auth/reset-password', resetData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Clear all authentication data
   * @returns {Promise<void>}
   */
  async clearAuthData() {
    this.apiClient.removeAuthToken();
    await this.cacheAdapter.clear();
  }

  /**
   * Check session validity
   * @returns {Promise<Object>} Session validation result
   */
  async checkSessionValidity() {
    try {
      const response = await this.apiClient.get('/auth/session/validate');
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Validate login credentials
   * @param {Object} credentials - Login credentials
   * @throws {Error} If validation fails
   */
  validateCredentials(credentials) {
    if (!credentials.email) {
      throw new Error('Email is required');
    }
    
    if (!credentials.password) {
      throw new Error('Password is required');
    }
    
    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @throws {Error} If password is weak
   */
  validatePasswordStrength(password) {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      throw new Error('Password must contain at least one number');
    }
  }
}
