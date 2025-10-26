/**
 * @file Performance Entity
 * @description Performance domain entity following Onion Architecture
 */
export class Performance {
  constructor(performanceData) {
    this.validatePerformanceData(performanceData);
    
    this.userId = performanceData.userId;
    this.assessmentScore = performanceData.assessmentScore;
    this.quizAverage = performanceData.quizAverage;
    this.projectScore = performanceData.projectScore;
    this.participationScore = performanceData.participationScore;
    this.overallScore = performanceData.overallScore;
    this.lastUpdated = performanceData.lastUpdated || new Date();
  }

  validatePerformanceData(performanceData) {
    if (!performanceData.userId) {
      throw new Error('User ID is required');
    }
    
    if (performanceData.assessmentScore !== undefined) {
      if (performanceData.assessmentScore < 0 || performanceData.assessmentScore > 100) {
        throw new Error('Assessment score must be between 0 and 100');
      }
    }
  }

  getPerformanceGrade() {
    const score = this.overallScore * 100; // Convert to percentage
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  toJSON() {
    return {
      userId: this.userId,
      assessmentScore: this.assessmentScore,
      quizAverage: this.quizAverage,
      projectScore: this.projectScore,
      participationScore: this.participationScore,
      overallScore: this.overallScore,
      lastUpdated: this.lastUpdated
    };
  }
}
