/**
 * Integration TDD Tests
 * Tests the complete integration between BFF and microservices
 * Tests the 3-stage processing pipeline: Collect → Analyze → Aggregate
 */

const request = require('supertest');
const app = require('../server');

describe('Integration TDD - Microservice Integration', () => {
  let authToken;

  beforeAll(async () => {
    // Login as admin to get auth token with proper permissions
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123'
      });
    
    authToken = loginResponse.body.token;
  });

  describe('3-Stage Processing Pipeline', () => {
    it('should complete Stage 1: Collect data from all microservices', async () => {
      const response = await request(app)
        .post('/api/v1/integration/collect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          analytics_type: 'learner',
          microservices: ['directory', 'course_builder', 'assessment', 'skills_engine']
        })
        .expect(200);

      expect(response.body).toHaveProperty('collection_id');
      expect(response.body).toHaveProperty('stage', 'collect');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('data_sources');
      expect(response.body.data_sources).toHaveLength(4);
      
      // Verify data collection from each microservice
      expect(response.body.data_sources).toContain('directory');
      expect(response.body.data_sources).toContain('course_builder');
      expect(response.body.data_sources).toContain('assessment');
      expect(response.body.data_sources).toContain('skills_engine');
    });

    it('should complete Stage 2: Analyze collected data', async () => {
      const response = await request(app)
        .post('/api/v1/integration/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          collection_id: 'collection-123',
          analytics_type: 'learner',
          analysis_config: {
            learning_velocity: true,
            mastery_progress: true,
            engagement_score: true,
            skill_gaps: true
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('analysis_id');
      expect(response.body).toHaveProperty('stage', 'analyze');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('analytics_results');
      
      // Verify analysis results
      expect(response.body.analytics_results).toHaveProperty('learning_velocity');
      expect(response.body.analytics_results).toHaveProperty('mastery_progress');
      expect(response.body.analytics_results).toHaveProperty('engagement_score');
      expect(response.body.analytics_results).toHaveProperty('skill_gaps');
    });

    it('should complete Stage 3: Aggregate analytics data', async () => {
      const response = await request(app)
        .post('/api/v1/integration/aggregate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          analysis_id: 'analysis-123',
          aggregation_config: {
            time_window: '7d',
            include_recommendations: true,
            include_trends: true
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('aggregation_id');
      expect(response.body).toHaveProperty('stage', 'aggregate');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('final_analytics');
      
      // Verify aggregated results
      expect(response.body.final_analytics).toHaveProperty('learning_velocity');
      expect(response.body.final_analytics).toHaveProperty('mastery_progress');
      expect(response.body.final_analytics).toHaveProperty('engagement_score');
      expect(response.body.final_analytics).toHaveProperty('skill_gaps');
      expect(response.body.final_analytics).toHaveProperty('recommendations');
      expect(response.body.final_analytics).toHaveProperty('trends');
    });

    it('should execute complete 3-stage pipeline end-to-end', async () => {
      const response = await request(app)
        .post('/api/v1/integration/pipeline')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          analytics_type: 'learner',
          pipeline_config: {
            microservices: ['directory', 'course_builder', 'assessment'],
            analysis_config: {
              learning_velocity: true,
              mastery_progress: true,
              engagement_score: true
            },
            aggregation_config: {
              time_window: '7d',
              include_recommendations: true
            }
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('pipeline_id');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('stages');
      expect(response.body.stages).toHaveProperty('collect');
      expect(response.body.stages).toHaveProperty('analyze');
      expect(response.body.stages).toHaveProperty('aggregate');
      
      // Verify all stages completed successfully
      expect(response.body.stages.collect.status).toBe('completed');
      expect(response.body.stages.analyze.status).toBe('completed');
      expect(response.body.stages.aggregate.status).toBe('completed');
      
      // Verify final analytics output
      expect(response.body).toHaveProperty('final_analytics');
      expect(response.body.final_analytics).toHaveProperty('learning_velocity');
      expect(response.body.final_analytics).toHaveProperty('mastery_progress');
      expect(response.body.final_analytics).toHaveProperty('engagement_score');
    });
  });

  describe('Microservice Data Collection', () => {
    it('should collect learner data from Directory service', async () => {
      const response = await request(app)
        .post('/api/v1/integration/microservice/directory')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          data_type: 'learner_profile'
        })
        .expect(200);

      expect(response.body).toHaveProperty('service', 'directory');
      expect(response.body).toHaveProperty('data_type', 'learner_profile');
      expect(response.body).toHaveProperty('user_id', 'user-123');
      expect(response.body).toHaveProperty('collected_data');
      
      // Verify directory-specific data structure
      expect(response.body.collected_data).toHaveProperty('user_profile');
      expect(response.body.collected_data).toHaveProperty('organization_info');
      expect(response.body.collected_data).toHaveProperty('role_permissions');
    });

    it('should collect course data from Course Builder service', async () => {
      const response = await request(app)
        .post('/api/v1/integration/microservice/course_builder')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          data_type: 'course_progress'
        })
        .expect(200);

      expect(response.body).toHaveProperty('service', 'course_builder');
      expect(response.body).toHaveProperty('data_type', 'course_progress');
      expect(response.body).toHaveProperty('user_id', 'user-123');
      expect(response.body).toHaveProperty('collected_data');
      
      // Verify course builder-specific data structure
      expect(response.body.collected_data).toHaveProperty('enrolled_courses');
      expect(response.body.collected_data).toHaveProperty('completion_rates');
      expect(response.body.collected_data).toHaveProperty('learning_path');
    });

    it('should collect assessment data from Assessment service', async () => {
      const response = await request(app)
        .post('/api/v1/integration/microservice/assessment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          data_type: 'assessment_results'
        })
        .expect(200);

      expect(response.body).toHaveProperty('service', 'assessment');
      expect(response.body).toHaveProperty('data_type', 'assessment_results');
      expect(response.body).toHaveProperty('user_id', 'user-123');
      expect(response.body).toHaveProperty('collected_data');
      
      // Verify assessment-specific data structure
      expect(response.body.collected_data).toHaveProperty('test_scores');
      expect(response.body.collected_data).toHaveProperty('skill_assessments');
      expect(response.body.collected_data).toHaveProperty('competency_levels');
    });

    it('should collect skills data from Skills Engine service', async () => {
      const response = await request(app)
        .post('/api/v1/integration/microservice/skills_engine')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          data_type: 'skill_progression'
        })
        .expect(200);

      expect(response.body).toHaveProperty('service', 'skills_engine');
      expect(response.body).toHaveProperty('data_type', 'skill_progression');
      expect(response.body).toHaveProperty('user_id', 'user-123');
      expect(response.body).toHaveProperty('collected_data');
      
      // Verify skills engine-specific data structure
      expect(response.body.collected_data).toHaveProperty('skill_levels');
      expect(response.body.collected_data).toHaveProperty('skill_gaps');
      expect(response.body.collected_data).toHaveProperty('learning_recommendations');
    });
  });

  describe('Data Processing and Storage', () => {
    it('should store collected data in 3-layer storage system', async () => {
      const response = await request(app)
        .post('/api/v1/integration/storage/store')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          collection_id: 'collection-123',
          data: {
            learning_velocity: 85.5,
            mastery_progress: 72.3,
            engagement_score: 91.2
          },
          storage_config: {
            layer_1_ttl: 86400, // 24 hours
            layer_2_ttl: 604800, // 7 days
            layer_3_ttl: 2207520000 // 7 years
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('storage_id');
      expect(response.body).toHaveProperty('status', 'stored');
      expect(response.body).toHaveProperty('storage_layers');
      expect(response.body.storage_layers).toHaveProperty('layer_1');
      expect(response.body.storage_layers).toHaveProperty('layer_2');
      expect(response.body.storage_layers).toHaveProperty('layer_3');
      
      // Verify all layers stored successfully
      expect(response.body.storage_layers.layer_1.status).toBe('stored');
      expect(response.body.storage_layers.layer_2.status).toBe('stored');
      expect(response.body.storage_layers.layer_3.status).toBe('stored');
    });

    it('should retrieve data from appropriate storage layer', async () => {
      const response = await request(app)
        .get('/api/v1/integration/storage/retrieve')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          user_id: 'user-123',
          analytics_type: 'learner',
          time_range: '24h'
        })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('source_layer');
      expect(response.body).toHaveProperty('retrieval_time');
      
      // Verify data structure
      expect(response.body.data).toHaveProperty('learning_velocity');
      expect(response.body.data).toHaveProperty('mastery_progress');
      expect(response.body.data).toHaveProperty('engagement_score');
    });
  });

  describe('Real-time Analytics Processing', () => {
    it('should process real-time analytics updates', async () => {
      const response = await request(app)
        .post('/api/v1/integration/realtime/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          event_type: 'course_completion',
          event_data: {
            course_id: 'course-456',
            completion_time: '2024-01-15T10:30:00Z',
            score: 95
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('processing_id');
      expect(response.body).toHaveProperty('status', 'processed');
      expect(response.body).toHaveProperty('updated_analytics');
      
      // Verify analytics were updated
      expect(response.body.updated_analytics).toHaveProperty('learning_velocity');
      expect(response.body.updated_analytics).toHaveProperty('mastery_progress');
      expect(response.body.updated_analytics).toHaveProperty('engagement_score');
    });

    it('should handle batch analytics processing', async () => {
      const response = await request(app)
        .post('/api/v1/integration/batch/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          batch_config: {
            user_ids: ['user-123', 'user-456', 'user-789'],
            analytics_type: 'learner',
            processing_mode: 'parallel'
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('batch_id');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('processed_users');
      expect(response.body.processed_users).toHaveLength(3);
      
      // Verify each user was processed
      expect(response.body.processed_users).toContain('user-123');
      expect(response.body.processed_users).toContain('user-456');
      expect(response.body.processed_users).toContain('user-789');
    });
  });

  describe('Integration Error Handling', () => {
    it('should handle microservice failures gracefully', async () => {
      const response = await request(app)
        .post('/api/v1/integration/collect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          analytics_type: 'learner',
          microservices: ['directory', 'failing_service', 'course_builder']
        })
        .expect(200);

      expect(response.body).toHaveProperty('collection_id');
      expect(response.body).toHaveProperty('status', 'partial_success');
      expect(response.body).toHaveProperty('data_sources');
      expect(response.body).toHaveProperty('failed_services');
      
      // Verify partial success handling
      expect(response.body.data_sources).toContain('directory');
      expect(response.body.data_sources).toContain('course_builder');
      expect(response.body.failed_services).toContain('failing_service');
    });

    it('should implement retry logic for transient failures', async () => {
      const response = await request(app)
        .post('/api/v1/integration/retry')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          failed_operation: 'microservice_call',
          service_name: 'transient_failing_service',
          retry_config: {
            max_retries: 3,
            backoff_strategy: 'exponential'
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('retry_id');
      expect(response.body).toHaveProperty('status', 'retry_successful');
      expect(response.body).toHaveProperty('attempts_made');
      expect(response.body.attempts_made).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Integration Performance', () => {
    it('should meet performance targets for data collection', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/v1/integration/collect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'user-123',
          analytics_type: 'learner',
          microservices: ['directory', 'course_builder', 'assessment', 'skills_engine']
        })
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.body).toHaveProperty('collection_id');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('performance_metrics');
      
      // Verify performance targets (p95 < 100ms for cached responses)
      expect(response.body.performance_metrics.response_time_ms).toBeLessThan(100);
      expect(responseTime).toBeLessThan(100);
    });

    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = Array.from({ length: 5 }, (_, i) => 
        request(app)
          .post('/api/v1/integration/collect')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            user_id: `user-${i + 1}`,
            analytics_type: 'learner',
            microservices: ['directory', 'course_builder']
          })
      );

      const responses = await Promise.all(concurrentRequests);
      
      // Verify all requests completed successfully
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('collection_id');
        expect(response.body).toHaveProperty('status', 'completed');
      });
    });
  });
});
