import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { StudentDistributionCard } from '../../../../../presentation/components/analytics/trainer/StudentDistributionCard';

// Mock the useAnalytics hook
jest.mock('../../../../../application/hooks/useAnalytics', () => ({
  useTrainerStudentDistribution: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
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

const mockStudentDistributionData = {
  courseName: 'Advanced React Development',
  totalStudents: 150,
  distribution: {
    excellent: {
      count: 25,
      percentage: 17,
      range: '90-100%'
    },
    good: {
      count: 45,
      percentage: 30,
      range: '80-89%'
    },
    average: {
      count: 60,
      percentage: 40,
      range: '70-79%'
    },
    struggling: {
      count: 20,
      percentage: 13,
      range: '0-69%'
    }
  },
  insights: {
    averageScore: 78,
    medianScore: 75,
    passRate: 87,
    atRiskStudents: 20,
    topPerformers: 25
  },
  lastUpdated: '2023-11-15T10:00:00Z',
};

describe('StudentDistributionCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render student distribution card with course information', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={mockStudentDistributionData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('student-distribution-card')).toBeInTheDocument();
    expect(screen.getByText('Advanced React Development')).toBeInTheDocument();
    expect(screen.getByText('Student Performance Distribution')).toBeInTheDocument();
    expect(screen.getByText('Total Students:')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('should display performance distribution correctly', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={mockStudentDistributionData} />
      </TestWrapper>
    );

    expect(screen.getByText('Performance Distribution')).toBeInTheDocument();
    expect(screen.getByText('excellent')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 25
    const twentyFiveElements = screen.getAllByText('25');
    expect(twentyFiveElements.length).toBeGreaterThanOrEqual(1);
    // Use getAllByText for multiple occurrences of 17%
    const seventeenPercentElements = screen.getAllByText('17%');
    expect(seventeenPercentElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('90-100%')).toBeInTheDocument();
    
    expect(screen.getByText('good')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 30%
    const thirtyPercentElements = screen.getAllByText('30%');
    expect(thirtyPercentElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('80-89%')).toBeInTheDocument();
    
    expect(screen.getByText('average')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 40%
    const fortyPercentElements = screen.getAllByText('40%');
    expect(fortyPercentElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('70-79%')).toBeInTheDocument();

    expect(screen.getByText('struggling')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 20
    const twentyElements = screen.getAllByText('20');
    expect(twentyElements.length).toBeGreaterThanOrEqual(1);
    // Use getAllByText for multiple occurrences of 13%
    const thirteenPercentElements = screen.getAllByText('13%');
    expect(thirteenPercentElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('0-69%')).toBeInTheDocument();
  });

  it('should display visual distribution bar correctly', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={mockStudentDistributionData} />
      </TestWrapper>
    );

    expect(screen.getByText('Visual Distribution')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences
    const seventeenPercentElements = screen.getAllByText('17%');
    expect(seventeenPercentElements.length).toBeGreaterThanOrEqual(1);
    const thirtyPercentElements = screen.getAllByText('30%');
    expect(thirtyPercentElements.length).toBeGreaterThanOrEqual(1);
    const fortyPercentElements = screen.getAllByText('40%');
    expect(fortyPercentElements.length).toBeGreaterThanOrEqual(1);
    const thirteenPercentElements = screen.getAllByText('13%');
    expect(thirteenPercentElements.length).toBeGreaterThanOrEqual(1);
    
    // Check scale markers (use getAllByText for multiple occurrences)
    const zeroPercentElements = screen.getAllByText('0%');
    expect(zeroPercentElements.length).toBeGreaterThanOrEqual(1);
    const twentyFivePercentElements = screen.getAllByText('25%');
    expect(twentyFivePercentElements.length).toBeGreaterThanOrEqual(1);
    const fiftyPercentElements = screen.getAllByText('50%');
    expect(fiftyPercentElements.length).toBeGreaterThanOrEqual(1);
    const seventyFivePercentElements = screen.getAllByText('75%');
    expect(seventyFivePercentElements.length).toBeGreaterThanOrEqual(1);
    const hundredPercentElements = screen.getAllByText('100%');
    expect(hundredPercentElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should display key insights correctly', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={mockStudentDistributionData} />
      </TestWrapper>
    );

    expect(screen.getByText('Key Insights')).toBeInTheDocument();
    expect(screen.getByText('Average Score')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('Median Score')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 75%
    const seventyFivePercentElements = screen.getAllByText('75%');
    expect(seventyFivePercentElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Pass Rate')).toBeInTheDocument();
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('At-Risk Students')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 20
    const twentyElements = screen.getAllByText('20');
    expect(twentyElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Top Performers')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 25
    const twentyFiveElements = screen.getAllByText('25');
    expect(twentyFiveElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should display action items correctly', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={mockStudentDistributionData} />
      </TestWrapper>
    );

    expect(screen.getByText('Action Items')).toBeInTheDocument();
    expect(screen.getByText(/20 students/)).toBeInTheDocument();
    expect(screen.getByText(/need immediate intervention/)).toBeInTheDocument();
    // Pass rate is 87% which is above 80%, so this message should not appear
    expect(screen.queryByText(/pass rate is below target/)).not.toBeInTheDocument();
    expect(screen.getByText(/25 top performers/)).toBeInTheDocument();
    expect(screen.getByText(/for peer mentoring/)).toBeInTheDocument();
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" isLoading={true} />
      </TestWrapper>
    );
    expect(screen.getByTestId('student-distribution-card-loading')).toBeInTheDocument();
    expect(screen.queryByText('Performance Distribution')).not.toBeInTheDocument();
  });

  it('should show error state when data fails to load', async () => {
    const mockOnRetry = jest.fn();
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" error={{ message: 'Failed to load data' }} onRetry={mockOnRetry} />
      </TestWrapper>
    );
    expect(screen.getByTestId('student-distribution-card-error')).toBeInTheDocument();
    expect(screen.getByText('Error loading student distribution')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    await userEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should show no data message when no student distribution data available', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={{}} />
      </TestWrapper>
    );
    expect(screen.getByTestId('student-distribution-card-no-data')).toBeInTheDocument();
    expect(screen.getByText('No student distribution data available for this course.')).toBeInTheDocument();
  });

  it('should display performance categories with proper color coding', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={mockStudentDistributionData} />
      </TestWrapper>
    );

    // Check that each category has the correct color classes
    const excellentElement = screen.getByText('excellent');
    expect(excellentElement).toHaveClass('text-green-400');
    
    const goodElement = screen.getByText('good');
    expect(goodElement).toHaveClass('text-blue-400');
    
    const averageElement = screen.getByText('average');
    expect(averageElement).toHaveClass('text-yellow-400');
    
    const strugglingElement = screen.getByText('struggling');
    expect(strugglingElement).toHaveClass('text-red-400');
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={mockStudentDistributionData} />
      </TestWrapper>
    );
    expect(screen.getByRole('region', { name: /Advanced React Development/i })).toBeInTheDocument();
  });

  it('should display last updated timestamp', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={mockStudentDistributionData} />
      </TestWrapper>
    );
    expect(screen.getByText('Last updated:')).toBeInTheDocument();
    expect(screen.getByText('15/11/2023')).toBeInTheDocument();
  });

  it('should handle empty distribution gracefully', () => {
    const dataWithoutDistribution = { ...mockStudentDistributionData, distribution: {} };
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={dataWithoutDistribution} />
      </TestWrapper>
    );
    expect(screen.getByTestId('student-distribution-card')).toBeInTheDocument();
    expect(screen.queryByText('Performance Distribution')).not.toBeInTheDocument();
  });

  it('should handle missing insights gracefully', () => {
    const dataWithoutInsights = { ...mockStudentDistributionData, insights: {} };
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={dataWithoutInsights} />
      </TestWrapper>
    );
    expect(screen.getByText('Advanced React Development')).toBeInTheDocument();
    expect(screen.queryByText('Key Insights')).not.toBeInTheDocument();
    expect(screen.queryByText('Action Items')).not.toBeInTheDocument();
  });

  it('should handle missing data gracefully', () => {
    const incompleteData = {
      courseName: 'Test Course',
      totalStudents: 50,
      distribution: {},
      insights: {},
      lastUpdated: '2023-11-15T10:00:00Z'
    };
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={incompleteData} />
      </TestWrapper>
    );
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Total Students:')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should use useTrainerStudentDistribution hook for data fetching', () => {
    const { useTrainerStudentDistribution } = require('../../../../../application/hooks/useAnalytics');
    useTrainerStudentDistribution.mockReturnValue({
      data: { data: { studentDistribution: mockStudentDistributionData } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" />
      </TestWrapper>
    );

    expect(useTrainerStudentDistribution).toHaveBeenCalledWith('trainer-123', 'course-123');
    expect(screen.getByText('Advanced React Development')).toBeInTheDocument();
  });

  it('should prioritize prop data over hook data', () => {
    const { useTrainerStudentDistribution } = require('../../../../../application/hooks/useAnalytics');
    useTrainerStudentDistribution.mockReturnValue({
      data: { data: { studentDistribution: { courseName: 'Hook Course', totalStudents: 10 } } },
      isLoading: false,
      error: null,
    });

    const propOverrideData = {
      courseName: 'Prop Course',
      totalStudents: 99,
      distribution: {},
      insights: {},
      lastUpdated: '2023-11-15T10:00:00Z'
    };

    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={propOverrideData} />
      </TestWrapper>
    );

    expect(useTrainerStudentDistribution).toHaveBeenCalledWith('trainer-123', 'course-123');
    expect(screen.getByText('Prop Course')).toBeInTheDocument();
    expect(screen.getByText('Total Students:')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('should display visual distribution bar with correct percentages', () => {
    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={mockStudentDistributionData} />
      </TestWrapper>
    );

    // Check that the visual distribution bar shows the correct percentages
    const visualBar = screen.getByText('Visual Distribution').closest('.visual-distribution-section');
    expect(visualBar).toBeInTheDocument();
    
    // Check that all percentage values are displayed in the bar (use getAllByText for multiple occurrences)
    const seventeenPercentElements = screen.getAllByText('17%');
    expect(seventeenPercentElements.length).toBeGreaterThanOrEqual(1);
    const thirtyPercentElements = screen.getAllByText('30%');
    expect(thirtyPercentElements.length).toBeGreaterThanOrEqual(1);
    const fortyPercentElements = screen.getAllByText('40%');
    expect(fortyPercentElements.length).toBeGreaterThanOrEqual(1);
    const thirteenPercentElements = screen.getAllByText('13%');
    expect(thirteenPercentElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should display action items based on insights data', () => {
    const dataWithHighPassRate = {
      ...mockStudentDistributionData,
      insights: {
        ...mockStudentDistributionData.insights,
        passRate: 95,
        atRiskStudents: 0,
        topPerformers: 0
      }
    };

    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={dataWithHighPassRate} />
      </TestWrapper>
    );

    expect(screen.getByText('Action Items')).toBeInTheDocument();
    // Should not show at-risk students action item
    expect(screen.queryByText(/students.*need immediate intervention/)).not.toBeInTheDocument();
    // Should not show pass rate warning
    expect(screen.queryByText(/pass rate is below target/)).not.toBeInTheDocument();
    // Should not show top performers action item
    expect(screen.queryByText(/Leverage.*top performers/)).not.toBeInTheDocument();
  });

  it('should handle zero values in insights gracefully', () => {
    const dataWithZeroValues = {
      ...mockStudentDistributionData,
      insights: {
        averageScore: 0,
        medianScore: 0,
        passRate: 0,
        atRiskStudents: 0,
        topPerformers: 0
      }
    };

    render(
      <TestWrapper>
        <StudentDistributionCard trainerId="trainer-123" courseId="course-123" data={dataWithZeroValues} />
      </TestWrapper>
    );

    // Check for zero values (use getAllByText for multiple occurrences)
    const zeroPercentElements = screen.getAllByText('0%');
    expect(zeroPercentElements.length).toBeGreaterThanOrEqual(1);
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Key Insights')).toBeInTheDocument();
  });
});
