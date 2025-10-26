import React, { useState, useMemo } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Spinner } from '../../common/Spinner';

/**
 * SkillGapMatrixCard component displays skill gap analysis with heatmap visualization
 * 
 * Features:
 * - Skill gap matrix with current vs target levels (0-4 scale)
 * - Priority scoring: Gap (25%) + Business (30%) + Market (20%) + Prerequisites (15%) + Career (10%)
 * - Critical gap highlighting (≥2 levels OR priority ≥80)
 * - Heatmap visualization of skills
 * - Category filtering
 * - Detailed skill analysis modal
 * - Export functionality (PDF/CSV)
 * - Staleness indicator for data freshness
 * - Loading and error states
 * - Accessibility compliant (WCAG 2.2 AA)
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Skill gap data
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {Function} [props.onExport] - Export callback
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Skill gap matrix card component
 */
export const SkillGapMatrixCard = ({ 
  data, 
  isLoading = false, 
  error = null, 
  onRetry = () => {},
  onExport = () => {},
  className = '' 
}) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);

  // Extract data early (before any early returns) to follow Rules of Hooks
  const { 
    skills = [], 
    categories = [], 
    lastUpdated, 
    isStale = false 
  } = data || {};

  // Filter skills by category
  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') return skills;
    return skills.filter(skill => skill.category === selectedCategory);
  }, [skills, selectedCategory]);

  // Calculate critical skills
  const criticalSkills = useMemo(() => {
    return skills.filter(skill => skill.isCritical);
  }, [skills]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`skill-gap-matrix-card loading ${className}`}
        data-testid="skill-gap-loading"
        role="region"
        aria-labelledby="skill-gap-title"
      >
        <div className="card-header">
          <h3 id="skill-gap-title">Skill Gap Matrix</h3>
        </div>
        <div className="card-content">
          <Spinner size="medium" />
          <p>Loading skill gap data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`skill-gap-matrix-card error ${className}`}
        data-testid="skill-gap-error"
        role="region"
        aria-labelledby="skill-gap-title"
      >
        <div className="card-header">
          <h3 id="skill-gap-title">Skill Gap Matrix</h3>
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
        className={`skill-gap-matrix-card no-data ${className}`}
        data-testid="skill-gap-matrix-card"
        role="region"
        aria-labelledby="skill-gap-title"
      >
        <div className="card-header">
          <h3 id="skill-gap-title">Skill Gap Matrix</h3>
        </div>
        <div className="card-content">
          <p>No skill gap data available</p>
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

  const getGapColor = (gap, priority) => {
    if (gap >= 2 || priority >= 80) return 'critical';
    if (gap >= 1 || priority >= 60) return 'high';
    if (gap > 0 || priority >= 40) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority) => {
    if (priority >= 80) return 'critical';
    if (priority >= 60) return 'high';
    if (priority >= 40) return 'medium';
    return 'low';
  };

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
  };

  const handleSkillKeyDown = (event, skill) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSkillClick(skill);
    }
  };

  const handleExport = (format) => {
    onExport(format, filteredSkills);
    setShowExportModal(false);
  };

  return (
    <div 
      className={`skill-gap-matrix-card ${className}`}
      data-testid="skill-gap-matrix-card"
      role="region"
      aria-labelledby="skill-gap-title"
    >
      <div className="card-header">
        <h3 id="skill-gap-title">Skill Gap Matrix</h3>
        <div className="card-actions">
          <Button 
            onClick={() => setShowExportModal(true)}
            variant="secondary"
            size="small"
          >
            Export
          </Button>
        </div>
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
        {/* Category Filter */}
        <div className="category-filter">
          <div className="filter-label">Filter by Category:</div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All ({skills.length})
            </button>
            {categories.map(category => {
              const count = skills.filter(skill => skill.category === category).length;
              return (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              className={`skill-item ${getGapColor(skill.gap, skill.priority)}`}
              data-testid={`skill-${skill.isCritical ? 'critical' : 'normal'}-${skill.id}`}
              onClick={() => handleSkillClick(skill)}
              onKeyDown={(e) => handleSkillKeyDown(e, skill)}
              role="button"
              tabIndex={0}
              aria-label={`${skill.name} - Gap: ${skill.gap}, Priority: ${skill.priority}%`}
            >
              <div className="skill-header">
                <h4 className="skill-name">{skill.name}</h4>
                <span className="skill-category">{skill.category}</span>
              </div>
              
              <div className="skill-levels">
                <div className="level-display">
                  <span className="current-level">{skill.currentLevel}</span>
                  <span className="separator">/</span>
                  <span className="target-level">{skill.targetLevel}</span>
                </div>
                <div className="gap-info">
                  <span className="gap-label">Gap: {skill.gap}</span>
                </div>
              </div>

              <div className="priority-display">
                <div className={`priority-bar ${getPriorityColor(skill.priority)}`}>
                  <div 
                    className="priority-fill"
                    style={{ width: `${skill.priority}%` }}
                  />
                </div>
                <span className="priority-text">Priority: {skill.priority}%</span>
              </div>

              {skill.isCritical && (
                <div className="critical-indicator">
                  <span className="critical-icon">⚠️</span>
                  <span className="critical-text">Critical</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Heatmap Visualization */}
        <div className="heatmap-section">
          <h4>Skills Heatmap</h4>
          <div 
            className="heatmap-grid"
            data-testid="skill-heatmap"
            role="img"
            aria-label="Skills heatmap showing gap levels and priorities"
          >
            {filteredSkills.map(skill => (
              <div
                key={`heatmap-${skill.id}`}
                className={`heatmap-cell ${getGapColor(skill.gap, skill.priority)}`}
                data-testid={`heatmap-cell-${skill.id}`}
                title={`${skill.name}: Gap ${skill.gap}, Priority ${skill.priority}%`}
              />
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Skills:</span>
            <span className="stat-value">{skills.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Critical Gaps:</span>
            <span className="stat-value critical">{criticalSkills.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Priority:</span>
            <span className="stat-value">
              {Math.round(skills.reduce((sum, skill) => sum + skill.priority, 0) / skills.length)}%
            </span>
          </div>
        </div>

        {/* Last updated info */}
        <div className="last-updated">
          <span className="updated-label">Last updated:</span>
          <span className="updated-time">{formatLastUpdated(lastUpdated)}</span>
        </div>
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSkill(null)}
          title={`${selectedSkill.name} - Gap Analysis`}
          data-testid="skill-detail-modal"
        >
          <div className="skill-detail-content">
            <div className="skill-overview">
              <h4>Skill Overview</h4>
              <div className="overview-grid">
                <div className="overview-item">
                  <span className="label">Current Level:</span>
                  <span className="value">{selectedSkill.currentLevel}/4</span>
                </div>
                <div className="overview-item">
                  <span className="label">Target Level:</span>
                  <span className="value">{selectedSkill.targetLevel}/4</span>
                </div>
                <div className="overview-item">
                  <span className="label">Gap:</span>
                  <span className="value">{selectedSkill.gap} levels</span>
                </div>
                <div className="overview-item">
                  <span className="label">Priority Score:</span>
                  <span className="value">{selectedSkill.priority}%</span>
                </div>
              </div>
            </div>

            <div className="priority-breakdown">
              <h4>Priority Breakdown</h4>
              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <span className="label">Business Impact:</span>
                  <span className="value">{selectedSkill.businessImpact}%</span>
                </div>
                <div className="breakdown-item">
                  <span className="label">Market Demand:</span>
                  <span className="value">{selectedSkill.marketDemand}%</span>
                </div>
                <div className="breakdown-item">
                  <span className="label">Prerequisites:</span>
                  <span className="value">{selectedSkill.prerequisites}%</span>
                </div>
                <div className="breakdown-item">
                  <span className="label">Career Value:</span>
                  <span className="value">{selectedSkill.careerValue}%</span>
                </div>
              </div>
            </div>

            <div className="recommendations">
              <h4>Recommendations</h4>
              <ul>
                <li>Focus on closing the {selectedSkill.gap}-level gap</li>
                <li>High priority skill - consider immediate attention</li>
                <li>Strong business impact - aligns with company goals</li>
                <li>Market demand indicates good career investment</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowExportModal(false)}
          title="Export Format"
        >
          <div className="export-options">
            <p>Choose export format for skill gap data:</p>
            <div className="export-buttons">
              <Button 
                onClick={() => handleExport('pdf')}
                variant="primary"
              >
                Export as PDF
              </Button>
              <Button 
                onClick={() => handleExport('csv')}
                variant="secondary"
              >
                Export as CSV
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
