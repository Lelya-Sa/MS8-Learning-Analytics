/**
 * useGamification Hook - React hook for gamification functionality
 * Follows Onion Architecture - Application Layer
 */

import { useState, useEffect, useCallback } from 'react';
import { GamificationService } from '../services/GamificationService';

export const useGamification = (userId) => {
  const [gamificationService] = useState(() => new GamificationService());
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [achievements, setAchievements] = useState([]);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize user data
  useEffect(() => {
    if (userId) {
      try {
        setPoints(gamificationService.getUserPoints(userId));
        setStreak(gamificationService.getStreak(userId));
        setAchievements(gamificationService.checkAchievements(userId));
        setBadges(gamificationService.getUserBadges(userId));
      } catch (err) {
        setError(err.message);
      }
    }
  }, [userId, gamificationService]);

  // Points Management
  const addPoints = useCallback(async (pointsToAdd) => {
    try {
      setError(null);
      const newTotal = gamificationService.addPoints(userId, pointsToAdd);
      setPoints(newTotal);
      
      // Refresh achievements after adding points
      const newAchievements = gamificationService.checkAchievements(userId);
      setAchievements(newAchievements);
      
      return newTotal;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [userId, gamificationService]);

  const calculatePoints = useCallback((activity) => {
    try {
      return gamificationService.calculatePoints(activity);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [gamificationService]);

  // Streak Management
  const updateStreak = useCallback(async (days) => {
    try {
      setError(null);
      const newStreak = gamificationService.updateStreak(userId, days);
      setStreak(newStreak);
      
      // Refresh badges after updating streak
      const newBadges = gamificationService.getUserBadges(userId);
      setBadges(newBadges);
      
      return newStreak;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [userId, gamificationService]);

  const resetStreak = useCallback(async () => {
    try {
      setError(null);
      const newStreak = gamificationService.resetStreak(userId);
      setStreak(newStreak);
      
      return newStreak;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [userId, gamificationService]);

  const calculateStreakBonus = useCallback(() => {
    try {
      return gamificationService.calculateStreakBonus(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  // Achievement Management
  const checkAchievements = useCallback(async () => {
    try {
      setError(null);
      const newAchievements = gamificationService.checkAchievements(userId);
      setAchievements(newAchievements);
      return newAchievements;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  const getAchievementProgress = useCallback((achievementId) => {
    try {
      return gamificationService.getAchievementProgress(userId, achievementId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  // Leaderboard Management
  const fetchLeaderboard = useCallback(async (period = 'all_time') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const leaderboardData = await gamificationService.getLeaderboard(period);
      setLeaderboard(leaderboardData);
      
      return leaderboardData;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [gamificationService]);

  // Badge Management
  const fetchBadges = useCallback(async () => {
    try {
      setError(null);
      const userBadges = gamificationService.getUserBadges(userId);
      setBadges(userBadges);
      return userBadges;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  const getBadgeProgress = useCallback((badgeId) => {
    try {
      return gamificationService.getBadgeProgress(userId, badgeId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  // Reward System
  const getRewardTier = useCallback(() => {
    try {
      return gamificationService.getRewardTier(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  const generateRewards = useCallback((userProfile) => {
    try {
      return gamificationService.generateRewards(userId, userProfile);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  // Analytics and Insights
  const getGamificationMetrics = useCallback(() => {
    try {
      return gamificationService.getGamificationMetrics(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  const getEngagementInsights = useCallback(() => {
    try {
      return gamificationService.getEngagementInsights(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  // Streak Milestones
  const getStreakMilestones = useCallback(() => {
    try {
      return gamificationService.getStreakMilestones(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, gamificationService]);

  return {
    // State
    userId,
    points,
    streak,
    achievements,
    badges,
    leaderboard,
    isLoading,
    error,
    
    // Actions
    addPoints,
    calculatePoints,
    updateStreak,
    resetStreak,
    calculateStreakBonus,
    checkAchievements,
    getAchievementProgress,
    fetchLeaderboard,
    fetchBadges,
    getBadgeProgress,
    getRewardTier,
    generateRewards,
    getGamificationMetrics,
    getEngagementInsights,
    getStreakMilestones,
    
    // Utility
    clearError: () => setError(null)
  };
};
