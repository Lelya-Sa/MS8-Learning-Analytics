/**
 * Phase 3B: System Routes
 * Implements system endpoints (health, status, refresh)
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors, validationRules } = require('../middleware/validation');
const { systemService } = require('../services/mockData');

const router = express.Router();

/**
 * GET /api/health
 * Health Check Endpoint
 */
router.get('/health', async (req, res) => {
    try {
        const health = systemService.getHealthStatus();
        res.json(health);
    } catch (error) {
        console.error('Error fetching health status:', error);
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed'
        });
    }
});

/**
 * GET /api/status
 * Service Status Endpoint
 */
router.get('/status', async (req, res) => {
    try {
        const status = systemService.getServiceStatus();
        res.json(status);
    } catch (error) {
        console.error('Error fetching service status:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;
