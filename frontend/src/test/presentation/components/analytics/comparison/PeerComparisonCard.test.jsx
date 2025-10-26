import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PeerComparisonCard from '../../../../../presentation/components/analytics/comparison/PeerComparisonCard';

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

describe('PeerComparisonCard', () => {
  const mockProps = {
    userId: 'user123',
    role: 'learner',
    showRefresh: true,
    onRefresh: jest.fn(),
  };

  const mockPeerComparisonData = {
    userPerformance: {
      score: 85,
      percentile: 75,
      trend: 'improving',
      change: 5.2,
    },
    peerComparison: {
      averageScore: 78,
      topPerformerScore: 92,
      userRank: 15,
      totalPeers: 100,
    },
    skillBreakdown: [
      { skill: 'JavaScript', userScore: 88, peerAverage: 82, percentile: 80 },
      { skill: 'React', userScore: 90, peerAverage: 85, percentile: 85 },
      { skill: 'Node.js', userScore: 75, peerAverage: 70, percentile: 70 },
      { skill: 'Database', userScore: 82, peerAverage: 78, percentile: 75 },
    ],
    recommendations: [
      'Focus on Node.js fundamentals to improve overall score',
      'Your React skills are excellent - consider mentoring others',
    ],
    metadata: {
      lastUpdated: '2024-01-15T10:30:00Z',
      dataSource: 'peer-comparison',
      sampleSize: 100,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock SWR to return mock data
    const { default: useSWR } = require('swr');
    useSWR.mockReturnValue({
      data: mockPeerComparisonData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render peer comparison card with title and subtitle', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      expect(screen.getByText('Peer Comparison')).toBeInTheDocument();
      expect(screen.getByText('Your performance compared to peers')).toBeInTheDocument();
    });

    it('should display user performance metrics', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      expect(screen.getByText('85')).toBeInTheDocument(); // user score
      expect(screen.getByText('75th percentile')).toBeInTheDocument();
      expect(screen.getByText('+5.2%')).toBeInTheDocument(); // improvement
    });

    it('should display peer comparison statistics', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      expect(screen.getByText('78')).toBeInTheDocument(); // peer average
      expect(screen.getByText('92')).toBeInTheDocument(); // top performer
      expect(screen.getByText('15 of 100')).toBeInTheDocument(); // rank
    });

    it('should display skill breakdown with charts', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
      
      // Should have bar chart for skill comparison
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should display recommendations section', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Focus on Node.js fundamentals to improve overall score')).toBeInTheDocument();
      expect(screen.getByText('Your React skills are excellent - consider mentoring others')).toBeInTheDocument();
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

      render(<PeerComparisonCard {...mockProps} />);
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when data fetch fails', () => {
      const { default: useSWR } = require('swr');
      useSWR.mockReturnValue({
        data: null,
        error: new Error('Failed to fetch peer comparison data'),
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PeerComparisonCard {...mockProps} />);
      
      expect(screen.getByText('Failed to load peer comparison data')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });
  });

  describe('Chart Type Switching', () => {
    it('should allow switching between bar and line charts', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      const chartTypeSelector = screen.getByRole('combobox', { name: /chart type/i });
      expect(chartTypeSelector).toBeInTheDocument();
      
      // Default should be bar chart
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      
      // Switch to line chart
      fireEvent.change(chartTypeSelector, { target: { value: 'line' } });
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should have proper ARIA labels for charts', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-aria-label', 'Peer comparison skill breakdown');
    });
  });

  describe('Refresh Functionality', () => {
    it('should show refresh button when showRefresh is true', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should hide refresh button when showRefresh is false', () => {
      render(<PeerComparisonCard {...mockProps} showRefresh={false} />);
      
      const refreshButton = screen.queryByRole('button', { name: /refresh/i });
      expect(refreshButton).not.toBeInTheDocument();
    });

    it('should call onRefresh when refresh button is clicked', async () => {
      render(<PeerComparisonCard {...mockProps} />);
      
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
      render(<PeerComparisonCard {...mockProps} />);
      
      const card = screen.getByRole('region', { name: /peer comparison/i });
      expect(card).toBeInTheDocument();
      
      const chart = screen.getByTestId('bar-chart');
      expect(chart).toHaveAttribute('data-aria-label');
    });

    it('should be keyboard navigable', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      refreshButton.focus();
      expect(refreshButton).toHaveFocus();
      
      // Tab to chart type selector
      fireEvent.keyDown(refreshButton, { key: 'Tab' });
      const chartSelector = screen.getByRole('combobox', { name: /chart type/i });
      expect(chartSelector).toHaveFocus();
    });
  });

  describe('Data Formatting', () => {
    it('should format percentages correctly', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      expect(screen.getByText(/\+5\.2%/)).toBeInTheDocument();
      expect(screen.getByText('75th percentile')).toBeInTheDocument();
    });

    it('should format scores with proper precision', () => {
      render(<PeerComparisonCard {...mockProps} />);
      
      // Use more specific selectors to avoid multiple matches
      expect(screen.getByText('78')).toBeInTheDocument(); // peer average
      expect(screen.getByText('92')).toBeInTheDocument(); // top performer
      expect(screen.getByText('15 of 100')).toBeInTheDocument(); // rank
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

      render(<PeerComparisonCard {...mockProps} />);
      
      expect(screen.getByText('Peer Comparison')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
});
