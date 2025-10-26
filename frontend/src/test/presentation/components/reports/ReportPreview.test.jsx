import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportPreview from '../../../../presentation/components/reports/ReportPreview';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock chart components
jest.mock('../../../../presentation/components/charts/LineChart', () => {
  return function MockLineChart({ data, ariaLabel }) {
    return <div data-testid="line-chart" data-aria-label={ariaLabel}>{JSON.stringify(data)}</div>;
  };
});

jest.mock('../../../../presentation/components/charts/BarChart', () => {
  return function MockBarChart({ data, ariaLabel }) {
    return <div data-testid="bar-chart" data-aria-label={ariaLabel}>{JSON.stringify(data)}</div>;
  };
});

describe('ReportPreview', () => {
  const mockProps = {
    reportId: 'report-123',
    userId: 'user123',
    role: 'learner',
    showRefresh: true,
    onRefresh: jest.fn(),
  };

  const mockReportPreviewData = {
    report: {
      id: 'report-123',
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
    preview: {
      summary: {
        totalLearningHours: 45.5,
        coursesCompleted: 8,
        skillsImproved: 12,
        averageScore: 87.5,
        progressRate: 78,
        engagementScore: 92
      },
      learningProgress: [
        { week: 'Week 1', hours: 12, courses: 2, score: 85 },
        { week: 'Week 2', hours: 15, courses: 3, score: 88 },
        { week: 'Week 3', hours: 18.5, courses: 3, score: 89 }
      ],
      skillBreakdown: [
        { skill: 'JavaScript', level: 'Advanced', progress: 95 },
        { skill: 'React', level: 'Intermediate', progress: 78 },
        { skill: 'Node.js', level: 'Beginner', progress: 45 }
      ],
      achievements: [
        {
          id: 'achievement-1',
          name: 'Course Completion Streak',
          description: 'Completed 5 courses in a row',
          earnedAt: '2024-01-10T14:20:00Z',
          icon: 'trophy'
        },
        {
          id: 'achievement-2',
          name: 'High Performer',
          description: 'Scored above 85% in all assessments',
          earnedAt: '2024-01-12T09:15:00Z',
          icon: 'star'
        }
      ],
      recommendations: [
        {
          id: 'rec-1',
          title: 'Focus on Advanced React Patterns',
          description: 'Based on your current progress, consider exploring advanced React concepts.',
          priority: 'High',
          category: 'Learning'
        },
        {
          id: 'rec-2',
          title: 'Practice Algorithm Problems',
          description: 'Regular practice will help improve your problem-solving skills.',
          priority: 'Medium',
          category: 'Practice'
        }
      ],
      charts: {
        progressChart: {
          type: 'line',
          data: [
            { week: 'Week 1', hours: 12, courses: 2 },
            { week: 'Week 2', hours: 15, courses: 3 },
            { week: 'Week 3', hours: 18.5, courses: 3 }
          ],
          title: 'Learning Progress Over Time'
        },
        skillChart: {
          type: 'bar',
          data: [
            { skill: 'JavaScript', progress: 95 },
            { skill: 'React', progress: 78 },
            { skill: 'Node.js', progress: 45 }
          ],
          title: 'Skill Development Progress'
        }
      }
    },
    metadata: {
      lastUpdated: '2024-01-15T10:30:00Z',
      dataSource: 'report_preview',
      version: 'v2.1',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock SWR to return mock data
    const { default: useSWR } = require('swr');
    useSWR.mockReturnValue({
      data: mockReportPreviewData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render report preview with title and subtitle', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Learning Progress Report')).toBeInTheDocument();
      expect(screen.getByText('Preview of your learning analytics report')).toBeInTheDocument();
    });

    it('should display report summary metrics', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Total Learning Hours')).toBeInTheDocument();
      expect(screen.getByText('Courses Completed')).toBeInTheDocument();
      expect(screen.getByText('Skills Improved')).toBeInTheDocument();
      expect(screen.getByText('Average Score')).toBeInTheDocument();
      expect(screen.getByText('Progress Rate')).toBeInTheDocument();
      expect(screen.getByText('Engagement Score')).toBeInTheDocument();
    });

    it('should display learning progress chart', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Learning Progress Over Time')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should display skill breakdown chart', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Skill Development Progress')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should display achievements section', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
      expect(screen.getByText('Course Completion Streak')).toBeInTheDocument();
      expect(screen.getByText('High Performer')).toBeInTheDocument();
    });

    it('should display recommendations section', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Focus on Advanced React Patterns')).toBeInTheDocument();
      expect(screen.getByText('Practice Algorithm Problems')).toBeInTheDocument();
    });

    it('should display report actions', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Download Report')).toBeInTheDocument();
      expect(screen.getByText('Share Report')).toBeInTheDocument();
      expect(screen.getByText('Regenerate Report')).toBeInTheDocument();
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

      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when data fetch fails', () => {
      const { default: useSWR } = require('swr');
      useSWR.mockReturnValue({
        data: null,
        error: new Error('Failed to fetch report preview'),
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Failed to load report preview')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });
  });

  describe('Report Actions', () => {
    it('should handle download action', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<ReportPreview {...mockProps} />);
      
      const downloadButton = screen.getByText('Download Report');
      fireEvent.click(downloadButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('Action download taken for report report-123');
      
      consoleSpy.mockRestore();
    });

    it('should handle share action', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<ReportPreview {...mockProps} />);
      
      const shareButton = screen.getByText('Share Report');
      fireEvent.click(shareButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('Action share taken for report report-123');
      
      consoleSpy.mockRestore();
    });

    it('should handle regenerate action', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<ReportPreview {...mockProps} />);
      
      const regenerateButton = screen.getByText('Regenerate Report');
      fireEvent.click(regenerateButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('Action regenerate taken for report report-123');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Refresh Functionality', () => {
    it('should show refresh button when showRefresh is true', () => {
      render(<ReportPreview {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should hide refresh button when showRefresh is false', () => {
      render(<ReportPreview {...mockProps} showRefresh={false} />);
      
      const refreshButton = screen.queryByRole('button', { name: /refresh/i });
      expect(refreshButton).not.toBeInTheDocument();
    });

    it('should call onRefresh when refresh button is clicked', async () => {
      render(<ReportPreview {...mockProps} />);
      
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
      render(<ReportPreview {...mockProps} />);
      
      const card = screen.getByRole('region', { name: /report preview analytics/i });
      expect(card).toBeInTheDocument();
      
      const lineChart = screen.getByTestId('line-chart');
      expect(lineChart).toHaveAttribute('data-aria-label');
      
      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-aria-label');
    });

    it('should be keyboard navigable', () => {
      render(<ReportPreview {...mockProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      refreshButton.focus();
      expect(refreshButton).toHaveFocus();
      
      // Tab to download button
      fireEvent.keyDown(refreshButton, { key: 'Tab' });
      const downloadButton = screen.getByText('Download Report');
      expect(downloadButton).toHaveFocus();
    });
  });

  describe('Report Details', () => {
    it('should display report metadata correctly', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Generated: Jan 15, 2024')).toBeInTheDocument();
      expect(screen.getByText('Format: PDF')).toBeInTheDocument();
      expect(screen.getByText('Size: 2.3 MB')).toBeInTheDocument();
      expect(screen.getByText('Downloads: 5')).toBeInTheDocument();
    });

    it('should display report parameters', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Date Range: 2024-01-01 to 2024-01-15')).toBeInTheDocument();
      expect(screen.getByText('Include Charts: Yes')).toBeInTheDocument();
      expect(screen.getByText('Include Recommendations: Yes')).toBeInTheDocument();
    });
  });

  describe('Achievement Display', () => {
    it('should display achievement details correctly', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Completed 5 courses in a row')).toBeInTheDocument();
      expect(screen.getByText('Scored above 85% in all assessments')).toBeInTheDocument();
      expect(screen.getByText(/Jan 10, 2024/)).toBeInTheDocument();
      expect(screen.getByText(/Jan 12, 2024/)).toBeInTheDocument();
    });

    it('should display achievement icons', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('trophy')).toBeInTheDocument();
      expect(screen.getByText('star')).toBeInTheDocument();
    });
  });

  describe('Recommendation Display', () => {
    it('should display recommendation details correctly', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Based on your current progress, consider exploring advanced React concepts.')).toBeInTheDocument();
      expect(screen.getByText('Regular practice will help improve your problem-solving skills.')).toBeInTheDocument();
    });

    it('should display recommendation priorities', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should display recommendation categories', () => {
      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Learning')).toBeInTheDocument();
      expect(screen.getByText('Practice')).toBeInTheDocument();
    });
  });

  describe('Chart Integration', () => {
    it('should have proper ARIA labels for progress chart', () => {
      render(<ReportPreview {...mockProps} />);
      
      const lineChart = screen.getByTestId('line-chart');
      expect(lineChart).toHaveAttribute('data-aria-label', 'Learning progress over time');
    });

    it('should have proper ARIA labels for skill chart', () => {
      render(<ReportPreview {...mockProps} />);
      
      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-aria-label', 'Skill development progress');
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

      render(<ReportPreview {...mockProps} />);
      
      expect(screen.getByText('Learning Progress Report')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
});
