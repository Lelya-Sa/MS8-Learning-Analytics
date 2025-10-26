import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../../application/state/AuthContext';
import { ThemeProvider } from '../../../../../application/state/ThemeContext';
import { OrgLearningVelocityCard } from '../../../../../presentation/components/analytics/organization/OrgLearningVelocityCard';

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

// Mock the useOrgLearningVelocity hook
jest.mock('../../../../../application/hooks/useAnalytics', () => ({
  useOrgLearningVelocity: jest.fn(() => ({
    data: {
      data: {
        orgLearningVelocity: {
          period: 'Q4 2023',
          overview: {
            totalEmployees: 1250,
            participationRate: 78,
            skillsAcquiredThisQuarter: 342,
            activelyLearning: 456,
            certificationsEarned: 89,
          },
          roiMetrics: {
            roi: 245,
            costPerSkillAcquired: 125.50,
            trainingInvestment: 45000,
            productivityGains: 110250,
            calculationMethod: 'Skills acquired vs training investment',
            averageTimeToSkill: '3.2 weeks',
          },
          departmentBreakdown: [
            {
              departmentId: 'dept-1',
              departmentName: 'Engineering',
              totalEmployees: 300,
              participationRate: 85,
              completionRate: 78,
              skillsAcquired: 95,
              trend: 'increasing',
            },
            {
              departmentId: 'dept-2',
              departmentName: 'Marketing',
              totalEmployees: 150,
              participationRate: 72,
              completionRate: 65,
              skillsAcquired: 45,
              trend: 'stable',
            },
            {
              departmentId: 'dept-3',
              departmentName: 'Sales',
              totalEmployees: 200,
              participationRate: 68,
              completionRate: 58,
              skillsAcquired: 38,
              trend: 'decreasing',
            },
          ],
          trends: {
            quarterOverQuarter: '+12%',
            yearOverYear: '+28%',
            peakLearningMonth: 'October',
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

const mockOrgLearningVelocityData = {
  period: 'Q4 2023',
  overview: {
    totalEmployees: 1250,
    participationRate: 78,
    skillsAcquiredThisQuarter: 342,
    activelyLearning: 456,
    certificationsEarned: 89,
  },
  roiMetrics: {
    roi: 245,
    costPerSkillAcquired: 125.50,
    trainingInvestment: 45000,
    productivityGains: 110250,
    calculationMethod: 'Skills acquired vs training investment',
    averageTimeToSkill: '3.2 weeks',
  },
  departmentBreakdown: [
    {
      departmentId: 'dept-1',
      departmentName: 'Engineering',
      totalEmployees: 300,
      participationRate: 85,
      completionRate: 78,
      skillsAcquired: 95,
      trend: 'increasing',
    },
    {
      departmentId: 'dept-2',
      departmentName: 'Marketing',
      totalEmployees: 150,
      participationRate: 72,
      completionRate: 65,
      skillsAcquired: 45,
      trend: 'stable',
    },
    {
      departmentId: 'dept-3',
      departmentName: 'Sales',
      totalEmployees: 200,
      participationRate: 68,
      completionRate: 58,
      skillsAcquired: 38,
      trend: 'decreasing',
    },
  ],
  trends: {
    quarterOverQuarter: '+12%',
    yearOverYear: '+28%',
    peakLearningMonth: 'October',
  },
  lastUpdated: '2023-11-15T10:00:00Z',
  staleness: 'fresh',
};

describe('OrgLearningVelocityCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render organization learning velocity card with key metrics', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );

    expect(screen.getByTestId('org-learning-velocity-card')).toBeInTheDocument();
    expect(screen.getByText('Organization Learning Velocity')).toBeInTheDocument();
    expect(screen.getByText('Period: Q4 2023')).toBeInTheDocument();
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('should display overview metrics correctly', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );

    expect(screen.getByText('1250')).toBeInTheDocument(); // Total Employees
    // Use getAllByText for multiple occurrences of 78%
    const participationElements = screen.getAllByText('78%');
    expect(participationElements.length).toBeGreaterThanOrEqual(1); // Participation Rate
    expect(screen.getByText('342')).toBeInTheDocument(); // Skills Acquired
    expect(screen.getByText('456')).toBeInTheDocument(); // Actively Learning
    expect(screen.getByText('89')).toBeInTheDocument(); // Certifications Earned
  });

  it('should display ROI metrics correctly', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );

    expect(screen.getByText('245%')).toBeInTheDocument(); // ROI
    expect(screen.getByText('$125.50')).toBeInTheDocument(); // Cost Per Skill
    expect(screen.getByText('$45,000')).toBeInTheDocument(); // Training Investment
    expect(screen.getByText('$110,250')).toBeInTheDocument(); // Productivity Gains
    expect(screen.getByText('Skills acquired vs training investment')).toBeInTheDocument();
    expect(screen.getByText('3.2 weeks')).toBeInTheDocument();
  });

  it('should display department breakdown correctly', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );

    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument(); // Engineering employees
    expect(screen.getByText('85%')).toBeInTheDocument(); // Engineering participation
    // Use getAllByText for multiple occurrences of 78%
    const completionElements = screen.getAllByText('78%');
    expect(completionElements.length).toBeGreaterThanOrEqual(1); // Engineering completion
    expect(screen.getByText('95')).toBeInTheDocument(); // Engineering skills

    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument(); // Marketing employees
    expect(screen.getByText('72%')).toBeInTheDocument(); // Marketing participation
    expect(screen.getByText('65%')).toBeInTheDocument(); // Marketing completion
    expect(screen.getByText('45')).toBeInTheDocument(); // Marketing skills

    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument(); // Sales employees
    expect(screen.getByText('68%')).toBeInTheDocument(); // Sales participation
    expect(screen.getByText('58%')).toBeInTheDocument(); // Sales completion
    expect(screen.getByText('38')).toBeInTheDocument(); // Sales skills
  });

  it('should display department trends correctly', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );

    expect(screen.getByText('increasing')).toBeInTheDocument();
    expect(screen.getByText('stable')).toBeInTheDocument();
    expect(screen.getByText('decreasing')).toBeInTheDocument();
  });

  it('should display trends section correctly', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );

    expect(screen.getByText('Trends')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument(); // Quarter over Quarter
    expect(screen.getByText('+28%')).toBeInTheDocument(); // Year over Year
    expect(screen.getByText('October')).toBeInTheDocument(); // Peak Learning Month
    expect(screen.getByText('Quarter over Quarter')).toBeInTheDocument();
    expect(screen.getByText('Year over Year')).toBeInTheDocument();
    expect(screen.getByText('Peak Learning Month')).toBeInTheDocument();
  });

  it('should show loading state when data is loading', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" isLoading={true} />
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Organization Learning Velocity')).not.toBeInTheDocument();
  });

  it('should show error state when data fails to load', async () => {
    const mockOnRetry = jest.fn();
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" error={{ message: 'Failed to load data' }} onRetry={mockOnRetry} />
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
    const { useOrgLearningVelocity } = require('../../../../../application/hooks/useAnalytics');
    useOrgLearningVelocity.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" />
      </TestWrapper>
    );
    expect(screen.getByText('No organization learning velocity data available.')).toBeInTheDocument();
    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
  });

  it('should show staleness indicator when data is stale', () => {
    const staleData = { ...mockOrgLearningVelocityData, staleness: 'stale' };
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={staleData} />
      </TestWrapper>
    );
    expect(screen.getByText('Stale')).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );
    expect(screen.getByRole('region', { name: /Organization Learning Velocity/i })).toBeInTheDocument();
  });

  it('should display last updated timestamp', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );
    expect(screen.getByText('Last updated:')).toBeInTheDocument();
    // Check for the date in the last updated section specifically
    expect(screen.getByText('15/11/2023')).toBeInTheDocument();
  });

  it('should handle empty department breakdown gracefully', () => {
    const dataWithoutDepartments = { ...mockOrgLearningVelocityData, departmentBreakdown: [] };
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={dataWithoutDepartments} />
      </TestWrapper>
    );
    expect(screen.getByTestId('org-learning-velocity-card')).toBeInTheDocument();
    expect(screen.queryByText('Department Breakdown')).not.toBeInTheDocument();
  });

  it('should handle missing ROI metrics gracefully', () => {
    const dataWithoutROI = { ...mockOrgLearningVelocityData };
    delete dataWithoutROI.roiMetrics;
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={dataWithoutROI} />
      </TestWrapper>
    );
    expect(screen.getByTestId('org-learning-velocity-card')).toBeInTheDocument();
    expect(screen.queryByText('ROI Metrics')).not.toBeInTheDocument();
  });

  it('should handle missing trends gracefully', () => {
    const dataWithoutTrends = { ...mockOrgLearningVelocityData };
    delete dataWithoutTrends.trends;
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={dataWithoutTrends} />
      </TestWrapper>
    );
    expect(screen.getByTestId('org-learning-velocity-card')).toBeInTheDocument();
    expect(screen.queryByText('Trends')).not.toBeInTheDocument();
  });

  it('should use useOrgLearningVelocity hook for data fetching', () => {
    const { useOrgLearningVelocity } = require('../../../../../application/hooks/useAnalytics');
    useOrgLearningVelocity.mockReturnValue({
      data: { data: { orgLearningVelocity: mockOrgLearningVelocityData } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" />
      </TestWrapper>
    );

    expect(useOrgLearningVelocity).toHaveBeenCalledWith('org-123');
    expect(screen.getByText('Organization Learning Velocity')).toBeInTheDocument();
  });

  it('should prioritize prop data over hook data', () => {
    const { useOrgLearningVelocity } = require('../../../../../application/hooks/useAnalytics');
    useOrgLearningVelocity.mockReturnValue({
      data: { data: { orgLearningVelocity: { overview: { totalEmployees: 100 } } } }, // Different data from hook
      isLoading: false,
      error: null,
    });

    const propOverrideData = {
      ...mockOrgLearningVelocityData,
      overview: { ...mockOrgLearningVelocityData.overview, totalEmployees: 2000 },
    };

    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={propOverrideData} />
      </TestWrapper>
    );

    expect(useOrgLearningVelocity).toHaveBeenCalledWith('org-123');
    expect(screen.getByText('2000')).toBeInTheDocument(); // Should use prop data, not hook data
  });

  it('should display section titles correctly', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('ROI Metrics')).toBeInTheDocument();
    expect(screen.getByText('Department Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Trends')).toBeInTheDocument();
  });

  it('should display metric labels correctly', () => {
    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={mockOrgLearningVelocityData} />
      </TestWrapper>
    );
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Participation Rate')).toBeInTheDocument();
    expect(screen.getByText('Skills Acquired')).toBeInTheDocument();
    expect(screen.getByText('Actively Learning')).toBeInTheDocument();
    expect(screen.getByText('Certifications Earned')).toBeInTheDocument();
    expect(screen.getByText('Return on Investment')).toBeInTheDocument();
    expect(screen.getByText('Cost Per Skill')).toBeInTheDocument();
    expect(screen.getByText('Training Investment')).toBeInTheDocument();
    expect(screen.getByText('Productivity Gains')).toBeInTheDocument();
  });

  it('should handle zero values in metrics gracefully', () => {
    const dataWithZeros = {
      ...mockOrgLearningVelocityData,
      overview: {
        totalEmployees: 0,
        participationRate: 0,
        skillsAcquiredThisQuarter: 0,
        activelyLearning: 0,
        certificationsEarned: 0,
      },
    };

    render(
      <TestWrapper>
        <OrgLearningVelocityCard organizationId="org-123" data={dataWithZeros} />
      </TestWrapper>
    );

    // Check for specific zero values in specific contexts
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Participation Rate')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByTestId('org-learning-velocity-card')).toBeInTheDocument();
  });
});
