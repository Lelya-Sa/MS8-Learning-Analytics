/**
 * Enhanced Analytics Hooks with SWR Integration
 * Implements hybrid approach: SWR caching + service layer fallback
 */

import useSWR from 'swr'
import { analyticsService } from '../services/analyticsService'

/**
 * Generic SWR fetcher with error handling
 */
const createFetcher = (serviceMethod) => {
  return async (...args) => {
    try {
      return await serviceMethod(...args)
    } catch (error) {
      console.error('Fetcher error:', error)
      throw error
    }
  }
}

/**
 * Hook for learner analytics with SWR
 */
export const useLearnerAnalytics = (userId, filters = {}) => {
  const key = userId ? ['learner-analytics', userId, filters] : null
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    createFetcher(analyticsService.getLearnerAnalytics),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      fallbackData: null,
      onError: (error) => {
        console.warn('Learner analytics error:', error)
        // Automatically enable mock data on persistent errors
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          analyticsService.enableMockData()
        }
      }
    }
  )

  const refresh = async () => {
    try {
      await analyticsService.refreshAnalytics(userId, 'learner')
      await mutate() // Revalidate data
    } catch (error) {
      console.error('Refresh failed:', error)
    }
  }

  return {
    data,
    error,
    isLoading,
    refresh,
    mutate,
    source: data?.source || 'unknown',
    lastUpdated: data?.timestamp
  }
}

/**
 * Hook for trainer analytics with SWR
 */
export const useTrainerAnalytics = (userId, filters = {}) => {
  const key = userId ? ['trainer-analytics', userId, filters] : null
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    createFetcher(analyticsService.getTrainerAnalytics),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      fallbackData: null,
      onError: (error) => {
        console.warn('Trainer analytics error:', error)
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          analyticsService.enableMockData()
        }
      }
    }
  )

  const refresh = async () => {
    try {
      await analyticsService.refreshAnalytics(userId, 'trainer')
      await mutate()
    } catch (error) {
      console.error('Refresh failed:', error)
    }
  }

  return {
    data,
    error,
    isLoading,
    refresh,
    mutate,
    source: data?.source || 'unknown',
    lastUpdated: data?.timestamp
  }
}

/**
 * Hook for organization analytics with SWR
 */
export const useOrganizationAnalytics = (organizationId, filters = {}) => {
  const key = organizationId ? ['organization-analytics', organizationId, filters] : null
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    createFetcher(analyticsService.getOrganizationAnalytics),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      fallbackData: null,
      onError: (error) => {
        console.warn('Organization analytics error:', error)
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          analyticsService.enableMockData()
        }
      }
    }
  )

  const refresh = async () => {
    try {
      await analyticsService.refreshAnalytics(organizationId, 'organization')
      await mutate()
    } catch (error) {
      console.error('Refresh failed:', error)
    }
  }

  return {
    data,
    error,
    isLoading,
    refresh,
    mutate,
    source: data?.source || 'unknown',
    lastUpdated: data?.timestamp
  }
}

/**
 * Hook for reports with SWR
 */
export const useReports = (userId) => {
  const key = userId ? ['reports', userId] : null
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    createFetcher(analyticsService.getReports),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 600000, // 10 minutes
      dedupingInterval: 120000, // 2 minutes
      errorRetryCount: 2,
      errorRetryInterval: 10000,
      fallbackData: null,
      onError: (error) => {
        console.warn('Reports error:', error)
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          analyticsService.enableMockData()
        }
      }
    }
  )

  const generateReport = async (type, format) => {
    try {
      const newReport = await analyticsService.generateReport(type, format, userId)
      await mutate() // Refresh reports list
      return newReport
    } catch (error) {
      console.error('Generate report failed:', error)
      throw error
    }
  }

  return {
    reports: data?.reports || [],
    error,
    isLoading,
    generateReport,
    mutate,
    source: data?.source || 'unknown',
    lastUpdated: data?.timestamp
  }
}

/**
 * Generic analytics hook that switches based on user role
 */
export const useAnalytics = (user) => {
  if (!user) {
    return { data: null, error: null, isLoading: false, refresh: () => {} }
  }

  const learnerAnalytics = useLearnerAnalytics(user.id)
  const trainerAnalytics = useTrainerAnalytics(user.id)
  const organizationAnalytics = useOrganizationAnalytics(user.organization_id)

  switch (user.role) {
    case 'learner':
      return learnerAnalytics
    case 'trainer':
      return trainerAnalytics
    case 'org_admin':
      return organizationAnalytics
    default:
      return { data: null, error: new Error('Unknown role'), isLoading: false, refresh: () => {} }
  }
}

/**
 * Hook for managing analytics service state
 */
export const useAnalyticsService = () => {
  const toggleMockData = () => {
    if (analyticsService.useMockData) {
      analyticsService.disableMockData()
    } else {
      analyticsService.enableMockData()
    }
  }

  return {
    isUsingMockData: analyticsService.useMockData,
    toggleMockData,
    enableMockData: () => analyticsService.enableMockData(),
    disableMockData: () => analyticsService.disableMockData()
  }
}