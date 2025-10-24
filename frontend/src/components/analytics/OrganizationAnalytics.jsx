/**
 * OrganizationAnalytics Component - Comprehensive Dashboard
 * Displays all 4 organizational analytics categories (AS-003)
 */

import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthProvider'
import OrganizationLearningVelocity from './organization/OrganizationLearningVelocity'
import StrategicAlignmentTracking from './organization/StrategicAlignmentTracking'
import DepartmentAnalytics from './organization/DepartmentAnalytics'
import LearningCultureMetrics from './organization/LearningCultureMetrics'

const OrganizationAnalytics = ({ organizationId: propOrganizationId }) => {
  const { user } = useAuth()
  const [lastRefresh, setLastRefresh] = useState(null)
  const [refreshCooldown, setRefreshCooldown] = useState(false)
  const [showPrivacyControls, setShowPrivacyControls] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Use propOrganizationId if provided (for testing), otherwise use user's organization
  const organizationId = propOrganizationId || user?.organizationId

  // Handle refresh cooldown (5 minutes)
  useEffect(() => {
    if (lastRefresh) {
      setRefreshCooldown(true)
      const timer = setTimeout(() => {
        setRefreshCooldown(false)
      }, 5 * 60 * 1000) // 5 minutes

      return () => clearTimeout(timer)
    }
  }, [lastRefresh])

  const handleRefresh = async () => {
    if (refreshCooldown) {
      return
    }

    try {
      setIsLoading(true)
      setLastRefresh(new Date())
      // In production, this would call the API to refresh data
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (err) {
      setError('Failed to refresh analytics')
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      // In production, this would call the API to export data
      alert('Export functionality will be available soon. Your data will be downloaded as a JSON file.')
    } catch (err) {
      setError('Failed to export data')
    }
  }

  const handleDeleteData = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your organization analytics data? This action cannot be undone and will comply with GDPR regulations.'
    )
    
    if (confirmed) {
      try {
        // In production, this would call the API to delete data
        alert('Delete functionality will be available soon. Your request will be processed according to GDPR compliance.')
      } catch (err) {
        setError('Failed to delete data')
      }
    }
  }

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to view organization analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh and privacy controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Organization Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive insights into organizational learning performance
            {lastRefresh && (
              <span className="ml-2 text-gray-400">
                • Last refreshed: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshCooldown || isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              refreshCooldown || isLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
            title={refreshCooldown ? 'Please wait 5 minutes between refreshes' : 'Refresh all analytics'}
          >
            {isLoading ? '⟳ Refreshing...' : refreshCooldown ? '⏱ Please wait...' : '🔄 Refresh'}
          </button>
          <button
            onClick={() => setShowPrivacyControls(!showPrivacyControls)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            title="Manage your data privacy"
          >
            🔒 Privacy Controls
          </button>
        </div>
      </div>

      {/* Privacy Controls */}
      {showPrivacyControls && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔒</span>
            Privacy & Data Controls
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            You have full control over your organization's learning data. Export or manage your data at any time in compliance with GDPR.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleExportData}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
            >
              <span className="mr-2">📥</span> Export Organization Data
            </button>
            <button
              onClick={handleDeleteData}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
            >
              <span className="mr-2">🗑️</span> Request Data Deletion
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800 flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* AS-003 #11: Organizational Learning Velocity */}
      <div className="analytics-section">
        <OrganizationLearningVelocity organizationId={organizationId} />
      </div>

      {/* AS-003 #12: Strategic Alignment Tracking */}
      <div className="analytics-section">
        <StrategicAlignmentTracking organizationId={organizationId} />
      </div>

      {/* AS-003 #13: Department & Team Analytics */}
      <div className="analytics-section">
        <DepartmentAnalytics organizationId={organizationId} />
      </div>

      {/* AS-003 #14: Learning Culture Metrics */}
      <div className="analytics-section">
        <LearningCultureMetrics organizationId={organizationId} />
      </div>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-6 mt-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-3xl">💡</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About Your Organization Analytics
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              These dashboards provide comprehensive insights into your organization's learning velocity, strategic alignment,
              department performance, and overall learning culture. Data is updated regularly to help you make informed
              decisions about learning and development strategies.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Data Retention:</strong> Organizational analytics are retained for 7 years for strategic planning and compliance.
              You can manage your data using the Privacy Controls above.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Access Level:</strong> These analytics are available to organization administrators only. 
              Individual learner and trainer data is protected according to GDPR regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationAnalytics
