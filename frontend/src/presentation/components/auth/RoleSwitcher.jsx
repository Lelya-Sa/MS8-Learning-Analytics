import React, { useState } from 'react';
import { useAuth } from '../../../application/state/AuthContext';

/**
 * RoleSwitcher component that allows users to switch between their assigned roles
 * 
 * Features:
 * - Role-based switching with visual indicators
 * - Keyboard navigation support
 * - Loading states during role switching
 * - Error handling
 * - Accessibility compliant (WCAG 2.2 AA)
 * - Compact mode for smaller screens
 * - Auto-hide when user has only one role
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.compact] - Enable compact mode for smaller screens
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Role switcher component or null
 */
export const RoleSwitcher = ({ compact = false, className = '' }) => {
  const { isAuthenticated, user, currentRole, switchRole } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState(null);

  // Don't render if user is not authenticated or has only one role
  if (!isAuthenticated || !user || !user.roles || user.roles.length <= 1) {
    return null;
  }

  const handleRoleSwitch = async (newRole) => {
    if (newRole === currentRole || isSwitching) return;

    setIsSwitching(true);
    setError(null);

    try {
      await switchRole(newRole);
    } catch (err) {
      setError('Failed to switch role');
      console.error('Role switch error:', err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleKeyDown = (event, role) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRoleSwitch(role);
    }
  };

  const getRoleIcon = (role) => {
    const icons = {
      learner: '🎓',
      trainer: '👨‍🏫',
      'org-admin': '👑'
    };
    return icons[role] || '👤';
  };

  const getRoleLabel = (role) => {
    const labels = {
      learner: 'Learner',
      trainer: 'Trainer',
      'org-admin': 'Org Admin'
    };
    return labels[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div 
      className={`role-switcher ${compact ? 'compact' : ''} ${className}`}
      data-testid="role-switcher"
      role="tablist"
      aria-label="Switch user role"
    >
      {error && (
        <div className="role-switcher-error" role="alert">
          {error}
        </div>
      )}
      
      {isSwitching && (
        <div className="role-switching-loading" data-testid="role-switching-loading">
          <div className="spinner" aria-hidden="true"></div>
          <span>Switching role...</span>
        </div>
      )}

      <div className="role-buttons">
        {user.roles.map((role) => (
          <button
            key={role}
            className={`role-button ${role === currentRole ? 'active' : ''}`}
            onClick={() => handleRoleSwitch(role)}
            onKeyDown={(e) => handleKeyDown(e, role)}
            role="tab"
            aria-selected={role === currentRole}
            tabIndex={role === currentRole ? 0 : -1}
            disabled={isSwitching}
            aria-label={`Switch to ${getRoleLabel(role)} role`}
          >
            <span 
              className="role-icon" 
              data-testid={`${role}-icon`}
              aria-hidden="true"
            >
              {getRoleIcon(role)}
            </span>
            {!compact && (
              <span className="role-label">
                {getRoleLabel(role)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSwitcher;
