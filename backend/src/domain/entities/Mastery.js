/**
 * @file Mastery Entity
 * @description Mastery domain entity following Onion Architecture
 */
export class Mastery {
  constructor(masteryData) {
    this.validateMasteryData(masteryData);
    
    this.userId = masteryData.userId;
    this.skill = masteryData.skill;
    this.masteryLevel = masteryData.masteryLevel;
    this.totalAttempts = masteryData.totalAttempts;
    this.successfulAttempts = masteryData.successfulAttempts;
    this.averageScore = masteryData.averageScore;
    this.lastUpdated = masteryData.lastUpdated || new Date();
  }

  validateMasteryData(masteryData) {
    if (!masteryData.userId) {
      throw new Error('User ID is required');
    }
    
    if (masteryData.masteryLevel !== undefined) {
      if (masteryData.masteryLevel < 0 || masteryData.masteryLevel > 1) {
        throw new Error('Mastery level must be between 0 and 1');
      }
    }
  }

  getMasteryPercentage() {
    return Math.round(this.masteryLevel * 100);
  }

  toJSON() {
    return {
      userId: this.userId,
      skill: this.skill,
      masteryLevel: this.masteryLevel,
      totalAttempts: this.totalAttempts,
      successfulAttempts: this.successfulAttempts,
      averageScore: this.averageScore,
      lastUpdated: this.lastUpdated
    };
  }
}
