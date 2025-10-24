# 🎯 **ENTITY RELATIONSHIP DIAGRAM - LEARNING ANALYTICS DATABASE**

## 📊 **DATABASE ERD OVERVIEW**

The Learning Analytics database follows a normalized design with clear entity relationships, partitioned tables for performance, and comprehensive security through Row Level Security (RLS).

---

## 🔗 **ENTITY RELATIONSHIPS**

### **Core Entities**
- **Organizations**: Root entity for multi-tenant architecture
- **Users**: Users belonging to organizations with role-based access
- **Analytics**: Three types of analytics (Learner, Trainer, Organization)
- **Reports**: Generated reports with expiration and cleanup
- **Audit Logs**: Comprehensive audit trail for compliance

### **Data Flow Relationships**
1. **Organizations** → **Users** (1:N)
2. **Users** → **Analytics** (1:N)
3. **Organizations** → **Analytics** (1:N)
4. **Users** → **Reports** (1:N)
5. **Users** → **Audit Logs** (1:N)

### **Partitioning Strategy**
- **Time-based partitioning** for analytics and audit logs
- **Organization-based partitioning** for multi-tenant isolation
- **Automatic partition management** with cleanup procedures

---

## 📋 **TABLE SPECIFICATIONS**

### **Primary Tables**
| Table | Purpose | Partitioning | Retention |
|-------|---------|--------------|-----------|
| `users` | User management | None | Permanent |
| `organizations` | Multi-tenant root | None | Permanent |
| `raw_data_collection` | Stage 1 data | Monthly | 24 hours |
| `learner_analytics` | Stage 2 analytics | Weekly | 7 days |
| `trainer_analytics` | Stage 2 analytics | Weekly | 7 days |
| `organization_analytics` | Stage 2 analytics | Weekly | 7 days |
| `aggregated_analytics` | Stage 3 aggregation | Yearly | 7 years |
| `reports` | Generated reports | None | 7 days |
| `audit_logs` | Compliance logging | Monthly | 10 years |

### **Materialized Views**
| View | Purpose | Refresh Frequency |
|------|---------|-------------------|
| `mv_learner_analytics_summary` | Performance optimization | Every 4 hours |
| `mv_organization_metrics` | Organization metrics | Every 6 hours |

---

## 🔒 **SECURITY MODEL**

### **Row Level Security (RLS)**
- **Tenant Isolation**: All data filtered by `organization_id`
- **Role-based Access**: Users can only access data based on their role
- **Data Privacy**: Sensitive data encrypted at rest
- **Audit Trail**: All data access logged for compliance

### **Access Patterns**
- **Learners**: Only their own analytics data
- **Trainers**: Their analytics + students they teach
- **Org Admins**: Organization-level aggregated data
- **System**: Service-to-service access with JWT tokens

---

## ⚡ **PERFORMANCE CHARACTERISTICS**

### **Query Performance**
- **Sub-100ms**: Cached analytics queries
- **Sub-50ms**: Database queries with proper indexes
- **Materialized Views**: Pre-computed analytics for instant access
- **Partitioning**: Efficient data pruning and maintenance

### **Scalability Features**
- **Horizontal Scaling**: Read replicas for analytics queries
- **Vertical Scaling**: Optimized indexes and query plans
- **Caching**: Multi-layer caching strategy
- **Connection Pooling**: Efficient database connections

---

## 🔄 **DATA LIFECYCLE**

### **3-Stage Processing**
1. **Stage 1**: Raw data collection (24h retention)
2. **Stage 2**: Analytics processing (7 days retention)
3. **Stage 3**: Aggregated analytics (7 years retention)

### **Automated Cleanup**
- **Daily**: Expired raw data cleanup
- **Weekly**: Expired analytics cleanup
- **Monthly**: Partition maintenance and archival
- **Yearly**: Long-term aggregated data archival

---

## 📈 **MONITORING & OBSERVABILITY**

### **Database Metrics**
- **Performance**: Query execution times, slow queries
- **Capacity**: Table sizes, index usage, connection counts
- **Health**: Cache hit ratios, lock contention, deadlocks
- **Security**: Failed login attempts, privilege escalations

### **Business Metrics**
- **Analytics Generation**: Success rates, processing times
- **User Activity**: Query patterns, data access frequency
- **Data Quality**: Validation results, integrity checks
- **Compliance**: Audit log completeness, retention compliance

---

## 🎯 **NEXT STEPS**

**Phase 3**: Implementation & Development - TDD approach with RED-GREEN-REFACTOR cycles  
**Phase 4**: E2E Testing & Comprehensive QA - User journey testing and quality validation  

**Ready to proceed to Phase 3: Implementation & Development** ✅
