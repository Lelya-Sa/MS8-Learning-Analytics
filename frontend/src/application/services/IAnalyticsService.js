/**
 * @interface IAnalyticsService
 * @description Analytics service contract for fetching analytics data
 */
export const IAnalyticsService = {
  /**
   * Get learner analytics for a specific user
   * @param {string} userId - User ID
   * @param {string} role - Active role
   * @returns {Promise<Object>} Learner analytics data
   */
  getLearnerAnalytics: (userId, role) => Promise.resolve({}),
  
  /**
   * Get trainer analytics for a specific user
   * @param {string} userId - User ID
   * @param {string} role - Active role
   * @returns {Promise<Object>} Trainer analytics data
   */
  getTrainerAnalytics: (userId, role) => Promise.resolve({}),
  
  /**
   * Get organization analytics for a specific organization
   * @param {string} orgId - Organization ID
   * @param {string} role - Active role
   * @returns {Promise<Object>} Organization analytics data
   */
  getOrgAnalytics: (orgId, role) => Promise.resolve({}),
  
  /**
   * Refresh analytics data for a specific user
   * @param {string} userId - User ID
   * @param {string} role - Active role
   * @returns {Promise<Object>} Refresh status
   */
  refreshAnalytics: (userId, role) => Promise.resolve({}),
  
  /**
   * Get comparison analytics for a specific user
   * @param {string} userId - User ID
   * @param {string} role - Active role
   * @returns {Promise<Object>} Comparison analytics data
   */
  getComparisonAnalytics: (userId, role) => Promise.resolve({}),
  
  /**
   * Get gamification data for a specific user
   * @param {string} userId - User ID
   * @param {string} role - Active role
   * @returns {Promise<Object>} Gamification data
   */
  getGamificationData: (userId, role) => Promise.resolve({}),
  
  /**
   * Export analytics report
   * @param {string} userId - User ID
   * @param {string} format - Export format (pdf, csv, excel, json)
   * @param {string} role - Active role
   * @returns {Promise<Blob>} Report file
   */
  exportReport: (userId, format, role) => Promise.resolve(new Blob())
};
