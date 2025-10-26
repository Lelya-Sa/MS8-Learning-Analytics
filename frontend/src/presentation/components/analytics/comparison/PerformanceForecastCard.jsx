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
 * PerformanceForecastCard Component
 * 
 * Displays performance forecasting with predictive analytics,
 * trend analysis, and future performance projections.
 * 
 * @param {Object} props - Component props
 * @param {string} props.userId - User ID
 * @param {string} props.role - Active role
 * @param {boolean} [props.showRefresh=true] - Show refresh button
 * @param {Function} [props.onRefresh] - Refresh callback
 */
const PerformanceForecastCard = ({ 
  userId, 
  role, 
  showRefresh = true, 
  onRefresh 
}) => {
  const [chartType, setChartType] = useState('line');

  // Fetch performance forecast data
  const { data, error, isLoading, mutate } = useSWR(
    `performance-forecast-${userId}-${role}`,
    () => apiClient.get(`/predictive/forecast/${userId}`)
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
      <Card className="performance-forecast-card">
        <div className="card-header">
          <h3>Performance Forecast</h3>
          <p>Predictive analytics and future projections</p>
        </div>
        <div data-testid="loading-skeleton" className="loading-skeleton">
          <Spinner size="large" />
          <p>Loading performance forecast data...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="performance-forecast-card error-state">
        <div className="card-header">
          <h3>Performance Forecast</h3>
          <p>Predictive analytics and future projections</p>
        </div>
        <div className="error-content">
          <h4>Failed to load performance forecast data</h4>
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

  const forecastData = data?.formattedData || data;
  if (!forecastData) {
    return (
      <Card className="performance-forecast-card">
        <div className="card-header">
          <h3>Performance Forecast</h3>
          <p>Predictive analytics and future projections</p>
        </div>
        <div className="no-data">
          <p>No performance forecast data available</p>
        </div>
      </Card>
    );
  }

  const { currentPerformance, forecastProjections, trendAnalysis, confidenceMetrics } = forecastData;

  // Prepare chart data for performance trends and forecasts
  const chartData = {
    labels: forecastProjections?.map(projection => projection.period) || [],
    datasets: [
      {
        label: 'Historical Performance',
        data: forecastProjections?.map(projection => projection.historicalScore) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Forecasted Performance',
        data: forecastProjections?.map(projection => projection.forecastedScore) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Confidence Interval (High)',
        data: forecastProjections?.map(projection => projection.confidenceHigh) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        fill: '+1',
      },
      {
        label: 'Confidence Interval (Low)',
        data: forecastProjections?.map(projection => projection.confidenceLow) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const getPerformanceTrend = (trend) => {
    if (trend > 5) return { direction: 'up', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (trend < -5) return { direction: 'down', color: 'text-red-600', bgColor: 'bg-red-50' };
    return { direction: 'stable', color: 'text-blue-600', bgColor: 'bg-blue-50' };
  };

  const performanceTrend = getPerformanceTrend(trendAnalysis?.overallTrend || 0);

  return (
    <Card className="performance-forecast-card" role="region" aria-label="Performance forecast analytics">
      <div className="card-header">
        <div className="header-content">
          <h3>Performance Forecast</h3>
          <p>Predictive analytics and future projections</p>
        </div>
        <div className="header-actions">
          {showRefresh && (
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              aria-label="Refresh performance forecast data"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="card-content">
        {/* Current Performance Overview */}
        <div className="performance-overview">
          <div className="metrics-grid">
            <StatCard
              label="Current Score"
              value={currentPerformance?.overallScore || 0}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <StatCard
              label="Trend Direction"
              value={performanceTrend.direction}
              bgColor={performanceTrend.bgColor}
              textColor={performanceTrend.color}
              trend={trendAnalysis?.overallTrend ? { 
                direction: trendAnalysis.overallTrend > 0 ? 'up' : 'down', 
                value: `${trendAnalysis.overallTrend > 0 ? '+' : ''}${trendAnalysis.overallTrend}%` 
              } : null}
            />
            <StatCard
              label="Confidence Level"
              value={`${confidenceMetrics?.overallConfidence || 0}%`}
              bgColor="bg-purple-50"
              textColor="text-purple-700"
            />
            <StatCard
              label="Forecast Accuracy"
              value={`${confidenceMetrics?.forecastAccuracy || 0}%`}
              bgColor="bg-orange-50"
              textColor="text-orange-700"
            />
          </div>
        </div>

        {/* Performance Trend Indicator */}
        <div className="trend-indicator">
          <div className={`trend-badge ${performanceTrend.bgColor} ${performanceTrend.color}`}>
            <span className="trend-level">
              {performanceTrend.direction === 'up' && '📈 Improving Performance'}
              {performanceTrend.direction === 'down' && '📉 Declining Performance'}
              {performanceTrend.direction === 'stable' && '📊 Stable Performance'}
            </span>
            <span className="trend-description">
              {performanceTrend.direction === 'up' && 'Your performance is trending upward'}
              {performanceTrend.direction === 'down' && 'Performance may need attention'}
              {performanceTrend.direction === 'stable' && 'Consistent performance maintained'}
            </span>
          </div>
        </div>

        {/* Performance Forecast Chart */}
        <div className="performance-forecast">
          <div className="section-header">
            <h4>Performance Forecast</h4>
            <div className="chart-controls">
              <label htmlFor="chart-type-selector">Chart Type:</label>
              <select
                id="chart-type-selector"
                value={chartType}
                onChange={handleChartTypeChange}
                aria-label="Select chart type"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
          </div>
          
          <div className="chart-container">
            {chartType === 'line' ? (
              <LineChart
                data={chartData}
                ariaLabel="Performance forecast with confidence intervals"
              />
            ) : (
              <BarChart
                data={chartData}
                ariaLabel="Performance forecast with confidence intervals"
              />
            )}
          </div>
        </div>

        {/* Forecast Projections Table */}
        <div className="forecast-projections">
          <h4>Detailed Forecast Projections</h4>
          <div className="projections-table">
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Historical</th>
                  <th>Forecasted</th>
                  <th>Confidence Range</th>
                  <th>Probability</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {forecastProjections?.map((projection, index) => (
                  <tr key={index}>
                    <td>{projection.period}</td>
                    <td>{projection.historicalScore}</td>
                    <td>{projection.forecastedScore}</td>
                    <td>
                      {projection.confidenceLow} - {projection.confidenceHigh}
                    </td>
                    <td>
                      <span className={`probability-badge ${projection.probability.toLowerCase()}`}>
                        {projection.probability}
                      </span>
                    </td>
                    <td>
                      <span className={`recommendation-badge ${projection.recommendation.toLowerCase()}`}>
                        {projection.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trend Analysis */}
        {trendAnalysis && (
          <div className="trend-analysis">
            <h4>Trend Analysis</h4>
            <div className="trend-grid">
              <div className="trend-card">
                <h5>Performance Velocity</h5>
                <div className="trend-metrics">
                  <div className="metric">
                    <span className="metric-label">Current Rate</span>
                    <span className="metric-value">{trendAnalysis.velocity} points/week</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Acceleration</span>
                    <span className="metric-value">{trendAnalysis.acceleration} points/week²</span>
                  </div>
                </div>
              </div>
              
              <div className="trend-card">
                <h5>Volatility Analysis</h5>
                <div className="trend-metrics">
                  <div className="metric">
                    <span className="metric-label">Standard Deviation</span>
                    <span className="metric-value">{trendAnalysis.volatility}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Stability Index</span>
                    <span className="metric-value">{trendAnalysis.stability}</span>
                  </div>
                </div>
              </div>
              
              <div className="trend-card">
                <h5>Seasonality</h5>
                <div className="trend-metrics">
                  <div className="metric">
                    <span className="metric-label">Pattern</span>
                    <span className="metric-value">{trendAnalysis.seasonality}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Peak Period</span>
                    <span className="metric-value">{trendAnalysis.peakPeriod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confidence Metrics */}
        {confidenceMetrics && (
          <div className="confidence-metrics">
            <h4>Model Confidence</h4>
            <div className="confidence-grid">
              <div className="confidence-card">
                <h5>Data Quality</h5>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${confidenceMetrics.dataQuality}%` }}
                  ></div>
                  <span className="confidence-value">{confidenceMetrics.dataQuality}%</span>
                </div>
              </div>
              
              <div className="confidence-card">
                <h5>Model Accuracy</h5>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${confidenceMetrics.modelAccuracy}%` }}
                  ></div>
                  <span className="confidence-value">{confidenceMetrics.modelAccuracy}%</span>
                </div>
              </div>
              
              <div className="confidence-card">
                <h5>Prediction Reliability</h5>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${confidenceMetrics.predictionReliability}%` }}
                  ></div>
                  <span className="confidence-value">{confidenceMetrics.predictionReliability}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PerformanceForecastCard;
