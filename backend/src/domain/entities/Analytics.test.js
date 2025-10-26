import { Analytics } from './Analytics';

describe('Analytics Entity', () => {
  describe('constructor', () => {
    it('should create analytics with valid data', () => {
      const analyticsData = {
        id: 'analytics-123',
        userId: 'user-123',
        organizationId: 'org-123',
        analyticsType: 'learning_velocity',
        role: 'learner',
        data: {
          currentPace: 85,
          targetPace: 100,
          progress: 0.85
        },
        calculatedAt: new Date('2025-10-25T10:00:00Z')
      };

      const analytics = new Analytics(analyticsData);

      expect(analytics.id).toBe('analytics-123');
      expect(analytics.userId).toBe('user-123');
      expect(analytics.organizationId).toBe('org-123');
      expect(analytics.analyticsType).toBe('learning_velocity');
      expect(analytics.role).toBe('learner');
      expect(analytics.data).toEqual({
        currentPace: 85,
        targetPace: 100,
        progress: 0.85
      });
    });

    it('should throw error for invalid analytics type', () => {
      const analyticsData = {
        id: 'analytics-123',
        userId: 'user-123',
        organizationId: 'org-123',
        analyticsType: 'invalid_type',
        role: 'learner',
        data: {},
        calculatedAt: new Date()
      };

      expect(() => new Analytics(analyticsData)).toThrow('Invalid analytics type');
    });

    it('should throw error for missing required fields', () => {
      const analyticsData = {
        id: 'analytics-123',
        userId: 'user-123',
        organizationId: 'org-123',
        analyticsType: 'learning_velocity',
        role: 'learner',
        data: {},
        calculatedAt: new Date()
      };

      // Test missing id
      expect(() => new Analytics({ ...analyticsData, id: undefined })).toThrow('Analytics ID is required');
      
      // Test missing userId
      expect(() => new Analytics({ ...analyticsData, userId: undefined })).toThrow('User ID is required');
      
      // Test missing organizationId
      expect(() => new Analytics({ ...analyticsData, organizationId: undefined })).toThrow('Organization ID is required');
      
      // Test missing analyticsType
      expect(() => new Analytics({ ...analyticsData, analyticsType: undefined })).toThrow('Analytics type is required');
      
      // Test missing role
      expect(() => new Analytics({ ...analyticsData, role: undefined })).toThrow('Role is required');
      
      // Test missing data
      expect(() => new Analytics({ ...analyticsData, data: undefined })).toThrow('Analytics data is required');
      
      // Test missing calculatedAt
      expect(() => new Analytics({ ...analyticsData, calculatedAt: undefined })).toThrow('Calculated at is required');
    });
  });

  describe('isStale', () => {
    it('should return true if analytics is older than 6 hours', () => {
      const sevenHoursAgo = new Date(Date.now() - 7 * 60 * 60 * 1000);
      const analytics = new Analytics({
        id: 'analytics-123',
        userId: 'user-123',
        organizationId: 'org-123',
        analyticsType: 'learning_velocity',
        role: 'learner',
        data: {},
        calculatedAt: sevenHoursAgo
      });

      expect(analytics.isStale()).toBe(true);
    });

    it('should return false if analytics is newer than 6 hours', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const analytics = new Analytics({
        id: 'analytics-123',
        userId: 'user-123',
        organizationId: 'org-123',
        analyticsType: 'learning_velocity',
        role: 'learner',
        data: {},
        calculatedAt: oneHourAgo
      });

      expect(analytics.isStale()).toBe(false);
    });
  });

  describe('getDataValue', () => {
    it('should return data value for given key', () => {
      const analytics = new Analytics({
        id: 'analytics-123',
        userId: 'user-123',
        organizationId: 'org-123',
        analyticsType: 'learning_velocity',
        role: 'learner',
        data: {
          currentPace: 85,
          targetPace: 100,
          progress: 0.85
        },
        calculatedAt: new Date()
      });

      expect(analytics.getDataValue('currentPace')).toBe(85);
      expect(analytics.getDataValue('targetPace')).toBe(100);
      expect(analytics.getDataValue('progress')).toBe(0.85);
    });

    it('should return undefined for non-existent key', () => {
      const analytics = new Analytics({
        id: 'analytics-123',
        userId: 'user-123',
        organizationId: 'org-123',
        analyticsType: 'learning_velocity',
        role: 'learner',
        data: {
          currentPace: 85
        },
        calculatedAt: new Date()
      });

      expect(analytics.getDataValue('nonExistentKey')).toBeUndefined();
    });
  });

  describe('hasData', () => {
    it('should return true if analytics has data', () => {
      const analytics = new Analytics({
        id: 'analytics-123',
        userId: 'user-123',
        organizationId: 'org-123',
        analyticsType: 'learning_velocity',
        role: 'learner',
        data: {
          currentPace: 85,
          targetPace: 100
        },
        calculatedAt: new Date()
      });

      expect(analytics.hasData()).toBe(true);
    });

    it('should return false if analytics has no data', () => {
      const analytics = new Analytics({
        id: 'analytics-123',
        userId: 'user-123',
        organizationId: 'org-123',
        analyticsType: 'learning_velocity',
        role: 'learner',
        data: {},
        calculatedAt: new Date()
      });

      expect(analytics.hasData()).toBe(false);
    });
  });
});
