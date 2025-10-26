// Manual mock for infrastructure/api
export const apiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  setAuthToken: jest.fn(),
  removeAuthToken: jest.fn(),
  setActiveRole: jest.fn(),
};

export const cacheAdapter = {
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
};
