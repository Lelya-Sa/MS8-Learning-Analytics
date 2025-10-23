/**
 * Enhanced TrainerAnalytics Component
 * Displays trainer-specific analytics with student performance
 */

import React from 'react';
import useSWR from 'swr';
import AnalyticsChart from '../charts/AnalyticsChart';
import * as api from '../../services/api';

const TrainerAnalytics = ({ userId }) => {
  const { data, error, isLoading } = useSWR(
    userId ? `/api/v1/analytics/trainer/${userId}` : null,
    () => api.getTrainerAnalytics(userId)
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
    labels: ['Course Performance', 'Course Health', 'Teaching Effectiveness'],
    datasets: [{
      label: 'Trainer Metrics',
      data: [
        data.course_performance || 0,
        data.course_health || 0,
        data.teaching_effectiveness || 0
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
    <div className="trainer-analytics">
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Course Performance</h4>
          <div className="metric-value">{data.course_performance}%</div>
        </div>
        <div className="metric-card">
          <h4>Course Health</h4>
          <div className="metric-value">{data.course_health}%</div>
        </div>
        <div className="metric-card">
          <h4>Teaching Effectiveness</h4>
          <div className="metric-value">{data.teaching_effectiveness}%</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <AnalyticsChart
            data={chartData}
            type="bar"
            aria-label="bar chart"
          />
        </div>
      </div>

      <div className="student-distribution-section">
        <h4>Student Performance</h4>
        <div className="student-stats">
          <div className="stat-item">
            <span className="stat-label">Total Students:</span>
            <span className="stat-value">{data.student_distribution?.total_students || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Students:</span>
            <span className="stat-value">{data.student_distribution?.active_students || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">At-Risk Students:</span>
            <span className="stat-value">{data.student_distribution?.at_risk_students || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerAnalytics;