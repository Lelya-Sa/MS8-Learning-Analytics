const { validationResult } = require('express-validator');

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

/**
 * Common validation rules
 */
const validationRules = {
    userId: {
        matches: /^[a-zA-Z0-9-]+$/,
        message: 'Invalid user ID format'
    },
    organizationId: {
        matches: /^[a-zA-Z0-9-]+$/,
        message: 'Invalid organization ID format'
    },
    collectionId: {
        matches: /^[a-zA-Z0-9-]+$/,
        message: 'Invalid collection ID format'
    },
    reportId: {
        matches: /^[a-zA-Z0-9-]+$/,
        message: 'Invalid report ID format'
    },
    email: {
        isEmail: true,
        normalizeEmail: true
    },
    password: {
        isLength: { min: 6 },
        message: 'Password must be at least 6 characters'
    }
};

module.exports = {
    handleValidationErrors,
    validationRules
};
