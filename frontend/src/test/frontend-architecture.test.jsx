/**
 * Frontend TDD Tests - RED Phase
 * Tests the complete frontend architecture based on user journey flow
 * Tests role-based dashboards, SWR data fetching, real-time analytics
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';

// Import components to test
import AuthProvider from '../components/auth/AuthProvider';
import Dashboard from '../components/dashboard/Dashboard';
import LearnerAnalytics from '../components/analytics/LearnerAnalytics';
import TrainerAnalytics from '../components/analytics/TrainerAnalytics';
import OrganizationAnalytics from '../components/analytics/OrganizationAnalytics';
import AnalyticsChart from '../components/charts/AnalyticsChart';
import DataTable from '../components/tables/DataTable';
import ReportGenerator from '../components/reports/ReportGenerator';

// Import hooks
import { useAuth } from '../hooks/useAuth';
import { useAnalytics, useLearnerAnalytics, useTrainerAnalytics, useOrganizationAnalytics } from '../hooks/useAnalytics';
import { useReports } from '../hooks/useReports';

// Import services
import * as api from '../services/api';

// Mock data based on backend architecture
const mockUserData = {
  learner: {
    id: 'user-123',
    email: 'learner@example.com',
    role: 'learner',
    organizationId: 'org-123'
  },
  trainer: {
    id: 'trainer-456',
    email: 'trainer@example.com',
    role: 'trainer',
    organizationId: 'org-123'
  },
  organization: {
    id: 'org-admin-789',
    email: 'admin@example.com',
    role: 'org_admin',
    organizationId: 'org-123'
  }
};

const mockAnalyticsData = {
  learner: {
    learning_velocity: 85.5,
    mastery_progress: 72.3,
    engagement_score: 91.2,
    skill_gaps: [
      { skill: 'JavaScript', gap_score: 0.3, priority: 'high' },
      { skill: 'React', gap_score: 0.2, priority: 'medium' }
    ],
    assessment_performance: 78.5,
    content_effectiveness: 82.1
  },
  trainer: {
    course_performance: 88.5,
    course_health: 92.3,
    teaching_effectiveness: 85.7,
    student_distribution: {
      total_students: 150,
      active_students: 120,
      at_risk_students: 15
    }
  },
  organization: {
    learning_velocity: 78.5,
    strategic_alignment: 85.2,
    learning_culture: 91.8,
    department_metrics: {
      engineering: { velocity: 82.1, engagement: 88.5 },
      marketing: { velocity: 75.3, engagement: 79.2 }
    }
  }
};

const mockReportsData = [
  {
    id: 'report-1',
    type: 'learner',
    format: 'pdf',
    status: 'completed',
    created_at: '2024-01-15T10:00:00Z',
    expires_at: '2024-01-22T10:00:00Z',
    download_url: 'https://example.com/report-1.pdf'
  },
  {
    id: 'report-2',
    type: 'learner',
    format: 'csv',
    status: 'processing',
    created_at: '2024-01-15T11:00:00Z',
    expires_at: '2024-01-22T11:00:00Z',
    download_url: null
  }
];

describe('Frontend Architecture TDD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock SWR to return fresh data by default
    vi.mock('swr', () => ({
      default: vi.fn(() => ({
        data: mockAnalyticsData.learner,
        error: null,
        isLoading: false,
        mutate: vi.fn()
      })),
      SWRConfig: ({ children }) => children
    }));

    // Mock API service
    vi.mock('../services/api', () => ({
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
      getLearnerAnalytics: vi.fn(),
      getTrainerAnalytics: vi.fn(),
      getOrganizationAnalytics: vi.fn(),
      getReports: vi.fn(),
      generateReport: vi.fn(),
      downloadReport: vi.fn(),
      deleteReport: vi.fn(),
      triggerDataCollection: vi.fn(),
      getCollectionStatus: vi.fn()
    }));
  });

  describe('Authentication Flow', () => {
    it('should handle complete authentication flow', async () => {
      const user = userEvent.setup();
      
      // Mock successful login
      vi.mocked(api.login).mockResolvedValueOnce({
        token: 'mock-jwt-token',
        user: mockUserData.learner
      });

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider>
            <div data-testid="app-content">App Content</div>
          </AuthProvider>
        </SWRConfig>
      );

      // Should show login form initially
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

      // Fill and submit login form
      await user.type(screen.getByLabelText(/email/i), 'learner@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Should call login API
      await waitFor(() => {
        expect(api.login).toHaveBeenCalledWith({
          email: 'learner@example.com',
          password: 'password123'
        });
      });

      // Should show authenticated content
      await waitFor(() => {
        expect(screen.getByText(/welcome, learner@example.com/i)).toBeInTheDocument();
      });
    });

    it('should handle authentication errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock failed login
      vi.mocked(api.login).mockRejectedValueOnce(new Error('Invalid credentials'));

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider>
            <div data-testid="app-content">App Content</div>
          </AuthProvider>
        </SWRConfig>
      );

      // Submit login form
      await user.type(screen.getByLabelText(/email/i), 'invalid@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });
    });

    it('should handle logout flow', async () => {
      const user = userEvent.setup();
      
      // Mock successful logout
      vi.mocked(api.logout).mockResolvedValueOnce({});

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider>
            <div data-testid="app-content">App Content</div>
          </AuthProvider>
        </SWRConfig>
      );

      // Login first
      await user.type(screen.getByLabelText(/email/i), 'learner@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Wait for login to complete
      await waitFor(() => {
        expect(screen.getByText(/welcome, learner@example.com/i)).toBeInTheDocument();
      });

      // Find and click logout button
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await user.click(logoutButton);

      // Should call logout API and return to login form
      await waitFor(() => {
        expect(api.logout).toHaveBeenCalled();
        expect(screen.getByRole('form')).toBeInTheDocument();
      });
    });
  });

  describe('Role-Based Dashboard Rendering', () => {
    it('should render learner dashboard for learner role', () => {
      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <Dashboard user={mockUserData.learner} />
        </SWRConfig>
      );

      expect(screen.getByText(/my learning analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/learning velocity/i)).toBeInTheDocument();
      expect(screen.getByText(/mastery progress/i)).toBeInTheDocument();
      expect(screen.getByText(/engagement score/i)).toBeInTheDocument();
      expect(screen.getByText(/skill gaps/i)).toBeInTheDocument();
    });

    it('should render trainer dashboard for trainer role', () => {
      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <Dashboard user={mockUserData.trainer} />
        </SWRConfig>
      );

      expect(screen.getByText(/course analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/course performance/i)).toBeInTheDocument();
      expect(screen.getByText(/course health/i)).toBeInTheDocument();
      expect(screen.getByText(/teaching effectiveness/i)).toBeInTheDocument();
      expect(screen.getByText(/student performance/i)).toBeInTheDocument();
      expect(screen.getByText(/at-risk students/i)).toBeInTheDocument();
    });

    it('should render organization dashboard for org_admin role', () => {
      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <Dashboard user={mockUserData.organization} />
        </SWRConfig>
      );

      expect(screen.getByText(/organization analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/learning velocity/i)).toBeInTheDocument();
      expect(screen.getByText(/strategic alignment/i)).toBeInTheDocument();
      expect(screen.getByText(/learning culture/i)).toBeInTheDocument();
      expect(screen.getByText(/department metrics/i)).toBeInTheDocument();
    });
  });

  describe('SWR Data Fetching', () => {
    it('should implement SWR pattern with instant display and background refresh', async () => {
      // Mock SWR to return cached data instantly
      const mockMutate = vi.fn();
      vi.mocked(require('swr').default).mockReturnValue({
        data: mockAnalyticsData.learner,
        error: null,
        isLoading: false,
        mutate: mockMutate
      });

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <LearnerAnalytics userId="user-123" />
        </SWRConfig>
      );

      // Should display data instantly (no loading state)
      expect(screen.getByText('85.5%')).toBeInTheDocument(); // Learning velocity
      expect(screen.getByText('72.3%')).toBeInTheDocument(); // Mastery progress
      expect(screen.getByText('91.2%')).toBeInTheDocument(); // Engagement score

      // Should not show loading state
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it('should handle SWR loading states', () => {
      // Mock SWR to return loading state
      vi.mocked(require('swr').default).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
        mutate: vi.fn()
      });

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <LearnerAnalytics userId="user-123" />
        </SWRConfig>
      );

      // Should show loading state
      expect(screen.getByText(/loading analytics/i)).toBeInTheDocument();
    });

    it('should handle SWR error states', () => {
      // Mock SWR to return error state
      vi.mocked(require('swr').default).mockReturnValue({
        data: undefined,
        error: new Error('Failed to fetch analytics'),
        isLoading: false,
        mutate: vi.fn()
      });

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <LearnerAnalytics userId="user-123" />
        </SWRConfig>
      );

      // Should show error state
      expect(screen.getByText(/failed to fetch analytics/i)).toBeInTheDocument();
    });
  });

  describe('Real-time Analytics Refresh', () => {
    it('should implement manual refresh with 5-minute cooldown', async () => {
      const user = userEvent.setup();
      const mockMutate = vi.fn();
      
      vi.mocked(require('swr').default).mockReturnValue({
        data: mockAnalyticsData.learner,
        error: null,
        isLoading: false,
        mutate: mockMutate
      });

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <LearnerAnalytics userId="user-123" />
        </SWRConfig>
      );

      // Find refresh button
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();

      // Click refresh button
      await user.click(refreshButton);

      // Should call mutate to refresh data
      expect(mockMutate).toHaveBeenCalled();

      // Should show cooldown message
      await waitFor(() => {
        expect(screen.getByText(/refreshed/i)).toBeInTheDocument();
      });
    });

    it('should enforce 5-minute refresh cooldown', async () => {
      const user = userEvent.setup();
      const mockMutate = vi.fn();
      
      vi.mocked(require('swr').default).mockReturnValue({
        data: mockAnalyticsData.learner,
        error: null,
        isLoading: false,
        mutate: mockMutate
      });

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <LearnerAnalytics userId="user-123" />
        </SWRConfig>
      );

      const refreshButton = screen.getByRole('button', { name: /refresh/i });

      // Click refresh button
      await user.click(refreshButton);

      // Should show cooldown message
      await waitFor(() => {
        expect(screen.getByText(/refreshed/i)).toBeInTheDocument();
      });

      // Try to click again immediately
      await user.click(refreshButton);

      // Should show cooldown warning
      await waitFor(() => {
        expect(screen.getByText(/please wait/i)).toBeInTheDocument();
      });

      // Should not call mutate again
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Chart Components', () => {
    it('should render analytics charts with proper data', () => {
      const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Learning Velocity',
          data: [75, 80, 85, 85.5],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)'
        }]
      };

      render(
        <AnalyticsChart
          data={chartData}
          type="line"
          aria-label="Learning velocity trend chart"
        />
      );

      // Should render chart canvas
      const canvas = screen.getByRole('img', { name: /learning velocity trend chart/i });
      expect(canvas).toBeInTheDocument();
    });

    it('should handle different chart types', () => {
      const barData = {
        labels: ['JavaScript', 'React', 'Node.js'],
        datasets: [{
          label: 'Skill Levels',
          data: [85, 78, 92],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 205, 86, 0.2)']
        }]
      };

      render(
        <AnalyticsChart
          data={barData}
          type="bar"
          aria-label="Skill levels bar chart"
        />
      );

      const canvas = screen.getByRole('img', { name: /skill levels bar chart/i });
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Data Tables', () => {
    it('should render skill gaps table with sorting', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          data={mockAnalyticsData.learner.skill_gaps}
          columns={[
            { key: 'skill', label: 'Skill' },
            { key: 'priority', label: 'Priority' },
            { key: 'gap_score', label: 'Gap Score' }
          ]}
          sortable={true}
        />
      );

      // Should render table headers
      expect(screen.getByRole('columnheader', { name: /skill/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /priority/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /gap score/i })).toBeInTheDocument();

      // Should render table data
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('high priority')).toBeInTheDocument();
      expect(screen.getByText('medium priority')).toBeInTheDocument();

      // Should be able to sort columns
      const skillHeader = screen.getByRole('columnheader', { name: /skill/i });
      await user.click(skillHeader);
      
      // Should show sort indicator
      expect(skillHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  describe('Report Generation', () => {
    it('should handle async report generation', async () => {
      const user = userEvent.setup();
      
      // Mock report generation
      vi.mocked(api.generateReport).mockResolvedValueOnce({
        id: 'report-123',
        status: 'processing',
        download_url: null
      });

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <ReportGenerator userId="user-123" />
        </SWRConfig>
      );

      // Should show report generation form
      expect(screen.getByLabelText(/report type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/format/i)).toBeInTheDocument();

      // Fill form and submit
      await user.selectOptions(screen.getByLabelText(/report type/i), 'learner');
      await user.selectOptions(screen.getByLabelText(/format/i), 'pdf');
      await user.click(screen.getByRole('button', { name: /generate report/i }));

      // Should call generate report API
      await waitFor(() => {
        expect(api.generateReport).toHaveBeenCalledWith('learner', 'pdf');
      });

      // Should show processing state
      await waitFor(() => {
        expect(screen.getByText(/report is being generated/i)).toBeInTheDocument();
      });
    });

    it('should handle report download when ready', async () => {
      const user = userEvent.setup();
      
      // Mock completed report
      vi.mocked(api.generateReport).mockResolvedValueOnce({
        id: 'report-123',
        status: 'completed',
        download_url: 'https://example.com/report-123.pdf'
      });

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <ReportGenerator userId="user-123" />
        </SWRConfig>
      );

      // Generate report
      await user.selectOptions(screen.getByLabelText(/report type/i), 'learner');
      await user.selectOptions(screen.getByLabelText(/format/i), 'pdf');
      await user.click(screen.getByRole('button', { name: /generate report/i }));

      // Should show download link when ready
      await waitFor(() => {
        const downloadLink = screen.getByRole('link', { name: /download report/i });
        expect(downloadLink).toBeInTheDocument();
        expect(downloadLink).toHaveAttribute('href', 'https://example.com/report-123.pdf');
      });
    });
  });

  describe('Error Boundaries and Graceful Degradation', () => {
    it('should handle component errors gracefully', () => {
      // Mock component that throws error
      const ErrorComponent = () => {
        throw new Error('Component error');
      };

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <ErrorComponent />
        </SWRConfig>
      );

      // Should show error boundary message
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should handle network errors with retry', async () => {
      const user = userEvent.setup();
      
      // Mock network error
      vi.mocked(require('swr').default).mockReturnValue({
        data: undefined,
        error: new Error('Network Error'),
        isLoading: false,
        mutate: vi.fn()
      });

      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <LearnerAnalytics userId="user-123" />
        </SWRConfig>
      );

      // Should show error message
      expect(screen.getByText(/network error/i)).toBeInTheDocument();

      // Should show retry button
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();

      // Should be able to retry
      await user.click(retryButton);
      // Retry logic would be tested here
    });
  });

  describe('Privacy Controls and GDPR Compliance', () => {
    it('should provide data export functionality', async () => {
      const user = userEvent.setup();
      
      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <LearnerAnalytics userId="user-123" />
        </SWRConfig>
      );

      // Should have privacy controls section
      expect(screen.getByText(/privacy controls/i)).toBeInTheDocument();

      // Should have export data button
      const exportButton = screen.getByRole('button', { name: /export my data/i });
      expect(exportButton).toBeInTheDocument();

      // Should be able to export data
      await user.click(exportButton);
      
      // Should show export confirmation
      await waitFor(() => {
        expect(screen.getByText(/exporting your data/i)).toBeInTheDocument();
      });
    });

    it('should provide data deletion functionality', async () => {
      const user = userEvent.setup();
      
      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <LearnerAnalytics userId="user-123" />
        </SWRConfig>
      );

      // Should have delete data button
      const deleteButton = screen.getByRole('button', { name: /delete my data/i });
      expect(deleteButton).toBeInTheDocument();

      // Should show confirmation dialog
      await user.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      });

      // Should have confirm and cancel buttons
      expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Performance and Accessibility', () => {
    it('should meet accessibility requirements', () => {
      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <LearnerAnalytics userId="user-123" />
        </SWRConfig>
      );

      // Should have proper ARIA labels
      expect(screen.getByRole('img', { name: /learning velocity chart/i })).toBeInTheDocument();
      
      // Should have proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

      // Should have proper form labels
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should implement lazy loading for large datasets', () => {
      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <DataTable
            data={Array.from({ length: 1000 }, (_, i) => ({
              id: i,
              name: `Item ${i}`,
              value: Math.random() * 100
            }))}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'value', label: 'Value' }
            ]}
            pagination={true}
            pageSize={50}
          />
        </SWRConfig>
      );

      // Should show pagination controls
      expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();

      // Should show page info
      expect(screen.getByText(/page 1 of 20/i)).toBeInTheDocument();
    });
  });
});
