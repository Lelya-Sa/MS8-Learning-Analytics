import { AnalyticsServiceAdapter } from '../infrastructure/api/AnalyticsServiceAdapter';
import { LocalStorageCacheAdapter } from '../infrastructure/api/LocalStorageCacheAdapter';
import { AuthUseCase } from '../application/useCases/AuthUseCase';
import { GetLearnerAnalyticsUseCase } from '../application/useCases/GetLearnerAnalyticsUseCase';
import { SwitchRoleUseCase } from '../application/useCases/SwitchRoleUseCase';
import { RefreshAnalyticsUseCase } from '../application/useCases/RefreshAnalyticsUseCase';

/**
 * @class DIContainer
 * @description Simple dependency injection container using factory pattern
 */
export class DIContainer {
  constructor() {
    this.services = new Map();
    this.instances = new Map();
  }

  /**
   * Register a service factory
   * @param {string} name - Service name
   * @param {Function} factory - Factory function
   */
  register(name, factory) {
    this.services.set(name, factory);
  }

  /**
   * Get a service instance (singleton)
   * @param {string} name - Service name
   * @returns {any} Service instance
   */
  get(name) {
    if (this.instances.has(name)) {
      return this.instances.get(name);
    }

    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service '${name}' not found`);
    }

    const instance = factory(this);
    this.instances.set(name, instance);
    return instance;
  }

  /**
   * Create a new instance (not singleton)
   * @param {string} name - Service name
   * @returns {any} New service instance
   */
  create(name) {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service '${name}' not found`);
    }

    return factory(this);
  }
}

/**
 * Configure the DI container with all services
 * @param {DIContainer} container - DI container instance
 */
export function configureContainer(container) {
  // Infrastructure services
  container.register('analyticsService', () => {
    return new AnalyticsServiceAdapter();
  });

  container.register('cacheService', () => {
    return new LocalStorageCacheAdapter();
  });

  // Application use cases
  container.register('authUseCase', (container) => {
    // Mock auth repository and token service for now
    const mockAuthRepository = {
      login: async (credentials) => ({ user: {}, tokens: {} }),
      logout: async () => true,
      refreshToken: async () => ({ accessToken: '', refreshToken: '' }),
      getCurrentUser: async () => ({})
    };

    const mockTokenService = {
      generateToken: () => '',
      validateToken: async () => true,
      decodeToken: () => ({})
    };

    return new AuthUseCase(mockAuthRepository, mockTokenService);
  });

  container.register('getLearnerAnalyticsUseCase', (container) => {
    const analyticsService = container.get('analyticsService');
    const cacheService = container.get('cacheService');
    return new GetLearnerAnalyticsUseCase(analyticsService, cacheService);
  });

  container.register('switchRoleUseCase', (container) => {
    // Mock auth service for now
    const mockAuthService = {
      switchRole: async () => true
    };
    const cacheService = container.get('cacheService');
    return new SwitchRoleUseCase(mockAuthService, cacheService);
  });

  container.register('refreshAnalyticsUseCase', (container) => {
    const analyticsService = container.get('analyticsService');
    const cacheService = container.get('cacheService');
    return new RefreshAnalyticsUseCase(analyticsService, cacheService);
  });
}

// Create and configure the global container
export const container = new DIContainer();
configureContainer(container);
