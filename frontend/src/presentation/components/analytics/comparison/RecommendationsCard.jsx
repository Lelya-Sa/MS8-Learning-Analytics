import React, { useState } from 'react';
import useSWR from 'swr';
import Card from '../../common/Card';
import BarChart from '../../charts/BarChart';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import StatCard from '../../common/StatCard';
import { apiClient } from '../../../../infrastructure/api';

/**
 * RecommendationsCard Component
 * 
 * Displays personalized learning recommendations with AI-driven insights,
 * action items, and progress tracking for optimal learning outcomes.
 * 
 * @param {Object} props - Component props
 * @param {string} props.userId - User ID
 * @param {string} props.role - Active role
 * @param {boolean} [props.showRefresh=true] - Show refresh button
 * @param {Function} [props.onRefresh] - Refresh callback
 */
const RecommendationsCard = ({ 
  userId, 
  role, 
  showRefresh = true, 
  onRefresh 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch recommendations data
  const { data, error, isLoading, mutate } = useSWR(
    `recommendations-${userId}-${role}`,
    () => apiClient.get(`/predictive/recommendations/${userId}`)
  );

  const handleRefresh = async () => {
    await mutate();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleRecommendationAction = (recommendationId, action) => {
    // This would typically call an API to track the action
    console.log(`Action ${action} taken for recommendation ${recommendationId}`);
  };

  if (isLoading) {
    return (
      <Card className="recommendations-card">
        <div className="card-header">
          <h3>AI Recommendations</h3>
          <p>Personalized learning insights and action items</p>
        </div>
        <div data-testid="loading-skeleton" className="loading-skeleton">
          <Spinner size="large" />
          <p>Loading recommendations...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="recommendations-card error-state">
        <div className="card-header">
          <h3>AI Recommendations</h3>
          <p>Personalized learning insights and action items</p>
        </div>
        <div className="error-content">
          <h4>Failed to load recommendations</h4>
          <p>Please try again later</p>
          {showRefresh && (
            <Button onClick={handleRefresh} variant="outline">
              Retry
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const recommendationsData = data?.formattedData || data;
  if (!recommendationsData) {
    return (
      <Card className="recommendations-card">
        <div className="card-header">
          <h3>AI Recommendations</h3>
          <p>Personalized learning insights and action items</p>
        </div>
        <div className="no-data">
          <p>No recommendations available</p>
        </div>
      </Card>
    );
  }

  const { summary, recommendations, categories, insights } = recommendationsData;

  // Filter recommendations by category
  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations?.filter(rec => rec.category === selectedCategory);

  // Prepare chart data for recommendation categories
  const chartData = {
    labels: categories?.map(cat => cat.name) || [],
    datasets: [
      {
        label: 'Recommendations Count',
        data: categories?.map(cat => cat.count) || [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="recommendations-card" role="region" aria-label="AI recommendations analytics">
      <div className="card-header">
        <div className="header-content">
          <h3>AI Recommendations</h3>
          <p>Personalized learning insights and action items</p>
        </div>
        <div className="header-actions">
          {showRefresh && (
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              aria-label="Refresh recommendations data"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="card-content">
        {/* Recommendations Summary */}
        <div className="recommendations-summary">
          <div className="metrics-grid">
            <StatCard
              label="Total Recommendations"
              value={summary?.totalRecommendations || 0}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <StatCard
              label="High Priority"
              value={summary?.highPriorityCount || 0}
              bgColor="bg-red-50"
              textColor="text-red-700"
            />
            <StatCard
              label="Completed"
              value={summary?.completedCount || 0}
              bgColor="bg-green-50"
              textColor="text-green-700"
              trend={summary?.completionRate ? { 
                direction: 'up', 
                value: `${summary.completionRate}%` 
              } : null}
            />
            <StatCard
              label="Success Rate"
              value={`${summary?.successRate || 0}%`}
              bgColor="bg-purple-50"
              textColor="text-purple-700"
            />
          </div>
        </div>

        {/* AI Insights */}
        {insights && insights.length > 0 && (
          <div className="ai-insights">
            <h4>AI Insights</h4>
            <div className="insights-grid">
              {insights.map((insight, index) => (
                <div key={index} className={`insight-card ${insight.type.toLowerCase()}`}>
                  <div className="insight-header">
                    <h5>{insight.title}</h5>
                    <span className={`insight-type ${insight.type.toLowerCase()}`}>
                      {insight.type}
                    </span>
                  </div>
                  <p className="insight-description">{insight.description}</p>
                  <div className="insight-metrics">
                    <span>Confidence: {insight.confidence}%</span>
                    <span>Impact: {insight.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Categories Chart */}
        <div className="recommendations-categories">
          <div className="section-header">
            <h4>Recommendations by Category</h4>
          </div>
          
          <div className="chart-container">
            <BarChart
              data={chartData}
              ariaLabel="Recommendations distribution by category"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <div className="filter-controls">
            <label htmlFor="category-selector">Filter by Category:</label>
            <select
              id="category-selector"
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Select recommendation category"
            >
              <option value="all">All Categories</option>
              {categories?.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="recommendations-list">
          <h4>Personalized Recommendations</h4>
          <div className="recommendations-grid">
            {filteredRecommendations?.map((recommendation, index) => (
              <div key={index} className={`recommendation-card ${recommendation.priority.toLowerCase()}`}>
                <div className="recommendation-header">
                  <div className="recommendation-title">
                    <h5>{recommendation.title}</h5>
                    <span className={`priority-badge ${recommendation.priority.toLowerCase()}`}>
                      {recommendation.priority}
                    </span>
                  </div>
                  <div className="recommendation-meta">
                    <span className="category-tag">{recommendation.category}</span>
                    <span className="confidence-score">{recommendation.confidence}% confidence</span>
                  </div>
                </div>
                
                <p className="recommendation-description">{recommendation.description}</p>
                
                <div className="recommendation-details">
                  <div className="detail-item">
                    <span className="detail-label">Expected Impact:</span>
                    <span className="detail-value">{recommendation.expectedImpact}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time to Complete:</span>
                    <span className="detail-value">{recommendation.timeToComplete}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Difficulty:</span>
                    <span className={`difficulty-badge ${recommendation.difficulty.toLowerCase()}`}>
                      {recommendation.difficulty}
                    </span>
                  </div>
                </div>

                <div className="recommendation-actions">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleRecommendationAction(recommendation.id, 'accept')}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRecommendationAction(recommendation.id, 'dismiss')}
                  >
                    Dismiss
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRecommendationAction(recommendation.id, 'schedule')}
                  >
                    Schedule
                  </Button>
                </div>

                {recommendation.resources && recommendation.resources.length > 0 && (
                  <div className="recommendation-resources">
                    <h6>Resources:</h6>
                    <ul className="resources-list">
                      {recommendation.resources.map((resource, resIndex) => (
                        <li key={resIndex}>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Tracking */}
        {summary?.progressTracking && (
          <div className="progress-tracking">
            <h4>Progress Tracking</h4>
            <div className="progress-grid">
              <div className="progress-card">
                <h5>This Week</h5>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${summary.progressTracking.thisWeek}%` }}
                  ></div>
                  <span className="progress-value">{summary.progressTracking.thisWeek}%</span>
                </div>
              </div>
              
              <div className="progress-card">
                <h5>This Month</h5>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${summary.progressTracking.thisMonth}%` }}
                  ></div>
                  <span className="progress-value">{summary.progressTracking.thisMonth}%</span>
                </div>
              </div>
              
              <div className="progress-card">
                <h5>Overall</h5>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${summary.progressTracking.overall}%` }}
                  ></div>
                  <span className="progress-value">{summary.progressTracking.overall}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecommendationsCard;
