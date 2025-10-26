/**
 * Phase 3B: Trainer Analytics Routes
 * Implements all 4 trainer analytics endpoints with mock data
 */

const express = require('express');
const { param } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors, validationRules } = require('../middleware/validation');
const { trainerAnalyticsService } = require('../services/mockData');

const router = express.Router();

/**
 * GET /api/v1/trainer/analytics/overview/:trainerId
 * Trainer Analytics Overview (all analytics in one response)
 */
router.get('/overview/:trainerId', authenticateToken, requireRole(['trainer']), [
    param('trainerId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { trainerId } = req.params;
        
        if (req.user.userId !== trainerId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const overview = trainerAnalyticsService.getOverview(trainerId);
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
        console.error('Error fetching trainer analytics overview:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/trainer/analytics/course-performance/:trainerId
 * Course Performance Dashboard
 */
router.get('/course-performance/:trainerId', authenticateToken, requireRole(['trainer']), [
    param('trainerId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { trainerId } = req.params;
        
        if (req.user.userId !== trainerId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = trainerAnalyticsService.getCoursePerformance(trainerId);
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
        console.error('Error fetching course performance:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/trainer/analytics/course-health/:trainerId
 * Course Health Dashboard
 */
router.get('/course-health/:trainerId', authenticateToken, requireRole(['trainer']), [
    param('trainerId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { trainerId } = req.params;
        
        if (req.user.userId !== trainerId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = trainerAnalyticsService.getCourseHealth(trainerId);
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
        console.error('Error fetching course health:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/trainer/analytics/student-distribution/:trainerId
 * Student Performance Distribution
 */
router.get('/student-distribution/:trainerId', authenticateToken, requireRole(['trainer']), [
    param('trainerId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { trainerId } = req.params;
        
        if (req.user.userId !== trainerId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = trainerAnalyticsService.getStudentDistribution(trainerId);
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
        console.error('Error fetching student distribution:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/trainer/analytics/teaching-effectiveness/:trainerId
 * Teaching Effectiveness Metrics
 */
router.get('/teaching-effectiveness/:trainerId', authenticateToken, requireRole(['trainer']), [
    param('trainerId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { trainerId } = req.params;
        
        if (req.user.userId !== trainerId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = trainerAnalyticsService.getTeachingEffectiveness(trainerId);
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
        console.error('Error fetching teaching effectiveness:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;
