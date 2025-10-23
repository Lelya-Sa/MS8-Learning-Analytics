const express = require('express');
const { param, body } = require('express-validator');
const { authenticateToken, requireRole, canAccessResource } = require('../middleware/auth');
const { handleValidationErrors, validationRules } = require('../middleware/validation');
const { analyticsService } = require('../services/mockData');

const router = express.Router();

/**
 * Learner analytics endpoint
 * GET /api/v1/analytics/learner/:userId
 */
router.get('/learner/:userId', authenticateToken, [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user can access this resource
        if (!canAccessResource(userId, req.user, ['trainer', 'org_admin'])) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = analyticsService.getLearnerAnalytics(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * Trainer analytics endpoint
 * GET /api/v1/analytics/trainer/:userId
 */
router.get('/trainer/:userId', authenticateToken, requireRole(['trainer', 'org_admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user can access this resource
        if (!canAccessResource(userId, req.user, ['org_admin'])) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }
        
        const analytics = analyticsService.getTrainerAnalytics(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * Organization analytics endpoint
 * GET /api/v1/analytics/organization/:organizationId
 */
router.get('/organization/:organizationId', authenticateToken, requireRole(['org_admin']), [
    param('organizationId').matches(validationRules.organizationId.matches).withMessage(validationRules.organizationId.message)
], handleValidationErrors, (req, res) => {
    try {
        const { organizationId } = req.params;
        
        // Check if user belongs to this organization
        if (req.user.organizationId !== organizationId) {
            return res.status(403).json({
                error: 'Access denied to this organization',
                code: 'ORGANIZATION_ACCESS_DENIED'
            });
        }

        const analytics = analyticsService.getOrganizationAnalytics(organizationId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * Analytics refresh endpoint
 * POST /api/v1/analytics/refresh
 */
router.post('/refresh', authenticateToken, [
    body('user_id').matches(validationRules.userId.matches).withMessage(validationRules.userId.message),
    body('analytics_type').isIn(['learner', 'trainer', 'organization']).withMessage('Invalid analytics type')
], handleValidationErrors, (req, res) => {
    try {
        const { user_id, analytics_type } = req.body;
        
        // Generate a mock collection ID
        const collectionId = `collection-${Date.now()}`;
        
        res.status(202).json({
            collection_id: collectionId,
            status: 'started',
            message: 'Analytics refresh initiated',
            estimated_duration: '5-10 minutes'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;