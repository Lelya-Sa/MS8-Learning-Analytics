/**
 * Phase 3B: Organizational Analytics Routes
 * Implements all 4 organizational analytics endpoints with mock data
 */

const express = require('express');
const { param } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors, validationRules } = require('../middleware/validation');
const { orgAnalyticsService } = require('../services/mockData');

const router = express.Router();

/**
 * GET /api/v1/org-admin/analytics/overview/:orgId
 * Organization Analytics Overview (all analytics in one response)
 */
router.get('/overview/:orgId', authenticateToken, requireRole(['org-admin', 'org_admin']), [
    param('orgId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { orgId } = req.params;
        
        // Verify user belongs to this organization
        if (req.user.organizationId !== orgId && req.user.organization_id !== orgId) {
            return res.status(403).json({
                error: 'Access denied to this organization',
                code: 'ORGANIZATION_ACCESS_DENIED'
            });
        }

        const overview = orgAnalyticsService.getOverview(orgId);
        if (!overview) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json({
            data: overview,
            cached: true,
            lastUpdated: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        console.error('Error fetching organization analytics overview:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/org-admin/analytics/learning-velocity/:orgId
 * Organizational Learning Velocity
 */
router.get('/learning-velocity/:orgId', authenticateToken, requireRole(['org-admin']), [
    param('orgId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { orgId } = req.params;
        
        // Verify user belongs to this organization (check both camelCase and underscore variants)
        if (req.user.organizationId !== orgId && req.user.organization_id !== orgId) {
            return res.status(403).json({
                error: 'Access denied to this organization',
                code: 'ORGANIZATION_ACCESS_DENIED'
            });
        }

        const analytics = orgAnalyticsService.getLearningVelocity(orgId);
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
        console.error('Error fetching learning velocity:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/org-admin/analytics/strategic-alignment/:orgId
 * Strategic Alignment Tracking
 */
router.get('/strategic-alignment/:orgId', authenticateToken, requireRole(['org-admin']), [
    param('orgId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { orgId } = req.params;
        
        // Verify user belongs to this organization (check both camelCase and underscore variants)
        if (req.user.organizationId !== orgId && req.user.organization_id !== orgId) {
            return res.status(403).json({
                error: 'Access denied to this organization',
                code: 'ORGANIZATION_ACCESS_DENIED'
            });
        }

        const analytics = orgAnalyticsService.getStrategicAlignment(orgId);
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
        console.error('Error fetching strategic alignment:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/org-admin/analytics/learning-culture/:orgId
 * Learning Culture Metrics
 */
router.get('/learning-culture/:orgId', authenticateToken, requireRole(['org-admin']), [
    param('orgId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { orgId } = req.params;
        
        // Verify user belongs to this organization (check both camelCase and underscore variants)
        if (req.user.organizationId !== orgId && req.user.organization_id !== orgId) {
            return res.status(403).json({
                error: 'Access denied to this organization',
                code: 'ORGANIZATION_ACCESS_DENIED'
            });
        }

        const analytics = orgAnalyticsService.getLearningCulture(orgId);
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
        console.error('Error fetching learning culture:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/org-admin/analytics/org-performance/:orgId
 * Organizational Performance Analytics
 */
router.get('/org-performance/:orgId', authenticateToken, requireRole(['org-admin']), [
    param('orgId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { orgId } = req.params;
        
        // Verify user belongs to this organization (check both camelCase and underscore variants)
        if (req.user.organizationId !== orgId && req.user.organization_id !== orgId) {
            return res.status(403).json({
                error: 'Access denied to this organization',
                code: 'ORGANIZATION_ACCESS_DENIED'
            });
        }

        const analytics = orgAnalyticsService.getOrgPerformance(orgId);
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
        console.error('Error fetching org performance:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;
