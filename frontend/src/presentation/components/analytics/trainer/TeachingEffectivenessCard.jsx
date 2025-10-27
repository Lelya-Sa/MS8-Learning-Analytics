import React from 'react';
import PropTypes from 'prop-types';
import { useTrainerTeachingEffectiveness } from '../../../../application/hooks/useAnalytics';
import GradientSection from '../../common/GradientSection';
import StatCard from '../../common/StatCard';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';

/**
 * TeachingEffectivenessCard component displays a trainer's teaching effectiveness metrics.
 * It includes overall score, key metrics (student satisfaction, learning outcomes, engagement),
 * strengths, improvement areas, and performance summary.
 *
 * Features:
 * - Overall teaching effectiveness score with color coding
 * - Student satisfaction metrics (score, reviews, trend)
 * - Learning outcomes (score improvement, skill acquisition, completion rate)
 * - Engagement metrics (response time, feedback quality, availability)
 * - Strengths and improvement areas lists
 * - Performance summary with key stats
 * - Loading, error, and no data states
 * - Accessibility compliant
 *
 * @param {Object} props - Component props
 * @param {string} props.trainerId - The ID of the trainer
 * @param {Object} [props.data] - Teaching effectiveness data (for testing/storybooks)
 * @param {boolean} [props.isLoading] - Loading state (for testing/storybooks)
 * @param {Object} [props.error] - Error object (for testing/storybooks)
 * @param {function} [props.onRetry] - Function to call on retry button click
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Teaching effectiveness card component
 */
export const TeachingEffectivenessCard = ({
  trainerId,
  data: propData,
  isLoading: propIsLoading,
  error: propError,
  onRetry,
  className = ''
}) => {
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useTrainerTeachingEffectiveness(trainerId);
  
  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult?.data?.data?.teachingEffectiveness;
  const isLoading = propIsLoading !== undefined ? propIsLoading : (hookResult?.isLoading || false);
  const error = propError || hookResult?.error;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 bg-green-900/20 border-green-500/30';
    if (score >= 60) return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
    return 'text-red-400 bg-red-900/20 border-red-500/30';
  };

  if (isLoading) {
    return (
      <div className={`teaching-effectiveness-card animate-pulse p-6 ${className}`} data-testid="teaching-effectiveness-card-loading">
        <div className="h-8 bg-emerald-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-32 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
          <div className="h-32 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
          <div className="h-32 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
        </div>
        <div className="h-64 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`teaching-effectiveness-card bg-red-50 dark:bg-red-900/20 border border-red-700 rounded-lg p-6 text-red-900 dark:text-red-400 ${className}`} data-testid="teaching-effectiveness-card-error">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold">Error loading teaching effectiveness</h3>
            <p className="text-sm">{error?.message || error?.error || 'Failed to fetch teaching effectiveness data'}</p>
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
      <div className={`teaching-effectiveness-card bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 rounded-lg p-6 text-center text-gray-700 dark:text-emerald-400 ${className}`} data-testid="teaching-effectiveness-card-no-data">
        <span className="text-4xl">📈</span>
        <p className="mt-2">No teaching effectiveness data available</p>
      </div>
    );
  }

  return (
    <div className={`teaching-effectiveness-card ${className}`} data-testid="teaching-effectiveness-card" role="region" aria-labelledby="teaching-effectiveness-title">
      {/* Card Header */}
      <div className="card-header">
        <div className="header-content">
          <h3 id="teaching-effectiveness-title">Teaching Effectiveness Score</h3>
          <p>Your overall teaching effectiveness metrics</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        {/* Overall Score Display */}
        <div className="score-display-section">
          <div className="flex items-center justify-center mb-6">
            <div className={`text-center border-4 rounded-full w-40 h-40 flex flex-col items-center justify-center ${getScoreColor(data.overallScore)}`}>
              <div className="text-5xl font-bold">{data.overallScore}</div>
              <div className="text-sm mt-1">Overall Score</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="key-metrics-section">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Satisfaction */}
            <div className="metric-box purple">
            <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center">
              <span className="text-xl mr-2">😊</span>
              Student Satisfaction
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Score:</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.metrics.studentSatisfaction.score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Reviews:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.metrics.studentSatisfaction.totalReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Trend:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{data.metrics.studentSatisfaction.trend}</span>
              </div>
            </div>
          </div>

            {/* Learning Outcomes */}
            <div className="metric-box blue">
            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center">
              <span className="text-xl mr-2">🎓</span>
              Learning Outcomes
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 text-sm">Score Improvement:</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.metrics.learningOutcomes.averageScoreImprovement}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 text-sm">Skill Acquisition:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.metrics.learningOutcomes.skillAcquisitionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 text-sm">Completion Rate:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.metrics.learningOutcomes.completionRate}%</span>
              </div>
            </div>
          </div>

            {/* Engagement */}
            <div className="metric-box emerald">
            <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center">
              <span className="text-xl mr-2">💬</span>
              Engagement
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Response Time:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{data.metrics.engagement.responseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Feedback Quality:</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{data.metrics.engagement.feedbackQuality}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Availability:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.metrics.engagement.availabilityScore}%</span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="strengths-improvements-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="section-box emerald">
            <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center">
              <span className="text-xl mr-2">💪</span>
              Strengths
            </h4>
            <div className="space-y-2">
              {data.strengths && data.strengths.length > 0 ? (
                data.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start bg-white dark:bg-gray-800 border border-emerald-500 rounded-lg p-3">
                    <span className="text-emerald-600 dark:text-emerald-400 mr-2 mt-1">✓</span>
                    <span className="text-gray-900 dark:text-gray-100 flex-1">{strength}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm">No strengths data available</p>
              )}
            </div>
          </div>

            {/* Improvement Areas */}
            <div className="section-box orange">
            <h4 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center">
              <span className="text-xl mr-2">🎯</span>
              Areas for Improvement
            </h4>
            <div className="space-y-2">
              {data.improvementAreas && data.improvementAreas.length > 0 ? (
                data.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-start bg-white dark:bg-gray-800 border border-orange-500 rounded-lg p-3">
                    <span className="text-orange-600 dark:text-orange-400 mr-2 mt-1">→</span>
                    <span className="text-gray-900 dark:text-gray-100 flex-1">{area}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm">No improvement areas identified</p>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="performance-summary-section">
          <h3 className="section-header-title">Performance Summary</h3>
          <div className="summary-grid">
            <div className="summary-item purple">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.metrics.studentSatisfaction.score}/5</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Student Satisfaction</div>
            </div>
            <div className="summary-item emerald">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{data.metrics.engagement.responseTime}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Response Time</div>
            </div>
            <div className="summary-item blue">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.metrics.learningOutcomes.completionRate}%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Completion Rate</div>
            </div>
          </div>
        </div>

        {data.lastUpdated && (
          <div className="last-updated text-sm text-emerald-700 dark:text-emerald-400 text-right">
            <span className="updated-label">Last updated:</span>{' '}
            <span className="updated-time">{new Date(data.lastUpdated).toLocaleDateString('en-GB')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

TeachingEffectivenessCard.propTypes = {
  trainerId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  onRetry: PropTypes.func,
  className: PropTypes.string,
};
