# 📋 **LEARNING ANALYTICS MICROSERVICE - REQUIREMENTS SPECIFICATION**

## 🎯 **EXECUTIVE SUMMARY**

**Project**: Learning Analytics Microservice (MS8-Learning-Analytics)  
**Goal**: Collect, analyze, and visualize learning data for role-based dashboards, reports, and AI insights  
**Architecture**: 3-stage processing + 3-layer storage with topic-based learning paths  
**Technology**: JavaScript, Node.js, Vite, PostgreSQL (Supabase), Railway, Vercel  
**Timeline**: 6-phase development with TDD-QA-CodeReview loop  

### **Key Success Metrics**
- ✅ 19 analytics categories implemented and operational
- ✅ Role-based dashboards with SWR pattern (< 100ms cached reads)
- ✅ 90%+ test coverage across all components
- ✅ GDPR-compliant data processing and retention
- ✅ Production deployment on Vercel + Railway + Supabase
- ✅ Security validation with JWT + RBAC + RLS

---

## 🔧 **FUNCTIONAL REQUIREMENTS**

### **FR-001: Data Collection System**
**Description**: Collect learning data from 9 microservices  
**Priority**: Critical  
**Acceptance Criteria**:
- [ ] Stage 1 collection from Directory, Course Builder, Content Studio, Assessment, Skills Engine, Learner AI, DevLab, RAG Assistant, Auth
- [ ] Real-time collection for immediate user actions (< 5s)
- [ ] Batch collection for daily processing (2-4h for 10k users)
- [ ] Data validation and error handling
- [ ] Retry mechanisms with exponential backoff

### **FR-002: Analytics Processing Engine**
**Description**: Process collected data into 19 analytics categories  
**Priority**: Critical  
**Acceptance Criteria**:
- [ ] Stage 2 analysis engine operational
- [ ] Learner analytics (6): velocity, mastery, skill gaps, engagement, assessment performance, content effectiveness
- [ ] Trainer analytics (4): course performance, course health, student distribution, teaching effectiveness
- [ ] Organizational analytics (4): learning velocity, strategic alignment, department metrics, learning culture
- [ ] Predictive analytics (4): drop-off risk, outcome forecasting, recommendations, skill demand
- [ ] Comparison analytics (1): within-org, outside-org, overall benchmarking (k ≥ 10)

### **FR-003: Data Storage & Retention**
**Description**: Implement 3-layer storage architecture  
**Priority**: Critical  
**Acceptance Criteria**:
- [ ] Layer 1: In-memory cache (24h TTL) for speed and live refresh
- [ ] Layer 2: Personal analytics (PostgreSQL, 7 days) for sub-100ms dashboards
- [ ] Layer 3: Aggregated analytics (PostgreSQL partitioned, 7 years) for trends/benchmarks
- [ ] GDPR-compliant retention: 24h raw, 7 days personal, 7 years aggregated (Art. 89)
- [ ] Automatic data cleanup and archival

### **FR-004: Role-Based Dashboards**
**Description**: Provide role-specific analytics dashboards  
**Priority**: Critical  
**Acceptance Criteria**:
- [ ] Learner dashboard: personal skills, topics, progress, engagement, recommendations
- [ ] Trainer dashboard: course performance, health, student distribution, effectiveness metrics
- [ ] Organization dashboard: KPIs, learning culture, strategic alignment, team comparisons
- [ ] SWR pattern: instant cached view with background refresh
- [ ] Freshness indicators and manual refresh (5-minute cooldown)
- [ ] Section configuration and customization

### **FR-005: Report Generation System**
**Description**: Generate and deliver analytics reports  
**Priority**: High  
**Acceptance Criteria**:
- [ ] Async report generation (PDF/CSV/Excel)
- [ ] Status tracking and download management
- [ ] 7-day report expiry with automatic cleanup
- [ ] Concurrency caps per user with retry mechanisms
- [ ] Role-based report content filtering

### **FR-006: AI-Powered Insights**
**Description**: Provide AI-generated learning insights and recommendations  
**Priority**: High  
**Acceptance Criteria**:
- [ ] Google Gemini integration for insights/recommendations
- [ ] 48h cache with graceful fallback on provider failure
- [ ] "Why this recommendation?" explanation with signals used
- [ ] User opt-out capability for AI features
- [ ] Server-side AI calls with rate limiting

### **FR-007: RAG Chatbot Integration**
**Description**: Integrate with existing RAG chatbot service via REST API  
**Priority**: Medium  
**Acceptance Criteria**:
- [ ] REST API integration with existing RAG chatbot service
- [ ] Analytics context passed to chatbot for Q&A
- [ ] Role-based data access for chatbot responses
- [ ] Error handling and fallback mechanisms
- [ ] Rate limiting and security controls

### **FR-008: Privacy & Data Control**
**Description**: Implement GDPR-compliant data management  
**Priority**: Critical  
**Acceptance Criteria**:
- [ ] Data export functionality (access request)
- [ ] Data erasure functionality (right to be forgotten)
- [ ] Data portability support
- [ ] Consent management for AI/benchmarking opt-out
- [ ] Data provenance tracking ("why this recommendation?")
- [ ] Retention transparency (data age/source display)

---

## 🚀 **NON-FUNCTIONAL REQUIREMENTS**

### **NFR-001: Performance Requirements**
**Priority**: Critical  
**Acceptance Criteria**:
- [ ] Cached API responses < 100ms (p95)
- [ ] Live data collection < 5s
- [ ] First-time analysis 30-60s
- [ ] Daily batch processing 2-4h (10k users)
- [ ] Dashboard load time < 2s (initial)
- [ ] Report generation < 30s (async)

### **NFR-002: Security Requirements**
**Priority**: Critical  
**Acceptance Criteria**:
- [ ] MS12 JWT authentication with public key verification
- [ ] Role-based access control (RBAC) enforcement
- [ ] Supabase RLS tenant isolation by organizationId
- [ ] OWASP Top 10 security compliance
- [ ] Rate limiting per role and endpoint
- [ ] Audit logging for all data access (10-year retention)

### **NFR-003: Scalability Requirements**
**Priority**: High  
**Acceptance Criteria**:
- [ ] Support 10k concurrent users
- [ ] Horizontal scaling capability
- [ ] Database partitioning for performance
- [ ] Caching strategy for high-traffic endpoints
- [ ] Load balancing and failover mechanisms

### **NFR-004: Reliability Requirements**
**Priority**: High  
**Acceptance Criteria**:
- [ ] 99.9% uptime SLA
- [ ] Graceful degradation on service failures
- [ ] Circuit breaker patterns for external services
- [ ] Retry mechanisms with exponential backoff
- [ ] Health checks (/health, /ready endpoints)
- [ ] Partial-data UX when services unavailable

### **NFR-005: Compliance Requirements**
**Priority**: Critical  
**Acceptance Criteria**:
- [ ] GDPR compliance (export, erasure, portability)
- [ ] Data retention policy enforcement
- [ ] Privacy by design implementation
- [ ] Consent management system
- [ ] Data anonymization for benchmarking (k ≥ 10)
- [ ] Audit trail for compliance reporting

---

## 📊 **TRACEABILITY MATRIX**

| Requirement ID | Analytics Category | Data Source | User Role | Priority |
|----------------|-------------------|-------------|-----------|----------|
| FR-001 | All | 9 Microservices | All | Critical |
| FR-002 | Learner (6) | Directory, Course Builder, Assessment | Learner | Critical |
| FR-002 | Trainer (4) | Course Builder, Assessment | Trainer | Critical |
| FR-002 | Organization (4) | Directory, Skills Engine | Org HR/Management | Critical |
| FR-002 | Predictive (4) | All sources | All | High |
| FR-002 | Comparison (1) | Aggregated data | All | Medium |
| FR-003 | All | Processed data | System | Critical |
| FR-004 | All | Analytics data | All | Critical |
| FR-005 | All | Analytics data | All | High |
| FR-006 | Predictive | AI provider | All | High |
| FR-007 | All | Analytics data | All | Medium |
| FR-008 | All | User data | All | Critical |

---

## ✅ **ACCEPTANCE CRITERIA**

### **Release Criteria**
- [ ] **Functional**: All 19 analytics categories operational
- [ ] **Performance**: Meets SLA targets (cached < 100ms, live < 5s)
- [ ] **Security**: JWT/RBAC enforced, RLS isolation verified, OWASP clean
- [ ] **Quality**: 90%+ test coverage, no high/critical defects
- [ ] **Compliance**: GDPR export/erase/retention working
- [ ] **Monitoring**: Health checks, structured logs, alerts configured
- [ ] **Deployment**: Production-ready on Vercel + Railway + Supabase

### **Quality Gates**
- [ ] **Linting**: ESLint passes
- [ ] **Testing**: Unit, component, integration, E2E tests pass
- [ ] **Coverage**: ≥ 90% branches/functions/lines/statements
- [ ] **Build**: Production build succeeds
- [ ] **Security**: OWASP Top 10 scans clean
- [ ] **Performance**: Load testing passes SLA requirements

### **User Acceptance**
- [ ] **Learner**: Can view personal analytics, get recommendations, manage privacy
- [ ] **Trainer**: Can monitor course performance, student progress, generate reports
- [ ] **Organization**: Can track KPIs, compare teams, generate organizational reports
- [ ] **Platform Admin**: Can access platform-wide reporting via MS9 integration

---

## 🔄 **BUSINESS RULES**

### **Learning Path Model**
- Learning paths are lists of TOPICS (not courses)
- Topics marked "acquired" only when Assessment → SKILLS mapped to topics by Learner AI
- Enables precise mastery tracking and skill-to-topic recommendations

### **Role-Based Visibility**
- **Learner**: Only own analytics data
- **Trainer**: Own courses + students' analytics (no extra PII)
- **Org HR/Management**: Aggregated org/team analytics only
- **Platform Admin**: Platform-wide reporting via MS9 (not this service)

### **Benchmarking & Privacy**
- Comparisons aggregated/anonymized only (k ≥ 10)
- Three scopes: within-org, outside-org, overall
- Time-based cohort comparisons excluded in v1
- No peer details exposed

### **Analytics Calculations**
- **Learning velocity**: Rate of skill/topic acquisition over time
- **Mastery**: Topic/skill mastered when mapped skill level meets threshold
- **Skill gap priority**: Function of competency delta + org priority + demand
- **Engagement score**: Weighted interactions (time, recency, completion, activity mix)
- **Course health**: Combined completion, ratings, outcomes, drop-off metrics

### **Processing & Storage**
- Stage 1 collect → Stage 2 analyze → Stage 3 aggregate (daily batch)
- Layer 1 cache (in-memory) TTL 24h
- Layer 2 personal analytics 7 days
- Layer 3 aggregated 7 years (GDPR Art. 89)

### **Freshness & SWR Behavior**
- Cached results returned instantly
- Background refresh if stale (> 4h)
- First-time users trigger full analysis (30-60s)
- Manual refresh with 5-minute cooldown per user

---

## 🎯 **NEXT STEPS**

**Phase 1B**: Scope Definition - Define project boundaries, constraints, and success criteria  
**Phase 1C**: Planning - Generate project roadmap, timeline, and technical milestones  

**Ready to proceed to Phase 1B: Scope Definition** ✅
