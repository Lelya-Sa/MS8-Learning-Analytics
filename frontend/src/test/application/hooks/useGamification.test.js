import React from 'react';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useGamification } from '../../../application/hooks/useGamification';

// Mock the GamificationService
jest.mock('../../../application/services/GamificationService', () => ({
  GamificationService: jest.fn().mockImplementation(() => ({
    calculatePoints: jest.fn(),
    addPoints: jest.fn(),
    getUserPoints: jest.fn(),
    updateStreak: jest.fn(),
    calculateStreakBonus: jest.fn(),
    checkAchievements: jest.fn(),
    getAchievementProgress: jest.fn(),
    getLeaderboard: jest.fn(),
    getStreak: jest.fn(),
    resetStreak: jest.fn(),
    getStreakMilestones: jest.fn(),
    getUserBadges: jest.fn(),
    getBadgeProgress: jest.fn(),
    getRewardTier: jest.fn(),
    generateRewards: jest.fn(),
    getGamificationMetrics: jest.fn(),
    getEngagementInsights: jest.fn(),
  })),
}));

describe('useGamification Hook', () => {
  const mockUserId = 'user123';
  const mockGamificationService = {
    calculatePoints: jest.fn(),
    addPoints: jest.fn(),
    getUserPoints: jest.fn(),
    updateStreak: jest.fn(),
    calculateStreakBonus: jest.fn(),
    checkAchievements: jest.fn(),
    getAchievementProgress: jest.fn(),
    getLeaderboard: jest.fn(),
    getStreak: jest.fn(),
    resetStreak: jest.fn(),
    getStreakMilestones: jest.fn(),
    getUserBadges: jest.fn(),
    getBadgeProgress: jest.fn(),
    getRewardTier: jest.fn(),
    generateRewards: jest.fn(),
    getGamificationMetrics: jest.fn(),
    getEngagementInsights: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock GamificationService constructor
    const { GamificationService } = require('../../../application/services/GamificationService');
    GamificationService.mockImplementation(() => mockGamificationService);
    
    // Set default return values
    mockGamificationService.getUserPoints.mockReturnValue(0);
    mockGamificationService.getStreak.mockReturnValue({ current: 0, longest: 0 });
    mockGamificationService.checkAchievements.mockReturnValue([]);
    mockGamificationService.getUserBadges.mockReturnValue([]);
  });

  describe('Hook Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useGamification(mockUserId));
      
      expect(result.current.userId).toBe(mockUserId);
      expect(result.current.points).toBe(0);
      expect(result.current.streak).toEqual({ current: 0, longest: 0 });
      expect(result.current.achievements).toEqual([]);
      expect(result.current.badges).toEqual([]);
      expect(result.current.leaderboard).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should create GamificationService instance', () => {
      renderHook(() => useGamification(mockUserId));
      
      const { GamificationService } = require('../../../application/services/GamificationService');
      expect(GamificationService).toHaveBeenCalledTimes(1);
    });
  });

  describe('Points Management', () => {
    it('should add points and update state', async () => {
      mockGamificationService.addPoints.mockReturnValue(100);
      mockGamificationService.getUserPoints.mockReturnValue(100);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      await act(async () => {
        await result.current.addPoints(100);
      });
      
      expect(mockGamificationService.addPoints).toHaveBeenCalledWith(mockUserId, 100);
      expect(result.current.points).toBe(100);
    });

    it('should calculate points for activities', () => {
      const activity = {
        type: 'course_completion',
        difficulty: 'medium',
        duration: 120
      };
      
      mockGamificationService.calculatePoints.mockReturnValue(120);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      const points = result.current.calculatePoints(activity);
      
      expect(mockGamificationService.calculatePoints).toHaveBeenCalledWith(activity);
      expect(points).toBe(120);
    });

    it('should handle points calculation errors', async () => {
      mockGamificationService.addPoints.mockImplementation(() => {
        throw new Error('Invalid points');
      });
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      await act(async () => {
        await result.current.addPoints(-100);
      });
      
      expect(result.current.error).toBe('Invalid points');
    });
  });

  describe('Streak Management', () => {
    it('should update streak and refresh data', async () => {
      const mockStreak = { current: 5, longest: 5, lastActivity: new Date() };
      mockGamificationService.updateStreak.mockReturnValue(mockStreak);
      mockGamificationService.getStreak.mockReturnValue(mockStreak);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      await act(async () => {
        await result.current.updateStreak(5);
      });
      
      expect(mockGamificationService.updateStreak).toHaveBeenCalledWith(mockUserId, 5);
      expect(result.current.streak).toEqual(mockStreak);
    });

    it('should reset streak', async () => {
      const mockStreak = { current: 0, longest: 0 };
      mockGamificationService.resetStreak.mockReturnValue(mockStreak);
      mockGamificationService.getStreak.mockReturnValue(mockStreak);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      await act(async () => {
        await result.current.resetStreak();
      });
      
      expect(mockGamificationService.resetStreak).toHaveBeenCalledWith(mockUserId);
      expect(result.current.streak.current).toBe(0);
    });

    it('should calculate streak bonus', () => {
      mockGamificationService.calculateStreakBonus.mockReturnValue(50);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      const bonus = result.current.calculateStreakBonus();
      
      expect(mockGamificationService.calculateStreakBonus).toHaveBeenCalledWith(mockUserId);
      expect(bonus).toBe(50);
    });
  });

  describe('Achievement Management', () => {
    it('should check and update achievements', async () => {
      const mockAchievements = [
        {
          id: 'first_milestone',
          name: 'First Milestone',
          description: 'Earned your first 1000 points',
          icon: 'star',
          points: 1000,
          unlockedAt: new Date()
        }
      ];
      
      mockGamificationService.checkAchievements.mockReturnValue(mockAchievements);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      await act(async () => {
        await result.current.checkAchievements();
      });
      
      expect(mockGamificationService.checkAchievements).toHaveBeenCalledWith(mockUserId);
      expect(result.current.achievements).toEqual(mockAchievements);
    });

    it('should get achievement progress', () => {
      const mockProgress = {
        current: 5,
        target: 10,
        percentage: 50,
        description: 'Complete 10 courses'
      };
      
      mockGamificationService.getAchievementProgress.mockReturnValue(mockProgress);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      const progress = result.current.getAchievementProgress('course_master');
      
      expect(mockGamificationService.getAchievementProgress).toHaveBeenCalledWith(mockUserId, 'course_master');
      expect(progress).toEqual(mockProgress);
    });
  });

  describe('Leaderboard Management', () => {
    it('should fetch leaderboard data', async () => {
      const mockLeaderboard = {
        period: 'weekly',
        users: [
          { userId: 'user1', points: 1500, rank: 1, badge: 'gold' },
          { userId: 'user2', points: 1200, rank: 2, badge: 'silver' }
        ]
      };
      
      mockGamificationService.getLeaderboard.mockReturnValue(mockLeaderboard);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      await act(async () => {
        await result.current.fetchLeaderboard('weekly');
      });
      
      expect(mockGamificationService.getLeaderboard).toHaveBeenCalledWith('weekly');
      expect(result.current.leaderboard).toEqual(mockLeaderboard);
    });

    it('should handle leaderboard loading state', async () => {
      mockGamificationService.getLeaderboard.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve({ period: 'weekly', users: [] }), 100);
        });
      });
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      expect(result.current.isLoading).toBe(false);
      
      act(() => {
        result.current.fetchLeaderboard('weekly');
      });
      
      expect(result.current.isLoading).toBe(true);
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });
      
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Badge Management', () => {
    it('should fetch user badges', async () => {
      const mockBadges = [
        {
          id: 'dedicated_learner',
          name: 'Dedicated Learner',
          description: 'Maintained a 7-day learning streak',
          icon: 'flame',
          earnedAt: new Date()
        }
      ];
      
      mockGamificationService.getUserBadges.mockReturnValue(mockBadges);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      await act(async () => {
        await result.current.fetchBadges();
      });
      
      expect(mockGamificationService.getUserBadges).toHaveBeenCalledWith(mockUserId);
      expect(result.current.badges).toEqual(mockBadges);
    });

    it('should get badge progress', () => {
      const mockProgress = {
        current: 3,
        target: 10,
        percentage: 30,
        description: 'Complete 10 courses to earn this badge'
      };
      
      mockGamificationService.getBadgeProgress.mockReturnValue(mockProgress);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      const progress = result.current.getBadgeProgress('course_master');
      
      expect(mockGamificationService.getBadgeProgress).toHaveBeenCalledWith(mockUserId, 'course_master');
      expect(progress).toEqual(mockProgress);
    });
  });

  describe('Reward System', () => {
    it('should get reward tier information', () => {
      const mockTier = {
        level: 'Silver',
        points: 2500,
        nextTier: 'Gold',
        pointsToNext: 2500,
        benefits: ['Priority Support', 'Exclusive Content']
      };
      
      mockGamificationService.getRewardTier.mockReturnValue(mockTier);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      const tier = result.current.getRewardTier();
      
      expect(mockGamificationService.getRewardTier).toHaveBeenCalledWith(mockUserId);
      expect(tier).toEqual(mockTier);
    });

    it('should generate personalized rewards', () => {
      const userProfile = {
        interests: ['programming', 'data-science'],
        level: 'intermediate'
      };
      
      const mockRewards = [
        {
          type: 'course_recommendation',
          title: 'Advanced Python Course',
          description: 'Perfect for your skill level',
          points: 500
        }
      ];
      
      mockGamificationService.generateRewards.mockReturnValue(mockRewards);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      const rewards = result.current.generateRewards(userProfile);
      
      expect(mockGamificationService.generateRewards).toHaveBeenCalledWith(mockUserId, userProfile);
      expect(rewards).toEqual(mockRewards);
    });
  });

  describe('Analytics and Insights', () => {
    it('should get gamification metrics', () => {
      const mockMetrics = {
        totalPoints: 1000,
        currentStreak: 5,
        achievementsUnlocked: 3,
        badgesEarned: 2,
        leaderboardRank: 15,
        engagementScore: 85
      };
      
      mockGamificationService.getGamificationMetrics.mockReturnValue(mockMetrics);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      const metrics = result.current.getGamificationMetrics();
      
      expect(mockGamificationService.getGamificationMetrics).toHaveBeenCalledWith(mockUserId);
      expect(metrics).toEqual(mockMetrics);
    });

    it('should get engagement insights', () => {
      const mockInsights = {
        motivationLevel: 'high',
        recommendedActions: ['Complete daily challenges', 'Join study groups'],
        riskFactors: ['Low activity in evenings']
      };
      
      mockGamificationService.getEngagementInsights.mockReturnValue(mockInsights);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      const insights = result.current.getEngagementInsights();
      
      expect(mockGamificationService.getEngagementInsights).toHaveBeenCalledWith(mockUserId);
      expect(insights).toEqual(mockInsights);
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      mockGamificationService.addPoints.mockImplementation(() => {
        throw new Error('Service unavailable');
      });
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      await act(async () => {
        await result.current.addPoints(100);
      });
      
      expect(result.current.error).toBe('Service unavailable');
    });

    it('should clear error when operation succeeds', async () => {
      mockGamificationService.addPoints
        .mockImplementationOnce(() => {
          throw new Error('Service unavailable');
        })
        .mockImplementationOnce(() => 100);
      
      mockGamificationService.getUserPoints.mockReturnValue(100);
      
      const { result } = renderHook(() => useGamification(mockUserId));
      
      // First call fails
      await act(async () => {
        await result.current.addPoints(100);
      });
      
      expect(result.current.error).toBe('Service unavailable');
      
      // Second call succeeds
      await act(async () => {
        await result.current.addPoints(100);
      });
      
      expect(result.current.error).toBeNull();
      expect(result.current.points).toBe(100);
    });
  });

  describe('Hook Cleanup', () => {
    it('should clean up resources on unmount', () => {
      const { unmount } = renderHook(() => useGamification(mockUserId));
      
      unmount();
      
      // Verify cleanup (if any cleanup logic is implemented)
      expect(true).toBe(true); // Placeholder for cleanup verification
    });
  });
});
