# Phase 2B: Backend Architecture - Step 8: Backend Architecture Design

## 8.1 Backend Onion Architecture Design

### Layer 1: Domain (Core Business Logic)

#### Domain Entities
```javascript
// domain/entities/User.js
/**
 * @typedef {Object} User
 * @property {string} id - User ID (UUID)
 * @property {string} email - User email
 * @property {string} fullName - User full name
 * @property {string[]} roles - Array of user roles
 * @property {string} organizationId - Organization ID
 * @property {string} activeRole - Currently active role
 * @property {string} avatarUrl - User avatar URL
 * @property {Date} lastLoginAt - Last login timestamp
 * @property {Date} createdAt - User creation timestamp
 * @property {Date} updatedAt - User update timestamp
 */

// domain/entities/Analytics.js
/**
 * @typedef {Object} Analytics
 * @property {string} id - Analytics ID
 * @property {string} userId - User ID
 * @property {string} role - User role
 * @property {string} analyticsType - Type of analytics
 * @property {Object} data - Analytics data
 * @property {Date} calculatedAt - Calculation timestamp
 * @property {Date} expiresAt - Expiration timestamp
 * @property {boolean} cached - Whether data is cached
 * @property {string} source - Data source (external, cached, calculated)
 */

// domain/entities/Achievement.js
/**
 * @typedef {Object} Achievement
 * @property {string} id - Achievement ID
 * @property {string} name - Achievement name
 * @property {string} description - Achievement description
 * @property {string} category - Achievement category
 * @property {string} rarity - Achievement rarity (common, uncommon, rare, epic)
 * @property {number} points - Points awarded
 * @property {Object} criteria - Achievement criteria
 * @property {Date} createdAt - Achievement creation timestamp
 */

// domain/entities/Job.js
/**
 * @typedef {Object} Job
 * @property {string} id - Job ID
 * @property {string} type - Job type
 * @property {string} status - Job status (pending, running, completed, failed)
 * @property {Object} payload - Job payload
 * @property {number} progress - Job progress (0-100)
 * @property {Date} createdAt - Job creation timestamp
 * @property {Date} startedAt - Job start timestamp
 * @property {Date} completedAt - Job completion timestamp
 * @property {string} error - Error message if failed
 */
```

#### Domain Interfaces
```javascript
// domain/interfaces/IAnalyticsService.js
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
  
  // UTILITY METHODS
  triggerManualRefresh: (userId, role) => Promise.resolve(),
  isDataStale: (userId, role) => Promise.resolve(false),
};

// domain/interfaces/IAuthService.js
export const IAuthService = {
  validateToken: (token) => Promise.resolve({ user: {}, isValid: false }),
  generateToken: (user) => Promise.resolve(''),
  refreshToken: (refreshToken) => Promise.resolve(''),
  validateRole: (userId, role, endpoint) => Promise.resolve(false),
  hashPassword: (password) => Promise.resolve(''),
  comparePassword: (password, hash) => Promise.resolve(false),
};

// domain/interfaces/ICacheService.js
export const ICacheService = {
  get: (key) => Promise.resolve(null),
  set: (key, data, ttl) => Promise.resolve(),
  delete: (key) => Promise.resolve(),
  isStale: (key) => Promise.resolve(false),
  clear: () => Promise.resolve(),
};

// domain/interfaces/IJobQueueService.js
export const IJobQueueService = {
  scheduleDailyBatch: (cronExpression) => Promise.resolve(),
  queueManualRefresh: (userId, role) => Promise.resolve(''),
  getJobStatus: (jobId) => Promise.resolve({ status: 'pending', progress: 0 }),
  cancelJob: (jobId) => Promise.resolve(),
};

// domain/interfaces/IMicroserviceClient.js
export const IMicroserviceClient = {
  request: (serviceName, endpoint, options) => Promise.resolve({}),
  getCircuitBreakerStatus: (serviceName) => Promise.resolve({ isOpen: false, failureCount: 0 }),
  getMockData: (serviceName, endpoint) => Promise.resolve({}),
};
```

#### Domain Constants
```javascript
// domain/constants/AnalyticsTypes.js
export const ANALYTICS_TYPES = {
  LEARNER: {
    VELOCITY: 'learner-velocity',
    SKILL_GAP: 'learner-skill-gap',
    ENGAGEMENT: 'learner-engagement',
    MASTERY: 'learner-mastery',
    PERFORMANCE: 'learner-performance',
    CONTENT_EFFECTIVENESS: 'learner-content-effectiveness'
  },
  TRAINER: {
    COURSE_PERFORMANCE: 'trainer-course-performance',
    COURSE_HEALTH: 'trainer-course-health',
    STUDENT_DISTRIBUTION: 'trainer-student-distribution',
    TEACHING_EFFECTIVENESS: 'trainer-teaching-effectiveness'
  },
  ORGANIZATIONAL: {
    LEARNING_VELOCITY: 'org-learning-velocity',
    STRATEGIC_ALIGNMENT: 'org-strategic-alignment',
    LEARNING_CULTURE: 'org-learning-culture',
    ORG_PERFORMANCE: 'org-performance'
  },
  COMPARISON: {
    PEER_COMPARISON: 'comparison-peer',
    SKILL_DEMAND: 'comparison-skill-demand'
  },
  PREDICTIVE: {
    DROP_OFF_RISK: 'predictive-drop-off-risk',
    PERFORMANCE_FORECAST: 'predictive-performance-forecast',
    RECOMMENDATIONS: 'predictive-recommendations'
  }
};

// domain/constants/Roles.js
export const ROLES = {
  LEARNER: 'learner',
  TRAINER: 'trainer',
  ORG_ADMIN: 'org-admin'
};

// domain/constants/CacheKeys.js
export const CACHE_KEYS = {
  ANALYTICS: (userId, role, analyticsType) => `analytics:${userId}:${role}:${analyticsType}`,
  USER: (userId) => `user:${userId}`,
  GAMIFICATION: (userId) => `gamification:${userId}`,
  LEADERBOARD: (timeframe) => `leaderboard:${timeframe}`
};

// domain/constants/ExternalServices.js
export const EXTERNAL_SERVICES = {
  AUTH: 'auth-service',
  DIRECTORY: 'directory-service',
  COURSE: 'course-service',
  CONTENT: 'content-service',
  ASSESSMENT: 'assessment-service',
  SKILLS: 'skills-service',
  LEARNER_AI: 'learner-ai-service',
  DEVLAB: 'devlab-service',
  RAG: 'rag-service'
};
```

### Layer 2: Application (Use Cases)

#### Use Cases
```javascript
// application/useCases/CalculateAnalytics.js
class CalculateAnalyticsUseCase {
  constructor(analyticsService, cacheService, externalService, authService) {
    this.analyticsService = analyticsService;
    this.cacheService = cacheService;
    this.externalService = externalService;
    this.authService = authService;
  }
  
  async execute(userId, role, analyticsType) {
    // 1. Validate user and role
    const hasAccess = await this.authService.validateRole(userId, role, analyticsType);
    if (!hasAccess) {
      throw new ForbiddenError('Insufficient permissions');
    }
    
    // 2. Check cache first
    const cacheKey = CACHE_KEYS.ANALYTICS(userId, role, analyticsType);
    const cached = await this.cacheService.get(cacheKey);
    if (cached && !this.cacheService.isStale(cacheKey)) {
      return { data: cached.data, cached: true, source: 'cache' };
    }
    
    // 3. Check if data is stale (>6 hours)
    const isStale = await this.analyticsService.isDataStale(userId, role);
    if (isStale && cached) {
      return { data: cached.data, stale: true, requiresRefresh: true, source: 'stale_cache' };
    }
    
    // 4. Fetch from external microservices
    const externalData = await this.externalService.fetchData(userId, role, analyticsType);
    
    // 5. Calculate analytics
    const calculatedData = await this.analyticsService.calculate(externalData, analyticsType);
    
    // 6. Cache result (6 hours TTL)
    await this.cacheService.set(cacheKey, calculatedData, 21600);
    
    // 7. Store in database
    await this.databaseService.storeAnalytics(userId, role, analyticsType, calculatedData);
    
    return { data: calculatedData, cached: false, source: 'calculated' };
  }
}

// application/useCases/AuthenticateUser.js
class AuthenticateUserUseCase {
  constructor(authService, userRepository) {
    this.authService = authService;
    this.userRepository = userRepository;
  }
  
  async execute(email, password) {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }
    
    // 2. Verify password
    const isValidPassword = await this.authService.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }
    
    // 3. Generate tokens
    const token = await this.authService.generateToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);
    
    // 4. Update last login
    await this.userRepository.updateLastLogin(user.id);
    
    return {
      user: this.sanitizeUser(user),
      token,
      refreshToken,
      expiresIn: 3600
    };
  }
  
  sanitizeUser(user) {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

// application/useCases/RefreshAnalytics.js
class RefreshAnalyticsUseCase {
  constructor(jobQueueService, analyticsService, authService) {
    this.jobQueueService = jobQueueService;
    this.analyticsService = analyticsService;
    this.authService = authService;
  }
  
  async execute(userId, role, analyticsTypes) {
    // 1. Validate user and role
    const hasAccess = await this.authService.validateRole(userId, role, 'analytics-refresh');
    if (!hasAccess) {
      throw new ForbiddenError('Insufficient permissions');
    }
    
    // 2. Validate analytics types
    const validTypes = this.validateAnalyticsTypes(analyticsTypes, role);
    if (validTypes.length === 0) {
      throw new BadRequestError('No valid analytics types provided');
    }
    
    // 3. Queue refresh job
    const jobId = await this.jobQueueService.queueManualRefresh(userId, role, validTypes);
    
    return {
      jobId,
      message: 'Manual refresh queued successfully',
      queuedAnalytics: validTypes,
      estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    };
  }
  
  validateAnalyticsTypes(analyticsTypes, role) {
    const roleAnalytics = ANALYTICS_TYPES[role.toUpperCase()];
    if (!roleAnalytics) return [];
    
    return analyticsTypes.filter(type => 
      Object.values(roleAnalytics).includes(type)
    );
  }
}
```

#### Application Services
```javascript
// application/services/AnalyticsService.js
class AnalyticsService {
  constructor(repository, externalClients, cacheService) {
    this.repository = repository;
    this.externalClients = externalClients;
    this.cacheService = cacheService;
  }
  
  async calculateLearnerVelocity(userId) {
    const courseData = await this.externalClients.course.getProgress(userId);
    const assessmentData = await this.externalClients.assessment.getScores(userId);
    
    return {
      currentPace: this.calculatePace(courseData),
      targetPace: this.getTargetPace(userId),
      trend: this.calculateTrend(courseData, assessmentData),
      estimatedCompletion: this.estimateCompletion(courseData),
      status: this.determineStatus(courseData, assessmentData)
    };
  }
  
  async calculateSkillGapMatrix(userId) {
    const skillsData = await this.externalClients.skills.getUserSkills(userId);
    const requiredSkills = await this.externalClients.skills.getRequiredSkills(userId);
    
    return {
      currentSkills: skillsData,
      requiredSkills: requiredSkills,
      gaps: this.identifyGaps(skillsData, requiredSkills),
      recommendations: this.generateRecommendations(skillsData, requiredSkills)
    };
  }
  
  async calculateEngagementScore(userId) {
    const activityData = await this.externalClients.course.getActivity(userId);
    const interactionData = await this.externalClients.content.getInteractions(userId);
    
    return {
      overallScore: this.calculateOverallEngagement(activityData, interactionData),
      weeklyEngagement: this.calculateWeeklyEngagement(activityData),
      activityBreakdown: this.calculateActivityBreakdown(activityData),
      trends: this.calculateEngagementTrends(activityData)
    };
  }
  
  // ... other analytics calculations
  
  async calculateDropOffRisk(userId) {
    const engagementData = await this.calculateEngagementScore(userId);
    const performanceData = await this.calculatePerformanceAnalytics(userId);
    
    return {
      riskScore: this.calculateRiskScore(engagementData, performanceData),
      riskLevel: this.determineRiskLevel(engagementData, performanceData),
      confidence: this.calculateConfidence(engagementData, performanceData),
      riskFactors: this.identifyRiskFactors(engagementData, performanceData),
      predictions: this.generateRiskPredictions(engagementData, performanceData),
      interventions: this.generateInterventions(engagementData, performanceData)
    };
  }
  
  // Helper methods
  calculatePace(courseData) {
    // Implementation for pace calculation
    return courseData.completedModules / courseData.totalModules;
  }
  
  getTargetPace(userId) {
    // Implementation for target pace calculation
    return 1.0; // Default target pace
  }
  
  calculateTrend(courseData, assessmentData) {
    // Implementation for trend calculation
    return 'accelerating';
  }
  
  estimateCompletion(courseData) {
    // Implementation for completion estimation
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  }
  
  determineStatus(courseData, assessmentData) {
    // Implementation for status determination
    return 'on-track';
  }
}

// application/services/AuthService.js
class AuthService {
  constructor(jwtService, userRepository, passwordService) {
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }
  
  async validateToken(token) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userRepository.findById(decoded.id);
      
      if (!user) {
        return { user: null, isValid: false };
      }
      
      return { user, isValid: true };
    } catch (error) {
      return { user: null, isValid: false };
    }
  }
  
  async generateToken(user) {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      roles: user.roles,
      organizationId: user.organizationId
    }, { expiresIn: '1h' });
  }
  
  async refreshToken(refreshToken) {
    try {
      const decoded = this.jwtService.verify(refreshToken, { ignoreExpiration: true });
      const user = await this.userRepository.findById(decoded.id);
      
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      
      return this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }
  
  async validateRole(userId, requiredRole, endpoint) {
    const user = await this.userRepository.findById(userId);
    
    if (!user || !user.roles.includes(requiredRole)) {
      return false;
    }
    
    // Check endpoint-specific permissions
    const permissions = this.getEndpointPermissions(endpoint);
    return permissions.includes(requiredRole);
  }
  
  getEndpointPermissions(endpoint) {
    const permissions = {
      '/api/v1/learner/analytics/*': [ROLES.LEARNER],
      '/api/v1/trainer/analytics/*': [ROLES.TRAINER],
      '/api/v1/org-admin/analytics/*': [ROLES.ORG_ADMIN],
      '/api/v1/comparison/*': [ROLES.LEARNER, ROLES.TRAINER, ROLES.ORG_ADMIN],
      '/api/v1/predictive/*': [ROLES.LEARNER, ROLES.TRAINER, ROLES.ORG_ADMIN],
      '/api/v1/gamification/*': [ROLES.LEARNER, ROLES.TRAINER, ROLES.ORG_ADMIN]
    };
    
    return permissions[endpoint] || [];
  }
}

// application/services/AuthorizationService.js
class AuthorizationService {
  constructor(userRepository, roleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }
  
  async validateDataAccess(userId, targetUserId, role) {
    // Users can only access their own data
    if (userId !== targetUserId) {
      throw new ForbiddenError('Access denied: Cannot access other users\' data');
    }
    
    return true;
  }
  
  async validateOrganizationAccess(userId, orgId, role) {
    const user = await this.userRepository.findById(userId);
    
    if (role === ROLES.ORG_ADMIN && user.organizationId !== orgId) {
      throw new ForbiddenError('Access denied: Cannot access other organizations\' data');
    }
    
    return true;
  }
  
  async applyKAnonymity(data, k = 5) {
    // Apply K-anonymity to sensitive data
    if (data.length < k) {
      throw new ForbiddenError('Insufficient data for comparison (K-anonymity requirement)');
    }
    
    // Anonymize individual records while preserving statistical properties
    return data.map(record => ({
      ...record,
      id: this.anonymizeId(record.id),
      personalInfo: this.anonymizePersonalInfo(record.personalInfo)
    }));
  }
  
  anonymizeId(id) {
    // Implementation for ID anonymization
    return `anon_${id.slice(0, 8)}`;
  }
  
  anonymizePersonalInfo(personalInfo) {
    // Implementation for personal info anonymization
    return {
      ...personalInfo,
      name: 'Anonymous',
      email: 'anonymous@example.com'
    };
  }
}
```

### Layer 3: Infrastructure (External Dependencies)

#### Database Client
```javascript
// infrastructure/database/PrismaClient.js
class PrismaClient {
  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  }
  
  async findAnalyticsByUserAndRole(userId, role) {
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
  
  async findUserById(id) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
        organization: true
      }
    });
  }
  
  async findUserByEmail(email) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
        organization: true
      }
    });
  }
  
  async updateUserLastLogin(id) {
    return await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() }
    });
  }
  
  async findGamificationByUser(userId) {
    return await this.prisma.gamification.findUnique({
      where: { userId },
      include: {
        badges: true,
        achievements: true
      }
    });
  }
  
  async updateGamification(userId, data) {
    return await this.prisma.gamification.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });
  }
}
```

#### External Microservice Clients
```javascript
// infrastructure/external/CourseClient.js
class CourseClient {
  constructor(baseURL, circuitBreaker, mockDataService) {
    this.baseURL = baseURL;
    this.circuitBreaker = circuitBreaker;
    this.mockDataService = mockDataService;
  }
  
  async getProgress(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/progress/${userId}`)
      );
    } catch (error) {
      console.warn(`Course service unavailable, using mock data for user ${userId}`);
      return await this.mockDataService.getCourseProgress(userId);
    }
  }
  
  async getActivity(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/activity/${userId}`)
      );
    } catch (error) {
      return await this.mockDataService.getCourseActivity(userId);
    }
  }
  
  async getCourses(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/courses/${userId}`)
      );
    } catch (error) {
      return await this.mockDataService.getCourses(userId);
    }
  }
}

// infrastructure/external/AssessmentClient.js
class AssessmentClient {
  constructor(baseURL, circuitBreaker, mockDataService) {
    this.baseURL = baseURL;
    this.circuitBreaker = circuitBreaker;
    this.mockDataService = mockDataService;
  }
  
  async getScores(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/scores/${userId}`)
      );
    } catch (error) {
      return await this.mockDataService.getAssessmentScores(userId);
    }
  }
  
  async getAssessments(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/assessments/${userId}`)
      );
    } catch (error) {
      return await this.mockDataService.getAssessments(userId);
    }
  }
}

// infrastructure/external/SkillsClient.js
class SkillsClient {
  constructor(baseURL, circuitBreaker, mockDataService) {
    this.baseURL = baseURL;
    this.circuitBreaker = circuitBreaker;
    this.mockDataService = mockDataService;
  }
  
  async getUserSkills(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/skills/user/${userId}`)
      );
    } catch (error) {
      return await this.mockDataService.getUserSkills(userId);
    }
  }
  
  async getRequiredSkills(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/skills/required/${userId}`)
      );
    } catch (error) {
      return await this.mockDataService.getRequiredSkills(userId);
    }
  }
  
  async getSkillDemand() {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/skills/demand`)
      );
    } catch (error) {
      return await this.mockDataService.getSkillDemand();
    }
  }
}

// infrastructure/external/LearnerAIClient.js
class LearnerAIClient {
  constructor(baseURL, circuitBreaker, mockDataService) {
    this.baseURL = baseURL;
    this.circuitBreaker = circuitBreaker;
    this.mockDataService = mockDataService;
  }
  
  async getRecommendations(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/recommendations/${userId}`)
      );
    } catch (error) {
      return await this.mockDataService.getRecommendations(userId);
    }
  }
  
  async getDropOffRisk(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/risk/${userId}`)
      );
    } catch (error) {
      return await this.mockDataService.getDropOffRisk(userId);
    }
  }
  
  async getPerformanceForecast(userId) {
    try {
      return await this.circuitBreaker.execute(() => 
        this.httpClient.get(`${this.baseURL}/api/v1/forecast/${userId}`)
      );
    } catch (error) {
      return await this.mockDataService.getPerformanceForecast(userId);
    }
  }
}
```

#### Cache Client
```javascript
// infrastructure/cache/RailwayCacheClient.js
class RailwayCacheClient {
  constructor() {
    this.cache = new Map(); // Simple in-memory cache (Railway built-in)
    this.TTL = 24 * 60 * 60 * 1000; // 24 hours
  }
  
  async get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  async set(key, data, ttl = this.TTL) {
    this.cache.set(key, {
      value: data,
      expiry: Date.now() + ttl
    });
  }
  
  async delete(key) {
    this.cache.delete(key);
  }
  
  async isStale(key) {
    const entry = this.cache.get(key);
    if (!entry) return true;
    
    const age = Date.now() - (entry.expiry - this.TTL);
    return age > 6 * 60 * 60 * 1000; // 6 hours
  }
  
  async clear() {
    this.cache.clear();
  }
}
```

#### Job Queue Client
```javascript
// infrastructure/queue/PgBossClient.js
class PgBossClient {
  constructor() {
    this.pgBoss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
      schema: 'pgboss',
      retryLimit: 3,
      retryDelay: 1000
    });
  }
  
  async initialize() {
    await this.pgBoss.start();
  }
  
  async scheduleDailyBatch() {
    await this.pgBoss.schedule('daily-analytics-batch', '0 2 * * *', {
      type: 'daily-batch',
      timestamp: new Date()
    });
  }
  
  async queueManualRefresh(userId, role, analyticsTypes) {
    return await this.pgBoss.send('manual-analytics-refresh', {
      userId: userId,
      role: role,
      analyticsTypes: analyticsTypes,
      timestamp: new Date()
    });
  }
  
  async getJobStatus(jobId) {
    const job = await this.pgBoss.getJobById(jobId);
    return {
      status: job.state,
      progress: job.progress || 0,
      result: job.output,
      error: job.error
    };
  }
  
  async cancelJob(jobId) {
    await this.pgBoss.cancel(jobId);
  }
  
  async processJobs() {
    // Process daily batch jobs
    await this.pgBoss.work('daily-analytics-batch', async (job) => {
      await this.processDailyBatch(job.data);
    });
    
    // Process manual refresh jobs
    await this.pgBoss.work('manual-analytics-refresh', async (job) => {
      await this.processManualRefresh(job.data);
    });
  }
  
  async processDailyBatch(data) {
    // Implementation for daily batch processing
    console.log('Processing daily batch:', data);
  }
  
  async processManualRefresh(data) {
    // Implementation for manual refresh processing
    console.log('Processing manual refresh:', data);
  }
}
```

### Layer 4: Presentation (API Layer)

#### Routes
```javascript
// presentation/routes/analytics.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const AnalyticsController = require('../controllers/AnalyticsController');

// Learner Analytics Routes
router.get('/learner/analytics/velocity/:userId', 
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getLearnerVelocity
);

router.get('/learner/analytics/skill-gap/:userId',
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getSkillGapMatrix
);

router.get('/learner/analytics/engagement/:userId',
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getEngagementScore
);

router.get('/learner/analytics/mastery/:userId',
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getMasteryProgress
);

router.get('/learner/analytics/performance/:userId',
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getPerformanceAnalytics
);

router.get('/learner/analytics/content-effectiveness/:userId',
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getContentEffectiveness
);

// Trainer Analytics Routes
router.get('/trainer/analytics/course-performance/:trainerId',
  authenticate,
  authorize('trainer'),
  validateRequest(['trainerId']),
  AnalyticsController.getCoursePerformance
);

router.get('/trainer/analytics/course-health/:trainerId',
  authenticate,
  authorize('trainer'),
  validateRequest(['trainerId']),
  AnalyticsController.getCourseHealth
);

router.get('/trainer/analytics/student-distribution/:trainerId',
  authenticate,
  authorize('trainer'),
  validateRequest(['trainerId']),
  AnalyticsController.getStudentDistribution
);

router.get('/trainer/analytics/teaching-effectiveness/:trainerId',
  authenticate,
  authorize('trainer'),
  validateRequest(['trainerId']),
  AnalyticsController.getTeachingEffectiveness
);

// Organizational Analytics Routes
router.get('/org-admin/analytics/learning-velocity/:orgId',
  authenticate,
  authorize('org-admin'),
  validateRequest(['orgId']),
  AnalyticsController.getOrganizationLearningVelocity
);

router.get('/org-admin/analytics/strategic-alignment/:orgId',
  authenticate,
  authorize('org-admin'),
  validateRequest(['orgId']),
  AnalyticsController.getStrategicAlignment
);

router.get('/org-admin/analytics/learning-culture/:orgId',
  authenticate,
  authorize('org-admin'),
  validateRequest(['orgId']),
  AnalyticsController.getLearningCulture
);

router.get('/org-admin/analytics/org-performance/:orgId',
  authenticate,
  authorize('org-admin'),
  validateRequest(['orgId']),
  AnalyticsController.getOrgPerformance
);

// Comparison Analytics Routes
router.get('/comparison/peer/:userId',
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getPeerComparison
);

router.get('/comparison/skill-demand',
  authenticate,
  validateRequest(['skills', 'timeframe']),
  AnalyticsController.getSkillDemand
);

// Predictive Analytics Routes
router.get('/predictive/drop-off-risk/:userId',
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getDropOffRisk
);

router.get('/predictive/forecast/:userId',
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getPerformanceForecast
);

router.get('/predictive/recommendations/:userId',
  authenticate,
  authorize('learner'),
  validateRequest(['userId']),
  AnalyticsController.getRecommendations
);

// Manual Refresh Route
router.post('/analytics/refresh',
  authenticate,
  validateRequest(['userId', 'role', 'analytics']),
  AnalyticsController.triggerManualRefresh
);

module.exports = router;
```

#### Controllers
```javascript
// presentation/controllers/AnalyticsController.js
class AnalyticsController {
  constructor(calculateAnalyticsUseCase, refreshAnalyticsUseCase, jobQueueService) {
    this.calculateAnalyticsUseCase = calculateAnalyticsUseCase;
    this.refreshAnalyticsUseCase = refreshAnalyticsUseCase;
    this.jobQueueService = jobQueueService;
  }
  
  async getLearnerVelocity(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'learner-velocity'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getSkillGapMatrix(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'learner-skill-gap'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getEngagementScore(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'learner-engagement'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getMasteryProgress(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'learner-mastery'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getPerformanceAnalytics(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'learner-performance'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getContentEffectiveness(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'learner-content-effectiveness'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getCoursePerformance(req, res) {
    try {
      const { trainerId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        trainerId, 
        role, 
        'trainer-course-performance'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getCourseHealth(req, res) {
    try {
      const { trainerId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        trainerId, 
        role, 
        'trainer-course-health'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getStudentDistribution(req, res) {
    try {
      const { trainerId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        trainerId, 
        role, 
        'trainer-student-distribution'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getTeachingEffectiveness(req, res) {
    try {
      const { trainerId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        trainerId, 
        role, 
        'trainer-teaching-effectiveness'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getOrganizationLearningVelocity(req, res) {
    try {
      const { orgId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        orgId, 
        role, 
        'org-learning-velocity'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getStrategicAlignment(req, res) {
    try {
      const { orgId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        orgId, 
        role, 
        'org-strategic-alignment'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getLearningCulture(req, res) {
    try {
      const { orgId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        orgId, 
        role, 
        'org-learning-culture'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getOrgPerformance(req, res) {
    try {
      const { orgId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        orgId, 
        role, 
        'org-performance'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getPeerComparison(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'comparison-peer'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getSkillDemand(req, res) {
    try {
      const { skills, timeframe } = req.query;
      
      const result = await this.calculateAnalyticsUseCase.execute(
        null, 
        'public', 
        'comparison-skill-demand',
        { skills, timeframe }
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getDropOffRisk(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'predictive-drop-off-risk'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getPerformanceForecast(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'predictive-performance-forecast'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async getRecommendations(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.headers['x-active-role'];
      
      const result = await this.calculateAnalyticsUseCase.execute(
        userId, 
        role, 
        'predictive-recommendations'
      );
      
      res.json({
        data: result.data,
        cached: result.cached,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        source: result.source
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  async triggerManualRefresh(req, res) {
    try {
      const { userId, role, analytics } = req.body;
      
      const result = await this.refreshAnalyticsUseCase.execute(
        userId, 
        role, 
        analytics
      );
      
      res.json({
        jobId: result.jobId,
        message: result.message,
        queuedAnalytics: result.queuedAnalytics,
        estimatedCompletion: result.estimatedCompletion
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  handleError(res, error) {
    console.error('Analytics Controller Error:', error);
    
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: error.message });
    }
    
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ error: 'FORBIDDEN', message: error.message });
    }
    
    if (error instanceof BadRequestError) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: error.message });
    }
    
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'NOT_FOUND', message: error.message });
    }
    
    if (error instanceof TooManyRequestsError) {
      return res.status(429).json({ 
        error: 'TOO_MANY_REQUESTS', 
        message: error.message,
        retryAfter: error.retryAfter
      });
    }
    
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' });
  }
}

module.exports = AnalyticsController;
```

#### Middleware
```javascript
// presentation/middleware/auth.js
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../../domain/errors');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid token' });
  }
};

const authorize = (requiredRole) => {
  return (req, res, next) => {
    const activeRole = req.headers['x-active-role'];
    
    if (!activeRole || activeRole !== requiredRole) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = { authenticate, authorize };

// presentation/middleware/validation.js
const Joi = require('joi');
const { BadRequestError } = require('../../domain/errors');

const validateRequest = (fields) => {
  return (req, res, next) => {
    const schemas = {
      userId: Joi.string().uuid().required(),
      trainerId: Joi.string().uuid().required(),
      orgId: Joi.string().uuid().required(),
      role: Joi.string().valid('learner', 'trainer', 'org-admin').required(),
      analytics: Joi.array().items(Joi.string()).min(1).required(),
      skills: Joi.string().optional(),
      timeframe: Joi.string().valid('3months', '6months', '1year').optional(),
      limit: Joi.number().integer().min(10).max(100).optional(),
      category: Joi.string().valid('points', 'streaks', 'achievements').optional()
    };
    
    const validationSchema = fields.reduce((acc, field) => {
      acc[field] = schemas[field];
      return acc;
    }, {});
    
    const { error } = Joi.object(validationSchema).validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request format',
        validation: error.details.map(d => d.message)
      });
    }
    
    next();
  };
};

const validateParams = (fields) => {
  return (req, res, next) => {
    const schemas = {
      userId: Joi.string().uuid().required(),
      trainerId: Joi.string().uuid().required(),
      orgId: Joi.string().uuid().required()
    };
    
    const validationSchema = fields.reduce((acc, field) => {
      acc[field] = schemas[field];
      return acc;
    }, {});
    
    const { error } = Joi.object(validationSchema).validate(req.params);
    
    if (error) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        validation: error.details.map(d => d.message)
      });
    }
    
    next();
  };
};

const validateQuery = (fields) => {
  return (req, res, next) => {
    const schemas = {
      skills: Joi.string().optional(),
      timeframe: Joi.string().valid('week', 'month', 'year', 'all').optional(),
      limit: Joi.number().integer().min(10).max(100).optional(),
      category: Joi.string().valid('points', 'streaks', 'achievements').optional()
    };
    
    const validationSchema = fields.reduce((acc, field) => {
      acc[field] = schemas[field];
      return acc;
    }, {});
    
    const { error } = Joi.object(validationSchema).validate(req.query);
    
    if (error) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        validation: error.details.map(d => d.message)
      });
    }
    
    next();
  };
};

module.exports = { validateRequest, validateParams, validateQuery };

// presentation/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: { error: 'RATE_LIMIT_EXCEEDED', message: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Rate limit configurations
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per window
  'Too many login attempts, please try again later'
);

const analyticsRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  100, // 100 requests per hour
  'Too many analytics requests, please try again later'
);

const refreshRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // 3 manual refreshes per hour
  'Too many manual refresh requests, please try again later'
);

const gamificationRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  100, // 100 requests per hour
  'Too many gamification requests, please try again later'
);

module.exports = {
  authRateLimit,
  analyticsRateLimit,
  refreshRateLimit,
  gamificationRateLimit
};
```

## 8.2 Security Implementation Patterns

### JWT Authentication
```javascript
// infrastructure/auth/JWTService.js
class JWTService {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
  }
  
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles,
        organizationId: user.organizationId
      },
      this.secret,
      { expiresIn: '1h' }
    );
  }
  
  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
        type: 'refresh'
      },
      this.refreshSecret,
      { expiresIn: '7d' }
    );
  }
  
  verifyToken(token) {
    return jwt.verify(token, this.secret);
  }
  
  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshSecret);
  }
}
```

### RBAC Authorization
```javascript
// application/services/AuthorizationService.js
class AuthorizationService {
  constructor(userRepository, roleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }
  
  async validateRole(userId, requiredRole, endpoint) {
    const user = await this.userRepository.findById(userId);
    
    if (!user.roles.includes(requiredRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    
    // Check endpoint-specific permissions
    const permissions = this.getEndpointPermissions(endpoint);
    if (!permissions.includes(requiredRole)) {
      throw new ForbiddenError('Access denied for this endpoint');
    }
    
    return true;
  }
  
  async validateDataAccess(userId, targetUserId, role) {
    // Users can only access their own data
    if (userId !== targetUserId) {
      throw new ForbiddenError('Access denied: Cannot access other users\' data');
    }
    
    return true;
  }
  
  async validateOrganizationAccess(userId, orgId, role) {
    const user = await this.userRepository.findById(userId);
    
    if (role === ROLES.ORG_ADMIN && user.organizationId !== orgId) {
      throw new ForbiddenError('Access denied: Cannot access other organizations\' data');
    }
    
    return true;
  }
  
  getEndpointPermissions(endpoint) {
    const permissions = {
      '/api/v1/learner/analytics/*': [ROLES.LEARNER],
      '/api/v1/trainer/analytics/*': [ROLES.TRAINER],
      '/api/v1/org-admin/analytics/*': [ROLES.ORG_ADMIN],
      '/api/v1/comparison/*': [ROLES.LEARNER, ROLES.TRAINER, ROLES.ORG_ADMIN],
      '/api/v1/predictive/*': [ROLES.LEARNER, ROLES.TRAINER, ROLES.ORG_ADMIN],
      '/api/v1/gamification/*': [ROLES.LEARNER, ROLES.TRAINER, ROLES.ORG_ADMIN]
    };
    
    return permissions[endpoint] || [];
  }
}
```

### Rate Limiting
```javascript
// infrastructure/middleware/RateLimiter.js
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Rate limit configurations
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per window
  'Too many login attempts, please try again later'
);

const analyticsRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  100, // 100 requests per hour
  'Too many analytics requests, please try again later'
);

const refreshRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // 3 manual refreshes per hour
  'Too many manual refresh requests, please try again later'
);
```

### Input Validation
```javascript
// infrastructure/middleware/Validation.js
const Joi = require('joi');

const validateRequest = (fields) => {
  return (req, res, next) => {
    const schemas = {
      userId: Joi.string().uuid().required(),
      trainerId: Joi.string().uuid().required(),
      orgId: Joi.string().uuid().required(),
      role: Joi.string().valid('learner', 'trainer', 'org-admin').required(),
      analytics: Joi.array().items(Joi.string()).min(1).required()
    };
    
    const validationSchema = fields.reduce((acc, field) => {
      acc[field] = schemas[field];
      return acc;
    }, {});
    
    const { error } = Joi.object(validationSchema).validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    
    next();
  };
};
```

## 8.3 Performance Implementation Patterns

### 3-Layer Caching (Phase 1 Decision)
```javascript
// infrastructure/cache/CacheManager.js
class CacheManager {
  constructor(railwayCacheClient, databaseClient) {
    this.railwayCacheClient = railwayCacheClient; // Layer 1: In-memory (Railway)
    this.databaseClient = databaseClient; // Layer 2: Database cache
  }
  
  async get(key) {
    // Layer 1: In-memory cache (Railway built-in)
    const memoryData = await this.railwayCacheClient.get(key);
    if (memoryData) {
      return memoryData;
    }
    
    // Layer 2: Database cache (7d retention)
    const dbData = await this.databaseClient.getCachedAnalytics(key);
    if (dbData) {
      // Store in Layer 1 for faster access
      await this.railwayCacheClient.set(key, dbData, 24 * 60 * 60 * 1000); // 24h
      return dbData;
    }
    
    // Layer 3: Aggregated cache (7y retention, partitioned)
    const aggregatedData = await this.databaseClient.getAggregatedAnalytics(key);
    if (aggregatedData) {
      // Store in Layer 1 and 2
      await this.railwayCacheClient.set(key, aggregatedData, 24 * 60 * 60 * 1000);
      await this.databaseClient.setCachedAnalytics(key, aggregatedData, 7 * 24 * 60 * 60 * 1000);
      return aggregatedData;
    }
    
    return null;
  }
  
  async set(key, data, ttl = 6 * 60 * 60 * 1000) { // Default 6 hours
    // Set in Layer 1: In-memory (24h TTL)
    await this.railwayCacheClient.set(key, data, 24 * 60 * 60 * 1000);
    
    // Set in Layer 2: Database cache (7d retention)
    await this.databaseClient.setCachedAnalytics(key, data, 7 * 24 * 60 * 60 * 1000);
  }
  
  async isStale(key) {
    // Check if data is older than 6 hours (staleness threshold)
    return await this.railwayCacheClient.isStale(key);
  }
}
```

### Batch Processing
```javascript
// application/services/BatchProcessingService.js
class BatchProcessingService {
  constructor(jobQueueService, analyticsService) {
    this.jobQueueService = jobQueueService;
    this.analyticsService = analyticsService;
  }
  
  async scheduleDailyBatch() {
    // Schedule daily batch at 02:00 UTC
    await this.jobQueueService.scheduleDailyBatch('0 2 * * *');
  }
  
  async processDailyBatch() {
    const users = await this.getAllUsers();
    
    for (const user of users) {
      for (const role of user.roles) {
        // Calculate all analytics for each user-role combination
        await this.calculateAllAnalytics(user.id, role);
      }
    }
  }
  
  async calculateAllAnalytics(userId, role) {
    const analyticsTypes = this.getAnalyticsTypesForRole(role);
    
    for (const analyticsType of analyticsTypes) {
      try {
        await this.analyticsService.calculate(userId, role, analyticsType);
      } catch (error) {
        console.error(`Failed to calculate ${analyticsType} for user ${userId}:`, error);
      }
    }
  }
}
```

---

**Step 8 Complete**: ✅ API design, business logic, security, detailed API contracts, service interfaces, security implementation patterns
