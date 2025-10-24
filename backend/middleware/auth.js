const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * Authentication middleware for JWT token validation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            error: 'Access token required',
            code: 'MISSING_TOKEN'
        });
    }

    // Use GitHub Secret in production, fallback for local development
    const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret-key-DO-NOT-USE-IN-PRODUCTION';

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                error: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }
        req.user = user;
        next();
    });
};

/**
 * Role-based access control middleware
 * Supports both single role and multiple roles per user
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Get user's roles (support both single role and multiple roles)
        const userRoles = req.user.roles || [req.user.role];
        
        // Check if user has at least one of the required roles
        const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));
        
        if (!hasRequiredRole) {
            return res.status(403).json({ 
                error: 'Insufficient permissions',
                code: 'INSUFFICIENT_PERMISSIONS',
                required: allowedRoles,
                current: userRoles
            });
        }
        next();
    };
};

/**
 * Check if user can access resource (own data or admin role)
 * @param {string} resourceUserId - User ID of the resource owner
 * @param {Object} user - Current user from JWT token
 * @param {string[]} adminRoles - Roles that can access any resource
 * @returns {boolean} True if access is allowed
 */
const canAccessResource = (resourceUserId, user, adminRoles = ['org_admin']) => {
    return user.userId === resourceUserId || adminRoles.includes(user.role);
};

/**
 * Validation error handler middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'validation',
            code: 'VALIDATION_ERROR',
            details: errors.array()
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireRole,
    canAccessResource,
    handleValidationErrors
};
