# Phase 1: Requirements & Planning - MS8 Learning Analytics

**Project**: MS8 - Learning Analytics Microservice  
**Phase**: 1 (Complete: 1A + 1B + 1C)  
**Version**: 1.0.0  
**Date**: October 24, 2025  
**Status**: ✅ COMPLETE  
**Timeline**: 6-8 weeks MVP

---

## 📊 Executive Summary

This document represents the **complete synthesis of Phase 1** (Requirements & Planning), incorporating:
- **Phase 1A**: 5 debates (75 rounds), Requirements Specification, Project Roadmap
- **Phase 1B**: 3 debates (85 rounds), Scope Definition, Full-Stack Onion Architecture
- **Phase 1C**: Feature Breakdown (200+ units), QA Strategy, Implementation Patterns

**Total Documentation**: 6,720+ lines across 10+ documents  
**Total Debates**: 8 debates, 160 rounds, 100% unanimous consensus  
**Architecture Decision**: Full-Stack Onion Architecture with Vibe Engineering

---

## 🎯 Project Overview

### Mission
Build a comprehensive Learning Analytics Microservice (MS8) that provides 19 analytics across 3 user roles (learner, trainer, org admin) with gamification, AI-powered insights, and privacy-preserved comparisons.

### Success Criteria
- ✅ All 19 analytics implemented with mock data fallback
- ✅ 85%+ test coverage achieved
- ✅ < 2.5s dashboard load time (initial), < 100ms (cached)
- ✅ WCAG 2.2 AA compliant, Dark Emerald theme
- ✅ Multi-role system with seamless role switching
- ✅ Privacy-first (K-anonymity, GDPR compliant)
- ✅ Production deployed (Vercel + Railway + Supabase)

---

## 🏗️ Architecture Foundation

### Full-Stack Onion Architecture with Vibe Engineering

**Core Principle**: Same architectural patterns applied consistently across frontend and backend.

```
MS8-Learning-Analytics/
├── frontend/src/
│   ├── domain/              # Pure business logic (entities, value objects, services)
│   ├── application/         # Use cases, ports, state management
│   ├── infrastructure/      # API client, storage adapters, external services
│   └── presentation/        # React components, pages, layouts, hooks
├── backend/src/
│   ├── domain/              # Pure business logic (entities, value objects, services)
│   ├── application/         # Use cases, ports, DTOs
│   ├── infrastructure/      # Database, microservices, cache, job queue
│   └── presentation/        # Express routes, controllers, middleware
└── shared/                  # Shared types, constants (optional)
```

**Dependency Rule**: Dependencies point inward (Domain → Application → Infrastructure → Presentation)

**Benefits**:
- ✅ 15-20% productivity gain (1-1.5 weeks saved in MVP)
- ✅ Same mental model frontend + backend
- ✅ Easier code reviews and maintenance
- ✅ 85%+ test coverage achievable
- ✅ 6-layer security (3 frontend + 3 backend)

---

## 📋 Table of Contents

### PART I: REQUIREMENTS (Phase 1A + 1B)
1. [Scope Definition](#1-scope-definition)
2. [User Roles & Workflows](#2-user-roles--workflows)
3. [19 Analytics Catalog](#3-19-analytics-catalog)
4. [Technical Stack](#4-technical-stack)
5. [Key Architectural Decisions](#5-key-architectural-decisions)

### PART II: FEATURE BREAKDOWN (Phase 1C)
6. [Feature Breakdown: 200+ Implementation Units](#6-feature-breakdown-200-implementation-units)
7. [Feature Dependencies & Timeline](#7-feature-dependencies--timeline)

### PART III: QA STRATEGY (Phase 1C)
8. [Test Strategy & Pyramid](#8-test-strategy--pyramid)
9. [Test Coverage Requirements](#9-test-coverage-requirements)
10. [Test Data Strategy](#10-test-data-strategy)
11. [Test Automation Strategy](#11-test-automation-strategy)

### PART IV: IMPLEMENTATION PATTERNS (Phase 1C)
12. [Coding Standards](#12-coding-standards)
13. [Design Patterns](#13-design-patterns)
14. [Component Interfaces & Contracts](#14-component-interfaces--contracts)
15. [State Management Patterns](#15-state-management-patterns)

### PART V: CODE TEMPLATES (Phase 1C)
16. [Domain Layer Templates](#16-domain-layer-templates)
17. [Application Layer Templates](#17-application-layer-templates)
18. [Infrastructure Layer Templates](#18-infrastructure-layer-templates)
19. [Presentation Layer Templates](#19-presentation-layer-templates)

### PART VI: DATABASE PATTERNS (Phase 1C)
20. [ORM Patterns (Prisma)](#20-orm-patterns-prisma)
21. [Query Optimization Strategies](#21-query-optimization-strategies)
22. [Migration Patterns](#22-migration-patterns)
23. [Data Model Patterns](#23-data-model-patterns)

### PART VII: INTEGRATION PATTERNS (Phase 1C)
24. [API Testing Patterns](#24-api-testing-patterns)
25. [Mock Strategies (9 Microservices)](#25-mock-strategies-9-microservices)
26. [Integration Testing Patterns](#26-integration-testing-patterns)
27. [Deployment Patterns](#27-deployment-patterns)

### PART VIII: PERFORMANCE & SECURITY (Phase 1C)
28. [Caching Strategies (3-Layer)](#28-caching-strategies-3-layer)
29. [Optimization Patterns](#29-optimization-patterns)
30. [Authentication Patterns](#30-authentication-patterns)
31. [Authorization Patterns (RBAC)](#31-authorization-patterns-rbac)
32. [Security Control Implementation](#32-security-control-implementation)

### PART IX: VALIDATION & NEXT STEPS
33. [Traceability Matrix](#33-traceability-matrix)
34. [Phase 1 Validation](#34-phase-1-validation)
35. [Actionable Next Steps (Phase 2)](#35-actionable-next-steps-phase-2)

---

# PART I: REQUIREMENTS (Phase 1A + 1B)

## 1. Scope Definition

### 1.1 In-Scope (MVP - All Included)

**19 Analytics** ✅
- AS-001.1-6: Learner Analytics (6)
  - Learning Velocity & Momentum
  - Skill Gap Matrix
  - Engagement Score
  - Mastery Progress
  - Performance & Assessment Analytics
  - Content Effectiveness

- AS-002.7-10: Trainer Analytics (4)
  - Course Performance Dashboard
  - Course Health Dashboard
  - Student Performance Distribution
  - Teaching Effectiveness

- AS-003.11-14: Organizational Analytics (4)
  - Organizational Learning Velocity
  - Strategic Alignment Tracking
  - Department Analytics (individual workers only, no dept aggregation)
  - Learning Culture Metrics

- AS-004.15-17: Predictive Analytics (3)
  - Drop-Off Risk Prediction (rule-based MVP, AI later)
  - Learning Outcome Forecasting (mock data)
  - Personalized Recommendations (mock data)

- AS-005.18-19: Comparison Analytics (2)
  - Platform Skill Demand Analytics
  - Peer Comparison (K-anonymity ≥10 users)

**Additional Features** ✅
- Multi-role system (learner, trainer, org_admin)
- Role switching (JWT with roles array, X-Active-Role header)
- Gamification (badges, streaks, points, leaderboards)
- RAG chatbot widget (mock data, REST API)
- Report export (PDF, CSV, Excel, JSON - all 4 formats)
- Dark Emerald theme (day/night mode)
- Full responsive design (mobile, tablet, desktop)
- WCAG 2.2 AA compliant

### 1.2 Out-of-Scope (Phase 2)

- Department/team aggregated analytics (show "Coming Soon")
- Real-time WebSocket updates
- Advanced customizable reports
- Admin panel for managing users/orgs
- Mobile native app (React Native)
- Internationalization (i18n)
- Real Google Gemini integration (mock data in MVP)

### 1.3 Key Clarifications

- **Multi-role**: JWT with roles array, X-Active-Role header, separate routes per role
- **Performance**: Daily batch (02:00 UTC), 6h staleness threshold, manual refresh
- **Mock data**: Backend handles fallback, all 9 microservices have mock adapters
- **Dark Emerald theme**: WCAG 2.2 AA, fully responsive, day/night mode
- **No department/team analytics in MVP**: Focus on individual workers only

---

## 2. User Roles & Workflows

### 2.1 User Roles

**Role 1: Learner** (Primary)
- View personal learning analytics (6 analytics)
- Compare to peers (anonymized, K-anonymity)
- Track gamification progress
- Export personal reports
- Receive AI recommendations (mock)

**Role 2: Trainer**
- View course performance analytics (4 analytics)
- See student distribution across courses taught
- Identify at-risk students
- Export course snapshots
- View teaching effectiveness metrics

**Role 3: Organization Admin**
- View org-wide analytics (4 analytics)
- Track strategic alignment
- View individual worker analytics (no dept aggregation)
- Export executive reports
- Monitor learning culture

**Multi-Role Users**
- Users can have multiple roles (e.g., learner + trainer)
- Role switcher in header (dropdown)
- Separate dashboards per role (/dashboard/learner, /dashboard/trainer, /dashboard/org-admin)
- Analytics calculated per (user_id, role) pair independently

### 2.2 User Workflows

#### Learner Journey

**First Login**:
1. Login via MS12 → JWT received
2. MS8 checks for analytics data
3. If no data: Trigger async data collection (~45s progressive loading)
4. If has data: Load dashboard (< 100ms cached)
5. Dashboard shows: 6 analytics cards + gamification widget + RAG chatbot

**Returning Login**:
1. Load cached dashboard (< 100ms)
2. Background staleness check (> 6h?)
3. If stale: Show indicator "Data is 8 hours old" + async refresh
4. If fresh: No action

**Actions**:
- Click analytics card → detailed analytics page
- Click "Refresh Data" → trigger async recalc (rate-limited 5/10min)
- Click "Export Report" → select format (PDF/CSV/Excel/JSON) → download
- Click "Compare to Peers" → comparison dashboard
- View gamification progress → badges, streaks, points

#### Trainer Journey

**Login**:
1. Load trainer dashboard
2. Show list of courses taught (from Directory MS)
3. Show key metrics per course

**Select Course**:
1. Navigate to Course Health Dashboard
2. View drop-off funnel, activity heatmap, problem areas
3. View at-risk students (count + names if permission)
4. Export course snapshot (PDF/CSV)

**Actions**:
- Drill down to student distribution
- Compare courses (own courses only)
- Export aggregate data

#### Org Admin Journey

**Login**:
1. Load org admin dashboard
2. Show org-wide velocity, strategic alignment
3. Show individual worker analytics (no dept aggregation in MVP)

**Drill Down**:
1. Click worker name → view individual worker analytics
2. View strategic alignment per worker
3. Export executive report

**Actions**:
- Filter by skills, roles, departments (but analytics remain per-worker)
- Compare org to platform averages
- Export org-wide reports

---

## 3. 19 Analytics Catalog

### AS-001: Learner Analytics (6)

#### AS-001.1: Learning Velocity & Momentum
- **Definition**: Rate of learning progress over time
- **Time Window**: 7d + 30d (default 30d, user slider)
- **Topics**: Learning paths + course modules + DevLab practice
- **Momentum**: ±20% thresholds (Accelerating/Steady/Slowing)
- **Data Sources**: Course Builder (progress), Skills Engine (skills acquired), DevLab (practice sessions)
- **Calculation**: (Current progress - Previous progress) / Time window
- **Display**: Line chart with trend indicator

#### AS-001.2: Skill Gap Matrix
- **Definition**: Gap between current skills and target skills
- **Formula**: Target Level - Current Level (0-4 scale)
- **Priority Scoring**: 
  - Gap (25%) + Business Value (30%) + Market Demand (20%) + Prerequisites (15%) + Career Goals (10%)
- **Critical Gap**: ≥ 2 levels OR priority ≥ 80
- **Data Sources**: Skills Engine (current/target levels), Directory (KPIs, value propositions)
- **Display**: Heatmap matrix (skills × priority)

#### AS-001.3: Engagement Score
- **Definition**: User engagement with learning platform
- **Time Window**: 14d rolling (default), recency weighted 2×
- **Factors**: 
  - Login frequency (35%)
  - Session duration (25%)
  - Activity count (40%)
- **Bands**: Highly Engaged (≥80), Engaged (50-79), At Risk (<50)
- **Data Sources**: Directory (login logs), Course Builder (session data), Content Studio (activity logs)
- **Display**: Gauge chart with engagement band

#### AS-001.4: Mastery Progress
- **Definition**: Progress towards skill mastery
- **Criteria**: Skills Engine marks skill "acquired" OR (assessment ≥80% AND DevLab passed)
- **Display**: Overall % + per-path %
- **Data Sources**: Skills Engine (skill acquisition), Assessment (test scores), DevLab (practice completion)
- **Calculation**: (Acquired skills / Target skills) × 100
- **Display**: Progress bar with breakdown per learning path

#### AS-001.5: Performance & Assessment Analytics
- **Definition**: Assessment performance over time
- **Metrics**: 
  - Average score across all assessments
  - Pass/fail rate
  - Time to complete assessments
  - Skill acquisition via assessments
- **Data Sources**: Assessment MS (test scores, completion times)
- **Display**: Multi-line chart (score trends over time)

#### AS-001.6: Content Effectiveness
- **Definition**: Effectiveness of content in skill acquisition
- **Metrics**:
  - Content type effectiveness (video, text, interactive)
  - Creation method effectiveness (AI vs human vs hybrid)
  - Content engagement rate
  - Skill acquisition rate per content type
- **Data Sources**: Content Studio (content metadata), Skills Engine (skill acquisition), Course Builder (engagement)
- **Display**: Bar chart comparing content types

### AS-002: Trainer Analytics (4)

#### AS-002.7: Course Performance Dashboard
- **Definition**: Overall course performance metrics
- **Metrics**:
  - Enrollment count
  - Completion rate
  - Average progress
  - Average assessment scores
  - Time to complete
- **Data Sources**: Course Builder (enrollment, progress, completion), Assessment (scores)
- **Display**: Dashboard with KPI cards + trend charts

#### AS-002.8: Course Health Dashboard
- **Definition**: Course health indicators
- **Metrics**:
  - Drop-off funnel (enrollment → start → midpoint → completion)
  - Activity heatmap (when students are active)
  - Problem areas (modules with high drop-off)
  - At-risk student count
- **Data Sources**: Course Builder (progress checkpoints), Directory (activity logs)
- **Display**: Funnel chart + heatmap + problem area list

#### AS-002.9: Student Performance Distribution
- **Definition**: Distribution of student performance across courses
- **Metrics**:
  - Performance bands (High/Medium/Low)
  - Engagement distribution
  - Assessment score distribution
  - Completion status distribution
- **Data Sources**: Course Builder (progress), Assessment (scores), Directory (engagement)
- **Display**: Histogram + distribution curve

#### AS-002.10: Teaching Effectiveness
- **Definition**: Trainer effectiveness metrics
- **Metrics**:
  - Student satisfaction (if available)
  - Course completion rate
  - Average student progress
  - Skill acquisition rate
  - Student retention rate
- **Data Sources**: Course Builder (completion, progress), Skills Engine (skill acquisition)
- **Display**: Radar chart with effectiveness dimensions

### AS-003: Organizational Analytics (4)

#### AS-003.11: Organizational Learning Velocity
- **Definition**: Org-wide learning velocity
- **Calculation**: Aggregate of individual worker velocities (no dept/team aggregation in MVP)
- **Metrics**:
  - Average velocity across all workers
  - Velocity distribution (High/Medium/Low)
  - Velocity trends over time
- **Data Sources**: Same as AS-001.1, aggregated per organization
- **Display**: Line chart (org avg velocity) + distribution histogram

#### AS-003.12: Strategic Alignment Tracking
- **Definition**: Alignment between worker skills and org strategic goals
- **Metrics**:
  - Skills coverage vs KPIs (from Directory)
  - Skills coverage vs value propositions
  - Gap analysis (strategic skills needed vs acquired)
  - Worker readiness for strategic initiatives
- **Data Sources**: Skills Engine (worker skills), Directory (KPIs, value propositions)
- **Display**: Alignment matrix (skills × KPIs)

#### AS-003.13: Department Analytics
- **Scope (MVP)**: Individual workers only, no dept/team aggregation
- **Display**: List of workers with individual analytics
- **Filter**: By department, but analytics remain per-worker
- **Future**: Dept-level aggregated analytics (Phase 2)

#### AS-003.14: Learning Culture Metrics
- **Definition**: Org-wide learning culture health
- **Metrics**:
  - Average engagement score across org
  - Participation rate (% workers actively learning)
  - Learning frequency (avg sessions per worker per month)
  - Knowledge sharing indicators (future)
- **Data Sources**: Directory (engagement logs), Course Builder (participation)
- **Display**: KPI cards + trend charts

### AS-004: Predictive Analytics (3)

#### AS-004.15: Drop-Off Risk Prediction
- **MVP Approach**: Rule-based (AI later)
- **Rules**:
  - Engagement (<50) + Velocity decline (>20%) + No progress (7d) = High Risk
  - Engagement (50-70) + Velocity decline (>10%) = Medium Risk
  - Otherwise = Low Risk
- **Bands**: Critical (>80), High (60-80), Medium (40-60), Low (<40)
- **Data Sources**: AS-001.1 (velocity), AS-001.3 (engagement), Course Builder (progress)
- **Display**: Risk gauge + risk factors list

#### AS-004.16: Learning Outcome Forecasting
- **MVP Approach**: Mock data (AI integration later)
- **Mock Metrics**:
  - Predicted completion date
  - Predicted skill mastery level
  - Predicted assessment scores
- **Display**: Forecast chart (actual vs predicted)

#### AS-004.17: Personalized Recommendations
- **MVP Approach**: Mock data from Learner AI MS (REST API, migrate to gRPC later)
- **Recommendations**:
  - Suggested learning paths
  - Suggested skills to prioritize
  - Suggested content based on learning style
- **Data Sources**: Learner AI MS (mock for MVP)
- **Display**: Recommendation cards with action buttons

### AS-005: Comparison Analytics (2)

#### AS-005.18: Platform Skill Demand Analytics
- **Definition**: Platform-wide skill demand trends
- **Metrics**:
  - Most in-demand skills (enrollment counts)
  - Fastest growing skills (velocity trends)
  - Skills with highest completion rates
- **Data Sources**: Course Builder (enrollment), Skills Engine (skill acquisition)
- **Display**: Bar chart (top 10 skills) + trend lines

#### AS-005.19: Peer Comparison (Privacy-Preserved)
- **Definition**: Compare learner to peers (K-anonymity ≥10 users)
- **Comparison Scopes**:
  - Same department (if ≥10 workers)
  - Same org (if ≥10 workers)
  - Platform-wide (if ≥10 users in cohort)
- **Metrics Compared**:
  - Learning velocity (percentile)
  - Engagement score (percentile)
  - Mastery progress (percentile)
  - Assessment performance (percentile)
- **Privacy**: Anonymized, aggregated, K-anonymity enforced
- **Display**: Radar chart (you vs peer average) + percentile indicators

---

## 4. Technical Stack

### Frontend
- **Framework**: React 18+ with Vite 4+
- **State Management**: SWR (data fetching) + Context API (auth, role, theme)
- **Styling**: Tailwind CSS 3+ (Dark Emerald theme)
- **Charts**: Recharts or Chart.js
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **API Mocking**: MSW (Mock Service Worker)
- **Build Tool**: Vite
- **Hosting**: Vercel

### Backend
- **Framework**: Node.js 18+ with Express.js 4+
- **ORM**: Prisma 5+ (with raw SQL for advanced queries)
- **Job Queue**: pg-boss 9+ (PostgreSQL-based)
- **Database**: PostgreSQL 15+ (Supabase)
- **Caching**: Railway built-in cache (no Redis)
- **Testing**: Jest + Supertest
- **API Documentation**: JSDoc (no OpenAPI for MVP)
- **Hosting**: Railway

### Database
- **Database**: PostgreSQL 15+ (Supabase)
- **ORM**: Prisma (schema management, migrations)
- **Raw SQL**: Advanced queries (RLS, materialized views, partitioning)
- **Migrations**: Prisma + SQL files

### External Integrations (9 Microservices)
1. Auth (MS12) - JWT validation
2. Directory - Users, orgs, KPIs, value propositions
3. Course Builder - Courses, enrollment, progress
4. Content Studio - Content usage, creation method
5. Assessment - Tests, grades, skill acquisition
6. Skills Engine - Skills, competencies, levels
7. Learner AI - Learning paths, recommendations
8. DevLab - Practice sessions, mastery
9. RAG Assistant (MS9) - Chatbot (REST → gRPC later)

**Integration Pattern**: Circuit breaker + retry + mock fallback (all 9)

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (frontend) + Railway (backend) + Supabase (database)
- **Monitoring**: Health checks (/health, /ready, /live)
- **Error Tracking**: Sentry (optional, free tier)
- **Uptime Monitoring**: UptimeRobot (free)

---

## 5. Key Architectural Decisions

### 5.1 Full-Stack Onion Architecture with Vibe Engineering
**From**: Debate #6 (35 rounds, unanimous)
- **Decision**: Apply same Onion Architecture to frontend and backend
- **Layers**: Domain → Application → Infrastructure → Presentation
- **Benefit**: 15-20% productivity gain, consistent mental model
- **Status**: ✅ Approved by all 9 roles

### 5.2 Multi-Role Architecture (5 Decisions)
**From**: Debate #7 (25 rounds, unanimous)

**Decision 1: Data Storage**
- Single table with `(user_id, role, analytics_type)` composite key
- No cross-role data leakage

**Decision 2: Session Management**
- JWT with roles array `["learner", "trainer"]`
- Frontend sends `X-Active-Role: learner` header
- Backend validates against JWT roles array

**Decision 3: UI Architecture**
- Separate routes per role:
  - `/dashboard/learner` → LearnerDashboard.jsx
  - `/dashboard/trainer` → TrainerDashboard.jsx
  - `/dashboard/org-admin` → OrgAdminDashboard.jsx
- Role switcher in header (dropdown)

**Decision 4: Analytics Calculation**
- Calculate per (user_id, role) pair independently
- No cross-role data sharing

**Decision 5: RBAC Enforcement (3-Layer)**
- **Frontend**: Conditional rendering based on activeRole
- **Backend Middleware**: authMiddleware, activeRoleMiddleware, RBACMiddleware
- **Database RLS**: Supabase Row-Level Security policies

### 5.3 Hybrid Performance Strategy
**From**: Debate #8 (25 rounds, unanimous)

**Decision**: 3 mechanisms
1. **Daily Batch** (02:00 UTC): Calculate all analytics for all user-roles (~2 hours for 10k users)
2. **Staleness Check** (on login): If > 6h old, trigger async recalc
3. **Manual Refresh**: User-triggered, rate-limited (5 per 10 min)

**Caching**: 3-layer
- **L1**: In-memory (24h TTL)
- **L2**: Database (7d retention)
- **L3**: Aggregated (7y retention, partitioned)

**Performance Targets**:
- Dashboard load: < 100ms (cached), ~45s (first-time)
- API response: < 500ms (cached)
- Batch duration: ~2 hours for 10k users

---

# PART II: FEATURE BREAKDOWN (Phase 1C)

## 6. Feature Breakdown: 200+ Implementation Units

This section breaks down the 19 analytics and all MVP features into **215 implementable units**, each taking **30-60 minutes** to implement following TDD (RED-GREEN-REFACTOR).

**For detailed feature breakdown**, see: **[`feature_breakdown.md`](./feature_breakdown.md)**

Summary: 215 implementation units organized by layer:
- Infrastructure Setup: 20 units
- Domain Layer: 25 units  
- Application Layer: 35 units
- Infrastructure Layer: 40 units
- Presentation Layer: 45 units
- Database Implementation: 15 units
- Testing: 35 units
- Deployment: 10 units

---

# PART III: QA STRATEGY (Phase 1C)

**For comprehensive QA strategy**, see: **[`qa_strategy.md`](./qa_strategy.md)**

## 8. Test Strategy & Pyramid

**Test Distribution** (70% / 20% / 10%):
- Unit Tests: 150 tests (Domain 95%+, Application 85%+)
- Integration Tests: 43 tests (Infrastructure 70%+, Presentation 80%+)
- E2E Tests: 22 tests (Critical paths 100%)
- **Total**: 215 tests, 85%+ overall coverage

**TDD Methodology**: RED-GREEN-REFACTOR cycle for every implementation unit

## 9. Test Coverage Requirements

| Layer | Coverage Target | Rationale |
|-------|-----------------|-----------|
| Domain | 95%+ | Pure business logic, critical |
| Application | 85%+ | Use cases, orchestration |
| Infrastructure | 70%+ | External adapters, easier to mock |
| Presentation | 80%+ | UI/API, user-facing |

## 10. Test Data Strategy

- Mock data for 9 microservices (JSON files)
- Test factories (UserFactory, AnalyticsFactory)
- Database fixtures (Prisma seed files)
- In-memory SQLite for fast tests

## 11. Test Automation Strategy

- CI/CD: GitHub Actions with coverage gates
- Local: Jest watch mode for TDD
- E2E: Playwright for critical user journeys
- Performance: Load testing with 100+ concurrent users

---

# PART IV: IMPLEMENTATION PATTERNS (Phase 1C)

**For detailed implementation patterns**, see: **[`implementation_patterns.md`](./implementation_patterns.md)**

## 12. Coding Standards

- ESLint + Prettier configured
- JSDoc for type safety
- File naming: PascalCase (classes), camelCase (functions), kebab-case (routes)
- Error handling: Custom error classes
- Async/await (no callbacks)

## 13. Design Patterns

- **Dependency Inversion**: Ports & Adapters pattern
- **Repository Pattern**: Abstract data access
- **Circuit Breaker**: External service resilience  
- **Factory Pattern**: Simple DI container
- **Strategy Pattern**: Analytics calculation strategies

## 14. Component Interfaces & Contracts

- Frontend: Container/Presentational pattern
- Backend: Controller → Use Case → Domain Service
- Props validation: PropTypes (frontend)
- API contracts: JSDoc (backend)

## 15. State Management Patterns

- Context API: Auth, Role, Theme contexts
- SWR: Data fetching with caching
- LocalStorage: Persistent preferences

---

# PART V: CODE TEMPLATES (Phase 1C)

**For ready-to-use code templates**, see: **[`code_templates.md`](./code_templates.md)**

## 16-19. Layer Templates

Complete code templates provided for:
- **Domain Layer**: Entities, Value Objects, Domain Services (frontend + backend)
- **Application Layer**: Ports, Use Cases, DTOs, State (frontend + backend)
- **Infrastructure Layer**: Repositories, Adapters, Circuit Breaker, DI (frontend + backend)
- **Presentation Layer**: Controllers, Routes, Pages, Components (frontend + backend)

All templates follow Vibe Engineering principles (same patterns frontend + backend).

---

# PART VI: DATABASE PATTERNS (Phase 1C)

**For database implementation patterns**, see: **[`database_patterns.md`](./database_patterns.md)**

## 20. ORM Patterns (Prisma)

- Complete Prisma schema for all models
- Composite unique indexes: `(userId, role, analyticsType)`
- JSONB columns for flexible analytics data
- Relations with cascade deletes

## 21. Query Optimization Strategies

- Select only needed fields
- Use indexes strategically
- Batch operations with transactions
- Aggregation for counts

## 22. Migration Patterns

- Prisma migrations for schema changes
- Raw SQL for RLS policies, materialized views, partitioning
- Migration testing (up + down)

## 23. Data Model Patterns

- RLS (Row-Level Security) for multi-tenancy
- Materialized views for peer comparisons
- Table partitioning for 7-year retention

---

# PART VII: INTEGRATION PATTERNS (Phase 1C)

**For integration patterns**, see: **[`integration_patterns.md`](./integration_patterns.md)**

## 24. API Testing Patterns

- Supertest for backend API tests
- MSW (Mock Service Worker) for frontend
- Test factories for data generation

## 25. Mock Strategies (9 Microservices)

- Circuit breaker pattern for all 9 MS
- Mock data fallback (backend handles)
- Source indicator: `{ ...data, source: 'real' | 'mock' }`

## 26. Integration Testing Patterns

- API integration tests with Supertest
- Component integration tests with React Testing Library
- E2E tests with Playwright

## 27. Deployment Patterns

- GitHub Actions CI/CD
- Railway (backend), Vercel (frontend), Supabase (database)
- Automated migrations before deploy

---

# PART VIII: PERFORMANCE & SECURITY (Phase 1C)

**For performance guidelines**, see: **[`performance_guidelines.md`](./performance_guidelines.md)**  
**For security patterns**, see: **[`security_patterns.md`](./security_patterns.md)**

## 28. Caching Strategies (3-Layer)

- **L1**: In-memory cache (24h TTL)
- **L2**: Database cache (7d retention, updatedAt < 6h)
- **L3**: Aggregated cache (7y retention, partitioned)

## 29. Optimization Patterns

- SWR deduplication (10s window)
- Lazy loading for components
- Code splitting with React.lazy()
- Query optimization (indexes, aggregation)

## 30. Authentication Patterns

- JWT validation from MS12 (Auth service)
- Token stored in localStorage (frontend)
- Bearer token in Authorization header

## 31. Authorization Patterns (RBAC)

**3-Layer Defense**:
1. **Frontend**: Conditional rendering based on activeRole
2. **Backend Middleware**: authMiddleware + rbacMiddleware
3. **Database RLS**: Row-Level Security policies

## 32. Security Control Implementation

- Input validation (Joi/Zod schemas)
- SQL injection prevention (Prisma ORM)
- XSS prevention (React escaping + CSP)
- Rate limiting (5 requests/10min for refresh)
- K-anonymity enforcement (≥10 users)
- No PII in logs (correlation IDs only)

---

# PART IX: VALIDATION & NEXT STEPS

## 33. Traceability Matrix

| Requirement | Feature Breakdown | QA Strategy | Implementation Pattern | Status |
|-------------|-------------------|-------------|------------------------|--------|
| FR-001: All 19 Analytics | 95 units (5 per analytic) | 95 tests | Domain + Application layers | ✅ Planned |
| FR-002: Multi-Role System | 20 units | 20 tests | RBAC 3-layer pattern | ✅ Planned |
| FR-003: Gamification | 12 units | 12 tests | Domain service + JSONB | ✅ Planned |
| FR-004: Report Export | 16 units (4 formats) | 16 tests | Strategy pattern | ✅ Planned |
| FR-005: Comparison (K-anonymity) | 15 units | 15 tests | Materialized view + validation | ✅ Planned |
| FR-006: RAG Chatbot | 5 units | 5 tests | External service adapter | ✅ Planned |
| NFR-001: Performance (<2.5s) | Caching strategy | 15 performance tests | 3-layer cache | ✅ Planned |
| NFR-002: Test Coverage (85%+) | 215 tests total | Coverage gates | TDD methodology | ✅ Planned |
| NFR-003: Security (RBAC, RLS) | 6-layer defense | 20 security tests | Auth + RLS patterns | ✅ Planned |
| NFR-004: Accessibility (WCAG 2.2 AA) | Dark Emerald theme | 15 a11y tests | ARIA labels, keyboard nav | ✅ Planned |

## 34. Phase 1 Validation

### Phase 1A ✅ COMPLETE
- 5 debates (75 rounds, unanimous consensus)
- Requirements Specification (1,000+ lines)
- Project Roadmap (908 lines)

### Phase 1B ✅ COMPLETE
- 3 debates (85 rounds, unanimous consensus)
- Scope Definition (438 lines)
- Full-Stack Onion Architecture with Vibe Engineering
- Multi-role architecture (5 key decisions)
- Hybrid performance strategy

### Phase 1C ✅ COMPLETE
- **Feature Breakdown**: 215 implementation units → `feature_breakdown.md`
- **QA Strategy**: Test pyramid, 85%+ coverage → `qa_strategy.md`
- **Implementation Patterns**: Coding standards, design patterns → `implementation_patterns.md`
- **Code Templates**: All 4 Onion layers (frontend + backend) → `code_templates.md`
- **Database Patterns**: Prisma, RLS, query optimization → `database_patterns.md`
- **Integration Patterns**: API testing, mock strategies → `integration_patterns.md`
- **Performance Guidelines**: 3-layer caching, optimization → `performance_guidelines.md`
- **Security Patterns**: RBAC, RLS, security controls → `security_patterns.md`

**Total Phase 1 Documentation**: 10+ documents, 8,000+ lines, 160 debate rounds

### Validation Against Init_Prompt.md Requirements

✅ **Step 1**: Plan project roadmap, timeline, resource allocation  
✅ **Step 5**: Feature planning (200+ units, dependencies, timeline)  
✅ **Step 6**: Finalize roadmap with all milestones and deliverables  
✅ **Step 10**: QA Strategy (test pyramid, 70%/20%/10%, 85%+ coverage)  
✅ **Step 11**: Implementation Patterns (coding standards, design patterns)  
✅ **Step 12**: Database Implementation (ORM, query optimization, migrations)  
✅ **Step 13**: Integration Patterns (API testing, mocks, deployment)  
✅ **Step 14**: Performance Guidelines (caching strategies, optimization)  
✅ **Step 15**: Security Implementation (authentication, authorization, security controls)  
✅ **Step 16**: Generate requirements_specification.md (referenced in project_roadmap.md)  
✅ **Step 17**: Validate roadmap, QA strategy, patterns, requirements  
✅ **Step 18**: Output `phase_1_requirements_planning.md` (this document)

**All Phase 1C Requirements Met** ✅

## 35. Actionable Next Steps (Phase 2)

### Phase 2: Design & Architecture (Week 2)

**Phase 2A: Full-Stack Architecture Design** (2-3 days)
- Design complete full-stack architecture (Frontend + Backend Onion layers)
- Define component hierarchy (React components + Express controllers)
- Design API contracts (all 50+ endpoints)
- Plan state management (Context API + SWR)
- Design dashboard layouts (3 role dashboards)
- Design business logic architecture (19 analytics calculations)
- Design security controls (6-layer defense in depth)

**Deliverables**:
- Full-Stack Architecture Document (frontend + backend Onion layers)
- Component Hierarchy Diagram (frontend + backend)
- API Specification Document (all 50+ endpoints with schemas)
- State Management Flow Diagrams
- Dashboard Wireframes (learner, trainer, org admin)
- Business Logic Flow Diagrams (19 analytics)
- Security Control Matrix (6 layers)

**Phase 2B: Integration Architecture Design** (1 day)
- Design integration layer (Infrastructure adapters)
- Define external MS contracts (9 microservices)
- Plan mock data fallback strategy
- Design circuit breaker implementation
- Design BFF endpoints (if needed)

**Deliverables**:
- Integration Architecture Document
- External MS Contract Specifications (9 microservices)
- Mock Data Inventory (9 × 19 = 171 mock endpoints)
- Circuit Breaker Configuration

**Phase 2C: Database Architecture Design** (1 day)
- Finalize database schema (Prisma + SQL)
- Design RLS policies (multi-tenancy)
- Plan materialized views (comparison aggregates)
- Design table partitioning (7-year retention)

**Deliverables**:
- Database Architecture Document (updated)
- Database ERD (Entity Relationship Diagram)
- Prisma Schema (`schema.prisma`)
- SQL Migration Files (RLS, materialized views, partitioning)
- Migration Plan (order of execution)

**Phase 2 Output**: `phase_2_design_architecture.md`

---

## 📊 Phase 1 Summary

**Phase 1A + 1B + 1C Complete**:
- ✅ 8 debates (160 rounds, 100% consensus)
- ✅ 10+ comprehensive documents (8,000+ lines)
- ✅ Full-Stack Onion Architecture with Vibe Engineering
- ✅ 215 implementation units (30-60min each)
- ✅ 215 tests (70% unit, 20% integration, 10% E2E)
- ✅ 85%+ test coverage strategy
- ✅ Complete patterns, templates, and guidelines
- ✅ Security-first approach (6-layer defense)
- ✅ 19 analytics fully planned
- ✅ Multi-role system architected
- ✅ Performance optimized (3-layer caching)
- ✅ 6-8 week MVP timeline validated

**Ready for Phase 2: Design & Architecture** ✅

---

**Document Status**: ✅ COMPLETE  
**Phase 1C Status**: ✅ COMPLETE  
**Next Phase**: Phase 2 - Design & Architecture  
**Folder**: `docs/phase_1/`

---

## 📚 Phase 1C Deliverables Index

All Phase 1C planning documents:

1. **[phase_1_requirements_planning.md](./phase_1_requirements_planning.md)** (this file) - Main synthesis document
2. **[feature_breakdown.md](./feature_breakdown.md)** - 215 implementation units with dependencies
3. **[qa_strategy.md](./qa_strategy.md)** - Test pyramid, coverage, automation
4. **[implementation_patterns.md](./implementation_patterns.md)** - Coding standards, design patterns
5. **[code_templates.md](./code_templates.md)** - Ready-to-use templates for all 4 Onion layers
6. **[database_patterns.md](./database_patterns.md)** - Prisma, RLS, query optimization
7. **[integration_patterns.md](./integration_patterns.md)** - API testing, mock strategies
8. **[performance_guidelines.md](./performance_guidelines.md)** - Caching, optimization
9. **[security_patterns.md](./security_patterns.md)** - Authentication, authorization, controls

**Phase 1A/1B Documents** (already complete):
- `project_roadmap.md` - Complete project roadmap
- `scope_definition.md` - MVP scope and constraints
- `phase_1b_summary.md` - Phase 1B summary
- `debates/` - All 8 debate documents
- `architecture/` - Architecture diagrams and flows

**Total Phase 1 Documentation**: 18+ documents, 8,000+ lines ✅

---

**End of Phase 1: Requirements & Planning**
