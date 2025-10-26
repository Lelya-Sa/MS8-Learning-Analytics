# API Endpoint Specifications

**Phase:** 2B - Backend Architecture  
**Date:** October 24, 2025  
**Status:** Complete - Ready for Implementation  
**Based on:** Debate #4 (Backend API Structure)

---

## 🎯 **Overview**

Complete REST API specifications for all 30+ endpoints in the Learning Analytics microservice.

**Base URL:** `https://api.yourdomain.com/api/v1`  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`  
**Rate Limiting:** 100 req/min (standard), 10 req/hour (predictive)

---

## 📡 **Endpoint Categories**

1. **Authentication** (2 endpoints)
2. **Learner Analytics** (6 endpoints)
3. **Trainer Analytics** (4 endpoints)
4. **Organization Analytics** (4 endpoints)
5. **Comparison Analytics** (2 endpoints)
6. **Predictive Analytics** (3 endpoints)
7. **Gamification** (4 endpoints)
8. **Integration Management** (6 endpoints)
9. **Health** (1 endpoint)

**Total:** 32 endpoints

---

## 🔐 **1. Authentication Endpoints**

### **POST /api/v1/auth/login**

**Description:** Authenticate user and return JWT token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "roles": ["learner", "trainer"],
      "organizationId": "org-456"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing required fields

---

### **GET /api/v1/auth/me**

**Description:** Get current authenticated user

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "roles": ["learner", "trainer"],
    "organizationId": "org-456",
    "preferences": {
      "leaderboardPrivacy": "public",
      "predictiveAnalyticsEnabled": true
    }
  }
}
```

---

## 📊 **2. Learner Analytics Endpoints**

### **GET /api/v1/analytics/learner/velocity/:userId**

**Description:** Get learner's learning velocity analytics

**Auth Required:** Yes  
**Roles Allowed:** `learner` (own data), `trainer`, `org_admin`  
**Rate Limit:** 100 req/min  
**Cache TTL:** 5 minutes (backend), 4 hours (frontend)

**Parameters:**
- `userId` (path): User ID

**Query Parameters:**
- `startDate` (optional): ISO date string (default: 30 days ago)
- `endDate` (optional): ISO date string (default: today)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "currentPace": 2.5,
    "targetPace": 3.0,
    "unit": "topics/week",
    "trendDirection": "accelerating",
    "trendPercentage": 38,
    "status": "on_track",
    "statusColor": "green",
    "estimatedCompletion": "2026-02-15",
    "milestones": [
      {
        "name": "React Basics",
        "completedAt": "2025-10-15",
        "daysToComplete": 7
      }
    ]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime",
    "cacheExpiry": "2025-10-24T10:05:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to view this user's data
- `404 Not Found`: User not found
- `400 Bad Request`: Invalid date range

---

### **GET /api/v1/analytics/learner/skill-gap/:userId**

**Description:** Get skill gap matrix

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "totalGaps": 12,
    "criticalGaps": 5,
    "gaps": [
      {
        "skillId": "skill-js",
        "skillName": "JavaScript",
        "currentLevel": 2,
        "requiredLevel": 4,
        "gap": 2,
        "priority": "high",
        "estimatedTimeToClose": "4 weeks"
      }
    ],
    "topPriority": {
      "skillName": "JavaScript",
      "reason": "Required for React course"
    }
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/learner/engagement/:userId**

**Description:** Get engagement analytics

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "overallScore": 78,
    "trend": "increasing",
    "sessionsPerWeek": 5.2,
    "avgSessionDuration": 45,
    "lastActive": "2025-10-24T09:30:00Z",
    "engagementByType": {
      "videoWatch": 35,
      "reading": 25,
      "practice": 30,
      "assessment": 10
    },
    "weeklyTrend": [65, 70, 72, 75, 78]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/learner/mastery/:userId**

**Description:** Get skill mastery progression

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "masteredSkills": 12,
    "inProgressSkills": 8,
    "skills": [
      {
        "skillId": "skill-react",
        "skillName": "React",
        "masteryLevel": 85,
        "status": "mastered",
        "masteredAt": "2025-10-20T10:00:00Z",
        "timeToMaster": "6 weeks"
      }
    ],
    "masteryDistribution": {
      "beginner": 3,
      "intermediate": 8,
      "advanced": 7,
      "expert": 2
    }
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/learner/performance/:userId**

**Description:** Get assessment performance analytics

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "avgScore": 82,
    "trend": "improving",
    "assessmentsTaken": 15,
    "passRate": 87,
    "performanceBySkill": [
      {
        "skillName": "JavaScript",
        "avgScore": 85,
        "assessmentCount": 5,
        "trend": "stable"
      }
    ],
    "recentScores": [75, 78, 80, 82, 85]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/learner/content-effectiveness/:userId**

**Description:** Get content effectiveness analytics

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "mostEffective": [
      {
        "contentType": "video",
        "effectiveness": 92,
        "completionRate": 95,
        "avgRetention": 88
      }
    ],
    "leastEffective": [
      {
        "contentType": "reading",
        "effectiveness": 65,
        "completionRate": 70,
        "avgRetention": 60
      }
    ],
    "recommendations": [
      "Focus more on video-based learning",
      "Supplement reading with interactive exercises"
    ]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

## 👨‍🏫 **3. Trainer Analytics Endpoints**

### **GET /api/v1/analytics/trainer/course-performance/:trainerId**

**Auth Required:** Yes  
**Roles Allowed:** `trainer` (own data), `org_admin`  
**Cache TTL:** 10 minutes (backend), 2 hours (frontend)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trainerId": "trainer-123",
    "totalCourses": 8,
    "avgCompletionRate": 78,
    "avgRating": 4.6,
    "totalStudents": 156,
    "courses": [
      {
        "courseId": "course-react",
        "courseName": "React Mastery",
        "enrollments": 45,
        "completions": 38,
        "completionRate": 84,
        "avgScore": 85,
        "avgRating": 4.8
      }
    ]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/trainer/course-health/:trainerId**

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trainerId": "trainer-123",
    "healthyCourses": 6,
    "atRiskCourses": 2,
    "courses": [
      {
        "courseId": "course-react",
        "courseName": "React Mastery",
        "healthScore": 92,
        "status": "healthy",
        "metrics": {
          "completionRate": 84,
          "engagementScore": 88,
          "dropOffRate": 12
        },
        "alerts": []
      },
      {
        "courseId": "course-node",
        "courseName": "Node.js Fundamentals",
        "healthScore": 65,
        "status": "at_risk",
        "metrics": {
          "completionRate": 55,
          "engagementScore": 62,
          "dropOffRate": 35
        },
        "alerts": [
          "High drop-off rate in Week 3",
          "Low engagement with video content"
        ]
      }
    ]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/trainer/student-distribution/:trainerId**

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trainerId": "trainer-123",
    "totalStudents": 156,
    "byLevel": {
      "beginner": 45,
      "intermediate": 78,
      "advanced": 33
    },
    "byProgress": {
      "notStarted": 12,
      "inProgress": 98,
      "completed": 46
    },
    "byPerformance": {
      "struggling": 15,
      "onTrack": 120,
      "excelling": 21
    }
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/trainer/teaching-effectiveness/:trainerId**

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trainerId": "trainer-123",
    "overallScore": 88,
    "studentSuccessRate": 84,
    "avgStudentSatisfaction": 4.6,
    "contentQualityScore": 92,
    "engagementScore": 85,
    "strengths": [
      "Clear explanations",
      "Responsive to questions",
      "Well-structured content"
    ],
    "areasForImprovement": [
      "More interactive exercises",
      "Faster response time to questions"
    ]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

## 🏢 **4. Organization Analytics Endpoints**

### **GET /api/v1/analytics/organization/learning-velocity/:orgId**

**Auth Required:** Yes  
**Roles Allowed:** `org_admin`  
**Cache TTL:** 30 minutes (backend), 6 hours (frontend)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "organizationId": "org-456",
    "overallPace": 2.8,
    "targetPace": 3.0,
    "trend": "stable",
    "roiMetrics": {
      "avgCompletionTime": "8 weeks",
      "costPerCompletion": 250,
      "roiPercentage": 320
    },
    "departmentBreakdown": [
      {
        "departmentId": "dept-eng",
        "departmentName": "Engineering",
        "pace": 3.2,
        "employeeCount": 45,
        "onTrackCount": 38
      }
    ],
    "monthlyTrend": [2.5, 2.6, 2.7, 2.8, 2.8]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/organization/strategic-alignment/:orgId**

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "organizationId": "org-456",
    "overallAlignment": 82,
    "strategicGoals": [
      {
        "goalId": "goal-cloud",
        "goalName": "Cloud Migration",
        "targetSkills": ["AWS", "Docker", "Kubernetes"],
        "alignmentScore": 88,
        "employeesAligned": 34,
        "employeesTotal": 45,
        "progress": 75
      }
    ],
    "gapAnalysis": {
      "criticalSkillGaps": ["Kubernetes", "Terraform"],
      "estimatedTimeToClose": "12 weeks",
      "recommendedActions": [
        "Enroll 15 employees in Kubernetes course",
        "Hire 2 senior DevOps engineers"
      ]
    }
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/organization/department-analytics/:orgId**

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "organizationId": "org-456",
    "departments": [
      {
        "departmentId": "dept-eng",
        "departmentName": "Engineering",
        "employeeCount": 45,
        "metrics": {
          "avgCompletionRate": 82,
          "avgEngagementScore": 78,
          "skillsCovered": 25,
          "certificationsEarned": 18
        },
        "topPerformers": [
          {
            "userId": "user-789",
            "fullName": "Alice Johnson",
            "completionRate": 95,
            "skillsMastered": 12
          }
        ],
        "trend": "improving"
      }
    ],
    "teamComparison": {
      "highestEngagement": "Engineering",
      "lowestEngagement": "Sales",
      "mostImproved": "Marketing"
    }
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/analytics/organization/learning-culture/:orgId**

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "organizationId": "org-456",
    "overallScore": 85,
    "metrics": {
      "learningEngagement": 88,
      "knowledgeSharing": 82,
      "innovationIndex": 78,
      "continuousLearning": 90
    },
    "culturalIndicators": [
      {
        "indicator": "Peer-to-peer learning",
        "score": 85,
        "trend": "increasing"
      },
      {
        "indicator": "Leadership support",
        "score": 92,
        "trend": "stable"
      }
    ],
    "benchmarks": {
      "industryAverage": 75,
      "topQuartile": 88,
      "yourPosition": "Top 20%"
    }
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

## 📊 **5. Comparison Analytics Endpoints**

### **GET /api/v1/analytics/comparison/peer/:userId**

**Auth Required:** Yes  
**Roles Allowed:** `learner`, `trainer`, `org_admin`  
**Cache TTL:** 1 hour (backend), 4 hours (frontend)

**Query Parameters:**
- `scope` (optional): `within_org` | `overall_platform` (default: `within_org`)
- `competencyLevel` (optional): `beginner` | `intermediate` | `advanced` (default: user's level)
- `skillId` (optional): Filter by specific skill
- `learningPathId` (optional): Filter by learning path

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "userMetrics": {
      "learningVelocity": 2.5,
      "avgScore": 82,
      "skillsMastered": 12
    },
    "peerAverages": {
      "learningVelocity": 2.2,
      "avgScore": 78,
      "skillsMastered": 10
    },
    "percentileRank": 75,
    "comparisonGroup": {
      "scope": "within_org",
      "competencyLevel": "intermediate",
      "sampleSize": 45,
      "filters": {
        "organizationId": "org-456",
        "competencyLevel": "intermediate"
      }
    },
    "insights": [
      "You're learning 13% faster than your peers",
      "Your assessment scores are 5% above average",
      "You've mastered 20% more skills than similar learners"
    ]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime",
    "privacy": "k_anonymity_enforced",
    "minSampleSize": 10
  }
}
```

**Error Responses:**
- `400 Bad Request`: Insufficient sample size (< 10 users for K-anonymity)

---

### **GET /api/v1/analytics/comparison/skill-demand**

**Auth Required:** Yes  
**Roles Allowed:** All authenticated users  
**Cache TTL:** 24 hours (backend), 4 hours (frontend)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "topDemandSkills": [
      {
        "skillId": "skill-react",
        "skillName": "React",
        "demandScore": 95,
        "trendDirection": "increasing",
        "trendPercentage": 30,
        "learnerCount": 1250,
        "jobPostings": 3500
      }
    ],
    "emergingSkills": [
      {
        "skillId": "skill-rust",
        "skillName": "Rust",
        "growthRate": 120,
        "currentDemand": 65
      }
    ],
    "userSkillGaps": [
      {
        "skillName": "TypeScript",
        "demandScore": 88,
        "userMastery": 45,
        "gap": 43,
        "priority": "high"
      }
    ]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime",
    "lastRefreshed": "2025-10-24T02:00:00Z"
  }
}
```

---

## 🔮 **6. Predictive Analytics Endpoints**

### **GET /api/v1/analytics/predictive/drop-off-risk/:userId**

**Auth Required:** Yes  
**Roles Allowed:** `learner` (own), `trainer`, `org_admin`  
**Rate Limit:** 10 req/hour  
**Cache TTL:** 48 hours (backend), 48 hours (frontend)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "riskLevel": "high",
    "riskScore": 0.85,
    "confidenceScore": 0.92,
    "factors": [
      {
        "factor": "No activity in 7 days",
        "weight": 0.4,
        "impact": "high"
      },
      {
        "factor": "Declining engagement trend",
        "weight": 0.3,
        "impact": "medium"
      }
    ],
    "recommendations": [
      "Resume your React course (50% complete)",
      "Set a daily learning reminder",
      "Join peer study group"
    ],
    "predictedOutcome": {
      "ifNoAction": "Likely to drop off in next 14 days",
      "ifActionTaken": "80% chance of re-engagement"
    }
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "ai_generated",
    "model": "google_gemini",
    "cacheExpiry": "2025-10-26T10:00:00Z"
  }
}
```

---

### **GET /api/v1/analytics/predictive/forecast/:userId**

**Query Parameters:**
- `type`: `course` | `skill` | `learning_path`
- `id`: ID of the item to forecast

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "forecastType": "course",
    "itemId": "course-react",
    "itemName": "React Mastery",
    "currentProgress": 65,
    "predictedCompletionDate": "2026-02-15",
    "targetCompletionDate": "2026-03-01",
    "confidenceScore": 0.85,
    "scenarios": {
      "best": {
        "date": "2026-01-15",
        "condition": "Maintain 3 topics/week"
      },
      "expected": {
        "date": "2026-02-15",
        "condition": "Current pace of 2 topics/week"
      },
      "worst": {
        "date": "2026-04-01",
        "condition": "Pace drops to 1 topic/week"
      }
    },
    "milestones": [
      {
        "name": "Hooks & State",
        "status": "in_progress",
        "estimatedCompletionDate": "2025-11-15"
      }
    ]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "ai_generated",
    "model": "time_series_forecast"
  }
}
```

---

### **GET /api/v1/analytics/predictive/recommendations/:userId**

**Query Parameters:**
- `context` (optional): `skill_gap` | `velocity` | `general`
- `limit` (optional): Number of recommendations (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "recommendations": [
      {
        "id": "rec-001",
        "type": "course",
        "courseId": "course-react-hooks",
        "courseName": "React Hooks Deep Dive",
        "priority": 1,
        "reasoning": "You've completed React Basics with 85% score. Hooks are the natural next step.",
        "expectedOutcomes": [
          "Master advanced React patterns",
          "Increase job market relevance by 15%"
        ],
        "estimatedCompletionTime": "3 weeks",
        "confidenceScore": 0.92,
        "actions": {
          "enroll": "/courses/course-react-hooks/enroll",
          "addToPath": "/learning-paths/add/course-react-hooks"
        }
      }
    ],
    "context": "general"
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "ai_generated",
    "model": "google_gemini",
    "cacheExpiry": "2025-10-26T10:00:00Z"
  }
}
```

---

## 🎮 **7. Gamification Endpoints**

### **GET /api/v1/gamification/stats/:userId**

**Auth Required:** Yes  
**Cache TTL:** 5 minutes (backend), 1 hour (frontend)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "totalPoints": 1250,
    "currentLevel": 5,
    "levelProgress": 60,
    "nextLevelPoints": 1500,
    "currentStreak": 7,
    "longestStreak": 14,
    "streakFreezes": 2,
    "latestAchievement": {
      "id": "ach-first-course",
      "name": "First Steps",
      "description": "Complete your first course",
      "icon": "🎓",
      "tier": "beginner",
      "earnedAt": "2025-10-20T10:00:00Z"
    },
    "pointsByRole": {
      "learner": 800,
      "trainer": 450
    }
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/gamification/achievements/:userId**

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "totalAchievements": 15,
    "achievementsByTier": {
      "beginner": 8,
      "intermediate": 5,
      "advanced": 2,
      "elite": 0
    },
    "achievements": [
      {
        "id": "ach-first-course",
        "name": "First Steps",
        "description": "Complete your first course",
        "icon": "🎓",
        "tier": "beginner",
        "earnedAt": "2025-10-20T10:00:00Z",
        "progress": 100
      },
      {
        "id": "ach-10-courses",
        "name": "Course Collector",
        "description": "Complete 10 courses",
        "icon": "📚",
        "tier": "intermediate",
        "earnedAt": null,
        "progress": 60
      }
    ]
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

### **GET /api/v1/gamification/leaderboard**

**Query Parameters:**
- `period`: `weekly` | `monthly` | `alltime` (default: `weekly`)
- `type`: `overall` | `learner` | `trainer` | `org` | `friends` (default: `overall`)
- `limit`: Number of entries (default: 50)
- `page`: Page number (default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "weekly",
    "type": "overall",
    "entries": [
      {
        "rank": 1,
        "userId": "user-456",
        "displayName": "Jane Smith",
        "avatar": "https://...",
        "points": 2500,
        "badge": "🏆"
      },
      {
        "rank": 2,
        "userId": "user-789",
        "displayName": "Anonymous User #123",
        "avatar": "/default-avatar.png",
        "points": 2300,
        "badge": "🥈"
      }
    ],
    "currentUser": {
      "rank": 487,
      "percentile": 49,
      "points": 1250
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 20,
      "totalEntries": 1000
    }
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "materialized_view",
    "lastRefreshed": "2025-10-24T09:00:00Z"
  }
}
```

---

### **GET /api/v1/gamification/streak/:userId**

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "currentStreak": 7,
    "longestStreak": 14,
    "streakLevel": "double_flame",
    "streakFreezes": 2,
    "streakHistory": [
      {
        "date": "2025-10-24",
        "activityType": "lesson_complete",
        "maintained": true
      }
    ],
    "motivation": "Keep it up! You're on fire 🔥"
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime"
  }
}
```

---

## 🔗 **8. Integration Management Endpoints**

### **GET /api/v1/integration/health**

**Description:** Get health status of all external microservices

**Auth Required:** Yes  
**Roles Allowed:** `org_admin`, `trainer`  
**Cache TTL:** 1 minute (backend), 5 minutes (frontend)

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-25T10:30:00Z",
  "services": {
    "directory-service": {
      "status": "healthy",
      "responseTime": 45,
      "lastChecked": "2025-10-25T10:29:55Z",
      "url": "https://directory-service.railway.app"
    },
    "course-builder-service": {
      "status": "healthy", 
      "responseTime": 67,
      "lastChecked": "2025-10-25T10:29:55Z",
      "url": "https://course-builder-service.railway.app"
    },
    "content-studio-service": {
      "status": "degraded",
      "responseTime": 1200,
      "lastChecked": "2025-10-25T10:29:55Z",
      "url": "https://content-studio-service.railway.app",
      "issue": "Slow response (>1s)"
    }
  },
  "circuitBreakers": {
    "directory-service": { "isOpen": false, "failureCount": 0 },
    "course-builder-service": { "isOpen": false, "failureCount": 0 },
    "content-studio-service": { "isOpen": false, "failureCount": 3 }
  }
}
```

---

### **GET /api/v1/integration/status**

**Description:** Get detailed status of external microservices

**Auth Required:** Yes  
**Roles Allowed:** `org_admin`, `trainer`  
**Cache TTL:** 2 minutes (backend), 10 minutes (frontend)

**Response (200 OK):**
```json
{
  "timestamp": "2025-10-25T10:30:00Z",
  "overallStatus": "degraded",
  "services": [
    {
      "name": "directory-service",
      "url": "https://directory-service.railway.app",
      "status": "healthy",
      "responseTime": 45,
      "circuitBreaker": {
        "state": "CLOSED",
        "failureCount": 0,
        "lastFailure": null,
        "nextAttempt": null
      },
      "lastSuccessfulCall": "2025-10-25T10:29:55Z",
      "totalCalls": 1250,
      "successfulCalls": 1248,
      "failedCalls": 2,
      "successRate": 99.84
    }
  ],
  "summary": {
    "totalServices": 9,
    "healthyServices": 8,
    "degradedServices": 1,
    "unhealthyServices": 0,
    "averageResponseTime": 98.5,
    "overallSuccessRate": 98.2
  }
}
```

---

### **POST /api/v1/integration/test**

**Description:** Test connectivity to external microservices

**Auth Required:** Yes  
**Roles Allowed:** `org_admin`, `trainer`  
**Rate Limit:** 20 req/hour

**Request:**
```json
{
  "serviceName": "directory-service",
  "endpoint": "/api/v1/users/test-user"
}
```

**Response (200 OK):**
```json
{
  "serviceName": "directory-service",
  "endpoint": "/api/v1/users/test-user",
  "testResult": "success",
  "responseTime": 67,
  "statusCode": 200,
  "timestamp": "2025-10-25T10:30:00Z",
  "response": {
    "id": "test-user",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  },
  "error": null
}
```

---

### **GET /api/v1/integration/mock-data/{serviceName}**

**Description:** Get mock data for a specific service

**Auth Required:** Yes  
**Roles Allowed:** `org_admin`, `trainer`  
**Cache TTL:** 1 hour (backend), 1 hour (frontend)

**Response (200 OK):**
```json
{
  "serviceName": "directory-service",
  "mockData": {
    "user": {
      "id": "user_123",
      "email": "john.doe@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "learner",
      "organizationId": "org_456",
      "department": "Engineering",
      "position": "Software Developer"
    },
    "organization": {
      "id": "org_456",
      "name": "TechCorp Solutions",
      "domain": "techcorp.com",
      "industry": "Technology",
      "size": "500-1000"
    }
  },
  "lastUpdated": "2025-10-25T10:00:00Z"
}
```

---

### **POST /api/v1/integration/circuit-breaker/reset**

**Description:** Reset circuit breaker for a specific service

**Auth Required:** Yes  
**Roles Allowed:** `org_admin`  
**Rate Limit:** 10 req/hour

**Request:**
```json
{
  "serviceName": "content-studio-service"
}
```

**Response (200 OK):**
```json
{
  "serviceName": "content-studio-service",
  "action": "reset",
  "result": "success",
  "previousState": "OPEN",
  "newState": "CLOSED",
  "timestamp": "2025-10-25T10:30:00Z",
  "message": "Circuit breaker reset successfully"
}
```

---

### **GET /api/v1/integration/metrics**

**Description:** Get integration performance metrics

**Auth Required:** Yes  
**Roles Allowed:** `org_admin`, `trainer`  
**Cache TTL:** 5 minutes (backend), 30 minutes (frontend)

**Response (200 OK):**
```json
{
  "timestamp": "2025-10-25T10:30:00Z",
  "period": "24h",
  "metrics": {
    "directory-service": {
      "totalRequests": 1250,
      "successfulRequests": 1248,
      "failedRequests": 2,
      "successRate": 99.84,
      "averageResponseTime": 45,
      "p95ResponseTime": 89,
      "p99ResponseTime": 156,
      "circuitBreakerTrips": 0,
      "mockDataFallbacks": 0
    }
  },
  "summary": {
    "totalRequests": 8900,
    "totalSuccessfulRequests": 8733,
    "totalFailedRequests": 167,
    "overallSuccessRate": 98.12,
    "averageResponseTime": 98.5,
    "totalCircuitBreakerTrips": 1,
    "totalMockDataFallbacks": 25
  }
}
```

---

## ❤️ **9. Health Endpoint**

### **GET /api/v1/health**

**Auth Required:** No

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-24T10:00:00Z",
  "uptime": 86400,
  "environment": "production",
  "services": {
    "database": "healthy",
    "cache": "healthy",
    "microservices": {
      "auth": "healthy",
      "courses": "healthy",
      "skills": "degraded"
    }
  }
}
```

---

## 🔒 **Common Error Responses**

All endpoints may return these error responses:

### **401 Unauthorized**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": "No valid JWT token provided"
  }
}
```

### **403 Forbidden**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied",
    "details": "User does not have required role"
  }
}
```

### **429 Too Many Requests**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": "Rate limit: 100 req/min. Try again in 30 seconds.",
    "retryAfter": 30
  }
}
```

### **500 Internal Server Error**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "details": "Please try again later or contact support"
  }
}
```

---

## ✅ **Complete**

**Total Endpoints Documented:** 32  
**All request/response schemas defined:** ✅  
**Error handling documented:** ✅  
**Authentication/authorization specified:** ✅  
**Caching strategy defined:** ✅  
**Rate limiting specified:** ✅  
**Integration management endpoints:** ✅

**Ready for Phase 3B Implementation**

---

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Status:** Complete - Ready for Implementation

