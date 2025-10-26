# Integration Patterns - MS8 Learning Analytics

**Project**: MS8 - Learning Analytics Microservice  
**Phase**: 1C - Planning  
**Date**: October 24, 2025  
**Purpose**: Integration patterns for 9 external microservices, deployment, API testing

---

## 1. Circuit Breaker + Mock Fallback Pattern

See `implementation_patterns.md` for Circuit Breaker implementation.

**Key Pattern**: Real data → Circuit breaker → Mock data fallback

## 2. API Testing Patterns

### 2.1 Supertest API Tests

```javascript
// backend/tests/analytics.test.js
import request from 'supertest';
import app from '../src/presentation/server.js';

describe('Analytics API', () => {
  let authToken;
  
  beforeAll(async () => {
    // Login to get JWT
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = response.body.token;
  });
  
  it('should get learner analytics', async () => {
    const response = await request(app)
      .get('/api/v1/analytics/learner/user-1')
      .set('Authorization', `Bearer ${authToken}`)
      .set('X-Active-Role', 'learner');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('velocity');
  });
});
```

## 3. Deployment Patterns

### 3.1 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Next**: See `performance_guidelines.md`, `security_patterns.md`.

