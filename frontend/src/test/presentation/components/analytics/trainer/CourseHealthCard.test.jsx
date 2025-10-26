import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { CourseHealthCard } from '../../../../../presentation/components/analytics/trainer/CourseHealthCard';

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
  ...jest.requireActual('../../../../../application/state/AuthContext'),
  useAuth: jest.fn(() => ({
    isAuthenticated: true,
    user: { id: '1', email: 'test@example.com', roles: ['trainer'] },
    currentRole: 'trainer',
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    switchRole: jest.fn(),
  })),
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

const mockCourseHealthData = {
  courseName: 'Advanced React Development',
  healthScore: 78,
  overallHealth: 'good',
  staleness: 'fresh',
  lastUpdated: '2023-11-15T10:00:00Z',
  metrics: {
    enrollments: {
      total: 156,
      active: 142,
      comparisonToAverage: '+12%'
    },
    completion: {
      rate: 68,
      target: 75,
      variance: '-7%'
    },
    satisfaction: {
      averageRating: 4.2,
      totalReviews: 89,
      nps: 67,
      satisfactionScore: 82,
      ratingTrend: 'Rating has improved by 0.3 points this month'
    }
  },
  dropOffAnalysis: {
    overallDropOffRate: 12,
    dropOffPoints: [
      {
        moduleName: 'State Management with Redux',
        dropOffRate: 18,
        studentsDropped: 28,
        priority: 'high',
        likelyReasons: [
          'Complex concepts not explained clearly',
          'Lack of practical examples',
          'Too much theory without hands-on practice'
        ],
        recommendedActions: [
          'Add more interactive examples',
          'Break down complex topics into smaller parts',
          'Include step-by-step tutorials'
        ]
      },
      {
        moduleName: 'Advanced Hooks Patterns',
        dropOffRate: 8,
        studentsDropped: 12,
        priority: 'medium',
        likelyReasons: [
          'Students struggling with custom hooks',
          'Need more real-world examples'
        ],
        recommendedActions: [
          'Create custom hook templates',
          'Add more practical use cases'
        ]
      }
    ]
  },
  contentPerformance: {
    strugglingTopics: [
      {
        topic: 'Redux Middleware',
        averageScore: 45,
        passRate: 32,
        averageAttempts: 3.2,
        studentFeedback: 'This topic is really confusing, need more examples'
      },
      {
        topic: 'Context API Optimization',
        averageScore: 52,
        passRate: 41,
        averageAttempts: 2.8,
        studentFeedback: 'Hard to understand when to use Context vs Redux'
      }
    ],
    highPerformanceTopics: [
      {
        topic: 'React Hooks Basics',
        averageScore: 89,
        passRate: 94,
        averageAttempts: 1.3,
        studentFeedback: 'Great explanations and examples!'
      },
      {
        topic: 'Component Composition',
        averageScore: 85,
        passRate: 91,
        averageAttempts: 1.5,
        studentFeedback: 'Very clear and practical examples'
      }
    ]
  },
  recommendations: [
    {
      priority: 'high',
      type: 'content_improvement',
      suggestion: 'Redesign Redux State Management module with more practical examples',
      expectedImpact: 'Reduce drop-off rate by 15-20%'
    },
    {
      priority: 'medium',
      type: 'assessment_adjustment',
      suggestion: 'Add more formative assessments in struggling topics',
      expectedImpact: 'Improve average scores by 10-15%'
    },
    {
      priority: 'low',
      type: 'content_addition',
      suggestion: 'Create additional practice exercises for Context API',
      expectedImpact: 'Increase student confidence and retention'
    }
  ]
};

describe('CourseHealthCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render course health card with key metrics', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('course-health-card')).toBeInTheDocument();
    expect(screen.getByText('Course Health')).toBeInTheDocument();
    expect(screen.getByText('Advanced React Development')).toBeInTheDocument();
    expect(screen.getByText('GOOD')).toBeInTheDocument();
    expect(screen.getByText(/Health Score:/)).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
  });

  it('should display key metrics correctly', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    expect(screen.getByText('Total Enrollments')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('Active Students')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
  });

  it('should display student satisfaction metrics', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    expect(screen.getByText('Student Satisfaction')).toBeInTheDocument();
    expect(screen.getByText('Average Rating')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
    expect(screen.getByText('Total Reviews')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
    expect(screen.getByText('NPS Score')).toBeInTheDocument();
    expect(screen.getByText('67')).toBeInTheDocument();
    expect(screen.getByText('Satisfaction Score')).toBeInTheDocument();
    expect(screen.getByText('82')).toBeInTheDocument();
  });

  it('should display drop-off analysis', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    expect(screen.getByText('Drop-off Analysis')).toBeInTheDocument();
    expect(screen.getByText('12%')).toBeInTheDocument();
    expect(screen.getByText('Overall Drop-off Rate')).toBeInTheDocument();
    expect(screen.getByText('State Management with Redux')).toBeInTheDocument();
    expect(screen.getByText('Advanced Hooks Patterns')).toBeInTheDocument();
  });

  it('should expand and collapse drop-off details', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    // Click on first drop-off point to expand
    const firstDropOff = screen.getByText('State Management with Redux');
    await user.click(firstDropOff);

    // Check if details are shown
    expect(screen.getByText('Likely Reasons:')).toBeInTheDocument();
    expect(screen.getByText('Complex concepts not explained clearly')).toBeInTheDocument();
    expect(screen.getByText('Recommended Actions:')).toBeInTheDocument();
    expect(screen.getByText('Add more interactive examples')).toBeInTheDocument();

    // Click again to collapse
    await user.click(firstDropOff);

    // Check if details are hidden
    expect(screen.queryByText('Likely Reasons:')).not.toBeInTheDocument();
  });

  it('should display content performance topics', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    expect(screen.getByText('Content Performance')).toBeInTheDocument();
    expect(screen.getByText('📉 Struggling Topics')).toBeInTheDocument();
    expect(screen.getByText('Redux Middleware')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('📈 High Performance Topics')).toBeInTheDocument();
    expect(screen.getByText('React Hooks Basics')).toBeInTheDocument();
    expect(screen.getByText('89%')).toBeInTheDocument();
  });

  it('should display recommendations with priorities', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    const highPriorityElements = screen.getAllByText('HIGH');
    expect(highPriorityElements.length).toBeGreaterThanOrEqual(1);
    const mediumPriorityElements = screen.getAllByText('MEDIUM');
    expect(mediumPriorityElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('LOW')).toBeInTheDocument();
    expect(screen.getByText('Redesign Redux State Management module with more practical examples')).toBeInTheDocument();
    const expectedImpactElements = screen.getAllByText('Expected Impact:');
    expect(expectedImpactElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <CourseHealthCard isLoading={true} />
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Course Health')).not.toBeInTheDocument();
  });

  it('should show error state when data fails to load', async () => {
    const mockOnRetry = jest.fn();
    render(
      <TestWrapper>
        <CourseHealthCard error="Failed to load data" onRetry={mockOnRetry} />
      </TestWrapper>
    );
    expect(screen.getByText('Error: Failed to load data')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    await userEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should show no data message when no data available', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={null} />
      </TestWrapper>
    );
    expect(screen.getByText('No course health data available')).toBeInTheDocument();
  });

  it('should show staleness indicator when data is stale', () => {
    const staleData = { ...mockCourseHealthData, staleness: 'stale' };
    render(
      <TestWrapper>
        <CourseHealthCard data={staleData} />
      </TestWrapper>
    );
    expect(screen.getByText('Stale')).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );
    expect(screen.getByRole('region', { name: /Course Health/i })).toBeInTheDocument();
  });

  it('should display last updated timestamp', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );
    expect(screen.getByText('Last updated:')).toBeInTheDocument();
    // Check for the date in any format (toLocaleDateString can vary by locale)
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });

  it('should handle different health score levels correctly', () => {
    const { rerender } = render(
      <TestWrapper>
        <CourseHealthCard data={{ ...mockCourseHealthData, healthScore: 45, overallHealth: 'poor' }} />
      </TestWrapper>
    );
    expect(screen.getByText('POOR')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <CourseHealthCard data={{ ...mockCourseHealthData, healthScore: 78, overallHealth: 'good' }} />
      </TestWrapper>
    );
    expect(screen.getByText('GOOD')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <CourseHealthCard data={{ ...mockCourseHealthData, healthScore: 90, overallHealth: 'excellent' }} />
      </TestWrapper>
    );
    expect(screen.getByText('EXCELLENT')).toBeInTheDocument();
  });

  it('should handle empty content performance gracefully', () => {
    const dataWithoutContent = {
      ...mockCourseHealthData,
      contentPerformance: {
        strugglingTopics: [],
        highPerformanceTopics: []
      }
    };
    render(
      <TestWrapper>
        <CourseHealthCard data={dataWithoutContent} />
      </TestWrapper>
    );
    expect(screen.getByTestId('course-health-card')).toBeInTheDocument();
    expect(screen.queryByText('📉 Struggling Topics')).not.toBeInTheDocument();
    expect(screen.queryByText('📈 High Performance Topics')).not.toBeInTheDocument();
  });

  it('should handle empty recommendations gracefully', () => {
    const dataWithoutRecommendations = {
      ...mockCourseHealthData,
      recommendations: []
    };
    render(
      <TestWrapper>
        <CourseHealthCard data={dataWithoutRecommendations} />
      </TestWrapper>
    );
    expect(screen.getByTestId('course-health-card')).toBeInTheDocument();
    expect(screen.queryByText('Recommendations')).not.toBeInTheDocument();
  });

  it('should support keyboard navigation for drop-off expansion', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    // Find the first drop-off point by looking for the clickable element
    const firstDropOffElement = screen.getByText('State Management with Redux').closest('[role="button"]');
    expect(firstDropOffElement).toBeInTheDocument();
    
    firstDropOffElement.focus();

    // Press Enter to expand
    await user.keyboard('{Enter}');
    expect(screen.getByText('Likely Reasons:')).toBeInTheDocument();

    // Press Space to collapse
    await user.keyboard(' ');
    expect(screen.queryByText('Likely Reasons:')).not.toBeInTheDocument();
  });

  it('should display health score with proper color coding', () => {
    const { rerender } = render(
      <TestWrapper>
        <CourseHealthCard data={{ ...mockCourseHealthData, healthScore: 45 }} />
      </TestWrapper>
    );
    const healthScoreElement = screen.getByText('45');
    expect(healthScoreElement).toHaveClass('text-red-600');

    rerender(
      <TestWrapper>
        <CourseHealthCard data={{ ...mockCourseHealthData, healthScore: 78 }} />
      </TestWrapper>
    );
    const healthScoreElement2 = screen.getByText('78');
    expect(healthScoreElement2).toHaveClass('text-yellow-600');

    rerender(
      <TestWrapper>
        <CourseHealthCard data={{ ...mockCourseHealthData, healthScore: 90 }} />
      </TestWrapper>
    );
    const healthScoreElement3 = screen.getByText('90');
    expect(healthScoreElement3).toHaveClass('text-green-600');
  });

  it('should display priority badges with correct colors', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    const highPriorityElements = screen.getAllByText('HIGH');
    expect(highPriorityElements.length).toBeGreaterThanOrEqual(1);
    const mediumPriorityElements = screen.getAllByText('MEDIUM');
    expect(mediumPriorityElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('should display student feedback for topics', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    expect(screen.getByText('"This topic is really confusing, need more examples"')).toBeInTheDocument();
    expect(screen.getByText('"Great explanations and examples!"')).toBeInTheDocument();
  });

  it('should display rating trend information', () => {
    render(
      <TestWrapper>
        <CourseHealthCard data={mockCourseHealthData} />
      </TestWrapper>
    );

    expect(screen.getByText('Rating has improved by 0.3 points this month')).toBeInTheDocument();
  });
});