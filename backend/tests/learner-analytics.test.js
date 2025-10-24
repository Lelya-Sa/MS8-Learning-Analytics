/**
 * TDD Tests for AS-001: Learner Analytics Endpoints
 * Tests all 6 learner analytics categories
 */

const request = require('supertest');
const app = require('../server');

describe('AS-001: Learner Analytics API', () => {
    let learnerToken;
    let trainerToken;
    let adminToken;

    beforeAll(async () => {
        // Login as learner
        const learnerLogin = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: process.env.TEST_USER_PASSWORD || 'test-password-123'
            });
        learnerToken = learnerLogin.body.token;

        // Login as trainer
        const trainerLogin = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'trainer@example.com',
                password: process.env.TEST_USER_PASSWORD || 'test-password-123'
            });
        trainerToken = trainerLogin.body.token;

        // Login as admin
        const adminLogin = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin@example.com',
                password: process.env.TEST_USER_PASSWORD || 'test-password-123'
            });
        adminToken = adminLogin.body.token;
    });

    describe('AS-001 #1: Learning Velocity & Momentum', () => {
        it('should return learning velocity for authenticated user', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/velocity')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('learningVelocity');
            
            const velocity = response.body.data.learningVelocity;
            expect(velocity).toHaveProperty('currentPace');
            expect(velocity).toHaveProperty('averagePace');
            expect(velocity).toHaveProperty('trend');
            expect(velocity).toHaveProperty('comparisonToGoal');
            expect(velocity).toHaveProperty('predictions');
            expect(velocity).toHaveProperty('momentum');
        });

        it('should require authentication', async () => {
            await request(app)
                .get('/api/v1/analytics/learner/user-123/velocity')
                .expect(401);
        });

        it('should enforce RBAC - learner can only access own data', async () => {
            await request(app)
                .get('/api/v1/analytics/learner/learner-456/velocity')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(403);
        });

        it('should allow trainer to access learner data', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/velocity')
                .set('Authorization', `Bearer ${trainerToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should return 404 for non-existent user', async () => {
            await request(app)
                .get('/api/v1/analytics/learner/non-existent-user/velocity')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
    });

    describe('AS-001 #2: Skill Gap Matrix with Prioritization', () => {
        it('should return skill gaps with prioritization', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/skill-gaps')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('skillGapMatrix');
            
            const skillGaps = response.body.data.skillGapMatrix;
            expect(skillGaps).toHaveProperty('summary');
            expect(skillGaps).toHaveProperty('prioritizedGaps');
            expect(skillGaps).toHaveProperty('skillsOnTrack');
            expect(skillGaps).toHaveProperty('skillsAchieved');
            
            // Verify prioritized gaps structure
            if (skillGaps.prioritizedGaps.length > 0) {
                const gap = skillGaps.prioritizedGaps[0];
                expect(gap).toHaveProperty('skillId');
                expect(gap).toHaveProperty('skillName');
                expect(gap).toHaveProperty('currentLevel');
                expect(gap).toHaveProperty('targetLevel');
                expect(gap).toHaveProperty('gap');
                expect(gap).toHaveProperty('priorityScore');
                expect(gap).toHaveProperty('priorityRank');
                expect(gap).toHaveProperty('factors');
                expect(gap).toHaveProperty('actionPlan');
            }
        });

        it('should require authentication', async () => {
            await request(app)
                .get('/api/v1/analytics/learner/user-123/skill-gaps')
                .expect(401);
        });

        it('should validate priority scoring', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/skill-gaps')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const gaps = response.body.data.skillGapMatrix.prioritizedGaps;
            
            // Verify gaps are sorted by priority rank
            for (let i = 0; i < gaps.length - 1; i++) {
                expect(gaps[i].priorityRank).toBeLessThanOrEqual(gaps[i + 1].priorityRank);
            }
            
            // Verify priority scores are between 0-100
            gaps.forEach(gap => {
                expect(gap.priorityScore).toBeGreaterThanOrEqual(0);
                expect(gap.priorityScore).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('AS-001 #3: Engagement Score with Behavioral Insights', () => {
        it('should return engagement analytics', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/engagement')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('engagementAnalytics');
            
            const engagement = response.body.data.engagementAnalytics;
            expect(engagement).toHaveProperty('overallScore');
            expect(engagement).toHaveProperty('scoreGrade');
            expect(engagement).toHaveProperty('breakdowns');
            expect(engagement).toHaveProperty('behavioralPatterns');
            expect(engagement).toHaveProperty('riskAssessment');
            expect(engagement).toHaveProperty('comparisonToPeers');
            
            // Verify breakdowns
            expect(engagement.breakdowns).toHaveProperty('consistency');
            expect(engagement.breakdowns).toHaveProperty('timeInvestment');
            expect(engagement.breakdowns).toHaveProperty('interactionQuality');
            expect(engagement.breakdowns).toHaveProperty('resourceUsage');
        });

        it('should validate engagement score range', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/engagement')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const engagement = response.body.data.engagementAnalytics;
            
            // Overall score should be 0-100
            expect(engagement.overallScore).toBeGreaterThanOrEqual(0);
            expect(engagement.overallScore).toBeLessThanOrEqual(100);
            
            // All breakdown scores should be 0-100
            expect(engagement.breakdowns.consistency.score).toBeGreaterThanOrEqual(0);
            expect(engagement.breakdowns.consistency.score).toBeLessThanOrEqual(100);
        });

        it('should include behavioral patterns', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/engagement')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const patterns = response.body.data.engagementAnalytics.behavioralPatterns;
            
            expect(patterns).toHaveProperty('peakLearningTime');
            expect(patterns).toHaveProperty('peakLearningDays');
            expect(patterns).toHaveProperty('preferredDevice');
            expect(patterns).toHaveProperty('learningStyle');
            expect(patterns).toHaveProperty('insights');
            expect(patterns).toHaveProperty('recommendations');
            
            expect(Array.isArray(patterns.insights)).toBe(true);
            expect(Array.isArray(patterns.recommendations)).toBe(true);
        });
    });

    describe('AS-001 #4: Mastery Progress Tracking', () => {
        it('should return mastery tracking data', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/mastery')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('masteryTracking');
            
            const mastery = response.body.data.masteryTracking;
            expect(mastery).toHaveProperty('summary');
            expect(mastery).toHaveProperty('topicBreakdown');
            
            // Verify summary
            expect(mastery.summary).toHaveProperty('topicsMastered');
            expect(mastery.summary).toHaveProperty('topicsInProgress');
            expect(mastery.summary).toHaveProperty('topicsNotStarted');
            expect(mastery.summary).toHaveProperty('overallMasteryScore');
        });

        it('should include detailed topic breakdown', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/mastery')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const topics = response.body.data.masteryTracking.topicBreakdown;
            
            expect(Array.isArray(topics)).toBe(true);
            
            if (topics.length > 0) {
                const topic = topics[0];
                expect(topic).toHaveProperty('topicId');
                expect(topic).toHaveProperty('topicName');
                expect(topic).toHaveProperty('masteryLevel');
                expect(topic).toHaveProperty('masteryGrade');
                expect(topic).toHaveProperty('practiceAttempts');
                expect(topic).toHaveProperty('successRate');
                expect(topic).toHaveProperty('milestones');
                expect(topic).toHaveProperty('strengthAreas');
                expect(topic).toHaveProperty('improvementAreas');
                expect(topic).toHaveProperty('recommendations');
            }
        });

        it('should validate mastery levels', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/mastery')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const topics = response.body.data.masteryTracking.topicBreakdown;
            
            topics.forEach(topic => {
                // Mastery level should be 0-100
                expect(topic.masteryLevel).toBeGreaterThanOrEqual(0);
                expect(topic.masteryLevel).toBeLessThanOrEqual(100);
                
                // Success rate should be 0-100
                expect(topic.successRate).toBeGreaterThanOrEqual(0);
                expect(topic.successRate).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('AS-001 #5: Performance & Assessment Analytics', () => {
        it('should return performance analytics', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/performance')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('analyticsType', 'performance_analytics');
            expect(response.body).toHaveProperty('data');
            
            const performance = response.body.data;
            expect(performance).toHaveProperty('overview');
            expect(performance).toHaveProperty('scoreProgression');
            expect(performance).toHaveProperty('topicPerformance');
            expect(performance).toHaveProperty('timeEfficiency');
            expect(performance).toHaveProperty('retryPatterns');
            expect(performance).toHaveProperty('predictions');
        });

        it('should validate score progression', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/performance')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const progression = response.body.data.scoreProgression;
            
            expect(Array.isArray(progression)).toBe(true);
            
            progression.forEach(score => {
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(100);
            });
        });

        it('should include predictive insights', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/performance')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const predictions = response.body.data.predictions;
            
            expect(predictions).toHaveProperty('projectedNextScore');
            expect(predictions).toHaveProperty('riskLevel');
            expect(predictions).toHaveProperty('recommendedStudyTime');
            
            expect(['low', 'medium', 'high']).toContain(predictions.riskLevel);
        });
    });

    describe('AS-001 #6: Course & Content Effectiveness', () => {
        it('should return content effectiveness analytics', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/content-effectiveness')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('analyticsType', 'content_effectiveness');
            expect(response.body).toHaveProperty('data');
            
            const effectiveness = response.body.data;
            expect(effectiveness).toHaveProperty('scope', 'learner');
            expect(effectiveness).toHaveProperty('dateRange');
            expect(effectiveness).toHaveProperty('effectivenessByType');
            expect(effectiveness).toHaveProperty('engagementToScoreCorrelation');
            expect(effectiveness).toHaveProperty('topContent');
            expect(effectiveness).toHaveProperty('lowContent');
            expect(effectiveness).toHaveProperty('insights');
        });

        it('should validate effectiveness by content type', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/content-effectiveness')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const byType = response.body.data.effectivenessByType;
            
            expect(Array.isArray(byType)).toBe(true);
            
            byType.forEach(item => {
                expect(item).toHaveProperty('type');
                expect(item).toHaveProperty('avgScore');
                expect(item).toHaveProperty('count');
                
                expect(item.avgScore).toBeGreaterThanOrEqual(0);
                expect(item.avgScore).toBeLessThanOrEqual(100);
            });
        });

        it('should include actionable insights', async () => {
            const response = await request(app)
                .get('/api/v1/analytics/learner/user-123/content-effectiveness')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const insights = response.body.data.insights;
            
            expect(Array.isArray(insights)).toBe(true);
            expect(insights.length).toBeGreaterThan(0);
        });
    });

    describe('Cross-Analytics Integration', () => {
        it('should return consistent user data across all analytics', async () => {
            const velocity = await request(app)
                .get('/api/v1/analytics/learner/user-123/velocity')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const engagement = await request(app)
                .get('/api/v1/analytics/learner/user-123/engagement')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            const mastery = await request(app)
                .get('/api/v1/analytics/learner/user-123/mastery')
                .set('Authorization', `Bearer ${learnerToken}`)
                .expect(200);

            // All should succeed for the same user
            expect(velocity.body.success).toBe(true);
            expect(engagement.body.success).toBe(true);
            expect(mastery.body.success).toBe(true);
        });

        it('should handle non-existent user consistently', async () => {
            const endpoints = [
                '/api/v1/analytics/learner/non-existent/velocity',
                '/api/v1/analytics/learner/non-existent/skill-gaps',
                '/api/v1/analytics/learner/non-existent/engagement',
                '/api/v1/analytics/learner/non-existent/mastery',
                '/api/v1/analytics/learner/non-existent/performance',
                '/api/v1/analytics/learner/non-existent/content-effectiveness'
            ];

            for (const endpoint of endpoints) {
                await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(404);
            }
        });
    });
});

