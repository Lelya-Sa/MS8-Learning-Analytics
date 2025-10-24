const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { authenticateToken, handleValidationErrors } = require('../middleware/auth');
const { validationRules } = require('../middleware/validation');
const { userService } = require('../services/mockData');

const router = express.Router();

/**
 * Generate JWT token for user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
    // Use GitHub Secret in production, fallback for local development
    const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret-key-DO-NOT-USE-IN-PRODUCTION';
    
    return jwt.sign(
        { 
            userId: user.id, 
            email: user.email, 
            role: user.role,
            organizationId: user.organization_id 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

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

        // Find user
        const user = userService.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Verify password
        const isValidPassword = userService.validatePassword(password, user);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                organization_id: user.organization_id
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
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


module.exports = router;
