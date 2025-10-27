import React, { useState, useMemo } from 'react';
import { LineChart } from '../../charts/LineChart';
import { BarChart } from '../../charts/BarChart';
import { DataTable } from '../../charts/DataTable';
import StatCard from '../../common/StatCard';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';

/**
 * PerformanceAnalyticsCard component displays learner performance analytics
 * 
 * Features:
 * - Overall performance score with color coding (Poor: <60%, Good: 60-80%, Excellent: >80%)
 * - Assessment results with scores, time spent, and difficulty levels
 * - Performance history chart with trend visualization
 * - Strengths and weaknesses analysis
 * - Improvement areas with priority levels
 * - Assessment filtering by category
 * - Performance insights and recommendations
 * - Staleness indicator for data freshness
 * - Loading and error states
 * - Accessibility compliant (WCAG 2.2 AA)
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Performance analytics data
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Performance analytics card component
 */
export const PerformanceAnalyticsCard = ({ 
  data, 
  isLoading = false, 
  error = null, 
  onRetry = () => {},
  className = '' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewType, setViewType] = useState('line');

  // Extract data early (before any early returns) to follow Rules of Hooks
  const { 
    overallScore = 0,
    assessmentResults = [],
    performanceHistory = [],
    strengths = [],
    weaknesses = [],
    improvementAreas = [],
    lastUpdated,
    isStale = false
  } = data || {};

  // Filter assessments by category
  const filteredAssessments = useMemo(() => {
    if (selectedCategory === 'All') {
      return assessmentResults;
    }
    return assessmentResults.filter(assessment => assessment.category === selectedCategory);
  }, [assessmentResults, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(assessmentResults.map(assessment => assessment.category))];
    return ['All', ...uniqueCategories];
  }, [assessmentResults]);

  // Prepare chart data for LineChart component
  const chartData = useMemo(() => {
    return performanceHistory && Array.isArray(performanceHistory) 
      ? performanceHistory.map((point, index) => ({
          x: index,
          y: Math.round((point?.score || 0) * 100),
          date: point?.date || '',
          label: point?.date ? new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
        }))
      : [];
  }, [performanceHistory]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`performance-analytics-card loading ${className}`}
        data-testid="performance-loading"
        role="region"
        aria-labelledby="performance-title"
      >
        <div className="card-header">
          <h3 id="performance-title">Performance Analytics</h3>
        </div>
        <div className="card-content">
          <Spinner size="medium" />
          <p>Loading performance data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`performance-analytics-card error ${className}`}
        data-testid="performance-error"
        role="region"
        aria-labelledby="performance-title"
      >
        <div className="card-header">
          <h3 id="performance-title">Performance Analytics</h3>
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
        className={`performance-analytics-card no-data ${className}`}
        data-testid="performance-analytics-card"
        role="region"
        aria-labelledby="performance-title"
      >
        <div className="card-header">
          <h3 id="performance-title">Performance Analytics</h3>
        </div>
        <div className="card-content">
          <p>No performance data available</p>
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

  const getPerformanceLevel = (score) => {
    if (score < 0.6) return 'poor';
    if (score < 0.8) return 'good';
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const performanceLevel = getPerformanceLevel(overallScore);
  const performancePercentage = Math.round(overallScore * 100);

  return (
    <div 
      className={`performance-analytics-card ${className}`}
      data-testid="performance-analytics-card"
      role="region"
      aria-labelledby="performance-title"
    >
      <div className="card-header">
        <h3 id="performance-title">Performance Analytics</h3>
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
        {/* Overall Performance Score */}
        <div className="performance-score-section">
          <div className={`performance-score performance-${performanceLevel}`}>
            <div className="score-label">Overall Performance</div>
            <div className="score-value">{performancePercentage}%</div>
            <div className="score-level">{performanceLevel.charAt(0).toUpperCase() + performanceLevel.slice(1)}</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <div className="filter-label">Filter by Category:</div>
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                role="tab"
                aria-selected={selectedCategory === category}
                tabIndex={selectedCategory === category ? 0 : -1}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Assessment Results */}
        <div className="assessments-section">
          <h4>Recent Assessments</h4>
          <div className="assessments-grid">
            {filteredAssessments.map((assessment) => (
              <div key={assessment.id} className="assessment-card">
                <div className="assessment-header">
                  <h5>{assessment.title}</h5>
                  <div className="assessment-score">
                    {Math.round(assessment.score * 100)}%
                  </div>
                </div>
                <div className="assessment-details">
                  <div className="detail-item">
                    <span className="detail-label">Correct:</span>
                    <span className="detail-value">{assessment.correctAnswers}/{assessment.questions}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{assessment.timeSpent} min</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Difficulty:</span>
                    <span className={`detail-value ${getDifficultyColor(assessment.difficulty)}`}>
                      {assessment.difficulty.charAt(0).toUpperCase() + assessment.difficulty.slice(1)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Completed:</span>
                    <span className="detail-value">
                      {new Date(assessment.completedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="strengths-weaknesses-section">
          <div className="strengths-column">
            <h4>Strengths</h4>
            <div className="skills-list">
              {strengths.map((strength, index) => (
                <div key={index} className="skill-item strength">
                  <div className="skill-info">
                    <span className="skill-name">{strength.skill}</span>
                    <span className={`trend-indicator ${getTrendColor(strength.trend)}`}>
                      {getTrendIcon(strength.trend)} {strength.trend}
                    </span>
                  </div>
                  <div className="skill-score">{Math.round(strength.score * 100)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="weaknesses-column">
            <h4>Areas for Improvement</h4>
            <div className="skills-list">
              {weaknesses.map((weakness, index) => (
                <div key={index} className="skill-item weakness">
                  <div className="skill-info">
                    <span className="skill-name">{weakness.skill}</span>
                    <span className={`trend-indicator ${getTrendColor(weakness.trend)}`}>
                      {getTrendIcon(weakness.trend)} {weakness.trend}
                    </span>
                  </div>
                  <div className="skill-score">{Math.round(weakness.score * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Improvement Areas */}
        <div className="improvement-areas-section">
          <h4>Improvement Areas</h4>
          <div className="improvement-list">
            {improvementAreas.map((area, index) => (
              <div key={index} className="improvement-item">
                <div className="improvement-header">
                  <h5>{area.area}</h5>
                  <span className={`priority-badge ${getPriorityColor(area.priority)}`}>
                    {area.priority.charAt(0).toUpperCase() + area.priority.slice(1)} Priority
                  </span>
                </div>
                <div className="improvement-progress">
                  <div 
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow={Math.round(area.currentScore * 100)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`Progress in ${area.area}`}
                  >
                    <div 
                      className="progress-fill"
                      style={{ width: `${area.currentScore * 100}%` }}
                    />
                  </div>
                  <div className="progress-text">
                    {Math.round(area.currentScore * 100)}% → {Math.round(area.targetScore * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance History Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h4>Performance Trend</h4>
            <div className="chart-controls">
              <label htmlFor="performance-view-type-selector">View:</label>
              <select
                id="performance-view-type-selector"
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
            className="performance-chart"
            data-testid="performance-chart"
            role="img"
            aria-label={`Performance trend showing ${performancePercentage}% overall performance`}
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
                  yAxisLabel="Performance %"
                  responsive={true}
                />
              </div>
            ) : viewType === 'table' ? (
              <DataTable 
                data={performanceHistory}
                columns={[
                  { key: 'date', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
                  { key: 'score', label: 'Score', render: (val) => val ? `${Math.round(val * 100)}%` : '0%' }
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
                  yAxisLabel="Performance %"
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

        {/* Performance Insights */}
        <div className="insights-section">
          <h4>Performance Insights</h4>
          <div className="insights-content">
            <div className="insight-item">
              <span className="insight-icon">📊</span>
              <span className="insight-text">
                {performanceLevel === 'excellent' 
                  ? 'Excellent performance! Keep up the great work.'
                  : performanceLevel === 'good'
                  ? 'Good performance. Focus on identified improvement areas.'
                  : 'Performance needs improvement. Focus on fundamentals first.'
                }
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <span className="insight-text">
                {strengths.length > weaknesses.length
                  ? 'More strengths than weaknesses - great foundation!'
                  : 'Focus on building strengths while addressing weaknesses.'
                }
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📈</span>
              <span className="insight-text">
                {improvementAreas.filter(area => area.priority === 'high').length > 0
                  ? 'High priority areas identified - focus on these first.'
                  : 'All improvement areas are manageable - steady progress!'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h4>Recommendations</h4>
          <ul className="recommendations-list">
            {improvementAreas
              .filter(area => area.priority === 'high')
              .map(area => (
                <li key={area.area}>Focus on improving {area.area}</li>
              ))
            }
            {weaknesses
              .filter(weakness => weakness.score < 0.6)
              .slice(0, 2)
              .map(weakness => (
                <li key={weakness.skill}>Practice {weakness.skill} fundamentals</li>
              ))
            }
            {overallScore >= 0.8 && (
              <li>Consider taking on more challenging assessments</li>
            )}
            {performanceHistory.length > 0 && performanceHistory[performanceHistory.length - 1].score > performanceHistory[0].score && (
              <li>Great progress! Continue the upward trend</li>
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
