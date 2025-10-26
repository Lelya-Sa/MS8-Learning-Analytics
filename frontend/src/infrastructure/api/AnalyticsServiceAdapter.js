/**
 * @class AnalyticsServiceAdapter
 * @description Infrastructure adapter implementing IAnalyticsService with HTTP API calls
 */
export class AnalyticsServiceAdapter {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  setAuthToken(token) {
    this.apiClient.setAuthToken(token);
  }

  setActiveRole(role) {
    this.apiClient.setActiveRole(role);
  }

  async getLearnerAnalytics(userId) {
    this.validateUserId(userId);
    try {
      const response = await this.apiClient.get(`/learner/analytics/overview/${userId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch learner analytics: ${error.message}`);
    }
  }

  async getTrainerAnalytics(userId) {
    this.validateUserId(userId);
    try {
      const response = await this.apiClient.get(`/trainer/analytics/overview/${userId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch trainer analytics: ${error.message}`);
    }
  }

  async getOrganizationAnalytics(orgId) {
    this.validateOrgId(orgId);
    try {
      const response = await this.apiClient.get(`/org-admin/analytics/overview/${orgId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch organization analytics: ${error.message}`);
    }
  }

  async refreshAnalytics(userId, role) {
    this.validateUserId(userId);
    this.validateRole(role);
    try {
      const response = await this.apiClient.post(`/analytics/refresh`, {
        userId,
        analytics: role
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to refresh analytics: ${error.message}`);
    }
  }

  async getComparisonAnalytics(userId, role) {
    this.validateUserId(userId);
    this.validateRole(role);
    try {
      const response = await this.apiClient.get(`/comparison/peer/${userId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch comparison analytics: ${error.message}`);
    }
  }

  async getGamificationData(userId, role) {
    this.validateUserId(userId);
    this.validateRole(role);
    try {
      const response = await this.apiClient.get(`/gamification/stats/${userId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch gamification data: ${error.message}`);
    }
  }

  async exportReport(userId, format, role) {
    this.validateUserId(userId);
    this.validateFormat(format);
    this.validateRole(role);
    try {
      const response = await this.apiClient.post(`/reports/generate`, {
        userId,
        format,
        role
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to export report: ${error.message}`);
    }
  }

  // Validation methods
  validateUserId(userId) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid userId: must be a non-empty string');
    }
  }

  validateOrgId(orgId) {
    if (!orgId || typeof orgId !== 'string') {
      throw new Error('Invalid orgId: must be a non-empty string');
    }
  }

  validateRole(role) {
    if (!role || typeof role !== 'string') {
      throw new Error('Invalid role: must be a non-empty string');
    }
    const validRoles = ['learner', 'trainer', 'org-admin'];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role: must be one of ${validRoles.join(', ')}`);
    }
  }

  validateFormat(format) {
    if (!format || typeof format !== 'string') {
      throw new Error('Invalid format: must be a non-empty string');
    }
    const validFormats = ['pdf', 'excel', 'csv', 'json'];
    if (!validFormats.includes(format.toLowerCase())) {
      throw new Error(`Invalid format: must be one of ${validFormats.join(', ')}`);
    }
  }
}
