import React from 'react';
import PropTypes from 'prop-types';
import { useLearningCulture } from '../../../../application/hooks/useAnalytics';
import StatCard from '../../common/StatCard';
import GradientSection from '../../common/GradientSection';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';

/**
 * LearningCultureCard component displays learning culture analytics for organizations.
 *
 * Features:
 * - Overall culture score and grade
 * - Culture dimensions (Learning Engagement, Knowledge Sharing, Innovation, Continuous Improvement)
 * - Cultural indicators (Manager Support, Learning Time, Recognition, Career Development)
 * - Industry benchmarks comparison
 * - Recommendations for culture improvement
 * - Loading, error, and no data states
 * - Accessibility compliant
 *
 * @param {Object} props - Component props
 * @param {string} props.organizationId - ID of the organization
 * @param {Object} [props.data] - Learning culture data (for testing/mocking)
 * @param {boolean} [props.isLoading] - Loading state (for testing/mocking)
 * @param {Object} [props.error] - Error object (for testing/mocking)
 * @param {Function} [props.onRetry] - Function to retry data fetching on error
 * @returns {React.ReactNode} Learning culture card component
 */
export const LearningCultureCard = ({ organizationId, data: propData, isLoading: propIsLoading, error: propError, onRetry }) => {
  const hookResult = useLearningCulture(organizationId);

  const data = propData || hookResult.data?.data?.learningCulture;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading;
  const error = propError || hookResult.error;

  const className = "bg-white rounded-lg shadow-md p-6"; // Define a base class name

  if (isLoading) {
    return (
      <div className={`learning-culture-card ${className}`} data-testid="loading-spinner">
        <div className="card-content">
          <Spinner />
          <p className="text-center text-gray-500 mt-4">Loading learning culture data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`learning-culture-card ${className}`} data-testid="error-message">
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
      <div className={`learning-culture-card ${className}`} data-testid="no-data-message">
        <div className="card-header">
          <h3 id="learning-culture-title">Learning Culture Metrics</h3>
        </div>
        <div className="card-content text-center text-gray-500">
          <span className="text-4xl">🌟</span>
          <p className="mt-2">No learning culture data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-culture-card bg-white rounded-lg shadow-md p-6" data-testid="learning-culture-card" role="region" aria-labelledby="learning-culture-title">
      <div className="card-header">
        <h3 id="learning-culture-title" className="text-2xl font-bold text-gray-900">Learning Culture Metrics</h3>
        <div className="staleness-indicator">
          {data.staleness ? data.staleness.charAt(0).toUpperCase() + data.staleness.slice(1) : 'Fresh'}
        </div>
        <p className="text-gray-600 mt-1">Period: {data.period}</p>
      </div>

      <div className="card-content space-y-6">
        {/* Overall Culture Score */}
        <GradientSection title="Overall Culture Score" icon="🌟" gradient="teal" className="overall-culture-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <StatCard label="Culture Score" value={data.overallCultureScore ?? 0} icon="📊" bgColor="bg-teal-50" textColor="text-teal-700" />
            <StatCard label="Culture Grade" value={data.cultureGrade ?? 'N/A'} icon="🏆" bgColor="bg-cyan-50" textColor="text-cyan-700" />
          </div>
        </GradientSection>

        {/* Culture Dimensions */}
        {data.metrics && (
          <GradientSection title="Culture Dimensions" icon="📊" gradient="blue" className="culture-dimensions-section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learning Engagement */}
              {data.metrics.learningEngagement && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-2 border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">💡 Learning Engagement</h4>
                  <div className="text-4xl font-bold text-blue-700 mb-3">{data.metrics.learningEngagement.score}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Participation:</span>
                      <span className="font-semibold text-gray-800">{data.metrics.learningEngagement.activeParticipation}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Voluntary Learning:</span>
                      <span className="font-semibold text-gray-800">{data.metrics.learningEngagement.voluntaryLearning}%</span>
                    </div>
                    {data.metrics.learningEngagement.peerCollaboration && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Peer Collaboration:</span>
                        <span className="font-semibold text-gray-800">{data.metrics.learningEngagement.peerCollaboration}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Knowledge Sharing */}
              {data.metrics.knowledgeSharing && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border-2 border-green-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">🤝 Knowledge Sharing</h4>
                  <div className="text-4xl font-bold text-green-700 mb-3">{data.metrics.knowledgeSharing.score}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mentorship Programs:</span>
                      <span className="font-semibold text-gray-800">{data.metrics.knowledgeSharing.mentorshipPrograms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Mentors:</span>
                      <span className="font-semibold text-gray-800">{data.metrics.knowledgeSharing.activeMentors}</span>
                    </div>
                    {data.metrics.knowledgeSharing.knowledgeBaseSessions && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">KB Sessions:</span>
                        <span className="font-semibold text-gray-800">{data.metrics.knowledgeSharing.knowledgeBaseSessions}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Innovation Metrics */}
              {data.metrics.innovationMetrics && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border-2 border-purple-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">💡 Innovation</h4>
                  <div className="text-4xl font-bold text-purple-700 mb-3">{data.metrics.innovationMetrics.score}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ideas Submitted:</span>
                      <span className="font-semibold text-gray-800">{data.metrics.innovationMetrics.newIdeasSubmitted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ideas Implemented:</span>
                      <span className="font-semibold text-gray-800">{data.metrics.innovationMetrics.ideasImplemented}</span>
                    </div>
                    {data.metrics.innovationMetrics.innovationProjects && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Innovation Projects:</span>
                        <span className="font-semibold text-gray-800">{data.metrics.innovationMetrics.innovationProjects}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Continuous Improvement */}
              {data.metrics.continuousImprovement && (
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border-2 border-yellow-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">🔄 Continuous Improvement</h4>
                  <div className="text-4xl font-bold text-yellow-700 mb-3">{data.metrics.continuousImprovement.score}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Feedback Loops:</span>
                      <span className="font-semibold text-gray-800">{data.metrics.continuousImprovement.feedbackLoops}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion Trend:</span>
                      <span className="font-semibold text-gray-800">{data.metrics.continuousImprovement.courseCompletionTrend}</span>
                    </div>
                    {data.metrics.continuousImprovement.skillApplicationRate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Skill Application:</span>
                        <span className="font-semibold text-gray-800">{data.metrics.continuousImprovement.skillApplicationRate}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </GradientSection>
        )}

        {/* Cultural Indicators */}
        {data.culturalIndicators && (
          <GradientSection title="Cultural Indicators" icon="🎯" gradient="indigo" className="cultural-indicators-section">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.culturalIndicators.managerSupport && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-700">{data.culturalIndicators.managerSupport}</div>
                  <div className="text-xs text-gray-600 mt-1">Manager Support</div>
                </div>
              )}
              {data.culturalIndicators.learningTimeAllocation && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-700">{data.culturalIndicators.learningTimeAllocation}</div>
                  <div className="text-xs text-gray-600 mt-1">Learning Time</div>
                </div>
              )}
              {data.culturalIndicators.recognitionPrograms && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-700">{data.culturalIndicators.recognitionPrograms}</div>
                  <div className="text-xs text-gray-600 mt-1">Recognition</div>
                </div>
              )}
              {data.culturalIndicators.careerDevelopmentOpportunities && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-700">{data.culturalIndicators.careerDevelopmentOpportunities}</div>
                  <div className="text-xs text-gray-600 mt-1">Career Development</div>
                </div>
              )}
            </div>
          </GradientSection>
        )}

        {/* Industry Benchmarks */}
        {data.benchmarks && (
          <GradientSection title="Industry Benchmarks" icon="📈" gradient="cyan" className="benchmarks-section">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Industry Average" value={data.benchmarks.industryAverage ?? 0} icon="📊" bgColor="bg-white" textColor="text-gray-700" />
              <StatCard label="vs. Industry" value={data.benchmarks.vsIndustry ?? 'N/A'} icon="📈" bgColor="bg-white" textColor="text-green-700" />
              <StatCard label="Standing" value={data.benchmarks.standing ?? 'N/A'} icon="🏆" bgColor="bg-white" textColor="text-cyan-700" />
            </div>
          </GradientSection>
        )}

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <GradientSection title="Recommendations" icon="💡" gradient="emerald" className="recommendations-section">
            <ul className="space-y-2">
              {data.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-emerald-600 font-bold text-lg">•</span>
                  <span className="text-gray-700">
                    {typeof rec === 'string' ? rec : `${rec.action}: ${rec.priority} priority`}
                  </span>
                </li>
              ))}
            </ul>
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

LearningCultureCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onRetry: PropTypes.func,
};
