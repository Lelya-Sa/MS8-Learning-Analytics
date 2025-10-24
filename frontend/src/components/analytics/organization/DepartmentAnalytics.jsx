import React from 'react';
import PropTypes from 'prop-types';
import { useDepartmentAnalytics } from '../../../hooks/useAnalytics';

const DepartmentAnalytics = ({ organizationId, departmentFilter = null }) => {
  const { data, error, isLoading } = useDepartmentAnalytics(organizationId, departmentFilter);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-purple-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-purple-100 rounded w-1/2"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading department analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Error Loading Data</h3>
        <p className="text-red-600">Failed to load department analytics. Please try again later.</p>
      </div>
    );
  }

  if (!data || !data.data || !data.data.departmentAnalytics) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">No department analytics data available</p>
      </div>
    );
  }

  const departmentData = data.data.departmentAnalytics;
  const { departments } = departmentData;

  if (!departments || departments.length === 0) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">No departments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">🏢 Department Analytics</h2>
        <p className="text-purple-100">Comparative performance across {departments.length} departments</p>
      </div>

      {/* Department Cards */}
      <div className="space-y-4">
        {departments.map((dept, index) => (
          <div key={dept.departmentId} className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 hover:border-purple-400 transition-colors">
            {/* Department Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{dept.departmentName}</h3>
                <p className="text-sm text-gray-500">{dept.totalEmployees} employees</p>
              </div>
              {dept.teamComparison && (
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-700">
                    Rank #{dept.teamComparison.ranking}
                  </div>
                  <div className="text-xs text-gray-500">of {dept.teamComparison.totalDepartments}</div>
                </div>
              )}
            </div>

            {/* Metrics Grid */}
            {dept.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="text-3xl font-bold text-green-700">{dept.metrics.participationRate}%</div>
                  <div className="text-xs text-gray-600 mt-1">Participation Rate</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-700">{dept.metrics.completionRate}%</div>
                  <div className="text-xs text-gray-600 mt-1">Completion Rate</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-700">{dept.metrics.averageScore}</div>
                  <div className="text-xs text-gray-600 mt-1">Average Score</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="text-3xl font-bold text-purple-700">{dept.metrics.skillsAcquired}</div>
                  <div className="text-xs text-gray-600 mt-1">Skills Acquired</div>
                </div>
              </div>
            )}

            {/* Team Comparison */}
            {dept.teamComparison && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-700">vs. Organization Average</div>
                    <div className="text-2xl font-bold text-indigo-700">{dept.teamComparison.vsOrgAverage}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Ranking</div>
                    <div className="text-xl font-bold text-purple-700">
                      #{dept.teamComparison.ranking} / {dept.teamComparison.totalDepartments}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Performers */}
            {dept.topPerformers && dept.topPerformers.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">🏆 Top Performers</h4>
                <div className="space-y-2">
                  {dept.topPerformers.slice(0, 3).map((performer, idx) => (
                    <div key={performer.userId} className="flex items-center justify-between bg-white rounded px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                        <span className="font-medium text-gray-800">{performer.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        {performer.skillsAcquired} skills
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trends */}
            {dept.trends && (
              <div className="mt-4 flex gap-4">
                <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-gray-600">Last 30 Days</div>
                  <div className="text-lg font-bold text-blue-700">{dept.trends.last30Days}</div>
                </div>
                <div className="flex-1 bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="text-xs text-gray-600">Last 90 Days</div>
                  <div className="text-lg font-bold text-green-700">{dept.trends.last90Days}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

DepartmentAnalytics.propTypes = {
  organizationId: PropTypes.string.isRequired,
  departmentFilter: PropTypes.string
};

export default DepartmentAnalytics;
