# Debate #5: Database Schema & ERD Design

**Date:** October 24, 2025  
**Phase:** Phase 2C - Database Architecture  
**Topic:** Complete database schema design with ERD for all 19 analytics, user data, and gamification  
**Participants:** TL, SA, FE, BE, UX, PE, DA  
**Status:** ✅ Complete - Consensus Reached  

---

## 🎯 **Debate Question**

What is the optimal database schema design to support 19 analytics categories, predictive analytics, gamification, comparison analytics, and multi-role users with proper normalization, indexing, and performance?

---

## 💬 **15-Round Consensus**

### **Final Decision:**

**✅ Normalized Relational Schema with Materialized Views**

**Core Entities:**

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'learner', 'trainer', 'org_admin', 'platform_admin'
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Data (from external microservices, cached locally)
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  organization_id UUID REFERENCES organizations(id),
  trainer_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  enrolled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  progress_percent DECIMAL(5,2),
  UNIQUE(user_id, course_id)
);

CREATE TABLE skills (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(100),
  level VARCHAR(50) -- 'beginner', 'intermediate', 'advanced'
);

CREATE TABLE user_skills (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  mastery_level DECIMAL(5,2), -- 0-100
  last_assessed_at TIMESTAMPTZ,
  UNIQUE(user_id, skill_id)
);

-- Analytics Cache Tables
CREATE TABLE learner_velocity_analytics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  current_pace DECIMAL(5,2), -- topics/week
  target_pace DECIMAL(5,2),
  trend_direction VARCHAR(20), -- 'accelerating', 'stable', 'declining'
  trend_percentage DECIMAL(5,2),
  status VARCHAR(50),
  estimated_completion DATE,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_learner_velocity_user ON learner_velocity_analytics(user_id);
CREATE INDEX idx_learner_velocity_calculated ON learner_velocity_analytics(calculated_at DESC);

-- Repeat similar cache tables for all 19 analytics...

-- Gamification
CREATE TABLE user_points (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE point_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  points INTEGER,
  activity_type VARCHAR(50),
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_points_user_timestamp ON point_transactions(user_id, timestamp DESC);

CREATE TABLE achievements (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  icon VARCHAR(10),
  tier VARCHAR(20), -- 'beginner', 'intermediate', 'advanced', 'elite'
  criteria JSONB
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  achievement_id VARCHAR(50) REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE daily_activity (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE,
  last_activity_at TIMESTAMPTZ,
  UNIQUE(user_id, date)
);

-- Leaderboards (Materialized Views)
CREATE MATERIALIZED VIEW leaderboard_weekly AS
SELECT 
  user_id,
  SUM(points) AS weekly_points,
  RANK() OVER (ORDER BY SUM(points) DESC) AS rank
FROM point_transactions
WHERE timestamp >= date_trunc('week', NOW())
GROUP BY user_id;

CREATE INDEX idx_leaderboard_weekly_rank ON leaderboard_weekly(rank);

-- Comparison Analytics (Materialized Views)
CREATE MATERIALIZED VIEW skill_demand_aggregates AS
SELECT 
  skill_id,
  COUNT(DISTINCT user_id) AS learner_count,
  AVG(mastery_level) AS avg_mastery,
  date_trunc('month', last_assessed_at) AS month
FROM user_skills
GROUP BY skill_id, date_trunc('month', last_assessed_at);

-- Predictive Analytics Cache
CREATE TABLE predictive_analytics_cache (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  analytics_type VARCHAR(50), -- 'drop_off_risk', 'forecast', 'recommendations'
  data JSONB,
  confidence_score DECIMAL(5,2),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, analytics_type)
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  leaderboard_privacy VARCHAR(20) DEFAULT 'public', -- 'public', 'anonymous', 'hidden'
  predictive_analytics_enabled JSONB DEFAULT '{"dropOffRisk": true, "forecasting": true, "recommendations": true}',
  notification_preferences JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Design Principles:**

**1. Normalization:**
- 3NF (Third Normal Form)
- Separate tables for users, roles, courses, skills
- Junction tables for many-to-many (user_roles, user_skills)

**2. Denormalization (Strategic):**
- Analytics cache tables (pre-computed results)
- Materialized views (leaderboards, aggregates)
- Trade-off: Storage space for query speed

**3. Indexing Strategy:**
- Primary keys (UUID, indexed by default)
- Foreign keys (user_id, course_id, etc.)
- Timestamp columns (for time-based queries)
- Composite indexes for common query patterns

**4. Partitioning (Future):**
- Partition analytics tables by month
- Retain 7 days (hot), 7 years (warm)
- Archive old data to cold storage

**5. Data Retention:**
- Personal analytics: 7 days (hot cache)
- Aggregated analytics: 7 years (compliance)
- User activity logs: 90 days
- Predictive cache: 48 hours

**6. RLS (Row Level Security):**
```sql
-- Enable RLS
ALTER TABLE learner_velocity_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analytics
CREATE POLICY learner_own_data ON learner_velocity_analytics
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Trainers can see their students' analytics
CREATE POLICY trainer_student_data ON learner_velocity_analytics
  FOR SELECT
  USING (
    user_id IN (
      SELECT student_id FROM trainer_students WHERE trainer_id = auth.uid()
    )
  );

-- Policy: Org admins can see all org analytics
CREATE POLICY org_admin_data ON learner_velocity_analytics
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE organization_id = (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );
```

**7. Materialized View Refresh:**
```sql
-- Refresh leaderboard hourly (cron job)
REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_weekly;

-- Refresh skill demand daily
REFRESH MATERIALIZED VIEW CONCURRENTLY skill_demand_aggregates;
```

**8. Database Migrations:**
- Prisma ORM for schema management
- Version-controlled migrations
- Up/down migration scripts

**9. Connection Pooling:**
- PgBouncer for connection management
- Max 100 connections per backend instance
- Transaction pooling mode

**10. Backup Strategy:**
- Daily automated backups (Supabase)
- Point-in-time recovery (PITR)
- 30-day retention

**Consensus:** ✅ Unanimous

---

## 📊 **ERD Diagram**

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   users     │───┬───│  user_roles  │       │organizations│
│  (id, name) │   │   │ (user, role) │   ┌───│  (id, name) │
└─────────────┘   │   └──────────────┘   │   └─────────────┘
       │          │                      │
       │          │   ┌──────────────┐   │
       │          └───│ enrollments  │───┘
       │              │ (user,course)│
       │              └──────────────┘
       │
       ├──────┬──────────────────────┬──────────────┬──────────────┐
       │      │                      │              │              │
┌──────▼──────▼─┐    ┌───────────────▼──┐  ┌───────▼──────┐  ┌────▼─────────┐
│learner_velocity│    │  user_skills     │  │ user_points  │  │ user_prefs   │
│   _analytics   │    │ (user, skill,    │  │ (points,     │  │ (privacy,    │
│ (pace, trend)  │    │  mastery)        │  │  level)      │  │  notifs)     │
└────────────────┘    └──────────────────┘  └──────────────┘  └──────────────┘
```

---

## 📊 **Action Items**

1. [DA] Create complete ERD with all 19 analytics tables
2. [DA] Write Prisma schema
3. [DA] Create initial migration
4. [BE] Set up Supabase connection
5. [BE] Configure RLS policies
6. [BE] Set up materialized view refresh jobs
7. [BE] Configure PgBouncer
8. [DA] Design partitioning strategy
9. [DA] Set up backup automation
10. [DA] Write data retention policies

---

**Document Version:** 1.0  
**Status:** ✅ Complete  
**Last Updated:** October 24, 2025
