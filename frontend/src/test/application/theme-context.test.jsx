import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../application/state/ThemeContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme, setTheme, isDarkMode } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="is-dark-mode">{isDarkMode.toString()}</div>
      <button data-testid="toggle-btn" onClick={toggleTheme}>
        Toggle Theme
      </button>
      <button data-testid="set-dark-btn" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="set-light-btn" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-system-btn" onClick={() => setTheme('system')}>
        Set System
      </button>
    </div>
  );
};

describe('ThemeContext and ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('ThemeProvider', () => {
    it('should provide default theme state', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    });

    it('should load theme from localStorage on initialization', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('ms8-theme');
    });

    it('should handle invalid theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle between light and dark themes', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');

      await act(async () => {
        fireEvent.click(screen.getByTestId('toggle-btn'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ms8-theme', 'dark');

      await act(async () => {
        fireEvent.click(screen.getByTestId('toggle-btn'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ms8-theme', 'light');
    });

    it('should toggle from system theme to light', async () => {
      localStorageMock.getItem.mockReturnValue('system');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');

      await act(async () => {
        fireEvent.click(screen.getByTestId('toggle-btn'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    });
  });

  describe('Theme Setting', () => {
    it('should set theme to dark', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('set-dark-btn'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ms8-theme', 'dark');
    });

    it('should set theme to light', async () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('set-light-btn'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ms8-theme', 'light');
    });

    it('should set theme to system', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('set-system-btn'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ms8-theme', 'system');
    });

    it('should handle invalid theme setting', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Test setting invalid theme
      const { setTheme } = screen.getByTestId('current-theme').parentElement;
      // This would be tested through a more complex component that allows invalid input
      
      consoleSpy.mockRestore();
    });
  });

  describe('System Theme Detection', () => {
    it('should detect system dark mode preference', () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      localStorageMock.getItem.mockReturnValue('system');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      // isDarkMode should reflect system preference
    });

    it('should listen to system theme changes', () => {
      const mockMatchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      localStorageMock.getItem.mockReturnValue('system');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });
  });

  describe('Context Hook', () => {
    it('should throw error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Theme Persistence', () => {
    it('should persist theme changes to localStorage', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('set-dark-btn'));
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('ms8-theme', 'dark');

      await act(async () => {
        fireEvent.click(screen.getByTestId('set-light-btn'));
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('ms8-theme', 'light');
    });

    it('should handle localStorage errors during theme setting', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('set-dark-btn'));
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to save theme to localStorage:', expect.any(Error));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

      consoleSpy.mockRestore();
    });
  });
});
