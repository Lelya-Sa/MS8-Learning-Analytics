import React, { useState } from 'react';
import useSWR from 'swr';
import Card from '../../common/Card';
import { BarChart } from '../../charts/BarChart';
import { LineChart } from '../../charts/LineChart';
import { DataTable } from '../../charts/DataTable';
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
  const [viewType, setViewType] = useState('bar');

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
    setViewType(event.target.value);
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

  // Extract data from API response: { data: {...}, cached: true, ... }
  const demandData = data?.data || data?.formattedData || data;
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

  // Extract data from backend structure
  const { skillDemand, marketInsights, industryTrends } = demandData;
  
  // Map backend data to frontend expected structure
  const marketTrends = skillDemand || [];
  const userSkillAlignment = {
    overallAlignment: marketTrends.length > 0 ? Math.round(marketTrends[0].demandScore * 100) : 0,
    trend: marketTrends.length > 0 ? Math.round(marketTrends[0].trendPercentage || 0) : 0,
    marketScore: marketTrends.length > 0 ? Math.round(marketTrends[0].demandScore * 100) : 0
  };
  const trendData = marketTrends || [];

  // Prepare chart data - transform to array format expected by custom BarChart
  const chartData = marketTrends.map((trend, index) => ({
    x: index,
    y: Math.round((trend.demandScore || 0) * 100), // Convert to percentage
    label: trend.skillName || `Skill ${index + 1}`
  }));

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
              value={marketTrends?.filter(trend => (trend.demandScore || 0) > 0.8).length || 0}
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
            <StatCard
              label="Growing Skills"
              value={marketTrends?.filter(trend => (trend.trendPercentage || 0) > 15).length || 0}
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
              <label htmlFor="chart-type-selector">View:</label>
              <select
                id="chart-type-selector"
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                aria-label="Select view type"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="table">Data Table</option>
              </select>
            </div>
          </div>
          
          <div className="chart-container">
            {chartData.length === 0 ? (
              <div className="no-data">No chart data available</div>
            ) : viewType === 'bar' ? (
              <BarChart
                data={chartData}
                title="Skill demand trends analysis"
              />
            ) : viewType === 'table' ? (
              <DataTable 
                data={marketTrends || []}
                columns={[
                  { key: 'skillName', label: 'Skill', render: (val) => val || '-' },
                  { key: 'demandScore', label: 'Demand', render: (val) => `${Math.round((val || 0) * 100)}%` },
                  { key: 'trend', label: 'Trend', render: (val) => val || '-' },
                  { key: 'trendPercentage', label: 'Growth', render: (val) => val ? `${val > 0 ? '+' : ''}${val.toFixed(1)}%` : 'N/A' }
                ]}
              />
            ) : (
              <LineChart
                data={chartData}
                title="Skill demand trends analysis"
              />
            )}
          </div>

          {/* Skill Details Table */}
          <div className="skill-details">
            <table className="skill-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Demand Score</th>
                  <th>Trend</th>
                  <th>Growth</th>
                  <th>Job Postings</th>
                  <th>Avg Salary</th>
                </tr>
              </thead>
              <tbody>
                {marketTrends?.map((skill, index) => (
                  <tr key={index}>
                    <td>{skill.skillName}</td>
                    <td>{Math.round((skill.demandScore || 0) * 100)}%</td>
                    <td>
                      <span className={`trend-badge ${skill.trend}`}>
                        {skill.trend}
                      </span>
                    </td>
                    <td>{skill.trendPercentage ? `${skill.trendPercentage > 0 ? '+' : ''}${skill.trendPercentage.toFixed(1)}%` : 'N/A'}</td>
                    <td>{skill.jobPostings || 0}</td>
                    <td>${skill.averageSalary?.toLocaleString() || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Insights */}
        {marketInsights && marketInsights.length > 0 && (
          <div className="recommendations">
            <h4>Market Insights</h4>
            <ul className="insights-list">
              {marketInsights.map((insight, index) => (
                <li key={index} className="insight-item">
                  <strong>{insight.priority || 'Medium'} Priority:</strong> {insight.insight}
                  {insight.recommendation && (
                    <span className="recommendation"> → {insight.recommendation}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SkillDemandCard;
