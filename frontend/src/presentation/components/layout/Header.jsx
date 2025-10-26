import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../application/state/AuthContext';
import { useTheme } from '../../../application/state/ThemeContext';

/**
 * Header component for the application
 * Contains logo, navigation, user menu, and theme toggle
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onToggleSidebar - Function to toggle sidebar
 * @param {boolean} props.sidebarCollapsed - Whether sidebar is collapsed
 * @param {boolean} props.isMobile - Whether on mobile device
 * @returns {JSX.Element} Header component
 */
const Header = ({ onToggleSidebar, sidebarCollapsed, isMobile }) => {
  const { user, logout, switchRole } = useAuth();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleRoleSwitch = async (role) => {
    try {
      await switchRole(role);
      setUserMenuOpen(false);
      
      // Navigate to the appropriate dashboard based on role
      let dashboardPath = '/dashboard';
      switch (role) {
        case 'learner':
          dashboardPath = '/dashboard/learner';
          break;
        case 'trainer':
          dashboardPath = '/dashboard/trainer';
          break;
        case 'org_admin':
          dashboardPath = '/dashboard/organization';
          break;
        default:
          dashboardPath = '/dashboard/learner';
      }
      
      navigate(dashboardPath);
    } catch (error) {
      console.error('Role switch failed:', error);
    }
  };

  const getThemeIcon = () => {
    if (isDarkMode) {
      return '🌙'; // Moon icon for dark mode
    }
    return '☀️'; // Sun icon for light mode
  };

  // Navigation links for the header
  const getNavigationLinks = () => {
    if (!user) return [];
    
    const baseLinks = [
      { path: '/', label: 'Home', icon: '🏠' },
      { path: '/reports', label: 'Reports', icon: '📄' }
    ];

    // Role-specific dashboard links
    const roleDashboardLinks = {
      learner: [
        { path: '/dashboard/learner', label: 'My Dashboard', icon: '📊' }
      ],
      trainer: [
        { path: '/dashboard/trainer', label: 'My Dashboard', icon: '📊' },
        { path: '/students', label: 'Students', icon: '👥' },
        { path: '/courses', label: 'Courses', icon: '📚' }
      ],
      org_admin: [
        { path: '/dashboard/organization', label: 'My Dashboard', icon: '📊' },
        { path: '/organization', label: 'Organization', icon: '🏢' },
        { path: '/users', label: 'Users', icon: '👤' }
      ]
    };

    // Get user's current role or default to first role
    const currentRole = user.activeRole || user.role || (user.roles && user.roles[0]);
    
    // Add role-specific dashboard link
    const dashboardLink = roleDashboardLinks[currentRole];
    if (dashboardLink) {
      baseLinks.unshift(dashboardLink[0]); // Add dashboard as first link
    }

    // Add other role-specific links for current role only
    if (dashboardLink && dashboardLink.length > 1) {
      baseLinks.push(...dashboardLink.slice(1)); // Add additional role-specific links
    }

    return baseLinks;
  };

  const navigationLinks = getNavigationLinks();

  return (
    <header 
      className="header" 
      data-testid="header"
      role="banner"
    >
      <div className="header-container">
        {/* Left Section - Logo */}
        <div className="header-left">
          <div className="logo" data-testid="logo">
            <div className="logo-icon">📊</div>
            <h1>MS8 Learning Analytics</h1>
          </div>
        </div>

        {/* Center Section - Navigation */}
        <div className="header-center">
          <nav>
            <ul className="nav-links">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <NavLink 
                    to={link.path} 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{link.icon}</span>
                    <span className="nav-label">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right Section - User Menu & Theme Toggle */}
        <div className="header-right">
          <button
            className="theme-toggle"
            data-testid="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
          >
            {getThemeIcon()}
          </button>

          {user ? (
            <div className="user-menu" data-testid="user-menu">
              <button
                className="user-menu-trigger"
                data-testid="user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="user-avatar">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <span className="user-email">{user?.email}</span>
                  <span className="user-role">{user?.activeRole || user?.role}</span>
                </div>
              </button>

              {userMenuOpen && (
                <div 
                  className="user-menu-dropdown" 
                  data-testid="user-menu-dropdown"
                  role="menu"
                >
                  <div className="user-menu-header">
                    <div className="user-details">
                      <div className="user-email">{user?.email}</div>
                      <div className="user-role">Role: {user?.activeRole || user?.role}</div>
                    </div>
                  </div>

                  <div className="user-menu-actions">
                    {user?.roles?.length > 1 && (
                      <div className="role-switch">
                        <h4>Switch Role:</h4>
                        {user.roles.map((role) => (
                          <button
                            key={role}
                            className={`role-button ${role === (user.activeRole || user.role) ? 'active' : ''}`}
                            onClick={() => handleRoleSwitch(role)}
                            disabled={role === (user.activeRole || user.role)}
                          >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      className="logout-button"
                      data-testid="logout-button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="login-button">
                <span className="login-icon">🔑</span>
                <span>Login</span>
              </NavLink>
              <NavLink to="/dashboard" className="dashboard-button">
                <span className="dashboard-icon">📊</span>
                <span>Dashboard</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {userMenuOpen && (
        <div 
          className="user-menu-overlay"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;