import axios from 'axios'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: parseInt(process.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development' || process.env.VITE_DEBUG_MODE === 'true') {
      console.log('API Request:', config)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development' || process.env.VITE_DEBUG_MODE === 'true') {
      console.error('API Error:', error.response?.data || error.message)
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// Authentication API
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/v1/auth/login', { email, password })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed')
  }
}

export const logout = async () => {
  try {
    const response = await apiClient.post('/v1/auth/logout')
    localStorage.removeItem('auth_token')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Logout failed')
  }
}

export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/v1/auth/refresh')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Token refresh failed')
  }
}

// Analytics API
export const getAnalytics = async (userId) => {
  try {
    const response = await apiClient.get(`/v1/analytics/learner/${userId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch analytics')
  }
}

export const getLearnerAnalytics = async (userId) => {
  try {
    const response = await apiClient.get(`/v1/analytics/learner/${userId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch learner analytics')
  }
}

export const getTrainerAnalytics = async (userId) => {
  try {
    const response = await apiClient.get(`/v1/analytics/trainer/${userId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch trainer analytics')
  }
}

export const getOrganizationAnalytics = async (organizationId) => {
  try {
    const response = await apiClient.get(`/v1/analytics/organization/${organizationId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch organization analytics')
  }
}

export const refreshAnalytics = async (userId, analyticsType) => {
  try {
    const response = await apiClient.post('/v1/analytics/refresh', {
      user_id: userId,
      analytics_type: analyticsType
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to refresh analytics')
  }
}

// Reports API
export const getReports = async (userId) => {
  try {
    const response = await apiClient.get('/v1/reports')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch reports')
  }
}

export const generateReport = async (type, format, userId) => {
  try {
    const response = await apiClient.post('/v1/reports/generate', {
      type,
      format,
      user_id: userId
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate report')
  }
}

export const downloadReport = async (reportId) => {
  try {
    const response = await apiClient.get(`/v1/reports/${reportId}/download`, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to download report')
  }
}

export const deleteReport = async (reportId) => {
  try {
    const response = await apiClient.delete(`/v1/reports/${reportId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete report')
  }
}

// Data Collection API
export const triggerDataCollection = async (userId, collectionType, services) => {
  try {
    const response = await apiClient.post('/v1/data-collection/trigger', {
      user_id: userId,
      collection_type: collectionType,
      services
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to trigger data collection')
  }
}

export const getCollectionStatus = async (collectionId) => {
  try {
    const response = await apiClient.get(`/v1/data-collection/${collectionId}/status`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get collection status')
  }
}

export const getCollectionResults = async (collectionId) => {
  try {
    const response = await apiClient.get(`/v1/data-collection/${collectionId}/results`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get collection results')
  }
}

export const cancelCollection = async (collectionId) => {
  try {
    const response = await apiClient.post(`/v1/data-collection/${collectionId}/cancel`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to cancel collection')
  }
}

// Privacy API
export const deleteUserData = async (userId) => {
  try {
    const response = await apiClient.delete(`/v1/privacy/user/${userId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete user data')
  }
}

export default apiClient