/**
 * @file Analytics Entity
 * @description Core Analytics domain entity following Onion Architecture
 * @author MS8 Learning Analytics Team
 * @version 1.0.0
 */

/**
 * @class Analytics
 * @description Analytics domain entity with validation and business logic
 */
export class Analytics {
  constructor(analyticsData) {
    this.validateAnalyticsData(analyticsData);
    
    this.id = analyticsData.id;
    this.userId = analyticsData.userId;
    this.role = analyticsData.role;
    this.type = analyticsData.type;
    this.data = analyticsData.data || {};
    this.timestamp = analyticsData.timestamp || new Date();
    this.source = analyticsData.source || 'api';
    this.createdAt = analyticsData.createdAt || new Date();
    this.updatedAt = analyticsData.updatedAt || new Date();
  }

  /**
   * Validate analytics data
   * @param {Object} analyticsData - Analytics data object
   * @throws {Error} If validation fails
   */
  validateAnalyticsData(analyticsData) {
    if (!analyticsData.id) {
      throw new Error('Analytics ID is required');
    }
    
    if (!analyticsData.userId) {
      throw new Error('User ID is required');
    }
    
    if (!this.isValidRole(analyticsData.role)) {
      throw new Error(`Invalid role: ${analyticsData.role}`);
    }
    
    if (!this.isValidAnalyticsType(analyticsData.type)) {
      throw new Error(`Invalid analytics type: ${analyticsData.type}`);
    }
  }

  /**
   * Validate role
   * @param {string} role - Role to validate
   * @returns {boolean} True if valid
   */
  isValidRole(role) {
    const validRoles = ['learner', 'trainer', 'org_admin'];
    return validRoles.includes(role);
  }

  /**
   * Validate analytics type
   * @param {string} type - Analytics type to validate
   * @returns {boolean} True if valid
   */
  isValidAnalyticsType(type) {
    const validTypes = [
      'learning_velocity',
      'skill_gap',
      'engagement',
      'mastery',
      'performance',
      'content_effectiveness',
      'course_performance',
      'course_health',
      'student_distribution',
      'teaching_effectiveness',
      'organization_learning_velocity',
      'strategic_alignment',
      'learning_culture',
      'org_performance',
      'peer_comparison',
      'skill_demand',
      'drop_off_risk',
      'performance_forecast',
      'recommendations'
    ];
    return validTypes.includes(type);
  }

  /**
   * Check if analytics is stale (older than 6 hours)
   * @returns {boolean} True if stale
   */
  isStale() {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    return this.timestamp < sixHoursAgo;
  }

  /**
   * Get age in hours
   * @returns {number} Age in hours
   */
  getAgeInHours() {
    const now = new Date();
    const diffInMs = now - this.timestamp;
    return Math.floor(diffInMs / (1000 * 60 * 60));
  }

  /**
   * Update analytics data
   * @param {Object} newData - New analytics data
   */
  updateData(newData) {
    this.data = { ...this.data, ...newData };
    this.timestamp = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Convert to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      role: this.role,
      type: this.type,
      data: this.data,
      timestamp: this.timestamp,
      source: this.source,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}