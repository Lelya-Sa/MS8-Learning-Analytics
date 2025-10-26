# Phase 2B: Backend Architecture - Step 5: Feature Design

## 5.1 Backend Feature Interfaces

### Feature 1: Authentication & Authorization Service

**Interface**: `IAuthService`
```javascript
/**
 * @interface IAuthService
 * @description Backend authentication service contract
 */
export const IAuthService = {
  /**
   * Validate JWT token and extract user info
   * @param {string} token - JWT token
   * @returns {Promise<{user: User, isValid: boolean}>}
   */
  validateToken: (token) => Promise.resolve({ user: {}, isValid: false }),
  
  /**
   * Generate JWT token for user
   * @param {User} user - User object
   * @returns {Promise<string>}
   */
  generateToken: (user) => Promise.resolve(''),
  
  /**
   * Refresh JWT token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<string>}
   */
  refreshToken: (refreshToken) => Promise.resolve(''),
  
  /**
   * Validate user role for endpoint access
   * @param {string} userId - User ID
   * @param {string} role - Required role
   * @param {string} endpoint - API endpoint
   * @returns {Promise<boolean>}
   */
  validateRole: (userId, role, endpoint) => Promise.resolve(false),
};
```

### Feature 2: Analytics Service

**Interface**: `IAnalyticsService`
```javascript
/**
 * @interface IAnalyticsService
 * @description Backend analytics service contract for all 19 analytics
 */
export const IAnalyticsService = {
  // LEARNER ANALYTICS (6)
  calculateLearnerVelocity: (userId) => Promise.resolve({}),
  calculateSkillGapMatrix: (userId) => Promise.resolve({}),
  calculateEngagementScore: (userId) => Promise.resolve({}),
  calculateMasteryProgress: (userId) => Promise.resolve({}),
  calculatePerformanceAnalytics: (userId) => Promise.resolve({}),
  calculateContentEffectiveness: (userId) => Promise.resolve({}),
  
  // TRAINER ANALYTICS (4)
  calculateCoursePerformance: (trainerId) => Promise.resolve({}),
  calculateCourseHealth: (trainerId) => Promise.resolve({}),
  calculateStudentDistribution: (trainerId) => Promise.resolve({}),
  calculateTeachingEffectiveness: (trainerId) => Promise.resolve({}),
  
  // ORGANIZATIONAL ANALYTICS (4)
  calculateOrganizationLearningVelocity: (orgId) => Promise.resolve({}),
  calculateStrategicAlignment: (orgId) => Promise.resolve({}),
  calculateLearningCulture: (orgId) => Promise.resolve({}),
  calculateOrgPerformance: (orgId) => Promise.resolve({}),
  
  // COMPARISON ANALYTICS (2)
  calculatePeerComparison: (userId) => Promise.resolve({}),
  calculateSkillDemand: () => Promise.resolve({}),
  
  // PREDICTIVE ANALYTICS (3)
  calculateDropOffRisk: (userId) => Promise.resolve({}),
  calculatePerformanceForecast: (userId) => Promise.resolve({}),
  calculateRecommendations: (userId) => Promise.resolve({}),
  
  /**
   * Trigger manual analytics refresh
   * @param {string} userId - User ID
   * @param {string} role - Active role
   * @returns {Promise<void>}
   */
  triggerManualRefresh: (userId, role) => Promise.resolve(),
  
  /**
   * Check if analytics data is stale (>6 hours)
   * @param {string} userId - User ID
   * @param {string} role - Active role
   * @returns {Promise<boolean>}
   */
  isDataStale: (userId, role) => Promise.resolve(false),
};
```

### Feature 3: External Microservice Integration

**Interface**: `IMicroserviceClient`
```javascript
/**
 * @interface IMicroserviceClient
 * @description External microservice client contract
 */
export const IMicroserviceClient = {
  /**
   * Make request to external microservice
   * @param {string} serviceName - Name of microservice
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>}
   */
  request: (serviceName, endpoint, options) => Promise.resolve({}),
  
  /**
   * Get circuit breaker status
   * @param {string} serviceName - Name of microservice
   * @returns {Promise<{isOpen: boolean, failureCount: number}>}
   */
  getCircuitBreakerStatus: (serviceName) => Promise.resolve({ isOpen: false, failureCount: 0 }),
  
  /**
   * Get mock data fallback
   * @param {string} serviceName - Name of microservice
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>}
   */
  getMockData: (serviceName, endpoint) => Promise.resolve({}),
};
```

### Feature 4: Job Queue Service

**Interface**: `IJobQueueService`
```javascript
/**
 * @interface IJobQueueService
 * @description Job queue service contract (pg-boss)
 */
export const IJobQueueService = {
  /**
   * Schedule daily batch analytics calculation
   * @param {string} cronExpression - Cron expression (02:00 UTC)
   * @returns {Promise<void>}
   */
  scheduleDailyBatch: (cronExpression) => Promise.resolve(),
  
  /**
   * Queue manual analytics refresh job
   * @param {string} userId - User ID
   * @param {string} role - Active role
   * @returns {Promise<string>} Job ID
   */
  queueManualRefresh: (userId, role) => Promise.resolve(''),
  
  /**
   * Get job status
   * @param {string} jobId - Job ID
   * @returns {Promise<{status: string, progress: number}>}
   */
  getJobStatus: (jobId) => Promise.resolve({ status: 'pending', progress: 0 }),
  
  /**
   * Cancel job
   * @param {string} jobId - Job ID
   * @returns {Promise<void>}
   */
  cancelJob: (jobId) => Promise.resolve(),
};
```

### Feature 5: Cache Service

**Interface**: `ICacheService`
```javascript
/**
 * @interface ICacheService
 * @description Cache service contract (3-layer caching)
 */
export const ICacheService = {
  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {Promise<Object|null>}
   */
  get: (key) => Promise.resolve(null),
  
  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<void>}
   */
  set: (key, data, ttl) => Promise.resolve(),
  
  /**
   * Delete data from cache
   * @param {string} key - Cache key
   * @returns {Promise<void>}
   */
  delete: (key) => Promise.resolve(),
  
  /**
   * Check if data is stale (>6 hours)
   * @param {string} key - Cache key
   * @returns {Promise<boolean>}
   */
  isStale: (key) => Promise.resolve(false),
  
  /**
   * Clear all cache
   * @returns {Promise<void>}
   */
  clear: () => Promise.resolve(),
};
```

## 5.2 API Contracts

### Contract 1: Authentication Endpoints

```javascript
/**
 * @contract AuthEndpoints
 * @description Authentication API contract
 */

// POST /api/v1/auth/login
{
  request: {
    body: {
      email: string,
      password: string
    }
  },
  response: {
    200: {
      user: User,
      token: string,
      refreshToken: string
    },
    401: {
      error: string,
      message: string
    },
    400: {
      error: string,
      validation: Object
    }
  },
  authentication: "none",
  authorization: "none",
  validation: ["email format", "password length"],
  rateLimit: "5 requests per minute"
}

// POST /api/v1/auth/refresh
{
  request: {
    body: {
      refreshToken: string
    }
  },
  response: {
    200: {
      token: string
    },
    401: {
      error: string
    }
  },
  authentication: "none",
  authorization: "none",
  validation: ["refreshToken format"],
  rateLimit: "10 requests per minute"
}

// GET /api/v1/auth/me
{
  request: {
    headers: {
      Authorization: "Bearer <token>"
    }
  },
  response: {
    200: {
      user: User
    },
    401: {
      error: string
    }
  },
  authentication: "JWT Bearer",
  authorization: "authenticated user",
  validation: ["JWT token"],
  rateLimit: "60 requests per minute"
}
```

### Contract 2: Analytics Endpoints

```javascript
/**
 * @contract AnalyticsEndpoints
 * @description Analytics API contract for all 19 analytics
 */

// GET /api/v1/learner/analytics/velocity/:userId
{
  request: {
    params: {
      userId: string
    },
    headers: {
      Authorization: "Bearer <token>",
      "X-Active-Role": "learner"
    }
  },
  response: {
    200: {
      data: LearnerVelocityData,
      cached: boolean,
      lastUpdated: string,
      expiresAt: string
    },
    401: { error: string },
    403: { error: string },
    404: { error: string }
  },
  authentication: "JWT Bearer",
  authorization: "learner role + own data",
  validation: ["userId format", "role validation"],
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour"
}

// GET /api/v1/trainer/analytics/course-performance/:trainerId
{
  request: {
    params: {
      trainerId: string
    },
    headers: {
      Authorization: "Bearer <token>",
      "X-Active-Role": "trainer"
    }
  },
  response: {
    200: {
      data: CoursePerformanceData,
      cached: boolean,
      lastUpdated: string,
      expiresAt: string
    },
    401: { error: string },
    403: { error: string },
    404: { error: string }
  },
  authentication: "JWT Bearer",
  authorization: "trainer role + own data",
  validation: ["trainerId format", "role validation"],
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour"
}

// GET /api/v1/org-admin/analytics/learning-velocity/:orgId
{
  request: {
    params: {
      orgId: string
    },
    headers: {
      Authorization: "Bearer <token>",
      "X-Active-Role": "org-admin"
    }
  },
  response: {
    200: {
      data: OrgLearningVelocityData,
      cached: boolean,
      lastUpdated: string,
      expiresAt: string
    },
    401: { error: string },
    403: { error: string },
    404: { error: string }
  },
  authentication: "JWT Bearer",
  authorization: "org-admin role + own org",
  validation: ["orgId format", "role validation"],
  caching: "6 hours TTL",
  rateLimit: "100 requests per hour"
}

// POST /api/v1/analytics/refresh
{
  request: {
    body: {
      userId: string,
      role: string,
      analytics: string[]
    },
    headers: {
      Authorization: "Bearer <token>",
      "X-Active-Role": string
    }
  },
  response: {
    200: {
      jobId: string,
      message: string
    },
    401: { error: string },
    403: { error: string },
    429: { error: string, retryAfter: number }
  },
  authentication: "JWT Bearer",
  authorization: "authenticated user + own data",
  validation: ["userId format", "role validation", "analytics array"],
  rateLimit: "3 requests per hour",
  caching: "none"
}
```

## 5.3 Business Logic Patterns

### Pattern 1: Analytics Calculation Pattern

```javascript
/**
 * @pattern AnalyticsCalculation
 * @description Standard pattern for calculating analytics
 */
class AnalyticsCalculationPattern {
  async calculate(userId, role, analyticsType) {
    // 1. Check cache first
    const cached = await this.cacheService.get(`${userId}:${role}:${analyticsType}`);
    if (cached && !this.cacheService.isStale(cached.key)) {
      return { data: cached.data, cached: true };
    }
    
    // 2. Check if data is stale (>6 hours)
    const isStale = await this.analyticsService.isDataStale(userId, role);
    if (isStale) {
      return { data: cached?.data, stale: true, requiresRefresh: true };
    }
    
    // 3. Fetch from external microservices
    const externalData = await this.fetchExternalData(userId, role, analyticsType);
    
    // 4. Calculate analytics
    const calculatedData = await this.performCalculation(externalData, analyticsType);
    
    // 5. Cache result (6 hours TTL)
    await this.cacheService.set(`${userId}:${role}:${analyticsType}`, calculatedData, 21600);
    
    // 6. Store in database
    await this.databaseService.storeAnalytics(userId, role, analyticsType, calculatedData);
    
    return { data: calculatedData, cached: false };
  }
}
```

### Pattern 2: Multi-Role Data Access Pattern

```javascript
/**
 * @pattern MultiRoleDataAccess
 * @description Pattern for role-based data access
 */
class MultiRoleDataAccessPattern {
  async getAnalytics(userId, activeRole, analyticsType) {
    // 1. Validate user has required role
    const hasRole = await this.authService.validateRole(userId, activeRole, analyticsType);
    if (!hasRole) {
      throw new ForbiddenError('Insufficient permissions');
    }
    
    // 2. Check data access rules
    const accessRules = this.getAccessRules(activeRole, analyticsType);
    if (!accessRules.canAccess) {
      throw new ForbiddenError('Access denied for this analytics type');
    }
    
    // 3. Apply K-anonymity for comparison analytics
    if (analyticsType.includes('comparison')) {
      const anonymizedData = await this.applyKAnonymity(userId, analyticsType);
      return anonymizedData;
    }
    
    // 4. Return analytics data
    return await this.analyticsService.calculate(userId, activeRole, analyticsType);
  }
}
```

### Pattern 3: Circuit Breaker Pattern

```javascript
/**
 * @pattern CircuitBreaker
 * @description Circuit breaker pattern for external microservices
 */
class CircuitBreakerPattern {
  async callExternalService(serviceName, endpoint, options) {
    const circuitBreaker = this.circuitBreakers.get(serviceName);
    
    // Check if circuit is open
    if (circuitBreaker.isOpen()) {
      // Return mock data fallback
      return await this.mockDataService.getMockData(serviceName, endpoint);
    }
    
    try {
      // Make external API call
      const result = await this.httpClient.request(endpoint, options);
      
      // Reset failure count on success
      circuitBreaker.recordSuccess();
      
      return result;
    } catch (error) {
      // Record failure
      circuitBreaker.recordFailure();
      
      // If circuit opens, return mock data
      if (circuitBreaker.isOpen()) {
        return await this.mockDataService.getMockData(serviceName, endpoint);
      }
      
      throw error;
    }
  }
}
```

## 5.4 Data Access Patterns

### Pattern 1: Repository Pattern

```javascript
/**
 * @pattern Repository
 * @description Repository pattern for data access
 */
class AnalyticsRepository {
  async findByUserAndRole(userId, role) {
    return await this.prisma.analytics.findMany({
      where: {
        userId: userId,
        role: role,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        calculatedAt: 'desc'
      }
    });
  }
  
  async createAnalytics(data) {
    return await this.prisma.analytics.create({
      data: {
        ...data,
        calculatedAt: new Date(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours
      }
    });
  }
  
  async updateAnalytics(id, data) {
    return await this.prisma.analytics.update({
      where: { id },
      data: {
        ...data,
        calculatedAt: new Date(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000)
      }
    });
  }
}
```

### Pattern 2: Query Optimization Pattern

```javascript
/**
 * @pattern QueryOptimization
 * @description Query optimization pattern for analytics
 */
class QueryOptimizationPattern {
  async getAnalyticsWithOptimization(userId, role, analyticsTypes) {
    // Use composite indexes for (userId, role) queries
    const analytics = await this.prisma.analytics.findMany({
      where: {
        userId: userId,
        role: role,
        analyticsType: {
          in: analyticsTypes
        },
        expiresAt: {
          gt: new Date()
        }
      },
      // Use composite index: (userId, role, analyticsType)
      orderBy: [
        { userId: 'asc' },
        { role: 'asc' },
        { analyticsType: 'asc' }
      ]
    });
    
    // Group by analytics type for efficient processing
    return analytics.reduce((acc, item) => {
      if (!acc[item.analyticsType]) {
        acc[item.analyticsType] = [];
      }
      acc[item.analyticsType].push(item);
      return acc;
    }, {});
  }
}
```

---

**Step 5 Complete**: ✅ Feature design - backend feature interfaces, API contracts, business logic patterns, data access patterns defined
