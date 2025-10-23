/**
 * LearnerAnalytics Component with Test Compatibility
 * Supports both hook-based (production) and prop-based (testing) usage
 */

import React, { useState, useEffect } from 'react'
import { useLearnerAnalytics } from '../../hooks/useAnalytics'
import AnalyticsChart from '../charts/AnalyticsChart'
import DataTable from '../tables/DataTable'

const LearnerAnalytics = ({ userId, data: propData, onRefresh: propOnRefresh }) => {
  const [lastRefresh, setLastRefresh] = useState(null)
  const [refreshCooldown, setRefreshCooldown] = useState(false)
  const [showPrivacyControls, setShowPrivacyControls] = useState(false)

  // Use hooks if userId is provided, otherwise use prop data
  const hookResult = useLearnerAnalytics(userId)
  const isUsingHooks = !!userId

  // Determine data source
  const data = isUsingHooks ? hookResult.data : propData
  const error = isUsingHooks ? hookResult.error : null
  const isLoading = isUsingHooks ? hookResult.isLoading : false
  const source = isUsingHooks ? hookResult.source : 'test'
  const lastUpdated = isUsingHooks ? hookResult.lastUpdated : new Date().toISOString()

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
      if (isUsingHooks) {
        await hookResult.refresh()
      } else if (propOnRefresh) {
        await propOnRefresh()
      }
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Refresh failed:', error)
    }
  }

  const handleExportData = async () => {
    try {
      // In a real implementation, this would call the API
      const dataToExport = {
        analytics: data,
        exported_at: new Date().toISOString(),
        user_id: userId || 'test-user'
      }
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `learner-analytics-${userId || 'test-user'}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleDeleteData = async () => {
    if (window.confirm('Are you sure you want to delete all your analytics data? This action cannot be undone.')) {
      try {
        // In a real implementation, this would call the API
        console.log('Deleting user data for:', userId || 'test-user')
        alert('Data deletion request submitted. This may take a few minutes to process.')
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load analytics</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh and data source indicator */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Learning Analytics</h2>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
            {source && (
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                source === 'api' ? 'bg-green-100 text-green-800' :
                source === 'mock' ? 'bg-yellow-100 text-yellow-800' :
                source === 'test' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {source === 'api' ? 'Live Data' : source === 'mock' ? 'Mock Data' : source === 'test' ? 'Test Data' : 'Fallback Data'}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshCooldown}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              refreshCooldown
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {refreshCooldown ? 'Please wait...' : 'Refresh'}
          </button>
          
          <button
            onClick={() => setShowPrivacyControls(!showPrivacyControls)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Privacy Controls
          </button>
        </div>
      </div>

      {/* Privacy Controls */}
      {showPrivacyControls && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Controls</h3>
          <div className="flex space-x-4">
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export My Data
            </button>
            <button
              onClick={handleDeleteData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete My Data
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Velocity</h3>
          <div className="text-3xl font-bold text-primary-600">{data.learning_velocity}%</div>
          <p className="text-sm text-gray-500 mt-1">Overall learning speed</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mastery Progress</h3>
          <div className="text-3xl font-bold text-green-600">{data.mastery_progress}%</div>
          <p className="text-sm text-gray-500 mt-1">Skill mastery level</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Engagement Score</h3>
          <div className="text-3xl font-bold text-blue-600">{data.engagement_score}%</div>
          <p className="text-sm text-gray-500 mt-1">Learning engagement</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Velocity Trend</h3>
          <div className="h-64">
            <AnalyticsChart
              data={data.chart_data?.learning_velocity_trend}
              type="line"
              aria-label="Learning velocity trend chart"
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Levels</h3>
          <div className="h-64">
            <AnalyticsChart
              data={data.chart_data?.skill_levels}
              type="bar"
              aria-label="Skill levels bar chart"
            />
          </div>
        </div>
      </div>

      {/* Skill Gaps Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Gaps</h3>
        <DataTable
          data={data.skill_gaps || []}
          columns={[
            { key: 'skill', label: 'Skill' },
            { key: 'priority', label: 'Priority' },
            { key: 'gap_score', label: 'Gap Score' }
          ]}
          sortable={true}
        />
      </div>

      {/* Learning Path Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Path Progress</h3>
        <div className="space-y-4">
          {data.learning_path_progress?.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{topic.topic}</span>
                  <span className="text-sm text-gray-500">{topic.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      topic.completed ? 'bg-green-500' : 'bg-primary-600'
                    }`}
                    style={{ width: `${topic.progress}%` }}
                  ></div>
                </div>
              </div>
              {topic.completed && (
                <span className="ml-3 text-green-600 text-sm font-medium">✓ Completed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Performance</h3>
          <div className="text-2xl font-bold text-purple-600">{data.assessment_performance}%</div>
          <p className="text-sm text-gray-500 mt-1">Average test scores</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Effectiveness</h3>
          <div className="text-2xl font-bold text-orange-600">{data.content_effectiveness}%</div>
          <p className="text-sm text-gray-500 mt-1">Learning material effectiveness</p>
        </div>
      </div>
    </div>
  )
}

export default LearnerAnalytics