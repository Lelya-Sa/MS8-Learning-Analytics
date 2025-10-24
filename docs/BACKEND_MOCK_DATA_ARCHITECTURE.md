# Backend Mock Data Architecture

## 🎯 Overview

This document explains the **correct architecture** for mock data in the MS8-Learning-Analytics microservice.

## 🏗️ Architecture Principle

**Mock data belongs in the BACKEND, not the frontend.**

### Why?

1. **Microservice Architecture**: This is a learning analytics microservice that collects data from 9 external microservices
2. **Fallback Strategy**: When external microservices are unavailable, the backend should return mock data
3. **Single Source of Truth**: Mock data should only exist in one place (backend)
4. **Realistic Testing**: Frontend should always call the backend API, whether it returns real or mock data

## 📊 Data Flow

```
┌─────────────┐
│  Frontend   │
│  (React)    │
└──────┬──────┘
       │ API Call
       ▼
┌─────────────────────────────────────────────────────────┐
│  Backend (Railway)                                      │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 1. Try External Microservices (TODO)             │ │
│  │    - Directory MS                                 │ │
│  │    - Course Builder MS                            │ │
│  │    - Content Studio MS                            │ │
│  │    - Assessment MS                                │ │
│  │    - Skills Engine MS                             │ │
│  │    - Learner AI MS                                │ │
│  │    - DevLab MS                                    │ │
│  │    - RAG Assistant MS                             │ │
│  │    - Auth MS (MS12)                               │ │
│  └───────────────────────────────────────────────────┘ │
│                      │                                   │
│                      │ If external APIs fail             │
│                      ▼                                   │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 2. Fallback to Mock Data (Current State)         │ │
│  │    - mockData.js                                  │ │
│  │    - analyticsService.getLearnerVelocity()        │ │
│  │    - analyticsService.getLearnerSkillGaps()       │ │
│  │    - etc.                                         │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
       │
       │ JSON Response
       ▼
┌─────────────┐
│  Frontend   │
│  Displays   │
│  Data       │
└─────────────┘
```

## 📁 File Structure

### Backend (Correct Location for Mock Data)

```
backend/
├── services/
│   └── mockData.js              # ✅ Mock data for all analytics
├── routes/
│   └── analytics.js             # ✅ API endpoints with fallback logic
└── tests/
    └── mock-data-integration.test.js  # ✅ Tests for mock data
```

### Frontend (No Mock Data)

```
frontend/
├── src/
│   ├── services/
│   │   └── analyticsService.js  # ✅ Calls backend API only
│   └── hooks/
│       └── useAnalytics.js      # ✅ SWR hooks for data fetching
```

## 🔧 Implementation

### Backend Route Example

```javascript
/**
 * AS-001 #1: Learning Velocity & Momentum
 * GET /api/v1/analytics/learner/:userId/velocity
 * 
 * Data Flow:
 * 1. Try to fetch from external microservices (not implemented yet)
 * 2. If external API fails, return mock data as fallback
 */
router.get('/learner/:userId/velocity', authenticateToken, [
    param('userId').matches(validationRules.userId.matches).withMessage(validationRules.userId.message)
], handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user can access this resource
        if (!canAccessResource(userId, req.user, ['trainer', 'org_admin'])) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        // TODO: Try to fetch from external microservices
        // const externalData = await fetchFromExternalMicroservices(userId);
        // if (externalData) return res.json(externalData);

        // Fallback to mock data (current implementation)
        const analytics = analyticsService.getLearnerVelocity(userId);
        if (!analytics) {
            return res.status(404).json({
                error: 'Analytics not found',
                code: 'ANALYTICS_NOT_FOUND'
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching learner velocity:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});
```

### Frontend Service Example

```javascript
/**
 * AS-001 #1: Learning Velocity & Momentum
 * Backend returns mock data as fallback when external microservices unavailable
 */
async getLearnerVelocity(userId) {
  try {
    const response = await api.get(`/analytics/learner/${userId}/velocity`)
    return { ...response, source: 'backend' }
  } catch (error) {
    console.error('Failed to fetch learner velocity:', error)
    throw error
  }
}
```

## 🎯 Current State

### ✅ Implemented

1. **Backend Mock Data**: Complete mock data for all 6 learner analytics in `backend/services/mockData.js`
2. **Backend API Endpoints**: 6 endpoints serving mock data
3. **Frontend Service Layer**: Simplified to just call backend API
4. **TDD Tests**: 
   - Backend: 9/9 tests passing (mock data integration)
   - Frontend: 26/26 tests passing (component rendering with data)

### 🚧 TODO: External Microservice Integration

When ready to connect to real microservices, update each backend route:

```javascript
// Step 1: Try external microservices
try {
    const externalData = await fetchFromDirectoryMS(userId);
    const courseData = await fetchFromCourseBuilderMS(userId);
    const assessmentData = await fetchFromAssessmentMS(userId);
    
    // Combine and process data
    const analytics = processAnalytics(externalData, courseData, assessmentData);
    return res.json(analytics);
} catch (externalError) {
    console.warn('External microservices unavailable, using mock data:', externalError);
    
    // Step 2: Fallback to mock data
    const mockAnalytics = analyticsService.getLearnerVelocity(userId);
    return res.json(mockAnalytics);
}
```

## 📊 Mock Data Structure

### Example: Learning Velocity

```json
{
  "success": true,
  "data": {
    "learningVelocity": {
      "currentPace": 2.5,
      "averagePace": 1.8,
      "trend": "accelerating",
      "trendPercentage": 38.9,
      "comparisonToGoal": {
        "targetPace": 2.0,
        "variance": 25,
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
        "totalTimeSpent": 45.5,
        "averageTimePerTopic": 3.2,
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
    "calculatedAt": "2025-01-23T10:00:00.000Z",
    "dataFreshness": "2 hours",
    "confidence": "high"
  }
}
```

## 🔒 Security

- All endpoints require authentication (`authenticateToken`)
- RBAC enforced: learners can only access their own data
- Trainers and org_admins can access learner data
- User ID validation on all endpoints

## 📈 Benefits of This Architecture

1. **Scalability**: Easy to switch from mock to real data
2. **Maintainability**: Single source of truth for mock data
3. **Testability**: Frontend tests backend API, not mock data
4. **Realism**: Frontend always uses the same API, whether mock or real
5. **Separation of Concerns**: Backend handles data sourcing, frontend handles display
6. **Microservice Ready**: Architecture supports gradual migration to real microservices

## 🚀 Next Steps

1. ✅ Complete AS-001 (Learner Analytics) - 6/6 done
2. 🚧 Implement AS-002 (Trainer Analytics) - 4 analytics
3. 🚧 Implement AS-003 (Organizational Analytics) - 4 analytics
4. 🚧 Implement AS-004 (Predictive Analytics) - 4 analytics with Google Gemini AI
5. 🚧 Implement AS-005 (Comparison Analytics) - 1 analytic with 5 filters
6. 🚧 Connect to external microservices
7. 🚧 Implement caching strategy (4h learner, 2h trainer, 6h org, 48h AI)

---

**Last Updated**: 2025-01-23  
**Status**: ✅ Architecture Corrected - Mock Data Centralized in Backend

