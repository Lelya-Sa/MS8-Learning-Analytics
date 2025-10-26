import { UnifiedApiClient } from './UnifiedApiClient';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: {
      baseURL: 'http://localhost:3000/api/v1',
      timeout: 10000
    }
  }))
}));

import axios from 'axios';

describe('UnifiedApiClient', () => {
  let apiClient;
  let mockAxios;

  beforeEach(() => {
    mockAxios = {
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      defaults: {
        baseURL: 'http://localhost:3000/api/v1',
        timeout: 10000
      }
    };
    
    axios.create.mockReturnValue(mockAxios);
    apiClient = new UnifiedApiClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default config', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3000/api/v1',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
  });

  describe('setAuthToken', () => {
    it('should set auth token in localStorage', () => {
      const token = 'access-token';
      apiClient.setAuthToken(token);
      expect(localStorage.getItem('auth_token')).toBe(token);
    });

    it('should remove auth token when null', () => {
      apiClient.setAuthToken('token');
      apiClient.setAuthToken(null);
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('setActiveRole', () => {
    it('should set active role in localStorage', () => {
      const role = 'learner';
      apiClient.setActiveRole(role);
      expect(localStorage.getItem('active_role')).toBe(role);
    });

    it('should remove active role when null', () => {
      apiClient.setActiveRole('learner');
      apiClient.setActiveRole(null);
      expect(localStorage.getItem('active_role')).toBeNull();
    });
  });

  describe('get', () => {
    it('should make GET request successfully', async () => {
      const mockResponse = { data: { success: true } };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test');

      expect(result).toEqual({ success: true });
      expect(mockAxios.get).toHaveBeenCalledWith('/test', {});
    });

    it('should handle GET request errors', async () => {
      const error = {
        response: {
          status: 404,
          data: { error: 'Not found' }
        }
      };
      mockAxios.get.mockRejectedValue(error);

      await expect(apiClient.get('/test')).rejects.toThrow('API GET /test failed (404): Not found');
    });
  });

  describe('post', () => {
    it('should make POST request successfully', async () => {
      const mockResponse = { data: { success: true } };
      const data = { test: 'data' };
      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/test', data);

      expect(result).toEqual({ success: true });
      expect(mockAxios.post).toHaveBeenCalledWith('/test', data, {});
    });

    it('should handle POST request errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { error: 'Bad request' }
        }
      };
      mockAxios.post.mockRejectedValue(error);

      await expect(apiClient.post('/test', {})).rejects.toThrow('API POST /test failed (400): Bad request');
    });
  });

  describe('validation', () => {
    it('should validate endpoint format', async () => {
      await expect(apiClient.get('')).rejects.toThrow('Invalid endpoint: must be a non-empty string');
      await expect(apiClient.get('test')).rejects.toThrow('Invalid endpoint: must start with "/"');
    });

    it('should validate data format for POST/PUT', async () => {
      await expect(apiClient.post('/test', 'invalid')).rejects.toThrow('Invalid data: must be an object');
    });
  });
});
