# Phase 2B: Backend Architecture - Step 6: API Endpoint Design

## 6.1 Complete API Endpoint Specifications

**Total Endpoints**: 35+ (19 analytics + 4 gamification + 4 auth + 3 system + 5 integration)

### 6.1.1 Authentication Endpoints

#### POST /api/v1/auth/login
```javascript
{
  request: {
    method: "POST",
    path: "/api/v1/auth/login",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      email: "user@example.com",
      password: "securePassword123"
    }
  },
  response: {
    200: {
      user: {
        id: "uuid",
        email: "user@example.com",
        fullName: "John Doe",
        roles: ["learner", "trainer"],
        organizationId: "uuid",
        avatarUrl: "https://example.com/avatar.jpg"
      },
      token: "jwt_token_string",
      refreshToken: "refresh_token_string",
      expiresIn: 3600
    },
    401: {
      error: "INVALID_CREDENTIALS",
      message: "Invalid email or password"
    },
    400: {
      error: "VALIDATION_ERROR",
      message: "Invalid request format",
      validation: {
        email: "Email format is invalid",
        password: "Password must be at least 8 characters"
      }
    },
    429: {
      error: "RATE_LIMIT_EXCEEDED",
      message: "Too many login attempts, please try again later",
      retryAfter: 900
    }
  },
  authentication: "none",
  authorization: "none",
  validation: {
    email: "required, email format",
    password: "required, min 8 characters"
  },
  errorHandling: {
    network: "retry with exponential backoff",
    validation: "return 400 with specific field errors",
    rateLimit: "return 429 with retry-after header"
  },
  caching: "none",
  rateLimit: "5 requests per 15 minutes per IP",
  security: {
    headers: ["X-Content-Type-Options", "X-Frame-Options"],
    password: "bcrypt hashed",
    token: "JWT with 1 hour expiry"
  },
  testSpecifications: {
    unit: "test validation, authentication logic",
    integration: "test full login flow",
    security: "test password hashing, token generation",
    performance: "test response time < 500ms"
  }
}
```

#### POST /api/v1/auth/refresh
```javascript
{
  request: {
    method: "POST",
    path: "/api/v1/auth/refresh",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      refreshToken: "refresh_token_string"
    }
  },
  response: {
    200: {
      token: "new_jwt_token_string",
      expiresIn: 3600
    },
    401: {
      error: "INVALID_REFRESH_TOKEN",
      message: "Refresh token is invalid or expired"
    },
    400: {
      error: "VALIDATION_ERROR",
      message: "Invalid request format",
      validation: {
        refreshToken: "Refresh token is required"
      }
    }
  },
  authentication: "none",
  authorization: "none",
  validation: {
    refreshToken: "required, valid format"
  },
  errorHandling: {
    invalidToken: "return 401",
    expiredToken: "return 401",
    validation: "return 400 with field errors"
  },
  caching: "none",
  rateLimit: "10 requests per minute per user",
  security: {
    refreshToken: "stored securely, single use",
    newToken: "JWT with 1 hour expiry"
  },
  testSpecifications: {
    unit: "test token validation, refresh logic",
    integration: "test refresh flow",
    security: "test token security",
    performance: "test response time < 200ms"
  }
}
```

#### GET /api/v1/auth/me
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/auth/me",
    headers: {
      "Authorization": "Bearer jwt_token_string"
    }
  },
  response: {
    200: {
      user: {
        id: "uuid",
        email: "user@example.com",
        fullName: "John Doe",
        roles: ["learner", "trainer"],
        organizationId: "uuid",
        avatarUrl: "https://example.com/avatar.jpg",
        lastLoginAt: "2025-10-25T10:30:00Z"
      }
    },
    401: {
      error: "UNAUTHORIZED",
      message: "Invalid or expired token"
    },
    403: {
      error: "FORBIDDEN",
      message: "Access denied"
    }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user",
  validation: {
    token: "valid JWT format, not expired"
  },
  errorHandling: {
    invalidToken: "return 401",
    expiredToken: "return 401",
    missingToken: "return 401"
  },
  caching: "5 minutes TTL",
  rateLimit: "60 requests per minute per user",
  security: {
    token: "JWT validation",
    userData: "sanitized output"
  },
  testSpecifications: {
    unit: "test token validation",
    integration: "test user data retrieval",
    security: "test token security",
    performance: "test response time < 100ms"
  }
}
```

#### POST /api/v1/auth/logout
```javascript
{
  request: {
    method: "POST",
    path: "/api/v1/auth/logout",
    headers: {
      "Authorization": "Bearer jwt_token_string"
    }
  },
  response: {
    200: {
      message: "Successfully logged out"
    },
    401: {
      error: "UNAUTHORIZED",
      message: "Invalid or expired token"
    }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user",
  validation: {
    token: "valid JWT format"
  },
  errorHandling: {
    invalidToken: "return 401",
    expiredToken: "return 401"
  },
  caching: "none",
  rateLimit: "60 requests per minute per user",
  security: {
    token: "JWT validation",
    logout: "invalidate refresh token"
  },
  testSpecifications: {
    unit: "test logout logic",
    integration: "test logout flow",
    security: "test token invalidation",
    performance: "test response time < 100ms"
  }
}
```

### 6.1.2 Learner Analytics Endpoints

#### GET /api/v1/learner/analytics/velocity/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/learner/analytics/velocity/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        currentPace: 0.75,
        targetPace: 1.0,
        trend: "accelerating",
        trendPercentage: 15.5,
        estimatedCompletion: "2025-12-15T00:00:00Z",
        status: "on-track"
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: {
      error: "UNAUTHORIZED",
      message: "Invalid or expired token"
    },
    403: {
      error: "FORBIDDEN",
      message: "Insufficient permissions for this analytics type"
    },
    404: {
      error: "NOT_FOUND",
      message: "User not found or no analytics data available"
    },
    429: {
      error: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
      retryAfter: 3600
    }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'",
    token: "valid JWT, not expired"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404",
    noData: "return 404",
    rateLimit: "return 429 with retry-after"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own data",
    roleValidation: "strict role checking",
    kAnonymity: "applied for comparison data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%",
    dataStaleness: "6 hour threshold"
  },
  testSpecifications: {
    unit: "test analytics calculation logic",
    integration: "test full analytics flow",
    security: "test data access controls",
    performance: "test response times and caching",
    dataQuality: "test analytics accuracy"
  }
}
```

#### GET /api/v1/learner/analytics/skill-gap/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/learner/analytics/skill-gap/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        currentSkills: [
          {
            skillId: "uuid",
            skillName: "JavaScript",
            masteryLevel: 0.8,
            lastAssessed: "2025-10-20T00:00:00Z"
          }
        ],
        requiredSkills: [
          {
            skillId: "uuid",
            skillName: "React",
            requiredLevel: 0.9,
            priority: "high"
          }
        ],
        gaps: [
          {
            skillId: "uuid",
            skillName: "React",
            currentLevel: 0.6,
            requiredLevel: 0.9,
            gapSize: 0.3,
            priority: "high"
          }
        ],
        recommendations: [
          {
            skillId: "uuid",
            skillName: "React",
            action: "complete_advanced_course",
            estimatedTime: "2 weeks",
            priority: "high"
          }
        ]
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own data",
    skillData: "sanitized skill information"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test skill gap calculation",
    integration: "test skills data integration",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/learner/analytics/engagement/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/learner/analytics/engagement/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        overallScore: 0.85,
        weeklyEngagement: [
          { week: "2025-W43", score: 0.82 },
          { week: "2025-W44", score: 0.88 }
        ],
        activityBreakdown: {
          courses: 0.4,
          assessments: 0.3,
          discussions: 0.2,
          projects: 0.1
        },
        trends: {
          direction: "increasing",
          percentage: 7.3
        }
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test engagement calculation",
    integration: "test engagement data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/learner/analytics/mastery/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/learner/analytics/mastery/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        overallMastery: 0.72,
        skillMastery: [
          {
            skillId: "uuid",
            skillName: "JavaScript",
            masteryLevel: 0.85,
            progress: 0.15
          }
        ],
        courseMastery: [
          {
            courseId: "uuid",
            courseName: "Advanced JavaScript",
            masteryLevel: 0.78,
            completionRate: 0.65
          }
        ],
        learningPath: {
          currentStage: "intermediate",
          nextMilestone: "advanced",
          estimatedTimeToNext: "3 weeks"
        }
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test mastery calculation",
    integration: "test mastery data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/learner/analytics/performance/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/learner/analytics/performance/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        overallPerformance: 0.78,
        assessmentScores: [
          {
            assessmentId: "uuid",
            assessmentName: "JavaScript Fundamentals",
            score: 0.85,
            date: "2025-10-20T00:00:00Z"
          }
        ],
        courseProgress: [
          {
            courseId: "uuid",
            courseName: "Advanced JavaScript",
            progress: 0.65,
            lastAccessed: "2025-10-24T00:00:00Z"
          }
        ],
        timeSpent: {
          total: 45.5,
          thisWeek: 8.2,
          averagePerSession: 1.3
        },
        strengths: ["problem-solving", "code-review"],
        areasForImprovement: ["testing", "documentation"]
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test performance calculation",
    integration: "test performance data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/learner/analytics/content-effectiveness/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/learner/analytics/content-effectiveness/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        contentEffectiveness: 0.82,
        contentTypes: [
          {
            type: "video",
            effectiveness: 0.88,
            engagement: 0.85,
            completionRate: 0.92
          },
          {
            type: "interactive",
            effectiveness: 0.95,
            engagement: 0.90,
            completionRate: 0.78
          }
        ],
        preferredLearningStyle: "visual",
        optimalSessionLength: 45,
        bestTimeOfDay: "morning",
        recommendations: [
          {
            contentId: "uuid",
            contentType: "interactive",
            reason: "high effectiveness for your learning style"
          }
        ]
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test content effectiveness calculation",
    integration: "test content data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

### 6.1.3 Trainer Analytics Endpoints

#### GET /api/v1/trainer/analytics/course-performance/:trainerId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/trainer/analytics/course-performance/:trainerId",
    params: {
      trainerId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "trainer"
    }
  },
  response: {
    200: {
      data: {
        overallPerformance: 0.85,
        courses: [
          {
            courseId: "uuid",
            courseName: "Advanced JavaScript",
            performance: 0.88,
            studentCount: 45,
            completionRate: 0.82,
            averageScore: 0.78
          }
        ],
        trends: {
          performance: "increasing",
          studentSatisfaction: "stable",
          completionRate: "improving"
        },
        insights: [
          {
            type: "success",
            message: "Course completion rates have improved by 15% this month"
          }
        ]
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "trainer role + own data only",
  validation: {
    trainerId: "required, valid UUID format",
    role: "must be 'trainer'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    trainerNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "trainer can only access own courses"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test course performance calculation",
    integration: "test trainer data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/trainer/analytics/course-health/:trainerId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/trainer/analytics/course-health/:trainerId",
    params: {
      trainerId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "trainer"
    }
  },
  response: {
    200: {
      data: {
        overallHealth: 0.78,
        courses: [
          {
            courseId: "uuid",
            courseName: "Advanced JavaScript",
            healthScore: 0.82,
            issues: [
              {
                type: "low_engagement",
                severity: "medium",
                description: "Module 3 has 20% lower engagement"
              }
            ],
            recommendations: [
              {
                action: "add_interactive_content",
                priority: "high",
                estimatedImpact: "15% engagement increase"
              }
            ]
          }
        ],
        alerts: [
          {
            type: "warning",
            message: "Course 'React Basics' has declining completion rates",
            action: "review_content"
          }
        ]
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "trainer role + own data only",
  validation: {
    trainerId: "required, valid UUID format",
    role: "must be 'trainer'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    trainerNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "trainer can only access own courses"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test course health calculation",
    integration: "test course health data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/trainer/analytics/student-distribution/:trainerId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/trainer/analytics/student-distribution/:trainerId",
    params: {
      trainerId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "trainer"
    }
  },
  response: {
    200: {
      data: {
        totalStudents: 156,
        distribution: {
          byCourse: [
            {
              courseId: "uuid",
              courseName: "Advanced JavaScript",
              studentCount: 45,
              percentage: 28.8
            }
          ],
          bySkillLevel: [
            {
              level: "beginner",
              count: 23,
              percentage: 14.7
            },
            {
              level: "intermediate",
              count: 89,
              percentage: 57.1
            },
            {
              level: "advanced",
              count: 44,
              percentage: 28.2
            }
          ],
          byProgress: [
            {
              range: "0-25%",
              count: 12,
              percentage: 7.7
            },
            {
              range: "26-50%",
              count: 34,
              percentage: 21.8
            },
            {
              range: "51-75%",
              count: 67,
              percentage: 42.9
            },
            {
              range: "76-100%",
              count: 43,
              percentage: 27.6
            }
          ]
        },
        demographics: {
          averageAge: 28.5,
          genderDistribution: {
            male: 0.65,
            female: 0.32,
            other: 0.03
          },
          geographicDistribution: {
            "North America": 0.45,
            "Europe": 0.32,
            "Asia": 0.18,
            "Other": 0.05
          }
        }
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "trainer role + own data only",
  validation: {
    trainerId: "required, valid UUID format",
    role: "must be 'trainer'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    trainerNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "trainer can only access own students",
    kAnonymity: "applied to demographic data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test student distribution calculation",
    integration: "test student data flow",
    security: "test data access controls and K-anonymity",
    performance: "test response times"
  }
}
```

#### GET /api/v1/trainer/analytics/teaching-effectiveness/:trainerId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/trainer/analytics/teaching-effectiveness/:trainerId",
    params: {
      trainerId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "trainer"
    }
  },
  response: {
    200: {
      data: {
        overallEffectiveness: 0.87,
        metrics: {
          studentSatisfaction: 0.89,
          learningOutcomes: 0.85,
          engagementRate: 0.82,
          retentionRate: 0.91
        },
        strengths: [
          {
            area: "content_delivery",
            score: 0.92,
            description: "Clear explanations and structured content"
          },
          {
            area: "student_support",
            score: 0.88,
            description: "Responsive to student questions and needs"
          }
        ],
        areasForImprovement: [
          {
            area: "interactive_content",
            score: 0.75,
            description: "Could benefit from more hands-on exercises",
            recommendations: [
              "Add more coding challenges",
              "Include peer review activities"
            ]
          }
        ],
        trends: {
          effectiveness: "increasing",
          studentSatisfaction: "stable",
          learningOutcomes: "improving"
        },
        benchmarks: {
          organizationAverage: 0.82,
          industryAverage: 0.79,
          percentile: 85
        }
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "trainer role + own data only",
  validation: {
    trainerId: "required, valid UUID format",
    role: "must be 'trainer'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    trainerNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "trainer can only access own effectiveness data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test teaching effectiveness calculation",
    integration: "test effectiveness data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

### 6.1.4 Organizational Analytics Endpoints

#### GET /api/v1/org-admin/analytics/learning-velocity/:orgId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/org-admin/analytics/learning-velocity/:orgId",
    params: {
      orgId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "org-admin"
    }
  },
  response: {
    200: {
      data: {
        overallVelocity: 0.76,
        departmentBreakdown: [
          {
            departmentId: "uuid",
            departmentName: "Engineering",
            velocity: 0.82,
            learnerCount: 45,
            averageProgress: 0.78
          },
          {
            departmentId: "uuid",
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
            departmentId: "uuid",
            departmentName: "Marketing",
            action: "increase_learning_budget",
            priority: "medium",
            estimatedImpact: "10% velocity increase"
          }
        ]
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "org-admin role + own organization only",
  validation: {
    orgId: "required, valid UUID format",
    role: "must be 'org-admin'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    orgNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "org-admin can only access own organization data",
    kAnonymity: "applied to department-level data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test learning velocity calculation",
    integration: "test org analytics data flow",
    security: "test data access controls and K-anonymity",
    performance: "test response times"
  }
}
```

#### GET /api/v1/org-admin/analytics/strategic-alignment/:orgId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/org-admin/analytics/strategic-alignment/:orgId",
    params: {
      orgId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "org-admin"
    }
  },
  response: {
    200: {
      data: {
        overallAlignment: 0.84,
        strategicGoals: [
          {
            goalId: "uuid",
            goalName: "Digital Transformation",
            alignment: 0.89,
            progress: 0.65,
            learnerCount: 78,
            completionRate: 0.82
          },
          {
            goalId: "uuid",
            goalName: "Leadership Development",
            alignment: 0.76,
            progress: 0.43,
            learnerCount: 34,
            completionRate: 0.71
          }
        ],
        skillGaps: [
          {
            skillId: "uuid",
            skillName: "Cloud Architecture",
            currentLevel: 0.45,
            requiredLevel: 0.85,
            gapSize: 0.40,
            priority: "high",
            affectedLearners: 23
          }
        ],
        resourceAllocation: {
          totalBudget: 150000,
          allocated: 120000,
          utilization: 0.80,
          byDepartment: [
            {
              departmentId: "uuid",
              departmentName: "Engineering",
              allocated: 75000,
              utilized: 68000,
              utilization: 0.91
            }
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
        ]
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "org-admin role + own organization only",
  validation: {
    orgId: "required, valid UUID format",
    role: "must be 'org-admin'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    orgNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "org-admin can only access own organization data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test strategic alignment calculation",
    integration: "test strategic data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/org-admin/analytics/learning-culture/:orgId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/org-admin/analytics/learning-culture/:orgId",
    params: {
      orgId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "org-admin"
    }
  },
  response: {
    200: {
      data: {
        overallCulture: 0.81,
        cultureDimensions: {
          collaboration: 0.85,
          innovation: 0.78,
          knowledgeSharing: 0.82,
          continuousLearning: 0.79,
          mentorship: 0.76
        },
        engagementMetrics: {
          participationRate: 0.87,
          voluntaryLearning: 0.73,
          peerLearning: 0.68,
          crossDepartmentCollaboration: 0.71
        },
        learningBehaviors: {
          averageSessionLength: 42,
          frequencyOfLearning: "3.2 times per week",
          preferredLearningMethods: [
            { method: "online_courses", percentage: 0.45 },
            { method: "peer_discussions", percentage: 0.28 },
            { method: "hands_on_projects", percentage: 0.27 }
          ],
          knowledgeSharingFrequency: "2.1 times per week"
        },
        culturalIndicators: {
          learningChampions: 12,
          mentorshipPairs: 34,
          crossTrainingPrograms: 8,
          innovationProjects: 15
        },
        trends: {
          culture: "improving",
          collaboration: "increasing",
          innovation: "stable"
        },
        recommendations: [
          {
            area: "mentorship",
            action: "expand_mentorship_program",
            priority: "medium",
            estimatedImpact: "15% culture improvement"
          }
        ]
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "org-admin role + own organization only",
  validation: {
    orgId: "required, valid UUID format",
    role: "must be 'org-admin'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    orgNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "org-admin can only access own organization data",
    kAnonymity: "applied to individual behavior data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test learning culture calculation",
    integration: "test culture data flow",
    security: "test data access controls and K-anonymity",
    performance: "test response times"
  }
}
```

#### GET /api/v1/org-admin/analytics/org-performance/:orgId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/org-admin/analytics/org-performance/:orgId",
    params: {
      orgId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "org-admin"
    }
  },
  response: {
    200: {
      data: {
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
            departmentId: "uuid",
            departmentName: "Engineering",
            performance: 0.87,
            learningROI: 2.8,
            skillDevelopmentRate: 0.82,
            retentionRate: 0.92
          },
          {
            departmentId: "uuid",
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
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "org-admin role + own organization only",
  validation: {
    orgId: "required, valid UUID format",
    role: "must be 'org-admin'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    orgNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "org-admin can only access own organization data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test org performance calculation",
    integration: "test performance data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

### 6.1.5 Comparison Analytics Endpoints

#### GET /api/v1/comparison/peer/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/comparison/peer/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        userRanking: {
          overall: 23,
          totalPeers: 156,
          percentile: 85
        },
        skillComparisons: [
          {
            skillId: "uuid",
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
            skillId: "uuid",
            skillName: "Testing",
            action: "complete_testing_course",
            priority: "high",
            expectedImpact: "10% ranking improvement"
          }
        ]
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own comparison data",
    kAnonymity: "applied to all peer data (k=5 minimum)"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test peer comparison calculation",
    integration: "test comparison data flow",
    security: "test data access controls and K-anonymity",
    performance: "test response times"
  }
}
```

#### GET /api/v1/comparison/skill-demand
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/comparison/skill-demand",
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    },
    query: {
      skills: "javascript,react,python", // optional filter
      timeframe: "6months" // optional: 3months, 6months, 1year
    }
  },
  response: {
    200: {
      data: {
        skillDemand: [
          {
            skillId: "uuid",
            skillName: "JavaScript",
            demandScore: 0.92,
            trend: "increasing",
            trendPercentage: 15.3,
            jobPostings: 1250,
            averageSalary: 95000,
            growthRate: 0.12
          },
          {
            skillId: "uuid",
            skillName: "React",
            demandScore: 0.88,
            trend: "stable",
            trendPercentage: 2.1,
            jobPostings: 890,
            averageSalary: 98000,
            growthRate: 0.08
          },
          {
            skillId: "uuid",
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
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    400: { error: "VALIDATION_ERROR" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user",
  validation: {
    skills: "optional, comma-separated skill names",
    timeframe: "optional, must be one of: 3months, 6months, 1year"
  },
  errorHandling: {
    invalidToken: "return 401",
    validation: "return 400 with field errors"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "public skill demand data",
    kAnonymity: "applied to salary and geographic data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test skill demand calculation",
    integration: "test skill demand data flow",
    security: "test K-anonymity for sensitive data",
    performance: "test response times"
  }
}
```

### 6.1.6 Predictive Analytics Endpoints

#### GET /api/v1/predictive/drop-off-risk/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/predictive/drop-off-risk/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        riskScore: 0.23,
        riskLevel: "low",
        confidence: 0.87,
        riskFactors: [
          {
            factor: "engagement_decline",
            weight: 0.35,
            currentValue: 0.78,
            threshold: 0.65,
            status: "normal"
          },
          {
            factor: "session_frequency",
            weight: 0.28,
            currentValue: 0.82,
            threshold: 0.70,
            status: "normal"
          },
          {
            factor: "assessment_scores",
            weight: 0.22,
            currentValue: 0.85,
            threshold: 0.75,
            status: "normal"
          },
          {
            factor: "peer_interaction",
            weight: 0.15,
            currentValue: 0.45,
            threshold: 0.60,
            status: "warning"
          }
        ],
        predictions: {
          nextWeekRisk: 0.28,
          nextMonthRisk: 0.31,
          trend: "increasing"
        },
        interventions: [
          {
            type: "engagement_boost",
            priority: "medium",
            action: "send_motivational_content",
            expectedImpact: "15% risk reduction",
            timeframe: "1 week"
          },
          {
            type: "social_connection",
            priority: "high",
            action: "connect_with_study_buddy",
            expectedImpact: "25% risk reduction",
            timeframe: "2 weeks"
          }
        ],
        historicalData: {
          similarUsers: 156,
          averageRiskScore: 0.34,
          interventionSuccessRate: 0.78
        }
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own risk data",
    kAnonymity: "applied to historical comparison data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test drop-off risk calculation",
    integration: "test risk prediction data flow",
    security: "test data access controls and K-anonymity",
    performance: "test response times"
  }
}
```

#### GET /api/v1/predictive/forecast/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/predictive/forecast/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        forecastPeriod: "6 months",
        confidence: 0.82,
        predictions: {
          skillDevelopment: [
            {
              skillId: "uuid",
              skillName: "JavaScript",
              currentLevel: 0.75,
              predictedLevel: 0.89,
              timeframe: "3 months",
              confidence: 0.85
            },
            {
              skillId: "uuid",
              skillName: "React",
              currentLevel: 0.65,
              predictedLevel: 0.82,
              timeframe: "4 months",
              confidence: 0.78
            }
          ],
          learningVelocity: {
            current: 0.78,
            predicted: 0.85,
            timeframe: "2 months",
            confidence: 0.88
          },
          completionTimeline: {
            currentCourse: "Advanced JavaScript",
            predictedCompletion: "2025-12-15T00:00:00Z",
            confidence: 0.82
          }
        },
        scenarios: {
          optimistic: {
            skillDevelopment: 0.92,
            learningVelocity: 0.89,
            completionTime: "2025-11-30T00:00:00Z"
          },
          realistic: {
            skillDevelopment: 0.85,
            learningVelocity: 0.82,
            completionTime: "2025-12-15T00:00:00Z"
          },
          pessimistic: {
            skillDevelopment: 0.78,
            learningVelocity: 0.75,
            completionTime: "2026-01-15T00:00:00Z"
          }
        },
        influencingFactors: [
          {
            factor: "time_investment",
            impact: "high",
            currentValue: "5 hours/week",
            recommendation: "maintain_current_pace"
          },
          {
            factor: "learning_method",
            impact: "medium",
            currentValue: "mixed",
            recommendation: "increase_hands_on_practice"
          }
        ],
        recommendations: [
          {
            type: "learning_strategy",
            priority: "high",
            action: "focus_on_react_skills",
            expectedImpact: "20% faster skill development",
            timeframe: "next 2 months"
          }
        ]
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own forecast data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test performance forecast calculation",
    integration: "test forecast data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/predictive/recommendations/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/predictive/recommendations/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: {
        recommendations: [
          {
            id: "uuid",
            type: "course",
            title: "Advanced React Patterns",
            priority: "high",
            confidence: 0.89,
            reason: "Based on your JavaScript skills and learning goals",
            expectedOutcome: "Improve React proficiency by 25%",
            estimatedTime: "3 weeks",
            difficulty: "intermediate",
            prerequisites: ["JavaScript Fundamentals", "React Basics"],
            tags: ["react", "patterns", "advanced"]
          },
          {
            id: "uuid",
            type: "skill",
            title: "Testing with Jest",
            priority: "medium",
            confidence: 0.76,
            reason: "Identified as a skill gap in your profile",
            expectedOutcome: "Enable test-driven development",
            estimatedTime: "2 weeks",
            difficulty: "intermediate",
            prerequisites: ["JavaScript Fundamentals"],
            tags: ["testing", "jest", "tdd"]
          },
          {
            id: "uuid",
            type: "learning_path",
            title: "Full-Stack JavaScript Developer",
            priority: "medium",
            confidence: 0.82,
            reason: "Aligns with your career goals and current progress",
            expectedOutcome: "Complete full-stack development skills",
            estimatedTime: "6 months",
            difficulty: "advanced",
            prerequisites: ["JavaScript", "React", "Node.js"],
            tags: ["fullstack", "javascript", "career"]
          }
        ],
        personalizedInsights: [
          {
            insight: "You're progressing 15% faster than similar learners",
            type: "positive",
            action: "maintain_current_pace"
          },
          {
            insight: "Testing skills could unlock 3 additional career paths",
            type: "opportunity",
            action: "prioritize_testing_course"
          }
        ],
        learningPreferences: {
          preferredFormat: "interactive",
          optimalSessionLength: 45,
          bestTimeOfDay: "morning",
          difficultyPreference: "progressive"
        },
        careerAlignment: {
          targetRole: "Senior Frontend Developer",
          alignment: 0.78,
          missingSkills: ["Testing", "Performance Optimization"],
          timeline: "8 months"
        }
      },
      cached: false,
      lastUpdated: "2025-10-25T10:30:00Z",
      expiresAt: "2025-10-25T16:30:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    403: { error: "FORBIDDEN" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "learner role + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "must be 'learner'"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongRole: "return 403",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own recommendations"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test recommendation generation",
    integration: "test recommendation data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

### 6.1.7 Gamification Endpoints

#### GET /api/v1/gamification/stats/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/gamification/stats/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string"
    }
  },
  response: {
    200: {
      data: {
        totalPoints: 2450,
        level: 8,
        levelProgress: 0.65,
        nextLevelPoints: 500,
        badges: [
          {
            id: "uuid",
            name: "JavaScript Master",
            description: "Completed 5 JavaScript courses",
            earnedAt: "2025-10-20T00:00:00Z",
            rarity: "rare"
          },
          {
            id: "uuid",
            name: "Streak Keeper",
            description: "7-day learning streak",
            earnedAt: "2025-10-24T00:00:00Z",
            rarity: "common"
          }
        ],
        achievements: [
          {
            id: "uuid",
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
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user + own data only",
  validation: {
    userId: "required, valid UUID format"
  },
  errorHandling: {
    invalidToken: "return 401",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own gamification data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test gamification stats calculation",
    integration: "test gamification data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/gamification/achievements/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/gamification/achievements/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string"
    }
  },
  response: {
    200: {
      data: {
        earnedAchievements: [
          {
            id: "uuid",
            name: "JavaScript Master",
            description: "Completed 5 JavaScript courses",
            earnedAt: "2025-10-20T00:00:00Z",
            rarity: "rare",
            points: 500,
            category: "skill_mastery"
          },
          {
            id: "uuid",
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
            id: "uuid",
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
            id: "uuid",
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
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user + own data only",
  validation: {
    userId: "required, valid UUID format"
  },
  errorHandling: {
    invalidToken: "return 401",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own achievements"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test achievements calculation",
    integration: "test achievements data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/gamification/leaderboard
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/gamification/leaderboard",
    headers: {
      "Authorization": "Bearer jwt_token_string"
    },
    query: {
      timeframe: "month", // week, month, year, all
      limit: 50, // optional, default 50
      category: "points" // points, streaks, achievements
    }
  },
  response: {
    200: {
      data: {
        leaderboard: [
          {
            rank: 1,
            userId: "uuid",
            displayName: "Alex Johnson",
            points: 4850,
            level: 12,
            avatar: "https://example.com/avatar1.jpg",
            badges: 8,
            streak: 23
          },
          {
            rank: 2,
            userId: "uuid",
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
        timeframe: "month",
        lastUpdated: "2025-10-25T08:00:00Z"
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    400: { error: "VALIDATION_ERROR" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user",
  validation: {
    timeframe: "optional, must be one of: week, month, year, all",
    limit: "optional, must be between 10 and 100",
    category: "optional, must be one of: points, streaks, achievements"
  },
  errorHandling: {
    invalidToken: "return 401",
    validation: "return 400 with field errors"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "public leaderboard data",
    privacy: "only display names and public stats"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test leaderboard calculation",
    integration: "test leaderboard data flow",
    security: "test privacy controls",
    performance: "test response times"
  }
}
```

#### GET /api/v1/gamification/streak/:userId
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/gamification/streak/:userId",
    params: {
      userId: "uuid"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string"
    }
  },
  response: {
    200: {
      data: {
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
      },
      cached: true,
      lastUpdated: "2025-10-25T08:00:00Z",
      expiresAt: "2025-10-25T14:00:00Z"
    },
    401: { error: "UNAUTHORIZED" },
    404: { error: "NOT_FOUND" },
    429: { error: "RATE_LIMIT_EXCEEDED" }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user + own data only",
  validation: {
    userId: "required, valid UUID format"
  },
  errorHandling: {
    invalidToken: "return 401",
    userNotFound: "return 404"
  },
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    dataAccess: "user can only access own streak data"
  },
  performance: {
    responseTime: "< 500ms cached, < 2000ms fresh",
    cacheHitRate: "> 80%"
  },
  testSpecifications: {
    unit: "test streak calculation",
    integration: "test streak data flow",
    security: "test data access controls",
    performance: "test response times"
  }
}
```

### 6.1.8 System Endpoints

#### GET /api/health
```javascript
{
  request: {
    method: "GET",
    path: "/api/health"
  },
  response: {
    200: {
      status: "healthy",
      timestamp: "2025-10-25T10:30:00Z",
      uptime: 86400,
      environment: "production",
      version: "1.0.0",
      services: {
        database: "healthy",
        cache: "healthy",
        queue: "healthy",
        external_apis: "healthy"
      }
    },
    503: {
      status: "unhealthy",
      timestamp: "2025-10-25T10:30:00Z",
      uptime: 86400,
      environment: "production",
      version: "1.0.0",
      services: {
        database: "healthy",
        cache: "unhealthy",
        queue: "healthy",
        external_apis: "degraded"
      },
      issues: [
        {
          service: "cache",
          status: "unhealthy",
          message: "Railway cache connection timeout"
        },
        {
          service: "external_apis",
          status: "degraded",
          message: "Course service responding slowly"
        }
      ]
    }
  },
  authentication: "none",
  authorization: "none",
  validation: "none",
  errorHandling: {
    serviceFailure: "return 503 with service status"
  },
  caching: "none",
  rateLimit: "1000 requests per hour",
  security: {
    headers: ["X-Content-Type-Options", "X-Frame-Options"]
  },
  performance: {
    responseTime: "< 100ms"
  },
  testSpecifications: {
    unit: "test health check logic",
    integration: "test service health monitoring",
    performance: "test response time < 100ms"
  }
}
```

#### GET /api/status
```javascript
{
  request: {
    method: "GET",
    path: "/api/status"
  },
  response: {
    200: {
      service: "MS8 Learning Analytics Backend",
      status: "operational",
      version: "1.0.0",
      timestamp: "2025-10-25T10:30:00Z",
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
    }
  },
  authentication: "none",
  authorization: "none",
  validation: "none",
  errorHandling: "none",
  caching: "none",
  rateLimit: "1000 requests per hour",
  security: {
    headers: ["X-Content-Type-Options", "X-Frame-Options"]
  },
  performance: {
    responseTime: "< 100ms"
  },
  testSpecifications: {
    unit: "test status endpoint logic",
    integration: "test service status monitoring",
    performance: "test response time < 100ms"
  }
}
```

#### POST /api/v1/analytics/refresh
```javascript
{
  request: {
    method: "POST",
    path: "/api/v1/analytics/refresh",
    headers: {
      "Authorization": "Bearer jwt_token_string",
      "X-Active-Role": "learner",
      "Content-Type": "application/json"
    },
    body: {
      userId: "uuid",
      role: "learner",
      analytics: ["velocity", "skill-gap", "engagement"]
    }
  },
  response: {
    200: {
      jobId: "job_uuid",
      message: "Manual refresh queued successfully",
      estimatedCompletion: "2025-10-25T10:35:00Z",
      queuedAnalytics: ["velocity", "skill-gap", "engagement"]
    },
    401: {
      error: "UNAUTHORIZED",
      message: "Invalid or expired token"
    },
    403: {
      error: "FORBIDDEN",
      message: "Insufficient permissions"
    },
    429: {
      error: "RATE_LIMIT_EXCEEDED",
      message: "Too many manual refresh requests, please try again later",
      retryAfter: 3600,
      nextAllowedAt: "2025-10-25T11:30:00Z"
    },
    400: {
      error: "VALIDATION_ERROR",
      message: "Invalid request format",
      validation: {
        userId: "User ID is required",
        role: "Role must be one of: learner, trainer, org-admin",
        analytics: "Analytics array must contain valid analytics types"
      }
    }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user + own data only",
  validation: {
    userId: "required, valid UUID format",
    role: "required, must be user's role",
    analytics: "required, array of valid analytics types"
  },
  errorHandling: {
    invalidToken: "return 401",
    wrongUser: "return 403",
    rateLimit: "return 429 with retry-after",
    validation: "return 400 with field errors"
  },
  caching: "none",
  rateLimit: "3 requests per hour per user",
  security: {
    userValidation: "user can only refresh own data",
    roleValidation: "role must match user's roles",
    analyticsValidation: "only valid analytics types allowed"
  },
  performance: {
    queueTime: "< 100ms",
    jobProcessing: "background processing",
    completionTime: "estimated 5 minutes"
  },
  testSpecifications: {
    unit: "test job queue logic",
    integration: "test full refresh flow",
    security: "test user validation",
    performance: "test queue performance",
    rateLimit: "test rate limiting"
  }
}
```

### 6.1.9 External Microservice Integration Endpoints

#### GET /api/v1/integration/health
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/integration/health"
  },
  response: {
    200: {
      status: "healthy",
      timestamp: "2025-10-25T10:30:00Z",
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
    },
    503: {
      status: "degraded",
      timestamp: "2025-10-25T10:30:00Z",
      services: {
        "MS12 (Auth)": { status: "healthy", responseTime: 45 },
        "Directory MS": { status: "unhealthy", responseTime: null },
        "Course Builder MS": { status: "healthy", responseTime: 89 },
        "Content Studio MS": { status: "degraded", responseTime: 1200 },
        "Assessment MS": { status: "healthy", responseTime: 78 },
        "Skills Engine MS": { status: "healthy", responseTime: 92 },
        "Learner AI MS": { status: "healthy", responseTime: 123 },
        "DevLab MS": { status: "healthy", responseTime: 87 },
        "RAG Assistant MS": { status: "healthy", responseTime: 134 }
      },
      circuitBreakers: {
        "Directory MS": { isOpen: true, failureCount: 5 },
        "Content Studio MS": { isOpen: false, failureCount: 3 }
      },
      issues: [
        {
          service: "Directory MS",
          issue: "Connection timeout",
          fallback: "Using mock data"
        },
        {
          service: "Content Studio MS",
          issue: "Slow response (>1s)",
          fallback: "Using cached data"
        }
      ]
    }
  },
  authentication: "none",
  authorization: "none",
  validation: "none",
  errorHandling: {
    serviceFailure: "return 503 with service status and fallback info"
  },
  caching: "none",
  rateLimit: "1000 requests per hour",
  security: {
    headers: ["X-Content-Type-Options", "X-Frame-Options"]
  },
  performance: {
    responseTime: "< 200ms"
  },
  testSpecifications: {
    unit: "test service health monitoring",
    integration: "test external service connectivity",
    performance: "test response time < 200ms"
  }
}
```

#### GET /api/v1/integration/services/:serviceName/status
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/integration/services/:serviceName/status",
    params: {
      serviceName: "directory" // directory, course-builder, content-studio, assessment, skills-engine, learner-ai, devlab, rag-assistant
    }
  },
  response: {
    200: {
      service: "Directory MS",
      status: "healthy",
      responseTime: 67,
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
      lastHealthCheck: "2025-10-25T10:30:00Z"
    },
    404: {
      error: "SERVICE_NOT_FOUND",
      message: "Service 'invalid-service' not found",
      availableServices: [
        "directory", "course-builder", "content-studio", "assessment", 
        "skills-engine", "learner-ai", "devlab", "rag-assistant"
      ]
    }
  },
  authentication: "none",
  authorization: "none",
  validation: {
    serviceName: "required, must be one of: directory, course-builder, content-studio, assessment, skills-engine, learner-ai, devlab, rag-assistant"
  },
  errorHandling: {
    invalidService: "return 404 with available services list"
  },
  caching: "30 seconds TTL",
  rateLimit: "100 requests per hour",
  security: {
    headers: ["X-Content-Type-Options", "X-Frame-Options"]
  },
  performance: {
    responseTime: "< 100ms"
  },
  testSpecifications: {
    unit: "test service status monitoring",
    integration: "test individual service health",
    performance: "test response time < 100ms"
  }
}
```

#### POST /api/v1/integration/services/:serviceName/test
```javascript
{
  request: {
    method: "POST",
    path: "/api/v1/integration/services/:serviceName/test",
    params: {
      serviceName: "directory"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string"
    },
    body: {
      testType: "connectivity", // connectivity, endpoint, mock-data
      endpoint: "/api/v1/users/test-user", // optional, for endpoint tests
      timeout: 5000 // optional, timeout in ms
    }
  },
  response: {
    200: {
      service: "Directory MS",
      testType: "connectivity",
      result: "success",
      responseTime: 67,
      details: {
        statusCode: 200,
        responseSize: 1024,
        headers: {
          "Content-Type": "application/json",
          "X-Response-Time": "67ms"
        }
      },
      timestamp: "2025-10-25T10:30:00Z"
    },
    400: {
      error: "TEST_FAILED",
      message: "Service test failed",
      service: "Directory MS",
      testType: "connectivity",
      result: "failure",
      details: {
        error: "Connection timeout",
        timeout: 5000,
        lastKnownStatus: "unhealthy"
      },
      fallback: {
        available: true,
        mockDataUsed: true,
        message: "Using mock data fallback"
      }
    },
    401: {
      error: "UNAUTHORIZED",
      message: "Invalid or expired token"
    },
    404: {
      error: "SERVICE_NOT_FOUND",
      message: "Service 'invalid-service' not found"
    }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user",
  validation: {
    serviceName: "required, valid service name",
    testType: "required, must be one of: connectivity, endpoint, mock-data",
    endpoint: "optional, valid endpoint path",
    timeout: "optional, number between 1000 and 30000"
  },
  errorHandling: {
    invalidToken: "return 401",
    invalidService: "return 404",
    testFailure: "return 400 with failure details"
  },
  caching: "none",
  rateLimit: "10 requests per minute per user",
  security: {
    token: "JWT validation",
    testData: "sanitized output"
  },
  performance: {
    responseTime: "< 1000ms",
    testTimeout: "configurable (1-30s)"
  },
  testSpecifications: {
    unit: "test service testing logic",
    integration: "test external service connectivity",
    security: "test authentication",
    performance: "test response times and timeouts"
  }
}
```

#### GET /api/v1/integration/mock-data/:serviceName
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/integration/mock-data/:serviceName",
    params: {
      serviceName: "directory"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string"
    },
    query: {
      endpoint: "/api/v1/users/:userId", // optional, specific endpoint
      userId: "test-user-123" // optional, for user-specific data
    }
  },
  response: {
    200: {
      service: "Directory MS",
      endpoint: "/api/v1/users/:userId",
      mockData: {
        userId: "test-user-123",
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
        generatedAt: "2025-10-25T10:30:00Z",
        dataVersion: "1.0.0",
        coverage: "100%",
        lastUpdated: "2025-10-25T08:00:00Z"
      }
    },
    401: {
      error: "UNAUTHORIZED",
      message: "Invalid or expired token"
    },
    404: {
      error: "SERVICE_NOT_FOUND",
      message: "Service 'invalid-service' not found"
    }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user",
  validation: {
    serviceName: "required, valid service name",
    endpoint: "optional, valid endpoint path",
    userId: "optional, valid user ID format"
  },
  errorHandling: {
    invalidToken: "return 401",
    invalidService: "return 404"
  },
  caching: "1 hour TTL",
  rateLimit: "100 requests per hour per user",
  security: {
    token: "JWT validation",
    mockData: "sanitized, no PII in logs"
  },
  performance: {
    responseTime: "< 50ms"
  },
  testSpecifications: {
    unit: "test mock data generation",
    integration: "test mock data structure",
    security: "test authentication and data sanitization",
    performance: "test response time < 50ms"
  }
}
```

#### POST /api/v1/integration/circuit-breaker/:serviceName/reset
```javascript
{
  request: {
    method: "POST",
    path: "/api/v1/integration/circuit-breaker/:serviceName/reset",
    params: {
      serviceName: "directory"
    },
    headers: {
      "Authorization": "Bearer jwt_token_string"
    }
  },
  response: {
    200: {
      service: "Directory MS",
      circuitBreaker: {
        isOpen: false,
        failureCount: 0,
        lastFailure: null,
        nextAttempt: null,
        resetAt: "2025-10-25T10:30:00Z"
      },
      message: "Circuit breaker reset successfully"
    },
    401: {
      error: "UNAUTHORIZED",
      message: "Invalid or expired token"
    },
    403: {
      error: "FORBIDDEN",
      message: "Insufficient permissions to reset circuit breaker"
    },
    404: {
      error: "SERVICE_NOT_FOUND",
      message: "Service 'invalid-service' not found"
    }
  },
  authentication: "JWT Bearer token",
  authorization: "admin role only",
  validation: {
    serviceName: "required, valid service name"
  },
  errorHandling: {
    invalidToken: "return 401",
    insufficientPermissions: "return 403",
    invalidService: "return 404"
  },
  caching: "none",
  rateLimit: "5 requests per hour per user",
  security: {
    token: "JWT validation",
    adminOnly: "admin role required"
  },
  performance: {
    responseTime: "< 100ms"
  },
  testSpecifications: {
    unit: "test circuit breaker reset logic",
    integration: "test circuit breaker state management",
    security: "test admin authorization",
    performance: "test response time < 100ms"
  }
}
```

#### GET /api/v1/integration/metrics
```javascript
{
  request: {
    method: "GET",
    path: "/api/v1/integration/metrics",
    headers: {
      "Authorization": "Bearer jwt_token_string"
    },
    query: {
      timeframe: "24h", // 1h, 24h, 7d, 30d
      service: "directory" // optional, filter by service
    }
  },
  response: {
    200: {
      timeframe: "24h",
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
      },
      generatedAt: "2025-10-25T10:30:00Z"
    },
    401: {
      error: "UNAUTHORIZED",
      message: "Invalid or expired token"
    },
    400: {
      error: "VALIDATION_ERROR",
      message: "Invalid timeframe or service parameter"
    }
  },
  authentication: "JWT Bearer token",
  authorization: "authenticated user",
  validation: {
    timeframe: "optional, must be one of: 1h, 24h, 7d, 30d",
    service: "optional, valid service name"
  },
  errorHandling: {
    invalidToken: "return 401",
    validation: "return 400 with field errors"
  },
  caching: "5 minutes TTL",
  rateLimit: "60 requests per hour per user",
  security: {
    token: "JWT validation",
    metrics: "sanitized, no PII"
  },
  performance: {
    responseTime: "< 200ms"
  },
  testSpecifications: {
    unit: "test metrics calculation",
    integration: "test metrics aggregation",
    security: "test authentication",
    performance: "test response time < 200ms"
  }
}
```

---

**Step 6 Complete**: ✅ API Endpoint Design - for each endpoint defined: route, HTTP method, request schema, response schema (all status codes), authentication requirements, authorization rules, validation rules, error handling, caching strategy, pagination/filtering, rate limiting, security headers, test specifications
