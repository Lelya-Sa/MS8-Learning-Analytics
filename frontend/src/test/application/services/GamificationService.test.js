import { GamificationService } from '../../../application/services/GamificationService';

describe('GamificationService', () => {
  let gamificationService;

  beforeEach(() => {
    gamificationService = new GamificationService();
  });

  describe('User Points Management', () => {
    it('should calculate points for completed activities', () => {
      const activity = {
        type: 'course_completion',
        difficulty: 'medium',
        duration: 120, // minutes
        bonus: 0.1
      };

      const points = gamificationService.calculatePoints(activity);
      
      expect(points).toBe(132); // 120 base + 12 bonus (120 * 0.1)
    });

    it('should apply bonus multipliers correctly', () => {
      const activity = {
        type: 'quiz_perfect',
        difficulty: 'hard',
        duration: 60,
        bonus: 0.5
      };

      const points = gamificationService.calculatePoints(activity);
      
      expect(points).toBe(135); // 90 base + 45 bonus (90 * 0.5)
    });

    it('should track user total points', () => {
      const userId = 'user123';
      const initialPoints = gamificationService.getUserPoints(userId);
      
      expect(initialPoints).toBe(0);
      
      gamificationService.addPoints(userId, 100);
      const updatedPoints = gamificationService.getUserPoints(userId);
      
      expect(updatedPoints).toBe(100);
    });

    it('should calculate points for streak bonuses', () => {
      const userId = 'user123';
      
      // Simulate 7-day streak
      gamificationService.updateStreak(userId, 7);
      const streakBonus = gamificationService.calculateStreakBonus(userId);
      
      expect(streakBonus).toBe(50); // 7 * 7.14 ≈ 50 bonus points
    });
  });

  describe('Achievement System', () => {
    it('should check and award achievements', () => {
      const userId = 'user123';
      
      // Add enough points to trigger first achievement
      gamificationService.addPoints(userId, 1000);
      
      // Check that the achievement was unlocked
      const achievements = gamificationService.getUserAchievements(userId);
      expect(achievements).toContain('first_milestone');
    });

    it('should track achievement progress', () => {
      const userId = 'user123';
      
      const progress = gamificationService.getAchievementProgress(userId, 'course_master');
      
      expect(progress).toEqual({
        current: 0,
        target: 10,
        percentage: 0,
        description: 'Completed 10 courses'
      });
    });

    it('should prevent duplicate achievement awards', () => {
      const userId = 'user123';
      
      gamificationService.addPoints(userId, 1000);
      const firstAchievements = gamificationService.getUserAchievements(userId);
      
      gamificationService.addPoints(userId, 500);
      const secondAchievements = gamificationService.getUserAchievements(userId);
      
      expect(firstAchievements.length).toBeGreaterThan(0);
      expect(secondAchievements.length).toBe(firstAchievements.length); // No new achievements
    });
  });

  describe('Leaderboard Management', () => {
    it('should generate leaderboard data', () => {
      const leaderboard = gamificationService.getLeaderboard('weekly');
      
      expect(leaderboard).toHaveProperty('period', 'weekly');
      expect(leaderboard).toHaveProperty('users');
      expect(Array.isArray(leaderboard.users)).toBe(true);
    });

    it('should rank users by points correctly', () => {
      // Add users with different point totals
      gamificationService.addPoints('user1', 1000);
      gamificationService.addPoints('user2', 1500);
      gamificationService.addPoints('user3', 800);
      
      const leaderboard = gamificationService.getLeaderboard('all_time');
      
      expect(leaderboard.users[0].userId).toBe('user2'); // Highest points
      expect(leaderboard.users[1].userId).toBe('user1');
      expect(leaderboard.users[2].userId).toBe('user3');
    });

    it('should include user ranking information', () => {
      gamificationService.addPoints('user1', 1000);
      gamificationService.addPoints('user2', 1500);
      
      const leaderboard = gamificationService.getLeaderboard('all_time');
      
      expect(leaderboard.users[0]).toMatchObject({
        userId: 'user2',
        points: 1500,
        rank: 1,
        badge: 'gold'
      });
    });
  });

  describe('Streak Tracking', () => {
    it('should track daily learning streaks', () => {
      const userId = 'user123';
      
      gamificationService.updateStreak(userId, 5);
      const streak = gamificationService.getStreak(userId);
      
      expect(streak).toEqual({
        current: 5,
        longest: 5,
        lastActivity: expect.any(Date)
      });
    });

    it('should reset streak when activity stops', () => {
      const userId = 'user123';
      
      gamificationService.updateStreak(userId, 5);
      gamificationService.resetStreak(userId);
      
      const streak = gamificationService.getStreak(userId);
      expect(streak.current).toBe(0);
    });

    it('should calculate streak milestones', () => {
      const userId = 'user123';
      
      gamificationService.updateStreak(userId, 30);
      const milestones = gamificationService.getStreakMilestones(userId);
      
      expect(milestones).toContainEqual({
        days: 30,
        achieved: true,
        reward: 'Monthly Dedication Badge'
      });
    });
  });

  describe('Badge System', () => {
    it('should award badges based on criteria', () => {
      const userId = 'user123';
      
      // Complete multiple courses
      gamificationService.addPoints(userId, 2000);
      gamificationService.updateStreak(userId, 7);
      
      const badges = gamificationService.getUserBadges(userId);
      
      expect(badges).toContainEqual({
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Maintained a 7-day learning streak',
        icon: 'flame',
        earnedAt: expect.any(Date)
      });
    });

    it('should track badge progress', () => {
      const userId = 'user123';
      
      const progress = gamificationService.getBadgeProgress(userId, 'course_master');
      
      expect(progress).toEqual({
        current: 0,
        target: 10,
        percentage: 0,
        description: 'Complete 10 courses to earn this badge'
      });
    });
  });

  describe('Reward System', () => {
    it('should calculate reward tiers', () => {
      const userId = 'user123';
      
      gamificationService.addPoints(userId, 2500);
      const tier = gamificationService.getRewardTier(userId);
      
      expect(tier).toEqual({
        level: 'Silver',
        points: 2500,
        nextTier: 'Gold',
        pointsToNext: 2500,
        benefits: ['Priority Support', 'Exclusive Content']
      });
    });

    it('should generate personalized rewards', () => {
      const userId = 'user123';
      const userProfile = {
        interests: ['programming', 'data-science'],
        level: 'intermediate'
      };
      
      const rewards = gamificationService.generateRewards(userId, userProfile);
      
      expect(rewards).toContainEqual({
        type: 'course_recommendation',
        title: 'Advanced Python Course',
        description: 'Perfect for your skill level',
        points: 500
      });
    });
  });

  describe('Analytics Integration', () => {
    it('should track gamification metrics', () => {
      const userId = 'user123';
      
      gamificationService.addPoints(userId, 1000);
      gamificationService.updateStreak(userId, 5);
      
      const metrics = gamificationService.getGamificationMetrics(userId);
      
      expect(metrics).toEqual({
        totalPoints: 1000,
        currentStreak: 5,
        achievementsUnlocked: expect.any(Number),
        badgesEarned: expect.any(Number),
        leaderboardRank: expect.any(Number),
        engagementScore: expect.any(Number)
      });
    });

    it('should provide engagement insights', () => {
      const userId = 'user123';
      
      const insights = gamificationService.getEngagementInsights(userId);
      
      expect(insights).toHaveProperty('motivationLevel');
      expect(insights).toHaveProperty('recommendedActions');
      expect(insights).toHaveProperty('riskFactors');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid user IDs gracefully', () => {
      expect(() => {
        gamificationService.addPoints(null, 100);
      }).toThrow('Invalid user ID');
    });

    it('should handle invalid point values', () => {
      expect(() => {
        gamificationService.addPoints('user123', -100);
      }).toThrow('Points must be positive');
    });

    it('should handle invalid streak values', () => {
      expect(() => {
        gamificationService.updateStreak('user123', -1);
      }).toThrow('Streak must be non-negative');
    });
  });
});
