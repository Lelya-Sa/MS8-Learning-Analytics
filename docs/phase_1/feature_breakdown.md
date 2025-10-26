# Feature Breakdown: 215 Implementation Units

**Project**: MS8 - Learning Analytics Microservice  
**Phase**: 1C - Planning  
**Version**: 1.0.0  
**Date**: October 24, 2025  
**Purpose**: Break down all 19 analytics + features into implementable units (30-60min each)

---

## 📋 Overview

This document breaks down the entire MVP into **215 implementable units**, each designed to be completed in **30-60 minutes** following TDD methodology (RED-GREEN-REFACTOR).

**Total Estimated Time**: 107-215 hours (13-27 developer days)

**Implementation Order**: Bottom-up (Infrastructure → Domain → Application → Infrastructure → Presentation)

---

## 1. Infrastructure Setup (20 units, ~10-20 hours)

### Frontend Infrastructure (10 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-INF-001 | Vite + React Setup | Initialize Vite project with React 18+ | 30min | None |
| F-INF-002 | Tailwind CSS Setup | Configure Tailwind with Dark Emerald theme | 30min | F-INF-001 |
| F-INF-003 | Jest + RTL Configuration | Setup Jest with React Testing Library | 60min | F-INF-001 |
| F-INF-004 | MSW Setup | Setup Mock Service Worker for API mocking | 45min | F-INF-001 |
| F-INF-005 | SWR Configuration | Configure SWR for data fetching | 30min | F-INF-001 |
| F-INF-006 | React Router Setup | Setup React Router DOM with role-based routes | 45min | F-INF-001 |
| F-INF-007 | Context Providers | Create Auth, Role, Theme context providers | 60min | F-INF-001 |
| F-INF-008 | Folder Structure | Create 4-layer Onion folder structure | 15min | F-INF-001 |
| F-INF-009 | ESLint + Prettier | Configure linting and formatting | 30min | F-INF-001 |
| F-INF-010 | Environment Variables | Setup .env with VITE_API_URL, etc. | 15min | F-INF-001 |

### Backend Infrastructure (10 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-INF-001 | Express.js Setup | Initialize Express with Node.js 18+ | 30min | None |
| B-INF-002 | Prisma Setup | Configure Prisma with PostgreSQL | 45min | B-INF-001 |
| B-INF-003 | Jest + Supertest Config | Setup testing framework for backend | 60min | B-INF-001 |
| B-INF-004 | pg-boss Setup | Configure pg-boss job queue | 45min | B-INF-002 |
| B-INF-005 | JWT Middleware | Create JWT validation middleware | 60min | B-INF-001 |
| B-INF-006 | RBAC Middleware | Create role-based access control middleware | 60min | B-INF-005 |
| B-INF-007 | Error Handling | Global error handling middleware | 45min | B-INF-001 |
| B-INF-008 | Logging (Winston) | Setup structured logging with correlation IDs | 45min | B-INF-001 |
| B-INF-009 | Folder Structure | Create 4-layer Onion folder structure | 15min | B-INF-001 |
| B-INF-010 | Health Check Endpoints | Create /health, /ready, /live endpoints | 30min | B-INF-001 |

---

## 2. Domain Layer (25 units, ~12-25 hours)

### Frontend Domain (12 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-DOM-001 | Analytics Entity | Create Analytics entity with isStale(), getAgeLabel() | 45min | F-INF-008 |
| F-DOM-002 | Role Value Object | Create Role with validation and display names | 30min | F-INF-008 |
| F-DOM-003 | User Entity | Create User entity with roles management | 45min | F-INF-008 |
| F-DOM-004 | Chart Data Formatter | Create ChartDataFormatter service (pure logic) | 60min | F-DOM-001 |
| F-DOM-005 | Velocity Calculator | Create LearningVelocityCalculator (client-side) | 45min | F-DOM-001 |
| F-DOM-006 | Engagement Scorer | Create EngagementScorer (client-side validation) | 45min | F-DOM-001 |
| F-DOM-007 | Skill Gap Analyzer | Create SkillGapAnalyzer (priority scoring) | 60min | F-DOM-001 |
| F-DOM-008 | Date Utilities | Create DateUtils for age calculations, formatting | 30min | F-INF-008 |
| F-DOM-009 | Analytics Validator | Create AnalyticsValidator (data validation) | 45min | F-DOM-001 |
| F-DOM-010 | Report Entity | Create Report entity with format validation | 45min | F-INF-008 |
| F-DOM-011 | Gamification Entity | Create Gamification entity (badges, streaks, points) | 60min | F-INF-008 |
| F-DOM-012 | Comparison Entity | Create Comparison entity with K-anonymity check | 60min | F-INF-008 |

### Backend Domain (13 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-DOM-001 | Analytics Entity | Create Analytics entity with business rules | 45min | B-INF-009 |
| B-DOM-002 | User Entity | Create User entity with role management | 45min | B-INF-009 |
| B-DOM-003 | Organization Entity | Create Organization entity | 30min | B-INF-009 |
| B-DOM-004 | Velocity Calculator | Create LearningVelocityCalculator service | 60min | B-DOM-001 |
| B-DOM-005 | Skill Gap Analyzer | Create SkillGapAnalyzer service | 60min | B-DOM-001 |
| B-DOM-006 | Engagement Scorer | Create EngagementScorer service | 60min | B-DOM-001 |
| B-DOM-007 | Mastery Tracker | Create MasteryTracker service | 60min | B-DOM-001 |
| B-DOM-008 | Drop-Off Predictor | Create DropOffPredictor service (rule-based) | 60min | B-DOM-001 |
| B-DOM-009 | Comparison Calculator | Create ComparisonCalculator with K-anonymity | 60min | B-DOM-001 |
| B-DOM-010 | Gamification Scorer | Create GamificationScorer service | 60min | B-DOM-001 |
| B-DOM-011 | Strategic Aligner | Create StrategicAlignmentAnalyzer service | 60min | B-DOM-001 |
| B-DOM-012 | Course Health Analyzer | Create CourseHealthAnalyzer service | 60min | B-DOM-001 |
| B-DOM-013 | Aggregation Service | Create AggregationService (org-wide analytics) | 60min | B-DOM-001 |

---

## 3. Application Layer (35 units, ~18-35 hours)

### Frontend Application (15 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-APP-001 | Port: IAnalyticsService | Define IAnalyticsService interface | 30min | F-DOM-001 |
| F-APP-002 | Port: ICacheService | Define ICacheService interface | 30min | F-INF-008 |
| F-APP-003 | Port: IAuthService | Define IAuthService interface | 30min | F-DOM-003 |
| F-APP-004 | Use Case: GetLearnerAnalytics | Create GetLearnerAnalyticsUseCase | 60min | F-APP-001 |
| F-APP-005 | Use Case: GetTrainerAnalytics | Create GetTrainerAnalyticsUseCase | 60min | F-APP-001 |
| F-APP-006 | Use Case: GetOrgAnalytics | Create GetOrgAdminAnalyticsUseCase | 60min | F-APP-001 |
| F-APP-007 | Use Case: RefreshAnalytics | Create RefreshAnalyticsUseCase | 45min | F-APP-001 |
| F-APP-008 | Use Case: ExportReport | Create ExportReportUseCase | 45min | F-APP-001 |
| F-APP-009 | Use Case: SwitchRole | Create SwitchRoleUseCase | 45min | F-APP-003 |
| F-APP-010 | Use Case: Login | Create LoginUseCase | 60min | F-APP-003 |
| F-APP-011 | Use Case: GetComparison | Create GetComparisonUseCase | 60min | F-APP-001 |
| F-APP-012 | Use Case: GetGamification | Create GetGamificationUseCase | 45min | F-APP-001 |
| F-APP-013 | RoleContext Provider | Implement RoleContext with useRole hook | 45min | F-APP-009 |
| F-APP-014 | AuthContext Provider | Implement AuthContext with useAuth hook | 60min | F-APP-010 |
| F-APP-015 | ThemeContext Provider | Implement ThemeContext with useTheme hook | 45min | F-INF-008 |

### Backend Application (20 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-APP-001 | Port: IUserRepository | Define IUserRepository interface | 30min | B-DOM-002 |
| B-APP-002 | Port: IAnalyticsRepository | Define IAnalyticsRepository interface | 30min | B-DOM-001 |
| B-APP-003 | Port: IDirectoryService | Define IDirectoryService interface (MS integration) | 30min | B-INF-009 |
| B-APP-004 | Port: ICourseBuilderService | Define ICourseBuilderService interface | 30min | B-INF-009 |
| B-APP-005 | Port: ISkillsEngineService | Define ISkillsEngineService interface | 30min | B-INF-009 |
| B-APP-006 | Port: IAssessmentService | Define IAssessmentService interface | 30min | B-INF-009 |
| B-APP-007 | Port: IContentStudioService | Define IContentStudioService interface | 30min | B-INF-009 |
| B-APP-008 | Port: ILearnerAIService | Define ILearnerAIService interface | 30min | B-INF-009 |
| B-APP-009 | Port: IDevLabService | Define IDevLabService interface | 30min | B-INF-009 |
| B-APP-010 | Port: IRAGService | Define IRAGService interface (MS9) | 30min | B-INF-009 |
| B-APP-011 | Use Case: CalculateLearnerAnalytics | Orchestrate learner analytics calculation | 60min | B-APP-002, All domain services |
| B-APP-012 | Use Case: CalculateTrainerAnalytics | Orchestrate trainer analytics calculation | 60min | B-APP-002, B-DOM-012 |
| B-APP-013 | Use Case: CalculateOrgAnalytics | Orchestrate org analytics calculation | 60min | B-APP-002, B-DOM-013 |
| B-APP-014 | Use Case: CollectDataFromMS | Orchestrate data collection from 9 microservices | 60min | B-APP-003 to B-APP-010 |
| B-APP-015 | Use Case: GenerateReport | Generate report in 4 formats (PDF/CSV/Excel/JSON) | 60min | B-APP-002 |
| B-APP-016 | Use Case: RefreshAnalytics | Trigger async analytics refresh | 45min | B-APP-011 |
| B-APP-017 | Use Case: GetComparison | Calculate peer comparison with K-anonymity | 60min | B-APP-002, B-DOM-009 |
| B-APP-018 | Use Case: GetGamification | Calculate gamification scores | 45min | B-APP-002, B-DOM-010 |
| B-APP-019 | DTO: AnalyticsDTO | Define analytics data transfer objects | 30min | B-DOM-001 |
| B-APP-020 | DTO: UserDTO | Define user data transfer objects | 30min | B-DOM-002 |

---

## 4. Infrastructure Layer (40 units, ~20-40 hours)

### Frontend Infrastructure (15 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-INF-011 | AnalyticsServiceAdapter | Implement IAnalyticsService with axios | 60min | F-APP-001 |
| F-INF-012 | AuthServiceAdapter | Implement IAuthService with axios | 60min | F-APP-003 |
| F-INF-013 | LocalStorageCacheAdapter | Implement ICacheService with localStorage | 45min | F-APP-002 |
| F-INF-014 | API Client (axios) | Configure axios with interceptors, auth | 60min | F-INF-001 |
| F-INF-015 | MSW Handlers: Auth | Mock /api/v1/auth/* endpoints | 45min | F-INF-004 |
| F-INF-016 | MSW Handlers: Analytics | Mock /api/v1/analytics/* endpoints | 60min | F-INF-004 |
| F-INF-017 | MSW Handlers: Reports | Mock /api/v1/reports/* endpoints | 45min | F-INF-004 |
| F-INF-018 | MSW Handlers: Comparison | Mock /api/v1/comparison/* endpoints | 45min | F-INF-004 |
| F-INF-019 | MSW Handlers: Gamification | Mock /api/v1/gamification/* endpoints | 45min | F-INF-004 |
| F-INF-020 | Mock Data: Learner Analytics | Create mock learner analytics data | 45min | F-INF-016 |
| F-INF-021 | Mock Data: Trainer Analytics | Create mock trainer analytics data | 45min | F-INF-016 |
| F-INF-022 | Mock Data: Org Analytics | Create mock org analytics data | 45min | F-INF-016 |
| F-INF-023 | Error Boundary | Create global error boundary component | 45min | F-INF-001 |
| F-INF-024 | Toast Notifications | Setup toast notification system | 30min | F-INF-001 |
| F-INF-025 | DI Container | Create simple DI container (factory pattern) | 60min | All ports |

### Backend Infrastructure (25 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-INF-011 | UserRepository (Prisma) | Implement IUserRepository with Prisma | 60min | B-APP-001 |
| B-INF-012 | AnalyticsRepository (Prisma) | Implement IAnalyticsRepository with Prisma | 60min | B-APP-002 |
| B-INF-013 | DirectoryServiceAdapter | Implement IDirectoryService with circuit breaker | 60min | B-APP-003 |
| B-INF-014 | CourseBuilderServiceAdapter | Implement ICourseBuilderService with circuit breaker | 60min | B-APP-004 |
| B-INF-015 | SkillsEngineServiceAdapter | Implement ISkillsEngineService with circuit breaker | 60min | B-APP-005 |
| B-INF-016 | AssessmentServiceAdapter | Implement IAssessmentService with circuit breaker | 60min | B-APP-006 |
| B-INF-017 | ContentStudioServiceAdapter | Implement IContentStudioService with circuit breaker | 60min | B-APP-007 |
| B-INF-018 | LearnerAIServiceAdapter | Implement ILearnerAIService with circuit breaker | 60min | B-APP-008 |
| B-INF-019 | DevLabServiceAdapter | Implement IDevLabService with circuit breaker | 60min | B-APP-009 |
| B-INF-020 | RAGServiceAdapter | Implement IRAGService with circuit breaker | 60min | B-APP-010 |
| B-INF-021 | Mock: DirectoryService | Create mock adapter for Directory MS | 45min | B-APP-003 |
| B-INF-022 | Mock: CourseBuilderService | Create mock adapter for Course Builder MS | 45min | B-APP-004 |
| B-INF-023 | Mock: SkillsEngineService | Create mock adapter for Skills Engine MS | 45min | B-APP-005 |
| B-INF-024 | Mock: AssessmentService | Create mock adapter for Assessment MS | 45min | B-APP-006 |
| B-INF-025 | Mock: ContentStudioService | Create mock adapter for Content Studio MS | 45min | B-APP-007 |
| B-INF-026 | Mock: LearnerAIService | Create mock adapter for Learner AI MS | 45min | B-APP-008 |
| B-INF-027 | Mock: DevLabService | Create mock adapter for DevLab MS | 45min | B-APP-009 |
| B-INF-028 | Mock: RAGService | Create mock adapter for RAG MS (MS9) | 45min | B-APP-010 |
| B-INF-029 | Circuit Breaker Service | Create CircuitBreakerService with retry logic | 60min | B-INF-009 |
| B-INF-030 | Cache Service | Create in-memory cache with TTL | 60min | B-INF-009 |
| B-INF-031 | Job Queue: DailyBatch | Create daily batch job (02:00 UTC) | 60min | B-INF-004 |
| B-INF-032 | Job Queue: FreshDataJob | Create on-demand refresh job | 45min | B-INF-004 |
| B-INF-033 | Job Queue: JobStatusTracker | Track job status and progress | 45min | B-INF-004 |
| B-INF-034 | Rate Limiter Middleware | Rate limit refresh endpoint (5/10min) | 45min | B-INF-001 |
| B-INF-035 | DI Container | Create simple DI container (factory pattern) | 60min | All ports |

---

## 5. Presentation Layer (45 units, ~23-45 hours)

### Frontend Presentation (30 units)

#### Layout & Navigation (5 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-PRE-001 | DashboardLayout | Create main dashboard layout component | 60min | F-INF-006 |
| F-PRE-002 | Header Component | Header with logo, role switcher, user menu | 60min | F-APP-013 |
| F-PRE-003 | Sidebar Component | Sidebar with navigation links per role | 60min | F-APP-013 |
| F-PRE-004 | Footer Component | Footer with links and copyright | 30min | F-INF-001 |
| F-PRE-005 | RoleSwitcher Component | Dropdown to switch active role | 45min | F-APP-009 |

#### Authentication Pages (3 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-PRE-006 | LoginPage | Login form with JWT handling | 60min | F-APP-010 |
| F-PRE-007 | ProtectedRoute | Route guard for authenticated users | 45min | F-APP-014 |
| F-PRE-008 | RoleBasedRoute | Route guard with role validation | 45min | F-APP-013 |

#### Learner Dashboard (7 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-PRE-009 | LearnerDashboard Container | Main learner dashboard page | 60min | F-APP-004 |
| F-PRE-010 | LearningVelocityCard | AS-001.1 display card with chart | 60min | F-PRE-009 |
| F-PRE-011 | SkillGapMatrixCard | AS-001.2 heatmap display | 60min | F-PRE-009 |
| F-PRE-012 | EngagementScoreCard | AS-001.3 gauge chart | 60min | F-PRE-009 |
| F-PRE-013 | MasteryProgressCard | AS-001.4 progress bars | 60min | F-PRE-009 |
| F-PRE-014 | PerformanceAnalyticsCard | AS-001.5 performance trends | 60min | F-PRE-009 |
| F-PRE-015 | ContentEffectivenessCard | AS-001.6 content comparison | 60min | F-PRE-009 |

#### Trainer Dashboard (5 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-PRE-016 | TrainerDashboard Container | Main trainer dashboard page | 60min | F-APP-005 |
| F-PRE-017 | CoursePerformanceCard | AS-002.7 course KPIs | 60min | F-PRE-016 |
| F-PRE-018 | CourseHealthCard | AS-002.8 health indicators | 60min | F-PRE-016 |
| F-PRE-019 | StudentDistributionCard | AS-002.9 distribution charts | 60min | F-PRE-016 |
| F-PRE-020 | TeachingEffectivenessCard | AS-002.10 effectiveness radar | 60min | F-PRE-016 |

#### Org Admin Dashboard (5 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-PRE-021 | OrgAdminDashboard Container | Main org admin dashboard page | 60min | F-APP-006 |
| F-PRE-022 | OrgVelocityCard | AS-003.11 org-wide velocity | 60min | F-PRE-021 |
| F-PRE-023 | StrategicAlignmentCard | AS-003.12 alignment matrix | 60min | F-PRE-021 |
| F-PRE-024 | WorkerAnalyticsList | AS-003.13 individual workers | 60min | F-PRE-021 |
| F-PRE-025 | LearningCultureCard | AS-003.14 culture metrics | 60min | F-PRE-021 |

#### Shared Components (5 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-PRE-026 | ComparisonDashboard | AS-005.19 peer comparison | 60min | F-APP-011 |
| F-PRE-027 | GamificationWidget | Display badges, streaks, points | 60min | F-APP-012 |
| F-PRE-028 | ReportExportModal | Modal to export reports (4 formats) | 60min | F-APP-008 |
| F-PRE-029 | RAGChatbotWidget | Chatbot widget (mock data) | 60min | F-INF-011 |
| F-PRE-030 | LoadingSkeletons | Skeleton loaders for all cards | 45min | F-INF-001 |

### Backend Presentation (15 units)

#### Authentication Routes (2 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-PRE-001 | AuthController | POST /api/v1/auth/login, /logout | 60min | B-APP-020 |
| B-PRE-002 | AuthRoutes | Define auth route handlers | 30min | B-PRE-001 |

#### Analytics Routes (5 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-PRE-003 | LearnerAnalyticsController | GET /api/v1/analytics/learner/:userId | 60min | B-APP-011 |
| B-PRE-004 | TrainerAnalyticsController | GET /api/v1/analytics/trainer/:userId | 60min | B-APP-012 |
| B-PRE-005 | OrgAnalyticsController | GET /api/v1/analytics/org/:orgId | 60min | B-APP-013 |
| B-PRE-006 | ComparisonController | GET /api/v1/analytics/comparison/:userId | 60min | B-APP-017 |
| B-PRE-007 | AnalyticsRoutes | Define all analytics routes | 30min | B-PRE-003 to B-PRE-006 |

#### Data Collection Routes (3 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-PRE-008 | DataCollectionController | POST /api/v1/data-collection/trigger | 60min | B-APP-014 |
| B-PRE-009 | RefreshController | POST /api/v1/analytics/refresh/:userId | 60min | B-APP-016 |
| B-PRE-010 | DataCollectionRoutes | Define data collection routes | 30min | B-PRE-008, B-PRE-009 |

#### Report Routes (2 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-PRE-011 | ReportController | POST /api/v1/reports/generate | 60min | B-APP-015 |
| B-PRE-012 | ReportRoutes | Define report routes | 30min | B-PRE-011 |

#### Gamification Routes (2 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-PRE-013 | GamificationController | GET /api/v1/gamification/:userId | 60min | B-APP-018 |
| B-PRE-014 | GamificationRoutes | Define gamification routes | 30min | B-PRE-013 |

#### BFF Routes (1 unit)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-PRE-015 | BFFController | Aggregation endpoints (if needed) | 60min | All controllers |

---

## 6. Database Implementation (15 units, ~8-15 hours)

### Prisma Schema & Migrations (8 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| DB-001 | Prisma Schema: Users | Define users model | 30min | B-INF-002 |
| DB-002 | Prisma Schema: Organizations | Define organizations model | 30min | B-INF-002 |
| DB-003 | Prisma Schema: Analytics | Define analytics model (user_id, role, analytics_type) | 45min | B-INF-002 |
| DB-004 | Prisma Schema: AggregatedAnalytics | Define aggregated_analytics model (7-year retention) | 45min | B-INF-002 |
| DB-005 | Prisma Schema: Reports | Define reports model | 30min | B-INF-002 |
| DB-006 | Prisma Schema: Gamification | Define gamification model | 30min | B-INF-002 |
| DB-007 | Initial Migration | Generate initial Prisma migration | 30min | DB-001 to DB-006 |
| DB-008 | Seed Data | Create seed data for development | 60min | DB-007 |

### SQL Advanced Features (7 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| DB-009 | RLS Policy: Analytics | Row-level security on analytics table | 45min | DB-007 |
| DB-010 | RLS Policy: AggregatedAnalytics | Row-level security on aggregated_analytics | 45min | DB-007 |
| DB-011 | Materialized View: ComparisonAggregates | MV for peer comparison queries | 60min | DB-007 |
| DB-012 | Table Partitioning: AggregatedAnalytics | Partition by year (7-year retention) | 60min | DB-007 |
| DB-013 | Indexes: AnalyticsQueries | Create indexes for common queries | 45min | DB-007 |
| DB-014 | pg-boss Schema | Setup pg-boss job queue tables | 30min | B-INF-004 |
| DB-015 | Database Migration Tests | Test migrations and rollbacks | 60min | DB-007 to DB-014 |

---

## 7. Testing (35 units, ~18-35 hours)

### Frontend Tests (15 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| F-TST-001 | Domain: Analytics Entity Tests | Unit tests for Analytics entity | 45min | F-DOM-001 |
| F-TST-002 | Domain: ChartDataFormatter Tests | Unit tests for formatter | 45min | F-DOM-004 |
| F-TST-003 | Application: GetLearnerAnalytics Tests | Unit tests for use case | 60min | F-APP-004 |
| F-TST-004 | Application: SwitchRole Tests | Unit tests for role switching | 45min | F-APP-009 |
| F-TST-005 | Infrastructure: AnalyticsServiceAdapter Tests | Unit tests with MSW | 60min | F-INF-011 |
| F-TST-006 | Infrastructure: LocalStorageCache Tests | Unit tests for cache | 45min | F-INF-013 |
| F-TST-007 | Presentation: LearnerDashboard Tests | Integration tests for dashboard | 60min | F-PRE-009 |
| F-TST-008 | Presentation: Header Tests | Unit tests for header component | 45min | F-PRE-002 |
| F-TST-009 | Presentation: RoleSwitcher Tests | Unit tests for role switcher | 45min | F-PRE-005 |
| F-TST-010 | Presentation: LoginPage Tests | Integration tests for login | 60min | F-PRE-006 |
| F-TST-011 | Presentation: AnalyticsCards Tests | Tests for all 6 learner cards | 60min | F-PRE-010 to F-PRE-015 |
| F-TST-012 | E2E: Learner Journey | Playwright test for learner workflow | 60min | All F-PRE |
| F-TST-013 | E2E: Trainer Journey | Playwright test for trainer workflow | 60min | All F-PRE |
| F-TST-014 | E2E: Role Switching | Playwright test for role switching | 45min | All F-PRE |
| F-TST-015 | Accessibility Tests | aXe tests for WCAG 2.2 AA | 60min | All F-PRE |

### Backend Tests (20 units)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| B-TST-001 | Domain: VelocityCalculator Tests | Unit tests for velocity calc | 60min | B-DOM-004 |
| B-TST-002 | Domain: SkillGapAnalyzer Tests | Unit tests for skill gap | 60min | B-DOM-005 |
| B-TST-003 | Domain: EngagementScorer Tests | Unit tests for engagement | 60min | B-DOM-006 |
| B-TST-004 | Domain: DropOffPredictor Tests | Unit tests for drop-off | 60min | B-DOM-008 |
| B-TST-005 | Application: CalculateLearnerAnalytics Tests | Unit tests for use case | 60min | B-APP-011 |
| B-TST-006 | Application: CollectDataFromMS Tests | Unit tests with mocks | 60min | B-APP-014 |
| B-TST-007 | Infrastructure: DirectoryServiceAdapter Tests | Unit tests with mock | 60min | B-INF-013 |
| B-TST-008 | Infrastructure: CircuitBreaker Tests | Unit tests for circuit breaker | 60min | B-INF-029 |
| B-TST-009 | Infrastructure: CacheService Tests | Unit tests for cache | 45min | B-INF-030 |
| B-TST-010 | Infrastructure: AnalyticsRepository Tests | Integration tests with DB | 60min | B-INF-012 |
| B-TST-011 | Presentation: AuthController Tests | API tests with Supertest | 60min | B-PRE-001 |
| B-TST-012 | Presentation: LearnerAnalyticsController Tests | API tests with Supertest | 60min | B-PRE-003 |
| B-TST-013 | Presentation: RefreshController Tests | API tests with rate limit | 60min | B-PRE-009 |
| B-TST-014 | Presentation: ReportController Tests | API tests for 4 formats | 60min | B-PRE-011 |
| B-TST-015 | Middleware: JWT Validation Tests | Unit tests for JWT middleware | 45min | B-INF-005 |
| B-TST-016 | Middleware: RBAC Tests | Unit tests for RBAC middleware | 45min | B-INF-006 |
| B-TST-017 | Job Queue: DailyBatch Tests | Unit tests for batch job | 60min | B-INF-031 |
| B-TST-018 | Integration: Full Analytics Flow Tests | End-to-end API tests | 60min | All B-PRE |
| B-TST-019 | Database: RLS Policy Tests | Test RLS enforcement | 60min | DB-009, DB-010 |
| B-TST-020 | Security: Penetration Tests | Basic security tests | 60min | All B-PRE |

---

## 8. Deployment & Documentation (10 units, ~5-10 hours)

| ID | Unit | Description | Time | Dependencies |
|----|------|-------------|------|--------------|
| DEP-001 | GitHub Actions: Test Workflow | CI workflow for tests on PR | 45min | All tests |
| DEP-002 | GitHub Actions: Deploy Frontend | Deploy to Vercel on merge | 45min | F-INF-001 |
| DEP-003 | GitHub Actions: Deploy Backend | Deploy to Railway on merge | 45min | B-INF-001 |
| DEP-004 | GitHub Actions: Run Migrations | Migrate DB before deploy | 45min | DB-007 |
| DEP-005 | Environment Secrets Setup | Configure all secrets (GitHub, Vercel, Railway) | 60min | None |
| DEP-006 | README.md | Comprehensive README with setup | 60min | All |
| DEP-007 | API Documentation | Document all 50+ API endpoints | 60min | All B-PRE |
| DEP-008 | Developer Guide | Local setup and development guide | 60min | All |
| DEP-009 | Deployment Guide | Production deployment guide | 45min | DEP-001 to DEP-005 |
| DEP-010 | User Guide | End-user documentation | 60min | All F-PRE |

---

## Summary Statistics

### Total Units: 215

**By Layer**:
- Infrastructure: 20 units (9%)
- Domain: 25 units (12%)
- Application: 35 units (16%)
- Infrastructure: 40 units (19%)
- Presentation: 45 units (21%)
- Database: 15 units (7%)
- Testing: 35 units (16%)
- Deployment: 10 units (5%)

**By Stack**:
- Frontend: 87 units (40%)
- Backend: 103 units (48%)
- Database: 15 units (7%)
- Deployment: 10 units (5%)

**Time Estimates**:
- Minimum: 107 hours (13.4 days @ 8h/day)
- Maximum: 215 hours (26.9 days @ 8h/day)
- Average: 161 hours (20.1 days @ 8h/day)

**For 2 developers (frontend + backend in parallel)**:
- Minimum: 6.7 days
- Maximum: 13.5 days
- Average: 10.1 days
- **Plus buffer (20%)**: 12 days

**Conclusion**: MVP timeline of 6-8 weeks is feasible with proper parallel work and the productivity gains from Vibe Engineering (15-20% time savings).

---

**Next**: See `qa_strategy.md` for comprehensive test strategy and coverage requirements.

