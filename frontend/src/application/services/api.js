import { unifiedApiClient } from '../../infrastructure/api/UnifiedApiClient'

// Use the unified API client
const apiClient = unifiedApiClient;

// Authentication API
export const login = async (email, password) => {
  validateEmail(email);
  validatePassword(password);
  
  try {
    const response = await apiClient.post('/auth/login', { email, password })
    return response
  } catch (error) {
    throw new Error(error.message || 'Login failed')
  }
}

export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout')
    apiClient.removeAuthToken()
    return response
  } catch (error) {
    throw new Error(error.message || 'Logout failed')
  }
}

export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh')
    return response
  } catch (error) {
    throw new Error(error.message || 'Token refresh failed')
  }
}

// Analytics API
export const getAnalytics = async (userId) => {
  validateUserId(userId);
  try {
    const response = await apiClient.get(`/analytics/learner/${userId}`)
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch analytics')
  }
}

export const getLearnerAnalytics = async (userId) => {
  validateUserId(userId);
  try {
    const response = await apiClient.get(`/learner/analytics/overview/${userId}`)
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch learner analytics')
  }
}

export const getTrainerAnalytics = async (userId) => {
  validateUserId(userId);
  try {
    const response = await apiClient.get(`/trainer/analytics/overview/${userId}`)
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch trainer analytics')
  }
}

export const getOrganizationAnalytics = async (organizationId) => {
  validateOrgId(organizationId);
  try {
    const response = await apiClient.get(`/org-admin/analytics/overview/${organizationId}`)
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch organization analytics')
  }
}

export const refreshAnalytics = async (userId, analyticsType) => {
  validateUserId(userId);
  validateAnalyticsType(analyticsType);
  try {
    const response = await apiClient.post('/analytics/refresh', {
      userId: userId,
      analytics: analyticsType
    })
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to refresh analytics')
  }
}

// Reports API
export const getReports = async (userId) => {
  validateUserId(userId);
  try {
    const response = await apiClient.get('/reports')
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch reports')
  }
}

export const generateReport = async (type, format, userId) => {
  validateReportType(type);
  validateFormat(format);
  validateUserId(userId);
  try {
    const response = await apiClient.post('/reports/generate', {
      type,
      format,
      user_id: userId
    })
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to generate report')
  }
}

export const downloadReport = async (reportId) => {
  validateReportId(reportId);
  try {
    const response = await apiClient.get(`/reports/${reportId}/download`, {
      responseType: 'blob'
    })
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to download report')
  }
}

export const deleteReport = async (reportId) => {
  validateReportId(reportId);
  try {
    const response = await apiClient.delete(`/reports/${reportId}`)
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to delete report')
  }
}

// Data Collection API
export const triggerDataCollection = async (userId, collectionType, services) => {
  validateUserId(userId);
  validateCollectionType(collectionType);
  validateServices(services);
  try {
    const response = await apiClient.post('/data-collection/trigger', {
      user_id: userId,
      collection_type: collectionType,
      services
    })
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to trigger data collection')
  }
}

export const getCollectionStatus = async (collectionId) => {
  validateCollectionId(collectionId);
  try {
    const response = await apiClient.get(`/data-collection/${collectionId}/status`)
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to get collection status')
  }
}

export const getCollectionResults = async (collectionId) => {
  validateCollectionId(collectionId);
  try {
    const response = await apiClient.get(`/data-collection/${collectionId}/results`)
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to get collection results')
  }
}

export const cancelCollection = async (collectionId) => {
  validateCollectionId(collectionId);
  try {
    const response = await apiClient.post(`/data-collection/${collectionId}/cancel`)
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to cancel collection')
  }
}

// Privacy API
export const deleteUserData = async (userId) => {
  validateUserId(userId);
  try {
    const response = await apiClient.delete(`/privacy/user/${userId}`)
    return response
  } catch (error) {
    throw new Error(error.message || 'Failed to delete user data')
  }
}

// Additional API methods for analytics service
export const get = async (url) => {
  validateUrl(url);
  try {
    const response = await apiClient.get(url)
    return response
  } catch (error) {
    throw new Error(error.message || 'API request failed')
  }
}

export const post = async (url, data) => {
  validateUrl(url);
  try {
    const response = await apiClient.post(url, data)
    return response
  } catch (error) {
    throw new Error(error.message || 'API request failed')
  }
}

export const put = async (url, data) => {
  validateUrl(url);
  try {
    const response = await apiClient.put(url, data)
    return response
  } catch (error) {
    throw new Error(error.message || 'API request failed')
  }
}

export const del = async (url) => {
  validateUrl(url);
  try {
    const response = await apiClient.delete(url)
    return response
  } catch (error) {
    throw new Error(error.message || 'API request failed')
  }
}

// Validation functions
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email: must be a non-empty string');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email: must be a valid email format');
  }
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Invalid password: must be a non-empty string');
  }
  if (password.length < 6) {
    throw new Error('Invalid password: must be at least 6 characters');
  }
}

function validateUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a non-empty string');
  }
}

function validateOrgId(orgId) {
  if (!orgId || typeof orgId !== 'string') {
    throw new Error('Invalid organizationId: must be a non-empty string');
  }
}

function validateAnalyticsType(type) {
  if (!type || typeof type !== 'string') {
    throw new Error('Invalid analyticsType: must be a non-empty string');
  }
}

function validateReportType(type) {
  if (!type || typeof type !== 'string') {
    throw new Error('Invalid report type: must be a non-empty string');
  }
}

function validateFormat(format) {
  if (!format || typeof format !== 'string') {
    throw new Error('Invalid format: must be a non-empty string');
  }
  const validFormats = ['pdf', 'excel', 'csv', 'json'];
  if (!validFormats.includes(format.toLowerCase())) {
    throw new Error(`Invalid format: must be one of ${validFormats.join(', ')}`);
  }
}

function validateReportId(reportId) {
  if (!reportId || typeof reportId !== 'string') {
    throw new Error('Invalid reportId: must be a non-empty string');
  }
}

function validateCollectionType(type) {
  if (!type || typeof type !== 'string') {
    throw new Error('Invalid collectionType: must be a non-empty string');
  }
}

function validateServices(services) {
  if (!Array.isArray(services)) {
    throw new Error('Invalid services: must be an array');
  }
}

function validateCollectionId(collectionId) {
  if (!collectionId || typeof collectionId !== 'string') {
    throw new Error('Invalid collectionId: must be a non-empty string');
  }
}

function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL: must be a non-empty string');
  }
}

export default apiClient