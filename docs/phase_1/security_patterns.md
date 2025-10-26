# Security Patterns - MS8 Learning Analytics

**Project**: MS8 - Learning Analytics Microservice  
**Phase**: 1C - Planning  
**Date**: October 24, 2025  
**Purpose**: Authentication, authorization (RBAC), security controls

---

## 1. Authentication Pattern (JWT)

```javascript
// backend/src/presentation/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles,
      organizationId: decoded.organizationId
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

## 2. Authorization Pattern (RBAC - 3 Layers)

### Layer 1: Frontend (Conditional Rendering)
```javascript
// frontend/src/presentation/components/RoleSwitcher.jsx
export function RoleSwitcher() {
  const { activeRole, availableRoles, switchRole } = useRole();
  
  return (
    <select value={activeRole} onChange={(e) => switchRole(e.target.value)}>
      {availableRoles.map(role => (
        <option key={role} value={role}>{Role.getDisplayName(role)}</option>
      ))}
    </select>
  );
}
```

### Layer 2: Backend Middleware
```javascript
// backend/src/presentation/middleware/rbacMiddleware.js
export function rbacMiddleware(allowedRoles) {
  return (req, res, next) => {
    const activeRole = req.headers['x-active-role'];
    
    if (!activeRole) {
      return res.status(400).json({ error: 'X-Active-Role header required' });
    }
    
    if (!req.user.roles.includes(activeRole)) {
      return res.status(403).json({ error: 'Role not assigned to user' });
    }
    
    if (!allowedRoles.includes(activeRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}
```

### Layer 3: Database RLS
See `database_patterns.md` for RLS policies.

## 3. Security Controls

- **Input Validation**: Joi/Zod schemas
- **SQL Injection**: Prisma ORM prevents
- **XSS**: React escaping + CSP headers
- **CORS**: Whitelist origins
- **Rate Limiting**: 5 requests per 10min for refresh endpoint
- **K-Anonymity**: ≥10 users for comparisons
- **No PII in Logs**: Correlation IDs only

**Summary**: 6-layer defense (3 frontend + 3 backend).

