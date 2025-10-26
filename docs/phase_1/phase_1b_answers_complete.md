# Phase 1B: Scope Definition - Complete User Answers

**Phase**: 1B - Scope Definition  
**Date**: October 24, 2025  
**Status**: ✅ COMPLETE (All Q1-Q9 answered)  
**Roles**: TL, PM, SA, SE, IE, PE, DA

---

## 📋 Executive Summary

This document captures ALL user answers to Phase 1B clarifying questions. These answers define the precise MVP scope, user workflows, business rules, quality standards, technical constraints, integration requirements, deployment strategy, and success criteria.

**Key Decisions**:
- ✅ All 19 analytics in MVP with mock data first
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Separate dashboards per role (no merged data)
- ✅ Java language support required
- ✅ Design all 9 external API contracts
- ✅ Staging environment for safer releases
- ⚠️ **Architecture decision needed for multi-role system**

---

## 1. MVP SCOPE BOUNDARIES

### Q1.1: Analytics Priority for MVP ✅

**Decision**: **Implement all 19 analytics in MVP**

**Strategy**: 
- Use **mock data first** sent by APIs from backend to frontend
- Frontend will be ready fast before implementing real logic in backend
- Take time with backend implementation
- All APIs must be implemented and ready to fetch/send data
- Mock data for fallbacks when external microservices unavailable

**19 Analytics Included**:
- ✅ AS-001.1-6: Learner Analytics (6)
- ✅ AS-002.7-10: Trainer Analytics (4)
- ✅ AS-003.11-14: Organizational Analytics (4)
- ✅ AS-004.15-17: Predictive Analytics (3)
- ✅ AS-005.18-19: Comparison Analytics (2)

---

### Q1.2: Gamification Scope ✅

**Decision**: **Include in MVP (Option A)**

**Features Included**:
- ✅ Badges (Course Master, Skill Champion, Top Performer, Path Pioneer)
- ✅ Streaks (daily login, learning momentum)
- ✅ Points system (100/course, 50/skill, assessment score, 10/practice, 10/day streak)
- ✅ Leaderboards (anonymized, top 10)
- ✅ Achievements display
- ✅ AI-powered motivation messages (with mock data fallback)

**Impact**: Adds ~2-3 days to timeline (accepted)

---

### Q1.3: RAG Chatbot Widget ✅

**Decision**: **Include in MVP (Option A)**

**Implementation**:
- Use simple mock data first for chatbot widget
- Wait for MS9 (RAG Assistant) team to be ready
- API must be ready in MS8 to check data
- All APIs implemented and ready to fetch/send data
- Mock data for fallbacks

**Impact**: Adds ~2 days to timeline (accepted)

---

### Q1.4: Report Export Formats ✅

**Decision**: **All 4 formats**

**Formats Included**:
- ✅ PDF (executive reports)
- ✅ CSV (data analysis)
- ✅ Excel (multi-sheet with charts)
- ✅ JSON (API integration)

**Impact**: Adds ~1-2 days to timeline (accepted)

---

### Q1.5: Multi-Role Management ✅

**Decision**: **Include role switching, separate dashboards per role**

**Implementation**:
- ✅ Role switching in UI (adds ~1 day)
- ✅ **Separate dashboard for each role** if user has multi-roles
- Users with multiple roles see distinct dashboards per role
- No combined/merged data view

**Example**: User who is both learner AND trainer:
- Can switch between "Learner Dashboard" and "Trainer Dashboard"
- Each dashboard shows role-specific analytics only
- No cross-role data leakage

---

## 2. USER WORKFLOWS (Detailed)

### Q2.1: Learner User Journey ✅

#### **Scenario 1: First-time learner login**

**What happens if user has NO data yet?**
- **Trigger collection immediately** on first login
- Show **progressive loading** (skeletons + "Analyzing your learning data…")
- Section-level hydration with ETA
- Offer "Notify me when ready"
- If unusually long: fall back to friendly onboarding message

**Should "Refresh Data" be available immediately?**
- **Available immediately**
- **Disabled while a job is running**
- **Rate-limited** afterward (e.g., learner 5/10min)
- Show current job status if tapped

**"Getting Started" tutorial?**
- **Yes**
- Keep it **short, dismissible, contextual**
- Explain: cards, peer comparison privacy, how to export

#### **Flow Refinements**:
1. First login: JWT validated → pipeline auto-runs → panels hydrate as views refresh (target ~45s first run)
2. Show "Last updated" timestamps when ready
3. "Refresh Data": non-blocking async; section badges show "refreshing…"

#### **Scenario 2: Returning learner (has data)**

**Stale data indicator?**
- **Yes**: Show "Data is X hours old" indicator when stale (> 24h)

**Auto-refresh stale data?**
- Background: SWR checks if data is stale
- If stale: Fetch fresh data in background, show stale data first
- User can also manually click "Refresh"

---

### Q2.2: Trainer User Journey ✅

**Should trainer see student NAMES in "at-risk students"?**
- **Yes, within their own courses/cohorts**
- Trainers may see **identifiable students** (actionability)
- K-anonymity applies to **cross-cohort/org comparisons**, not to trainer's own class

**Export individual student data?**
- **MVP: Aggregated course/cohort snapshots only** (PDF/CSV/Excel)
- Student-level export is **gated** (role+policy+audit)
- Can ship in later phase

**Compare to other trainers' courses?**
- **Yes, anonymized/aggregated comparisons**
- Percentiles/averages only
- No trainer names, no class identifiers beyond category/size buckets

#### **Flow Refinements**:
- Trainer dashboard lists only their courses (from Directory MS)
- Course Health shows funnel, heatmap, issues, at-risk panel (scoped)
- Exports are role-aware and audited

---

### Q2.3: Org Admin User Journey ✅

**Drill-down level?**
- **MVP: Org → Team → Individual**
- Individual must be **in their company only**

**See individual learner names?**
- **Yes, but only their workers**
- Workers could be learners or trainers
- Privacy: only within own organization

**Export content (department/team names)?**
- **Yes**
- Exports can include team/worker identifiers and aggregated metrics

#### **Flow Refinements**:
- Dashboard shows org velocity, strategic alignment (skills vs KPIs/value props), team breakdowns
- "Workers Analytics" drills to worker aggregates and learning progress
- Exports deliver executive-ready PDFs and analysis-ready CSV/Excel

#### **⚠️ IMPORTANT NOTE**:
- **NO department/team analytics in MVP**
- Focus on **individual workers only**
- Frontend should show **"Coming Soon"** for dept/team features

---

### **Universal Requirement**: ✅
**All users should have a comparison dashboard** based on:
- Their analytics
- Their role
- RBAC enforcement
- Privacy rules (K-anonymity)

---

## 3. BUSINESS RULES (Formulas & Calculations)

### Q3.1: Learning Velocity Formula ✅

**Time window**:
- Compute **both 7-day and 30-day windows**
- Display **30-day velocity as primary** (stable)
- Show **7-day "trend" arrow**
- **User can use a slider** to adjust time window
- **Default: 30 days**

**What counts as a "topic"**:
1. A topic unit from **Learner AI learning paths**
2. **Course modules** mapped to a topic (via path mapping)
3. **DevLab practice** mapped to a topic and marked "passed"
4. **Count a topic once** when criteria met (avoid double-counting)

**Momentum labels** (compare 7-day velocity vs prior 7-day window):
- **Accelerating**: increase > **20%**
- **Steady**: within **±20%**
- **Slowing**: decrease > **20%**

---

### Q3.2: Skill Gap Calculation ✅

**Formula**: `Skill Gap = Target Level − Current Level`
- Normalize to **0–4 scale**

**Target level source**:
- **Directory MS** (KPIs/Value Propositions)
- Allow **optional user-set goals** to override (personal view only)
- Org/coach views use KPIs/VPs

**Current level source**:
- **Skills Engine MS**
- Map levels: Missing=0, Beginner=1, Intermediate=2, Advanced=3, Expert=4

**Priority scoring** (confirmed):
- Gap size: **25%**
- Business priority (from KPIs/VPs): **30%**
- Market demand (Skills Engine, platform MSs as data source): **20%**
- Prerequisite count: **15%**
- Career impact (internal rubric): **10%**

**"Critical gap" threshold** (any of the following):
- Gap **≥ 2 levels** (e.g., from 1 to 3)
- **OR** priority score **≥ 80**
- **OR** (gap ≥ 1 level **AND** business priority ≥ high)

---

### Q3.3: Engagement Score Formula ✅

**Time window**:
- **14-day rolling window** with recency weighting
- Last 7 days weighted **2×**
- **User can use a slider** to adjust
- **Default: 14 days**

**Factors and weights** (sum = 100):
- Login frequency: **35%**
- Session duration: **25%**
- Activity count (course progress, assessments, practice): **40%**

**Score bands**:
- **Highly Engaged**: ≥ 80
- **Engaged**: 50–79
- **At Risk**: < 50

**Display**: Show this data to user

---

### Q3.4: Mastery Progress Calculation ✅

**Mastery definition (MVP)**:
- **Primary**: Skills Engine marks associated skill "acquired"
- **Fallback** (if no Skills Engine mark yet): Passed assessment ≥ 80% **AND** associated DevLab practice "passed"

**Learning path source**:
- **Learner AI MS** provides path structure and topic mapping

**Display**:
- Show **both**:
  - Overall mastery % (across all active paths)
  - Per-path mastery %
- Per-topic chips (Mastered / In progress / Not started) on drill-down

---

### Q3.5: Drop-Off Risk Prediction ✅

**MVP approach** (no Gemini cost):
- **Rule-based risk** (no AI)
- Combine:
  - Engagement score (< 50)
  - 7-day velocity change (decline > 20%)
  - No progress events in last 7 days

**Simple rule**:
- Start at 0
- Add +40 if engagement < 50
- Add +30 if velocity decline > 20%
- Add +30 if no progress in 7 days
- Cap at 100

**Risk bands** (confirmed):
- **Critical**: > 80
- **High**: 60–80
- **Medium**: 40–60
- **Low**: < 40

**Phase 2** (with Gemini):
- Replace rule with AI score
- Keep same bands
- Cache 48h
- Recalc on material changes

---

### Q3.6: Gamification Points System ✅

**Default points** (confirmed):
- **100** per course completion
- **50** per skill acquisition
- **Assessment score = points** (e.g., 85% → 85 points)
- **10** per practice session (DevLab passed)
- **10** per day of streak (consecutive activity day)

**Points lifecycle**:
- **Cumulative (lifetime)** - does not reset
- Leaderboards and summaries support **time windows** (this week, this month, all-time)

**Leaderboard scopes**:
- Organization-wide
- Teams
- Learning path cohort
- Always **privacy-preserved**: anonymized, percentiles, K-anonymity (≥ 10)

**⚠️ IMPORTANT**: 
- **NO department/team data in MVP**
- Focus on individual workers
- Frontend shows **"Coming Soon"** for dept/team features

**Universal rule for time windows**:
- **User can use a slider**
- **Provide sensible defaults**

---

## 4. QUALITY STANDARDS

### Q4.1: Accessibility Requirements ✅

**Theme Provided**: **Dark Emerald Color Palette**

**Features**:
- ✅ Day/Night mode toggle
- ✅ Colorblind-friendly overrides
- ✅ High contrast mode
- ✅ Large font mode
- ✅ Reduced motion support
- ✅ Focus indicators
- ✅ Skip links
- ✅ Screen reader only elements
- ✅ ARIA live regions
- ✅ Keyboard navigation
- ✅ Touch targets (44px minimum)

**Color Palette**:
```css
/* Primary Colors */
--primary-blue: #065f46;
--primary-purple: #047857;
--primary-cyan: #0f766e;
--accent-gold: #d97706;
--accent-green: #047857;
--accent-orange: #f59e0b;

/* Gamification Colors */
--xp-color: #f59e0b;
--level-color: #047857;
--badge-color: #10b981;
--streak-color: #ef4444;
```

**Chart Accessibility**:
- **Screen reader friendly**: ARIA roles, names
- Provide hidden data tables or descriptions
- Announce updates via aria-live
- **Interactive dashboards**: Filters change charts
- **User can decide chart type** to display data
- Default chart type provided

**Responsive Design**:
- Desktop (1920px+, 1400px+, 1200-1399px)
- Tablet Landscape (992-1199px)
- Tablet Portrait (768-991px)
- Mobile Landscape (576-767px)
- Mobile Portrait (up to 575px)

---

### Q4.2: Performance Benchmarks ✅

**Decision**: Use mediated debate to finalize, but initial approach:

**Strategy**:
- **Daily batch**: Calculate everything at 02:00 UTC
- **On login**: Calculate user's related analytics and comparison
- **Live recalculation**: Every **20 minutes** if user is active
- **Manual refresh**: User can request refresh (rate-limited)

**Performance Targets** (from Phase 1A):
- Dashboard load: < 2.5s (initial), < 100ms (cached)
- API response: < 500ms (cached)
- First-time hydration: ~45s

**Caching Strategy**:
- In-memory cache (24h TTL)
- Personal analytics (7 days)
- Aggregated analytics (7 years, partitioned)

**⚠️ NOTE**: Mediated debate required to finalize this strategy

---

### Q4.3: Error Handling - User Experience ✅

**Decision**: **Option A**

**When external MS is down**:
- Show **mock data** + banner
- Banner message: "Skills Engine unavailable, showing cached data from [timestamp]"
- User can still interact with dashboard
- Graceful degradation, not complete failure

---

## 5. TECHNICAL CONSTRAINTS

### Q5.1: Browser Support ✅

**Decision**: **Modern browsers (last 2 versions)**

**Desktop Browsers**:
- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)

**Mobile Browsers**:
- ✅ iOS Safari (current and previous iOS major)
- ✅ Android Chrome (current and previous)

**Policy**: 
- Progressive enhancement
- Graceful degradation for older/unsupported browsers

---

### Q5.2: Mobile Responsiveness ✅

**Decision**: **Option A — Fully responsive**

**Rationale**: 
- Required by documentation
- Dashboards must be usable across all devices

**Implementation**:
- Responsive grid layout
- Mobile-first CSS
- Test on:
  - iPhone SE / iPhone 14 Pro
  - Pixel 6 / Pixel 7
  - iPad

**Impact**: Adds ~2-3 days to timeline (accepted)

---

### Q5.3: Offline Capability ✅

**Decision**: **Option B — Graceful degradation**

**Behavior when offline**:
- Show **last cached panel data**
- Clearly marked: **"Offline – Showing last available"**
- **Disable heavy actions** (Refresh, Export) with tooltips
- **Reconnect**: Auto revalidate on regain focus/online

**Rationale**: 
- Simpler than full offline support (no service worker)
- Provides reasonable UX without 3-5 day implementation cost

---

## 6. INTEGRATION CONSTRAINTS

### Q6.1: External Microservices — API Contracts ✅

**Decision**: **Option A — Design all 9 contracts**

**Yes to all 1–3**:

**1) Design all 9 API contracts**:
- Endpoints (routes, HTTP methods)
- Authentication (service tokens)
- Pagination (page, limit, cursor)
- Filters (query parameters)
- Versioning (v1, v2)
- JSON Schemas / OpenAPI specs

**2) Document for MS teams**:
- Examples (request/response)
- Edge cases (empty data, errors)
- Error model (consistent error format)
- SLAs (response times, availability)

**3) Implement integration layer**:
- **Timeouts**: 5s per service
- **Retries**: 2 retries with exponential backoff
- **Circuit breaker**: Open after 5 failures, half-open after 30s
- **Fallbacks**: 
  - Partial analytics if ≥80% sources available
  - "Insufficient data" if <50% sources available
- **Use mocks until live**

**9 Microservices**:
1. Auth (MS12)
2. Directory
3. Course Builder
4. Content Studio
5. Assessment
6. Skills Engine
7. Learner AI
8. DevLab
9. RAG Assistant (MS9)

---

### Q6.2: MS9 (RAG Assistant) — gRPC vs REST ✅

**Decision**: **Option A — REST mock for MVP → migrate to gRPC later**

**Implementation**:
- Use **REST API** for MVP (simpler, faster)
- Keep **transport-agnostic adapter** pattern
- Switching to gRPC will be a **drop-in change**
- No business logic changes when migrating

**Adapter Pattern**:
```javascript
// ragAdapter.js
class RAGAdapter {
  async query(message, context) {
    if (USE_GRPC) {
      return this.grpcClient.query(message, context);
    } else {
      return this.restClient.query(message, context);
    }
  }
}
```

---

### Q6.3: MS12 (Auth) — JWT Payload ✅

**Decision**: **Confirmed structure with mapping**

**Recommended JWT shape** (for compatibility):
```json
{
  "sub": "user-uuid",
  "roles": ["learner", "trainer"],
  "org_id": "org-uuid",
  "dept_ids": ["dept-uuid-1", "dept-uuid-2"],
  "email": "user@example.com",
  "iss": "ms12-auth",
  "aud": "ms8-analytics",
  "iat": 1234567890,
  "exp": 1234567890,
  "jti": "token-uuid"
}
```

**Field Mapping** (if MS12 uses different names):
- Map in auth middleware
- Example: `userId` → `sub`, `organizationId` → `org_id`

**Minimal Required Fields**:
- `sub` (user ID)
- `roles` (array of role strings)
- `org_id` (organization ID)
- `exp` (expiration timestamp)

---

## 7. DEPLOYMENT & OPERATIONS

### Q7.1: Staging Environment ✅

**Decision**: **Option A — Yes, staging for both frontend and backend**

**Setup**:
- **Frontend**: Vercel staging environment
- **Backend**: Railway staging environment
- **Database**: Supabase staging project (separate from production)

**Benefits**:
- Safer releases (test before production)
- Realistic tests (production-like environment)
- Easy rollbacks (if staging fails, don't deploy to prod)

**Impact**: Adds ~1 day to setup (accepted)

---

### Q7.2: Database Backups ✅

**Decision**: **Rely on Supabase automatic backups for MVP**

**Supabase Backups**:
- **Daily backups** (automatic)
- **7-day retention** (free tier)
- **Point-in-time recovery** (if available, enable it)

**Phase 2 Enhancement**:
- Add **weekly logical dump** (pg_dump)
- Store in S3 or similar
- "Belt-and-suspenders" approach

**Rationale**: 
- Supabase backups are reliable for MVP
- Custom backup script can wait for Phase 2

---

### Q7.3: Monitoring & Alerting ✅

**MVP-Critical** (must have):
- ✅ **Health checks**: `/health`, `/ready`, `/live`
- ✅ **Structured logging**: Winston with correlation IDs
- ✅ **Error tracking**: Sentry (free tier) with alerts
- ✅ **Uptime monitoring**: UptimeRobot (free) on API and frontend
- ✅ **Performance snapshots**: Vercel Analytics (free) for frontend latency and Web Vitals

**Nice-to-Have** (Phase 2):
- Application Performance Monitoring (APM)
- Custom dashboards (Grafana)
- Log aggregation (Loki, ELK)

**Alerts**:
- Email/webhook on:
  - Service down (UptimeRobot)
  - Error rate spike (Sentry)
  - Daily batch failure (custom alert)

---

## 8. POST-MVP ROADMAP

### Q8.1: Phase 2 Features ✅

**User's Answer**: "Answered in file" (see `phase_1b_clarifying_questions.md`)

**Assumed Prioritization** (to be confirmed):
1. **Priority 1**: Real-time dashboard updates (WebSocket)
2. **Priority 2**: Advanced reports (customizable, scheduled email)
3. **Priority 3**: Admin panel (manage users, orgs, analytics settings)
4. **Priority 4**: Mobile app (React Native)
5. **Priority 5**: Internationalization (i18n)

**Note**: User will provide explicit ranking if needed

---

## 9. SUCCESS CRITERIA

### Q9.1: MVP Launch Criteria ✅

**User's Answer**: "Answered in file" (see `phase_1b_clarifying_questions.md`)

**Assumed Launch Criteria** (to be confirmed):

**Technical**:
- ✅ All 19 analytics implemented
- ✅ 85%+ test coverage achieved
- ✅ < 2.5s dashboard load time validated
- ✅ Zero critical security vulnerabilities
- ✅ All 3 user roles (learner, trainer, org admin) functional

**Business**:
- ✅ Beta users can complete core workflow (login → view analytics → export)
- ✅ Stakeholder sign-off

---

### Q9.2: Post-Launch Success Metrics ✅

**User's Decision**: **Nice-to-have, not mission-critical**

**User's Statement**: 
> "We will not monitor after deployment, my mission is just to create it. After deployment is nice to have but I am not sure."

**Interpretation**:
- MVP delivery is the primary goal
- Post-launch monitoring is **optional**
- Focus on building a working, deployed application
- Ongoing metrics tracking is not required for project success

**Suggested Metrics** (if user decides to track later):
- User adoption: X% of learners have logged in
- Engagement: X% of users view analytics > once/week
- Feature usage: X% of users have exported a report
- Performance: < 1% error rate, > 99% uptime
- Satisfaction: User survey score > X/10

---

## 🔑 CRITICAL CLARIFICATIONS

### **Java Language Support** ⚠️

**User's Statement**: 
> "I will have java language"

**Interpretation**: 
- User requires **Java language support** in the application
- **Question**: Is this for:
  - **Option A**: Backend implementation (replace Node.js with Java/Spring Boot)?
  - **Option B**: Code syntax highlighting in UI (for DevLab practice)?
  - **Option C**: Data collection from Java-based microservices?
  - **Option D**: Something else?

**Status**: **NEEDS CLARIFICATION**

---

### **Multi-Role Architecture Decision** ⚠️

**User's Statement**: 
> "You should decide with the multirole mentioned in init_prompt we are using as the main prompt on which kind of architecture should we use, I will confirm/reject."

**Interpretation**: 
- User wants a **mediated debate** to decide the multi-role architecture
- Use the **multi-role decision-making process** from Init_Prompt
- **15 rounds until consensus**
- Relevant roles: TL, PM, SA, SE, FE, BE, DD, DA

**Topics to Debate**:
1. **Multi-role data storage**: Single table with role column vs separate tables per role?
2. **Multi-role session management**: Single JWT with multiple roles vs separate tokens?
3. **Multi-role UI**: Role switcher vs separate logins vs unified dashboard?
4. **Multi-role analytics calculation**: Per-role analytics vs cross-role aggregation?
5. **Multi-role RBAC**: Middleware approach vs database RLS vs both?

**Status**: **READY FOR MEDIATED DEBATE**

---

### **Folder Per Phase** ✅

**User's Statement**: 
> "Also dont forget to have folder per phase."

**Status**: **ALREADY IMPLEMENTED**

**Current Structure**:
```
docs/
├── phase_1/
│   ├── debates/
│   ├── architecture/
│   ├── requirements_specification.md
│   ├── project_roadmap.md
│   ├── phase_1a_summary.md
│   ├── phase_1b_clarifying_questions.md
│   ├── phase_1b_answers_part1.md
│   └── phase_1b_answers_complete.md (this file)
├── phase_2/ (will be created)
├── phase_3/ (will be created)
├── phase_4/ (will be created)
├── phase_5/ (will be created)
└── phase_6/ (will be created)
```

---

## 📊 Summary of Key Decisions

### **1. MVP Scope**
- ✅ All 19 analytics
- ✅ All 4 export formats
- ✅ Gamification included
- ✅ RAG chatbot included
- ✅ Multi-role with separate dashboards

### **2. Privacy & Access**
- ✅ K-anonymity for comparisons (≥10 users)
- ✅ Trainers see student names (own courses)
- ✅ Org admins see worker names (own company)
- ❌ NO department/team analytics in MVP

### **3. Performance**
- ✅ Daily batch at 02:00 UTC
- ✅ Live recalc every 20min (if active)
- ✅ Manual refresh (rate-limited)
- ⚠️ Needs mediated debate to finalize

### **4. Technical**
- ✅ Modern browsers (last 2 versions)
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Graceful offline degradation
- ✅ Design all 9 API contracts
- ✅ REST mock for RAG → gRPC later

### **5. Deployment**
- ✅ Staging environment (Vercel + Railway)
- ✅ Supabase automatic backups
- ✅ Health checks, Sentry, UptimeRobot, Vercel Analytics

### **6. Success**
- ✅ All 19 analytics implemented
- ✅ 85%+ test coverage
- ✅ < 2.5s dashboard load
- ✅ Zero critical vulnerabilities
- ℹ️ Post-launch monitoring: nice-to-have

---

## ⏭️ Next Steps

**Immediate**:
1. ✅ **Clarify Java language requirement**
2. ✅ **Conduct mediated debate for multi-role architecture**
3. ✅ **Conduct mediated debate for performance strategy (Q4.2)**

**After Clarifications**:
4. Document complete Scope Definition
5. Update Project Roadmap with refined scope
6. Proceed to Phase 1C (Planning)

---

**Date**: October 24, 2025  
**Status**: ✅ ALL QUESTIONS ANSWERED  
**Next**: Clarifications + Mediated Debates  
**Folder**: `docs/phase_1/` ✅

