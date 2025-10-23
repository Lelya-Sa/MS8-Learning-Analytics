import '@testing-library/jest-dom'

// Mock environment variables
process.env.NODE_ENV = 'development'
process.env.VITE_API_BASE_URL = 'http://localhost:3000/api'
process.env.VITE_APP_NAME = 'MS8 Learning Analytics'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((key) => {
    return localStorageMock.store[key] || null
  }),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = value
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key]
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {}
  }),
  store: {}
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock fetch
global.fetch = vi.fn().mockImplementation((url, options) => {
  // Mock successful responses for tests
  if (url.includes('/auth/login')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        token: 'mock-jwt-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'learner',
          organization_id: 'org-123'
        }
      })
    })
  }
  
  if (url.includes('/reports/generate')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 'report-123',
        type: 'learner',
        format: 'pdf',
        status: 'processing',
        created_at: '2024-01-15T12:00:00Z',
        expires_at: '2024-01-22T12:00:00Z',
        download_url: null
      })
    })
  }
  
  // Default mock response
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  })
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      defaults: {
        baseURL: 'http://localhost:3001/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}))

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: Object.assign(vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
    render: vi.fn(),
  })), {
    register: vi.fn(),
  }),
  registerables: [],
}))

// Mock SWR
vi.mock('swr', () => ({
  default: vi.fn((key, fetcher) => {
    // Return mock data based on the key
    if (key?.includes('learner-analytics') || key?.includes('analytics-')) {
      return {
        data: {
          learning_velocity: 85.5,
          mastery_progress: 72.3,
          engagement_score: 91.2,
          assessment_performance: 78.5,
          content_effectiveness: 82.1,
          skill_gaps: [
            { skill: 'JavaScript', priority: 'high', gap_score: 0.3 },
            { skill: 'React', priority: 'medium', gap_score: 0.2 }
          ]
        },
        error: null,
        isLoading: false,
        mutate: vi.fn(),
      }
    }
    if (key?.includes('trainer-analytics')) {
      return {
        data: {
          course_performance: 88.5,
          course_health: 92.3,
          teaching_effectiveness: 85.7,
          student_distribution: {
            total_students: 150,
            active_students: 120,
            at_risk_students: 15
          }
        },
        error: null,
        isLoading: false,
        mutate: vi.fn(),
      }
    }
    if (key?.includes('org-analytics')) {
      return {
        data: {
          learning_velocity: 78.5,
          strategic_alignment: 85.2,
          learning_culture: 91.8,
          department_metrics: {
            engineering: { velocity: 82.1, engagement: 88.5 },
            marketing: { velocity: 75.3, engagement: 79.2 }
          }
        },
        error: null,
        isLoading: false,
        mutate: vi.fn(),
      }
    }
    if (key?.includes('reports')) {
      return {
        data: [
          {
            id: 'report-1',
            type: 'learner',
            format: 'pdf',
            status: 'completed',
            created_at: '2024-01-15T10:00:00Z',
            expires_at: '2024-01-22T10:00:00Z',
            download_url: 'https://example.com/report-1.pdf'
          },
          {
            id: 'report-2',
            type: 'learner',
            format: 'csv',
            status: 'processing',
            created_at: '2024-01-15T11:00:00Z',
            expires_at: '2024-01-22T11:00:00Z',
            download_url: null
          }
        ],
        error: null,
        isLoading: false,
        mutate: vi.fn(),
      }
    }
    return {
      data: null,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    }
  }),
  SWRConfig: ({ children }) => children,
}))

// Mock API services for component tests only
// Note: This mock is disabled for API tests to allow testing actual API functions
// vi.mock('../services/api', () => ({
//   login: vi.fn().mockResolvedValue({
//     token: 'mock-jwt-token',
//     user: {
//       id: 'user-123',
//       email: 'test@example.com',
//       role: 'learner',
//       organization_id: 'org-123'
//     }
//   }),
//   logout: vi.fn().mockResolvedValue({ message: 'Logged out successfully' }),
//   refreshToken: vi.fn().mockResolvedValue({
//     token: 'new-jwt-token',
//     expires_in: 3600
//   }),
//   getLearnerAnalytics: vi.fn().mockResolvedValue({
//     learning_velocity: 85.5,
//     mastery_progress: 72.3,
//     engagement_score: 91.2,
//     assessment_performance: 78.5,
//     content_effectiveness: 82.1,
//     skill_gaps: [
//       { skill: 'JavaScript', priority: 'high', gap_score: 0.3 },
//       { skill: 'React', priority: 'medium', gap_score: 0.2 }
//     ]
//   }),
//   getTrainerAnalytics: vi.fn().mockResolvedValue({
//     course_performance: 88.5,
//     course_health: 92.3,
//     teaching_effectiveness: 85.7,
//     student_distribution: {
//       total_students: 150,
//       active_students: 120,
//       at_risk_students: 15
//     }
//   }),
//   getOrganizationAnalytics: vi.fn().mockResolvedValue({
//     learning_velocity: 78.5,
//     strategic_alignment: 85.2,
//     learning_culture: 91.8,
//     department_metrics: {
//       engineering: { velocity: 82.1, engagement: 88.5 },
//       marketing: { velocity: 75.3, engagement: 79.2 }
//     }
//   }),
//   getReports: vi.fn().mockResolvedValue([
//     {
//       id: 'report-1',
//       type: 'learner',
//       format: 'pdf',
//       status: 'completed',
//       created_at: '2024-01-15T10:00:00Z',
//       expires_at: '2024-01-22T10:00:00Z',
//       download_url: 'https://example.com/report-1.pdf'
//     },
//     {
//       id: 'report-2',
//       type: 'learner',
//       format: 'csv',
//       status: 'processing',
//       created_at: '2024-01-15T11:00:00Z',
//       expires_at: '2024-01-22T11:00:00Z',
//       download_url: null
//     }
//   ]),
//   generateReport: vi.fn().mockResolvedValue({
//     id: 'report-123',
//     type: 'learner',
//     format: 'pdf',
//     status: 'processing',
//     created_at: '2024-01-15T12:00:00Z',
//     expires_at: '2024-01-22T12:00:00Z',
//     download_url: null
//   }),
//   downloadReport: vi.fn().mockResolvedValue(new Blob(['report content'])),
//   deleteReport: vi.fn().mockResolvedValue({ message: 'Report deleted successfully' }),
//   triggerDataCollection: vi.fn().mockResolvedValue({
//     collection_id: 'collection-123',
//     status: 'started',
//     message: 'Data collection initiated'
//   }),
//   getCollectionStatus: vi.fn().mockResolvedValue({
//     collection_id: 'collection-123',
//     status: 'completed',
//     progress: 100,
//     records_processed: 1500
//   }),
//   getAnalytics: vi.fn().mockResolvedValue({
//     learning_velocity: 85.5,
//     mastery_progress: 72.3,
//     engagement_score: 91.2
//   }),
//   deleteUserData: vi.fn().mockResolvedValue({ message: 'User data deleted successfully' }),
//   exportUserData: vi.fn().mockResolvedValue({ download_url: 'https://example.com/user-data-export.zip' }),
// }))
