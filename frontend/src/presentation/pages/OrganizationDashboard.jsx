import React from 'react';
import useSWR from 'swr';
import { useAuth } from '../../application/state/AuthContext';
import { apiClient } from '../../infrastructure/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { OrgLearningVelocityCard } from '../components/analytics/organization/OrgLearningVelocityCard';
import { StrategicAlignmentCard } from '../components/analytics/organization/StrategicAlignmentCard';
import { LearningCultureCard } from '../components/analytics/organization/LearningCultureCard';

/**
 * Organization Admin Dashboard Page
 * 
 * Displays 4 organization-specific analytics cards as per the user journey documentation:
 * - AS-003 #11: Org Learning Velocity
 * - AS-003 #12: Strategic Alignment
 * - AS-003 #13: Department Analytics (placeholder)
 * - AS-003 #14: Learning Culture
 * 
 * Also includes at-risk departments banner for high risk warnings.
 * 
 * @component OrganizationDashboard
 * @description Main dashboard for organization administrators with org-wide analytics
 */
const OrganizationDashboard = () => {
  const { user } = useAuth();
  console.log('👤 Organization Dashboard - User:', user);
  const orgId = user?.organization_id || user?.organizationId || user?.id;
  console.log('🏢 Organization Dashboard - Org ID:', orgId);

  // Fetch all organization analytics data
  const { data: analyticsData, error, isLoading } = useSWR(
    orgId ? `org-analytics-${orgId}` : null,
    async () => {
      const response = await apiClient.get(`/org-admin/analytics/overview/${orgId}`);
      console.log('📊 Organization Analytics Overview Response:', response);
      // The API returns { data: {...}, cached: ..., ... }, so we extract the data property
      const data = response.data || response;
      console.log('📦 Extracted Analytics Data:', data);
      return data;
    }
  );

  if (!orgId) {
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
            🏢 Organization Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor organization-wide learning analytics and strategic alignment
          </p>
        </div>

        {/* At-Risk Departments Alert */}
        <div className="p-4 rounded-lg border-l-4 mb-6 bg-red-50 dark:bg-red-900 border-red-400 dark:border-red-600">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-100">
                At-Risk Departments Alert
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Engineering and Marketing departments showing high learning velocity decline. 
                Click to view detailed department analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AS-003 #11: Org Learning Velocity */}
          <OrgLearningVelocityCard 
            organizationId={orgId}
            data={analyticsData?.learningVelocity}
            isLoading={isLoading}
            error={error}
          />
          
          {/* AS-003 #12: Strategic Alignment */}
          <StrategicAlignmentCard 
            organizationId={orgId}
            data={analyticsData?.strategicAlignment}
            isLoading={isLoading}
            error={error}
          />
          
          {/* AS-003 #13: Department Analytics - Placeholder */}
          <div className="p-6 rounded-lg border-2 border-dashed bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-2 text-cyan-700 dark:text-cyan-400">
                Department Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Coming Soon: Detailed department-level analytics and comparisons
              </p>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                AS-003 #13: Department Analytics
              </div>
            </div>
          </div>
          
          {/* AS-003 #14: Learning Culture */}
          <LearningCultureCard 
            organizationId={orgId}
            data={analyticsData?.learningCulture}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Organization Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-lg text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold mb-1 text-cyan-700 dark:text-cyan-400">
              1,247
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Learners
            </div>
          </div>
          <div className="p-4 rounded-lg text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold mb-1 text-amber-500 dark:text-amber-400">
              89
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Trainers
            </div>
          </div>
          <div className="p-4 rounded-lg text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold mb-1 text-purple-600 dark:text-purple-400">
              156
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Courses Available
            </div>
          </div>
          <div className="p-4 rounded-lg text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold mb-1 text-emerald-600 dark:text-emerald-400">
              92%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completion Rate
            </div>
          </div>
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
              👤 User Management
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-amber-500 hover:bg-amber-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              🏢 Department Analytics
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-purple-600 hover:bg-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              ⚙️ Organization Settings
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-emerald-600 hover:bg-emerald-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              📊 Strategic Reports
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizationDashboard;
