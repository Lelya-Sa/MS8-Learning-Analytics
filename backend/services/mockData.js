/**
 * Mock data service for testing and development
 * In production, this would be replaced with actual database calls
 */

const mockUsers = [
    {
        id: 'user-123',
        email: 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123',
        role: 'learner', // Primary role
        roles: ['learner'], // All roles
        organization_id: 'org-123'
    },
    {
        id: 'learner-456',
        email: 'learner@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123',
        role: 'learner',
        roles: ['learner'],
        organization_id: 'org-123'
    },
    {
        id: 'trainer-789',
        email: 'trainer@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123',
        role: 'trainer',
        roles: ['trainer'],
        organization_id: 'org-123'
    },
    {
        id: 'admin-101',
        email: 'admin@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123',
        role: 'org_admin',
        roles: ['org_admin'],
        organization_id: 'org-123'
    },
    {
        id: 'multi-role-202',
        email: 'multi@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123',
        role: 'learner', // Primary role
        roles: ['learner', 'trainer'], // User with multiple roles
        organization_id: 'org-123'
    },
    {
        id: 'super-admin-303',
        email: 'superadmin@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test-password-123',
        role: 'org_admin', // Primary role
        roles: ['learner', 'trainer', 'org_admin'], // User with all roles
        organization_id: 'org-123'
    }
];

const mockAnalytics = {
    learner: {
        'user-123': {
            learning_velocity: 85.5,
            mastery_progress: 72.3,
            engagement_score: 91.2,
            assessment_performance: 78.5,
            content_effectiveness: 82.1,
            skill_gaps: [
                { skill: 'JavaScript', priority: 'high', gap_score: 0.3 },
                { skill: 'React', priority: 'medium', gap_score: 0.2 }
            ]
        },
        'learner-456': {
            learning_velocity: 78.2,
            mastery_progress: 65.8,
            engagement_score: 84.5,
            assessment_performance: 71.3,
            content_effectiveness: 76.9,
            skill_gaps: [
                { skill: 'Python', priority: 'high', gap_score: 0.4 },
                { skill: 'Data Structures', priority: 'high', gap_score: 0.35 }
            ]
        },
        'multi-role-202': {
            learning_velocity: 92.1,
            mastery_progress: 88.5,
            engagement_score: 95.3,
            assessment_performance: 89.7,
            content_effectiveness: 91.2,
            skill_gaps: [
                { skill: 'Advanced Algorithms', priority: 'medium', gap_score: 0.15 },
                { skill: 'System Design', priority: 'low', gap_score: 0.1 }
            ]
        },
        'super-admin-303': {
            learning_velocity: 96.8,
            mastery_progress: 94.2,
            engagement_score: 98.1,
            assessment_performance: 95.5,
            content_effectiveness: 97.3,
            skill_gaps: [
                { skill: 'Machine Learning', priority: 'low', gap_score: 0.05 }
            ]
        }
    },
    trainer: {
        'trainer-789': {
            course_performance: 88.5,
            course_health: 92.3,
            teaching_effectiveness: 85.7,
            student_distribution: {
                total_students: 150,
                active_students: 120,
                at_risk_students: 15
            }
        },
        'multi-role-202': {
            course_performance: 82.3,
            course_health: 87.5,
            teaching_effectiveness: 79.8,
            student_distribution: {
                total_students: 85,
                active_students: 72,
                at_risk_students: 8
            }
        },
        'super-admin-303': {
            course_performance: 95.2,
            course_health: 98.1,
            teaching_effectiveness: 93.5,
            student_distribution: {
                total_students: 250,
                active_students: 235,
                at_risk_students: 5
            }
        }
    },
    organization: {
        'org-123': {
            learning_velocity: 78.5,
            strategic_alignment: 85.2,
            learning_culture: 91.8,
            department_metrics: {
                engineering: { velocity: 82.1, engagement: 88.5 },
                marketing: { velocity: 75.3, engagement: 79.2 }
            }
        }
    }
};

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

/**
 * User service methods
 */
const userService = {
    findByEmail: (email) => mockUsers.find(user => user.email === email),
    findById: (id) => mockUsers.find(user => user.id === id),
    validatePassword: (password, user) => password === user.password // Plain text for testing
};

/**
 * Analytics service methods
 */
const analyticsService = {
    getLearnerAnalytics: (userId) => mockAnalytics.learner[userId],
    getTrainerAnalytics: (userId) => mockAnalytics.trainer[userId],
    getOrganizationAnalytics: (organizationId) => mockAnalytics.organization[organizationId]
};

/**
 * Reports service methods
 */
const reportsService = {
    getUserReports: (userId) => mockReports.filter(report => report.user_id === userId),
    createReport: (reportData) => {
        const reportId = `report-${Date.now()}`;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
        const newReport = {
            id: reportId,
            ...reportData,
            status: 'processing',
            created_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            download_url: null
        };
        
        mockReports.push(newReport);
        return newReport;
    },
    findReportById: (reportId) => mockReports.find(report => report.id === reportId),
    deleteReport: (reportId) => {
        const index = mockReports.findIndex(report => report.id === reportId);
        if (index !== -1) {
            mockReports.splice(index, 1);
            return true;
        }
        return false;
    }
};

/**
 * Data collection service methods
 */
const dataCollectionService = {
    createCollection: (collectionData) => {
        const collectionId = `collection-${Date.now()}`;
        const now = new Date();
        
        const newCollection = {
            collection_id: collectionId,
            ...collectionData,
            status: 'started',
            progress: 0,
            records_processed: 0,
            started_at: now.toISOString(),
            updated_at: now.toISOString(),
            estimated_duration: '5-10 minutes'
        };
        
        mockCollections[collectionId] = newCollection;
        return newCollection;
    },
    findCollectionById: (collectionId) => mockCollections[collectionId],
    updateCollectionStatus: (collectionId, updates) => {
        if (mockCollections[collectionId]) {
            mockCollections[collectionId] = {
                ...mockCollections[collectionId],
                ...updates,
                updated_at: new Date().toISOString()
            };
            return mockCollections[collectionId];
        }
        return null;
    }
};

module.exports = {
    userService,
    analyticsService,
    reportsService,
    dataCollectionService
};
