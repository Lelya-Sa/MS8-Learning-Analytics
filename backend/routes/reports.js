const express = require('express');
const jwt = require('jsonwebtoken');
const { param, body, query, validationResult } = require('express-validator');

const router = express.Router();

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Mock reports data
let mockReports = [
    {
        id: 'report-1',
        type: 'learner',
        format: 'pdf',
        status: 'completed',
        created_at: '2024-01-15T10:00:00Z',
        expires_at: '2024-01-22T10:00:00Z',
        download_url: 'https://example.com/report-1.pdf',
        user_id: 'user-123'
    },
    {
        id: 'report-2',
        type: 'learner',
        format: 'csv',
        status: 'processing',
        created_at: '2024-01-15T11:00:00Z',
        expires_at: '2024-01-22T11:00:00Z',
        download_url: null,
        user_id: 'user-123'
    },
    {
        id: 'completed-report-id',
        type: 'learner',
        format: 'pdf',
        status: 'completed',
        created_at: '2024-01-15T10:00:00Z',
        expires_at: '2024-01-22T10:00:00Z',
        download_url: 'https://example.com/completed-report.pdf',
        user_id: 'user-123'
    }
];

// Get user reports
router.get('/', authenticateToken, [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'validation',
                details: errors.array()
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Filter reports by user (in real app, this would be done by database query)
        const userReports = mockReports.filter(report => report.user_id === req.user.userId);
        
        res.json(userReports);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Generate new report
router.post('/generate', authenticateToken, [
    body('type').isIn(['learner', 'trainer', 'organization']).withMessage('Invalid report type'),
    body('format').isIn(['pdf', 'csv', 'excel']).withMessage('Invalid report format'),
    body('user_id').optional().matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'validation',
                details: errors.array()
            });
        }

        const { type, format, user_id } = req.body;
        
        // Generate new report
        const reportId = `report-${Date.now()}`;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        
        const newReport = {
            id: reportId,
            type,
            format,
            status: 'processing',
            created_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            download_url: null,
            user_id: user_id || req.user.userId
        };
        
        mockReports.push(newReport);
        
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Download report
router.get('/:reportId/download', authenticateToken, [
    param('reportId').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid report ID format')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'validation',
                details: errors.array()
            });
        }

        const { reportId } = req.params;
        
        // Find report
        const report = mockReports.find(r => r.id === reportId && r.user_id === req.user.userId);
        if (!report) {
            return res.status(404).json({
                error: 'Report not found'
            });
        }
        
        if (report.status !== 'completed') {
            return res.status(400).json({
                error: 'Report is still processing'
            });
        }
        
        // Mock file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${reportId}.pdf"`);
        res.send(Buffer.from('Mock PDF content'));
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Delete report
router.delete('/:reportId', authenticateToken, [
    param('reportId').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid report ID format')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'validation',
                details: errors.array()
            });
        }

        const { reportId } = req.params;
        
        // Find and remove report
        const reportIndex = mockReports.findIndex(r => r.id === reportId && r.user_id === req.user.userId);
        if (reportIndex === -1) {
            return res.status(404).json({
                error: 'Report not found'
            });
        }
        
        mockReports.splice(reportIndex, 1);
        
        res.json({
            message: 'Report deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router;
