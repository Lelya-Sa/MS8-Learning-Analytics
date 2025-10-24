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

/**
 * AS-001: Learner Analytics Mock Data
 * Complete mock data for all 6 learner analytics categories
 */
const mockLearnerAnalytics = {
    // AS-001 #1: Learning Velocity & Momentum
    velocity: {
        'user-123': {
            currentPace: 2.5,
            averagePace: 1.8,
            trend: 'accelerating',
            trendPercentage: 38.9,
            comparisonToGoal: {
                targetPace: 2.0,
                variance: 25,
                status: 'ahead'
            },
            predictions: {
                remainingTopics: 15,
                estimatedWeeksToComplete: 6,
                predictedCompletionDate: '2025-02-15',
                targetCompletionDate: '2025-03-01',
                onTrack: true
            },
            timeAnalysis: {
                totalTimeSpent: 45.5,
                averageTimePerTopic: 3.2,
                efficientLearner: true
            },
            momentum: {
                score: 85,
                description: 'Strong momentum! You\'re learning faster than your average.',
                recommendation: 'Maintain current pace to finish 2 weeks early.'
            }
        },
        'learner-456': {
            currentPace: 1.2,
            averagePace: 1.5,
            trend: 'decelerating',
            trendPercentage: -20.0,
            comparisonToGoal: {
                targetPace: 2.0,
                variance: -40,
                status: 'behind'
            },
            predictions: {
                remainingTopics: 25,
                estimatedWeeksToComplete: 21,
                predictedCompletionDate: '2025-06-15',
                targetCompletionDate: '2025-03-01',
                onTrack: false
            },
            timeAnalysis: {
                totalTimeSpent: 28.3,
                averageTimePerTopic: 4.1,
                efficientLearner: false
            },
            momentum: {
                score: 45,
                description: 'Your pace has slowed down recently.',
                recommendation: 'Try to increase study time to 5 hours per week.'
            }
        }
    },
    
    // AS-001 #2: Skill Gap Matrix with Prioritization
    skillGaps: {
        'user-123': {
            summary: {
                totalTargetSkills: 15,
                skillsAcquired: 8,
                skillsInProgress: 4,
                skillsNotStarted: 3,
                averageGap: 35,
                criticalGaps: 2
            },
            prioritizedGaps: [
                {
                    skillId: 'skill-js-es6',
                    skillName: 'JavaScript ES6+',
                    currentLevel: 45,
                    targetLevel: 80,
                    gap: 35,
                    gapPercentage: 43.75,
                    priorityScore: 92,
                    priorityRank: 1,
                    factors: {
                        businessPriority: 'critical',
                        businessJustification: 'Required for upcoming React migration project',
                        marketDemand: 94,
                        marketTrend: 'increasing',
                        salaryImpact: 12,
                        prerequisiteFor: ['React Advanced', 'Node.js'],
                        blockedSkills: 2
                    },
                    actionPlan: {
                        estimatedTimeToClose: '3-4 weeks',
                        estimatedHours: 25,
                        recommendedPath: [
                            {
                                step: 1,
                                courseId: 'course-456',
                                courseName: 'Modern JavaScript Fundamentals',
                                duration: '2 weeks',
                                skillGain: 15
                            },
                            {
                                step: 2,
                                courseId: 'course-457',
                                courseName: 'Advanced JavaScript Patterns',
                                duration: '1-2 weeks',
                                skillGain: 20
                            }
                        ],
                        practices: [
                            'Complete 10 ES6 challenges in DevLab',
                            'Build 2 small projects using modern JS'
                        ],
                        nextMilestone: 'Complete async/await and promises module',
                        deadline: '2025-01-31'
                    }
                },
                {
                    skillId: 'skill-react',
                    skillName: 'React',
                    currentLevel: 30,
                    targetLevel: 75,
                    gap: 45,
                    gapPercentage: 60.0,
                    priorityScore: 85,
                    priorityRank: 2,
                    factors: {
                        businessPriority: 'high',
                        businessJustification: 'Core technology for frontend development',
                        marketDemand: 92,
                        marketTrend: 'stable',
                        salaryImpact: 15,
                        prerequisiteFor: ['React Native', 'Next.js'],
                        blockedSkills: 2
                    },
                    actionPlan: {
                        estimatedTimeToClose: '4-6 weeks',
                        estimatedHours: 35,
                        recommendedPath: [
                            {
                                step: 1,
                                courseId: 'course-react-101',
                                courseName: 'React Fundamentals',
                                duration: '3 weeks',
                                skillGain: 25
                            },
                            {
                                step: 2,
                                courseId: 'course-react-201',
                                courseName: 'Advanced React Patterns',
                                duration: '2-3 weeks',
                                skillGain: 20
                            }
                        ],
                        practices: [
                            'Build 3 React components from scratch',
                            'Complete React hooks tutorial'
                        ],
                        nextMilestone: 'Complete React fundamentals course',
                        deadline: '2025-02-28'
                    }
                }
            ],
            skillsOnTrack: [
                {
                    skillName: 'Python',
                    currentLevel: 75,
                    targetLevel: 80,
                    gap: 5,
                    status: 'on_track',
                    estimatedCompletion: '2 weeks'
                }
            ],
            skillsAchieved: [
                {
                    skillName: 'HTML5',
                    achievedLevel: 90,
                    targetLevel: 80,
                    achievedDate: '2024-11-15',
                    daysToAchieve: 45
                },
                {
                    skillName: 'CSS3',
                    achievedLevel: 85,
                    targetLevel: 75,
                    achievedDate: '2024-11-20',
                    daysToAchieve: 38
                }
            ]
        },
        'learner-456': {
            summary: {
                totalTargetSkills: 12,
                skillsAcquired: 5,
                skillsInProgress: 5,
                skillsNotStarted: 2,
                averageGap: 42,
                criticalGaps: 3
            },
            prioritizedGaps: [
                {
                    skillId: 'skill-python',
                    skillName: 'Python',
                    currentLevel: 35,
                    targetLevel: 80,
                    gap: 45,
                    gapPercentage: 56.25,
                    priorityScore: 88,
                    priorityRank: 1,
                    factors: {
                        businessPriority: 'critical',
                        businessJustification: 'Required for data science projects',
                        marketDemand: 90,
                        marketTrend: 'increasing',
                        salaryImpact: 18,
                        prerequisiteFor: ['Django', 'Data Science'],
                        blockedSkills: 2
                    },
                    actionPlan: {
                        estimatedTimeToClose: '5-6 weeks',
                        estimatedHours: 40,
                        recommendedPath: [
                            {
                                step: 1,
                                courseId: 'course-python-101',
                                courseName: 'Python Basics',
                                duration: '3 weeks',
                                skillGain: 25
                            },
                            {
                                step: 2,
                                courseId: 'course-python-201',
                                courseName: 'Intermediate Python',
                                duration: '2-3 weeks',
                                skillGain: 20
                            }
                        ],
                        practices: [
                            'Complete 15 Python exercises',
                            'Build a small CLI application'
                        ],
                        nextMilestone: 'Complete Python basics course',
                        deadline: '2025-02-15'
                    }
                }
            ],
            skillsOnTrack: [],
            skillsAchieved: [
                {
                    skillName: 'Git',
                    achievedLevel: 70,
                    targetLevel: 65,
                    achievedDate: '2024-12-01',
                    daysToAchieve: 30
                }
            ]
        }
    },
    
    // AS-001 #3: Engagement Score with Behavioral Insights
    engagement: {
        'user-123': {
            overallScore: 78,
            scoreGrade: 'Good',
            scoreTrend: '+5 from last week',
            breakdowns: {
                consistency: {
                    score: 85,
                    loginFrequency: 4.5,
                    loginFrequencyTarget: 5,
                    activeStreak: 12,
                    longestGap: 2,
                    insight: 'Excellent consistency! You\'ve been active 12 days in a row.'
                },
                timeInvestment: {
                    score: 72,
                    hoursLast7Days: 8.5,
                    hoursLast30Days: 32,
                    averageSessionDuration: 45,
                    recommendedHoursPerWeek: 10,
                    comparisonToRecommended: -15,
                    insight: 'Consider adding 1.5 hours per week to reach your goal faster.'
                },
                interactionQuality: {
                    score: 75,
                    contentCompletionRate: 88,
                    chatbotInteractions: 3,
                    practiceAttempts: 8,
                    assessmentAttempts: 2,
                    meaningfulInteractions: 92,
                    insight: 'High-quality engagement! You complete most content you start.'
                },
                resourceUsage: {
                    score: 80,
                    contentTypesUsed: ['video', 'article', 'interactive', 'quiz'],
                    diversityScore: 80,
                    preferredContentType: 'video',
                    underutilizedResources: ['podcast'],
                    insight: 'Great content diversity. Consider trying podcast format.'
                }
            },
            behavioralPatterns: {
                peakLearningTime: '8-10 AM',
                peakLearningDays: ['Monday', 'Wednesday', 'Friday'],
                preferredDevice: 'desktop',
                averageSessionsPerDay: 1.5,
                learningStyle: 'visual',
                concentrationSpan: 45,
                insights: [
                    'You learn best in the morning',
                    'Your concentration is optimal for 45-minute sessions',
                    'Desktop usage correlates with higher completion rates'
                ],
                recommendations: [
                    'Schedule important modules for 8-10 AM',
                    'Take 10-minute breaks every 45 minutes',
                    'Use mobile for lighter review content'
                ]
            },
            riskAssessment: {
                riskLevel: 'low',
                riskScore: 22,
                riskFactors: [],
                interventionRecommended: false,
                healthStatus: 'Healthy engagement',
                nextCheckIn: '2024-12-27T10:00:00Z'
            },
            comparisonToPeers: {
                yourScore: 78,
                peerAverage: 72,
                percentile: 68,
                insight: 'You\'re more engaged than 68% of similar learners'
            }
        },
        'learner-456': {
            overallScore: 52,
            scoreGrade: 'Needs Improvement',
            scoreTrend: '-8 from last week',
            breakdowns: {
                consistency: {
                    score: 45,
                    loginFrequency: 2.1,
                    loginFrequencyTarget: 5,
                    activeStreak: 3,
                    longestGap: 7,
                    insight: 'Your login frequency has decreased. Try to establish a regular schedule.'
                },
                timeInvestment: {
                    score: 48,
                    hoursLast7Days: 4.2,
                    hoursLast30Days: 18,
                    averageSessionDuration: 28,
                    recommendedHoursPerWeek: 10,
                    comparisonToRecommended: -58,
                    insight: 'You\'re investing less time than recommended. Consider increasing to 10 hours per week.'
                },
                interactionQuality: {
                    score: 55,
                    contentCompletionRate: 62,
                    chatbotInteractions: 1,
                    practiceAttempts: 3,
                    assessmentAttempts: 1,
                    meaningfulInteractions: 58,
                    insight: 'Your content completion rate is lower than average. Focus on finishing started content.'
                },
                resourceUsage: {
                    score: 60,
                    contentTypesUsed: ['video', 'article'],
                    diversityScore: 40,
                    preferredContentType: 'video',
                    underutilizedResources: ['interactive', 'quiz', 'podcast'],
                    insight: 'Try exploring interactive content and quizzes for better engagement.'
                }
            },
            behavioralPatterns: {
                peakLearningTime: '7-9 PM',
                peakLearningDays: ['Saturday', 'Sunday'],
                preferredDevice: 'mobile',
                averageSessionsPerDay: 0.8,
                learningStyle: 'reading',
                concentrationSpan: 25,
                insights: [
                    'You prefer evening learning',
                    'Weekend learning works better for you',
                    'Mobile usage may limit deep learning'
                ],
                recommendations: [
                    'Schedule dedicated weekend learning blocks',
                    'Use desktop for complex topics',
                    'Break learning into 25-minute focused sessions'
                ]
            },
            riskAssessment: {
                riskLevel: 'high',
                riskScore: 72,
                riskFactors: [
                    'Declining engagement trend',
                    'Low time investment',
                    'Irregular login pattern'
                ],
                interventionRecommended: true,
                healthStatus: 'At risk - intervention recommended',
                nextCheckIn: '2024-12-22T10:00:00Z'
            },
            comparisonToPeers: {
                yourScore: 52,
                peerAverage: 72,
                percentile: 28,
                insight: 'Your engagement is below average. Let\'s work on improving it together.'
            }
        }
    },
    
    // AS-001 #4: Mastery Progress Tracking
    mastery: {
        'user-123': {
            summary: {
                topicsMastered: 15,
                topicsInProgress: 5,
                topicsNotStarted: 10,
                overallMasteryScore: 72
            },
            topicBreakdown: [
                {
                    topicId: 'topic-async-js',
                    topicName: 'JavaScript Async/Await',
                    masteryLevel: 85,
                    masteryGrade: 'Proficient',
                    progressToMaster: 88,
                    practiceAttempts: 12,
                    successRate: 91,
                    averageScore: 87,
                    timeToMastery: '2 weeks',
                    timeSpent: 8.5,
                    retentionScore: 88,
                    lastPracticeDate: '2024-12-19',
                    needsReview: false,
                    nextReviewDate: '2025-01-05',
                    milestones: [
                        {
                            milestone: 'Understood basic concepts',
                            achievedAt: '2024-12-01',
                            level: 40
                        },
                        {
                            milestone: 'Applied in practice',
                            achievedAt: '2024-12-10',
                            level: 70
                        },
                        {
                            milestone: 'Proficient level achieved',
                            achievedAt: '2024-12-18',
                            level: 85
                        }
                    ],
                    strengthAreas: [
                        'Promise handling',
                        'Error handling with try/catch'
                    ],
                    improvementAreas: [
                        'Parallel execution with Promise.all()'
                    ],
                    recommendations: [
                        'Practice 2 more advanced challenges',
                        'Build a real-world async project'
                    ]
                },
                {
                    topicId: 'topic-react-hooks',
                    topicName: 'React Hooks',
                    masteryLevel: 62,
                    masteryGrade: 'Developing',
                    progressToMaster: 62,
                    practiceAttempts: 8,
                    successRate: 75,
                    averageScore: 72,
                    timeToMastery: '3 weeks',
                    timeSpent: 12.3,
                    retentionScore: 70,
                    lastPracticeDate: '2024-12-18',
                    needsReview: false,
                    nextReviewDate: '2025-01-02',
                    milestones: [
                        {
                            milestone: 'Understood useState and useEffect',
                            achievedAt: '2024-12-05',
                            level: 35
                        },
                        {
                            milestone: 'Applied custom hooks',
                            achievedAt: '2024-12-15',
                            level: 62
                        }
                    ],
                    strengthAreas: [
                        'useState basics',
                        'useEffect dependencies'
                    ],
                    improvementAreas: [
                        'Custom hooks',
                        'useCallback and useMemo optimization'
                    ],
                    recommendations: [
                        'Complete advanced hooks tutorial',
                        'Build a project using custom hooks'
                    ]
                }
            ]
        },
        'learner-456': {
            summary: {
                topicsMastered: 8,
                topicsInProgress: 7,
                topicsNotStarted: 12,
                overallMasteryScore: 48
            },
            topicBreakdown: [
                {
                    topicId: 'topic-python-basics',
                    topicName: 'Python Basics',
                    masteryLevel: 45,
                    masteryGrade: 'Developing',
                    progressToMaster: 45,
                    practiceAttempts: 6,
                    successRate: 67,
                    averageScore: 68,
                    timeToMastery: '4 weeks',
                    timeSpent: 15.2,
                    retentionScore: 62,
                    lastPracticeDate: '2024-12-17',
                    needsReview: true,
                    nextReviewDate: '2024-12-24',
                    milestones: [
                        {
                            milestone: 'Understood syntax basics',
                            achievedAt: '2024-11-28',
                            level: 25
                        },
                        {
                            milestone: 'Completed first project',
                            achievedAt: '2024-12-12',
                            level: 45
                        }
                    ],
                    strengthAreas: [
                        'Variables and data types',
                        'Control flow'
                    ],
                    improvementAreas: [
                        'Functions and modules',
                        'Object-oriented programming'
                    ],
                    recommendations: [
                        'Review OOP concepts',
                        'Practice with more coding exercises'
                    ]
                }
            ]
        }
    },
    
    // AS-001 #5: Performance & Assessment Analytics
    performance: {
        'user-123': {
            overview: {
                totalAssessments: 25,
                completedAssessments: 23,
                pendingAssessments: 2,
                overallAverageScore: 78.5,
                recentAverageScore: 82.3,
                bestScore: 95,
                worstScore: 62,
                passRate: 86.4,
                improvementTrend: 'improving'
            },
            scoreProgression: [65, 70, 75, 78, 82, 85, 88, 90, 92, 95],
            topicPerformance: [
                {
                    topicId: 'topic-js-fundamentals',
                    topicName: 'JavaScript Fundamentals',
                    averageScore: 88.5,
                    assessmentCount: 5,
                    trend: 'improving'
                },
                {
                    topicId: 'topic-react-basics',
                    topicName: 'React Basics',
                    averageScore: 75.2,
                    assessmentCount: 4,
                    trend: 'stable'
                }
            ],
            timeEfficiency: {
                averageCompletionTime: 42,
                timeEfficiencyRatio: 0.95,
                quickestCompletion: 28
            },
            retryPatterns: {
                retryRate: 18,
                retrySuccessRate: 85,
                averageAttemptsToPass: 1.2
            },
            predictions: {
                projectedNextScore: 88,
                riskLevel: 'low',
                recommendedStudyTime: 4
            }
        },
        'learner-456': {
            overview: {
                totalAssessments: 18,
                completedAssessments: 15,
                pendingAssessments: 3,
                overallAverageScore: 68.2,
                recentAverageScore: 65.8,
                bestScore: 82,
                worstScore: 48,
                passRate: 73.3,
                improvementTrend: 'declining'
            },
            scoreProgression: [72, 68, 70, 65, 62, 68, 70, 65, 63, 60],
            topicPerformance: [
                {
                    topicId: 'topic-python-basics',
                    topicName: 'Python Basics',
                    averageScore: 68.5,
                    assessmentCount: 6,
                    trend: 'declining'
                }
            ],
            timeEfficiency: {
                averageCompletionTime: 58,
                timeEfficiencyRatio: 1.15,
                quickestCompletion: 45
            },
            retryPatterns: {
                retryRate: 35,
                retrySuccessRate: 68,
                averageAttemptsToPass: 1.8
            },
            predictions: {
                projectedNextScore: 62,
                riskLevel: 'high',
                recommendedStudyTime: 8
            }
        }
    },
    
    // AS-001 #6: Course & Content Effectiveness
    contentEffectiveness: {
        'user-123': {
            scope: 'learner',
            dateRange: { start: '2024-11-01', end: '2024-12-20' },
            effectivenessByType: [
                { type: 'video', avgScore: 85.2, count: 12 },
                { type: 'article', avgScore: 78.5, count: 8 },
                { type: 'interactive', avgScore: 88.7, count: 6 },
                { type: 'quiz', avgScore: 82.1, count: 10 }
            ],
            engagementToScoreCorrelation: 0.78,
            topContent: [
                {
                    contentId: 'content-react-hooks',
                    title: 'React Hooks Deep Dive',
                    type: 'video',
                    score: 92,
                    completionRate: 95,
                    timeSpent: 3.5
                },
                {
                    contentId: 'content-async-js',
                    title: 'Async JavaScript Mastery',
                    type: 'interactive',
                    score: 90,
                    completionRate: 98,
                    timeSpent: 4.2
                }
            ],
            lowContent: [
                {
                    contentId: 'content-css-grid',
                    title: 'CSS Grid Layout',
                    type: 'article',
                    score: 65,
                    completionRate: 72,
                    timeSpent: 2.1
                }
            ],
            insights: [
                'Interactive content leads to 10% higher scores',
                'Video format works best for complex topics',
                'Morning study sessions correlate with better outcomes'
            ]
        },
        'learner-456': {
            scope: 'learner',
            dateRange: { start: '2024-11-01', end: '2024-12-20' },
            effectivenessByType: [
                { type: 'video', avgScore: 72.1, count: 8 },
                { type: 'article', avgScore: 68.5, count: 10 },
                { type: 'interactive', avgScore: 65.2, count: 3 }
            ],
            engagementToScoreCorrelation: 0.62,
            topContent: [
                {
                    contentId: 'content-python-intro',
                    title: 'Python Introduction',
                    type: 'video',
                    score: 78,
                    completionRate: 85,
                    timeSpent: 2.8
                }
            ],
            lowContent: [
                {
                    contentId: 'content-oop-python',
                    title: 'OOP in Python',
                    type: 'article',
                    score: 58,
                    completionRate: 62,
                    timeSpent: 1.5
                }
            ],
            insights: [
                'Consider more interactive practice',
                'Break down complex topics into smaller chunks',
                'Evening study sessions show lower retention'
            ]
        }
    }
};

/**
 * AS-002: Trainer Analytics Mock Data
 * Complete mock data for all 4 trainer analytics categories
 */
const mockTrainerAnalytics = {
    // AS-002 #8: Course Health Dashboard
    courseHealth: {
        'trainer-123': {
            'course-123': {
                courseId: 'course-123',
                courseName: 'Full Stack Web Development',
                overallHealth: 'good',
                healthScore: 78,
                metrics: {
                    enrollments: {
                        total: 245,
                        active: 180,
                        trend: '+15% this month',
                        comparisonToAverage: '+8%'
                    },
                    completion: {
                        rate: 68,
                        target: 75,
                        variance: '-7%',
                        averageTimeToComplete: '8.5 weeks',
                        targetTime: '8 weeks'
                    },
                    satisfaction: {
                        averageRating: 4.3,
                        totalReviews: 87,
                        nps: 42,
                        satisfactionScore: 85,
                        ratingTrend: '+0.2 from last cohort'
                    }
                },
                dropOffAnalysis: {
                    overallDropOffRate: 32,
                    dropOffPoints: [
                        {
                            moduleId: 'module_5',
                            moduleName: 'Advanced JavaScript',
                            dropOffRate: 35,
                            studentsDropped: 63,
                            avgProgressBeforeDrop: 45,
                            likelyReasons: [
                                'Difficulty spike (30% of feedback)',
                                'Unclear instructions (25% of feedback)',
                                'Time commitment (20% of feedback)'
                            ],
                            recommendedActions: [
                                'Add prerequisite review module',
                                'Create video walkthrough for complex concepts',
                                'Break module into smaller sections',
                                'Add more practice exercises with hints'
                            ],
                            priority: 'high'
                        }
                    ]
                },
                contentPerformance: {
                    strugglingTopics: [
                        {
                            topic: 'Async Programming',
                            averageScore: 62,
                            passRate: 58,
                            averageAttempts: 2.3,
                            studentFeedback: 'Needs more examples'
                        }
                    ],
                    highPerformanceTopics: [
                        {
                            topic: 'HTML/CSS Basics',
                            averageScore: 92,
                            passRate: 98,
                            averageAttempts: 1.1,
                            studentFeedback: 'Clear and concise'
                        }
                    ]
                },
                recommendations: [
                    {
                        type: 'content_improvement',
                        priority: 'high',
                        suggestion: 'Revise Module 5: Add scaffolding content',
                        expectedImpact: 'Reduce drop-off by 15%'
                    },
                    {
                        type: 'pacing',
                        priority: 'medium',
                        suggestion: 'Module 3 completion time is 30% longer than target',
                        expectedImpact: 'Improve completion rate by 5%'
                    }
                ]
            }
        }
    },
    
    // AS-002 #7: Course Performance Dashboard
    coursePerformance: {
        'trainer-123': {
            courses: [
                {
                    courseId: 'course-123',
                    courseName: 'Full Stack Web Development',
                    enrollments: 245,
                    activeStudents: 180,
                    completionRate: 68,
                    averageScore: 78.5,
                    healthScore: 78,
                    trend: 'improving'
                },
                {
                    courseId: 'course-456',
                    courseName: 'React Advanced Patterns',
                    enrollments: 128,
                    activeStudents: 95,
                    completionRate: 72,
                    averageScore: 82.3,
                    healthScore: 85,
                    trend: 'stable'
                }
            ],
            summary: {
                totalCourses: 2,
                totalEnrollments: 373,
                averageCompletionRate: 70,
                averageHealthScore: 81.5
            }
        }
    },
    
    // AS-002 #9: Student Performance Distribution
    studentDistribution: {
        'trainer-123': {
            'course-123': {
                courseId: 'course-123',
                courseName: 'Full Stack Web Development',
                totalStudents: 245,
                distribution: {
                    excellent: { count: 45, percentage: 18.4, range: '90-100%' },
                    good: { count: 98, percentage: 40.0, range: '75-89%' },
                    average: { count: 67, percentage: 27.3, range: '60-74%' },
                    struggling: { count: 35, percentage: 14.3, range: '<60%' }
                },
                insights: {
                    averageScore: 78.5,
                    medianScore: 79.0,
                    passRate: 85.7,
                    atRiskStudents: 35,
                    topPerformers: 45
                }
            }
        }
    },
    
    // AS-002 #10: Teaching Effectiveness Metrics
    teachingEffectiveness: {
        'trainer-123': {
            overallScore: 85.7,
            metrics: {
                studentSatisfaction: {
                    score: 4.3,
                    totalReviews: 187,
                    trend: 'improving'
                },
                learningOutcomes: {
                    averageScoreImprovement: 15.5,
                    skillAcquisitionRate: 82.3,
                    completionRate: 70.0
                },
                engagement: {
                    responseTime: '2.5 hours',
                    feedbackQuality: 4.5,
                    availabilityScore: 92
                }
            },
            strengths: [
                'Clear explanations and examples',
                'Quick response to student questions',
                'Well-structured course content'
            ],
            improvementAreas: [
                'More hands-on exercises',
                'Additional office hours',
                'More video content'
            ]
        }
    }
};

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
    // Legacy combined analytics (for backward compatibility)
    getLearnerAnalytics: (userId) => mockAnalytics.learner[userId],
    getTrainerAnalytics: (userId) => mockAnalytics.trainer[userId],
    getOrganizationAnalytics: (organizationId) => mockAnalytics.organization[organizationId],
    
    // AS-001: Learner Analytics (Individual methods for each analytic)
    getLearnerVelocity: (userId) => {
        const data = mockLearnerAnalytics.velocity[userId];
        if (!data) return null;
        return {
            success: true,
            data: {
                learningVelocity: data
            },
            meta: {
                calculatedAt: new Date().toISOString(),
                dataFreshness: '2 hours',
                confidence: 'high'
            }
        };
    },
    
    getLearnerSkillGaps: (userId) => {
        const data = mockLearnerAnalytics.skillGaps[userId];
        if (!data) return null;
        return {
            success: true,
            data: {
                skillGapMatrix: data
            },
            meta: {
                calculatedAt: new Date().toISOString(),
                nextRecommendedAnalysis: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        };
    },
    
    getLearnerEngagement: (userId) => {
        const data = mockLearnerAnalytics.engagement[userId];
        if (!data) return null;
        return {
            success: true,
            data: {
                engagementAnalytics: data
            },
            meta: {
                calculatedAt: new Date().toISOString(),
                basedOnDays: 30,
                confidence: 'high'
            }
        };
    },
    
    getLearnerMastery: (userId) => {
        const data = mockLearnerAnalytics.mastery[userId];
        if (!data) return null;
        return {
            success: true,
            data: {
                masteryTracking: data
            },
            meta: {
                calculatedAt: new Date().toISOString()
            }
        };
    },
    
    getLearnerPerformance: (userId) => {
        const data = mockLearnerAnalytics.performance[userId];
        if (!data) return null;
        return {
            success: true,
            analyticsType: 'performance_analytics',
            userId: userId,
            data: data,
            meta: {
                calculatedAt: new Date().toISOString()
            }
        };
    },
    
    getLearnerContentEffectiveness: (userId, filters = {}) => {
        const data = mockLearnerAnalytics.contentEffectiveness[userId];
        if (!data) return null;
        return {
            success: true,
            analyticsType: 'content_effectiveness',
            scope: 'learner',
            userId: userId,
            data: data,
            meta: {
                calculatedAt: new Date().toISOString()
            }
        };
    },
    
    /**
     * ========================================
     * AS-002: TRAINER ANALYTICS METHODS
     * ========================================
     */
    
    /**
     * AS-002 #8: Course Health Dashboard
     */
    getCourseHealth: (trainerId, courseId) => {
        const trainerData = mockTrainerAnalytics.courseHealth[trainerId];
        if (!trainerData) return null;
        const data = trainerData[courseId];
        if (!data) return null;
        return {
            success: true,
            data: {
                courseHealth: data
            },
            meta: {
                calculatedAt: new Date().toISOString(),
                dataFreshness: '1 hour'
            }
        };
    },
    
    /**
     * AS-002 #7: Course Performance Dashboard
     */
    getCoursePerformance: (trainerId) => {
        const data = mockTrainerAnalytics.coursePerformance[trainerId];
        if (!data) return null;
        return {
            success: true,
            data: {
                coursePerformance: data
            },
            meta: {
                calculatedAt: new Date().toISOString()
            }
        };
    },
    
    /**
     * AS-002 #9: Student Performance Distribution
     */
    getStudentDistribution: (trainerId, courseId) => {
        const trainerData = mockTrainerAnalytics.studentDistribution[trainerId];
        if (!trainerData) return null;
        const data = trainerData[courseId];
        if (!data) return null;
        return {
            success: true,
            data: {
                studentDistribution: data
            },
            meta: {
                calculatedAt: new Date().toISOString()
            }
        };
    },
    
    /**
     * AS-002 #10: Teaching Effectiveness Metrics
     */
    getTeachingEffectiveness: (trainerId) => {
        const data = mockTrainerAnalytics.teachingEffectiveness[trainerId];
        if (!data) return null;
        return {
            success: true,
            data: {
                teachingEffectiveness: data
            },
            meta: {
                calculatedAt: new Date().toISOString()
            }
        };
    }
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
