import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillDemandCard from '../../../../../presentation/components/analytics/comparison/SkillDemandCard';

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

describe('SkillDemandCard', () => {
  const mockProps = {
    userId: 'user123',
    role: 'learner',
    showRefresh: true,
    onRefresh: jest.fn(),
  };

  const mockSkillDemandData = {
    marketTrends: [
      { skill: 'JavaScript', currentDemand: 95, projectedGrowth: 12, userLevel: 'Intermediate', recommendation: 'Improve' },
      { skill: 'React', currentDemand: 88, projectedGrowth: 15, userLevel: 'Advanced', recommendation: 'Maintain' },
      { skill: 'Node.js', currentDemand: 82, projectedGrowth: 18, userLevel: 'Beginner', recommendation: 'Learn' },
      { skill: 'Python', currentDemand: 90, projectedGrowth: 20, userLevel: 'Intermediate', recommendation: 'Improve' },
    ],
    skillRecommendations: [
      {
        skill: 'Machine Learning',
        priority: 'High',
        description: 'High demand skill with excellent growth prospects',
        demand: 85,
        growth: 25,
        roi: 'Excellent'
      },
      {
        skill: 'Cloud Computing',
        priority: 'Medium',
        description: 'Essential for modern development',
        demand: 78,
        growth: 22,
        roi: 'Good'
      }
    ],
    growthProjections: {
      '6 months': { marketGrowth: 15, skillGap: 20, opportunity: 'High' },
      '1 year': { marketGrowth: 25, skillGap: 30, opportunity: 'Very High' },
      '2 years': { marketGrowth: 35, skillGap: 40, opportunity: 'Critical' }
    },
    userSkillAlignment: {
      overallAlignment: 75,
      marketScore: 82,
      trend: 5.2
    },
    metadata: {
      lastUpdated: '2024-01-15T10:30:00Z',
      dataSource: 'skill-demand',
      sampleSize: 1000,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock SWR to return mock data
    const { default: useSWR } = require('swr');
    useSWR.mockReturnValue({
      data: mockSkillDemandData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render skill demand card with title and subtitle', () => {
      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByText('Skill Demand Analysis')).toBeInTheDocument();
      expect(screen.getByText('Market trends and skill recommendations')).toBeInTheDocument();
    });

    it('should display market overview metrics', () => {
      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByText('High Demand Skills')).toBeInTheDocument();
      expect(screen.getByText('Growing Skills')).toBeInTheDocument();
      expect(screen.getByText('Your Alignment')).toBeInTheDocument();
      expect(screen.getByText('Market Score')).toBeInTheDocument();
    });

    it('should display skill trends with charts', () => {
      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByText('Skill Demand Trends')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      
      // Should have bar chart for skill trends
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should display skill recommendations', () => {
      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByText('Personalized Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Cloud Computing')).toBeInTheDocument();
      expect(screen.getByText('High demand skill with excellent growth prospects')).toBeInTheDocument();
    });

    it('should display growth projections', () => {
      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByText('Growth Projections')).toBeInTheDocument();
      expect(screen.getByText('6 months')).toBeInTheDocument();
      expect(screen.getByText('1 year')).toBeInTheDocument();
      expect(screen.getByText('2 years')).toBeInTheDocument();
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

      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when data fetch fails', () => {
      const { default: useSWR } = require('swr');
      useSWR.mockReturnValue({
        data: null,
        error: new Error('Failed to fetch skill demand data'),
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByText('Failed to load skill demand data')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });
  });

  describe('Chart Type Switching', () => {
    it('should allow switching between bar and line charts', () => {
      render(<SkillDemandCard {...mockProps} />);
      
      const chartTypeSelector = screen.getByRole('combobox', { name: /chart type/i });
      expect(chartTypeSelector).toBeInTheDocument();
      
      // Default should be bar chart
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      
      // Switch to line chart
      fireEvent.change(chartTypeSelector, { target: { value: 'line' } });
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should have proper ARIA labels for charts', () => {
      render(<SkillDemandCard {...mockProps} />);
      
      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-aria-label', 'Skill demand trends analysis');
    });
  });

  describe('Refresh Functionality', () => {
    it('should show refresh button when showRefresh is true', () => {
      render(<SkillDemandCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should hide refresh button when showRefresh is false', () => {
      render(<SkillDemandCard {...mockProps} showRefresh={false} />);
      
      const refreshButton = screen.queryByRole('button', { name: /refresh/i });
      expect(refreshButton).not.toBeInTheDocument();
    });

    it('should call onRefresh when refresh button is clicked', async () => {
      render(<SkillDemandCard {...mockProps} />);
      
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
      render(<SkillDemandCard {...mockProps} />);
      
      const card = screen.getByRole('region', { name: /skill demand analytics/i });
      expect(card).toBeInTheDocument();
      
      const chart = screen.getByTestId('bar-chart');
      expect(chart).toHaveAttribute('data-aria-label');
    });

    it('should be keyboard navigable', () => {
      render(<SkillDemandCard {...mockProps} />);
      
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
      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByText(/\+5\.2%/)).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should display skill levels and recommendations', () => {
      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByText('Intermediate')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
      expect(screen.getByText('Beginner')).toBeInTheDocument();
      expect(screen.getByText('Learn')).toBeInTheDocument();
      expect(screen.getByText('Improve')).toBeInTheDocument();
      expect(screen.getByText('Maintain')).toBeInTheDocument();
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

      render(<SkillDemandCard {...mockProps} />);
      
      expect(screen.getByText('Skill Demand Analysis')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
});
