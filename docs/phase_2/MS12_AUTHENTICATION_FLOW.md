# MS12 Authentication Flow - MS8 Learning Analytics

**Version**: 1.0.0  
**Last Updated**: 2024-01-22  
**Status**: ✅ Implemented

## Overview

MS8 Learning Analytics implements a robust authentication flow with MS12 (Authentication Microservice) integration and automatic mock fallback. This ensures the application remains functional even when MS12 is unavailable.

## Architecture

### Authentication Flow Diagram

```
┌─────────────┐
│   Frontend  │
│  LoginPage  │
└──────┬──────┘
       │ POST /api/v1/auth/login {email, password}
       ▼
┌──────────────────────────────────────────────────┐
│            Backend Auth Route                     │
│    (backend/routes/auth.js)                       │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│          AuthService.authenticate()               │
│     (backend/services/authService.js)             │
└──────────────┬───────────────────────────────────┘
               │
               ├─────────────────────────────────────┐
               │                                     │
               ▼                                     ▼
┌──────────────────────────┐         ┌─────────────────────────────┐
│ Attempt MS12 Auth        │         │  MS12 Unavailable           │
│ - POST to MS12 API       │         │  Fallback to Mock           │
│ - Retry 3 times          │         │  - Lookup user in mockData  │
│ - 5s timeout             │         │  - Validate password        │
└────────┬─────────────────┘         │  - Generate JWT             │
         │                           └──────────┬──────────────────┘
         │                                     │
         ├─────────── SUCCESS ─────────────────┤
         │                                     │
         ▼                                     ▼
┌──────────────────────────────────────────────────┐
│           Generate JWT Token                      │
│  - Include: userId, email, role, roles[]         │
│  - Include: organizationId, source (MS12|MOCK)   │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│         Return to Frontend                        │
│  {                                                 │
│    token: "jwt_token...",                          │
│    user: { id, email, role, roles[], ... },       │
│    source: "MS12" | "MOCK"                        │
│  }                                                 │
└──────────────────────────────────────────────────┘
```

## Components

### 1. Frontend (`LoginPage.jsx`)

**Location**: `frontend/src/presentation/pages/LoginPage.jsx`

**Responsibilities**:
- Collect user credentials (email, password)
- Call `/api/v1/auth/login` endpoint
- Store JWT token and user data
- Navigate to appropriate dashboard based on role

**Key Features**:
- No authentication headers sent with login request
- Handles multi-role users (default to first role)
- Redirects authenticated users automatically

### 2. Backend Auth Route

**Location**: `backend/routes/auth.js`

**Endpoint**: `POST /api/v1/auth/login`

**Flow**:
1. Validate request body (email format, password length)
2. Call `AuthService.authenticate(email, password)`
3. Return JWT token, user data, and source

**Response Format**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "learner-123",
    "email": "learner@test.com",
    "role": "learner",
    "roles": ["learner"],
    "organization_id": "org-123",
    "fullName": "John Learner",
    "department": "Engineering"
  },
  "source": "MS12" | "MOCK"
}
```

### 3. AuthService

**Location**: `backend/services/authService.js`

**Key Methods**:

#### `authenticate(email, password)`
Primary authentication method with automatic fallback.

**Flow**:
1. Attempt MS12 authentication (up to 3 retries)
2. If MS12 fails/unavailable, fall back to mock data
3. Generate JWT token
4. Return token and user data

#### `authenticateWithMS12(email, password)`
Attempts to authenticate with MS12 microservice.

**Configuration**:
- Base URL: `process.env.MS12_API_URL` or `https://ms12-production.up.railway.app`
- Endpoint: `POST /api/v1/auth/login`
- Timeout: 5 seconds
- Retry: 3 attempts with 1-second delay
- Headers: `Content-Type`, `X-API-Key`

#### `generateJWTToken(ms12Response, mockUser)`
Generates JWT token with user data from either MS12 or mock source.

**Payload Includes**:
- `userId`: User identifier
- `email`: User email
- `role`: Active role (for single-role users)
- `roles`: Array of all roles (for multi-role users)
- `organizationId`: Organization identifier
- `source`: "MS12" or "MOCK"

### 4. Mock Data Service

**Location**: `backend/services/mockData.js`

**Users Available**:
1. **learner@test.com** / password123
   - Roles: `['learner']`
   - ID: `learner-123`

2. **trainer@test.com** / password123
   - Roles: `['trainer']`
   - ID: `trainer-456`

3. **admin@test.com** / password123
   - Roles: `['org-admin']`
   - ID: `admin-789`

4. **supertester@test.com** / password123
   - Roles: `['learner', 'trainer', 'org-admin']` (multi-role)
   - ID: `supertester-999`

## MS12 Integration

### MS12 Configuration

**Environment Variables**:
```env
MS12_API_URL=https://ms12-production.up.railway.app
MS12_API_KEY=your-api-key-here
JWT_SECRET=your-jwt-secret-key
```

### MS12 API Contract

#### POST /api/v1/auth/login

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "ms12_jwt_token",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["learner", "trainer"],
    "organizationId": "org_456"
  }
}
```

### Mock Fallback Strategy

When MS12 is unavailable, the system:

1. **Attempts MS12** with retry logic (3 attempts, 5-second timeout)
2. **Catches Connection Errors** (network issues, timeout, etc.)
3. **Falls Back to Mock Data** stored in `mockData.js`
4. **Generates JWT** with same structure as MS12 response
5. **Returns Response** indicating source as "MOCK"

**Benefits**:
- ✅ Development can proceed without MS12
- ✅ System remains functional during MS12 outages
- ✅ Clear indication of data source ("MS12" vs "MOCK")
- ✅ Seamless transition between MS12 and mock

## Security

### JWT Token

**Issued By**: MS8 Backend  
**Algorithm**: HS256  
**Expiration**: 24 hours  
**Secret**: Stored in `JWT_SECRET` environment variable

**Token Payload Structure**:
```json
{
  "userId": "learner-123",
  "email": "learner@test.com",
  "role": "learner",
  "roles": ["learner"],
  "organizationId": "org-123",
  "source": "MOCK",
  "iat": 1705924800,
  "exp": 1706011200
}
```

### Authentication Headers

Once authenticated, all requests must include:

```
Authorization: Bearer {jwt_token}
X-Active-Role: {active_role}  // For multi-role users
```

## Multi-Role User Support

### Supertester User

The `supertester@test.com` user demonstrates multi-role capability:

```javascript
{
  id: 'supertester-999',
  email: 'supertester@test.com',
  role: 'learner',  // Default active role
  roles: ['learner', 'trainer', 'org-admin'],  // All available roles
  organization_id: 'org-123',
  fullName: 'Super Tester',
  department: 'QA & Testing'
}
```

### Role Switching

Users can switch between their assigned roles:

1. Frontend calls `/api/v1/auth/switch-role`
2. Backend validates user has the requested role
3. Returns updated JWT with new active role
4. Frontend updates `X-Active-Role` header

## Error Handling

### Authentication Errors

| Error Code | Status | Description | Solution |
|-----------|--------|-------------|----------|
| INVALID_CREDENTIALS | 401 | Email or password incorrect | Check credentials |
| MISSING_TOKEN | 401 | Token not provided | Login again |
| INVALID_TOKEN | 403 | Token expired or invalid | Refresh token |
| INSUFFICIENT_PERMISSIONS | 403 | User lacks required role | Switch role or contact admin |

### MS12 Errors

When MS12 is unavailable:
- System logs the error
- Automatically falls back to mock data
- Returns response with `source: "MOCK"`
- No error propagated to frontend (seamless fallback)

## Testing

### Manual Testing

1. **Test Login with Mock Credentials**:
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"learner@test.com","password":"password123"}'
   ```

2. **Test Multi-Role User**:
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"supertester@test.com","password":"password123"}'
   ```

3. **Verify JWT Token**:
   Decode JWT at https://jwt.io to verify payload structure

### Integration Testing

Tests are located in:
- `backend/tests/auth.test.js` - Authentication route tests
- `frontend/src/test/` - Frontend authentication tests

## Environment Setup

### Development (Mock Mode)

```env
# MS12 Configuration (optional)
MS12_API_URL=
MS12_API_KEY=
JWT_SECRET=local-dev-secret-key-DO-NOT-USE-IN-PRODUCTION
```

### Production (MS12 Integration)

```env
MS12_API_URL=https://ms12-production.up.railway.app
MS12_API_KEY=<production-api-key>
JWT_SECRET=<production-jwt-secret>
```

## Troubleshooting

### Issue: "Invalid credentials" error

**Cause**: Email/password mismatch or user not in mock data

**Solution**: Verify credentials match mock users in `mockData.js`

### Issue: MS12 timeout errors

**Cause**: MS12 service slow or unavailable

**Solution**: System automatically falls back to mock data

### Issue: JWT token not working

**Cause**: Token expired or invalid signature

**Solution**: 
- Check `JWT_SECRET` matches between backend instances
- Verify token expiration (24 hours)
- Login again to get new token

## Related Documentation

- [Phase 2 Backend Architecture](./phase_2b_backend_architecture.md)
- [Phase 2 Integration Architecture](./phase_2c_integration_architecture.md)
- [API Connectivity Guide](../API_CONNECTIVITY_GUIDE.md)

## Changelog

### Version 1.0.0 (2024-01-22)
- Initial implementation with MS12 integration
- Mock fallback strategy
- Multi-role user support
- Comprehensive error handling

---

**Document Maintained By**: MS8 Learning Analytics Team  
**Review Status**: ✅ Reviewed  
**Next Review Date**: 2024-04-22
