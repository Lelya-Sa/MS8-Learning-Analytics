import React from 'react';
import useSWR from 'swr';
import { useAuth } from '../../application/state/AuthContext';
import { apiClient } from '../../infrastructure/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CoursePerformanceCard } from '../components/analytics/trainer/CoursePerformanceCard';
import { CourseHealthCard } from '../components/analytics/trainer/CourseHealthCard';
import { StudentDistributionCard } from '../components/analytics/trainer/StudentDistributionCard';
import { TeachingEffectivenessCard } from '../components/analytics/trainer/TeachingEffectivenessCard';

/**
 * Trainer Dashboard Page
 * 
 * Displays 4 trainer-specific analytics cards as per the user journey documentation:
 * - AS-002 #7: Course Performance
 * - AS-002 #8: Course Health
 * - AS-002 #9: Student Distribution
 * - AS-002 #10: Teaching Effectiveness
 * 
 * Also includes at-risk students sidebar for high drop-off risk warnings.
 * 
 * @component TrainerDashboard
 * @description Main dashboard for trainers with course and student analytics
 */
const TrainerDashboard = () => {
  const { user } = useAuth();
  const trainerId = user?.id;

  // Fetch all trainer analytics data
  const { data: analyticsData, error, isLoading } = useSWR(
    trainerId ? `trainer-analytics-${trainerId}` : null,
    async () => {
      const response = await apiClient.get(`/trainer/analytics/overview/${trainerId}`);
      // The API returns { data: {...}, cached: ..., ... }, so we extract the data property
      const data = response.data || response;
      console.log('📊 Trainer Analytics Data:', data);
      return data;
    }
  );

  // Extract courseId from the first course in coursePerformance or use a default
  const courseId = analyticsData?.coursePerformance?.courses?.[0]?.id || 'default-course';

  if (!trainerId) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p>Please wait while we load your dashboard.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-cyan-700 dark:text-cyan-400">
            👨‍🏫 Trainer Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor course performance and student progress analytics
          </p>
        </div>

        {/* At-Risk Students Alert */}
        <div className="p-4 rounded-lg border-l-4 mb-6 bg-red-50 dark:bg-red-900 border-red-400 dark:border-red-600">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-100">
                At-Risk Students Alert
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                3 students showing high drop-off risk. Click to view details and send recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AS-002 #7: Course Performance */}
          <CoursePerformanceCard 
            data={analyticsData?.coursePerformance}
            isLoading={isLoading}
            error={error}
          />
          
          {/* AS-002 #8: Course Health */}
          <CourseHealthCard 
            data={analyticsData?.courseHealth}
            isLoading={isLoading}
            error={error}
          />
          
          {/* AS-002 #9: Student Distribution */}
          <StudentDistributionCard 
            trainerId={trainerId}
            courseId={courseId}
            data={analyticsData?.studentDistribution}
            isLoading={isLoading}
            error={error}
          />
          
          {/* AS-002 #10: Teaching Effectiveness */}
          <TeachingEffectivenessCard 
            trainerId={trainerId}
            data={analyticsData?.teachingEffectiveness}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4 text-cyan-700 dark:text-cyan-400">
            Quick Actions
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-cyan-700 hover:bg-cyan-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              👥 Manage Students
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-amber-500 hover:bg-amber-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              📚 Course Management
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-purple-600 hover:bg-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              📊 Detailed Analytics
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-emerald-600 hover:bg-emerald-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              📄 Generate Report
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainerDashboard;
