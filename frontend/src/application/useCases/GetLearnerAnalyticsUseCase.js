import { AnalyticsFactory } from '../../domain/factories/AnalyticsFactory';
import { CACHE_CONFIG } from '../../domain/constants';

/**
 * @class GetLearnerAnalyticsUseCase
 * @description Use case for fetching learner analytics
 */
export class GetLearnerAnalyticsUseCase {
  constructor(analyticsService, cacheService) {
    this.analyticsService = analyticsService;
    this.cacheService = cacheService;
  }

  async execute(userId, role = 'learner') {
    try {
      // Validate input
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Check cache first
      const cacheKey = `learner-analytics-${userId}-${role}`;
      const cachedData = await this.cacheService.get(cacheKey);
      
      if (cachedData) {
        return AnalyticsFactory.createFromRawData(cachedData, userId, cachedData.organizationId, role);
      }

      // Fetch from service
      const analyticsData = await this.analyticsService.getLearnerAnalytics(userId, role);
      
      // Cache the data using configured TTL
      await this.cacheService.set(cacheKey, analyticsData, CACHE_CONFIG.TTL_SECONDS);
      
      return AnalyticsFactory.createFromRawData(analyticsData, userId, analyticsData.organizationId, role);
    } catch (error) {
      throw new Error(`Failed to get learner analytics: ${error.message}`);
    }
  }

}
