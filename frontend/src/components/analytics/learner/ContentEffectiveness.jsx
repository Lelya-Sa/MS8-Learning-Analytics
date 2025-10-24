/**
 * AS-001 #6: Course & Content Effectiveness Component
 * Displays content performance by type with insights
 */

import React from 'react'
import PropTypes from 'prop-types'
import { useLearnerContentEffectiveness } from '../../../hooks/useAnalytics'

const ContentEffectiveness = ({ userId, data: propData, isLoading: propIsLoading, error: propError }) => {
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useLearnerContentEffectiveness(userId)
  
  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult.data?.data
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading
  const error = propError || hookResult.error
  // Loading state
  if (isLoading) {
    return <div className="content-effectiveness-card animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-40 bg-gray-200 rounded mb-4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  }

  // Error state
  if (error) {
    return <div className="content-effectiveness-card bg-red-50 border border-red-200 p-6 rounded-lg">
      <p className="text-red-700">Error loading content effectiveness: {error.message}</p>
    </div>
  }

  // No data state
  if (!data) {
    return <div className="content-effectiveness-card bg-gray-50 p-6 rounded-lg">
      <p className="text-gray-600">No content effectiveness data available</p>
    </div>
  }

  // Content type icons
  const getContentIcon = (type) => {
    const icons = {
      video: '🎥',
      article: '📄',
      interactive: '🎮',
      quiz: '📝',
      podcast: '🎧'
    }
    return icons[type] || '📚'
  }

  // Content type colors
  const getContentColor = (type) => {
    const colors = {
      video: 'from-red-50 to-red-100 border-red-200',
      article: 'from-blue-50 to-blue-100 border-blue-200',
      interactive: 'from-purple-50 to-purple-100 border-purple-200',
      quiz: 'from-green-50 to-green-100 border-green-200',
      podcast: 'from-orange-50 to-orange-100 border-orange-200'
    }
    return colors[type] || 'from-gray-50 to-gray-100 border-gray-200'
  }

  return (
    <div className="content-effectiveness-card bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Course & Content Effectiveness</h3>
        {data.dateRange && (
          <p className="text-sm text-gray-600">
            Analyzing content performance from {new Date(data.dateRange.start).toLocaleDateString()} to {new Date(data.dateRange.end).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Effectiveness by Type */}
      {data.effectivenessByType && data.effectivenessByType.length > 0 && (
        <div className="effectiveness-by-type mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Effectiveness by Content Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.effectivenessByType.map((item, idx) => (
              <div key={idx} className={`content-type-card bg-gradient-to-br ${getContentColor(item.type)} border-2 p-5 rounded-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{getContentIcon(item.type)}</span>
                    <span className="font-semibold text-gray-800 capitalize">{item.type}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{item.avgScore}</span>
                </div>
                <div className="relative w-full h-4 bg-white rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-600 transition-all duration-500"
                    style={{ width: `${item.avgScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{item.count} items completed</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement to Score Correlation */}
      {data.engagementToScoreCorrelation !== undefined && (
        <div className="correlation bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">🔗 Engagement-Score Correlation</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Your engagement level correlates with your assessment scores
              </p>
              <div className="relative w-full h-6 bg-white rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-blue-600"
                  style={{ width: `${data.engagementToScoreCorrelation * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-md">
                    {(data.engagementToScoreCorrelation * 100).toFixed(1)}% correlation
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-700">{(data.engagementToScoreCorrelation * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Content */}
      {data.topContent && data.topContent.length > 0 && (
        <div className="top-content mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">⭐ Top Performing Content</h4>
          <div className="space-y-3">
            {data.topContent.map((content, idx) => (
              <div key={idx} className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getContentIcon(content.type)}</span>
                      <h5 className="font-semibold text-gray-800">{content.title}</h5>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Score: {content.score}%</span>
                      {content.completionRate && <span>Completion: {content.completionRate}%</span>}
                      {content.timeSpent && <span>Time: {content.timeSpent}h</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-green-700">{content.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Content */}
      {data.lowContent && data.lowContent.length > 0 && (
        <div className="low-content mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">📉 Content Needing Improvement</h4>
          <div className="space-y-3">
            {data.lowContent.map((content, idx) => (
              <div key={idx} className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getContentIcon(content.type)}</span>
                      <h5 className="font-semibold text-gray-800">{content.title}</h5>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Score: {content.score}%</span>
                      {content.completionRate && <span>Completion: {content.completionRate}%</span>}
                      {content.timeSpent && <span>Time: {content.timeSpent}h</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-orange-700">{content.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <div className="insights bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">💡 Actionable Insights</h4>
          <ul className="space-y-2">
            {data.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start bg-white p-3 rounded-lg border border-purple-200">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content Effectiveness Chart */}
      {data.effectivenessByType && data.effectivenessByType.length > 0 && (
        <div className="content-effectiveness-chart mt-6 bg-gray-50 p-5 rounded-lg">
          <h4 className="text-md font-semibold text-gray-700 mb-4">📈 Comparative View</h4>
          <div className="space-y-3">
            {data.effectivenessByType.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-700 capitalize flex items-center gap-2">
                    <span>{getContentIcon(item.type)}</span>
                    {item.type}
                  </span>
                  <span className="font-bold text-gray-800">{item.avgScore}%</span>
                </div>
                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-pink-600 transition-all duration-500"
                    style={{ width: `${item.avgScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

ContentEffectiveness.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    scope: PropTypes.string,
    dateRange: PropTypes.object,
    effectivenessByType: PropTypes.arrayOf(PropTypes.object),
    engagementToScoreCorrelation: PropTypes.number,
    topContent: PropTypes.arrayOf(PropTypes.object),
    lowContent: PropTypes.arrayOf(PropTypes.object),
    insights: PropTypes.arrayOf(PropTypes.string)
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.object
}

export default ContentEffectiveness

