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

/**
 * ========================================
 * AS-001: LEARNER ANALYTICS ENDPOINTS
 * ========================================
 */

/**
 * AS-001 #1: Learning Velocity & Momentum
 * GET /api/v1/analytics/learner/:userId/velocity
 * 
 * Data Flow:
 * 1. Try to fetch from external microservices (not implemented yet)
 * 2. If external API fails, return mock data as fallback
 */
router.get('/learner/:userId/velocity', authenticateToken, [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user can access this resource
        if (!canAccessResource(userId, req.user, ['trainer', 'org_admin'])) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        // TODO: Try to fetch from external microservices
        // const externalData = await fetchFromExternalMicroservices(userId);
        // if (externalData) return res.json(externalData);

        // Fallback to mock data (current implementation)
        const analytics = analyticsService.getLearnerVelocity(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching learner velocity:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * AS-001 #2: Skill Gap Matrix with Prioritization
 * GET /api/v1/analytics/learner/:userId/skill-gaps
 */
router.get('/learner/:userId/skill-gaps', authenticateToken, [
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

        const analytics = analyticsService.getLearnerSkillGaps(userId);
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
 * AS-001 #3: Engagement Score with Behavioral Insights
 * GET /api/v1/analytics/learner/:userId/engagement
 */
router.get('/learner/:userId/engagement', authenticateToken, [
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

        const analytics = analyticsService.getLearnerEngagement(userId);
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
 * AS-001 #4: Mastery Progress Tracking
 * GET /api/v1/analytics/learner/:userId/mastery
 */
router.get('/learner/:userId/mastery', authenticateToken, [
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

        const analytics = analyticsService.getLearnerMastery(userId);
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
 * AS-001 #5: Performance & Assessment Analytics
 * GET /api/v1/analytics/learner/:userId/performance
 */
router.get('/learner/:userId/performance', authenticateToken, [
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

        const analytics = analyticsService.getLearnerPerformance(userId);
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
 * AS-001 #6: Course & Content Effectiveness
 * GET /api/v1/analytics/learner/:userId/content-effectiveness
 */
router.get('/learner/:userId/content-effectiveness', authenticateToken, [
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

        const filters = req.query; // Optional filters from query params
        const analytics = analyticsService.getLearnerContentEffectiveness(userId, filters);
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
 * ========================================
 * AS-002: TRAINER ANALYTICS ENDPOINTS
 * ========================================
 */

/**
 * AS-002 #8: Course Health Dashboard
 * GET /api/v1/analytics/trainer/:trainerId/course-health/:courseId
 * 
 * Data Flow:
 * 1. Try to fetch from external microservices (not implemented yet)
 * 2. If external API fails, return mock data as fallback
 */
router.get('/trainer/:trainerId/course-health/:courseId', authenticateToken, [
    param('trainerId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message),
    param('courseId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid course ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { trainerId, courseId } = req.params;
        
        // Check if user can access this resource (trainer can access own data, org_admin can access all)
        if (req.user.userId !== trainerId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        // TODO: Try to fetch from external microservices
        // const externalData = await fetchFromExternalMicroservices(trainerId, courseId);
        // if (externalData) return res.json(externalData);

        // Fallback to mock data (current implementation)
        const analytics = analyticsService.getCourseHealth(trainerId, courseId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching course health:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * AS-002 #7: Course Performance Dashboard
 * GET /api/v1/analytics/trainer/:trainerId/course-performance
 */
router.get('/trainer/:trainerId/course-performance', authenticateToken, [
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

        const analytics = analyticsService.getCoursePerformance(trainerId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching course performance:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * AS-002 #9: Student Performance Distribution
 * GET /api/v1/analytics/trainer/:trainerId/student-distribution/:courseId
 */
router.get('/trainer/:trainerId/student-distribution/:courseId', authenticateToken, [
    param('trainerId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message),
    param('courseId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid course ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { trainerId, courseId } = req.params;
        
        if (req.user.userId !== trainerId && !req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        const analytics = analyticsService.getStudentDistribution(trainerId, courseId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching student distribution:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * AS-002 #10: Teaching Effectiveness Metrics
 * GET /api/v1/analytics/trainer/:trainerId/teaching-effectiveness
 */
router.get('/trainer/:trainerId/teaching-effectiveness', authenticateToken, [
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

        const analytics = analyticsService.getTeachingEffectiveness(trainerId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching teaching effectiveness:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * ========================================
 * AS-003: ORGANIZATIONAL ANALYTICS ENDPOINTS
 * ========================================
 */

/**
 * AS-003 #11: Organizational Learning Velocity
 * GET /api/v1/analytics/organization/:organizationId/learning-velocity
 */
router.get('/organization/:organizationId/learning-velocity', authenticateToken, [
    param('organizationId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { organizationId } = req.params;
        
        // RBAC: Only org_admin can access organizational analytics
        if (!req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED',
                message: 'Only organization administrators can access organizational analytics'
            });
        }
        
        // Verify user belongs to this organization
        if (req.user.organizationId !== organizationId) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED',
                message: 'You can only access analytics for your own organization'
            });
        }
        
        // TODO: Try to fetch from external microservices
        const analytics = analyticsService.getOrgLearningVelocity(organizationId); // Fallback to mock
        
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching organizational learning velocity:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * AS-003 #12: Strategic Alignment Tracking
 * GET /api/v1/analytics/organization/:organizationId/strategic-alignment
 */
router.get('/organization/:organizationId/strategic-alignment', authenticateToken, [
    param('organizationId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { organizationId } = req.params;
        
        // RBAC: Only org_admin can access organizational analytics
        if (!req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }
        
        // Verify user belongs to this organization
        if (req.user.organizationId !== organizationId) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }
        
        // TODO: Try to fetch from external microservices
        const analytics = analyticsService.getStrategicAlignment(organizationId);
        
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching strategic alignment:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * AS-003 #13: Department & Team Analytics
 * GET /api/v1/analytics/organization/:organizationId/department-analytics
 */
router.get('/organization/:organizationId/department-analytics', authenticateToken, [
    param('organizationId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { organizationId } = req.params;
        const { department } = req.query;
        
        // RBAC: Only org_admin can access organizational analytics
        if (!req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }
        
        // Verify user belongs to this organization
        if (req.user.organizationId !== organizationId) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }
        
        // TODO: Try to fetch from external microservices
        const analytics = analyticsService.getDepartmentAnalytics(organizationId, department);
        
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching department analytics:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * AS-003 #14: Learning Culture Metrics
 * GET /api/v1/analytics/organization/:organizationId/learning-culture
 */
router.get('/organization/:organizationId/learning-culture', authenticateToken, [
    param('organizationId').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid organization ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const { organizationId } = req.params;
        
        // RBAC: Only org_admin can access organizational analytics
        if (!req.user.roles.includes('org_admin')) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }
        
        // Verify user belongs to this organization
        if (req.user.organizationId !== organizationId) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }
        
        // TODO: Try to fetch from external microservices
        const analytics = analyticsService.getLearningCulture(organizationId);
        
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching learning culture:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;