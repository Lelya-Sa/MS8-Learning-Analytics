/**
 * @class LocalStorageCacheAdapter
 * @description Infrastructure adapter implementing ICacheService with localStorage
 */
export class LocalStorageCacheAdapter {
  constructor(prefix = 'ms8_analytics_') {
    this.prefix = prefix;
  }

  getKey(key) {
    return `${this.prefix}${key}`;
  }

  get(key) {
    try {
      const fullKey = this.getKey(key);
      const item = localStorage.getItem(fullKey);
      
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      // Check if expired
      if (parsed.timestamp && parsed.ttl) {
        const now = Date.now();
        const itemTime = parsed.timestamp;
        const ttlMs = parsed.ttl * 1000;
        
        if (now - itemTime > ttlMs) {
          this.remove(key);
          return null;
        }
      }

      return parsed.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  set(key, data, ttl = 3600) {
    try {
      const fullKey = this.getKey(key);
      const timestamp = Date.now();
      
      const item = {
        value: data,
        timestamp,
        ttl
      };

      localStorage.setItem(fullKey, JSON.stringify(item));
      
      // Track keys for clear operation
      this.trackKey(key);
    } catch (error) {
      console.error('Cache set error:', error);
      throw new Error(`Failed to cache data: ${error.message}`);
    }
  }

  remove(key) {
    try {
      const fullKey = this.getKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  clear() {
    try {
      const keys = this.getTrackedKeys();
      
      for (const key of keys) {
        this.remove(key);
      }
      
      // Clear tracked keys
      localStorage.removeItem(this.getKey('keys'));
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  has(key) {
    try {
      const data = this.get(key);
      return data !== null;
    } catch (error) {
      return false;
    }
  }

  getStats() {
    try {
      const keys = this.getTrackedKeys();
      
      return {
        totalItems: keys.length,
        keys: keys
      };
    } catch (error) {
      return {
        totalItems: 0,
        keys: []
      };
    }
  }

  trackKey(key) {
    try {
      const keys = this.getTrackedKeys();
      if (!keys.includes(key)) {
        keys.push(key);
        localStorage.setItem(this.getKey('keys'), JSON.stringify(keys));
      }
    } catch (error) {
      console.error('Track key error:', error);
    }
  }

  getTrackedKeys() {
    try {
      const keysItem = localStorage.getItem(this.getKey('keys'));
      return keysItem ? JSON.parse(keysItem) : [];
    } catch (error) {
      return [];
    }
  }
}
