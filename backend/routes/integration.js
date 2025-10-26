/**
 * Phase 3B: Integration Routes
 * Implements integration endpoints for external microservices
 */

const express = require('express');
const { param, query, body } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { integrationService } = require('../services/mockData');

const router = express.Router();

/**
 * GET /api/v1/integration/health
 * Integration Health Check
 */
router.get('/health', async (req, res) => {
    try {
        const health = integrationService.getIntegrationHealth();
        res.json(health);
    } catch (error) {
        console.error('Error fetching integration health:', error);
        res.status(503).json({
            status: 'degraded',
            timestamp: new Date().toISOString(),
            error: 'Integration health check failed'
        });
    }
});

/**
 * GET /api/v1/integration/services/:serviceName/status
 * Individual Service Status
 */
router.get('/services/:serviceName/status', [
    param('serviceName').isIn(['directory', 'course-builder', 'content-studio', 'assessment', 'skills-engine', 'learner-ai', 'devlab', 'rag-assistant'])
], handleValidationErrors, async (req, res) => {
    try {
        const { serviceName } = req.params;
        
        const status = integrationService.getServiceStatus(serviceName);
        if (!status) {
            return res.status(404).json({
                error: 'SERVICE_NOT_FOUND',
                message: `Service '${serviceName}' not found`,
                availableServices: ['directory', 'course-builder', 'content-studio', 'assessment', 'skills-engine', 'learner-ai', 'devlab', 'rag-assistant']
            });
        }

        res.json(status);
    } catch (error) {
        console.error('Error fetching service status:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * POST /api/v1/integration/services/:serviceName/test
 * Test Service Connectivity
 */
router.post('/services/:serviceName/test', authenticateToken, [
    param('serviceName').isIn(['directory', 'course-builder', 'content-studio', 'assessment', 'skills-engine', 'learner-ai', 'devlab', 'rag-assistant']),
    body('testType').isIn(['connectivity', 'endpoint', 'mock-data']),
    body('endpoint').optional().isString(),
    body('timeout').optional().isInt({ min: 1000, max: 30000 })
], handleValidationErrors, async (req, res) => {
    try {
        const { serviceName } = req.params;
        const { testType, endpoint, timeout } = req.body;
        
        const result = integrationService.testService(serviceName, testType, endpoint, timeout);
        
        if (result.success) {
            res.json({
                service: `${serviceName} MS`,
                testType: testType,
                result: 'success',
                responseTime: result.responseTime,
                details: result.details,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                error: 'TEST_FAILED',
                message: 'Service test failed',
                service: `${serviceName} MS`,
                testType: testType,
                result: 'failure',
                details: result.details,
                fallback: result.fallback
            });
        }
    } catch (error) {
        console.error('Error testing service:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/integration/mock-data/:serviceName
 * Get Mock Data for Service
 */
router.get('/mock-data/:serviceName', authenticateToken, [
    param('serviceName').isIn(['directory', 'course-builder', 'content-studio', 'assessment', 'skills-engine', 'learner-ai', 'devlab', 'rag-assistant']),
    query('endpoint').optional().isString(),
    query('userId').optional().matches(/^[a-zA-Z0-9-]+$/)
], handleValidationErrors, async (req, res) => {
    try {
        const { serviceName } = req.params;
        const { endpoint, userId } = req.query;
        
        const mockData = integrationService.getMockData(serviceName, endpoint, userId);
        if (!mockData) {
            return res.status(404).json({
                error: 'SERVICE_NOT_FOUND',
                message: `Service '${serviceName}' not found`
            });
        }

        res.json({
            service: `${serviceName} MS`,
            endpoint: endpoint || 'default',
            mockData: mockData.data,
            metadata: mockData.metadata
        });
    } catch (error) {
        console.error('Error fetching mock data:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * POST /api/v1/integration/circuit-breaker/:serviceName/reset
 * Reset Circuit Breaker
 */
router.post('/circuit-breaker/:serviceName/reset', authenticateToken, requireRole(['org-admin']), [
    param('serviceName').isIn(['directory', 'course-builder', 'content-studio', 'assessment', 'skills-engine', 'learner-ai', 'devlab', 'rag-assistant'])
], handleValidationErrors, async (req, res) => {
    try {
        const { serviceName } = req.params;
        
        const result = integrationService.resetCircuitBreaker(serviceName);
        
        res.json({
            service: `${serviceName} MS`,
            circuitBreaker: result.circuitBreaker,
            message: 'Circuit breaker reset successfully'
        });
    } catch (error) {
        console.error('Error resetting circuit breaker:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/v1/integration/metrics
 * Integration Metrics
 */
router.get('/metrics', authenticateToken, [
    query('timeframe').optional().isIn(['1h', '24h', '7d', '30d']),
    query('service').optional().isIn(['directory', 'course-builder', 'content-studio', 'assessment', 'skills-engine', 'learner-ai', 'devlab', 'rag-assistant'])
], handleValidationErrors, async (req, res) => {
    try {
        const { timeframe, service } = req.query;
        
        const metrics = integrationService.getMetrics(timeframe, service);
        
        res.json({
            timeframe: timeframe || '24h',
            services: metrics.services,
            summary: metrics.summary,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching integration metrics:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;