/**
 * @file ContentEffectiveness Entity
 * @description ContentEffectiveness domain entity following Onion Architecture
 */
export class ContentEffectiveness {
  constructor(contentData) {
    this.validateContentData(contentData);
    
    this.userId = contentData.userId;
    this.contentId = contentData.contentId;
    this.effectivenessScore = contentData.effectivenessScore;
    this.completionRate = contentData.completionRate;
    this.retentionRate = contentData.retentionRate;
    this.satisfactionScore = contentData.satisfactionScore;
    this.lastUpdated = contentData.lastUpdated || new Date();
  }

  validateContentData(contentData) {
    if (!contentData.userId) {
      throw new Error('User ID is required');
    }
    
    if (!contentData.contentId) {
      throw new Error('Content ID is required');
    }
  }

  getEffectivenessLevel() {
    if (this.effectivenessScore >= 90) return 'excellent';
    if (this.effectivenessScore >= 80) return 'good';
    if (this.effectivenessScore >= 70) return 'fair';
    return 'poor';
  }

  toJSON() {
    return {
      userId: this.userId,
      contentId: this.contentId,
      effectivenessScore: this.effectivenessScore,
      completionRate: this.completionRate,
      retentionRate: this.retentionRate,
      satisfactionScore: this.satisfactionScore,
      lastUpdated: this.lastUpdated
    };
  }
}
