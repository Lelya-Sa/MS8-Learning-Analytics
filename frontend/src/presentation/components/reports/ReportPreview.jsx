import React from 'react';
import useSWR from 'swr';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import { apiClient } from '../../../infrastructure/api';

export const ReportPreview = ({ reportId, userId, role, showRefresh = true, onRefresh }) => {
  const { data, error, isLoading, mutate } = useSWR(
    `report-preview-${reportId}-${userId}-${role}`,
    () => apiClient.get(`/reports/${reportId}`)
  );

  if (isLoading) {
    return (
      <Card className="report-preview-card">
        <div data-testid="loading-skeleton" className="loading-skeleton">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-6 gap-4 mb-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="report-preview-card">
        <div className="error-state text-center py-8">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Failed to load report preview</h3>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </Card>
    );
  }

  const reportPreview = data || {};
  const { report = {}, preview = {} } = reportPreview;
  const { summary = {}, learningProgress = [], skillBreakdown = [], achievements = [], recommendations = [], charts = {} } = preview;

  const handleAction = (action, reportId) => {
    console.log(`Action ${action} taken for report ${reportId}`);
    // In a real implementation, this would trigger the actual action
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatParameter = (key, value) => {
    const labels = {
      dateRange: 'Date Range',
      includeCharts: 'Include Charts',
      includeRecommendations: 'Include Recommendations'
    };
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    return `${labels[key] || key}: ${displayValue}`;
  };

  return (
    <Card className="report-preview-card" role="region" aria-label="Report preview analytics">
      <div className="card-header">
        <div className="header-content">
          <h3>{report.title || 'Report Preview'}</h3>
          <p>Preview of your learning analytics report</p>
        </div>
        <div className="header-actions">
          {showRefresh && (
            <Button
              onClick={() => mutate()}
              aria-label="Refresh report preview data"
              className="refresh-button"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="card-content">
        {/* Report Metadata */}
        <div className="report-metadata">
          <div className="metadata-grid">
            <div className="metadata-item">
              <span>Generated: {formatDate(report.generatedAt)}</span>
            </div>
            <div className="metadata-item">
              <span>Format: {report.format}</span>
            </div>
            <div className="metadata-item">
              <span>Size: {report.fileSize}</span>
            </div>
            <div className="metadata-item">
              <span>Downloads: {report.downloadCount}</span>
            </div>
          </div>
          <div className="report-parameters">
            {report.parameters && Object.entries(report.parameters).map(([key, value]) => (
              <div key={key} className="parameter-item">
                {formatParameter(key, value)}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="report-summary">
          <div className="metrics-grid">
            <div className="stat-card bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Learning Hours</p>
              <p className="text-3xl font-bold text-blue-700">{summary.totalLearningHours || 0}</p>
            </div>
            <div className="stat-card bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Courses Completed</p>
              <p className="text-3xl font-bold text-green-700">{summary.coursesCompleted || 0}</p>
            </div>
            <div className="stat-card bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Skills Improved</p>
              <p className="text-3xl font-bold text-purple-700">{summary.skillsImproved || 0}</p>
            </div>
            <div className="stat-card bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-orange-700">{summary.averageScore || 0}%</p>
            </div>
            <div className="stat-card bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Progress Rate</p>
              <p className="text-3xl font-bold text-red-700">{summary.progressRate || 0}%</p>
            </div>
            <div className="stat-card bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Engagement Score</p>
              <p className="text-3xl font-bold text-indigo-700">{summary.engagementScore || 0}%</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-section">
          <div className="chart-container">
            <h4>{charts.progressChart?.title || 'Learning Progress Over Time'}</h4>
            <LineChart
              data={charts.progressChart?.data || learningProgress}
              ariaLabel="Learning progress over time"
              className="progress-chart"
            />
          </div>
          <div className="chart-container">
            <h4>{charts.skillChart?.title || 'Skill Development Progress'}</h4>
            <BarChart
              data={charts.skillChart?.data || skillBreakdown}
              ariaLabel="Skill development progress"
              className="skill-chart"
            />
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements-section">
          <h4>Recent Achievements</h4>
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div key={achievement.id} className="achievement-item">
                <div className="achievement-header">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <h5>{achievement.name}</h5>
                </div>
                <p className="achievement-description">{achievement.description}</p>
                <p className="achievement-date">Earned: {formatDate(achievement.earnedAt)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h4>Recommendations</h4>
          <div className="recommendations-grid">
            {recommendations.map(recommendation => (
              <div key={recommendation.id} className="recommendation-item">
                <div className="recommendation-header">
                  <h5>{recommendation.title}</h5>
                  <span className={`priority-badge ${recommendation.priority.toLowerCase()}`}>
                    {recommendation.priority}
                  </span>
                </div>
                <p className="recommendation-description">{recommendation.description}</p>
                <div className="recommendation-meta">
                  <span className="recommendation-category">{recommendation.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Actions */}
        <div className="report-actions">
          <Button
            onClick={() => handleAction('download', reportId)}
            className="action-button primary"
          >
            Download Report
          </Button>
          <Button
            onClick={() => handleAction('share', reportId)}
            className="action-button"
          >
            Share Report
          </Button>
          <Button
            onClick={() => handleAction('regenerate', reportId)}
            className="action-button"
          >
            Regenerate Report
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReportPreview;
