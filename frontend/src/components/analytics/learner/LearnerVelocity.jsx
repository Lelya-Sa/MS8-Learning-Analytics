/**
 * AS-001 #1: Learning Velocity & Momentum Component
 * Displays learner's pace, trend, predictions, and momentum
 */

import React from 'react'
import PropTypes from 'prop-types'
import { useLearnerVelocity } from '../../../hooks/useAnalytics'

const LearnerVelocity = ({ userId, data: propData, isLoading: propIsLoading, error: propError }) => {
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useLearnerVelocity(userId)
  
  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult.data?.data?.learningVelocity
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading
  const error = propError || hookResult.error
  // Loading state
  if (isLoading) {
    return (
      <div className="learner-velocity-card animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="learner-velocity-card bg-red-50 border border-red-200">
        <p className="text-red-700">Error loading velocity data: {error.message}</p>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="learner-velocity-card bg-gray-50">
        <p className="text-gray-600">No velocity data available</p>
      </div>
    )
  }

  // Determine trend styling
  const getTrendClass = (trend) => {
    const trendMap = {
      accelerating: 'trend-accelerating text-green-600 bg-green-50',
      steady: 'trend-steady text-blue-600 bg-blue-50',
      decelerating: 'trend-decelerating text-orange-600 bg-orange-50',
      stalled: 'trend-stalled text-red-600 bg-red-50'
    }
    return trendMap[trend] || 'text-gray-600 bg-gray-50'
  }

  // Determine status styling
  const getStatusClass = (status) => {
    const statusMap = {
      ahead: 'text-green-600 bg-green-50',
      'on track': 'text-blue-600 bg-blue-50',
      behind: 'text-red-600 bg-red-50'
    }
    return statusMap[status] || 'text-gray-600 bg-gray-50'
  }

  // Calculate momentum color
  const getMomentumColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="learner-velocity-card bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Learning Velocity & Momentum</h3>
        <div className={`px-4 py-2 rounded-full font-semibold ${getTrendClass(data.trend)}`}>
          {data.trend.charAt(0).toUpperCase() + data.trend.slice(1)} ({data.trendPercentage > 0 ? '+' : ''}{data.trendPercentage}%)
        </div>
      </div>

      {/* Pace Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Current Pace</p>
          <p className="text-3xl font-bold text-blue-700">{data.currentPace}</p>
          <p className="text-xs text-gray-500 mt-1">topics/week</p>
        </div>

        <div className="stat-card bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Average Pace</p>
          <p className="text-3xl font-bold text-gray-700">{data.averagePace}</p>
          <p className="text-xs text-gray-500 mt-1">topics/week</p>
        </div>

        <div className={`stat-card p-4 rounded-lg ${getStatusClass(data.comparisonToGoal.status)}`}>
          <p className="text-sm mb-1">Goal Status</p>
          <p className="text-3xl font-bold">{data.comparisonToGoal.status.toUpperCase()}</p>
          <p className="text-xs mt-1">{data.comparisonToGoal.variance > 0 ? '+' : ''}{data.comparisonToGoal.variance}% vs target</p>
        </div>
      </div>

      {/* Predictions */}
      <div className="predictions-section bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">📅 Completion Predictions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Remaining Topics</p>
            <p className="text-2xl font-bold text-purple-700">{data.predictions.remainingTopics}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimated Time</p>
            <p className="text-2xl font-bold text-purple-700">{data.predictions.estimatedWeeksToComplete} weeks</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Predicted Completion</p>
            <p className="text-lg font-semibold text-gray-800">{new Date(data.predictions.predictedCompletionDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Target Date</p>
            <p className="text-lg font-semibold text-gray-800">{new Date(data.predictions.targetCompletionDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-3">
          {data.predictions.onTrack ? (
            <div className="flex items-center text-green-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">On Track to meet target!</span>
            </div>
          ) : (
            <div className="flex items-center text-red-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Behind schedule - action needed</span>
            </div>
          )}
        </div>
      </div>

      {/* Momentum Score */}
      <div className="momentum-section bg-gradient-to-r from-yellow-50 to-orange-50 p-5 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">⚡ Momentum Score</h4>
        <div className="flex items-center mb-4">
          <div className="relative w-32 h-32 mr-6">
            {/* Circular progress */}
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - data.momentum.score / 100)}`}
                className={getMomentumColor(data.momentum.score)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${getMomentumColor(data.momentum.score)}`}>
                {data.momentum.score}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-800 mb-2">{data.momentum.description}</p>
            <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
              💡 <strong>Recommendation:</strong> {data.momentum.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Time Analysis */}
      {data.timeAnalysis && (
        <div className="time-analysis mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Time Investment</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600">Total Time</p>
              <p className="text-lg font-bold text-gray-800">{data.timeAnalysis.totalTimeSpent}h</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Avg per Topic</p>
              <p className="text-lg font-bold text-gray-800">{data.timeAnalysis.averageTimePerTopic}h</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Efficiency</p>
              <p className={`text-lg font-bold ${data.timeAnalysis.efficientLearner ? 'text-green-600' : 'text-orange-600'}`}>
                {data.timeAnalysis.efficientLearner ? 'High' : 'Moderate'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

LearnerVelocity.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    currentPace: PropTypes.number,
    averagePace: PropTypes.number,
    trend: PropTypes.oneOf(['accelerating', 'steady', 'decelerating', 'stalled']),
    trendPercentage: PropTypes.number,
    comparisonToGoal: PropTypes.shape({
      targetPace: PropTypes.number,
      variance: PropTypes.number,
      status: PropTypes.oneOf(['ahead', 'on track', 'behind'])
    }),
    predictions: PropTypes.shape({
      remainingTopics: PropTypes.number,
      estimatedWeeksToComplete: PropTypes.number,
      predictedCompletionDate: PropTypes.string,
      targetCompletionDate: PropTypes.string,
      onTrack: PropTypes.bool
    }),
    timeAnalysis: PropTypes.shape({
      totalTimeSpent: PropTypes.number,
      averageTimePerTopic: PropTypes.number,
      efficientLearner: PropTypes.bool
    }),
    momentum: PropTypes.shape({
      score: PropTypes.number,
      description: PropTypes.string,
      recommendation: PropTypes.string
    })
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.object
}

export default LearnerVelocity

