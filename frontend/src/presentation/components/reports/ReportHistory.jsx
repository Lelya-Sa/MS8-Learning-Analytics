import React, { useState } from 'react';
import useSWR from 'swr';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import BarChart from '../charts/BarChart';
import { apiClient } from '../../../infrastructure/api';

export const ReportHistory = ({ userId, role, showRefresh = true, onRefresh }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, error, isLoading, mutate } = useSWR(
    `report-history-${userId}-${role}`,
    () => apiClient.get(`/reports`)
  );

  if (isLoading) {
    return (
      <Card className="report-history-card">
        <div data-testid="loading-skeleton" className="loading-skeleton">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="report-history-card">
        <div className="error-state text-center py-8">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Failed to load report history</h3>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </Card>
    );
  }

  const reportHistory = data || {};
  const { summary = {}, reports = [], reportTypes = [], trends = {} } = reportHistory;

  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    const typeMatch = typeFilter === 'all' || report.type === typeFilter;
    const statusMatch = statusFilter === 'all' || report.status === statusFilter;
    return typeMatch && statusMatch;
  });

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

  const formatFileSize = (size) => {
    if (size === '0 MB') return 'Failed';
    return size;
  };

  return (
    <Card className="report-history-card" role="region" aria-label="Report history analytics">
      <div className="card-header">
        <div className="header-content">
          <h3>Report History</h3>
          <p>Track and manage your generated reports</p>
        </div>
        <div className="header-actions">
          {showRefresh && (
            <Button
              onClick={() => mutate()}
              aria-label="Refresh report history data"
              className="refresh-button"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="card-content">
        {/* Summary Metrics */}
        <div className="report-summary">
          <div className="metrics-grid">
            <div className="stat-card bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-blue-700">{summary.totalReports || 0}</p>
            </div>
            <div className="stat-card bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-green-700">{summary.thisMonth || 0}</p>
            </div>
            <div className="stat-card bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-purple-700">{summary.successRate || 0}%</p>
            </div>
            <div className="stat-card bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Avg. Generation Time</p>
              <p className="text-3xl font-bold text-orange-700">{summary.averageGenerationTime || 0}s</p>
            </div>
          </div>
        </div>

        {/* Report Types Chart */}
        <div className="report-types-chart">
          <h4>Reports by Type</h4>
          <BarChart
            data={reportTypes}
            ariaLabel="Report types distribution"
            className="chart-container"
          />
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="type-filter">Filter Reports:</label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Select report type"
              className="filter-select"
            >
              <option value="all">All Types</option>
              {reportTypes.map(type => (
                <option key={type.name} value={type.name}>
                  {type.name} ({type.count})
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Select report status"
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </div>

        {/* Report List */}
        <div className="report-list">
          <h4>Recent Reports</h4>
          <div className="reports-grid">
            {filteredReports.map(report => (
              <div key={report.id} className="report-item">
                <div className="report-header">
                  <h5>{report.title}</h5>
                  <span className={`status-badge ${report.status}`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
                <div className="report-details">
                  <p className="report-meta">
                    <span>Type: {report.type}</span>
                    <span>Format: {report.format}</span>
                    <span>Size: {formatFileSize(report.fileSize)}</span>
                    <span>Generated: {formatDate(report.generatedAt)}</span>
                  </p>
                  <p className="report-stats">
                    <span>{report.downloadCount} downloads</span>
                    <span>
                      {report.sharedWith.length > 0 
                        ? `Shared with ${report.sharedWith.join(', ')}`
                        : 'Not shared'
                      }
                    </span>
                  </p>
                </div>
                <div className="report-actions">
                  <Button
                    onClick={() => handleAction('download', report.id)}
                    className="action-button"
                    disabled={report.status === 'failed'}
                  >
                    Download
                  </Button>
                  <Button
                    onClick={() => handleAction('share', report.id)}
                    className="action-button"
                  >
                    Share
                  </Button>
                  <Button
                    onClick={() => handleAction('regenerate', report.id)}
                    className="action-button"
                  >
                    Regenerate
                  </Button>
                  <Button
                    onClick={() => handleAction('delete', report.id)}
                    className="action-button danger"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generation Trends */}
        <div className="generation-trends">
          <h4>Generation Trends</h4>
          <div className="trends-grid">
            <div className="trend-section">
              <h5>Monthly Generation</h5>
              <div className="trend-data">
                {trends.monthlyGeneration?.map(trend => (
                  <div key={trend.month} className="trend-item">
                    <span className="trend-month">{trend.month}</span>
                    <span className="trend-count">{trend.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="trend-section">
              <h5>Format Distribution</h5>
              <div className="trend-data">
                {trends.formatDistribution?.map(format => (
                  <div key={format.format} className="trend-item">
                    <span className="trend-format">{format.format}</span>
                    <span className="trend-count">{format.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReportHistory;
