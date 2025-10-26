const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { authenticateToken, handleValidationErrors } = require('../middleware/auth');
const { validationRules } = require('../middleware/validation');
const { userService } = require('../services/mockData');
const { AuthService } = require('../services/authService');

const router = express.Router();

// Initialize Auth Service
const authService = new AuthService();

/**
 * Login endpoint
 * POST /api/v1/auth/login
 */
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
], handleValidationErrors, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Authenticate with MS12 (with fallback to mock data)
        const authResult = await authService.authenticate(email, password);

        res.json({
            token: authResult.token,
            user: authResult.user,
            source: authResult.source // 'MS12' or 'MOCK'
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS'
        });
    }
});

/**
 * Logout endpoint
 * POST /api/v1/auth/logout
 */
router.post('/logout', authenticateToken, (req, res) => {
    // In a real app, you might blacklist the token
    res.json({
        message: 'Logged out successfully',
        code: 'LOGOUT_SUCCESS'
    });
});

/**
 * Get current user info endpoint
 * GET /api/v1/auth/me
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        // Get user data with MS12 fallback
        const result = await authService.getCurrentUser(req.user.userId);

        res.json({
            user: result.user,
            source: result.source // 'MS12' or 'MOCK'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * Refresh token endpoint
 * POST /api/v1/auth/refresh
 */
router.post('/refresh', authenticateToken, (req, res) => {
    try {
        // Generate new token with same user data
        const newToken = jwt.sign(
            { 
                userId: req.user.userId, 
                email: req.user.email, 
                role: req.user.role,
                organizationId: req.user.organizationId 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token: newToken,
            expires_in: 86400 // 24 hours in seconds
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

module.exports = router;
