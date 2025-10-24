/**
 * AS-001 #4: Mastery Progress Tracking Component
 * Displays topic-level mastery with milestones and recommendations
 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'

const MasteryProgress = ({ userId, data, isLoading = false, error = null }) => {
  const [expandedTopic, setExpandedTopic] = useState(null)

  // Loading state
  if (isLoading) {
    return <div className="mastery-progress-card animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-32 bg-gray-200 rounded mb-4"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  }

  // Error state
  if (error) {
    return <div className="mastery-progress-card bg-red-50 border border-red-200 p-6 rounded-lg">
      <p className="text-red-700">Error loading mastery data: {error.message}</p>
    </div>
  }

  // No data state
  if (!data) {
    return <div className="mastery-progress-card bg-gray-50 p-6 rounded-lg">
      <p className="text-gray-600">No mastery data available</p>
    </div>
  }

  const getMasteryColor = (level) => {
    if (level >= 86) return 'text-purple-600 bg-purple-100'
    if (level >= 61) return 'text-green-600 bg-green-100'
    if (level >= 31) return 'text-blue-600 bg-blue-100'
    return 'text-orange-600 bg-orange-100'
  }

  return (
    <div className="mastery-progress-card bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Mastery Progress Tracking</h3>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Mastered</p>
          <p className="text-3xl font-bold text-purple-700">{data.summary.topicsMastered}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-700">{data.summary.topicsInProgress}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Not Started</p>
          <p className="text-3xl font-bold text-gray-700">{data.summary.topicsNotStarted}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Overall Score</p>
          <p className="text-3xl font-bold text-green-700">{data.summary.overallMasteryScore}</p>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="space-y-4">
        {data.topicBreakdown && data.topicBreakdown.map((topic) => (
          <div key={topic.topicId} className="topic-card bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h5 className="text-xl font-bold text-gray-800 mb-2">{topic.topicName}</h5>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMasteryColor(topic.masteryLevel)}`}>
                    {topic.masteryGrade}
                  </span>
                  <span className="text-sm text-gray-600">Success Rate: {topic.successRate}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-purple-600">{topic.masteryLevel}</p>
                <p className="text-xs text-gray-500">Mastery Level</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                  style={{ width: `${topic.masteryLevel}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white drop-shadow-md">
                    {topic.practiceAttempts} attempts • {topic.successRate}% success
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">Avg Score</p>
                <p className="text-lg font-bold text-blue-700">{topic.averageScore}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">Time Spent</p>
                <p className="text-lg font-bold text-green-700">{topic.timeSpent}h</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">Retention</p>
                <p className="text-lg font-bold text-purple-700">{topic.retentionScore}%</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">Time to Master</p>
                <p className="text-lg font-bold text-orange-700">{topic.timeToMastery}</p>
              </div>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setExpandedTopic(expandedTopic === topic.topicId ? null : topic.topicId)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {expandedTopic === topic.topicId ? '▲ Hide Details' : '▼ View Details'}
            </button>

            {/* Expanded Details */}
            {expandedTopic === topic.topicId && (
              <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border-2 border-purple-200">
                {/* Milestones */}
                {topic.milestones && topic.milestones.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-sm font-semibold text-gray-700 mb-2">🏆 Milestones Achieved:</h6>
                    <div className="space-y-2">
                      {topic.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center bg-white p-3 rounded-lg border border-purple-200">
                          <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                            {milestone.level}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{milestone.milestone}</p>
                            {milestone.achievedAt && (
                              <p className="text-xs text-gray-600">{new Date(milestone.achievedAt).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strength Areas */}
                {topic.strengthAreas && topic.strengthAreas.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-sm font-semibold text-gray-700 mb-2">💪 Strength Areas:</h6>
                    <div className="flex flex-wrap gap-2">
                      {topic.strengthAreas.map((area, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          ✓ {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Areas */}
                {topic.improvementAreas && topic.improvementAreas.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-sm font-semibold text-gray-700 mb-2">📈 Areas for Improvement:</h6>
                    <div className="flex flex-wrap gap-2">
                      {topic.improvementAreas.map((area, idx) => (
                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                          → {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {topic.recommendations && topic.recommendations.length > 0 && (
                  <div>
                    <h6 className="text-sm font-semibold text-gray-700 mb-2">💡 Recommendations:</h6>
                    <ul className="space-y-1">
                      {topic.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-700 bg-white p-2 rounded flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

MasteryProgress.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    summary: PropTypes.object,
    topicBreakdown: PropTypes.arrayOf(PropTypes.object)
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.object
}

export default MasteryProgress

