import React from 'react';
import PropTypes from 'prop-types';
import { useTrainerTeachingEffectiveness } from '../../../hooks/useAnalytics';
import GradientSection from '../../common/GradientSection';
import StatCard from '../../common/StatCard';

const TeachingEffectivenessMetrics = ({ trainerId, data: propData, isLoading: propIsLoading, error: propError }) => {
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useTrainerTeachingEffectiveness(trainerId);
  
  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult.data?.data?.teachingEffectiveness;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading;
  const error = propError || hookResult.error;

  if (isLoading) {
    return (
      <div className="teaching-effectiveness-metrics animate-pulse">
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
      <div className="teaching-effectiveness-metrics bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center text-red-600">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold">Error loading teaching effectiveness</h3>
            <p className="text-sm">{error.message || 'Failed to fetch teaching effectiveness data'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="teaching-effectiveness-metrics bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <span className="text-4xl">📈</span>
        <p className="mt-2 text-gray-600">No teaching effectiveness data available</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="teaching-effectiveness-metrics space-y-6">
      {/* Overall Score */}
      <GradientSection title="Teaching Effectiveness Score" icon="⭐" gradient="from-emerald-50 to-teal-50">
        <div className="flex items-center justify-center">
          <div className={`text-center border-4 rounded-full w-40 h-40 flex flex-col items-center justify-center ${getScoreColor(data.overallScore)}`}>
            <div className="text-5xl font-bold">{data.overallScore}</div>
            <div className="text-sm mt-1">Overall Score</div>
          </div>
        </div>
      </GradientSection>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Satisfaction */}
        <GradientSection title="Student Satisfaction" icon="😊" gradient="from-purple-50 to-pink-50">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Score:</span>
              <span className="text-2xl font-bold text-purple-600">{data.metrics.studentSatisfaction.score}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reviews:</span>
              <span className="font-medium text-gray-900">{data.metrics.studentSatisfaction.totalReviews}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trend:</span>
              <span className="font-medium text-green-600">{data.metrics.studentSatisfaction.trend}</span>
            </div>
          </div>
        </GradientSection>

        {/* Learning Outcomes */}
        <GradientSection title="Learning Outcomes" icon="🎓" gradient="from-blue-50 to-indigo-50">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Score Improvement:</span>
              <span className="text-2xl font-bold text-blue-600">{data.metrics.learningOutcomes.averageScoreImprovement}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Skill Acquisition:</span>
              <span className="font-medium text-gray-900">{data.metrics.learningOutcomes.skillAcquisitionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Completion Rate:</span>
              <span className="font-medium text-gray-900">{data.metrics.learningOutcomes.completionRate}%</span>
            </div>
          </div>
        </GradientSection>

        {/* Engagement */}
        <GradientSection title="Engagement" icon="💬" gradient="from-green-50 to-emerald-50">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response Time:</span>
              <span className="font-medium text-green-600">{data.metrics.engagement.responseTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Feedback Quality:</span>
              <span className="text-2xl font-bold text-green-600">{data.metrics.engagement.feedbackQuality}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Availability:</span>
              <span className="font-medium text-gray-900">{data.metrics.engagement.availabilityScore}%</span>
            </div>
          </div>
        </GradientSection>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <GradientSection title="Strengths" icon="💪" gradient="from-green-50 to-emerald-50">
          <div className="space-y-2">
            {data.strengths && data.strengths.length > 0 ? (
              data.strengths.map((strength, index) => (
                <div key={index} className="flex items-start bg-white border border-green-200 rounded-lg p-3">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-700 flex-1">{strength}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No strengths data available</p>
            )}
          </div>
        </GradientSection>

        {/* Improvement Areas */}
        <GradientSection title="Areas for Improvement" icon="🎯" gradient="from-orange-50 to-amber-50">
          <div className="space-y-2">
            {data.improvementAreas && data.improvementAreas.length > 0 ? (
              data.improvementAreas.map((area, index) => (
                <div key={index} className="flex items-start bg-white border border-orange-200 rounded-lg p-3">
                  <span className="text-orange-500 mr-2 mt-1">→</span>
                  <span className="text-gray-700 flex-1">{area}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No improvement areas identified</p>
            )}
          </div>
        </GradientSection>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">📊</span>
          Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Student Satisfaction"
            value={`${data.metrics.studentSatisfaction.score}/5`}
            icon="😊"
            color="purple"
          />
          <StatCard
            label="Response Time"
            value={data.metrics.engagement.responseTime}
            icon="⚡"
            color="green"
          />
          <StatCard
            label="Completion Rate"
            value={`${data.metrics.learningOutcomes.completionRate}%`}
            icon="✓"
            color="blue"
          />
        </div>
      </div>
    </div>
  );
};

TeachingEffectivenessMetrics.propTypes = {
  trainerId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default TeachingEffectivenessMetrics;
