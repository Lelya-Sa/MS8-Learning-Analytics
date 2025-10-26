import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MainContent } from './MainContent';
import { useTheme } from '../../../application/state/ThemeContext';
import { useAuth } from '../../../application/state/AuthContext';

/**
 * Main application layout component
 * Provides the overall structure with header, sidebar, main content, and footer
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in main content
 * @param {boolean} props.isLoading - Whether the app is in loading state
 * @param {string} props.error - Error message to display
 * @returns {JSX.Element} AppLayout component
 */
export const AppLayout = ({ children, isLoading = false, error = null }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getLayoutClass = () => {
    const classes = ['app-layout'];
    
    if (theme === 'dark') {
      classes.push('dark-emerald-theme');
    } else {
      classes.push('light-emerald-theme');
    }
    
    if (isMobile) {
      classes.push('mobile');
    } else if (window.innerWidth >= 1024) {
      classes.push('desktop');
    } else {
      classes.push('tablet');
    }
    
    return classes.join(' ');
  };

  if (!isAuthenticated) {
    return (
      <div className={getLayoutClass()} data-testid="app-layout">
        <div className="auth-layout">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={getLayoutClass()} data-testid="app-layout">
      <Header 
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        isMobile={isMobile}
      />
      
      <div className="layout-body">
        <Sidebar 
          collapsed={sidebarCollapsed}
          isMobile={isMobile}
        />
        
        <MainContent 
          sidebarCollapsed={sidebarCollapsed}
          isLoading={isLoading}
          error={error}
        >
          {children}
        </MainContent>
      </div>
      
      <Footer />
    </div>
  );
};
