import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Constants
const APP_NAME = 'MS8 Learning Analytics';
const APP_DESCRIPTION = 'Advanced learning analytics platform for educational institutions.';
const COPYRIGHT_YEAR = '2025';

/**
 * @component MainLayout
 * @description Main site layout for public pages (login, landing, etc.)
 * @memo Optimized with React.memo to prevent unnecessary re-renders
 */
export const MainLayout = memo(({
  children,
  className = '',
  header = null,
  footer = null,
  main = null,
  loading = false,
  error = null,
  ...props
}) => {
  const defaultHeader = useMemo(() => (
    <header role="banner" className="header">
      <div className="nav-container">
        <div className="header-left">
          <h1 className="logo">
            {APP_NAME}
          </h1>
        </div>
        <div className="header-center">
          <nav>
            <ul className="nav-links">
              <li>
                <a href="/login" className="nav-link">
                  <i className="fas fa-sign-in-alt nav-icon"></i>
                  <span className="nav-label">Login</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="header-right">
          <div className="auth-buttons">
            <a href="/login" className="login-button">
              <i className="fas fa-sign-in-alt login-icon"></i>
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  ), []);

  const defaultFooter = useMemo(() => (
    <footer role="contentinfo" className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">{APP_NAME}</h3>
            <p className="footer-description">{APP_DESCRIPTION}</p>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/login">Login</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li><a href="/help">Help Center</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© {COPYRIGHT_YEAR} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  ), []);

  const renderHeader = useMemo(() => {
    if (header) {
      return (
        <header role="banner" className="w-full">
          {header}
        </header>
      );
    }
    return defaultHeader;
  }, [header, defaultHeader]);

  const renderMain = useMemo(() => {
    if (main) {
      return (
        <main role="main" className="flex-1">
          {main}
        </main>
      );
    }

    if (loading) {
      return (
        <main role="main" className="flex-1 flex items-center justify-center">
          <div className="text-emerald-600 animate-pulse">Loading...</div>
        </main>
      );
    }

    if (error) {
      return (
        <main role="main" className="flex-1 flex items-center justify-center">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </main>
      );
    }

    return (
      <main role="main" className="flex-1">
        {children}
      </main>
    );
  }, [main, loading, error, children]);

  const renderFooter = useMemo(() => {
    if (footer) {
      return (
        <footer role="contentinfo" className="w-full">
          {footer}
        </footer>
      );
    }
    return defaultFooter;
  }, [footer, defaultFooter]);

  const layoutClasses = useMemo(() => classNames(
    'main-layout-container',
    'flex',
    'flex-col',
    'min-h-screen',
    className
  ), [className]);

  return (
    <div className={layoutClasses} {...props}>
      {renderHeader}
      {renderMain}
      {renderFooter}
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

MainLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  main: PropTypes.node,
  loading: PropTypes.bool,
  error: PropTypes.string,
};
