# User Journey Flow - Learning Analytics Microservice

**Version:** 2.0  
**Date:** October 24, 2025  
**Status:** Design Complete  
**Purpose:** Visual representation of all user flows through the application  

---

## 📋 **Table of Contents**

1. [High-Level User Journey](#high-level-user-journey)
2. [Authentication Flow](#authentication-flow)
3. [Multi-Role User Flow](#multi-role-user-flow)
4. [Learner Journey](#learner-journey)
5. [Trainer Journey](#trainer-journey)
6. [Organization Admin Journey](#organization-admin-journey)
7. [Comparison Analytics Flow](#comparison-analytics-flow)
8. [Error Handling Flows](#error-handling-flows)

---

## 🗺️ **High-Level User Journey**

```mermaid
graph TD
    A[Landing Page] --> B{User Authenticated?}
    B -->|No| C[Login Page]
    B -->|Yes| D{Has Multiple Roles?}
    C --> E[Enter Credentials]
    E --> F{Login Successful?}
    F -->|No| G[Show Error Message]
    G --> C
    F -->|Yes| D
    D -->|No| H[Redirect to Default Dashboard]
    D -->|Yes| I[Show Role Selector]
    I --> J[Select Role]
    J --> K[Redirect to Role-Based Dashboard]
    H --> L[Dashboard]
    K --> L
    L --> M{User Action}
    M -->|View Analytics| N[Navigate to Analytics Detail Page]
    M -->|Switch Role| I
    M -->|Generate Report| O[Reports Page]
    M -->|View Comparison| P[Comparison Dashboard]
    M -->|Settings| Q[Settings Page]
    M -->|Logout| R[Logout & Redirect to Landing]
    N --> L
    O --> L
    P --> L
    Q --> L
```

---

## 🔐 **Authentication Flow**

```mermaid
sequenceDiagram
    actor User
    participant LP as Login Page
    participant FE as Frontend
    participant BE as Backend/BFF
    participant Auth as Auth Service (MS12)
    participant DB as Database
    
    User->>LP: Navigate to /login
    LP->>User: Display login form
    User->>LP: Enter email & password
    LP->>FE: Submit credentials
    FE->>BE: POST /api/v1/auth/login
    BE->>Auth: Validate credentials
    Auth->>DB: Query user record
    DB->>Auth: Return user data
    Auth->>BE: Return JWT + user info
    BE->>FE: Return { token, user: { id, email, roles[], organizationId } }
    FE->>FE: Store JWT in localStorage
    FE->>FE: Set Auth Context
    
    alt Single Role User
        FE->>User: Redirect to default dashboard
    else Multi-Role User
        FE->>User: Show role selector modal
        User->>FE: Select role
        FE->>FE: Set currentRole in Auth Context
        FE->>User: Redirect to role-based dashboard
    end
```

---

## 👥 **Multi-Role User Flow**

```mermaid
graph TD
    A[User Logs In] --> B{Has Multiple Roles?}
    B -->|No: Single Role| C[Set Default Role]
    B -->|Yes: Multiple Roles| D[Show Role Selector Modal]
    C --> E[Redirect to Dashboard]
    D --> F{User Selects Role}
    F -->|Learner| G[Set currentRole = 'learner']
    F -->|Trainer| H[Set currentRole = 'trainer']
    F -->|Org Admin| I[Set currentRole = 'org_admin']
    F -->|Super Admin| J[Set currentRole = 'super_admin']
    G --> K[Redirect to Learner Dashboard]
    H --> L[Redirect to Trainer Dashboard]
    I --> M[Redirect to Organization Dashboard]
    J --> N[Redirect to Super Admin Dashboard]
    
    K --> O{User in Dashboard}
    L --> O
    M --> O
    N --> O
    
    O -->|Click Role Switcher in Header| P[Show Role Dropdown]
    P --> Q[Select Different Role]
    Q --> R[Update currentRole in Auth Context]
    R --> S[Refresh Dashboard with New Role Data]
    S --> O
```

---

## 🎓 **Learner Journey**

```mermaid
graph TD
    A[Learner Dashboard] --> B[Overview Section]
    B --> C{Predictive Insights Banner}
    C -->|High Risk| D[Display Drop-Off Risk Warning]
    C -->|Low/Medium Risk| E[No Banner or Subtle Warning]
    
    B --> F[Six Analytics Cards]
    F --> G[AS-001 #1: Learning Velocity]
    F --> H[AS-001 #2: Skill Gap Matrix]
    F --> I[AS-001 #3: Engagement Score]
    F --> J[AS-001 #4: Mastery Progress]
    F --> K[AS-001 #5: Performance Analytics]
    F --> L[AS-001 #6: Content Effectiveness]
    
    G --> M{Click for Details}
    H --> M
    I --> M
    J --> M
    K --> M
    L --> M
    
    M --> N[Navigate to Detailed Analytics Page]
    N --> O[View Interactive Charts & Data]
    O --> P{User Actions}
    P -->|Refresh Data| Q[Fetch Fresh Analytics]
    P -->|Export Data| R[Download CSV/PDF]
    P -->|Back to Dashboard| A
    
    A --> S[Sidebar: Gamification Widget]
    S --> T[View Badges, Streaks, Points]
    T --> U{Click for Full Gamification Page}
    U --> V[Gamification Dashboard]
    V --> W[Leaderboards, Achievements, Progress]
    W --> A
    
    A --> X[Sidebar: Navigation]
    X --> Y{Navigate To}
    Y -->|Comparison| Z[Comparison Dashboard]
    Y -->|Reports| AA[Reports Page]
    Y -->|Settings| AB[Settings Page]
    Z --> A
    AA --> A
    AB --> A
```

---

## 👨‍🏫 **Trainer Journey**

```mermaid
graph TD
    A[Trainer Dashboard] --> B[Overview Section]
    B --> C{Predictive Insights}
    C --> D[At-Risk Students Sidebar]
    D --> E[List of Students with High Drop-Off Risk]
    
    B --> F[Four Analytics Cards]
    F --> G[AS-002 #7: Course Performance]
    F --> H[AS-002 #8: Course Health]
    F --> I[AS-002 #9: Student Distribution]
    F --> J[AS-002 #10: Teaching Effectiveness]
    
    G --> K{Click for Details}
    H --> K
    I --> K
    J --> K
    
    K --> L[Navigate to Detailed Analytics Page]
    L --> M[View Interactive Charts & Data]
    M --> N{User Actions}
    N -->|Refresh Data| O[Fetch Fresh Analytics]
    N -->|View Student Details| P[Navigate to Student Analytics]
    N -->|Export Data| Q[Download CSV/PDF]
    N -->|Back to Dashboard| A
    
    P --> R[Student Detail Page]
    R --> S[View Individual Learner Analytics]
    S --> T{Actions}
    T -->|Send Recommendation| U[AI-Powered Recommendation]
    T -->|View Progress| V[Detailed Progress Report]
    T -->|Back to Dashboard| A
    
    A --> W[Sidebar: Gamification Widget]
    W --> X[View Teaching Badges, Streaks, Points]
    X --> Y{Click for Full Gamification Page}
    Y --> Z[Trainer Gamification Dashboard]
    Z --> AA[Top Trainer Leaderboard, Achievements]
    AA --> A
    
    A --> AB[Sidebar: Navigation]
    AB --> AC{Navigate To}
    AC -->|Comparison| AD[Comparison Dashboard]
    AC -->|Reports| AE[Reports Page]
    AC -->|Students| AF[Students Management Page]
    AC -->|Courses| AG[Courses Management Page]
    AD --> A
    AE --> A
    AF --> A
    AG --> A
```

---

## 🏢 **Organization Admin Journey**

```mermaid
graph TD
    A[Organization Dashboard] --> B[Overview Section]
    B --> C{Predictive Insights}
    C --> D[At-Risk Departments Banner]
    D --> E[Display Departments with High Risk]
    
    B --> F[Four Analytics Cards]
    F --> G[AS-003 #11: Org Learning Velocity]
    F --> H[AS-003 #12: Strategic Alignment]
    F --> I[AS-003 #13: Department Analytics]
    F --> J[AS-003 #14: Learning Culture]
    
    G --> K{Click for Details}
    H --> K
    I --> K
    J --> K
    
    K --> L[Navigate to Detailed Analytics Page]
    L --> M[View Interactive Charts & Data]
    M --> N{User Actions}
    N -->|Refresh Data| O[Fetch Fresh Analytics]
    N -->|Drill-Down to Department| P[Department Detail View]
    N -->|Export Data| Q[Download CSV/PDF]
    N -->|Back to Dashboard| A
    
    P --> R[Department Analytics]
    R --> S{View Department Details}
    S -->|Learner Performance| T[Aggregated Learner Analytics]
    S -->|Trainer Effectiveness| U[Aggregated Trainer Analytics]
    S -->|Comparison| V[Department vs Organization]
    T --> A
    U --> A
    V --> A
    
    A --> W[Sidebar: Gamification Widget]
    W --> X[View Org Achievements, Milestones]
    X --> Y{Click for Full Gamification Page}
    Y --> Z[Org Gamification Dashboard]
    Z --> AA[Org-Wide Leaderboards, Badges]
    AA --> A
    
    A --> AB[Sidebar: Navigation]
    AB --> AC{Navigate To}
    AC -->|Comparison| AD[Comparison Dashboard]
    AC -->|Reports| AE[Reports Page]
    AC -->|Users| AF[Users Management Page]
    AC -->|Settings| AG[Organization Settings]
    AD --> A
    AE --> A
    AF --> A
    AG --> A
```

---

## 📊 **Comparison Analytics Flow**

```mermaid
graph TD
    A[Any Dashboard] --> B[Click Comparison in Sidebar]
    B --> C[Comparison Dashboard]
    C --> D{User Role}
    
    D -->|Learner| E[Learner Peer Comparison]
    D -->|Trainer| F[Trainer Peer Comparison]
    D -->|Org Admin| G[Organization Peer Comparison]
    
    E --> H[AS-005 #19: Peer Comparison]
    F --> H
    G --> H
    
    H --> I[Display Comparison Filters]
    I --> J{Filter Options}
    J -->|Organization Scope| K[Within Org / Overall Platform]
    J -->|Role Filter| L[Filter by Role]
    J -->|Competency Level| M[Filter by Level]
    J -->|Skill| N[Filter by Skill]
    J -->|Learning Path| O[Filter by Path]
    
    K --> P[Apply Filters]
    L --> P
    M --> P
    N --> P
    O --> P
    
    P --> Q[Fetch Comparison Data from Backend]
    Q --> R{Data Available?}
    R -->|Yes| S[Display Comparison Results]
    R -->|No| T[Show 'Insufficient Data' Message]
    T --> U[K-Anonymity: Min 10 Users Required]
    
    S --> V[Show User Metrics vs Peer Metrics]
    V --> W[Display Percentile Ranking]
    W --> X[Show Standing: Top X%]
    X --> Y{User Actions}
    Y -->|Change Filters| I
    Y -->|Refresh Data| Q
    Y -->|Export Comparison| Z[Download Comparison Report]
    Y -->|Back to Dashboard| A
    
    C --> AA[AS-005 #18: Platform Skill Demand]
    AA --> AB[Display Top Demanded Skills]
    AB --> AC[Show Trending Skills]
    AC --> AD[Display Emerging Skills]
    AD --> AE[AI-Powered Forecasts]
    AE --> AF{User Skill Status}
    AF -->|Has Skill| AG[Display: Maintain Expertise]
    AF -->|Missing Skill| AH[Display: Recommended to Learn]
    AG --> AI{User Actions}
    AH --> AI
    AI -->|Filter by Category| AJ[Apply Skill Category Filter]
    AI -->|Refresh Forecast| AK[Get Fresh AI Forecast]
    AI -->|View Skill Details| AL[Skill Detail Page]
    AI -->|Back to Dashboard| A
    AJ --> AA
    AK --> AA
    AL --> AA
```

---

## ⚠️ **Error Handling Flows**

### **Network Error Flow**

```mermaid
graph TD
    A[User Action: Fetch Analytics] --> B[Frontend Sends API Request]
    B --> C{Network Available?}
    C -->|No| D[Network Error]
    D --> E[Show Error Message: Check Connection]
    E --> F{User Action}
    F -->|Retry| B
    F -->|Cancel| G[Return to Dashboard]
    
    C -->|Yes| H[Backend Processes Request]
    H --> I{Backend Responds?}
    I -->|Yes| J[Return Data]
    I -->|No: Timeout| K[Show Error: Request Timeout]
    K --> F
```

### **Authentication Error Flow**

```mermaid
graph TD
    A[User Action: API Request] --> B[Frontend Sends Request with JWT]
    B --> C{JWT Valid?}
    C -->|Yes| D[Process Request]
    C -->|No: Expired| E[401 Unauthorized]
    C -->|No: Invalid| E
    E --> F[Frontend Detects 401]
    F --> G[Clear Auth Context]
    G --> H[Redirect to Login Page]
    H --> I[Show Message: Session Expired]
    I --> J[User Logs In Again]
    J --> K[Redirect to Original Page]
```

### **Authorization Error Flow**

```mermaid
graph TD
    A[User Action: Access Resource] --> B[Frontend Sends Request]
    B --> C[Backend Validates JWT]
    C --> D{User Has Permission?}
    D -->|Yes| E[Return Resource]
    D -->|No: Wrong Role| F[403 Forbidden]
    D -->|No: Wrong Org| F
    F --> G[Frontend Detects 403]
    G --> H[Show Error Message: Access Denied]
    H --> I{User Action}
    I -->|Switch Role| J[Open Role Switcher]
    I -->|Go Back| K[Return to Dashboard]
    J --> L[Select Appropriate Role]
    L --> M[Retry Access]
    M --> B
```

### **Data Not Available Flow**

```mermaid
graph TD
    A[User Views Analytics] --> B[Frontend Requests Data]
    B --> C[Backend Attempts to Fetch from Microservices]
    C --> D{Microservice Responds?}
    D -->|Yes| E[Process and Return Data]
    D -->|No: Microservice Down| F[Backend Logs Error]
    F --> G[Backend Returns Mock Data]
    G --> H[Frontend Receives Response]
    H --> I[Check Data Source in Meta]
    I --> J{Data Source?}
    J -->|Real Data| K[Display Data Normally]
    J -->|Mock Data| L[Display Data with Warning Badge]
    L --> M[Show: Using Sample Data]
    M --> N{User Action}
    N -->|Refresh| O[Retry Fetching Real Data]
    N -->|Continue| P[Use Mock Data for Now]
    O --> B
```

### **K-Anonymity Error Flow (Comparison Analytics)**

```mermaid
graph TD
    A[User Requests Peer Comparison] --> B[Frontend Sends Request with Filters]
    B --> C[Backend Queries Aggregates]
    C --> D{Sample Size >= 10?}
    D -->|Yes| E[Return Comparison Data]
    D -->|No| F[Return Error: Insufficient Data]
    F --> G[Frontend Displays Message]
    G --> H[Show: Not Enough Peers for Comparison]
    H --> I[Suggest Broader Filters]
    I --> J{User Action}
    J -->|Broaden Filters| K[Remove Some Filters]
    J -->|Try Different Scope| L[Change Scope to Overall Platform]
    J -->|Cancel| M[Return to Dashboard]
    K --> B
    L --> B
```

---

## 📋 **User Journey Summary**

### **Entry Points**
1. **Landing Page** → Login → Dashboard
2. **Direct Link** → Login (if not authenticated) → Redirect to original URL

### **Main Flows**
1. **Authentication** → Role Selection (if multi-role) → Dashboard
2. **Dashboard Overview** → Analytics Cards → Detailed Analytics Pages
3. **Navigation** → Comparison / Reports / Settings / Users
4. **Role Switching** → Update Context → Refresh Dashboard

### **Success Paths**
- User successfully logs in and views their analytics
- User navigates between different analytics sections
- User generates and exports reports
- User compares performance with peers

### **Alternative Paths**
- User with multiple roles switches between role dashboards
- User refreshes analytics data manually
- User accesses gamification features

### **Error Paths**
- Network errors → Retry mechanism
- Authentication errors → Redirect to login
- Authorization errors → Role switcher or access denied message
- Data unavailable → Mock data fallback
- K-anonymity violation → Suggest broader filters

---

## 🎯 **Design Principles**

1. **Progressive Disclosure**
   - Show overview first, details on demand
   - Predictive insights as subtle banners (not intrusive)

2. **Error Recovery**
   - Clear error messages with actionable suggestions
   - Automatic retry for transient failures
   - Graceful degradation with mock data

3. **Accessibility**
   - Keyboard navigation support
   - Screen reader friendly
   - Focus management

4. **Performance**
   - Lazy load detailed pages
   - Cache analytics data (SWR)
   - Skeleton loading states

5. **User Empowerment**
   - Manual refresh option
   - Filter controls for comparison
   - Export capabilities

---

**Document Version:** 2.0  
**Last Updated:** October 24, 2025  
**Status:** ✅ Complete  
**Next Document:** `backend_architecture.md`

