import React from 'react';
import PropTypes from 'prop-types';
import { useTrainerStudentDistribution } from '../../../hooks/useAnalytics';
import GradientSection from '../../common/GradientSection';
import ProgressBar from '../../common/ProgressBar';

const StudentDistributionChart = ({ trainerId, courseId, data: propData, isLoading: propIsLoading, error: propError }) => {
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useTrainerStudentDistribution(trainerId, courseId);
  
  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult.data?.data?.studentDistribution;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading;
  const error = propError || hookResult.error;

  if (isLoading) {
    return (
      <div className="student-distribution-chart animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="h-32 bg-gray-200 rounded"></div>
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
      <div className="student-distribution-chart bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center text-red-600">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold">Error loading student distribution</h3>
            <p className="text-sm">{error.message || 'Failed to fetch student distribution data'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="student-distribution-chart bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <span className="text-4xl">📊</span>
        <p className="mt-2 text-gray-600">No student distribution data available</p>
      </div>
    );
  }

  const getPerformanceColor = (category) => {
    const colors = {
      excellent: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      good: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      average: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
      struggling: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
    };
    return colors[category] || colors.average;
  };

  return (
    <div className="student-distribution-chart space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{data.courseName}</h2>
        <p className="text-gray-600 mt-1">Student Performance Distribution</p>
        <div className="mt-2 text-sm text-gray-500">
          Total Students: <span className="font-bold text-gray-900">{data.totalStudents}</span>
        </div>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(data.distribution).map(([category, stats]) => {
          const colors = getPerformanceColor(category);
          return (
            <div key={category} className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4`}>
              <div className="text-center">
                <div className={`text-sm font-medium ${colors.text} uppercase mb-2`}>
                  {category}
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.count}</div>
                <div className="text-sm text-gray-600 mt-1">{stats.percentage}%</div>
                <div className="text-xs text-gray-500 mt-2">{stats.range}</div>
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

      {/* Visual Distribution Bar */}
      <GradientSection title="Performance Distribution" icon="📊" gradient="from-gray-50 to-gray-100">
        <div className="relative h-12 bg-gray-200 rounded-lg overflow-hidden flex">
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
        <div className="mt-4 flex justify-between text-xs text-gray-600">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </GradientSection>

      {/* Insights */}
      <GradientSection title="Key Insights" icon="💡" gradient="from-blue-50 to-indigo-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{data.insights.averageScore}%</div>
            <div className="text-sm text-gray-600 mt-1">Average Score</div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{data.insights.medianScore}%</div>
            <div className="text-sm text-gray-600 mt-1">Median Score</div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <div className="text-2xl font-bold text-green-600">{data.insights.passRate}%</div>
            <div className="text-sm text-gray-600 mt-1">Pass Rate</div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-red-200">
            <div className="text-2xl font-bold text-red-600">{data.insights.atRiskStudents}</div>
            <div className="text-sm text-gray-600 mt-1">At-Risk Students</div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-emerald-200">
            <div className="text-2xl font-bold text-emerald-600">{data.insights.topPerformers}</div>
            <div className="text-sm text-gray-600 mt-1">Top Performers</div>
          </div>
        </div>
      </GradientSection>

      {/* Action Items */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">⚡</span>
          Action Items
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          {data.insights.atRiskStudents > 0 && (
            <div className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong>{data.insights.atRiskStudents} students</strong> need immediate intervention and support</span>
            </div>
          )}
          {data.insights.passRate < 80 && (
            <div className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Consider reviewing course materials - pass rate is below target (80%)</span>
            </div>
          )}
          {data.insights.topPerformers > 0 && (
            <div className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Leverage <strong>{data.insights.topPerformers} top performers</strong> for peer mentoring</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

StudentDistributionChart.propTypes = {
  trainerId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default StudentDistributionChart;
