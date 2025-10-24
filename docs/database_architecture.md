# 🗄️ **DATABASE ARCHITECTURE - LEARNING ANALYTICS**

## 🎯 **DATABASE ARCHITECTURE OVERVIEW**

**Database**: PostgreSQL (Supabase)  
**Schema**: Normalized with partitioned tables  
**Security**: Row Level Security (RLS) + encryption  
**Performance**: Materialized views + indexes + partitioning  
**Retention**: 3-layer (24h raw, 7 days personal, 7 years aggregated)  

---

## 🏗️ **DATABASE SCHEMA DESIGN**

### **Core Tables**

#### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255) UNIQUE NOT NULL, -- MS12 user ID
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('learner', 'trainer', 'org_admin')),
  organization_id UUID NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Indexes
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_external_id ON users(external_id);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- RLS Policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own data" ON users
  FOR ALL USING (id = auth.uid() OR organization_id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));
```

#### **Organizations Table**
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Indexes
CREATE INDEX idx_organizations_domain ON organizations(domain);
CREATE INDEX idx_organizations_deleted_at ON organizations(deleted_at) WHERE deleted_at IS NULL;

-- RLS Policy
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their organization" ON organizations
  FOR ALL USING (id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));
```

#### **Raw Data Collection Table**
```sql
CREATE TABLE raw_data_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  service_name VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
) PARTITION BY RANGE (collected_at);

-- Create monthly partitions
CREATE TABLE raw_data_collection_2024_01 PARTITION OF raw_data_collection
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE raw_data_collection_2024_02 PARTITION OF raw_data_collection
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Indexes
CREATE INDEX idx_raw_data_user_id ON raw_data_collection(user_id);
CREATE INDEX idx_raw_data_service ON raw_data_collection(service_name);
CREATE INDEX idx_raw_data_collected_at ON raw_data_collection(collected_at);
CREATE INDEX idx_raw_data_expires_at ON raw_data_collection(expires_at);

-- RLS Policy
ALTER TABLE raw_data_collection ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own raw data" ON raw_data_collection
  FOR ALL USING (user_id = auth.uid() OR organization_id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));
```

#### **Learner Analytics Table**
```sql
CREATE TABLE learner_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  analytics_data JSONB NOT NULL,
  -- Specific analytics fields for performance
  learning_velocity DECIMAL(5,2),
  mastery_progress DECIMAL(5,2),
  engagement_score DECIMAL(5,2),
  skill_gap_count INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
) PARTITION BY RANGE (created_at);

-- Create weekly partitions
CREATE TABLE learner_analytics_2024_w01 PARTITION OF learner_analytics
  FOR VALUES FROM ('2024-01-01') TO ('2024-01-08');

-- Indexes
CREATE INDEX idx_learner_analytics_user_id ON learner_analytics(user_id);
CREATE INDEX idx_learner_analytics_last_updated ON learner_analytics(last_updated);
CREATE INDEX idx_learner_analytics_expires_at ON learner_analytics(expires_at);

-- RLS Policy
ALTER TABLE learner_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own analytics" ON learner_analytics
  FOR ALL USING (user_id = auth.uid());
```

#### **Trainer Analytics Table**
```sql
CREATE TABLE trainer_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  analytics_data JSONB NOT NULL,
  -- Specific analytics fields
  course_performance DECIMAL(5,2),
  student_count INTEGER,
  at_risk_students INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
) PARTITION BY RANGE (created_at);

-- Indexes
CREATE INDEX idx_trainer_analytics_user_id ON trainer_analytics(user_id);
CREATE INDEX idx_trainer_analytics_last_updated ON trainer_analytics(last_updated);

-- RLS Policy
ALTER TABLE trainer_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can access their own analytics" ON trainer_analytics
  FOR ALL USING (user_id = auth.uid() OR organization_id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));
```

#### **Organization Analytics Table**
```sql
CREATE TABLE organization_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  analytics_data JSONB NOT NULL,
  -- Specific analytics fields
  learning_velocity DECIMAL(5,2),
  strategic_alignment DECIMAL(5,2),
  total_users INTEGER,
  active_users INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
) PARTITION BY RANGE (created_at);

-- Indexes
CREATE INDEX idx_org_analytics_org_id ON organization_analytics(organization_id);
CREATE INDEX idx_org_analytics_last_updated ON organization_analytics(last_updated);

-- RLS Policy
ALTER TABLE organization_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org admins can access org analytics" ON organization_analytics
  FOR ALL USING (organization_id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));
```

#### **Aggregated Analytics Table**
```sql
CREATE TABLE aggregated_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  analytics_type VARCHAR(100) NOT NULL, -- 'learner', 'trainer', 'organization'
  time_period VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  aggregated_data JSONB NOT NULL,
  user_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 years')
) PARTITION BY RANGE (period_start);

-- Create yearly partitions
CREATE TABLE aggregated_analytics_2024 PARTITION OF aggregated_analytics
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Indexes
CREATE INDEX idx_aggregated_analytics_org_id ON aggregated_analytics(organization_id);
CREATE INDEX idx_aggregated_analytics_type ON aggregated_analytics(analytics_type);
CREATE INDEX idx_aggregated_analytics_period ON aggregated_analytics(period_start, period_end);

-- RLS Policy
ALTER TABLE aggregated_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access aggregated analytics" ON aggregated_analytics
  FOR ALL USING (
    organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    ) OR organization_id IS NULL -- Global aggregated data
  );
```

#### **Reports Table**
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  report_type VARCHAR(100) NOT NULL, -- 'learner', 'trainer', 'organization'
  format VARCHAR(20) NOT NULL CHECK (format IN ('pdf', 'csv', 'excel')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  file_path VARCHAR(500),
  file_size BIGINT,
  generated_at TIMESTAMP WITH TIME ZONE NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_expires_at ON reports(expires_at);

-- RLS Policy
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own reports" ON reports
  FOR ALL USING (user_id = auth.uid() OR organization_id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));
```

#### **Audit Logs Table**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- RLS Policy
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access audit logs" ON audit_logs
  FOR ALL USING (
    user_id = auth.uid() OR 
    organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );
```

---

## 🔄 **MATERIALIZED VIEWS**

### **Performance Analytics View**
```sql
-- Materialized view for frequently accessed analytics
CREATE MATERIALIZED VIEW mv_learner_analytics_summary AS
SELECT 
  u.id as user_id,
  u.organization_id,
  u.role,
  la.learning_velocity,
  la.mastery_progress,
  la.engagement_score,
  la.skill_gap_count,
  la.last_updated,
  CASE 
    WHEN la.last_updated > NOW() - INTERVAL '4 hours' THEN 'fresh'
    WHEN la.last_updated > NOW() - INTERVAL '24 hours' THEN 'stale'
    ELSE 'very_stale'
  END as freshness_status
FROM users u
LEFT JOIN LATERAL (
  SELECT *
  FROM learner_analytics la
  WHERE la.user_id = u.id
  ORDER BY la.last_updated DESC
  LIMIT 1
) la ON true
WHERE u.deleted_at IS NULL;

-- Indexes on materialized view
CREATE INDEX idx_mv_learner_analytics_user_id ON mv_learner_analytics_summary(user_id);
CREATE INDEX idx_mv_learner_analytics_org_id ON mv_learner_analytics_summary(organization_id);
CREATE INDEX idx_mv_learner_analytics_freshness ON mv_learner_analytics_summary(freshness_status);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_learner_analytics_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_learner_analytics_summary;
END;
$$ LANGUAGE plpgsql;
```

### **Organization Metrics View**
```sql
-- Materialized view for organization-level metrics
CREATE MATERIALIZED VIEW mv_organization_metrics AS
SELECT 
  o.id as organization_id,
  o.name as organization_name,
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT CASE WHEN u.role = 'learner' THEN u.id END) as learner_count,
  COUNT(DISTINCT CASE WHEN u.role = 'trainer' THEN u.id END) as trainer_count,
  COUNT(DISTINCT CASE WHEN u.role = 'org_admin' THEN u.id END) as admin_count,
  AVG(la.learning_velocity) as avg_learning_velocity,
  AVG(la.mastery_progress) as avg_mastery_progress,
  AVG(la.engagement_score) as avg_engagement_score,
  MAX(la.last_updated) as last_analytics_update
FROM organizations o
LEFT JOIN users u ON u.organization_id = o.id AND u.deleted_at IS NULL
LEFT JOIN LATERAL (
  SELECT *
  FROM learner_analytics la
  WHERE la.user_id = u.id
  ORDER BY la.last_updated DESC
  LIMIT 1
) la ON true
WHERE o.deleted_at IS NULL
GROUP BY o.id, o.name;

-- Indexes on materialized view
CREATE INDEX idx_mv_org_metrics_org_id ON mv_organization_metrics(organization_id);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_organization_metrics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_organization_metrics;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔒 **SECURITY IMPLEMENTATION**

### **Row Level Security Policies**
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_data_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregated_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Function to get user's organization
CREATE OR REPLACE FUNCTION get_user_organization_id(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM users 
    WHERE id = user_uuid AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has role
CREATE OR REPLACE FUNCTION user_has_role(user_uuid UUID, required_role VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM users 
    WHERE id = user_uuid 
      AND role = required_role 
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ⚡ **PERFORMANCE OPTIMIZATION**

### **Indexes for Performance**
```sql
-- Composite indexes for common queries
CREATE INDEX idx_users_org_role ON users(organization_id, role) WHERE deleted_at IS NULL;
CREATE INDEX idx_learner_analytics_user_updated ON learner_analytics(user_id, last_updated DESC);
CREATE INDEX idx_trainer_analytics_user_updated ON trainer_analytics(user_id, last_updated DESC);
CREATE INDEX idx_org_analytics_org_updated ON organization_analytics(organization_id, last_updated DESC);

-- Partial indexes for active records
CREATE INDEX idx_active_users ON users(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_active_organizations ON organizations(id) WHERE deleted_at IS NULL;

-- GIN indexes for JSONB columns
CREATE INDEX idx_learner_analytics_data ON learner_analytics USING GIN (analytics_data);
CREATE INDEX idx_trainer_analytics_data ON trainer_analytics USING GIN (analytics_data);
CREATE INDEX idx_org_analytics_data ON organization_analytics USING GIN (analytics_data);
CREATE INDEX idx_raw_data_collection_data ON raw_data_collection USING GIN (data);
```

---

## 🔄 **DATA RETENTION & CLEANUP**

### **Automated Cleanup Jobs**
```sql
-- Function to clean up expired raw data
CREATE OR REPLACE FUNCTION cleanup_expired_raw_data()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM raw_data_collection 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log cleanup activity
  INSERT INTO audit_logs (action, resource_type, details)
  VALUES (
    'cleanup_expired_data',
    'raw_data_collection',
    json_build_object('deleted_count', deleted_count, 'cleanup_time', NOW())
  );
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup jobs with pg_cron
SELECT cron.schedule('cleanup-raw-data', '0 2 * * *', 'SELECT cleanup_expired_raw_data();');
SELECT cron.schedule('cleanup-analytics', '0 3 * * *', 'SELECT cleanup_expired_analytics();');
SELECT cron.schedule('cleanup-reports', '0 4 * * *', 'SELECT cleanup_expired_reports();');
```

---

## 📊 **MONITORING & OBSERVABILITY**

### **Database Monitoring Functions**
```sql
-- Function to get database performance metrics
CREATE OR REPLACE FUNCTION get_db_performance_metrics()
RETURNS TABLE (
  metric_name TEXT,
  metric_value NUMERIC,
  metric_unit TEXT,
  measured_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'active_connections'::TEXT,
    (SELECT count(*) FROM pg_stat_activity WHERE state = 'active')::NUMERIC,
    'connections'::TEXT,
    NOW()::TIMESTAMP WITH TIME ZONE
  
  UNION ALL
  
  SELECT 
    'cache_hit_ratio'::TEXT,
    (SELECT round(100.0 * sum(blks_hit) / (sum(blks_hit) + sum(blks_read)), 2) FROM pg_stat_database)::NUMERIC,
    'percent'::TEXT,
    NOW()::TIMESTAMP WITH TIME ZONE;
END;
$$ LANGUAGE plpgsql;
```

---

## 🎯 **NEXT STEPS**

**Phase 3**: Implementation & Development - TDD approach with RED-GREEN-REFACTOR cycles  
**Phase 4**: E2E Testing & Comprehensive QA - User journey testing and quality validation  

**Ready to proceed to Phase 3: Implementation & Development** ✅
