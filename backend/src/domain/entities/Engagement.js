/**
 * @file Engagement Entity
 * @description Engagement domain entity following Onion Architecture
 */
export class Engagement {
  constructor(engagementData) {
    this.validateEngagementData(engagementData);
    
    this.userId = engagementData.userId;
    this.score = engagementData.score;
    this.dailyActiveMinutes = engagementData.dailyActiveMinutes;
    this.weeklySessions = engagementData.weeklySessions;
    this.completionRate = engagementData.completionRate;
    this.interactionScore = engagementData.interactionScore;
    this.lastUpdated = engagementData.lastUpdated || new Date();
  }

  validateEngagementData(engagementData) {
    if (!engagementData.userId) {
      throw new Error('User ID is required');
    }
    
    if (engagementData.score !== undefined) {
      if (engagementData.score < 0 || engagementData.score > 100) {
        throw new Error('Engagement score must be between 0 and 100');
      }
    }
  }

  getEngagementLevel() {
    if (this.score >= 90) return 'high';
    if (this.score >= 70) return 'medium';
    return 'low';
  }

  toJSON() {
    return {
      userId: this.userId,
      score: this.score,
      dailyActiveMinutes: this.dailyActiveMinutes,
      weeklySessions: this.weeklySessions,
      completionRate: this.completionRate,
      interactionScore: this.interactionScore,
      lastUpdated: this.lastUpdated
    };
  }
}
