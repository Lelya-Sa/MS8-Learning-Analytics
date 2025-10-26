/**
 * @file API Infrastructure Index
 * @description Exports unified API client and related utilities
 */

import { UnifiedApiClient, unifiedApiClient } from './UnifiedApiClient';
import { LocalStorageCacheAdapter } from './LocalStorageCacheAdapter';

// Create singleton instances
export const apiClient = unifiedApiClient;
export const cacheAdapter = new LocalStorageCacheAdapter();

// Export classes for dependency injection
export { UnifiedApiClient as ApiClient, LocalStorageCacheAdapter };
