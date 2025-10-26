import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportHistory from '../../../../presentation/components/reports/ReportHistory';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock chart components
jest.mock('../../../../presentation/components/charts/BarChart', () => {
  return function MockBarChart({ data, ariaLabel }) {
    return <div data-testid="bar-chart" data-aria-label={ariaLabel}>{JSON.stringify(data)}</div>;
  };
});

describe('ReportHistory', () => {
  const mockProps = {
    userId: 'user123',
    role: 'learner',
    showRefresh: true,
    onRefresh: jest.fn(),
  };

  const mockReportHistoryData = {
    summary: {
      totalReports: 15,
      thisMonth: 8,
      lastGenerated: '2024-01-15T10:30:00Z',
      averageGenerationTime: 2.5,
      mostPopularType: 'Learning Progress',
      successRate: 95
    },
    reports: [
      {
        id: 'report-1',
        title: 'Learning Progress Report',
        type: 'Learning Progress',
        generatedAt: '2024-01-15T10:30:00Z',
        status: 'completed',
        fileSize: '2.3 MB',
        format: 'PDF',
        downloadCount: 5,
        sharedWith: ['trainer@example.com'],
        parameters: {
          dateRange: '2024-01-01 to 2024-01-15',
          includeCharts: true,
          includeRecommendations: true
        }
      },
      {
        id: 'report-2',
        title: 'Skill Assessment Summary',
        type: 'Skill Assessment',
        generatedAt: '2024-01-10T14:20:00Z',
        status: 'completed',
        fileSize: '1.8 MB',
        format: 'Excel',
        downloadCount: 3,
        sharedWith: [],
        parameters: {
          dateRange: '2024-01-01 to 2024-01-10',
          includeCharts: false,
          includeRecommendations: true
        }
      },
      {
        id: 'report-3',
        title: 'Performance Analytics',
        type: 'Performance Analytics',
        generatedAt: '2024-01-05T09:15:00Z',
        status: 'failed',
        fileSize: '0 MB',
        format: 'PDF',
        downloadCount: 0,
        sharedWith: [],
        parameters: {
          dateRange: '2024-01-01 to 2024-01-05',
          includeCharts: true,
          includeRecommendations: false
        }
      }
    ],
    reportTypes: [
      { name: 'Learning Progress', count: 8 },
      { name: 'Skill Assessment', count: 4 },
      { name: 'Performance Analytics', count: 2 },
      { name: 'Engagement Report', count: 1 }
    ],
    trends: {
      monthlyGeneration: [
        { month: '2023-10', count: 12 },
        { month: '2023-11', count: 15 },
        { month: '2023-12', count: 18 },
        { month: '2024-01', count: 8 }
      ],
      formatDistribution: [
        { format: 'PDF', count: 10 },
        { format: 'Excel', count: 3 },
        { format: 'CSV', count: 2 }
      ]
    },
    metadata: {
      lastUpdated: '2024-01-15T10:30:00Z',
      dataSource: 'report_history',
      version: 'v2.1',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock SWR to return mock data
    const { default: useSWR } = require('swr');
    useSWR.mockReturnValue({
      data: mockReportHistoryData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render report history with title and subtitle', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Report History')).toBeInTheDocument();
      expect(screen.getByText('Track and manage your generated reports')).toBeInTheDocument();
    });

    it('should display report history summary metrics', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Total Reports')).toBeInTheDocument();
      expect(screen.getByText('This Month')).toBeInTheDocument();
      expect(screen.getByText('Success Rate')).toBeInTheDocument();
      expect(screen.getByText('Avg. Generation Time')).toBeInTheDocument();
    });

    it('should display report types chart', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Reports by Type')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should display report filter controls', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Filter Reports:')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /select report type/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /select report status/i })).toBeInTheDocument();
    });

    it('should display report list', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Recent Reports')).toBeInTheDocument();
      expect(screen.getByText('Learning Progress Report')).toBeInTheDocument();
      expect(screen.getByText('Skill Assessment Summary')).toBeInTheDocument();
      expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
    });

    it('should display generation trends', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Generation Trends')).toBeInTheDocument();
      expect(screen.getByText('Monthly Generation')).toBeInTheDocument();
      expect(screen.getByText('Format Distribution')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should display loading skeleton when data is loading', () => {
      const { default: useSWR } = require('swr');
      useSWR.mockReturnValue({
        data: null,
        error: null,
        isLoading: true,
        mutate: jest.fn(),
      });

      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when data fetch fails', () => {
      const { default: useSWR } = require('swr');
      useSWR.mockReturnValue({
        data: null,
        error: new Error('Failed to fetch report history'),
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Failed to load report history')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });
  });

  describe('Report Filtering', () => {
    it('should filter reports by type', () => {
      render(<ReportHistory {...mockProps} />);
      
      const typeSelector = screen.getByRole('combobox', { name: /select report type/i });
      
      // Initially show all reports
      expect(screen.getByText('Learning Progress Report')).toBeInTheDocument();
      expect(screen.getByText('Skill Assessment Summary')).toBeInTheDocument();
      
      // Filter by Learning Progress type
      fireEvent.change(typeSelector, { target: { value: 'Learning Progress' } });
      
      // Should still show Learning Progress reports
      expect(screen.getByText('Learning Progress Report')).toBeInTheDocument();
    });

    it('should filter reports by status', () => {
      render(<ReportHistory {...mockProps} />);
      
      const statusSelector = screen.getByRole('combobox', { name: /select report status/i });
      
      // Filter by completed status
      fireEvent.change(statusSelector, { target: { value: 'completed' } });
      
      // Should show only completed reports
      expect(screen.getByText('Learning Progress Report')).toBeInTheDocument();
      expect(screen.getByText('Skill Assessment Summary')).toBeInTheDocument();
    });

    it('should have proper ARIA labels for chart', () => {
      render(<ReportHistory {...mockProps} />);
      
      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-aria-label', 'Report types distribution');
    });
  });

  describe('Report Actions', () => {
    it('should display action buttons for each report', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getAllByText('Download')).toHaveLength(3);
      expect(screen.getAllByText('Share')).toHaveLength(3);
      expect(screen.getAllByText('Regenerate')).toHaveLength(3);
      expect(screen.getAllByText('Delete')).toHaveLength(3);
    });

    it('should handle report action clicks', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<ReportHistory {...mockProps} />);
      
      const downloadButtons = screen.getAllByText('Download');
      fireEvent.click(downloadButtons[0]);
      
      expect(consoleSpy).toHaveBeenCalledWith('Action download taken for report report-1');
      
      consoleSpy.mockRestore();
    });

    it('should show download count for each report', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('5 downloads')).toBeInTheDocument();
      expect(screen.getByText('3 downloads')).toBeInTheDocument();
      expect(screen.getByText('0 downloads')).toBeInTheDocument();
    });

    it('should show shared status for reports', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Shared with trainer@example.com')).toBeInTheDocument();
      expect(screen.getAllByText('Not shared')).toHaveLength(2);
    });
  });

  describe('Refresh Functionality', () => {
    it('should show refresh button when showRefresh is true', () => {
      render(<ReportHistory {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should hide refresh button when showRefresh is false', () => {
      render(<ReportHistory {...mockProps} showRefresh={false} />);
      
      const refreshButton = screen.queryByRole('button', { name: /refresh/i });
      expect(refreshButton).not.toBeInTheDocument();
    });

    it('should call onRefresh when refresh button is clicked', async () => {
      render(<ReportHistory {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);
      
      // Wait for async operation
      await waitFor(() => {
        expect(mockProps.onRefresh).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<ReportHistory {...mockProps} />);
      
      const card = screen.getByRole('region', { name: /report history analytics/i });
      expect(card).toBeInTheDocument();
      
      const chart = screen.getByTestId('bar-chart');
      expect(chart).toHaveAttribute('data-aria-label');
    });

    it('should be keyboard navigable', () => {
      render(<ReportHistory {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      refreshButton.focus();
      expect(refreshButton).toHaveFocus();
      
      // Tab to type selector
      fireEvent.keyDown(refreshButton, { key: 'Tab' });
      const typeSelector = screen.getByRole('combobox', { name: /select report type/i });
      expect(typeSelector).toHaveFocus();
    });
  });

  describe('Report Details', () => {
    it('should display report details correctly', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('PDF')).toBeInTheDocument(); // format
      expect(screen.getByText('Excel')).toBeInTheDocument(); // format
      expect(screen.getByText('2.3 MB')).toBeInTheDocument(); // file size
      expect(screen.getByText('1.8 MB')).toBeInTheDocument(); // file size
    });

    it('should display report generation date', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
      expect(screen.getByText(/Jan 10, 2024/)).toBeInTheDocument();
      expect(screen.getByText(/Jan 5, 2024/)).toBeInTheDocument();
    });

    it('should display report status indicators', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
  });

  describe('Trends Display', () => {
    it('should display monthly generation trends', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('2023-10')).toBeInTheDocument();
      expect(screen.getByText('2023-11')).toBeInTheDocument();
      expect(screen.getByText('2023-12')).toBeInTheDocument();
      expect(screen.getByText('2024-01')).toBeInTheDocument();
    });

    it('should display format distribution', () => {
      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('PDF')).toBeInTheDocument();
      expect(screen.getByText('Excel')).toBeInTheDocument();
      expect(screen.getByText('CSV')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render correctly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<ReportHistory {...mockProps} />);
      
      expect(screen.getByText('Report History')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
});
