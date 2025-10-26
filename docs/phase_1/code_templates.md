# Code Templates - MS8 Learning Analytics

**Project**: MS8 - Learning Analytics Microservice  
**Phase**: 1C - Planning  
**Version**: 1.0.0  
**Date**: October 24, 2025  
**Purpose**: Code templates for all 4 Onion layers (Domain, Application, Infrastructure, Presentation) - Frontend + Backend

---

## 📋 Overview

This document provides ready-to-use code templates following the Full-Stack Onion Architecture with Vibe Engineering principles.

**Templates Provided**:
- Domain Layer (Frontend + Backend)
- Application Layer (Frontend + Backend)
- Infrastructure Layer (Frontend + Backend)
- Presentation Layer (Frontend + Backend)

---

## 1. Domain Layer Templates

### 1.1 Backend: Domain Entity

```javascript
// backend/src/domain/entities/Analytics.js

/**
 * Analytics domain entity
 */
export class Analytics {
  /**
   * @param {string} id
   * @param {string} userId
   * @param {string} role
   * @param {string} analyticsType
   * @param {Object} data
   * @param {string} organizationId
   * @param {Date} createdAt
   * @param {Date} updatedAt
   */
  constructor(id, userId, role, analyticsType, data, organizationId, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.role = role;
    this.analyticsType = analyticsType;
    this.data = data;
    this.organizationId = organizationId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  
  /**
   * Check if analytics data is stale
   * @param {number} thresholdHours
   * @returns {boolean}
   */
  isStale(thresholdHours = 6) {
    if (!this.updatedAt) return true;
    
    const ageMs = Date.now() - new Date(this.updatedAt).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    
    return ageHours > thresholdHours;
  }
  
  /**
   * Get age label for display
   * @returns {string}
   */
  getAgeLabel() {
    if (!this.updatedAt) return 'Never updated';
    
    const ageHours = this.getAgeHours();
    
    if (ageHours < 1) return 'Just now';
    if (ageHours < 24) return `${Math.floor(ageHours)} hours ago`;
    return `${Math.floor(ageHours / 24)} days ago`;
  }
  
  /**
   * Get age in hours
   * @returns {number}
   */
  getAgeHours() {
    if (!this.updatedAt) return Infinity;
    
    const ageMs = Date.now() - new Date(this.updatedAt).getTime();
    return ageMs / (1000 * 60 * 60);
  }
  
  /**
   * Validate analytics data
   * @returns {{valid: boolean, errors: string[]}}
   */
  validate() {
    const errors = [];
    
    if (!this.userId) errors.push('userId is required');
    if (!this.role) errors.push('role is required');
    if (!this.analyticsType) errors.push('analyticsType is required');
    if (!this.data) errors.push('data is required');
    if (!this.organizationId) errors.push('organizationId is required');
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

### 1.2 Backend: Domain Service

```javascript
// backend/src/domain/services/LearningVelocityCalculator.js

/**
 * Learning Velocity Calculator (Domain Service)
 * Pure business logic, no I/O operations
 */
export class LearningVelocityCalculator {
  static MOMENTUM_THRESHOLD = 20;
  static TIME_WINDOWS = {
    WEEK: 7,
    MONTH: 30,
    QUARTER: 90
  };
  
  /**
   * Calculate learning velocity
   * @param {Object} params
   * @param {number} params.currentProgress
   * @param {number} params.previousProgress
   * @param {number} params.timeWindowDays
   * @returns {{velocity: number, momentum: string, percentageChange: number}}
   */
  calculate({ currentProgress, previousProgress, timeWindowDays }) {
    this._validateInputs(currentProgress, previousProgress, timeWindowDays);
    
    const velocity = this._calculateVelocity(currentProgress, previousProgress);
    const percentageChange = this._calculatePercentageChange(velocity, previousProgress);
    const momentum = this._determineMomentum(percentageChange);
    
    return {
      velocity,
      momentum,
      percentageChange,
      timeWindowDays
    };
  }
  
  _validateInputs(current, previous, timeWindow) {
    if (typeof current !== 'number' || current < 0 || current > 100) {
      throw new Error('currentProgress must be a number between 0 and 100');
    }
    if (typeof previous !== 'number' || previous < 0 || previous > 100) {
      throw new Error('previousProgress must be a number between 0 and 100');
    }
    if (typeof timeWindow !== 'number' || timeWindow <= 0) {
      throw new Error('timeWindowDays must be a positive number');
    }
  }
  
  _calculateVelocity(current, previous) {
    return current - previous;
  }
  
  _calculatePercentageChange(velocity, previous) {
    if (previous === 0) return velocity > 0 ? 100 : 0;
    return (velocity / previous) * 100;
  }
  
  _determineMomentum(percentageChange) {
    if (percentageChange > LearningVelocityCalculator.MOMENTUM_THRESHOLD) {
      return 'Accelerating';
    } else if (percentageChange < -LearningVelocityCalculator.MOMENTUM_THRESHOLD) {
      return 'Slowing';
    }
    return 'Steady';
  }
}
```

### 1.3 Frontend: Domain Entity (Same as Backend)

```javascript
// frontend/src/domain/entities/Analytics.js
// Same as backend Analytics.js (Vibe Engineering!)
export class Analytics {
  // Identical implementation to backend
}
```

---

## 2. Application Layer Templates

### 2.1 Backend: Port (Interface)

```javascript
// backend/src/application/ports/IAnalyticsRepository.js

/**
 * Analytics Repository Port (Interface)
 * Defines contract for data access
 */
export class IAnalyticsRepository {
  /**
   * Find analytics by user ID and role
   * @param {string} userId
   * @param {string} role
   * @returns {Promise<Analytics[]>}
   */
  async findByUserIdAndRole(userId, role) {
    throw new Error('Not implemented');
  }
  
  /**
   * Save analytics
   * @param {Analytics} analytics
   * @returns {Promise<Analytics>}
   */
  async save(analytics) {
    throw new Error('Not implemented');
  }
  
  /**
   * Find stale analytics
   * @param {number} thresholdHours
   * @returns {Promise<Analytics[]>}
   */
  async findStale(thresholdHours) {
    throw new Error('Not implemented');
  }
  
  /**
   * Delete analytics by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteById(id) {
    throw new Error('Not implemented');
  }
}
```

### 2.2 Backend: Use Case

```javascript
// backend/src/application/use-cases/CalculateLearnerAnalyticsUseCase.js

import { Analytics } from '../../domain/entities/Analytics.js';
import { LearningVelocityCalculator } from '../../domain/services/LearningVelocityCalculator.js';

/**
 * Calculate Learner Analytics Use Case
 * Orchestrates business logic and data access
 */
export class CalculateLearnerAnalyticsUseCase {
  /**
   * @param {IAnalyticsRepository} analyticsRepository
   * @param {IDirectoryService} directoryService
   * @param {ICourseBuilderService} courseBuilderService
   * @param {ISkillsEngineService} skillsEngineService
   */
  constructor(analyticsRepository, directoryService, courseBuilderService, skillsEngineService) {
    this.analyticsRepository = analyticsRepository;
    this.directoryService = directoryService;
    this.courseBuilderService = courseBuilderService;
    this.skillsEngineService = skillsEngineService;
    
    // Domain services
    this.velocityCalculator = new LearningVelocityCalculator();
  }
  
  /**
   * Execute use case
   * @param {string} userId
   * @param {string} role
   * @param {Object} options
   * @returns {Promise<Analytics>}
   */
  async execute(userId, role, options = {}) {
    // 1. Check cache first (if not forced)
    if (!options.force) {
      const existing = await this.analyticsRepository.findByUserIdAndRole(userId, role);
      if (existing && existing.length > 0 && !existing[0].isStale(6)) {
        return existing[0];
      }
    }
    
    // 2. Collect data from external services
    const [user, progress, skills] = await Promise.all([
      this.directoryService.getUser(userId),
      this.courseBuilderService.getUserProgress(userId),
      this.skillsEngineService.getUserSkills(userId)
    ]);
    
    // 3. Calculate analytics using domain services
    const velocity = this.velocityCalculator.calculate({
      currentProgress: progress.current,
      previousProgress: progress.previous,
      timeWindowDays: 30
    });
    
    // 4. Create analytics entity
    const analytics = new Analytics(
      null,
      userId,
      role,
      'learner_analytics',
      {
        velocity,
        // Other analytics data...
      },
      user.organizationId,
      null,
      new Date()
    );
    
    // 5. Save to repository
    const saved = await this.analyticsRepository.save(analytics);
    
    return saved;
  }
}
```

### 2.3 Frontend: Port (Interface)

```javascript
// frontend/src/application/ports/IAnalyticsService.js

/**
 * Analytics Service Port (Interface)
 */
export class IAnalyticsService {
  /**
   * Get learner analytics
   * @param {string} userId
   * @param {string} role
   * @returns {Promise<Object>}
   */
  async getLearnerAnalytics(userId, role) {
    throw new Error('Not implemented');
  }
  
  /**
   * Refresh analytics
   * @param {string} userId
   * @param {string} role
   * @returns {Promise<Object>}
   */
  async refreshAnalytics(userId, role) {
    throw new Error('Not implemented');
  }
}
```

### 2.4 Frontend: Use Case

```javascript
// frontend/src/application/use-cases/GetLearnerAnalyticsUseCase.js

/**
 * Get Learner Analytics Use Case (Frontend)
 */
export class GetLearnerAnalyticsUseCase {
  /**
   * @param {IAnalyticsService} analyticsService
   * @param {ICacheService} cacheService
   */
  constructor(analyticsService, cacheService) {
    this.analyticsService = analyticsService;
    this.cacheService = cacheService;
  }
  
  /**
   * Execute use case
   * @param {string} userId
   * @param {string} role
   * @returns {Promise<Object>}
   */
  async execute(userId, role) {
    // 1. Check cache first
    const cacheKey = `analytics:${userId}:${role}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return { ...cached, source: 'cache' };
    }
    
    // 2. Fetch from API
    const data = await this.analyticsService.getLearnerAnalytics(userId, role);
    
    // 3. Cache the result
    await this.cacheService.set(cacheKey, data, 3600); // 1 hour
    
    return { ...data, source: 'api' };
  }
}
```

---

## 3. Infrastructure Layer Templates

### 3.1 Backend: Repository Adapter (Prisma)

```javascript
// backend/src/infrastructure/adapters/AnalyticsRepositoryPrisma.js

import { IAnalyticsRepository } from '../../application/ports/IAnalyticsRepository.js';
import { Analytics } from '../../domain/entities/Analytics.js';

/**
 * Analytics Repository Adapter using Prisma
 */
export class AnalyticsRepositoryPrisma extends IAnalyticsRepository {
  /**
   * @param {PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }
  
  async findByUserIdAndRole(userId, role) {
    const records = await this.prisma.analytics.findMany({
      where: { userId, role }
    });
    
    return records.map(r => this._toDomain(r));
  }
  
  async save(analytics) {
    const record = await this.prisma.analytics.upsert({
      where: {
        userId_role_analyticsType: {
          userId: analytics.userId,
          role: analytics.role,
          analyticsType: analytics.analyticsType
        }
      },
      update: {
        data: analytics.data,
        updatedAt: new Date()
      },
      create: {
        userId: analytics.userId,
        role: analytics.role,
        analyticsType: analytics.analyticsType,
        data: analytics.data,
        organizationId: analytics.organizationId
      }
    });
    
    return this._toDomain(record);
  }
  
  async findStale(thresholdHours) {
    const thresholdDate = new Date(Date.now() - thresholdHours * 60 * 60 * 1000);
    
    const records = await this.prisma.analytics.findMany({
      where: {
        updatedAt: { lt: thresholdDate }
      }
    });
    
    return records.map(r => this._toDomain(r));
  }
  
  async deleteById(id) {
    try {
      await this.prisma.analytics.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }
  
  _toDomain(record) {
    return new Analytics(
      record.id,
      record.userId,
      record.role,
      record.analyticsType,
      record.data,
      record.organizationId,
      record.createdAt,
      record.updatedAt
    );
  }
}
```

### 3.2 Backend: External Service Adapter with Circuit Breaker

```javascript
// backend/src/infrastructure/adapters/DirectoryServiceAdapter.js

import { IDirectoryService } from '../../application/ports/IDirectoryService.js';
import { CircuitBreakerService } from '../services/CircuitBreakerService.js';
import { mockDirectoryData } from '../mocks/directoryMS.mock.js';

/**
 * Directory Service Adapter with Circuit Breaker
 */
export class DirectoryServiceAdapter extends IDirectoryService {
  /**
   * @param {AxiosInstance} httpClient
   */
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
    this.circuitBreaker = new CircuitBreakerService({
      failureThreshold: 5,
      cooldownPeriod: 60000,
      requestTimeout: 5000
    });
  }
  
  async getUser(userId) {
    return this.circuitBreaker.execute(
      () => this._getUserFromAPI(userId),
      () => this._getUserFromMock(userId)
    );
  }
  
  async _getUserFromAPI(userId) {
    const response = await this.httpClient.get(`/users/${userId}`);
    return { ...response.data, source: 'real' };
  }
  
  _getUserFromMock(userId) {
    const mockUser = mockDirectoryData.users.find(u => u.id === userId);
    return mockUser ? { ...mockUser, source: 'mock' } : null;
  }
}
```

### 3.3 Frontend: API Service Adapter

```javascript
// frontend/src/infrastructure/adapters/AnalyticsServiceAdapter.js

import { IAnalyticsService } from '../../application/ports/IAnalyticsService.js';
import { apiClient } from '../api/apiClient';

/**
 * Analytics Service Adapter (Frontend API Client)
 */
export class AnalyticsServiceAdapter extends IAnalyticsService {
  async getLearnerAnalytics(userId, role) {
    const response = await apiClient.get(`/api/v1/analytics/learner/${userId}`, {
      headers: { 'X-Active-Role': role }
    });
    
    return response.data.data;
  }
  
  async refreshAnalytics(userId, role) {
    const response = await apiClient.post(`/api/v1/analytics/refresh/${userId}`, {
      role
    });
    
    return response.data.data;
  }
}
```

---

## 4. Presentation Layer Templates

### 4.1 Backend: Controller

```javascript
// backend/src/presentation/controllers/AnalyticsController.js

import { container } from '../../infrastructure/di/container.js';
import { ValidationError, UnauthorizedError } from '../../domain/errors/index.js';

/**
 * Analytics Controller
 */
export class AnalyticsController {
  /**
   * GET /api/v1/analytics/learner/:userId
   */
  async getLearnerAnalytics(req, res, next) {
    try {
      const { userId } = req.params;
      const role = req.headers['x-active-role'];
      const { force } = req.query;
      
      // Validation
      if (!userId) {
        throw new ValidationError('User ID is required', 'userId');
      }
      
      if (!role) {
        throw new ValidationError('X-Active-Role header is required', 'role');
      }
      
      // Authorization
      if (req.user.id !== userId) {
        throw new UnauthorizedError('Cannot access other user data');
      }
      
      // Execute use case
      const useCase = container.getCalculateLearnerAnalyticsUseCase();
      const analytics = await useCase.execute(userId, role, { force: force === 'true' });
      
      // Response
      res.json({
        success: true,
        data: analytics,
        metadata: {
          userId,
          role,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### 4.2 Backend: Routes

```javascript
// backend/src/presentation/routes/analytics.routes.js

import express from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { rbacMiddleware } from '../middleware/rbacMiddleware.js';

const router = express.Router();
const controller = new AnalyticsController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/v1/analytics/learner/:userId
router.get(
  '/learner/:userId',
  rbacMiddleware(['learner']),
  (req, res, next) => controller.getLearnerAnalytics(req, res, next)
);

// POST /api/v1/analytics/refresh/:userId
router.post(
  '/refresh/:userId',
  (req, res, next) => controller.refreshAnalytics(req, res, next)
);

export default router;
```

### 4.3 Frontend: Page Component

```javascript
// frontend/src/presentation/pages/LearnerDashboard.jsx

import { useAnalytics } from '../hooks/useAnalytics';
import { useRole } from '../../application/state/RoleContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LearningVelocityCard } from '../components/analytics/LearningVelocityCard';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { ErrorMessage } from '../components/shared/ErrorMessage';

/**
 * Learner Dashboard Page
 */
export function LearnerDashboard() {
  const { activeRole } = useRole();
  const { data, isLoading, error, refetch } = useAnalytics('learner');
  
  const handleRefresh = async () => {
    await refetch();
  };
  
  if (isLoading) {
    return <LoadingSkeleton type="dashboard" />;
  }
  
  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }
  
  if (!data) {
    return <EmptyState message="No analytics data available" />;
  }
  
  return (
    <DashboardLayout role={activeRole} onRefresh={handleRefresh}>
      <div className="analytics-grid">
        <LearningVelocityCard data={data.velocity} />
        {/* Other cards... */}
      </div>
    </DashboardLayout>
  );
}
```

### 4.4 Frontend: Component

```javascript
// frontend/src/presentation/components/analytics/LearningVelocityCard.jsx

import PropTypes from 'prop-types';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { LineChart } from '../shared/LineChart';

/**
 * Learning Velocity Card (AS-001.1)
 */
export function LearningVelocityCard({ data, onDrillDown }) {
  const { velocity, momentum, percentageChange } = data;
  
  const getMomentumColor = (momentum) => {
    if (momentum === 'Accelerating') return 'green';
    if (momentum === 'Slowing') return 'red';
    return 'gray';
  };
  
  return (
    <Card onClick={onDrillDown} className="cursor-pointer hover:shadow-lg">
      <Card.Header>
        <h3 className="text-lg font-semibold">Learning Velocity</h3>
        <Badge color={getMomentumColor(momentum)}>{momentum}</Badge>
      </Card.Header>
      
      <Card.Body>
        <div className="velocity-value text-4xl font-bold">{velocity}</div>
        <div className="velocity-change text-sm text-gray-600">
          {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
        </div>
        
        {data.history && (
          <LineChart
            data={data.history}
            xKey="date"
            yKey="value"
            color="#047857"
          />
        )}
      </Card.Body>
    </Card>
  );
}

LearningVelocityCard.propTypes = {
  data: PropTypes.shape({
    velocity: PropTypes.number.isRequired,
    momentum: PropTypes.oneOf(['Accelerating', 'Steady', 'Slowing']).isRequired,
    percentageChange: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  onDrillDown: PropTypes.func
};
```

---

## Summary

**Code Templates Provided**:
- ✅ Domain Layer: Entities, Value Objects, Domain Services (frontend + backend)
- ✅ Application Layer: Ports, Use Cases, DTOs, State Management (frontend + backend)
- ✅ Infrastructure Layer: Repositories, Service Adapters, Circuit Breaker, DI Container (frontend + backend)
- ✅ Presentation Layer: Controllers, Routes, Middleware, Pages, Components (frontend + backend)

**Next**: See `database_patterns.md`, `integration_patterns.md`, `performance_guidelines.md`, and `security_patterns.md` for specialized patterns.

