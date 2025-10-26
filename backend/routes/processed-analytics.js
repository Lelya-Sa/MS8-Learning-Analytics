/**
 * Processed Analytics API Routes
 * These routes return processed data ready for frontend consumption
 * Implements BFF (Backend for Frontend) pattern
 */

const express = require('express');
const { param } = require('express-validator');
const { authenticateToken, requireRole, canAccessResource } = require('../middleware/auth');
const { handleValidationErrors, validationRules } = require('../middleware/validation');
const AnalyticsProcessingService = require('../src/application/services/AnalyticsProcessingService');

const router = express.Router();
const analyticsProcessor = new AnalyticsProcessingService();

/**
 * Get processed learner analytics
 * GET /api/v1/processed-analytics/learner/:userId
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

        const processedAnalytics = analyticsProcessor.processLearnerAnalytics(userId);
        if (!processedAnalytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(processedAnalytics);
    } catch (error) {
        console.error('Error processing learner analytics:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * Get processed trainer analytics
 * GET /api/v1/processed-analytics/trainer/:userId
 */
router.get('/trainer/:userId', authenticateToken, requireRole(['trainer', 'org_admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, (req, res) => {
    try {
        const { userId } = req.params;
        
        const processedAnalytics = analyticsProcessor.processTrainerAnalytics(userId);
        if (!processedAnalytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(processedAnalytics);
    } catch (error) {
        console.error('Error processing trainer analytics:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * Get processed organization analytics
 * GET /api/v1/processed-analytics/organization/:organizationId
 */
router.get('/organization/:organizationId', authenticateToken, requireRole(['org_admin']), [
    param('organizationId').matches(validationRules.organizationId.matches).withMessage(validationRules.organizationId.message)
], handleValidationErrors, (req, res) => {
    try {
        const { organizationId } = req.params;
        
        const processedAnalytics = analyticsProcessor.processOrganizationAnalytics(organizationId);
        if (!processedAnalytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(processedAnalytics);
    } catch (error) {
        console.error('Error processing organization analytics:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * Get specific learner analytics component
 * GET /api/v1/processed-analytics/learner/:userId/:component
 */
router.get('/learner/:userId/:component', authenticateToken, [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message),
    param('component').isIn(['learningVelocity', 'skillGap', 'engagement', 'mastery', 'performance', 'contentEffectiveness'])
        .withMessage('Invalid component name')
], handleValidationErrors, (req, res) => {
    try {
        const { userId, component } = req.params;
        
        // Check if user can access this resource
        if (!canAccessResource(userId, req.user, ['trainer', 'org_admin'])) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const processedAnalytics = analyticsProcessor.processLearnerAnalytics(userId);
        if (!processedAnalytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        const componentData = processedAnalytics.data[component];
        if (!componentData) {
            return res.status(404).json({
                error: 'Component not found',
                code: 'COMPONENT_NOT_FOUND'
            });
        }

        res.json({
            data: componentData,
            metadata: processedAnalytics.metadata
        });
    } catch (error) {
        console.error(`Error processing learner analytics component ${req.params.component}:`, error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * Get specific trainer analytics component
 * GET /api/v1/processed-analytics/trainer/:userId/:component
 */
router.get('/trainer/:userId/:component', authenticateToken, requireRole(['trainer', 'org_admin']), [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message),
    param('component').isIn(['coursePerformance', 'courseHealth', 'studentDistribution', 'teachingEffectiveness'])
        .withMessage('Invalid component name')
], handleValidationErrors, (req, res) => {
    try {
        const { userId, component } = req.params;
        
        const processedAnalytics = analyticsProcessor.processTrainerAnalytics(userId);
        if (!processedAnalytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        const componentData = processedAnalytics.data[component];
        if (!componentData) {
            return res.status(404).json({
                error: 'Component not found',
                code: 'COMPONENT_NOT_FOUND'
            });
        }

        res.json({
            data: componentData,
            metadata: processedAnalytics.metadata
        });
    } catch (error) {
        console.error(`Error processing trainer analytics component ${req.params.component}:`, error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * Get specific organization analytics component
 * GET /api/v1/processed-analytics/organization/:organizationId/:component
 */
router.get('/organization/:organizationId/:component', authenticateToken, requireRole(['org_admin']), [
    param('organizationId').matches(validationRules.organizationId.matches).withMessage(validationRules.organizationId.message),
    param('component').isIn(['orgLearningVelocity', 'strategicAlignment', 'learningCulture', 'orgPerformance'])
        .withMessage('Invalid component name')
], handleValidationErrors, (req, res) => {
    try {
        const { organizationId, component } = req.params;
        
        const processedAnalytics = analyticsProcessor.processOrganizationAnalytics(organizationId);
        if (!processedAnalytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        const componentData = processedAnalytics.data[component];
        if (!componentData) {
            return res.status(404).json({
                error: 'Component not found',
                code: 'COMPONENT_NOT_FOUND'
            });
        }

        res.json({
            data: componentData,
            metadata: processedAnalytics.metadata
        });
    } catch (error) {
        console.error(`Error processing organization analytics component ${req.params.component}:`, error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;
