/**
 * @file LearningVelocity Entity
 * @description LearningVelocity domain entity following Onion Architecture
 * @author MS8 Learning Analytics Team
 * @version 1.0.0
 */

/**
 * @class LearningVelocity
 * @description LearningVelocity domain entity with validation and business logic
 */
export class LearningVelocity {
  constructor(velocityData) {
    this.validateVelocityData(velocityData);
    
    this.userId = velocityData.userId;
    this.currentVelocity = velocityData.currentVelocity;
    this.targetVelocity = velocityData.targetVelocity;
    this.trend = velocityData.trend || 'neutral';
    this.weeklyProgress = velocityData.weeklyProgress || [];
    this.lastUpdated = velocityData.lastUpdated || new Date();
    this.createdAt = velocityData.createdAt || new Date();
    this.updatedAt = velocityData.updatedAt || new Date();
  }

  /**
   * Validate velocity data
   * @param {Object} velocityData - Velocity data object
   * @throws {Error} If validation fails
   */
  validateVelocityData(velocityData) {
    if (!velocityData.userId) {
      throw new Error('User ID is required');
    }
    
    if (velocityData.currentVelocity !== undefined) {
      this.validateVelocityRange(velocityData.currentVelocity, 'currentVelocity');
    }
    
    if (velocityData.targetVelocity !== undefined) {
      this.validateVelocityRange(velocityData.targetVelocity, 'targetVelocity');
    }
    
    if (velocityData.trend && !this.isValidTrend(velocityData.trend)) {
      throw new Error(`Invalid trend: ${velocityData.trend}`);
    }
    
    if (velocityData.weeklyProgress && !Array.isArray(velocityData.weeklyProgress)) {
      throw new Error('Weekly progress must be an array');
    }
  }

  /**
   * Validate velocity range
   * @param {number} velocity - Velocity value
   * @param {string} field - Field name for error message
   * @throws {Error} If velocity is out of range
   */
  validateVelocityRange(velocity, field) {
    if (velocity < 0 || velocity > 100) {
      throw new Error('Velocity must be between 0 and 100');
    }
  }

  /**
   * Validate trend
   * @param {string} trend - Trend to validate
   * @returns {boolean} True if valid
   */
  isValidTrend(trend) {
    const validTrends = ['up', 'down', 'neutral'];
    return validTrends.includes(trend);
  }

  /**
   * Get velocity percentage relative to target
   * @returns {number} Velocity percentage
   */
  getVelocityPercentage() {
    if (!this.targetVelocity || this.targetVelocity === 0) {
      return 0;
    }
    return Math.round((this.currentVelocity / this.targetVelocity) * 100);
  }

  /**
   * Get velocity status
   * @returns {string} Velocity status
   */
  getVelocityStatus() {
    const percentage = this.getVelocityPercentage();
    
    if (percentage >= 100) {
      return 'excellent';
    } else if (percentage >= 80) {
      return 'good';
    } else if (percentage >= 60) {
      return 'fair';
    } else {
      return 'needs_improvement';
    }
  }

  /**
   * Calculate average weekly progress
   * @returns {number} Average progress
   */
  getAverageWeeklyProgress() {
    if (!this.weeklyProgress || this.weeklyProgress.length === 0) {
      return 0;
    }
    
    const sum = this.weeklyProgress.reduce((acc, val) => acc + val, 0);
    return sum / this.weeklyProgress.length;
  }

  /**
   * Get progress trend
   * @returns {string} Progress trend
   */
  getProgressTrend() {
    if (!this.weeklyProgress || this.weeklyProgress.length < 2) {
      return 'neutral';
    }
    
    const first = this.weeklyProgress[0];
    const last = this.weeklyProgress[this.weeklyProgress.length - 1];
    
    if (last > first) {
      return 'up';
    } else if (last < first) {
      return 'down';
    } else {
      return 'neutral';
    }
  }

  /**
   * Update velocity
   * @param {number} newVelocity - New velocity value
   */
  updateVelocity(newVelocity) {
    this.validateVelocityRange(newVelocity, 'currentVelocity');
    this.currentVelocity = newVelocity;
    this.lastUpdated = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Add weekly progress point
   * @param {number} progress - Progress value
   */
  addWeeklyProgress(progress) {
    this.validateVelocityRange(progress, 'weeklyProgress');
    this.weeklyProgress.push(progress);
    
    // Keep only last 12 weeks
    if (this.weeklyProgress.length > 12) {
      this.weeklyProgress = this.weeklyProgress.slice(-12);
    }
    
    this.lastUpdated = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Convert to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      userId: this.userId,
      currentVelocity: this.currentVelocity,
      targetVelocity: this.targetVelocity,
      trend: this.trend,
      weeklyProgress: this.weeklyProgress,
      lastUpdated: this.lastUpdated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
