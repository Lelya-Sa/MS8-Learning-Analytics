import React from 'react';
import PropTypes from 'prop-types';
import { useOrgLearningVelocity } from '../../../hooks/useAnalytics';

const OrganizationLearningVelocity = ({ organizationId }) => {
  const { data, error, isLoading } = useOrgLearningVelocity(organizationId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-emerald-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-emerald-100 rounded w-1/2"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Error Loading Data</h3>
        <p className="text-red-600">Failed to load learning velocity data. Please try again later.</p>
      </div>
    );
  }

  if (!data || !data.data || !data.data.orgLearningVelocity) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">No learning velocity data available</p>
      </div>
    );
  }

  const velocity = data.data.orgLearningVelocity;
  const { overview, roiMetrics, departmentBreakdown, trends } = velocity;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">📊 Organization Learning Velocity</h2>
        <p className="text-emerald-100">Period: {velocity.period}</p>
      </div>

      {/* Overview Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📈 Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-700">{overview.totalEmployees}</div>
            <div className="text-sm text-gray-600 mt-1">Total Employees</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
            <div className="text-3xl font-bold text-green-700">{overview.participationRate}%</div>
            <div className="text-sm text-gray-600 mt-1">Participation Rate</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
            <div className="text-3xl font-bold text-purple-700">{overview.skillsAcquiredThisQuarter}</div>
            <div className="text-sm text-gray-600 mt-1">Skills Acquired</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-700">{overview.activelyLearning}</div>
            <div className="text-sm text-gray-600 mt-1">Actively Learning</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border-2 border-indigo-200">
            <div className="text-3xl font-bold text-indigo-700">{overview.certificationsEarned}</div>
            <div className="text-sm text-gray-600 mt-1">Certifications Earned</div>
          </div>
        </div>
      </div>

      {/* ROI Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 ROI Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border-2 border-emerald-200">
            <div className="text-4xl font-bold text-emerald-700">{roiMetrics.roi}</div>
            <div className="text-sm text-gray-600 mt-1">Return on Investment</div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border-2 border-teal-200">
            <div className="text-2xl font-bold text-teal-700">${roiMetrics.costPerSkillAcquired.toFixed(2)}</div>
            <div className="text-sm text-gray-600 mt-1">Cost Per Skill Acquired</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border-2 border-cyan-200">
            <div className="text-2xl font-bold text-cyan-700">${roiMetrics.trainingInvestment.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Training Investment</div>
          </div>
          <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-lg p-4 border-2 border-lime-200">
            <div className="text-2xl font-bold text-lime-700">${roiMetrics.productivityGains.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Productivity Gains</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <p className="text-sm text-gray-700"><strong>Calculation Method:</strong> {roiMetrics.calculationMethod}</p>
          <p className="text-sm text-gray-700 mt-1"><strong>Average Time to Skill:</strong> {roiMetrics.averageTimeToSkill}</p>
        </div>
      </div>

      {/* Department Breakdown */}
      {departmentBreakdown && departmentBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🏢 Department Breakdown</h3>
          <div className="space-y-4">
            {departmentBreakdown.map((dept) => (
              <div key={dept.departmentId} className="border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-400 transition-colors">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{dept.departmentName}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xl font-bold text-gray-700">{dept.totalEmployees}</div>
                    <div className="text-xs text-gray-500">Employees</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">{dept.participationRate}%</div>
                    <div className="text-xs text-gray-500">Participation</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">{dept.completionRate}%</div>
                    <div className="text-xs text-gray-500">Completion</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">{dept.skillsAcquired}</div>
                    <div className="text-xs text-gray-500">Skills</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Trend:</span> {dept.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-lg p-6 border-2 border-indigo-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📈 Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-indigo-700">{trends.quarterOverQuarter}</div>
            <div className="text-sm text-gray-600">Quarter over Quarter</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-purple-700">{trends.yearOverYear}</div>
            <div className="text-sm text-gray-600">Year over Year</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-lg font-semibold text-pink-700">{trends.peakLearningMonth}</div>
            <div className="text-sm text-gray-600">Peak Learning Month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

OrganizationLearningVelocity.propTypes = {
  organizationId: PropTypes.string.isRequired
};

export default OrganizationLearningVelocity;
