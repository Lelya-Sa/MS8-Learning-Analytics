# Database Patterns - MS8 Learning Analytics

**Project**: MS8 - Learning Analytics Microservice  
**Phase**: 1C - Planning  
**Date**: October 24, 2025  
**Purpose**: Database implementation patterns (Prisma ORM, query optimization, migrations, RLS)

---

## 1. Prisma Schema Patterns

### 1.1 Core Schema

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  name           String
  roles          String[] // ['learner', 'trainer', 'org_admin']
  organizationId String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  analytics      Analytics[]
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  @@index([organizationId])
  @@index([email])
  @@map("users")
}

model Organization {
  id                String   @id @default(uuid())
  name              String
  kpis              String[] // JSON array of KPIs
  valuePropositions String[] // JSON array
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  users             User[]
  analytics         Analytics[]
  
  @@map("organizations")
}

model Analytics {
  id             String   @id @default(uuid())
  userId         String
  role           String   // 'learner', 'trainer', 'org_admin'
  analyticsType  String   // 'learning_velocity', 'skill_gap', etc.
  data           Json     // JSONB column for flexible data
  organizationId String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  @@unique([userId, role, analyticsType])
  @@index([userId, role])
  @@index([organizationId])
  @@index([updatedAt])
  @@map("analytics")
}

model AggregatedAnalytics {
  id               String   @id @default(uuid())
  aggregationType  String   // 'daily', 'weekly', 'monthly'
  organizationId   String
  role             String
  analyticsType    String
  data             Json
  periodStart      DateTime
  periodEnd        DateTime
  createdAt        DateTime @default(now())
  
  @@index([organizationId, periodStart, periodEnd])
  @@index([aggregationType, analyticsType])
  @@map("aggregated_analytics")
}

model Report {
  id             String   @id @default(uuid())
  userId         String
  role           String
  format         String   // 'pdf', 'csv', 'excel', 'json'
  data           Json
  fileUrl        String?
  organizationId String
  createdAt      DateTime @default(now())
  
  @@index([userId, role])
  @@index([createdAt])
  @@map("reports")
}

model Gamification {
  id             String   @id @default(uuid())
  userId         String
  role           String
  badges         Json     // Array of badge objects
  streaks        Json     // Streak data
  points         Int      @default(0)
  level          Int      @default(1)
  organizationId String
  updatedAt      DateTime @updatedAt
  
  @@unique([userId, role])
  @@index([userId])
  @@index([organizationId, points])
  @@map("gamification")
}
```

### 1.2 Migration Patterns

```javascript
// backend/prisma/migrations/20251024_add_rls_policies.sql

-- Enable RLS on analytics table
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analytics
CREATE POLICY analytics_user_isolation_policy ON analytics
FOR SELECT
USING (user_id = current_setting('app.current_user_id')::uuid);

-- Policy: Users can only insert their own analytics
CREATE POLICY analytics_insert_policy ON analytics
FOR INSERT
WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);

-- Policy: Org admins can see all analytics in their org
CREATE POLICY analytics_org_admin_policy ON analytics
FOR SELECT
USING (
  organization_id = current_setting('app.current_org_id')::uuid
  AND current_setting('app.current_role') = 'org_admin'
);

-- Materialized view for peer comparison (K-anonymity)
CREATE MATERIALIZED VIEW comparison_aggregates AS
SELECT
  organization_id,
  role,
  analytics_type,
  COUNT(DISTINCT user_id) as user_count,
  AVG((data->>'velocity')::numeric) as avg_velocity,
  AVG((data->>'engagement')::numeric) as avg_engagement,
  AVG((data->>'mastery')::numeric) as avg_mastery
FROM analytics
WHERE updated_at > NOW() - INTERVAL '7 days'
GROUP BY organization_id, role, analytics_type
HAVING COUNT(DISTINCT user_id) >= 10;  -- K-anonymity enforcement

CREATE UNIQUE INDEX ON comparison_aggregates (organization_id, role, analytics_type);

-- Refresh materialized view (run daily)
REFRESH MATERIALIZED VIEW CONCURRENTLY comparison_aggregates;

-- Table partitioning for aggregated_analytics (7-year retention)
CREATE TABLE aggregated_analytics_2025 PARTITION OF aggregated_analytics
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE aggregated_analytics_2026 PARTITION OF aggregated_analytics
FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- Indexes for query performance
CREATE INDEX idx_analytics_user_role_type ON analytics(user_id, role, analytics_type);
CREATE INDEX idx_analytics_stale ON analytics(updated_at) WHERE updated_at < NOW() - INTERVAL '6 hours';
CREATE INDEX idx_aggregated_org_period ON aggregated_analytics(organization_id, period_start, period_end);
```

## 2. Query Optimization Patterns

### 2.1 Efficient Queries

```javascript
// backend/src/infrastructure/adapters/AnalyticsRepositoryPrisma.js

// ✅ GOOD: Use indexes, select only needed fields
async findRecentAnalytics(userId, role, limit = 10) {
  return this.prisma.analytics.findMany({
    where: { userId, role },
    select: {
      id: true,
      analyticsType: true,
      data: true,
      updatedAt: true
    },
    orderBy: { updatedAt: 'desc' },
    take: limit
  });
}

// ✅ GOOD: Use aggregation for counts
async getAnalyticsSummary(userId, role) {
  const [count, latest] = await Promise.all([
    this.prisma.analytics.count({
      where: { userId, role }
    }),
    this.prisma.analytics.findFirst({
      where: { userId, role },
      orderBy: { updatedAt: 'desc' }
    })
  ]);
  
  return { count, latest };
}

// ✅ GOOD: Batch operations
async saveMultiple(analyticsArray) {
  return this.prisma.$transaction(
    analyticsArray.map(analytics =>
      this.prisma.analytics.upsert({
        where: {
          userId_role_analyticsType: {
            userId: analytics.userId,
            role: analytics.role,
            analyticsType: analytics.analyticsType
          }
        },
        update: { data: analytics.data, updatedAt: new Date() },
        create: analytics
      })
    )
  );
}
```

## 3. RLS (Row-Level Security) Implementation

```javascript
// backend/src/infrastructure/adapters/AnalyticsRepositoryPrisma.js

/**
 * Set RLS context for current request
 */
async setRLSContext(userId, organizationId, role) {
  await this.prisma.$executeRaw`
    SELECT set_config('app.current_user_id', ${userId}, true);
  `;
  await this.prisma.$executeRaw`
    SELECT set_config('app.current_org_id', ${organizationId}, true);
  `;
  await this.prisma.$executeRaw`
    SELECT set_config('app.current_role', ${role}, true);
  `;
}

// Usage in middleware
// backend/src/presentation/middleware/rlsMiddleware.js
export async function rlsMiddleware(req, res, next) {
  if (req.user) {
    const repository = container.getAnalyticsRepository();
    await repository.setRLSContext(
      req.user.id,
      req.user.organizationId,
      req.headers['x-active-role']
    );
  }
  next();
}
```

## 4. Database Testing Patterns

```javascript
// tests/database.test.js

describe('Analytics Repository', () => {
  beforeEach(async () => {
    // Clean database
    await prisma.analytics.deleteMany();
    await prisma.user.deleteMany();
  });
  
  it('should enforce RLS policies', async () => {
    const user1 = await prisma.user.create({
      data: { id: 'user-1', email: 'user1@test.com', /* ... */ }
    });
    
    const user2 = await prisma.user.create({
      data: { id: 'user-2', email: 'user2@test.com', /* ... */ }
    });
    
    // Set RLS context for user1
    await repository.setRLSContext(user1.id, user1.organizationId, 'learner');
    
    // user1 should NOT see user2's analytics
    const result = await repository.findByUserIdAndRole(user2.id, 'learner');
    expect(result).toHaveLength(0);
  });
});
```

**Next**: See `integration_patterns.md`, `performance_guidelines.md`, `security_patterns.md`.

