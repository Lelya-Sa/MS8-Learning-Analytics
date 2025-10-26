import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformanceOptimizer from '../../../../presentation/components/optimization/PerformanceOptimizer';

// Mock React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn((fn) => fn()),
  useCallback: jest.fn((fn) => fn()),
  useEffect: jest.fn(),
}));

describe('PerformanceOptimizer', () => {
  const mockProps = {
    userId: 'user123',
    onOptimize: jest.fn(),
  };

  describe('Rendering', () => {
    it('should render performance optimizer with title', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Performance Optimizer')).toBeInTheDocument();
      expect(screen.getByText('Optimize your learning analytics performance')).toBeInTheDocument();
    });

    it('should display performance metrics', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Current Performance')).toBeInTheDocument();
      expect(screen.getByText('Page Load Time')).toBeInTheDocument();
      expect(screen.getByText('Bundle Size')).toBeInTheDocument();
      expect(screen.getByText('Memory Usage')).toBeInTheDocument();
      expect(screen.getByText('Cache Hit Rate')).toBeInTheDocument();
    });

    it('should display optimization suggestions', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Optimization Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Enable Code Splitting')).toBeInTheDocument();
      expect(screen.getByText('Optimize Images')).toBeInTheDocument();
      expect(screen.getByText('Enable Compression')).toBeInTheDocument();
      expect(screen.getByText('Cache Static Assets')).toBeInTheDocument();
    });

    it('should display optimization controls', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Clear Cache')).toBeInTheDocument();
      expect(screen.getByText('Optimize Images')).toBeInTheDocument();
      expect(screen.getByText('Minify Assets')).toBeInTheDocument();
      expect(screen.getByText('Enable Compression')).toBeInTheDocument();
    });
  });

  describe('Performance Metrics', () => {
    it('should display current performance values', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('2.3s')).toBeInTheDocument(); // Page load time
      expect(screen.getByText('1.2MB')).toBeInTheDocument(); // Bundle size
      expect(screen.getByText('45MB')).toBeInTheDocument(); // Memory usage
      expect(screen.getByText('78%')).toBeInTheDocument(); // Cache hit rate
    });

    it('should show performance status indicators', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Good')).toBeInTheDocument(); // Page load status
      expect(screen.getByText('Excellent')).toBeInTheDocument(); // Bundle size status
      expect(screen.getByText('Fair')).toBeInTheDocument(); // Memory usage status
      expect(screen.getByText('Good')).toBeInTheDocument(); // Cache hit rate status
    });
  });

  describe('Optimization Actions', () => {
    it('should handle clear cache action', async () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      const clearCacheButton = screen.getByText('Clear Cache');
      fireEvent.click(clearCacheButton);
      
      await waitFor(() => {
        expect(screen.getByText('Cache cleared successfully')).toBeInTheDocument();
      });
    });

    it('should handle optimize images action', async () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      const optimizeImagesButton = screen.getByText('Optimize Images');
      fireEvent.click(optimizeImagesButton);
      
      await waitFor(() => {
        expect(screen.getByText('Images optimized successfully')).toBeInTheDocument();
      });
    });

    it('should handle minify assets action', async () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      const minifyAssetsButton = screen.getByText('Minify Assets');
      fireEvent.click(minifyAssetsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Assets minified successfully')).toBeInTheDocument();
      });
    });

    it('should handle enable compression action', async () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      const enableCompressionButton = screen.getByText('Enable Compression');
      fireEvent.click(enableCompressionButton);
      
      await waitFor(() => {
        expect(screen.getByText('Compression enabled successfully')).toBeInTheDocument();
      });
    });
  });

  describe('Optimization Suggestions', () => {
    it('should display suggestion details', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Reduce bundle size by 15%')).toBeInTheDocument();
      expect(screen.getByText('Improve page load time by 20%')).toBeInTheDocument();
      expect(screen.getByText('Reduce memory usage by 10%')).toBeInTheDocument();
      expect(screen.getByText('Increase cache hit rate by 5%')).toBeInTheDocument();
    });

    it('should show suggestion impact levels', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('High Impact')).toBeInTheDocument();
      expect(screen.getByText('Medium Impact')).toBeInTheDocument();
      expect(screen.getByText('Low Impact')).toBeInTheDocument();
    });

    it('should allow applying suggestions', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      const applyButtons = screen.getAllByText('Apply');
      expect(applyButtons).toHaveLength(4);
      
      fireEvent.click(applyButtons[0]);
      expect(mockProps.onOptimize).toHaveBeenCalledWith('code-splitting');
    });
  });

  describe('Performance Monitoring', () => {
    it('should display real-time performance data', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Real-time Monitoring')).toBeInTheDocument();
      expect(screen.getByText('CPU Usage')).toBeInTheDocument();
      expect(screen.getByText('Network Speed')).toBeInTheDocument();
      expect(screen.getByText('Response Time')).toBeInTheDocument();
    });

    it('should show performance trends', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Performance Trends')).toBeInTheDocument();
      expect(screen.getByText('Last 24 Hours')).toBeInTheDocument();
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
      expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      
      const button = screen.getByText('Clear Cache');
      expect(button).toHaveAttribute('aria-label', 'Clear application cache');
    });

    it('should be keyboard navigable', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      const clearCacheButton = screen.getByText('Clear Cache');
      clearCacheButton.focus();
      expect(clearCacheButton).toHaveFocus();
      
      // Tab to next button
      fireEvent.keyDown(clearCacheButton, { key: 'Tab' });
      const optimizeImagesButton = screen.getByText('Optimize Images');
      expect(optimizeImagesButton).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle optimization errors gracefully', async () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      const clearCacheButton = screen.getByText('Clear Cache');
      fireEvent.click(clearCacheButton);
      
      // Simulate error
      await waitFor(() => {
        expect(screen.getByText('Failed to clear cache')).toBeInTheDocument();
      });
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

      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Performance Optimizer')).toBeInTheDocument();
      expect(screen.getByText('Current Performance')).toBeInTheDocument();
    });
  });

  describe('Performance Impact', () => {
    it('should show before and after metrics', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('Before Optimization')).toBeInTheDocument();
      expect(screen.getByText('After Optimization')).toBeInTheDocument();
      expect(screen.getByText('Improvement')).toBeInTheDocument();
    });

    it('should calculate performance improvements', () => {
      render(<PerformanceOptimizer {...mockProps} />);
      
      expect(screen.getByText('+15%')).toBeInTheDocument(); // Improvement percentage
      expect(screen.getByText('-0.5s')).toBeInTheDocument(); // Load time improvement
      expect(screen.getByText('-200KB')).toBeInTheDocument(); // Bundle size improvement
    });
  });
});
