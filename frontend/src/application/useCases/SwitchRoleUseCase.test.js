import { SwitchRoleUseCase } from './SwitchRoleUseCase';

describe('SwitchRoleUseCase', () => {
  let useCase;
  let mockAuthService;
  let mockCacheService;

  beforeEach(() => {
    mockAuthService = {
      switchRole: jest.fn()
    };

    mockCacheService = {
      delete: jest.fn()
    };

    useCase = new SwitchRoleUseCase(mockAuthService, mockCacheService);
  });

  describe('execute', () => {
    it('should successfully switch role and clear cache', async () => {
      const userId = 'user-123';
      const newRole = 'trainer';
      const availableRoles = ['learner', 'trainer', 'org-admin'];

      mockAuthService.switchRole.mockResolvedValue(true);
      mockCacheService.delete.mockResolvedValue();

      const result = await useCase.execute(userId, newRole, availableRoles);

      expect(mockAuthService.switchRole).toHaveBeenCalledWith(userId, newRole);
      expect(mockCacheService.delete).toHaveBeenCalledTimes(5);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`learner-analytics-${userId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`trainer-analytics-${userId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`org-analytics-${userId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`comparison-analytics-${userId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`gamification-${userId}`);
      
      expect(result).toEqual({
        success: true,
        newRole: 'trainer',
        message: 'Successfully switched to trainer role'
      });
    });

    it('should throw error when user does not have access to role', async () => {
      const userId = 'user-123';
      const newRole = 'admin';
      const availableRoles = ['learner', 'trainer'];

      await expect(useCase.execute(userId, newRole, availableRoles)).rejects.toThrow(
        'User does not have access to role: admin'
      );

      expect(mockAuthService.switchRole).not.toHaveBeenCalled();
      expect(mockCacheService.delete).not.toHaveBeenCalled();
    });

    it('should throw error when auth service fails', async () => {
      const userId = 'user-123';
      const newRole = 'trainer';
      const availableRoles = ['learner', 'trainer'];

      mockAuthService.switchRole.mockRejectedValue(new Error('Auth service error'));

      await expect(useCase.execute(userId, newRole, availableRoles)).rejects.toThrow(
        'Failed to switch role: Auth service error'
      );
    });

    it('should handle cache deletion errors gracefully', async () => {
      const userId = 'user-123';
      const newRole = 'trainer';
      const availableRoles = ['learner', 'trainer'];

      mockAuthService.switchRole.mockResolvedValue(true);
      mockCacheService.delete.mockRejectedValue(new Error('Cache error'));

      // Should still succeed even if cache deletion fails
      const result = await useCase.execute(userId, newRole, availableRoles);

      expect(result.success).toBe(true);
      expect(result.newRole).toBe('trainer');
    });
  });
});
