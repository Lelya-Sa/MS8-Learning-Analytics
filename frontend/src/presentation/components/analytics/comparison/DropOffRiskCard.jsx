import React, { useState, useMemo } from 'react';
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
 * DropOffRiskCard Component
 * 
 * Displays learner drop-off risk analysis with early warning indicators,
 * engagement patterns, and intervention recommendations.
 * 
 * @param {Object} props - Component props
 * @param {string} props.userId - User ID
 * @param {string} props.role - Active role
 * @param {boolean} [props.showRefresh=true] - Show refresh button
 * @param {Function} [props.onRefresh] - Refresh callback
 */
const DropOffRiskCard = ({ 
  userId, 
  role, 
  showRefresh = true, 
  onRefresh 
}) => {
  const [viewType, setViewType] = useState('bar');

  // Fetch drop-off risk data
  const { data, error, isLoading, mutate } = useSWR(
    `dropoff-risk-${userId}-${role}`,
    () => apiClient.get(`/predictive/drop-off-risk/${userId}`)
  );

  // Extract risk data early to use in useMemo
  const riskData = data?.data || data;
  const { riskAssessment, engagementPatterns, warningSignals, interventionRecommendations } = riskData || {};

  // Prepare chart data for engagement patterns - convert to array format
  // MUST be called before any early returns to follow Rules of Hooks
  const chartData = useMemo(() => {
    if (!engagementPatterns || engagementPatterns.length === 0) return [];
    
    const formattedData = engagementPatterns.map((pattern, index) => ({
      y: pattern.engagementScore || 0,
      label: pattern.week || `Week ${index + 1}`
    }));
    
    return formattedData;
  }, [engagementPatterns]);

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
      <Card className="dropoff-risk-card">
        <div className="card-header">
          <h3>Drop-off Risk Analysis</h3>
          <p>Early warning indicators and intervention strategies</p>
        </div>
        <div data-testid="loading-skeleton" className="loading-skeleton">
          <Spinner size="large" />
          <p>Loading drop-off risk data...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="dropoff-risk-card error-state">
        <div className="card-header">
          <h3>Drop-off Risk Analysis</h3>
          <p>Early warning indicators and intervention strategies</p>
        </div>
        <div className="error-content">
          <h4>Failed to load drop-off risk data</h4>
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

  // Check if we have risk data to display
  if (!riskData) {
    return (
      <Card className="dropoff-risk-card">
        <div className="card-header">
          <h3>Drop-off Risk Analysis</h3>
          <p>Early warning indicators and intervention strategies</p>
        </div>
        <div className="no-data">
          <p>No drop-off risk data available</p>
        </div>
      </Card>
    );
  }

  const getRiskLevel = (riskScore) => {
    if (riskScore >= 80) return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (riskScore >= 60) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const riskLevel = getRiskLevel(riskAssessment?.overallRisk || 0);

  return (
    <Card className="dropoff-risk-card" role="region" aria-label="Drop-off risk analytics">
      <div className="card-header">
        <div className="header-content">
          <h3>Drop-off Risk Analysis</h3>
          <p>Early warning indicators and intervention strategies</p>
        </div>
        <div className="header-actions">
          {showRefresh && (
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              aria-label="Refresh drop-off risk data"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="card-content">
        {/* Risk Assessment Overview */}
        <div className="risk-overview">
          <div className="metrics-grid">
            <StatCard
              label="Overall Risk Score"
              value={`${riskAssessment?.overallRisk || 0}%`}
              bgColor={riskLevel.bgColor}
              textColor={riskLevel.color}
              trend={riskAssessment?.trend ? { 
                direction: riskAssessment.trend > 0 ? 'up' : 'down', 
                value: `${riskAssessment.trend > 0 ? '+' : ''}${riskAssessment.trend}%` 
              } : null}
            />
            <StatCard
              label="Engagement Score"
              value={riskAssessment?.engagementScore || 0}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <StatCard
              label="Warning Signals"
              value={warningSignals?.length || 0}
              bgColor="bg-orange-50"
              textColor="text-orange-700"
            />
            <StatCard
              label="Days Since Last Activity"
              value={riskAssessment?.daysSinceLastActivity || 0}
              bgColor="bg-purple-50"
              textColor="text-purple-700"
            />
          </div>
        </div>

        {/* Risk Level Indicator */}
        <div className="risk-indicator">
          <div className={`risk-badge ${riskLevel.bgColor} ${riskLevel.color}`}>
            <span className="risk-level">{riskLevel.level} Risk</span>
            <span className="risk-description">
              {riskLevel.level === 'High' && 'Immediate intervention recommended'}
              {riskLevel.level === 'Medium' && 'Monitor closely and provide support'}
              {riskLevel.level === 'Low' && 'Continue current engagement strategies'}
            </span>
          </div>
        </div>

        {/* Engagement Patterns Chart */}
        <div className="engagement-patterns">
          <div className="section-header">
            <h4>Engagement Patterns</h4>
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
            {viewType === 'bar' ? (
              <BarChart
                data={chartData}
                title="Engagement patterns and risk threshold"
                width={400}
                height={200}
                xAxisLabel="Time"
                yAxisLabel="Engagement Score"
                responsive={true}
              />
            ) : viewType === 'table' ? (
              <DataTable 
                data={engagementPatterns}
                columns={[
                  { key: 'week', label: 'Week', render: (val) => val || '-' },
                  { key: 'engagementScore', label: 'Engagement Score', render: (val) => val || 0 }
                ]}
              />
            ) : (
              <LineChart
                data={chartData}
                title="Engagement patterns and risk threshold"
                width={400}
                height={200}
                xAxisLabel="Time"
                yAxisLabel="Engagement Score"
                responsive={true}
              />
            )}
          </div>
        </div>

        {/* Warning Signals */}
        {warningSignals && warningSignals.length > 0 && (
          <div className="warning-signals">
            <h4>Warning Signals</h4>
            <div className="signals-grid">
              {warningSignals.map((signal, index) => (
                <div key={index} className={`signal-card ${signal.severity.toLowerCase()}`}>
                  <div className="signal-header">
                    <h5>{signal.type}</h5>
                    <span className={`severity-badge ${signal.severity.toLowerCase()}`}>
                      {signal.severity}
                    </span>
                  </div>
                  <p className="signal-description">{signal.description}</p>
                  <div className="signal-metrics">
                    <span>Impact: {signal.impact}</span>
                    <span>Duration: {signal.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Intervention Recommendations */}
        {interventionRecommendations && interventionRecommendations.length > 0 && (
          <div className="interventions">
            <h4>Intervention Recommendations</h4>
            <div className="interventions-list">
              {interventionRecommendations.map((intervention, index) => (
                <div key={index} className="intervention-card">
                  <div className="intervention-header">
                    <h5>{intervention.type}</h5>
                    <span className={`priority-badge ${intervention.priority.toLowerCase()}`}>
                      {intervention.priority}
                    </span>
                  </div>
                  <p className="intervention-description">{intervention.description}</p>
                  <div className="intervention-actions">
                    <Button variant="outline" size="sm">
                      {intervention.action}
                    </Button>
                    <span className="intervention-timeline">Timeline: {intervention.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement History Table */}
        <div className="engagement-history">
          <h4>Recent Engagement History</h4>
          <div className="history-table">
            <table className="engagement-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activity</th>
                  <th>Duration</th>
                  <th>Engagement Score</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {engagementPatterns?.slice(-7).map((pattern, index) => {
                  const patternRiskLevel = getRiskLevel(pattern.riskScore || 0);
                  return (
                    <tr key={index}>
                      <td>{pattern.date}</td>
                      <td>{pattern.activity}</td>
                      <td>{pattern.duration}</td>
                      <td>{pattern.engagementScore}</td>
                      <td>
                        <span className={`risk-indicator ${patternRiskLevel.color}`}>
                          {patternRiskLevel.level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DropOffRiskCard;
