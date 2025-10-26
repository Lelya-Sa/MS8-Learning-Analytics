import React, { useState } from 'react';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';
import StatCard from '../../common/StatCard';

/**
 * CourseHealthCard component displays detailed course health analytics.
 *
 * Features:
 * - Course health score and overall health status
 * - Key metrics (enrollments, active students, completion rate)
 * - Student satisfaction metrics (rating, reviews, NPS, satisfaction score)
 * - Drop-off analysis with expandable details
 * - Content performance (struggling vs high-performing topics)
 * - Actionable recommendations with priority levels
 * - Interactive drop-off point expansion
 * - Loading and error states
 * - Accessibility compliant (WCAG 2.2 AA)
 *
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Course health data
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Course health card component
 */
export const CourseHealthCard = ({ data, isLoading, error, onRetry, className = '' }) => {
  const [expandedDropOff, setExpandedDropOff] = useState(null);

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

  const getHealthScoreClass = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className={`course-health-card ${className}`} data-testid="course-health-card">
        <div className="card-content">
          <Spinner data-testid="loading-spinner" />
          <p className="text-center text-gray-500 mt-4">Loading course health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`course-health-card ${className}`} data-testid="course-health-card">
        <div className="card-content">
          <div className="text-center text-red-500">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h4 className="font-semibold">Error: {error?.message || error?.error || String(error)}</h4>
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
      <div className={`course-health-card ${className}`} data-testid="course-health-card">
        <div className="card-content">
          <div className="text-center text-gray-500">
            <span className="text-4xl">📊</span>
            <p className="mt-2">No course health data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`course-health-card ${className}`} data-testid="course-health-card" role="region" aria-labelledby="course-health-title">
      <div className="card-header">
        <h3 id="course-health-title">Course Health</h3>
        <div className="staleness-indicator">
          {data.staleness ? data.staleness.charAt(0).toUpperCase() + data.staleness.slice(1) : 'Fresh'}
        </div>
      </div>

      <div className="card-content space-y-6">
        {/* Header */}
        <div className="course-header">
          <h4 className="text-xl font-bold text-gray-900">{data.courseName}</h4>
          <div className="flex items-center mt-2 space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(data.healthScore)}`}>
              {data.overallHealth?.toUpperCase() || 'UNKNOWN'}
            </span>
            <span className="text-gray-600">
              Health Score: <span className={`font-bold ${getHealthScoreClass(data.healthScore)}`}>{data.healthScore}</span>/100
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="key-metrics-section">
          <h4>Key Metrics</h4>
          <div className="metrics-grid grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Total Enrollments"
              value={data.metrics?.enrollments?.total || 0}
              icon="👥"
              bgColor="bg-emerald-50"
              textColor="text-emerald-700"
            />
            <StatCard
              label="Active Students"
              value={data.metrics?.enrollments?.active || 0}
              icon="✓"
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <StatCard
              label="Completion Rate"
              value={`${data.metrics?.completion?.rate || 0}%`}
              icon="🎯"
              bgColor={data.metrics?.completion?.rate >= data.metrics?.completion?.target ? 'bg-green-50' : 'bg-yellow-50'}
              textColor={data.metrics?.completion?.rate >= data.metrics?.completion?.target ? 'text-green-700' : 'text-yellow-700'}
            />
          </div>
        </div>

        {/* Student Satisfaction */}
        {data.metrics?.satisfaction && (
          <div className="satisfaction-section">
            <h4>Student Satisfaction</h4>
            <div className="satisfaction-grid grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center bg-purple-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">{data.metrics.satisfaction.averageRating}</div>
                <div className="text-sm text-gray-600 mt-1">Average Rating</div>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{data.metrics.satisfaction.totalReviews}</div>
                <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">{data.metrics.satisfaction.nps}</div>
                <div className="text-sm text-gray-600 mt-1">NPS Score</div>
              </div>
              <div className="text-center bg-pink-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-pink-600">{data.metrics.satisfaction.satisfactionScore}</div>
                <div className="text-sm text-gray-600 mt-1">Satisfaction Score</div>
              </div>
            </div>
            {data.metrics.satisfaction.ratingTrend && (
              <div className="mt-4 text-center text-sm text-gray-600">
                {data.metrics.satisfaction.ratingTrend}
              </div>
            )}
          </div>
        )}

        {/* Drop-off Analysis */}
        {data.dropOffAnalysis && (
          <div className="dropoff-section">
            <h4>Drop-off Analysis</h4>
            <div className="dropoff-summary mb-4">
              <div className="text-2xl font-bold text-orange-600">{data.dropOffAnalysis.overallDropOffRate}%</div>
              <div className="text-sm text-gray-600">Overall Drop-off Rate</div>
            </div>
            
            <div className="dropoff-points space-y-4">
              {data.dropOffAnalysis.dropOffPoints?.map((dropOff, index) => (
                <div key={index} className="bg-white border border-orange-200 rounded-lg p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer" 
                    onClick={() => setExpandedDropOff(expandedDropOff === index ? null : index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setExpandedDropOff(expandedDropOff === index ? null : index);
                      }
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(dropOff.priority)}`}>
                          {dropOff.priority?.toUpperCase() || 'UNKNOWN'}
                        </span>
                        <h5 className="font-semibold text-gray-900">{dropOff.moduleName}</h5>
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
                        <h6 className="font-medium text-gray-900 mb-2">Likely Reasons:</h6>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {dropOff.likelyReasons?.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Recommended Actions:</h6>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {dropOff.recommendedActions?.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Performance */}
        {data.contentPerformance && (
          <div className="content-performance-section">
            <h4>Content Performance</h4>
            <div className="content-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Struggling Topics */}
              {data.contentPerformance.strugglingTopics && data.contentPerformance.strugglingTopics.length > 0 && (
                <div className="struggling-topics">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">📉 Struggling Topics</h5>
                  <div className="space-y-3">
                    {data.contentPerformance.strugglingTopics.map((topic, index) => (
                      <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                        <h6 className="font-semibold text-gray-900 mb-2">{topic.topic}</h6>
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
                </div>
              )}

              {/* High Performance Topics */}
              {data.contentPerformance.highPerformanceTopics && data.contentPerformance.highPerformanceTopics.length > 0 && (
                <div className="high-performance-topics">
                  <h5 className="text-lg font-semibold text-green-600 mb-4">📈 High Performance Topics</h5>
                  <div className="space-y-3">
                    {data.contentPerformance.highPerformanceTopics.map((topic, index) => (
                      <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                        <h6 className="font-semibold text-gray-900 mb-2">{topic.topic}</h6>
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="recommendations-section">
            <h4>Recommendations</h4>
            <div className="recommendations-list space-y-3">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority?.toUpperCase() || 'UNKNOWN'}
                        </span>
                        <span className="text-xs text-gray-500">{rec.type?.replace('_', ' ').toUpperCase() || 'RECOMMENDATION'}</span>
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
          </div>
        )}

        <div className="last-updated text-sm text-gray-500 mt-6 text-right">
          <span className="updated-label">Last updated:</span>{' '}
          <span className="updated-time">
            {data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
};