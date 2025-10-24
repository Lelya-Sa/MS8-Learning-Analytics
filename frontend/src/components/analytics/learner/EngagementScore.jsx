/**
 * AS-001 #3: Engagement Score with Behavioral Insights Component
 * Displays engagement metrics, behavioral patterns, and risk assessment
 */

import React from 'react'
import PropTypes from 'prop-types'
import { useLearnerEngagement } from '../../../hooks/useAnalytics'

const EngagementScore = ({ userId, data: propData, isLoading: propIsLoading, error: propError }) => {
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useLearnerEngagement(userId)
  
  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult.data?.data?.engagementAnalytics
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading
  const error = propError || hookResult.error
  // Loading state
  if (isLoading) {
    return (
      <div className="engagement-score-card animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="engagement-score-card bg-red-50 border border-red-200 p-6 rounded-lg">
        <p className="text-red-700">Error loading engagement data: {error.message}</p>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="engagement-score-card bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600">No engagement data available</p>
      </div>
    )
  }

  // Get score grade color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  // Get risk level styling
  const getRiskClass = (level) => {
    const riskMap = {
      low: 'risk-low bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300'
    }
    return riskMap[level] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  return (
    <div className="engagement-score-card bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Engagement Score & Behavioral Insights</h3>
        <p className="text-sm text-gray-600">Understanding your learning patterns and engagement</p>
      </div>

      {/* Overall Score */}
      <div className="overall-score bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">Overall Engagement Score</p>
            <div className="flex items-baseline gap-3">
              <span className={`text-6xl font-bold ${getScoreColor(data.overallScore)}`}>
                {data.overallScore}
              </span>
              <span className="text-2xl font-semibold text-gray-600">/100</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 border-2 border-gray-200">
                {data.scoreGrade}
              </span>
              <span className="text-sm text-gray-600">{data.scoreTrend}</span>
            </div>
          </div>
          {/* Circular gauge */}
          <div className="relative w-32 h-32">
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
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - data.overallScore / 100)}`}
                className={getScoreColor(data.overallScore)}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="breakdowns mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Engagement Dimensions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Consistency */}
          <div className="breakdown-card bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gray-800">Consistency</h5>
              <span className="text-2xl font-bold text-green-700">{data.breakdowns.consistency.score}</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Login Frequency:</span> {data.breakdowns.consistency.loginFrequency}/week
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Active Streak:</span> {data.breakdowns.consistency.activeStreak} days 🔥
              </p>
              {data.breakdowns.consistency.longestGap && (
                <p className="text-gray-700">
                  <span className="font-semibold">Longest Gap:</span> {data.breakdowns.consistency.longestGap} days
                </p>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-3 italic bg-white p-2 rounded">
              {data.breakdowns.consistency.insight}
            </p>
          </div>

          {/* Time Investment */}
          <div className="breakdown-card bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gray-800">Time Investment</h5>
              <span className="text-2xl font-bold text-blue-700">{data.breakdowns.timeInvestment.score}</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Last 7 Days:</span> {data.breakdowns.timeInvestment.hoursLast7Days}h
              </p>
              {data.breakdowns.timeInvestment.hoursLast30Days && (
                <p className="text-gray-700">
                  <span className="font-semibold">Last 30 Days:</span> {data.breakdowns.timeInvestment.hoursLast30Days}h
                </p>
              )}
              {data.breakdowns.timeInvestment.averageSessionDuration && (
                <p className="text-gray-700">
                  <span className="font-semibold">Avg Session:</span> {data.breakdowns.timeInvestment.averageSessionDuration} min
                </p>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-3 italic bg-white p-2 rounded">
              {data.breakdowns.timeInvestment.insight}
            </p>
          </div>

          {/* Interaction Quality */}
          <div className="breakdown-card bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gray-800">Interaction Quality</h5>
              <span className="text-2xl font-bold text-purple-700">{data.breakdowns.interactionQuality.score}</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Completion Rate:</span> {data.breakdowns.interactionQuality.contentCompletionRate}%
              </p>
              {data.breakdowns.interactionQuality.practiceAttempts && (
                <p className="text-gray-700">
                  <span className="font-semibold">Practice Attempts:</span> {data.breakdowns.interactionQuality.practiceAttempts}
                </p>
              )}
              {data.breakdowns.interactionQuality.assessmentAttempts && (
                <p className="text-gray-700">
                  <span className="font-semibold">Assessments:</span> {data.breakdowns.interactionQuality.assessmentAttempts}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-3 italic bg-white p-2 rounded">
              {data.breakdowns.interactionQuality.insight}
            </p>
          </div>

          {/* Resource Usage */}
          <div className="breakdown-card bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gray-800">Resource Usage</h5>
              <span className="text-2xl font-bold text-orange-700">{data.breakdowns.resourceUsage.score}</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Diversity:</span> {data.breakdowns.resourceUsage.diversityScore}%
              </p>
              {data.breakdowns.resourceUsage.contentTypesUsed && (
                <p className="text-gray-700">
                  <span className="font-semibold">Types Used:</span> {data.breakdowns.resourceUsage.contentTypesUsed.join(', ')}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-3 italic bg-white p-2 rounded">
              {data.breakdowns.resourceUsage.insight}
            </p>
          </div>
        </div>
      </div>

      {/* Behavioral Patterns */}
      {data.behavioralPatterns && (
        <div className="behavioral-patterns bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">🧠 Behavioral Patterns</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Peak Learning Time</p>
              <p className="text-lg font-bold text-indigo-700">{data.behavioralPatterns.peakLearningTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Peak Learning Days</p>
              <p className="text-lg font-bold text-indigo-700">
                {data.behavioralPatterns.peakLearningDays.join(', ')}
              </p>
            </div>
            {data.behavioralPatterns.preferredDevice && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Preferred Device</p>
                <p className="text-lg font-bold text-indigo-700 capitalize">{data.behavioralPatterns.preferredDevice}</p>
              </div>
            )}
            {data.behavioralPatterns.learningStyle && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Learning Style</p>
                <p className="text-lg font-bold text-indigo-700 capitalize">{data.behavioralPatterns.learningStyle}</p>
              </div>
            )}
          </div>

          {/* Insights */}
          {data.behavioralPatterns.insights && data.behavioralPatterns.insights.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">💡 Key Insights:</p>
              <ul className="space-y-1">
                {data.behavioralPatterns.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {data.behavioralPatterns.recommendations && data.behavioralPatterns.recommendations.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">🎯 Recommendations:</p>
              <ul className="space-y-1">
                {data.behavioralPatterns.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-700 bg-white p-2 rounded flex items-start">
                    <span className="mr-2">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Risk Assessment */}
      {data.riskAssessment && (
        <div className="risk-assessment mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Risk Assessment</h4>
          <div className={`p-5 rounded-lg border-2 ${getRiskClass(data.riskAssessment.riskLevel)}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold">Risk Level: {data.riskAssessment.riskLevel.toUpperCase()}</span>
              <span className="text-2xl font-bold">{data.riskAssessment.riskScore}</span>
            </div>
            <p className="text-sm font-semibold mb-2">{data.riskAssessment.healthStatus}</p>
            {data.riskAssessment.riskFactors && data.riskAssessment.riskFactors.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-semibold mb-1">Risk Factors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {data.riskAssessment.riskFactors.map((factor, idx) => (
                    <li key={idx} className="text-sm">{factor}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.riskAssessment.interventionRecommended && (
              <div className="mt-3 bg-white p-3 rounded border-2 border-current">
                <p className="text-sm font-semibold">⚡ Intervention Recommended</p>
                <p className="text-xs mt-1">We recommend scheduling a check-in with your trainer.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Peer Comparison */}
      {data.comparisonToPeers && (
        <div className="peer-comparison bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">👥 Peer Comparison</h4>
          <div className="grid grid-cols-3 gap-4 text-center mb-3">
            <div>
              <p className="text-sm text-gray-600">Your Score</p>
              <p className="text-2xl font-bold text-amber-700">{data.comparisonToPeers.yourScore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Peer Average</p>
              <p className="text-2xl font-bold text-gray-700">{data.comparisonToPeers.peerAverage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Percentile</p>
              <p className="text-2xl font-bold text-amber-700">{data.comparisonToPeers.percentile}th</p>
            </div>
          </div>
          <p className="text-sm text-center text-gray-700 italic bg-white p-3 rounded">
            {data.comparisonToPeers.insight}
          </p>
        </div>
      )}
    </div>
  )
}

EngagementScore.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    overallScore: PropTypes.number,
    scoreGrade: PropTypes.string,
    scoreTrend: PropTypes.string,
    breakdowns: PropTypes.object,
    behavioralPatterns: PropTypes.object,
    riskAssessment: PropTypes.object,
    comparisonToPeers: PropTypes.object
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.object
}

export default EngagementScore

