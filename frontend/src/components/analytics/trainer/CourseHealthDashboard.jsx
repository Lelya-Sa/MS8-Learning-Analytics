import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTrainerCourseHealth } from '../../../hooks/useAnalytics';
import GradientSection from '../../common/GradientSection';
import StatCard from '../../common/StatCard';

const CourseHealthDashboard = ({ trainerId, courseId, data: propData, isLoading: propIsLoading, error: propError }) => {
  const [expandedDropOff, setExpandedDropOff] = useState(null);
  
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useTrainerCourseHealth(trainerId, courseId);
  
  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult.data?.data?.courseHealth;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading;
  const error = propError || hookResult.error;

  if (isLoading) {
    return (
      <div className="course-health-dashboard animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-health-dashboard bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center text-red-600">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold">Error loading course health</h3>
            <p className="text-sm">{error.message || 'Failed to fetch course health data'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="course-health-dashboard bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <span className="text-4xl">📊</span>
        <p className="mt-2 text-gray-600">No course health data available</p>
      </div>
    );
  }

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-100 text-red-800';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="course-health-dashboard space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{data.courseName}</h2>
          <div className="flex items-center mt-2 space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(data.healthScore)}`}>
              {data.overallHealth.toUpperCase()}
            </span>
            <span className="text-gray-600">
              Health Score: <span className="font-bold text-gray-900">{data.healthScore}</span>/100
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Enrollments"
          value={data.metrics.enrollments.total}
          trend={data.metrics.enrollments.trend}
          icon="👥"
          color="emerald"
        />
        <StatCard
          label="Active Students"
          value={data.metrics.enrollments.active}
          subtitle={`${data.metrics.enrollments.comparisonToAverage} vs average`}
          icon="✓"
          color="blue"
        />
        <StatCard
          label="Completion Rate"
          value={`${data.metrics.completion.rate}%`}
          trend={data.metrics.completion.variance}
          subtitle={`Target: ${data.metrics.completion.target}%`}
          icon="🎯"
          color={data.metrics.completion.rate >= data.metrics.completion.target ? 'green' : 'yellow'}
        />
      </div>

      {/* Satisfaction Metrics */}
      <GradientSection title="Student Satisfaction" icon="⭐" gradient="from-purple-50 to-pink-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{data.metrics.satisfaction.averageRating}</div>
            <div className="text-sm text-gray-600 mt-1">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{data.metrics.satisfaction.totalReviews}</div>
            <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{data.metrics.satisfaction.nps}</div>
            <div className="text-sm text-gray-600 mt-1">NPS Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600">{data.metrics.satisfaction.satisfactionScore}</div>
            <div className="text-sm text-gray-600 mt-1">Satisfaction Score</div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          {data.metrics.satisfaction.ratingTrend}
        </div>
      </GradientSection>

      {/* Drop-off Analysis */}
      <GradientSection title="Drop-off Analysis" icon="⚠️" gradient="from-orange-50 to-red-50">
        <div className="mb-4">
          <div className="text-2xl font-bold text-orange-600">{data.dropOffAnalysis.overallDropOffRate}%</div>
          <div className="text-sm text-gray-600">Overall Drop-off Rate</div>
        </div>
        
        <div className="space-y-4">
          {data.dropOffAnalysis.dropOffPoints.map((dropOff, index) => (
            <div key={index} className="bg-white border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedDropOff(expandedDropOff === index ? null : index)}>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(dropOff.priority)}`}>
                      {dropOff.priority.toUpperCase()}
                    </span>
                    <h4 className="font-semibold text-gray-900">{dropOff.moduleName}</h4>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-red-600">{dropOff.dropOffRate}%</span> drop-off rate •{' '}
                    <span className="font-medium">{dropOff.studentsDropped}</span> students dropped
                  </div>
                </div>
                <span className="text-gray-400">{expandedDropOff === index ? '▼' : '▶'}</span>
              </div>
              
              {expandedDropOff === index && (
                <div className="mt-4 pt-4 border-t border-orange-100">
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Likely Reasons:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {dropOff.likelyReasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Recommended Actions:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {dropOff.recommendedActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </GradientSection>

      {/* Content Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Struggling Topics */}
        <GradientSection title="Struggling Topics" icon="📉" gradient="from-red-50 to-orange-50">
          <div className="space-y-3">
            {data.contentPerformance.strugglingTopics.map((topic, index) => (
              <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{topic.topic}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Avg Score:</span>
                    <span className="ml-2 font-medium text-red-600">{topic.averageScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pass Rate:</span>
                    <span className="ml-2 font-medium">{topic.passRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Attempts:</span>
                    <span className="ml-2 font-medium">{topic.averageAttempts}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 italic">"{topic.studentFeedback}"</div>
              </div>
            ))}
          </div>
        </GradientSection>

        {/* High Performance Topics */}
        <GradientSection title="High Performance Topics" icon="📈" gradient="from-green-50 to-emerald-50">
          <div className="space-y-3">
            {data.contentPerformance.highPerformanceTopics.map((topic, index) => (
              <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{topic.topic}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Avg Score:</span>
                    <span className="ml-2 font-medium text-green-600">{topic.averageScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pass Rate:</span>
                    <span className="ml-2 font-medium">{topic.passRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Attempts:</span>
                    <span className="ml-2 font-medium">{topic.averageAttempts}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 italic">"{topic.studentFeedback}"</div>
              </div>
            ))}
          </div>
        </GradientSection>
      </div>

      {/* Recommendations */}
      <GradientSection title="Recommendations" icon="💡" gradient="from-blue-50 to-indigo-50">
        <div className="space-y-3">
          {data.recommendations.map((rec, index) => (
            <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{rec.type.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <p className="text-gray-900 font-medium">{rec.suggestion}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium text-green-600">Expected Impact:</span> {rec.expectedImpact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GradientSection>
    </div>
  );
};

CourseHealthDashboard.propTypes = {
  trainerId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default CourseHealthDashboard;
