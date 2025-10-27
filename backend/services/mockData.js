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
    // Helper method to generate user-specific seed based on userId
    getUserSeed(userId) {
        if (!userId) return 0;
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = ((hash << 5) - hash) + userId.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Helper method to get user-specific value within range
    getUserValue(userId, min, max) {
        const seed = this.getUserSeed(userId);
        const range = max - min;
        return min + (seed % range);
    }

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
        // Generate user-specific velocity between 60-95
        const baseVelocity = this.getUserValue(userId, 60, 95);
        const momentumType = this.getUserValue(userId, 0, 3); // 0=steady, 1=accelerating, 2=slowing
        const momentumTypes = ["steady", "accelerating", "slowing"];
        const momentum = momentumTypes[momentumType];
        
        // Generate historical data with some variation
        const seed = this.getUserSeed(userId);
        const historyVariation = seed % 15;
        const base = baseVelocity - 10;
        
        return {
            currentVelocity: baseVelocity,
            momentum: momentum,
            trend: momentum === "accelerating" ? "up" : (momentum === "slowing" ? "down" : "stable"),
            timeWindows: {
                "7d": { velocity: baseVelocity - 3, momentum: "steady" },
                "30d": { velocity: baseVelocity, momentum: momentum },
                "90d": { velocity: baseVelocity + 5, momentum: "steady" }
            },
            velocityHistory: [
                { velocity: base, date: "2024-01-01" },
                { velocity: base + historyVariation, date: "2024-01-08" },
                { velocity: base + historyVariation * 2, date: "2024-01-15" },
                { velocity: baseVelocity, date: "2024-01-22" }
            ],
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false
        };
    }

    getSkillGap(userId) {
        const seed = this.getUserSeed(userId);
        const skill1Current = this.getUserValue(userId, 2, 4);
        const skill1Target = 4;
        const skill1Gap = skill1Target - skill1Current;
        const skill1Priority = this.getUserValue(userId, 70, 90);
        
        const skill2Current = this.getUserValue(userId, 1, 3);
        const skill2Target = 4;
        const skill2Gap = skill2Target - skill2Current;
        const skill2Priority = this.getUserValue(userId, 75, 95);
        
        return {
            skills: [
                {
                    id: "skill-1",
                    name: "JavaScript",
                    category: "Programming",
                    currentLevel: skill1Current,
                    targetLevel: skill1Target,
                    gap: skill1Gap,
                    priority: skill1Priority,
                    isCritical: skill1Gap >= 2,
                    businessImpact: this.getUserValue(userId, 80, 95),
                    marketDemand: this.getUserValue(userId, 85, 100),
                    prerequisites: this.getUserValue(userId, 65, 85),
                    careerValue: this.getUserValue(userId, 80, 95)
                },
                {
                    id: "skill-2",
                    name: "React",
                    category: "Frontend",
                    currentLevel: skill2Current,
                    targetLevel: skill2Target,
                    gap: skill2Gap,
                    priority: skill2Priority,
                    isCritical: skill2Gap >= 2,
                    businessImpact: this.getUserValue(userId, 85, 95),
                    marketDemand: this.getUserValue(userId, 80, 95),
                    prerequisites: this.getUserValue(userId, 70, 85),
                    careerValue: this.getUserValue(userId, 85, 100)
                }
            ],
            categories: ["Programming", "Frontend", "Backend"],
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false
        };
    }

    getEngagement(userId) {
        const overallEng = this.getUserValue(userId, 60, 90);
        const timeTotal = this.getUserValue(userId, 15, 35);
        const timeAvg = timeTotal / 12;
        const interactionCurr = (this.getUserValue(userId, 55, 75)) / 100;
        const interactionAvg = interactionCurr - 0.05;
        const completionCurr = (this.getUserValue(userId, 65, 85)) / 100;
        const completionAvg = completionCurr - 0.04;
        
        return {
            overallEngagement: overallEng,
            timeSpent: {
                total: timeTotal,
                average: timeAvg,
                trend: "increasing"
            },
            interactionRate: {
                current: interactionCurr,
                average: interactionAvg,
                trend: "increasing"
            },
            completionRate: {
                current: completionCurr,
                average: completionAvg,
                trend: "increasing"
            },
            sessionFrequency: {
                daily: this.getUserValue(userId, 50, 70) / 100,
                weekly: this.getUserValue(userId, 30, 50) / 100,
                monthly: this.getUserValue(userId, 70, 90) / 100,
                trend: "increasing"
            },
            contentEngagement: {
                videos: this.getUserValue(userId, 75, 95) / 100,
                quizzes: this.getUserValue(userId, 80, 100) / 100,
                readings: this.getUserValue(userId, 60, 80) / 100,
                discussions: this.getUserValue(userId, 45, 65) / 100
            },
            engagementHistory: [
                { engagement: overallEng - 8, date: "2024-01-01" },
                { engagement: overallEng - 6, date: "2024-01-08" },
                { engagement: overallEng - 3, date: "2024-01-15" },
                { engagement: overallEng, date: "2024-01-22" }
            ],
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false                // Added: Stale indicator
        };
    }

    getMastery(userId) {
        const overallMastery = this.getUserValue(userId, 65, 85) / 100;
        const catMastery = overallMastery + 0.03;
        const skillMastery = catMastery + 0.10;
        const nextProgress = this.getUserValue(userId, 75, 95) / 100;
        
        return {
            overallMastery: overallMastery,
            skillCategories: [
                {
                    id: "category-1",
                    name: "Programming",
                    mastery: catMastery,
                    progress: 0.15,
                    skills: [
                        {
                            id: "skill-1",
                            name: "JavaScript",
                            mastery: skillMastery,
                            trend: "increasing"
                        }
                    ]
                }
            ],
            masteryHistory: [
                { mastery: overallMastery - 0.02, date: "2024-01-01" },
                { mastery: overallMastery - 0.01, date: "2024-01-08" },
                { mastery: overallMastery, date: "2024-01-15" }
            ],
            milestones: [
                {
                    id: "milestone-1",
                    name: "Intermediate",
                    threshold: 0.5,
                    achieved: true,
                    date: "2024-01-01"
                }
            ],
            nextMilestone: {
                name: "Advanced",
                progress: nextProgress,
                remaining: 1 - nextProgress
            },
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false
        };
    }

    getPerformance(userId) {
        const overallScore = this.getUserValue(userId, 70, 90) / 100;
        const assessmentScore = overallScore + 0.07;
        
        return {
            overallScore: overallScore,
            assessmentResults: [
                {
                    id: "assessment-1",
                    title: "JavaScript Fundamentals",
                    score: assessmentScore,
                    correctAnswers: Math.round(assessmentScore * 10),
                    questions: 10,
                    timeSpent: this.getUserValue(userId, 35, 55),
                    difficulty: "intermediate",
                    category: "Programming",
                    completedAt: "2024-01-22T10:00:00Z"
                }
            ],
            performanceHistory: [
                { score: overallScore - 0.03, date: "2024-01-01" },
                { score: overallScore - 0.01, date: "2024-01-08" },
                { score: overallScore, date: "2024-01-15" }
            ],
            strengths: [
                {
                    skill: "Problem Solving",
                    score: overallScore + 0.12,
                    trend: "increasing"
                }
            ],
            weaknesses: [
                {
                    skill: "Documentation",
                    score: overallScore - 0.15,
                    trend: "stable"
                }
            ],
            improvementAreas: [
                {
                    area: "Testing",
                    currentScore: overallScore - 0.13,
                    targetScore: 0.85,
                    priority: "high"
                }
            ],
            lastUpdated: "2024-01-22T10:00:00Z",
            isStale: false
        };
    }

    getContentEffectiveness(userId) {
        const overallEff = this.getUserValue(userId, 75, 95) / 100;
        const videoEff = overallEff + 0.03;
        const videoComp = overallEff + 0.10;
        
        return {
            overallEffectiveness: overallEff,
            contentTypes: [
                {
                    id: "content-type-1",
                    name: "Video",
                    effectiveness: videoEff,
                    completionRate: videoComp,
                    engagementScore: videoEff + 0.05,
                    completedContent: this.getUserValue(userId, 10, 15),
                    totalContent: 15,
                    averageRating: (videoEff * 5).toFixed(1),
                    timeSpent: this.getUserValue(userId, 150, 210),
                    lastAccessed: "2024-01-22T10:00:00Z"
                },
                {
                    id: "content-type-2",
                    name: "Interactive",
                    effectiveness: overallEff + 0.13,
                    completionRate: overallEff + 0.06,
                    engagementScore: overallEff + 0.10,
                    completedContent: this.getUserValue(userId, 6, 10),
                    totalContent: 10,
                    averageRating: ((overallEff + 0.13) * 5).toFixed(1),
                    timeSpent: this.getUserValue(userId, 120, 180),
                    lastAccessed: "2024-01-22T10:00:00Z"
                }
            ],
            effectivenessHistory: [
                { effectiveness: overallEff - 0.02, date: "2024-01-01" },
                { effectiveness: overallEff - 0.01, date: "2024-01-08" },
                { effectiveness: overallEff, date: "2024-01-15" }
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
    // Helper method to generate user-specific seed based on trainerId
    getUserSeed(trainerId) {
        if (!trainerId) return 0;
        let hash = 0;
        for (let i = 0; i < trainerId.length; i++) {
            hash = ((hash << 5) - hash) + trainerId.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Helper method to get user-specific value within range
    getUserValue(trainerId, min, max) {
        const seed = this.getUserSeed(trainerId);
        const range = max - min;
        return min + (seed % range);
    }

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
    // Helper method to generate user-specific seed based on orgId
    getUserSeed(orgId) {
        if (!orgId) return 0;
        let hash = 0;
        for (let i = 0; i < orgId.length; i++) {
            hash = ((hash << 5) - hash) + orgId.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Helper method to get user-specific value within range
    getUserValue(orgId, min, max) {
        const seed = this.getUserSeed(orgId);
        const range = max - min;
        return min + (seed % range);
    }

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
            staleness: "fresh",
            period: "Q1 2024",
            overview: {
                totalEmployees: 1247,
                participationRate: 78,
                skillsAcquiredThisQuarter: 2847,
                activelyLearning: 972,
                certificationsEarned: 156
            },
            roiMetrics: {
                roi: 285,
                costPerSkillAcquired: 125.50,
                trainingInvestment: 356750,
                productivityGains: 1423000,
                calculationMethod: "Baseline comparison with prior quarter",
                averageTimeToSkill: "6.5 weeks"
            },
            departmentBreakdown: [
                {
                    departmentId: "dept-1",
                    departmentName: "Engineering",
                    totalEmployees: 420,
                    participationRate: 92,
                    completionRate: 85,
                    skillsAcquired: 1420,
                    trend: "+15% increase"
                },
                {
                    departmentId: "dept-2",
                    departmentName: "Marketing",
                    totalEmployees: 190,
                    participationRate: 75,
                    completionRate: 68,
                    skillsAcquired: 450,
                    trend: "+8% increase"
                },
                {
                    departmentId: "dept-3",
                    departmentName: "Sales",
                    totalEmployees: 320,
                    participationRate: 88,
                    completionRate: 82,
                    skillsAcquired: 987,
                    trend: "+12% increase"
                }
            ],
            trends: {
                quarterOverQuarter: "+15.2%",
                yearOverYear: "+28.5%",
                peakLearningMonth: "January 2024"
            },
            lastUpdated: new Date().toISOString()
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
    // Helper method to generate user-specific seed based on userId
    getUserSeed(userId) {
        if (!userId) return 0;
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = ((hash << 5) - hash) + userId.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Helper method to get user-specific value within range
    getUserValue(userId, min, max) {
        const seed = this.getUserSeed(userId);
        const range = max - min;
        return min + (seed % range);
    }

    getPeerComparison(userId) {
        const overallRank = this.getUserValue(userId, 10, 50);
        const totalPeers = this.getUserValue(userId, 120, 200);
        const percentile = this.getUserValue(userId, 70, 95);
        const skillRank = this.getUserValue(userId, 5, 25);
        const skillPercentile = this.getUserValue(userId, 75, 95);
        const userSkillLevel = this.getUserValue(userId, 70, 95) / 100;
        const peerAvg = userSkillLevel - 0.13;
        const peerMedian = userSkillLevel - 0.10;
        const velocityRank = this.getUserValue(userId, 10, 30);
        const velocityPercentile = this.getUserValue(userId, 70, 90);
        const userVelocity = this.getUserValue(userId, 60, 85) / 100;
        const peerVelAvg = userVelocity - 0.12;
        const peerVelMedian = userVelocity - 0.09;
        
        return {
            userRanking: {
                overall: overallRank,
                totalPeers: totalPeers,
                percentile: percentile
            },
            skillComparisons: [
                {
                    skillId: "skill-1",
                    skillName: "JavaScript",
                    userLevel: userSkillLevel,
                    peerAverage: peerAvg,
                    peerMedian: peerMedian,
                    ranking: skillRank,
                    percentile: skillPercentile
                }
            ],
            performanceComparisons: [
                {
                    metric: "learning_velocity",
                    userValue: userVelocity,
                    peerAverage: peerVelAvg,
                    peerMedian: peerVelMedian,
                    ranking: velocityRank,
                    percentile: velocityPercentile
                }
            ],
            anonymizedPeerData: [
                {
                    peerGroup: "similar_experience",
                    averageProgress: userSkillLevel - 0.06,
                    averageEngagement: userVelocity + 0.03,
                    commonStrengths: ["problem-solving", "code-review"],
                    commonChallenges: ["testing", "documentation"]
                }
            ],
            insights: [
                {
                    type: "strength",
                    message: `You're performing ${Math.round((userSkillLevel - peerAvg) * 100)}% above average in JavaScript skills`
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

    getSkillDemand(skills, timeframe, userId) {
        // Generate user-specific seed if userId provided
        const seed = userId ? this.getUserSeed(userId) : 0;
        const getUserValue = (min, max) => {
            const range = max - min;
            return min + (seed % range);
        };

        // Generate user-specific demand scores
        const jsDemand = getUserValue(85, 100) / 100;
        const jsTrend = getUserValue(0, 3); // 0-2 for different trends
        const trends = ["increasing", "stable", "decreasing"];
        const jsTrendPercent = jsTrend === 0 ? getUserValue(10, 20) : (jsTrend === 1 ? getUserValue(1, 5) : -getUserValue(1, 5));
        
        const reactDemand = getUserValue(80, 95) / 100;
        const reactTrend = getUserValue(0, 3);
        const reactTrendPercent = reactTrend === 0 ? getUserValue(5, 12) : (reactTrend === 1 ? getUserValue(0, 3) : -getUserValue(0, 3));
        
        const pythonDemand = getUserValue(88, 100) / 100;
        const pythonTrend = getUserValue(0, 3);
        const pythonTrendPercent = pythonTrend === 0 ? getUserValue(15, 25) : (pythonTrend === 1 ? getUserValue(0, 2) : -getUserValue(0, 2));

        return {
            skillDemand: [
                {
                    skillId: "skill-1",
                    skillName: "JavaScript",
                    demandScore: jsDemand,
                    trend: trends[jsTrend],
                    trendPercentage: jsTrendPercent,
                    jobPostings: getUserValue(1000, 1500),
                    averageSalary: getUserValue(90000, 110000),
                    growthRate: jsDemand * 0.15
                },
                {
                    skillId: "skill-2",
                    skillName: "React",
                    demandScore: reactDemand,
                    trend: trends[reactTrend],
                    trendPercentage: reactTrendPercent,
                    jobPostings: getUserValue(700, 1100),
                    averageSalary: getUserValue(95000, 105000),
                    growthRate: reactDemand * 0.12
                },
                {
                    skillId: "skill-3",
                    skillName: "Python",
                    demandScore: pythonDemand,
                    trend: trends[pythonTrend],
                    trendPercentage: pythonTrendPercent,
                    jobPostings: getUserValue(1800, 2500),
                    averageSalary: getUserValue(95000, 115000),
                    growthRate: pythonDemand * 0.18
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
    // Helper method to generate user-specific seed based on userId
    getUserSeed(userId) {
        if (!userId) return 0;
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = ((hash << 5) - hash) + userId.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Helper method to get user-specific value within range
    getUserValue(userId, min, max) {
        const seed = this.getUserSeed(userId);
        const range = max - min;
        return min + (seed % range);
    }

    getDropOffRisk(userId) {
        const overallRisk = this.getUserValue(userId, 20, 85);
        const engScore = this.getUserValue(userId, 40, 90);
        const daysSince = this.getUserValue(userId, 1, 10);
        const riskTrend = this.getUserValue(userId, -15, 10);
        
        // Generate engagement patterns
        const week1Eng = this.getUserValue(userId, 70, 95);
        const week1Risk = 100 - week1Eng;
        const week2Eng = week1Eng - this.getUserValue(userId, 5, 15);
        const week2Risk = 100 - week2Eng;
        const week3Eng = week2Eng - this.getUserValue(userId, 5, 15);
        const week3Risk = 100 - week3Eng;
        const week4Eng = week3Eng - this.getUserValue(userId, 5, 20);
        const week4Risk = 100 - week4Eng;
        
        return {
            riskAssessment: {
                overallRisk: overallRisk,
                engagementScore: engScore,
                daysSinceLastActivity: daysSince,
                trend: riskTrend
            },
            engagementPatterns: [
                { week: 'Week 1', engagementScore: week1Eng, riskScore: week1Risk, date: '2024-01-01', activity: 'Course Start', duration: '2h' },
                { week: 'Week 2', engagementScore: week2Eng, riskScore: week2Risk, date: '2024-01-08', activity: 'Module 1', duration: '1.5h' },
                { week: 'Week 3', engagementScore: week3Eng, riskScore: week3Risk, date: '2024-01-15', activity: 'Module 2', duration: '1h' },
                { week: 'Week 4', engagementScore: week4Eng, riskScore: week4Risk, date: '2024-01-22', activity: 'Module 3', duration: '30m' },
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
        const currentScore = this.getUserValue(userId, 70, 90);
        const baseScore = currentScore - 5;
        const week1Hist = baseScore;
        const week1Fcst = currentScore - 3;
        const week2Hist = currentScore - 2;
        const week2Fcst = currentScore;
        const week3Hist = currentScore + 2;
        const week3Fcst = currentScore + 5;
        const week4Hist = currentScore + 4;
        const week4Fcst = currentScore + 8;
        
        const overallTrend = this.getUserValue(userId, 5, 15);
        const velocity = this.getUserValue(userId, 15, 35) / 10;
        const confidence = this.getUserValue(userId, 75, 95);
        
        return {
            currentPerformance: {
                overallScore: currentScore,
                lastUpdated: new Date().toISOString()
            },
            forecastProjections: [
                { 
                    period: 'Week 1', 
                    historicalScore: week1Hist, 
                    forecastedScore: week1Fcst, 
                    confidenceLow: week1Fcst - 2, 
                    confidenceHigh: week1Fcst + 4, 
                    probability: 'High',
                    recommendation: 'Continue'
                },
                { 
                    period: 'Week 2', 
                    historicalScore: week2Hist, 
                    forecastedScore: week2Fcst, 
                    confidenceLow: week2Fcst - 1, 
                    confidenceHigh: week2Fcst + 4, 
                    probability: 'Medium',
                    recommendation: 'Improve'
                },
                { 
                    period: 'Week 3', 
                    historicalScore: week3Hist, 
                    forecastedScore: week3Fcst, 
                    confidenceLow: week3Fcst, 
                    confidenceHigh: week3Fcst + 5, 
                    probability: 'High',
                    recommendation: 'Continue'
                },
                { 
                    period: 'Week 4', 
                    historicalScore: week4Hist, 
                    forecastedScore: week4Fcst, 
                    confidenceLow: week4Fcst, 
                    confidenceHigh: week4Fcst + 6, 
                    probability: 'Low',
                    recommendation: 'Monitor'
                }
            ],
            trendAnalysis: {
                overallTrend: overallTrend,
                velocity: velocity,
                acceleration: this.getUserValue(userId, 3, 10) / 10,
                volatility: this.getUserValue(userId, 25, 40) / 10,
                stability: this.getUserValue(userId, 75, 95) / 100,
                seasonality: 'Upward',
                peakPeriod: 'Week 4'
            },
            confidenceMetrics: {
                overallConfidence: confidence,
                forecastAccuracy: confidence + 5,
                dataQuality: this.getUserValue(userId, 90, 100),
                modelAccuracy: confidence + 2,
                predictionReliability: confidence - 2
            },
            metadata: {
                lastUpdated: new Date().toISOString(),
                dataSource: 'performance-forecast',
                modelVersion: 'v2.1',
            }
        };
    }

    getRecommendations(userId) {
        const totalRecs = this.getUserValue(userId, 8, 15);
        const highPriority = this.getUserValue(userId, 2, 5);
        const completed = this.getUserValue(userId, 5, 11);
        const completionRate = Math.round((completed / totalRecs) * 100);
        const successRate = this.getUserValue(userId, 75, 95);
        const thisWeek = this.getUserValue(userId, 60, 90);
        const thisMonth = this.getUserValue(userId, 55, 85);
        const overall = this.getUserValue(userId, 60, 80);
        
        const rec1Confidence = this.getUserValue(userId, 85, 98);
        const rec2Confidence = this.getUserValue(userId, 70, 85);
        const rec3Confidence = this.getUserValue(userId, 80, 95);
        
        const learningCount = this.getUserValue(userId, 3, 7);
        const practiceCount = this.getUserValue(userId, 2, 6);
        const socialCount = this.getUserValue(userId, 1, 4);
        const assessmentCount = this.getUserValue(userId, 0, 3);
        
        return {
            summary: {
                totalRecommendations: totalRecs,
                highPriorityCount: highPriority,
                completedCount: completed,
                completionRate: completionRate,
                successRate: successRate,
                progressTracking: {
                    thisWeek: thisWeek,
                    thisMonth: thisMonth,
                    overall: overall
                }
            },
            recommendations: [
                {
                    id: 'rec-1',
                    title: 'Complete Advanced JavaScript Course',
                    description: 'Based on your current skill level, completing this course will significantly improve your JavaScript proficiency.',
                    category: 'Learning',
                    priority: 'High',
                    confidence: rec1Confidence,
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
                    confidence: rec2Confidence,
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
                    confidence: rec3Confidence,
                    expectedImpact: 'High',
                    timeToComplete: 'Ongoing',
                    difficulty: 'Hard',
                    resources: [
                        { title: 'LeetCode Problems', url: 'https://leetcode.com' }
                    ]
                }
            ],
            categories: [
                { name: 'Learning', count: learningCount },
                { name: 'Practice', count: practiceCount },
                { name: 'Social', count: socialCount },
                { name: 'Assessment', count: assessmentCount }
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