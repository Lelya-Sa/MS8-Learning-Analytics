/**
 * TrainerAnalytics Component - Comprehensive Dashboard
 * Displays all 4 trainer analytics categories (AS-002)
 * Integrated with individual analytics components
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import CourseHealthDashboard from './trainer/CourseHealthDashboard';
import CoursePerformanceDashboard from './trainer/CoursePerformanceDashboard';
import StudentDistributionChart from './trainer/StudentDistributionChart';
import TeachingEffectivenessMetrics from './trainer/TeachingEffectivenessMetrics';

const TrainerAnalytics = ({ userId: propUserId }) => {
  const { user } = useAuth();
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshCooldown, setRefreshCooldown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('course-123'); // Default course for detailed views
  const [isLoading, setIsLoading] = useState(false);

  // Use propUserId if provided (for testing/admin view), otherwise use authenticated user
  const trainerId = propUserId || user?.id;

  // Handle refresh cooldown (5 minutes)
  useEffect(() => {
    if (lastRefresh) {
      setRefreshCooldown(true);
      const timer = setTimeout(() => {
        setRefreshCooldown(false);
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearTimeout(timer);
    }
  }, [lastRefresh]);

  const handleRefresh = async () => {
    if (refreshCooldown) {
      return;
    }

    try {
      setIsLoading(true);
      setLastRefresh(new Date());
      // In production, this would trigger a re-fetch for all child components
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Refresh failed:', err);
      setIsLoading(false);
    }
  };

  if (!trainerId) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to view your trainer analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trainer-analytics-dashboard space-y-8">
      {/* Header with refresh controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Trainer Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive insights into your teaching performance and student outcomes
            {lastRefresh && (
              <span className="ml-2 text-gray-400">
                • Last refreshed: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshCooldown || isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              refreshCooldown || isLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
            title={refreshCooldown ? 'Please wait 5 minutes between refreshes' : 'Refresh all analytics'}
          >
            {isLoading ? '⟳ Refreshing...' : refreshCooldown ? '⏱ Please wait...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* AS-002 #7: Course Performance Dashboard */}
      <div className="analytics-section">
        <CoursePerformanceDashboard trainerId={trainerId} />
      </div>

      {/* Course Selector for Detailed Views */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Course for Detailed Analysis:
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="course-123">Full Stack Web Development</option>
          <option value="course-456">React Advanced Patterns</option>
        </select>
        <p className="mt-2 text-xs text-gray-500">
          View detailed health metrics, student distribution, and drop-off analysis for the selected course
        </p>
      </div>

      {/* AS-002 #8: Course Health Dashboard */}
      <div className="analytics-section">
        <CourseHealthDashboard trainerId={trainerId} courseId={selectedCourse} />
      </div>

      {/* AS-002 #9: Student Performance Distribution */}
      <div className="analytics-section">
        <StudentDistributionChart trainerId={trainerId} courseId={selectedCourse} />
      </div>

      {/* AS-002 #10: Teaching Effectiveness Metrics */}
      <div className="analytics-section">
        <TeachingEffectivenessMetrics trainerId={trainerId} />
      </div>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-6 mt-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-3xl">💡</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About Your Trainer Analytics
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Your teaching analytics are updated daily to provide insights into course performance, student outcomes,
              and areas for improvement. Use these metrics to enhance your teaching effectiveness and student success rates.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong className="text-gray-900">📊 Course Performance:</strong> Overview of all your courses with key metrics
              </div>
              <div>
                <strong className="text-gray-900">💚 Course Health:</strong> Detailed analysis of enrollments, completion, and satisfaction
              </div>
              <div>
                <strong className="text-gray-900">📈 Student Distribution:</strong> Performance breakdown and at-risk student identification
              </div>
              <div>
                <strong className="text-gray-900">⭐ Teaching Effectiveness:</strong> Your overall impact on student learning outcomes
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              <strong>Data Refresh:</strong> Analytics refresh daily. Use the refresh button above to manually update (limited to once every 5 minutes).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerAnalytics;
