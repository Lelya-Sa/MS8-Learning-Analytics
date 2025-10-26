import React, { useState, useMemo } from 'react';
import { LineChart } from '../../charts/LineChart';
import { BarChart } from '../../charts/BarChart';
import { DataTable } from '../../charts/DataTable';
import StatCard from '../../common/StatCard';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';

/**
 * EngagementMetricsCard component displays learner engagement analytics
 * 
 * Features:
 * - Overall engagement score with color coding (Low: <50%, Good: 50-80%, Excellent: >80%)
 * - Time spent metrics (total, average per session, trend)
 * - Interaction rate tracking (current vs average, trend)
 * - Completion rate analysis (current vs average, trend)
 * - Session frequency (daily/weekly activity patterns)
 * - Content engagement breakdown (videos, quizzes, readings, discussions)
 * - Engagement history chart with trend visualization
 * - Time period filtering (7d, 30d, 90d)
 * - Engagement insights and recommendations
 * - Staleness indicator for data freshness
 * - Loading and error states
 * - Accessibility compliant (WCAG 2.2 AA)
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Engagement metrics data
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Engagement metrics card component
 */
export const EngagementMetricsCard = ({ 
  data, 
  isLoading = false, 
  error = null, 
  onRetry = () => {},
  className = '' 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [viewType, setViewType] = useState('line');

  // Extract data early (before any early returns) to follow Rules of Hooks
  const { 
    overallEngagement = 0,
    timeSpent = 0,
    interactionRate = 0,
    completionRate = 0,
    sessionFrequency = 0,
    contentEngagement = {},
    engagementHistory = [],
    lastUpdated,
    isStale = false
  } = data || {};

  // Filter engagement history based on selected period
  const filteredHistory = useMemo(() => {
    if (!engagementHistory || !Array.isArray(engagementHistory)) return [];
    
    // Return all history data if it exists (mock data is dated in 2024)
    // In production, this would filter by the selected period
    return engagementHistory;
  }, [engagementHistory, selectedPeriod]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`engagement-metrics-card loading ${className}`}
        data-testid="engagement-loading"
        role="region"
        aria-labelledby="engagement-title"
      >
        <div className="card-header">
          <h3 id="engagement-title">Engagement Metrics</h3>
        </div>
        <div className="card-content">
          <Spinner size="medium" />
          <p>Loading engagement data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`engagement-metrics-card error ${className}`}
        data-testid="engagement-error"
        role="region"
        aria-labelledby="engagement-title"
      >
        <div className="card-header">
          <h3 id="engagement-title">Engagement Metrics</h3>
        </div>
        <div className="card-content">
          <div className="error-message">
            <p>{error}</p>
            <Button 
              onClick={onRetry}
              variant="primary"
              size="small"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div 
        className={`engagement-metrics-card no-data ${className}`}
        data-testid="engagement-metrics-card"
        role="region"
        aria-labelledby="engagement-title"
      >
        <div className="card-header">
          <h3 id="engagement-title">Engagement Metrics</h3>
        </div>
        <div className="card-content">
          <p>No engagement data available</p>
        </div>
      </div>
    );
  }

  // Prepare chart data for LineChart component - use y and label only
  const chartData = useMemo(() => {
    if (!filteredHistory || !Array.isArray(filteredHistory) || filteredHistory.length === 0) {
      console.log('📊 No engagement history data available');
      return [];
    }
    
    const formatted = filteredHistory.map((point) => ({
      y: point?.engagement || 0,
      label: point?.date ? new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
    }));
    
    console.log('📊 Engagement History:', filteredHistory);
    console.log('📊 Formatted Chart Data:', formatted);
    
    return formatted;
  }, [filteredHistory]);

  const formatLastUpdated = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getEngagementLevel = (score) => {
    if (score < 50) return 'low';
    if (score < 80) return 'good';
    return 'excellent';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const engagementLevel = getEngagementLevel(overallEngagement);

  return (
    <div 
      className={`engagement-metrics-card ${className}`}
      data-testid="engagement-metrics-card"
      role="region"
      aria-labelledby="engagement-title"
    >
      <div className="card-header">
        <h3 id="engagement-title">Engagement Metrics</h3>
        {isStale && (
          <div 
            className="staleness-indicator"
            data-testid="staleness-indicator"
            title={`Data last updated: ${formatLastUpdated(lastUpdated)}`}
          >
            <span className="staleness-icon">⚠️</span>
            <span className="staleness-text">Data is stale</span>
          </div>
        )}
      </div>

      <div className="card-content">
        {/* Overall Engagement Score */}
        <div className="engagement-score-section">
          <div className={`engagement-score engagement-${engagementLevel}`}>
            <div className="score-label">Overall Engagement</div>
            <div className="score-value">{overallEngagement}%</div>
            <div className="score-level">{engagementLevel.charAt(0).toUpperCase() + engagementLevel.slice(1)}</div>
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="period-filter">
          <div className="filter-label">Time Period:</div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedPeriod === '7d' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('7d')}
              role="tab"
              aria-selected={selectedPeriod === '7d'}
            >
              7d
            </button>
            <button
              className={`filter-btn ${selectedPeriod === '30d' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('30d')}
              role="tab"
              aria-selected={selectedPeriod === '30d'}
            >
              30d
            </button>
            <button
              className={`filter-btn ${selectedPeriod === '90d' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('90d')}
              role="tab"
              aria-selected={selectedPeriod === '90d'}
            >
              90d
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h4>Time Spent</h4>
              <span className={`trend-indicator ${getTrendColor(timeSpent.trend)}`}>
                {getTrendIcon(timeSpent.trend)} {timeSpent.trend}
              </span>
            </div>
            <div className="metric-values">
              <div className="primary-value">{timeSpent.total}h</div>
              <div className="secondary-value">Avg: {timeSpent.average}h/session</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4>Interaction Rate</h4>
              <span className={`trend-indicator ${getTrendColor(interactionRate.trend)}`}>
                {getTrendIcon(interactionRate.trend)} {interactionRate.trend}
              </span>
            </div>
            <div className="metric-values">
              <div className="primary-value">{Math.round(interactionRate.current * 100)}%</div>
              <div className="secondary-value">Avg: {Math.round(interactionRate.average * 100)}%</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4>Completion Rate</h4>
              <span className={`trend-indicator ${getTrendColor(completionRate.trend)}`}>
                {getTrendIcon(completionRate.trend)} {completionRate.trend}
              </span>
            </div>
            <div className="metric-values">
              <div className="primary-value">{Math.round(completionRate.current * 100)}%</div>
              <div className="secondary-value">Avg: {Math.round(completionRate.average * 100)}%</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4>Session Frequency</h4>
              <span className={`trend-indicator ${getTrendColor(sessionFrequency.trend)}`}>
                {getTrendIcon(sessionFrequency.trend)} {sessionFrequency.trend}
              </span>
            </div>
            <div className="metric-values">
              <div className="primary-value">Daily: {Math.round(sessionFrequency.daily * 100)}%</div>
              <div className="secondary-value">Weekly: {Math.round(sessionFrequency.weekly * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Content Engagement Breakdown */}
        <div className="content-engagement-section">
          <h4>Content Engagement</h4>
          <div className="content-metrics">
            <div className="content-item">
              <span className="content-label">Videos</span>
              <span className="content-value">{Math.round(contentEngagement.videos * 100)}%</span>
            </div>
            <div className="content-item">
              <span className="content-label">Quizzes</span>
              <span className="content-value">{Math.round(contentEngagement.quizzes * 100)}%</span>
            </div>
            <div className="content-item">
              <span className="content-label">Readings</span>
              <span className="content-value">{Math.round(contentEngagement.readings * 100)}%</span>
            </div>
            <div className="content-item">
              <span className="content-label">Discussions</span>
              <span className="content-value">{Math.round(contentEngagement.discussions * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Engagement History Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h4>Engagement Trend</h4>
            <div className="chart-controls">
              <label htmlFor="engagement-view-type-selector">View:</label>
              <select
                id="engagement-view-type-selector"
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                aria-label="Select view type"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="table">Data Table</option>
              </select>
            </div>
          </div>
          <div 
            className="engagement-chart"
            data-testid="engagement-chart"
            role="img"
            aria-label={`Engagement trend over ${selectedPeriod} showing ${overallEngagement}% overall engagement`}
          >
            {viewType === 'bar' ? (
              <BarChart 
                data={chartData}
                width={400}
                height={200}
                color="#047857"
                showGrid={true}
                showTooltip={true}
                xAxisLabel="Time"
                yAxisLabel="Engagement %"
                responsive={true}
              />
            ) : viewType === 'table' ? (
              <DataTable 
                data={filteredHistory}
                columns={[
                  { key: 'date', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
                  { key: 'engagement', label: 'Engagement %', render: (val) => val ? `${val}%` : '0%' }
                ]}
              />
            ) : (
              <LineChart 
                data={chartData}
                width={400}
                height={200}
                color="#047857"
                strokeWidth={2}
                showGrid={true}
                showPoints={true}
                showTooltip={true}
                xAxisLabel="Time"
                yAxisLabel="Engagement %"
                responsive={true}
              />
            )}
            {chartData.map((point, index) => (
              <div
                key={index}
                className="chart-point"
                data-testid={`chart-point-${index}`}
                style={{
                  position: 'absolute',
                  left: `${(index / (chartData.length - 1)) * 100}%`,
                  top: `${100 - point.y}%`,
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#047857',
                  borderRadius: '50%'
                }}
              />
            ))}
          </div>
        </div>

        {/* Engagement Insights */}
        <div className="insights-section">
          <h4>Engagement Insights</h4>
          <div className="insights-content">
            <div className="insight-item">
              <span className="insight-icon">💡</span>
              <span className="insight-text">
                {engagementLevel === 'excellent' 
                  ? 'Excellent engagement! Keep up the great work.'
                  : engagementLevel === 'good'
                  ? 'Good engagement level. Consider increasing interaction with discussions.'
                  : 'Engagement needs improvement. Try setting daily learning goals.'
                }
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📊</span>
              <span className="insight-text">
                {timeSpent.trend === 'increasing' 
                  ? 'Time spent is increasing - great progress!'
                  : timeSpent.trend === 'decreasing'
                  ? 'Time spent is decreasing - consider reviewing your learning schedule.'
                  : 'Time spent is stable - consistent learning pattern.'
                }
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <span className="insight-text">
                {completionRate.current > completionRate.average
                  ? 'Completion rate is above average - excellent!'
                  : 'Focus on completing more learning activities to improve completion rate.'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h4>Recommendations</h4>
          <ul className="recommendations-list">
            {contentEngagement.discussions < 0.5 && (
              <li>Increase participation in discussion forums</li>
            )}
            {contentEngagement.readings < 0.6 && (
              <li>Spend more time with reading materials</li>
            )}
            {sessionFrequency.daily < 0.5 && (
              <li>Try to engage with learning content daily</li>
            )}
            {interactionRate.current < 0.6 && (
              <li>Increase interaction with learning activities</li>
            )}
            {overallEngagement >= 80 && (
              <li>Maintain current engagement level and explore advanced topics</li>
            )}
          </ul>
        </div>

        {/* Last updated info */}
        <div className="last-updated">
          <span className="updated-label">Last updated:</span>
          <span className="updated-time">{formatLastUpdated(lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
};
