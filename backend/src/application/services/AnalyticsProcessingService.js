/**
 * Analytics Processing Service
 * Processes raw data using domain entities and returns ready-to-display data for frontend
 * This service implements the BFF (Backend for Frontend) pattern
 */

const { mockProcessedAnalytics, fallbackData } = require('../../infrastructure/data/ProcessedAnalyticsMockData');

class AnalyticsProcessingService {
  /**
   * Process learner analytics data for frontend consumption
   * @param {string} userId - User ID
   * @returns {Object} Processed analytics data ready for frontend
   */
  processLearnerAnalytics(userId) {
    const userData = mockProcessedAnalytics.learner[userId];
    if (!userData) {
      // Return fallback data if user not found
      return {
        data: {
          learningVelocity: fallbackData.learningVelocity,
          skillGap: fallbackData.skillGap,
          engagement: this.getDefaultEngagement(),
          mastery: this.getDefaultMastery(),
          performance: this.getDefaultPerformance(),
          contentEffectiveness: this.getDefaultContentEffectiveness()
        },
        metadata: {
          userId,
          lastUpdated: new Date().toISOString(),
          staleness: 'fallback'
        }
      };
    }

    return {
      data: {
        learningVelocity: userData.learningVelocity,
        skillGap: userData.skillGap,
        engagement: userData.engagement,
        mastery: userData.mastery,
        performance: userData.performance,
        contentEffectiveness: userData.contentEffectiveness
      },
      metadata: {
        userId,
        lastUpdated: new Date().toISOString(),
        staleness: 'fresh'
      }
    };
  }

  /**
   * Process trainer analytics data for frontend consumption
   * @param {string} userId - User ID
   * @returns {Object} Processed analytics data ready for frontend
   */
  processTrainerAnalytics(userId) {
    const userData = mockProcessedAnalytics.trainer[userId];
    if (!userData) {
      // Return fallback data if user not found
      return {
        data: {
          coursePerformance: this.getDefaultCoursePerformance(),
          courseHealth: this.getDefaultCourseHealth(),
          studentDistribution: this.getDefaultStudentDistribution(),
          teachingEffectiveness: this.getDefaultTeachingEffectiveness()
        },
        metadata: {
          userId,
          lastUpdated: new Date().toISOString(),
          staleness: 'fallback'
        }
      };
    }

    return {
      data: {
        coursePerformance: userData.coursePerformance,
        courseHealth: userData.courseHealth,
        studentDistribution: userData.studentDistribution,
        teachingEffectiveness: userData.teachingEffectiveness
      },
      metadata: {
        userId,
        lastUpdated: new Date().toISOString(),
        staleness: 'fresh'
      }
    };
  }

  /**
   * Process organization analytics data for frontend consumption
   * @param {string} organizationId - Organization ID
   * @returns {Object} Processed analytics data ready for frontend
   */
  processOrganizationAnalytics(organizationId) {
    const orgData = mockProcessedAnalytics.organization[organizationId];
    if (!orgData) {
      // Return fallback data if organization not found
      return {
        data: {
          orgLearningVelocity: this.getDefaultOrgLearningVelocity(),
          strategicAlignment: this.getDefaultStrategicAlignment(),
          learningCulture: this.getDefaultLearningCulture(),
          orgPerformance: this.getDefaultOrgPerformance()
        },
        metadata: {
          organizationId,
          lastUpdated: new Date().toISOString(),
          staleness: 'fallback'
        }
      };
    }

    return {
      data: {
        orgLearningVelocity: orgData.orgLearningVelocity,
        strategicAlignment: orgData.strategicAlignment,
        learningCulture: orgData.learningCulture,
        orgPerformance: orgData.orgPerformance
      },
      metadata: {
        organizationId,
        lastUpdated: new Date().toISOString(),
        staleness: 'fresh'
      }
    };
  }

  // Fallback data methods
  getDefaultEngagement() {
    return {
      period: 'Q4 2023',
      overallEngagement: 60,
      participationRate: 65,
      completionRate: 55,
      timeSpent: 25.0,
      interactionMetrics: {
        forumPosts: 5,
        questionsAsked: 3,
        peerInteractions: 8,
        resourceDownloads: 12
      },
      trends: {
        last7Days: 'stable',
        last30Days: 'stable',
        last90Days: 'stable'
      },
      recommendations: [
        'Increase participation in discussions',
        'Ask questions during sessions',
        'Engage with course materials'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallEngagementFormatted: '60%',
        participationRateFormatted: '65%',
        completionRateFormatted: '55%',
        timeSpentFormatted: '25.0 hours',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultMastery() {
    return {
      period: 'Q4 2023',
      overallMastery: 45,
      skillLevels: [
        { skill: 'Basic Programming', level: 50, status: 'developing' },
        { skill: 'Web Development', level: 40, status: 'beginner' }
      ],
      progressionRate: 8,
      masteryDistribution: {
        beginner: 3,
        developing: 2,
        proficient: 0,
        advanced: 0
      },
      trends: {
        lastMonth: 'stable',
        lastQuarter: 'stable'
      },
      recommendations: [
        'Focus on fundamentals',
        'Practice regularly',
        'Complete basic courses'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallMasteryFormatted: '45%',
        progressionRateFormatted: '8%',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultPerformance() {
    return {
      period: 'Q4 2023',
      overallPerformance: 65,
      assessmentScores: {
        quizzes: 70,
        projects: 60,
        exams: 65,
        practical: 55
      },
      skillDemonstration: {
        coding: 60,
        problemSolving: 65,
        communication: 70,
        teamwork: 60
      },
      improvementAreas: ['Technical Skills', 'Problem Solving'],
      strengths: ['Communication', 'Teamwork'],
      recommendations: [
        'Focus on technical skill development',
        'Practice problem-solving exercises',
        'Complete more projects'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallPerformanceFormatted: '65%',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultContentEffectiveness() {
    return {
      period: 'Q4 2023',
      overallEffectiveness: 60,
      contentTypes: {
        videos: { effectiveness: 65, engagement: 70 },
        articles: { effectiveness: 55, engagement: 60 },
        exercises: { effectiveness: 70, engagement: 75 },
        quizzes: { effectiveness: 60, engagement: 65 }
      },
      engagementMetrics: {
        averageTimeSpent: 15,
        completionRate: 60,
        revisitRate: 30
      },
      learningOutcomes: {
        knowledgeRetention: 65,
        skillApplication: 60,
        practicalUsage: 55
      },
      recommendations: [
        'Increase video content',
        'Add more interactive exercises',
        'Improve content quality'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallEffectivenessFormatted: '60%',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultCoursePerformance() {
    return {
      period: 'Q4 2023',
      overallPerformance: 70,
      courseMetrics: {
        enrollmentRate: 80,
        completionRate: 65,
        satisfactionScore: 3.8,
        averageScore: 75
      },
      studentProgress: {
        onTrack: 50,
        behind: 30,
        ahead: 20
      },
      contentEffectiveness: {
        videoEngagement: 75,
        exerciseCompletion: 80,
        quizPerformance: 70
      },
      recommendations: [
        'Improve course structure',
        'Add more interactive content',
        'Provide better student support'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallPerformanceFormatted: '70%',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultCourseHealth() {
    return {
      period: 'Q4 2023',
      overallHealth: 75,
      engagementLevel: 70,
      completionRate: 65,
      studentSatisfaction: 3.8,
      contentQuality: 80,
      recommendations: [
        'Monitor student engagement',
        'Update outdated content',
        'Improve student support'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallHealthFormatted: '75%',
        engagementLevelFormatted: '70%',
        completionRateFormatted: '65%',
        studentSatisfactionFormatted: '3.8/5',
        contentQualityFormatted: '80%',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultStudentDistribution() {
    return {
      period: 'Q4 2023',
      totalStudents: 150,
      distributionByLevel: {
        beginner: 60,
        intermediate: 70,
        advanced: 20
      },
      distributionByProgress: {
        '0-25%': 40,
        '26-50%': 50,
        '51-75%': 40,
        '76-100%': 20
      },
      distributionByPerformance: {
        excellent: 30,
        good: 60,
        average: 45,
        needsImprovement: 15
      },
      trends: {
        enrollment: 'stable',
        completion: 'stable',
        performance: 'stable'
      },
      recommendations: [
        'Support struggling students',
        'Challenge advanced learners',
        'Monitor progress regularly'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        totalStudentsFormatted: '150 students',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultTeachingEffectiveness() {
    return {
      period: 'Q4 2023',
      overallEffectiveness: 75,
      studentFeedback: {
        clarity: 4.0,
        helpfulness: 3.8,
        responsiveness: 4.1,
        overall: 3.9
      },
      learningOutcomes: {
        knowledgeGain: 75,
        skillDevelopment: 70,
        practicalApplication: 65
      },
      teachingMethods: {
        lectures: { effectiveness: 75, engagement: 70 },
        discussions: { effectiveness: 80, engagement: 75 },
        exercises: { effectiveness: 85, engagement: 80 },
        projects: { effectiveness: 80, engagement: 85 }
      },
      recommendations: [
        'Increase interactive discussions',
        'Add more hands-on projects',
        'Provide timely feedback'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallEffectivenessFormatted: '75%',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultOrgLearningVelocity() {
    return {
      period: 'Q4 2023',
      overallVelocity: 65,
      departmentMetrics: {
        engineering: { velocity: 70, employees: 25, trend: 'stable' },
        marketing: { velocity: 60, employees: 15, trend: 'stable' },
        sales: { velocity: 65, employees: 20, trend: 'stable' },
        hr: { velocity: 55, employees: 10, trend: 'stable' }
      },
      skillDevelopment: {
        technicalSkills: 70,
        softSkills: 65,
        leadershipSkills: 60,
        industryKnowledge: 68
      },
      learningTrends: {
        onlineLearning: 75,
        instructorLed: 65,
        peerLearning: 55,
        selfDirected: 70
      },
      recommendations: [
        'Increase learning velocity across departments',
        'Expand peer learning programs',
        'Focus on leadership development'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallVelocityFormatted: '65%',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultStrategicAlignment() {
    return {
      period: 'Q4 2023',
      overallAlignment: 65,
      alignmentGrade: 'C',
      strategicGoals: [
        {
          goalId: 'goal-1',
          goalName: 'Digital Transformation',
          alignmentScore: 70,
          progress: 55,
          skillsCovered: 60,
          status: 'at_risk',
          requiredSkills: ['Digital Skills', 'Technology Adoption'],
          employeesOnTrack: 25,
          totalEmployeesNeeded: 40,
          recommendations: ['Invest in digital training', 'Provide technology support']
        }
      ],
      gapAnalysis: {
        criticalGaps: 8,
        mediumGaps: 15,
        lowGaps: 20,
        topMissingSkills: [
          { skill: 'Digital Skills', gap: 70, priority: 'critical' },
          { skill: 'Technology Adoption', gap: 65, priority: 'high' }
        ]
      },
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallAlignmentFormatted: '65%',
        alignmentGradeFormatted: 'C',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultLearningCulture() {
    return {
      period: 'Q4 2023',
      overallCultureScore: 70,
      cultureGrade: 'C',
      metrics: {
        learningEngagement: {
          score: 70,
          activeParticipation: 65,
          voluntaryLearning: 60,
          peerCollaboration: 55
        },
        knowledgeSharing: {
          score: 65,
          mentorshipPrograms: 8,
          activeMentors: 5,
          knowledgeBaseSessions: 15
        },
        innovationMetrics: {
          score: 60,
          newIdeasSubmitted: 25,
          ideasImplemented: 8,
          innovationProjects: 3
        },
        continuousImprovement: {
          score: 75,
          feedbackLoops: 20,
          courseCompletionTrend: 'stable',
          skillApplicationRate: 65
        }
      },
      culturalIndicators: {
        managerSupport: 70,
        learningTimeAllocation: 8,
        recognitionPrograms: 2,
        careerDevelopmentOpportunities: 75
      },
      benchmarks: {
        industryAverage: 70,
        vsIndustry: '0%',
        standing: 'Average'
      },
      recommendations: [
        'Increase peer-to-peer learning',
        'Expand mentorship programs',
        'Provide more learning time'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallCultureScoreFormatted: '70%',
        cultureGradeFormatted: 'C',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }

  getDefaultOrgPerformance() {
    return {
      period: 'Q4 2023',
      overallPerformance: 70,
      departmentPerformance: {
        engineering: { performance: 75, trend: 'stable' },
        marketing: { performance: 70, trend: 'stable' },
        sales: { performance: 72, trend: 'stable' },
        hr: { performance: 65, trend: 'stable' }
      },
      skillDevelopment: {
        technicalSkills: 70,
        softSkills: 65,
        leadershipSkills: 60,
        industryKnowledge: 68
      },
      learningOutcomes: {
        knowledgeRetention: 70,
        skillApplication: 65,
        performanceImprovement: 68,
        careerAdvancement: 60
      },
      recommendations: [
        'Focus on performance improvement',
        'Expand skill development programs',
        'Increase career advancement opportunities'
      ],
      lastUpdated: '2023-11-15T10:00:00Z',
      staleness: 'fallback',
      formattedData: {
        overallPerformanceFormatted: '70%',
        lastUpdatedFormatted: '15/11/2023'
      }
    };
  }
}

module.exports = AnalyticsProcessingService;