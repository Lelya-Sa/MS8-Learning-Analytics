import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the infrastructure api
jest.mock('../../../../../infrastructure/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import DropOffRiskCard from '../../../../../presentation/components/analytics/comparison/DropOffRiskCard';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock chart components
jest.mock('../../../../../presentation/components/charts/BarChart', () => ({
  BarChart: ({ data, ariaLabel }) => <div data-testid="bar-chart" data-aria-label={ariaLabel}>{JSON.stringify(data)}</div>
}));

jest.mock('../../../../../presentation/components/charts/LineChart', () => ({
  LineChart: ({ data, ariaLabel }) => <div data-testid="line-chart" data-aria-label={ariaLabel}>{JSON.stringify(data)}</div>
}));

// Mock common components
jest.mock('../../../../../presentation/components/common/Card', () => {
  return function MockCard({ children, className }) {
    return <div className={className}>{children}</div>;
  };
});

jest.mock('../../../../../presentation/components/common/Button', () => {
  return function MockButton({ children, onClick, variant }) {
    return <button onClick={onClick} className={variant}>{children}</button>;
  };
});

jest.mock('../../../../../presentation/components/common/Spinner', () => {
  return function MockSpinner({ size }) {
    return <div data-testid="spinner" data-size={size}>Loading...</div>;
  };
});

jest.mock('../../../../../presentation/components/common/StatCard', () => {
  return function MockStatCard({ title, value, className }) {
    return <div className={className} data-title={title}>{value}</div>;
  };
});

describe('DropOffRiskCard', () => {
  const mockProps = {
    userId: 'user123',
    role: 'learner',
    showRefresh: true,
    onRefresh: jest.fn(),
  };

  const mockDropOffRiskData = {
    riskAssessment: {
      overallRisk: 75,
      engagementScore: 45,
      daysSinceLastActivity: 5,
      trend: -10.5
    },
    engagementPatterns: [
      { week: 'Week 1', engagementScore: 85, riskScore: 20, date: '2024-01-01', activity: 'Course Start', duration: '2h' },
      { week: 'Week 2', engagementScore: 78, riskScore: 35, date: '2024-01-08', activity: 'Module 1', duration: '1.5h' },
      { week: 'Week 3', engagementScore: 65, riskScore: 50, date: '2024-01-15', activity: 'Module 2', duration: '1h' },
      { week: 'Week 4', engagementScore: 45, riskScore: 75, date: '2024-01-22', activity: 'Module 3', duration: '30m' },
    ],
    warningSignals: [
      {
        type: 'Low Engagement',
        severity: 'High',
        description: 'Engagement score has dropped significantly',
        impact: 'High',
        duration: '2 weeks'
      },
      {
        type: 'Missed Deadlines',
        severity: 'Medium',
        description: 'Multiple assignment deadlines missed',
        impact: 'Medium',
        duration: '1 week'
      }
    ],
    interventionRecommendations: [
      {
        type: 'Personal Outreach',
        priority: 'High',
        description: 'Schedule one-on-one session to understand challenges',
        action: 'Schedule Meeting',
        timeline: 'Within 24 hours'
      },
      {
        type: 'Content Adjustment',
        priority: 'Medium',
        description: 'Provide additional resources and alternative learning paths',
        action: 'Send Resources',
        timeline: 'Within 48 hours'
      }
    ],
    metadata: {
      lastUpdated: '2024-01-15T10:30:00Z',
      dataSource: 'dropoff-risk',
      sampleSize: 100,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock SWR to return mock data
    const { default: useSWR } = require('swr');
    useSWR.mockReturnValue({
      data: mockDropOffRiskData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render drop-off risk card with title and subtitle', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('Drop-off Risk Analysis')).toBeInTheDocument();
      expect(screen.getByText('Early warning indicators and intervention strategies')).toBeInTheDocument();
    });

    it('should display risk assessment metrics', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('Overall Risk Score')).toBeInTheDocument();
      expect(screen.getByText('Engagement Score')).toBeInTheDocument();
      expect(screen.getByText('Warning Signals')).toBeInTheDocument();
      expect(screen.getByText('Days Since Last Activity')).toBeInTheDocument();
    });

    it('should display risk level indicator', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('High Risk')).toBeInTheDocument();
      expect(screen.getByText('Immediate intervention recommended')).toBeInTheDocument();
    });

    it('should display engagement patterns with charts', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('Engagement Patterns')).toBeInTheDocument();
      expect(screen.getByText('Week 1')).toBeInTheDocument();
      expect(screen.getByText('Week 2')).toBeInTheDocument();
      
      // Should have bar chart for engagement patterns
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should display warning signals', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('Warning Signals')).toBeInTheDocument();
      expect(screen.getByText('Low Engagement')).toBeInTheDocument();
      expect(screen.getByText('Missed Deadlines')).toBeInTheDocument();
      expect(screen.getByText('Engagement score has dropped significantly')).toBeInTheDocument();
    });

    it('should display intervention recommendations', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('Intervention Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Personal Outreach')).toBeInTheDocument();
      expect(screen.getByText('Content Adjustment')).toBeInTheDocument();
      expect(screen.getByText('Schedule one-on-one session to understand challenges')).toBeInTheDocument();
    });

    it('should display engagement history table', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('Recent Engagement History')).toBeInTheDocument();
      expect(screen.getByText('Course Start')).toBeInTheDocument();
      expect(screen.getByText('Module 1')).toBeInTheDocument();
      expect(screen.getByText('Module 2')).toBeInTheDocument();
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

      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when data fetch fails', () => {
      const { default: useSWR } = require('swr');
      useSWR.mockReturnValue({
        data: null,
        error: new Error('Failed to fetch drop-off risk data'),
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('Failed to load drop-off risk data')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });
  });

  describe('Chart Type Switching', () => {
    it('should allow switching between bar and line charts', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      const chartTypeSelector = screen.getByRole('combobox', { name: /chart type/i });
      expect(chartTypeSelector).toBeInTheDocument();
      
      // Default should be bar chart
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      
      // Switch to line chart
      fireEvent.change(chartTypeSelector, { target: { value: 'line' } });
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should have proper ARIA labels for charts', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-aria-label', 'Engagement patterns and risk threshold');
    });
  });

  describe('Refresh Functionality', () => {
    it('should show refresh button when showRefresh is true', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should hide refresh button when showRefresh is false', () => {
      render(<DropOffRiskCard {...mockProps} showRefresh={false} />);
      
      const refreshButton = screen.queryByRole('button', { name: /refresh/i });
      expect(refreshButton).not.toBeInTheDocument();
    });

    it('should call onRefresh when refresh button is clicked', async () => {
      render(<DropOffRiskCard {...mockProps} />);
      
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
      render(<DropOffRiskCard {...mockProps} />);
      
      const card = screen.getByRole('region', { name: /drop-off risk analytics/i });
      expect(card).toBeInTheDocument();
      
      const chart = screen.getByTestId('bar-chart');
      expect(chart).toHaveAttribute('data-aria-label');
    });

    it('should be keyboard navigable', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      refreshButton.focus();
      expect(refreshButton).toHaveFocus();
      
      // Tab to chart type selector
      fireEvent.keyDown(refreshButton, { key: 'Tab' });
      const chartSelector = screen.getByRole('combobox', { name: /chart type/i });
      expect(chartSelector).toHaveFocus();
    });
  });

  describe('Risk Level Assessment', () => {
    it('should display correct risk level based on score', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      // With risk score of 75, should show High Risk
      expect(screen.getByText('High Risk')).toBeInTheDocument();
      expect(screen.getByText('Immediate intervention recommended')).toBeInTheDocument();
    });

    it('should format risk scores correctly', () => {
      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('75%')).toBeInTheDocument(); // overall risk
      expect(screen.getByText('45')).toBeInTheDocument(); // engagement score
      expect(screen.getByText('5')).toBeInTheDocument(); // days since last activity
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

      render(<DropOffRiskCard {...mockProps} />);
      
      expect(screen.getByText('Drop-off Risk Analysis')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
});
