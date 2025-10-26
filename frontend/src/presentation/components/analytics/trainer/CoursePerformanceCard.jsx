import React from 'react';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';
import StatCard from '../../common/StatCard';

/**
 * CoursePerformanceCard component displays trainer's course performance analytics.
 *
 * Features:
 * - Overall course performance summary with key metrics
 * - Individual course performance details
 * - Course health scores and trends
 * - Enrollment and completion statistics
 * - Performance trends (improving/declining/stable)
 * - Loading and error states
 * - Accessibility compliant (WCAG 2.2 AA)
 *
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Course performance data
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Course performance card component
 */
export const CoursePerformanceCard = ({ data, isLoading, error, onRetry, className = '' }) => {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHealthScoreClass = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className={`course-performance-card ${className}`} data-testid="course-performance-card">
        <div className="card-content">
          <Spinner data-testid="loading-spinner" />
          <p className="text-center text-gray-500 mt-4">Loading course performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`course-performance-card ${className}`} data-testid="course-performance-card">
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

  if (!data || !data.courses || data.courses.length === 0) {
    return (
      <div className={`course-performance-card ${className}`} data-testid="course-performance-card">
        <div className="card-header">
          <h3>Course Performance</h3>
        </div>
        <div className="card-content">
          <div className="text-center text-gray-500">
            <span className="text-4xl">📚</span>
            <p className="mt-2">No course performance data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`course-performance-card ${className}`} data-testid="course-performance-card" role="region" aria-labelledby="course-performance-title">
      <div className="card-header">
        <h3 id="course-performance-title">Course Performance</h3>
        <div className="staleness-indicator">
          {data.staleness ? data.staleness.charAt(0).toUpperCase() + data.staleness.slice(1) : 'Fresh'}
        </div>
      </div>

      <div className="card-content">
        {/* Summary Statistics */}
        <div className="summary-section">
          <h4>Overall Performance Summary</h4>
          <div className="summary-grid grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Courses"
              value={data.summary?.totalCourses || 0}
              icon="📚"
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <StatCard
              label="Total Enrollments"
              value={data.summary?.totalEnrollments || 0}
              icon="👥"
              bgColor="bg-emerald-50"
              textColor="text-emerald-700"
            />
            <StatCard
              label="Avg Completion Rate"
              value={`${data.summary?.averageCompletionRate || 0}%`}
              icon="✓"
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
            <StatCard
              label="Avg Health Score"
              value={data.summary?.averageHealthScore || 0}
              icon="💚"
              bgColor="bg-purple-50"
              textColor="text-purple-700"
            />
          </div>
        </div>

        {/* Individual Course Cards */}
        <div className="courses-section space-y-4">
          <h4>Course Details</h4>
          <div className="courses-list space-y-4">
            {data.courses.map((course) => (
              <div key={course.courseId} className="course-card bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-emerald-300 transition-colors">
                <div className="course-header flex items-start justify-between mb-4">
                  <div className="course-info flex-1">
                    <h5 className="text-lg font-semibold text-gray-900">{course.courseName}</h5>
                    <div className="course-meta flex items-center mt-2 space-x-2">
                      <span className="course-id text-sm text-gray-500">ID: {course.courseId}</span>
                      <span className={`course-trend text-sm font-medium ${getTrendColor(course.trend)}`}>
                        {getTrendIcon(course.trend)} {course.trend.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="course-health text-right">
                    <div className={`health-score text-3xl font-bold ${getHealthScoreClass(course.healthScore)}`}>
                      {course.healthScore}
                    </div>
                    <div className="health-label text-sm text-gray-500">Health Score</div>
                  </div>
                </div>

                <div className="course-metrics grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="metric-item bg-blue-50 rounded-lg p-3">
                    <div className="metric-value text-2xl font-bold text-blue-600">{course.enrollments}</div>
                    <div className="metric-label text-sm text-gray-600 mt-1">Enrollments</div>
                  </div>
                  <div className="metric-item bg-green-50 rounded-lg p-3">
                    <div className="metric-value text-2xl font-bold text-green-600">{course.activeStudents}</div>
                    <div className="metric-label text-sm text-gray-600 mt-1">Active Students</div>
                  </div>
                  <div className="metric-item bg-purple-50 rounded-lg p-3">
                    <div className="metric-value text-2xl font-bold text-purple-600">{course.completionRate}%</div>
                    <div className="metric-label text-sm text-gray-600 mt-1">Completion Rate</div>
                  </div>
                  <div className="metric-item bg-orange-50 rounded-lg p-3">
                    <div className="metric-value text-2xl font-bold text-orange-600">{course.averageScore}%</div>
                    <div className="metric-label text-sm text-gray-600 mt-1">Avg Score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        {data.insights && data.insights.length > 0 && (
          <div className="insights-section space-y-4">
            <h4>Performance Insights</h4>
            <div className="insights-content space-y-3">
              {data.insights.map((insight, index) => (
                <div key={index} className="insight-item flex items-start space-x-3">
                  <span className="insight-icon text-lg">💡</span>
                  <span className="insight-text text-gray-700">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="recommendations-section space-y-4">
            <h4>Recommendations</h4>
            <ul className="recommendations-list space-y-2">
              {data.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
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
