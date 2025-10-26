import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { StrategicAlignmentCard } from '../../../../../presentation/components/analytics/organization/StrategicAlignmentCard';

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

// Mock the useStrategicAlignment hook
jest.mock('../../../../../application/hooks/useAnalytics', () => ({
  useStrategicAlignment: jest.fn(() => ({
    data: {
      data: {
        strategicAlignment: {
          period: 'Q4 2023',
          overallAlignment: 78,
          alignmentGrade: 'B',
          strategicGoals: [
            {
              goalId: 'goal-1',
              goalName: 'Digital Transformation',
              alignmentScore: 85,
              progress: 72,
              skillsCovered: 68,
              status: 'on_track',
              requiredSkills: ['Cloud Computing', 'Data Analytics', 'AI/ML'],
              employeesOnTrack: 45,
              totalEmployeesNeeded: 60,
              recommendations: [
                'Increase cloud computing training',
                'Focus on data analytics skills',
              ],
            },
            {
              goalId: 'goal-2',
              goalName: 'Customer Experience',
              alignmentScore: 62,
              progress: 45,
              skillsCovered: 38,
              status: 'at_risk',
              requiredSkills: ['Customer Service', 'Communication', 'Problem Solving'],
              employeesOnTrack: 28,
              totalEmployeesNeeded: 50,
              recommendations: [
                'Improve customer service training',
                'Enhance communication skills',
              ],
            },
            {
              goalId: 'goal-3',
              goalName: 'Innovation Culture',
              alignmentScore: 45,
              progress: 25,
              skillsCovered: 20,
              status: 'off_track',
              requiredSkills: ['Creative Thinking', 'Innovation', 'Collaboration'],
              employeesOnTrack: 12,
              totalEmployeesNeeded: 40,
              recommendations: [
                'Develop creative thinking workshops',
                'Promote innovation culture',
              ],
            },
          ],
          gapAnalysis: {
            criticalGaps: 3,
            mediumGaps: 7,
            lowGaps: 12,
            topMissingSkills: [
              {
                skill: 'Cloud Computing',
                priority: 'critical',
                gap: 65,
              },
              {
                skill: 'Data Analytics',
                priority: 'critical',
                gap: 58,
              },
              {
                skill: 'AI/ML',
                priority: 'high',
                gap: 72,
              },
              {
                skill: 'Customer Service',
                priority: 'high',
                gap: 45,
              },
              {
                skill: 'Creative Thinking',
                priority: 'medium',
                gap: 38,
              },
            ],
          },
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

const mockStrategicAlignmentData = {
  period: 'Q4 2023',
  overallAlignment: 78,
  alignmentGrade: 'B',
  strategicGoals: [
    {
      goalId: 'goal-1',
      goalName: 'Digital Transformation',
      alignmentScore: 85,
      progress: 72,
      skillsCovered: 68,
      status: 'on_track',
      requiredSkills: ['Cloud Computing', 'Data Analytics', 'AI/ML'],
      employeesOnTrack: 45,
      totalEmployeesNeeded: 60,
      recommendations: [
        'Increase cloud computing training',
        'Focus on data analytics skills',
      ],
    },
    {
      goalId: 'goal-2',
      goalName: 'Customer Experience',
      alignmentScore: 62,
      progress: 45,
      skillsCovered: 38,
      status: 'at_risk',
      requiredSkills: ['Customer Service', 'Communication', 'Problem Solving'],
      employeesOnTrack: 28,
      totalEmployeesNeeded: 50,
      recommendations: [
        'Improve customer service training',
        'Enhance communication skills',
      ],
    },
    {
      goalId: 'goal-3',
      goalName: 'Innovation Culture',
      alignmentScore: 45,
      progress: 25,
      skillsCovered: 20,
      status: 'off_track',
      requiredSkills: ['Creative Thinking', 'Innovation', 'Collaboration'],
      employeesOnTrack: 12,
      totalEmployeesNeeded: 40,
      recommendations: [
        'Develop creative thinking workshops',
        'Promote innovation culture',
      ],
    },
  ],
  gapAnalysis: {
    criticalGaps: 3,
    mediumGaps: 7,
    lowGaps: 12,
    topMissingSkills: [
      {
        skill: 'Cloud Computing',
        priority: 'critical',
        gap: 65,
      },
      {
        skill: 'Data Analytics',
        priority: 'critical',
        gap: 58,
      },
      {
        skill: 'AI/ML',
        priority: 'high',
        gap: 72,
      },
      {
        skill: 'Customer Service',
        priority: 'high',
        gap: 45,
      },
      {
        skill: 'Creative Thinking',
        priority: 'medium',
        gap: 38,
      },
    ],
  },
  lastUpdated: '2023-11-15T10:00:00Z',
  staleness: 'fresh',
};

describe('StrategicAlignmentCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render strategic alignment card with key metrics', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('strategic-alignment-card')).toBeInTheDocument();
    expect(screen.getByText('Strategic Alignment Tracking')).toBeInTheDocument();
    expect(screen.getByText('Period: Q4 2023')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument(); // Overall alignment score
    expect(screen.getByText('B')).toBeInTheDocument(); // Alignment grade
  });

  it('should display strategic goals correctly', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );

    expect(screen.getByText('Digital Transformation')).toBeInTheDocument();
    expect(screen.getByText('Customer Experience')).toBeInTheDocument();
    expect(screen.getByText('Innovation Culture')).toBeInTheDocument();
    expect(screen.getByText('ON TRACK')).toBeInTheDocument();
    expect(screen.getByText('AT RISK')).toBeInTheDocument();
    expect(screen.getByText('OFF TRACK')).toBeInTheDocument();
  });

  it('should display goal metrics correctly', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );

    // Digital Transformation goal metrics
    expect(screen.getByText('85')).toBeInTheDocument(); // Alignment score
    // Use getAllByText for multiple occurrences of 72%
    const progressElements = screen.getAllByText('72%');
    expect(progressElements.length).toBeGreaterThanOrEqual(1); // Progress
    expect(screen.getByText('68%')).toBeInTheDocument(); // Skills covered

    // Customer Experience goal metrics
    expect(screen.getByText('62')).toBeInTheDocument(); // Alignment score
    // Use getAllByText for multiple occurrences of 45%
    const customerProgressElements = screen.getAllByText('45%');
    expect(customerProgressElements.length).toBeGreaterThanOrEqual(1); // Progress
    // Use getAllByText for multiple occurrences of 38%
    const customerSkillsElements = screen.getAllByText('38%');
    expect(customerSkillsElements.length).toBeGreaterThanOrEqual(1); // Skills covered
  });

  it('should display gap analysis correctly', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );

    expect(screen.getByText('Gap Analysis')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Critical gaps
    expect(screen.getByText('7')).toBeInTheDocument(); // Medium gaps
    expect(screen.getByText('12')).toBeInTheDocument(); // Low gaps
    expect(screen.getByText('Critical Gaps')).toBeInTheDocument();
    expect(screen.getByText('Medium Gaps')).toBeInTheDocument();
    expect(screen.getByText('Low Priority Gaps')).toBeInTheDocument();
  });

  it('should display top missing skills correctly', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );

    expect(screen.getByText('🚨 Top Missing Skills')).toBeInTheDocument();
    expect(screen.getByText('Cloud Computing')).toBeInTheDocument();
    expect(screen.getByText('Data Analytics')).toBeInTheDocument();
    expect(screen.getByText('AI/ML')).toBeInTheDocument();
    expect(screen.getByText('Customer Service')).toBeInTheDocument();
    expect(screen.getByText('Creative Thinking')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences of CRITICAL
    const criticalElements = screen.getAllByText('CRITICAL');
    expect(criticalElements.length).toBeGreaterThanOrEqual(1);
    // Use getAllByText for multiple occurrences of HIGH
    const highElements = screen.getAllByText('HIGH');
    expect(highElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('should display skill gap percentages correctly', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );

    expect(screen.getByText('65%')).toBeInTheDocument(); // Cloud Computing gap
    expect(screen.getByText('58%')).toBeInTheDocument(); // Data Analytics gap
    // Use getAllByText for multiple occurrences of 72%
    const aiMlElements = screen.getAllByText('72%');
    expect(aiMlElements.length).toBeGreaterThanOrEqual(1); // AI/ML gap
    // Use getAllByText for multiple occurrences of 45%
    const customerServiceElements = screen.getAllByText('45%');
    expect(customerServiceElements.length).toBeGreaterThanOrEqual(1); // Customer Service gap
    // Use getAllByText for multiple occurrences of 38%
    const creativeThinkingElements = screen.getAllByText('38%');
    expect(creativeThinkingElements.length).toBeGreaterThanOrEqual(1); // Creative Thinking gap
  });

  it('should display recommendations correctly', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );

    expect(screen.getByText('Increase cloud computing training')).toBeInTheDocument();
    expect(screen.getByText('Focus on data analytics skills')).toBeInTheDocument();
    expect(screen.getByText('Improve customer service training')).toBeInTheDocument();
    expect(screen.getByText('Enhance communication skills')).toBeInTheDocument();
    expect(screen.getByText('Develop creative thinking workshops')).toBeInTheDocument();
    expect(screen.getByText('Promote innovation culture')).toBeInTheDocument();
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" isLoading={true} />
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Strategic Alignment Tracking')).not.toBeInTheDocument();
  });

  it('should show error state when data fails to load', async () => {
    const mockOnRetry = jest.fn();
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" error={{ message: 'Failed to load data' }} onRetry={mockOnRetry} />
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
    const { useStrategicAlignment } = require('../../../../../application/hooks/useAnalytics');
    useStrategicAlignment.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" />
      </TestWrapper>
    );
    expect(screen.getByText('No strategic alignment data available.')).toBeInTheDocument();
    expect(screen.queryByText('Strategic Goals')).not.toBeInTheDocument();
  });

  it('should show staleness indicator when data is stale', () => {
    const staleData = { ...mockStrategicAlignmentData, staleness: 'stale' };
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={staleData} />
      </TestWrapper>
    );
    expect(screen.getByText('Stale')).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );
    expect(screen.getByRole('region', { name: /Strategic Alignment Tracking/i })).toBeInTheDocument();
  });

  it('should display last updated timestamp', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );
    expect(screen.getByText('Last updated:')).toBeInTheDocument();
    expect(screen.getByText('15/11/2023')).toBeInTheDocument();
  });

  it('should handle empty strategic goals gracefully', () => {
    const dataWithoutGoals = { ...mockStrategicAlignmentData, strategicGoals: [] };
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={dataWithoutGoals} />
      </TestWrapper>
    );
    expect(screen.getByTestId('strategic-alignment-card')).toBeInTheDocument();
    expect(screen.queryByText('Strategic Goals')).not.toBeInTheDocument();
  });

  it('should handle missing gap analysis gracefully', () => {
    const dataWithoutGapAnalysis = { ...mockStrategicAlignmentData };
    delete dataWithoutGapAnalysis.gapAnalysis;
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={dataWithoutGapAnalysis} />
      </TestWrapper>
    );
    expect(screen.getByTestId('strategic-alignment-card')).toBeInTheDocument();
    expect(screen.queryByText('Gap Analysis')).not.toBeInTheDocument();
  });

  it('should use useStrategicAlignment hook for data fetching', () => {
    const { useStrategicAlignment } = require('../../../../../application/hooks/useAnalytics');
    useStrategicAlignment.mockReturnValue({
      data: { data: { strategicAlignment: mockStrategicAlignmentData } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" />
      </TestWrapper>
    );

    expect(useStrategicAlignment).toHaveBeenCalledWith('org-123');
    expect(screen.getByText('Strategic Alignment Tracking')).toBeInTheDocument();
  });

  it('should prioritize prop data over hook data', () => {
    const { useStrategicAlignment } = require('../../../../../application/hooks/useAnalytics');
    useStrategicAlignment.mockReturnValue({
      data: { data: { strategicAlignment: { overallAlignment: 50 } } }, // Different data from hook
      isLoading: false,
      error: null,
    });

    const propOverrideData = {
      ...mockStrategicAlignmentData,
      overallAlignment: 85,
    };

    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={propOverrideData} />
      </TestWrapper>
    );

    expect(useStrategicAlignment).toHaveBeenCalledWith('org-123');
    // Use getAllByText for multiple occurrences of 85
    const alignmentElements = screen.getAllByText('85');
    expect(alignmentElements.length).toBeGreaterThanOrEqual(1); // Should use prop data, not hook data
  });

  it('should display required skills for each goal', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );

    expect(screen.getByText('Cloud Computing, Data Analytics, AI/ML')).toBeInTheDocument();
    expect(screen.getByText('Customer Service, Communication, Problem Solving')).toBeInTheDocument();
    expect(screen.getByText('Creative Thinking, Innovation, Collaboration')).toBeInTheDocument();
  });

  it('should display employee tracking information', () => {
    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={mockStrategicAlignmentData} />
      </TestWrapper>
    );

    expect(screen.getByText('45 / 60 on track')).toBeInTheDocument(); // Digital Transformation
    expect(screen.getByText('28 / 50 on track')).toBeInTheDocument(); // Customer Experience
    expect(screen.getByText('12 / 40 on track')).toBeInTheDocument(); // Innovation Culture
  });

  it('should handle zero values in metrics gracefully', () => {
    const dataWithZeros = {
      ...mockStrategicAlignmentData,
      overallAlignment: 0,
      strategicGoals: [
        {
          goalId: 'goal-1',
          goalName: 'Test Goal',
          alignmentScore: 0,
          progress: 0,
          skillsCovered: 0,
          status: 'off_track',
          requiredSkills: [],
          employeesOnTrack: 0,
          totalEmployeesNeeded: 0,
          recommendations: [],
        },
      ],
      gapAnalysis: {
        criticalGaps: 0,
        mediumGaps: 0,
        lowGaps: 0,
        topMissingSkills: [],
      },
    };

    render(
      <TestWrapper>
        <StrategicAlignmentCard organizationId="org-123" data={dataWithZeros} />
      </TestWrapper>
    );

    // Use getAllByText for multiple occurrences of 0
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThanOrEqual(1); // Overall alignment
    // Use getAllByText for multiple occurrences of 0%
    const zeroPercentElements = screen.getAllByText('0%');
    expect(zeroPercentElements.length).toBeGreaterThanOrEqual(1); // Progress
    expect(screen.getByTestId('strategic-alignment-card')).toBeInTheDocument();
  });
});
