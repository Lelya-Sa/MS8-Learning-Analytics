# Phase 1A Debate #4: External Microservice Mock Data Strategy

**Debate Information**
- **Phase**: 1A - Requirements Gathering
- **Topic**: Mock Data Strategy for External Microservices
- **Participants**: TL (Tech Lead), BE (Backend Engineer), FE (Frontend Engineer), IE (Integration Engineer), SA (Software Architect)
- **Debate Format**: 15 rounds until consensus
- **Decision Impact**: Development speed, testing reliability, integration architecture
- **Date**: October 24, 2025

---

## 📋 Context

**Question**: How should MS8 handle mock data for 9 external microservices during development?

**External Microservices** (All REST API, except RAG via gRPC later):
1. Auth (MS12) - Sessions, roles, JWT
2. Directory - Users, orgs, departments, KPIs
3. Course Builder - Courses, enrollment, progress
4. Content Studio - Content usage, types
5. Assessment - Tests, grades, attempts
6. Skills Engine - Skills, competency levels
7. Learner AI - Learning paths, recommendations
8. DevLab - Practice sessions
9. RAG Assistant - Chatbot interactions (gRPC)

**Options**:
1. **Backend Mock Files** - JSON files in `backend/mocks/`
2. **Mock API Server** - Separate Express server mimicking microservices
3. **MSW (Mock Service Worker)** - Intercept HTTP requests with mocks
4. **Hybrid (Backend fallback + MSW for testing)** - Backend returns mocks on error, MSW for tests
5. **Contract Testing** - Define contracts, generate mocks from contracts

**Requirements**:
- **Fallback strategy**: If external MS is down, use mock data
- **Development**: Work offline without external dependencies
- **Testing**: Reliable tests without external API calls
- **Production**: Real data from external MS, fallback to mock on failure

---

## 🎯 Round 1-3: Quick Consensus (Backend Fallback)

### **TL (Tech Lead)** [Round 1]
**Recommendation: Option 4 (Hybrid - Backend Fallback + MSW)**

Rationale:
- ✅ **Backend fallback**: Production-safe (if MS down, serve mock)
- ✅ **MSW for tests**: Fast, reliable, no external dependencies
- ✅ **Clear separation**: Backend = fallback, MSW = testing
- ✅ **Simple to maintain**: One source of truth (backend mocks)

**Implementation**:
```javascript
// backend/src/services/integrationService.js
async function fetchFromDirectory(endpoint) {
  try {
    const response = await fetch(`${DIRECTORY_MS_URL}${endpoint}`);
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    console.warn('Directory MS unavailable, using mock data');
    return MOCK_DIRECTORY_DATA[endpoint];
  }
}
```

### **BE (Backend Engineer)** [Round 1]
**Strong agreement**:

Backend should own the fallback logic because:
- ✅ **Circuit breaker pattern**: Detect failures, switch to mock
- ✅ **Partial data handling**: Some MS succeed, some fail
- ✅ **Retry logic**: Try real API first, fallback if fails
- ✅ **Logging**: Track when fallbacks occur

**Structure**:
```
backend/
├── src/
│   ├── mocks/
│   │   ├── auth.mock.js           // MS12 mock data
│   │   ├── directory.mock.js      // Directory mock data
│   │   ├── courseBuilder.mock.js  // Course Builder mock data
│   │   ├── skills.mock.js         // Skills Engine mock data
│   │   └── ...
│   └── services/
│       ├── integrationService.js  // Fetches with fallback
│       └── circuitBreaker.js      // Circuit breaker logic
```

### **FE (Frontend Engineer)** [Round 2]
**Agreement + Testing needs**:

Frontend should never call external MS directly. Always via backend BFF.

For **frontend tests**, use MSW:
```javascript
// frontend/src/test/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v1/analytics/learner/:userId', (req, res, ctx) => {
    return res(ctx.json(MOCK_LEARNER_ANALYTICS));
  }),
];
```

**Why MSW for tests**:
- ✅ No need to mock fetch globally
- ✅ Test different scenarios (success, error, timeout)
- ✅ Same code path as production (HTTP requests)

### **IE (Integration Engineer)** [Round 3]
**Hybrid makes sense**:

**Development flow**:
1. **Local dev**: Backend uses mocks (no external MS needed)
2. **Integration testing**: Backend calls real MS (when available)
3. **Production**: Backend calls real MS, fallback to mock on failure

**Configuration**:
```javascript
// backend/config/integration.js
const USE_REAL_MICROSERVICES = process.env.USE_REAL_MS === 'true';

export const getServiceURL = (serviceName) => {
  if (USE_REAL_MICROSERVICES) {
    return process.env[`${serviceName}_URL`];
  }
  return null; // Triggers mock fallback
};
```

### **SA (Software Architect)** [Round 3]
**Architecture perspective: Hybrid is correct**:

**Three environments**:
1. **Local Dev** (`USE_REAL_MS=false`): Always use mocks
2. **Staging** (`USE_REAL_MS=true`): Try real MS, fallback to mock
3. **Production** (`USE_REAL_MS=true`): Try real MS, fallback to mock

**Abstraction layer**:
```javascript
class MicroserviceClient {
  constructor(serviceName, mockData) {
    this.serviceName = serviceName;
    this.mockData = mockData;
    this.baseURL = getServiceURL(serviceName);
  }
  
  async fetch(endpoint) {
    if (!this.baseURL) {
      return this.mockData[endpoint];
    }
    
    try {
      return await this.callRealAPI(endpoint);
    } catch (error) {
      console.warn(`${this.serviceName} unavailable, using mock`);
      return this.mockData[endpoint];
    }
  }
}
```

---

## 🎯 Round 4-8: Mock Data Structure

### **TL (Tech Lead)** [Round 4]
**Mock data organization**:

**Option A**: One big JSON file per service
```javascript
// backend/src/mocks/directory.mock.js
export const MOCK_DIRECTORY = {
  '/users': [{ id: '1', name: 'John' }],
  '/organizations': [{ id: 'org1', name: 'Acme Corp' }],
  '/departments': [{ id: 'dept1', name: 'Engineering' }]
};
```

**Option B**: Separate files per endpoint
```javascript
// backend/src/mocks/directory/users.json
[{ "id": "1", "name": "John" }]

// backend/src/mocks/directory/organizations.json
[{ "id": "org1", "name": "Acme Corp" }]
```

**Recommendation**: Option A (single file per service) for simplicity.

### **BE (Backend Engineer)** [Round 5]
**Mock data completeness**:

Each mock should match real API response structure:

```javascript
// backend/src/mocks/skills.mock.js
export const MOCK_SKILLS = {
  '/skills/:userId': {
    userId: 'user_123',
    skills: [
      {
        skillId: 'skill_001',
        skillName: 'JavaScript',
        currentLevel: 'Intermediate',
        competencyLevel: 'Intermediate',
        acquired: true,
        progress: 75
      },
      {
        skillId: 'skill_002',
        skillName: 'React',
        currentLevel: 'Beginner',
        competencyLevel: 'Beginner',
        acquired: false,
        progress: 35
      }
    ],
    totalSkills: 15,
    acquiredSkills: 8
  }
};
```

**Function for dynamic data**:
```javascript
export const getMockSkills = (userId) => ({
  ...MOCK_SKILLS['/skills/:userId'],
  userId, // Replace with actual userId
  timestamp: new Date().toISOString()
});
```

### **FE (Frontend Engineer)** [Round 6]
**Frontend testing with MSW**:

```javascript
// frontend/src/test/setup.js
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```javascript
// frontend/src/test/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v1/analytics/learner/:userId', (req, res, ctx) => {
    const { userId } = req.params;
    return res(ctx.json({
      userId,
      velocity: { topicsPerWeek: 3.5, momentum: 'Steady' },
      skillGaps: [...],
      engagement: { score: 85 }
    }));
  }),
  
  // Error scenario
  rest.get('/api/v1/analytics/error', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Server Error' }));
  })
];
```

**Benefits**:
- ✅ Test success scenarios
- ✅ Test error scenarios
- ✅ Test loading states
- ✅ No real API calls

### **IE (Integration Engineer)** [Round 7]
**Integration testing strategy**:

**Unit tests**: Use mocks (always)
**Integration tests**: Use real MS (when available)
**E2E tests**: Use mocks (for speed and reliability)

```javascript
// backend/src/services/__tests__/integration.test.js
describe('Integration Service', () => {
  it('fetches from real Directory MS', async () => {
    // Only runs if Directory MS is available
    if (process.env.DIRECTORY_MS_URL) {
      const data = await fetchFromDirectory('/users');
      expect(data).toHaveProperty('users');
    }
  });
  
  it('falls back to mock when Directory MS is down', async () => {
    // Simulate MS down
    nock(DIRECTORY_MS_URL).get('/users').reply(500);
    
    const data = await fetchFromDirectory('/users');
    expect(data).toEqual(MOCK_DIRECTORY.'/users');
  });
});
```

### **SA (Software Architect)** [Round 8]
**Contract testing**:

Future enhancement: Use contract testing to ensure mocks match real APIs.

**Tool**: Pact or JSON Schema validation

```javascript
// backend/src/mocks/contracts/directory.contract.js
export const DIRECTORY_CONTRACTS = {
  '/users': {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string', format: 'email' },
        organizationId: { type: 'string' }
      },
      required: ['id', 'email']
    }
  }
};

// Validate mock against contract
validateMock(MOCK_DIRECTORY['/users'], DIRECTORY_CONTRACTS['/users']);
```

Not needed for MVP, but document for future.

---

## 🎯 Round 9-12: Circuit Breaker & Retry Logic

### **TL (Tech Lead)** [Round 9]
**Circuit breaker pattern**:

Prevent cascading failures when external MS is down.

**States**:
- **CLOSED**: Normal operation (try real API)
- **OPEN**: MS is down (use mock immediately, don't try)
- **HALF_OPEN**: Test if MS recovered

```javascript
// backend/src/services/circuitBreaker.js
class CircuitBreaker {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.failureThreshold = 5;
    this.timeout = 60000; // 1 minute
  }
  
  async execute(fn, fallback) {
    if (this.state === 'OPEN') {
      console.log(`Circuit OPEN for ${this.serviceName}, using fallback`);
      return fallback();
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      return fallback();
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      setTimeout(() => { this.state = 'HALF_OPEN'; }, this.timeout);
    }
  }
}
```

### **BE (Backend Engineer)** [Round 10]
**Retry logic with exponential backoff**:

```javascript
// backend/src/services/retryFetch.js
async function retryFetch(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        timeout: 5000 // 5s timeout
      });
      
      if (response.ok) return response;
      
      // Don't retry on 4xx errors
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }
      
      // Retry on 5xx errors
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await sleep(delay);
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

**Usage**:
```javascript
const circuitBreaker = new CircuitBreaker('Directory');

const data = await circuitBreaker.execute(
  () => retryFetch(DIRECTORY_URL + '/users'),
  () => MOCK_DIRECTORY['/users']
);
```

### **IE (Integration Engineer)** [Round 11]
**Partial data handling**:

Some MS succeed, some fail. How to handle?

**Strategy**: Return partial data + warnings

```javascript
async function collectAllData(userId) {
  const results = {
    directory: null,
    courseBuilder: null,
    skills: null,
    warnings: []
  };
  
  // Fetch in parallel
  const [directory, courses, skills] = await Promise.allSettled([
    fetchFromDirectory(`/users/${userId}`),
    fetchFromCourseBuilder(`/enrollment/${userId}`),
    fetchFromSkills(`/skills/${userId}`)
  ]);
  
  // Process results
  if (directory.status === 'fulfilled') {
    results.directory = directory.value;
  } else {
    results.directory = MOCK_DIRECTORY['/users/:userId'];
    results.warnings.push('Directory MS unavailable, using mock data');
  }
  
  // ... same for other services
  
  return results;
}
```

**Frontend displays warnings**:
```jsx
{data.warnings.length > 0 && (
  <Alert type="warning">
    <ul>
      {data.warnings.map(w => <li key={w}>{w}</li>)}
    </ul>
  </Alert>
)}
```

### **SA (Software Architect)** [Round 12]
**Monitoring & alerting**:

Track when fallbacks occur:

```javascript
// backend/src/services/metrics.js
const fallbackCounter = new Counter({
  name: 'microservice_fallback_total',
  help: 'Number of times fallback was used',
  labelNames: ['service', 'endpoint']
});

// In integration service
fallbackCounter.inc({ service: 'Directory', endpoint: '/users' });
```

**Alert when fallback rate > 10%**:
```yaml
alert: HighFallbackRate
expr: rate(microservice_fallback_total[5m]) > 0.1
```

---

## 🎯 Round 13-15: Documentation & Maintenance

### **TL (Tech Lead)** [Round 13]
**Documentation requirements**:

**1. Mock Data Inventory**:
```markdown
# Mock Data Inventory

## Auth (MS12)
- `/auth/validate`: JWT validation response
- `/auth/sessions/:userId`: User sessions

## Directory
- `/users/:userId`: User profile
- `/organizations/:orgId`: Organization details
- `/departments/:deptId`: Department info

... (for all 9 services)
```

**2. Integration Guide**:
```markdown
# Microservice Integration Guide

## Adding a new microservice

1. Create mock file: `backend/src/mocks/newservice.mock.js`
2. Add service to `integrationService.js`
3. Add MSW handler for frontend tests
4. Update integration tests
```

### **BE (Backend Engineer)** [Round 14]
**Mock data maintenance**:

**When to update mocks**:
- ✅ External API contract changes
- ✅ New fields added to response
- ✅ New endpoints needed

**Process**:
1. Update mock data file
2. Update contract (if using contract testing)
3. Update tests that use the mock
4. Document changes in CHANGELOG.md

**Automated validation**:
```javascript
// Run weekly
async function validateMocks() {
  for (const service of MICROSERVICES) {
    try {
      const realData = await fetch(service.url);
      const mockData = MOCKS[service.name];
      
      // Compare schemas
      const schemaDiff = compareSchemas(realData, mockData);
      if (schemaDiff.length > 0) {
        console.warn(`Mock out of date for ${service.name}:`, schemaDiff);
      }
    } catch (error) {
      console.error(`Cannot validate ${service.name}:`, error);
    }
  }
}
```

### **FE (Frontend Engineer)** [Round 15]
**Frontend developer experience**:

**Simple workflow**:
```javascript
// 1. Developer writes component
const LearnerDashboard = ({ userId }) => {
  const { data, error, isLoading } = useLearnerAnalytics(userId);
  
  // Works with real API OR mock (transparent)
  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <Dashboard data={data} />;
};

// 2. Developer writes test
test('dashboard renders analytics', async () => {
  render(<LearnerDashboard userId="123" />);
  
  // MSW intercepts API call, returns mock
  expect(await screen.findByText('Learning Velocity')).toBeInTheDocument();
});
```

**No difference between real and mock from developer perspective!**

---

## ✅ CONSENSUS REACHED

**Decision**: **Hybrid Approach (Backend Fallback + MSW for Testing)**

**Unanimous Vote**: 5/5 participants approve

**Rationale**:
1. ✅ **Backend owns fallback logic** - Production-safe, circuit breaker pattern
2. ✅ **MSW for frontend tests** - Fast, reliable, no external dependencies
3. ✅ **Offline development** - Work without external MS
4. ✅ **Resilient production** - Graceful degradation when MS down
5. ✅ **Clear separation** - Backend = fallback, MSW = testing
6. ✅ **Monitoring** - Track fallback usage, alert on high rates

**Implementation Plan**:

**1. Backend Mock Files** (`backend/src/mocks/`):
```javascript
// auth.mock.js, directory.mock.js, courseBuilder.mock.js, etc.
export const MOCK_DIRECTORY = {
  '/users/:userId': { id: 'user_123', name: 'John Doe', ... },
  '/organizations/:orgId': { id: 'org_1', name: 'Acme', ... }
};
```

**2. Integration Service with Circuit Breaker**:
```javascript
class IntegrationService {
  async fetchFromDirectory(endpoint) {
    return this.circuitBreaker.execute(
      () => retryFetch(DIRECTORY_URL + endpoint),
      () => MOCK_DIRECTORY[endpoint]
    );
  }
}
```

**3. Frontend MSW Setup** (`frontend/src/test/mocks/`):
```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  rest.get('/api/v1/analytics/*', (req, res, ctx) => {
    return res(ctx.json(MOCK_ANALYTICS));
  })
];

export const server = setupServer(...handlers);
```

**4. Configuration** (`.env`):
```bash
# Development: use mocks
USE_REAL_MS=false

# Staging/Production: try real MS, fallback to mock
USE_REAL_MS=true
DIRECTORY_MS_URL=https://directory.example.com
COURSE_BUILDER_MS_URL=https://courses.example.com
# ... (for all 9 services)
```

**5. Monitoring**:
- Track fallback usage (Prometheus metrics)
- Alert when fallback rate > 10%
- Log all fallback occurrences with correlation IDs

**Documentation**:
- ADR-004: External Microservice Mock Data Strategy
- Guide: `docs/guides/microservice-mocking.md`
- Mock inventory: `backend/src/mocks/README.md`

**Timeline**: 3 days (setup + 9 mock files + documentation)

**Next Steps**:
- Proceed to Debate #5: Test Coverage Strategy
- Document mock strategy in Phase 1A deliverables
- Create initial mock files for all 9 microservices

---

**Debate Completed**: October 24, 2025  
**Status**: ✅ CONSENSUS ACHIEVED  
**Decision**: Hybrid (Backend Fallback + MSW for Testing)

