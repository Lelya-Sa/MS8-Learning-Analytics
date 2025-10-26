/**
 * @class RefreshAnalyticsUseCase
 * @description Use case for refreshing analytics data
 */
export class RefreshAnalyticsUseCase {
  constructor(analyticsService, cacheService) {
    this.analyticsService = analyticsService;
    this.cacheService = cacheService;
  }

  async execute(userId, role) {
    try {
      // Clear existing cached data
      const cacheKeys = [
        `learner-analytics-${userId}-${role}`,
        `trainer-analytics-${userId}-${role}`,
        `org-analytics-${userId}-${role}`,
        `comparison-analytics-${userId}-${role}`,
        `gamification-${userId}-${role}`
      ];

      // Clear cache, but don't fail if cache clearing fails
      try {
        for (const key of cacheKeys) {
          await this.cacheService.delete(key);
        }
      } catch (cacheError) {
        console.warn('Failed to clear cache during analytics refresh:', cacheError.message);
      }

      // Trigger analytics refresh on the backend
      const refreshResult = await this.analyticsService.refreshAnalytics(userId, role);

      return {
        success: true,
        message: 'Analytics refresh initiated',
        refreshId: refreshResult.refreshId,
        estimatedTime: refreshResult.estimatedTime || '2-5 minutes'
      };
    } catch (error) {
      throw new Error(`Failed to refresh analytics: ${error.message}`);
    }
  }
}
