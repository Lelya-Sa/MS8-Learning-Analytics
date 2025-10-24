/**
 * AS-001 #5: Performance & Assessment Analytics Component
 * Displays assessment scores, progression, and predictions
 */

import React from 'react'
import PropTypes from 'prop-types'

const PerformanceAnalytics = ({ userId, data, isLoading = false, error = null }) => {
  // Loading state
  if (isLoading) {
    return <div className="performance-analytics-card animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-40 bg-gray-200 rounded mb-4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  }

  // Error state
  if (error) {
    return <div className="performance-analytics-card bg-red-50 border border-red-200 p-6 rounded-lg">
      <p className="text-red-700">Error loading performance data: {error.message}</p>
    </div>
  }

  // No data state
  if (!data) {
    return <div className="performance-analytics-card bg-gray-50 p-6 rounded-lg">
      <p className="text-gray-600">No performance data available</p>
    </div>
  }

  const getTrendColor = (trend) => {
    const trendMap = {
      improving: 'text-green-600 bg-green-100',
      stable: 'text-blue-600 bg-blue-100',
      declining: 'text-red-600 bg-red-100'
    }
    return trendMap[trend] || 'text-gray-600 bg-gray-100'
  }

  const getRiskColor = (level) => {
    const riskMap = {
      low: 'text-green-600',
      medium: 'text-orange-600',
      high: 'text-red-600'
    }
    return riskMap[level] || 'text-gray-600'
  }

  return (
    <div className="performance-analytics-card bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Performance & Assessment Analytics</h3>

      {/* Overview */}
      <div className="overview grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Total Assessments</p>
          <p className="text-3xl font-bold text-blue-700">{data.overview.totalAssessments}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Average Score</p>
          <p className="text-3xl font-bold text-green-700">{data.overview.overallAverageScore}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
          <p className="text-3xl font-bold text-purple-700">{data.overview.passRate}%</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${getTrendColor(data.overview.improvementTrend)}`}>
          <p className="text-sm mb-1">Trend</p>
          <p className="text-2xl font-bold capitalize">{data.overview.improvementTrend}</p>
        </div>
      </div>

      {/* Score Progression Chart */}
      {data.scoreProgression && data.scoreProgression.length > 0 && (
        <div className="score-progression-chart bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">📈 Score Progression</h4>
          <div className="relative h-48">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={200 - (y * 2)}
                  x2="800"
                  y2={200 - (y * 2)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              
              {/* Line chart */}
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                points={data.scoreProgression.map((score, idx) => 
                  `${(idx / (data.scoreProgression.length - 1)) * 800},${200 - (score * 2)}`
                ).join(' ')}
              />
              
              {/* Data points */}
              {data.scoreProgression.map((score, idx) => (
                <circle
                  key={idx}
                  cx={(idx / (data.scoreProgression.length - 1)) * 800}
                  cy={200 - (score * 2)}
                  r="5"
                  fill="#8b5cf6"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Oldest</span>
            <span>Most Recent</span>
          </div>
        </div>
      )}

      {/* Topic Performance */}
      {data.topicPerformance && data.topicPerformance.length > 0 && (
        <div className="topic-performance mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">📚 Topic Performance</h4>
          <div className="space-y-3">
            {data.topicPerformance.map((topic, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{topic.topicName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-purple-600">{topic.averageScore}%</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTrendColor(topic.trend)}`}>
                      {topic.trend}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{topic.assessmentCount} assessments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Efficiency & Retry Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {data.timeEfficiency && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg">
            <h4 className="text-md font-semibold text-gray-800 mb-3">⏱️ Time Efficiency</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Completion Time</span>
                <span className="font-bold text-green-700">{data.timeEfficiency.averageCompletionTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Efficiency Ratio</span>
                <span className="font-bold text-green-700">{data.timeEfficiency.timeEfficiencyRatio}</span>
              </div>
              {data.timeEfficiency.quickestCompletion && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quickest</span>
                  <span className="font-bold text-green-700">{data.timeEfficiency.quickestCompletion} min</span>
                </div>
              )}
            </div>
          </div>
        )}

        {data.retryPatterns && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg">
            <h4 className="text-md font-semibold text-gray-800 mb-3">🔄 Retry Patterns</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Retry Rate</span>
                <span className="font-bold text-orange-700">{data.retryPatterns.retryRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Retry Success Rate</span>
                <span className="font-bold text-orange-700">{data.retryPatterns.retrySuccessRate}%</span>
              </div>
              {data.retryPatterns.averageAttemptsToPass && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Attempts to Pass</span>
                  <span className="font-bold text-orange-700">{data.retryPatterns.averageAttemptsToPass}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Predictions */}
      {data.predictions && (
        <div className="predictions bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">🔮 Predictive Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Projected Next Score</p>
              <p className="text-4xl font-bold text-purple-700">{data.predictions.projectedNextScore}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Risk Level</p>
              <p className={`text-3xl font-bold capitalize ${getRiskColor(data.predictions.riskLevel)}`}>
                {data.predictions.riskLevel}
              </p>
            </div>
            {data.predictions.recommendedStudyTime && (
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Recommended Study</p>
                <p className="text-4xl font-bold text-purple-700">{data.predictions.recommendedStudyTime}h</p>
                <p className="text-xs text-gray-500 mt-1">per week</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

PerformanceAnalytics.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    overview: PropTypes.object,
    scoreProgression: PropTypes.arrayOf(PropTypes.number),
    topicPerformance: PropTypes.arrayOf(PropTypes.object),
    timeEfficiency: PropTypes.object,
    retryPatterns: PropTypes.object,
    predictions: PropTypes.object
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.object
}

export default PerformanceAnalytics

