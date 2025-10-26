/**
 * @file User Entity
 * @description Core User domain entity following Onion Architecture
 * @author MS8 Learning Analytics Team
 * @version 1.0.0
 */

/**
 * @class User
 * @description User domain entity with validation and business logic
 */
export class User {
  constructor(userData) {
    this.validateUserData(userData);
    
    this.id = userData.id;
    this.email = userData.email;
    this.fullName = userData.fullName;
    this.roles = userData.roles || [];
    this.activeRole = userData.activeRole || this.roles[0];
    this.organizationId = userData.organizationId;
    this.avatarUrl = userData.avatarUrl;
    this.createdAt = userData.createdAt || new Date();
    this.updatedAt = userData.updatedAt || new Date();
  }

  /**
   * Validate user data
   * @param {Object} userData - User data object
   * @throws {Error} If validation fails
   */
  validateUserData(userData) {
    if (!userData.id) {
      throw new Error('User ID is required');
    }
    
    if (!userData.email) {
      throw new Error('User email is required');
    }
    
    if (!this.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    
    if (userData.roles && !Array.isArray(userData.roles)) {
      throw new Error('Roles must be an array');
    }
    
    if (userData.activeRole && userData.roles && !userData.roles.includes(userData.activeRole)) {
      throw new Error('Active role must be in roles array');
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
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has role
   */
  hasRole(role) {
    return this.roles.includes(role);
  }

  /**
   * Switch active role
   * @param {string} role - New active role
   * @throws {Error} If role is not available
   */
  switchRole(role) {
    if (!this.hasRole(role)) {
      throw new Error(`User does not have role: ${role}`);
    }
    this.activeRole = role;
    this.updatedAt = new Date();
  }

  /**
   * Get user display name
   * @returns {string} Display name
   */
  getDisplayName() {
    return this.fullName || this.email.split('@')[0];
  }

  /**
   * Check if user is learner
   * @returns {boolean} True if learner
   */
  isLearner() {
    return this.hasRole('learner');
  }

  /**
   * Check if user is trainer
   * @returns {boolean} True if trainer
   */
  isTrainer() {
    return this.hasRole('trainer');
  }

  /**
   * Check if user is org admin
   * @returns {boolean} True if org admin
   */
  isOrgAdmin() {
    return this.hasRole('org_admin');
  }

  /**
   * Convert to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      roles: this.roles,
      activeRole: this.activeRole,
      organizationId: this.organizationId,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}