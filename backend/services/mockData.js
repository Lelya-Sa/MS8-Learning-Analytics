/**
 * Phase 3B: Comprehensive Mock Data Service
 * Provides mock data for all 30+ API endpoints
 */

class UserService {
    constructor() {
        this.users = [
            {
                id: 'learner-123',
                email: 'learner@test.com',
                password: 'password123',
                role: 'learner',
                roles: ['learner'],
                organization_id: 'org-123',
                fullName: 'John Learner',
                department: 'Engineering'
            },
            {
                id: 'trainer-456',
                email: 'trainer@test.com',
                password: 'password123',
                role: 'trainer',
                roles: ['trainer'],
                organization_id: 'org-123',
                fullName: 'Jane Trainer',
                department: 'Education'
            },
            {
                id: 'admin-789',
                email: 'admin@test.com',
                password: 'password123',
                role: 'org-admin',
                roles: ['org-admin'],
                organization_id: 'org-123',
                fullName: 'Admin User',
                department: 'Management'
            },
            {
                id: 'supertester-999',
                email: 'supertester@test.com',
                password: 'password123',
                role: 'learner', // Default active role
                roles: ['learner', 'trainer', 'org-admin'],
                organization_id: 'org-123',
                fullName: 'Super Tester',
                department: 'QA & Testing'
            }
        ];
    }

    findByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    findById(id) {
        return this.users.find(user => user.id === id);
    }

    validatePassword(password, user) {
        // Simple password validation for testing
        return password === user.password;
    }
}

class MockDataService {
    constructor() {
        this.learnerAnalyticsService = new LearnerAnalyticsService();
        this.trainerAnalyticsService = new TrainerAnalyticsService();
        this.orgAnalyticsService = new OrgAnalyticsService();
        this.comparisonAnalyticsService = new ComparisonAnalyticsService();
        this.predictiveAnalyticsService = new PredictiveAnalyticsService();
        this.gamificationService = new GamificationService();
        this.systemService = new SystemService();
        this.integrationService = new IntegrationService();
    }
}

class LearnerAnalyticsService {
    getOverview(userId) {
        return {
            userId: userId,
            learningVelocity: this.getVelocity(userId),
            skillGap: this.getSkillGap(userId),
            engagement: this.getEngagement(userId),
            mastery: this.getMastery(userId),
            performance: this.getPerformance(userId),
            contentEffectiveness: this.getContentEffectiveness(userId),
            lastUpdated: new Date().toISOString(),
            status: "active"
        };
    }

    getVelocity(userId) {
        return {
            currentVelocity: 78,          // Updated: Changed from currentPace (0-1) to currentVelocity (0-100)
            momentum: "accelerating",     // Added: Momentum field
            trend: "up",                  // Updated: Simplified trend to "up", "down", "stable"
            timeWindows: {                // Added: Time window data
                "7d": { velocity: 75, momentum: "steady" },
                "30d": { velocity: 78, momentum: "accelerating" },
                "90d": { velocity: 72, momentum: "slowing" }
            },
            velocityHistory: [            // Added: Historical data points
                { velocity: 70, date: "2024-01-01" },
                { velocity: 72, date: "2024-01-08" },
                { velocity: 75, date: "2024-01-15" },
                { velocity: 78, date: "2024-01-22" }
            ],
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false                // Added: Stale indicator
        };
    }

    getSkillGap(userId) {
        return {
            skills: [                     // Updated: Single skills array combining all skill data
                {
                    id: "skill-1",           // Added: id field
                    name: "JavaScript",      // Updated: Changed from skillName
                    category: "Programming", // Added: category field
                    currentLevel: 3,         // Updated: Changed from masteryLevel (0-1) to currentLevel (0-4)
                    targetLevel: 4,          // Added: target level
                    gap: 1,                  // Added: calculated gap
                    priority: 75,            // Added: priority (0-100)
                    isCritical: false,       // Added: critical flag
                    businessImpact: 85,      // Added: business impact score
                    marketDemand: 90,        // Added: market demand score
                    prerequisites: 70,       // Added: prerequisites score
                    careerValue: 85          // Added: career value score
                },
                {
                    id: "skill-2",
                    name: "React",
                    category: "Frontend",
                    currentLevel: 2,
                    targetLevel: 4,
                    gap: 2,
                    priority: 85,
                    isCritical: true,        // True because gap >= 2
                    businessImpact: 90,
                    marketDemand: 85,
                    prerequisites: 75,
                    careerValue: 90
                }
            ],
            categories: ["Programming", "Frontend", "Backend"],  // Added: unique categories array
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false
        };
    }

    getEngagement(userId) {
        return {
            overallEngagement: 78,        // Updated: Renamed from overallScore and changed scale (0-100)
            timeSpent: {                  // Added: Time spent object
                total: 24.5,              // hours
                average: 2.1,             // hours per session
                trend: "increasing"       // "increasing" | "decreasing" | "stable"
            },
            interactionRate: {            // Added: Interaction rate object
                current: 0.65,            // 0-1 scale
                average: 0.60,
                trend: "increasing"
            },
            completionRate: {             // Added: Completion rate object
                current: 0.72,            // 0-1 scale
                average: 0.68,
                trend: "increasing"
            },
            sessionFrequency: {           // Added: Session frequency object
                daily: 0.60,              // 0-1 scale
                weekly: 0.40,
                monthly: 0.80,
                trend: "increasing"
            },
            contentEngagement: {          // Updated: Changed from activityBreakdown
                videos: 0.85,             // 0-1 scale
                quizzes: 0.90,
                readings: 0.72,
                discussions: 0.58
            },
            engagementHistory: [          // Updated: Changed from weeklyEngagement
                { engagement: 70, date: "2024-01-01" },
                { engagement: 72, date: "2024-01-08" },
                { engagement: 75, date: "2024-01-15" },
                { engagement: 78, date: "2024-01-22" }
            ],
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false                // Added: Stale indicator
        };
    }

    getMastery(userId) {
        return {
            overallMastery: 0.72,        // Number (0-1) - already correct
            skillCategories: [           // Updated: Changed from skillMastery
                {
                    id: "category-1",
                    name: "Programming",
                    mastery: 0.75,
                    progress: 0.15,
                    skills: [
                        {
                            id: "skill-1",
                            name: "JavaScript",
                            mastery: 0.85,
                            trend: "increasing"
                        }
                    ]
                }
            ],
            masteryHistory: [            // Added: Historical mastery data
                { mastery: 0.70, date: "2024-01-01" },
                { mastery: 0.71, date: "2024-01-08" },
                { mastery: 0.72, date: "2024-01-15" }
            ],
            milestones: [                // Added: Milestones array
                {
                    id: "milestone-1",
                    name: "Intermediate",
                    threshold: 0.5,
                    achieved: true,
                    date: "2024-01-01"
                }
            ],
            nextMilestone: {             // Updated: Changed from learningPath
                name: "Advanced",
                progress: 0.85,           // How close to milestone
                remaining: 0.15           // How much left
            },
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false
        };
    }

    getPerformance(userId) {
        return {
            overallScore: 0.78,           // Updated: Renamed from overallPerformance
            assessmentResults: [          // Updated: Changed from assessmentScores
                {
                    id: "assessment-1",
                    title: "JavaScript Fundamentals",
                    score: 0.85,
                    correctAnswers: 8,
                    questions: 10,
                    timeSpent: 45,        // minutes
                    difficulty: "intermediate",
                    category: "Programming",
                    completedAt: "2024-01-22T10:00:00Z"
                }
            ],
            performanceHistory: [         // Added: Historical performance data
                { score: 0.75, date: "2024-01-01" },
                { score: 0.77, date: "2024-01-08" },
                { score: 0.78, date: "2024-01-15" }
            ],
            strengths: [                  // Updated: Changed to objects
                {
                    skill: "Problem Solving",
                    score: 0.90,
                    trend: "increasing"
                }
            ],
            weaknesses: [                 // Added: Weaknesses array
                {
                    skill: "Documentation",
                    score: 0.60,
                    trend: "stable"
                }
            ],
            improvementAreas: [           // Added: Improvement areas array
                {
                    area: "Testing",
                    currentScore: 0.65,
                    targetScore: 0.85,
                    priority: "high"      // "high" | "medium" | "low"
                }
            ],
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false
        };
    }

    getContentEffectiveness(userId) {
        return {
            overallEffectiveness: 0.82,   // Updated: Renamed from contentEffectiveness
            contentTypes: [               // Updated: Structure for content type objects
                {
                    id: "content-type-1",
                    name: "Video",
                    effectiveness: 0.85,
                    completionRate: 0.92,
                    engagementScore: 0.90,
                    completedContent: 12,
                    totalContent: 15,
                    averageRating: 4.5,
                    timeSpent: 180,       // minutes
                    lastAccessed: "2024-01-22T10:00:00Z"
                },
                {
                    id: "content-type-2",
                    name: "Interactive",
                    effectiveness: 0.95,
                    completionRate: 0.88,
                    engagementScore: 0.92,
                    completedContent: 8,
                    totalContent: 10,
                    averageRating: 4.8,
                    timeSpent: 150,
                    lastAccessed: "2024-01-22T10:00:00Z"
                }
            ],
            effectivenessHistory: [       // Added: Historical effectiveness data
                { effectiveness: 0.80, date: "2024-01-01" },
                { effectiveness: 0.81, date: "2024-01-08" },
                { effectiveness: 0.82, date: "2024-01-15" }
            ],
            topPerformingContent: [       // Added: Top performing content
                {
                    id: "content-1",
                    title: "JavaScript Basics",
                    type: "video",
                    effectiveness: 0.95,
                    rating: 4.8
                }
            ],
            underperformingContent: [     // Added: Underperforming content
                {
                    id: "content-2",
                    title: "Advanced React",
                    type: "reading",
                    effectiveness: 0.55,
                    rating: 3.2
                }
            ],
            recommendations: [            // Updated: Changed structure
                {
                    type: "Content Quality",
                    priority: "high",
                    suggestion: "Improve video quality for better engagement"
                }
            ],
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false
        };
    }
}

class TrainerAnalyticsService {
    getOverview(trainerId) {
        return {
            trainerId: trainerId,
            coursePerformance: this.getCoursePerformance(trainerId),
            courseHealth: this.getCourseHealth(trainerId),
            studentDistribution: this.getStudentDistribution(trainerId),
            teachingEffectiveness: this.getTeachingEffectiveness(trainerId),
            lastUpdated: new Date().toISOString(),
            status: "active"
        };
    }

    getCoursePerformance(trainerId) {
        return {
            summary: {                     // Added: Summary object
                totalCourses: 5,
                totalEnrollments: 125,
                averageCompletionRate: 78, // 0-100 scale
                averageHealthScore: 82     // 0-100 scale
            },
            courses: [                     // Updated: Changed field names
                {
                    courseId: "course-1",
                    courseName: "Advanced JavaScript",
                    trend: "improving",    // Updated: Changed from performance
                    healthScore: 85,       // Updated: Changed from performance (0-100)
                    enrollments: 45,       // Updated: Changed from studentCount
                    activeStudents: 38,    // Added: Active students
                    completionRate: 84,    // Updated: Changed scale (0-100)
                    averageScore: 78       // Updated: Changed scale (0-100)
                }
            ],
            insights: [                    // Updated: Simplified structure (strings)
                "Course completion rates have improved by 15% this month"
            ],
            recommendations: [             // Added: Recommendations array
                "Consider adding more interactive content"
            ],
            lastUpdated: "2024-01-22T10:00:00Z",
            staleness: "fresh"             // Added: Staleness indicator
        };
    }

    getCourseHealth(trainerId) {
        return {
            courseName: "Advanced JavaScript",
            healthScore: 85,              // Updated: Changed from overallHealth (0-1) to healthScore (0-100)
            overallHealth: "healthy",     // Added: Health status ("healthy" | "at_risk" | "unhealthy")
            metrics: {                     // Added: Metrics object
                enrollments: {
                    total: 45,
                    active: 38
                },
                completion: {
                    rate: 84,             // 0-100 scale
                    target: 80
                },
                satisfaction: {
                    averageRating: 4.5,   // 1-5 scale
                    totalReviews: 32,
                    nps: 75,              // -100 to 100
                    satisfactionScore: 85, // 0-100
                    ratingTrend: "increasing"
                }
            },
            dropOffAnalysis: {            // Added: Drop-off analysis
                overallDropOffRate: 15,   // 0-100
                dropOffPoints: [
                    {
                        moduleName: "Module 3",
                        dropOffRate: 25,
                        studentsDropped: 8,
                        priority: "high",  // "high" | "medium" | "low"
                        likelyReasons: [
                            "Content too complex",
                            "Lack of examples"
                        ],
                        recommendedActions: [
                            "Add more examples",
                            "Break down into smaller sections"
                        ]
                    }
                ]
            },
            contentPerformance: {         // Added: Content performance
                strugglingTopics: [
                    {
                        topic: "Async/Await",
                        averageScore: 65,
                        passRate: 70,
                        averageAttempts: 2.5,
                        studentFeedback: "Too difficult to understand"
                    }
                ],
                highPerformanceTopics: [
                    {
                        topic: "ES6 Features",
                        averageScore: 92,
                        passRate: 95,
                        averageAttempts: 1.2,
                        studentFeedback: "Great examples and explanations"
                    }
                ]
            },
            recommendations: [            // Updated: Changed structure
                {
                    suggestion: "Add more practice exercises",
                    priority: "high",
                    type: "content_improvement",
                    expectedImpact: "15% increase in completion rate"
                }
            ],
            lastUpdated: "2024-01-22T10:00:00Z",
            staleness: "fresh"
        };
    }

    getStudentDistribution(trainerId) {
        return {
            courseName: "Advanced JavaScript",
            totalStudents: 45,
            distribution: {                  // Updated: Changed structure
                excellent: {                 // Score >= 90
                    count: 12,
                    percentage: 27,
                    range: "90-100%"
                },
                good: {                      // Score 75-89
                    count: 18,
                    percentage: 40,
                    range: "75-89%"
                },
                average: {                   // Score 60-74
                    count: 10,
                    percentage: 22,
                    range: "60-74%"
                },
                struggling: {                // Score < 60
                    count: 5,
                    percentage: 11,
                    range: "<60%"
                }
            },
            insights: {                      // Added: Insights object
                averageScore: 78,           // 0-100 scale
                medianScore: 82,
                passRate: 89,               // 0-100 scale
                atRiskStudents: 5,
                topPerformers: 12
            },
            lastUpdated: "2024-01-22T10:00:00Z"
        };
    }

    getTeachingEffectiveness(trainerId) {
        return {
            overallScore: 85,             // Updated: Renamed from overallEffectiveness (0-100)
            metrics: {                     // Updated: Changed structure
                studentSatisfaction: {
                    score: 4.5,           // 1-5 scale
                    totalReviews: 42,
                    trend: "increasing"
                },
                learningOutcomes: {
                    averageScoreImprovement: 15,  // percentage
                    skillAcquisitionRate: 78,     // 0-100
                    completionRate: 84            // 0-100
                },
                engagement: {
                    responseTime: "2 hours",
                    feedbackQuality: 4.8,         // 1-5 scale
                    availabilityScore: 92         // 0-100
                }
            },
            strengths: [                  // Updated: Changed to strings
                "Clear explanations",
                "Responsive to questions"
            ],
            improvementAreas: [           // Updated: Changed to strings
                "More hands-on exercises",
                "Better pacing for complex topics"
            ],
            lastUpdated: "2024-01-22T10:00:00Z"
        };
    }
}

class OrgAnalyticsService {
    getOverview(orgId) {
        return {
            organizationId: orgId,
            learningVelocity: this.getLearningVelocity(orgId),
            strategicAlignment: this.getStrategicAlignment(orgId),
            learningCulture: this.getLearningCulture(orgId),
            orgPerformance: this.getOrgPerformance(orgId),
            lastUpdated: new Date().toISOString(),
            status: "active"
        };
    }

    getLearningVelocity(orgId) {
        return {
            overallVelocity: 0.76,
            departmentBreakdown: [
                {
                    departmentId: "dept-1",
                    departmentName: "Engineering",
                    velocity: 0.82,
                    learnerCount: 45,
                    averageProgress: 0.78
                },
                {
                    departmentId: "dept-2",
                    departmentName: "Marketing",
                    velocity: 0.71,
                    learnerCount: 23,
                    averageProgress: 0.65
                }
            ],
            trends: {
                velocity: "increasing",
                trendPercentage: 12.5,
                timePeriod: "last_3_months"
            },
            benchmarks: {
                industryAverage: 0.68,
                topPerformers: 0.89,
                percentile: 78
            },
            insights: [
                {
                    type: "positive",
                    message: "Engineering department shows 15% above average velocity"
                },
                {
                    type: "opportunity",
                    message: "Marketing department could benefit from additional learning resources"
                }
            ],
            recommendations: [
                {
                    departmentId: "dept-2",
                    departmentName: "Marketing",
                    action: "increase_learning_budget",
                    priority: "medium",
                    estimatedImpact: "10% velocity increase"
                }
            ]
        };
    }

    getStrategicAlignment(orgId) {
        return {
            overallAlignment: 0.84,
            alignmentGrade: "B+",
            staleness: "fresh",
            period: "Q1 2024",
            strategicGoals: [
                {
                    goalId: "goal-1",
                    goalName: "Digital Transformation",
                    alignmentScore: 0.89,
                    progress: 65,
                    skillsCovered: 82,
                    requiredSkills: ["Cloud Computing", "DevOps", "Microservices", "API Design"],
                    employeesOnTrack: 52,
                    totalEmployeesNeeded: 80,
                    status: "on_track",
                    recommendations: [
                        "Increase focus on advanced cloud architecture training",
                        "Extend API design workshops to more teams"
                    ]
                },
                {
                    goalId: "goal-2",
                    goalName: "Leadership Development",
                    alignmentScore: 0.76,
                    progress: 43,
                    skillsCovered: 71,
                    requiredSkills: ["Strategic Thinking", "Change Management", "Team Leadership", "Communication"],
                    employeesOnTrack: 20,
                    totalEmployeesNeeded: 50,
                    status: "at_risk",
                    recommendations: [
                        "Accelerate leadership training programs",
                        "Provide 1-on-1 coaching for high-potential leaders"
                    ]
                }
            ],
            gapAnalysis: {
                criticalGaps: 2,
                mediumGaps: 5,
                lowGaps: 3,
                topMissingSkills: [
                    { skill: "Cloud Architecture", priority: "critical", gap: 40 },
                    { skill: "Change Management", priority: "high", gap: 32 },
                    { skill: "Strategic Thinking", priority: "medium", gap: 24 }
                ]
            },
            recommendations: [
                {
                    type: "skill_development",
                    priority: "high",
                    action: "invest_in_cloud_training",
                    estimatedCost: 25000,
                    expectedROI: 2.3
                }
            ],
            lastUpdated: new Date().toISOString()
        };
    }

    getDepartmentAnalytics(orgId, department) {
        return {
            organizationId: orgId,
            department: department,
            metrics: {
                totalLearners: 45,
                activeLearners: 38,
                completionRate: 0.84,
                averageScore: 0.78,
                engagementScore: 0.82
            },
            trends: {
                learningVelocity: "increasing",
                skillDevelopment: "stable",
                engagement: "improving"
            },
            insights: [
                {
                    type: "success",
                    message: "Department shows strong learning momentum",
                    impact: "high"
                }
            ],
            lastUpdated: new Date().toISOString()
        };
    }

    getLearningCulture(orgId) {
        return {
            overallCultureScore: 0.81,
            cultureGrade: "B+",
            staleness: "fresh",
            period: "Q1 2024",
            metrics: {
                learningEngagement: {
                    score: 82,
                    activeParticipation: 78,
                    voluntaryLearning: 65,
                    peerCollaboration: 71
                },
                knowledgeSharing: {
                    score: 84,
                    mentorshipPrograms: 12,
                    activeMentors: 34,
                    knowledgeBaseSessions: 28
                },
                innovationMetrics: {
                    score: 76,
                    newIdeasSubmitted: 156,
                    ideasImplemented: 48,
                    innovationProjects: 15
                },
                continuousImprovement: {
                    score: 79,
                    feedbackLoops: 8,
                    courseCompletionTrend: "+12%",
                    skillApplicationRate: 73
                }
            },
            culturalIndicators: {
                managerSupport: 85,
                learningTimeAllocation: 72,
                recognitionPrograms: 9,
                careerDevelopmentOpportunities: 12
            },
            benchmarks: {
                industryAverage: 75,
                vsIndustry: "+6%",
                standing: "Above Average"
            },
            recommendations: [
                "Expand mentorship programs to increase knowledge sharing",
                "Increase learning time allocation to improve voluntary learning",
                "Implement more recognition programs to boost engagement"
            ],
            lastUpdated: new Date().toISOString()
        };
    }

    getOrgPerformance(orgId) {
        return {
            overallPerformance: 0.83,
            performanceMetrics: {
                learningROI: 2.4,
                skillDevelopmentRate: 0.78,
                employeeRetention: 0.89,
                productivityImprovement: 0.15,
                innovationIndex: 0.72
            },
            departmentPerformance: [
                {
                    departmentId: "dept-1",
                    departmentName: "Engineering",
                    performance: 0.87,
                    learningROI: 2.8,
                    skillDevelopmentRate: 0.82,
                    retentionRate: 0.92
                },
                {
                    departmentId: "dept-2",
                    departmentName: "Marketing",
                    performance: 0.76,
                    learningROI: 2.1,
                    skillDevelopmentRate: 0.71,
                    retentionRate: 0.85
                }
            ],
            keyPerformanceIndicators: {
                averageTimeToCompetency: 4.2,
                learningCompletionRate: 0.84,
                skillGapReduction: 0.23,
                crossFunctionalMobility: 0.31,
                leadershipPipeline: 0.67
            },
            businessImpact: {
                revenuePerEmployee: 125000,
                costSavings: 45000,
                timeToMarket: -15,
                customerSatisfaction: 0.91,
                employeeSatisfaction: 0.88
            },
            benchmarks: {
                industryAverage: 0.75,
                topPerformers: 0.92,
                percentile: 82
            },
            trends: {
                performance: "increasing",
                roi: "improving",
                retention: "stable"
            },
            recommendations: [
                {
                    type: "investment",
                    priority: "high",
                    action: "increase_engineering_training_budget",
                    estimatedROI: 3.2,
                    expectedImpact: "15% performance improvement"
                }
            ]
        };
    }
}

class ComparisonAnalyticsService {
    getPeerComparison(userId) {
        return {
            userRanking: {
                overall: 23,
                totalPeers: 156,
                percentile: 85
            },
            skillComparisons: [
                {
                    skillId: "skill-1",
                    skillName: "JavaScript",
                    userLevel: 0.85,
                    peerAverage: 0.72,
                    peerMedian: 0.75,
                    ranking: 12,
                    percentile: 88
                }
            ],
            performanceComparisons: [
                {
                    metric: "learning_velocity",
                    userValue: 0.78,
                    peerAverage: 0.65,
                    peerMedian: 0.68,
                    ranking: 18,
                    percentile: 82
                }
            ],
            anonymizedPeerData: [
                {
                    peerGroup: "similar_experience",
                    averageProgress: 0.74,
                    averageEngagement: 0.81,
                    commonStrengths: ["problem-solving", "code-review"],
                    commonChallenges: ["testing", "documentation"]
                }
            ],
            insights: [
                {
                    type: "strength",
                    message: "You're performing 15% above average in JavaScript skills"
                },
                {
                    type: "opportunity",
                    message: "Consider focusing on testing skills to improve overall ranking"
                }
            ],
            recommendations: [
                {
                    skillId: "skill-2",
                    skillName: "Testing",
                    action: "complete_testing_course",
                    priority: "high",
                    expectedImpact: "10% ranking improvement"
                }
            ]
        };
    }

    getSkillDemand(skills, timeframe) {
        return {
            skillDemand: [
                {
                    skillId: "skill-1",
                    skillName: "JavaScript",
                    demandScore: 0.92,
                    trend: "increasing",
                    trendPercentage: 15.3,
                    jobPostings: 1250,
                    averageSalary: 95000,
                    growthRate: 0.12
                },
                {
                    skillId: "skill-2",
                    skillName: "React",
                    demandScore: 0.88,
                    trend: "stable",
                    trendPercentage: 2.1,
                    jobPostings: 890,
                    averageSalary: 98000,
                    growthRate: 0.08
                },
                {
                    skillId: "skill-3",
                    skillName: "Python",
                    demandScore: 0.95,
                    trend: "increasing",
                    trendPercentage: 18.7,
                    jobPostings: 2100,
                    averageSalary: 102000,
                    growthRate: 0.15
                }
            ],
            marketInsights: [
                {
                    insight: "Python skills are in highest demand with 18.7% growth",
                    priority: "high",
                    recommendation: "Consider Python specialization"
                },
                {
                    insight: "JavaScript remains stable with consistent demand",
                    priority: "medium",
                    recommendation: "Maintain current JavaScript skills"
                }
            ],
            industryTrends: {
                technology: "increasing",
                healthcare: "stable",
                finance: "increasing",
                education: "stable"
            },
            geographicDistribution: {
                "North America": 0.45,
                "Europe": 0.32,
                "Asia": 0.18,
                "Other": 0.05
            },
            salaryRanges: {
                "JavaScript": { min: 75000, max: 120000, median: 95000 },
                "React": { min: 80000, max: 130000, median: 98000 },
                "Python": { min: 85000, max: 140000, median: 102000 }
            }
        };
    }
}

class PredictiveAnalyticsService {
    getDropOffRisk(userId) {
        return {
            riskAssessment: {
                overallRisk: 75,
                engagementScore: 45,
                daysSinceLastActivity: 5,
                trend: -10.5
            },
            engagementPatterns: [
                { week: 'Week 1', engagementScore: 85, riskScore: 20, date: '2024-01-01', activity: 'Course Start', duration: '2h' },
                { week: 'Week 2', engagementScore: 78, riskScore: 35, date: '2024-01-08', activity: 'Module 1', duration: '1.5h' },
                { week: 'Week 3', engagementScore: 65, riskScore: 50, date: '2024-01-15', activity: 'Module 2', duration: '1h' },
                { week: 'Week 4', engagementScore: 45, riskScore: 75, date: '2024-01-22', activity: 'Module 3', duration: '30m' },
            ],
            warningSignals: [
                {
                    type: 'Low Engagement',
                    severity: 'High',
                    description: 'Engagement score has dropped significantly',
                    impact: 'High',
                    duration: '2 weeks'
                },
                {
                    type: 'Missed Deadlines',
                    severity: 'Medium',
                    description: 'Multiple assignment deadlines missed',
                    impact: 'Medium',
                    duration: '1 week'
                }
            ],
            interventionRecommendations: [
                {
                    type: 'Personal Outreach',
                    priority: 'High',
                    description: 'Schedule one-on-one session to understand challenges',
                    action: 'Schedule Meeting',
                    timeline: 'Within 24 hours'
                },
                {
                    type: 'Content Adjustment',
                    priority: 'Medium',
                    description: 'Provide additional resources and alternative learning paths',
                    action: 'Send Resources',
                    timeline: 'Within 48 hours'
                }
            ],
            metadata: {
                lastUpdated: new Date().toISOString(),
                dataSource: 'dropoff-risk',
                sampleSize: 100,
            }
        };
    }

    getForecast(userId) {
        return {
            currentPerformance: {
                overallScore: 78,
                lastUpdated: new Date().toISOString()
            },
            forecastProjections: [
                { 
                    period: 'Week 1', 
                    historicalScore: 75, 
                    forecastedScore: 80, 
                    confidenceLow: 76, 
                    confidenceHigh: 84, 
                    probability: 'High',
                    recommendation: 'Continue'
                },
                { 
                    period: 'Week 2', 
                    historicalScore: 78, 
                    forecastedScore: 82, 
                    confidenceLow: 78, 
                    confidenceHigh: 86, 
                    probability: 'Medium',
                    recommendation: 'Improve'
                },
                { 
                    period: 'Week 3', 
                    historicalScore: 80, 
                    forecastedScore: 85, 
                    confidenceLow: 80, 
                    confidenceHigh: 90, 
                    probability: 'High',
                    recommendation: 'Continue'
                },
                { 
                    period: 'Week 4', 
                    historicalScore: 82, 
                    forecastedScore: 88, 
                    confidenceLow: 82, 
                    confidenceHigh: 94, 
                    probability: 'Low',
                    recommendation: 'Monitor'
                }
            ],
            trendAnalysis: {
                overallTrend: 8.5,
                velocity: 2.3,
                acceleration: 0.5,
                volatility: 3.2,
                stability: 0.85,
                seasonality: 'Upward',
                peakPeriod: 'Week 4'
            },
            confidenceMetrics: {
                overallConfidence: 87,
                forecastAccuracy: 92,
                dataQuality: 95,
                modelAccuracy: 89,
                predictionReliability: 85
            },
            metadata: {
                lastUpdated: new Date().toISOString(),
                dataSource: 'performance-forecast',
                modelVersion: 'v2.1',
            }
        };
    }

    getRecommendations(userId) {
        return {
            summary: {
                totalRecommendations: 12,
                highPriorityCount: 3,
                completedCount: 8,
                completionRate: 67,
                successRate: 85,
                progressTracking: {
                    thisWeek: 75,
                    thisMonth: 68,
                    overall: 72
                }
            },
            recommendations: [
                {
                    id: 'rec-1',
                    title: 'Complete Advanced JavaScript Course',
                    description: 'Based on your current skill level, completing this course will significantly improve your JavaScript proficiency.',
                    category: 'Learning',
                    priority: 'High',
                    confidence: 92,
                    expectedImpact: 'High',
                    timeToComplete: '2-3 weeks',
                    difficulty: 'Medium',
                    resources: [
                        { title: 'JavaScript Advanced Concepts', url: 'https://example.com/js-advanced' },
                        { title: 'Practice Exercises', url: 'https://example.com/js-practice' }
                    ]
                },
                {
                    id: 'rec-2',
                    title: 'Join Study Group',
                    description: 'Collaborative learning has shown to improve retention and understanding.',
                    category: 'Social',
                    priority: 'Medium',
                    confidence: 78,
                    expectedImpact: 'Medium',
                    timeToComplete: '1 week',
                    difficulty: 'Easy',
                    resources: []
                },
                {
                    id: 'rec-3',
                    title: 'Practice Algorithm Problems',
                    description: 'Regular practice with algorithmic thinking will enhance your problem-solving skills.',
                    category: 'Practice',
                    priority: 'High',
                    confidence: 89,
                    expectedImpact: 'High',
                    timeToComplete: 'Ongoing',
                    difficulty: 'Hard',
                    resources: [
                        { title: 'LeetCode Problems', url: 'https://leetcode.com' }
                    ]
                }
            ],
            categories: [
                { name: 'Learning', count: 5 },
                { name: 'Practice', count: 4 },
                { name: 'Social', count: 2 },
                { name: 'Assessment', count: 1 }
            ],
            insights: [
                {
                    title: 'Learning Pattern Analysis',
                    description: 'You perform best with hands-on learning activities in the morning.',
                    type: 'Pattern',
                    confidence: 87,
                    impact: 'High'
                },
                {
                    title: 'Skill Gap Identification',
                    description: 'Focus on data structures and algorithms to improve overall performance.',
                    type: 'Gap',
                    confidence: 94,
                    impact: 'Critical'
                }
            ],
            metadata: {
                lastUpdated: new Date().toISOString(),
                dataSource: 'recommendations',
                modelVersion: 'v3.2',
            }
        };
    }
}

class GamificationService {
    getStats(userId) {
        return {
            totalPoints: 2450,
            level: 8,
            levelProgress: 0.65,
            nextLevelPoints: 500,
            badges: [
                {
                    id: "badge-1",
                    name: "JavaScript Master",
                    description: "Completed 5 JavaScript courses",
                    earnedAt: "2025-10-20T00:00:00Z",
                    rarity: "rare"
                },
                {
                    id: "badge-2",
                    name: "Streak Keeper",
                    description: "7-day learning streak",
                    earnedAt: "2025-10-24T00:00:00Z",
                    rarity: "common"
                }
            ],
            achievements: [
                {
                    id: "achievement-1",
                    name: "Course Completer",
                    progress: 0.8,
                    target: 10,
                    current: 8,
                    description: "Complete 10 courses"
                }
            ],
            streaks: {
                current: 7,
                longest: 15,
                average: 4.2
            },
            leaderboard: {
                rank: 23,
                totalUsers: 156,
                percentile: 85
            },
            recentActivity: [
                {
                    type: "course_completed",
                    points: 150,
                    description: "Completed React Fundamentals",
                    timestamp: "2025-10-24T00:00:00Z"
                },
                {
                    type: "streak_milestone",
                    points: 50,
                    description: "7-day streak achieved",
                    timestamp: "2025-10-24T00:00:00Z"
                }
            ]
        };
    }

    getAchievements(userId) {
        return {
            earnedAchievements: [
                {
                    id: "achievement-1",
                    name: "JavaScript Master",
                    description: "Completed 5 JavaScript courses",
                    earnedAt: "2025-10-20T00:00:00Z",
                    rarity: "rare",
                    points: 500,
                    category: "skill_mastery"
                },
                {
                    id: "achievement-2",
                    name: "Streak Keeper",
                    description: "7-day learning streak",
                    earnedAt: "2025-10-24T00:00:00Z",
                    rarity: "common",
                    points: 100,
                    category: "consistency"
                }
            ],
            availableAchievements: [
                {
                    id: "achievement-3",
                    name: "React Expert",
                    description: "Complete 3 React courses",
                    progress: 0.67,
                    target: 3,
                    current: 2,
                    rarity: "rare",
                    points: 750,
                    category: "skill_mastery",
                    estimatedTime: "2 weeks"
                },
                {
                    id: "achievement-4",
                    name: "Perfect Week",
                    description: "Complete 7 days of learning",
                    progress: 0.86,
                    target: 7,
                    current: 6,
                    rarity: "common",
                    points: 200,
                    category: "consistency",
                    estimatedTime: "1 day"
                }
            ],
            categories: {
                skill_mastery: { earned: 2, available: 8, total: 10 },
                consistency: { earned: 1, available: 5, total: 6 },
                collaboration: { earned: 0, available: 3, total: 3 },
                innovation: { earned: 0, available: 2, total: 2 }
            },
            statistics: {
                totalEarned: 3,
                totalAvailable: 18,
                completionRate: 0.17,
                averageRarity: "uncommon"
            }
        };
    }

    getLeaderboard(timeframe, limit, category) {
        return {
            leaderboard: [
                {
                    rank: 1,
                    userId: "user-1",
                    displayName: "Alex Johnson",
                    points: 4850,
                    level: 12,
                    avatar: "https://example.com/avatar1.jpg",
                    badges: 8,
                    streak: 23
                },
                {
                    rank: 2,
                    userId: "user-2",
                    displayName: "Sarah Chen",
                    points: 4620,
                    level: 11,
                    avatar: "https://example.com/avatar2.jpg",
                    badges: 7,
                    streak: 18
                }
            ],
            userRanking: {
                rank: 23,
                points: 2450,
                level: 8,
                badges: 3,
                streak: 7
            },
            statistics: {
                totalParticipants: 156,
                averagePoints: 1850,
                topPercentile: 0.15
            },
            timeframe: timeframe || "month",
            lastUpdated: new Date().toISOString()
        };
    }

    getStreak(userId) {
        return {
            currentStreak: 7,
            longestStreak: 15,
            averageStreak: 4.2,
            streakHistory: [
                {
                    startDate: "2025-10-18T00:00:00Z",
                    endDate: "2025-10-25T00:00:00Z",
                    length: 7,
                    status: "active"
                },
                {
                    startDate: "2025-10-01T00:00:00Z",
                    endDate: "2025-10-15T00:00:00Z",
                    length: 15,
                    status: "completed"
                }
            ],
            milestones: [
                {
                    milestone: 7,
                    achieved: true,
                    achievedAt: "2025-10-24T00:00:00Z",
                    points: 50
                },
                {
                    milestone: 14,
                    achieved: false,
                    progress: 0.5,
                    estimatedAchievement: "2025-10-31T00:00:00Z",
                    points: 150
                },
                {
                    milestone: 30,
                    achieved: false,
                    progress: 0.23,
                    estimatedAchievement: "2025-11-16T00:00:00Z",
                    points: 500
                }
            ],
            streakGoals: [
                {
                    goal: "maintain_weekly_streak",
                    target: 7,
                    current: 7,
                    progress: 1.0,
                    status: "achieved"
                },
                {
                    goal: "monthly_consistency",
                    target: 20,
                    current: 7,
                    progress: 0.35,
                    status: "in_progress"
                }
            ],
            insights: [
                {
                    insight: "You're on track for your longest streak this month",
                    type: "positive"
                },
                {
                    insight: "Weekends are your strongest learning days",
                    type: "pattern"
                }
            ],
            recommendations: [
                {
                    action: "set_daily_reminder",
                    priority: "medium",
                    expectedImpact: "15% streak consistency improvement"
                }
            ]
        };
    }
}

class SystemService {
    getHealthStatus() {
        return {
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: 86400,
            environment: "production",
            version: "1.0.0",
            services: {
                database: "healthy",
                cache: "healthy",
                queue: "healthy",
                external_apis: "healthy"
            }
        };
    }

    getServiceStatus() {
        return {
            service: "MS8 Learning Analytics Backend",
            status: "operational",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            uptime: 86400,
            environment: "production",
            services: {
                auth: "operational",
                analytics: "operational",
                gamification: "operational",
                reports: "operational",
                integration: "operational"
            },
            metrics: {
                requestsPerMinute: 45,
                averageResponseTime: 250,
                errorRate: 0.02,
                activeUsers: 156
            }
        };
    }

    triggerManualRefresh(userId, role, analytics) {
        return {
            jobId: `job-${Date.now()}`,
            estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000).toISOString()
        };
    }
}

class IntegrationService {
    getIntegrationHealth() {
        return {
            status: "healthy",
            timestamp: new Date().toISOString(),
            services: {
                "MS12 (Auth)": { status: "healthy", responseTime: 45 },
                "Directory MS": { status: "healthy", responseTime: 67 },
                "Course Builder MS": { status: "healthy", responseTime: 89 },
                "Content Studio MS": { status: "healthy", responseTime: 56 },
                "Assessment MS": { status: "healthy", responseTime: 78 },
                "Skills Engine MS": { status: "healthy", responseTime: 92 },
                "Learner AI MS": { status: "healthy", responseTime: 123 },
                "DevLab MS": { status: "healthy", responseTime: 87 },
                "RAG Assistant MS": { status: "healthy", responseTime: 134 }
            },
            circuitBreakers: {
                "MS12 (Auth)": { isOpen: false, failureCount: 0 },
                "Directory MS": { isOpen: false, failureCount: 0 },
                "Course Builder MS": { isOpen: false, failureCount: 0 },
                "Content Studio MS": { isOpen: false, failureCount: 0 },
                "Assessment MS": { isOpen: false, failureCount: 0 },
                "Skills Engine MS": { isOpen: false, failureCount: 0 },
                "Learner AI MS": { isOpen: false, failureCount: 0 },
                "DevLab MS": { isOpen: false, failureCount: 0 },
                "RAG Assistant MS": { isOpen: false, failureCount: 0 }
            }
        };
    }

    getServiceStatus(serviceName) {
        const serviceMap = {
            'directory': 'Directory MS',
            'course-builder': 'Course Builder MS',
            'content-studio': 'Content Studio MS',
            'assessment': 'Assessment MS',
            'skills-engine': 'Skills Engine MS',
            'learner-ai': 'Learner AI MS',
            'devlab': 'DevLab MS',
            'rag-assistant': 'RAG Assistant MS'
        };

        return {
            service: serviceMap[serviceName],
            status: "healthy",
            responseTime: Math.floor(Math.random() * 100) + 50,
            circuitBreaker: {
                isOpen: false,
                failureCount: 0,
                lastFailure: null,
                nextAttempt: null
            },
            endpoints: {
                "GET /api/v1/users/:userId": { status: "healthy", avgResponseTime: 45 },
                "GET /api/v1/organizations/:orgId": { status: "healthy", avgResponseTime: 67 },
                "GET /api/v1/kpis/:orgId": { status: "healthy", avgResponseTime: 89 }
            },
            mockDataAvailable: true,
            lastHealthCheck: new Date().toISOString()
        };
    }

    testService(serviceName, testType, endpoint, timeout) {
        // Simulate test results
        const success = Math.random() > 0.1; // 90% success rate
        
        if (success) {
            return {
                success: true,
                responseTime: Math.floor(Math.random() * 200) + 50,
                details: {
                    statusCode: 200,
                    responseSize: 1024,
                    headers: {
                        "Content-Type": "application/json",
                        "X-Response-Time": "67ms"
                    }
                }
            };
        } else {
            return {
                success: false,
                details: {
                    error: "Connection timeout",
                    timeout: timeout || 5000,
                    lastKnownStatus: "unhealthy"
                },
                fallback: {
                    available: true,
                    mockDataUsed: true,
                    message: "Using mock data fallback"
                }
            };
        }
    }

    getMockData(serviceName, endpoint, userId) {
        const mockDataMap = {
            'directory': {
                data: {
                    userId: userId || "test-user-123",
                    fullName: "John Doe",
                    email: "john.doe@example.com",
                    organizationId: "org-456",
                    roles: ["learner", "trainer"],
                    department: "Engineering",
                    kpis: {
                        learningVelocity: 0.75,
                        skillGaps: 3,
                        engagementScore: 0.82
                    },
                    valuePropositions: [
                        "Technical Excellence",
                        "Continuous Learning",
                        "Innovation"
                    ],
                    loginLogs: [
                        {
                            timestamp: "2025-10-25T09:00:00Z",
                            ipAddress: "192.168.1.100",
                            userAgent: "Mozilla/5.0...",
                            sessionDuration: 3600
                        }
                    ]
                },
                metadata: {
                    generatedAt: new Date().toISOString(),
                    dataVersion: "1.0.0",
                    coverage: "100%",
                    lastUpdated: new Date().toISOString()
                }
            }
        };

        return mockDataMap[serviceName] || null;
    }

    resetCircuitBreaker(serviceName) {
        return {
            circuitBreaker: {
                isOpen: false,
                failureCount: 0,
                lastFailure: null,
                nextAttempt: null,
                resetAt: new Date().toISOString()
            }
        };
    }

    getMetrics(timeframe, service) {
        return {
            services: {
                "Directory MS": {
                    totalRequests: 1250,
                    successfulRequests: 1180,
                    failedRequests: 70,
                    successRate: 0.944,
                    averageResponseTime: 67,
                    p95ResponseTime: 145,
                    p99ResponseTime: 234,
                    circuitBreakerTrips: 2,
                    mockDataFallbacks: 15,
                    endpoints: {
                        "GET /api/v1/users/:userId": {
                            totalRequests: 450,
                            successfulRequests: 425,
                            failedRequests: 25,
                            averageResponseTime: 45
                        },
                        "GET /api/v1/organizations/:orgId": {
                            totalRequests: 300,
                            successfulRequests: 290,
                            failedRequests: 10,
                            averageResponseTime: 67
                        },
                        "GET /api/v1/kpis/:orgId": {
                            totalRequests: 500,
                            successfulRequests: 465,
                            failedRequests: 35,
                            averageResponseTime: 89
                        }
                    }
                },
                "Course Builder MS": {
                    totalRequests: 2100,
                    successfulRequests: 1980,
                    failedRequests: 120,
                    successRate: 0.943,
                    averageResponseTime: 89,
                    p95ResponseTime: 167,
                    p99ResponseTime: 289,
                    circuitBreakerTrips: 1,
                    mockDataFallbacks: 8
                }
            },
            summary: {
                totalRequests: 15750,
                totalSuccessfulRequests: 14820,
                totalFailedRequests: 930,
                overallSuccessRate: 0.941,
                averageResponseTime: 78,
                totalCircuitBreakerTrips: 12,
                totalMockDataFallbacks: 45
            }
        };
    }
}

module.exports = {
    MockDataService,
    userService: new UserService(),
    learnerAnalyticsService: new LearnerAnalyticsService(),
    trainerAnalyticsService: new TrainerAnalyticsService(),
    orgAnalyticsService: new OrgAnalyticsService(),
    comparisonAnalyticsService: new ComparisonAnalyticsService(),
    predictiveAnalyticsService: new PredictiveAnalyticsService(),
    gamificationService: new GamificationService(),
    systemService: new SystemService(),
    integrationService: new IntegrationService()
};