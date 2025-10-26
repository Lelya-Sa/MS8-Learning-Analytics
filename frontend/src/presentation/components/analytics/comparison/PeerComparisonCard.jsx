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
 * PeerComparisonCard Component
 * 
 * Displays user performance compared to peers with skill breakdown,
 * rankings, and personalized recommendations.
 * 
 * @param {Object} props - Component props
 * @param {string} props.userId - User ID
 * @param {string} props.role - Active role
 * @param {boolean} [props.showRefresh=true] - Show refresh button
 * @param {Function} [props.onRefresh] - Refresh callback
 */
const PeerComparisonCard = ({ 
  userId, 
  role, 
  showRefresh = true, 
  onRefresh 
}) => {
  const [chartType, setChartType] = useState('bar');

  // Fetch peer comparison data
  const { data, error, isLoading, mutate } = useSWR(
    `peer-comparison-${userId}-${role}`,
    () => apiClient.get(`/comparison/peer/${userId}`)
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
      <Card className="peer-comparison-card">
        <div className="card-header">
          <h3>Peer Comparison</h3>
          <p>Your performance compared to peers</p>
        </div>
        <div data-testid="loading-skeleton" className="loading-skeleton">
          <Spinner size="large" />
          <p>Loading peer comparison data...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="peer-comparison-card error-state">
        <div className="card-header">
          <h3>Peer Comparison</h3>
          <p>Your performance compared to peers</p>
        </div>
        <div className="error-content">
          <h4>Failed to load peer comparison data</h4>
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

  const peerData = data?.formattedData || data;
  if (!peerData) {
    return (
      <Card className="peer-comparison-card">
        <div className="card-header">
          <h3>Peer Comparison</h3>
          <p>Your performance compared to peers</p>
        </div>
        <div className="no-data">
          <p>No peer comparison data available</p>
        </div>
      </Card>
    );
  }

  const { userPerformance, peerComparison, skillBreakdown, recommendations } = peerData;

  // Prepare chart data
  const chartData = {
    labels: skillBreakdown?.map(skill => skill.skill) || [],
    datasets: [
      {
        label: 'Your Score',
        data: skillBreakdown?.map(skill => skill.userScore) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Peer Average',
        data: skillBreakdown?.map(skill => skill.peerAverage) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="peer-comparison-card" role="region" aria-label="Peer comparison analytics">
      <div className="card-header">
        <div className="header-content">
          <h3>Peer Comparison</h3>
          <p>Your performance compared to peers</p>
        </div>
        <div className="header-actions">
          {showRefresh && (
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              aria-label="Refresh peer comparison data"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="card-content">
        {/* User Performance Metrics */}
        <div className="performance-metrics">
          <div className="metrics-grid">
            <StatCard
              label="Your Score"
              value={userPerformance?.score || 0}
              trend={userPerformance?.change ? { direction: 'up', value: `+${userPerformance.change}%` } : null}
            />
            <StatCard
              label="Peer Average"
              value={peerComparison?.averageScore || 0}
            />
            <StatCard
              label="Top Performer"
              value={peerComparison?.topPerformerScore || 0}
            />
            <StatCard
              label="Your Rank"
              value={`${peerComparison?.userRank || 0} of ${peerComparison?.totalPeers || 0}`}
            />
          </div>
        </div>

        {/* Skill Breakdown Chart */}
        <div className="skill-breakdown">
          <div className="section-header">
            <h4>Skill Breakdown</h4>
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
                ariaLabel="Peer comparison skill breakdown"
              />
            ) : (
              <LineChart
                data={chartData}
                ariaLabel="Peer comparison skill breakdown"
              />
            )}
          </div>

          {/* Skill Details Table */}
          <div className="skill-details">
            <table className="skill-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Your Score</th>
                  <th>Peer Average</th>
                  <th>Percentile</th>
                </tr>
              </thead>
              <tbody>
                {skillBreakdown?.map((skill, index) => (
                  <tr key={index}>
                    <td>{skill.skill}</td>
                    <td>{skill.userScore}</td>
                    <td>{skill.peerAverage}</td>
                    <td>{skill.percentile}th</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="recommendations">
            <h4>Recommendations</h4>
            <ul className="recommendations-list">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="recommendation-item">
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PeerComparisonCard;
