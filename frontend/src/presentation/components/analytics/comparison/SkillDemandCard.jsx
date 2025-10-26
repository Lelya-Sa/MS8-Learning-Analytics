import React, { useState } from 'react';
import useSWR from 'swr';
import Card from '../../common/Card';
import BarChart from '../../charts/BarChart';
import LineChart from '../../charts/LineChart';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import StatCard from '../../common/StatCard';
import { apiClient } from '../../../../infrastructure/api';

/**
 * SkillDemandCard Component
 * 
 * Displays skill demand analysis with market trends, growth projections,
 * and personalized skill recommendations based on industry demand.
 * 
 * @param {Object} props - Component props
 * @param {string} props.userId - User ID
 * @param {string} props.role - Active role
 * @param {boolean} [props.showRefresh=true] - Show refresh button
 * @param {Function} [props.onRefresh] - Refresh callback
 */
const SkillDemandCard = ({ 
  userId, 
  role, 
  showRefresh = true, 
  onRefresh 
}) => {
  const [chartType, setChartType] = useState('bar');

  // Fetch skill demand data
  const { data, error, isLoading, mutate } = useSWR(
    `skill-demand-${userId}-${role}`,
    () => apiClient.get(`/comparison/skill-demand`)
  );

  const handleRefresh = async () => {
    await mutate();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  if (isLoading) {
    return (
      <Card className="skill-demand-card">
        <div className="card-header">
          <h3>Skill Demand Analysis</h3>
          <p>Market trends and skill recommendations</p>
        </div>
        <div data-testid="loading-skeleton" className="loading-skeleton">
          <Spinner size="large" />
          <p>Loading skill demand data...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="skill-demand-card error-state">
        <div className="card-header">
          <h3>Skill Demand Analysis</h3>
          <p>Market trends and skill recommendations</p>
        </div>
        <div className="error-content">
          <h4>Failed to load skill demand data</h4>
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

  const demandData = data?.formattedData || data;
  if (!demandData) {
    return (
      <Card className="skill-demand-card">
        <div className="card-header">
          <h3>Skill Demand Analysis</h3>
          <p>Market trends and skill recommendations</p>
        </div>
        <div className="no-data">
          <p>No skill demand data available</p>
        </div>
      </Card>
    );
  }

  const { marketTrends, skillRecommendations, growthProjections, userSkillAlignment } = demandData;

  // Prepare chart data for skill demand trends
  const chartData = {
    labels: marketTrends?.map(trend => trend.skill) || [],
    datasets: [
      {
        label: 'Current Demand',
        data: marketTrends?.map(trend => trend.currentDemand) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Projected Growth',
        data: marketTrends?.map(trend => trend.projectedGrowth) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="skill-demand-card" role="region" aria-label="Skill demand analytics">
      <div className="card-header">
        <div className="header-content">
          <h3>Skill Demand Analysis</h3>
          <p>Market trends and skill recommendations</p>
        </div>
        <div className="header-actions">
          {showRefresh && (
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              aria-label="Refresh skill demand data"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="card-content">
        {/* Market Overview Metrics */}
        <div className="market-overview">
          <div className="metrics-grid">
            <StatCard
              label="High Demand Skills"
              value={marketTrends?.filter(trend => trend.currentDemand > 80).length || 0}
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
            <StatCard
              label="Growing Skills"
              value={marketTrends?.filter(trend => trend.projectedGrowth > 15).length || 0}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <StatCard
              label="Your Alignment"
              value={`${userSkillAlignment?.overallAlignment || 0}%`}
              bgColor="bg-purple-50"
              textColor="text-purple-700"
              trend={userSkillAlignment?.trend ? { 
                direction: userSkillAlignment.trend > 0 ? 'up' : 'down', 
                value: `${userSkillAlignment.trend > 0 ? '+' : ''}${userSkillAlignment.trend}%` 
              } : null}
            />
            <StatCard
              label="Market Score"
              value={userSkillAlignment?.marketScore || 0}
              bgColor="bg-orange-50"
              textColor="text-orange-700"
            />
          </div>
        </div>

        {/* Skill Demand Trends Chart */}
        <div className="skill-trends">
          <div className="section-header">
            <h4>Skill Demand Trends</h4>
            <div className="chart-controls">
              <label htmlFor="chart-type-selector">Chart Type:</label>
              <select
                id="chart-type-selector"
                value={chartType}
                onChange={handleChartTypeChange}
                aria-label="Select chart type"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>
          
          <div className="chart-container">
            {chartType === 'bar' ? (
              <BarChart
                data={chartData}
                ariaLabel="Skill demand trends analysis"
              />
            ) : (
              <LineChart
                data={chartData}
                ariaLabel="Skill demand trends analysis"
              />
            )}
          </div>

          {/* Skill Details Table */}
          <div className="skill-details">
            <table className="skill-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Current Demand</th>
                  <th>Projected Growth</th>
                  <th>Your Level</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {marketTrends?.map((trend, index) => (
                  <tr key={index}>
                    <td>{trend.skill}</td>
                    <td>{trend.currentDemand}%</td>
                    <td>{trend.projectedGrowth}%</td>
                    <td>{trend.userLevel || 'Beginner'}</td>
                    <td>
                      <span className={`recommendation-badge ${trend.recommendation === 'Learn' ? 'learn' : trend.recommendation === 'Improve' ? 'improve' : 'maintain'}`}>
                        {trend.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Skill Recommendations */}
        {skillRecommendations && skillRecommendations.length > 0 && (
          <div className="recommendations">
            <h4>Personalized Recommendations</h4>
            <div className="recommendations-grid">
              {skillRecommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-card">
                  <div className="recommendation-header">
                    <h5>{recommendation.skill}</h5>
                    <span className={`priority-badge ${recommendation.priority.toLowerCase()}`}>
                      {recommendation.priority}
                    </span>
                  </div>
                  <p className="recommendation-description">{recommendation.description}</p>
                  <div className="recommendation-metrics">
                    <span>Demand: {recommendation.demand}%</span>
                    <span>Growth: {recommendation.growth}%</span>
                    <span>ROI: {recommendation.roi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Growth Projections */}
        {growthProjections && (
          <div className="growth-projections">
            <h4>Growth Projections</h4>
            <div className="projections-grid">
              {Object.entries(growthProjections).map(([timeframe, projection]) => (
                <div key={timeframe} className="projection-card">
                  <h5>{timeframe}</h5>
                  <div className="projection-metrics">
                    <div className="metric">
                      <span className="metric-label">Market Growth</span>
                      <span className="metric-value">{projection.marketGrowth}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Skill Gap</span>
                      <span className="metric-value">{projection.skillGap}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Opportunity</span>
                      <span className="metric-value">{projection.opportunity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SkillDemandCard;
