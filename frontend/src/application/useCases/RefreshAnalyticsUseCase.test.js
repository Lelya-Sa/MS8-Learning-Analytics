import { RefreshAnalyticsUseCase } from './RefreshAnalyticsUseCase';

describe('RefreshAnalyticsUseCase', () => {
  let useCase;
  let mockAnalyticsService;
  let mockCacheService;

  beforeEach(() => {
    mockAnalyticsService = {
      refreshAnalytics: jest.fn()
    };

    mockCacheService = {
      delete: jest.fn()
    };

    useCase = new RefreshAnalyticsUseCase(mockAnalyticsService, mockCacheService);
  });

  describe('execute', () => {
    it('should successfully refresh analytics and clear cache', async () => {
      const userId = 'user-123';
      const role = 'learner';
      const refreshResult = {
        refreshId: 'refresh-456',
        estimatedTime: '3 minutes'
      };

      mockAnalyticsService.refreshAnalytics.mockResolvedValue(refreshResult);
      mockCacheService.delete.mockResolvedValue();

      const result = await useCase.execute(userId, role);

      expect(mockAnalyticsService.refreshAnalytics).toHaveBeenCalledWith(userId, role);
      expect(mockCacheService.delete).toHaveBeenCalledTimes(5);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`learner-analytics-${userId}-${role}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`trainer-analytics-${userId}-${role}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`org-analytics-${userId}-${role}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`comparison-analytics-${userId}-${role}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`gamification-${userId}-${role}`);
      
      expect(result).toEqual({
        success: true,
        message: 'Analytics refresh initiated',
        refreshId: 'refresh-456',
        estimatedTime: '3 minutes'
      });
    });

    it('should use default estimated time when not provided', async () => {
      const userId = 'user-123';
      const role = 'learner';
      const refreshResult = {
        refreshId: 'refresh-456'
      };

      mockAnalyticsService.refreshAnalytics.mockResolvedValue(refreshResult);
      mockCacheService.delete.mockResolvedValue();

      const result = await useCase.execute(userId, role);

      expect(result.estimatedTime).toBe('2-5 minutes');
    });

    it('should throw error when analytics service fails', async () => {
      const userId = 'user-123';
      const role = 'learner';

      mockAnalyticsService.refreshAnalytics.mockRejectedValue(new Error('Service error'));

      await expect(useCase.execute(userId, role)).rejects.toThrow(
        'Failed to refresh analytics: Service error'
      );
    });

    it('should handle cache deletion errors gracefully', async () => {
      const userId = 'user-123';
      const role = 'learner';
      const refreshResult = {
        refreshId: 'refresh-456',
        estimatedTime: '3 minutes'
      };

      mockAnalyticsService.refreshAnalytics.mockResolvedValue(refreshResult);
      mockCacheService.delete.mockRejectedValue(new Error('Cache error'));

      // Should still succeed even if cache deletion fails
      const result = await useCase.execute(userId, role);

      expect(result.success).toBe(true);
      expect(result.refreshId).toBe('refresh-456');
    });
  });
});
