# Implementation Patterns - MS8 Learning Analytics

**Project**: MS8 - Learning Analytics Microservice  
**Phase**: 1C - Planning  
**Version**: 1.0.0  
**Date**: October 24, 2025  
**Purpose**: Coding standards, design patterns, architectural patterns, component interfaces

---

## 📋 Overview

This document defines implementation patterns to ensure consistency across the Full-Stack Onion Architecture with Vibe Engineering.

**Key Principles**:
- ✅ Same patterns for frontend and backend
- ✅ Dependency rule: dependencies point inward
- ✅ Port & Adapter pattern for all external integrations
- ✅ Simple DI (factory pattern, no heavy frameworks)
- ✅ TDD-first approach

---

## 1. Coding Standards

### 1.1 JavaScript/JSDoc Style Guide

**File Naming**:
- PascalCase for classes: `LearningVelocityCalculator.js`
- camelCase for functions/variables: `calculateVelocity.js`
- kebab-case for routes: `learner-analytics.js`
- Test files: `*.test.js` (same directory as source)

**Code Organization**:
```javascript
// 1. Imports (external first, then internal)
import express from 'express';
import { PrismaClient } from '@prisma/client';

import { LearningVelocityCalculator } from '../domain/services/LearningVelocityCalculator.js';
import { IAnalyticsRepository } from './ports/IAnalyticsRepository.js';

// 2. Constants
const VELOCITY_THRESHOLD = 20;

// 3. JSDoc types
/**
 * @typedef {Object} AnalyticsData
 * @property {string} userId
 * @property {string} role
 * @property {Object} data
 */

// 4. Class/function definition
export class AnalyticsService {
  // Implementation
}

// 5. Exports (already done with export keyword)
```

**JSDoc for Type Safety**:
```javascript
/**
 * Calculate learning velocity for a user
 * @param {Object} params - Parameters
 * @param {string} params.userId - User ID
 * @param {number} params.currentProgress - Current progress (0-100)
 * @param {number} params.previousProgress - Previous progress (0-100)
 * @param {number} params.timeWindowDays - Time window in days
 * @returns {Promise<{velocity: number, momentum: string, percentageChange: number}>}
 * @throws {ValidationError} If params are invalid
 */
async function calculateVelocity({ userId, currentProgress, previousProgress, timeWindowDays }) {
  // Implementation
}
```

**Error Handling**:
```javascript
// Custom error classes
export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

// Usage
if (!userId) {
  throw new ValidationError('User ID is required', 'userId');
}

if (!analytics) {
  throw new NotFoundError('Analytics', userId);
}
```

**Async/Await (No Callbacks)**:
```javascript
// ✅ Good
async function fetchAnalytics(userId) {
  try {
    const data = await analyticsRepository.findByUserId(userId);
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

// ❌ Bad (no callbacks)
function fetchAnalytics(userId, callback) {
  analyticsRepository.findByUserId(userId, (error, data) => {
    if (error) return callback(error);
    callback(null, data);
  });
}
```

### 1.2 ESLint Configuration

```javascript
// .eslintrc.js (frontend & backend)

module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // frontend only
    'plugin:react-hooks/recommended' // frontend only
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'never'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'max-len': ['warn', { code: 120 }],
    'complexity': ['warn', 10],
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }]
  }
};
```

### 1.3 Prettier Configuration

```javascript
// .prettierrc.js

module.exports = {
  semi: true,
  trailingComma: 'none',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'avoid',
  endOfLine: 'lf'
};
```

---

## 2. Design Patterns

### 2.1 Dependency Inversion Pattern (Ports & Adapters)

**Port (Interface)**:
```javascript
// backend/src/application/ports/IAnalyticsRepository.js

/**
 * Analytics repository port (interface)
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
   * Find stale analytics (> thresholdHours)
   * @param {number} thresholdHours
   * @returns {Promise<Analytics[]>}
   */
  async findStale(thresholdHours) {
    throw new Error('Not implemented');
  }
}
```

**Adapter (Implementation)**:
```javascript
// backend/src/infrastructure/adapters/AnalyticsRepositoryPrisma.js

import { IAnalyticsRepository } from '../../application/ports/IAnalyticsRepository.js';
import { Analytics } from '../../domain/entities/Analytics.js';

export class AnalyticsRepositoryPrisma extends IAnalyticsRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }
  
  async findByUserIdAndRole(userId, role) {
    const records = await this.prisma.analytics.findMany({
      where: { userId, role }
    });
    
    return records.map(r => new Analytics(
      r.id,
      r.userId,
      r.role,
      r.analyticsType,
      r.data,
      r.organizationId,
      r.createdAt,
      r.updatedAt
    ));
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
  
  async findStale(thresholdHours) {
    const thresholdDate = new Date(Date.now() - thresholdHours * 60 * 60 * 1000);
    
    const records = await this.prisma.analytics.findMany({
      where: {
        updatedAt: {
          lt: thresholdDate
        }
      }
    });
    
    return records.map(r => new Analytics(
      r.id,
      r.userId,
      r.role,
      r.analyticsType,
      r.data,
      r.organizationId,
      r.createdAt,
      r.updatedAt
    ));
  }
}
```

### 2.2 Repository Pattern

**Benefits**: Abstraction over data access, easier testing, swappable implementations

**Structure**:
```
application/ports/
  ├── IUserRepository.js
  ├── IAnalyticsRepository.js
  └── IAggregatedAnalyticsRepository.js

infrastructure/adapters/
  ├── UserRepositoryPrisma.js
  ├── AnalyticsRepositoryPrisma.js
  └── AggregatedAnalyticsRepositoryPrisma.js
```

### 2.3 Circuit Breaker Pattern

```javascript
// backend/src/infrastructure/services/CircuitBreakerService.js

export class CircuitBreakerService {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.cooldownPeriod = options.cooldownPeriod || 60000; // 60s
    this.requestTimeout = options.requestTimeout || 5000; // 5s
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }
  
  async execute(fn, fallbackFn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        console.warn('Circuit breaker OPEN, using fallback');
        return fallbackFn();
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await this._executeWithTimeout(fn);
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure();
      console.error('Circuit breaker caught error:', error.message);
      return fallbackFn();
    }
  }
  
  async _executeWithTimeout(fn) {
    return Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), this.requestTimeout)
      )
    ]);
  }
  
  _onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      console.log('Circuit breaker CLOSED');
    }
  }
  
  _onFailure() {
    this.failureCount += 1;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.cooldownPeriod;
      console.log('Circuit breaker OPEN');
    }
  }
}
```

**Usage**:
```javascript
// backend/src/infrastructure/adapters/DirectoryServiceAdapter.js

import { IDirectoryService } from '../../application/ports/IDirectoryService.js';
import { CircuitBreakerService } from '../services/CircuitBreakerService.js';
import { mockDirectoryData } from '../mocks/directoryMS.mock.js';

export class DirectoryServiceAdapter extends IDirectoryService {
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

### 2.4 Factory Pattern (Simple DI)

```javascript
// backend/src/infrastructure/di/container.js

import { PrismaClient } from '@prisma/client';
import axios from 'axios';

import { AnalyticsRepositoryPrisma } from '../adapters/AnalyticsRepositoryPrisma.js';
import { DirectoryServiceAdapter } from '../adapters/DirectoryServiceAdapter.js';
import { CalculateLearnerAnalyticsUseCase } from '../../application/use-cases/CalculateLearnerAnalyticsUseCase.js';

class Container {
  constructor() {
    this.instances = new Map();
  }
  
  // Singleton instances
  getPrisma() {
    if (!this.instances.has('prisma')) {
      this.instances.set('prisma', new PrismaClient());
    }
    return this.instances.get('prisma');
  }
  
  getHttpClient() {
    if (!this.instances.has('httpClient')) {
      this.instances.set('httpClient', axios.create({
        baseURL: process.env.DIRECTORY_MS_URL,
        timeout: 5000
      }));
    }
    return this.instances.get('httpClient');
  }
  
  // Repositories
  getAnalyticsRepository() {
    if (!this.instances.has('analyticsRepository')) {
      this.instances.set('analyticsRepository', new AnalyticsRepositoryPrisma(this.getPrisma()));
    }
    return this.instances.get('analyticsRepository');
  }
  
  // External services
  getDirectoryService() {
    if (!this.instances.has('directoryService')) {
      this.instances.set('directoryService', new DirectoryServiceAdapter(this.getHttpClient()));
    }
    return this.instances.get('directoryService');
  }
  
  // Use cases
  getCalculateLearnerAnalyticsUseCase() {
    return new CalculateLearnerAnalyticsUseCase(
      this.getAnalyticsRepository(),
      this.getDirectoryService()
      // ... other dependencies
    );
  }
}

export const container = new Container();
```

**Usage in Controllers**:
```javascript
// backend/src/presentation/controllers/AnalyticsController.js

import { container } from '../../infrastructure/di/container.js';

export class AnalyticsController {
  async getLearnerAnalytics(req, res, next) {
    try {
      const { userId } = req.params;
      const role = req.headers['x-active-role'];
      
      const useCase = container.getCalculateLearnerAnalyticsUseCase();
      const analytics = await useCase.execute(userId, role);
      
      res.json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }
}
```

### 2.5 Strategy Pattern (Analytics Calculation)

```javascript
// backend/src/domain/services/AnalyticsCalculatorStrategy.js

/**
 * Strategy interface for analytics calculation
 */
export class AnalyticsCalculatorStrategy {
  /**
   * Calculate analytics
   * @param {Object} data - Input data
   * @returns {Object} Calculated analytics
   */
  calculate(data) {
    throw new Error('Not implemented');
  }
}
```

```javascript
// backend/src/domain/services/LearningVelocityCalculator.js

import { AnalyticsCalculatorStrategy } from './AnalyticsCalculatorStrategy.js';

export class LearningVelocityCalculator extends AnalyticsCalculatorStrategy {
  static MOMENTUM_THRESHOLD = 20;
  
  calculate(data) {
    const { currentProgress, previousProgress, timeWindowDays } = data;
    
    const velocity = currentProgress - previousProgress;
    const percentageChange = previousProgress > 0 
      ? (velocity / previousProgress) * 100 
      : 0;
    
    let momentum = 'Steady';
    if (percentageChange > LearningVelocityCalculator.MOMENTUM_THRESHOLD) {
      momentum = 'Accelerating';
    } else if (percentageChange < -LearningVelocityCalculator.MOMENTUM_THRESHOLD) {
      momentum = 'Slowing';
    }
    
    return {
      velocity,
      momentum,
      percentageChange,
      timeWindowDays
    };
  }
}
```

**Context (Use Case) that uses strategies**:
```javascript
// backend/src/application/use-cases/CalculateLearnerAnalyticsUseCase.js

export class CalculateLearnerAnalyticsUseCase {
  constructor(analyticsRepository, directoryService, courseBuilderService, /* calculators */) {
    this.analyticsRepository = analyticsRepository;
    this.directoryService = directoryService;
    this.courseBuilderService = courseBuilderService;
    
    // Strategy pattern: inject different calculators
    this.velocityCalculator = new LearningVelocityCalculator();
    this.skillGapCalculator = new SkillGapAnalyzer();
    this.engagementScorer = new EngagementScorer();
    // ... other calculators
  }
  
  async execute(userId, role) {
    // 1. Collect data from external MS
    const user = await this.directoryService.getUser(userId);
    const progress = await this.courseBuilderService.getUserProgress(userId);
    
    // 2. Calculate analytics using strategies
    const velocity = this.velocityCalculator.calculate({
      currentProgress: progress.current,
      previousProgress: progress.previous,
      timeWindowDays: 30
    });
    
    const skillGap = this.skillGapCalculator.calculate({
      currentSkills: user.skills,
      targetSkills: user.targetSkills
    });
    
    // 3. Save to repository
    const analytics = new Analytics(
      null,
      userId,
      role,
      'learning_velocity',
      { velocity, skillGap },
      user.organizationId,
      null,
      new Date()
    );
    
    await this.analyticsRepository.save(analytics);
    
    return analytics;
  }
}
```

---

## 3. Architectural Patterns

### 3.1 Onion Architecture Layer Rules

**Layer Dependencies** (dependencies point inward):
```
Presentation → Application → Domain
    ↓              ↓
Infrastructure
```

**Domain Layer** (No dependencies):
- Pure business logic
- Entities, value objects, domain services
- No external libraries (except utilities like lodash)
- No I/O operations
- 100% testable without mocks

**Application Layer** (Depends on Domain only):
- Use cases (orchestration)
- Ports (interfaces)
- DTOs (data transfer objects)
- State management (frontend)
- No direct dependency on Infrastructure or Presentation

**Infrastructure Layer** (Depends on Application):
- Adapters (implementations of ports)
- Database access (Prisma)
- External service integration
- File system, network, etc.
- Mocks for testing

**Presentation Layer** (Depends on Application):
- UI components (React)
- API routes (Express)
- Controllers
- Middleware
- Entry points (main.jsx, server.js)

### 3.2 Frontend Onion Architecture

```
frontend/src/
├── domain/                      # 🔵 CORE (no dependencies)
│   ├── entities/
│   │   ├── Analytics.js         # Analytics entity
│   │   ├── User.js              # User entity
│   │   └── Gamification.js      # Gamification entity
│   ├── value-objects/
│   │   ├── Role.js              # Role value object
│   │   └── AnalyticsType.js     # Analytics type enum
│   └── services/
│       ├── ChartDataFormatter.js    # Pure formatting logic
│       ├── LearningVelocityCalculator.js  # Client-side validation
│       └── DateUtils.js         # Date utilities
│
├── application/                 # 🟢 USE CASES (depends on Domain)
│   ├── use-cases/
│   │   ├── GetLearnerAnalyticsUseCase.js
│   │   ├── RefreshAnalyticsUseCase.js
│   │   └── SwitchRoleUseCase.js
│   ├── ports/
│   │   ├── IAnalyticsService.js     # Port (interface)
│   │   ├── ICacheService.js         # Port (interface)
│   │   └── IAuthService.js          # Port (interface)
│   └── state/
│       ├── AuthContext.jsx          # Auth state
│       ├── RoleContext.jsx          # Role state
│       └── ThemeContext.jsx         # Theme state
│
├── infrastructure/              # 🟠 ADAPTERS (implements ports)
│   ├── adapters/
│   │   ├── AnalyticsServiceAdapter.js   # API client
│   │   ├── LocalStorageCacheAdapter.js  # Cache
│   │   └── AuthServiceAdapter.js        # Auth API
│   ├── api/
│   │   └── apiClient.js         # Axios instance
│   ├── mocks/
│   │   └── handlers.js          # MSW handlers
│   └── di/
│       └── container.js         # DI container
│
└── presentation/                # 🔴 UI (depends on Application)
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── LearnerDashboard.jsx
    │   ├── TrainerDashboard.jsx
    │   └── OrgAdminDashboard.jsx
    ├── components/
    │   ├── analytics/
    │   │   ├── LearningVelocityCard.jsx
    │   │   ├── SkillGapMatrixCard.jsx
    │   │   └── EngagementScoreCard.jsx
    │   ├── layout/
    │   │   ├── Header.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── Footer.jsx
    │   └── shared/
    │       ├── Button.jsx
    │       ├── Card.jsx
    │       └── LoadingSkeleton.jsx
    ├── hooks/
    │   ├── useAnalytics.js
    │   ├── useAuth.js
    │   └── useRole.js
    └── routes/
        └── AppRoutes.jsx
```

### 3.3 Backend Onion Architecture

```
backend/src/
├── domain/                      # 🔵 CORE (no dependencies)
│   ├── entities/
│   │   ├── Analytics.js
│   │   ├── User.js
│   │   └── Organization.js
│   ├── value-objects/
│   │   ├── Role.js
│   │   └── AnalyticsType.js
│   └── services/
│       ├── LearningVelocityCalculator.js
│       ├── SkillGapAnalyzer.js
│       ├── EngagementScorer.js
│       ├── DropOffPredictor.js
│       └── ComparisonCalculator.js
│
├── application/                 # 🟢 USE CASES (depends on Domain)
│   ├── use-cases/
│   │   ├── CalculateLearnerAnalyticsUseCase.js
│   │   ├── CalculateTrainerAnalyticsUseCase.js
│   │   ├── CollectDataFromMSUseCase.js
│   │   └── GenerateReportUseCase.js
│   ├── ports/
│   │   ├── IUserRepository.js
│   │   ├── IAnalyticsRepository.js
│   │   ├── IDirectoryService.js
│   │   ├── ICourseBuilderService.js
│   │   └── ... (9 microservice ports)
│   └── dtos/
│       ├── AnalyticsDTO.js
│       └── UserDTO.js
│
├── infrastructure/              # 🟠 ADAPTERS (implements ports)
│   ├── adapters/
│   │   ├── UserRepositoryPrisma.js
│   │   ├── AnalyticsRepositoryPrisma.js
│   │   ├── DirectoryServiceAdapter.js
│   │   ├── CourseBuilderServiceAdapter.js
│   │   └── ... (9 microservice adapters)
│   ├── mocks/
│   │   ├── directoryMS.mock.js
│   │   ├── courseBuilderMS.mock.js
│   │   └── ... (9 microservice mocks)
│   ├── services/
│   │   ├── CircuitBreakerService.js
│   │   ├── CacheService.js
│   │   └── JobQueueService.js
│   └── di/
│       └── container.js
│
└── presentation/                # 🔴 API (depends on Application)
    ├── controllers/
    │   ├── AuthController.js
    │   ├── AnalyticsController.js
    │   ├── ReportController.js
    │   └── GamificationController.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── analytics.routes.js
    │   ├── reports.routes.js
    │   └── index.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── rbacMiddleware.js
    │   ├── validationMiddleware.js
    │   ├── errorMiddleware.js
    │   └── rateLimitMiddleware.js
    └── server.js
```

---

## 4. Component Interfaces & Contracts

### 4.1 Frontend Component Patterns

**Container/Presentational Pattern**:
```javascript
// presentation/pages/LearnerDashboard.jsx (Container)

import { useAnalytics } from '../hooks/useAnalytics';
import { LearnerDashboardView } from '../components/LearnerDashboardView';

export function LearnerDashboard() {
  const { data, isLoading, error, refetch } = useAnalytics('learner');
  
  const handleRefresh = async () => {
    await refetch();
  };
  
  return (
    <LearnerDashboardView
      analytics={data}
      isLoading={isLoading}
      error={error}
      onRefresh={handleRefresh}
    />
  );
}
```

```javascript
// presentation/components/LearnerDashboardView.jsx (Presentational)

/**
 * @typedef {Object} LearnerDashboardViewProps
 * @property {Object} analytics - Analytics data
 * @property {boolean} isLoading - Loading state
 * @property {Error|null} error - Error state
 * @property {Function} onRefresh - Refresh handler
 */

/**
 * Learner Dashboard View (Presentational)
 * @param {LearnerDashboardViewProps} props
 */
export function LearnerDashboardView({ analytics, isLoading, error, onRefresh }) {
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!analytics) return <EmptyState />;
  
  return (
    <div className="dashboard">
      <DashboardHeader onRefresh={onRefresh} />
      <div className="analytics-grid">
        <LearningVelocityCard data={analytics.velocity} />
        <SkillGapMatrixCard data={analytics.skillGap} />
        <EngagementScoreCard data={analytics.engagement} />
        <MasteryProgressCard data={analytics.mastery} />
        <PerformanceAnalyticsCard data={analytics.performance} />
        <ContentEffectivenessCard data={analytics.contentEffectiveness} />
      </div>
    </div>
  );
}
```

**Component Props Interface**:
```javascript
// presentation/components/analytics/LearningVelocityCard.jsx

import PropTypes from 'prop-types';

/**
 * Learning Velocity Card (AS-001.1)
 * @param {Object} props
 * @param {Object} props.data - Velocity data
 * @param {number} props.data.velocity - Velocity value
 * @param {string} props.data.momentum - Momentum (Accelerating/Steady/Slowing)
 * @param {number} props.data.percentageChange - Percentage change
 */
export function LearningVelocityCard({ data, onDrillDown }) {
  const { velocity, momentum, percentageChange } = data;
  
  return (
    <Card onClick={onDrillDown}>
      <CardHeader>
        <h3>Learning Velocity</h3>
        <Badge color={getMomentumColor(momentum)}>{momentum}</Badge>
      </CardHeader>
      <CardBody>
        <div className="velocity-value">{velocity}</div>
        <div className="velocity-change">{percentageChange}%</div>
        <LineChart data={data.history} />
      </CardBody>
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

### 4.2 Backend API Contracts

**Controller Pattern**:
```javascript
// presentation/controllers/AnalyticsController.js

import { container } from '../../infrastructure/di/container.js';

export class AnalyticsController {
  /**
   * GET /api/v1/analytics/learner/:userId
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getLearnerAnalytics(req, res, next) {
    try {
      const { userId } = req.params;
      const role = req.headers['x-active-role'];
      const { force } = req.query; // force=true to bypass cache
      
      // Validation
      if (!userId) {
        throw new ValidationError('User ID is required', 'userId');
      }
      
      if (!role) {
        throw new ValidationError('X-Active-Role header is required', 'role');
      }
      
      // Authorization check (already done in middleware, but double-check)
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
  
  /**
   * POST /api/v1/analytics/refresh/:userId
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async refreshAnalytics(req, res, next) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      // Rate limiting already done in middleware
      
      const useCase = container.getRefreshAnalyticsUseCase();
      const job = await useCase.execute(userId, role);
      
      res.json({
        success: true,
        data: {
          jobId: job.id,
          status: 'queued',
          message: 'Analytics refresh queued'
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
```

**API Response Format**:
```javascript
// Success Response
{
  "success": true,
  "data": { /* actual data */ },
  "metadata": {
    "timestamp": "2025-10-24T10:00:00Z",
    "userId": "user-uuid",
    "role": "learner"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "User ID is required",
    "field": "userId",
    "statusCode": 400
  }
}
```

---

## 5. State Management Patterns (Frontend)

### 5.1 Context API Pattern

```javascript
// application/state/RoleContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';
import { Role } from '../../domain/value-objects/Role';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('activeRole') || Role.LEARNER;
  });
  
  const [availableRoles, setAvailableRoles] = useState([]);
  
  useEffect(() => {
    localStorage.setItem('activeRole', activeRole);
  }, [activeRole]);
  
  const switchRole = (newRole) => {
    if (!Role.isValid(newRole)) {
      throw new Error(`Invalid role: ${newRole}`);
    }
    
    if (!availableRoles.includes(newRole)) {
      throw new Error(`Role ${newRole} not available for this user`);
    }
    
    setActiveRole(newRole);
  };
  
  const setRoles = (roles) => {
    setAvailableRoles(roles);
    
    // If current role not in new roles, switch to first available
    if (!roles.includes(activeRole)) {
      setActiveRole(roles[0] || Role.LEARNER);
    }
  };
  
  const value = {
    activeRole,
    availableRoles,
    switchRole,
    setRoles,
    canAccessRole: (role) => availableRoles.includes(role)
  };
  
  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};
```

### 5.2 SWR Pattern (Data Fetching)

```javascript
// presentation/hooks/useAnalytics.js

import useSWR from 'swr';
import { useRole } from '../../application/state/RoleContext';
import { container } from '../../infrastructure/di/container';

/**
 * Hook to fetch analytics data
 * @param {string} analyticsType - Type of analytics (learner, trainer, org)
 * @returns {Object} { data, error, isLoading, refetch }
 */
export function useAnalytics(analyticsType) {
  const { activeRole } = useRole();
  const analyticsService = container.getAnalyticsService();
  
  const cacheKey = `analytics:${analyticsType}:${activeRole}`;
  
  const fetcher = async () => {
    const useCase = container.getGetLearnerAnalyticsUseCase();
    return useCase.execute(userId, activeRole);
  };
  
  const { data, error, mutate } = useSWR(cacheKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // 10s deduplication
    shouldRetryOnError: false
  });
  
  return {
    data,
    error,
    isLoading: !data && !error,
    refetch: () => mutate()
  };
}
```

---

## Summary

**Implementation Patterns Highlights**:
- ✅ Coding standards (ESLint, Prettier, JSDoc)
- ✅ Design patterns (Ports & Adapters, Repository, Circuit Breaker, Factory, Strategy)
- ✅ Onion Architecture (Domain → Application → Infrastructure → Presentation)
- ✅ Component interfaces & contracts (frontend + backend)
- ✅ State management (Context API + SWR)
- ✅ Vibe Engineering (same patterns frontend + backend)

**Next**: See `code_templates.md` for concrete code templates for all 4 layers.

