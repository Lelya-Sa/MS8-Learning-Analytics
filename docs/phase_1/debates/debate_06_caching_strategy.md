# Debate #6: Caching Strategy

**Date:** October 24, 2025  
**Phase:** Phase 2B - Backend Architecture  
**Topic:** Comprehensive caching strategy across frontend, backend, database, and CDN layers  
**Participants:** TL, SA, FE, BE, UX, PE, DA  
**Status:** ✅ Complete - Consensus Reached  

---

## 🎯 **Debate Question**

What is the optimal multi-layer caching strategy to achieve < 2s page load times while ensuring data consistency across 19 analytics categories with different freshness requirements?

---

## 💬 **15-Round Consensus**

### **Final Decision:**

**✅ 4-Layer Caching Architecture**

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Frontend (SWR) - Stale-While-Revalidate       │
│ TTL: 4h learner, 2h trainer, 6h org, 48h predictive    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: CDN (Vercel Edge) - Static Content            │
│ TTL: 1h for public analytics, varies by endpoint        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Backend (Railway In-Memory) - Hot Data        │
│ TTL: 5min API responses, 1h aggregates                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Database (Postgres + Materialized Views)      │
│ Materialized views refreshed hourly/daily               │
└─────────────────────────────────────────────────────────┘
```

**Caching Strategy by Analytics Type:**

**Learner Analytics (AS-001):**
```
Frontend SWR: 4 hours
Backend Cache: 5 minutes
Database: Real-time queries
Rationale: Personal data changes frequently, but 4h staleness acceptable
```

**Trainer Analytics (AS-002):**
```
Frontend SWR: 2 hours
Backend Cache: 10 minutes
Database: Aggregated queries with 1h materialized view
Rationale: Teaching metrics update less frequently than learning
```

**Organizational Analytics (AS-003):**
```
Frontend SWR: 6 hours
Backend Cache: 30 minutes
Database: Daily materialized view
Rationale: Org-wide metrics stable, can tolerate longer staleness
```

**Predictive Analytics (AS-004):**
```
Frontend SWR: 48 hours
Backend Cache: No cache (expensive AI calls)
Database: Cache table with 48h TTL
Rationale: AI predictions expensive, must cache aggressively
```

**Comparison Analytics (AS-005):**
```
Frontend SWR: 4 hours
Backend Cache: 1 hour
Database: Materialized view (hourly refresh)
Rationale: Peer data changes slowly, pre-compute aggregates
```

**Gamification:**
```
Frontend SWR: 1 hour
Backend Cache: 5 minutes
Database: Real-time for points, materialized for leaderboards
Rationale: Points update frequently, leaderboards can lag
```

**Implementation Details:**

**1. Frontend SWR Configuration:**
```jsx
// useAnalytics.js
export const useLearnerVelocity = (userId) => {
  return useSWR(
    userId ? ['learner-velocity', userId] : null,
    () => analyticsService.getLearnerVelocity(userId),
    {
      dedupingInterval: 14400000, // 4 hours in ms
      revalidateOnFocus: true,    // Refresh when tab gains focus
      revalidateIfStale: true,    // Auto-refresh if stale
      revalidateOnReconnect: true, // Refresh on network reconnect
    }
  );
};

export const usePredictiveAnalytics = (userId) => {
  return useSWR(
    userId ? ['predictive-analytics', userId] : null,
    () => predictiveService.getAll(userId),
    {
      dedupingInterval: 172800000, // 48 hours
      revalidateOnFocus: false,    // Don't auto-refresh (expensive)
      revalidateIfStale: false,    // Manual refresh only
    }
  );
};
```

**2. Backend In-Memory Cache (Railway):**
```javascript
// Use Railway's built-in caching (no Redis needed)
const NodeCache = require('node-cache');

const analyticsCache = new NodeCache({
  stdTTL: 300,        // 5 minutes default
  checkperiod: 60,    // Check for expired keys every 60s
  useClones: false,   // Save memory (don't clone objects)
});

// Caching middleware
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    const key = `${req.path}-${req.user.id}-${JSON.stringify(req.query)}`;
    const cached = analyticsCache.get(key);

    if (cached) {
      return res.json({
        ...cached,
        meta: {
          ...cached.meta,
          dataSource: 'cached',
        },
      });
    }

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache response
    res.json = (data) => {
      analyticsCache.set(key, data, ttl);
      return originalJson(data);
    };

    next();
  };
};

// Usage
router.get('/analytics/learner/velocity/:userId',
  authenticate,
  authorize(['learner', 'trainer', 'org_admin']),
  cacheMiddleware(300), // 5 min cache
  getLearnerVelocity
);
```

**3. CDN Caching (Vercel Edge):**
```javascript
// Set cache headers for CDN
router.get('/analytics/org/learning-velocity/:orgId',
  authenticate,
  authorize(['org_admin']),
  (req, res, next) => {
    // Cache on CDN for 1 hour, revalidate if stale
    res.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    res.set('Vary', 'Authorization'); // Vary by user (JWT)
    next();
  },
  getOrgLearningVelocity
);
```

**4. Database Materialized Views:**
```sql
-- Leaderboard (refresh hourly)
CREATE MATERIALIZED VIEW leaderboard_weekly AS
SELECT 
  user_id,
  SUM(points) AS weekly_points,
  RANK() OVER (ORDER BY SUM(points) DESC) AS rank
FROM point_transactions
WHERE timestamp >= date_trunc('week', NOW())
GROUP BY user_id;

-- Refresh via cron job
-- 0 * * * * (every hour)
REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_weekly;

-- Comparison aggregates (refresh daily)
CREATE MATERIALIZED VIEW peer_comparison_aggregates AS
SELECT 
  organization_id,
  competency_level,
  AVG(learning_velocity) AS avg_velocity,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY learning_velocity) AS median_velocity,
  COUNT(*) AS sample_size
FROM learner_velocity_analytics
GROUP BY organization_id, competency_level
HAVING COUNT(*) >= 10; -- K-anonymity

-- Refresh daily at 2 AM
-- 0 2 * * *
REFRESH MATERIALIZED VIEW CONCURRENTLY peer_comparison_aggregates;
```

**5. Cache Invalidation Strategy:**

**Manual Invalidation:**
```javascript
// Invalidate user's cache on significant activity
const invalidateUserCache = (userId) => {
  const keysToInvalidate = analyticsCache.keys().filter(key => key.includes(userId));
  keysToInvalidate.forEach(key => analyticsCache.del(key));
};

// Example: User completes course → invalidate velocity cache
eventEmitter.on('course_completed', ({ userId }) => {
  invalidateUserCache(userId);
});
```

**Time-Based Invalidation:**
- Frontend SWR: Automatic (dedupingInterval)
- Backend: NodeCache TTL
- Database: Materialized view refresh schedule

**6. Cache Warming:**
```javascript
// Background job: Pre-warm cache for active users
cron.schedule('0 1 * * *', async () => {
  const activeUsers = await getActiveUsers(); // Users active in last 7 days

  for (const user of activeUsers) {
    try {
      // Pre-fetch and cache analytics
      await analyticsService.getLearnerVelocity(user.id);
      await analyticsService.getSkillGap(user.id);
      // ... other analytics
    } catch (error) {
      console.error(`Cache warming failed for user ${user.id}:`, error);
    }
  }
});
```

**7. Cache Monitoring:**
```javascript
// Log cache hit/miss rates
const cacheStats = {
  hits: 0,
  misses: 0,
  get hitRate() {
    return this.hits / (this.hits + this.misses) || 0;
  },
};

analyticsCache.on('hit', (key) => {
  cacheStats.hits++;
});

analyticsCache.on('miss', (key) => {
  cacheStats.misses++;
});

// Expose metrics endpoint
router.get('/metrics/cache', (req, res) => {
  res.json({
    hitRate: cacheStats.hitRate,
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    keys: analyticsCache.keys().length,
    stats: analyticsCache.getStats(),
  });
});
```

**8. Cache Size Limits:**
```javascript
// Limit cache size to prevent memory exhaustion
const analyticsCache = new NodeCache({
  stdTTL: 300,
  maxKeys: 10000, // Max 10k cached responses
  deleteOnExpire: true,
});

// Monitor memory usage
setInterval(() => {
  const memUsage = process.memoryUsage();
  if (memUsage.heapUsed > 500 * 1024 * 1024) { // > 500 MB
    console.warn('High memory usage, clearing cache');
    analyticsCache.flushAll();
  }
}, 60000); // Check every minute
```

**Performance Targets:**

**Cache Hit Rates:**
- Frontend SWR: > 80% (dashboard revisits)
- Backend Cache: > 60% (repeated API calls)
- Database Materialized Views: 100% (pre-computed)

**Response Times:**
- Cache hit: < 50ms
- Cache miss: < 500ms (database query)
- Cold start: < 2s (fetch from microservices)

**Data Consistency:**
- Real-time critical data: No cache (e.g., current streak)
- Near real-time: 5 min cache (e.g., learner velocity)
- Eventually consistent: 4h cache (e.g., skill gap)
- Rarely changing: 48h cache (e.g., predictive analytics)

**Consensus:** ✅ Unanimous

---

## 📊 **Caching Decision Matrix**

| Analytics Type | Frontend SWR | Backend Cache | DB Layer | Rationale |
|---------------|--------------|---------------|----------|-----------|
| Learner (6) | 4h | 5min | Real-time | Frequent updates, 4h staleness OK |
| Trainer (4) | 2h | 10min | 1h mat. view | Teaching metrics stable |
| Org (4) | 6h | 30min | Daily mat. view | Org-wide data changes slowly |
| Predictive (3) | 48h | None | 48h cache table | Expensive AI, must cache |
| Comparison (2) | 4h | 1h | Hourly mat. view | Peer data pre-computed |
| Gamification | 1h | 5min | Real-time + mat. | Points real-time, leaderboards cached |

---

## 📊 **Action Items**

1. [FE] Configure SWR with TTLs per analytics type
2. [BE] Implement NodeCache with Railway built-in caching
3. [BE] Add caching middleware to all analytics endpoints
4. [BE] Set Cache-Control headers for CDN
5. [DA] Create materialized views for leaderboards, comparisons
6. [DA] Set up cron jobs for materialized view refresh
7. [BE] Implement cache invalidation on user activities
8. [BE] Set up cache warming background job
9. [PE] Implement cache monitoring and metrics
10. [PE] Set cache size limits and memory monitoring

---

**Document Version:** 1.0  
**Status:** ✅ Complete  
**Last Updated:** October 24, 2025
