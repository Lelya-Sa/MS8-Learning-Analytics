/**
 * Auth Service with MS12 Integration
 * Implements authentication with MS12 (MS12) with fallback to mock data
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');
const { userService } = require('./mockData');

class AuthService {
  constructor() {
    // MS12 Configuration
    this.ms12BaseUrl = process.env.MS12_API_URL || 'https://ms12-production.up.railway.app';
    this.ms12ApiKey = process.env.MS12_API_KEY || '';
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.timeout = 5000; // 5 seconds
  }

  /**
   * Attempt to authenticate with MS12
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication result
   */
  async authenticateWithMS12(email, password) {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await axios.post(
          `${this.ms12BaseUrl}/api/v1/auth/login`,
          { email, password },
          {
            timeout: this.timeout,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': this.ms12ApiKey
            }
          }
        );

        return {
          success: true,
          token: response.data.token,
          user: response.data.user,
          source: 'MS12'
        };
      } catch (error) {
        console.error(`MS12 authentication attempt ${attempt} failed:`, error.message);
        
        // If it's the last attempt, return error
        if (attempt === this.retryAttempts) {
          return {
            success: false,
            error: error.message,
            source: 'MS12'
          };
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  /**
   * Generate JWT token from MS12 token or mock user
   * @param {Object} ms12Response - Response from MS12 or null
   * @param {Object} mockUser - Mock user data
   * @returns {string} JWT token
   */
  generateJWTToken(ms12Response, mockUser = null) {
    const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret-key-DO-NOT-USE-IN-PRODUCTION';
    
    // Use MS12 data if available, otherwise use mock data
    const userData = ms12Response?.success ? ms12Response.user : mockUser;
    
    return jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        role: userData.role,
        roles: userData.roles || [userData.role],
        organizationId: userData.organization_id || userData.organizationId,
        source: ms12Response?.success ? 'MS12' : 'MOCK'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  /**
   * Authenticate user with MS12 fallback to mock data
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication result
   */
  async authenticate(email, password) {
    console.log('🔐 Starting authentication for:', email);
    
    // Attempt MS12 authentication
    const ms12Response = await this.authenticateWithMS12(email, password);
    
    if (ms12Response.success) {
      // MS12 authentication successful
      console.log('✓ Successfully authenticated with MS12');
      
      return {
        token: ms12Response.token, // Use MS12 token directly or generate JWT
        user: ms12Response.user,
        source: 'MS12'
      };
    }
    
    // Fallback to mock authentication
    console.log('⚠ MS12 unavailable, falling back to mock authentication');
    
    console.log('🔍 Looking up mock user by email:', email);
    const mockUser = userService.findByEmail(email);
    console.log('👤 Mock user found:', mockUser ? 'YES' : 'NO');
    
    if (!mockUser) {
      console.error('❌ User not found in mock data');
      throw new Error('Invalid credentials');
    }
    
    console.log('🔑 Validating password');
    const isValidPassword = userService.validatePassword(password, mockUser);
    console.log('🔑 Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.error('❌ Invalid password');
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token for mock user
    console.log('🎫 Generating JWT token');
    const token = this.generateJWTToken(null, mockUser);
    
    console.log('✅ Authentication successful, returning token and user');
    return {
      token,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        roles: mockUser.roles || [mockUser.role],
        organization_id: mockUser.organization_id,
        fullName: mockUser.fullName,
        department: mockUser.department
      },
      source: 'MOCK'
    };
  }

  /**
   * Validate token with MS12
   * @param {string} token - Token to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateTokenWithMS12(token) {
    try {
      const response = await axios.post(
        `${this.ms12BaseUrl}/api/v1/auth/validate`,
        { token },
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return {
        success: true,
        user: response.data.user,
        source: 'MS12'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        source: 'MS12'
      };
    }
  }

  /**
   * Get user by ID from MS12
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserFromMS12(userId) {
    try {
      const response = await axios.get(
        `${this.ms12BaseUrl}/api/v1/users/${userId}`,
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        user: response.data,
        source: 'MS12'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        source: 'MS12'
      };
    }
  }

  /**
   * Get current user with MS12 fallback
   * @param {string} userId - User ID from JWT
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser(userId) {
    // Try MS12 first
    const ms12Response = await this.getUserFromMS12(userId);
    
    if (ms12Response.success) {
      return {
        user: ms12Response.user,
        source: 'MS12'
      };
    }
    
    // Fallback to mock data
    const mockUser = userService.findById(userId);
    
    if (!mockUser) {
      throw new Error('User not found');
    }
    
    return {
      user: {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        roles: mockUser.roles || [mockUser.role],
        organization_id: mockUser.organization_id,
        fullName: mockUser.fullName,
        department: mockUser.department
      },
      source: 'MOCK'
    };
  }
}

module.exports = { AuthService };
