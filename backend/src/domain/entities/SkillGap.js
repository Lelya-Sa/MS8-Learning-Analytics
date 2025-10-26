/**
 * @file SkillGap Entity
 * @description SkillGap domain entity following Onion Architecture
 * @author MS8 Learning Analytics Team
 * @version 1.0.0
 */

/**
 * @class SkillGap
 * @description SkillGap domain entity with validation and business logic
 */
export class SkillGap {
  constructor(skillGapData) {
    this.validateSkillGapData(skillGapData);
    
    this.userId = skillGapData.userId;
    this.skill = skillGapData.skill;
    this.currentLevel = skillGapData.currentLevel;
    this.targetLevel = skillGapData.targetLevel;
    this.gapScore = skillGapData.gapScore;
    this.priority = skillGapData.priority;
    this.learningPath = skillGapData.learningPath || [];
    this.lastUpdated = skillGapData.lastUpdated || new Date();
    this.createdAt = skillGapData.createdAt || new Date();
    this.updatedAt = skillGapData.updatedAt || new Date();
  }

  /**
   * Validate skill gap data
   * @param {Object} skillGapData - Skill gap data object
   * @throws {Error} If validation fails
   */
  validateSkillGapData(skillGapData) {
    if (!skillGapData.userId) {
      throw new Error('User ID is required');
    }
    
    if (!skillGapData.skill) {
      throw new Error('Skill is required');
    }
    
    if (skillGapData.priority && !this.isValidPriority(skillGapData.priority)) {
      throw new Error(`Invalid priority: ${skillGapData.priority}`);
    }
    
    if (skillGapData.gapScore !== undefined) {
      this.validateGapScore(skillGapData.gapScore);
    }
  }

  /**
   * Validate priority
   * @param {string} priority - Priority to validate
   * @returns {boolean} True if valid
   */
  isValidPriority(priority) {
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    return validPriorities.includes(priority);
  }

  /**
   * Validate gap score
   * @param {number} gapScore - Gap score to validate
   * @throws {Error} If gap score is invalid
   */
  validateGapScore(gapScore) {
    if (gapScore < 0 || gapScore > 1) {
      throw new Error('Gap score must be between 0 and 1');
    }
  }

  /**
   * Get gap percentage
   * @returns {number} Gap percentage
   */
  getGapPercentage() {
    return Math.round(this.gapScore * 100);
  }

  /**
   * Get gap status
   * @returns {string} Gap status
   */
  getGapStatus() {
    if (this.gapScore <= 0.2) {
      return 'small';
    } else if (this.gapScore <= 0.5) {
      return 'medium';
    } else if (this.gapScore <= 0.8) {
      return 'large';
    } else {
      return 'critical';
    }
  }

  /**
   * Calculate gap size
   * @returns {number} Gap size in levels
   */
  getGapSize() {
    return this.targetLevel - this.currentLevel;
  }

  /**
   * Convert to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      userId: this.userId,
      skill: this.skill,
      currentLevel: this.currentLevel,
      targetLevel: this.targetLevel,
      gapScore: this.gapScore,
      priority: this.priority,
      learningPath: this.learningPath,
      lastUpdated: this.lastUpdated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
