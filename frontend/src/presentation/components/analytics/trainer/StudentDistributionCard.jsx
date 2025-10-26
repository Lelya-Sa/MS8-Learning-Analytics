import React from 'react';
import PropTypes from 'prop-types';
import { useTrainerStudentDistribution } from '../../../../application/hooks/useAnalytics';
import GradientSection from '../../common/GradientSection';
import ProgressBar from '../../common/ProgressBar';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';

/**
 * StudentDistributionCard component displays a trainer's student performance distribution,
 * including performance categories, insights, and action items.
 *
 * Features:
 * - Student performance distribution across categories (excellent, good, average, struggling)
 * - Visual distribution bar chart
 * - Key insights: average score, median score, pass rate, at-risk students, top performers
 * - Action items based on performance data
 * - Loading, error, and no data states
 * - Accessibility compliant
 *
 * @param {Object} props - Component props
 * @param {string} props.trainerId - The ID of the trainer
 * @param {string} props.courseId - The ID of the course
 * @param {Object} [props.data] - Student distribution data (for testing/storybooks)
 * @param {boolean} [props.isLoading] - Loading state (for testing/storybooks)
 * @param {Object} [props.error] - Error object (for testing/storybooks)
 * @param {function} [props.onRetry] - Function to call on retry button click
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Student distribution card component
 */
export const StudentDistributionCard = ({
  trainerId,
  courseId,
  data: propData,
  isLoading: propIsLoading,
  error: propError,
  onRetry,
  className = ''
}) => {
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useTrainerStudentDistribution(trainerId, courseId);

  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult?.data?.data?.studentDistribution;
  const isLoading = propIsLoading !== undefined ? propIsLoading : (hookResult?.isLoading || false);
  const error = propError || hookResult?.error;

  const getPerformanceColor = (category) => {
    const colors = {
      excellent: { bg: 'bg-green-900/20', text: 'text-green-400', border: 'border-green-500/30' },
      good: { bg: 'bg-blue-900/20', text: 'text-blue-400', border: 'border-blue-500/30' },
      average: { bg: 'bg-yellow-900/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
      struggling: { bg: 'bg-red-900/20', text: 'text-red-400', border: 'border-red-500/30' }
    };
    return colors[category] || colors.average;
  };

  if (isLoading) {
    return (
      <div className={`student-distribution-card animate-pulse p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg ${className}`} data-testid="student-distribution-card-loading">
        <div className="h-8 bg-emerald-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="h-32 bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
        </div>
        <div className="h-64 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`student-distribution-card bg-red-900 border border-red-700 rounded-lg p-6 text-white ${className}`} data-testid="student-distribution-card-error">
        <div className="flex items-center text-red-400">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold">Error loading student distribution</h3>
            <p className="text-sm">{error?.message || error?.error || 'Failed to fetch student distribution data'}</p>
          </div>
        </div>
        {onRetry && (
          <Button onClick={onRetry} className="mt-4 bg-red-700 hover:bg-red-600 text-white">
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className={`student-distribution-card bg-gray-900 border border-gray-700 rounded-lg p-6 text-center text-gray-300 ${className}`} data-testid="student-distribution-card-no-data">
        <span className="text-4xl">📊</span>
        <p className="mt-2">No student distribution data available for this course.</p>
      </div>
    );
  }

  return (
    <div className={`student-distribution-card space-y-6 p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg ${className}`} data-testid="student-distribution-card" role="region" aria-labelledby="student-distribution-title">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-2xl font-bold text-gray-100" id="student-distribution-title">{data.courseName}</h3>
        <p className="text-gray-300 mt-1">Student Performance Distribution</p>
        <div className="mt-2 text-sm text-gray-400">
          Total Students: <span className="font-bold text-gray-100">{data.totalStudents}</span>
        </div>
      </div>

      <div className="card-content">
        {/* Distribution Cards */}
        {data.distribution && Object.keys(data.distribution).length > 0 && (
          <div className="distribution-section space-y-4">
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Performance Distribution</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(data.distribution).map(([category, stats]) => {
                const colors = getPerformanceColor(category);
                return (
                  <div key={category} className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4`}>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${colors.text} uppercase mb-2`}>
                        {category}
                      </div>
                      <div className="text-3xl font-bold text-gray-100">{stats.count}</div>
                      <div className="text-sm text-gray-300 mt-1">{stats.percentage}%</div>
                      <div className="text-xs text-gray-400 mt-2">{stats.range}</div>
                    </div>
                    <div className="mt-3">
                      <ProgressBar
                        value={stats.percentage}
                        max={100}
                        color={category === 'excellent' ? 'green' : category === 'good' ? 'blue' : category === 'average' ? 'yellow' : 'red'}
                        showLabel={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual Distribution Bar */}
        {data.distribution && Object.keys(data.distribution).length > 0 && (
          <div className="visual-distribution-section space-y-4">
            <h4 className="text-lg font-semibold text-gray-100">Visual Distribution</h4>
            <div className="relative h-12 bg-gray-800 rounded-lg overflow-hidden flex">
              {Object.entries(data.distribution).map(([category, stats], index) => {
                const colors = getPerformanceColor(category);
                return (
                  <div
                    key={category}
                    className={`${colors.bg} ${colors.border} border-r-2 flex items-center justify-center text-sm font-medium ${colors.text} transition-all hover:opacity-80`}
                    style={{ width: `${stats.percentage}%` }}
                    title={`${category}: ${stats.count} students (${stats.percentage}%)`}
                  >
                    {stats.percentage > 10 && `${stats.percentage}%`}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Key Insights */}
        {data.insights && Object.keys(data.insights).length > 0 && (
          <div className="insights-section space-y-4">
            <h4 className="text-lg font-semibold text-gray-100">Key Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gray-800 border-2 border-blue-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{data.insights.averageScore || 0}%</div>
                <div className="text-sm text-gray-300 mt-1">Average Score</div>
              </div>
              <div className="bg-gray-800 border-2 border-purple-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{data.insights.medianScore || 0}%</div>
                <div className="text-sm text-gray-300 mt-1">Median Score</div>
              </div>
              <div className="bg-gray-800 border-2 border-green-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{data.insights.passRate || 0}%</div>
                <div className="text-sm text-gray-300 mt-1">Pass Rate</div>
              </div>
              <div className="bg-gray-800 border-2 border-red-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">{data.insights.atRiskStudents || 0}</div>
                <div className="text-sm text-gray-300 mt-1">At-Risk Students</div>
              </div>
              <div className="bg-gray-800 border-2 border-emerald-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-400">{data.insights.topPerformers || 0}</div>
                <div className="text-sm text-gray-300 mt-1">Top Performers</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Items */}
        {data.insights && Object.keys(data.insights).length > 0 && (
          <div className="action-items-section space-y-4">
            <h4 className="text-lg font-semibold text-gray-100">Action Items</h4>
            <div className="bg-gray-800 border-2 border-orange-500/30 rounded-lg p-6">
              <div className="space-y-2 text-sm text-gray-300">
                {data.insights.atRiskStudents > 0 && (
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span><strong>{data.insights.atRiskStudents} students</strong> need immediate intervention and support</span>
                  </div>
                )}
                {data.insights.passRate < 80 && (
                  <div className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Consider reviewing course materials - pass rate is below target (80%)</span>
                  </div>
                )}
                {data.insights.topPerformers > 0 && (
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Leverage <strong>{data.insights.topPerformers} top performers</strong> for peer mentoring</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {data.lastUpdated && (
          <div className="last-updated text-sm text-gray-400 mt-6 text-right">
            <span className="updated-label">Last updated:</span>{' '}
            <span className="updated-time">{new Date(data.lastUpdated).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

StudentDistributionCard.propTypes = {
  trainerId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  onRetry: PropTypes.func,
  className: PropTypes.string,
};
