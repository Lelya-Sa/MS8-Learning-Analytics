# Phase 1A Debate #5: Test Coverage Strategy

**Debate Information**
- **Phase**: 1A - Requirements Gathering
- **Topic**: Test Coverage & Quality Assurance Strategy
- **Participants**: TL (Tech Lead), QA (QA Engineer), FE (Frontend Engineer), BE (Backend Engineer), SA (Software Architect)
- **Debate Format**: 15 rounds until consensus
- **Decision Impact**: Code quality, development speed, bug prevention, CI/CD
- **Date**: October 24, 2025

---

## 📋 Context

**Question**: What testing strategy should MS8 use to achieve 85%+ coverage with high confidence?

**Requirements**:
- **Coverage target**: 85-90%
- **Test pyramid**: 70% unit, 20% integration, 10% E2E
- **Fast feedback**: Tests run in < 5 minutes
- **CI/CD integration**: Automated on every PR
- **Reliability**: No flaky tests

**Options**:
1. **Comprehensive from Day 1** - Full test suite, strict coverage gates
2. **Incremental** - Start with critical paths, expand coverage over time
3. **TDD (Test-Driven Development)** - Write tests first, then implementation
4. **Risk-Based** - Test high-risk areas heavily, low-risk lightly
5. **Hybrid (TDD for new + Risk-based for existing)** - Best of both worlds

**Tech Stack**:
- Frontend: Jest, React Testing Library, MSW
- Backend: Jest, Supertest
- E2E: Playwright
- Coverage: Istanbul (Jest built-in)

---

## 🎯 Round 1-3: Quick Consensus (Hybrid TDD + Risk-Based)

### **TL (Tech Lead)** [Round 1]
**Recommendation: Option 5 (Hybrid - TDD for new + Risk-based for existing)**

Rationale:
- ✅ **TDD for new features** - Ensures quality from start
- ✅ **Risk-based for existing** - Focus on critical paths first
- ✅ **Pragmatic** - Balances quality and speed
- ✅ **Achieves 85%+ coverage** - Without excessive effort on low-risk code

**Implementation**:
- **New features**: RED → GREEN → REFACTOR (TDD cycle)
- **Existing code**: Prioritize by risk (auth > analytics > UI)
- **Coverage gates**: 85% overall, 95% for critical modules

### **QA (QA Engineer)** [Round 1]
**Strong agreement**:

**Test prioritization** (Risk-based):
1. **Critical** (95%+ coverage):
   - Authentication & authorization
   - Data collection from external MS
   - Analytics calculations
   - RLS policies
   - Job queue processing

2. **High** (85%+ coverage):
   - Dashboard components
   - API endpoints
   - Database queries
   - Integration with microservices

3. **Medium** (70%+ coverage):
   - UI components
   - Utility functions
   - Error formatting

4. **Low** (50%+ coverage):
   - Static pages
   - Constants
   - Type definitions

**TDD for new features prevents bugs from day 1**.

### **FE (Frontend Engineer)** [Round 2]
**Support Hybrid approach**:

**Frontend testing strategy**:

**1. Unit Tests** (70% of tests):
```javascript
// Test individual components
test('LearningVelocityCard displays correct data', () => {
  render(<LearningVelocityCard data={mockData} />);
  expect(screen.getByText('3.5 topics/week')).toBeInTheDocument();
});

// Test custom hooks
test('useLearnerAnalytics fetches and caches data', async () => {
  const { result } = renderHook(() => useLearnerAnalytics('user123'));
  await waitFor(() => expect(result.current.data).toBeDefined());
});
```

**2. Integration Tests** (20% of tests):
```javascript
// Test component + SWR + MSW
test('LearnerDashboard loads and displays all analytics', async () => {
  render(<LearnerDashboard userId="123" />);
  
  // Wait for all 6 analytics to load
  expect(await screen.findByText('Learning Velocity')).toBeInTheDocument();
  expect(await screen.findByText('Skill Gap')).toBeInTheDocument();
  // ... all 6 analytics
});
```

**3. E2E Tests** (10% of tests):
```javascript
// Test full user journey with Playwright
test('learner can view analytics and export report', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'learner@example.com');
  await page.click('button[type=submit]');
  await page.waitForURL('/learner/dashboard');
  
  // Verify analytics loaded
  await expect(page.locator('text=Learning Velocity')).toBeVisible();
  
  // Export report
  await page.click('button:has-text("Export PDF")');
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toContain('.pdf');
});
```

### **BE (Backend Engineer)** [Round 3]
**Backend testing strategy**:

**1. Unit Tests** (70% of tests):
```javascript
// Test business logic
describe('Analytics Calculator', () => {
  test('calculates learning velocity correctly', () => {
    const result = calculateVelocity({
      topicsCompleted: 7,
      daysActive: 7
    });
    expect(result.topicsPerWeek).toBe(7);
    expect(result.momentum).toBe('Steady');
  });
});

// Test service methods
describe('Integration Service', () => {
  test('fetches from Directory with circuit breaker', async () => {
    const data = await integrationService.fetchFromDirectory('/users/123');
    expect(data).toHaveProperty('id');
  });
});
```

**2. Integration Tests** (20% of tests):
```javascript
// Test API endpoints + database
describe('GET /api/v1/analytics/learner/:userId', () => {
  test('returns analytics for valid user', async () => {
    const response = await request(app)
      .get('/api/v1/analytics/learner/user123')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);
    
    expect(response.body.data).toHaveProperty('velocity');
    expect(response.body.data).toHaveProperty('skillGaps');
  });
  
  test('returns 403 for unauthorized user', async () => {
    await request(app)
      .get('/api/v1/analytics/learner/otheruser')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(403);
  });
});
```

**3. Database Tests**:
```javascript
// Test Prisma queries + RLS
describe('Database Queries', () => {
  test('RLS prevents cross-org data access', async () => {
    await prisma.$executeRaw`
      SET app.current_org_id = 'org1'
    `;
    
    const analytics = await prisma.learnerAnalytics.findMany();
    expect(analytics.every(a => a.organizationId === 'org1')).toBe(true);
  });
});
```

---

## 🎯 Round 4-8: Coverage Goals & Implementation

### **TL (Tech Lead)** [Round 4]
**Coverage configuration**:

**Frontend** (`frontend/jest.config.js`):
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/test/**',
    '!src/**/*.test.{js,jsx}',
    '!src/**/mocks/**'
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85
    },
    // Stricter for critical modules
    './src/services/': {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95
    }
  },
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { configFile: './babel.config.js' }]
  }
};
```

**Backend** (`backend/jest.config.js`):
```javascript
module.exports = {
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85
    },
    './src/services/': {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95
    },
    './src/middleware/auth.js': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
};
```

### **QA (QA Engineer)** [Round 5]
**Test data management**:

**Problem**: Tests need realistic data
**Solution**: Test data factories

```javascript
// backend/src/test/factories/user.factory.js
class UserFactory {
  static create(overrides = {}) {
    return {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      organizationId: 'org_test',
      role: 'learner',
      createdAt: new Date(),
      ...overrides
    };
  }
  
  static createMany(count, overrides = {}) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

// Usage in tests
const user = UserFactory.create({ role: 'trainer' });
const users = UserFactory.createMany(10);
```

**Benefits**:
- ✅ Consistent test data
- ✅ Easy to create variations
- ✅ Realistic data shapes

### **FE (Frontend Engineer)** [Round 6]
**Frontend test organization**:

```
frontend/
├── src/
│   ├── components/
│   │   ├── LearnerDashboard.jsx
│   │   └── LearnerDashboard.test.jsx      // Co-located tests
│   ├── hooks/
│   │   ├── useLearnerAnalytics.js
│   │   └── useLearnerAnalytics.test.js
│   └── test/
│       ├── setup.js                        // Global test setup
│       ├── utils.jsx                       // Test utilities (render with providers)
│       ├── mocks/
│       │   ├── handlers.js                 // MSW handlers
│       │   └── data.js                     // Mock data
│       └── factories/
│           └── analytics.factory.js        // Test data factories
```

**Test utilities**:
```javascript
// frontend/src/test/utils.jsx
export function renderWithProviders(ui, options = {}) {
  const AllProviders = ({ children }) => (
    <SWRConfig value={{ provider: () => new Map() }}>
      <RoleProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </RoleProvider>
    </SWRConfig>
  );
  
  return render(ui, { wrapper: AllProviders, ...options });
}

// Usage
test('component test', () => {
  renderWithProviders(<MyComponent />);
});
```

### **BE (Backend Engineer)** [Round 7]
**Backend test organization**:

```
backend/
├── src/
│   ├── services/
│   │   ├── analyticsService.js
│   │   └── __tests__/
│   │       └── analyticsService.test.js
│   ├── api/
│   │   ├── analytics.routes.js
│   │   └── __tests__/
│   │       └── analytics.routes.test.js
│   └── test/
│       ├── setup.js                        // Global test setup
│       ├── helpers.js                      // Test helpers
│       ├── fixtures/                       // Test fixtures
│       │   ├── users.json
│       │   └── analytics.json
│       └── factories/
│           ├── user.factory.js
│           └── analytics.factory.js
```

**Test helpers**:
```javascript
// backend/src/test/helpers.js
export async function createTestUser(overrides = {}) {
  const user = await prisma.user.create({
    data: UserFactory.create(overrides)
  });
  return user;
}

export function generateValidToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export async function cleanDatabase() {
  await prisma.learnerAnalytics.deleteMany();
  await prisma.user.deleteMany();
}
```

### **SA (Software Architect)** [Round 8]
**Test isolation**:

**Problem**: Tests interfere with each other
**Solutions**:

**1. Database isolation** (Backend):
```javascript
beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

**2. SWR cache isolation** (Frontend):
```javascript
beforeEach(() => {
  // Clear SWR cache between tests
  cache.clear();
});
```

**3. MSW handler isolation** (Frontend):
```javascript
afterEach(() => {
  server.resetHandlers();
});
```

**4. pg-boss job isolation** (Backend):
```javascript
beforeEach(async () => {
  await boss.deleteQueue('collect-analytics');
});
```

---

## 🎯 Round 9-12: CI/CD Integration

### **TL (Tech Lead)** [Round 9]
**CI/CD test pipeline**:

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Run tests with coverage
        working-directory: ./frontend
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/coverage-final.json
          flags: frontend
      
      - name: Check coverage threshold
        run: |
          COVERAGE=$(jq '.total.statements.pct' frontend/coverage/coverage-summary.json)
          if (( $(echo "$COVERAGE < 85" | bc -l) )); then
            echo "Coverage $COVERAGE% is below threshold 85%"
            exit 1
          fi
  
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: ms8_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run migrations
        working-directory: ./backend
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/ms8_test
      
      - name: Run tests with coverage
        working-directory: ./backend
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/ms8_test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/coverage-final.json
          flags: backend
  
  e2e-tests:
    runs-on: ubuntu-latest
    needs: [frontend-tests, backend-tests]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: microsoft/playwright-action@v0.0.1
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### **QA (QA Engineer)** [Round 10]
**Quality gates**:

**1. Coverage gate**: Must meet 85% threshold
```yaml
- name: Coverage Gate
  run: |
    if [ $COVERAGE -lt 85 ]; then
      echo "❌ Coverage below threshold"
      exit 1
    fi
```

**2. No flaky tests**: Must pass 3 times in a row
```yaml
- name: Run tests (retry on failure)
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: npm test
```

**3. Performance gate**: Tests must complete in < 5 min
```yaml
- name: Test Performance Gate
  run: |
    if [ $TEST_DURATION -gt 300 ]; then
      echo "❌ Tests took too long"
      exit 1
    fi
```

**4. Security scan**: No critical vulnerabilities
```yaml
- name: Security Audit
  run: npm audit --audit-level=critical
```

### **FE (Frontend Engineer)** [Round 11]
**Watch mode for development**:

```json
// frontend/package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage"
  }
}
```

**Developer workflow**:
1. Write test (RED)
2. `npm run test:watch` (auto-runs on save)
3. Write code (GREEN)
4. Refactor
5. `npm run test:coverage` (check coverage)

### **BE (Backend Engineer)** [Round 12]
**Parallel test execution**:

```javascript
// backend/jest.config.js
module.exports = {
  maxWorkers: '50%', // Use 50% of CPU cores
  testTimeout: 10000, // 10s timeout per test
  
  // Run tests in parallel
  testMatch: ['**/__tests__/**/*.test.js'],
  
  // Setup/teardown
  globalSetup: './src/test/globalSetup.js',
  globalTeardown: './src/test/globalTeardown.js'
};
```

**Test execution time**:
- Unit tests: ~2 min (1000+ tests)
- Integration tests: ~2 min (100+ tests)
- E2E tests: ~1 min (20+ tests)
- **Total**: < 5 min ✅

---

## 🎯 Round 13-15: Documentation & Best Practices

### **TL (Tech Lead)** [Round 13]
**Testing documentation**:

**1. Testing Guide** (`docs/guides/testing.md`):
```markdown
# Testing Guide

## Running Tests

### Frontend
```bash
cd frontend
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
npm run test:ui           # Visual UI
```

### Backend
```bash
cd backend
npm test                  # Run all tests
npm test -- services      # Run specific folder
npm test -- --coverage    # With coverage
```

### E2E
```bash
npm run test:e2e          # Headless
npm run test:e2e:headed   # With browser
npm run test:e2e:debug    # Debug mode
```

## Writing Tests

### Frontend Component Test
```javascript
import { renderWithProviders } from '@/test/utils';

test('component renders correctly', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Backend API Test
```javascript
import request from 'supertest';
import app from '@/app';

test('API returns data', async () => {
  const response = await request(app)
    .get('/api/v1/analytics/learner/123')
    .expect(200);
  
  expect(response.body.data).toBeDefined();
});
```

## Test Data

Use factories for consistent test data:
```javascript
const user = UserFactory.create();
const analytics = AnalyticsFactory.create({ userId: user.id });
```

## Coverage Requirements

- **Global**: 85%+
- **Critical modules**: 95%+
- **Auth middleware**: 100%

## Best Practices

1. ✅ Test behavior, not implementation
2. ✅ Use factories for test data
3. ✅ Isolate tests (clean database between tests)
4. ✅ Mock external dependencies (MSW for frontend, nock for backend)
5. ✅ Keep tests fast (< 5 min total)
6. ❌ Don't test third-party libraries
7. ❌ Don't test constants or types
```

### **QA (QA Engineer)** [Round 14]
**Test maintenance**:

**Monthly review**:
1. Identify flaky tests → fix or remove
2. Identify slow tests → optimize or split
3. Update test data to match production patterns
4. Review coverage reports → add tests for uncovered code

**Automated monitoring**:
```javascript
// Track test metrics
const testMetrics = {
  totalTests: 1500,
  passRate: 99.5,
  avgDuration: 4.2, // minutes
  flakyTests: 2,
  coverage: 87.3
};

// Alert if metrics degrade
if (testMetrics.passRate < 95) {
  sendAlert('Test pass rate below 95%');
}
```

### **SA (Software Architect)** [Round 15]
**Testing philosophy**:

**What to test**:
- ✅ Business logic (analytics calculations)
- ✅ API contracts (request/response)
- ✅ User workflows (E2E)
- ✅ Security (auth, RBAC, RLS)
- ✅ Error handling
- ✅ Edge cases

**What NOT to test**:
- ❌ Third-party libraries (Prisma, SWR, Express)
- ❌ Constants and enums
- ❌ TypeScript/JSDoc types
- ❌ Simple getters/setters

**Test confidence over coverage**:
> 85% coverage with good tests > 95% coverage with shallow tests

**Prioritize tests that catch real bugs**.

---

## ✅ CONSENSUS REACHED

**Decision**: **Hybrid Approach (TDD for new + Risk-based for existing)**

**Unanimous Vote**: 5/5 participants approve

**Rationale**:
1. ✅ **TDD for new features** - Ensures quality from day 1
2. ✅ **Risk-based for existing** - Focus effort on critical code
3. ✅ **85%+ coverage achieved** - Without excessive effort
4. ✅ **Test pyramid maintained** - 70% unit, 20% integration, 10% E2E
5. ✅ **Fast feedback** - Tests complete in < 5 minutes
6. ✅ **CI/CD integrated** - Automated on every PR
7. ✅ **Quality gates enforced** - Coverage, performance, security

**Implementation Plan**:

**1. Test Stack**:
- **Frontend**: Jest + React Testing Library + MSW + Istanbul
- **Backend**: Jest + Supertest + nock + Istanbul
- **E2E**: Playwright
- **Coverage**: Istanbul (Jest built-in, both frontend + backend)

**2. Coverage Thresholds**:
```javascript
{
  global: { statements: 85, branches: 85, functions: 85, lines: 85 },
  critical: { statements: 95, branches: 95, functions: 95, lines: 95 },
  auth: { statements: 100, branches: 100, functions: 100, lines: 100 }
}
```

**3. Test Organization**:
- Co-located tests (next to source files)
- Shared test utilities (`test/utils`)
- Test factories for data (`test/factories`)
- MSW handlers for mocking (`test/mocks`)

**4. CI/CD Pipeline**:
- Run tests on every PR
- Enforce coverage thresholds
- Upload coverage to Codecov
- E2E tests on main branch only (for speed)

**5. Developer Workflow**:
- **TDD cycle**: RED → GREEN → REFACTOR
- **Watch mode**: Auto-run tests on save
- **Coverage reports**: Check after each feature

**6. Quality Gates**:
- ✅ 85%+ coverage
- ✅ All tests pass
- ✅ Tests complete in < 5 min
- ✅ No critical security issues

**Documentation**:
- ADR-005: Test Coverage Strategy
- Guide: `docs/guides/testing.md`
- Examples: `frontend/src/test/examples/`, `backend/src/test/examples/`

**Timeline**: 2 days (setup + documentation)

**Next Steps**:
- Setup test infrastructure (Jest, Playwright)
- Configure coverage thresholds
- Create test utilities and factories
- Write initial tests for critical modules
- Integrate with CI/CD

---

**Debate Completed**: October 24, 2025  
**Status**: ✅ CONSENSUS ACHIEVED  
**Decision**: Hybrid (TDD for new + Risk-based for existing)

