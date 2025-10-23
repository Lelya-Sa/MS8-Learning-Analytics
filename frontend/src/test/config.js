/**
 * Test Configuration for Cloud and Local Environments
 * This file manages test environment settings and API endpoints
 */

// Environment detection
const isCloudEnvironment = process.env.NODE_ENV === 'test' && process.env.CI === 'true'
const isLocalEnvironment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

// Cloud API endpoints (these should be set in your CI/CD environment)
const CLOUD_CONFIG = {
  // Railway backend URL (set this in your CI/CD environment variables)
  // Automatically adds /api if not present
  API_BASE_URL: (() => {
    const railwayUrl = process.env.RAILWAY_API_URL || process.env.BACKEND_URL || 'https://your-railway-app.railway.app'
    return railwayUrl.endsWith('/api') ? railwayUrl : `${railwayUrl}/api`
  })(),
  
  // Vercel frontend URL (for E2E tests)
  FRONTEND_URL: process.env.VERCEL_URL || 'https://ms8-learning-analytics-k1c9h6yt3-lelya-salmans-projects.vercel.app',
  
  // Test credentials (should match your cloud environment)
  TEST_EMAIL: process.env.TEST_EMAIL || 'test@example.com',
  TEST_PASSWORD: process.env.TEST_PASSWORD || 'test-password-123',
  
  // Database connection (for integration tests)
  DATABASE_URL: process.env.DATABASE_URL,
  
  // JWT secret (for token validation tests)
  JWT_SECRET: process.env.JWT_SECRET
}

// Local API endpoints
const LOCAL_CONFIG = {
  API_BASE_URL: 'http://localhost:3000/api',
  FRONTEND_URL: 'http://localhost:5173',
  TEST_EMAIL: 'test@example.com',
  TEST_PASSWORD: 'test-password-123',
  DATABASE_URL: 'postgresql://postgres:password@localhost:5432/learning_analytics?schema=public',
  JWT_SECRET: 'development-jwt-secret-key-change-in-production'
}

// Select configuration based on environment
const TEST_CONFIG = isCloudEnvironment ? CLOUD_CONFIG : LOCAL_CONFIG

// Export configuration
export default TEST_CONFIG

// Helper functions
export const getApiBaseUrl = () => TEST_CONFIG.API_BASE_URL
export const getFrontendUrl = () => TEST_CONFIG.FRONTEND_URL
export const getTestCredentials = () => ({
  email: TEST_CONFIG.TEST_EMAIL,
  password: TEST_CONFIG.TEST_PASSWORD
})

// Environment info
export const getEnvironmentInfo = () => ({
  isCloud: isCloudEnvironment,
  isLocal: isLocalEnvironment,
  apiUrl: TEST_CONFIG.API_BASE_URL,
  frontendUrl: TEST_CONFIG.FRONTEND_URL,
  nodeEnv: process.env.NODE_ENV,
  ci: process.env.CI
})

// Log environment info for debugging
if (process.env.NODE_ENV === 'test') {
  console.log('🧪 Test Environment Configuration:')
  console.log('  Environment:', isCloudEnvironment ? 'CLOUD' : 'LOCAL')
  console.log('  API URL:', TEST_CONFIG.API_BASE_URL)
  console.log('  Frontend URL:', TEST_CONFIG.FRONTEND_URL)
  console.log('  CI:', process.env.CI)
}
