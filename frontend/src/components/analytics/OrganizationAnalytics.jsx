/**
 * Enhanced OrganizationAnalytics Component
 * Displays organization-wide analytics with department metrics
 */

import React from 'react';
import useSWR from 'swr';
import AnalyticsChart from '../charts/AnalyticsChart';
import * as api from '../../services/api';

const OrganizationAnalytics = ({ organizationId }) => {
  const { data, error, isLoading } = useSWR(
    organizationId ? `/api/v1/analytics/organization/${organizationId}` : null,
    () => api.getOrganizationAnalytics(organizationId)
  );

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div>Failed to fetch analytics</div>;
  }

  if (!data) {
    return <div>No analytics data available</div>;
  }

  const chartData = {
    labels: ['Learning Velocity', 'Strategic Alignment', 'Learning Culture'],
    datasets: [{
      label: 'Organization Metrics',
      data: [
        data.learning_velocity || 0,
        data.strategic_alignment || 0,
        data.learning_culture || 0
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)'
      ]
    }]
  };

  return (
    <div className="organization-analytics">
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Learning Velocity</h4>
          <div className="metric-value">{data.learning_velocity}%</div>
        </div>
        <div className="metric-card">
          <h4>Strategic Alignment</h4>
          <div className="metric-value">{data.strategic_alignment}%</div>
        </div>
        <div className="metric-card">
          <h4>Learning Culture</h4>
          <div className="metric-value">{data.learning_culture}%</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <AnalyticsChart
            data={chartData}
            type="bar"
            aria-label="organization metrics chart"
          />
        </div>
      </div>

      <div className="department-metrics-section">
        <h4>Department Metrics</h4>
        <div className="department-stats">
          {data.department_metrics && Object.entries(data.department_metrics).map(([dept, metrics]) => (
            <div key={dept} className="department-card">
              <h5>{dept.charAt(0).toUpperCase() + dept.slice(1)}</h5>
              <div className="dept-metrics">
                <div className="dept-metric">
                  <span className="metric-label">Velocity:</span>
                  <span className="metric-value">{metrics.velocity}%</span>
                </div>
                <div className="dept-metric">
                  <span className="metric-label">Engagement:</span>
                  <span className="metric-value">{metrics.engagement}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationAnalytics;