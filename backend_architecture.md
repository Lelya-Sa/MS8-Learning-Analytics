# 🏗️ **BACKEND ARCHITECTURE - LEARNING ANALYTICS API**

## 🎯 **BACKEND ARCHITECTURE OVERVIEW**

**Technology Stack**: Node.js + Express + JavaScript  
**Deployment**: Railway (Pro tier)  
**Database**: PostgreSQL (Supabase)  
**Caching**: Redis (Layer 1)  
**Performance Target**: < 100ms API responses (cached)  

---

## 🏛️ **SYSTEM ARCHITECTURE**

### **3-Stage Processing Pipeline**
```
Stage 1: Collect → Stage 2: Analyze → Stage 3: Aggregate
```

### **3-Layer Storage Architecture**
```
Layer 1: Redis Cache (24h TTL) → Layer 2: Personal Analytics (7 days) → Layer 3: Aggregated Analytics (7 years)
```

### **Service Architecture**
```
API Gateway → Authentication → Rate Limiting → Business Logic → Data Access → Database
```

---

## 📁 **PROJECT STRUCTURE**

```
backend/
├── src/
│   ├── controllers/         # API route handlers
│   │   ├── auth/
│   │   ├── analytics/
│   │   ├── reports/
│   │   └── health/
│   ├── services/            # Business logic layer
│   │   ├── analytics/
│   │   ├── dataProcessing/
│   │   ├── reportGeneration/
│   │   └── integration/
│   ├── repositories/        # Data access layer
│   │   ├── analytics/
│   │   ├── users/
│   │   └── reports/
│   ├── middleware/          # Express middleware
│   │   ├── auth/
│   │   ├── validation/
│   │   ├── rateLimiting/
│   │   └── errorHandling/
│   ├── models/              # Data models
│   │   ├── User/
│   │   ├── Analytics/
│   │   └── Report/
│   ├── utils/               # Utility functions
│   │   ├── validation/
│   │   ├── formatting/
│   │   ├── caching/
│   │   └── constants/
│   ├── config/              # Configuration
│   │   ├── database/
│   │   ├── redis/
│   │   ├── auth/
│   │   └── environment/
│   ├── jobs/                # Background jobs
│   │   ├── dataCollection/
│   │   ├── analytics/
│   │   └── cleanup/
│   └── tests/               # Test files
│       ├── unit/
│       ├── integration/
│       └── fixtures/
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/
├── docs/                    # API documentation
│   ├── openapi.yaml
│   └── README.md
├── scripts/                 # Utility scripts
│   ├── migrate.js
│   ├── seed.js
│   └── deploy.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔌 **API ARCHITECTURE**

### **RESTful API Design**
```javascript
// API versioning strategy
const API_VERSION = 'v1';
const BASE_PATH = `/api/${API_VERSION}`;

// Route structure
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/analytics`, analyticsRoutes);
app.use(`${BASE_PATH}/reports`, reportRoutes);
app.use(`${BASE_PATH}/health`, healthRoutes);
```

### **API Endpoints**

#### **Authentication Endpoints**
```javascript
// POST /api/v1/auth/login
// POST /api/v1/auth/refresh
// POST /api/v1/auth/logout
// GET /api/v1/auth/profile
```

#### **Analytics Endpoints**
```javascript
// GET /api/v1/analytics/learner
// GET /api/v1/analytics/trainer
// GET /api/v1/analytics/organization
// POST /api/v1/analytics/refresh
```

#### **Reports Endpoints**
```javascript
// POST /api/v1/reports/generate
// GET /api/v1/reports/:id/status
// GET /api/v1/reports/:id/download
// GET /api/v1/reports/history
```

#### **Health Check Endpoints**
```javascript
// GET /api/v1/health
// GET /api/v1/health/ready
// GET /api/v1/health/live
```

---

## 🔐 **SECURITY ARCHITECTURE**

### **JWT Authentication Middleware**
```javascript
const jwtAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify JWT token with MS12 public key
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
    
    // Extract user information
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      organizationId: decoded.organizationId,
      permissions: decoded.permissions
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### **Role-Based Access Control**
```javascript
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: roles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// Usage in routes
app.get('/api/v1/analytics/learner', jwtAuth, requireRole(['learner', 'trainer', 'org_admin']), getLearnerAnalytics);
app.get('/api/v1/analytics/trainer', jwtAuth, requireRole(['trainer', 'org_admin']), getTrainerAnalytics);
app.get('/api/v1/analytics/organization', jwtAuth, requireRole(['org_admin']), getOrgAnalytics);
```

### **Input Validation**
```javascript
const validateAnalyticsRequest = (req, res, next) => {
  const schema = Joi.object({
    timeRange: Joi.string().valid('7d', '30d', '90d', '1y').default('30d'),
    includePredictions: Joi.boolean().default(false),
    refreshCache: Joi.boolean().default(false)
  });
  
  const { error, value } = schema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }
  
  req.validatedQuery = value;
  next();
};
```

### **Rate Limiting**
```javascript
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Role-based rate limits
    switch (req.user?.role) {
      case 'learner': return 100;
      case 'trainer': return 200;
      case 'org_admin': return 500;
      default: return 50;
    }
  },
  message: {
    error: 'Too many requests',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});
```

---

## 🏗️ **BUSINESS LOGIC ARCHITECTURE**

### **Service Layer Pattern**
```javascript
// Analytics Service
class AnalyticsService {
  constructor(analyticsRepository, cacheService, dataProcessingService) {
    this.analyticsRepository = analyticsRepository;
    this.cacheService = cacheService;
    this.dataProcessingService = dataProcessingService;
  }
  
  async getLearnerAnalytics(userId, options = {}) {
    const cacheKey = `learner_analytics:${userId}:${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached && !options.refreshCache) {
      return cached;
    }
    
    // Fetch from database
    const analytics = await this.analyticsRepository.getLearnerAnalytics(userId, options);
    
    // Cache for 24 hours
    await this.cacheService.set(cacheKey, analytics, 86400);
    
    return analytics;
  }
  
  async refreshAnalytics(userId, role) {
    // Trigger background refresh
    await this.dataProcessingService.queueAnalyticsRefresh(userId, role);
    
    return { status: 'refresh_queued', estimatedTime: '30-60s' };
  }
}
```

### **Repository Pattern**
```javascript
// Analytics Repository
class AnalyticsRepository {
  constructor(database) {
    this.database = database;
  }
  
  async getLearnerAnalytics(userId, options) {
    const query = `
      SELECT 
        learning_velocity,
        mastery_progress,
        skill_gap_priority,
        engagement_score,
        last_updated
      FROM learner_analytics 
      WHERE user_id = $1 
        AND created_at >= NOW() - INTERVAL '${options.timeRange}'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await this.database.query(query, [userId]);
    return result.rows[0];
  }
  
  async getTrainerAnalytics(userId, options) {
    const query = `
      SELECT 
        course_performance,
        student_performance_distribution,
        at_risk_learners,
        last_updated
      FROM trainer_analytics 
      WHERE user_id = $1 
        AND created_at >= NOW() - INTERVAL '${options.timeRange}'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await this.database.query(query, [userId]);
    return result.rows[0];
  }
}
```

---

## ⚡ **PERFORMANCE ARCHITECTURE**

### **Redis Caching Layer**
```javascript
// Cache Service
class CacheService {
  constructor(redisClient) {
    this.redis = redisClient;
  }
  
  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  async set(key, value, ttl = 86400) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  async del(key) {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
  
  async invalidatePattern(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }
}
```

### **Database Connection Pooling**
```javascript
// Database Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Connection health check
pool.on('connect', () => {
  console.log('Database connected');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});
```

### **Response Compression**
```javascript
// Compression middleware
app.use(compression({
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

---

## 🔄 **DATA PROCESSING PIPELINE**

### **3-Stage Processing**
```javascript
// Data Processing Service
class DataProcessingService {
  constructor(queue, analyticsRepository, integrationService) {
    this.queue = queue;
    this.analyticsRepository = analyticsRepository;
    this.integrationService = integrationService;
  }
  
  // Stage 1: Collect data from microservices
  async collectData(userId, role) {
    const data = await this.integrationService.collectFromMicroservices(userId, role);
    return data;
  }
  
  // Stage 2: Analyze collected data
  async analyzeData(rawData, userId, role) {
    const analytics = await this.calculateAnalytics(rawData, role);
    return analytics;
  }
  
  // Stage 3: Aggregate analytics
  async aggregateAnalytics(analytics, userId, role) {
    await this.analyticsRepository.storeAnalytics(userId, role, analytics);
    await this.updateAggregatedMetrics(analytics, role);
  }
  
  // Queue analytics refresh job
  async queueAnalyticsRefresh(userId, role) {
    await this.queue.add('analytics-refresh', {
      userId,
      role,
      timestamp: new Date()
    }, {
      delay: 1000, // 1 second delay
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });
  }
}
```

### **Background Job Processing**
```javascript
// Job Queue Configuration
const Queue = require('bull');
const analyticsQueue = new Queue('analytics processing', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  }
});

// Process analytics refresh jobs
analyticsQueue.process('analytics-refresh', async (job) => {
  const { userId, role } = job.data;
  
  try {
    // Stage 1: Collect
    const rawData = await dataProcessingService.collectData(userId, role);
    
    // Stage 2: Analyze
    const analytics = await dataProcessingService.analyzeData(rawData, userId, role);
    
    // Stage 3: Aggregate
    await dataProcessingService.aggregateAnalytics(analytics, userId, role);
    
    // Invalidate cache
    await cacheService.invalidatePattern(`*analytics*${userId}*`);
    
    return { success: true, userId, role };
  } catch (error) {
    console.error('Analytics refresh job failed:', error);
    throw error;
  }
});
```

---

## 🔗 **INTEGRATION ARCHITECTURE**

### **Microservices Integration**
```javascript
// Integration Service
class IntegrationService {
  constructor(httpClient, authService) {
    this.httpClient = httpClient;
    this.authService = authService;
  }
  
  async collectFromMicroservices(userId, role) {
    const promises = [
      this.collectFromDirectory(userId),
      this.collectFromCourseBuilder(userId),
      this.collectFromAssessment(userId),
      this.collectFromSkillsEngine(userId),
      this.collectFromLearnerAI(userId),
      this.collectFromContentStudio(userId),
      this.collectFromDevLab(userId),
      this.collectFromRAGAssistant(userId),
      this.collectFromAuth(userId)
    ];
    
    const results = await Promise.allSettled(promises);
    
    return {
      directory: results[0].status === 'fulfilled' ? results[0].value : null,
      courseBuilder: results[1].status === 'fulfilled' ? results[1].value : null,
      assessment: results[2].status === 'fulfilled' ? results[2].value : null,
      skillsEngine: results[3].status === 'fulfilled' ? results[3].value : null,
      learnerAI: results[4].status === 'fulfilled' ? results[4].value : null,
      contentStudio: results[5].status === 'fulfilled' ? results[5].value : null,
      devLab: results[6].status === 'fulfilled' ? results[6].value : null,
      ragAssistant: results[7].status === 'fulfilled' ? results[7].value : null,
      auth: results[8].status === 'fulfilled' ? results[8].value : null
    };
  }
  
  async collectFromDirectory(userId) {
    const token = await this.authService.getServiceToken();
    
    return this.httpClient.get(`${process.env.DIRECTORY_API_URL}/api/v1/analytics-data`, {
      params: { userId },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
  }
}
```

### **Circuit Breaker Pattern**
```javascript
// Circuit Breaker for external services
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

---

## 📊 **MONITORING & LOGGING**

### **Structured Logging**
```javascript
// Winston Logger Configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'learning-analytics-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id
    });
  });
  
  next();
};
```

### **Health Check Endpoints**
```javascript
// Health check controller
class HealthController {
  constructor(database, redis) {
    this.database = database;
    this.redis = redis;
  }
  
  async health(req, res) {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    };
    
    res.json(health);
  }
  
  async ready(req, res) {
    try {
      // Check database connection
      await this.database.query('SELECT 1');
      
      // Check Redis connection
      await this.redis.ping();
      
      res.json({ status: 'ready' });
    } catch (error) {
      res.status(503).json({ 
        status: 'not ready',
        error: error.message 
      });
    }
  }
  
  async live(req, res) {
    res.json({ status: 'alive' });
  }
}
```

---

## 🧪 **TESTING ARCHITECTURE**

### **Unit Testing**
```javascript
// Analytics Service Test
describe('AnalyticsService', () => {
  let analyticsService;
  let mockRepository;
  let mockCacheService;
  
  beforeEach(() => {
    mockRepository = {
      getLearnerAnalytics: jest.fn(),
      getTrainerAnalytics: jest.fn()
    };
    
    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn()
    };
    
    analyticsService = new AnalyticsService(mockRepository, mockCacheService);
  });
  
  describe('getLearnerAnalytics', () => {
    it('should return cached data when available', async () => {
      const cachedData = { velocity: 85, mastery: 70 };
      mockCacheService.get.mockResolvedValue(cachedData);
      
      const result = await analyticsService.getLearnerAnalytics('user123');
      
      expect(result).toEqual(cachedData);
      expect(mockRepository.getLearnerAnalytics).not.toHaveBeenCalled();
    });
    
    it('should fetch from database when cache miss', async () => {
      const dbData = { velocity: 85, mastery: 70 };
      mockCacheService.get.mockResolvedValue(null);
      mockRepository.getLearnerAnalytics.mockResolvedValue(dbData);
      
      const result = await analyticsService.getLearnerAnalytics('user123');
      
      expect(result).toEqual(dbData);
      expect(mockCacheService.set).toHaveBeenCalled();
    });
  });
});
```

### **Integration Testing**
```javascript
// API Integration Test
describe('Analytics API', () => {
  let app;
  let server;
  
  beforeAll(async () => {
    app = require('../src/app');
    server = app.listen(0);
  });
  
  afterAll(async () => {
    server.close();
  });
  
  describe('GET /api/v1/analytics/learner', () => {
    it('should return learner analytics for authenticated user', async () => {
      const token = generateTestToken({ role: 'learner', userId: 'user123' });
      
      const response = await request(app)
        .get('/api/v1/analytics/learner')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('velocity');
      expect(response.body).toHaveProperty('mastery');
      expect(response.body).toHaveProperty('skillGaps');
      expect(response.body).toHaveProperty('engagement');
    });
    
    it('should return 401 for unauthenticated request', async () => {
      await request(app)
        .get('/api/v1/analytics/learner')
        .expect(401);
    });
    
    it('should return 403 for insufficient permissions', async () => {
      const token = generateTestToken({ role: 'guest' });
      
      await request(app)
        .get('/api/v1/analytics/learner')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });
});
```

---

## 🚀 **DEPLOYMENT ARCHITECTURE**

### **Railway Configuration**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Environment Configuration**
```javascript
// Environment configuration
const config = {
  development: {
    database: {
      url: process.env.DATABASE_URL,
      ssl: false
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    },
    auth: {
      jwtPublicKey: process.env.JWT_PUBLIC_KEY,
      jwtIssuer: process.env.JWT_ISSUER
    }
  },
  production: {
    database: {
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    },
    auth: {
      jwtPublicKey: process.env.JWT_PUBLIC_KEY,
      jwtIssuer: process.env.JWT_ISSUER
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
```

---

## 🎯 **NEXT STEPS**

**Phase 2C**: Integration Architecture - Service contracts, deployment patterns  
**Phase 2D**: Database Architecture - Schema design, ERD generation  

**Ready to proceed to Phase 2C: Integration Architecture** ✅
