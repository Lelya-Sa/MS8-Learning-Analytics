import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { LearningCultureCard } from '../../../../../presentation/components/analytics/organization/LearningCultureCard';

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
    user: { id: '1', email: 'test@example.com', roles: ['org-admin'] },
    currentRole: 'org-admin',
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    switchRole: jest.fn(),
  })),
}));

// Mock the useLearningCulture hook
jest.mock('../../../../../application/hooks/useAnalytics', () => ({
  useLearningCulture: jest.fn(() => ({
    data: {
      data: {
        learningCulture: {
          period: 'Q4 2023',
          overallCultureScore: 82,
          cultureGrade: 'B',
          metrics: {
            learningEngagement: {
              score: 85,
              activeParticipation: 78,
              voluntaryLearning: 72,
              peerCollaboration: 68,
            },
            knowledgeSharing: {
              score: 79,
              mentorshipPrograms: 12,
              activeMentors: 45,
              knowledgeBaseSessions: 28,
            },
            innovationMetrics: {
              score: 76,
              newIdeasSubmitted: 156,
              ideasImplemented: 89,
              innovationProjects: 23,
            },
            continuousImprovement: {
              score: 81,
              feedbackLoops: 8,
              courseCompletionTrend: 'increasing',
              skillApplicationRate: 74,
            },
          },
          culturalIndicators: {
            managerSupport: 88,
            learningTimeAllocation: 15,
            recognitionPrograms: 6,
            careerDevelopmentOpportunities: 18,
          },
          benchmarks: {
            industryAverage: 68,
            vsIndustry: '+14%',
            standing: 'Above Average',
          },
          recommendations: [
            'Increase peer collaboration initiatives',
            'Expand mentorship programs',
            'Implement more innovation challenges',
            'Enhance feedback loop mechanisms',
          ],
          lastUpdated: '2023-11-15T10:00:00Z',
          staleness: 'fresh',
        },
      },
    },
    isLoading: false,
    error: null,
  })),
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

const mockLearningCultureData = {
  period: 'Q4 2023',
  overallCultureScore: 82,
  cultureGrade: 'B',
  metrics: {
    learningEngagement: {
      score: 85,
      activeParticipation: 78,
      voluntaryLearning: 72,
      peerCollaboration: 68,
    },
    knowledgeSharing: {
      score: 79,
      mentorshipPrograms: 12,
      activeMentors: 45,
      knowledgeBaseSessions: 28,
    },
    innovationMetrics: {
      score: 76,
      newIdeasSubmitted: 156,
      ideasImplemented: 89,
      innovationProjects: 23,
    },
    continuousImprovement: {
      score: 81,
      feedbackLoops: 8,
      courseCompletionTrend: 'increasing',
      skillApplicationRate: 74,
    },
  },
  culturalIndicators: {
    managerSupport: 88,
    learningTimeAllocation: 15,
    recognitionPrograms: 6,
    careerDevelopmentOpportunities: 18,
  },
  benchmarks: {
    industryAverage: 68,
    vsIndustry: '+14%',
    standing: 'Above Average',
  },
  recommendations: [
    'Increase peer collaboration initiatives',
    'Expand mentorship programs',
    'Implement more innovation challenges',
    'Enhance feedback loop mechanisms',
  ],
  lastUpdated: '2023-11-15T10:00:00Z',
  staleness: 'fresh',
};

describe('LearningCultureCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render learning culture card with key metrics', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('learning-culture-card')).toBeInTheDocument();
    expect(screen.getByText('Learning Culture Metrics')).toBeInTheDocument();
    expect(screen.getByText('Period: Q4 2023')).toBeInTheDocument();
    expect(screen.getByText('82')).toBeInTheDocument(); // Overall culture score
    expect(screen.getByText('B')).toBeInTheDocument(); // Culture grade
  });

  it('should display culture dimensions correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('Culture Dimensions')).toBeInTheDocument();
    expect(screen.getByText(/Learning Engagement/)).toBeInTheDocument();
    expect(screen.getByText(/Knowledge Sharing/)).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of Innovation
    const innovationElements = screen.getAllByText(/Innovation/);
    expect(innovationElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Continuous Improvement/)).toBeInTheDocument();
  });

  it('should display learning engagement metrics correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('85')).toBeInTheDocument(); // Learning engagement score
    expect(screen.getByText('78%')).toBeInTheDocument(); // Active participation
    expect(screen.getByText('72%')).toBeInTheDocument(); // Voluntary learning
    expect(screen.getByText('68%')).toBeInTheDocument(); // Peer collaboration
  });

  it('should display knowledge sharing metrics correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('79')).toBeInTheDocument(); // Knowledge sharing score
    expect(screen.getByText('12')).toBeInTheDocument(); // Mentorship programs
    expect(screen.getByText('45')).toBeInTheDocument(); // Active mentors
    expect(screen.getByText('28')).toBeInTheDocument(); // Knowledge base sessions
  });

  it('should display innovation metrics correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('76')).toBeInTheDocument(); // Innovation score
    expect(screen.getByText('156')).toBeInTheDocument(); // New ideas submitted
    expect(screen.getByText('89')).toBeInTheDocument(); // Ideas implemented
    expect(screen.getByText('23')).toBeInTheDocument(); // Innovation projects
  });

  it('should display continuous improvement metrics correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('81')).toBeInTheDocument(); // Continuous improvement score
    expect(screen.getByText('8')).toBeInTheDocument(); // Feedback loops
    expect(screen.getByText('increasing')).toBeInTheDocument(); // Course completion trend
    expect(screen.getByText('74%')).toBeInTheDocument(); // Skill application rate
  });

  it('should display cultural indicators correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('Cultural Indicators')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument(); // Manager support
    expect(screen.getByText('15')).toBeInTheDocument(); // Learning time allocation
    expect(screen.getByText('6')).toBeInTheDocument(); // Recognition programs
    expect(screen.getByText('18')).toBeInTheDocument(); // Career development opportunities
  });

  it('should display industry benchmarks correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('Industry Benchmarks')).toBeInTheDocument();
    expect(screen.getByText('68')).toBeInTheDocument(); // Industry average
    expect(screen.getByText('+14%')).toBeInTheDocument(); // vs Industry
    expect(screen.getByText('Above Average')).toBeInTheDocument(); // Standing
  });

  it('should display recommendations correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Increase peer collaboration initiatives')).toBeInTheDocument();
    expect(screen.getByText('Expand mentorship programs')).toBeInTheDocument();
    expect(screen.getByText('Implement more innovation challenges')).toBeInTheDocument();
    expect(screen.getByText('Enhance feedback loop mechanisms')).toBeInTheDocument();
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" isLoading={true} />
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Learning Culture Metrics')).not.toBeInTheDocument();
  });

  it('should show error state when data fails to load', async () => {
    const mockOnRetry = jest.fn();
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" error={{ message: 'Failed to load data' }} onRetry={mockOnRetry} />
      </TestWrapper>
    );
    expect(screen.getByText('Error: Failed to load data')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    await userEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should show no data message when no data available', () => {
    // Mock the hook to return no data
    const { useLearningCulture } = require('../../../../../application/hooks/useAnalytics');
    useLearningCulture.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" />
      </TestWrapper>
    );
    expect(screen.getByText('No learning culture data available.')).toBeInTheDocument();
    expect(screen.queryByText('Culture Dimensions')).not.toBeInTheDocument();
  });

  it('should show staleness indicator when data is stale', () => {
    const staleData = { ...mockLearningCultureData, staleness: 'stale' };
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={staleData} />
      </TestWrapper>
    );
    expect(screen.getByText('Stale')).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );
    expect(screen.getByRole('region', { name: /Learning Culture Metrics/i })).toBeInTheDocument();
  });

  it('should display last updated timestamp', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );
    expect(screen.getByText('Last updated:')).toBeInTheDocument();
    expect(screen.getByText('15/11/2023')).toBeInTheDocument();
  });

  it('should handle missing metrics gracefully', () => {
    const dataWithoutMetrics = { ...mockLearningCultureData };
    delete dataWithoutMetrics.metrics;
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={dataWithoutMetrics} />
      </TestWrapper>
    );
    expect(screen.getByTestId('learning-culture-card')).toBeInTheDocument();
    expect(screen.queryByText('Culture Dimensions')).not.toBeInTheDocument();
  });

  it('should handle missing cultural indicators gracefully', () => {
    const dataWithoutIndicators = { ...mockLearningCultureData };
    delete dataWithoutIndicators.culturalIndicators;
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={dataWithoutIndicators} />
      </TestWrapper>
    );
    expect(screen.getByTestId('learning-culture-card')).toBeInTheDocument();
    expect(screen.queryByText('Cultural Indicators')).not.toBeInTheDocument();
  });

  it('should handle missing benchmarks gracefully', () => {
    const dataWithoutBenchmarks = { ...mockLearningCultureData };
    delete dataWithoutBenchmarks.benchmarks;
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={dataWithoutBenchmarks} />
      </TestWrapper>
    );
    expect(screen.getByTestId('learning-culture-card')).toBeInTheDocument();
    expect(screen.queryByText('Industry Benchmarks')).not.toBeInTheDocument();
  });

  it('should use useLearningCulture hook for data fetching', () => {
    const { useLearningCulture } = require('../../../../../application/hooks/useAnalytics');
    useLearningCulture.mockReturnValue({
      data: { data: { learningCulture: mockLearningCultureData } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" />
      </TestWrapper>
    );

    expect(useLearningCulture).toHaveBeenCalledWith('org-123');
    expect(screen.getByText('Learning Culture Metrics')).toBeInTheDocument();
  });

  it('should prioritize prop data over hook data', () => {
    const { useLearningCulture } = require('../../../../../application/hooks/useAnalytics');
    useLearningCulture.mockReturnValue({
      data: { data: { learningCulture: { overallCultureScore: 50 } } }, // Different data from hook
      isLoading: false,
      error: null,
    });

    const propOverrideData = {
      ...mockLearningCultureData,
      overallCultureScore: 95,
    };

    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={propOverrideData} />
      </TestWrapper>
    );

    expect(useLearningCulture).toHaveBeenCalledWith('org-123');
    // Use getAllByText for multiple occurrences of 95
    const cultureScoreElements = screen.getAllByText('95');
    expect(cultureScoreElements.length).toBeGreaterThanOrEqual(1); // Should use prop data, not hook data
  });

  it('should display metric labels correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('Active Participation:')).toBeInTheDocument();
    expect(screen.getByText('Voluntary Learning:')).toBeInTheDocument();
    expect(screen.getByText('Peer Collaboration:')).toBeInTheDocument();
    expect(screen.getByText('Mentorship Programs:')).toBeInTheDocument();
    expect(screen.getByText('Active Mentors:')).toBeInTheDocument();
    expect(screen.getByText('KB Sessions:')).toBeInTheDocument();
    expect(screen.getByText('Ideas Submitted:')).toBeInTheDocument();
    expect(screen.getByText('Ideas Implemented:')).toBeInTheDocument();
    expect(screen.getByText('Innovation Projects:')).toBeInTheDocument();
    expect(screen.getByText('Feedback Loops:')).toBeInTheDocument();
    expect(screen.getByText('Completion Trend:')).toBeInTheDocument();
    expect(screen.getByText('Skill Application:')).toBeInTheDocument();
  });

  it('should display cultural indicator labels correctly', () => {
    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={mockLearningCultureData} />
      </TestWrapper>
    );

    expect(screen.getByText('Manager Support')).toBeInTheDocument();
    expect(screen.getByText('Learning Time')).toBeInTheDocument();
    expect(screen.getByText('Recognition')).toBeInTheDocument();
    expect(screen.getByText('Career Development')).toBeInTheDocument();
  });

  it('should handle zero values in metrics gracefully', () => {
    const dataWithZeros = {
      ...mockLearningCultureData,
      overallCultureScore: 0,
      metrics: {
        learningEngagement: {
          score: 0,
          activeParticipation: 0,
          voluntaryLearning: 0,
          peerCollaboration: 0,
        },
        knowledgeSharing: {
          score: 0,
          mentorshipPrograms: 0,
          activeMentors: 0,
          knowledgeBaseSessions: 0,
        },
        innovationMetrics: {
          score: 0,
          newIdeasSubmitted: 0,
          ideasImplemented: 0,
          innovationProjects: 0,
        },
        continuousImprovement: {
          score: 0,
          feedbackLoops: 0,
          courseCompletionTrend: 'stable',
          skillApplicationRate: 0,
        },
      },
      culturalIndicators: {
        managerSupport: 0,
        learningTimeAllocation: 0,
        recognitionPrograms: 0,
        careerDevelopmentOpportunities: 0,
      },
      benchmarks: {
        industryAverage: 0,
        vsIndustry: '0%',
        standing: 'Average',
      },
      recommendations: [],
    };

    render(
      <TestWrapper>
        <LearningCultureCard organizationId="org-123" data={dataWithZeros} />
      </TestWrapper>
    );

    // Use getAllByText for multiple occurrences of 0
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThanOrEqual(1); // Overall culture score
    // Use getAllByText for multiple occurrences of 0%
    const zeroPercentElements = screen.getAllByText('0%');
    expect(zeroPercentElements.length).toBeGreaterThanOrEqual(1); // Various percentages
    expect(screen.getByTestId('learning-culture-card')).toBeInTheDocument();
  });
});
