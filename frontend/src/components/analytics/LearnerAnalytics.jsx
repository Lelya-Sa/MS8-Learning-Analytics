/**
 * Enhanced LearnerAnalytics Component
 * Implements SWR pattern, refresh cooldown, and privacy controls
 */

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import AnalyticsChart from '../charts/AnalyticsChart';
import DataTable from '../tables/DataTable';
import * as api from '../../services/api';

const LearnerAnalytics = ({ userId }) => {
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshCooldown, setRefreshCooldown] = useState(false);
  const [showPrivacyControls, setShowPrivacyControls] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/v1/analytics/learner/${userId}` : null,
    () => api.getLearnerAnalytics(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000 // 5 minutes
    }
  );

  const handleRefresh = async () => {
    if (refreshCooldown) {
      return;
    }

    try {
      await mutate();
      setLastRefresh(new Date());
      setRefreshCooldown(true);
      
      // Reset cooldown after 5 minutes
      setTimeout(() => {
        setRefreshCooldown(false);
      }, 300000);
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  };

  const handleDataExport = async () => {
    try {
      const response = await api.generateReport('learner', 'csv');
      if (response.download_url) {
        window.open(response.download_url, '_blank');
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleDataDeletion = async () => {
    if (window.confirm('Are you sure you want to delete all your analytics data? This action cannot be undone.')) {
      try {
        await api.deleteUserData(userId);
        alert('Your data has been deleted successfully.');
      } catch (err) {
        console.error('Deletion failed:', err);
      }
    }
  };

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to fetch analytics</p>
        <button onClick={() => mutate()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return <div>No analytics data available</div>;
  }

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Learning Velocity',
      data: [75, 80, 85, data.learning_velocity],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)'
    }]
  };

  return (
    <div className="learner-analytics">
      <h1>My Learning Analytics</h1>
      <div className="analytics-header">
        <h2>Learning Analytics</h2>
        <div className="header-actions">
          <button 
            onClick={handleRefresh}
            disabled={refreshCooldown}
            className="refresh-button"
            aria-label="Refresh analytics"
          >
            {refreshCooldown ? 'Please wait...' : 'Refresh'}
          </button>
          {lastRefresh && (
            <span className="last-refresh">
              Last refreshed: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Learning Velocity</h4>
          <div className="metric-value">{data.learning_velocity}%</div>
        </div>
        <div className="metric-card">
          <h4>Mastery Progress</h4>
          <div className="metric-value">{data.mastery_progress}%</div>
        </div>
        <div className="metric-card">
          <h4>Engagement Score</h4>
          <div className="metric-value">{data.engagement_score}%</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <AnalyticsChart
            data={chartData}
            type="line"
            aria-label="Learning velocity chart"
          />
        </div>
      </div>

      <div className="skill-gaps-section">
        <h4>Skill Gaps</h4>
        <DataTable
          data={data.skill_gaps.map(gap => ({
            ...gap,
            priority: `${gap.priority} priority`
          }))}
          columns={[
            { key: 'skill', label: 'Skill' },
            { key: 'priority', label: 'Priority' },
            { key: 'gap_score', label: 'Gap Score' }
          ]}
          sortable={true}
        />
      </div>

      <div className="privacy-controls">
        <button 
          onClick={() => setShowPrivacyControls(!showPrivacyControls)}
          className="privacy-toggle"
        >
          Privacy Controls
        </button>
        
        {showPrivacyControls && (
          <div className="privacy-panel">
            <h4>Privacy Controls</h4>
            <button 
              onClick={handleDataExport}
              className="export-button"
              aria-label="Export my data"
            >
              Export My Data
            </button>
            <button 
              onClick={handleDataDeletion}
              className="delete-button"
              aria-label="Delete my data"
            >
              Delete My Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnerAnalytics;