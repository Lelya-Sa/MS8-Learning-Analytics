# 🔗 **INTEGRATION ARCHITECTURE - LEARNING ANALYTICS**

## 🎯 **INTEGRATION ARCHITECTURE OVERVIEW**

**Integration Strategy**: REST API + JWT + Circuit Breakers + Event-Driven  
**Microservices**: 9 services integrated with parallel data collection  
**Resilience**: Circuit breakers + graceful degradation + retry mechanisms  
**Performance**: Connection pooling + caching + batch processing  

---

## 🏗️ **INTEGRATION ARCHITECTURE**

### **Service Integration Pattern**
```
Learning Analytics API → Service Gateway → Microservices (9) → Data Processing → Analytics Storage
```

### **Data Flow Architecture**
```
Real-time Collection → Background Processing → Cache Layer → API Response
```

### **Resilience Architecture**
```
Circuit Breaker → Retry Logic → Graceful Degradation → Partial Data Response
```

---

## 🔌 **MICROSERVICES INTEGRATION**

### **Service Contracts**

#### **Directory Service Integration**
```javascript
// Directory Service Contract
const DirectoryService = {
  baseUrl: process.env.DIRECTORY_API_URL,
  endpoint: '/api/v1/analytics-data', // Single endpoint for all directory data
  
  async collectFromDirectory(userId) {
    const response = await this.httpClient.get(
      `${this.baseUrl}${this.endpoint}`,
      {
        params: { userId },
        headers: { 'Authorization': `Bearer ${this.serviceToken}` },
        timeout: 5000
      }
    );
    
    return {
      serviceName: 'directory',
      userId: response.data.userId,
      data: {
        profile: response.data.profile,
        teachingAssignments: response.data.teachingAssignments,
        organizationKPIs: response.data.organizationKPIs,
        preferences: response.data.preferences
      },
      lastUpdated: response.data.lastUpdated
    };
  }
};
```

#### **Course Builder Service Integration**
```javascript
// Course Builder Service Contract
const CourseBuilderService = {
  baseUrl: process.env.COURSE_BUILDER_API_URL,
  endpoint: '/api/v1/analytics-data', // Single endpoint for all course builder data
  
  async collectFromCourseBuilder(userId) {
    const response = await this.httpClient.get(
      `${this.baseUrl}${this.endpoint}`,
      {
        params: { userId },
        headers: { 'Authorization': `Bearer ${this.serviceToken}` },
        timeout: 5000
      }
    );
    
    return {
      serviceName: 'courseBuilder',
      userId: response.data.userId,
      data: {
        courses: response.data.courses,
        enrollments: response.data.enrollments,
        progress: response.data.progress,
        completions: response.data.completions,
        effectiveness: response.data.effectiveness
      },
      lastUpdated: response.data.lastUpdated
    };
  }
};
```

#### **Assessment Service Integration**
```javascript
// Assessment Service Contract
const AssessmentService = {
  baseUrl: process.env.ASSESSMENT_API_URL,
  endpoint: '/api/v1/analytics-data', // Single endpoint for all assessment data
  
  async collectFromAssessment(userId) {
    const response = await this.httpClient.get(
      `${this.baseUrl}${this.endpoint}`,
      {
        params: { userId },
        headers: { 'Authorization': `Bearer ${this.serviceToken}` },
        timeout: 5000
      }
    );
    
    return {
      serviceName: 'assessment',
      userId: response.data.userId,
      data: {
        examAttempts: response.data.examAttempts,
        scores: response.data.scores,
        skillsAcquired: response.data.skillsAcquired,
        feedback: response.data.feedback,
        passFail: response.data.passFail
      },
      lastUpdated: response.data.lastUpdated
    };
  }
};
```

#### **Skills Engine Service Integration**
```javascript
// Skills Engine Service Contract
const SkillsEngineService = {
  baseUrl: process.env.SKILLS_ENGINE_API_URL,
  endpoint: '/api/v1/analytics-data', // Single endpoint for all skills engine data
  
  async collectFromSkillsEngine(userId) {
    const response = await this.httpClient.get(
      `${this.baseUrl}${this.endpoint}`,
      {
        params: { userId },
        headers: { 'Authorization': `Bearer ${this.serviceToken}` },
        timeout: 5000
      }
    );
    
    return {
      serviceName: 'skillsEngine',
      userId: response.data.userId,
      data: {
        demandMetrics: response.data.demandMetrics,
        progressionMetrics: response.data.progressionMetrics,
        competenciesMatrix: response.data.competenciesMatrix,
        skillTrends: response.data.skillTrends
      },
      lastUpdated: response.data.lastUpdated
    };
  }
};
```

#### **Learner AI Service Integration**
```javascript
// Learner AI Service Contract
const LearnerAIService = {
  baseUrl: process.env.LEARNER_AI_API_URL,
  endpoint: '/api/v1/analytics-data', // Single endpoint for all learner AI data
  
  async collectFromLearnerAI(userId) {
    const response = await this.httpClient.get(
      `${this.baseUrl}${this.endpoint}`,
      {
        params: { userId },
        headers: { 'Authorization': `Bearer ${this.serviceToken}` },
        timeout: 5000
      }
    );
    
    return {
      serviceName: 'learnerAI',
      userId: response.data.userId,
      data: {
        learningPaths: response.data.learningPaths,
        skillToTopicMapping: response.data.skillToTopicMapping,
        progressTracking: response.data.progressTracking,
        recommendations: response.data.recommendations
      },
      lastUpdated: response.data.lastUpdated
    };
  }
};
```

#### **Content Studio Service Integration**
```javascript
// Content Studio Service Contract
const ContentStudioService = {
  baseUrl: process.env.CONTENT_STUDIO_API_URL,
  endpoint: '/api/v1/analytics-data', // Single endpoint for all content studio data
  
  async collectFromContentStudio(userId) {
    const response = await this.httpClient.get(
      `${this.baseUrl}${this.endpoint}`,
      {
        params: { userId },
        headers: { 'Authorization': `Bearer ${this.serviceToken}` },
        timeout: 5000
      }
    );
    
    return {
      serviceName: 'contentStudio',
      userId: response.data.userId,
      data: {
        contentItems: response.data.contentItems,
        usage: response.data.usage,
        creationMethod: response.data.creationMethod,
        topicCoverage: response.data.topicCoverage
      },
      lastUpdated: response.data.lastUpdated
    };
  }
};
```

#### **DevLab Service Integration**
```javascript
// DevLab Service Contract
const DevLabService = {
  baseUrl: process.env.DEVLAB_API_URL,
  endpoint: '/api/v1/analytics-data', // Single endpoint for all devlab data
  
  async collectFromDevLab(userId) {
    const response = await this.httpClient.get(
      `${this.baseUrl}${this.endpoint}`,
      {
        params: { userId },
        headers: { 'Authorization': `Bearer ${this.serviceToken}` },
        timeout: 5000
      }
    );
    
    return {
      serviceName: 'devLab',
      userId: response.data.userId,
      data: {
        practiceTopics: response.data.practiceTopics,
        labResults: response.data.labResults,
        completion: response.data.completion,
        timeInLab: response.data.timeInLab
      },
      lastUpdated: response.data.lastUpdated
    };
  }
};
```

#### **RAG Assistant Service Integration**
```javascript
// RAG Assistant Service Contract
const RAGAssistantService = {
  baseUrl: process.env.RAG_ASSISTANT_API_URL,
  endpoint: '/api/v1/analytics-data', // Single endpoint for all RAG assistant data
  
  async collectFromRAGAssistant(userId) {
    const response = await this.httpClient.get(
      `${this.baseUrl}${this.endpoint}`,
      {
        params: { userId },
        headers: { 'Authorization': `Bearer ${this.serviceToken}` },
        timeout: 5000
      }
    );
    
    return {
      serviceName: 'ragAssistant',
      userId: response.data.userId,
      data: {
        chatInteractions: response.data.chatInteractions,
        queries: response.data.queries,
        topicTags: response.data.topicTags,
        helpfulness: response.data.helpfulness
      },
      lastUpdated: response.data.lastUpdated
    };
  }
};
```

#### **Auth Service Integration**
```javascript
// Auth Service Contract (MS12)
const AuthService = {
  baseUrl: process.env.AUTH_API_URL,
  endpoint: '/api/v1/analytics-data', // Single endpoint for all auth data
  
  async collectFromAuth(userId) {
    const response = await this.httpClient.get(
      `${this.baseUrl}${this.endpoint}`,
      {
        params: { userId },
        headers: { 'Authorization': `Bearer ${this.serviceToken}` },
        timeout: 5000
      }
    );
    
    return {
      serviceName: 'auth',
      userId: response.data.userId,
      data: {
        jwtClaims: response.data.jwtClaims,
        sessionEvents: response.data.sessionEvents,
        loginHistory: response.data.loginHistory,
        permissions: response.data.permissions
      },
      lastUpdated: response.data.lastUpdated
    };
  }
};
```

---

## 🔄 **DATA COLLECTION ARCHITECTURE**

### **Parallel Data Collection**
```javascript
// Data Collection Service
class DataCollectionService {
  constructor(services, circuitBreakers) {
    this.services = services;
    this.circuitBreakers = circuitBreakers;
  }
  
  async collectUserData(userId, role) {
    const collectionPromises = [
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
    
    // Use Promise.allSettled for resilience
    const results = await Promise.allSettled(collectionPromises);
    
    return {
      directory: this.handleResult(results[0], 'directory'),
      courseBuilder: this.handleResult(results[1], 'courseBuilder'),
      assessment: this.handleResult(results[2], 'assessment'),
      skillsEngine: this.handleResult(results[3], 'skillsEngine'),
      learnerAI: this.handleResult(results[4], 'learnerAI'),
      contentStudio: this.handleResult(results[5], 'contentStudio'),
      devLab: this.handleResult(results[6], 'devLab'),
      ragAssistant: this.handleResult(results[7], 'ragAssistant'),
      auth: this.handleResult(results[8], 'auth'),
      collectedAt: new Date().toISOString(),
      collectionStatus: this.getCollectionStatus(results)
    };
  }
  
  handleResult(result, serviceName) {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`${serviceName} collection failed:`, result.reason);
      return null;
    }
  }
  
  getCollectionStatus(results) {
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const total = results.length;
    
    return {
      successful,
      total,
      successRate: (successful / total) * 100,
      failed: total - successful
    };
  }
}
```

### **Circuit Breaker Implementation**
```javascript
// Circuit Breaker for Service Integration
class ServiceCircuitBreaker {
  constructor(serviceName, options = {}) {
    this.serviceName = serviceName;
    this.threshold = options.threshold || 5;
    this.timeout = options.timeout || 60000;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error(`Circuit breaker for ${this.serviceName} is OPEN`);
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
      console.warn(`Circuit breaker for ${this.serviceName} is now OPEN`);
    }
  }
  
  getState() {
    return {
      serviceName: this.serviceName,
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }
}
```

---

## 🚀 **DEPLOYMENT INTEGRATION**

### **Multi-Platform Deployment**
```yaml
# Railway Configuration
railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "environments": {
    "production": {
      "variables": {
        "NODE_ENV": "production",
        "DATABASE_URL": "${{RAILWAY_DATABASE_URL}}",
        "REDIS_URL": "${{RAILWAY_REDIS_URL}}",
        "JWT_PUBLIC_KEY": "${{JWT_PUBLIC_KEY}}"
      }
    }
  }
}
```

### **Vercel Frontend Configuration**
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url",
    "VITE_ENVIRONMENT": "@environment"
  }
}
```

### **Supabase Database Configuration**
```sql
-- Database setup with RLS
CREATE POLICY "Users can only access their own analytics" ON learner_analytics
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Trainers can access their students' analytics" ON trainer_analytics
  FOR ALL USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT student_id FROM teaching_assignments 
      WHERE trainer_id = auth.uid()
    )
  );

CREATE POLICY "Org admins can access org analytics" ON organization_analytics
  FOR ALL USING (
    organization_id = (
      SELECT organization_id FROM users 
      WHERE id = auth.uid()
    )
  );
```

---

## 📊 **MONITORING & OBSERVABILITY**

### **Distributed Tracing**
```javascript
// Correlation ID middleware
const correlationId = (req, res, next) => {
  const id = req.headers['x-correlation-id'] || generateCorrelationId();
  
  req.correlationId = id;
  res.setHeader('x-correlation-id', id);
  
  // Add to all outgoing requests
  req.headers['x-correlation-id'] = id;
  
  next();
};

// Service request logging
const serviceRequestLogger = (serviceName) => {
  return (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      logger.info('Service Request', {
        service: serviceName,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        correlationId: req.correlationId,
        userId: req.user?.id
      });
    });
    
    next();
  };
};
```

### **Performance Monitoring**
```javascript
// Performance metrics collection
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }
  
  recordServiceCall(serviceName, duration, success) {
    const key = `service.${serviceName}`;
    const metric = this.metrics.get(key) || {
      totalCalls: 0,
      successfulCalls: 0,
      totalDuration: 0,
      averageDuration: 0
    };
    
    metric.totalCalls++;
    metric.totalDuration += duration;
    metric.averageDuration = metric.totalDuration / metric.totalCalls;
    
    if (success) {
      metric.successfulCalls++;
    }
    
    this.metrics.set(key, metric);
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
  
  getServiceHealth(serviceName) {
    const metric = this.metrics.get(`service.${serviceName}`);
    if (!metric) return null;
    
    return {
      serviceName,
      successRate: (metric.successfulCalls / metric.totalCalls) * 100,
      averageDuration: metric.averageDuration,
      totalCalls: metric.totalCalls
    };
  }
}
```

---

## 🔒 **SECURITY INTEGRATION**

### **Service-to-Service Authentication**
```javascript
// Service token management
class ServiceTokenManager {
  constructor() {
    this.tokens = new Map();
    this.refreshInterval = 300000; // 5 minutes
  }
  
  async getServiceToken(serviceName) {
    const token = this.tokens.get(serviceName);
    
    if (token && !this.isTokenExpired(token)) {
      return token.accessToken;
    }
    
    return await this.refreshServiceToken(serviceName);
  }
  
  async refreshServiceToken(serviceName) {
    try {
      const response = await this.httpClient.post(
        `${process.env.AUTH_SERVICE_URL}/api/v1/service-tokens`,
        {
          serviceName,
          serviceId: process.env.SERVICE_ID,
          serviceSecret: process.env.SERVICE_SECRET
        }
      );
      
      const tokenData = {
        accessToken: response.data.accessToken,
        expiresAt: new Date(response.data.expiresAt),
        serviceName
      };
      
      this.tokens.set(serviceName, tokenData);
      return tokenData.accessToken;
    } catch (error) {
      console.error(`Failed to refresh token for ${serviceName}:`, error);
      throw error;
    }
  }
  
  isTokenExpired(token) {
    return new Date() >= token.expiresAt;
  }
}
```

### **API Security Middleware**
```javascript
// API security middleware
const apiSecurity = (req, res, next) => {
  // Rate limiting per service
  const serviceName = req.headers['x-service-name'];
  if (serviceName) {
    const rateLimit = getServiceRateLimit(serviceName);
    // Apply service-specific rate limiting
  }
  
  // Request validation
  if (req.body && Object.keys(req.body).length > 0) {
    // Validate request body size and content
    if (JSON.stringify(req.body).length > 1024 * 1024) { // 1MB limit
      return res.status(413).json({ error: 'Request body too large' });
    }
  }
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
};
```

---

## 🧪 **TESTING INTEGRATION**

### **Contract Testing**
```javascript
// API contract testing with Pact
const pact = require('@pact-foundation/pact');

describe('Directory Service Contract', () => {
  const provider = new pact.Provider({
    name: 'Directory Service',
    port: 1234,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 2
  });

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('GET /api/v1/users/{userId}', () => {
    beforeEach(() => {
      const interaction = {
        state: 'user exists',
        uponReceiving: 'a request for user profile',
        withRequest: {
          method: 'GET',
          path: '/api/v1/users/123',
          headers: {
            'Authorization': 'Bearer valid-token',
            'Content-Type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: '123',
            role: 'learner',
            organizationId: 'org-456',
            preferences: {},
            lastUpdated: '2024-01-01T00:00:00Z'
          }
        }
      };
      
      return provider.addInteraction(interaction);
    });

    it('should return user profile', async () => {
      const directoryService = new DirectoryService();
      const result = await directoryService.getUserProfile('123');
      
      expect(result.userId).toBe('123');
      expect(result.role).toBe('learner');
      expect(result.organizationId).toBe('org-456');
    });
  });
});
```

### **Integration Testing**
```javascript
// End-to-end integration testing
describe('Analytics Integration', () => {
  let app;
  let server;
  
  beforeAll(async () => {
    app = require('../src/app');
    server = app.listen(0);
  });
  
  afterAll(async () => {
    server.close();
  });
  
  describe('Data Collection Integration', () => {
    it('should collect data from all services', async () => {
      const token = generateTestToken({ role: 'learner', userId: 'user123' });
      
      const response = await request(app)
        .post('/api/v1/analytics/refresh')
        .set('Authorization', `Bearer ${token}`)
        .expect(202);
      
      expect(response.body.status).toBe('refresh_queued');
      
      // Wait for background processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check analytics data
      const analyticsResponse = await request(app)
        .get('/api/v1/analytics/learner')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(analyticsResponse.body).toHaveProperty('velocity');
      expect(analyticsResponse.body).toHaveProperty('mastery');
      expect(analyticsResponse.body).toHaveProperty('skillGaps');
      expect(analyticsResponse.body).toHaveProperty('engagement');
    });
  });
});
```

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **Connection Pooling**
```javascript
// HTTP client with connection pooling
const httpClient = axios.create({
  timeout: 5000,
  maxRedirects: 3,
  httpAgent: new http.Agent({
    keepAlive: true,
    maxSockets: 50,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000
  }),
  httpsAgent: new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000
  })
});
```

### **Batch Processing Optimization**
```javascript
// Batch processing for analytics generation
class BatchProcessor {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 100;
    this.processingInterval = options.processingInterval || 60000; // 1 minute
    this.queue = [];
  }
  
  async processBatch() {
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, this.batchSize);
    
    // Process batch in parallel
    const promises = batch.map(item => this.processItem(item));
    const results = await Promise.allSettled(promises);
    
    // Handle results
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Batch item ${index} failed:`, result.reason);
        // Retry logic or dead letter queue
      }
    });
  }
  
  async processItem(item) {
    const { userId, role } = item;
    
    // Collect data from services
    const data = await this.dataCollectionService.collectUserData(userId, role);
    
    // Process analytics
    const analytics = await this.analyticsService.processAnalytics(data, role);
    
    // Store results
    await this.analyticsRepository.storeAnalytics(userId, role, analytics);
    
    return { userId, role, success: true };
  }
  
  start() {
    setInterval(() => {
      this.processBatch();
    }, this.processingInterval);
  }
}
```

---

## 🎯 **NEXT STEPS**

**Phase 2D**: Database Architecture - Schema design, ERD generation, data modeling  
**Phase 3**: Implementation & Development - TDD approach with RED-GREEN-REFACTOR cycles  

**Ready to proceed to Phase 2D: Database Architecture** ✅
