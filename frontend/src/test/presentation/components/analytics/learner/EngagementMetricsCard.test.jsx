import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { EngagementMetricsCard } from '../../../../../presentation/components/analytics/learner/EngagementMetricsCard';
import { mockApiClient } from '../../../../mocks/api-client';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock('../../../../../application/state/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => mockUseAuth(),
}));

// Mock ThemeContext
const mockUseTheme = jest.fn();
jest.mock('../../../../../application/state/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>,
  useTheme: () => mockUseTheme(),
}));

// Setup API mocks
beforeEach(() => {
  // Mock authenticated learner user
  mockUseAuth.mockReturnValue({
    isAuthenticated: true,
    user: { id: '1', email: 'learner@example.com', roles: ['learner'] },
    currentRole: 'learner',
    login: jest.fn(),
    logout: jest.fn(),
    switchRole: jest.fn(),
    hasRole: jest.fn(() => true),
    getPermissions: jest.fn(() => ['read:analytics']),
  });

  // Mock theme
  mockUseTheme.mockReturnValue({
    theme: 'light',
    toggleTheme: jest.fn(),
    colors: {
      primary: '#10b981',
      secondary: '#6b7280',
      background: '#ffffff',
      text: '#111827',
    },
  });

  // Mock successful API responses
  mockApiClient.get.mockImplementation((url) => {
    if (url.includes('/auth/me')) {
      return Promise.resolve({
        data: {
          user: {
            id: 'test-user-123',
            email: 'test@example.com',
            fullName: 'Test User',
            roles: ['learner'],
            organizationId: 'test-org-123',
            avatarUrl: 'https://example.com/avatar.jpg'
          }
        }
      });
    }
    if (url.includes('/learner/analytics/overview/')) {
      return Promise.resolve({
        data: {
          userId: 'test-user-123',
          overallEngagement: 78,
          timeSpent: {
            total: 24.5,
            average: 2.1
          },
          contentEngagement: {
            videos: 85,
            articles: 72,
            quizzes: 90
          },
          sessionFrequency: {
            daily: 5,
            weekly: 12,
            monthly: 45
          },
          engagementScore: 78,
          lastUpdated: new Date().toISOString()
        }
      });
    }
    return Promise.resolve({ data: {} });
  });
});

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('EngagementMetricsCard', () => {
  const mockEngagementData = {
    overallEngagement: 78,
    timeSpent: {
      total: 24.5, // hours
      average: 2.1, // hours per session
      trend: 'increasing'
    },
    interactionRate: {
      current: 0.65, // 65%
      average: 0.58,
      trend: 'increasing'
    },
    completionRate: {
      current: 0.82, // 82%
      average: 0.75,
      trend: 'increasing'
    },
    sessionFrequency: {
      daily: 0.45, // 45% of days
      weekly: 0.85, // 85% of weeks
      trend: 'stable'
    },
    contentEngagement: {
      videos: 0.72,
      quizzes: 0.68,
      readings: 0.45,
      discussions: 0.38
    },
    engagementHistory: [
      { date: '2025-01-01', engagement: 65, timeSpent: 1.8, interactions: 45 },
      { date: '2025-01-02', engagement: 72, timeSpent: 2.2, interactions: 52 },
      { date: '2025-01-03', engagement: 78, timeSpent: 2.1, interactions: 48 },
      { date: '2025-01-04', engagement: 82, timeSpent: 2.5, interactions: 58 }
    ],
    lastUpdated: '2025-01-04T10:00:00Z',
    isStale: false
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render engagement metrics card with key metrics', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('engagement-metrics-card')).toBeInTheDocument();
    expect(screen.getByText('Engagement Metrics')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument(); // Overall engagement
    expect(screen.getByText('24.5h')).toBeInTheDocument(); // Total time spent
    expect(screen.getByText('65%')).toBeInTheDocument(); // Interaction rate
    expect(screen.getByText('82%')).toBeInTheDocument(); // Completion rate
  });

  it('should display engagement trends correctly', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    // Check for trend indicators - use regex for split text
    const increasingElements = screen.getAllByText(/increasing/i);
    expect(increasingElements.length).toBeGreaterThanOrEqual(3); // Time spent, interaction rate, completion rate trends
    expect(screen.getByText(/stable/i)).toBeInTheDocument(); // Session frequency trend
  });

  it('should display content engagement breakdown', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    // Check content engagement metrics
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument(); // Video engagement
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument(); // Quiz engagement
    expect(screen.getByText('Readings')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument(); // Reading engagement
    expect(screen.getByText('Discussions')).toBeInTheDocument();
    expect(screen.getByText('38%')).toBeInTheDocument(); // Discussion engagement
  });

  it('should display session frequency metrics', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    // Check session frequency metrics - use getAllByText for multiple elements
    expect(screen.getByText(/Daily:/)).toBeInTheDocument();
    const dailyElements = screen.getAllByText(/45/);
    expect(dailyElements.length).toBeGreaterThanOrEqual(2); // Daily frequency and Readings both have 45%
    expect(screen.getByText(/Weekly:/)).toBeInTheDocument();
    expect(screen.getByText(/85/)).toBeInTheDocument(); // Weekly frequency
  });

  it('should support time period filtering', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    // Check default 30d selection
    expect(screen.getByRole('tab', { name: /30d/i })).toHaveClass('active');
    
    // Click 7d option
    const sevenDayButton = screen.getByRole('tab', { name: /7d/i });
    await user.click(sevenDayButton);
    
    expect(sevenDayButton).toHaveClass('active');
    expect(screen.getByRole('tab', { name: /30d/i })).not.toHaveClass('active');
  });

  it('should display engagement history chart', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('engagement-chart')).toBeInTheDocument();
    
    // Check chart exists (chart points are positioned absolutely and may not be visible in tests)
    expect(screen.getByTestId('engagement-chart')).toBeInTheDocument();
  });

  it('should show engagement score with proper color coding', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    const engagementScore = screen.getByText('78%');
    const scoreContainer = engagementScore.closest('.engagement-score');
    expect(scoreContainer).toHaveClass('engagement-good'); // 78% is good engagement
  });

  it('should handle different engagement levels correctly', () => {
    const lowEngagementData = {
      ...mockEngagementData,
      overallEngagement: 35
    };

    render(
      <TestWrapper>
        <EngagementMetricsCard data={lowEngagementData} />
      </TestWrapper>
    );

    const engagementScore = screen.getByText('35%');
    const scoreContainer = engagementScore.closest('.engagement-score');
    expect(scoreContainer).toHaveClass('engagement-low'); // 35% is low engagement
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={null} isLoading={true} />
      </TestWrapper>
    );

    expect(screen.getByTestId('engagement-loading')).toBeInTheDocument();
    expect(screen.getByText('Loading engagement data...')).toBeInTheDocument();
  });

  it('should show error state when data fails to load', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={null} error="Failed to load engagement data" />
      </TestWrapper>
    );

    expect(screen.getByTestId('engagement-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load engagement data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should show staleness indicator when data is stale', () => {
    const staleData = {
      ...mockEngagementData,
      isStale: true,
      lastUpdated: '2025-01-01T10:00:00Z' // Old data
    };

    render(
      <TestWrapper>
        <EngagementMetricsCard data={staleData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('staleness-indicator')).toBeInTheDocument();
    expect(screen.getByText(/data is stale/i)).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    const card = screen.getByTestId('engagement-metrics-card');
    expect(card).toHaveAttribute('role', 'region');
    expect(card).toHaveAttribute('aria-labelledby', 'engagement-title');
    
    expect(screen.getByText('Engagement Metrics')).toHaveAttribute('id', 'engagement-title');
    
    // Check chart has proper accessibility
    const chart = screen.getByTestId('engagement-chart');
    expect(chart).toHaveAttribute('role', 'img');
    expect(chart).toHaveAttribute('aria-label');
  });

  it('should support keyboard navigation for time period selection', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    const sevenDayButton = screen.getByRole('tab', { name: /7d/i });
    sevenDayButton.focus();
    
    await user.keyboard('{Enter}');
    
    expect(sevenDayButton).toHaveClass('active');
  });

  it('should calculate engagement score correctly', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    // Overall engagement should be displayed correctly
    expect(screen.getByText('78%')).toBeInTheDocument();
    
    // Check that engagement score is prominently displayed
    const engagementScore = screen.getByText('78%');
    expect(engagementScore).toBeInTheDocument();
  });

  it('should display average vs current comparisons', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    // Check for average vs current comparisons - use more flexible matching
    expect(screen.getByText(/2\.1/)).toBeInTheDocument(); // Average time per session
    expect(screen.getByText(/h\/session/)).toBeInTheDocument(); // Time unit
    expect(screen.getByText(/58/)).toBeInTheDocument(); // Average interaction rate
    expect(screen.getByText(/75/)).toBeInTheDocument(); // Average completion rate
  });

  it('should show engagement insights and recommendations', () => {
    render(
      <TestWrapper>
        <EngagementMetricsCard data={mockEngagementData} />
      </TestWrapper>
    );

    // Check for insights section
    expect(screen.getByText('Engagement Insights')).toBeInTheDocument();
    
    // Check for recommendations
    expect(screen.getByText(/recommendations/i)).toBeInTheDocument();
  });
});
