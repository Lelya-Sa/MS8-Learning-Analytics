/**
 * AS-003: Organizational Analytics API Tests
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

describe('🔴 RED: AS-003 Organizational Analytics API Tests', () => {
    let orgAdminToken;
    let learnerToken;
    let trainerToken;

    beforeAll(() => {
        // Org Admin user
        orgAdminToken = generateToken({
            id: 'admin-789',
            email: 'admin@example.com',
            role: 'org_admin',
            roles: ['org_admin'],
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

        // Trainer user (should NOT have access to org analytics)
        trainerToken = generateToken({
            id: 'trainer-123',
            email: 'trainer@example.com',
            role: 'trainer',
            roles: ['trainer'],
            organization_id: 'org-123'
        });
    });

    describe('AS-003 #11: Organizational Learning Velocity', () => {
        const endpoint = '/api/v1/analytics/organization/org-123/learning-velocity';

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

        it('should return 403 for trainer role', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${trainerToken}`);
            expect(res.statusCode).toEqual(403);
        });

        it('should return 200 with complete learning velocity data for org_admin', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${orgAdminToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.orgLearningVelocity).toBeDefined();
            
            const velocity = res.body.data.orgLearningVelocity;
            expect(velocity.organizationId).toBe('org-123');
            expect(velocity.overview).toBeDefined();
            expect(velocity.roiMetrics).toBeDefined();
            expect(velocity.departmentBreakdown).toBeDefined();
            expect(velocity.trends).toBeDefined();
        });

        it('should validate organizationId parameter', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/organization/invalid@org/learning-velocity')
                .set('Authorization', `Bearer ${orgAdminToken}`);
            expect(res.statusCode).toEqual(400);
        });

        it('should return 404 for non-existent organization', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/organization/org-nonexistent/learning-velocity')
                .set('Authorization', `Bearer ${orgAdminToken}`);
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('AS-003 #12: Strategic Alignment Tracking', () => {
        const endpoint = '/api/v1/analytics/organization/org-123/strategic-alignment';

        it('should return 401 without authentication', async () => {
            const res = await request(app).get(endpoint);
            expect(res.statusCode).toEqual(401);
        });

        it('should return 403 for non-admin roles', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${learnerToken}`);
            expect(res.statusCode).toEqual(403);
        });

        it('should return 200 with strategic alignment data', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${orgAdminToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.strategicAlignment).toBeDefined();
        });
    });

    describe('AS-003 #13: Department & Team Analytics', () => {
        const endpoint = '/api/v1/analytics/organization/org-123/department-analytics';

        it('should return 401 without authentication', async () => {
            const res = await request(app).get(endpoint);
            expect(res.statusCode).toEqual(401);
        });

        it('should return 200 with department analytics data', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${orgAdminToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.departmentAnalytics).toBeDefined();
        });

        it('should support department filtering', async () => {
            const res = await request(app)
                .get(endpoint + '?department=engineering')
                .set('Authorization', `Bearer ${orgAdminToken}`);
            
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('AS-003 #14: Learning Culture Metrics', () => {
        const endpoint = '/api/v1/analytics/organization/org-123/learning-culture';

        it('should return 401 without authentication', async () => {
            const res = await request(app).get(endpoint);
            expect(res.statusCode).toEqual(401);
        });

        it('should return 200 with learning culture data', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${orgAdminToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.learningCulture).toBeDefined();
        });
    });
});

