const express = require('express');
const { param, body, query, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Mock reports data (multiple users)
let mockReports = [
    // Learner reports
    {
        id: 'report-1',
        type: 'learner',
        format: 'pdf',
        status: 'completed',
        created_at: '2024-01-15T10:00:00Z',
        expires_at: '2024-01-22T10:00:00Z',
        download_url: 'https://example.com/report-1.pdf',
        user_id: 'learner-123'
    },
    {
        id: 'report-2',
        type: 'learner',
        format: 'csv',
        status: 'processing',
        created_at: '2024-01-15T11:00:00Z',
        expires_at: '2024-01-22T11:00:00Z',
        download_url: null,
        user_id: 'learner-123'
    },
    {
        id: 'completed-report-id',
        type: 'learner',
        format: 'pdf',
        status: 'completed',
        created_at: '2024-01-15T10:00:00Z',
        expires_at: '2024-01-22T10:00:00Z',
        download_url: 'https://example.com/completed-report.pdf',
        user_id: 'learner-123'
    },
    // Trainer reports
    {
        id: 'report-3',
        type: 'trainer',
        format: 'pdf',
        status: 'completed',
        created_at: '2024-01-14T10:00:00Z',
        expires_at: '2024-01-21T10:00:00Z',
        download_url: 'https://example.com/trainer-report-1.pdf',
        user_id: 'trainer-456'
    },
    // Org-admin reports
    {
        id: 'report-4',
        type: 'organization',
        format: 'excel',
        status: 'completed',
        created_at: '2024-01-13T10:00:00Z',
        expires_at: '2024-01-20T10:00:00Z',
        download_url: 'https://example.com/org-report-1.xlsx',
        user_id: 'admin-789'
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
        
        // Return data in the format expected by the frontend
        res.json({
            summary: {
                totalReports: userReports.length,
                completedReports: userReports.filter(r => r.status === 'completed').length,
                processingReports: userReports.filter(r => r.status === 'processing').length,
                failedReports: userReports.filter(r => r.status === 'failed').length
            },
            reports: userReports.map(report => ({
                id: report.id,
                type: report.type,
                format: report.format,
                status: report.status,
                generatedAt: report.created_at,
                expiresAt: report.expires_at,
                downloadUrl: report.download_url,
                title: `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report`
            })),
            reportTypes: [
                { type: 'learner', count: userReports.filter(r => r.type === 'learner').length },
                { type: 'trainer', count: userReports.filter(r => r.type === 'trainer').length },
                { type: 'organization', count: userReports.filter(r => r.type === 'organization').length }
            ],
            trends: {
                monthly: [
                    { month: 'Jan', count: 5 },
                    { month: 'Feb', count: 8 },
                    { month: 'Mar', count: 12 }
                ]
            }
        });
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

// Get specific report
router.get('/:reportId', authenticateToken, [
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
        
        // Return report with preview data
        res.json({
            report: {
                id: report.id,
                type: report.type,
                format: report.format,
                status: report.status,
                generatedAt: report.created_at,
                expiresAt: report.expires_at,
                downloadUrl: report.download_url,
                title: `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report`
            },
            preview: {
                summary: {
                    totalReports: 15,
                    completedReports: 12,
                    processingReports: 2,
                    failedReports: 1
                },
                learningProgress: [
                    { date: '2024-01-01', progress: 65 },
                    { date: '2024-01-08', progress: 72 },
                    { date: '2024-01-15', progress: 78 }
                ],
                skillBreakdown: [
                    { skill: 'JavaScript', level: 85 },
                    { skill: 'React', level: 80 },
                    { skill: 'Node.js', level: 70 }
                ],
                achievements: [
                    { title: 'First Course', description: 'Completed first course', date: '2024-01-10' },
                    { title: 'Quick Learner', description: 'Completed 5 courses in a week', date: '2024-01-15' }
                ],
                recommendations: [
                    { type: 'course', title: 'Advanced JavaScript', priority: 'high' },
                    { type: 'skill', title: 'Learn TypeScript', priority: 'medium' }
                ],
                charts: {
                    progress: { type: 'line', data: [] },
                    skills: { type: 'bar', data: [] }
                }
            }
        });
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
