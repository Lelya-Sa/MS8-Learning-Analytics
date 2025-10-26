// Mock UnifiedApiClient for testing
export const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  setAuthToken: jest.fn(),
  removeAuthToken: jest.fn(),
  setActiveRole: jest.fn(),
  getBaseURL: jest.fn(() => 'http://localhost:3000/api/v1'),
};

// Mock the UnifiedApiClient module
jest.mock('../../infrastructure/api/UnifiedApiClient', () => ({
  UnifiedApiClient: jest.fn().mockImplementation(() => mockApiClient),
  unifiedApiClient: mockApiClient,
}));
