/**
 * Environment utility for cross-platform compatibility
 * Handles both Vite (import.meta.env) and Jest/Node.js (process.env) environments
 */

// Check if we're in a Vite environment
const isViteEnvironment = () => {
  try {
    // Check if import.meta is available (Vite environment)
    return typeof import.meta !== 'undefined' && import.meta.env
  } catch (e) {
    return false
  }
}

// Get environment variable with fallback
export const getEnvVar = (key, defaultValue) => {
  if (isViteEnvironment()) {
    // Use import.meta.env in Vite (browser environment)
    return import.meta.env[key] || defaultValue
  } else {
    // Use process.env in Jest/Node.js environment
    return process.env[key] || defaultValue
  }
}

// Check if we're in development mode
export const isDevelopment = () => {
  if (isViteEnvironment()) {
    return import.meta.env.MODE === 'development'
  }
  return getEnvVar('NODE_ENV', 'development') === 'development'
}

// Check if debug mode is enabled
export const isDebugMode = () => {
  return getEnvVar('VITE_DEBUG_MODE', 'false') === 'true'
}
