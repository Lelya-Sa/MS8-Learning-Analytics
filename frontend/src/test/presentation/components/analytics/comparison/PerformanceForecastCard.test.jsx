import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformanceForecastCard from '../../../../../presentation/components/analytics/comparison/PerformanceForecastCard';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock chart components
jest.mock('../../../../../presentation/components/charts/BarChart', () => {
  return function MockBarChart({ data, ariaLabel }) {
    return <div data-testid="bar-chart" data-aria-label={ariaLabel}>{JSON.stringify(data)}</div>;
  };
});

jest.mock('../../../../../presentation/components/charts/LineChart', () => {
  return function MockLineChart({ data, ariaLabel }) {
    return <div data-testid="line-chart" data-aria-label={ariaLabel}>{JSON.stringify(data)}</div>;
  };
});

describe('PerformanceForecastCard', () => {
  const mockProps = {
    userId: 'user123',
    role: 'learner',
    showRefresh: true,
    onRefresh: jest.fn(),
  };

  const mockPerformanceForecastData = {
    currentPerformance: {
      overallScore: 78,
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    forecastProjections: [
      { 
        period: 'Week 1', 
        historicalScore: 75, 
        forecastedScore: 80, 
        confidenceLow: 76, 
        confidenceHigh: 84, 
        probability: 'High',
        recommendation: 'Continue'
      },
      { 
        period: 'Week 2', 
        historicalScore: 78, 
        forecastedScore: 82, 
        confidenceLow: 78, 
        confidenceHigh: 86, 
        probability: 'Medium',
        recommendation: 'Improve'
      },
      { 
        period: 'Week 3', 
        historicalScore: 80, 
        forecastedScore: 85, 
        confidenceLow: 80, 
        confidenceHigh: 90, 
        probability: 'High',
        recommendation: 'Continue'
      },
      { 
        period: 'Week 4', 
        historicalScore: 82, 
        forecastedScore: 88, 
        confidenceLow: 82, 
        confidenceHigh: 94, 
        probability: 'Low',
        recommendation: 'Monitor'
      }
    ],
    trendAnalysis: {
      overallTrend: 8.5,
      velocity: 2.3,
      acceleration: 0.5,
      volatility: 3.2,
      stability: 0.85,
      seasonality: 'Upward',
      peakPeriod: 'Week 4'
    },
    confidenceMetrics: {
      overallConfidence: 87,
      forecastAccuracy: 92,
      dataQuality: 95,
      modelAccuracy: 89,
      predictionReliability: 85
    },
    metadata: {
      lastUpdated: '2024-01-15T10:30:00Z',
      dataSource: 'performance-forecast',
      modelVersion: 'v2.1',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock SWR to return mock data
    const { default: useSWR } = require('swr');
    useSWR.mockReturnValue({
      data: mockPerformanceForecastData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render performance forecast card with title and subtitle', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('Performance Forecast')).toBeInTheDocument();
      expect(screen.getByText('Predictive analytics and future projections')).toBeInTheDocument();
    });

    it('should display current performance metrics', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('Current Score')).toBeInTheDocument();
      expect(screen.getByText('Trend Direction')).toBeInTheDocument();
      expect(screen.getByText('Confidence Level')).toBeInTheDocument();
      expect(screen.getByText('Forecast Accuracy')).toBeInTheDocument();
    });

    it('should display trend indicator', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('📈 Improving Performance')).toBeInTheDocument();
      expect(screen.getByText('Your performance is trending upward')).toBeInTheDocument();
    });

    it('should display performance forecast with charts', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('Performance Forecast')).toBeInTheDocument();
      expect(screen.getByText('Week 1')).toBeInTheDocument();
      expect(screen.getByText('Week 2')).toBeInTheDocument();
      
      // Should have line chart by default
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should display forecast projections table', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('Detailed Forecast Projections')).toBeInTheDocument();
      expect(screen.getByText('Historical')).toBeInTheDocument();
      expect(screen.getByText('Forecasted')).toBeInTheDocument();
      expect(screen.getByText('Confidence Range')).toBeInTheDocument();
      expect(screen.getByText('Probability')).toBeInTheDocument();
      expect(screen.getByText('Recommendation')).toBeInTheDocument();
    });

    it('should display trend analysis', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('Trend Analysis')).toBeInTheDocument();
      expect(screen.getByText('Performance Velocity')).toBeInTheDocument();
      expect(screen.getByText('Volatility Analysis')).toBeInTheDocument();
      expect(screen.getByText('Seasonality')).toBeInTheDocument();
    });

    it('should display confidence metrics', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('Model Confidence')).toBeInTheDocument();
      expect(screen.getByText('Data Quality')).toBeInTheDocument();
      expect(screen.getByText('Model Accuracy')).toBeInTheDocument();
      expect(screen.getByText('Prediction Reliability')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should display loading skeleton when data is loading', () => {
      const { default: useSWR } = require('swr');
      useSWR.mockReturnValue({
        data: null,
        error: null,
        isLoading: true,
        mutate: jest.fn(),
      });

      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when data fetch fails', () => {
      const { default: useSWR } = require('swr');
      useSWR.mockReturnValue({
        data: null,
        error: new Error('Failed to fetch performance forecast data'),
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('Failed to load performance forecast data')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });
  });

  describe('Chart Type Switching', () => {
    it('should allow switching between line and bar charts', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      const chartTypeSelector = screen.getByRole('combobox', { name: /chart type/i });
      expect(chartTypeSelector).toBeInTheDocument();
      
      // Default should be line chart
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      
      // Switch to bar chart
      fireEvent.change(chartTypeSelector, { target: { value: 'bar' } });
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should have proper ARIA labels for charts', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      const lineChart = screen.getByTestId('line-chart');
      expect(lineChart).toHaveAttribute('data-aria-label', 'Performance forecast with confidence intervals');
    });
  });

  describe('Refresh Functionality', () => {
    it('should show refresh button when showRefresh is true', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should hide refresh button when showRefresh is false', () => {
      render(<PerformanceForecastCard {...mockProps} showRefresh={false} />);
      
      const refreshButton = screen.queryByRole('button', { name: /refresh/i });
      expect(refreshButton).not.toBeInTheDocument();
    });

    it('should call onRefresh when refresh button is clicked', async () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);
      
      // Wait for async operation
      await waitFor(() => {
        expect(mockProps.onRefresh).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      const card = screen.getByRole('region', { name: /performance forecast analytics/i });
      expect(card).toBeInTheDocument();
      
      const chart = screen.getByTestId('line-chart');
      expect(chart).toHaveAttribute('data-aria-label');
    });

    it('should be keyboard navigable', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      refreshButton.focus();
      expect(refreshButton).toHaveFocus();
      
      // Tab to chart type selector
      fireEvent.keyDown(refreshButton, { key: 'Tab' });
      const chartSelector = screen.getByRole('combobox', { name: /chart type/i });
      expect(chartSelector).toHaveFocus();
    });
  });

  describe('Performance Trend Assessment', () => {
    it('should display correct trend based on analysis', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      // With trend of 8.5, should show improving performance
      expect(screen.getByText('📈 Improving Performance')).toBeInTheDocument();
      expect(screen.getByText('Your performance is trending upward')).toBeInTheDocument();
    });

    it('should format performance scores correctly', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('78')).toBeInTheDocument(); // current score
      expect(screen.getByText('87%')).toBeInTheDocument(); // confidence level
      expect(screen.getByText('92%')).toBeInTheDocument(); // forecast accuracy
    });
  });

  describe('Forecast Data Display', () => {
    it('should display forecast projections correctly', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('75')).toBeInTheDocument(); // historical score
      expect(screen.getByText('80')).toBeInTheDocument(); // forecasted score
      expect(screen.getByText('76 - 84')).toBeInTheDocument(); // confidence range
      expect(screen.getByText('High')).toBeInTheDocument(); // probability
      expect(screen.getByText('Continue')).toBeInTheDocument(); // recommendation
    });

    it('should display trend analysis metrics', () => {
      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('2.3 points/week')).toBeInTheDocument(); // velocity
      expect(screen.getByText('0.5 points/week²')).toBeInTheDocument(); // acceleration
      expect(screen.getByText('3.2')).toBeInTheDocument(); // volatility
      expect(screen.getByText('0.85')).toBeInTheDocument(); // stability
    });
  });

  describe('Responsive Design', () => {
    it('should render correctly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<PerformanceForecastCard {...mockProps} />);
      
      expect(screen.getByText('Performance Forecast')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });
});
