/**
 * Phase 3B: Predictive Analytics Routes
 * Implements predictive analytics endpoints with mock data
 */

const express = require('express');
const { param } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors, validationRules } = require('../middleware/validation');
const { predictiveAnalyticsService } = require('../services/mockData');

const router = express.Router();

/**
 * GET /api/v1/predictive/drop-off-risk/:userId
 * Drop-off Risk Prediction
 */
router.get('/drop-off-risk/:userId', authenticateToken, requireRole(['learner', 'org_admin', 'org-admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user can access this resource (own data or admin)
        const canAccess = req.user.userId === userId || 
                         (req.user.roles && req.user.roles.includes('org_admin')) ||
                         (req.user.role === 'org-admin');
        
        if (!canAccess) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = predictiveAnalyticsService.getDropOffRisk(userId);
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
        console.error('Error fetching drop-off risk:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/predictive/forecast/:userId
 * Performance Forecast
 */
router.get('/forecast/:userId', authenticateToken, requireRole(['learner', 'org_admin', 'org-admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        const canAccess = req.user.userId === userId || 
                         (req.user.roles && req.user.roles.includes('org_admin')) ||
                         (req.user.role === 'org-admin');
        
        if (!canAccess) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = predictiveAnalyticsService.getForecast(userId);
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
        console.error('Error fetching forecast:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/predictive/recommendations/:userId
 * Personalized Recommendations
 */
router.get('/recommendations/:userId', authenticateToken, requireRole(['learner', 'org_admin', 'org-admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        const canAccess = req.user.userId === userId || 
                         (req.user.roles && req.user.roles.includes('org_admin')) ||
                         (req.user.role === 'org-admin');
        
        if (!canAccess) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = predictiveAnalyticsService.getRecommendations(userId);
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
        console.error('Error fetching recommendations:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;
