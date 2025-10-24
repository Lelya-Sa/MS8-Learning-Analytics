import React from 'react';
import PropTypes from 'prop-types';
import { useStrategicAlignment } from '../../../hooks/useAnalytics';

const StrategicAlignmentTracking = ({ organizationId }) => {
  const { data, error, isLoading } = useStrategicAlignment(organizationId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-blue-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-blue-100 rounded w-1/2"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading strategic alignment data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Error Loading Data</h3>
        <p className="text-red-600">Failed to load strategic alignment data. Please try again later.</p>
      </div>
    );
  }

  if (!data || !data.data || !data.data.strategicAlignment) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">No strategic alignment data available</p>
      </div>
    );
  }

  const alignment = data.data.strategicAlignment;
  const { overallAlignment, alignmentGrade, strategicGoals, gapAnalysis } = alignment;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">🎯 Strategic Alignment Tracking</h2>
        <div className="flex items-center gap-4 mt-4">
          <div className="bg-white text-blue-700 rounded-lg px-6 py-3 shadow-lg">
            <div className="text-4xl font-bold">{overallAlignment}</div>
            <div className="text-sm">Overall Score</div>
          </div>
          <div className="bg-white text-indigo-700 rounded-lg px-6 py-3 shadow-lg">
            <div className="text-2xl font-bold">{alignmentGrade}</div>
            <div className="text-sm">Grade</div>
          </div>
        </div>
      </div>

      {/* Strategic Goals */}
      {strategicGoals && strategicGoals.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Strategic Goals</h3>
          <div className="space-y-4">
            {strategicGoals.map((goal) => (
              <div key={goal.goalId} className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-semibold text-gray-800">{goal.goalName}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    goal.status === 'on_track' ? 'bg-green-100 text-green-800' : 
                    goal.status === 'at_risk' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {goal.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{goal.alignmentScore}</div>
                    <div className="text-xs text-gray-500">Alignment Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{goal.progress}%</div>
                    <div className="text-xs text-gray-500">Progress</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">{goal.skillsCovered}%</div>
                    <div className="text-xs text-gray-500">Skills Covered</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>Required Skills:</strong> {goal.requiredSkills.join(', ')}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Employees:</strong> {goal.employeesOnTrack} / {goal.totalEmployeesNeeded} on track
                  </div>
                </div>

                {goal.recommendations && goal.recommendations.length > 0 && (
                  <div className="bg-blue-50 rounded p-3 mt-3">
                    <div className="text-sm font-semibold text-gray-700 mb-2">💡 Recommendations:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {goal.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gap Analysis */}
      {gapAnalysis && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🔍 Gap Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-200">
              <div className="text-3xl font-bold text-red-700">{gapAnalysis.criticalGaps}</div>
              <div className="text-sm text-gray-600 mt-1">Critical Gaps</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
              <div className="text-3xl font-bold text-yellow-700">{gapAnalysis.mediumGaps}</div>
              <div className="text-sm text-gray-600 mt-1">Medium Gaps</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
              <div className="text-3xl font-bold text-green-700">{gapAnalysis.lowGaps}</div>
              <div className="text-sm text-gray-600 mt-1">Low Priority Gaps</div>
            </div>
          </div>

          {gapAnalysis.topMissingSkills && gapAnalysis.topMissingSkills.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">🚨 Top Missing Skills</h4>
              <div className="space-y-2">
                {gapAnalysis.topMissingSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        skill.priority === 'critical' ? 'bg-red-200 text-red-800' :
                        skill.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {skill.priority.toUpperCase()}
                      </span>
                      <span className="font-semibold text-gray-800">{skill.skill}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{skill.gap}%</div>
                      <div className="text-xs text-gray-500">Gap</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

StrategicAlignmentTracking.propTypes = {
  organizationId: PropTypes.string.isRequired
};

export default StrategicAlignmentTracking;
