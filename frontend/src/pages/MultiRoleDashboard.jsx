import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import DashboardLayout from '../components/layout/DashboardLayout'
import RoleSwitcher from '../components/auth/RoleSwitcher'
import LearnerAnalytics from '../components/analytics/LearnerAnalytics'
import TrainerAnalytics from '../components/analytics/TrainerAnalytics'
import OrganizationAnalytics from '../components/analytics/OrganizationAnalytics'
import './MultiRoleDashboard.css'

/**
 * MultiRoleDashboard Component
 * Main dashboard that adapts based on user's current selected role
 * Allows users with multiple roles to switch between different views
 */
const MultiRoleDashboard = () => {
  const { user } = useAuth()
  const [currentRole, setCurrentRole] = useState(user?.role || 'learner')

  // Update current role when user changes
  useEffect(() => {
    if (user?.role) {
      setCurrentRole(user.role)
    }
  }, [user])

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole)
    // Store preference in localStorage
    localStorage.setItem('preferredRole', newRole)
  }

  // Load preferred role from localStorage on mount
  useEffect(() => {
    const preferredRole = localStorage.getItem('preferredRole')
    if (preferredRole && user?.roles?.includes(preferredRole)) {
      setCurrentRole(preferredRole)
    }
  }, [user])

  const renderDashboard = () => {
    switch (currentRole) {
      case 'learner':
        return <LearnerAnalytics userId={user?.id} />
      
      case 'trainer':
        return <TrainerAnalytics userId={user?.id} />
      
      case 'org_admin':
        return <OrganizationAnalytics organizationId={user?.organization_id} />
      
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Unknown role: {currentRole}</p>
          </div>
        )
    }
  }

  const getRoleTitle = () => {
    const titles = {
      learner: 'Learning Analytics',
      trainer: 'Trainer Dashboard',
      org_admin: 'Organization Dashboard'
    }
    return titles[currentRole] || 'Dashboard'
  }

  const getRoleDescription = () => {
    const descriptions = {
      learner: 'Track your learning progress, mastery levels, and achievements',
      trainer: 'Monitor course performance, student progress, and engagement metrics',
      org_admin: 'View organization-wide analytics, reports, and insights'
    }
    return descriptions[currentRole] || ''
  }

  return (
    <DashboardLayout>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">{getRoleTitle()}</h1>
          <p className="dashboard-description">{getRoleDescription()}</p>
        </div>
        
        {/* Role Switcher */}
        <RoleSwitcher 
          currentRole={currentRole} 
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Multi-Role Badge (if user has multiple roles) */}
      {user?.roles && user.roles.length > 1 && (
        <div className="multi-role-badge">
          <span className="badge-icon">🎭</span>
          <p className="badge-text">
            <span className="badge-label">Multi-Role Account:</span> You have access to {user.roles.length} roles.
            Use the role switcher above to navigate between different dashboards.
          </p>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {renderDashboard()}
      </div>
    </DashboardLayout>
  )
}

export default MultiRoleDashboard

