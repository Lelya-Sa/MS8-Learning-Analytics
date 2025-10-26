# Backend Architecture

**Phase:** 2B - Backend Architecture  
**Date:** October 24, 2025  
**Status:** Ready for Implementation (Phase 3B)  
**Based on:** Debates #4, #6 + User Requirements

---

## 🎯 **Overview**

The backend follows the **BFF (Backend-for-Frontend) pattern**, aggregating data from 9 external microservices and serving it to the frontend via a RESTful API.

---

## 🏗️ **Architecture Pattern: Onion Architecture**

```
backend/
├── domain/              ← Layer 1: Business Logic
│   ├── entities/
│   │   ├── User.js
│   │   ├── Analytics.js
│   │   └── Achievement.js
│   └── valueObjects/
│       ├── SkillLevel.js
│       └── CompetencyLevel.js
│
├── application/         ← Layer 2: Use Cases
│   ├── useCases/
│   │   ├── GetLearnerAnalytics.js
│   │   ├── CalculateDropOffRisk.js
│   │   └── AwardPoints.js
│   └── interfaces/
│       ├── IAnalyticsRepository.js
│       └── IMicroserviceClient.js
│
├── infrastructure/      ← Layer 3: External Dependencies
│   ├── database/
│   │   ├── supabase.js
│   │   └── repositories/
│   ├── microservices/
│   │   ├── authClient.js
│   │   ├── courseClient.js
│   │   └── skillsClient.js
│   ├── cache/
│   │   └── nodeCache.js
│   └── ai/
│       └── geminiClient.js
│
└── presentation/        ← Layer 4: API Layer
    ├── routes/
    │   ├── analytics.js
    │   ├── gamification.js
    │   └── predictive.js
    ├── middleware/
    │   ├── authenticate.js
    │   ├── authorize.js
    │   └── rateLimit.js
    └── controllers/
        ├── analyticsController.js
        └── gamificationController.js
```

---

## 🔌 **BFF Integration Layer**

### **Microservice Clients**

```javascript
// infrastructure/microservices/courseClient.js
class CourseClient {
  async getCourseProgress(userId) {
    try {
      const response = await axios.get(
        `${process.env.COURSE_MS_URL}/api/v1/progress/${userId}`,
        { headers: { Authorization: `Bearer ${getServiceToken()}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Course MS unavailable, using mock data');
      return getMockCourseProgress(userId);
    }
  }
}
```

### **External Microservices (9 total)**

1. **Auth (MS12)** - Authentication, user profiles
2. **Directory** - Organization and user directory
3. **Course Builder** - Course structure and content
4. **Content Studio** - Learning materials
5. **Assessment** - Tests, quizzes, scores
6. **Skills Engine** - Skill definitions, mastery tracking
7. **Learner AI** - Personalized learning paths
8. **DevLab** - Practice environments
9. **RAG Assistant** - AI chatbot for help

---

## 📡 **API Structure**

### **REST API Design**

**Base URL:** `/api/v1/`

**Versioning:** URL path (`/v1/`, `/v2/`)

**Authentication:** JWT Bearer tokens

**Authorization:** RBAC middleware

```
/api/v1/
├── /auth/
│   ├── POST /login
│   ├── POST /logout
│   └── GET /me
│
├── /analytics/
│   ├── /learner/
│   │   ├── GET /velocity/:userId
│   │   ├── GET /skill-gap/:userId
│   │   ├── GET /engagement/:userId
│   │   ├── GET /mastery/:userId
│   │   ├── GET /performance/:userId
│   │   └── GET /content-effectiveness/:userId
│   ├── /trainer/
│   │   ├── GET /course-performance/:trainerId
│   │   ├── GET /course-health/:trainerId
│   │   ├── GET /student-distribution/:trainerId
│   │   └── GET /teaching-effectiveness/:trainerId
│   ├── /organization/
│   │   ├── GET /learning-velocity/:orgId
│   │   ├── GET /strategic-alignment/:orgId
│   │   ├── GET /department-analytics/:orgId
│   │   └── GET /learning-culture/:orgId
│   ├── /comparison/
│   │   ├── GET /peer/:userId
│   │   └── GET /skill-demand
│   └── /predictive/
│       ├── GET /drop-off-risk/:userId
│       ├── GET /forecast/:userId
│       └── GET /recommendations/:userId
│
├── /gamification/
│   ├── GET /stats/:userId
│   ├── GET /achievements/:userId
│   ├── GET /leaderboard
│   └── GET /streak/:userId
│
└── /health
```

**Total Endpoints:** 30+ (19 analytics + 4 gamification + auth + health)

---

## 🔐 **Security Implementation**

### **Authentication Middleware**

```javascript
// presentation/middleware/authenticate.js
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, roles, organizationId }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### **RBAC Middleware**

```javascript
// presentation/middleware/authorize.js
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

### **Rate Limiting**

```javascript
// presentation/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const standardLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  keyGenerator: (req) => req.user?.id || req.ip,
});

const predictiveLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  keyGenerator: (req) => req.user?.id,
});
```

---

## 💾 **Caching Strategy**

### **4-Layer Caching**

**Layer 1: Frontend SWR** (4h learner, 2h trainer, 6h org, 48h predictive)  
**Layer 2: CDN (Vercel Edge)** (1h with stale-while-revalidate)  
**Layer 3: Backend In-Memory** (5min API responses)  
**Layer 4: Database** (Materialized views)

### **Backend Cache Implementation**

```javascript
// infrastructure/cache/nodeCache.js
const NodeCache = require('node-cache');

const analyticsCache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60,
  useClones: false,
});

// Caching middleware
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    const key = `${req.path}-${req.user.id}-${JSON.stringify(req.query)}`;
    const cached = analyticsCache.get(key);
    
    if (cached) {
      return res.json({
        ...cached,
        meta: { ...cached.meta, dataSource: 'cached' },
      });
    }
    
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      analyticsCache.set(key, data, ttl);
      return originalJson(data);
    };
    
    next();
  };
};
```

---

## 📊 **Response Format**

### **Success Response**

```json
{
  "success": true,
  "data": {
    "currentPace": 2.5,
    "targetPace": 3.0,
    "trend": "accelerating"
  },
  "meta": {
    "calculatedAt": "2025-10-24T10:00:00Z",
    "dataSource": "realtime" | "cached" | "mock",
    "cacheExpiry": "2025-10-24T14:00:00Z"
  }
}
```

### **Error Response (RFC 7807)**

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_DATA",
    "message": "Not enough learning history for analytics",
    "details": "Minimum 7 days of activity required"
  }
}
```

---

## 🎯 **Mock Data Strategy**

**Backend is responsible for mock data fallback:**

```javascript
// application/useCases/GetLearnerVelocity.js
class GetLearnerVelocity {
  async execute(userId) {
    try {
      // Try to fetch from external microservices
      const courseData = await this.courseClient.getCourseProgress(userId);
      const skillData = await this.skillsClient.getUserSkills(userId);
      
      // Calculate analytics from real data
      const analytics = this.calculateVelocity(courseData, skillData);
      
      return {
        data: analytics,
        meta: { dataSource: 'realtime', calculatedAt: new Date() },
      };
    } catch (error) {
      // Fallback to mock data if microservices unavailable
      console.warn('Using mock data for learner velocity');
      return {
        data: getMockLearnerVelocity(userId),
        meta: { dataSource: 'mock', calculatedAt: new Date() },
      };
    }
  }
}
```

---

## 📋 **Implementation Roadmap**

### **Week 1: Foundation**
- [ ] Set up Express.js server
- [ ] Configure JWT authentication
- [ ] Implement RBAC middleware
- [ ] Set up rate limiting
- [ ] Configure Supabase connection

### **Week 2-3: Learner Analytics (6 endpoints)**
- [ ] GET /analytics/learner/velocity
- [ ] GET /analytics/learner/skill-gap
- [ ] GET /analytics/learner/engagement
- [ ] GET /analytics/learner/mastery
- [ ] GET /analytics/learner/performance
- [ ] GET /analytics/learner/content-effectiveness

### **Week 4: Trainer Analytics (4 endpoints)**
- [ ] GET /analytics/trainer/course-performance
- [ ] GET /analytics/trainer/course-health
- [ ] GET /analytics/trainer/student-distribution
- [ ] GET /analytics/trainer/teaching-effectiveness

### **Week 5: Org Analytics (4 endpoints)**
- [ ] GET /analytics/organization/learning-velocity
- [ ] GET /analytics/organization/strategic-alignment
- [ ] GET /analytics/organization/department-analytics
- [ ] GET /analytics/organization/learning-culture

### **Week 6: Comparison & Predictive**
- [ ] GET /analytics/comparison/peer
- [ ] GET /analytics/comparison/skill-demand
- [ ] GET /analytics/predictive/drop-off-risk
- [ ] GET /analytics/predictive/forecast
- [ ] GET /analytics/predictive/recommendations

### **Week 7: Gamification**
- [ ] GET /gamification/stats
- [ ] GET /gamification/achievements
- [ ] GET /gamification/leaderboard
- [ ] GET /gamification/streak

### **Week 8: Optimization**
- [ ] Implement caching
- [ ] Set up monitoring
- [ ] Performance optimization
- [ ] Security hardening

---

## ✅ **Ready for Phase 3B**

**Deliverables:**
- ✅ Complete backend architecture (Onion)
- ✅ BFF pattern with 9 microservice clients
- ✅ 30+ REST API endpoints defined
- ✅ Security implementation (JWT, RBAC, Rate Limiting)
- ✅ 4-layer caching strategy
- ✅ Mock data fallback strategy
- ✅ 8-week implementation roadmap

**Next Action:** Begin Phase 3B (Backend TDD Implementation)

---

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Status:** Ready for Implementation

