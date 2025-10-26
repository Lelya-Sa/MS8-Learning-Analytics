/**
 * @interface ICacheService
 * @description Cache service contract for data caching
 */
export const ICacheService = {
  /**
   * Get cached data by key
   * @param {string} key - Cache key
   * @returns {Promise<any>} Cached data or null
   */
  get: (key) => Promise.resolve(null),
  
  /**
   * Set cached data with key and TTL
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<void>}
   */
  set: (key, data, ttl) => Promise.resolve(),
  
  /**
   * Delete cached data by key
   * @param {string} key - Cache key
   * @returns {Promise<void>}
   */
  delete: (key) => Promise.resolve(),
  
  /**
   * Clear all cached data
   * @returns {Promise<void>}
   */
  clear: () => Promise.resolve(),
  
  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} True if key exists
   */
  has: (key) => Promise.resolve(false),
  
  /**
   * Get cache statistics
   * @returns {Promise<Object>} Cache statistics
   */
  getStats: () => Promise.resolve({})
};
