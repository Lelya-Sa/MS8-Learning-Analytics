/**
 * AS-001 #2: Skill Gap Matrix with Prioritization Component
 * Displays prioritized skill gaps with action plans
 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useLearnerSkillGaps } from '../../../hooks/useAnalytics'

const SkillGapMatrix = ({ userId, data: propData, isLoading: propIsLoading, error: propError }) => {
  const [expandedGap, setExpandedGap] = useState(null)
  
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useLearnerSkillGaps(userId)
  
  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult.data?.data?.skillGapMatrix
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading
  const error = propError || hookResult.error

  // Loading state
  if (isLoading) {
    return (
      <div className="skill-gap-matrix-card animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="skill-gap-matrix-card bg-red-50 border border-red-200 p-6 rounded-lg">
        <p className="text-red-700">Error loading skill gaps: {error.message}</p>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="skill-gap-matrix-card bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600">No skill gap data available</p>
      </div>
    )
  }

  const { summary, prioritizedGaps, skillsOnTrack, skillsAchieved } = data

  // Priority badge color
  const getPriorityColor = (rank) => {
    if (rank === 1) return 'bg-red-100 text-red-800 border-red-300'
    if (rank === 2) return 'bg-orange-100 text-orange-800 border-orange-300'
    if (rank === 3) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-blue-100 text-blue-800 border-blue-300'
  }

  // Business priority badge
  const getBusinessPriorityBadge = (priority) => {
    const badges = {
      critical: 'bg-red-600 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-blue-500 text-white'
    }
    return badges[priority] || 'bg-gray-500 text-white'
  }

  return (
    <div className="skill-gap-matrix-card bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Skill Gap Matrix & Prioritization</h3>
        <p className="text-sm text-gray-600">Identify and close your most important skill gaps</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="summary-card bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Total Skills</p>
          <p className="text-3xl font-bold text-blue-700">{summary.totalTargetSkills}</p>
        </div>
        <div className="summary-card bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Acquired</p>
          <p className="text-3xl font-bold text-green-700">{summary.skillsAcquired}</p>
        </div>
        <div className="summary-card bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-yellow-700">{summary.skillsInProgress}</p>
        </div>
        <div className="summary-card bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Not Started</p>
          <p className="text-3xl font-bold text-gray-700">{summary.skillsNotStarted}</p>
        </div>
        <div className="summary-card bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Critical Gaps</p>
          <p className="text-3xl font-bold text-red-700">{summary.criticalGaps}</p>
        </div>
      </div>

      {/* Prioritized Gaps */}
      <div className="prioritized-gaps mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Prioritized Skill Gaps</h4>
        <div className="space-y-4">
          {prioritizedGaps && prioritizedGaps.map((gap) => (
            <div
              key={gap.skillId}
              className="gap-card bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              {/* Gap Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(gap.priorityRank)}`}>
                      Priority: {gap.priorityRank}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBusinessPriorityBadge(gap.factors.businessPriority)}`}>
                      {gap.factors.businessPriority.toUpperCase()}
                    </span>
                  </div>
                  <h5 className="text-xl font-bold text-gray-800">{gap.skillName}</h5>
                  {gap.factors.businessJustification && (
                    <p className="text-sm text-gray-600 mt-1 italic">"{gap.factors.businessJustification}"</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">{gap.priorityScore}</p>
                  <p className="text-xs text-gray-500">Priority Score</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Current: {gap.currentLevel}%</span>
                  <span className="text-gray-600">Target: {gap.targetLevel}%</span>
                </div>
                <div className="skill-progress-bar relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                    style={{ width: `${gap.currentLevel}%` }}
                  ></div>
                  <div
                    className="absolute top-0 h-full border-r-4 border-dashed border-green-500"
                    style={{ left: `${gap.targetLevel}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-md">
                      Gap: {gap.gap}% ({gap.gapPercentage ? gap.gapPercentage.toFixed(1) : gap.gap}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Factors */}
              <div className="factors grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div className="factor-item bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Market Demand</p>
                  <p className="text-lg font-bold text-blue-700">{gap.factors.marketDemand}%</p>
                </div>
                {gap.factors.salaryImpact && (
                  <div className="factor-item bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Salary Impact</p>
                    <p className="text-lg font-bold text-green-700">+{gap.factors.salaryImpact}%</p>
                  </div>
                )}
                {gap.factors.blockedSkills > 0 && (
                  <div className="factor-item bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Blocks</p>
                    <p className="text-lg font-bold text-red-700">{gap.factors.blockedSkills} skills</p>
                  </div>
                )}
              </div>

              {/* Action Plan Toggle */}
              <button
                onClick={() => setExpandedGap(expandedGap === gap.skillId ? null : gap.skillId)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                {expandedGap === gap.skillId ? '▲ Hide Action Plan' : '▼ View Action Plan'}
              </button>

              {/* Expanded Action Plan */}
              {expandedGap === gap.skillId && gap.actionPlan && (
                <div className="action-plan mt-4 bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border-2 border-purple-200">
                  <h6 className="text-lg font-bold text-gray-800 mb-3">📋 Action Plan</h6>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Estimated Time to Close</p>
                    <p className="text-xl font-bold text-purple-700">{gap.actionPlan.estimatedTimeToClose}</p>
                    <p className="text-sm text-gray-600">({gap.actionPlan.estimatedHours} hours)</p>
                  </div>

                  {gap.actionPlan.recommendedPath && gap.actionPlan.recommendedPath.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Recommended Learning Path:</p>
                      <div className="space-y-2">
                        {gap.actionPlan.recommendedPath.map((step) => (
                          <div key={step.step} className="flex items-start bg-white p-3 rounded-lg border border-purple-200">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{step.courseName}</p>
                              <p className="text-xs text-gray-600">{step.duration} • +{step.skillGain}% skill gain</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {gap.actionPlan.practices && gap.actionPlan.practices.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Practice Activities:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {gap.actionPlan.practices.map((practice, idx) => (
                          <li key={idx} className="text-sm text-gray-700">{practice}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {gap.actionPlan.nextMilestone && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
                      <p className="text-sm font-semibold text-yellow-800">Next Milestone:</p>
                      <p className="text-sm text-yellow-700">{gap.actionPlan.nextMilestone}</p>
                      {gap.actionPlan.deadline && (
                        <p className="text-xs text-yellow-600 mt-1">Deadline: {new Date(gap.actionPlan.deadline).toLocaleDateString()}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skills On Track */}
      {skillsOnTrack && skillsOnTrack.length > 0 && (
        <div className="skills-on-track mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">✅ Skills On Track</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skillsOnTrack.map((skill, idx) => (
              <div key={idx} className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <p className="font-semibold text-gray-800">{skill.skillName}</p>
                <p className="text-sm text-gray-600">Current: {skill.currentLevel}% → Target: {skill.targetLevel}%</p>
                <p className="text-xs text-green-700 mt-1">Est. completion: {skill.estimatedCompletion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Achieved */}
      {skillsAchieved && skillsAchieved.length > 0 && (
        <div className="skills-achieved">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">🏆 Skills Achieved</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {skillsAchieved.map((skill, idx) => (
              <div key={idx} className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-300 p-3 rounded-lg">
                <p className="font-semibold text-gray-800">{skill.skillName}</p>
                <p className="text-sm text-gray-600">Achieved: {skill.achievedLevel}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(skill.achievedDate).toLocaleDateString()} ({skill.daysToAchieve} days)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

SkillGapMatrix.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    summary: PropTypes.shape({
      totalTargetSkills: PropTypes.number,
      skillsAcquired: PropTypes.number,
      skillsInProgress: PropTypes.number,
      skillsNotStarted: PropTypes.number,
      averageGap: PropTypes.number,
      criticalGaps: PropTypes.number
    }),
    prioritizedGaps: PropTypes.arrayOf(PropTypes.object),
    skillsOnTrack: PropTypes.arrayOf(PropTypes.object),
    skillsAchieved: PropTypes.arrayOf(PropTypes.object)
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.object
}

export default SkillGapMatrix

