import React, { useState, useMemo } from 'react';
import { LineChart } from '../../charts/LineChart';
import { BarChart } from '../../charts/BarChart';
import { DataTable } from '../../charts/DataTable';
import { PieChart } from '../../charts/PieChart';
import StatCard from '../../common/StatCard';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';

/**
 * LearningVelocityCard component displays learning velocity and momentum analytics
 * 
 * Features:
 * - Learning velocity display with momentum indicator
 * - Time window selection (7d, 30d, 90d)
 * - Velocity trend chart with historical data
 * - Staleness indicator for data freshness
 * - Loading and error states
 * - Accessibility compliant (WCAG 2.2 AA)
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Learning velocity data
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Learning velocity card component
 */
export const LearningVelocityCard = ({
  data, 
  isLoading = false, 
  error = null, 
  onRetry = () => {},
  className = '' 
}) => {
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('30d');
  const [viewType, setViewType] = useState('line');

  // Extract data early to use in useMemo hooks
  const { 
    velocityHistory = []
  } = data || {};

  // Prepare pie chart data from velocity history - must be before early returns
  const pieChartData = useMemo(() => {
    if (!velocityHistory || !Array.isArray(velocityHistory) || velocityHistory.length === 0) return [];
    
    // Group by velocity ranges for pie chart
    const ranges = [
      { label: 'Low (0-30%)', value: 0, color: '#ef4444' },
      { label: 'Medium (30-70%)', value: 0, color: '#f59e0b' },
      { label: 'High (70-100%)', value: 0, color: '#10b981' }
    ];
    
    velocityHistory.forEach(point => {
      const velocity = point?.velocity || 0;
      if (velocity < 30) ranges[0].value += 1;
      else if (velocity < 70) ranges[1].value += 1;
      else ranges[2].value += 1;
    });
    
    return ranges;
  }, [velocityHistory]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`learning-velocity-card loading ${className}`}
        data-testid="learning-velocity-loading"
        role="region"
        aria-labelledby="learning-velocity-title"
      >
        <div className="card-header">
          <h3 id="learning-velocity-title">Learning Velocity</h3>
        </div>
        <div className="card-content">
          <Spinner size="medium" />
          <p>Loading learning velocity...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`learning-velocity-card error ${className}`}
        data-testid="learning-velocity-error"
        role="region"
        aria-labelledby="learning-velocity-title"
      >
        <div className="card-header">
          <h3 id="learning-velocity-title">Learning Velocity</h3>
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
        className={`learning-velocity-card no-data ${className}`}
        data-testid="learning-velocity-card"
        role="region"
        aria-labelledby="learning-velocity-title"
      >
        <div className="card-header">
          <h3 id="learning-velocity-title">Learning Velocity</h3>
        </div>
        <div className="card-content">
          <p>No velocity data available</p>
        </div>
      </div>
    );
  }

  const { 
    currentVelocity = 0, 
    momentum = 'steady', 
    trend = 'stable', 
    timeWindows = {}, 
    lastUpdated, 
    isStale = false 
  } = data || {};

  const selectedWindowData = timeWindows[selectedTimeWindow];
  const displayVelocity = selectedWindowData?.velocity || currentVelocity;
  const displayMomentum = selectedWindowData?.momentum || momentum;

  const getMomentumClass = (momentumType) => {
    switch (momentumType) {
      case 'accelerating':
        return 'momentum-accelerating';
      case 'slowing':
        return 'momentum-slowing';
      case 'steady':
        return 'momentum-steady';
      default:
        return 'momentum-unknown';
    }
  };

  const getMomentumIcon = (momentumType) => {
    switch (momentumType) {
      case 'accelerating':
        return '↗️';
      case 'slowing':
        return '↘️';
      case 'steady':
        return '→';
      default:
        return '?';
    }
  };

  const formatLastUpdated = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  // Prepare chart data for LineChart component
  const chartData = velocityHistory && Array.isArray(velocityHistory)
    ? velocityHistory.map((point, index) => ({
        x: index, // Use index as x-axis
        y: point?.velocity || 0,
        date: point?.date || '',
        label: point?.date ? new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
      }))
    : [];

  return (
    <div 
      className={`learning-velocity-card ${className}`}
      data-testid="learning-velocity-card"
      role="region"
      aria-labelledby="learning-velocity-title"
    >
      <div className="card-header">
        <h3 id="learning-velocity-title">Learning Velocity</h3>
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
        {/* Main velocity display */}
        <div className="velocity-display">
          <div className="velocity-value">
            <span className="value">{displayVelocity}</span>
            <span className="unit">/100</span>
          </div>
          <div className="momentum-indicator">
            <span 
              className={`momentum-badge ${getMomentumClass(displayMomentum)}`}
              title={`Momentum: ${displayMomentum}`}
            >
              <span className="momentum-icon">{getMomentumIcon(displayMomentum)}</span>
              <span className="momentum-text">{displayMomentum.charAt(0).toUpperCase() + displayMomentum.slice(1)}</span>
            </span>
          </div>
        </div>

        {/* Time window selector */}
        <div className="time-window-selector">
          <div className="selector-label">Time Window:</div>
          <div className="selector-buttons" role="tablist">
            {Object.keys(timeWindows).map(window => (
              <button
                key={window}
                className={`time-window-btn ${selectedTimeWindow === window ? 'active' : ''}`}
                onClick={() => setSelectedTimeWindow(window)}
                role="tab"
                aria-selected={selectedTimeWindow === window}
                aria-controls={`velocity-chart-${window}`}
                data-testid={`time-window-${window}`}
              >
                {window}
              </button>
            ))}
          </div>
        </div>

        {/* View Type Selector */}
        <div className="chart-controls">
          <label htmlFor="velocity-view-type-selector">View:</label>
          <select
            id="velocity-view-type-selector"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            aria-label="Select view type"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="table">Data Table</option>
          </select>
        </div>

        {/* Velocity chart */}
        <div className="velocity-chart-container">
          <div 
            className="chart-wrapper"
            data-testid="velocity-chart"
            role="img"
            aria-label={`Learning velocity trend chart for ${selectedTimeWindow}`}
          >
            {viewType === 'bar' ? (
              <div className="bar-chart-container">
                <BarChart 
                  data={chartData}
                  width={400}
                  height={200}
                  color="#047857"
                  showGrid={true}
                  showTooltip={true}
                  xAxisLabel="Time"
                  yAxisLabel="Velocity"
                  responsive={true}
                />
              </div>
            ) : viewType === 'pie' ? (
              <div className="pie-chart-container">
                <PieChart 
                  data={pieChartData}
                  width={300}
                  height={200}
                  showLegend={true}
                  showPercentages={true}
                  responsive={true}
                />
              </div>
            ) : viewType === 'table' ? (
              <DataTable 
                data={velocityHistory}
                columns={[
                  { key: 'date', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
                  { key: 'velocity', label: 'Velocity', render: (val) => val || 0 }
                ]}
              />
            ) : (
              <div className="line-chart-container">
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
                  yAxisLabel="Velocity"
                  responsive={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Data points for testing */}
        {velocityHistory.map(point => (
          <div 
            key={point.date}
            data-testid={`velocity-point-${point.date}`}
            style={{ display: 'none' }}
          >
            {point.velocity}
          </div>
        ))}

        {/* Last updated info */}
        <div className="last-updated">
          <span className="updated-label">Last updated:</span>
          <span className="updated-time">{formatLastUpdated(lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
};
