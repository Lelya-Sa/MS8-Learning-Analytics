# Phase 1B: Scope Definition - User Answers (Part 1/3)

**Phase**: 1B - Scope Definition  
**Date**: October 24, 2025  
**Status**: ✅ PART 1 COMPLETE (Q1-Q4 answered)  
**Roles**: TL, PM, SA, SE, IE, PE, DA

---

## 📋 Summary

This document captures the user's answers to Phase 1B clarifying questions (Part 1: Q1-Q4). These answers will directly inform the Scope Definition Document and updated Project Roadmap.

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

---

### Q4.3: Error Handling - User Experience ✅

**Decision**: **Option A**

**When external MS is down**:
- Show **mock data** + banner
- Banner message: "Skills Engine unavailable, showing cached data from [timestamp]"
- User can still interact with dashboard
- Graceful degradation, not complete failure

---

## 📊 Key Insights & Decisions

### **1. Mock Data Strategy**
- **Backend handles all mock data fallback**
- Frontend receives data from backend APIs
- Backend sends mock data if external microservices unavailable
- All APIs must be implemented and ready

### **2. Privacy & Access Control**
- **K-anonymity for comparisons** (≥ 10 users)
- **Trainers can see student names** in own courses (actionability)
- **Org admins can see worker names** (own company only)
- **No cross-org data leakage**

### **3. Organizational Hierarchy**
- **MVP: Org → Team → Individual**
- **NO department analytics in MVP**
- Focus on individual workers
- Frontend shows "Coming Soon" for dept/team features

### **4. Time Windows**
- **User slider for all time-based analytics**
- **Sensible defaults provided** (7d, 14d, 30d depending on metric)
- Recency weighting where appropriate

### **5. Performance Strategy**
- **Hybrid batch + live**
- Daily batch at 02:00 UTC
- Live recalc every 20min for active users
- Manual refresh available (rate-limited)

---

## ⏳ Status

**Completed**: Q1-Q4 (MVP Scope, User Workflows, Business Rules, Quality Standards)

**Awaiting**:
- Q5: Technical Constraints (browser, mobile, offline)
- Q6: Integration Constraints (API contracts, gRPC/REST, JWT)
- Q7: Deployment & Operations (staging, backups, monitoring)
- Q8: Post-MVP Roadmap (feature prioritization)
- Q9: Success Criteria (launch criteria, metrics)

---

**Next Steps**:
1. User provides answers for Q5-Q9
2. Conduct mediated debate for Q4.2 (Performance Strategy)
3. Document complete Scope Definition
4. Update Project Roadmap
5. Proceed to Phase 1C (Planning)

---

**Date**: October 24, 2025  
**Status**: ✅ PART 1 COMPLETE  
**Next**: Awaiting Q5-Q9 answers

