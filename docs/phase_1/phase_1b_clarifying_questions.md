# Phase 1B: Scope Definition - Clarifying Questions

**Phase**: 1B - Scope Definition  
**Date**: October 24, 2025  
**Status**: ⏳ AWAITING USER RESPONSES  
**Roles**: TL, PM, SA, SE, IE, PE, DA

---

## 📋 Purpose

As per Init_Prompt Phase 1B Step 3, this document contains **detailed clarifying questions** to precisely define the project scope, user workflows, business rules, and quality standards.

**User: Please answer these questions to help us define the exact MVP scope and prepare for Phase 1C (Planning).**

---

## 1. MVP SCOPE BOUNDARIES

### Q1.1: Analytics Priority for MVP

From your previous answers, you want to implement **all 19 analytics**. However, for risk mitigation and faster MVP delivery, we should prioritize:

**Which analytics are CRITICAL for MVP launch** (must-have, users cannot use the product without them)?

- [ ] AS-001.1: Learning Velocity & Momentum
- [ ] AS-001.2: Skill Gap Matrix
- [ ] AS-001.3: Engagement Score
- [ ] AS-001.4: Mastery Progress
- [ ] AS-001.5: Performance & Assessment
- [ ] AS-001.6: Course & Content Effectiveness
- [ ] AS-002.7: Course Performance Dashboard
- [ ] AS-002.8: Course Health Dashboard
- [ ] AS-002.9: Student Performance Distribution
- [ ] AS-002.10: Teaching Effectiveness
- [ ] AS-003.11: Organizational Learning Velocity
- [ ] AS-003.12: Strategic Alignment Tracking
- [ ] AS-003.13: Department & Team Analytics
- [ ] AS-003.14: Learning Culture Metrics
- [ ] AS-004.15: Drop-Off Risk Prediction (AI)
- [ ] AS-004.16: Learning Outcome Forecasting (AI)
- [ ] AS-004.17: Personalized Recommendations (AI)
- [ ] AS-005.18: Platform Skill Demand Analytics
- [ ] AS-005.19: Peer Comparison (Privacy-Preserved)

**Suggested prioritization** (please confirm or adjust):
- **Phase 1 MVP (Week 3-6)**: AS-001 (1-4), AS-003.11, AS-004.15, AS-004.17, AS-005.19 = **8 analytics**
- **Phase 2 (Post-MVP)**: Remaining 11 analytics

**Your decision**: ?

---

### Q1.2: Gamification Scope

**Gamification features** (badges, streaks, points, leaderboards):

**Option A**: Include in MVP (adds ~2-3 days to timeline)  
**Option B**: Defer to Phase 2 (focus on core analytics first)

**Your decision**: ?

**If Option A**, which gamification features are MVP-critical:
- [ ] Badges (Course Master, Skill Champion, Top Performer, Path Pioneer)
- [ ] Streaks (daily login, learning momentum)
- [ ] Points system (100/course, 50/skill, etc.)
- [ ] Leaderboards (anonymized, top 10)
- [ ] Achievements display
- [ ] AI-powered motivation messages

---

### Q1.3: RAG Chatbot Widget

The RAG chatbot widget (FR-006) allows conversational analytics:

**Option A**: Include in MVP (adds ~2 days, requires gRPC or REST mock to MS9)  
**Option B**: Defer to Phase 2 (focus on dashboards first)

**Your decision**: ?

---

### Q1.4: Report Export Formats

Report export supports PDF, CSV, Excel, JSON:

**For MVP, which formats are critical**:
- [ ] PDF (executive reports)
- [ ] CSV (data analysis)
- [ ] Excel (multi-sheet with charts)
- [ ] JSON (API integration)

**Or all 4 formats** (adds ~1-2 days)?

**Your decision**: ?

---

### Q1.5: Multi-Role Management

Multi-role users can have multiple roles (learner + trainer + org_admin):

**For MVP**:
- **Role switching in UI**: Include? (adds ~1 day)
- **Multi-role analytics**: Should a user who is both learner AND trainer see combined data or separate dashboards?

**Your decision**: ?

---

## 2. USER WORKFLOWS (Detailed)

### Q2.1: Learner User Journey - Detailed Flow

Please confirm/refine this learner workflow:

**Scenario 1: First-time learner login**
1. User logs in via MS12 → MS8 receives JWT
2. MS8 checks: Does user have analytics data?
   - **No data**: Show onboarding screen ("We're collecting your data, check back in 24 hours") OR trigger fresh data collection immediately?
   - **Has data**: Show dashboard
3. Dashboard displays:
   - Overview cards (velocity, skill gap, engagement, mastery)
   - Action buttons (Refresh Data, Export Report, View Recommendations)
4. User can:
   - Click on analytics card → navigate to detailed page
   - Click "Refresh Data" → trigger async job, show progress
   - Click "Export Report" → select format, download

**Questions**:
- What should happen if user has NO data yet? (onboarding screen vs trigger collection?)
- Should "Refresh Data" be available immediately or only after 24h?
- Should we show a "Getting Started" tutorial for first-time users?

**Your answers**: ?

---

**Scenario 2: Returning learner (has data)**
1. Login → Dashboard loads with cached data (< 100ms)
2. Background: SWR checks if data is stale (> 24h)
   - If stale: Fetch fresh data in background, show stale data first
   - If fresh: No fetch
3. User sees: Dashboard with all 6 learner analytics
4. User actions:
   - View detailed analytics (drill-down)
   - Compare to peers (anonymized)
   - Export report
   - View AI recommendations

**Questions**:
- Should stale data show a "Data is X hours old" indicator?
- Should we auto-refresh stale data or wait for user to click "Refresh"?

**Your answers**: ?

---

### Q2.2: Trainer User Journey - Detailed Flow

**Scenario: Trainer wants to check course health**
1. Login → Trainer Dashboard
2. Dashboard shows:
   - List of courses trainer teaches (from Directory MS)
   - Key metrics per course (completion rate, health score, at-risk students)
3. Trainer selects a course → Course Health Dashboard
4. Dashboard shows:
   - Drop-off funnel
   - Activity heatmap
   - Problem areas
   - At-risk students (anonymized count, not names in MVP?)
5. Trainer can:
   - Export course snapshot (PDF or CSV?)
   - Drill down to student distribution
   - (Future: Message at-risk students, not in MVP?)

**Questions**:
- Should trainer see student NAMES in "at-risk students" or just COUNT?
- Can trainer export individual student data or only aggregated course data?
- Should trainer be able to compare their courses to other trainers' courses (anonymized)?

**Your answers**: ?

---

### Q2.3: Org Admin User Journey - Detailed Flow

**Scenario: Org admin wants to track strategic alignment**
1. Login → Org Admin Dashboard
2. Dashboard shows:
   - Org-wide velocity
   - Strategic alignment (skills coverage vs KPIs/value propositions)
   - Department breakdown (high-level)
3. Admin clicks "Department Analytics" → Drill down
4. Shows:
   - Department-level velocity
   - Team-level skills coverage
   - (Privacy-preserved: aggregated only, no individual names)
5. Admin can:
   - Drill down: Org → Department → Team (aggregated)
   - Export executive report (PDF with charts?)
   - Compare departments (anonymized)

**Questions**:
- At what level can admin drill down? (Org → Dept → Team → Individual, or stop at Team?)
- Should admin see individual learner names or only aggregated team data?
- Can admin export data with department/team names or fully anonymized?

**Your answers**: ?

---

## 3. BUSINESS RULES (Formulas & Calculations)

### Q3.1: Learning Velocity Formula

**Learning Velocity = Topics completed per week**

**Questions**:
- **Time window**: Last 7 days, last 30 days, or both?
- **"Topics"**: What counts as a topic? (Course module? Learning path topic? DevLab practice topic?)
- **Momentum labels**: 
  - Accelerating: velocity increasing by > X%?
  - Steady: velocity stable within ±X%?
  - Slowing: velocity decreasing by > X%?
  - What should X be? (e.g., 20%?)

**Your answers**: ?

---

### Q3.2: Skill Gap Calculation

**Skill Gap = Target Level - Current Level**

**Questions**:
- **Target Level source**: From KPIs/Value Propositions (Directory MS) or user-set goals?
- **Current Level source**: From Skills Engine MS (competency level: Missing, Beginner, Intermediate, Advanced, Expert)
- **Priority Scoring**: You mentioned:
  - Gap size: 25% weight
  - Business priority: 30% weight
  - Market demand: 20% weight
  - Prerequisite count: 15% weight
  - Career impact: 10% weight
  
  **Confirm these weights** or adjust?

- **"Critical Gaps"**: What threshold defines a critical gap? (Gap > 50%? Priority score > 80?)

**Your answers**: ?

---

### Q3.3: Engagement Score Formula

**Engagement Score (0-100) based on**:
- Login frequency
- Session duration
- Activity count (course progress, assessments taken, practice sessions)

**Questions**:
- **Weights**: What percentage weight for each factor?
  - Login frequency: X%
  - Session duration: Y%
  - Activity count: Z%
  
  (Should total 100%)

- **Time window**: Last 7 days, 30 days, or rolling average?
- **Thresholds for labels**:
  - Highly Engaged: Score > ?
  - Engaged: Score ?
  - At Risk: Score < ?

**Your answers**: ?

---

### Q3.4: Mastery Progress Calculation

**Mastery = (Topics Mastered / Total Topics in Learning Path) × 100**

**Questions**:
- **"Mastered" definition**: 
  - Option A: Passed assessment with score > 80%?
  - Option B: Completed topic + DevLab practice passed?
  - Option C: Skills Engine marks skill as "acquired"?
  
  Which criteria defines mastery?

- **Learning Path source**: Learner AI MS provides learning paths?
- **Display**: Should we show:
  - Overall mastery % (across all paths)?
  - Per-path mastery % (separate)?
  - Both?

**Your answers**: ?

---

### Q3.5: Drop-Off Risk Prediction

**Drop-Off Risk uses AI (Google Gemini) to predict risk based on**:
- Recent activity decline
- Engagement drop
- Progress stagnation

**Questions**:
- **For MVP**: Since we have $0 Gemini budget, should we:
  - **Option A**: Use rule-based risk (no AI, simple thresholds: if engagement < 30 AND velocity declining → high risk)
  - **Option B**: Mock AI responses (fake risk scores until Gemini key available)
  - **Option C**: Skip drop-off risk in MVP (defer to Phase 2)

- **Risk levels**: Confirm thresholds:
  - Critical: Risk score > 80?
  - High: 60-80?
  - Medium: 40-60?
  - Low: < 40?

**Your answers**: ?

---

### Q3.6: Gamification Points System

You mentioned default points:
- 100 per course completion
- 50 per skill acquisition
- Assessment score (1:1, e.g., score 85 = 85 points)
- 10 per practice session
- 5 per day of streak

**Questions**:
- **Confirm these values** or adjust?
- **Points reset**: Do points reset monthly/yearly, or cumulative forever?
- **Leaderboards**: 
  - Time-based (this week, this month, all-time)?
  - Scope (org-wide, department, learning path cohort)?

**Your answers**: ?

---

## 4. QUALITY STANDARDS

### Q4.1: Accessibility Requirements

**WCAG 2.2 AA compliance** is required. Confirm priorities:

**MVP Must-Have**:
- [ ] Semantic HTML (headings, landmarks, alt text)
- [ ] Keyboard navigation (all interactive elements accessible)
- [ ] Color contrast (4.5:1 text, 3:1 UI components)
- [ ] Focus indicators (visible focus on tab)
- [ ] Screen reader friendly (ARIA labels for charts)

**Defer to Phase 2**:
- [ ] High contrast mode
- [ ] Font size adjustments
- [ ] Reduced motion support
- [ ] Multiple language support (i18n)

**Confirm or adjust?**

**Your answer**: ?

---

### Q4.2: Performance Benchmarks - Clarify Edge Cases

Performance targets defined:
- Dashboard load: < 2.5s (initial), < 100ms (cached)
- API response: < 500ms (cached)

**Questions**:
- **Slow network**: What if user has 3G connection? Should we show low-bandwidth mode?
- **Large datasets**: What if org has 10,000+ users? Should we paginate department analytics?
- **Real-time updates**: Should dashboard auto-refresh every X minutes, or only on user action?

**Your answers**: ?

---

### Q4.3: Error Handling - User Experience

**When external MS is down** (e.g., Skills Engine unavailable):

**Option A**: Show mock data + banner ("Skills Engine unavailable, showing cached data from [timestamp]")  
**Option B**: Show empty state + message ("Unable to load skills data, try refreshing")  
**Option C**: Partial dashboard (show available data, hide unavailable sections)

**Which approach for MVP**?

**Your answer**: ?

---

## 5. TECHNICAL CONSTRAINTS

### Q5.1: Browser Support

**Which browsers must we support for MVP**:
- [ ] Chrome (last 2 versions)
- [ ] Firefox (last 2 versions)
- [ ] Safari (last 2 versions)
- [ ] Edge (last 2 versions)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**Or just "modern browsers" (Chrome, Firefox, Safari, Edge - last 2 versions)?**

**Your answer**: ?

---

### Q5.2: Mobile Responsiveness

**Mobile support for MVP**:

**Option A**: Fully responsive (works on mobile, tablet, desktop) - adds ~2-3 days  
**Option B**: Desktop-first (mobile usable but not optimized) - faster MVP  
**Option C**: Desktop-only (defer mobile to Phase 2)

**Your decision**: ?

---

### Q5.3: Offline Capability

**If user loses internet connection**:

**Option A**: Full offline support (service worker, local cache, sync when online) - adds ~3-5 days  
**Option B**: Graceful degradation (show last cached data, disable actions) - minimal effort  
**Option C**: Require online (show "No connection" message)

**Your decision for MVP**: ?

---

## 6. INTEGRATION CONSTRAINTS

### Q6.1: External Microservices - API Contracts

You mentioned we don't have API contracts yet for the 9 external microservices.

**For MVP, should we**:
- **Option A**: Design expected API contracts, share with MS teams, use mock data until they implement
- **Option B**: Wait for MS teams to provide contracts (delays MVP)
- **Option C**: Implement with mock data only, integrate real APIs post-MVP

**Your decision**: ?

**If Option A**, do you want us to:
1. Design all 9 API contracts (detailed request/response schemas)?
2. Document them for MS teams?
3. Implement integration layer (circuit breaker + fallback)?

**Your answer**: ?

---

### Q6.2: MS9 (RAG Assistant) - gRPC vs REST

RAG Assistant will use gRPC eventually, but:

**For MVP**:
- **Option A**: Implement REST mock (simpler, faster MVP) → migrate to gRPC later
- **Option B**: Implement gRPC from day 1 (more work upfront, no migration later)

**Your decision**: ?

---

### Q6.3: MS12 (Auth) - JWT Payload

**Confirm JWT payload structure** from MS12:

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "roles": ["learner", "trainer"],
  "organizationId": "org-uuid",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Is this correct**, or should we expect different fields?

**Your answer**: ?

---

## 7. DEPLOYMENT & OPERATIONS

### Q7.1: Staging Environment

**Do you want a staging environment for testing before production**?

**Option A**: Yes, deploy to Vercel staging + Railway staging (recommended)  
**Option B**: No, deploy directly to production (faster but riskier)

**Your decision**: ?

---

### Q7.2: Database Backups

**Supabase provides automatic backups. Should we**:
- Rely on Supabase backups (daily, 7-day retention)
- Implement custom backup script (more control, more work)

**Your decision**: ?

---

### Q7.3: Monitoring & Alerting

**For MVP, what monitoring do you need**:
- [ ] Health check endpoints (`/health`, `/ready`, `/live`)
- [ ] Basic logging (Winston with correlation IDs)
- [ ] Error tracking (Sentry or similar - free tier?)
- [ ] Performance monitoring (Vercel Analytics - free?)
- [ ] Uptime monitoring (UptimeRobot - free?)

**Which are MVP-critical vs nice-to-have**?

**Your answer**: ?

---

## 8. POST-MVP ROADMAP

### Q8.1: Phase 2 Features

**After MVP launch, which features should be Phase 2 priority**:

**Rank these 1-5 (1 = highest priority)**:
- [1 ] ___ Remaining 11 analytics (AS-001.5-6, AS-002, AS-003.12-14, AS-004.16, AS-005.18)
- [1 ] ___ Gamification (if not in MVP)
- [ 1] ___ RAG Chatbot Widget (if not in MVP)
- [no need ] ___ Mobile app (React Native?)
- [ 5] ___ Real-time dashboard updates (WebSocket?)
- [4 ] ___ Advanced reports (customizable, scheduled email reports?)
- [no need,there is a microservice for this user ] ___ Admin panel (manage users, organizations, analytics settings?)
- [ 2, initially we will have english then hebrew and arabic] ___ Internationalization (i18n support for multiple languages?)

**Your ranking**: ?

---

## 9. SUCCESS CRITERIA - MEASURABLE

### Q9.1: MVP Launch Criteria

**What defines "MVP success" for launch**?

**Technical**:
- [x ] All X analytics implemented (which X? 8 or 19?)
- [ x] 85%+ test coverage achieved
- [x ] < 2.5s dashboard load time validated
- [x ] Zero critical security vulnerabilities
- [ x] All 3 user roles (learner, trainer, org admin) functional

**Business**:
- [ ] X number of beta users testing?
- [x ] X% of users can complete core workflow (login → view analytics → export)?
- [ there is no stackholders in my project] Stakeholder sign-off?

**Your launch criteria**: ?

---

### Q9.2: Post-Launch Success Metrics

**How do we measure success 30 days after MVP launch**?

**Suggested metrics**:
- User adoption: X% of learners have logged in
- Engagement: X% of users view analytics > once/week
- Feature usage: X% of users have exported a report
- Performance: < 1% error rate, > 99% uptime
- Satisfaction: User survey score > X/10?

**Confirm or adjust these metrics**?

**Your answer**: ?

---

## 📋 SUMMARY OF QUESTIONS

**Total questions**: 30+ across 9 categories

**Please answer these questions to help us**:
1. Define precise MVP scope (what's in, what's deferred)
2. Document detailed user workflows
3. Clarify business rules and formulas
4. Establish quality standards
5. Assess technical feasibility
6. Create implementation timeline (Phase 1C)

**Your answers will directly feed into**:
- Scope Definition Document
- Updated Project Roadmap
- Feature Breakdown (Phase 1C)
- Implementation Plan (Phase 3)

---

**Next Steps After You Answer**:
1. ✅ Document Scope Definition
2. ✅ Update Project Roadmap with refined scope
3. ✅ Conduct mediated debates (if scope decisions are contentious)
4. ✅ Proceed to Phase 1C (Planning) with feature breakdown

---

**Status**: ⏳ **AWAITING YOUR RESPONSES**  
**Date**: October 24, 2025  
**Next Phase**: Phase 1C - Planning (after scope confirmed)

