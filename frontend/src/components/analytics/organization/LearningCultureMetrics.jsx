import React from 'react';
import PropTypes from 'prop-types';
import { useLearningCulture } from '../../../hooks/useAnalytics';

const LearningCultureMetrics = ({ organizationId }) => {
  const { data, error, isLoading } = useLearningCulture(organizationId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-teal-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-teal-100 rounded w-1/2"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading learning culture data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Error Loading Data</h3>
        <p className="text-red-600">Failed to load learning culture data. Please try again later.</p>
      </div>
    );
  }

  if (!data || !data.data || !data.data.learningCulture) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">No learning culture data available</p>
      </div>
    );
  }

  const culture = data.data.learningCulture;
  const { overallCultureScore, cultureGrade, metrics, culturalIndicators, benchmarks, recommendations } = culture;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-cyan-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">🌟 Learning Culture Metrics</h2>
        <div className="flex items-center gap-4 mt-4">
          <div className="bg-white text-teal-700 rounded-lg px-6 py-3 shadow-lg">
            <div className="text-4xl font-bold">{overallCultureScore}</div>
            <div className="text-sm">Culture Score</div>
          </div>
          <div className="bg-white text-cyan-700 rounded-lg px-6 py-3 shadow-lg">
            <div className="text-2xl font-bold">{cultureGrade}</div>
            <div className="text-sm">Grade</div>
          </div>
        </div>
      </div>

      {/* Culture Metrics */}
      {metrics && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Culture Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Engagement */}
            {metrics.learningEngagement && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-2 border-blue-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">💡 Learning Engagement</h4>
                <div className="text-4xl font-bold text-blue-700 mb-3">{metrics.learningEngagement.score}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Participation:</span>
                    <span className="font-semibold text-gray-800">{metrics.learningEngagement.activeParticipation}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Voluntary Learning:</span>
                    <span className="font-semibold text-gray-800">{metrics.learningEngagement.voluntaryLearning}%</span>
                  </div>
                  {metrics.learningEngagement.peerCollaboration && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Peer Collaboration:</span>
                      <span className="font-semibold text-gray-800">{metrics.learningEngagement.peerCollaboration}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Knowledge Sharing */}
            {metrics.knowledgeSharing && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border-2 border-green-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">🤝 Knowledge Sharing</h4>
                <div className="text-4xl font-bold text-green-700 mb-3">{metrics.knowledgeSharing.score}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mentorship Programs:</span>
                    <span className="font-semibold text-gray-800">{metrics.knowledgeSharing.mentorshipPrograms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Mentors:</span>
                    <span className="font-semibold text-gray-800">{metrics.knowledgeSharing.activeMentors}</span>
                  </div>
                  {metrics.knowledgeSharing.knowledgeBaseSessions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">KB Sessions:</span>
                      <span className="font-semibold text-gray-800">{metrics.knowledgeSharing.knowledgeBaseSessions}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Innovation Metrics */}
            {metrics.innovationMetrics && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border-2 border-purple-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">💡 Innovation</h4>
                <div className="text-4xl font-bold text-purple-700 mb-3">{metrics.innovationMetrics.score}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ideas Submitted:</span>
                    <span className="font-semibold text-gray-800">{metrics.innovationMetrics.newIdeasSubmitted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ideas Implemented:</span>
                    <span className="font-semibold text-gray-800">{metrics.innovationMetrics.ideasImplemented}</span>
                  </div>
                  {metrics.innovationMetrics.innovationProjects && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Innovation Projects:</span>
                      <span className="font-semibold text-gray-800">{metrics.innovationMetrics.innovationProjects}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Continuous Improvement */}
            {metrics.continuousImprovement && (
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border-2 border-yellow-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">🔄 Continuous Improvement</h4>
                <div className="text-4xl font-bold text-yellow-700 mb-3">{metrics.continuousImprovement.score}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Feedback Loops:</span>
                    <span className="font-semibold text-gray-800">{metrics.continuousImprovement.feedbackLoops}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Trend:</span>
                    <span className="font-semibold text-gray-800">{metrics.continuousImprovement.courseCompletionTrend}</span>
                  </div>
                  {metrics.continuousImprovement.skillApplicationRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Skill Application:</span>
                      <span className="font-semibold text-gray-800">{metrics.continuousImprovement.skillApplicationRate}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cultural Indicators */}
      {culturalIndicators && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Cultural Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {culturalIndicators.managerSupport && (
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-700">{culturalIndicators.managerSupport}</div>
                <div className="text-xs text-gray-600 mt-1">Manager Support</div>
              </div>
            )}
            {culturalIndicators.learningTimeAllocation && (
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-700">{culturalIndicators.learningTimeAllocation}</div>
                <div className="text-xs text-gray-600 mt-1">Learning Time</div>
              </div>
            )}
            {culturalIndicators.recognitionPrograms && (
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-700">{culturalIndicators.recognitionPrograms}</div>
                <div className="text-xs text-gray-600 mt-1">Recognition</div>
              </div>
            )}
            {culturalIndicators.careerDevelopmentOpportunities && (
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700">{culturalIndicators.careerDevelopmentOpportunities}</div>
                <div className="text-xs text-gray-600 mt-1">Career Development</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Benchmarks */}
      {benchmarks && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-cyan-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📈 Industry Benchmarks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-gray-700">{benchmarks.industryAverage}</div>
              <div className="text-sm text-gray-600">Industry Average</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-green-700">{benchmarks.vsIndustry}</div>
              <div className="text-sm text-gray-600">vs. Industry</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-lg font-semibold text-cyan-700">{benchmarks.standing}</div>
              <div className="text-sm text-gray-600">Standing</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg shadow-lg p-6 border-2 border-emerald-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                <span className="text-emerald-600 font-bold text-lg">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

LearningCultureMetrics.propTypes = {
  organizationId: PropTypes.string.isRequired
};

export default LearningCultureMetrics;
