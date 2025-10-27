/**
 * Phase 3B: Comparison Analytics Routes
 * Implements comparison analytics endpoints with mock data
 */

const express = require('express');
const { param, query } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors, validationRules } = require('../middleware/validation');
const { comparisonAnalyticsService } = require('../services/mockData');

const router = express.Router();

/**
 * GET /api/v1/comparison/peer/:userId
 * Peer Comparison Analytics
 */
router.get('/peer/:userId', authenticateToken, requireRole(['learner', 'org_admin', 'org-admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (req.user.userId !== userId && !req.user.roles.includes('org_admin') && req.user.role !== 'org-admin') {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = comparisonAnalyticsService.getPeerComparison(userId);
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
        console.error('Error fetching peer comparison:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/comparison/skill-demand
 * Skill Demand Analytics
 */
router.get('/skill-demand', authenticateToken, requireRole(['learner', 'trainer', 'org-admin']), [
    query('skills').optional().isString(),
    query('timeframe').optional().isIn(['3months', '6months', '1year'])
], handleValidationErrors, async (req, res) => {
    try {
        const { skills, timeframe } = req.query;
        const userId = req.user.userId; // Get userId from authenticated user
        
        const analytics = comparisonAnalyticsService.getSkillDemand(skills, timeframe, userId);
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
        console.error('Error fetching skill demand:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;
