import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecommendationsCard from '../../../../../presentation/components/analytics/comparison/RecommendationsCard';

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

describe('RecommendationsCard', () => {
  const mockProps = {
    userId: 'user123',
    role: 'learner',
    showRefresh: true,
    onRefresh: jest.fn(),
  };

  const mockRecommendationsData = {
    summary: {
      totalRecommendations: 12,
      highPriorityCount: 3,
      completedCount: 8,
      completionRate: 67,
      successRate: 85,
      progressTracking: {
        thisWeek: 75,
        thisMonth: 68,
        overall: 72
      }
    },
    recommendations: [
      {
        id: 'rec-1',
        title: 'Complete Advanced JavaScript Course',
        description: 'Based on your current skill level, completing this course will significantly improve your JavaScript proficiency.',
        category: 'Learning',
        priority: 'High',
        confidence: 92,
        expectedImpact: 'High',
        timeToComplete: '2-3 weeks',
        difficulty: 'Medium',
        resources: [
          { title: 'JavaScript Advanced Concepts', url: 'https://example.com/js-advanced' },
          { title: 'Practice Exercises', url: 'https://example.com/js-practice' }
        ]
      },
      {
        id: 'rec-2',
        title: 'Join Study Group',
        description: 'Collaborative learning has shown to improve retention and understanding.',
        category: 'Social',
        priority: 'Medium',
        confidence: 78,
        expectedImpact: 'Medium',
        timeToComplete: '1 week',
        difficulty: 'Easy',
        resources: []
      },
      {
        id: 'rec-3',
        title: 'Practice Algorithm Problems',
        description: 'Regular practice with algorithmic thinking will enhance your problem-solving skills.',
        category: 'Practice',
        priority: 'High',
        confidence: 89,
        expectedImpact: 'High',
        timeToComplete: 'Ongoing',
        difficulty: 'Hard',
        resources: [
          { title: 'LeetCode Problems', url: 'https://leetcode.com' }
        ]
      }
    ],
    categories: [
      { name: 'Learning', count: 5 },
      { name: 'Practice', count: 4 },
      { name: 'Social', count: 2 },
      { name: 'Assessment', count: 1 }
    ],
    insights: [
      {
        title: 'Learning Pattern Analysis',
        description: 'You perform best with hands-on learning activities in the morning.',
        type: 'Pattern',
        confidence: 87,
        impact: 'High'
      },
      {
        title: 'Skill Gap Identification',
        description: 'Focus on data structures and algorithms to improve overall performance.',
        type: 'Gap',
        confidence: 94,
        impact: 'Critical'
      }
    ],
    metadata: {
      lastUpdated: '2024-01-15T10:30:00Z',
      dataSource: 'recommendations',
      modelVersion: 'v3.2',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock SWR to return mock data
    const { default: useSWR } = require('swr');
    useSWR.mockReturnValue({
      data: mockRecommendationsData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render recommendations card with title and subtitle', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('AI Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Personalized learning insights and action items')).toBeInTheDocument();
    });

    it('should display recommendations summary metrics', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('Total Recommendations')).toBeInTheDocument();
      expect(screen.getByText('High Priority')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Success Rate')).toBeInTheDocument();
    });

    it('should display AI insights', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('AI Insights')).toBeInTheDocument();
      expect(screen.getByText('Learning Pattern Analysis')).toBeInTheDocument();
      expect(screen.getByText('Skill Gap Identification')).toBeInTheDocument();
      expect(screen.getByText('You perform best with hands-on learning activities in the morning.')).toBeInTheDocument();
    });

    it('should display recommendations categories chart', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('Recommendations by Category')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should display category filter', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('Filter by Category:')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /select recommendation category/i })).toBeInTheDocument();
    });

    it('should display personalized recommendations', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('Personalized Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Complete Advanced JavaScript Course')).toBeInTheDocument();
      expect(screen.getByText('Join Study Group')).toBeInTheDocument();
      expect(screen.getByText('Practice Algorithm Problems')).toBeInTheDocument();
    });

    it('should display progress tracking', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
      expect(screen.getByText('This Week')).toBeInTheDocument();
      expect(screen.getByText('This Month')).toBeInTheDocument();
      expect(screen.getByText('Overall')).toBeInTheDocument();
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

      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when data fetch fails', () => {
      const { default: useSWR } = require('swr');
      useSWR.mockReturnValue({
        data: null,
        error: new Error('Failed to fetch recommendations data'),
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('Failed to load recommendations')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    it('should filter recommendations by category', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      const categorySelector = screen.getByRole('combobox', { name: /select recommendation category/i });
      
      // Initially show all recommendations
      expect(screen.getByText('Complete Advanced JavaScript Course')).toBeInTheDocument();
      expect(screen.getByText('Join Study Group')).toBeInTheDocument();
      expect(screen.getByText('Practice Algorithm Problems')).toBeInTheDocument();
      
      // Filter by Learning category
      fireEvent.change(categorySelector, { target: { value: 'Learning' } });
      
      // Should still show Learning category recommendations
      expect(screen.getByText('Complete Advanced JavaScript Course')).toBeInTheDocument();
    });

    it('should have proper ARIA labels for chart', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-aria-label', 'Recommendations distribution by category');
    });
  });

  describe('Refresh Functionality', () => {
    it('should show refresh button when showRefresh is true', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should hide refresh button when showRefresh is false', () => {
      render(<RecommendationsCard {...mockProps} showRefresh={false} />);
      
      const refreshButton = screen.queryByRole('button', { name: /refresh/i });
      expect(refreshButton).not.toBeInTheDocument();
    });

    it('should call onRefresh when refresh button is clicked', async () => {
      render(<RecommendationsCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);
      
      // Wait for async operation
      await waitFor(() => {
        expect(mockProps.onRefresh).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Recommendation Actions', () => {
    it('should display action buttons for each recommendation', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getAllByText('Accept')).toHaveLength(3);
      expect(screen.getAllByText('Dismiss')).toHaveLength(3);
      expect(screen.getAllByText('Schedule')).toHaveLength(3);
    });

    it('should handle recommendation action clicks', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<RecommendationsCard {...mockProps} />);
      
      const acceptButtons = screen.getAllByText('Accept');
      fireEvent.click(acceptButtons[0]);
      
      expect(consoleSpy).toHaveBeenCalledWith('Action accept taken for recommendation rec-1');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      const card = screen.getByRole('region', { name: /ai recommendations analytics/i });
      expect(card).toBeInTheDocument();
      
      const chart = screen.getByTestId('bar-chart');
      expect(chart).toHaveAttribute('data-aria-label');
    });

    it('should be keyboard navigable', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      refreshButton.focus();
      expect(refreshButton).toHaveFocus();
      
      // Tab to category selector
      fireEvent.keyDown(refreshButton, { key: 'Tab' });
      const categorySelector = screen.getByRole('combobox', { name: /select recommendation category/i });
      expect(categorySelector).toHaveFocus();
    });
  });

  describe('Recommendation Details', () => {
    it('should display recommendation details correctly', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('High')).toBeInTheDocument(); // priority
      expect(screen.getByText('Medium')).toBeInTheDocument(); // difficulty
      expect(screen.getByText('2-3 weeks')).toBeInTheDocument(); // time to complete
      expect(screen.getByText('92% confidence')).toBeInTheDocument(); // confidence
    });

    it('should display recommendation resources', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('Resources:')).toBeInTheDocument();
      expect(screen.getByText('JavaScript Advanced Concepts')).toBeInTheDocument();
      expect(screen.getByText('Practice Exercises')).toBeInTheDocument();
      expect(screen.getByText('LeetCode Problems')).toBeInTheDocument();
    });
  });

  describe('Progress Tracking', () => {
    it('should display progress bars correctly', () => {
      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('75%')).toBeInTheDocument(); // this week
      expect(screen.getByText('68%')).toBeInTheDocument(); // this month
      expect(screen.getByText('72%')).toBeInTheDocument(); // overall
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

      render(<RecommendationsCard {...mockProps} />);
      
      expect(screen.getByText('AI Recommendations')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
});
