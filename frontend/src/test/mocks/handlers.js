import { rest } from 'msw';

// Mock API handlers for testing
export const handlers = [
  // Auth endpoints
  rest.get('http://localhost:3000/api/v1/auth/me', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: 'test-user-123',
          email: 'test@example.com',
          fullName: 'Test User',
          roles: ['learner'],
          organizationId: 'test-org-123',
          avatarUrl: 'https://example.com/avatar.jpg'
        }
      })
    );
  }),

  rest.post('http://localhost:3000/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: 'test-user-123',
          email: 'test@example.com',
          fullName: 'Test User',
          roles: ['learner'],
          organizationId: 'test-org-123',
          avatarUrl: 'https://example.com/avatar.jpg'
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600
      })
    );
  }),

  rest.post('http://localhost:3000/api/v1/auth/refresh', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'new-mock-jwt-token',
        refreshToken: 'new-mock-refresh-token',
        expiresIn: 3600
      })
    );
  }),

  // Learner Analytics endpoints
  rest.get('http://localhost:3000/api/v1/learner/analytics/overview/:userId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: req.params.userId,
        overallEngagement: 78,
        timeSpent: {
          total: 24.5,
          average: 2.1
        },
        contentEngagement: {
          videos: 85,
          articles: 72,
          quizzes: 90
        },
        sessionFrequency: {
          daily: 5,
          weekly: 12,
          monthly: 45
        },
        engagementScore: 78,
        lastUpdated: new Date().toISOString()
      })
    );
  }),

  rest.get('http://localhost:3000/api/v1/learner/analytics/velocity/:userId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: req.params.userId,
        currentVelocity: 2.3,
        momentum: 'positive',
        velocityHistory: [
          { date: '2024-01-01', velocity: 1.8 },
          { date: '2024-01-02', velocity: 2.1 },
          { date: '2024-01-03', velocity: 2.3 }
        ],
        lastUpdated: new Date().toISOString()
      })
    );
  }),

  // Trainer Analytics endpoints
  rest.get('http://localhost:3000/api/v1/trainer/analytics/overview/:trainerId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        trainerId: req.params.trainerId,
        totalStudents: 45,
        averagePerformance: 78,
        courseHealth: [
          { courseId: 'course-1', healthScore: 85, students: 20 },
          { courseId: 'course-2', healthScore: 72, students: 25 }
        ],
        lastUpdated: new Date().toISOString()
      })
    );
  }),

  // Organization Analytics endpoints
  rest.get('http://localhost:3000/api/v1/org-admin/analytics/overview/:orgId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        organizationId: req.params.orgId,
        totalLearners: 150,
        learningVelocity: 2.1,
        departmentBreakdown: [
          { department: 'Engineering', learners: 60, velocity: 2.3 },
          { department: 'Marketing', learners: 40, velocity: 1.9 },
          { department: 'Sales', learners: 50, velocity: 2.0 }
        ],
        lastUpdated: new Date().toISOString()
      })
    );
  }),

  // Analytics refresh endpoint
  rest.post('http://localhost:3000/api/v1/analytics/refresh', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Analytics refresh queued',
        queuedAnalytics: ['learner', 'trainer', 'organization'],
        estimatedCompletion: new Date(Date.now() + 300000).toISOString()
      })
    );
  }),

  // Health check endpoint
  rest.get('http://localhost:3000/api/health', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      })
    );
  }),

  // Status endpoint
  rest.get('http://localhost:3000/api/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'operational',
        services: {
          database: 'healthy',
          analytics: 'healthy',
          auth: 'healthy'
        },
        timestamp: new Date().toISOString()
      })
    );
  })
];
