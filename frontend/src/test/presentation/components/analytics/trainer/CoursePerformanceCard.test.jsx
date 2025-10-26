import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { CoursePerformanceCard } from '../../../../../presentation/components/analytics/trainer/CoursePerformanceCard';

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

const mockCoursePerformanceData = {
  courses: [
    {
      courseId: 'course-123',
      courseName: 'Full Stack Web Development',
      enrollments: 245,
      activeStudents: 180,
      completionRate: 68,
      averageScore: 78.5,
      healthScore: 78,
      trend: 'improving'
    },
    {
      courseId: 'course-456',
      courseName: 'React Advanced Patterns',
      enrollments: 128,
      activeStudents: 95,
      completionRate: 72,
      averageScore: 82.3,
      healthScore: 85,
      trend: 'stable'
    },
    {
      courseId: 'course-789',
      courseName: 'Node.js Backend Development',
      enrollments: 89,
      activeStudents: 45,
      completionRate: 45,
      averageScore: 65.2,
      healthScore: 55,
      trend: 'declining'
    }
  ],
  summary: {
    totalCourses: 3,
    totalEnrollments: 462,
    averageCompletionRate: 62,
    averageHealthScore: 73
  },
  insights: [
    'Full Stack Web Development shows strong improvement trends.',
    'React Advanced Patterns maintains stable performance.',
    'Node.js Backend Development requires immediate attention due to declining trends.',
  ],
  recommendations: [
    'Review Node.js course content and structure.',
    'Consider additional support resources for struggling students.',
    'Implement peer review system for better engagement.',
  ],
  lastUpdated: '2023-11-15T10:00:00Z',
  staleness: 'fresh',
};

describe('CoursePerformanceCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render course performance card with key metrics', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('course-performance-card')).toBeInTheDocument();
    expect(screen.getByText('Course Performance')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Web Development')).toBeInTheDocument();
    expect(screen.getByText('React Advanced Patterns')).toBeInTheDocument();
    expect(screen.getByText('Node.js Backend Development')).toBeInTheDocument();
  });

  it('should display summary statistics correctly', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    expect(screen.getByText('3')).toBeInTheDocument(); // Total Courses
    expect(screen.getByText('462')).toBeInTheDocument(); // Total Enrollments
    expect(screen.getByText('62%')).toBeInTheDocument(); // Avg Completion Rate
    expect(screen.getByText('73')).toBeInTheDocument(); // Avg Health Score
  });

  it('should display individual course details', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    // Check course names
    expect(screen.getByText('Full Stack Web Development')).toBeInTheDocument();
    expect(screen.getByText('React Advanced Patterns')).toBeInTheDocument();
    expect(screen.getByText('Node.js Backend Development')).toBeInTheDocument();

    // Check course IDs
    expect(screen.getByText('ID: course-123')).toBeInTheDocument();
    expect(screen.getByText('ID: course-456')).toBeInTheDocument();
    expect(screen.getByText('ID: course-789')).toBeInTheDocument();

    // Check health scores
    expect(screen.getByText('78')).toBeInTheDocument(); // Full Stack health score
    expect(screen.getByText('85')).toBeInTheDocument(); // React health score
    expect(screen.getByText('55')).toBeInTheDocument(); // Node.js health score
  });

  it('should display course metrics correctly', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    // Check enrollments
    expect(screen.getByText('245')).toBeInTheDocument(); // Full Stack enrollments
    expect(screen.getByText('128')).toBeInTheDocument(); // React enrollments
    expect(screen.getByText('89')).toBeInTheDocument(); // Node.js enrollments

    // Check active students
    expect(screen.getByText('180')).toBeInTheDocument(); // Full Stack active students
    expect(screen.getByText('95')).toBeInTheDocument(); // React active students
    expect(screen.getByText('45')).toBeInTheDocument(); // Node.js active students

    // Check completion rates
    expect(screen.getByText('68%')).toBeInTheDocument(); // Full Stack completion
    expect(screen.getByText('72%')).toBeInTheDocument(); // React completion
    expect(screen.getByText('45%')).toBeInTheDocument(); // Node.js completion

    // Check average scores
    expect(screen.getByText('78.5%')).toBeInTheDocument(); // Full Stack avg score
    expect(screen.getByText('82.3%')).toBeInTheDocument(); // React avg score
    expect(screen.getByText('65.2%')).toBeInTheDocument(); // Node.js avg score
  });

  it('should display trend indicators correctly', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    // Check trend icons and text
    expect(screen.getByText('📈 IMPROVING')).toBeInTheDocument();
    expect(screen.getByText('➡️ STABLE')).toBeInTheDocument();
    expect(screen.getByText('📉 DECLINING')).toBeInTheDocument();
  });

  it('should display performance insights', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    expect(screen.getByText('Performance Insights')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Web Development shows strong improvement trends.')).toBeInTheDocument();
    expect(screen.getByText('React Advanced Patterns maintains stable performance.')).toBeInTheDocument();
    expect(screen.getByText('Node.js Backend Development requires immediate attention due to declining trends.')).toBeInTheDocument();
  });

  it('should display recommendations', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Review Node.js course content and structure.')).toBeInTheDocument();
    expect(screen.getByText('Consider additional support resources for struggling students.')).toBeInTheDocument();
    expect(screen.getByText('Implement peer review system for better engagement.')).toBeInTheDocument();
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard isLoading={true} />
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Course Performance')).not.toBeInTheDocument();
  });

  it('should show error state when data fails to load', async () => {
    const mockOnRetry = jest.fn();
    render(
      <TestWrapper>
        <CoursePerformanceCard error="Failed to load data" onRetry={mockOnRetry} />
      </TestWrapper>
    );
    expect(screen.getByText('Error: Failed to load data')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    await userEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should show no data message when no courses available', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={{ courses: [] }} />
      </TestWrapper>
    );
    expect(screen.getByText('No course performance data available')).toBeInTheDocument();
  });

  it('should show staleness indicator when data is stale', () => {
    const staleData = { ...mockCoursePerformanceData, staleness: 'stale' };
    render(
      <TestWrapper>
        <CoursePerformanceCard data={staleData} />
      </TestWrapper>
    );
    expect(screen.getByText('Stale')).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );
    expect(screen.getByRole('region', { name: /Course Performance/i })).toBeInTheDocument();
  });

  it('should display last updated timestamp', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );
    expect(screen.getByText('Last updated:')).toBeInTheDocument();
    // Check for the date in any format (toLocaleDateString can vary by locale)
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });

  it('should handle courses with different health score levels', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    // Check that health scores are displayed with appropriate styling
    const healthScore78 = screen.getByText('78');
    const healthScore85 = screen.getByText('85');
    const healthScore55 = screen.getByText('55');

    expect(healthScore78).toBeInTheDocument();
    expect(healthScore85).toBeInTheDocument();
    expect(healthScore55).toBeInTheDocument();
  });

  it('should display course performance summary section', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    expect(screen.getByText('Overall Performance Summary')).toBeInTheDocument();
    expect(screen.getByText('Course Details')).toBeInTheDocument();
  });

  it('should handle empty insights and recommendations gracefully', () => {
    const dataWithoutInsights = {
      ...mockCoursePerformanceData,
      insights: [],
      recommendations: []
    };

    render(
      <TestWrapper>
        <CoursePerformanceCard data={dataWithoutInsights} />
      </TestWrapper>
    );

    expect(screen.getByTestId('course-performance-card')).toBeInTheDocument();
    expect(screen.queryByText('Performance Insights')).not.toBeInTheDocument();
    expect(screen.queryByText('Recommendations')).not.toBeInTheDocument();
  });

  it('should display health score labels correctly', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    // Check that "Health Score" labels are displayed
    const healthScoreLabels = screen.getAllByText('Health Score');
    expect(healthScoreLabels.length).toBe(3); // One for each course
  });

  it('should display metric labels correctly', () => {
    render(
      <TestWrapper>
        <CoursePerformanceCard data={mockCoursePerformanceData} />
      </TestWrapper>
    );

    // Check metric labels
    expect(screen.getAllByText('Enrollments').length).toBe(3);
    expect(screen.getAllByText('Active Students').length).toBe(3);
    expect(screen.getAllByText('Completion Rate').length).toBe(3);
    expect(screen.getAllByText('Avg Score').length).toBe(3);
  });
});
