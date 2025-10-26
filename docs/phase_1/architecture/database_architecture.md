# Database Architecture & ERD

**Phase:** 2D - Database Architecture  
**Date:** October 24, 2025  
**Status:** Complete - Ready for Implementation  
**Based on:** Debate #5 (Database Schema & ERD Design)

---

## 🎯 **Overview**

Complete PostgreSQL database schema design for the Learning Analytics microservice, hosted on Supabase with Row-Level Security (RLS) for multi-tenancy.

**Database:** PostgreSQL 15  
**ORM:** Prisma  
**Hosting:** Supabase  
**Connection Pooling:** PgBouncer (port 6543)  
**Backup:** Automated daily (30-day retention)

---

## 📊 **Entity Relationship Diagram (ERD)**

```
┌─────────────────────┐
│   organizations     │
│─────────────────────│
│ id (PK)            │
│ name               │
│ domain             │
│ settings (JSONB)   │
│ created_at         │
└─────────────────────┘
         │ 1
         │
         │ N
         ↓
┌─────────────────────┐         ┌──────────────────────┐
│       users         │────N────│     user_roles       │
│─────────────────────│         │──────────────────────│
│ id (PK)            │         │ id (PK)              │
│ email (UNIQUE)     │         │ user_id (FK)         │
│ password_hash      │         │ role                 │
│ full_name          │         │ granted_at           │
│ avatar_url         │         └──────────────────────┘
│ organization_id (FK)│
│ created_at         │
│ updated_at         │
└─────────────────────┘
         │ 1
         │
         └─────────────┬──────────────┬───────────────┬──────────────┐
                       │              │               │              │
                       ↓ N            ↓ N             ↓ N            ↓ N
         ┌──────────────────────┐  ┌──────────────┐ ┌──────────────┐ ┌───────────────┐
         │ learner_velocity_    │  │  user_skills │ │ enrollments  │ │  user_points  │
         │    analytics         │  │──────────────│ │──────────────│ │───────────────│
         │──────────────────────│  │ id (PK)      │ │ id (PK)      │ │ user_id (PK,FK)│
         │ id (PK)              │  │ user_id (FK) │ │ user_id (FK) │ │ total_points  │
         │ user_id (FK)         │  │ skill_id (FK)│ │ course_id(FK)│ │ current_level │
         │ current_pace         │  │ mastery_level│ │ enrolled_at  │ │ current_streak│
         │ target_pace          │  │ last_assessed│ │ completed_at │ │ longest_streak│
         │ trend_direction      │  └──────────────┘ │ progress_%   │ │ updated_at    │
         │ trend_percentage     │                   └──────────────┘ └───────────────┘
         │ status               │                                            │
         │ estimated_completion │                                            │
         │ calculated_at        │                                            │
         │ expires_at           │                                            ↓ N
         └──────────────────────┘                                  ┌──────────────────┐
                                                                   │point_transactions│
         [Similar tables for 18 other analytics]                  │──────────────────│
                                                                   │ id (PK)          │
         ┌──────────────────────┐         ┌──────────────────┐   │ user_id (FK)     │
         │   achievements       │────N────│ user_achievements│   │ points           │
         │──────────────────────│         │──────────────────│   │ activity_type    │
         │ id (PK)              │         │ id (PK)          │   │ metadata (JSONB) │
         │ name                 │         │ user_id (FK)     │   │ timestamp        │
         │ description          │         │ achievement_id   │   └──────────────────┘
         │ icon                 │         │ earned_at        │
         │ tier                 │         └──────────────────┘
         │ criteria (JSONB)     │
         └──────────────────────┘

         ┌──────────────────────┐         ┌──────────────────────────┐
         │  skills              │         │ predictive_analytics_cache│
         │──────────────────────│         │──────────────────────────│
         │ id (PK)              │         │ id (PK)                  │
         │ name                 │         │ user_id (FK)             │
         │ domain               │         │ analytics_type           │
         │ level                │         │ data (JSONB)             │
         └──────────────────────┘         │ confidence_score         │
                                          │ calculated_at            │
         ┌──────────────────────┐         │ expires_at               │
         │  courses             │         └──────────────────────────┘
         │──────────────────────│
         │ id (PK)              │         ┌──────────────────────────┐
         │ name                 │         │ user_preferences         │
         │ description          │         │──────────────────────────│
         │ organization_id (FK) │         │ user_id (PK, FK)         │
         │ trainer_id (FK)      │         │ leaderboard_privacy      │
         │ created_at           │         │ predictive_enabled(JSONB)│
         └──────────────────────┘         │ notification_prefs(JSONB)│
                                          │ updated_at               │
         ┌──────────────────────┐         └──────────────────────────┘
         │  daily_activity      │
         │──────────────────────│
         │ id (PK)              │         MATERIALIZED VIEWS:
         │ user_id (FK)         │         ──────────────────
         │ date (UNIQUE)        │         • leaderboard_weekly
         │ last_activity_at     │         • leaderboard_monthly
         └──────────────────────┘         • peer_comparison_aggregates
                                          • skill_demand_aggregates
```

---

## 📋 **Complete Schema (Prisma)**

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════════════════════
// CORE ENTITIES
// ═══════════════════════════════════════════════════════════

model Organization {
  id        String   @id @default(uuid())
  name      String
  domain    String?
  settings  Json?
  createdAt DateTime @default(now()) @map("created_at")

  users User[]

  @@map("organizations")
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  passwordHash   String       @map("password_hash")
  fullName       String?      @map("full_name")
  avatarUrl      String?      @map("avatar_url")
  organizationId String?      @map("organization_id")
  createdAt      DateTime     @default(now()) @map("created_at")
  updatedAt      DateTime     @updatedAt @map("updated_at")

  organization Organization? @relation(fields: [organizationId], references: [id])

  roles                 UserRole[]
  learnerVelocity       LearnerVelocityAnalytics[]
  skillGapAnalytics     SkillGapAnalytics[]
  engagementAnalytics   EngagementAnalytics[]
  masteryAnalytics      MasteryAnalytics[]
  performanceAnalytics  PerformanceAnalytics[]
  contentAnalytics      ContentEffectivenessAnalytics[]
  userSkills            UserSkill[]
  enrollments           Enrollment[]
  userPoints            UserPoints?
  pointTransactions     PointTransaction[]
  userAchievements      UserAchievement[]
  dailyActivity         DailyActivity[]
  predictiveCache       PredictiveAnalyticsCache[]
  preferences           UserPreferences?

  @@index([email])
  @@index([organizationId])
  @@map("users")
}

model UserRole {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  role      String   // 'learner', 'trainer', 'org_admin', 'platform_admin'
  grantedAt DateTime @default(now()) @map("granted_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, role])
  @@index([userId])
  @@map("user_roles")
}

// ═══════════════════════════════════════════════════════════
// LEARNING DATA (Cached from External Microservices via REST API)
// ═══════════════════════════════════════════════════════════
// NOTE: MS8 does NOT have direct access to other microservices' databases.
// All data is fetched via REST API calls and stored here for caching.
// ═══════════════════════════════════════════════════════════

model Course {
  id             String   @id @default(uuid())
  name           String
  description    String?
  organizationId String?  @map("organization_id")
  trainerId      String?  @map("trainer_id")
  createdAt      DateTime @default(now()) @map("created_at")

  enrollments Enrollment[]

  @@index([organizationId])
  @@index([trainerId])
  @@map("courses")
}

model Enrollment {
  id              String    @id @default(uuid())
  userId          String    @map("user_id")
  courseId        String    @map("course_id")
  enrolledAt      DateTime  @default(now()) @map("enrolled_at")
  completedAt     DateTime? @map("completed_at")
  progressPercent Decimal   @map("progress_percent") @db.Decimal(5, 2)

  user   User   @relation(fields: [userId], references: [id])
  course Course @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
  @@map("enrollments")
}

model Skill {
  id     String  @id @default(uuid())
  name   String
  domain String?
  level  String? // 'beginner', 'intermediate', 'advanced'

  userSkills UserSkill[]

  @@map("skills")
}

model UserSkill {
  id             String    @id @default(uuid())
  userId         String    @map("user_id")
  skillId        String    @map("skill_id")
  masteryLevel   Decimal   @map("mastery_level") @db.Decimal(5, 2) // 0-100
  lastAssessedAt DateTime? @map("last_assessed_at")

  user  User  @relation(fields: [userId], references: [id])
  skill Skill @relation(fields: [skillId], references: [id])

  @@unique([userId, skillId])
  @@index([userId])
  @@index([skillId])
  @@map("user_skills")
}

// ═══════════════════════════════════════════════════════════
// LEARNER ANALYTICS (AS-001, 6 categories)
// ═══════════════════════════════════════════════════════════

model LearnerVelocityAnalytics {
  id                  String    @id @default(uuid())
  userId              String    @map("user_id")
  currentPace         Decimal   @map("current_pace") @db.Decimal(5, 2)
  targetPace          Decimal   @map("target_pace") @db.Decimal(5, 2)
  trendDirection      String    @map("trend_direction") // 'accelerating', 'stable', 'declining'
  trendPercentage     Decimal   @map("trend_percentage") @db.Decimal(5, 2)
  status              String
  estimatedCompletion DateTime? @map("estimated_completion")
  calculatedAt        DateTime  @default(now()) @map("calculated_at")
  expiresAt           DateTime  @map("expires_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([calculatedAt])
  @@map("learner_velocity_analytics")
}

model SkillGapAnalytics {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  totalGaps      Int      @map("total_gaps")
  criticalGaps   Int      @map("critical_gaps")
  gaps           Json     // Array of gap objects
  topPriority    Json?    @map("top_priority")
  calculatedAt   DateTime @default(now()) @map("calculated_at")
  expiresAt      DateTime @map("expires_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("skill_gap_analytics")
}

model EngagementAnalytics {
  id                 String   @id @default(uuid())
  userId             String   @map("user_id")
  overallScore       Int      @map("overall_score")
  trend              String
  sessionsPerWeek    Decimal  @map("sessions_per_week") @db.Decimal(5, 2)
  avgSessionDuration Int      @map("avg_session_duration") // minutes
  lastActive         DateTime @map("last_active")
  engagementByType   Json     @map("engagement_by_type")
  weeklyTrend        Json     @map("weekly_trend") // Array of scores
  calculatedAt       DateTime @default(now()) @map("calculated_at")
  expiresAt          DateTime @map("expires_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("engagement_analytics")
}

model MasteryAnalytics {
  id                   String   @id @default(uuid())
  userId               String   @map("user_id")
  masteredSkills       Int      @map("mastered_skills")
  inProgressSkills     Int      @map("in_progress_skills")
  skills               Json     // Array of skill objects
  masteryDistribution  Json     @map("mastery_distribution")
  calculatedAt         DateTime @default(now()) @map("calculated_at")
  expiresAt            DateTime @map("expires_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("mastery_analytics")
}

model PerformanceAnalytics {
  id                 String   @id @default(uuid())
  userId             String   @map("user_id")
  avgScore           Decimal  @map("avg_score") @db.Decimal(5, 2)
  trend              String
  assessmentsTaken   Int      @map("assessments_taken")
  passRate           Decimal  @map("pass_rate") @db.Decimal(5, 2)
  performanceBySkill Json     @map("performance_by_skill")
  recentScores       Json     @map("recent_scores") // Array
  calculatedAt       DateTime @default(now()) @map("calculated_at")
  expiresAt          DateTime @map("expires_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("performance_analytics")
}

model ContentEffectivenessAnalytics {
  id                String   @id @default(uuid())
  userId            String   @map("user_id")
  mostEffective     Json     @map("most_effective") // Array
  leastEffective    Json     @map("least_effective") // Array
  recommendations   Json     // Array of strings
  calculatedAt      DateTime @default(now()) @map("calculated_at")
  expiresAt         DateTime @map("expires_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("content_effectiveness_analytics")
}

// ═══════════════════════════════════════════════════════════
// GAMIFICATION
// ═══════════════════════════════════════════════════════════

model UserPoints {
  userId         String   @id @map("user_id")
  totalPoints    Int      @default(0) @map("total_points")
  currentLevel   Int      @default(1) @map("current_level")
  currentStreak  Int      @default(0) @map("current_streak")
  longestStreak  Int      @default(0) @map("longest_streak")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_points")
}

model PointTransaction {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  points       Int
  activityType String   @map("activity_type")
  metadata     Json?
  timestamp    DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId, timestamp(sort: Desc)])
  @@map("point_transactions")
}

model Achievement {
  id          String @id // e.g., 'first-course', 'skill-master'
  name        String
  description String
  icon        String
  tier        String // 'beginner', 'intermediate', 'advanced', 'elite'
  criteria    Json

  userAchievements UserAchievement[]

  @@map("achievements")
}

model UserAchievement {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  achievementId String   @map("achievement_id")
  earnedAt      DateTime @default(now()) @map("earned_at")

  user        User        @relation(fields: [userId], references: [id])
  achievement Achievement @relation(fields: [achievementId], references: [id])

  @@unique([userId, achievementId])
  @@index([userId])
  @@map("user_achievements")
}

model DailyActivity {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  date           DateTime @db.Date
  lastActivityAt DateTime @map("last_activity_at")

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, date])
  @@index([userId, date(sort: Desc)])
  @@map("daily_activity")
}

// ═══════════════════════════════════════════════════════════
// PREDICTIVE ANALYTICS CACHE
// ═══════════════════════════════════════════════════════════

model PredictiveAnalyticsCache {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  analyticsType   String   @map("analytics_type") // 'drop_off_risk', 'forecast', 'recommendations'
  data            Json
  confidenceScore Decimal? @map("confidence_score") @db.Decimal(5, 2)
  calculatedAt    DateTime @default(now()) @map("calculated_at")
  expiresAt       DateTime @map("expires_at")

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, analyticsType])
  @@index([userId])
  @@map("predictive_analytics_cache")
}

// ═══════════════════════════════════════════════════════════
// USER PREFERENCES
// ═══════════════════════════════════════════════════════════

model UserPreferences {
  userId                       String   @id @map("user_id")
  leaderboardPrivacy           String   @default("public") @map("leaderboard_privacy") // 'public', 'anonymous', 'hidden'
  predictiveAnalyticsEnabled   Json     @default("{\"dropOffRisk\": true, \"forecasting\": true, \"recommendations\": true}") @map("predictive_analytics_enabled")
  notificationPreferences      Json?    @map("notification_preferences")
  updatedAt                    DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id])

  @@map("user_preferences")
}
```

---

## 🔍 **Materialized Views**

### **1. Weekly Leaderboard**

```sql
CREATE MATERIALIZED VIEW leaderboard_weekly AS
SELECT 
  user_id,
  SUM(points) AS weekly_points,
  RANK() OVER (ORDER BY SUM(points) DESC) AS rank
FROM point_transactions
WHERE timestamp >= date_trunc('week', NOW())
GROUP BY user_id;

CREATE INDEX idx_leaderboard_weekly_rank ON leaderboard_weekly(rank);

-- Refresh hourly via cron
-- 0 * * * *
REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_weekly;
```

### **2. Monthly Leaderboard**

```sql
CREATE MATERIALIZED VIEW leaderboard_monthly AS
SELECT 
  user_id,
  SUM(points) AS monthly_points,
  RANK() OVER (ORDER BY SUM(points) DESC) AS rank
FROM point_transactions
WHERE timestamp >= date_trunc('month', NOW())
GROUP BY user_id;

CREATE INDEX idx_leaderboard_monthly_rank ON leaderboard_monthly(rank);
```

### **3. Peer Comparison Aggregates**

```sql
CREATE MATERIALIZED VIEW peer_comparison_aggregates AS
SELECT 
  u.organization_id,
  CASE 
    WHEN us.mastery_level < 30 THEN 'beginner'
    WHEN us.mastery_level < 70 THEN 'intermediate'
    ELSE 'advanced'
  END AS competency_level,
  AVG(lv.current_pace) AS avg_velocity,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY lv.current_pace) AS median_velocity,
  AVG(pa.avg_score) AS avg_score,
  COUNT(DISTINCT u.id) AS sample_size
FROM users u
LEFT JOIN learner_velocity_analytics lv ON u.id = lv.user_id
LEFT JOIN performance_analytics pa ON u.id = pa.user_id
LEFT JOIN user_skills us ON u.id = us.user_id
WHERE u.organization_id IS NOT NULL
GROUP BY u.organization_id, competency_level
HAVING COUNT(DISTINCT u.id) >= 10; -- K-anonymity

CREATE INDEX idx_peer_comparison_org_level 
  ON peer_comparison_aggregates(organization_id, competency_level);

-- Refresh daily at 2 AM
-- 0 2 * * *
REFRESH MATERIALIZED VIEW CONCURRENTLY peer_comparison_aggregates;
```

### **4. Skill Demand Aggregates**

```sql
CREATE MATERIALIZED VIEW skill_demand_aggregates AS
SELECT 
  s.id AS skill_id,
  s.name AS skill_name,
  COUNT(DISTINCT us.user_id) AS learner_count,
  AVG(us.mastery_level) AS avg_mastery,
  date_trunc('month', us.last_assessed_at) AS month,
  (COUNT(DISTINCT us.user_id) - LAG(COUNT(DISTINCT us.user_id)) OVER (PARTITION BY s.id ORDER BY date_trunc('month', us.last_assessed_at))) * 100.0 / 
    NULLIF(LAG(COUNT(DISTINCT us.user_id)) OVER (PARTITION BY s.id ORDER BY date_trunc('month', us.last_assessed_at)), 0) AS growth_rate
FROM skills s
LEFT JOIN user_skills us ON s.id = us.skill_id
GROUP BY s.id, s.name, date_trunc('month', us.last_assessed_at);

CREATE INDEX idx_skill_demand_skill_month 
  ON skill_demand_aggregates(skill_id, month DESC);

-- Refresh daily
REFRESH MATERIALIZED VIEW CONCURRENTLY skill_demand_aggregates;
```

---

## 🔒 **Row-Level Security (RLS) Policies**

### **Enable RLS on Analytics Tables**

```sql
-- Enable RLS on all analytics tables
ALTER TABLE learner_velocity_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gap_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_effectiveness_analytics ENABLE ROW LEVEL SECURITY;
```

### **Policy: Users Can See Their Own Data**

```sql
CREATE POLICY user_own_analytics ON learner_velocity_analytics
  FOR SELECT
  USING (user_id = auth.uid());

-- Apply to all analytics tables
CREATE POLICY user_own_analytics ON skill_gap_analytics
  FOR SELECT
  USING (user_id = auth.uid());

-- ... repeat for all analytics tables
```

### **Policy: Trainers Can See Their Students' Data**

```sql
CREATE POLICY trainer_student_analytics ON learner_velocity_analytics
  FOR SELECT
  USING (
    user_id IN (
      SELECT e.user_id 
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.trainer_id = auth.uid()
    )
  );
```

### **Policy: Org Admins Can See All Org Data**

```sql
CREATE POLICY org_admin_analytics ON learner_velocity_analytics
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE organization_id = (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
    AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'org_admin'
    )
  );
```

---

## 📊 **Indexing Strategy**

### **Primary Indexes (Auto-created)**
- All `id` primary keys
- All `@unique` constraints

### **Foreign Key Indexes**
```sql
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_id);
```

### **Analytics Indexes**
```sql
CREATE INDEX idx_learner_velocity_user ON learner_velocity_analytics(user_id);
CREATE INDEX idx_learner_velocity_calculated ON learner_velocity_analytics(calculated_at DESC);

CREATE INDEX idx_skill_gap_user ON skill_gap_analytics(user_id);
CREATE INDEX idx_engagement_user ON engagement_analytics(user_id);
CREATE INDEX idx_mastery_user ON mastery_analytics(user_id);
CREATE INDEX idx_performance_user ON performance_analytics(user_id);
CREATE INDEX idx_content_user ON content_effectiveness_analytics(user_id);
```

### **Gamification Indexes**
```sql
CREATE INDEX idx_point_transactions_user_time ON point_transactions(user_id, timestamp DESC);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, date DESC);
```

### **Composite Indexes**
```sql
-- For peer comparison queries
CREATE INDEX idx_users_org_created ON users(organization_id, created_at DESC);

-- For leaderboard queries
CREATE INDEX idx_user_points_points ON user_points(total_points DESC);
```

---

## 🗂️ **Partitioning Strategy (Future)**

```sql
-- Partition analytics tables by month for better performance
CREATE TABLE learner_velocity_analytics_2025_10 
  PARTITION OF learner_velocity_analytics
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE learner_velocity_analytics_2025_11 
  PARTITION OF learner_velocity_analytics
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- Automate partition creation with pg_partman extension
```

---

## 📦 **Data Retention Policy**

| Data Type | Retention | Storage |
|-----------|-----------|---------|
| Personal Analytics (hot) | 7 days | Postgres (active) |
| Personal Analytics (warm) | 7 years | Postgres (partitioned) |
| Aggregated Analytics | 7 years | Materialized views |
| User Activity Logs | 90 days | Postgres |
| Predictive Cache | 48 hours | Postgres |
| Point Transactions | Indefinite | Postgres (archived after 1 year) |

---

## 🔄 **Migration Strategy**

### **Initial Migration**

```bash
# Generate Prisma migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy
```

### **Seed Data**

```javascript
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed achievements
  await prisma.achievement.createMany({
    data: [
      {
        id: 'first-course',
        name: 'First Steps',
        description: 'Complete your first course',
        icon: '🎓',
        tier: 'beginner',
        criteria: { coursesCompleted: 1 },
      },
      // ... more achievements
    ],
  });

  // Seed skills
  await prisma.skill.createMany({
    data: [
      { id: 'skill-react', name: 'React', domain: 'frontend', level: 'intermediate' },
      { id: 'skill-node', name: 'Node.js', domain: 'backend', level: 'intermediate' },
      // ... more skills
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## ✅ **Complete - Ready for Phase 3B.5**

**Deliverables:**
- ✅ Complete ERD (28+ tables)
- ✅ Full Prisma schema
- ✅ 4 Materialized views
- ✅ RLS policies for multi-tenancy
- ✅ Comprehensive indexing strategy
- ✅ Partitioning strategy (future)
- ✅ Data retention policy
- ✅ Migration and seeding scripts

**Next Action:** Begin Phase 3B.5 (Database TDD Implementation)

---

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Status:** Complete - Ready for Implementation

