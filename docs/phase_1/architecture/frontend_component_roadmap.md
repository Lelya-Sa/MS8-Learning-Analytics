# Frontend Component Roadmap

**Phase:** 2A - Frontend Architecture  
**Date:** October 24, 2025  
**Status:** Ready for Implementation (Phase 3A)  
**Based on:** Debates #1, #2, #3, #7 + User Requirements

---

## 🎯 **Overview**

This roadmap defines all frontend components to be implemented in Phase 3A, organized by the Onion Architecture layers and grouped by feature area.

---

## 📊 **Architecture Foundation**

### **Onion Architecture (4 Layers)**

```
frontend/src/
├── domain/              ← Layer 1: Pure Business Logic
│   ├── entities/
│   │   ├── User.js
│   │   ├── Analytics.js
│   │   ├── Achievement.js
│   │   └── Course.js
│   └── valueObjects/
│       ├── SkillLevel.js
│       ├── StreakData.js
│       └── PointsData.js
│
├── application/         ← Layer 2: Use Cases & Orchestration
│   ├── useCases/
│   │   ├── FetchLearnerAnalytics.js
│   │   ├── SwitchUserRole.js
│   │   ├── RefreshDashboard.js
│   │   └── UnlockAchievement.js
│   └── services/
│       ├── analyticsService.js
│       ├── gamificationService.js
│       └── predictionService.js
│
├── infrastructure/      ← Layer 3: External Dependencies
│   ├── api/
│   │   ├── axios.config.js
│   │   ├── apiClient.js
│   │   └── endpoints.js
│   ├── storage/
│   │   ├── localStorage.js
│   │   └── sessionStorage.js
│   └── analytics/
│       └── trackingService.js
│
└── presentation/        ← Layer 4: UI Components
    ├── components/      (All UI components below)
    ├── pages/
    ├── hooks/
    └── assets/
```

---

## 🏗️ **Component Hierarchy**

### **1. Layout Components** (Foundation)

```
<DashboardLayout role={currentRole}>
  ├── <DashboardHeader role={role}>
  │   ├── <Logo />
  │   ├── <RoleSwitcher roles={userRoles} />
  │   ├── <NotificationBell />
  │   └── <UserMenu />
  ├── <DashboardSidebar role={role}>
  │   ├── <Navigation role={role} />
  │   ├── <GamificationWidget userId={userId} />
  │   └── <RecommendationsWidget userId={userId} />
  ├── <DashboardMain>
  │   {children}
  ├── <DashboardFooter />
</DashboardLayout>
```

**Implementation Priority:** HIGH (Week 1)
**Files:**
- `presentation/components/layout/DashboardLayout.jsx`
- `presentation/components/layout/DashboardHeader.jsx`
- `presentation/components/layout/DashboardSidebar.jsx`
- `presentation/components/layout/DashboardFooter.jsx`

---

### **2. Dashboard Pages** (Core)

#### **2.1 Learner Dashboard**

```jsx
<LearnerDashboard userId={userId}>
  {/* Drop-off Risk Banner (if high/medium risk) */}
  <DropOffRiskBanner riskData={dropOffRisk} />
  
  {/* Analytics Overview (6 cards) */}
  <AnalyticsOverview>
    <AnalyticsCard href="/analytics/velocity">
      <VelocityCardContent data={velocityData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/skill-gap">
      <SkillGapCardContent data={skillGapData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/engagement">
      <EngagementCardContent data={engagementData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/mastery">
      <MasteryCardContent data={masteryData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/performance">
      <PerformanceCardContent data={performanceData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/content">
      <ContentCardContent data={contentData} />
    </AnalyticsCard>
  </AnalyticsOverview>
</LearnerDashboard>
```

**Implementation:** Week 2-3
**Components:** 8 total (1 dashboard + 1 banner + 6 cards)

#### **2.2 Trainer Dashboard**

```jsx
<TrainerDashboard trainerId={trainerId}>
  <AnalyticsOverview>
    <AnalyticsCard href="/analytics/course-performance">
      <CoursePerformanceCardContent data={coursePerformanceData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/course-health">
      <CourseHealthCardContent data={courseHealthData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/student-distribution">
      <StudentDistributionCardContent data={studentDistData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/teaching-effectiveness">
      <TeachingEffectivenessCardContent data={teachingData} />
    </AnalyticsCard>
  </AnalyticsOverview>
</TrainerDashboard>
```

**Implementation:** Week 4
**Components:** 5 total (1 dashboard + 4 cards)

#### **2.3 Organization Dashboard**

```jsx
<OrganizationDashboard orgId={orgId}>
  <AnalyticsOverview>
    <AnalyticsCard href="/analytics/org-velocity">
      <OrgVelocityCardContent data={orgVelocityData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/strategic-alignment">
      <StrategicAlignmentCardContent data={alignmentData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/department-analytics">
      <DepartmentAnalyticsCardContent data={deptData} />
    </AnalyticsCard>
    <AnalyticsCard href="/analytics/learning-culture">
      <LearningCultureCardContent data={cultureData} />
    </AnalyticsCard>
  </AnalyticsOverview>
</OrganizationDashboard>
```

**Implementation:** Week 5
**Components:** 5 total (1 dashboard + 4 cards)

#### **2.4 Comparison Dashboard**

```jsx
<ComparisonDashboard role={currentRole}>
  <FilterControls>
    <Select label="Scope" options={['Within Org', 'Overall Platform']} />
    <Select label="Competency Level" options={['All', 'Beginner', 'Intermediate', 'Advanced']} />
    <Select label="Skill" options={skills} />
    <Select label="Learning Path" options={learningPaths} />
  </FilterControls>
  
  <ComparisonSection>
    {/* Role-specific comparison */}
    {role === 'learner' && <LearnerPeerComparison filters={filters} />}
    {role === 'trainer' && <TrainerPeerComparison filters={filters} />}
    {role === 'org_admin' && <OrgPeerComparison filters={filters} />}
    
    {/* Platform-wide skill demand (same for all roles) */}
    <SkillDemandAnalytics />
  </ComparisonSection>
</ComparisonDashboard>
```

**Implementation:** Week 6
**Components:** 6 total (1 dashboard + 4 filters + 1 skill demand)

---

### **3. Analytics Detail Pages** (19 pages)

Each analytics card links to a dedicated detail page with full analytics.

**Template Structure:**
```jsx
<AnalyticsDetailPage>
  <PageHeader>
    <BackButton />
    <Breadcrumb />
    <Title />
    <Actions>
      <RefreshButton />
      <ExportButton />
      <ShareButton />
    </Actions>
  </PageHeader>
  
  <PageBody>
    <AnalyticsOverview>
      <PrimaryMetrics />
      <VisualCharts />
    </AnalyticsOverview>
    
    <AnalyticsDetails>
      <HistoricalTrends />
      <Breakdown />
      <Insights />
      <Recommendations />
    </AnalyticsDetails>
    
    {/* Optional: Forecast section */}
    <ForecastSection>
      <ForecastTimeline />
      <ScenarioAnalysis />
    </ForecastSection>
  </PageBody>
</AnalyticsDetailPage>
```

**Implementation:** Week 3-6 (parallel with dashboards)
**Total Pages:** 19 (6 learner + 4 trainer + 4 org + 2 comparison + 3 predictive)

---

### **4. Gamification Components** (Week 7)

#### **4.1 Gamification Widget** (Sidebar)

```jsx
<GamificationWidget userId={userId}>
  <WidgetHeader>
    <Icon>🎮</Icon>
    <Title>Your Progress</Title>
  </WidgetHeader>
  
  <WidgetBody>
    {/* Streak */}
    <StreakDisplay currentStreak={7} longestStreak={14} />
    
    {/* Points & Level */}
    <LevelProgress 
      totalPoints={1250} 
      currentLevel={5} 
      nextLevelPoints={1500} 
    />
    
    {/* Latest Achievement */}
    <AchievementBadge achievement={latestAchievement} size="small" />
  </WidgetBody>
  
  <WidgetFooter>
    <Link to="/gamification">View All Achievements →</Link>
  </WidgetFooter>
</GamificationWidget>
```

#### **4.2 Gamification Page**

```jsx
<GamificationPage userId={userId}>
  <PageHeader>
    <Title>Your Achievements</Title>
    <LevelBadge level={currentLevel} />
  </PageHeader>
  
  <PageBody>
    {/* Points & Level Overview */}
    <PointsOverview totalPoints={1250} level={5} />
    
    {/* Streak Stats */}
    <StreakStats current={7} longest={14} freezes={2} />
    
    {/* Achievement Grid */}
    <AchievementGrid>
      {achievements.map(ach => (
        <AchievementCard key={ach.id} achievement={ach} />
      ))}
    </AchievementGrid>
    
    {/* Leaderboard */}
    <LeaderboardSection>
      <LeaderboardTabs>
        <Tab>Weekly</Tab>
        <Tab>Monthly</Tab>
        <Tab>All-Time</Tab>
      </LeaderboardTabs>
      <Leaderboard period="weekly" />
    </LeaderboardSection>
  </PageBody>
</GamificationPage>
```

**Components:** 12 total

---

### **5. Predictive Analytics Components** (Week 8)

#### **5.1 Drop-Off Risk Banner**

```jsx
<DropOffRiskBanner riskLevel="high" factors={[...]} onDismiss={...}>
  <BannerIcon>🚨</BannerIcon>
  <BannerContent>
    <Title>High Drop-Off Risk Detected</Title>
    <Description>You haven't engaged in 7 days...</Description>
    <FactorsList>
      {factors.slice(0, 2).map(f => (
        <FactorItem key={f.factor}>{f.factor} ({f.weight * 100}%)</FactorItem>
      ))}
    </FactorsList>
  </BannerContent>
  <BannerActions>
    <Button onClick={viewInsights}>View Full Analysis</Button>
    <Button onClick={dismiss}>Dismiss for 24h</Button>
  </BannerActions>
</DropOffRiskBanner>
```

#### **5.2 Forecast Timeline**

```jsx
<ForecastTimeline 
  milestones={milestones}
  predictedDate="2026-02-15"
  targetDate="2026-03-01"
>
  <Timeline data={timelineData} />
  <ForecastSummary>
    You're on track to complete by Feb 15, 2026 (2 weeks ahead!)
  </ForecastSummary>
  <ScenarioAnalysis>
    <Scenario type="best" date="2026-01-15" />
    <Scenario type="expected" date="2026-02-15" />
    <Scenario type="worst" date="2026-04-01" />
  </ScenarioAnalysis>
</ForecastTimeline>
```

#### **5.3 Recommendations Widget**

```jsx
<RecommendationsWidget userId={userId}>
  <WidgetHeader>
    <Icon>🤖</Icon>
    <Title>AI Recommendations</Title>
    <RefreshButton onClick={handleRefresh} />
  </WidgetHeader>
  
  <WidgetBody>
    {recommendations.slice(0, 3).map(rec => (
      <RecommendationCard 
        key={rec.id}
        recommendation={rec}
        onEnroll={handleEnroll}
        onDismiss={handleDismiss}
      />
    ))}
  </WidgetBody>
  
  <WidgetFooter>
    <Link to="/recommendations">View All (12 more)</Link>
  </WidgetFooter>
</RecommendationsWidget>
```

**Components:** 8 total

---

## 📋 **Complete Component Inventory**

| Category | Components | Week | Priority |
|----------|-----------|------|----------|
| Layout | 4 (Layout, Header, Sidebar, Footer) | 1 | Critical |
| Dashboard Pages | 4 (Learner, Trainer, Org, Comparison) | 2-6 | High |
| Analytics Cards | 16 (6+4+4+2 card contents) | 2-6 | High |
| Analytics Detail Pages | 19 | 3-6 | High |
| Gamification | 12 | 7 | Medium |
| Predictive Analytics | 8 | 8 | Medium |
| Shared Components | 20+ (Button, Card, Modal, etc.) | 1-2 | Critical |

**TOTAL: ~100 components**

---

## 🎨 **Styling System**

### **Dark Emerald Theme**

```css
:root {
  /* Primary Colors */
  --emerald-50: #ecfdf5;
  --emerald-100: #d1fae5;
  --emerald-500: #10b981;
  --emerald-600: #059669;
  --emerald-900: #064e3b;
  
  /* Dark Background */
  --bg-dark: #0f172a;
  --bg-dark-secondary: #1e293b;
  
  /* Text */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
}
```

**Applied to:**
- Dashboard backgrounds
- Card styling
- Button primary colors
- Progress indicators
- Achievement badges

---

## 🚀 **Implementation Order**

### **Week 1: Foundation**
- [ ] DashboardLayout + Header/Sidebar/Footer
- [ ] Shared components (Button, Card, Modal, Input)
- [ ] Authentication pages (Login, Role Selection)
- [ ] Routing setup (React Router)

### **Week 2-3: Learner Dashboard**
- [ ] Learner Dashboard page
- [ ] 6 Learner analytics cards
- [ ] 6 Learner analytics detail pages
- [ ] Drop-off risk banner

### **Week 4: Trainer Dashboard**
- [ ] Trainer Dashboard page
- [ ] 4 Trainer analytics cards
- [ ] 4 Trainer analytics detail pages

### **Week 5: Organization Dashboard**
- [ ] Organization Dashboard page
- [ ] 4 Org analytics cards
- [ ] 4 Org analytics detail pages

### **Week 6: Comparison Dashboard**
- [ ] Comparison Dashboard page
- [ ] Filter controls
- [ ] Peer comparison (3 role-specific)
- [ ] Skill demand analytics

### **Week 7: Gamification**
- [ ] Gamification widget (sidebar)
- [ ] Gamification page
- [ ] Achievement components
- [ ] Leaderboard
- [ ] Streak display

### **Week 8: Predictive Analytics**
- [ ] Forecast timelines (detail pages)
- [ ] Recommendations widget (sidebar)
- [ ] Recommendations page
- [ ] Scenario analysis

---

## 📊 **State Management**

### **Hybrid Strategy (SWR + React Context)**

**SWR (Server State):**
```jsx
// application/services/analyticsService.js
export const useLearnerVelocity = (userId) => {
  return useSWR(
    userId ? ['learner-velocity', userId] : null,
    () => analyticsService.getLearnerVelocity(userId),
    {
      dedupingInterval: 14400000, // 4 hours
      revalidateOnFocus: true,
    }
  );
};
```

**React Context (UI State):**
```jsx
// presentation/contexts/AuthContext.jsx
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('learner');
  
  return (
    <AuthContext.Provider value={{ user, currentRole, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## ✅ **Ready for Phase 3A**

This roadmap provides:
- ✅ Complete component hierarchy
- ✅ Onion Architecture structure
- ✅ Implementation timeline (8 weeks)
- ✅ Priority levels
- ✅ Styling system (Dark Emerald)
- ✅ State management strategy

**Next Action:** Begin Phase 3A (Frontend TDD Implementation)

---

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Status:** Ready for Implementation

