/**
 * Frontend Mock Analytics Data
 * Used as fallback when backend API is unavailable
 * Matches backend mock data structure
 */

export const mockLearnerAnalytics = {
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
        }
    },
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
                    priorityScore: 92,
                    priorityRank: 1,
                    factors: {
                        businessPriority: 'critical',
                        marketDemand: 94
                    },
                    actionPlan: {
                        estimatedTimeToClose: '3-4 weeks',
                        recommendedPath: [
                            {
                                step: 1,
                                courseName: 'Modern JavaScript Fundamentals',
                                duration: '2 weeks'
                            }
                        ]
                    }
                }
            ],
            skillsOnTrack: [],
            skillsAchieved: []
        }
    },
    engagement: {
        'user-123': {
            overallScore: 78,
            scoreGrade: 'Good',
            scoreTrend: '+5 from last week',
            breakdowns: {
                consistency: {
                    score: 85,
                    loginFrequency: 4.5,
                    activeStreak: 12
                },
                timeInvestment: {
                    score: 72,
                    hoursLast7Days: 8.5
                },
                interactionQuality: {
                    score: 75,
                    contentCompletionRate: 88
                },
                resourceUsage: {
                    score: 80,
                    contentTypesUsed: ['video', 'article', 'interactive', 'quiz']
                }
            },
            behavioralPatterns: {
                peakLearningTime: '8-10 AM',
                peakLearningDays: ['Monday', 'Wednesday', 'Friday'],
                learningStyle: 'visual'
            },
            riskAssessment: {
                riskLevel: 'low',
                riskScore: 22,
                healthStatus: 'Healthy engagement'
            },
            comparisonToPeers: {
                yourScore: 78,
                peerAverage: 72,
                percentile: 68
            }
        }
    },
    mastery: {
        'user-123': {
            summary: {
                totalTopics: 20,
                topicsMastered: 15,
                topicsInProgress: 5,
                topicsNotStarted: 0,
                overallMasteryScore: 72
            },
            topicBreakdown: [
                {
                    topicId: 'topic-js-async',
                    topicName: 'JavaScript Async/Await',
                    masteryLevel: 85,
                    masteryGrade: 'Proficient',
                    lastPracticed: '2024-12-18',
                    milestones: [
                        { name: 'Understood basic concepts', achieved: true },
                        { name: 'Completed exercises', achieved: true }
                    ]
                }
            ]
        }
    },
    performance: {
        'user-123': {
            overview: {
                totalAssessments: 25,
                overallAverageScore: 78.5,
                passRate: 86.4,
                improvementTrend: 'improving'
            },
            scoreProgression: [65, 70, 75, 78, 82, 85, 88, 90, 92, 95],
            predictions: {
                projectedNextScore: 88,
                riskLevel: 'low'
            }
        }
    },
    contentEffectiveness: {
        'user-123': {
            effectivenessByType: [
                { type: 'video', avgScore: 85.2, count: 12 },
                { type: 'interactive', avgScore: 88.7, count: 6 }
            ],
            topContent: [
                {
                    contentId: 'content-react-hooks',
                    title: 'React Hooks Deep Dive',
                    type: 'video',
                    score: 92
                }
            ],
            insights: [
                'Interactive content leads to 10% higher scores'
            ]
        }
    }
};

