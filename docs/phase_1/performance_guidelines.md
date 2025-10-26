# Performance Guidelines - MS8 Learning Analytics

**Project**: MS8 - Learning Analytics Microservice  
**Phase**: 1C - Planning  
**Date**: October 24, 2025  
**Purpose**: Caching strategies, optimization patterns

---

## 1. 3-Layer Caching Strategy

### Layer 1: In-Memory Cache (24h TTL)
```javascript
// backend/src/infrastructure/services/CacheService.js
export class CacheService {
  constructor() {
    this.cache = new Map();
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  set(key, value, ttlSeconds = 86400) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }
}
```

### Layer 2: Database Cache (7d retention)
- Analytics table with `updatedAt` timestamp
- Query cached if `updatedAt` < 6h

### Layer 3: Aggregated Cache (7y retention, partitioned)
- `aggregated_analytics` table with partitioning
- Daily/weekly/monthly aggregates

## 2. Performance Targets

- Dashboard load: < 100ms (cached), < 2.5s (fresh)
- API response: < 500ms (cached)
- Database query: < 100ms (p95)
- Batch job: < 2 hours for 10k users

**Next**: See `security_patterns.md`.

