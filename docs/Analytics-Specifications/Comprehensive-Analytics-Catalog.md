# Learning Analytics Microservice - Comprehensive Analytics Catalog

**Version:** 2.0 (Complete with All 19 Analytics)  
**Date:** October 10, 2025  
**Status:** Implementation Ready  
**Total Analytics:** 19 Categories (AS-001 through AS-005)  
**Detailed Specifications:** 8 analytics fully documented below  
**Summary References:** 11 analytics summarized with implementation notes  
**Individual Metrics:** 75+ Across All Categories  
**Note:** Time-based cohort comparisons feature from AS-005 excluded due to external dependencies

---

## 📊 Overview

This document provides a **complete catalog of all 19 analytics** that the Learning Analytics Microservice should generate. 

**Document Structure:**
- **Fully Detailed (8 analytics):** Complete specifications with calculation methods, API formats, SQL schemas
- **Summary Reference (11 analytics):** Overview with data sources and implementation notes

**For detailed implementation of all 19 analytics, see:**
- Requirements: `00-Requirements/Learning-Analytics-Final-Requirements-v19.md` (AS-001 through AS-005)
- Storage: `03-Data-Schemas/01-STORAGE/Storage-Architecture-Complete.md`
- APIs: `02-API-Documentation/` folder

---

## 📋 Complete Analytics Index (All 19)

### **AS-001: Learner Analytics** (6 analytics)
| # | Analytics Name | Priority | Detailed Spec | Summary |
|---|----------------|----------|---------------|---------|
| 1 | Learning Velocity & Momentum | ⭐⭐⭐ HIGH | ✅ Below | - |
| 2 | Skill Gap Matrix with Prioritization | ⭐⭐⭐ HIGH | ✅ Below | - |
| 3 | Engagement Score with Behavioral Insights | ⭐⭐⭐ HIGH | ✅ Below | - |
| 4 | Mastery Progress Tracking | ⭐⭐⭐ HIGH | ✅ Below | - |
| 5 | Performance & Assessment Analytics | ⭐⭐ MEDIUM | - | ✅ Below |
| 6 | Course & Content Effectiveness | ⭐⭐ MEDIUM | - | ✅ Below |

### **AS-002: Trainer/Instructor Analytics** (4 analytics)
| # | Analytics Name | Priority | Detailed Spec | Summary |
|---|----------------|----------|---------------|---------|
| 7 | Course Performance Dashboard | ⭐⭐⭐ HIGH | - | ✅ Below |
| 8 | Course Health Dashboard | ⭐⭐⭐ HIGH | ✅ Below | - |
| 9 | Student Performance Distribution | ⭐⭐⭐ HIGH | - | ✅ Below |
| 10 | Teaching Effectiveness Metrics | ⭐⭐ MEDIUM | - | ✅ Below |

### **AS-003: Organizational Analytics** (4 analytics)
| # | Analytics Name | Priority | Detailed Spec | Summary |
|---|----------------|----------|---------------|---------|
| 11 | Organizational Learning Velocity | ⭐⭐⭐ HIGH | ✅ Below | - |
| 12 | Strategic Alignment Tracking | ⭐⭐⭐ HIGH | - | ✅ Below |
| 13 | Department & Team Analytics | ⭐⭐ MEDIUM | - | ✅ Below |
| 14 | Learning Culture Metrics | ⭐⭐ MEDIUM | - | ✅ Below |

### **AS-004: Predictive Analytics** (3 analytics)
| # | Analytics Name | Priority | Detailed Spec | Summary |
|---|----------------|----------|---------------|---------|
| 15 | Drop-Off Risk Prediction | ⭐⭐⭐ HIGH | ✅ Below | - |
| 16 | Learning Outcome Forecasting | ⭐⭐⭐ HIGH | - | ✅ Below |
| 17 | Personalized Recommendations (AI) | ⭐⭐⭐ HIGH | - | ✅ Below |

### **AS-005: Comparison & Benchmarking** (2 analytics)
| # | Analytics Name | Priority | Detailed Spec | Summary |
|---|----------------|----------|---------------|---------|
| 18 | Platform Skill Demand Analytics | ⭐⭐ MEDIUM | - | ✅ Below |
| 19 | Peer Comparison (Privacy-Preserved) | ⭐⭐ MEDIUM | ✅ Below | - |

**Total:** 19 analytics | **Detailed:** 8 | **Summary:** 11

---

## A. LEARNER ANALYTICS (Individual Performance)

### **1. Learning Velocity & Momentum**

**Priority:** ⭐⭐⭐ HIGH  
**User Roles:** Learner, Trainer (for their students), Org HR  
**Refresh Frequency:** Real-time with cache

#### **Purpose**
Track how fast a learner is progressing through their learning journey compared to their goals and peers.

#### **Data Sources**
- Course Builder MS: Module progress, time spent
- Learner AI MS: Learning path progress (topics completed vs total)
- DevLab MS: Topic levels, practice attempts
- Directory MS: Desired topics list

#### **Calculation Method**

```javascript
interface LearningVelocityCalculation {
  // Step 1: Calculate topics completed per time unit
  topicsCompletedLast7Days: number;
  topicsCompletedLast30Days: number;
  
  // Step 2: Calculate pace
  currentPace: number; // topics per week = topicsLast7Days * (7/7)
  averagePace: number; // topics per week = topicsLast30Days / 4.3
  
  // Step 3: Determine trend
  trend: 'accelerating' | 'steady' | 'decelerating' | 'stalled';
  // accelerating: currentPace > averagePace * 1.2
  // steady: currentPace between averagePace * 0.8 and 1.2
  // decelerating: currentPace < averagePace * 0.8
  // stalled: currentPace === 0 for 7+ days
  
  // Step 4: Compare to goal
  targetPace: number; // topics per week needed to meet deadline
  paceVariance: number; // (currentPace - targetPace) / targetPace * 100
  
  // Step 5: Predict completion
  remainingTopics: number;
  predictedCompletionDate: string; // based on averagePace
  onTrack: boolean; // predictedDate <= targetDate
}
```

#### **API Response Format**

```json
{
  "success": true,
  "data": {
    "learningVelocity": {
      "currentPace": 2.5,
      "averagePace": 1.8,
      "trend": "accelerating",
      "trendPercentage": "+38.9%",
      "comparisonToGoal": {
        "targetPace": 2.0,
        "variance": "+25%",
        "status": "ahead"
      },
      "predictions": {
        "remainingTopics": 15,
        "estimatedWeeksToComplete": 6,
        "predictedCompletionDate": "2025-02-15",
        "targetCompletionDate": "2025-03-01",
        "onTrack": true
      },
      "timeAnalysis": {
        "totalTimeSpent": "45.5 hours",
        "averageTimePerTopic": "3.2 hours",
        "efficientLearner": true
      },
      "momentum": {
        "score": 85,
        "description": "Strong momentum! You're learning faster than your average.",
        "recommendation": "Maintain current pace to finish 2 weeks early."
      }
    }
  },
  "meta": {
    "calculatedAt": "2024-12-20T10:00:00Z",
    "dataFreshness": "2 hours",
    "confidence": "high"
  }
}
```

#### **Dashboard Visualization**
- Line chart: Topics completed over time (weekly)
- Speedometer: Current pace vs target pace
- Progress bar: % to goal with predicted finish date
- Color indicators: Green (ahead), Yellow (on track), Red (behind)

#### **SQL Storage Schema**

```sql
CREATE TABLE learner_velocity_analytics (
  user_id UUID NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Pace metrics
  current_pace NUMERIC(5,2),
  average_pace NUMERIC(5,2),
  trend VARCHAR(20),
  trend_percentage NUMERIC(5,2),
  
  -- Goal comparison
  target_pace NUMERIC(5,2),
  pace_variance NUMERIC(5,2),
  status VARCHAR(20),
  
  -- Predictions
  remaining_topics INTEGER,
  predicted_completion_date DATE,
  on_track BOOLEAN,
  
  -- Time analysis
  total_time_spent NUMERIC(8,2),
  average_time_per_topic NUMERIC(5,2),
  
  -- Momentum
  momentum_score INTEGER,
  
  PRIMARY KEY (user_id, calculated_at),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_velocity_user_date ON learner_velocity_analytics(user_id, calculated_at DESC);
```

---

### **2. Skill Gap Matrix with Prioritization**

**Priority:** ⭐⭐⭐ HIGH  
**User Roles:** Learner, Trainer (for guidance), Org HR (team view)  
**Refresh Frequency:** Daily or on-demand

#### **Purpose**
Identify and prioritize skill gaps based on current level, target level, business priority, and market demand.

#### **Data Sources**
- Skills Engine MS: Current skill levels, target levels, skill demand data
- Assessment MS: Test scores mapped to skills
- Learner AI MS: Skills acquired from exams
- Directory MS: Value propositions (target skills with business justification)
- DevLab MS: Topic mastery levels

#### **Calculation Method**

```javascript
interface SkillGapCalculation {
  // Step 1: Identify all target skills
  targetSkills: Array<{
    skillId: string;
    skillName: string;
    targetLevel: number; // from Value Proposition or personal goal
  }>;
  
  // Step 2: Get current levels
  currentLevels: Map<string, number>; // from Skills Engine
  
  // Step 3: Calculate gaps
  skillGaps: Array<{
    skillId: string;
    currentLevel: number;
    targetLevel: number;
    gap: number; // targetLevel - currentLevel
    gapPercentage: number; // gap / targetLevel * 100
  }>;
  
  // Step 4: Prioritize gaps
  prioritizedGaps: Array<{
    skillId: string;
    priorityScore: number; // weighted score (0-100)
    factors: {
      gapSize: number; // larger gap = higher priority
      businessPriority: 'low' | 'medium' | 'high' | 'critical';
      marketDemand: number; // 0-100 from Skills Engine
      prerequisiteFor: string[]; // skills blocked by this gap
      careerImpact: number; // platform skill demand score (0-100)
    };
  }>;
  
  // Step 5: Generate action plan
  actionPlan: Array<{
    skillId: string;
    priority: number;
    estimatedTimeToClose: number; // hours
    recommendedCourses: string[];
    recommendedPractices: string[];
    nextMilestone: string;
  }>;
}
```

#### **Priority Scoring Algorithm**

```javascript
function calculatePriorityScore(gap: SkillGap): number {
  const weights = {
    gapSize: 0.25,
    businessPriority: 0.30,
    marketDemand: 0.20,
    prerequisiteCount: 0.15,
    careerImpact: 0.10
  };
  
  // Normalize each factor to 0-100
  const normalizedGapSize = (gap.gap / gap.targetLevel) * 100;
  const normalizedBusinessPriority = {
    'critical': 100,
    'high': 75,
    'medium': 50,
    'low': 25
  }[gap.businessPriority];
  const normalizedPrereqCount = Math.min(gap.prerequisiteFor.length * 20, 100);
  const normalizedCareerImpact = Math.min(gap.careerImpact * 5, 100);
  
  // Calculate weighted score
  const score = 
    (normalizedGapSize * weights.gapSize) +
    (normalizedBusinessPriority * weights.businessPriority) +
    (gap.marketDemand * weights.marketDemand) +
    (normalizedPrereqCount * weights.prerequisiteCount) +
    (normalizedCareerImpact * weights.careerImpact);
  
  return Math.round(score);
}
```

#### **API Response Format**

```json
{
  "success": true,
  "data": {
    "skillGapMatrix": {
      "summary": {
        "totalTargetSkills": 15,
        "skillsAcquired": 8,
        "skillsInProgress": 4,
        "skillsNotStarted": 3,
        "averageGap": 35,
        "criticalGaps": 2
      },
      "prioritizedGaps": [
        {
          "skillId": "skill_123",
          "skillName": "JavaScript ES6+",
          "currentLevel": 45,
          "targetLevel": 80,
          "gap": 35,
          "gapPercentage": 43.75,
          "priorityScore": 92,
          "priorityRank": 1,
          "factors": {
            "businessPriority": "critical",
            "businessJustification": "Required for upcoming React migration project",
            "marketDemand": 94,
            "marketTrend": "increasing",
            "salaryImpact": "+12%",
            "prerequisiteFor": ["React Advanced", "Node.js"],
            "blockedSkills": 2
          },
          "actionPlan": {
            "estimatedTimeToClose": "3-4 weeks",
            "estimatedHours": 25,
            "recommendedPath": [
              {
                "step": 1,
                "courseId": "course_456",
                "courseName": "Modern JavaScript Fundamentals",
                "duration": "2 weeks",
                "skillGain": "+15 levels"
              },
              {
                "step": 2,
                "courseId": "course_457",
                "courseName": "Advanced JavaScript Patterns",
                "duration": "1-2 weeks",
                "skillGain": "+20 levels"
              }
            ],
            "practices": [
              "Complete 10 ES6 challenges in DevLab",
              "Build 2 small projects using modern JS"
            ],
            "nextMilestone": "Complete async/await and promises module",
            "deadline": "2025-01-31"
          },
          "visualization": {
            "currentPosition": "Beginner-Intermediate boundary",
            "targetPosition": "Advanced",
            "progressBarPercentage": 56.25
          }
        }
      ],
      "skillsOnTrack": [
        {
          "skillName": "Python",
          "currentLevel": 75,
          "targetLevel": 80,
          "gap": 5,
          "status": "on_track",
          "estimatedCompletion": "2 weeks"
        }
      ],
      "skillsAchieved": [
        {
          "skillName": "HTML5",
          "achievedLevel": 90,
          "targetLevel": 80,
          "achievedDate": "2024-11-15",
          "daysToAchieve": 45
        }
      ]
    }
  },
  "meta": {
    "calculatedAt": "2024-12-20T10:00:00Z",
    "nextRecommendedAnalysis": "2024-12-27T10:00:00Z"
  }
}
```

#### **Dashboard Visualization**
- **Heat Map:** Skills matrix with color coding (Red=large gap, Yellow=medium, Green=achieved)
- **Priority List:** Top 5 gaps with action buttons
- **Radar Chart:** Current vs Target skill levels
- **Timeline:** Projected skill acquisition timeline

#### **SQL Storage Schema**

```sql
CREATE TABLE skill_gap_analytics (
  user_id UUID NOT NULL,
  skill_id VARCHAR(50) NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Levels
  current_level INTEGER,
  target_level INTEGER,
  gap INTEGER,
  gap_percentage NUMERIC(5,2),
  
  -- Priority
  priority_score INTEGER,
  priority_rank INTEGER,
  business_priority VARCHAR(20),
  market_demand INTEGER,
  market_trend VARCHAR(20),
  salary_impact NUMERIC(5,2),
  
  -- Action plan
  estimated_time_to_close INTEGER, -- hours
  recommended_courses JSONB,
  next_milestone TEXT,
  deadline DATE,
  
  -- Status
  status VARCHAR(20), -- not_started, in_progress, achieved
  
  PRIMARY KEY (user_id, skill_id, calculated_at)
);

CREATE INDEX idx_skill_gap_priority ON skill_gap_analytics(user_id, priority_rank, calculated_at DESC);
CREATE INDEX idx_skill_gap_status ON skill_gap_analytics(user_id, status);
```

---

### **3. Engagement Score with Behavioral Insights**

**Priority:** ⭐⭐⭐ HIGH  
**User Roles:** Learner, Trainer (monitor students), Org HR (team health)  
**Refresh Frequency:** Real-time

#### **Purpose**
Measure and analyze user engagement across multiple dimensions to identify at-risk learners and optimize learning schedules.

#### **Data Sources**
- Auth Service MS: Login sessions, frequency, duration, device info
- Content Studio MS: Content interactions, view duration, engagement
- Course Builder MS: Module progress, time spent per module
- RAG Assistant MS: Chatbot usage, help requests
- Assessment MS: Test attempts, time spent on assessments
- DevLab MS: Practice attempts, completion rates

#### **Calculation Method**

```typescript
interface EngagementScoreCalculation {
  // Step 1: Consistency (Login patterns)
  consistency: {
    loginFrequency: number; // logins per week
    activeStreakDays: number; // consecutive days active
    longestGapDays: number; // longest period without login
    consistencyScore: number; // 0-100
  };
  
  // Step 2: Time Investment
  timeInvestment: {
    totalHoursLast7Days: number;
    totalHoursLast30Days: number;
    averageSessionDuration: number; // minutes
    recommendedHoursPerWeek: number;
    hoursVsRecommended: number; // percentage
    investmentScore: number; // 0-100
  };
  
  // Step 3: Interaction Quality
  interactionQuality: {
    contentCompletionRate: number; // % of started content finished
    chatbotUsage: number; // help requests per week
    practiceAttempts: number;
    assessmentAttempts: number;
    meaningfulInteractions: number; // weighted sum
    qualityScore: number; // 0-100
  };
  
  // Step 4: Resource Usage Diversity
  resourceUsage: {
    contentTypesUsed: string[]; // video, article, interactive, etc.
    diversityScore: number; // 0-100
    preferredContentType: string;
    underutilizedResources: string[];
  };
  
  // Step 5: Behavioral Patterns
  behavioralPatterns: {
    peakLearningHours: string[]; // ["8-10 AM", "7-8 PM"]
    peakLearningDays: string[]; // ["Monday", "Wednesday"]
    preferredDevice: string; // desktop, mobile, tablet
    averageSessionsPerDay: number;
    learningStyle: 'visual' | 'reading' | 'interactive' | 'mixed';
    concentrationSpan: number; // minutes before engagement drops
  };
  
  // Step 6: Calculate overall engagement score
  overallScore: number; // weighted average of all scores
  
  // Step 7: Risk assessment
  riskAssessment: {
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    interventionRecommended: boolean;
    interventionType?: string;
  };
}
```

#### **Engagement Scoring Algorithm**

```typescript
function calculateEngagementScore(data: EngagementData): EngagementScore {
  const weights = {
    consistency: 0.30,
    timeInvestment: 0.25,
    interactionQuality: 0.25,
    resourceUsage: 0.20
  };
  
  // 1. Consistency Score (0-100)
  const consistencyScore = Math.min(
    (data.loginFrequency / 5) * 50 + // 5 logins/week = 50 points
    (data.activeStreakDays / 7) * 30 + // 7-day streak = 30 points
    (1 - Math.min(data.longestGapDays / 7, 1)) * 20, // no gap = 20 points
    100
  );
  
  // 2. Time Investment Score (0-100)
  const timeInvestmentScore = Math.min(
    (data.totalHoursLast7Days / data.recommendedHoursPerWeek) * 100,
    100
  );
  
  // 3. Interaction Quality Score (0-100)
  const interactionQualityScore = (
    (data.contentCompletionRate * 0.4) + // 40% weight
    (Math.min(data.chatbotUsage / 5, 1) * 20) + // help-seeking behavior
    (Math.min(data.practiceAttempts / 10, 1) * 20) + // practice engagement
    (Math.min(data.assessmentAttempts / 3, 1) * 20) // assessment participation
  );
  
  // 4. Resource Usage Score (0-100)
  const resourceUsageScore = (data.contentTypesUsed.length / 5) * 100; // 5 types max
  
  // 5. Overall weighted score
  const overallScore = Math.round(
    (consistencyScore * weights.consistency) +
    (timeInvestmentScore * weights.timeInvestment) +
    (interactionQualityScore * weights.interactionQuality) +
    (resourceUsageScore * weights.resourceUsage)
  );
  
  // 6. Risk assessment
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (overallScore < 50) riskLevel = 'high';
  else if (overallScore < 70) riskLevel = 'medium';
  
  return {
    overallScore,
    consistencyScore,
    timeInvestmentScore,
    interactionQualityScore,
    resourceUsageScore,
    riskLevel
  };
}
```

#### **API Response Format**

```json
{
  "success": true,
  "data": {
    "engagementAnalytics": {
      "overallScore": 78,
      "scoreGrade": "Good",
      "scoreTrend": "+5 from last week",
      "breakdowns": {
        "consistency": {
          "score": 85,
          "loginFrequency": 4.5,
          "loginFrequencyTarget": 5,
          "activeStreak": 12,
          "longestGap": 2,
          "insight": "Excellent consistency! You've been active 12 days in a row."
        },
        "timeInvestment": {
          "score": 72,
          "hoursLast7Days": 8.5,
          "hoursLast30Days": 32,
          "averageSessionDuration": 45,
          "recommendedHoursPerWeek": 10,
          "comparisonToRecommended": "-15%",
          "insight": "Consider adding 1.5 hours per week to reach your goal faster."
        },
        "interactionQuality": {
          "score": 75,
          "contentCompletionRate": 88,
          "chatbotInteractions": 3,
          "practiceAttempts": 8,
          "assessmentAttempts": 2,
          "meaningfulInteractions": 92,
          "insight": "High-quality engagement! You complete most content you start."
        },
        "resourceUsage": {
          "score": 80,
          "contentTypesUsed": ["video", "article", "interactive", "quiz"],
          "diversityScore": 80,
          "preferredContentType": "video",
          "underutilizedResources": ["podcast"],
          "insight": "Great content diversity. Consider trying podcast format."
        }
      },
      "behavioralPatterns": {
        "peakLearningTime": "8-10 AM",
        "peakLearningDays": ["Monday", "Wednesday", "Friday"],
        "preferredDevice": "desktop",
        "averageSessionsPerDay": 1.5,
        "learningStyle": "visual",
        "concentrationSpan": 45,
        "insights": [
          "You learn best in the morning",
          "Your concentration is optimal for 45-minute sessions",
          "Desktop usage correlates with higher completion rates"
        ],
        "recommendations": [
          "Schedule important modules for 8-10 AM",
          "Take 10-minute breaks every 45 minutes",
          "Use mobile for lighter review content"
        ]
      },
      "riskAssessment": {
        "riskLevel": "low",
        "riskScore": 22,
        "riskFactors": [],
        "interventionRecommended": false,
        "healthStatus": "Healthy engagement",
        "nextCheckIn": "2024-12-27T10:00:00Z"
      },
      "comparisonToPeers": {
        "yourScore": 78,
        "peerAverage": 72,
        "percentile": 68,
        "insight": "You're more engaged than 68% of similar learners"
      }
    }
  },
  "meta": {
    "calculatedAt": "2024-12-20T10:00:00Z",
    "basedOnDays": 30,
    "confidence": "high"
  }
}
```

#### **Dashboard Visualization**
- **Engagement Meter:** 0-100 score with color coding
- **Spider/Radar Chart:** 4 dimensions (consistency, time, quality, diversity)
- **Heatmap Calendar:** Daily activity over 30/90 days
- **Time-of-Day Chart:** When you're most active
- **Device Usage Pie Chart:** Desktop vs Mobile vs Tablet

---

### **4. Mastery Progress Tracking**

**Priority:** ⭐⭐⭐ HIGH  
**User Roles:** Learner (primary), Trainer (student monitoring)  
**Refresh Frequency:** After each assessment/practice

#### **Purpose**
Track progression toward mastery for each topic/skill, including practice performance and knowledge retention.

#### **Data Sources**
- DevLab MS: Topic levels, practice attempts, success rates
- Assessment MS: Test scores, question-level performance
- Learner AI MS: Learning path progress (topics completed)
- Skills Engine MS: Skill progression metrics
- Course Builder MS: Module completion, time spent

#### **Calculation Method**

```typescript
interface MasteryCalculation {
  // Mastery Level = weighted combination of:
  // 1. Assessment scores (40%)
  // 2. Practice performance (30%)
  // 3. Time efficiency (15%)
  // 4. Retention score (15%)
  
  masteryLevel: number; // 0-100
  
  // Mastery thresholds:
  // 0-30: Beginner
  // 31-60: Developing
  // 61-85: Proficient
  // 86-100: Master
}
```

#### **API Response Format**

```json
{
  "success": true,
  "data": {
    "masteryTracking": {
      "summary": {
        "topicsMastered": 15,
        "topicsInProgress": 5,
        "topicsNotStarted": 10,
        "overallMasteryScore": 72
      },
      "topicBreakdown": [
        {
          "topicId": "topic_123",
          "topicName": "JavaScript Async/Await",
          "masteryLevel": 85,
          "masteryGrade": "Proficient",
          "progressToMaster": 88,
          "practiceAttempts": 12,
          "successRate": 91,
          "averageScore": 87,
          "timeToMastery": "2 weeks",
          "timeSpent": "8.5 hours",
          "retentionScore": 88,
          "lastPracticeDate": "2024-12-19",
          "needsReview": false,
          "nextReviewDate": "2025-01-05",
          "milestones": [
            {
              "milestone": "Understood basic concepts",
              "achievedAt": "2024-12-01",
              "level": 40
            },
            {
              "milestone": "Applied in practice",
              "achievedAt": "2024-12-10",
              "level": 70
            },
            {
              "milestone": "Proficient level achieved",
              "achievedAt": "2024-12-18",
              "level": 85
            }
          ],
          "strengthAreas": [
            "Promise handling",
            "Error handling with try/catch"
          ],
          "improvementAreas": [
            "Parallel execution with Promise.all()"
          ],
          "recommendations": [
            "Practice 2 more advanced challenges",
            "Build a real-world async project"
          ]
        }
      ]
    }
  }
}
```

---

## B. TRAINER/INSTRUCTOR ANALYTICS

### **8. Course Health Dashboard**

**Priority:** ⭐⭐⭐ HIGH  
**User Roles:** Trainer (course creator)  
**Refresh Frequency:** Daily

#### **Purpose**
Comprehensive view of course performance, student satisfaction, and areas needing improvement.

#### **Data Sources**
- Course Builder MS: Enrollments, completions, module progress
- Assessment MS: Test scores, pass rates
- Directory MS: Course feedback, ratings
- Content Studio MS: Content engagement

#### **API Response Format**

```json
{
  "success": true,
  "data": {
    "courseHealth": {
      "courseId": "course_123",
      "courseName": "Full Stack Web Development",
      "overallHealth": "good",
      "healthScore": 78,
      "metrics": {
        "enrollments": {
          "total": 245,
          "active": 180,
          "trend": "+15% this month",
          "comparisonToAverage": "+8%"
        },
        "completion": {
          "rate": 68,
          "target": 75,
          "variance": "-7%",
          "averageTimeToComplete": "8.5 weeks",
          "targetTime": "8 weeks"
        },
        "satisfaction": {
          "averageRating": 4.3,
          "totalReviews": 87,
          "nps": 42,
          "satisfactionScore": 85,
          "ratingTrend": "+0.2 from last cohort"
        }
      },
      "dropOffAnalysis": {
        "overallDropOffRate": 32,
        "dropOffPoints": [
          {
            "moduleId": "module_5",
            "moduleName": "Advanced JavaScript",
            "dropOffRate": 35,
            "studentsDropped": 63,
            "avgProgressBeforeDrop": 45,
            "likelyReasons": [
              "Difficulty spike (30% of feedback)",
              "Unclear instructions (25% of feedback)",
              "Time commitment (20% of feedback)"
            ],
            "recommendedActions": [
              "Add prerequisite review module",
              "Create video walkthrough for complex concepts",
              "Break module into smaller sections",
              "Add more practice exercises with hints"
            ],
            "priority": "high"
          }
        ]
      },
      "contentPerformance": {
        "strugglingTopics": [
          {
            "topic": "Async Programming",
            "averageScore": 62,
            "passRate": 58,
            "averageAttempts": 2.3,
            "studentFeedback": "Needs more examples"
          }
        ],
        "highPerformanceTopics": [
          {
            "topic": "HTML/CSS Basics",
            "averageScore": 92,
            "passRate": 98,
            "averageAttempts": 1.1,
            "studentFeedback": "Clear and concise"
          }
        ]
      },
      "recommendations": [
        {
          "type": "content_improvement",
          "priority": "high",
          "suggestion": "Revise Module 5: Add scaffolding content",
          "expectedImpact": "Reduce drop-off by 15%"
        },
        {
          "type": "pacing",
          "priority": "medium",
          "suggestion": "Module 3 completion time is 30% longer than target",
          "expectedImpact": "Improve completion rate by 5%"
        }
      ]
    }
  }
}
```

---

## C. ORGANIZATIONAL ANALYTICS

### **12. Organizational Learning Velocity**

**Priority:** ⭐⭐⭐ HIGH  
**User Roles:** Org HR, Management  
**Refresh Frequency:** Daily

#### **Purpose**
Track organization-wide learning progress, ROI, and department-level performance.

#### **API Response Format**

```json
{
  "success": true,
  "data": {
    "orgLearningVelocity": {
      "organizationId": "org_456",
      "period": "Q4 2024",
      "overview": {
        "totalEmployees": 500,
        "activelyLearning": 450,
        "participationRate": 90,
        "averageCompletionRate": 68,
        "skillsAcquiredThisQuarter": 1247,
        "certificationsEarned": 89
      },
      "roiMetrics": {
        "trainingInvestment": 125000,
        "productivityGains": 340000,
        "roi": "172%",
        "calculationMethod": "Based on average salary increase and project completion velocity",
        "costPerSkillAcquired": 100.24,
        "averageTimeToSkill": "3.2 weeks"
      },
      "departmentBreakdown": [
        {
          "departmentId": "dept_engineering",
          "departmentName": "Engineering",
          "totalEmployees": 120,
          "activelyLearning": 110,
          "participationRate": 92,
          "completionRate": 75,
          "skillsAcquired": 456,
          "topSkills": [
            { "skill": "Python", "employeesWithSkill": 85 },
            { "skill": "AWS", "employeesWithSkill": 67 },
            { "skill": "Docker", "employeesWithSkill": 54 }
          ],
          "skillGapClosure": 65,
          "target": 75,
          "status": "on_track",
          "trend": "+10% from last quarter"
        }
      ],
      "trends": {
        "quarterOverQuarter": "+15%",
        "yearOverYear": "+42%",
        "peakLearningMonth": "November 2024"
      }
    }
  }
}
```

---

## D. PREDICTIVE & AI-POWERED ANALYTICS

### **16. Drop-Off Risk Prediction** (🆕 **UPDATED** Oct 10, 2025)

**Priority:** ⭐⭐⭐ HIGH  
**User Roles:** Learner (self-awareness), Trainer (intervention), Org HR  
**Refresh Frequency:** Daily or real-time  
**Approach:** Hybrid (Rule-Based + Gemini AI)

#### **Purpose**
Predict which learners are at risk of dropping out using a weighted rule-based scoring system enhanced with Gemini AI for personalized explanations and interventions.

#### **Algorithm Overview**

**Strategy:** Hybrid Approach
1. **Rule-Based Scoring** (Fast, < 50ms) - Calculate risk score using weighted factors
2. **Gemini AI Enhancement** (Smart, < 2s) - Generate personalized explanations and interventions
3. **Aggressive Caching** (48-hour TTL) - Cache AI responses for cost efficiency

**Why Hybrid?**
- ✅ Speed: Rule-based computation in < 50ms
- ✅ Cost: $0 (free Gemini tier with 70% cache hit rate)
- ✅ Explainability: Clear scoring breakdown + AI-enhanced explanations
- ✅ Actionability: AI generates personalized interventions
- ✅ Scalability: Works for 10K-100K users
- ✅ Accuracy: 75-80% (comparable to early-stage ML models)

#### **Weighted Risk Scoring Formula**

```
Risk Score = (Engagement × 0.40) + (Performance × 0.30) + (Behavioral × 0.20) + (Progress × 0.10)

Maximum Score: 100 points (Higher = Higher Risk)
```

#### **Factor Breakdown & Point Allocation**

**A. Engagement Factors (40% weight) - 40 points maximum**

| Factor | Weight | Points | Thresholds | Logic |
|--------|--------|--------|------------|-------|
| **Days Since Last Login** | 37.5% | 0-15 pts | >14 days = 15 pts<br>7-14 days = 10 pts<br>3-7 days = 5 pts<br><3 days = 0 pts | More days inactive = higher risk |
| **Login Frequency** | 37.5% | 0-15 pts | <2/month = 15 pts<br>2-4/month = 10 pts<br>4-8/month = 5 pts<br>>8/month = 0 pts | Less frequent logins = higher risk |
| **Avg Session Duration** | 25% | 0-10 pts | <5 min = 10 pts<br>5-15 min = 5 pts<br>15-30 min = 2 pts<br>>30 min = 0 pts | Shorter sessions = higher risk |

**B. Performance Factors (30% weight) - 30 points maximum**

| Factor | Weight | Points | Thresholds | Logic |
|--------|--------|--------|------------|-------|
| **Average Score** (recent 5 tests) | 50% | 0-15 pts | <50% = 15 pts<br>50-70% = 10 pts<br>70-85% = 5 pts<br>>85% = 0 pts | Lower scores = higher risk |
| **Score Decline Trend** | 50% | 0-15 pts | Declining >10% = 15 pts<br>Declining 5-10% = 10 pts<br>Flat (±5%) = 5 pts<br>Improving = 0 pts | Declining performance = higher risk |

**C. Behavioral Factors (20% weight) - 20 points maximum**

| Factor | Weight | Points | Thresholds | Logic |
|--------|--------|--------|------------|-------|
| **Content Completion Rate** | 50% | 0-10 pts | <30% = 10 pts<br>30-50% = 7 pts<br>50-70% = 4 pts<br>>70% = 0 pts | Lower completion = higher risk |
| **Help Request Frequency** | 50% | 0-10 pts | 0 requests = 10 pts<br>1-2 = 5 pts<br>3-5 = 2 pts<br>>5 = 0 pts | No help-seeking = higher risk (isolation) |

**D. Progress Factors (10% weight) - 10 points maximum**

| Factor | Weight | Points | Thresholds | Logic |
|--------|--------|--------|------------|-------|
| **Progress Rate** | 100% | 0-10 pts | <20% = 10 pts<br>20-40% = 7 pts<br>40-60% = 4 pts<br>>60% = 0 pts | Slower progress = higher risk |

#### **Risk Level Classification**

| Risk Score | Risk Level | Color | Action Required | Typical Interventions |
|------------|------------|-------|-----------------|----------------------|
| **75-100** | 🔴 **CRITICAL** | Red | Immediate intervention within 24 hours | 1-on-1 meeting, personalized learning plan, extended deadline |
| **50-74** | 🟠 **HIGH** | Orange | Proactive outreach within 48 hours | Check-in email, offer tutoring, review content difficulty |
| **25-49** | 🟡 **MEDIUM** | Yellow | Monitor closely, gentle nudges | Weekly progress email, motivational messages |
| **0-24** | 🟢 **LOW** | Green | Continue normal engagement | Positive reinforcement, acknowledge progress |

#### **Calculation Method**

```typescript
interface DropOffRiskCalculation {
  // Step 1: Calculate risk factors from raw data
  riskFactors: {
    // Engagement (40% weight)
    daysSinceLastLogin: number;      // Days since last session
    loginFrequency: number;          // Logins per month
    avgSessionDuration: number;      // Minutes per session
    
    // Performance (30% weight)
    avgScore: number;                // Average of last 5 tests (%)
    scoreDecline: boolean;           // True if declining trend
    
    // Behavioral (20% weight)
    contentCompletionRate: number;   // % of content completed
    helpRequestFrequency: number;    // RAG interactions count
    
    // Progress (10% weight)
    progressRate: number;            // % of course completed
  };
  
  // Step 2: Calculate weighted risk score
  riskScore: number; // 0-100
  
  // Step 3: Classify risk level
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Step 4: Generate rule-based interventions
  interventions: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    reasoning: string;
  }>;
  
  // Step 5: Get Gemini AI explanation (cached)
  aiExplanation: {
    summary: string;                 // 2-3 sentence explanation
    personalizedAdvice: string;      // Contextual recommendations
    predictedOutcome: string;        // What happens if no action taken
  };
}
```

#### **Intervention Generation Rules**

| Trigger Condition | Intervention | Priority | Action |
|-------------------|-------------|----------|---------|
| Days since last login > 14 | "Send re-engagement email" | HIGH | Automated email with login link |
| Days since last login > 7 | "Send gentle reminder" | MEDIUM | Push notification or SMS |
| Avg score < 60% | "Offer tutoring sessions" | HIGH | Schedule 1-on-1 with trainer |
| Score declining > 10% | "Review content difficulty" | MEDIUM | Suggest prerequisite materials |
| Completion rate < 50% | "Check content difficulty" | MEDIUM | Offer alternative content format |
| Progress rate < 30% | "Set up check-in meeting" | HIGH | Schedule call with trainer |
| Help requests = 0 | "Encourage help-seeking" | LOW | Introduce chatbot/support resources |
| Risk score ≥ 75 | "Immediate intervention" | CRITICAL | Manual outreach by trainer/HR |

#### **API Response Format**

```json
{
  "success": true,
  "data": {
    "dropOffRiskPrediction": {
      "userId": "user_123",
      "courseId": "course_456",
      "computedAt": "2025-10-10T14:30:00Z",
      
      "riskScore": 72,
      "riskLevel": "high",
      "riskLevelColor": "orange",
      
      "riskFactors": {
        "engagement": {
          "score": 28,
          "maxScore": 40,
          "contribution": "28%",
          "factors": {
            "daysSinceLastLogin": { "value": 12, "points": 10, "threshold": ">14 days" },
            "loginFrequency": { "value": 3, "points": 10, "threshold": "<2/month" },
            "avgSessionDuration": { "value": 8, "points": 8, "threshold": "<5 min" }
          }
        },
        "performance": {
          "score": 22,
          "maxScore": 30,
          "contribution": "22%",
          "factors": {
            "avgScore": { "value": 58, "points": 12, "threshold": "<60%" },
            "scoreDecline": { "value": true, "points": 10, "threshold": "declining >10%" }
          }
        },
        "behavioral": {
          "score": 14,
          "maxScore": 20,
          "contribution": "14%",
          "factors": {
            "contentCompletionRate": { "value": 0.35, "points": 7, "threshold": "<50%" },
            "helpRequestFrequency": { "value": 1, "points": 7, "threshold": "1-2 requests" }
          }
        },
        "progress": {
          "score": 8,
          "maxScore": 10,
          "contribution": "8%",
          "factors": {
            "progressRate": { "value": 0.28, "points": 8, "threshold": "<30%" }
          }
        }
      },
      
      "interventions": [
        {
          "action": "Schedule 1-on-1 with trainer",
          "priority": "high",
          "reasoning": "Your recent test scores have declined >10%, indicating potential content difficulty",
          "estimatedImpact": "High - Personalized support often improves outcomes by 40%"
        },
        {
          "action": "Send re-engagement email",
          "priority": "high",
          "reasoning": "You haven't logged in for 12 days, which increases dropout risk significantly",
          "estimatedImpact": "Medium - Re-engagement emails recover 25% of at-risk learners"
        },
        {
          "action": "Offer alternative content format",
          "priority": "medium",
          "reasoning": "Your content completion rate is low (35%), suggesting format mismatch",
          "estimatedImpact": "Medium - Alternative formats improve completion by 30%"
        }
      ],
      
      "aiExplanation": {
        "summary": "Your dropout risk is HIGH (72/100) primarily due to declining engagement and performance. You haven't logged in for 12 days and your recent test scores have dropped by 15%.",
        "personalizedAdvice": "We recommend: 1) Schedule a 1-on-1 session with your trainer to review Module 3 (where you scored lowest), 2) Set a weekly learning goal of 3 logins per week, 3) Try video-based content instead of text (based on your learning preferences). These actions typically reduce dropout risk by 50-60%.",
        "predictedOutcome": "If no action is taken, historical data suggests a 75% probability of course dropout within 3 weeks. However, with intervention, this can be reduced to <30%.",
        "motivationalMessage": "You've completed 28% of the course - you're over a quarter of the way there! With focused support, you can absolutely succeed."
      },
      
      "historicalTrend": [
        { "date": "2025-09-10", "riskScore": 32, "riskLevel": "medium" },
        { "date": "2025-09-24", "riskScore": 48, "riskLevel": "medium" },
        { "date": "2025-10-10", "riskScore": 72, "riskLevel": "high" }
      ],
      
      "metadata": {
        "modelVersion": "hybrid-v1.0",
        "confidenceScore": 0.82,
        "dataCompletenessScore": 0.95,
        "lastUpdated": "2025-10-10T14:30:00Z",
        "cacheHit": false,
        "computationTime": "48ms"
      }
    }
  }
}
```

#### **Gemini AI Integration**

**Cache Strategy:**
- **Cache Key:** `dropoff:${userId}:${MD5(JSON.stringify(riskFactors)).substring(0, 8)}`
- **Cache TTL:** 48 hours
- **Cache Hit Rate Target:** >70%
- **Queue Processing:** 1 request every 1.2 seconds (50 req/min compliance)

**Gemini Prompt Template:**

```
You are an educational analytics AI assistant helping predict student dropout risk.

**Context:**
- Student: ${userId}
- Course: ${courseId}
- Risk Score: ${riskScore}/100 (${riskLevel})

**Risk Factors:**
- Engagement: ${engagementDetails}
- Performance: ${performanceDetails}
- Behavioral: ${behavioralDetails}
- Progress: ${progressDetails}

**Task:** Generate:
1. A 2-3 sentence summary explaining the risk level
2. Personalized advice (3-5 specific actionable recommendations)
3. Predicted outcome if no action taken (be realistic but motivational)
4. A brief motivational message acknowledging their progress

**Tone:** Supportive, actionable, non-judgmental, data-driven
**Length:** Summary (50 words max), Advice (100 words max), Outcome (50 words), Motivation (30 words)
```

**Response Validation:**
- Ensure all required fields present
- Check response length limits
- Filter inappropriate content
- Fallback to rule-based text if AI fails

**Performance:**
- Cache hit: <10ms
- Cache miss: <2 seconds (including API call)
- Fallback (if AI unavailable): <50ms (rule-based text)
        },
        {
          "factor": "Content completion rate drop",
          "contribution": 20,
          "currentValue": "45% (was 85%)",
          "threshold": "≥70%",
          "trend": "declining"
        },
        {
          "factor": "Progress rate below target",
          "contribution": 10,
          "currentValue": "1 topic/2 weeks",
          "threshold": "≥2 topics/week",
          "trend": "slow"
        }
      ],
      "recommendedInterventions": [
        {
          "type": "trainer_outreach",
          "priority": 1,
          "description": "Schedule 1-on-1 session with trainer",
          "expectedImpact": "Reduce risk by 30%",
          "urgency": "within 3 days",
          "template": "Personalized email with encouraging message"
        },
        {
          "type": "content_adjustment",
          "priority": 2,
          "description": "Recommend easier prerequisite content",
          "expectedImpact": "Reduce risk by 20%",
          "urgency": "immediate",
          "suggestedContent": ["course_101", "course_102"]
        },
        {
          "type": "peer_support",
          "priority": 3,
          "description": "Connect with study group or mentor",
          "expectedImpact": "Reduce risk by 15%",
          "urgency": "within 1 week"
        },
        {
          "type": "motivation_boost",
          "priority": 4,
          "description": "Send progress celebration and milestone reminder",
          "expectedImpact": "Reduce risk by 10%",
          "urgency": "immediate"
        }
      ],
      "historicalComparison": {
        "similarLearnersDropOffRate": 45,
        "yourRiskIsHigherThan": "65% of similar learners",
        "ifNoIntervention": "75% probability of drop-off"
      }
    }
  },
  "meta": {
    "modelVersion": "v2.3",
    "trainedOn": "50,000 learner journeys",
    "accuracy": "87%",
    "lastUpdated": "2024-12-01"
  }
}
```

---

## E. COMPARISON & BENCHMARKING ANALYTICS

### **19. Peer Comparison (Privacy-Preserved)**

**Priority:** ⭐⭐ MEDIUM  
**User Roles:** Learner (motivation), Trainer (context), Org HR (benchmarking)  
**Refresh Frequency:** Weekly

#### **Purpose**
Compare individual performance against similar learners while preserving privacy through aggregation.

#### **API Response Format**

```json
{
  "success": true,
  "data": {
    "peerComparison": {
      "userId": "user_123",
      "myMetrics": {
        "overallProgress": 65,
        "averageScore": 82,
        "learningPace": 2.5,
        "engagementScore": 78,
        "skillsAcquired": 12
      },
      "comparisonGroups": {
        "sameOrganization": {
          "groupSize": 45,
          "averageProgress": 62,
          "averageScore": 78,
          "averagePace": 2.1,
          "myPercentile": 72,
          "myRank": "15th out of 45",
          "insight": "You're progressing faster than 72% of your colleagues"
        },
        "sameLearningPath": {
          "groupSize": 450,
          "averageProgress": 55,
          "averageScore": 75,
          "averagePace": 1.8,
          "myPercentile": 85,
          "myRank": "68th out of 450",
          "insight": "You're in the top 15% of Full Stack learners"
        },
        "sameExperienceLevel": {
          "groupSize": 340,
          "averageProgress": 60,
          "averageScore": 77,
          "averagePace": 2.0,
          "myPercentile": 68,
          "myRank": "109th out of 340",
          "insight": "Above average for learners with 2-3 years experience"
        }
      },
      "strengthsComparedToPeers": [
        {
          "metric": "Learning Pace",
          "yourValue": 2.5,
          "peerAverage": 1.9,
          "percentageBetter": "+31%",
          "insight": "You're learning significantly faster"
        },
        {
          "metric": "Consistency",
          "yourValue": 85,
          "peerAverage": 72,
          "percentageBetter": "+18%",
          "insight": "Your login consistency is excellent"
        }
      ],
      "areasToImprove": [
        {
          "metric": "Assessment Scores",
          "yourValue": 82,
          "topPerformersAverage": 92,
          "gap": -10,
          "suggestion": "Focus on test preparation strategies"
        }
      ],
      "visualization": {
        "type": "radar_chart",
        "dataPoints": [
          { "dimension": "Progress", "you": 65, "peers": 58 },
          { "dimension": "Scores", "you": 82, "peers": 77 },
          { "dimension": "Pace", "you": 2.5, "peers": 1.9 },
          { "dimension": "Engagement", "you": 78, "peers": 72 },
          { "dimension": "Skills", "you": 12, "peers": 9 }
        ]
      },
      "privacyNote": "All peer data is aggregated and anonymized. Individual identities are never disclosed."
    }
  }
}
```

---

## 📝 Summary Reference: Additional Analytics (11 More)

The following 11 analytics are **summarized here** with implementation notes. Full specifications available in the requirements document.

---

### **5. Performance & Assessment Analytics** ⭐⭐⭐ **DETAILED SPECIFICATION**

**Priority:** ⭐⭐⭐ HIGH (🆕 **ELEVATED** - critical for learner insights)  
**User Roles:** Learner, Trainer (for their students), Org HR  
**Refresh Frequency:** Real-time on new assessment completion

#### **Purpose**
Provide comprehensive assessment performance analytics with trend analysis, improvement tracking, and predictive insights for learning effectiveness.

#### **Data Sources**
- **Assessment MS:** Test scores, attempts, completion times, question-level analytics
- **DevLab MS:** Practice results, readiness scores, topic-level performance  
- **Course Builder MS:** Module assessments, quiz performance, assignment grades
- **Skills Engine MS:** Skill-to-assessment mapping for competency analysis

#### **Calculation Method**

```typescript
interface PerformanceAnalyticsCalculation {
  // Step 1: Aggregate assessment data
  totalAssessments: number;
  completedAssessments: number;
  pendingAssessments: number;
  
  // Step 2: Score calculations  
  overallAverageScore: number;        // Average of all completed assessments
  recentAverageScore: number;         // Average of last 5 assessments
  bestScore: number;                  // Highest score achieved
  worstScore: number;                 // Lowest score achieved
  
  // Step 3: Pass rate analysis
  passThreshold: number;              // Configurable, default 70%
  totalPassed: number;                // Assessments with score >= passThreshold
  totalFailed: number;                // Assessments with score < passThreshold
  passRate: number;                   // (totalPassed / completedAssessments) * 100
  
  // Step 4: Improvement trend analysis
  improvementTrend: 'improving' | 'declining' | 'stable';
  trendStrength: number;              // 0-1 confidence in trend direction
  scoreProgression: number[];         // Last 10 assessment scores chronologically
  
  // Step 5: Performance by category
  topicPerformance: Array<{
    topicId: string;
    topicName: string;
    averageScore: number;
    assessmentCount: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  
  // Step 6: Time efficiency metrics
  averageCompletionTime: number;      // Minutes per assessment
  timeEfficiencyRatio: number;        // User time vs platform average
  quickestCompletion: number;         // Fastest assessment completion (minutes)
  
  // Step 7: Retry patterns
  retryRate: number;                  // Percentage of assessments retaken
  retrySuccessRate: number;           // Success rate on retries
  averageAttemptsToPass: number;      // Average attempts needed to pass
  
  // Step 8: Predictive insights
  projectedNextScore: number;         // ML-predicted next assessment score
  riskLevel: 'low' | 'medium' | 'high'; // Drop-off risk based on performance
  recommendedStudyTime: number;       // Hours recommended before next assessment
}

// Core calculation functions
function calculateTrendDirection(scores: number[]): 'improving' | 'declining' | 'stable' {
  if (scores.length < 3) return 'stable';
  
  // Linear regression slope calculation
  const n = scores.length;
  const x = Array.from({length: n}, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b);
  const sumY = scores.reduce((a, b) => a + b);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * scores[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  if (slope > 2) return 'improving';
  if (slope < -2) return 'declining';
  return 'stable';
}

function predictNextScore(scores: number[]): number {
  if (scores.length < 3) return scores[scores.length - 1] || 0;
  
  // Moving average with trend adjustment
  const recentAvg = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const trend = calculateTrendDirection(scores);
  
  if (trend === 'improving') return Math.min(100, recentAvg + 5);
  if (trend === 'declining') return Math.max(0, recentAvg - 5);
  return recentAvg;
}
```

#### **Database Schema**

```sql
-- Analytics storage
INSERT INTO user_analytics (
  user_id, user_role, analytics_type, data, computed_at, expires_at
) VALUES (
  $1, $2, 'performance_analytics',
  jsonb_build_object(
    'overallAverageScore', $3,
    'recentAverageScore', $4,
    'passRate', $5,
    'improvementTrend', $6,
    'topicPerformance', $7::jsonb,
    'timeEfficiency', $8::jsonb,
    'retryPatterns', $9::jsonb,
    'predictiveInsights', $10::jsonb
  ),
  NOW(), NOW() + INTERVAL '4 hours'
);
```

#### **API Response Format**

```json
{
  "analyticsType": "performance_analytics",
  "userId": "user-123",
  "data": {
    "overview": {
      "totalAssessments": 25,
      "overallAverageScore": 78.5,
      "passRate": 86.4,
      "improvementTrend": "improving"
    },
    "performance": {
      "bestScore": 95,
      "scoreProgression": [65, 70, 75, 78, 82, 85, 88, 90, 92, 95]
    },
    "topicBreakdown": [
      {
        "topicName": "JavaScript Fundamentals",
        "averageScore": 88.5,
        "trend": "improving"
      }
    ],
    "predictions": {
      "projectedNextScore": 88,
      "riskLevel": "low",
      "recommendedStudyTime": 4
    }
  }
}
```

#### **Performance Targets**
- **Calculation Time:** < 200ms for complete analysis
- **API Response:** < 300ms total
- **Cache Hit Rate:** > 85% (4-hour TTL)

---

### **6. Course & Content Effectiveness** ⭐⭐⭐ **DETAILED SPECIFICATION** (AS-001: Learner; AS-002: Trainer; AS-003: Org)

**Priority:** ⭐⭐ MEDIUM  
**Audience:**
- Learner: which content helps me most
- Trainer: which content in my course is most/least effective
- Org HR: effectiveness across company courses and formats

**Purpose:** Measure which content types and formats lead to the best learning outcomes and inform improvements at learner, course, and org levels.

**Data Sources:**
- Content Studio MS: Content usage, engagement, content type (video/article/interactive), creation method (manual/AI)
- Assessment MS: Pre/post assessments per content/module
- Course Builder MS: Completion rates by content type and by course/module

**Filters**
- `dateRange` (required)
- `courseId` (trainer/org) or `userId` (learner)
- `moduleId` (optional)
- `contentType` (optional: video|article|interactive|other)
- `creationMethod` (optional: manual|ai)

**KPIs & Metrics (by role)**
- Learner: `effectivenessByType[]` (avg post score), `engagementToScoreCorrelation` (r), `topContent`, `lowContent`
- Trainer: `effectSizeByContent[]` (pre→post delta, Cohen’s d), `completionByFormat`, `flaggedLowEffectivenessContent[]`
- Org: `formatEffectivenessIndex`, `aiVsManualDelta`, `courseEffectivenessRanking`

**Calculation Method**
```typescript
interface ContentEffectiveness {
  scope: 'learner'|'trainer'|'org';
  dateRange: { start: string; end: string };
  effectivenessByType?: Array<{ type: string; avgScore: number; count: number }>;
  effectSizeByContent?: Array<{ contentId: string; title: string; delta: number; effectSize: number; type: string; method: 'manual'|'ai' }>;
  completionByFormat?: Array<{ type: string; completionPct: number }>;
  formatEffectivenessIndex?: Array<{ type: string; index: number }>;
  aiVsManualDelta?: { delta: number }; // avg(ai) - avg(manual)
}

function cohenD(pre: number[], post: number[]): number { /* as in #10 */ return 0; }
function corr(x: number[], y: number[]): number { /* Pearson r */ return 0; }
```

**Database & Caching**
- Sources: `cache_content_studio_usage` (contentId, type, method, time), `cache_assessment_grades` (pre/post per content/module), `cache_course_builder_completions`
- Views: `mv_content_effectiveness_by_type`, `mv_content_effect_size_by_content`
- Cache TTLs: Learner 4h; Trainer 2h; Org 6h
- Cache key: `content:eff:${scope}:${id}:${start}:${end}:${moduleId||'all'}:${contentType||'all'}:${creationMethod||'all'}`

**RBAC**
- Learner: only own usage/outcomes
- Trainer: only their courses’ content
- Org HR: only org-owned courses/content

**API**
GET `/api/v1/analytics/{scope}/{id}/content-effectiveness?start=YYYY-MM-DD&end=YYYY-MM-DD&courseId=...&moduleId=...&contentType=...&creationMethod=...`

**Response Example (trainer):**
```json
{
  "analyticsType": "content_effectiveness",
  "scope": "trainer",
  "trainerId": "trainer-456",
  "courseId": "course-789",
  "dateRange": { "start": "2025-10-01", "end": "2025-10-31" },
  "effectSizeByContent": [
    { "contentId": "c1", "title": "State Management Deep Dive", "delta": 9.2, "effectSize": 0.7, "type": "video", "method": "manual" }
  ],
  "completionByFormat": [ { "type": "video", "completionPct": 82.3 } ],
  "insights": [
    "Interactive labs show highest effect size; increase lab coverage",
    "AI-generated content underperforms manual by 3.2 points in this course"
  ]
}
```

**Performance Targets**
- Cache hit < 50ms; miss < 300ms (aggregations)

**RBAC & Caching**
- Learner TTL 4h; Trainer TTL 2h; Org TTL 6h. Access limited to own scope (trainer→own courses; org HR→own org).

---

### **7. Course Performance Dashboard** ⭐⭐⭐ **DETAILED SPECIFICATION**

**Priority:** ⭐⭐⭐ HIGH  
**User Roles:** Trainer (for their courses), Org HR (organizational overview)  
**Refresh Frequency:** Hourly for active courses, daily for all courses

#### **Purpose**
Provide trainers with comprehensive course performance analytics including enrollment trends, completion metrics, student engagement, and comparative benchmarks for course optimization.

#### **Data Sources**
- **Course Builder MS:** Enrollments, completions, dropout rates, module progress, time spent
- **Directory MS:** Course ratings, reviews, feedback, trainer profiles
- **Assessment MS:** Course-level assessment performance, pass rates, attempt patterns
- **Auth Service MS:** Student login patterns, session engagement within courses

#### **Calculation Method**

```typescript
interface CoursePerformanceDashboard {
  // Step 1: Course overview metrics
  courseInfo: {
    courseId: string;
    courseName: string;
    trainerId: string;
    trainerName: string;
    createdDate: string;
    lastUpdated: string;
    isActive: boolean;
  };
  
  // Step 2: Enrollment analytics
  enrollment: {
    totalEnrollments: number;           // All-time enrollments
    activeStudents: number;             // Currently active (last 30 days)
    newEnrollmentsLast30Days: number;   // Recent growth
    enrollmentTrend: 'growing' | 'stable' | 'declining';
    enrollmentGrowthRate: number;       // Percentage change from previous period
  };
  
  // Step 3: Completion metrics
  completion: {
    totalCompletions: number;           // Students who completed the course
    completionRate: number;             // completions / enrollments * 100
    averageCompletionTime: number;      // Days from enrollment to completion
    dropoutRate: number;                // Students who stopped without completing
    dropoutStage: string;               // Most common dropout point (module name)
  };
  
  // Step 4: Engagement analytics
  engagement: {
    averageSessionDuration: number;     // Minutes per session
    averageWeeklyActivity: number;      // Hours per week students spend
    contentCompletionRate: number;      // Percentage of content consumed
    forumParticipation: number;         // Posts/comments per student
    lastActivityDate: string;           // Most recent student activity
  };
  
  // Step 5: Academic performance
  performance: {
    averageCourseScore: number;         // Mean of all student scores
    passRate: number;                   // Students passing course requirements
    assessmentCompletionRate: number;   // Percentage completing all assessments
    topPerformingModule: string;        // Module with highest scores
    strugglingModule: string;           // Module with lowest scores/highest dropouts
  };
  
  // Step 6: Feedback & ratings
  feedback: {
    averageRating: number;              // 1-5 star rating
    totalReviews: number;               // Number of reviews
    ratingTrend: 'improving' | 'declining' | 'stable';
    sentimentScore: number;             // Positive feedback percentage
    commonFeedbackThemes: string[];     // Top 3 feedback categories
  };
  
  // Step 7: Comparative benchmarks
  benchmarks: {
    platformAverageCompletion: number;  // Platform average completion rate
    categoryAverageRating: number;      // Average rating in course category
    rankInCategory: number;             // Course rank in its category
    performanceVsPeers: 'above' | 'average' | 'below';
  };
  
  // Step 8: Predictive insights
  predictions: {
    projectedCompletions: number;       // Expected completions next 30 days
    atRiskStudents: number;             // Students likely to drop out
    potentialEnrollments: number;       // Projected new enrollments
    recommendedActions: string[];       // AI-generated improvement suggestions
  };
}

// Core calculation functions
function calculateEnrollmentTrend(enrollmentHistory: number[]): 'growing' | 'stable' | 'declining' {
  if (enrollmentHistory.length < 2) return 'stable';
  
  const recent = enrollmentHistory.slice(-3);
  const earlier = enrollmentHistory.slice(-6, -3);
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  
  const growthRate = ((recentAvg - earlierAvg) / earlierAvg) * 100;
  
  if (growthRate > 10) return 'growing';
  if (growthRate < -10) return 'declining';
  return 'stable';
}

function identifyDropoutStage(students: any[]): string {
  const dropoutCounts = new Map();
  
  students
    .filter(s => s.status === 'dropped_out')
    .forEach(student => {
      const lastModule = student.progressData.lastCompletedModule;
      dropoutCounts.set(lastModule, (dropoutCounts.get(lastModule) || 0) + 1);
    });
  
  return Array.from(dropoutCounts.entries())
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Early modules';
}

function calculateSentimentScore(reviews: any[]): number {
  if (!reviews.length) return 0;
  
  const positiveWords = ['great', 'excellent', 'amazing', 'helpful', 'clear', 'informative'];
  const negativeWords = ['difficult', 'confusing', 'boring', 'hard', 'unclear', 'slow'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  reviews.forEach(review => {
    const text = review.comment.toLowerCase();
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });
  });
  
  const totalSentiment = positiveCount + negativeCount;
  return totalSentiment > 0 ? (positiveCount / totalSentiment) * 100 : 50;
}

function identifyAtRiskStudents(students: any[]): number {
  return students.filter(student => {
    const daysSinceLastActivity = (Date.now() - new Date(student.lastActivity).getTime()) / (1000 * 60 * 60 * 24);
    const progressRate = student.completedModules / student.totalModules;
    const averageScore = student.assessmentScores.reduce((a, b) => a + b, 0) / student.assessmentScores.length;
    
    // Risk criteria
    return daysSinceLastActivity > 7 || // Inactive for a week
           progressRate < 0.3 ||        // Less than 30% progress
           averageScore < 60;           // Poor performance
  }).length;
}
```

#### **Database Schema**

```sql
-- Course performance analytics storage
INSERT INTO user_analytics (
  user_id, user_role, analytics_type, data, computed_at, expires_at
) VALUES (
  $1, 'trainer', 'course_performance_dashboard',
  jsonb_build_object(
    'courseId', $2,
    'enrollment', $3::jsonb,
    'completion', $4::jsonb,
    'engagement', $5::jsonb,
    'performance', $6::jsonb,
    'feedback', $7::jsonb,
    'benchmarks', $8::jsonb,
    'predictions', $9::jsonb,
    'lastUpdated', NOW()
  ),
  NOW(), NOW() + INTERVAL '2 hours'
);

-- Query for course performance
SELECT 
  data->>'courseId' as course_id,
  data->'enrollment' as enrollment_metrics,
  data->'completion' as completion_metrics,
  data->'performance'->>'averageCourseScore' as avg_score,
  data->'feedback'->>'averageRating' as avg_rating,
  computed_at
FROM user_analytics 
WHERE user_id = $1 
  AND user_role = 'trainer'
  AND analytics_type = 'course_performance_dashboard'
  AND data->>'courseId' = $2
  AND expires_at > NOW()
ORDER BY computed_at DESC LIMIT 1;
```

#### **API Response Format**

```json
{
  "analyticsType": "course_performance_dashboard",
  "trainerId": "trainer-456",
  "courseId": "course-789",
  "data": {
    "courseInfo": {
      "courseName": "Advanced React Development",
      "trainerName": "Jane Smith",
      "isActive": true
    },
    "enrollment": {
      "totalEnrollments": 245,
      "activeStudents": 187,
      "newEnrollmentsLast30Days": 23,
      "enrollmentTrend": "growing",
      "enrollmentGrowthRate": 12.5
    },
    "completion": {
      "totalCompletions": 156,
      "completionRate": 63.7,
      "averageCompletionTime": 42,
      "dropoutRate": 23.3,
      "dropoutStage": "Module 3: State Management"
    },
    "engagement": {
      "averageSessionDuration": 45,
      "averageWeeklyActivity": 5.2,
      "contentCompletionRate": 78.5
    },
    "performance": {
      "averageCourseScore": 82.4,
      "passRate": 89.1,
      "topPerformingModule": "Module 1: React Basics",
      "strugglingModule": "Module 3: State Management"
    },
    "feedback": {
      "averageRating": 4.3,
      "totalReviews": 89,
      "ratingTrend": "improving",
      "sentimentScore": 78.5,
      "commonFeedbackThemes": ["Clear explanations", "Good examples", "Need more practice"]
    },
    "benchmarks": {
      "platformAverageCompletion": 55.2,
      "performanceVsPeers": "above"
    },
    "predictions": {
      "projectedCompletions": 18,
      "atRiskStudents": 12,
      "recommendedActions": [
        "Review Module 3 content - highest dropout point",
        "Add more interactive exercises in state management",
        "Send engagement reminders to 12 at-risk students"
      ]
    }
  },
  "insights": [
    "Your course completion rate (63.7%) is 8.5% above platform average",
    "Module 3 has the highest dropout rate - consider adding more support materials",
    "Student feedback is improving (4.3/5) with positive sentiment at 78.5%",
    "23 new enrollments in the last 30 days shows growing demand"
  ]
}
```

#### **Business Value**
- **For Trainers:** Complete course health monitoring with actionable insights
- **For Org HR:** Course performance across all organization trainers
- **For Platform:** Identify high-performing courses and improvement opportunities

#### **Performance Targets**
- **Calculation Time:** < 500ms for comprehensive course analysis
- **API Response:** < 600ms total
- **Cache Hit Rate:** > 80% (2-hour TTL for trainers)
- **Real-time Updates:** New enrollments/completions reflected within 1 hour

---

### **9. Student Performance Distribution** ⭐⭐⭐ **DETAILED SPECIFICATION**

**Priority:** ⭐⭐⭐ HIGH  
**Audience:** Trainer; Org HR only if the course belongs to their organization and enrolled learners are part of that organization's value proposition (target skills).  
**Refresh/Caching:** Recompute on new assessment submission; 2-hour TTL cache for trainers; compliant with global caching strategy.

#### **Purpose**
Visualize performance spread across all students in a specific course, identify tails/outliers, understand attempts-to-success behavior, and flag at-risk clusters for targeted interventions.

#### **Data Sources**
- **Assessment MS:** Grades (scores 0-100), attempts, feedback, answer sheets; pass/fail outcome per assessment
- **Course Builder MS:** Enrollments and module structure (defines which assessments belong to which module); cohort/section metadata if available
- **Directory MS:** Organization mapping to validate Org HR visibility and to confirm learners are within the org's value proposition (target skills)

Note: "Roster" refers to the course enrollment list (from Course Builder). Directory is used only for org/department/value-proposition checks, not for enrollments.

#### **Metrics & Segments**
- **Score Distribution:** Histogram (0-100 in 10-point buckets) and box plot (p25, p50, p75, p90)
- **Attempts-to-Success:** Distribution of attempts required to first pass (1, 2, 3, 4+)
- **Pass Rate by Attempts:** Pass rate stratified by attempts bucket
- **At-Risk Cluster:** Percentage scoring < 60 and needing 3+ attempts
- **Module Breakdown:** Optional breakdown by module if moduleId filter applied

#### **Filters**
- `dateRange` (required)
- `moduleId` (optional; limits to assessments within the module)
- `attemptsBucket` (optional: 1 | 2 | 3 | 4plus)

#### **Visualizations**
- Score histogram + box plot
- Attempts-to-success histogram
- Pass rate by attempts (bar)
- Optional module heatmap (scores by module) when `moduleId` is omitted

#### **Calculation Method**
```typescript
interface StudentPerformanceDistribution {
  courseId: string;
  dateRange: { start: string; end: string };
  scoreHistogram: Array<{ bucket: string; count: number }>;
  boxPlot: { p25: number; p50: number; p75: number; p90: number };
  attemptsDistribution: Array<{ attempts: '1'|'2'|'3'|'4+', count: number }>;
  passRateByAttempts: Array<{ attempts: '1'|'2'|'3'|'4+', passRate: number }>;
  atRiskClusterPct: number; // pct with score<60 and attempts >=3
  moduleBreakdown?: Array<{
    moduleId: string;
    moduleName: string;
    p50: number;
    passRate: number;
    avgAttemptsToPass: number;
  }>;
}

function bucketizeScores(scores: number[]): Array<{ bucket: string; count: number }> {
  const buckets = Array.from({ length: 10 }, (_, i) => ({ bucket: `${i*10}-${i*10+9}`, count: 0 }));
  scores.forEach(s => {
    const idx = Math.min(9, Math.floor(s / 10));
    buckets[idx].count += 1;
  });
  return buckets;
}

function bucketizeAttempts(attemptsToPass: number[]): Array<{ attempts: '1'|'2'|'3'|'4+', count: number }> {
  const result = [{ attempts: '1', count: 0 }, { attempts: '2', count: 0 }, { attempts: '3', count: 0 }, { attempts: '4+', count: 0 }];
  attemptsToPass.forEach(a => {
    if (a <= 1) result[0].count += 1; else if (a === 2) result[1].count += 1; else if (a === 3) result[2].count += 1; else result[3].count += 1;
  });
  return result;
}
```

#### **Database & Caching**
- Source tables: `cache_assessment_grades` (scores, pass/fail), `cache_assessment_attempts` (attempts to pass), `course_modules` (structure)
- Store computed distribution per course+filter in `user_analytics` under trainer role with 2-hour TTL, aligned with caching strategy
- Cache key format: `trainer:distribution:${trainerId}:${courseId}:${start}:${end}:${moduleId||'all'}:${attemptsBucket||'all'}`
- K-anonymity: enforce minimum 10 students per segment (course or module) before returning sensitive aggregates

#### **Access Control (RBAC)**
- Trainer: can view distributions for their own courses
- Org HR: can view distributions only for courses owned by their organization AND only for learners included in their value proposition (target skills); otherwise denied

#### **API**
GET `/api/v1/analytics/trainer/{trainerId}/courses/{courseId}/students/distribution?start=YYYY-MM-DD&end=YYYY-MM-DD&moduleId=...&attemptsBucket=...`

**Response Example:**
```json
{
  "analyticsType": "student_performance_distribution",
  "courseId": "course-123",
  "dateRange": { "start": "2025-10-01", "end": "2025-10-31" },
  "scoreHistogram": [
    { "bucket": "0-9", "count": 2 },
    { "bucket": "10-19", "count": 1 },
    { "bucket": "20-29", "count": 3 }
  ],
  "boxPlot": { "p25": 62, "p50": 74, "p75": 86, "p90": 93 },
  "attemptsDistribution": [
    { "attempts": "1", "count": 58 },
    { "attempts": "2", "count": 19 },
    { "attempts": "3", "count": 8 },
    { "attempts": "4+", "count": 5 }
  ],
  "passRateByAttempts": [
    { "attempts": "1", "passRate": 94.8 },
    { "attempts": "2", "passRate": 72.1 },
    { "attempts": "3", "passRate": 51.4 },
    { "attempts": "4+", "passRate": 33.3 }
  ],
  "atRiskClusterPct": 11.2,
  "moduleBreakdown": [
    { "moduleId": "m1", "moduleName": "Basics", "p50": 78, "passRate": 88.5, "avgAttemptsToPass": 1.3 },
    { "moduleId": "m2", "moduleName": "Advanced", "p50": 70, "passRate": 76.2, "avgAttemptsToPass": 1.9 }
  ],
  "insights": [
    "Most students pass on first attempt; focus remediation on 3+ attempts cohort",
    "Module 'Advanced' shows lower median and higher attempts—consider extra practice"
  ]
}
```

#### **Performance Targets**
- Cache hit: < 50ms; Cache miss: < 200ms
- TTL: 2 hours (trainers), coherent with global caching decisions
- Privacy: K-anonymity ≥ 10 per returned segment

---

### **10. Teaching Effectiveness Metrics** ⭐⭐⭐ **DETAILED SPECIFICATION**

**Priority:** ⭐⭐ MEDIUM  
**Audience:** Trainer (own courses); Org HR (aggregated trainer-level across the organization)  
**Refresh/Caching:** Trainer 2h TTL; Org HR 6h TTL; aligned with global caching.

#### **Purpose**
Measure a trainer's impact on learner outcomes and experience, benchmarked against platform/category peers, to guide teaching improvements and recognize excellence.

#### **Data Sources**
- **Directory MS:** Trainer feedback/ratings, qualitative comments
- **Assessment MS:** Student pass rates, score trajectories per course
- **Course Builder MS:** Course completion and dropout rates per course

#### **Filters**
- `dateRange` (required)
- `courseId` (optional)
- `cohortId` (optional)
- `category` (optional; course category for peer benchmark)

#### **KPIs & Metrics**
- **Satisfaction Rating:** Average rating (1–5) and 30-day trend
- **Pass Rate vs Peers:** Trainer pass rate vs platform/category average (delta and z-score)
- **Completion Rate vs Peers:** Course completion rate vs peers
- **Score Gain (Effect Size):** Mean post–pre assessment score delta across courses
- **Attempts Efficiency:** Avg attempts-to-pass; % first-try passes
- **Peer Percentile:** Trainer’s rank/percentile within category
- **Feedback Themes:** Top positive/negative themes from comments

#### **Calculation Method**
```typescript
interface TeachingEffectivenessMetrics {
  trainerId: string;
  dateRange: { start: string; end: string };
  scope?: { courseId?: string; cohortId?: string; category?: string };
  satisfaction: { avg: number; trend30d: number[] };
  passRate: { trainerPct: number; peerPct: number; deltaPct: number; zScore: number };
  completionRate: { trainerPct: number; peerPct: number; deltaPct: number };
  scoreGain: { meanDelta: number; effectSize: number }; // Cohen's d approximation
  attemptsEfficiency: { avgAttemptsToPass: number; firstTryPassPct: number };
  peerPercentile: number; // 0-100
  feedbackThemes: { positive: string[]; negative: string[] };
}

function computeZScore(value: number, peerMean: number, peerStd: number): number {
  if (!peerStd || peerStd === 0) return 0;
  return Math.round(((value - peerMean) / peerStd) * 100) / 100;
}

function cohenD(pre: number[], post: number[]): number {
  if (!pre.length || pre.length !== post.length) return 0;
  const deltas = post.map((p, i) => p - pre[i]);
  const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const sd = Math.sqrt(deltas.map(d => (d - mean) ** 2).reduce((a, b) => a + b, 0) / (deltas.length || 1));
  return sd ? Math.round((mean / sd) * 100) / 100 : 0;
}
```

#### **Database & Caching**
- Source: `cache_directory_feedback` (ratings, comments), `cache_assessment_grades` (scores, pass/fail), `cache_course_builder_completions` (completion/dropout)
- Peer benchmarks: `mv_current_aggregates` grouped by `category`
- Store computed metrics in `user_analytics` under role `trainer` (2h TTL) and aggregated org view under role `org_manager` (6h TTL)
- Cache key: `trainer:effectiveness:${trainerId}:${start}:${end}:${courseId||'all'}:${category||'all'}`
- Privacy: Org view hides segments with < 10 students (K-anonymity)

#### **Access Control (RBAC)**
- Trainer: can view metrics for courses they teach
- Org HR: can view aggregated metrics for trainers within their organization only

#### **API**
GET `/api/v1/analytics/trainer/{trainerId}/effectiveness?start=YYYY-MM-DD&end=YYYY-MM-DD&courseId=...&cohortId=...&category=...`

**Response Example:**
```json
{
  "analyticsType": "teaching_effectiveness",
  "trainerId": "trainer-456",
  "dateRange": { "start": "2025-10-01", "end": "2025-10-31" },
  "satisfaction": { "avg": 4.4, "trend30d": [4.2, 4.3, 4.4, 4.5] },
  "passRate": { "trainerPct": 88.6, "peerPct": 81.2, "deltaPct": 7.4, "zScore": 1.1 },
  "completionRate": { "trainerPct": 62.5, "peerPct": 55.8, "deltaPct": 6.7 },
  "scoreGain": { "meanDelta": 8.3, "effectSize": 0.6 },
  "attemptsEfficiency": { "avgAttemptsToPass": 1.4, "firstTryPassPct": 76.9 },
  "peerPercentile": 84,
  "feedbackThemes": { "positive": ["clear", "helpful"], "negative": ["fast pace"] },
  "insights": [
    "Pass rate +7.4% vs category peers; strong effectiveness",
    "Completion rate above peers; maintain pacing strategies",
    "Consider slowing Module 2 pacing based on feedback"
  ]
}
```

#### **Performance Targets**
- Cache hit < 50ms; miss < 300ms (includes peer benchmark lookup)

---

### **12. Strategic Alignment Tracking** ⭐⭐⭐ **DETAILED SPECIFICATION**

**Priority:** ⭐⭐⭐ HIGH  
**Audience:** Org HR/Managers (organization scope only)  
**Refresh/Caching:** Daily baseline refresh; on-demand recompute available. Org analytics TTL: 6 hours (aligned with caching strategy).

#### **Purpose**
Monitor progress toward organizational KPIs and value propositions by measuring target skill attainment, mandatory training compliance, and strategic alignment across departments/teams.

#### **Data Sources**
- **Directory MS:** Organizational KPIs (targets, weights), value propositions (target skills per org), org→department mapping
- **Skills Engine MS:** Current employee competencies, skill levels per user
- **Course Builder MS:** Mandatory course definitions + completion status
- **User Analytics (aggregated):** Historical trends for velocity/compliance (from materialized views)

#### **Filters**
- `dateRange` (required)
- `departmentId` (optional)
- `kpiId` (optional)
- `valuePropId` (optional)

#### **KPIs & Metrics**
- **KPI Achievement (%):** For each org KPI: achieved / target × 100
- **Target Skill Coverage (%):** Employees meeting required competency level for each value-prop skill
- **Mandatory Training Compliance (%):** Employees who completed all assigned mandatory courses
- **Alignment Score (0-100):** Weighted composite across KPIs, target skills, and compliance
- **Department Breakdown:** Same metrics per department (optional filter)

#### **Alignment Score Formula**
Let weights be provided by Directory per org (defaults shown):  
`alignmentScore = 0.5*KPI_achievement + 0.3*skill_coverage + 0.2*training_compliance`

```typescript
interface StrategicAlignmentMetrics {
  orgId: string;
  dateRange: { start: string; end: string };
  kpis: Array<{ kpiId: string; name: string; target: number; achieved: number; achievementPct: number; weight: number }>;
  valueProposition: {
    valuePropId: string;
    skills: Array<{ skillId: string; name: string; requiredLevel: string; coveragePct: number }>;
    overallSkillCoveragePct: number;
  };
  trainingCompliance: { mandatoryCompletionPct: number; nonCompliantCount: number };
  alignmentScore: number; // 0-100
  departments?: Array<{
    departmentId: string;
    kpiAchievementPct: number;
    skillCoveragePct: number;
    trainingCompliancePct: number;
    alignmentScore: number;
  }>;
}

function computeAlignmentScore(kpiPct: number, skillPct: number, trainPct: number, w = {k:0.5,s:0.3,t:0.2}): number {
  return Math.round((w.k*kpiPct + w.s*skillPct + w.t*trainPct) * 100) / 100;
}
```

#### **Database & Calculation Notes**
- KPI data: `cache_directory_org_kpis` (kpi_id, target, weight, achieved_value)
- Value proposition skills: `cache_directory_value_propositions` (skills list, required levels)
- Skill coverage: join employees with `cache_skills_engine_user_skills` and compute % meeting required level
- Training compliance: `cache_course_builder_mandatory` × `cache_course_builder_completions`
- Store computed org-level result in `user_analytics` under role `org_manager` with 6-hour TTL
- Cache key: `org:alignment:${orgId}:${start}:${end}:${departmentId||'all'}:${kpiId||'all'}:${valuePropId||'current'}`

#### **Access Control (RBAC)**
- Only Org HR/Managers of the organization can access
- Data is aggregated—no individual employee PII exposed

#### **API**
GET `/api/v1/analytics/organization/{orgId}/strategic-alignment?start=YYYY-MM-DD&end=YYYY-MM-DD&departmentId=...&kpiId=...&valuePropId=...`

**Response Example:**
```json
{
  "analyticsType": "strategic_alignment",
  "orgId": "org-42",
  "dateRange": { "start": "2025-10-01", "end": "2025-10-31" },
  "kpis": [
    { "kpiId": "k1", "name": "Skills Acquired", "target": 1000, "achieved": 740, "achievementPct": 74.0, "weight": 0.5 }
  ],
  "valueProposition": {
    "valuePropId": "vp-2025",
    "skills": [ { "skillId": "react", "name": "React", "requiredLevel": "Advanced", "coveragePct": 62.5 } ],
    "overallSkillCoveragePct": 68.2
  },
  "trainingCompliance": { "mandatoryCompletionPct": 81.4, "nonCompliantCount": 219 },
  "alignmentScore": 73.1,
  "departments": [
    { "departmentId": "eng", "kpiAchievementPct": 78.2, "skillCoveragePct": 70.1, "trainingCompliancePct": 85.3, "alignmentScore": 77.0 }
  ],
  "insights": [
    "Skill coverage for 'React' below target—prioritize advanced workshops",
    "Training compliance strong; focus on KPI gap (achieved 74% vs target)"
  ]
}
```

#### **Performance Targets**
- Cache hit: < 50ms; Cache miss (aggregate compute): < 500ms
- TTL: 6 hours for organization analytics; daily batch refresh supported
- Privacy: Aggregated only; department segments hidden if < 10 employees

---

### **13. Team Analytics (Departments Pending Directory MS)** ⭐⭐⭐ **DETAILED SPECIFICATION**

**Priority:** ⭐⭐ MEDIUM  
**Audience:** Org HR/Managers (organization scope only)  
**Refresh/Caching:** 6h TTL (org scope), aligned with global caching; daily batch refresh of aggregates.

Note: Department-level analytics are deferred until Directory MS confirms department taxonomy. This version focuses on team-level and worker drill-down within org RBAC.

#### **Purpose**
Compare learning outcomes and engagement across teams, and optionally drill down to workers for targeted interventions.

#### **Data Sources**
- **Directory MS:** Org → team structure; employee-to-team mapping (departments pending)
- **User Analytics:** Aggregated personal analytics (velocity, mastery, engagement, performance)
- **Course Builder MS:** Team course enrollments/completions
- **Assessment MS:** Pass rates per team
- **Skills Engine MS:** Skill levels and coverage per team

#### **Filters**
- `dateRange` (required)
- `teamId` (optional; one or many)
- `metric` (optional: skills|completion|engagement|passRate)

#### **KPIs & Metrics (per team + worker drill-down)**
- `skillCoveragePct`: % of employees meeting target competency for selected skills/value proposition
- `completionPct`: % of employees completing assigned courses in period
- `engagementScore`: Composite (login frequency, session duration, activity recency)
- `passRatePct`: Assessment pass rate
- `avgTimeToCompleteDays`: Avg days to complete assigned courses
- `activeLearners`: Count of employees with activity in period
- `rank` and `percentile` within organization
- `trend`: 3-point trend (improving|stable|declining)
- **Worker-level (when `teamId` specified and RBAC allows):** list top/bottom workers by chosen metric with per-worker KPIs: `skillCoveragePct`, `completionPct`, `engagementScore`, `passRatePct`. PII minimized to `userId` and `displayName`.

#### **Calculation Method**
```typescript
interface TeamAnalytics {
  orgId: string;
  dateRange: { start: string; end: string };
  teams: Array<{
    teamId: string;
    teamName: string;
    skillCoveragePct: number;
    completionPct: number;
    engagementScore: number;
    passRatePct: number;
    avgTimeToCompleteDays: number;
    activeLearners: number;
    rank: number;
    percentile: number;
    trend: 'improving'|'stable'|'declining';
  }>;
  topTeams: string[];
  bottomTeams: string[];
  workers?: Array<{
    userId: string;
    displayName: string;
    teamId: string;
    metric: string; // value for selected metric
  }>; // included only when teamId provided and RBAC allows
}

function computePercentile(values: number[], value: number): number {
  const sorted = [...values].sort((a,b)=>a-b);
  const idx = sorted.findIndex(v => v >= value);
  const p = idx < 0 ? 100 : Math.round((idx / Math.max(1, sorted.length-1)) * 100);
  return p;
}
```

#### **Database & Caching**
- Aggregation view: `mv_org_team_aggregates` (per `org_id`, `team_id`) built from `user_analytics`, `cache_course_builder_completions`, `cache_assessment_grades`, `cache_skills_engine_user_skills`
- Store computed org-scoped result in `user_analytics` under role `org_manager` with 6-hour TTL
- Cache key: `org:team:${orgId}:${start}:${end}:${teamId||'all'}:${metric||'all'}`
- Privacy: Hide teams with < 10 active learners (K-anonymity). Worker drill-down available to Org HR with explicit RBAC; show per-worker metrics drawn from `user_analytics` (no PII beyond name/id per org policy).

#### **Access Control (RBAC)**
- Only Org HR/Managers of the organization can access department/team analytics

#### **API**
GET `/api/v1/analytics/organization/{orgId}/teams?start=YYYY-MM-DD&end=YYYY-MM-DD&teamId=...&metric=...&includeWorkers=false`

**Response Example:**
```json
{
  "analyticsType": "team_analytics",
  "orgId": "org-42",
  "dateRange": { "start": "2025-10-01", "end": "2025-10-31" },
  "teams": [
    { "teamId": "fe", "teamName": "Frontend", "skillCoveragePct": 70.1, "completionPct": 61.2, "engagementScore": 76.3, "passRatePct": 84.9, "avgTimeToCompleteDays": 36, "activeLearners": 128, "rank": 3, "percentile": 82, "trend": "stable" }
  ],
  "topTeams": ["Data Platform", "Mobile"],
  "bottomTeams": ["Support"]
}
```

#### **Performance Targets**
- Cache hit < 50ms; miss < 300ms
- TTL: 6 hours; daily batch refresh of `mv_org_department_aggregates`

---

### **14. Learning Culture Metrics** ⭐⭐⭐ **DETAILED SPECIFICATION**

**Priority:** ⭐⭐ MEDIUM  
**Audience:** Org HR/Managers (org and department scope)  
**Refresh/Caching:** 6h TTL; daily batch refresh of culture aggregates.

#### **Purpose**
Measure the strength of a voluntary learning culture and knowledge sharing across the organization and departments to guide enablement programs.

#### **Data Sources**
- **Course Builder MS:** Voluntary vs. mandatory enrollments/completions (flag on course/assignment)
- **Content Studio MS:** Content created/shared by employees (internal tutorials, tips)
- **Directory MS:** Mentoring/peer-support participation flags or events (if available)

#### **Filters**
- `dateRange` (required)
- `departmentId` (optional)

#### **KPIs & Metrics**
- `voluntaryParticipationPct`: Voluntary enrollments / all enrollments × 100
- `voluntaryCompletionPct`: Voluntary completions / all completions × 100
- `mentoringEngagementPct`: Employees participating in mentoring/peer-support × 100
- `knowledgeSharingIndex`: (Content created + shared) per 100 employees
- `streaksActivePct`: Employees with >7-day learning streak
- `learningMaturityScore (0–100)`: Composite index

#### **Maturity Score Formula**
`maturity = 0.35*voluntaryParticipation + 0.2*voluntaryCompletion + 0.2*knowledgeSharingIndex_norm + 0.15*mentoringEngagement + 0.1*streaksActive`

Normalization: `knowledgeSharingIndex_norm = min(100, knowledgeSharingIndex / target * 100)` where `target` defaults to 5 per 100 employees/month.

```typescript
interface LearningCultureMetrics {
  orgId: string;
  dateRange: { start: string; end: string };
  voluntaryParticipationPct: number;
  voluntaryCompletionPct: number;
  mentoringEngagementPct: number;
  knowledgeSharingIndex: number; // per 100 employees
  streaksActivePct: number;
  learningMaturityScore: number; // 0-100
  departments?: Array<{
    departmentId: string;
    voluntaryParticipationPct: number;
    knowledgeSharingIndex: number;
    learningMaturityScore: number;
  }>;
}
```

#### **Database & Caching**
- Aggregation view: `mv_org_culture_aggregates` (per org/department)
- Sources: `cache_course_builder_enrollments` (voluntary flag), `cache_course_builder_completions`, `cache_content_studio_creation`, `cache_content_studio_shares`, optional `directory_mentoring_events`
- Store computed metrics in `user_analytics` under role `org_manager` with 6-hour TTL
- Cache key: `org:culture:${orgId}:${start}:${end}:${departmentId||'all'}`
- Privacy: Hide departments with < 10 employees/learners

#### **Access Control (RBAC)**
- Only Org HR/Managers of the organization can access culture metrics

#### **API**
GET `/api/v1/analytics/organization/{orgId}/culture?start=YYYY-MM-DD&end=YYYY-MM-DD&departmentId=...`

**Response Example:**
```json
{
  "analyticsType": "learning_culture",
  "orgId": "org-42",
  "dateRange": { "start": "2025-10-01", "end": "2025-10-31" },
  "voluntaryParticipationPct": 58.2,
  "voluntaryCompletionPct": 52.6,
  "mentoringEngagementPct": 21.4,
  "knowledgeSharingIndex": 6.1,
  "streaksActivePct": 34.7,
  "learningMaturityScore": 64.3,
  "departments": [
    { "departmentId": "eng", "voluntaryParticipationPct": 62.1, "knowledgeSharingIndex": 7.3, "learningMaturityScore": 68.9 }
  ],
  "insights": [
    "Voluntary participation is strong; increase mentoring to lift maturity score",
    "Knowledge sharing exceeds target (7.3 per 100 employees) in Engineering"
  ]
}
```

#### **Performance Targets**
- Cache hit < 50ms; miss < 300ms
- TTL: 6 hours; daily batch refresh of `mv_org_culture_aggregates`

---

### **16. Learning Outcome Forecasting** ⭐⭐⭐ **DETAILED SPECIFICATION**

**Priority:** ⭐⭐⭐ HIGH  
**Audience:** Learner; Trainer (own cohorts/courses); Org HR (aggregated)  
**Refresh/Caching:** Learner 4h; Trainer 2h; Org 6h; optional Gemini explanation cached 48h.

#### **Purpose**
Predict completion probability, expected final grade, and forecast completion date/time-to-complete. Provide sensitivity to study time scenarios and an optional natural-language explanation.

#### **Data Sources**
- Learner AI MS: Topics remaining, learning path progress, target skill
- Assessment MS: Grade trajectory, pass/fail history, attempts
- Auth/Content MS: Engagement (weekly study hours proxy), recency of activity
- Course Builder MS: Course pacing (modules/week), required assessments
- User Analytics: Historical velocity and mastery trends

#### **Filters**
- `dateRange` (required), `courseId|pathId` (required), `cohortId` (trainer), `departmentId` (org)
- Scenario inputs: `weeklyStudyHours`, `breakWeeks` (optional)

#### **Metrics**
- `completionProbability` (0-100)
- `expectedFinalGrade` (0-100)
- `forecastCompletionDate`, `timeToCompleteWeeks`
- `confidence` (0-1) from data completeness/variance

#### **Rule-Based Baseline Model**
```typescript
interface ForecastInputs {
  weeklyStudyHours: number;           // default inferred from last 4 weeks
  topicsRemaining: number;            // from Learner AI
  topicsPerWeek: number;              // inferred velocity (last 4 weeks)
  gradeTrend: number[];               // recent scores
  breakWeeks: number;                 // scenario input
}

function forecastTimeToCompleteWeeks(i: ForecastInputs): number {
  const effectiveVelocity = Math.max(0.5, i.topicsPerWeek * (i.weeklyStudyHours / baselineHours()));
  return Math.ceil(i.topicsRemaining / effectiveVelocity) + i.breakWeeks;
}

function forecastExpectedGrade(trend: number[]): number {
  if (trend.length < 3) return average(trend);
  const slope = linearSlope(trend);
  const base = average(trend.slice(-3));
  return clamp(0, 100, base + slope * 2); // project two more assessments
}

function completionProbability(weeks: number, recencyDays: number, attempts: number[]): number {
  let p = 0.8; // base
  if (weeks > 8) p -= 0.1;
  if (recencyDays > 7) p -= 0.2;
  const failRate = attempts.length ? attempts.filter(a => a > 1).length / attempts.length : 0;
  p -= failRate * 0.2;
  return Math.round(clamp(0, 1, p) * 100);
}
```

#### **AI Explanation (Optional)**
- On demand, generate an explanation ("why" and "what to do") via Google Gemini using the forecast inputs; cache for 48h.

#### **API**
GET `/api/v1/analytics/forecast/{scope}/{id}?courseId=...|pathId=...&start=...&end=...&weeklyStudyHours=...&breakWeeks=...`

**Response Example:**
```json
{
  "analyticsType": "learning_outcome_forecasting",
  "scope": "learner",
  "userId": "user-77",
  "courseId": "course-123",
  "forecast": {
    "completionProbability": 82,
    "expectedFinalGrade": 86,
    "timeToCompleteWeeks": 3,
    "forecastCompletionDate": "2025-11-05",
    "confidence": 0.72
  },
  "scenario": { "weeklyStudyHours": 6, "breakWeeks": 0 },
  "insights": [
    "Sustained recent grade improvements (+4 points over last 3 assessments)",
    "Consistent weekly study time predicts completion in ~3 weeks"
  ],
  "aiExplanation": "optional, cached 48h"
}
```

#### **RBAC & Caching**
- Learner: own forecast only (TTL 4h)
- Trainer: cohorts/courses they teach (TTL 2h)
- Org HR: aggregated org/career-path forecasts (TTL 6h, K-anonymity ≥10)
- Cache key: `forecast:${scope}:${id}:${courseId||pathId}:${start}:${end}:${scenarioHash}`

#### **Performance Targets**
- Cache hit < 50ms; miss < 300ms (rule-based)
- Gemini explanation (if requested) < 2s; cached 48h

---

### **17. Role-Specific Success Recommendations (On-Demand, AI-Assisted)** ⭐⭐⭐ **DETAILED SPECIFICATION** (AS-004)

**Priority:** ⭐⭐⭐ HIGH  
**Audience:** Learner (learning strategies), Trainer (teaching improvements), Org HR (strategic workforce development)  
**Generation:** On-demand when user opens dashboard (NOT batch-processed)  
**Note:** Course selection handled by Marketplace MS; Analytics recommends success strategies and improvements.

#### **Purpose**
Generate role-specific actionable recommendations: learner study strategies, trainer teaching improvements, and org HR strategic workforce development—NOT course selection.

#### **Data Sources (from existing 19 analytics, role-adapted)**
**Learner:** #1 Velocity, #4 Skill Gap, #5 Performance, #6 Content Effectiveness, #15 Drop-off Risk, #16 Forecasting, DevLab MS (practice usage correlation with assessment success), peer patterns (K≥10)

**Trainer:** #6 Content Effectiveness, #7 Course Performance, #9 Student Distribution, #10 Teaching Effectiveness, DevLab MS (practice usage), student feedback text

**Org HR:** #12 Strategic Alignment, #13 Team Analytics, #14 Learning Culture, aggregated org data, worker-level KPI tracking

#### **Recommendations by Role**

---

### **LEARNER Recommendations (4 Categories)**

**A. Study Behavior Optimization:**
- Time management, content strategy, topic priority, pace adjustments (from #1, #5, #6, #16)

**B. DevLab Practice Recommendations (from DevLab + Assessment correlation):**
- "Use DevLab practice before your next assessment—learners who practiced 2 days before have 85% first-attempt pass rate (vs 60% without practice)"
- "You haven't used DevLab for 'Algorithms' topic—85% of successful learners practiced before the assessment"
- Statistics: "60% of learners who did DevLab succeeded on first assessment attempt (vs 35% without DevLab)"

**C. Peer Success Patterns (K≥10):**
- Anonymous aggregates (e.g., "70% of learners who mastered React spent >8h/week")

**D. Optimal Learning Actions:**
- Prescriptive next steps (schedule study, attempt practice, take break, review weak topics)

---

### **TRAINER Recommendations (5 Categories)**

**A. Content Improvements (from #6, #7, #9):**
- "Module 3 has 40% dropout rate—break into 2 shorter modules"
- "Video content has +15pt better outcomes—convert article sections to video"
- "Students struggle with 'Algorithms' (avg 62)—add practice labs"

**B. Pacing & Difficulty Adjustments (from #9):**
- "Top 25% finish Module 2 in 3h; bottom 25% need 8h—provide advanced track"
- "Assessment difficulty too high: 35% need 3+ attempts—reduce complexity"

**C. Student Intervention Timing (from #15, #9, DevLab):**
- "12 students at-risk this week—send check-in (names: [...])"
- "Students who use DevLab practice 2 days before assessment have 85% pass rate (vs 60% same-day practice or no practice)—send reminder"
- **DevLab Clarification:** DevLab MS = practice lab before Assessment MS; usage is optional; we track if student practiced or not.

**D. Teaching Effectiveness Insights (from #10):**
- "Your pass rate (88%) is +7pts above category peers—maintain approach"
- "Student feedback mentions 'fast pace' (15 mentions)—consider recap sessions"
- **AI-Assisted:** Analyze feedback text (comments/reviews) for content improvement suggestions

**E. Peer Trainer Patterns (K≥10, anonymous):**
- "Trainers with >90% pass rate average 4 practice assessments per module (you have 2)"

---

### **ORG HR Recommendations (6 Categories)**

**A. Skill Prioritization (from #12 Strategic Alignment):**
- "62% of workers lack 'Data Structures' (value proposition target)—prioritize training"
- "React 85% covered but Docker 40%—allocate budget to Docker"

**B. Team Interventions (from #13 Team Analytics):**
- "Support team has lowest engagement (45 vs org avg 72)—investigate barriers"
- "Mobile team leads in completion (82%)—share practices with other teams"

**C. Learning Culture Improvements (from #14):**
- "Voluntary participation 58% (benchmark: 70%)—implement incentive program"
- "Knowledge sharing index 6.1 (target: 5)—recognize contributors"

**D. Training Program Effectiveness (from #6, #7):**
- "Advanced React: 85% completion, +12pt lift—expand capacity 30%"
- "Data Structures: 45% completion—review difficulty or instructor"

**E. Resource Allocation (from #12, #13):**
- "To reach strategic alignment by Q4, invest 60% in Backend skills (highest gap)"
- "Engineering ROI: +$250K skill value vs $80K cost—increase allocation"

**F. Worker-Level KPI Tracking:**
- Access to individual worker data for KPI attainment tracking and value proposition adjustments (not just aggregated)
- "Worker [name] needs Docker skill to meet Q4 KPI—assign training"

#### **Output Structure (Role-Adapted)**

**Learner Response:**
```json
{
  "analyticsType": "learner_success_strategies",
  "userId": "user-123",
  "generatedAt": "2025-10-11T08:32:15Z",
  "aiSummary": "You're 3 skills from Full Stack-Advanced. Increase study to 6h/week, prioritize Data Structures, and use DevLab practice before assessments.",
  "recommendations": {
    "urgent": [{ "action": "Schedule study today—engagement dropped 40%", "source": "#15" }],
    "thisWeek": [
      { "action": "Focus on Data Structures—prerequisite for 3 target skills", "source": "#4" },
      { "action": "Use DevLab practice 2 days before Algorithms assessment—85% first-attempt pass rate with practice vs 60% without", "source": "DevLab+Assessment" }
    ],
    "ongoing": [{ "action": "Increase study 4h→6h/week for Nov 15 goal", "source": "#1" }],
    "devlabInsights": [
      { "insight": "60% who used DevLab succeeded on first assessment (vs 35% without DevLab)", "sampleSize": 287 }
    ],
    "peerInsights": [{ "insight": "70% who mastered React spent >8h/week", "sampleSize": 142 }]
  }
}
```

**Trainer Response:**
```json
{
  "analyticsType": "trainer_improvement_strategies",
  "trainerId": "trainer-456",
  "courseId": "course-789",
  "generatedAt": "2025-10-11T08:32:15Z",
  "aiSummary": "Module 3 dropout rate is 40%—student feedback mentions 'confusing explanations' (15 mentions). Consider breaking into 2 modules and adding visual diagrams.",
  "recommendations": {
    "urgent": [{ "action": "12 students at-risk—send check-in today", "students": ["user-101", "user-102"], "source": "#15" }],
    "thisWeek": [
      { "action": "Send DevLab practice reminder—students who practice 2 days before assessment have 85% pass rate", "source": "DevLab+Assessment" }
    ],
    "ongoing": [
      { "action": "Convert Module 3 articles to video—video content has +15pt better outcomes", "source": "#6" },
      { "action": "Add 2 more practice assessments—peer trainers with >90% pass rate average 4 per module", "source": "#10" }
    ]
  }
}
```

**Org HR Response:**
```json
{
  "analyticsType": "org_strategic_recommendations",
  "orgId": "org-42",
  "generatedAt": "2025-10-11T08:32:15Z",
  "aiSummary": "To reach strategic alignment by Q4, prioritize Docker training (40% coverage vs 85% React). Invest 60% of budget in Backend skills—highest gap with 6-month ROI projection.",
  "recommendations": {
    "urgent": [
      { "action": "Support team engagement dropped to 45 (org avg 72)—investigate barriers this week", "source": "#13" }
    ],
    "thisWeek": [
      { "action": "Allocate training budget: 60% Backend, 25% DevOps, 15% Frontend", "source": "#12" }
    ],
    "ongoing": [
      { "action": "Expand Advanced React capacity 30%—85% completion, +12pt grade lift", "source": "#6, #7" },
      { "action": "Implement voluntary learning incentives—58% participation vs 70% benchmark", "source": "#14" }
    ],
    "workerKPIs": [
      { "workerId": "user-555", "name": "John Doe", "missingSkills": ["Docker"], "kpiStatus": "at-risk", "action": "Assign Docker training by Nov 1" }
    ]
  }
}
```

#### **AI Summary Generation (On-Demand, Role-Adapted)**

**Learner AI Input (aggregated, NO PII):**
- Competency target/current, skill gaps, study time, peer avg, engagement trend, content preference
- **Prompt:** "Generate 2-3 sentence actionable summary for learner to succeed this week"

**Trainer AI Input (privacy-safe):**
- Course metrics (dropout rates, pass rates, module difficulty), student feedback text (aggregated themes), peer trainer benchmarks
- **Prompt:** "Analyze student feedback and course metrics. Suggest 2-3 specific content improvements for this week."
- **Example:** "15 students mentioned 'confusing explanations' in Module 3—consider adding visual diagrams."

**Org HR AI Input (strategic, aggregated):**
- Skill gap analysis, team performance, budget constraints, timeline (Q4), ROI projections
- **Prompt:** "Generate strategic recommendation to close skill gaps by Q4. Prioritize high-impact, high-ROI actions."
- **Example:** "Prioritize Docker training (40% coverage, 62% need it). Invest 60% budget in Backend—6-month ROI projection."

**Privacy & Safety:**
- ✅ No PII sent to Gemini (learner/trainer/org inputs are aggregated metrics only)
- ✅ Filter AI output for inappropriate content
- ✅ Fallback to rule-based summary if Gemini unavailable
- ✅ Caching: Learner 15min, Trainer 15min, Org HR 30min (optional, same session)

#### **Peer Aggregation (K≥10 Anonymity)**
```typescript
function findSimilarPeers(userId): PeerGroup {
  const user = getUserProfile(userId);
  const peers = getAllUsers()
    .filter(p => p.orgId === user.orgId && p.competency === user.competency && p.userId !== userId);
  
  if (peers.length < 10) return null; // K-anonymity
  return { count: peers.length, avgStudyTime: avg(peers.map(p => p.studyTimeWeekly)), /* ... */ };
}
```

#### **On-Demand Generation Flow**
1. User logs in → GET `/api/v1/analytics/recommendations/learner/{userId}`
2. Collect data from 19 analytics (already cached)
3. Generate 3 categories (A/B/C) in parallel
4. Call Gemini for AI summary (privacy-safe)
5. Return unified JSON (< 2s total)
6. Optional: cache 15min

#### **RBAC & Privacy**
- **Learner:** Personal strategies only
- **Trainer:** Own courses; can see student names for intervention recommendations (RBAC validated)
- **Org HR:** Worker-level data for KPI tracking and value proposition adjustments (not just aggregated)
- **Peer Insights:** K≥10 anonymity enforced for all roles

#### **API (Role-Specific)**
- GET `/api/v1/analytics/recommendations/learner/{userId}`
- GET `/api/v1/analytics/recommendations/trainer/{trainerId}?courseId={courseId}`
- GET `/api/v1/analytics/recommendations/organization/{orgId}`

#### **Performance Targets**
- **Learner:** < 2s total (including AI)
- **Trainer:** < 2.5s total (includes feedback text analysis)
- **Org HR:** < 3s total (larger dataset, strategic analysis)
- Analytics retrieval: < 300ms
- Peer/worker aggregation: < 200ms
- Gemini AI: < 1.5s
- Optional cache: Learner 15min, Trainer 15min, Org HR 30min

---

### **18. Platform Skill Demand Analytics** ⭐⭐⭐ **DETAILED SPECIFICATION** (AS-005)

**Priority:** ⭐⭐ MEDIUM  
**Audience:** All roles (learner career planning, trainer course design, org HR workforce planning)  
**Refresh/Caching:** Daily refresh; 24h TTL cache (slow-changing data)

#### **Purpose**
Show platform-internal skill demand trends and forecasts to inform learner skill development, trainer course content decisions, and org HR workforce planning. NOT external job market data.

#### **Data Sources**
- **Skills Engine MS:** Skill demand data (platform-internal)
- **Course Builder MS:** Course enrollments by skill, skill requirements per course
- **Learner AI MS:** Learning path skill requirements (which skills are in active paths)
- **Directory MS:** Org value propositions (target skills across all orgs)

#### **Filters**
- `dateRange` (required)
- `skillCategory` (optional: frontend|backend|devops|data|design|other)
- `competencyLevel` (optional: show demand for specific competency level)

#### **Metrics**
- **Top Demanded Skills:** Ranking by enrollment volume, value proposition inclusion, path requirements
- **Demand Trends:** Increasing/stable/declining over last 3-6 months
- **Acquisition Velocity:** Platform-wide skill acquisition rate (skills/month)
- **Forecasted Demand:** 6-12 month projection (Gemini-assisted trend analysis)
- **Competency Distribution:** Demand breakdown by competency level

#### **Calculation Method**
```typescript
interface SkillDemandAnalytics {
  dateRange: { start: string; end: string };
  topSkills: Array<{
    skillId: string;
    skillName: string;
    category: string;
    demandScore: number; // composite index
    enrollmentCount: number; // learners enrolled in courses teaching this skill
    valuePropCount: number; // orgs with this in value proposition
    pathRequirementCount: number; // learning paths requiring this skill
    trend: 'increasing'|'stable'|'declining';
    growthRate: number; // % change from previous period
    acquisitionVelocity: number; // skills acquired per month platform-wide
  }>;
  demandByCategory: Array<{ category: string; demandScore: number; topSkill: string }>;
  forecast: Array<{
    skillId: string;
    skillName: string;
    forecastedDemand: number; // 6-month projection
    confidence: number;
    aiInsight: string; // Gemini-generated
  }>;
}

// Demand score calculation
function calculateDemandScore(skill: any): number {
  const weights = { enrollments: 0.4, valueProp: 0.35, pathReq: 0.25 };
  return Math.round(
    (weights.enrollments * normalize(skill.enrollmentCount) +
     weights.valueProp * normalize(skill.valuePropCount) +
     weights.pathReq * normalize(skill.pathRequirementCount)) * 100
  );
}
```

#### **Database & Caching**
- Aggregation view: `mv_platform_skill_demand` (daily refresh)
- Sources: `cache_skills_engine_demand`, `cache_course_builder_enrollments`, `cache_learner_ai_paths`, `cache_directory_value_propositions`
- Cache TTL: 24h (slow-changing)
- Cache key: `platform:skill:demand:${start}:${end}:${category||'all'}:${level||'all'}`
- Privacy: Platform-wide aggregates (K≥10 for org-specific breakdowns)

#### **Access Control (RBAC)**
- All roles can access platform-wide skill demand (public aggregated data)
- Org HR can optionally filter to see their org's specific demand patterns

#### **API**
GET `/api/v1/analytics/skill-demand?start=YYYY-MM-DD&end=YYYY-MM-DD&skillCategory=...&competencyLevel=...`

**Response Example:**
```json
{
  "analyticsType": "platform_skill_demand",
  "dateRange": { "start": "2025-10-01", "end": "2025-10-31" },
  "topSkills": [
    {
      "skillId": "react",
      "skillName": "React",
      "category": "frontend",
      "demandScore": 92,
      "enrollmentCount": 1247,
      "valuePropCount": 85,
      "pathRequirementCount": 34,
      "trend": "increasing",
      "growthRate": 15.3,
      "acquisitionVelocity": 312
    }
  ],
  "demandByCategory": [
    { "category": "frontend", "demandScore": 88, "topSkill": "React" }
  ],
  "forecast": [
    {
      "skillId": "docker",
      "skillName": "Docker",
      "forecastedDemand": 78,
      "confidence": 0.74,
      "aiInsight": "Docker demand projected to grow 25% due to increased DevOps learning paths and org value proposition adoption"
    }
  ],
  "insights": [
    "React remains top demanded skill (92 score, +15% growth)",
    "Docker demand accelerating—consider upskilling before market saturates"
  ]
}
```

#### **AI Forecasting (Gemini-Assisted)**
- Analyze 6-month trend + enrollment growth + value proposition changes
- Generate forecast with confidence score and natural language insight
- Cache: 48h TTL for AI forecast (per NFR-008)

#### **Performance Targets**
- Cache hit < 50ms; miss < 400ms (aggregation + AI forecast)
- Daily batch refresh of `mv_platform_skill_demand`
- TTL: 24h (skill demand is slow-changing)

**Note:** This is PLATFORM-INTERNAL demand, not external job market data.

---

## Implementation Notes

### **1. Data Freshness**
- Real-time: Engagement, Drop-off risk
- Hourly: Learning velocity, Mastery tracking
- Daily: Skill gaps, Course health, Org metrics
- Weekly: Peer comparisons, Platform skill demand

### **2. Caching Strategy**
- Cache individual analytics for 4 hours (learner), 2 hours (trainer), 6 hours (org)
- Background refresh when stale
- User can force refresh (5-minute rate limit)

### **3. API Endpoints**

```typescript
// Individual analytics
GET /api/v1/analytics/learner/{userId}/velocity
GET /api/v1/analytics/learner/{userId}/skill-gaps
GET /api/v1/analytics/learner/{userId}/engagement
GET /api/v1/analytics/learner/{userId}/mastery
GET /api/v1/analytics/learner/{userId}/predictions

// Trainer analytics
GET /api/v1/analytics/trainer/{trainerId}/course-health/{courseId}
GET /api/v1/analytics/trainer/{trainerId}/students/performance
GET /api/v1/analytics/trainer/{trainerId}/effectiveness

// Organization analytics
GET /api/v1/analytics/organization/{orgId}/velocity
GET /api/v1/analytics/organization/{orgId}/strategic-alignment
GET /api/v1/analytics/organization/{orgId}/talent-development

// Comparison analytics
GET /api/v1/analytics/comparison/peer/{userId}
GET /api/v1/analytics/comparison/platform-skill-demand/{userId}
```

---

**Document Status:** ✅ Complete Analytics Catalog (Version 2.0)  
**Total Analytics Categories:** 19 (AS-001 through AS-005)  
**Detailed Specifications:** 8 analytics with full implementation details  
**Summary References:** 11 analytics with overview and implementation notes  
**Total API Endpoints:** 15+  
**Last Updated:** October 10, 2025  
**Ready for:** Development Phase

**Quick Reference:**
- **Detailed Analytics (#1, #2, #3, #4, #8, #11, #15, #19):** Full specs with calculation methods, API formats, SQL schemas
- **Summary Analytics (#5, #6, #7, #9, #10, #12, #13, #14, #16, #17, #18):** Implementation overview with data sources and table references

**Implementation Notes:**
- **AS-001 (Learner):** 6 analytics - 4 detailed, 2 summarized
- **AS-002 (Trainer):** 4 analytics - 1 detailed, 3 summarized
- **AS-003 (Organization):** 4 analytics - 1 detailed, 3 summarized
- **AS-004 (Predictive):** 3 analytics - 1 detailed, 2 summarized (both use Google Gemini)
- **AS-005 (Comparison):** 2 analytics - 1 detailed, 1 summarized
  - **Platform Skill Demand Analytics (#18):** FULLY AVAILABLE - shows platform-internal skill demand, trends, and AI-powered forecasting (Google Gemini)
  - **Cohort Comparisons (#19):** Includes learning path cohort and department comparisons (excludes only time-based cohort feature)
- **Excluded Feature:** Time-based cohort comparisons only (requires Directory MS enhancements not currently available)

**AI Integration Points:**
- Analytics #16: Learning Outcome Forecasting (Google Gemini)
- Analytics #17: Personalized Recommendations (Google Gemini - primary use case)
- Analytics #18: Platform Skill Demand Forecasting (Google Gemini)

