/**
 * Enhanced Mock Data for Processed Analytics
 * Comprehensive mock data for all analytics components with fallback data
 * This ensures the frontend always has data to display
 */

const mockProcessedAnalytics = {
  // Learner Analytics Mock Data
  learner: {
    'user-123': {
      learningVelocity: {
        period: 'Q4 2023',
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
        },
        formattedData: {
          currentPaceFormatted: '2.5 topics/week',
          averagePaceFormatted: '1.8 topics/week',
          trendFormatted: '↗ Accelerating',
          trendPercentageFormatted: '+38.9%',
          statusFormatted: 'Ahead of Goal',
          varianceFormatted: '+25%',
          onTrackFormatted: 'On Track',
          efficientLearnerFormatted: 'Efficient'
        }
      },
      skillGap: {
        period: 'Q4 2023',
        overallGapScore: 72,
        criticalGaps: 3,
        mediumGaps: 7,
        lowGaps: 12,
        skillCategories: [
          {
            category: 'Technical Skills',
            gapScore: 65,
            skills: ['JavaScript', 'React', 'Node.js'],
            recommendations: ['Complete advanced JavaScript course', 'Practice React hooks']
          },
          {
            category: 'Soft Skills',
            gapScore: 80,
            skills: ['Communication', 'Leadership'],
            recommendations: ['Join communication workshop', 'Take leadership course']
          }
        ],
        recommendations: [
          'Focus on technical skills development',
          'Complete JavaScript fundamentals course',
          'Practice coding daily'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallGapScoreFormatted: '72%',
          criticalGapsFormatted: '3 critical gaps',
          mediumGapsFormatted: '7 medium gaps',
          lowGapsFormatted: '12 low priority gaps',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      engagement: {
        period: 'Q4 2023',
        overallEngagement: 78,
        participationRate: 85,
        completionRate: 72,
        timeSpent: 45.5,
        interactionMetrics: {
          forumPosts: 12,
          questionsAsked: 8,
          peerInteractions: 15,
          resourceDownloads: 23
        },
        trends: {
          last7Days: 'increasing',
          last30Days: 'stable',
          last90Days: 'increasing'
        },
        recommendations: [
          'Increase forum participation',
          'Ask more questions during sessions',
          'Engage with peer discussions'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallEngagementFormatted: '78%',
          participationRateFormatted: '85%',
          completionRateFormatted: '72%',
          timeSpentFormatted: '45.5 hours',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      mastery: {
        period: 'Q4 2023',
        overallMastery: 68,
        skillLevels: [
          { skill: 'JavaScript', level: 75, status: 'proficient' },
          { skill: 'React', level: 60, status: 'developing' },
          { skill: 'Node.js', level: 45, status: 'beginner' }
        ],
        progressionRate: 15,
        masteryDistribution: {
          beginner: 2,
          developing: 4,
          proficient: 3,
          advanced: 1
        },
        trends: {
          lastMonth: 'improving',
          lastQuarter: 'steady'
        },
        recommendations: [
          'Focus on Node.js fundamentals',
          'Practice React advanced concepts',
          'Build portfolio projects'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallMasteryFormatted: '68%',
          progressionRateFormatted: '15%',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      performance: {
        period: 'Q4 2023',
        overallPerformance: 82,
        assessmentScores: {
          quizzes: 85,
          projects: 78,
          exams: 80,
          practical: 75
        },
        skillDemonstration: {
          coding: 80,
          problemSolving: 75,
          communication: 85,
          teamwork: 78
        },
        improvementAreas: ['Advanced JavaScript', 'System Design'],
        strengths: ['Problem Solving', 'Communication', 'Teamwork'],
        recommendations: [
          'Practice advanced JavaScript concepts',
          'Study system design patterns',
          'Continue building projects'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallPerformanceFormatted: '82%',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      contentEffectiveness: {
        period: 'Q4 2023',
        overallEffectiveness: 75,
        contentTypes: {
          videos: { effectiveness: 80, engagement: 85 },
          articles: { effectiveness: 70, engagement: 65 },
          exercises: { effectiveness: 85, engagement: 90 },
          quizzes: { effectiveness: 75, engagement: 80 }
        },
        engagementMetrics: {
          averageTimeSpent: 25,
          completionRate: 78,
          revisitRate: 45
        },
        learningOutcomes: {
          knowledgeRetention: 80,
          skillApplication: 75,
          practicalUsage: 70
        },
        recommendations: [
          'Increase video content',
          'Add more interactive exercises',
          'Improve article readability'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallEffectivenessFormatted: '75%',
          lastUpdatedFormatted: '15/11/2023'
        }
      }
    }
  },

  // Trainer Analytics Mock Data
  trainer: {
    'trainer-789': {
      coursePerformance: {
        period: 'Q4 2023',
        overallPerformance: 85,
        courseMetrics: {
          enrollmentRate: 92,
          completionRate: 78,
          satisfactionScore: 4.2,
          averageScore: 82
        },
        studentProgress: {
          onTrack: 65,
          behind: 20,
          ahead: 15
        },
        contentEffectiveness: {
          videoEngagement: 85,
          exerciseCompletion: 90,
          quizPerformance: 78
        },
        recommendations: [
          'Improve course pacing',
          'Add more interactive content',
          'Provide additional support for struggling students'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallPerformanceFormatted: '85%',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      courseHealth: {
        period: 'Q4 2023',
        overallHealth: 88,
        engagementLevel: 85,
        completionRate: 78,
        studentSatisfaction: 4.2,
        contentQuality: 90,
        recommendations: [
          'Maintain current engagement strategies',
          'Monitor struggling students',
          'Update outdated content'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallHealthFormatted: '88%',
          engagementLevelFormatted: '85%',
          completionRateFormatted: '78%',
          studentSatisfactionFormatted: '4.2/5',
          contentQualityFormatted: '90%',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      studentDistribution: {
        period: 'Q4 2023',
        totalStudents: 245,
        distributionByLevel: {
          beginner: 45,
          intermediate: 120,
          advanced: 80
        },
        distributionByProgress: {
          '0-25%': 30,
          '26-50%': 45,
          '51-75%': 85,
          '76-100%': 85
        },
        distributionByPerformance: {
          excellent: 60,
          good: 120,
          average: 50,
          needsImprovement: 15
        },
        trends: {
          enrollment: 'increasing',
          completion: 'stable',
          performance: 'improving'
        },
        recommendations: [
          'Provide additional support for beginners',
          'Create advanced challenges for top performers',
          'Monitor students at risk of dropping out'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          totalStudentsFormatted: '245 students',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      teachingEffectiveness: {
        period: 'Q4 2023',
        overallEffectiveness: 87,
        studentFeedback: {
          clarity: 4.3,
          helpfulness: 4.1,
          responsiveness: 4.4,
          overall: 4.2
        },
        learningOutcomes: {
          knowledgeGain: 85,
          skillDevelopment: 80,
          practicalApplication: 75
        },
        teachingMethods: {
          lectures: { effectiveness: 80, engagement: 75 },
          discussions: { effectiveness: 90, engagement: 85 },
          exercises: { effectiveness: 85, engagement: 90 },
          projects: { effectiveness: 88, engagement: 88 }
        },
        recommendations: [
          'Increase interactive discussions',
          'Add more hands-on projects',
          'Provide timely feedback'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallEffectivenessFormatted: '87%',
          lastUpdatedFormatted: '15/11/2023'
        }
      }
    }
  },

  // Organization Analytics Mock Data
  organization: {
    'org-123': {
      orgLearningVelocity: {
        period: 'Q4 2023',
        overallVelocity: 78,
        departmentMetrics: {
          engineering: { velocity: 85, employees: 45, trend: 'increasing' },
          marketing: { velocity: 72, employees: 25, trend: 'stable' },
          sales: { velocity: 80, employees: 30, trend: 'increasing' },
          hr: { velocity: 65, employees: 15, trend: 'decreasing' }
        },
        skillDevelopment: {
          technicalSkills: 82,
          softSkills: 75,
          leadershipSkills: 68,
          industryKnowledge: 80
        },
        learningTrends: {
          onlineLearning: 85,
          instructorLed: 70,
          peerLearning: 60,
          selfDirected: 75
        },
        recommendations: [
          'Increase HR department learning velocity',
          'Expand peer learning programs',
          'Focus on leadership development'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallVelocityFormatted: '78%',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      strategicAlignment: {
        period: 'Q4 2023',
        overallAlignment: 78,
        alignmentGrade: 'B',
        strategicGoals: [
          {
            goalId: 'goal-1',
            goalName: 'Digital Transformation',
            alignmentScore: 85,
            progress: 72,
            skillsCovered: 68,
            status: 'on_track',
            requiredSkills: ['Cloud Computing', 'Data Analytics', 'AI/ML'],
            employeesOnTrack: 45,
            totalEmployeesNeeded: 60,
            recommendations: ['Invest in advanced cloud training', 'Form cross-functional AI teams']
          },
          {
            goalId: 'goal-2',
            goalName: 'Customer Experience Enhancement',
            alignmentScore: 62,
            progress: 45,
            skillsCovered: 38,
            status: 'at_risk',
            requiredSkills: ['Customer Service', 'Communication', 'Problem Solving'],
            employeesOnTrack: 28,
            totalEmployeesNeeded: 50,
            recommendations: ['Implement customer feedback loops', 'Provide empathy training']
          }
        ],
        gapAnalysis: {
          criticalGaps: 5,
          mediumGaps: 10,
          lowGaps: 15,
          topMissingSkills: [
            { skill: 'Cloud Computing', gap: 65, priority: 'critical' },
            { skill: 'Data Analytics', gap: 58, priority: 'high' },
            { skill: 'AI/ML', gap: 72, priority: 'critical' }
          ]
        },
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallAlignmentFormatted: '78%',
          alignmentGradeFormatted: 'B',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      learningCulture: {
        period: 'Q4 2023',
        overallCultureScore: 82,
        cultureGrade: 'B',
        metrics: {
          learningEngagement: {
            score: 85,
            activeParticipation: 78,
            voluntaryLearning: 72,
            peerCollaboration: 68
          },
          knowledgeSharing: {
            score: 79,
            mentorshipPrograms: 12,
            activeMentors: 8,
            knowledgeBaseSessions: 25
          },
          innovationMetrics: {
            score: 75,
            newIdeasSubmitted: 50,
            ideasImplemented: 15,
            innovationProjects: 5
          },
          continuousImprovement: {
            score: 88,
            feedbackLoops: 30,
            courseCompletionTrend: 'increasing',
            skillApplicationRate: 75
          }
        },
        culturalIndicators: {
          managerSupport: 80,
          learningTimeAllocation: 10,
          recognitionPrograms: 3,
          careerDevelopmentOpportunities: 90
        },
        benchmarks: {
          industryAverage: 75,
          vsIndustry: '+7%',
          standing: 'Above Average'
        },
        recommendations: [
          'Implement more peer-to-peer learning initiatives',
          'Increase visibility of successful innovation projects',
          'Provide dedicated time for skill development'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallCultureScoreFormatted: '82%',
          cultureGradeFormatted: 'B',
          lastUpdatedFormatted: '15/11/2023'
        }
      },
      orgPerformance: {
        period: 'Q4 2023',
        overallPerformance: 85,
        departmentPerformance: {
          engineering: { performance: 90, trend: 'increasing' },
          marketing: { performance: 82, trend: 'stable' },
          sales: { performance: 88, trend: 'increasing' },
          hr: { performance: 75, trend: 'decreasing' }
        },
        skillDevelopment: {
          technicalSkills: 85,
          softSkills: 78,
          leadershipSkills: 72,
          industryKnowledge: 82
        },
        learningOutcomes: {
          knowledgeRetention: 80,
          skillApplication: 75,
          performanceImprovement: 78,
          careerAdvancement: 70
        },
        recommendations: [
          'Focus on HR department performance improvement',
          'Expand leadership development programs',
          'Increase skill application opportunities'
        ],
        lastUpdated: '2023-11-15T10:00:00Z',
        staleness: 'fresh',
        formattedData: {
          overallPerformanceFormatted: '85%',
          lastUpdatedFormatted: '15/11/2023'
        }
      }
    }
  }
};

/**
 * Fallback data for when specific user/org data is not available
 */
const fallbackData = {
  learningVelocity: {
    period: 'Q4 2023',
    currentPace: 1.5,
    averagePace: 1.5,
    trend: 'stable',
    trendPercentage: 0,
    comparisonToGoal: {
      targetPace: 2.0,
      variance: -25,
      status: 'behind'
    },
    predictions: {
      remainingTopics: 20,
      estimatedWeeksToComplete: 13,
      predictedCompletionDate: '2025-03-15',
      targetCompletionDate: '2025-03-01',
      onTrack: false
    },
    timeAnalysis: {
      totalTimeSpent: 30.0,
      averageTimePerTopic: 4.0,
      efficientLearner: false
    },
    momentum: {
      score: 60,
      description: 'Steady progress. Consider increasing study time.',
      recommendation: 'Increase study frequency to catch up with goals.'
    },
    formattedData: {
      currentPaceFormatted: '1.5 topics/week',
      averagePaceFormatted: '1.5 topics/week',
      trendFormatted: '→ Stable',
      trendPercentageFormatted: '0%',
      statusFormatted: 'Behind Goal',
      varianceFormatted: '-25%',
      onTrackFormatted: 'Off Track',
      efficientLearnerFormatted: 'Needs Improvement'
    }
  },
  skillGap: {
    period: 'Q4 2023',
    overallGapScore: 50,
    criticalGaps: 5,
    mediumGaps: 10,
    lowGaps: 15,
    skillCategories: [
      {
        category: 'Technical Skills',
        gapScore: 45,
        skills: ['Programming', 'Database', 'Web Development'],
        recommendations: ['Complete programming fundamentals', 'Learn database basics']
      }
    ],
    recommendations: [
      'Focus on core technical skills',
      'Complete foundational courses',
      'Practice regularly'
    ],
    lastUpdated: '2023-11-15T10:00:00Z',
    staleness: 'fresh',
    formattedData: {
      overallGapScoreFormatted: '50%',
      criticalGapsFormatted: '5 critical gaps',
      mediumGapsFormatted: '10 medium gaps',
      lowGapsFormatted: '15 low priority gaps',
      lastUpdatedFormatted: '15/11/2023'
    }
  }
};

module.exports = {
  mockProcessedAnalytics,
  fallbackData
};
