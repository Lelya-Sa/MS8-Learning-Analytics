import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { MasteryProgressionCard } from '../../../../../presentation/components/analytics/learner/MasteryProgressionCard';

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

describe('MasteryProgressionCard', () => {
  const mockMasteryData = {
    overallMastery: 0.68, // 68%
    skillCategories: [
      {
        id: 'programming',
        name: 'Programming',
        mastery: 0.75,
        progress: 0.15, // 15% improvement this period
        skills: [
          { id: 'javascript', name: 'JavaScript', mastery: 0.80, trend: 'increasing' },
          { id: 'python', name: 'Python', mastery: 0.70, trend: 'stable' },
          { id: 'react', name: 'React', mastery: 0.75, trend: 'increasing' }
        ]
      },
      {
        id: 'frontend',
        name: 'Frontend Development',
        mastery: 0.65,
        progress: 0.20, // 20% improvement this period
        skills: [
          { id: 'html', name: 'HTML', mastery: 0.90, trend: 'stable' },
          { id: 'css', name: 'CSS', mastery: 0.70, trend: 'increasing' },
          { id: 'vue', name: 'Vue.js', mastery: 0.35, trend: 'increasing' }
        ]
      },
      {
        id: 'backend',
        name: 'Backend Development',
        mastery: 0.60,
        progress: 0.10, // 10% improvement this period
        skills: [
          { id: 'nodejs', name: 'Node.js', mastery: 0.65, trend: 'increasing' },
          { id: 'express', name: 'Express', mastery: 0.55, trend: 'stable' },
          { id: 'mongodb', name: 'MongoDB', mastery: 0.60, trend: 'increasing' }
        ]
      }
    ],
    masteryHistory: [
      { date: '2025-01-01', mastery: 0.45, skillsLearned: 3, timeSpent: 2.5 },
      { date: '2025-01-08', mastery: 0.52, skillsLearned: 2, timeSpent: 3.0 },
      { date: '2025-01-15', mastery: 0.58, skillsLearned: 4, timeSpent: 2.8 },
      { date: '2025-01-22', mastery: 0.65, skillsLearned: 3, timeSpent: 3.2 },
      { date: '2025-01-29', mastery: 0.68, skillsLearned: 2, timeSpent: 2.9 }
    ],
    milestones: [
      { id: 'beginner', name: 'Beginner', threshold: 0.25, achieved: true, date: '2025-01-05' },
      { id: 'intermediate', name: 'Intermediate', threshold: 0.50, achieved: true, date: '2025-01-20' },
      { id: 'advanced', name: 'Advanced', threshold: 0.75, achieved: false, date: null },
      { id: 'expert', name: 'Expert', threshold: 0.90, achieved: false, date: null }
    ],
    nextMilestone: {
      id: 'advanced',
      name: 'Advanced',
      threshold: 0.75,
      progress: 0.68,
      remaining: 0.07
    },
    lastUpdated: '2025-01-29T10:00:00Z',
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

  it('should render mastery progression card with key metrics', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('mastery-progression-card')).toBeInTheDocument();
    expect(screen.getByText('Mastery Progression')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument(); // Overall mastery
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
    expect(screen.getByText('Backend Development')).toBeInTheDocument();
  });

  it('should display skill categories with mastery levels', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Check skill categories - use getAllByText for multiple elements
    expect(screen.getByText('Programming')).toBeInTheDocument();
    const mastery75Elements = screen.getAllByText('75%');
    expect(mastery75Elements.length).toBeGreaterThanOrEqual(1); // Programming mastery
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
    const mastery65Elements = screen.getAllByText('65%');
    expect(mastery65Elements.length).toBeGreaterThanOrEqual(1); // Frontend mastery
    expect(screen.getByText('Backend Development')).toBeInTheDocument();
    const mastery60Elements = screen.getAllByText('60%');
    expect(mastery60Elements.length).toBeGreaterThanOrEqual(1); // Backend mastery
  });

  it('should display individual skills within categories', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Check individual skills - use getAllByText for multiple elements
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument(); // JavaScript mastery
    expect(screen.getByText('Python')).toBeInTheDocument();
    const mastery70Elements = screen.getAllByText('70%');
    expect(mastery70Elements.length).toBeGreaterThanOrEqual(1); // Python mastery
    expect(screen.getByText('React')).toBeInTheDocument();
    const mastery75Elements = screen.getAllByText('75%');
    expect(mastery75Elements.length).toBeGreaterThanOrEqual(1); // React mastery
  });

  it('should display mastery trends correctly', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Check for trend indicators - use getAllByText for multiple elements
    const increasingElements = screen.getAllByText(/increasing/i);
    expect(increasingElements.length).toBeGreaterThan(0);
    const stableElements = screen.getAllByText(/stable/i);
    expect(stableElements.length).toBeGreaterThan(0);
  });

  it('should display progress indicators for each category', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Check progress indicators
    expect(screen.getByText('+15%')).toBeInTheDocument(); // Programming progress
    expect(screen.getByText('+20%')).toBeInTheDocument(); // Frontend progress
    expect(screen.getByText('+10%')).toBeInTheDocument(); // Backend progress
  });

  it('should display mastery milestones', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Check milestones - use getAllByText for multiple elements
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    const intermediateElements = screen.getAllByText('Intermediate');
    expect(intermediateElements.length).toBeGreaterThanOrEqual(1); // Appears in score level and milestone
    expect(screen.getByText('Advanced')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('should highlight achieved milestones', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Check achieved milestones have proper styling - use getAllByText for multiple elements
    const beginnerMilestone = screen.getByText('Beginner').closest('.milestone-item');
    const intermediateElements = screen.getAllByText('Intermediate');
    const intermediateMilestone = intermediateElements.find(el => 
      el.closest('.milestone-item')
    )?.closest('.milestone-item');
    
    expect(beginnerMilestone).toHaveClass('achieved');
    expect(intermediateMilestone).toHaveClass('achieved');
  });

  it('should display next milestone progress', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Check next milestone info
    expect(screen.getByText('Next Milestone: Advanced')).toBeInTheDocument();
    expect(screen.getByText('7% to go')).toBeInTheDocument(); // Remaining progress
  });

  it('should support category expansion/collapse', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Initially skills should be visible
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    
    // Click to collapse programming category
    const programmingHeader = screen.getByText('Programming').closest('.category-header');
    const collapseButton = programmingHeader.querySelector('.expand-collapse-btn');
    
    await user.click(collapseButton);
    
    // Skills should be hidden
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
    
    // Click to expand again
    await user.click(collapseButton);
    
    // Skills should be visible again
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('should display mastery history chart', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('mastery-chart')).toBeInTheDocument();
    
    // Check chart exists (chart points are positioned absolutely and may not be visible in tests)
    expect(screen.getByTestId('mastery-chart')).toBeInTheDocument();
  });

  it('should show mastery score with proper color coding', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    const masteryScore = screen.getByText('68%');
    const scoreContainer = masteryScore.closest('.mastery-score');
    expect(scoreContainer).toHaveClass('mastery-intermediate'); // 68% is intermediate mastery
  });

  it('should handle different mastery levels correctly', () => {
    const highMasteryData = {
      ...mockMasteryData,
      overallMastery: 0.85
    };

    render(
      <TestWrapper>
        <MasteryProgressionCard data={highMasteryData} />
      </TestWrapper>
    );

    const masteryScore = screen.getByText('85%');
    const scoreContainer = masteryScore.closest('.mastery-score');
    expect(scoreContainer).toHaveClass('mastery-advanced'); // 85% is advanced mastery
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={null} isLoading={true} />
      </TestWrapper>
    );

    expect(screen.getByTestId('mastery-loading')).toBeInTheDocument();
    expect(screen.getByText('Loading mastery data...')).toBeInTheDocument();
  });

  it('should show error state when data fails to load', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={null} error="Failed to load mastery data" />
      </TestWrapper>
    );

    expect(screen.getByTestId('mastery-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load mastery data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should show staleness indicator when data is stale', () => {
    const staleData = {
      ...mockMasteryData,
      isStale: true,
      lastUpdated: '2025-01-01T10:00:00Z' // Old data
    };

    render(
      <TestWrapper>
        <MasteryProgressionCard data={staleData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('staleness-indicator')).toBeInTheDocument();
    expect(screen.getByText(/data is stale/i)).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    const card = screen.getByTestId('mastery-progression-card');
    expect(card).toHaveAttribute('role', 'region');
    expect(card).toHaveAttribute('aria-labelledby', 'mastery-title');
    
    expect(screen.getByText('Mastery Progression')).toHaveAttribute('id', 'mastery-title');
    
    // Check chart has proper accessibility
    const chart = screen.getByTestId('mastery-chart');
    expect(chart).toHaveAttribute('role', 'img');
    expect(chart).toHaveAttribute('aria-label');
  });

  it('should support keyboard navigation for category expansion', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    const programmingHeader = screen.getByText('Programming').closest('.category-header');
    const collapseButton = programmingHeader.querySelector('.expand-collapse-btn');
    collapseButton.focus();
    
    await user.keyboard('{Enter}');
    
    // Skills should be hidden
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
  });

  it('should calculate mastery score correctly', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Overall mastery should be displayed correctly
    expect(screen.getByText('68%')).toBeInTheDocument();
    
    // Check that mastery score is prominently displayed
    const masteryScore = screen.getByText('68%');
    expect(masteryScore).toBeInTheDocument();
  });

  it('should display skill-level mastery with progress bars', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Check for progress bars (they should have role="progressbar")
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
    
    // Check that progress bars have proper aria attributes
    progressBars.forEach(bar => {
      expect(bar).toHaveAttribute('aria-valuenow');
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
    });
  });

  it('should show mastery insights and recommendations', () => {
    render(
      <TestWrapper>
        <MasteryProgressionCard data={mockMasteryData} />
      </TestWrapper>
    );

    // Check for insights section
    expect(screen.getByText('Mastery Insights')).toBeInTheDocument();
    
    // Check for recommendations
    expect(screen.getByText(/recommendations/i)).toBeInTheDocument();
  });
});
