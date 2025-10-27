import React, { useState, useMemo } from 'react';
import { LineChart } from '../../charts/LineChart';
import { BarChart } from '../../charts/BarChart';
import { DataTable } from '../../charts/DataTable';
import StatCard from '../../common/StatCard';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';

/**
 * ContentEffectivenessCard component displays learner content effectiveness analytics
 * 
 * Features:
 * - Overall content effectiveness score with color coding (Poor: <60%, Good: 60-80%, Excellent: >80%)
 * - Content types analysis (Video, Reading, Quiz, Discussion) with effectiveness scores
 * - Content completion rates and engagement scores
 * - Content progress indicators (completed/total)
 * - Average ratings for each content type
 * - Top performing and underperforming content identification
 * - Content effectiveness history chart with trend visualization
 * - Content type filtering
 * - Content recommendations with priority levels
 * - Time spent analysis for each content type
 * - Last accessed dates for content types
 * - Staleness indicator for data freshness
 * - Loading and error states
 * - Accessibility compliant (WCAG 2.2 AA)
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Content effectiveness data
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Content effectiveness card component
 */
export const ContentEffectivenessCard = ({ 
  data, 
  isLoading = false, 
  error = null, 
  onRetry = () => {},
  className = '' 
}) => {
  const [selectedContentType, setSelectedContentType] = useState('All');
  const [viewType, setViewType] = useState('line');

  // Extract data early (before any early returns) to follow Rules of Hooks
  const { 
    overallEffectiveness = 0,
    contentTypes = [],
    effectivenessHistory = [],
    topPerformingContent = [],
    underperformingContent = [],
    recommendations = [],
    lastUpdated,
    isStale = false
  } = data || {};

  // Get unique content type names for filtering
  const contentTypeNames = useMemo(() => {
    if (!contentTypes || !Array.isArray(contentTypes)) {
      return ['All'];
    }
    const uniqueTypes = [...new Set(contentTypes
      .filter(contentType => contentType && contentType.name)
      .map(contentType => contentType.name.split(' ')[0]))];
    return ['All', ...uniqueTypes];
  }, [contentTypes]);

  // Filter content types by selected type
  const filteredContentTypes = useMemo(() => {
    if (selectedContentType === 'All') {
      return contentTypes;
    }
    return contentTypes.filter(contentType => contentType.name.toLowerCase().includes(selectedContentType.toLowerCase()));
  }, [contentTypes, selectedContentType]);

  // Prepare chart data for LineChart component
  const chartData = useMemo(() => {
    return effectivenessHistory && Array.isArray(effectivenessHistory) 
      ? effectivenessHistory.map((point, index) => ({
          x: index,
          y: Math.round((point.effectiveness || 0) * 100),
          date: point.date || '',
          label: point.date ? new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
        }))
      : [];
  }, [effectivenessHistory]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`content-effectiveness-card loading ${className}`}
        data-testid="effectiveness-loading"
        role="region"
        aria-labelledby="effectiveness-title"
      >
        <div className="card-header">
          <h3 id="effectiveness-title">Content Effectiveness</h3>
        </div>
        <div className="card-content">
          <Spinner size="medium" />
          <p>Loading content effectiveness data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`content-effectiveness-card error ${className}`}
        data-testid="effectiveness-error"
        role="region"
        aria-labelledby="effectiveness-title"
      >
        <div className="card-header">
          <h3 id="effectiveness-title">Content Effectiveness</h3>
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
        className={`content-effectiveness-card no-data ${className}`}
        data-testid="content-effectiveness-card"
        role="region"
        aria-labelledby="effectiveness-title"
      >
        <div className="card-header">
          <h3 id="effectiveness-title">Content Effectiveness</h3>
        </div>
        <div className="card-content">
          <p>No content effectiveness data available</p>
        </div>
      </div>
    );
  }

  const formatLastUpdated = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getEffectivenessLevel = (score) => {
    if (!score || isNaN(score)) return 'poor';
    if (score < 0.6) return 'poor';
    if (score < 0.8) return 'good';
    return 'excellent';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getContentTypeIcon = (type) => {
    if (!type || typeof type !== 'string') return '📄';
    switch (type.toLowerCase()) {
      case 'video': return '🎥';
      case 'reading': return '📖';
      case 'quiz': return '❓';
      case 'discussion': return '💬';
      default: return '📄';
    }
  };

  const effectivenessLevel = getEffectivenessLevel(overallEffectiveness);
  const effectivenessPercentage = Math.round(overallEffectiveness * 100);

  return (
    <div 
      className={`content-effectiveness-card ${className}`}
      data-testid="content-effectiveness-card"
      role="region"
      aria-labelledby="effectiveness-title"
    >
      <div className="card-header">
        <h3 id="effectiveness-title">Content Effectiveness</h3>
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
        {/* Overall Effectiveness Score */}
        <div className="effectiveness-score-section">
          <div className={`effectiveness-score effectiveness-${effectivenessLevel}`}>
            <div className="score-label">Overall Content Effectiveness</div>
            <div className="score-value">{effectivenessPercentage}%</div>
            <div className="score-level">{effectivenessLevel.charAt(0).toUpperCase() + effectivenessLevel.slice(1)}</div>
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="content-type-filter">
          <div className="filter-label">Filter by Content Type:</div>
          <div className="filter-buttons">
            {contentTypeNames.map((type) => (
              <button
                key={type}
                className={`filter-btn ${selectedContentType === type ? 'active' : ''}`}
                onClick={() => setSelectedContentType(type)}
                role="tab"
                aria-selected={selectedContentType === type}
                tabIndex={selectedContentType === type ? 0 : -1}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Content Types Analysis */}
        <div className="content-types-section">
          <h4>Content Types Analysis</h4>
          <div className="content-types-grid">
            {filteredContentTypes && Array.isArray(filteredContentTypes) && filteredContentTypes.map((contentType) => (
              contentType && <div key={contentType.id || contentType.name} className="content-type-card">
                <div className="content-type-header">
                  <div className="content-type-info">
                    <span className="content-type-icon">{getContentTypeIcon(contentType.name)}</span>
                    <h5>{contentType.name}</h5>
                  </div>
                  <div className="content-type-effectiveness">
                    {Math.round(contentType.effectiveness * 100)}%
                  </div>
                </div>
                <div className="content-type-details">
                  <div className="detail-row">
                    <span className="detail-label">Completion:</span>
                    <span className="detail-value">{Math.round(contentType.completionRate * 100)}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Engagement:</span>
                    <span className="detail-value">{Math.round(contentType.engagementScore * 100)}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Progress:</span>
                    <span className="detail-value">{contentType.completedContent}/{contentType.totalContent}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Rating:</span>
                    <span className="detail-value">{contentType.averageRating}/5</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time Spent:</span>
                    <span className="detail-value">{contentType.timeSpent} min</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Accessed:</span>
                    <span className="detail-value">
                      {new Date(contentType.lastAccessed).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ) || null)}
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="top-performing-section">
          <h4>Top Performing Content</h4>
          <div className="performing-content-list">
            {topPerformingContent.map((content) => (
              <div key={content.id} className="performing-content-item top">
                <div className="content-info">
                  <span className="content-icon">{getContentTypeIcon(content.type)}</span>
                  <div className="content-details">
                    <div className="content-title">{content.title}</div>
                    <div className="content-type">{content.type}</div>
                  </div>
                </div>
                <div className="content-metrics">
                  <div className="effectiveness-score">{Math.round(content.effectiveness * 100)}%</div>
                  <div className="rating-score">{content.rating}/5</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Underperforming Content */}
        <div className="underperforming-section">
          <h4>Underperforming Content</h4>
          <div className="performing-content-list">
            {underperformingContent.map((content) => (
              <div key={content.id} className="performing-content-item underperforming">
                <div className="content-info">
                  <span className="content-icon">{getContentTypeIcon(content.type)}</span>
                  <div className="content-details">
                    <div className="content-title">{content.title}</div>
                    <div className="content-type">{content.type}</div>
                  </div>
                </div>
                <div className="content-metrics">
                  <div className="effectiveness-score">{Math.round(content.effectiveness * 100)}%</div>
                  <div className="rating-score">{content.rating}/5</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Recommendations */}
        <div className="recommendations-section">
          <h4>Content Recommendations</h4>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation-item">
                <div className="recommendation-header">
                  <span className="recommendation-type">{rec.type}</span>
                  <span className={`priority-badge ${getPriorityColor(rec.priority)}`}>
                    {rec.priority ? rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1) : 'High'} Priority
                  </span>
                </div>
                <div className="recommendation-text">{rec.suggestion}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Effectiveness History Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h4>Effectiveness Trend</h4>
            <div className="chart-controls">
              <label htmlFor="effectiveness-view-type-selector">View:</label>
              <select
                id="effectiveness-view-type-selector"
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
            className="effectiveness-chart"
            data-testid="effectiveness-chart"
            role="img"
            aria-label={`Content effectiveness trend showing ${effectivenessPercentage}% overall effectiveness`}
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
                  yAxisLabel="Effectiveness %"
                  responsive={true}
                />
              </div>
            ) : viewType === 'table' ? (
              <DataTable 
                data={effectivenessHistory}
                columns={[
                  { key: 'date', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
                  { key: 'effectiveness', label: 'Effectiveness', render: (val) => val ? `${Math.round(val * 100)}%` : '0%' }
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
                  yAxisLabel="Effectiveness %"
                  responsive={true}
                />
              </div>
            )}
            {viewType === 'line' && chartData.map((point, index) => (
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

        {/* Content Insights */}
        <div className="insights-section">
          <h4>Content Insights</h4>
          <div className="insights-content">
            <div className="insight-item">
              <span className="insight-icon">📊</span>
              <span className="insight-text">
                {effectivenessLevel === 'excellent' 
                  ? 'Excellent content effectiveness! All content types are performing well.'
                  : effectivenessLevel === 'good'
                  ? 'Good content effectiveness. Focus on improving underperforming content types.'
                  : 'Content effectiveness needs improvement. Review and enhance content quality.'
                }
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <span className="insight-text">
                {topPerformingContent.length > underperformingContent.length
                  ? 'More content performing well than poorly - great content strategy!'
                  : 'Focus on improving underperforming content to boost overall effectiveness.'
                }
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📈</span>
              <span className="insight-text">
                {recommendations.filter(rec => rec.priority === 'high').length > 0
                  ? 'High priority recommendations identified - address these first.'
                  : 'All recommendations are manageable - steady content improvement!'
                }
              </span>
            </div>
          </div>
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
