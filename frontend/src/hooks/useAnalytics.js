import useSWR from 'swr'
import * as api from '../services/api'

export const useAnalytics = (userId) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `analytics-${userId}` : null,
    () => api.getAnalytics(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 2000, // 2 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000, // 5 seconds
    }
  )

  return {
    data,
    isLoading,
    error: error?.message,
    mutate
  }
}

export const useLearnerAnalytics = (userId) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `learner-analytics-${userId}` : null,
    () => api.getLearnerAnalytics(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 2000, // 2 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000, // 5 seconds
    }
  )

  return {
    data,
    isLoading,
    error: error?.message,
    mutate
  }
}

export const useTrainerAnalytics = (userId) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `trainer-analytics-${userId}` : null,
    () => api.getTrainerAnalytics(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 2000, // 2 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000, // 5 seconds
    }
  )

  return {
    data,
    isLoading,
    error: error?.message,
    mutate
  }
}

export const useOrganizationAnalytics = (organizationId) => {
  const { data, error, isLoading, mutate } = useSWR(
    organizationId ? `org-analytics-${organizationId}` : null,
    () => api.getOrganizationAnalytics(organizationId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 2000, // 2 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000, // 5 seconds
    }
  )

  return {
    data,
    isLoading,
    error: error?.message,
    mutate
  }
}
