import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../application/state/AuthContext';

/**
 * Sidebar component for navigation
 * Shows different navigation items based on user role
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.collapsed - Whether sidebar is collapsed
 * @param {boolean} props.isMobile - Whether on mobile device
 * @returns {JSX.Element} Sidebar component
 */
export const Sidebar = ({ collapsed, isMobile }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/courses', label: 'Courses', icon: '📚' },
      { path: '/progress', label: 'My Progress', icon: '📈' },
    ];

    const roleSpecificItems = {
      learner: [
        { path: '/assignments', label: 'Assignments', icon: '📝' },
        { path: '/certificates', label: 'Certificates', icon: '🏆' },
      ],
      trainer: [
        { path: '/learners', label: 'Learners', icon: '👥' },
        { path: '/content', label: 'Content', icon: '📄' },
        { path: '/reports', label: 'Reports', icon: '📋' },
      ],
      'org-admin': [
        { path: '/organization', label: 'Organization', icon: '🏢' },
        { path: '/users', label: 'Users', icon: '👤' },
        { path: '/analytics', label: 'Analytics', icon: '📊' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
      ],
    };

    const activeRole = user?.activeRole || 'learner';
    const specificItems = roleSpecificItems[activeRole] || [];

    return [...baseItems, ...specificItems];
  };

  const navigationItems = getNavigationItems();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getSidebarClass = () => {
    const classes = ['sidebar'];
    
    if (collapsed) {
      classes.push('collapsed');
    }
    
    if (isMobile) {
      classes.push('mobile-collapsed');
    }
    
    return classes.join(' ');
  };

  return (
    <aside 
      className={getSidebarClass()} 
      data-testid="sidebar"
      role="navigation"
      aria-label="Main navigation"
    >
      <nav className="sidebar-nav">
        <ul className="nav-items" data-testid="nav-items">
          {navigationItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-role-badge">
              {user?.activeRole?.charAt(0).toUpperCase() + user?.activeRole?.slice(1)}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
