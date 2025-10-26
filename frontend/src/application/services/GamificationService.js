/**
 * GamificationService - Handles all gamification logic including points, achievements, streaks, and leaderboards
 * Follows Onion Architecture - Application Layer
 */

export class GamificationService {
  constructor() {
    this.userData = new Map(); // In-memory storage for demo purposes
    this.achievements = new Map();
    this.badges = new Map();
    this.leaderboards = new Map();
    
    this.initializeDefaultAchievements();
    this.initializeDefaultBadges();
  }

  // Points Management
  calculatePoints(activity) {
    if (!activity || typeof activity !== 'object') {
      throw new Error('Invalid activity object');
    }

    const { type, difficulty = 'medium', duration = 0, bonus = 0 } = activity;
    
    // Base points by difficulty
    const difficultyMultipliers = {
      easy: 0.5,
      medium: 1,
      hard: 1.5,
      expert: 2
    };

    const basePoints = duration * difficultyMultipliers[difficulty];
    const bonusPoints = basePoints * bonus;
    
    return Math.round(basePoints + bonusPoints);
  }

  addPoints(userId, points) {
    if (!userId) {
      throw new Error('Invalid user ID');
    }
    
    if (points < 0) {
      throw new Error('Points must be positive');
    }

    const userData = this.getUserData(userId);
    userData.points += points;
    
    // Check for achievements after adding points
    this.checkAchievements(userId);
    
    return userData.points;
  }

  getUserPoints(userId) {
    if (!userId) {
      throw new Error('Invalid user ID');
    }
    
    const userData = this.getUserData(userId);
    return userData.points;
  }

  // Streak Management
  updateStreak(userId, days) {
    if (!userId) {
      throw new Error('Invalid user ID');
    }
    
    if (days < 0) {
      throw new Error('Streak must be non-negative');
    }

    const userData = this.getUserData(userId);
    userData.streak.current = days;
    userData.streak.longest = Math.max(userData.streak.longest, days);
    userData.streak.lastActivity = new Date();
    
    return userData.streak;
  }

  calculateStreakBonus(userId) {
    const userData = this.getUserData(userId);
    const streakDays = userData.streak.current;
    
    // Bonus formula: streak_days * 7.14 (approximately 50 points for 7 days)
    return Math.round(streakDays * 7.14);
  }

  getStreak(userId) {
    const userData = this.getUserData(userId);
    return userData.streak;
  }

  resetStreak(userId) {
    const userData = this.getUserData(userId);
    userData.streak.current = 0;
    userData.streak.lastActivity = new Date();
    
    return userData.streak;
  }

  getStreakMilestones(userId) {
    const userData = this.getUserData(userId);
    const currentStreak = userData.streak.current;
    
    const milestones = [
      { days: 3, achieved: currentStreak >= 3, reward: '3-Day Streak Badge' },
      { days: 7, achieved: currentStreak >= 7, reward: 'Weekly Dedication Badge' },
      { days: 14, achieved: currentStreak >= 14, reward: 'Fortnight Warrior Badge' },
      { days: 30, achieved: currentStreak >= 30, reward: 'Monthly Dedication Badge' },
      { days: 100, achieved: currentStreak >= 100, reward: 'Century Streak Badge' }
    ];
    
    return milestones;
  }

  // Achievement System
  initializeDefaultAchievements() {
    const achievements = [
      {
        id: 'first_milestone',
        name: 'First Milestone',
        description: 'Earned your first 1000 points',
        icon: 'star',
        points: 1000,
        condition: (userData) => userData.points >= 1000
      },
      {
        id: 'point_master',
        name: 'Point Master',
        description: 'Earned 5000 points',
        icon: 'trophy',
        points: 5000,
        condition: (userData) => userData.points >= 5000
      },
      {
        id: 'streak_starter',
        name: 'Streak Starter',
        description: 'Maintained a 3-day learning streak',
        icon: 'flame',
        points: 0,
        condition: (userData) => userData.streak.current >= 3
      },
      {
        id: 'weekly_warrior',
        name: 'Weekly Warrior',
        description: 'Maintained a 7-day learning streak',
        icon: 'shield',
        points: 0,
        condition: (userData) => userData.streak.current >= 7
      },
      {
        id: 'course_master',
        name: 'Course Master',
        description: 'Completed 10 courses',
        icon: 'graduation-cap',
        points: 0,
        condition: (userData) => userData.coursesCompleted >= 10
      }
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  checkAchievements(userId) {
    const userData = this.getUserData(userId);
    const unlockedAchievements = [];
    
    this.achievements.forEach((achievement, id) => {
      if (!userData.achievements.includes(id) && achievement.condition(userData)) {
        userData.achievements.push(id);
        unlockedAchievements.push({
          ...achievement,
          unlockedAt: new Date()
        });
      }
    });
    
    return unlockedAchievements;
  }

  getUserAchievements(userId) {
    const userData = this.getUserData(userId);
    return userData.achievements;
  }

  getAchievementProgress(userId, achievementId) {
    const userData = this.getUserData(userId);
    const achievement = this.achievements.get(achievementId);
    
    if (!achievement) {
      return null;
    }
    
    // Calculate progress based on achievement type
    let current = 0;
    let target = 0;
    
    switch (achievementId) {
      case 'first_milestone':
        current = userData.points;
        target = 1000;
        break;
      case 'point_master':
        current = userData.points;
        target = 5000;
        break;
      case 'streak_starter':
        current = userData.streak.current;
        target = 3;
        break;
      case 'weekly_warrior':
        current = userData.streak.current;
        target = 7;
        break;
      case 'course_master':
        current = userData.coursesCompleted || 0;
        target = 10;
        break;
      default:
        return null;
    }
    
    const percentage = Math.min((current / target) * 100, 100);
    
    return {
      current,
      target,
      percentage: Math.round(percentage),
      description: achievement.description
    };
  }

  // Badge System
  initializeDefaultBadges() {
    const badges = [
      {
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Maintained a 7-day learning streak',
        icon: 'flame',
        condition: (userData) => userData.streak.current >= 7
      },
      {
        id: 'point_collector',
        name: 'Point Collector',
        description: 'Earned 2000 points',
        icon: 'coins',
        condition: (userData) => userData.points >= 2000
      },
      {
        id: 'course_master',
        name: 'Course Master',
        description: 'Completed 10 courses',
        icon: 'graduation-cap',
        condition: (userData) => userData.coursesCompleted >= 10
      }
    ];

    badges.forEach(badge => {
      this.badges.set(badge.id, badge);
    });
  }

  getUserBadges(userId) {
    const userData = this.getUserData(userId);
    const earnedBadges = [];
    
    this.badges.forEach((badge, id) => {
      if (badge.condition(userData)) {
        earnedBadges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          earnedAt: new Date()
        });
      }
    });
    
    return earnedBadges;
  }

  getBadgeProgress(userId, badgeId) {
    const userData = this.getUserData(userId);
    const badge = this.badges.get(badgeId);
    
    if (!badge) {
      return null;
    }
    
    // Calculate progress based on badge type
    let current = 0;
    let target = 0;
    
    switch (badgeId) {
      case 'dedicated_learner':
        current = userData.streak.current;
        target = 7;
        break;
      case 'point_collector':
        current = userData.points;
        target = 2000;
        break;
      case 'course_master':
        current = userData.coursesCompleted || 0;
        target = 10;
        break;
      default:
        return null;
    }
    
    const percentage = Math.min((current / target) * 100, 100);
    
    return {
      current,
      target,
      percentage: Math.round(percentage),
      description: `Complete ${target} ${badgeId === 'course_master' ? 'courses' : 'points'} to earn this badge`
    };
  }

  // Leaderboard Management
  getLeaderboard(period = 'all_time') {
    const users = Array.from(this.userData.entries())
      .map(([userId, data]) => ({
        userId,
        points: data.points,
        streak: data.streak.current,
        achievements: data.achievements.length,
        badges: this.getUserBadges(userId).length
      }))
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        badge: this.getRankBadge(index + 1)
      }));
    
    return {
      period,
      users: users.slice(0, 100), // Top 100
      lastUpdated: new Date()
    };
  }

  getRankBadge(rank) {
    if (rank === 1) return 'gold';
    if (rank <= 3) return 'silver';
    if (rank <= 10) return 'bronze';
    return 'participant';
  }

  // Reward System
  getRewardTier(userId) {
    const userData = this.getUserData(userId);
    const points = userData.points;
    
    if (points >= 10000) {
      return {
        level: 'Diamond',
        points,
        nextTier: null,
        pointsToNext: 0,
        benefits: ['VIP Support', 'Exclusive Content', 'Priority Access']
      };
    } else if (points >= 5000) {
      return {
        level: 'Gold',
        points,
        nextTier: 'Diamond',
        pointsToNext: 10000 - points,
        benefits: ['Priority Support', 'Exclusive Content']
      };
    } else if (points >= 2500) {
      return {
        level: 'Silver',
        points,
        nextTier: 'Gold',
        pointsToNext: 5000 - points,
        benefits: ['Priority Support', 'Exclusive Content']
      };
    } else if (points >= 1000) {
      return {
        level: 'Bronze',
        points,
        nextTier: 'Silver',
        pointsToNext: 2500 - points,
        benefits: ['Basic Support']
      };
    } else {
      return {
        level: 'Rookie',
        points,
        nextTier: 'Bronze',
        pointsToNext: 1000 - points,
        benefits: ['Welcome Package']
      };
    }
  }

  generateRewards(userId, userProfile) {
    const userData = this.getUserData(userId);
    const rewards = [];
    
    // Generate personalized rewards based on profile
    if (userProfile.interests?.includes('programming')) {
      rewards.push({
        type: 'course_recommendation',
        title: 'Advanced Python Course',
        description: 'Perfect for your skill level',
        points: 500
      });
    }
    
    if (userProfile.interests?.includes('data-science')) {
      rewards.push({
        type: 'course_recommendation',
        title: 'Machine Learning Fundamentals',
        description: 'Build on your data science foundation',
        points: 750
      });
    }
    
    // Add streak-based rewards
    if (userData.streak.current >= 7) {
      rewards.push({
        type: 'bonus_points',
        title: 'Streak Bonus',
        description: 'Keep up the great work!',
        points: 100
      });
    }
    
    return rewards;
  }

  // Analytics Integration
  getGamificationMetrics(userId) {
    const userData = this.getUserData(userId);
    const leaderboard = this.getLeaderboard('all_time');
    const userRank = leaderboard.users.findIndex(user => user.userId === userId) + 1;
    
    return {
      totalPoints: userData.points,
      currentStreak: userData.streak.current,
      achievementsUnlocked: userData.achievements.length,
      badgesEarned: this.getUserBadges(userId).length,
      leaderboardRank: userRank || 0,
      engagementScore: this.calculateEngagementScore(userData)
    };
  }

  getEngagementInsights(userId) {
    const userData = this.getUserData(userId);
    const metrics = this.getGamificationMetrics(userId);
    
    let motivationLevel = 'low';
    if (metrics.engagementScore >= 80) motivationLevel = 'high';
    else if (metrics.engagementScore >= 60) motivationLevel = 'medium';
    
    const recommendedActions = [];
    const riskFactors = [];
    
    if (userData.streak.current < 3) {
      recommendedActions.push('Complete daily challenges');
      riskFactors.push('Low activity streak');
    }
    
    if (userData.points < 1000) {
      recommendedActions.push('Focus on course completion');
    }
    
    if (metrics.leaderboardRank > 50) {
      recommendedActions.push('Join study groups');
    }
    
    return {
      motivationLevel,
      recommendedActions,
      riskFactors
    };
  }

  // Helper Methods
  getUserData(userId) {
    if (!this.userData.has(userId)) {
      this.userData.set(userId, {
        points: 0,
        streak: { current: 0, longest: 0, lastActivity: new Date() },
        achievements: [],
        coursesCompleted: 0,
        lastActivity: new Date()
      });
    }
    return this.userData.get(userId);
  }

  calculateEngagementScore(userData) {
    const pointsScore = Math.min(userData.points / 100, 50); // Max 50 points
    const streakScore = Math.min(userData.streak.current * 5, 30); // Max 30 points
    const achievementScore = Math.min(userData.achievements.length * 10, 20); // Max 20 points
    
    return Math.round(pointsScore + streakScore + achievementScore);
  }
}
