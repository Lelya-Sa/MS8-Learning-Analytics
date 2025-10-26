/**
 * StrategicAlignment Domain Entity
 * 
 * Represents strategic alignment analytics for organizations.
 * Tracks alignment between learning initiatives and strategic goals.
 * 
 * @fileoverview Domain entity for strategic alignment analytics
 */

/**
 * StrategicAlignment entity class
 * 
 * @class StrategicAlignment
 * @description Domain entity representing strategic alignment analytics
 */
export class StrategicAlignment {
  /**
   * Creates a StrategicAlignment instance
   * 
   * @param {Object} data - Strategic alignment data
   * @param {number} data.overallAlignment - Overall alignment score (0-100)
   * @param {string} data.alignmentGrade - Alignment grade (A, B, C, D, F)
   * @param {StrategicGoal[]} data.strategicGoals - Array of strategic goals
   * @param {GapAnalysis} data.gapAnalysis - Gap analysis data
   * @param {string} data.period - Analysis period
   * @param {string} data.lastUpdated - Last updated timestamp
   * @param {string} data.staleness - Data staleness indicator
   */
  constructor(data) {
    this.overallAlignment = data.overallAlignment || 0;
    this.alignmentGrade = data.alignmentGrade || 'F';
    this.strategicGoals = data.strategicGoals || [];
    this.gapAnalysis = data.gapAnalysis || null;
    this.period = data.period || '';
    this.lastUpdated = data.lastUpdated || '';
    this.staleness = data.staleness || 'fresh';
  }

  /**
   * Get overall alignment score
   * 
   * @returns {number} Overall alignment score
   */
  getOverallAlignment() {
    return this.overallAlignment;
  }

  /**
   * Get alignment grade
   * 
   * @returns {string} Alignment grade
   */
  getAlignmentGrade() {
    return this.alignmentGrade;
  }

  /**
   * Get strategic goals
   * 
   * @returns {StrategicGoal[]} Array of strategic goals
   */
  getStrategicGoals() {
    return this.strategicGoals;
  }

  /**
   * Get gap analysis
   * 
   * @returns {GapAnalysis|null} Gap analysis data
   */
  getGapAnalysis() {
    return this.gapAnalysis;
  }

  /**
   * Get goals by status
   * 
   * @param {string} status - Goal status ('on_track', 'at_risk', 'off_track')
   * @returns {StrategicGoal[]} Goals with specified status
   */
  getGoalsByStatus(status) {
    return this.strategicGoals.filter(goal => goal.status === status);
  }

  /**
   * Get critical gaps count
   * 
   * @returns {number} Number of critical gaps
   */
  getCriticalGapsCount() {
    return this.gapAnalysis ? this.gapAnalysis.criticalGaps : 0;
  }

  /**
   * Check if data is stale
   * 
   * @returns {boolean} True if data is stale
   */
  isStale() {
    return this.staleness === 'stale';
  }

  /**
   * Validate strategic alignment data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.overallAlignment === 'number' &&
      this.overallAlignment >= 0 &&
      this.overallAlignment <= 100 &&
      typeof this.alignmentGrade === 'string' &&
      ['A', 'B', 'C', 'D', 'F'].includes(this.alignmentGrade) &&
      Array.isArray(this.strategicGoals)
    );
  }
}

/**
 * StrategicGoal entity class
 * 
 * @class StrategicGoal
 * @description Represents a strategic goal with alignment metrics
 */
export class StrategicGoal {
  /**
   * Creates a StrategicGoal instance
   * 
   * @param {Object} data - Strategic goal data
   * @param {string} data.goalId - Goal ID
   * @param {string} data.goalName - Goal name
   * @param {number} data.alignmentScore - Alignment score (0-100)
   * @param {number} data.progress - Progress percentage (0-100)
   * @param {number} data.skillsCovered - Skills covered percentage (0-100)
   * @param {string} data.status - Goal status ('on_track', 'at_risk', 'off_track')
   * @param {string[]} data.requiredSkills - Required skills array
   * @param {number} data.employeesOnTrack - Employees on track count
   * @param {number} data.totalEmployeesNeeded - Total employees needed
   * @param {string[]} data.recommendations - Recommendations array
   */
  constructor(data) {
    this.goalId = data.goalId || '';
    this.goalName = data.goalName || '';
    this.alignmentScore = data.alignmentScore || 0;
    this.progress = data.progress || 0;
    this.skillsCovered = data.skillsCovered || 0;
    this.status = data.status || 'off_track';
    this.requiredSkills = data.requiredSkills || [];
    this.employeesOnTrack = data.employeesOnTrack || 0;
    this.totalEmployeesNeeded = data.totalEmployeesNeeded || 0;
    this.recommendations = data.recommendations || [];
  }

  /**
   * Get goal completion percentage
   * 
   * @returns {number} Completion percentage
   */
  getCompletionPercentage() {
    return this.progress;
  }

  /**
   * Check if goal is on track
   * 
   * @returns {boolean} True if goal is on track
   */
  isOnTrack() {
    return this.status === 'on_track';
  }

  /**
   * Get employee coverage percentage
   * 
   * @returns {number} Employee coverage percentage
   */
  getEmployeeCoverage() {
    if (this.totalEmployeesNeeded === 0) return 0;
    return (this.employeesOnTrack / this.totalEmployeesNeeded) * 100;
  }

  /**
   * Validate strategic goal data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.goalId === 'string' &&
      this.goalId.length > 0 &&
      typeof this.goalName === 'string' &&
      this.goalName.length > 0 &&
      typeof this.alignmentScore === 'number' &&
      this.alignmentScore >= 0 &&
      this.alignmentScore <= 100 &&
      typeof this.progress === 'number' &&
      this.progress >= 0 &&
      this.progress <= 100 &&
      ['on_track', 'at_risk', 'off_track'].includes(this.status)
    );
  }
}

/**
 * GapAnalysis entity class
 * 
 * @class GapAnalysis
 * @description Represents gap analysis data
 */
export class GapAnalysis {
  /**
   * Creates a GapAnalysis instance
   * 
   * @param {Object} data - Gap analysis data
   * @param {number} data.criticalGaps - Critical gaps count
   * @param {number} data.mediumGaps - Medium gaps count
   * @param {number} data.lowGaps - Low priority gaps count
   * @param {MissingSkill[]} data.topMissingSkills - Top missing skills
   */
  constructor(data) {
    this.criticalGaps = data.criticalGaps || 0;
    this.mediumGaps = data.mediumGaps || 0;
    this.lowGaps = data.lowGaps || 0;
    this.topMissingSkills = data.topMissingSkills || [];
  }

  /**
   * Get total gaps count
   * 
   * @returns {number} Total gaps count
   */
  getTotalGaps() {
    return this.criticalGaps + this.mediumGaps + this.lowGaps;
  }

  /**
   * Get critical skills
   * 
   * @returns {MissingSkill[]} Critical missing skills
   */
  getCriticalSkills() {
    return this.topMissingSkills.filter(skill => skill.priority === 'critical');
  }

  /**
   * Validate gap analysis data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.criticalGaps === 'number' &&
      this.criticalGaps >= 0 &&
      typeof this.mediumGaps === 'number' &&
      this.mediumGaps >= 0 &&
      typeof this.lowGaps === 'number' &&
      this.lowGaps >= 0 &&
      Array.isArray(this.topMissingSkills)
    );
  }
}

/**
 * MissingSkill entity class
 * 
 * @class MissingSkill
 * @description Represents a missing skill with priority and gap percentage
 */
export class MissingSkill {
  /**
   * Creates a MissingSkill instance
   * 
   * @param {Object} data - Missing skill data
   * @param {string} data.skill - Skill name
   * @param {string} data.priority - Priority level ('critical', 'high', 'medium', 'low')
   * @param {number} data.gap - Gap percentage (0-100)
   */
  constructor(data) {
    this.skill = data.skill || '';
    this.priority = data.priority || 'low';
    this.gap = data.gap || 0;
  }

  /**
   * Check if skill is critical
   * 
   * @returns {boolean} True if skill is critical
   */
  isCritical() {
    return this.priority === 'critical';
  }

  /**
   * Get priority color class
   * 
   * @returns {string} CSS color class
   */
  getPriorityColorClass() {
    switch (this.priority) {
      case 'critical':
        return 'bg-red-200 text-red-800';
      case 'high':
        return 'bg-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }

  /**
   * Validate missing skill data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.skill === 'string' &&
      this.skill.length > 0 &&
      ['critical', 'high', 'medium', 'low'].includes(this.priority) &&
      typeof this.gap === 'number' &&
      this.gap >= 0 &&
      this.gap <= 100
    );
  }
}

export default StrategicAlignment;
