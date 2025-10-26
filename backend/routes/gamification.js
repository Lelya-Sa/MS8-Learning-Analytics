/**
 * Phase 3B: Gamification Routes
 * Implements gamification endpoints with mock data
 */

const express = require('express');
const { param, query } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors, validationRules } = require('../middleware/validation');
const { gamificationService } = require('../services/mockData');

const router = express.Router();

/**
 * GET /api/v1/gamification/stats/:userId
 * Gamification Statistics
 */
router.get('/stats/:userId', authenticateToken, requireRole(['learner', 'trainer', 'org-admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (req.user.userId !== userId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = gamificationService.getStats(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json({
            data: analytics,
            cached: true,
            lastUpdated: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        console.error('Error fetching gamification stats:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/gamification/achievements/:userId
 * User Achievements
 */
router.get('/achievements/:userId', authenticateToken, requireRole(['learner', 'trainer', 'org-admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (req.user.userId !== userId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = gamificationService.getAchievements(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json({
            data: analytics,
            cached: true,
            lastUpdated: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/gamification/leaderboard
 * Leaderboard
 */
router.get('/leaderboard', authenticateToken, requireRole(['learner', 'trainer', 'org-admin']), [
    query('timeframe').optional().isIn(['week', 'month', 'year', 'all']),
    query('limit').optional().isInt({ min: 10, max: 100 }),
    query('category').optional().isIn(['points', 'streaks', 'achievements'])
], handleValidationErrors, async (req, res) => {
    try {
        const { timeframe, limit, category } = req.query;
        
        const analytics = gamificationService.getLeaderboard(timeframe, limit, category);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json({
            data: analytics,
            cached: true,
            lastUpdated: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/gamification/streak/:userId
 * Learning Streak
 */
router.get('/streak/:userId', authenticateToken, requireRole(['learner', 'trainer', 'org-admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (req.user.userId !== userId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = gamificationService.getStreak(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json({
            data: analytics,
            cached: true,
            lastUpdated: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        console.error('Error fetching streak:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;
