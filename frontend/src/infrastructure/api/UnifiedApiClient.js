/**
 * @class UnifiedApiClient
 * @description Unified API client using Axios with comprehensive features
 */

import axios from 'axios';

// Get base URL from environment variables (Vite: import.meta.env)
const getApiBaseURL = () => {
  // Try to get from environment variable
  if (typeof import.meta !== 'undefined' && import.meta.env.VITE_API_BASE_URL) {
    const url = import.meta.env.VITE_API_BASE_URL;
    console.log('🔗 Using API Base URL from environment:', url);
    return url;
  }
  
  // Fallback for development
  console.warn('⚠️ VITE_API_BASE_URL not set, using localhost fallback');
  return 'http://localhost:3000/api/v1';
};

export class UnifiedApiClient {
  constructor(config = {}) {
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: config.baseURL || getApiBaseURL(),
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    });

    // Setup interceptors
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  setupRequestInterceptor() {
    this.client.interceptors.request.use(
      (config) => {
        // Don't add auth headers for authentication endpoints
        const isAuthEndpoint = config.url?.includes('/auth/login') || 
                               config.url?.includes('/auth/register');
        
        if (!isAuthEndpoint) {
          // Add auth token from localStorage
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          // Add active role header - get from user object in context if available
          const userStr = sessionStorage.getItem('current_user');
          let activeRole = localStorage.getItem('active_role');
          
          // If no active role in localStorage, try to get from user object
          if (!activeRole && userStr) {
            try {
              const user = JSON.parse(userStr);
              activeRole = user.role || user.activeRole;
            } catch (e) {
              console.warn('Failed to parse user from sessionStorage:', e);
            }
          }
          
          if (activeRole) {
            config.headers['X-Active-Role'] = activeRole;
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  setupResponseInterceptor() {
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle specific error cases
        if (error.response?.status === 401) {
          // Unauthorized - clear token and session data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('active_role');
          sessionStorage.removeItem('current_user');
          
          // Only redirect if not already on login page and not an auth endpoint
          const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                                 error.config?.url?.includes('/auth/register') ||
                                 error.config?.url?.includes('/auth/me') ||
                                 error.config?.url?.includes('/auth/validate');
          
          // Don't redirect if checking auth status (auth/me, auth/validate)
          if (!isAuthEndpoint && window.location.pathname !== '/login') {
            // Use window.location.href to trigger full page reload and clear state
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Auth token management
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  removeAuthToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('active_role');
  }

  setActiveRole(role) {
    if (role) {
      localStorage.setItem('active_role', role);
    } else {
      localStorage.removeItem('active_role');
    }
  }

  // HTTP methods with validation
  async get(endpoint, config = {}) {
    this.validateEndpoint(endpoint);
    try {
      const response = await this.client.get(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'GET', endpoint);
    }
  }

  async post(endpoint, data, config = {}) {
    this.validateEndpoint(endpoint);
    this.validateData(data);
    try {
      const response = await this.client.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'POST', endpoint);
    }
  }

  async put(endpoint, data, config = {}) {
    this.validateEndpoint(endpoint);
    this.validateData(data);
    try {
      const response = await this.client.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'PUT', endpoint);
    }
  }

  async delete(endpoint, config = {}) {
    this.validateEndpoint(endpoint);
    try {
      const response = await this.client.delete(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'DELETE', endpoint);
    }
  }

  // Validation methods
  validateEndpoint(endpoint) {
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint: must be a non-empty string');
    }
    if (!endpoint.startsWith('/')) {
      throw new Error('Invalid endpoint: must start with "/"');
    }
  }

  validateData(data) {
    if (data === undefined || data === null) {
      return; // Allow undefined/null for optional data
    }
    if (typeof data !== 'object') {
      throw new Error('Invalid data: must be an object');
    }
  }

  // Error handling
  handleError(error, method, endpoint) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message || 'Unknown error';
      
      return new Error(`API ${method} ${endpoint} failed (${status}): ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error(`API ${method} ${endpoint} failed: Network error - no response received`);
    } else {
      // Something else happened
      return new Error(`API ${method} ${endpoint} failed: ${error.message}`);
    }
  }

  // Utility methods
  getBaseURL() {
    return this.client.defaults.baseURL;
  }

  setTimeout(timeout) {
    this.client.defaults.timeout = timeout;
  }

  setBaseURL(baseURL) {
    this.client.defaults.baseURL = baseURL;
  }
}

// Create singleton instance
export const unifiedApiClient = new UnifiedApiClient();
