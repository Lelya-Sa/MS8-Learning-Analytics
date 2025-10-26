import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { TeachingEffectivenessCard } from '../../../../../presentation/components/analytics/trainer/TeachingEffectivenessCard';

// Mock the useAnalytics hook
jest.mock('../../../../../application/hooks/useAnalytics', () => ({
  useTrainerTeachingEffectiveness: jest.fn(() => ({
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

const mockTeachingEffectivenessData = {
  overallScore: 85,
  metrics: {
    studentSatisfaction: {
      score: 4.2,
      totalReviews: 156,
      trend: '+12%'
    },
    learningOutcomes: {
      averageScoreImprovement: 18,
      skillAcquisitionRate: 92,
      completionRate: 88
    },
    engagement: {
      responseTime: '2.3h',
      feedbackQuality: 4.5,
      availabilityScore: 95
    }
  },
  strengths: [
    'Excellent communication skills',
    'Quick response to student questions',
    'Well-structured course materials'
  ],
  improvementAreas: [
    'Increase interactive activities',
    'Provide more detailed feedback',
    'Improve assessment variety'
  ],
  lastUpdated: '2023-11-15T10:00:00Z',
};

describe('TeachingEffectivenessCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render teaching effectiveness card with overall score', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('teaching-effectiveness-card')).toBeInTheDocument();
    expect(screen.getByText('Teaching Effectiveness Score')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Overall Score')).toBeInTheDocument();
  });

  it('should display student satisfaction metrics correctly', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );

    // Use getAllByText for multiple occurrences of Student Satisfaction
    const studentSatisfactionElements = screen.getAllByText('Student Satisfaction');
    expect(studentSatisfactionElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Score:')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
    expect(screen.getByText('Reviews:')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('Trend:')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('should display learning outcomes metrics correctly', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );

    expect(screen.getByText('Learning Outcomes')).toBeInTheDocument();
    expect(screen.getByText('Score Improvement:')).toBeInTheDocument();
    expect(screen.getByText('18%')).toBeInTheDocument();
    expect(screen.getByText('Skill Acquisition:')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate:')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 88%
    const eightyEightPercentElements = screen.getAllByText('88%');
    expect(eightyEightPercentElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should display engagement metrics correctly', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );

    expect(screen.getByText('Engagement')).toBeInTheDocument();
    expect(screen.getByText('Response Time:')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 2.3h
    const responseTimeElements = screen.getAllByText('2.3h');
    expect(responseTimeElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Feedback Quality:')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Availability:')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('should display strengths correctly', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );

    expect(screen.getByText('Strengths')).toBeInTheDocument();
    expect(screen.getByText('Excellent communication skills')).toBeInTheDocument();
    expect(screen.getByText('Quick response to student questions')).toBeInTheDocument();
    expect(screen.getByText('Well-structured course materials')).toBeInTheDocument();
  });

  it('should display improvement areas correctly', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );

    expect(screen.getByText('Areas for Improvement')).toBeInTheDocument();
    expect(screen.getByText('Increase interactive activities')).toBeInTheDocument();
    expect(screen.getByText('Provide more detailed feedback')).toBeInTheDocument();
    expect(screen.getByText('Improve assessment variety')).toBeInTheDocument();
  });

  it('should display performance summary correctly', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );

    expect(screen.getByText('Performance Summary')).toBeInTheDocument();
    expect(screen.getByText('4.2/5')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of Student Satisfaction
    const studentSatisfactionElements = screen.getAllByText('Student Satisfaction');
    expect(studentSatisfactionElements.length).toBeGreaterThanOrEqual(1);
    // Use getAllByText for multiple occurrences of 2.3h
    const responseTimeElements = screen.getAllByText('2.3h');
    expect(responseTimeElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Response Time')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of 88%
    const eightyEightPercentElements = screen.getAllByText('88%');
    expect(eightyEightPercentElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" isLoading={true} />
      </TestWrapper>
    );
    expect(screen.getByTestId('teaching-effectiveness-card-loading')).toBeInTheDocument();
    expect(screen.queryByText('Teaching Effectiveness Score')).not.toBeInTheDocument();
  });

  it('should show error state when data fails to load', async () => {
    const mockOnRetry = jest.fn();
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" error={{ message: 'Failed to load data' }} onRetry={mockOnRetry} />
      </TestWrapper>
    );
    expect(screen.getByTestId('teaching-effectiveness-card-error')).toBeInTheDocument();
    expect(screen.getByText('Error loading teaching effectiveness')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    await userEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should show no data message when no teaching effectiveness data available', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={{}} />
      </TestWrapper>
    );
    expect(screen.getByTestId('teaching-effectiveness-card-no-data')).toBeInTheDocument();
    expect(screen.getByText('No teaching effectiveness data available')).toBeInTheDocument();
  });

  it('should display score with proper color coding for high scores', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );

    const scoreElement = screen.getByText('85');
    const colorDiv = scoreElement.closest('div.text-center');
    expect(colorDiv).toHaveClass('text-green-400');
  });

  it('should display score with proper color coding for medium scores', () => {
    const mediumScoreData = { ...mockTeachingEffectivenessData, overallScore: 65 };
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mediumScoreData} />
      </TestWrapper>
    );

    const scoreElement = screen.getByText('65');
    const colorDiv = scoreElement.closest('div.text-center');
    expect(colorDiv).toHaveClass('text-yellow-400');
  });

  it('should display score with proper color coding for low scores', () => {
    const lowScoreData = { ...mockTeachingEffectivenessData, overallScore: 45 };
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={lowScoreData} />
      </TestWrapper>
    );

    const scoreElement = screen.getByText('45');
    const colorDiv = scoreElement.closest('div.text-center');
    expect(colorDiv).toHaveClass('text-red-400');
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );
    expect(screen.getByRole('region', { name: /Teaching Effectiveness Score/i })).toBeInTheDocument();
  });

  it('should display last updated timestamp', () => {
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={mockTeachingEffectivenessData} />
      </TestWrapper>
    );
    expect(screen.getByText('Last updated:')).toBeInTheDocument();
    expect(screen.getByText('15/11/2023')).toBeInTheDocument();
  });

  it('should handle empty strengths gracefully', () => {
    const dataWithoutStrengths = { ...mockTeachingEffectivenessData, strengths: [] };
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={dataWithoutStrengths} />
      </TestWrapper>
    );
    expect(screen.getByTestId('teaching-effectiveness-card')).toBeInTheDocument();
    expect(screen.getByText('No strengths data available')).toBeInTheDocument();
  });

  it('should handle empty improvement areas gracefully', () => {
    const dataWithoutImprovements = { ...mockTeachingEffectivenessData, improvementAreas: [] };
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={dataWithoutImprovements} />
      </TestWrapper>
    );
    expect(screen.getByTestId('teaching-effectiveness-card')).toBeInTheDocument();
    expect(screen.getByText('No improvement areas identified')).toBeInTheDocument();
  });

  it('should handle missing strengths and improvement areas gracefully', () => {
    const dataWithoutLists = { ...mockTeachingEffectivenessData };
    delete dataWithoutLists.strengths;
    delete dataWithoutLists.improvementAreas;
    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={dataWithoutLists} />
      </TestWrapper>
    );
    expect(screen.getByTestId('teaching-effectiveness-card')).toBeInTheDocument();
    expect(screen.getByText('No strengths data available')).toBeInTheDocument();
    expect(screen.getByText('No improvement areas identified')).toBeInTheDocument();
  });

  it('should use useTrainerTeachingEffectiveness hook for data fetching', () => {
    const { useTrainerTeachingEffectiveness } = require('../../../../../application/hooks/useAnalytics');
    useTrainerTeachingEffectiveness.mockReturnValue({
      data: { data: { teachingEffectiveness: mockTeachingEffectivenessData } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" />
      </TestWrapper>
    );

    expect(useTrainerTeachingEffectiveness).toHaveBeenCalledWith('trainer-123');
    expect(screen.getByText('Teaching Effectiveness Score')).toBeInTheDocument();
  });

  it('should prioritize prop data over hook data', () => {
    const { useTrainerTeachingEffectiveness } = require('../../../../../application/hooks/useAnalytics');
    useTrainerTeachingEffectiveness.mockReturnValue({
      data: { data: { teachingEffectiveness: { overallScore: 50 } } }, // Different data from hook
      isLoading: false,
      error: null,
    });

    const propOverrideData = {
      overallScore: 90,
      metrics: {
        studentSatisfaction: { score: 4.8, totalReviews: 200, trend: '+20%' },
        learningOutcomes: { averageScoreImprovement: 25, skillAcquisitionRate: 95, completionRate: 92 },
        engagement: { responseTime: '1.5h', feedbackQuality: 4.8, availabilityScore: 98 }
      },
      strengths: ['Prop strength'],
      improvementAreas: ['Prop improvement']
    };

    render(
      <TestWrapper>
        <TeachingEffectivenessCard trainerId="trainer-123" data={propOverrideData} />
      </TestWrapper>
    );

    expect(useTrainerTeachingEffectiveness).toHaveBeenCalledWith('trainer-123');
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('Prop strength')).toBeInTheDocument();
    expect(screen.getByText('Prop improvement')).toBeInTheDocument();
  });
});
