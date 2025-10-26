import React from 'react';
import PropTypes from 'prop-types';
import { useStrategicAlignment } from '../../../../application/hooks/useAnalytics';
import StatCard from '../../common/StatCard';
import GradientSection from '../../common/GradientSection';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';

/**
 * StrategicAlignmentCard component displays strategic alignment analytics for organizations.
 *
 * Features:
 * - Overall alignment score and grade
 * - Strategic goals tracking with status indicators
 * - Gap analysis with critical, medium, and low priority gaps
 * - Top missing skills with priority levels
 * - Recommendations for each strategic goal
 * - Employee tracking information
 * - Loading, error, and no data states
 * - Accessibility compliant
 *
 * @param {Object} props - Component props
 * @param {string} props.organizationId - ID of the organization
 * @param {Object} [props.data] - Strategic alignment data (for testing/mocking)
 * @param {boolean} [props.isLoading] - Loading state (for testing/mocking)
 * @param {Object} [props.error] - Error object (for testing/mocking)
 * @param {Function} [props.onRetry] - Function to retry data fetching on error
 * @returns {React.ReactNode} Strategic alignment card component
 */
export const StrategicAlignmentCard = ({ organizationId, data: propData, isLoading: propIsLoading, error: propError, onRetry }) => {
  const hookResult = useStrategicAlignment(organizationId);

  const data = propData || hookResult.data?.data?.strategicAlignment;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading;
  const error = propError || hookResult.error;

  const className = "bg-white rounded-lg shadow-md p-6"; // Define a base class name

  if (isLoading) {
    return (
      <div className={`strategic-alignment-card ${className}`} data-testid="loading-spinner">
        <div className="card-content">
          <Spinner />
          <p className="text-center text-gray-500 mt-4">Loading strategic alignment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`strategic-alignment-card ${className}`} data-testid="error-message">
        <div className="card-content">
          <div className="text-center text-red-500">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h4 className="font-semibold">Error: {error.message || 'Failed to load data'}</h4>
              </div>
            </div>
            {onRetry && (
              <Button onClick={onRetry} className="mt-4">
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`strategic-alignment-card ${className}`} data-testid="no-data-message">
        <div className="card-header">
          <h3 id="strategic-alignment-title">Strategic Alignment Tracking</h3>
        </div>
        <div className="card-content text-center text-gray-500">
          <span className="text-4xl">🎯</span>
          <p className="mt-2">No strategic alignment data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="strategic-alignment-card bg-white rounded-lg shadow-md p-6" data-testid="strategic-alignment-card" role="region" aria-labelledby="strategic-alignment-title">
      <div className="card-header">
        <h3 id="strategic-alignment-title" className="text-2xl font-bold text-gray-900">Strategic Alignment Tracking</h3>
        <div className="staleness-indicator">
          {data.staleness ? data.staleness.charAt(0).toUpperCase() + data.staleness.slice(1) : 'Fresh'}
        </div>
        <p className="text-gray-600 mt-1">Period: {data.period}</p>
      </div>

      <div className="card-content space-y-6">
        {/* Overall Alignment Score */}
        <GradientSection title="Overall Alignment" icon="🎯" gradient="blue" className="overall-alignment-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <StatCard label="Overall Score" value={data.overallAlignment ?? 0} icon="📊" bgColor="bg-blue-50" textColor="text-blue-700" />
            <StatCard label="Alignment Grade" value={data.alignmentGrade ?? 'N/A'} icon="🏆" bgColor="bg-indigo-50" textColor="text-indigo-700" />
          </div>
        </GradientSection>

        {/* Strategic Goals */}
        {data.strategicGoals && data.strategicGoals.length > 0 && (
          <GradientSection title="Strategic Goals" icon="🎯" gradient="emerald" className="strategic-goals-section">
            <div className="space-y-4">
              {data.strategicGoals.map((goal) => (
                <div key={goal.goalId} className="border-2 border-gray-200 rounded-lg p-5 hover:border-emerald-400 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-800">{goal.goalName}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      goal.status === 'on_track' ? 'bg-green-100 text-green-800' : 
                      goal.status === 'at_risk' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {goal.status ? goal.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <StatCard label="Alignment Score" value={goal.alignmentScore ?? 0} icon="📈" bgColor="bg-blue-50" textColor="text-blue-700" />
                    <StatCard label="Progress" value={`${goal.progress ?? 0}%`} icon="📊" bgColor="bg-green-50" textColor="text-green-700" />
                    <StatCard label="Skills Covered" value={`${goal.skillsCovered ?? 0}%`} icon="🎯" bgColor="bg-purple-50" textColor="text-purple-700" />
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
                          <li key={idx} className="text-sm text-gray-600">
                            {typeof rec === 'string' ? rec : `${rec.action}: ${rec.priority} priority`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GradientSection>
        )}

        {/* Gap Analysis */}
        {data.gapAnalysis && (
          <GradientSection title="Gap Analysis" icon="🔍" gradient="purple" className="gap-analysis-section">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard label="Critical Gaps" value={data.gapAnalysis.criticalGaps ?? 0} icon="🚨" bgColor="bg-red-50" textColor="text-red-700" />
              <StatCard label="Medium Gaps" value={data.gapAnalysis.mediumGaps ?? 0} icon="⚠️" bgColor="bg-yellow-50" textColor="text-yellow-700" />
              <StatCard label="Low Priority Gaps" value={data.gapAnalysis.lowGaps ?? 0} icon="ℹ️" bgColor="bg-green-50" textColor="text-green-700" />
            </div>

            {data.gapAnalysis.topMissingSkills && data.gapAnalysis.topMissingSkills.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">🚨 Top Missing Skills</h4>
                <div className="space-y-2">
                  {data.gapAnalysis.topMissingSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          skill.priority === 'critical' ? 'bg-red-200 text-red-800' :
                          skill.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                          skill.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
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
          </GradientSection>
        )}

        {data.lastUpdated && (
          <div className="last-updated text-sm text-gray-500 mt-6 text-right">
            <span className="updated-label">Last updated:</span>{' '}
            <span className="updated-time">
              {new Date(data.lastUpdated).toLocaleDateString('en-GB')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

StrategicAlignmentCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onRetry: PropTypes.func,
};
