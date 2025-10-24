/**
 * TDD Tests for Mock Data Integration
 * Ensures backend returns complete mock data to frontend
 */

const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret-key-DO-NOT-USE-IN-PRODUCTION';

const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role, roles: user.roles, organizationId: user.organization_id },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

describe('🔴 RED: Mock Data Integration Tests', () => {
    let learnerToken;

    beforeAll(() => {
        learnerToken = generateToken({ 
            id: 'user-123', 
            email: 'test@example.com', 
            role: 'learner', 
            roles: ['learner'], 
            organization_id: 'org-123' 
        });
    });

    describe('AS-001 #1: Learning Velocity API', () => {
        it('should return complete velocity data structure', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/learner/user-123/velocity')
                .set('Authorization', `Bearer ${learnerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.learningVelocity).toBeDefined();
            
            const velocity = res.body.data.learningVelocity;
            expect(velocity.currentPace).toBeDefined();
            expect(velocity.averagePace).toBeDefined();
            expect(velocity.trend).toBeDefined();
            expect(velocity.predictions).toBeDefined();
            expect(velocity.momentum).toBeDefined();
        });

        it('should return numeric values for pace metrics', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/learner/user-123/velocity')
                .set('Authorization', `Bearer ${learnerToken}`);
            
            const velocity = res.body.data.learningVelocity;
            expect(typeof velocity.currentPace).toBe('number');
            expect(typeof velocity.averagePace).toBe('number');
            expect(velocity.currentPace).toBeGreaterThan(0);
        });
    });

    describe('AS-001 #2: Skill Gap Matrix API', () => {
        it('should return complete skill gap data structure', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/learner/user-123/skill-gaps')
                .set('Authorization', `Bearer ${learnerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.skillGapMatrix).toBeDefined();
            
            const skillGaps = res.body.data.skillGapMatrix;
            expect(skillGaps.summary).toBeDefined();
            expect(skillGaps.prioritizedGaps).toBeDefined();
            expect(Array.isArray(skillGaps.prioritizedGaps)).toBe(true);
        });

        it('should return prioritized gaps with action plans', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/learner/user-123/skill-gaps')
                .set('Authorization', `Bearer ${learnerToken}`);
            
            const gaps = res.body.data.skillGapMatrix.prioritizedGaps;
            expect(gaps.length).toBeGreaterThan(0);
            expect(gaps[0].skillName).toBeDefined();
            expect(gaps[0].actionPlan).toBeDefined();
        });
    });

    describe('AS-001 #3: Engagement Score API', () => {
        it('should return complete engagement data structure', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/learner/user-123/engagement')
                .set('Authorization', `Bearer ${learnerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.engagementAnalytics).toBeDefined();
            
            const engagement = res.body.data.engagementAnalytics;
            expect(engagement.overallScore).toBeDefined();
            expect(engagement.breakdowns).toBeDefined(); // Fixed: plural
            expect(engagement.behavioralPatterns).toBeDefined();
        });
    });

    describe('AS-001 #4: Mastery Progress API', () => {
        it('should return complete mastery data structure', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/learner/user-123/mastery')
                .set('Authorization', `Bearer ${learnerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.masteryTracking).toBeDefined();
            
            const mastery = res.body.data.masteryTracking;
            expect(mastery.summary).toBeDefined();
            expect(mastery.topicBreakdown).toBeDefined();
            expect(Array.isArray(mastery.topicBreakdown)).toBe(true);
        });
    });

    describe('AS-001 #5: Performance Analytics API', () => {
        it('should return complete performance data structure', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/learner/user-123/performance')
                .set('Authorization', `Bearer ${learnerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            
            const performance = res.body.data;
            expect(performance.overview).toBeDefined();
            expect(performance.scoreProgression).toBeDefined();
            expect(Array.isArray(performance.scoreProgression)).toBe(true);
        });
    });

    describe('AS-001 #6: Content Effectiveness API', () => {
        it('should return complete content effectiveness data structure', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/learner/user-123/content-effectiveness')
                .set('Authorization', `Bearer ${learnerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            
            const content = res.body.data;
            expect(content.effectivenessByType).toBeDefined();
            expect(Array.isArray(content.effectivenessByType)).toBe(true);
        });
    });

    describe('Data Consistency Across All APIs', () => {
        it('should return data for the same user across all endpoints', async () => {
            const endpoints = [
                '/api/v1/analytics/learner/user-123/velocity',
                '/api/v1/analytics/learner/user-123/skill-gaps',
                '/api/v1/analytics/learner/user-123/engagement',
                '/api/v1/analytics/learner/user-123/mastery',
                '/api/v1/analytics/learner/user-123/performance',
                '/api/v1/analytics/learner/user-123/content-effectiveness'
            ];

            for (const endpoint of endpoints) {
                const res = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${learnerToken}`);
                
                expect(res.statusCode).toEqual(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data).toBeDefined();
            }
        });
    });
});

