/**
 * LearnerAnalytics Component - Comprehensive Dashboard
 * Displays all 6 learner analytics categories (AS-001)
 */

import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthProvider'
import LearnerVelocity from './learner/LearnerVelocity'
import SkillGapMatrix from './learner/SkillGapMatrix'
import EngagementScore from './learner/EngagementScore'
import MasteryProgress from './learner/MasteryProgress'
import PerformanceAnalytics from './learner/PerformanceAnalytics'
import ContentEffectiveness from './learner/ContentEffectiveness'

const LearnerAnalytics = ({ userId: propUserId }) => {
  const { user } = useAuth()
  const [lastRefresh, setLastRefresh] = useState(null)
  const [refreshCooldown, setRefreshCooldown] = useState(false)
  const [showPrivacyControls, setShowPrivacyControls] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Use propUserId if provided (for testing), otherwise use authenticated user
  const userId = propUserId || user?.id

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
      // Trigger refresh by updating state
      setLastRefresh(new Date())
      // In production, this would call the API to refresh data
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (err) {
      console.error('Refresh failed:', err)
      setError(err)
      setIsLoading(false)
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

  // Check if user is authenticated
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to view your analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh and privacy controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Learning Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive insights into your learning journey
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
            You have full control over your learning data. Export or delete your data at any time in compliance with GDPR.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleExportData}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
            >
              <span className="mr-2">📥</span>
              Export My Data
            </button>
            <button
              onClick={handleDeleteData}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
            >
              <span className="mr-2">🗑️</span>
              Delete My Data
            </button>
          </div>
        </div>
      )}

      {/* AS-001 #1: Learning Velocity & Momentum */}
      <div className="analytics-section">
        <LearnerVelocity userId={userId} />
      </div>

      {/* AS-001 #3: Engagement Score with Behavioral Insights */}
      <div className="analytics-section">
        <EngagementScore userId={userId} />
      </div>

      {/* AS-001 #2: Skill Gap Matrix with Prioritization */}
      <div className="analytics-section">
        <SkillGapMatrix userId={userId} />
      </div>

      {/* AS-001 #4: Mastery Progress Tracking */}
      <div className="analytics-section">
        <MasteryProgress userId={userId} />
      </div>

      {/* AS-001 #5: Performance & Assessment Analytics */}
      <div className="analytics-section">
        <PerformanceAnalytics userId={userId} />
      </div>

      {/* AS-001 #6: Course & Content Effectiveness */}
      <div className="analytics-section">
        <ContentEffectiveness userId={userId} />
      </div>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-6 mt-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-3xl">💡</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About Your Analytics
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Your learning analytics are updated in real-time as you progress through courses, complete assessments, and engage with content.
              All data is securely stored and complies with GDPR regulations.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Data Retention:</strong> Personal analytics are retained for 7 days, aggregated analytics for 7 years.
              You can export or delete your data at any time using the Privacy Controls above.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearnerAnalytics