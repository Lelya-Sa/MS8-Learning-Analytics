# Frontend Architecture - Learning Analytics Microservice

**Version:** 2.0  
**Date:** October 24, 2025  
**Status:** Design Complete  
**Architecture Pattern:** Onion Architecture (4 Layers)  
**Framework:** React + Vite + Tailwind CSS  
**State Management:** SWR + React Context  

---

## 📋 **Table of Contents**

1. [Architecture Overview](#architecture-overview)
2. [Onion Architecture Layers](#onion-architecture-layers)
3. [Folder Structure](#folder-structure)
4. [Component Architecture](#component-architecture)
5. [Dashboard Design](#dashboard-design)
6. [State Management](#state-management)
7. [Routing Strategy](#routing-strategy)
8. [UI/UX Patterns](#uiux-patterns)
9. [Performance Optimization](#performance-optimization)
10. [Testing Strategy](#testing-strategy)

---

## 🏗️ **Architecture Overview**

The frontend follows **Onion Architecture** principles adapted for React applications:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  Pages, Layouts, UI Components, Assets                      │
│  ↓ Depends on ↓                                             │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                         │
│  Hooks, Services, State Management, Use Cases               │
│  ↓ Depends on ↓                                             │
├─────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                       │
│  API Clients, External Libraries, Utilities                 │
│  ↓ Depends on ↓                                             │
├─────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                            │
│  Core Entities, Types, Interfaces (Business Logic)          │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Rules:**
- Inner layers know nothing about outer layers
- Outer layers can depend on inner layers
- Domain layer has zero dependencies on external frameworks

---

## 🎯 **Onion Architecture Layers**

### **Layer 1: Domain** (Core Business Logic)

**Responsibility:** Define business entities, types, and interfaces

**Contents:**
- **Entities:** User, Analytics, Comparison, Gamification
- **Types:** TypeScript-like types using JSDoc
- **Interfaces:** Contracts for services and repositories
- **Constants:** Business constants (roles, analytics types, etc.)

**Example:**
```javascript
// domain/entities/User.js
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string[]} roles - Array of user roles
 * @property {string} organizationId
 * @property {string} currentRole - Active role
 */

// domain/types/AnalyticsTypes.js
/**
 * @typedef {Object} LearningVelocity
 * @property {number} currentPace
 * @property {number} averagePace
 * @property {'accelerating'|'steady'|'decelerating'|'stalled'} trend
 */

// domain/interfaces/IAnalyticsService.js
export const IAnalyticsService = {
  getLearnerAnalytics: (userId) => Promise.resolve({}),
  getTrainerAnalytics: (trainerId) => Promise.resolve({}),
  getOrgAnalytics: (orgId) => Promise.resolve({}),
};
```

---

### **Layer 2: Infrastructure** (External Concerns)

**Responsibility:** Handle external dependencies (API, utilities, libraries)

**Contents:**
- **API Clients:** HTTP clients for backend communication
- **Config:** Environment configuration, constants
- **Utils:** Pure utility functions (date formatting, validation, etc.)
- **External:** Wrappers for external libraries (Chart.js, etc.)

**Example:**
```javascript
// infrastructure/api/analyticsApiClient.js
import { apiClient } from './apiClient';

export const analyticsApiClient = {
  async getLearnerVelocity(userId) {
    const response = await apiClient.get(`/api/v1/analytics/learner/velocity/${userId}`);
    return response.data;
  },
  
  async getTrainerPerformance(trainerId) {
    const response = await apiClient.get(`/api/v1/analytics/trainer/course-performance/${trainerId}`);
    return response.data;
  },
};
```

---

### **Layer 3: Application** (Application Logic)

**Responsibility:** Orchestrate application logic, state management, use cases

**Contents:**
- **Hooks:** Custom React hooks for data fetching, state management
- **Services:** Business logic services (analytics, authentication, reports)
- **State:** Global state management (React Context, providers)
- **Use Cases:** Application-specific use cases (login flow, dashboard refresh, etc.)

**Example:**
```javascript
// application/hooks/useAnalytics.js
import useSWR from 'swr';
import { analyticsService } from '../services/analyticsService';

export const useLearnerVelocity = (userId) => {
  return useSWR(
    userId ? ['learner-velocity', userId] : null,
    () => analyticsService.getLearnerVelocity(userId),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 14400000, // 4 hours
    }
  );
};

// application/services/analyticsService.js
import { analyticsApiClient } from '../../infrastructure/api/analyticsApiClient';

export const analyticsService = {
  async getLearnerVelocity(userId) {
    try {
      const response = await analyticsApiClient.getLearnerVelocity(userId);
      return response.data;
    } catch (error) {
      console.error('Analytics service error:', error);
      throw error;
    }
  },
};
```

---

### **Layer 4: Presentation** (UI Layer)

**Responsibility:** Render UI components, handle user interactions

**Contents:**
- **Pages:** Route-level components (HomePage, LoginPage, DashboardPages)
- **Components:** Reusable UI components (Button, Card, Chart, etc.)
- **Layouts:** Layout components (DashboardLayout, AuthLayout, etc.)
- **Assets:** Static assets (CSS, images, fonts)

**Example:**
```javascript
// presentation/pages/dashboards/LearnerDashboard/index.jsx
import React from 'react';
import { useAuth } from '../../../application/hooks/useAuth';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { LearnerOverview } from './LearnerOverview';

export const LearnerDashboard = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout role="learner">
      <LearnerOverview userId={user.id} />
    </DashboardLayout>
  );
};
```

---

## 📁 **Folder Structure**

```
frontend/src/
├── domain/                          # LAYER 1: Core Business Logic
│   ├── entities/                    # Business entities
│   │   ├── User.js
│   │   ├── Analytics.js
│   │   ├── Comparison.js
│   │   └── Gamification.js
│   ├── types/                       # Type definitions (JSDoc)
│   │   ├── AnalyticsTypes.js
│   │   ├── UserTypes.js
│   │   └── ComparisonTypes.js
│   ├── interfaces/                  # Service interfaces
│   │   ├── IAnalyticsService.js
│   │   ├── IAuthService.js
│   │   └── IReportService.js
│   └── constants/                   # Business constants
│       ├── roles.js
│       ├── analyticsCategories.js
│       └── gamificationRules.js
│
├── infrastructure/                  # LAYER 2: External Concerns
│   ├── api/                         # API clients
│   │   ├── apiClient.js             # Base HTTP client (Axios)
│   │   ├── analyticsApiClient.js
│   │   ├── authApiClient.js
│   │   └── reportApiClient.js
│   ├── config/                      # Configuration
│   │   ├── env.js                   # Environment variables
│   │   ├── routes.js                # Route constants
│   │   └── cache.js                 # Cache configuration
│   ├── utils/                       # Utility functions
│   │   ├── dateUtils.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── errorHandler.js
│   └── external/                    # External library wrappers
│       ├── chartWrapper.js          # Chart.js wrapper
│       └── swrConfig.js             # SWR configuration
│
├── application/                     # LAYER 3: Application Logic
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useAnalytics.js          # All analytics hooks
│   │   ├── useComparison.js
│   │   ├── usePredictive.js
│   │   ├── useGamification.js
│   │   └── useReports.js
│   ├── services/                    # Business logic services
│   │   ├── analyticsService.js
│   │   ├── authService.js
│   │   ├── comparisonService.js
│   │   ├── predictiveService.js
│   │   └── reportService.js
│   ├── state/                       # Global state management
│   │   ├── AuthProvider.jsx         # Auth context
│   │   ├── ThemeProvider.jsx        # Theme context
│   │   └── NotificationProvider.jsx # Notification context
│   └── use-cases/                   # Application use cases
│       ├── loginUseCase.js
│       ├── refreshDashboardUseCase.js
│       └── generateReportUseCase.js
│
└── presentation/                    # LAYER 4: UI Layer
    ├── pages/                       # Route pages
    │   ├── HomePage.jsx
    │   ├── LoginPage.jsx
    │   ├── dashboards/              # Dashboard pages
    │   │   ├── LearnerDashboard/
    │   │   │   ├── index.jsx        # Main dashboard container
    │   │   │   ├── LearnerOverview.jsx
    │   │   │   └── sections/        # Analytics sections
    │   │   │       ├── VelocitySection.jsx
    │   │   │       ├── SkillGapSection.jsx
    │   │   │       ├── EngagementSection.jsx
    │   │   │       ├── MasterySection.jsx
    │   │   │       ├── PerformanceSection.jsx
    │   │   │       └── ContentSection.jsx
    │   │   ├── TrainerDashboard/
    │   │   │   ├── index.jsx
    │   │   │   ├── TrainerOverview.jsx
    │   │   │   └── sections/
    │   │   │       ├── CoursePerformanceSection.jsx
    │   │   │       ├── CourseHealthSection.jsx
    │   │   │       ├── StudentDistributionSection.jsx
    │   │   │       └── TeachingEffectivenessSection.jsx
    │   │   ├── OrganizationDashboard/
    │   │   │   ├── index.jsx
    │   │   │   ├── OrgOverview.jsx
    │   │   │   └── sections/
    │   │   │       ├── OrgVelocitySection.jsx
    │   │   │       ├── StrategicAlignmentSection.jsx
    │   │   │       ├── DepartmentSection.jsx
    │   │   │       └── CultureSection.jsx
    │   │   └── ComparisonDashboard/
    │   │       ├── index.jsx
    │   │       ├── ComparisonOverview.jsx
    │   │       └── sections/
    │   │           ├── PeerComparisonSection.jsx
    │   │           └── SkillDemandSection.jsx
    │   ├── analytics/               # Detailed analytics pages
    │   │   ├── LearnerAnalyticsPage.jsx
    │   │   ├── TrainerAnalyticsPage.jsx
    │   │   └── OrgAnalyticsPage.jsx
    │   ├── ReportsPage.jsx
    │   ├── SettingsPage.jsx
    │   └── UsersPage.jsx
    │
    ├── components/                  # Reusable UI components
    │   ├── analytics/               # Analytics-specific components
    │   │   ├── learner/             # AS-001: 6 components
    │   │   ├── trainer/             # AS-002: 4 components
    │   │   ├── organization/        # AS-003: 4 components
    │   │   ├── predictive/          # AS-004: 3 components
    │   │   │   ├── DropOffRiskBanner.jsx
    │   │   │   ├── ForecastChart.jsx
    │   │   │   └── RecommendationCard.jsx
    │   │   └── comparison/          # AS-005: 2 components
    │   │       ├── PeerComparisonCard.jsx
    │   │       └── SkillDemandChart.jsx
    │   ├── auth/                    # Auth components
    │   │   ├── ProtectedRoute.jsx
    │   │   └── RoleSwitcher.jsx
    │   ├── charts/                  # Chart components
    │   │   ├── AnalyticsChart.jsx
    │   │   ├── LineChart.jsx
    │   │   ├── BarChart.jsx
    │   │   └── PieChart.jsx
    │   ├── common/                  # Common components
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── ProgressBar.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── ErrorMessage.jsx
    │   │   └── ErrorBoundary.jsx
    │   ├── gamification/            # Gamification components
    │   │   ├── GamificationWidget.jsx
    │   │   ├── BadgeDisplay.jsx
    │   │   ├── StreakCounter.jsx
    │   │   ├── PointsBalance.jsx
    │   │   ├── Leaderboard.jsx
    │   │   └── AchievementToast.jsx
    │   ├── layout/                  # Layout components
    │   │   ├── Header.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Navigation.jsx
    │   │   ├── Footer.jsx
    │   │   └── DashboardLayout.jsx
    │   ├── reports/                 # Report components
    │   │   └── ReportGenerator.jsx
    │   └── tables/                  # Table components
    │       └── DataTable.jsx
    │
    ├── layouts/                     # Page layouts
    │   ├── DashboardLayout.jsx
    │   ├── AuthLayout.jsx
    │   └── PublicLayout.jsx
    │
    └── assets/                      # Static assets
        ├── css/                     # Global styles
        │   ├── index.css            # Main CSS entry
        │   ├── theme.css            # Theme variables
        │   ├── dashboard-layout.css
        │   ├── header.css
        │   ├── navigation.css
        │   ├── footer.css
        │   ├── landing.css
        │   ├── pages-common.css
        │   └── reports-page.css
        ├── fonts/                   # Custom fonts
        └── images/                  # Images, icons, logos
```

---

## 🎨 **Component Architecture**

### **Component Hierarchy**

```
App
├── AuthProvider (Context)
├── ThemeProvider (Context)
├── NotificationProvider (Context)
├── ErrorBoundary
└── Router
    ├── PublicLayout
    │   ├── HomePage
    │   └── LoginPage
    └── DashboardLayout (Protected)
        ├── Header
        │   ├── Logo
        │   ├── RoleSwitcher
        │   └── UserMenu
        ├── Sidebar
        │   ├── Navigation
        │   └── GamificationWidget
        ├── Main Content
        │   ├── LearnerDashboard
        │   │   ├── LearnerOverview
        │   │   │   ├── PredictiveInsights
        │   │   │   └── AnalyticsCards (6)
        │   │   └── Sections (6)
        │   ├── TrainerDashboard
        │   │   ├── TrainerOverview
        │   │   │   ├── PredictiveInsights
        │   │   │   └── AnalyticsCards (4)
        │   │   └── Sections (4)
        │   ├── OrganizationDashboard
        │   │   ├── OrgOverview
        │   │   │   ├── PredictiveInsights
        │   │   │   └── AnalyticsCards (4)
        │   │   └── Sections (4)
        │   └── ComparisonDashboard
        │       ├── ComparisonOverview
        │       └── Sections (2)
        └── Footer
```

---

## 📊 **Dashboard Design**

### **Dashboard Composition Pattern**

Each dashboard follows a consistent structure:

1. **Dashboard Container** (`index.jsx`)
   - Role-based routing
   - Data fetching orchestration
   - Layout management

2. **Overview Component** (`{Role}Overview.jsx`)
   - Summary cards showing key metrics
   - Predictive insights banner (AS-004)
   - Quick actions (refresh, export, settings)

3. **Analytics Sections** (`sections/*.jsx`)
   - Detailed analytics for each category
   - Interactive charts and visualizations
   - Drill-down capabilities

### **Dashboard Layout Structure**

```
┌──────────────────────────────────────────────────────────────┐
│  Header (Logo | Role Switcher | User Menu | Notifications)  │
├──────────────┬───────────────────────────────────────────────┤
│              │  Predictive Insights Banner (AS-004 #15)      │
│              ├───────────────────────────────────────────────┤
│              │  Overview Cards                               │
│              │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  Sidebar     │  │ A1 │ │ A2 │ │ A3 │ │ A4 │ │ A5 │ │ A6 │  │
│  - Nav Links │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘  │
│  - Gamif.    ├───────────────────────────────────────────────┤
│    Widget    │  Detailed Analytics Section 1                 │
│  - Quick     │  ┌───────────────────────────────────────┐   │
│    Actions   │  │  Chart / Table / Visualization        │   │
│              │  └───────────────────────────────────────┘   │
│              ├───────────────────────────────────────────────┤
│              │  Detailed Analytics Section 2                 │
│              │  ┌───────────────────────────────────────┐   │
│              │  │  Chart / Table / Visualization        │   │
│              │  └───────────────────────────────────────┘   │
├──────────────┴───────────────────────────────────────────────┤
│  Footer (Links | Support | Privacy | Version)                │
└──────────────────────────────────────────────────────────────┘
```

### **Responsive Breakpoints**

```css
/* Mobile: < 768px */
- Sidebar collapses to hamburger menu
- Cards stack vertically (1 column)
- Charts responsive width (100%)

/* Tablet: 768px - 1024px */
- Sidebar visible but narrower
- Cards in 2 columns
- Charts responsive (adjust to container)

/* Desktop: > 1024px */
- Full sidebar visible
- Cards in 3-4 columns
- Charts full width with optimal aspect ratio
```

---

## 🔄 **State Management**

### **Strategy: Hybrid SWR + React Context**

**1. Server State (SWR)**
- Analytics data fetching
- Automatic caching and revalidation
- Stale-while-revalidate pattern

```javascript
// Example: useLearnerVelocity hook
export const useLearnerVelocity = (userId) => {
  return useSWR(
    userId ? ['learner-velocity', userId] : null,
    () => analyticsService.getLearnerVelocity(userId),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 14400000, // 4 hours
    }
  );
};
```

**2. Client State (React Context)**
- Authentication state (`AuthProvider`)
- Theme state (`ThemeProvider`)
- Notification state (`NotificationProvider`)

```javascript
// application/state/AuthProvider.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  
  const value = {
    user,
    currentRole,
    login,
    logout,
    switchRole,
    isAuthenticated: !!user,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

**3. Local State (useState, useReducer)**
- Component-specific UI state
- Form state
- Modal/dialog state

---

## 🗺️ **Routing Strategy**

```javascript
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    
    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      {/* Dashboards */}
      <Route path="/dashboard/learner" element={<LearnerDashboard />} />
      <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
      <Route path="/dashboard/organization" element={<OrganizationDashboard />} />
      <Route path="/dashboard/comparison" element={<ComparisonDashboard />} />
      
      {/* Detailed Analytics Pages */}
      <Route path="/analytics/learner/velocity" element={<LearnerVelocityPage />} />
      <Route path="/analytics/learner/skill-gap" element={<SkillGapPage />} />
      {/* ... more analytics routes ... */}
      
      {/* Other Pages */}
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/users" element={<UsersPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Protected Route Implementation:**
```javascript
// presentation/components/auth/ProtectedRoute.jsx
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};
```

---

## 🎨 **UI/UX Patterns**

### **Dark Emerald Theme**

```css
:root {
  /* Primary Colors */
  --emerald-50: #ecfdf5;
  --emerald-100: #d1fae5;
  --emerald-500: #10b981;
  --emerald-600: #059669;
  --emerald-700: #047857;
  --emerald-800: #065f46;
  --emerald-900: #064e3b;
  
  /* Backgrounds */
  --bg-primary: #0a1f1b;
  --bg-secondary: #0f2a24;
  --bg-card: #134238;
  
  /* Text */
  --text-primary: #ecfdf5;
  --text-secondary: #a7f3d0;
  --text-muted: #6ee7b7;
}
```

### **Accessibility Features**

1. **ARIA Landmarks**
   - `<nav>`, `<main>`, `<aside>`, `<footer>`
   - `role="navigation"`, `role="main"`, `role="complementary"`

2. **Skip Links**
   - "Skip to main content"
   - "Skip to navigation"

3. **Keyboard Navigation**
   - Tab order management
   - Focus indicators
   - Keyboard shortcuts

4. **Screen Reader Support**
   - Semantic HTML
   - ARIA labels
   - Live regions for dynamic content

5. **Reduced Motion**
   - `prefers-reduced-motion: reduce` support
   - Optional animations

---

## ⚡ **Performance Optimization**

### **Code Splitting**

```javascript
// Lazy load dashboard pages
const LearnerDashboard = lazy(() => import('./pages/dashboards/LearnerDashboard'));
const TrainerDashboard = lazy(() => import('./pages/dashboards/TrainerDashboard'));
const OrganizationDashboard = lazy(() => import('./pages/dashboards/OrganizationDashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard/learner" element={<LearnerDashboard />} />
    {/* ... */}
  </Routes>
</Suspense>
```

### **Image Optimization**

- Use WebP format with fallbacks
- Lazy load images below the fold
- Responsive images with `srcset`

### **Bundle Optimization**

- Tree shaking unused code
- Dynamic imports for heavy libraries (Chart.js)
- CSS purging with Tailwind

### **Caching Strategy**

- SWR dedupingInterval: 4 hours (learner), 2 hours (trainer), 6 hours (org), 48 hours (AI)
- Browser cache for static assets
- Service worker for offline support (future)

---

## 🧪 **Testing Strategy**

### **Test Pyramid**

```
        /\
       /  \    E2E Tests (10%)
      /────\   - User journey tests
     /      \  - Cross-browser tests
    /────────\ Integration Tests (20%)
   /          \ - Component integration
  /────────────\ - API integration
 /              \ Unit Tests (70%)
/────────────────\ - Component tests
                   - Hook tests
                   - Utility tests
```

### **Unit Tests (Jest + React Testing Library)**

```javascript
// Example: LearnerVelocity component test
describe('LearnerVelocity', () => {
  it('should display current pace', () => {
    const mockData = { currentPace: 2.5, averagePace: 1.8 };
    render(<LearnerVelocity data={mockData} />);
    expect(screen.getByText(/2.5/i)).toBeInTheDocument();
  });
  
  it('should show loading state', () => {
    render(<LearnerVelocity isLoading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

### **Integration Tests**

- Dashboard renders with all analytics components
- API calls return expected data format
- Navigation flows work correctly

### **E2E Tests (Future: Playwright)**

- Login → Role selection → Dashboard
- Dashboard interaction → Analytics drill-down
- Refresh analytics → Updated data

---

## 📋 **Implementation Checklist**

**Phase 2A: Frontend Architecture** ✅
- [x] Define Onion Architecture layers
- [x] Design folder structure
- [x] Define component hierarchy
- [x] Design dashboard composition pattern
- [x] Define state management strategy
- [x] Design routing structure
- [x] Define UI/UX patterns
- [x] Plan performance optimizations
- [x] Define testing strategy

**Next: Phase 2B - Backend Architecture**

---

**Document Version:** 2.0  
**Last Updated:** October 24, 2025  
**Status:** ✅ Complete  
**Next Document:** `backend_architecture.md`

