/**
 * LearningCulture Domain Entity
 * 
 * Represents learning culture analytics for organizations.
 * Tracks organizational learning culture metrics and cultural indicators.
 * 
 * @fileoverview Domain entity for learning culture analytics
 */

/**
 * LearningCulture entity class
 * 
 * @class LearningCulture
 * @description Domain entity representing learning culture analytics
 */
export class LearningCulture {
  /**
   * Creates a LearningCulture instance
   * 
   * @param {Object} data - Learning culture data
   * @param {number} data.overallCultureScore - Overall culture score (0-100)
   * @param {string} data.cultureGrade - Culture grade (A, B, C, D, F)
   * @param {CultureMetrics} data.metrics - Culture metrics data
   * @param {CulturalIndicators} data.culturalIndicators - Cultural indicators
   * @param {Benchmarks} data.benchmarks - Industry benchmarks
   * @param {string[]} data.recommendations - Recommendations array
   * @param {string} data.period - Analysis period
   * @param {string} data.lastUpdated - Last updated timestamp
   * @param {string} data.staleness - Data staleness indicator
   */
  constructor(data) {
    this.overallCultureScore = data.overallCultureScore || 0;
    this.cultureGrade = data.cultureGrade || 'F';
    this.metrics = data.metrics || null;
    this.culturalIndicators = data.culturalIndicators || null;
    this.benchmarks = data.benchmarks || null;
    this.recommendations = data.recommendations || [];
    this.period = data.period || '';
    this.lastUpdated = data.lastUpdated || '';
    this.staleness = data.staleness || 'fresh';
  }

  /**
   * Get overall culture score
   * 
   * @returns {number} Overall culture score
   */
  getOverallCultureScore() {
    return this.overallCultureScore;
  }

  /**
   * Get culture grade
   * 
   * @returns {string} Culture grade
   */
  getCultureGrade() {
    return this.cultureGrade;
  }

  /**
   * Get culture metrics
   * 
   * @returns {CultureMetrics|null} Culture metrics data
   */
  getMetrics() {
    return this.metrics;
  }

  /**
   * Get cultural indicators
   * 
   * @returns {CulturalIndicators|null} Cultural indicators
   */
  getCulturalIndicators() {
    return this.culturalIndicators;
  }

  /**
   * Get benchmarks
   * 
   * @returns {Benchmarks|null} Industry benchmarks
   */
  getBenchmarks() {
    return this.benchmarks;
  }

  /**
   * Get recommendations
   * 
   * @returns {string[]} Recommendations array
   */
  getRecommendations() {
    return this.recommendations;
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
   * Validate learning culture data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.overallCultureScore === 'number' &&
      this.overallCultureScore >= 0 &&
      this.overallCultureScore <= 100 &&
      typeof this.cultureGrade === 'string' &&
      ['A', 'B', 'C', 'D', 'F'].includes(this.cultureGrade) &&
      Array.isArray(this.recommendations)
    );
  }
}

/**
 * CultureMetrics entity class
 * 
 * @class CultureMetrics
 * @description Represents culture metrics across different dimensions
 */
export class CultureMetrics {
  /**
   * Creates a CultureMetrics instance
   * 
   * @param {Object} data - Culture metrics data
   * @param {LearningEngagement} data.learningEngagement - Learning engagement metrics
   * @param {KnowledgeSharing} data.knowledgeSharing - Knowledge sharing metrics
   * @param {InnovationMetrics} data.innovationMetrics - Innovation metrics
   * @param {ContinuousImprovement} data.continuousImprovement - Continuous improvement metrics
   */
  constructor(data) {
    this.learningEngagement = data.learningEngagement || null;
    this.knowledgeSharing = data.knowledgeSharing || null;
    this.innovationMetrics = data.innovationMetrics || null;
    this.continuousImprovement = data.continuousImprovement || null;
  }

  /**
   * Get learning engagement metrics
   * 
   * @returns {LearningEngagement|null} Learning engagement metrics
   */
  getLearningEngagement() {
    return this.learningEngagement;
  }

  /**
   * Get knowledge sharing metrics
   * 
   * @returns {KnowledgeSharing|null} Knowledge sharing metrics
   */
  getKnowledgeSharing() {
    return this.knowledgeSharing;
  }

  /**
   * Get innovation metrics
   * 
   * @returns {InnovationMetrics|null} Innovation metrics
   */
  getInnovationMetrics() {
    return this.innovationMetrics;
  }

  /**
   * Get continuous improvement metrics
   * 
   * @returns {ContinuousImprovement|null} Continuous improvement metrics
   */
  getContinuousImprovement() {
    return this.continuousImprovement;
  }

  /**
   * Validate culture metrics data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      this.learningEngagement === null || this.learningEngagement instanceof LearningEngagement ||
      this.knowledgeSharing === null || this.knowledgeSharing instanceof KnowledgeSharing ||
      this.innovationMetrics === null || this.innovationMetrics instanceof InnovationMetrics ||
      this.continuousImprovement === null || this.continuousImprovement instanceof ContinuousImprovement
    );
  }
}

/**
 * LearningEngagement entity class
 * 
 * @class LearningEngagement
 * @description Represents learning engagement metrics
 */
export class LearningEngagement {
  /**
   * Creates a LearningEngagement instance
   * 
   * @param {Object} data - Learning engagement data
   * @param {number} data.score - Engagement score (0-100)
   * @param {number} data.activeParticipation - Active participation percentage
   * @param {number} data.voluntaryLearning - Voluntary learning percentage
   * @param {number} data.peerCollaboration - Peer collaboration percentage
   */
  constructor(data) {
    this.score = data.score || 0;
    this.activeParticipation = data.activeParticipation || 0;
    this.voluntaryLearning = data.voluntaryLearning || 0;
    this.peerCollaboration = data.peerCollaboration || 0;
  }

  /**
   * Get engagement score
   * 
   * @returns {number} Engagement score
   */
  getScore() {
    return this.score;
  }

  /**
   * Get active participation percentage
   * 
   * @returns {number} Active participation percentage
   */
  getActiveParticipation() {
    return this.activeParticipation;
  }

  /**
   * Validate learning engagement data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.score === 'number' &&
      this.score >= 0 &&
      this.score <= 100 &&
      typeof this.activeParticipation === 'number' &&
      this.activeParticipation >= 0 &&
      this.activeParticipation <= 100 &&
      typeof this.voluntaryLearning === 'number' &&
      this.voluntaryLearning >= 0 &&
      this.voluntaryLearning <= 100
    );
  }
}

/**
 * KnowledgeSharing entity class
 * 
 * @class KnowledgeSharing
 * @description Represents knowledge sharing metrics
 */
export class KnowledgeSharing {
  /**
   * Creates a KnowledgeSharing instance
   * 
   * @param {Object} data - Knowledge sharing data
   * @param {number} data.score - Knowledge sharing score (0-100)
   * @param {number} data.mentorshipPrograms - Number of mentorship programs
   * @param {number} data.activeMentors - Number of active mentors
   * @param {number} data.knowledgeBaseSessions - Number of knowledge base sessions
   */
  constructor(data) {
    this.score = data.score || 0;
    this.mentorshipPrograms = data.mentorshipPrograms || 0;
    this.activeMentors = data.activeMentors || 0;
    this.knowledgeBaseSessions = data.knowledgeBaseSessions || 0;
  }

  /**
   * Get knowledge sharing score
   * 
   * @returns {number} Knowledge sharing score
   */
  getScore() {
    return this.score;
  }

  /**
   * Get mentorship programs count
   * 
   * @returns {number} Number of mentorship programs
   */
  getMentorshipPrograms() {
    return this.mentorshipPrograms;
  }

  /**
   * Validate knowledge sharing data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.score === 'number' &&
      this.score >= 0 &&
      this.score <= 100 &&
      typeof this.mentorshipPrograms === 'number' &&
      this.mentorshipPrograms >= 0 &&
      typeof this.activeMentors === 'number' &&
      this.activeMentors >= 0
    );
  }
}

/**
 * InnovationMetrics entity class
 * 
 * @class InnovationMetrics
 * @description Represents innovation metrics
 */
export class InnovationMetrics {
  /**
   * Creates an InnovationMetrics instance
   * 
   * @param {Object} data - Innovation metrics data
   * @param {number} data.score - Innovation score (0-100)
   * @param {number} data.newIdeasSubmitted - Number of new ideas submitted
   * @param {number} data.ideasImplemented - Number of ideas implemented
   * @param {number} data.innovationProjects - Number of innovation projects
   */
  constructor(data) {
    this.score = data.score || 0;
    this.newIdeasSubmitted = data.newIdeasSubmitted || 0;
    this.ideasImplemented = data.ideasImplemented || 0;
    this.innovationProjects = data.innovationProjects || 0;
  }

  /**
   * Get innovation score
   * 
   * @returns {number} Innovation score
   */
  getScore() {
    return this.score;
  }

  /**
   * Get ideas implementation rate
   * 
   * @returns {number} Ideas implementation rate percentage
   */
  getImplementationRate() {
    if (this.newIdeasSubmitted === 0) return 0;
    return (this.ideasImplemented / this.newIdeasSubmitted) * 100;
  }

  /**
   * Validate innovation metrics data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.score === 'number' &&
      this.score >= 0 &&
      this.score <= 100 &&
      typeof this.newIdeasSubmitted === 'number' &&
      this.newIdeasSubmitted >= 0 &&
      typeof this.ideasImplemented === 'number' &&
      this.ideasImplemented >= 0
    );
  }
}

/**
 * ContinuousImprovement entity class
 * 
 * @class ContinuousImprovement
 * @description Represents continuous improvement metrics
 */
export class ContinuousImprovement {
  /**
   * Creates a ContinuousImprovement instance
   * 
   * @param {Object} data - Continuous improvement data
   * @param {number} data.score - Continuous improvement score (0-100)
   * @param {number} data.feedbackLoops - Number of feedback loops
   * @param {string} data.courseCompletionTrend - Course completion trend
   * @param {number} data.skillApplicationRate - Skill application rate percentage
   */
  constructor(data) {
    this.score = data.score || 0;
    this.feedbackLoops = data.feedbackLoops || 0;
    this.courseCompletionTrend = data.courseCompletionTrend || '';
    this.skillApplicationRate = data.skillApplicationRate || 0;
  }

  /**
   * Get continuous improvement score
   * 
   * @returns {number} Continuous improvement score
   */
  getScore() {
    return this.score;
  }

  /**
   * Get feedback loops count
   * 
   * @returns {number} Number of feedback loops
   */
  getFeedbackLoops() {
    return this.feedbackLoops;
  }

  /**
   * Validate continuous improvement data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.score === 'number' &&
      this.score >= 0 &&
      this.score <= 100 &&
      typeof this.feedbackLoops === 'number' &&
      this.feedbackLoops >= 0 &&
      typeof this.courseCompletionTrend === 'string'
    );
  }
}

/**
 * CulturalIndicators entity class
 * 
 * @class CulturalIndicators
 * @description Represents cultural indicators
 */
export class CulturalIndicators {
  /**
   * Creates a CulturalIndicators instance
   * 
   * @param {Object} data - Cultural indicators data
   * @param {number} data.managerSupport - Manager support score (0-100)
   * @param {number} data.learningTimeAllocation - Learning time allocation percentage
   * @param {number} data.recognitionPrograms - Recognition programs count
   * @param {number} data.careerDevelopmentOpportunities - Career development opportunities count
   */
  constructor(data) {
    this.managerSupport = data.managerSupport || 0;
    this.learningTimeAllocation = data.learningTimeAllocation || 0;
    this.recognitionPrograms = data.recognitionPrograms || 0;
    this.careerDevelopmentOpportunities = data.careerDevelopmentOpportunities || 0;
  }

  /**
   * Get manager support score
   * 
   * @returns {number} Manager support score
   */
  getManagerSupport() {
    return this.managerSupport;
  }

  /**
   * Get learning time allocation
   * 
   * @returns {number} Learning time allocation percentage
   */
  getLearningTimeAllocation() {
    return this.learningTimeAllocation;
  }

  /**
   * Validate cultural indicators data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.managerSupport === 'number' &&
      this.managerSupport >= 0 &&
      this.managerSupport <= 100 &&
      typeof this.learningTimeAllocation === 'number' &&
      this.learningTimeAllocation >= 0 &&
      this.learningTimeAllocation <= 100
    );
  }
}

/**
 * Benchmarks entity class
 * 
 * @class Benchmarks
 * @description Represents industry benchmarks
 */
export class Benchmarks {
  /**
   * Creates a Benchmarks instance
   * 
   * @param {Object} data - Benchmarks data
   * @param {number} data.industryAverage - Industry average score
   * @param {string} data.vsIndustry - Performance vs industry
   * @param {string} data.standing - Industry standing
   */
  constructor(data) {
    this.industryAverage = data.industryAverage || 0;
    this.vsIndustry = data.vsIndustry || '';
    this.standing = data.standing || '';
  }

  /**
   * Get industry average
   * 
   * @returns {number} Industry average score
   */
  getIndustryAverage() {
    return this.industryAverage;
  }

  /**
   * Get performance vs industry
   * 
   * @returns {string} Performance vs industry
   */
  getVsIndustry() {
    return this.vsIndustry;
  }

  /**
   * Validate benchmarks data
   * 
   * @returns {boolean} True if data is valid
   */
  isValid() {
    return (
      typeof this.industryAverage === 'number' &&
      this.industryAverage >= 0 &&
      typeof this.vsIndustry === 'string' &&
      typeof this.standing === 'string'
    );
  }
}

export default LearningCulture;
