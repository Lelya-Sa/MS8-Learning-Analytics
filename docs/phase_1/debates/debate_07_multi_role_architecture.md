# Debate #7: Multi-Role Architecture (25 Rounds)

**Phase**: 1B - Scope Definition  
**Date**: October 24, 2025  
**Status**: ✅ CONSENSUS REACHED  
**Participants**: TL, PM, SA, SE, FE, BE, DD, DA  
**Rounds**: 25 (Extended from standard 15)

---

## 📋 Debate Context

**Question**: How should MS8 handle multi-role users?

**User Requirements**:
- Single user can have multiple roles (e.g., learner + trainer + org_admin)
- **Separate dashboard per role** (no merged data)
- Users can **switch between roles** in UI
- **RBAC enforcement** at all layers
- **Privacy rules** (K-anonymity for comparisons)

**5 Decisions Required**:
1. **Data Storage Strategy**: How to store analytics per user-role?
2. **Session Management**: How to handle JWT with multiple roles?
3. **UI Architecture**: How to implement role switching?
4. **Analytics Calculation**: Calculate per role or per user?
5. **RBAC Enforcement**: Where and how to check permissions?

---

## 🎯 DECISION #1: Data Storage Strategy (Rounds 1-5)

### Round 1: DD (Database Designer) - Options

**Option A**: Single table with `(user_id, role, analytics_type)` composite key
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL,
  analytics_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  organization_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role, analytics_type)
);

CREATE INDEX idx_analytics_user_role ON analytics(user_id, role);
CREATE INDEX idx_analytics_org ON analytics(organization_id);
```

**Pros**:
- Simple schema
- Easy to add new roles
- Single query for all user's analytics
- Efficient indexes

**Cons**:
- Large table (user_count × role_count × 19 analytics)
- Complex queries for role-specific aggregations

---

**Option B**: Separate tables per role
```sql
CREATE TABLE learner_analytics (...);
CREATE TABLE trainer_analytics (...);
CREATE TABLE org_admin_analytics (...);
```

**Pros**:
- Cleaner separation
- Optimized per role
- Smaller tables

**Cons**:
- Harder to add new roles (schema change)
- Complex queries for multi-role users
- More maintenance

---

**Option C**: Hybrid (base table + role-specific extensions)
```sql
CREATE TABLE analytics_base (...);
CREATE TABLE learner_analytics_ext (...) INHERITS analytics_base;
CREATE TABLE trainer_analytics_ext (...) INHERITS analytics_base;
```

**Pros**:
- Flexible
- Role-specific optimizations

**Cons**:
- Most complex
- PostgreSQL inheritance has limitations

---

### Round 2: BE (Backend Engineer) - Repository Impact

**Analysis**: How does each option affect repository code?

**Option A** (Single table):
```javascript
// Simple, clean repository
class AnalyticsRepository {
  async findByUserAndRole(userId, role) {
    return this.client
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .eq('role', role);
  }
  
  async save(userId, role, analyticsType, data) {
    return this.client
      .from('analytics')
      .upsert({
        user_id: userId,
        role: role,
        analytics_type: analyticsType,
        data: data
      }, { onConflict: 'user_id,role,analytics_type' });
  }
}
```

**Option B** (Separate tables):
```javascript
// More complex, table selection logic
class AnalyticsRepository {
  async findByUserAndRole(userId, role) {
    const table = this.getTableForRole(role); // 'learner_analytics', etc.
    return this.client
      .from(table)
      .select('*')
      .eq('user_id', userId);
  }
  
  getTableForRole(role) {
    const tables = {
      learner: 'learner_analytics',
      trainer: 'trainer_analytics',
      org_admin: 'org_admin_analytics'
    };
    return tables[role] || throw new Error('Invalid role');
  }
}
```

**Verdict**: Option A is simpler and more maintainable

---

### Round 3: DA (Data Analyst) - Query Performance

**Performance Analysis**:

**Option A** (Single table):
- **Read**: Fast with composite index on `(user_id, role)`
- **Write**: Fast upsert with unique constraint
- **Aggregation**: Efficient with role-based filtering
- **Growth**: Scales linearly (10k users × 3 roles × 19 analytics = 570k rows - manageable)

**Option B** (Separate tables):
- **Read**: Slightly faster (smaller tables)
- **Write**: Same as Option A
- **Aggregation**: Requires UNION queries for cross-role aggregations
- **Growth**: Better partitioning, but adds complexity

**Benchmark** (estimated for 10k users):
- Option A: ~50ms per user-role query
- Option B: ~40ms per user-role query
- **Difference**: Negligible for MVP

**Verdict**: Option A performance is acceptable

---

### Round 4: SE (Security Engineer) - RLS Implementation

**Row-Level Security**:

**Option A** (Single table):
```sql
-- RLS policy: Users can only see their own analytics
CREATE POLICY user_analytics_policy ON analytics
  FOR SELECT
  USING (
    user_id = auth.uid() 
    OR 
    (role = 'org_admin' AND organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()))
  );

-- RLS policy: Users can only insert/update their own analytics
CREATE POLICY user_analytics_write_policy ON analytics
  FOR ALL
  USING (user_id = auth.uid());
```

**Option B** (Separate tables):
```sql
-- Need separate RLS policies for each table
CREATE POLICY learner_analytics_policy ON learner_analytics ...;
CREATE POLICY trainer_analytics_policy ON trainer_analytics ...;
CREATE POLICY org_admin_analytics_policy ON org_admin_analytics ...;
```

**Verdict**: Option A requires fewer RLS policies (easier to maintain)

---

### Round 5: CONSENSUS - Data Storage

**DECISION**: **Option A - Single Table**

**Final Schema**:
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('learner', 'trainer', 'org_admin', 'platform_admin')),
  analytics_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role, analytics_type)
);

CREATE INDEX idx_analytics_user_role ON analytics(user_id, role);
CREATE INDEX idx_analytics_org ON analytics(organization_id);
CREATE INDEX idx_analytics_type ON analytics(analytics_type);
CREATE INDEX idx_analytics_updated ON analytics(updated_at);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY analytics_select_policy ON analytics
  FOR SELECT
  USING (
    user_id = auth.uid() 
    OR 
    (role = 'org_admin' AND organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    ))
  );

CREATE POLICY analytics_insert_policy ON analytics
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'system');

CREATE POLICY analytics_update_policy ON analytics
  FOR UPDATE
  USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'system');
```

**Rationale**:
- ✅ Simple, maintainable
- ✅ Easy to add new roles
- ✅ Good performance
- ✅ Clean RLS policies
- ✅ Aligns with Hybrid Onion-Hexagonal architecture

---

## 🎯 DECISION #2: Session Management (Rounds 6-10)

### Round 6: SE (Security Engineer) - JWT Structure

**Option A**: Single JWT with roles array, frontend tracks active role
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "roles": ["learner", "trainer"],
  "organizationId": "org-uuid",
  "iss": "ms12-auth",
  "aud": "ms8-analytics",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Frontend**:
```javascript
// Store active role in React state
const [activeRole, setActiveRole] = useState('learner');

// Include active role in API requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'X-Active-Role': activeRole
};
```

**Backend**:
```javascript
// Middleware extracts active role from header
function extractActiveRole(req, res, next) {
  const activeRole = req.headers['x-active-role'];
  const userRoles = req.user.roles; // from JWT
  
  if (!userRoles.includes(activeRole)) {
    return res.status(403).json({ error: 'Invalid role' });
  }
  
  req.activeRole = activeRole;
  next();
}
```

**Pros**:
- Stateless (no server-side session)
- Simple JWT structure
- No token refresh needed on role switch

**Cons**:
- Frontend must track active role
- Extra header in every request

---

**Option B**: Separate JWT per role
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "learner",  // Single role
  "organizationId": "org-uuid",
  ...
}
```

**Frontend**:
```javascript
// Store multiple tokens
const tokens = {
  learner: 'token-1',
  trainer: 'token-2'
};

// Use appropriate token per role
const token = tokens[activeRole];
```

**Pros**:
- Clear role separation
- No extra header needed

**Cons**:
- Complex token management
- Multiple tokens to refresh
- More storage

---

**Option C**: Single JWT + active role claim (requires token refresh on switch)
```json
{
  "sub": "user-uuid",
  "roles": ["learner", "trainer"],
  "activeRole": "learner",  // Current active role
  ...
}
```

**Pros**:
- Role in JWT (no extra header)

**Cons**:
- Requires token refresh on role switch (not stateless)
- Adds latency to role switching

---

### Round 7: FE (Frontend Engineer) - UX Impact

**Analysis**: How does each option affect UX?

**Option A** (Roles array + header):
- **Role switch**: Instant (just update state + header)
- **UX**: Smooth, no loading spinner
- **Implementation**: Simple React state

**Option B** (Separate tokens):
- **Role switch**: Instant (just swap token)
- **UX**: Smooth
- **Implementation**: More complex (manage multiple tokens)

**Option C** (Token refresh):
- **Role switch**: ~500ms delay (token refresh)
- **UX**: Loading spinner required
- **Implementation**: Complex (refresh logic)

**Verdict**: Option A provides best UX

---

### Round 8: BE (Backend Engineer) - Implementation Complexity

**Option A** (Roles array + header):
```javascript
// Middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
}

function activeRoleMiddleware(req, res, next) {
  const activeRole = req.headers['x-active-role'];
  if (!req.user.roles.includes(activeRole)) {
    return res.status(403).json({ error: 'Invalid role' });
  }
  req.activeRole = activeRole;
  next();
}

// Usage
app.get('/api/v1/analytics/learner/:userId', 
  authMiddleware, 
  activeRoleMiddleware,
  analyticsController.getLearnerAnalytics
);
```

**Complexity**: Low (2 simple middleware)

---

**Option B** (Separate tokens):
```javascript
// Same auth middleware, but role is in JWT
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  req.activeRole = decoded.role; // Single role in token
  next();
}
```

**Complexity**: Low, but frontend complexity higher

---

**Option C** (Token refresh):
```javascript
// Need token refresh endpoint
app.post('/api/v1/auth/switch-role', async (req, res) => {
  const { newRole } = req.body;
  const user = req.user;
  
  if (!user.roles.includes(newRole)) {
    return res.status(403).json({ error: 'Invalid role' });
  }
  
  const newToken = jwt.sign(
    { ...user, activeRole: newRole },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token: newToken });
});
```

**Complexity**: Medium (refresh logic + endpoint)

---

### Round 9: PM (Product Manager) - User Experience

**User Story**: As a user who is both a learner and a trainer, I want to quickly switch between my learner dashboard and trainer dashboard.

**Option A**: 
- Click role switcher dropdown → Select "Trainer" → Dashboard reloads instantly
- **Time**: < 100ms
- **User satisfaction**: High

**Option B**:
- Same as Option A
- **Time**: < 100ms
- **User satisfaction**: High

**Option C**:
- Click role switcher → Loading spinner → Dashboard reloads after token refresh
- **Time**: ~500ms
- **User satisfaction**: Medium (noticeable delay)

**Verdict**: Option A or B preferred for UX

---

### Round 10: CONSENSUS - Session Management

**DECISION**: **Option A - Single JWT with roles array, frontend tracks active role**

**Implementation**:

**JWT Structure**:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "roles": ["learner", "trainer"],
  "organizationId": "org-uuid",
  "iss": "ms12-auth",
  "aud": "ms8-analytics",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Frontend**:
```javascript
// Context for active role
const RoleContext = createContext();

function RoleProvider({ children }) {
  const [activeRole, setActiveRole] = useState('learner');
  
  const switchRole = (newRole) => {
    if (user.roles.includes(newRole)) {
      setActiveRole(newRole);
      // Optionally persist to localStorage
      localStorage.setItem('activeRole', newRole);
    }
  };
  
  return (
    <RoleContext.Provider value={{ activeRole, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

// API client includes active role header
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'X-Active-Role': activeRole
  }
});
```

**Backend**:
```javascript
// middleware/active-role.js
function activeRoleMiddleware(req, res, next) {
  const activeRole = req.headers['x-active-role'];
  const userRoles = req.user.roles;
  
  if (!activeRole) {
    return res.status(400).json({ error: 'X-Active-Role header required' });
  }
  
  if (!userRoles.includes(activeRole)) {
    return res.status(403).json({ error: 'Invalid role for user' });
  }
  
  req.activeRole = activeRole;
  next();
}
```

**Rationale**:
- ✅ Stateless (no server-side session)
- ✅ Instant role switching (no token refresh)
- ✅ Simple implementation
- ✅ Good UX
- ✅ Aligns with security-first approach

---

## 🎯 DECISION #3: UI Architecture (Rounds 11-15)

### Round 11: FE (Frontend Engineer) - Component Structure

**Option A**: Role switcher dropdown in header → Navigate to role-specific dashboard route

```javascript
// Routes
<Routes>
  <Route path="/dashboard/learner" element={<LearnerDashboard />} />
  <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
  <Route path="/dashboard/org-admin" element={<OrgAdminDashboard />} />
</Routes>

// Header component
function RoleSwitcher() {
  const { activeRole, switchRole } = useRole();
  const navigate = useNavigate();
  
  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    navigate(`/dashboard/${newRole}`);
  };
  
  return (
    <select value={activeRole} onChange={(e) => handleRoleChange(e.target.value)}>
      {user.roles.map(role => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  );
}
```

**Pros**:
- Clean separation (different routes)
- Easy to navigate directly to role dashboard
- Browser back/forward works correctly

**Cons**:
- More routes to manage

---

**Option B**: Single dashboard route with role-based rendering

```javascript
// Single route
<Route path="/dashboard" element={<Dashboard />} />

// Dashboard component
function Dashboard() {
  const { activeRole } = useRole();
  
  return (
    <>
      {activeRole === 'learner' && <LearnerDashboard />}
      {activeRole === 'trainer' && <TrainerDashboard />}
      {activeRole === 'org_admin' && <OrgAdminDashboard />}
    </>
  );
}
```

**Pros**:
- Single route
- Simpler routing

**Cons**:
- URL doesn't reflect active role
- Browser back/forward doesn't work for role switching
- Harder to deep link to specific role dashboard

---

### Round 12: PM (Product Manager) - User Experience

**User Expectations**:
- **Bookmarking**: Users want to bookmark "My Trainer Dashboard"
- **Sharing**: Trainers want to share link to their dashboard
- **Browser history**: Back button should work intuitively

**Option A**:
- ✅ URL reflects role: `/dashboard/trainer`
- ✅ Bookmarkable
- ✅ Shareable
- ✅ Browser history works

**Option B**:
- ❌ URL is generic: `/dashboard`
- ❌ Not bookmarkable per role
- ❌ Not shareable per role
- ❌ Browser history doesn't track role changes

**Verdict**: Option A is better UX

---

### Round 13: SA (System Architect) - Architecture Alignment

**Hybrid Onion-Hexagonal Architecture**:
- **Presentation Layer**: React components
- **Application Layer**: API calls via service layer
- **Infrastructure Layer**: API client (axios)

**Option A** (Separate routes):
```
frontend/src/
├── presentation/
│   ├── pages/
│   │   ├── LearnerDashboard.jsx
│   │   ├── TrainerDashboard.jsx
│   │   └── OrgAdminDashboard.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   └── RoleSwitcher.jsx
│   └── routes/
│       └── AppRoutes.jsx
├── application/
│   └── services/
│       ├── analyticsService.js
│       └── authService.js
└── infrastructure/
    └── api/
        └── apiClient.js
```

**Alignment**: ✅ Clear separation, aligns with architecture

---

### Round 14: FE (Frontend Engineer) - Implementation Details

**Option A Implementation**:

```javascript
// AppRoutes.jsx
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Navigate to="/dashboard/learner" replace />} />
        <Route path="/dashboard/learner" element={<LearnerDashboard />} />
        <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
        <Route path="/dashboard/org-admin" element={<OrgAdminDashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/comparison" element={<ComparisonPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}

// ProtectedRoute.jsx
function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  
  return <Outlet />;
}

// RoleSwitcher.jsx
function RoleSwitcher() {
  const { user } = useAuth();
  const { activeRole, switchRole } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    
    // If on a dashboard route, navigate to new role's dashboard
    if (location.pathname.startsWith('/dashboard/')) {
      navigate(`/dashboard/${newRole}`);
    }
  };
  
  return (
    <div className="role-switcher">
      <label htmlFor="role-select">Role:</label>
      <select 
        id="role-select"
        value={activeRole} 
        onChange={(e) => handleRoleChange(e.target.value)}
      >
        {user.roles.map(role => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Complexity**: Medium (standard React Router patterns)

---

### Round 15: CONSENSUS - UI Architecture

**DECISION**: **Option A - Separate routes per role with role switcher in header**

**Implementation**:
- `/dashboard/learner` → `LearnerDashboard.jsx`
- `/dashboard/trainer` → `TrainerDashboard.jsx`
- `/dashboard/org-admin` → `OrgAdminDashboard.jsx`
- Role switcher dropdown in header
- Navigate to new role's dashboard on switch

**Rationale**:
- ✅ Better UX (bookmarkable, shareable, browser history)
- ✅ Clear separation of concerns
- ✅ Aligns with architecture
- ✅ Standard React Router patterns

---

## 🎯 DECISION #4: Analytics Calculation (Rounds 16-20)

### Round 16: DA (Data Analyst) - Calculation Strategy

**Question**: Calculate analytics per `(user_id, role)` pair or per `user_id` only?

**Option A**: Calculate per `(user_id, role)` pair independently
```javascript
// Use case
async function calculateLearnerVelocity(userId, role = 'learner') {
  // Fetch data scoped to role
  const paths = await learnerAIAdapter.getLearningPaths(userId, role);
  const practice = await devLabAdapter.getPracticeSessions(userId, role);
  
  // Calculate velocity
  const velocity = calculateVelocity(paths, practice);
  
  // Save with role
  await analyticsRepo.save(userId, role, 'velocity', velocity);
  
  return velocity;
}
```

**Pros**:
- Clean separation (no cross-role leakage)
- Each role has independent analytics
- Easy to understand

**Cons**:
- More computation (calculate for each role separately)
- Potential data duplication if same data used for multiple roles

---

**Option B**: Calculate once per user, filter by role on retrieval
```javascript
// Use case
async function calculateVelocity(userId) {
  // Fetch all data for user (all roles)
  const allPaths = await learnerAIAdapter.getLearningPaths(userId);
  const allPractice = await devLabAdapter.getPracticeSessions(userId);
  
  // Calculate velocity
  const velocity = calculateVelocity(allPaths, allPractice);
  
  // Save for all roles
  for (const role of user.roles) {
    await analyticsRepo.save(userId, role, 'velocity', velocity);
  }
  
  return velocity;
}
```

**Pros**:
- More efficient (calculate once)
- Less computation

**Cons**:
- Risk of cross-role data leakage
- Violates "separate dashboards" requirement
- Complex filtering logic

---

### Round 17: SE (Security Engineer) - Security Implications

**Option A** (Per role):
- ✅ No cross-role data leakage
- ✅ Each role's data is independent
- ✅ Aligns with "separate dashboards" requirement
- ✅ Easy to audit (clear data lineage)

**Option B** (Per user):
- ⚠️ Risk of cross-role leakage if filtering is incorrect
- ⚠️ Harder to audit
- ❌ Violates principle of least privilege

**Verdict**: Option A is more secure

---

### Round 18: BE (Backend Engineer) - Performance Impact

**Performance Analysis**:

**Option A** (Per role):
- **Computation**: 3× for user with 3 roles
- **Time**: ~150ms per role (450ms total for 3 roles)
- **Batch job**: 10k users × 3 roles × 19 analytics = 570k calculations
- **Estimated batch time**: ~2 hours (acceptable)

**Option B** (Per user):
- **Computation**: 1× per user
- **Time**: ~150ms per user
- **Batch job**: 10k users × 19 analytics = 190k calculations
- **Estimated batch time**: ~40 minutes (3× faster)

**Trade-off**: Security vs Performance

**Verdict**: For MVP, Option A is acceptable (security > performance)

---

### Round 19: PM (Product Manager) - Business Requirements

**User Requirement**: "Separate dashboard per role (no merged data)"

**Option A**:
- ✅ Fully satisfies requirement
- Each role sees only their role-specific analytics
- No confusion about data sources

**Option B**:
- ⚠️ May violate requirement if filtering is imperfect
- Risk of showing wrong data to wrong role

**Verdict**: Option A aligns with business requirements

---

### Round 20: CONSENSUS - Analytics Calculation

**DECISION**: **Option A - Calculate per `(user_id, role)` pair independently**

**Implementation**:
```javascript
// application/use-cases/calculate-learner-velocity.js
class CalculateLearnerVelocityUseCase {
  constructor(analyticsRepo, learnerAIAdapter, devLabAdapter) {
    this.analyticsRepo = analyticsRepo;
    this.learnerAIAdapter = learnerAIAdapter;
    this.devLabAdapter = devLabAdapter;
  }
  
  async execute(userId, role, timeWindow = 30) {
    // Validate role
    if (role !== 'learner') {
      throw new Error('This use case is for learner role only');
    }
    
    // Fetch data scoped to learner role
    const paths = await this.learnerAIAdapter.getLearningPaths(userId, role);
    const practice = await this.devLabAdapter.getPracticeSessions(userId, role);
    
    // Calculate velocity (domain logic)
    const velocity = this.calculateVelocity(paths, practice, timeWindow);
    
    // Save with role
    await this.analyticsRepo.save({
      userId,
      role,
      analyticsType: 'velocity',
      data: velocity,
      organizationId: paths[0]?.organizationId // from data
    });
    
    return velocity;
  }
  
  calculateVelocity(paths, practice, timeWindow) {
    // Pure domain logic (easy to test)
    // ...
  }
}
```

**Rationale**:
- ✅ Secure (no cross-role leakage)
- ✅ Aligns with business requirements
- ✅ Clear separation of concerns
- ✅ Easy to test
- ✅ Performance acceptable for MVP

---

## 🎯 DECISION #5: RBAC Enforcement (Rounds 21-25)

### Round 21: SE (Security Engineer) - Defense in Depth

**RBAC Layers**:

**Layer 1: Presentation (Frontend)**
```javascript
// Conditional rendering based on role
function Dashboard() {
  const { activeRole } = useRole();
  
  return (
    <>
      {activeRole === 'learner' && <LearnerDashboard />}
      {activeRole === 'trainer' && <TrainerDashboard />}
      {activeRole === 'org_admin' && <OrgAdminDashboard />}
    </>
  );
}
```

**Layer 2: Application (Backend Middleware)**
```javascript
// middleware/rbac.js
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const activeRole = req.activeRole;
    
    if (!allowedRoles.includes(activeRole)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Role '${activeRole}' not allowed for this endpoint`
      });
    }
    
    next();
  };
}

// Usage
app.get('/api/v1/analytics/learner/:userId', 
  authMiddleware,
  activeRoleMiddleware,
  requireRole('learner', 'org_admin'), // Only learner or org_admin can access
  analyticsController.getLearnerAnalytics
);
```

**Layer 3: Infrastructure (Database RLS)**
```sql
-- RLS policy ensures users can only see their own analytics
CREATE POLICY analytics_select_policy ON analytics
  FOR SELECT
  USING (
    user_id = auth.uid() 
    OR 
    (role = 'org_admin' AND organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    ))
  );
```

**Defense in Depth**: ✅ 3 layers of RBAC enforcement

---

### Round 22: BE (Backend Engineer) - Middleware Implementation

**RBAC Middleware**:
```javascript
// middleware/rbac.js
class RBACMiddleware {
  static requireRole(...allowedRoles) {
    return (req, res, next) => {
      const activeRole = req.activeRole;
      
      if (!activeRole) {
        return res.status(400).json({ error: 'Active role not specified' });
      }
      
      if (!allowedRoles.includes(activeRole)) {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: `Role '${activeRole}' not allowed`,
          requiredRoles: allowedRoles
        });
      }
      
      next();
    };
  }
  
  static requireOwnership(userIdParam = 'userId') {
    return (req, res, next) => {
      const requestedUserId = req.params[userIdParam];
      const authenticatedUserId = req.user.sub;
      const activeRole = req.activeRole;
      
      // Users can access their own data
      if (requestedUserId === authenticatedUserId) {
        return next();
      }
      
      // Org admins can access their organization's users
      if (activeRole === 'org_admin') {
        // Check if requested user is in same org (done in use case)
        return next();
      }
      
      return res.status(403).json({ error: 'Forbidden' });
    };
  }
}

module.exports = RBACMiddleware;
```

**Usage**:
```javascript
// routes/analytics-routes.js
const router = express.Router();

// Learner analytics (learner or org_admin can access)
router.get('/learner/:userId', 
  authMiddleware,
  activeRoleMiddleware,
  RBACMiddleware.requireRole('learner', 'org_admin'),
  RBACMiddleware.requireOwnership('userId'),
  analyticsController.getLearnerAnalytics
);

// Trainer analytics (trainer or org_admin can access)
router.get('/trainer/:userId',
  authMiddleware,
  activeRoleMiddleware,
  RBACMiddleware.requireRole('trainer', 'org_admin'),
  RBACMiddleware.requireOwnership('userId'),
  analyticsController.getTrainerAnalytics
);

// Org analytics (org_admin only)
router.get('/organization/:organizationId',
  authMiddleware,
  activeRoleMiddleware,
  RBACMiddleware.requireRole('org_admin'),
  analyticsController.getOrganizationAnalytics
);
```

---

### Round 23: DD (Database Designer) - RLS Policies

**Complete RLS Setup**:
```sql
-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can SELECT their own analytics
CREATE POLICY analytics_select_own ON analytics
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy 2: Org admins can SELECT their organization's analytics
CREATE POLICY analytics_select_org_admin ON analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.organization_id = analytics.organization_id
      AND 'org_admin' = ANY(users.roles)
    )
  );

-- Policy 3: System can INSERT analytics (for batch jobs)
CREATE POLICY analytics_insert_system ON analytics
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'system'
    OR
    user_id = auth.uid()
  );

-- Policy 4: System can UPDATE analytics (for batch jobs)
CREATE POLICY analytics_update_system ON analytics
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'system'
    OR
    user_id = auth.uid()
  );

-- Policy 5: Users can DELETE their own analytics (for GDPR)
CREATE POLICY analytics_delete_own ON analytics
  FOR DELETE
  USING (user_id = auth.uid());
```

---

### Round 24: TL (Tech Lead) - Testing RBAC

**RBAC Test Strategy**:

**Unit Tests** (Middleware):
```javascript
describe('RBACMiddleware', () => {
  describe('requireRole', () => {
    it('allows access for valid role', () => {
      const req = { activeRole: 'learner' };
      const res = {};
      const next = jest.fn();
      
      RBACMiddleware.requireRole('learner')(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });
    
    it('denies access for invalid role', () => {
      const req = { activeRole: 'learner' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      
      RBACMiddleware.requireRole('trainer')(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
```

**Integration Tests** (API):
```javascript
describe('GET /api/v1/analytics/learner/:userId', () => {
  it('returns 403 for wrong role', async () => {
    const trainerToken = generateToken({ roles: ['trainer'] });
    
    const response = await request(app)
      .get('/api/v1/analytics/learner/user-123')
      .set('Authorization', `Bearer ${trainerToken}`)
      .set('X-Active-Role', 'trainer');
    
    expect(response.status).toBe(403);
  });
  
  it('returns 200 for correct role', async () => {
    const learnerToken = generateToken({ roles: ['learner'], sub: 'user-123' });
    
    const response = await request(app)
      .get('/api/v1/analytics/learner/user-123')
      .set('Authorization', `Bearer ${learnerToken}`)
      .set('X-Active-Role', 'learner');
    
    expect(response.status).toBe(200);
  });
});
```

---

### Round 25: CONSENSUS - RBAC Enforcement

**DECISION**: **Defense in Depth - 3 layers of RBAC**

**Layer 1: Frontend (Presentation)**
- Conditional rendering based on `activeRole`
- Hide/show UI elements per role
- Client-side only (not security boundary)

**Layer 2: Backend Middleware (Application)**
- `authMiddleware`: Validate JWT
- `activeRoleMiddleware`: Extract and validate active role
- `RBACMiddleware.requireRole()`: Check role permissions
- `RBACMiddleware.requireOwnership()`: Check data ownership

**Layer 3: Database RLS (Infrastructure)**
- Supabase RLS policies enforce row-level access
- Users can only SELECT their own analytics
- Org admins can SELECT their organization's analytics
- System role can INSERT/UPDATE for batch jobs

**Rationale**:
- ✅ Defense in depth (3 layers)
- ✅ Security-first approach
- ✅ Clear separation of concerns
- ✅ Easy to test at each layer
- ✅ Aligns with Hybrid Onion-Hexagonal architecture

---

## 📊 FINAL CONSENSUS SUMMARY

**5 Decisions Made**:

1. **Data Storage**: Single table with `(user_id, role, analytics_type)` composite key
2. **Session Management**: Single JWT with roles array, frontend tracks active role via `X-Active-Role` header
3. **UI Architecture**: Separate routes per role (`/dashboard/learner`, `/dashboard/trainer`, etc.) with role switcher in header
4. **Analytics Calculation**: Calculate per `(user_id, role)` pair independently (no cross-role data)
5. **RBAC Enforcement**: Defense in depth with 3 layers (Frontend, Backend Middleware, Database RLS)

**Benefits**:
- ✅ Secure (no cross-role data leakage)
- ✅ Clean separation (separate dashboards per role)
- ✅ Good UX (instant role switching, bookmarkable URLs)
- ✅ Maintainable (clear architecture)
- ✅ Testable (each layer independently testable)
- ✅ Scalable (easy to add new roles)

**Implementation Complexity**: Medium (acceptable for MVP)

**Security**: High (defense in depth)

**Performance**: Acceptable (batch job ~2 hours for 10k users)

---

## ✅ UNANIMOUS APPROVAL

**TL**: ✅ APPROVE  
**PM**: ✅ APPROVE  
**SA**: ✅ APPROVE  
**SE**: ✅ APPROVE  
**FE**: ✅ APPROVE  
**BE**: ✅ APPROVE  
**DD**: ✅ APPROVE  
**DA**: ✅ APPROVE  

**Vote**: **8/8 UNANIMOUS APPROVAL**

---

**Date**: October 24, 2025  
**Status**: ✅ CONSENSUS REACHED  
**Decision**: Multi-Role Architecture with 5 key decisions  
**Folder**: `docs/phase_1/debates/`

