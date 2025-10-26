# MS8 Learning Analytics - Scope Definition

**Phase**: 1B - Scope Definition  
**Date**: October 24, 2025  
**Status**: ✅ COMPLETE  
**Version**: 1.0

---

## 📋 Executive Summary

This document defines the complete scope for MS8 Learning Analytics MVP, incorporating all user answers and 3 mediated debates (75 rounds total). The scope is precise, implementable, and aligned with the 6-8 week MVP timeline.

**Key Decisions**:
- ✅ **Architecture**: Hybrid Onion-Hexagonal
- ✅ **Multi-Role**: 5 architectural decisions made
- ✅ **Performance**: Hybrid strategy (batch + staleness check + manual refresh)
- ✅ **All 19 Analytics**: Included in MVP with mock data first
- ✅ **Tech Stack**: Node.js + Express, React + Vite, PostgreSQL (Supabase)

---

## 🎯 MVP Scope

### **In-Scope (MVP)**:

**1. All 19 Analytics** ✅
- AS-001.1-6: Learner Analytics (6)
- AS-002.7-10: Trainer Analytics (4)
- AS-003.11-14: Organizational Analytics (4)
- AS-004.15-17: Predictive Analytics (3)
- AS-005.18-19: Comparison Analytics (2)

**2. Multi-Role System** ✅
- Learner, Trainer, Org Admin roles
- Separate dashboards per role
- Role switching in UI
- RBAC enforcement (3 layers)

**3. Gamification** ✅
- Badges, streaks, points, leaderboards
- Achievements display
- AI-powered motivation messages (mock data)

**4. RAG Chatbot Widget** ✅
- Mock data initially
- REST API (migrate to gRPC later)

**5. Report Export** ✅
- All 4 formats: PDF, CSV, Excel, JSON

**6. Full Responsive Design** ✅
- Mobile, tablet, desktop
- Dark Emerald theme
- Accessibility (WCAG 2.2 AA)

---

### **Out-of-Scope (Phase 2)**:

- Department/team analytics (show "Coming Soon")
- Real-time WebSocket updates
- Advanced customizable reports
- Admin panel for managing users/orgs
- Mobile app (React Native)
- Internationalization (i18n)
- Real Google Gemini integration (use mock data in MVP)

---

## 🏗️ Architecture Decisions

### **Decision #1: Full-Stack Onion Architecture with Vibe Engineering**

**From**: Debate #6 (35 rounds, unanimous approval)

**Scope**: **FULL STACK** (Frontend + Backend)

**Vibe Engineering Principle**: Same architectural patterns applied consistently across the entire stack for seamless development and maintenance.

**Structure**:
```
MS8-Learning-Analytics/
├── frontend/src/
│   ├── domain/              # Pure business logic
│   ├── application/         # Use cases + ports + state
│   ├── infrastructure/      # API client, storage adapters
│   └── presentation/        # React components, pages, layouts
├── backend/src/
│   ├── domain/              # Pure business logic
│   ├── application/         # Use cases + ports + DTOs
│   ├── infrastructure/      # Database, microservices, cache
│   └── presentation/        # Express routes, controllers, middleware
└── shared/                  # Shared types, constants (optional)
```

**Benefits**:
- ✅ **Vibe Engineering**: Same mental model frontend + backend
- ✅ **Productivity**: 15-20% time savings (1-1.5 weeks in MVP)
- ✅ Clear layers (Onion) for both frontend and backend
- ✅ Flexible integrations (Ports & Adapters pattern)
- ✅ 85%+ test coverage achievable
- ✅ Easy to maintain and extend
- ✅ 6 security layers (3 frontend + 3 backend)

---

### **Decision #2: Multi-Role Architecture**

**From**: Debate #7 (25 rounds, unanimous approval)

**5 Key Decisions**:

1. **Data Storage**: Single table with `(user_id, role, analytics_type)` composite key
2. **Session Management**: Single JWT with roles array, frontend tracks active role via `X-Active-Role` header
3. **UI Architecture**: Separate routes per role (`/dashboard/learner`, `/dashboard/trainer`, etc.)
4. **Analytics Calculation**: Calculate per `(user_id, role)` pair independently
5. **RBAC Enforcement**: 3-layer defense in depth (Frontend, Backend Middleware, Database RLS)

---

### **Decision #3: Hybrid Performance Strategy**

**From**: Debate #8 (25 rounds, unanimous approval)

**Strategy**:
1. **Daily Batch** (02:00 UTC): Calculate all analytics for all user-roles (~2 hours)
2. **Staleness Check** (on login): Trigger async recalc if > 6h old
3. **Manual Refresh**: User-triggered, rate-limited (5 per 10 min)
4. **3-Layer Caching**: In-memory (24h) → Database (7d) → Aggregated (7y)

**Performance Targets**:
- Dashboard load: < 100ms (cached), ~45s (first-time)
- API response: < 500ms (cached)
- Batch duration: ~2 hours for 10k users
- Load reduction: 43% vs original proposal

---

## 👥 User Workflows

### **Learner Journey**:
1. **First login**: Auto-trigger data collection, progressive loading (~45s)
2. **Returning**: Instant load (< 100ms cached), staleness indicator if > 6h
3. **Actions**: View analytics, compare to peers, export report, refresh data

### **Trainer Journey**:
1. **Login**: See list of courses taught
2. **Select course**: View course health, student distribution, at-risk students
3. **Actions**: Export course snapshot, drill down to details

### **Org Admin Journey**:
1. **Login**: See org-wide velocity, strategic alignment
2. **Drill down**: Org → Team → Individual workers
3. **Actions**: Export executive reports, compare teams

---

## 📊 Business Rules

### **Learning Velocity**:
- **Time window**: 7d + 30d (default 30d, user slider)
- **Topics**: Learning paths + course modules + DevLab practice
- **Momentum**: ±20% thresholds (Accelerating/Steady/Slowing)

### **Skill Gap**:
- **Formula**: Target Level - Current Level (0-4 scale)
- **Priority scoring**: Gap (25%) + Business (30%) + Market (20%) + Prerequisites (15%) + Career (10%)
- **Critical gap**: ≥ 2 levels OR priority ≥ 80

### **Engagement Score**:
- **Time window**: 14d rolling (default), recency weighted 2×
- **Factors**: Login frequency (35%) + Session duration (25%) + Activity count (40%)
- **Bands**: Highly Engaged (≥80), Engaged (50-79), At Risk (<50)

### **Mastery Progress**:
- **Definition**: Skills Engine marks skill "acquired" OR (assessment ≥80% AND DevLab passed)
- **Display**: Overall % + per-path %

### **Drop-Off Risk** (MVP):
- **Rule-based**: Engagement (<50) + Velocity decline (>20%) + No progress (7d)
- **Bands**: Critical (>80), High (60-80), Medium (40-60), Low (<40)

### **Gamification Points**:
- 100/course, 50/skill, assessment score, 10/practice, 10/day streak
- Cumulative lifetime, leaderboards with time windows

---

## 🔒 Security & Privacy

### **Authentication**:
- JWT from MS12 (Auth service)
- Validate on every request

### **Authorization (RBAC)**:
- 3-layer defense: Frontend + Backend Middleware + Database RLS
- Role-based access to analytics
- Ownership checks (users see own data, org admins see org data)

### **Privacy**:
- K-anonymity for comparisons (≥10 users)
- Trainers see student names (own courses only)
- Org admins see worker names (own company only)
- No PII in aggregated data

### **Data Retention**:
- In-memory cache: 24h
- Personal analytics: 7 days
- Aggregated analytics: 7 years (partitioned)

---

## 🎨 UI/UX Requirements

### **Theme**: Dark Emerald
- Primary colors: #065f46, #047857, #0f766e
- Accent colors: #d97706, #f59e0b
- Day/Night mode toggle

### **Accessibility**:
- WCAG 2.2 AA compliant
- Keyboard navigation
- Screen reader friendly
- High contrast mode
- Reduced motion support

### **Responsive**:
- Desktop (1920px+, 1400px+, 1200-1399px)
- Tablet (768-991px)
- Mobile (up to 767px)

### **Charts**:
- Interactive filters
- User-selectable chart types
- ARIA labels for screen readers
- Default chart types provided

---

## 🔗 Integration Requirements

### **9 External Microservices**:
1. Auth (MS12) - JWT validation
2. Directory - Users, orgs, KPIs, value propositions
3. Course Builder - Courses, enrollment, progress
4. Content Studio - Content usage, creation method
5. Assessment - Tests, grades, skill acquisition
6. Skills Engine - Skills, competencies, levels
7. Learner AI - Learning paths, recommendations
8. DevLab - Practice sessions, mastery
9. RAG Assistant (MS9) - Chatbot (REST → gRPC later)

### **API Contracts**:
- Design all 9 contracts (endpoints, auth, schemas)
- Document for MS teams
- Implement with circuit breakers, retries, timeouts
- Mock data fallback (if ≥80% sources available, show partial; if <50%, show "insufficient data")

---

## 🧪 Quality Standards

### **Testing**:
- **Coverage**: 85%+ overall
  - Domain: 95%+
  - Application: 85%+
  - Infrastructure: 70%+
  - Presentation: 80%+
- **Pyramid**: 70% unit, 20% integration, 10% e2e
- **Framework**: Jest (frontend + backend)

### **Code Quality**:
- ESLint + Prettier
- JSDoc for type safety
- Code reviews required
- CI/CD gates (lint, test, security)

### **Performance**:
- Dashboard load: < 2.5s (initial), < 100ms (cached)
- API response: < 500ms (cached)
- Lighthouse score: > 90

---

## 🚀 Deployment

### **Environments**:
- **Staging**: Vercel (frontend) + Railway (backend) + Supabase staging
- **Production**: Vercel (frontend) + Railway (backend) + Supabase production

### **CI/CD**:
- GitHub Actions
- Automated tests on PR
- Deploy on merge to main

### **Monitoring**:
- Health checks: `/health`, `/ready`, `/live`
- Error tracking: Sentry (free tier)
- Uptime: UptimeRobot (free)
- Performance: Vercel Analytics (free)

### **Backups**:
- Supabase automatic backups (daily, 7-day retention)
- Point-in-time recovery (if available)

---

## 📅 Timeline

### **MVP Delivery**: 6-8 weeks

**Week 1**: Infrastructure & Setup
**Week 2-3**: Domain & Application Layer (core analytics logic)
**Week 4-5**: Infrastructure Adapters (Supabase, microservices, cache)
**Week 6**: Presentation Layer (API routes, controllers)
**Week 7**: Frontend (React components, dashboards)
**Week 8**: Testing, Refinement, Deployment

---

## ✅ Success Criteria

### **MVP Launch Criteria**:
- ✅ All 19 analytics implemented
- ✅ 85%+ test coverage achieved
- ✅ < 2.5s dashboard load time validated
- ✅ Zero critical security vulnerabilities
- ✅ All 3 user roles functional
- ✅ Beta users can complete core workflow (login → view analytics → export)
- ✅ Stakeholder sign-off

### **Post-Launch** (Nice-to-have):
- User adoption metrics
- Engagement metrics
- Feature usage metrics
- Performance metrics
- User satisfaction surveys

---

## 📊 Scope Summary

**Total Features**: 25+
- 19 Analytics
- 3 User roles with multi-role support
- Gamification system
- RAG chatbot widget
- 4 export formats
- Comparison dashboard
- Full responsive design

**Total API Endpoints**: 50+
- Analytics endpoints (learner, trainer, org)
- Auth endpoints
- Data collection endpoints
- Integration endpoints
- Report endpoints
- BFF endpoints

**Total Database Tables**: 10+
- analytics
- users
- organizations
- aggregated_analytics
- reports
- jobs (pg-boss)
- RLS policies

**Total Microservice Integrations**: 9
- All with circuit breakers, retries, mock fallbacks

---

## 🔑 Key Constraints

**Technical**:
- Node.js + Express.js (backend)
- React + Vite (frontend)
- PostgreSQL (Supabase)
- Railway (backend hosting)
- Vercel (frontend hosting)
- No Redis (use Railway built-in cache)
- No TypeScript (JavaScript + JSDoc)

**Business**:
- $0 budget for Google Gemini (use mock data)
- 6-8 week timeline
- 10,000+ users target
- Privacy-first (K-anonymity, GDPR compliant)

**Performance**:
- Dashboard load: < 2.5s (initial), < 100ms (cached)
- API response: < 500ms (cached)
- Batch job: < 2 hours for 10k users

---

## 📝 Notes

**Mock Data Strategy**:
- Backend handles all mock data fallback
- Frontend receives data from backend APIs
- Mock data matches real data structure exactly
- All APIs implemented and ready, mock adapters provided

**No Department/Team Analytics in MVP**:
- Focus on individual workers only
- Frontend shows "Coming Soon" for dept/team features
- Can be added in Phase 2

**Java Language**: Not needed (clarified by user)

---

## ✅ Approval

**User**: ✅ APPROVED (all answers provided)  
**TL**: ✅ APPROVED (all debates)  
**PM**: ✅ APPROVED (all debates)  
**SA**: ✅ APPROVED (all debates)  
**SE**: ✅ APPROVED (all debates)  
**FE**: ✅ APPROVED (all debates)  
**BE**: ✅ APPROVED (all debates)  
**DD**: ✅ APPROVED (all debates)  
**DA**: ✅ APPROVED (all debates)  
**PE**: ✅ APPROVED (debate #8)  

**Status**: **SCOPE LOCKED** ✅

---

**Date**: October 24, 2025  
**Version**: 1.0  
**Next**: Phase 1C - Planning (Feature Breakdown)  
**Folder**: `docs/phase_1/`

