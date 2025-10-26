# Integration Architecture

**Phase:** 2C - Integration Architecture  
**Date:** October 24, 2025  
**Status:** Complete - Ready for Implementation  
**Based on:** Debate #4, #6 + User Requirements

---

## 🎯 **Overview**

This document defines how the Learning Analytics microservice (MS8) integrates with:
- 9 external microservices
- Google Gemini AI
- Supabase (PostgreSQL)
- Railway (backend hosting)
- Vercel (frontend hosting)
- GitHub Actions (CI/CD)

---

## 🏗️ **System Architecture Diagram**

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vercel)                        │
│  React + Vite + Tailwind + SWR                                  │
│  https://ms8-frontend.vercel.app                                │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTPS/TLS
                         │ JWT Bearer Token
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                  MS8 - Learning Analytics BFF                     │
│                      Express.js (Railway)                         │
│              https://ms8-backend.railway.app                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API Layer (Presentation)                                   │ │
│  │  - JWT Authentication                                       │ │
│  │  - RBAC Authorization                                       │ │
│  │  - Rate Limiting                                            │ │
│  │  - Response Caching (5min TTL)                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↓                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Business Logic (Application + Domain)                      │ │
│  │  - Analytics Calculation                                    │ │
│  │  - Data Aggregation                                         │ │
│  │  - Fetch from External APIs → Cache in DB                   │ │
│  │  - Mock Data Fallback                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↓                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Integration Layer (Infrastructure)                         │ │
│  │  - External Microservice Clients (9) - REST API calls       │ │
│  │  - Supabase Client (MS8's own database)                     │ │
│  │  - Google Gemini Client                                     │ │
│  │  - Cache Manager (NodeCache + DB)                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────┬────────────────────┬──────────────┬──────────────────┘
           │ REST API           │              │
           │ (External)         │ (MS8's DB)   │ (AI Service)
           ↓                    ↓              ↓
┌──────────────────────┐  ┌──────────┐  ┌──────────────────┐
│  External            │  │ Supabase │  │ Google Gemini AI │
│  Microservices       │  │ Postgres │  │                  │
│  (Not owned by MS8)  │  │ (MS8 DB) │  │                  │
│                      │  │          │  │                  │
│  • Auth (MS12)       │  │ Stores:  │  │ • Predictions    │
│  • Directory         │  │ • Cache  │  │ • Forecasting    │
│  • Course Builder    │  │ • Users  │  │ • Recommends     │
│  • Content Studio    │  │ • Points │  │                  │
│  • Assessment        │  │ • Streaks│  │                  │
│  • Skills Engine     │  │ • Badges │  │                  │
│  • Learner AI        │  │ • RLS    │  │                  │
│  • DevLab            │  │          │  │                  │
│  • RAG Assistant     │  │          │  │                  │
│                      │  │          │  │                  │
│  MS8 calls their     │  │          │  │                  │
│  REST APIs →         │  │          │  │                  │
│  Stores data here ───┼──┘          │  │                  │
└──────────────────────┘              └──────────────────┘

KEY DATA FLOW:
1. Frontend requests analytics from MS8 BFF
2. MS8 checks its own cache/DB first
3. If expired/missing, MS8 calls external microservices REST APIs
4. MS8 stores fetched data in its own Supabase DB
5. MS8 returns processed analytics to frontend
6. Next request uses cached data from MS8's DB
```

---

## 🔌 **1. External Microservice Integration**

### **9 External Microservices (Not Owned by MS8)**

**Important:** These microservices are **external** - MS8 does NOT have direct database access. All data is fetched via REST API calls, then cached/stored in MS8's own Supabase database.

| # | Service | Purpose | URL | Auth |
|---|---------|---------|-----|------|
| 1 | Auth (MS12) | Authentication, user profiles | `process.env.AUTH_MS_URL` | Service Token |
| 2 | Directory | Organization and user directory | `process.env.DIRECTORY_MS_URL` | Service Token |
| 3 | Course Builder | Course structure and content | `process.env.COURSE_MS_URL` | Service Token |
| 4 | Content Studio | Learning materials | `process.env.CONTENT_MS_URL` | Service Token |
| 5 | Assessment | Tests, quizzes, scores | `process.env.ASSESSMENT_MS_URL` | Service Token |
| 6 | Skills Engine | Skill definitions, mastery | `process.env.SKILLS_MS_URL` | Service Token |
| 7 | Learner AI | Personalized learning paths | `process.env.LEARNER_AI_MS_URL` | Service Token |
| 8 | DevLab | Practice environments | `process.env.DEVLAB_MS_URL` | Service Token |
| 9 | RAG Assistant | AI chatbot | `process.env.RAG_MS_URL` | Service Token |

### **Microservice Client Implementation**

```javascript
// infrastructure/microservices/BaseClient.js
class BaseMicroserviceClient {
  constructor(baseURL, serviceName) {
    this.baseURL = baseURL;
    this.serviceName = serviceName;
    this.timeout = 10000; // 10 seconds
  }

  async request(endpoint, options = {}) {
    try {
      const response = await axios({
        method: options.method || 'GET',
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.getServiceToken()}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        data: options.body,
        timeout: this.timeout,
      });
      
      return response.data;
    } catch (error) {
      console.error(`[${this.serviceName}] API Error:`, error.message);
      
      if (error.response?.status === 503) {
        throw new ServiceUnavailableError(this.serviceName);
      }
      
      throw error;
    }
  }

  getServiceToken() {
    // Generate service-to-service JWT token
    return jwt.sign(
      { service: 'MS8-Learning-Analytics', scope: 'read' },
      process.env.SERVICE_SECRET,
      { expiresIn: '5m' }
    );
  }
}
```

### **Example: Course Client**

```javascript
// infrastructure/microservices/courseClient.js
class CourseClient extends BaseMicroserviceClient {
  constructor() {
    super(process.env.COURSE_MS_URL, 'Course Builder');
  }

  async getUserCourseProgress(userId) {
    return this.request(`/api/v1/users/${userId}/progress`);
  }

  async getCourseDetails(courseId) {
    return this.request(`/api/v1/courses/${courseId}`);
  }

  async getEnrollments(userId) {
    return this.request(`/api/v1/enrollments?userId=${userId}`);
  }
}
```

### **Data Collection & Caching Strategy**

**Flow:** External API → Cache in MS8 DB → Serve to Frontend

```javascript
// application/useCases/GetLearnerVelocity.js
class GetLearnerVelocity {
  constructor(courseClient, skillsClient, cacheRepository, mockDataService) {
    this.courseClient = courseClient;
    this.skillsClient = skillsClient;
    this.cacheRepository = cacheRepository;
    this.mockDataService = mockDataService;
  }

  async execute(userId) {
    try {
      // Step 1: Try to fetch from MS8's cache/database
      const cachedData = await this.cacheRepository.getLearnerVelocity(userId);
      if (cachedData && !this.isExpired(cachedData)) {
        return {
          data: cachedData,
          meta: {
            dataSource: 'cached',
            calculatedAt: cachedData.calculatedAt,
          },
        };
      }

      // Step 2: Fetch fresh data from external microservices via API
      const [courseData, skillData] = await Promise.all([
        this.courseClient.getUserCourseProgress(userId),  // External API call
        this.skillsClient.getUserSkills(userId),          // External API call
      ]);

      // Step 3: Calculate analytics from fetched data
      const analytics = this.calculateVelocity(courseData, skillData);

      // Step 4: Store in MS8's database for future use
      await this.cacheRepository.saveLearnerVelocity(userId, analytics);

      return {
        data: analytics,
        meta: {
          dataSource: 'realtime',
          calculatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.warn(`External microservices unavailable for user ${userId}:`, error.message);

      // Fallback 1: Try to return stale cache
      const staleCache = await this.cacheRepository.getLearnerVelocity(userId);
      if (staleCache) {
        return {
          data: staleCache,
          meta: {
            dataSource: 'stale_cache',
            calculatedAt: staleCache.calculatedAt,
          },
        };
      }

      // Fallback 2: Return mock data
      return {
        data: this.mockDataService.getLearnerVelocity(userId),
        meta: {
          dataSource: 'mock',
          calculatedAt: new Date().toISOString(),
        },
      };
    }
  }

  isExpired(cachedData) {
    const now = new Date();
    const expiresAt = new Date(cachedData.expiresAt);
    return now > expiresAt;
  }
}
```

### **Data Storage in MS8 Database**

```javascript
// infrastructure/database/repositories/analyticsRepository.js
class AnalyticsRepository {
  constructor(supabase) {
    this.supabase = supabase;
  }

  async saveLearnerVelocity(userId, analytics) {
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours

    await this.supabase
      .from('learner_velocity_analytics')
      .upsert({
        user_id: userId,
        current_pace: analytics.currentPace,
        target_pace: analytics.targetPace,
        trend_direction: analytics.trendDirection,
        trend_percentage: analytics.trendPercentage,
        status: analytics.status,
        estimated_completion: analytics.estimatedCompletion,
        calculated_at: new Date(),
        expires_at: expiresAt,
      }, { onConflict: 'user_id' });
  }

  async getLearnerVelocity(userId) {
    const { data, error } = await this.supabase
      .from('learner_velocity_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }
}
```

---

## 🤖 **2. Google Gemini AI Integration**

### **Use Cases**

1. **Drop-Off Risk Prediction** - ML model analyzing engagement patterns
2. **Learning Outcome Forecasting** - Time-series predictions
3. **Personalized Recommendations** - AI-generated course suggestions

### **Gemini Client**

```javascript
// infrastructure/ai/geminiClient.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiClient {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateRecommendations(userId, userContext) {
    const prompt = `
      User Profile:
      - Current Skills: ${userContext.skills.join(', ')}
      - Learning Goals: ${userContext.goals.join(', ')}
      - Learning Velocity: ${userContext.velocity} topics/week
      - Completed Courses: ${userContext.completedCourses}

      Industry Trends:
      - TypeScript adoption growing 30% YoY
      - Cloud skills (AWS, Azure) in high demand
      - AI/ML skills emerging rapidly

      Generate 5 personalized course recommendations with:
      1. Course name
      2. Reasoning (why this is recommended)
      3. Expected outcomes
      4. Estimated completion time
      5. Priority (1-5)

      Format as JSON array.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from response
      const recommendations = JSON.parse(text);

      return recommendations;
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new AIServiceError('Failed to generate recommendations');
    }
  }

  async predictDropOffRisk(userId, userActivity) {
    const prompt = `
      Analyze drop-off risk for a learner:
      - Last Activity: ${userActivity.lastActivityDate}
      - Days Inactive: ${userActivity.daysInactive}
      - Historical Engagement: ${userActivity.avgEngagement}%
      - Course Progress: ${userActivity.courseProgress}%
      - Assessment Scores: ${userActivity.avgScore}%

      Determine:
      1. Risk Level (low/medium/high/critical)
      2. Risk Score (0-1)
      3. Top 3 contributing factors with weights
      4. Recommended actions

      Format as JSON.
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  }
}
```

### **Caching Strategy for AI**

```javascript
// AI predictions are expensive, cache for 48 hours
const cachedAIPrediction = await cache.get(`ai-recommendations-${userId}`);

if (cachedAIPrediction) {
  return cachedAIPrediction;
}

const prediction = await geminiClient.generateRecommendations(userId, context);

await cache.set(`ai-recommendations-${userId}`, prediction, 172800); // 48h

return prediction;
```

---

## 💾 **3. Supabase Integration**

### **Connection Configuration**

```javascript
// infrastructure/database/supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  }
);

module.exports = supabase;
```

### **Connection Pooling (PgBouncer)**

Supabase provides built-in PgBouncer connection pooling:

```
Direct Connection: postgresql://[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
Pooled Connection: postgresql://[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres
```

Use pooled connection for Railway backend:

```javascript
// Use connection pooling for Railway (long-lived connections)
const DATABASE_URL = process.env.DATABASE_URL; // Points to port 6543
```

### **RLS (Row Level Security)**

```sql
-- Enable RLS on analytics tables
ALTER TABLE learner_velocity_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY user_own_analytics ON learner_velocity_analytics
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Org admins can see all org data
CREATE POLICY org_admin_analytics ON learner_velocity_analytics
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE organization_id = (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );
```

---

## 🚀 **4. Deployment Architecture**

### **Frontend (Vercel)**

**Purpose:** Host React SPA  
**URL:** `https://ms8-frontend.vercel.app`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Environment Variables:**
- `VITE_API_URL` → Railway backend URL
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Vercel Configuration:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### **Backend (Railway)**

**Purpose:** BFF (Backend-for-Frontend)  
**URL:** `https://ms8-backend.railway.app`  
**Start Command:** `npm start`  
**Environment Variables:**
- `DATABASE_URL` → Supabase pooled connection
- `JWT_SECRET`
- `GOOGLE_GEMINI_API_KEY`
- `AUTH_MS_URL`, `COURSE_MS_URL`, etc. (9 microservices)

**Railway Configuration:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Database (Supabase)**

**Purpose:** PostgreSQL database  
**URL:** Provided by Supabase  
**Connection:** Via PgBouncer (port 6543)  
**Backup:** Automatic daily backups (30-day retention)  
**RLS:** Enabled for multi-tenancy

---

## 🔄 **5. CI/CD Pipeline (GitHub Actions)**

### **Workflow: Deploy to Production**

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm test
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci
      - run: cd frontend && npm test

  deploy-backend:
    needs: [test-backend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          curl -X POST ${{ secrets.RAILWAY_WEBHOOK_URL }}

  deploy-frontend:
    needs: [test-frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🔒 **6. Security & Privacy**

### **Authentication Flow**

```
1. User logs in via Frontend
   POST /api/v1/auth/login
   ↓
2. Backend verifies with Auth MS (MS12)
   POST {AUTH_MS_URL}/api/v1/auth/verify
   ↓
3. Backend generates JWT token
   jwt.sign({ userId, roles, organizationId }, JWT_SECRET)
   ↓
4. Frontend stores token (localStorage)
   ↓
5. Frontend includes token in all requests
   Authorization: Bearer {token}
   ↓
6. Backend middleware validates token
   jwt.verify(token, JWT_SECRET)
   ↓
7. RBAC middleware checks user roles
   authorize(['learner', 'trainer'])
   ↓
8. Request proceeds to controller
```

### **Service-to-Service Authentication**

```javascript
// Microservice calls use service tokens
const serviceToken = jwt.sign(
  { service: 'MS8', scope: 'read' },
  process.env.SERVICE_SECRET,
  { expiresIn: '5m' }
);

axios.get(COURSE_MS_URL, {
  headers: { Authorization: `Bearer ${serviceToken}` }
});
```

### **CORS Configuration**

```javascript
// presentation/middleware/cors.js
const cors = require('cors');

const corsOptions = {
  origin: [
    'https://ms8-frontend.vercel.app',
    'http://localhost:5173', // Local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

---

## 📊 **7. Monitoring & Logging**

### **Structured Logging (Winston)**

```javascript
// infrastructure/logging/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
```

### **Request Logging Middleware**

```javascript
// presentation/middleware/requestLogger.js
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
      ip: req.ip,
    });
  });

  next();
};
```

### **Health Check Endpoint**

```javascript
// presentation/routes/health.js
router.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      database: await checkDatabase(),
      cache: await checkCache(),
      microservices: await checkMicroservices(),
    },
  };

  const isHealthy = Object.values(health.services).every(s => s === 'healthy');

  res.status(isHealthy ? 200 : 503).json(health);
});
```

---

## ✅ **Integration Checklist**

### **Microservices Integration**
- [ ] Configure all 9 microservice URLs
- [ ] Implement service-to-service authentication
- [ ] Add timeout and retry logic
- [ ] Implement circuit breaker pattern
- [ ] Add mock data fallback

### **Database Integration**
- [ ] Configure Supabase connection
- [ ] Set up connection pooling (PgBouncer)
- [ ] Implement RLS policies
- [ ] Create indexes for performance
- [ ] Set up automated backups

### **AI Integration**
- [ ] Configure Google Gemini API key
- [ ] Implement caching (48h TTL)
- [ ] Add rate limiting for AI calls
- [ ] Handle API errors gracefully
- [ ] Add cost monitoring

### **Deployment**
- [ ] Configure Railway environment variables
- [ ] Configure Vercel environment variables
- [ ] Set up GitHub Actions workflows
- [ ] Configure domain and SSL
- [ ] Set up monitoring and alerts

### **Security**
- [ ] Implement JWT authentication
- [ ] Configure RBAC middleware
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Add security headers

---

## ✅ **Complete - Ready for Phase 3C**

**Deliverables:**
- ✅ BFF integration pattern defined
- ✅ 9 microservice clients specified
- ✅ Google Gemini AI integration designed
- ✅ Supabase connection configured
- ✅ Deployment architecture (Railway + Vercel)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Security & authentication flow
- ✅ Monitoring & logging strategy

**Next Action:** Begin Phase 3C (Integration TDD Implementation)

---

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Status:** Complete - Ready for Implementation

