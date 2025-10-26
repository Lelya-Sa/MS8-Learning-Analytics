import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../application/state/AuthContext';

/**
 * Role Selector Component
 * 
 * Displays when a user has multiple roles and needs to select which role to use.
 * Based on the user journey documentation, this should appear after login for multi-role users.
 * 
 * @component RoleSelector
 * @description Modal/component for selecting user role when multiple roles are available
 */
const RoleSelector = ({ isOpen, onClose }) => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  console.log('RoleSelector rendered - isOpen:', isOpen, 'user:', user);

  if (!isOpen || !user) {
    console.log('RoleSelector early return - isOpen:', isOpen, 'user:', !!user);
    return null;
  }

  const userRoles = user.roles || [];
  
  // If user has only one role, don't show selector
  if (userRoles.length <= 1) {
    return null;
  }

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    try {
      const updatedUser = await switchRole(role);
      console.log('Role switched to:', role, 'Updated user:', updatedUser);
      
      // Navigate to appropriate dashboard based on role
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
        case 'super_admin':
          dashboardPath = '/dashboard/super-admin';
          break;
        default:
          dashboardPath = '/dashboard';
      }
      
      console.log('Navigating to:', dashboardPath);
      
      onClose();
      
      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        navigate(dashboardPath);
      }, 100);
    } catch (error) {
      console.error('Role switch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'learner': return '👨‍🎓';
      case 'trainer': return '👨‍🏫';
      case 'org_admin': return '👔';
      case 'super_admin': return '👑';
      default: return '👤';
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'learner':
        return 'View your learning progress, analytics, and achievements';
      case 'trainer':
        return 'Monitor course performance and student progress';
      case 'org_admin':
        return 'Manage organization-wide learning analytics and users';
      case 'super_admin':
        return 'Access all system features and administrative functions';
      default:
        return 'Access your personalized dashboard';
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
    >
      <div 
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '0.5rem',
          padding: '2rem',
          maxWidth: '28rem',
          width: '100%',
          margin: '0 1rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-cyan)' }}>
            Select Your Role
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Choose which role you'd like to use for this session
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {userRoles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              disabled={isLoading}
              style={{ 
                width: '100%',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '2px solid var(--text-muted)',
                backgroundColor: 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.5 : 1
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.5rem' }}>
                  {getRoleIcon(role)}
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                    {role.replace('_', ' ')}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {getRoleDescription(role)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div style={{ 
              display: 'inline-block',
              width: '1.5rem',
              height: '1.5rem',
              border: '2px solid var(--primary-cyan)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Switching role...
            </span>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={onClose}
            style={{ 
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--text-muted)', 
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
