import React from 'react';
import PropTypes from 'prop-types';
import { useTrainerCoursePerformance } from '../../../hooks/useAnalytics';
import GradientSection from '../../common/GradientSection';
import StatCard from '../../common/StatCard';

const CoursePerformanceDashboard = ({ trainerId, data: propData, isLoading: propIsLoading, error: propError }) => {
  // Use hook to fetch data if not provided as prop (for testing)
  const hookResult = useTrainerCoursePerformance(trainerId);
  
  // Use prop data if provided (for testing), otherwise use hook data
  const data = propData || hookResult.data?.data?.coursePerformance;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading;
  const error = propError || hookResult.error;

  if (isLoading) {
    return (
      <div className="course-performance-dashboard animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-performance-dashboard bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center text-red-600">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold">Error loading course performance</h3>
            <p className="text-sm">{error.message || 'Failed to fetch course performance data'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.courses) {
    return (
      <div className="course-performance-dashboard bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <span className="text-4xl">📚</span>
        <p className="mt-2 text-gray-600">No course performance data available</p>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend) => {
    if (trend === 'improving') return 'text-green-600';
    if (trend === 'declining') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="course-performance-dashboard space-y-6">
      {/* Summary Statistics */}
      <GradientSection title="Overall Performance Summary" icon="📊" gradient="from-blue-50 to-indigo-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Courses"
            value={data.summary.totalCourses}
            icon="📚"
            color="blue"
          />
          <StatCard
            label="Total Enrollments"
            value={data.summary.totalEnrollments}
            icon="👥"
            color="emerald"
          />
          <StatCard
            label="Avg Completion Rate"
            value={`${data.summary.averageCompletionRate}%`}
            icon="✓"
            color="green"
          />
          <StatCard
            label="Avg Health Score"
            value={data.summary.averageHealthScore}
            icon="💚"
            color="purple"
          />
        </div>
      </GradientSection>

      {/* Individual Course Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Course Details</h3>
        {data.courses.map((course) => (
          <div key={course.courseId} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-emerald-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{course.courseName}</h4>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-sm text-gray-500">ID: {course.courseId}</span>
                  <span className={`text-sm font-medium ${getTrendColor(course.trend)}`}>
                    {getTrendIcon(course.trend)} {course.trend.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-600">{course.healthScore}</div>
                <div className="text-sm text-gray-500">Health Score</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{course.enrollments}</div>
                <div className="text-sm text-gray-600 mt-1">Enrollments</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{course.activeStudents}</div>
                <div className="text-sm text-gray-600 mt-1">Active Students</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">{course.completionRate}%</div>
                <div className="text-sm text-gray-600 mt-1">Completion Rate</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">{course.averageScore}%</div>
                <div className="text-sm text-gray-600 mt-1">Avg Score</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

CoursePerformanceDashboard.propTypes = {
  trainerId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default CoursePerformanceDashboard;
