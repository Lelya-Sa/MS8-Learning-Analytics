/**
 * @class SwitchRoleUseCase
 * @description Use case for switching user roles
 */
export class SwitchRoleUseCase {
  constructor(authService, cacheService) {
    this.authService = authService;
    this.cacheService = cacheService;
  }

  async execute(userId, newRole, availableRoles) {
    try {
      // Validate that the user has the requested role
      if (!availableRoles.includes(newRole)) {
        throw new Error(`User does not have access to role: ${newRole}`);
      }

      // Update the active role in the auth service
      await this.authService.switchRole(userId, newRole);

      // Clear cached analytics data for the old role
      const cacheKeys = [
        `learner-analytics-${userId}`,
        `trainer-analytics-${userId}`,
        `org-analytics-${userId}`,
        `comparison-analytics-${userId}`,
        `gamification-${userId}`
      ];

      // Clear cache, but don't fail if cache clearing fails
      try {
        for (const key of cacheKeys) {
          await this.cacheService.delete(key);
        }
      } catch (cacheError) {
        console.warn('Failed to clear cache during role switch:', cacheError.message);
      }

      return {
        success: true,
        newRole,
        message: `Successfully switched to ${newRole} role`
      };
    } catch (error) {
      throw new Error(`Failed to switch role: ${error.message}`);
    }
  }
}
