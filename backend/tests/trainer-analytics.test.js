/**
 * AS-002: Trainer Analytics API Tests
 * TDD: RED Phase - Write failing tests first
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

describe('🔴 RED: AS-002 Trainer Analytics API Tests', () => {
    let trainerToken;
    let learnerToken;
    let orgAdminToken;

    beforeAll(() => {
        // Trainer user
        trainerToken = generateToken({
            id: 'trainer-123',
            email: 'trainer@example.com',
            role: 'trainer',
            roles: ['trainer'],
            organization_id: 'org-123'
        });

        // Learner user (should NOT have access)
        learnerToken = generateToken({
            id: 'learner-456',
            email: 'learner@example.com',
            role: 'learner',
            roles: ['learner'],
            organization_id: 'org-123'
        });

        // Org Admin user (should have access)
        orgAdminToken = generateToken({
            id: 'admin-789',
            email: 'admin@example.com',
            role: 'org_admin',
            roles: ['org_admin'],
            organization_id: 'org-123'
        });
    });

    describe('AS-002 #8: Course Health Dashboard', () => {
        const endpoint = '/api/v1/analytics/trainer/trainer-123/course-health/course-123';

        it('should return 401 without authentication', async () => {
            const res = await request(app).get(endpoint);
            expect(res.statusCode).toEqual(401);
        });

        it('should return 403 for learner role', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${learnerToken}`);
            expect(res.statusCode).toEqual(403);
        });

        it('should return 200 with complete course health data for trainer', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${trainerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.courseHealth).toBeDefined();
            
            const health = res.body.data.courseHealth;
            expect(health.courseId).toBe('course-123');
            expect(health.courseName).toBeDefined();
            expect(health.overallHealth).toBeDefined();
            expect(health.healthScore).toBeDefined();
            expect(health.metrics).toBeDefined();
            expect(health.dropOffAnalysis).toBeDefined();
            expect(health.contentPerformance).toBeDefined();
            expect(health.recommendations).toBeDefined();
        });

        it('should return 200 for org_admin role', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${orgAdminToken}`);
            expect(res.statusCode).toEqual(200);
        });

        it('should validate courseId parameter', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/trainer/trainer-123/course-health/invalid@course')
                .set('Authorization', `Bearer ${trainerToken}`);
            expect(res.statusCode).toEqual(400);
        });

        it('should return 404 for non-existent course', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/trainer/trainer-123/course-health/course-nonexistent')
                .set('Authorization', `Bearer ${trainerToken}`);
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('AS-002 #7: Course Performance Dashboard', () => {
        const endpoint = '/api/v1/analytics/trainer/trainer-123/course-performance';

        it('should return 401 without authentication', async () => {
            const res = await request(app).get(endpoint);
            expect(res.statusCode).toEqual(401);
        });

        it('should return 200 with all courses performance data', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${trainerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.coursePerformance).toBeDefined();
            expect(Array.isArray(res.body.data.coursePerformance.courses)).toBe(true);
        });
    });

    describe('AS-002 #9: Student Performance Distribution', () => {
        const endpoint = '/api/v1/analytics/trainer/trainer-123/student-distribution/course-123';

        it('should return 401 without authentication', async () => {
            const res = await request(app).get(endpoint);
            expect(res.statusCode).toEqual(401);
        });

        it('should return 200 with student distribution data', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${trainerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.studentDistribution).toBeDefined();
        });
    });

    describe('AS-002 #10: Teaching Effectiveness Metrics', () => {
        const endpoint = '/api/v1/analytics/trainer/trainer-123/teaching-effectiveness';

        it('should return 401 without authentication', async () => {
            const res = await request(app).get(endpoint);
            expect(res.statusCode).toEqual(401);
        });

        it('should return 200 with teaching effectiveness data', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${trainerToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.teachingEffectiveness).toBeDefined();
        });
    });
});

