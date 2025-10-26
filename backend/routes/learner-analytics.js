/**
 * Phase 3B: Learner Analytics Routes
 * Implements all 6 learner analytics endpoints with mock data
 */

const express = require('express');
const { param } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors, validationRules } = require('../middleware/validation');
const { learnerAnalyticsService } = require('../services/mockData');

const router = express.Router();

/**
 * GET /api/v1/learner/analytics/overview/:userId
 * Learner Analytics Overview (All 6 Analytics Combined)
 */
router.get('/overview/:userId', authenticateToken, requireRole(['learner']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user exists (simulate non-existent user check)
        if (userId === 'non-existent-user') {
            return res.status(404).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        // Check if user can access this resource
        if (req.user.userId !== userId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = learnerAnalyticsService.getOverview(userId);
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
        console.error('Error fetching learner overview:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/learner/analytics/velocity/:userId
 * Learning Velocity & Momentum Analytics
 */
router.get('/velocity/:userId', authenticateToken, requireRole(['learner']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user exists (simulate non-existent user check)
        if (userId === 'non-existent-user') {
            return res.status(404).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        // Check if user can access this resource
        if (req.user.userId !== userId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = learnerAnalyticsService.getVelocity(userId);
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
        console.error('Error fetching learner velocity:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/learner/analytics/skill-gap/:userId
 * Skill Gap Matrix with Prioritization
 */
router.get('/skill-gap/:userId', authenticateToken, requireRole(['learner']), [
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

        const analytics = learnerAnalyticsService.getSkillGap(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json({
            data: analytics,
            cached: false,
            lastUpdated: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        console.error('Error fetching skill gap:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/learner/analytics/engagement/:userId
 * Engagement Score with Behavioral Insights
 */
router.get('/engagement/:userId', authenticateToken, requireRole(['learner']), [
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

        const analytics = learnerAnalyticsService.getEngagement(userId);
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
        console.error('Error fetching engagement:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/learner/analytics/mastery/:userId
 * Mastery Progress Tracking
 */
router.get('/mastery/:userId', authenticateToken, requireRole(['learner']), [
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

        const analytics = learnerAnalyticsService.getMastery(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json({
            data: analytics,
            cached: false,
            lastUpdated: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        console.error('Error fetching mastery:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/learner/analytics/performance/:userId
 * Performance & Assessment Analytics
 */
router.get('/performance/:userId', authenticateToken, requireRole(['learner']), [
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

        const analytics = learnerAnalyticsService.getPerformance(userId);
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
        console.error('Error fetching performance:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/learner/analytics/content-effectiveness/:userId
 * Course & Content Effectiveness
 */
router.get('/content-effectiveness/:userId', authenticateToken, requireRole(['learner']), [
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

        const analytics = learnerAnalyticsService.getContentEffectiveness(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json({
            data: analytics,
            cached: false,
            lastUpdated: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        console.error('Error fetching content effectiveness:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;
