const express = require('express');
const jwt = require('jsonwebtoken');
const { param, body, validationResult } = require('express-validator');

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

// Mock data collection storage
let mockCollections = {
    'completed-collection-id': {
        collection_id: 'completed-collection-id',
        user_id: 'user-123',
        collection_type: 'full',
        services: ['directory', 'course-builder', 'assessment'],
        status: 'completed',
        progress: 100,
        records_processed: 1500,
        started_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        estimated_duration: '5-10 minutes'
    }
};

// Trigger data collection
router.post('/trigger', authenticateToken, [
    body('user_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format'),
    body('collection_type').isIn(['full', 'incremental', 'targeted']).withMessage('Invalid collection type'),
    body('services').optional().isArray().withMessage('Services must be an array')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'validation',
                details: errors.array()
            });
        }

        const { user_id, collection_type, services } = req.body;
        
        // Generate collection ID
        const collectionId = `collection-${Date.now()}`;
        const now = new Date();
        
        // Store collection info
        mockCollections[collectionId] = {
            collection_id: collectionId,
            user_id,
            collection_type,
            services: services || ['directory', 'course-builder', 'assessment'],
            status: 'started',
            progress: 0,
            records_processed: 0,
            started_at: now.toISOString(),
            updated_at: now.toISOString(),
            estimated_duration: '5-10 minutes'
        };
        
        res.status(202).json({
            collection_id: collectionId,
            status: 'started',
            message: 'Data collection initiated',
            estimated_duration: '5-10 minutes'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get collection status
router.get('/:collectionId/status', authenticateToken, [
    param('collectionId').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid collection ID format')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'validation',
                details: errors.array()
            });
        }

        const { collectionId } = req.params;
        
        const collection = mockCollections[collectionId];
        if (!collection) {
            return res.status(404).json({
                error: 'Collection not found'
            });
        }
        
        // Check if user owns this collection
        if (collection.user_id !== req.user.userId && req.user.role !== 'org_admin') {
            return res.status(403).json({
                error: 'Access denied'
            });
        }
        
        res.json({
            collection_id: collection.collection_id,
            status: collection.status,
            progress: collection.progress,
            records_processed: collection.records_processed,
            started_at: collection.started_at,
            updated_at: collection.updated_at
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get collection results
router.get('/:collectionId/results', authenticateToken, [
    param('collectionId').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid collection ID format')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'validation',
                details: errors.array()
            });
        }

        const { collectionId } = req.params;
        
        const collection = mockCollections[collectionId];
        if (!collection) {
            return res.status(404).json({
                error: 'Collection not found'
            });
        }
        
        // Check if user owns this collection
        if (collection.user_id !== req.user.userId && req.user.role !== 'org_admin') {
            return res.status(403).json({
                error: 'Access denied'
            });
        }
        
        if (collection.status !== 'completed') {
            return res.status(400).json({
                error: 'Collection not completed yet'
            });
        }
        
        res.json({
            collection_id: collection.collection_id,
            status: 'completed',
            total_records: collection.records_processed,
            services_processed: collection.services,
            analytics_generated: true,
            completed_at: collection.updated_at
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Cancel collection
router.post('/:collectionId/cancel', authenticateToken, [
    param('collectionId').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid collection ID format')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'validation',
                details: errors.array()
            });
        }

        const { collectionId } = req.params;
        
        const collection = mockCollections[collectionId];
        if (!collection) {
            return res.status(404).json({
                error: 'Collection not found'
            });
        }
        
        // Check if user owns this collection
        if (collection.user_id !== req.user.userId && req.user.role !== 'org_admin') {
            return res.status(403).json({
                error: 'Access denied'
            });
        }
        
        if (collection.status === 'completed') {
            return res.status(400).json({
                error: 'Cannot cancel completed collection'
            });
        }
        
        // Update collection status
        collection.status = 'cancelled';
        collection.updated_at = new Date().toISOString();
        
        res.json({
            message: 'Collection cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router;
