import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { LearningVelocityCard } from '../../../../../presentation/components/analytics/learner/LearningVelocityCard';

// Mock the AuthService
jest.mock('../../../../../application/services/AuthService', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    validatePasswordStrength: jest.fn(),
  })),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the AuthContext
jest.mock('../../../../../application/state/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: jest.fn(),
}));

// Mock the ThemeContext
jest.mock('../../../../../application/state/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>,
  useTheme: jest.fn(),
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('LearningVelocityCard', () => {
  const mockLearningVelocityData = {
    currentVelocity: 85,
    momentum: 'accelerating',
    trend: 'up',
    timeWindows: {
      '7d': { velocity: 78, momentum: 'steady' },
      '30d': { velocity: 85, momentum: 'accelerating' },
      '90d': { velocity: 72, momentum: 'slowing' }
    },
    velocityHistory: [
      { date: '2025-01-01', velocity: 70 },
      { date: '2025-01-02', velocity: 75 },
      { date: '2025-01-03', velocity: 80 },
      { date: '2025-01-04', velocity: 85 }
    ],
    lastUpdated: '2025-01-04T10:00:00Z',
    isStale: false
  };

  beforeEach(() => {
    // Mock authenticated learner user
    const { useAuth } = require('../../../../../application/state/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'learner@example.com', roles: ['learner'] },
      currentRole: 'learner',
      isLoading: false,
      error: null,
    });

    // Mock theme context
    const { useTheme } = require('../../../../../application/state/ThemeContext');
    useTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render learning velocity card with current velocity', () => {
    render(
      <TestWrapper>
        <LearningVelocityCard data={mockLearningVelocityData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('learning-velocity-card')).toBeInTheDocument();
    expect(screen.getByText('Learning Velocity')).toBeInTheDocument();
    expect(screen.getByText('85', { selector: '.velocity-value .value' })).toBeInTheDocument(); // Current velocity
    expect(screen.getByText('Accelerating')).toBeInTheDocument(); // Momentum
  });

  it('should display momentum with correct color coding', () => {
    render(
      <TestWrapper>
        <LearningVelocityCard data={mockLearningVelocityData} />
      </TestWrapper>
    );

    const momentumBadge = screen.getByText('Accelerating').closest('.momentum-badge');
    expect(momentumBadge).toHaveClass('momentum-accelerating');
  });

  it('should allow time window selection', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LearningVelocityCard data={mockLearningVelocityData} />
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

  it('should display velocity trend chart', () => {
    render(
      <TestWrapper>
        <LearningVelocityCard data={mockLearningVelocityData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('velocity-chart')).toBeInTheDocument();
    expect(screen.getByTestId('velocity-trend-line')).toBeInTheDocument();
  });

  it('should show staleness indicator when data is stale', () => {
    const staleData = {
      ...mockLearningVelocityData,
      isStale: true,
      lastUpdated: '2025-01-01T10:00:00Z' // Old data
    };

    render(
      <TestWrapper>
        <LearningVelocityCard data={staleData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('staleness-indicator')).toBeInTheDocument();
    expect(screen.getByText(/data is stale/i)).toBeInTheDocument();
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <LearningVelocityCard data={null} isLoading={true} />
      </TestWrapper>
    );

    expect(screen.getByTestId('learning-velocity-loading')).toBeInTheDocument();
    expect(screen.getByText('Loading learning velocity...')).toBeInTheDocument();
  });

  it('should show error state when data fails to load', () => {
    render(
      <TestWrapper>
        <LearningVelocityCard data={null} error="Failed to load velocity data" />
      </TestWrapper>
    );

    expect(screen.getByTestId('learning-velocity-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load velocity data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should handle momentum states correctly', () => {
    const slowingData = {
      ...mockLearningVelocityData,
      momentum: 'slowing',
      timeWindows: {
        '7d': { velocity: 78, momentum: 'steady' },
        '30d': { velocity: 85, momentum: 'slowing' },
        '90d': { velocity: 72, momentum: 'slowing' }
      }
    };

    render(
      <TestWrapper>
        <LearningVelocityCard data={slowingData} />
      </TestWrapper>
    );

    const momentumBadge = screen.getByText('Slowing').closest('.momentum-badge');
    expect(momentumBadge).toHaveClass('momentum-slowing');
  });

  it('should display velocity history data points', () => {
    render(
      <TestWrapper>
        <LearningVelocityCard data={mockLearningVelocityData} />
      </TestWrapper>
    );

    // Check that velocity history is displayed in chart
    expect(screen.getByTestId('velocity-chart')).toBeInTheDocument();
    // Chart should contain data points from velocityHistory
    mockLearningVelocityData.velocityHistory.forEach(point => {
      expect(screen.getByTestId(`velocity-point-${point.date}`)).toBeInTheDocument();
    });
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <LearningVelocityCard data={mockLearningVelocityData} />
      </TestWrapper>
    );

    const card = screen.getByTestId('learning-velocity-card');
    expect(card).toHaveAttribute('role', 'region');
    expect(card).toHaveAttribute('aria-labelledby', 'learning-velocity-title');
    
    expect(screen.getByText('Learning Velocity')).toHaveAttribute('id', 'learning-velocity-title');
  });

  it('should support keyboard navigation for time window selection', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LearningVelocityCard data={mockLearningVelocityData} />
      </TestWrapper>
    );

    const sevenDayButton = screen.getByRole('tab', { name: /7d/i });
    sevenDayButton.focus();
    
    await user.keyboard('{Enter}');
    
    expect(sevenDayButton).toHaveClass('active');
  });
});
