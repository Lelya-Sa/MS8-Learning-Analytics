/**
 * Integration Routes
 * Implements the 3-stage processing pipeline endpoints
 */

const express = require('express');
const { param, body, query } = require('express-validator');
const { authenticateToken, requireRole, handleValidationErrors } = require('../middleware/auth');
const IntegrationService = require('../services/integrationService');

const router = express.Router();
const integrationService = new IntegrationService();

// 3-Stage Processing Pipeline Routes
router.post('/collect', authenticateToken, [
  body('user_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format'),
  body('analytics_type').isIn(['learner', 'trainer', 'organization']).withMessage('Invalid analytics type'),
  body('microservices').isArray().withMessage('Microservices must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { user_id, analytics_type, microservices } = req.body;
    const result = await integrationService.collectData(user_id, analytics_type, microservices);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.post('/analyze', authenticateToken, [
  body('collection_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid collection ID format'),
  body('analytics_type').isIn(['learner', 'trainer', 'organization']).withMessage('Invalid analytics type'),
  body('analysis_config').isObject().withMessage('Analysis config must be an object')
], handleValidationErrors, async (req, res) => {
  try {
    const { collection_id, analytics_type, analysis_config } = req.body;
    const result = await integrationService.analyzeData(collection_id, analytics_type, analysis_config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.post('/aggregate', authenticateToken, [
  body('analysis_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid analysis ID format'),
  body('aggregation_config').isObject().withMessage('Aggregation config must be an object')
], handleValidationErrors, async (req, res) => {
  try {
    const { analysis_id, aggregation_config } = req.body;
    const result = await integrationService.aggregateData(analysis_id, aggregation_config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.post('/pipeline', authenticateToken, [
  body('user_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format'),
  body('analytics_type').isIn(['learner', 'trainer', 'organization']).withMessage('Invalid analytics type'),
  body('pipeline_config').isObject().withMessage('Pipeline config must be an object')
], handleValidationErrors, async (req, res) => {
  try {
    const { user_id, analytics_type, pipeline_config } = req.body;
    const result = await integrationService.executePipeline(user_id, analytics_type, pipeline_config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// Microservice Data Collection Routes
router.post('/microservice/:serviceName', authenticateToken, [
  param('serviceName').matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid service name format'),
  body('user_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format'),
  body('data_type').isString().withMessage('Data type must be a string')
], handleValidationErrors, async (req, res) => {
  try {
    const { serviceName } = req.params;
    const { user_id, data_type } = req.body;
    const result = await integrationService.collectFromMicroservice(serviceName, user_id, data_type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 'MICROSERVICE_ERROR' });
  }
});

// Data Processing and Storage Routes
router.post('/storage/store', authenticateToken, [
  body('collection_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid collection ID format'),
  body('data').isObject().withMessage('Data must be an object'),
  body('storage_config').isObject().withMessage('Storage config must be an object')
], handleValidationErrors, async (req, res) => {
  try {
    const { collection_id, data, storage_config } = req.body;
    const result = await integrationService.storeData(collection_id, data, storage_config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.get('/storage/retrieve', authenticateToken, [
  query('user_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format'),
  query('analytics_type').isIn(['learner', 'trainer', 'organization']).withMessage('Invalid analytics type'),
  query('time_range').isIn(['24h', '7d', '1y']).withMessage('Invalid time range')
], handleValidationErrors, async (req, res) => {
  try {
    const { user_id, analytics_type, time_range } = req.query;
    const result = await integrationService.retrieveData(user_id, analytics_type, time_range);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// Real-time Analytics Processing Routes
router.post('/realtime/process', authenticateToken, [
  body('user_id').matches(/^[a-zA-Z0-9-]+$/).withMessage('Invalid user ID format'),
  body('event_type').isString().withMessage('Event type must be a string'),
  body('event_data').isObject().withMessage('Event data must be an object')
], handleValidationErrors, async (req, res) => {
  try {
    const { user_id, event_type, event_data } = req.body;
    const result = await integrationService.processRealtimeUpdate(user_id, event_type, event_data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.post('/batch/process', authenticateToken, [
  body('batch_config').isObject().withMessage('Batch config must be an object')
], handleValidationErrors, async (req, res) => {
  try {
    const { batch_config } = req.body;
    const result = await integrationService.processBatch(batch_config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// Integration Error Handling Routes
router.post('/retry', authenticateToken, [
  body('failed_operation').isString().withMessage('Failed operation must be a string'),
  body('service_name').isString().withMessage('Service name must be a string'),
  body('retry_config').isObject().withMessage('Retry config must be an object')
], handleValidationErrors, async (req, res) => {
  try {
    const { failed_operation, service_name, retry_config } = req.body;
    const result = await integrationService.retryOperation(failed_operation, service_name, retry_config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Retry failed', code: 'RETRY_ERROR' });
  }
});

module.exports = router;
