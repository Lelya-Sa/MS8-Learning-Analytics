import { useState } from 'react'
import useSWR from 'swr'
import * as api from '../services/api'

export const useReports = (userId) => {
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `reports-${userId}` : null,
    () => api.getReports(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // 1 minute
      dedupingInterval: 2000, // 2 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000, // 5 seconds
    }
  )

  const generateReport = async (type, format) => {
    setIsGenerating(true)
    try {
      const report = await api.generateReport(type, format)
      // Refresh the reports list
      await mutate()
      return report
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = async (reportId) => {
    try {
      const blob = await api.downloadReport(reportId)
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report-${reportId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw new Error(`Failed to download report: ${error.message}`)
    }
  }

  const deleteReport = async (reportId) => {
    try {
      await api.deleteReport(reportId)
      // Refresh the reports list
      await mutate()
    } catch (error) {
      throw new Error(`Failed to delete report: ${error.message}`)
    }
  }

  return {
    data,
    isLoading,
    error: error?.message,
    isGenerating,
    generateReport,
    downloadReport,
    deleteReport,
    mutate
  }
}
