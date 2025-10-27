import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the context
const ThemeContext = createContext(null);

// Theme types
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Local storage key
const THEME_STORAGE_KEY = 'ms8-theme';

// Valid theme values
const VALID_THEMES = Object.values(THEMES);

// Initial state - Default to LIGHT theme
const initialState = {
  theme: THEMES.LIGHT,
  isDarkMode: false
};

/**
 * ThemeProvider component that provides theme context to its children
 * Supports light, dark, and system themes with localStorage persistence
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.defaultTheme - Default theme to use (optional)
 * @returns {JSX.Element} ThemeProvider component
 */
export const ThemeProvider = ({ children, defaultTheme = THEMES.LIGHT }) => {
  const [state, setState] = useState(initialState);

  // Helper function to determine if dark mode is active
  const getIsDarkMode = useCallback((theme) => {
    if (theme === THEMES.DARK) {
      return true;
    } else if (theme === THEMES.LIGHT) {
      return false;
    } else if (theme === THEMES.SYSTEM) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }, []);

  // Load theme from localStorage on initialization
  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const theme = savedTheme && VALID_THEMES.includes(savedTheme) ? savedTheme : defaultTheme;
        const isDarkMode = getIsDarkMode(theme);
        
        setState({
          theme,
          isDarkMode
        });
        
        // Apply theme to body immediately (both CSS night-mode and Tailwind dark classes)
        document.body.className = isDarkMode ? 'night-mode dark' : 'day-mode';
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
        const isDarkMode = getIsDarkMode(defaultTheme);
        setState({
          theme: defaultTheme,
          isDarkMode
        });
        
        // Apply theme to body (both CSS night-mode and Tailwind dark classes)
        document.body.className = isDarkMode ? 'night-mode dark' : 'day-mode';
      }
    };

    loadTheme();
  }, [defaultTheme, getIsDarkMode]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      if (state.theme === THEMES.SYSTEM) {
        setState(prevState => ({
          ...prevState,
          isDarkMode: e.matches
        }));
        
        // Apply theme to body (both CSS night-mode and Tailwind dark classes)
        document.body.className = e.matches ? 'night-mode dark' : 'day-mode';
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [state.theme]);

  // Set theme function
  const setTheme = useCallback((newTheme) => {
    if (!VALID_THEMES.includes(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}. Valid themes are: ${VALID_THEMES.join(', ')}`);
      return;
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    const isDarkMode = getIsDarkMode(newTheme);
    
    setState({
      theme: newTheme,
      isDarkMode
    });
    
    // Apply theme to body (both CSS night-mode and Tailwind dark classes)
    document.body.className = isDarkMode ? 'night-mode dark' : 'day-mode';
  }, [getIsDarkMode]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    if (state.theme === THEMES.LIGHT) {
      setTheme(THEMES.DARK);
    } else if (state.theme === THEMES.DARK) {
      setTheme(THEMES.LIGHT);
    } else if (state.theme === THEMES.SYSTEM) {
      setTheme(THEMES.LIGHT);
    }
  }, [state.theme, setTheme]);

  // Context value
  const value = {
    theme: state.theme,
    isDarkMode: state.isDarkMode,
    toggleTheme,
    setTheme,
    themes: THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 * @returns {Object} Theme context value
 * @throws {Error} If used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;