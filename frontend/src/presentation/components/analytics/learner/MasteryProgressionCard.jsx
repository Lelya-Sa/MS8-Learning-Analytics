import React, { useState, useMemo } from 'react';
import { LineChart } from '../../charts/LineChart';
import { BarChart } from '../../charts/BarChart';
import { DataTable } from '../../charts/DataTable';
import StatCard from '../../common/StatCard';
import { Spinner } from '../../common/Spinner';
import { Button } from '../../common/Button';

/**
 * MasteryProgressionCard component displays learner mastery progression analytics
 * 
 * Features:
 * - Overall mastery score with color coding (Beginner: <25%, Intermediate: 25-75%, Advanced: 75-90%, Expert: >90%)
 * - Skill categories with individual mastery levels
 * - Individual skills within each category with trends
 * - Progress indicators showing improvement over time
 * - Mastery milestones (Beginner, Intermediate, Advanced, Expert)
 * - Next milestone progress tracking
 * - Mastery history chart with trend visualization
 * - Expandable/collapsible skill categories
 * - Skill-level progress bars with accessibility
 * - Mastery insights and recommendations
 * - Staleness indicator for data freshness
 * - Loading and error states
 * - Accessibility compliant (WCAG 2.2 AA)
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Mastery progression data
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Mastery progression card component
 */
export const MasteryProgressionCard = ({ 
  data, 
  isLoading = false, 
  error = null, 
  onRetry = () => {},
  className = '' 
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['programming', 'frontend', 'backend']));
  const [viewType, setViewType] = useState('line');

  // Extract data early (before any early returns) to follow Rules of Hooks
  const { 
    overallMastery = 0,
    skillCategories = [],
    masteryHistory = [],
    milestones = [],
    nextMilestone = null,
    lastUpdated,
    isStale = false
  } = data || {};

  // Prepare chart data for LineChart component
  const chartData = useMemo(() => {
    return masteryHistory && Array.isArray(masteryHistory)
      ? masteryHistory.map((point, index) => ({
          x: index,
          y: Math.round((point?.mastery || 0) * 100),
          date: point?.date || '',
          label: point?.date ? new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
        }))
      : [];
  }, [masteryHistory]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`mastery-progression-card loading ${className}`}
        data-testid="mastery-loading"
        role="region"
        aria-labelledby="mastery-title"
      >
        <div className="card-header">
          <h3 id="mastery-title">Mastery Progression</h3>
        </div>
        <div className="card-content">
          <Spinner size="medium" />
          <p>Loading mastery data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`mastery-progression-card error ${className}`}
        data-testid="mastery-error"
        role="region"
        aria-labelledby="mastery-title"
      >
        <div className="card-header">
          <h3 id="mastery-title">Mastery Progression</h3>
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
        className={`mastery-progression-card no-data ${className}`}
        data-testid="mastery-progression-card"
        role="region"
        aria-labelledby="mastery-title"
      >
        <div className="card-header">
          <h3 id="mastery-title">Mastery Progression</h3>
        </div>
        <div className="card-content">
          <p>No mastery data available</p>
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

  const getMasteryLevel = (score) => {
    if (score < 0.25) return 'beginner';
    if (score < 0.75) return 'intermediate';
    if (score < 0.90) return 'advanced';
    return 'expert';
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

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const masteryLevel = getMasteryLevel(overallMastery);
  const masteryPercentage = Math.round(overallMastery * 100);

  return (
    <div 
      className={`mastery-progression-card ${className}`}
      data-testid="mastery-progression-card"
      role="region"
      aria-labelledby="mastery-title"
    >
      <div className="card-header">
        <h3 id="mastery-title">Mastery Progression</h3>
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
        {/* Overall Mastery Score */}
        <div className="mastery-score-section">
          <div className={`mastery-score mastery-${masteryLevel}`}>
            <div className="score-label">Overall Mastery</div>
            <div className="score-value">{masteryPercentage}%</div>
            <div className="score-level">{masteryLevel.charAt(0).toUpperCase() + masteryLevel.slice(1)}</div>
          </div>
        </div>

        {/* Next Milestone Progress */}
        {nextMilestone && (
          <div className="next-milestone-section">
            <h4>Next Milestone: {nextMilestone.name}</h4>
            <div className="milestone-progress">
              <div 
                className="progress-bar"
                role="progressbar"
                aria-valuenow={Math.round(nextMilestone.progress * 100)}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Progress to ${nextMilestone.name} milestone`}
              >
                <div 
                  className="progress-fill"
                  style={{ width: `${nextMilestone.progress * 100}%` }}
                />
              </div>
              <div className="progress-text">
                {Math.round(nextMilestone.remaining * 100)}% to go
              </div>
            </div>
          </div>
        )}

        {/* Skill Categories */}
        <div className="skill-categories-section">
          <h4>Skill Categories</h4>
          {skillCategories.map((category) => (
            <div key={category.id} className="skill-category">
              <div 
                className="category-header"
                onClick={() => toggleCategory(category.id)}
                role="button"
                tabIndex="0"
                aria-expanded={expandedCategories.has(category.id)}
                aria-controls={`category-${category.id}`}
              >
                <div className="category-info">
                  <h5>{category.name}</h5>
                  <div className="category-mastery">
                    <span className="mastery-value">{Math.round(category.mastery * 100)}%</span>
                    <span className="progress-indicator">+{Math.round(category.progress * 100)}%</span>
                  </div>
                </div>
                <button 
                  className="expand-collapse-btn"
                  aria-label={`${expandedCategories.has(category.id) ? 'Collapse' : 'Expand'} ${category.name} skills`}
                >
                  {expandedCategories.has(category.id) ? '−' : '+'}
                </button>
              </div>
              
              {expandedCategories.has(category.id) && (
                <div 
                  id={`category-${category.id}`}
                  className="category-skills"
                >
                  {category.skills.map((skill) => (
                    <div key={skill.id} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className={`trend-indicator ${getTrendColor(skill.trend)}`}>
                          {getTrendIcon(skill.trend)} {skill.trend}
                        </span>
                      </div>
                      <div className="skill-mastery">
                        <div 
                          className="skill-progress-bar"
                          role="progressbar"
                          aria-valuenow={Math.round(skill.mastery * 100)}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label={`${skill.name} mastery level`}
                        >
                          <div 
                            className="skill-progress-fill"
                            style={{ width: `${skill.mastery * 100}%` }}
                          />
                        </div>
                        <span className="skill-mastery-value">{Math.round(skill.mastery * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mastery Milestones */}
        <div className="milestones-section">
          <h4>Mastery Milestones</h4>
          <div className="milestones-grid">
            {milestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className={`milestone-item ${milestone.achieved ? 'achieved' : 'pending'}`}
              >
                <div className="milestone-icon">
                  {milestone.achieved ? '✅' : '⏳'}
                </div>
                <div className="milestone-info">
                  <div className="milestone-name">{milestone.name}</div>
                  <div className="milestone-threshold">{Math.round(milestone.threshold * 100)}%</div>
                  {milestone.achieved && milestone.date && (
                    <div className="milestone-date">
                      Achieved: {new Date(milestone.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mastery History Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h4>Mastery Trend</h4>
            <div className="chart-controls">
              <label htmlFor="mastery-view-type-selector">View:</label>
              <select
                id="mastery-view-type-selector"
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
            className="mastery-chart"
            data-testid="mastery-chart"
            role="img"
            aria-label={`Mastery trend showing ${masteryPercentage}% overall mastery`}
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
                  yAxisLabel="Mastery %"
                  responsive={true}
                />
              </div>
            ) : viewType === 'table' ? (
              <DataTable 
                data={masteryHistory}
                columns={[
                  { key: 'date', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
                  { key: 'mastery', label: 'Mastery %', render: (val) => val ? `${Math.round(val * 100)}%` : '0%' }
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
                  yAxisLabel="Mastery %"
                  responsive={true}
                />
              </div>
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

        {/* Mastery Insights */}
        <div className="insights-section">
          <h4>Mastery Insights</h4>
          <div className="insights-content">
            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <span className="insight-text">
                {masteryLevel === 'expert' 
                  ? 'Expert level achieved! Consider mentoring others.'
                  : masteryLevel === 'advanced'
                  ? 'Advanced mastery! Focus on specialized skills.'
                  : masteryLevel === 'intermediate'
                  ? 'Good progress! Continue building foundational skills.'
                  : 'Keep learning! Focus on core concepts first.'
                }
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📊</span>
              <span className="insight-text">
                {nextMilestone && nextMilestone.remaining < 0.1
                  ? `Very close to ${nextMilestone.name} milestone!`
                  : nextMilestone
                  ? `${Math.round(nextMilestone.remaining * 100)}% more needed for ${nextMilestone.name}`
                  : 'Continue making progress towards your next milestone.'
                }
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">💡</span>
              <span className="insight-text">
                {skillCategories.some(cat => cat.progress > 0.15)
                  ? 'Excellent progress in skill development!'
                  : 'Consider increasing practice time for faster progress.'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h4>Recommendations</h4>
          <ul className="recommendations-list">
            {skillCategories
              .filter(cat => cat.mastery < 0.7)
              .map(cat => (
                <li key={cat.id}>Focus on improving {cat.name} skills</li>
              ))
            }
            {skillCategories
              .flatMap(cat => cat.skills)
              .filter(skill => skill.mastery < 0.5)
              .slice(0, 3)
              .map(skill => (
                <li key={skill.id}>Practice {skill.name} fundamentals</li>
              ))
            }
            {overallMastery >= 0.8 && (
              <li>Consider teaching others to reinforce your knowledge</li>
            )}
            {nextMilestone && nextMilestone.remaining < 0.1 && (
              <li>You're very close to the next milestone - keep going!</li>
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
