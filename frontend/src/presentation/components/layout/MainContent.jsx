import React from 'react';

/**
 * Main content area component
 * Contains the primary content area with loading and error states
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.sidebarCollapsed - Whether sidebar is collapsed
 * @param {boolean} props.isLoading - Whether content is loading
 * @param {string} props.error - Error message to display
 * @returns {JSX.Element} MainContent component
 */
export const MainContent = ({ 
  children, 
  sidebarCollapsed = false, 
  isLoading = false, 
  error = null 
}) => {
  const getMainClass = () => {
    const classes = ['main-content'];
    
    if (sidebarCollapsed) {
      classes.push('sidebar-collapsed');
    }
    
    return classes.join(' ');
  };

  if (isLoading) {
    return (
      <main 
        className={getMainClass()} 
        data-testid="main-content"
        role="main"
      >
        <div className="loading-container">
          <div className="loading-spinner" data-testid="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main 
        className={getMainClass()} 
        data-testid="main-content"
        role="main"
      >
        <div className="error-container">
          <div className="error-message" data-testid="error-message">
            <div className="error-icon">⚠️</div>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main 
      className={getMainClass()} 
      data-testid="main-content"
      role="main"
    >
      <div className="content-wrapper">
        {children}
      </div>
    </main>
  );
};
