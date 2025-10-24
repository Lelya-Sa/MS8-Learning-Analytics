import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import RoleSwitcher from '../components/auth/RoleSwitcher'
import LearnerAnalytics from '../components/analytics/LearnerAnalytics'
import TrainerAnalytics from '../components/analytics/TrainerAnalytics'
import OrganizationAnalytics from '../components/analytics/OrganizationAnalytics'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {getRoleTitle()}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {getRoleDescription()}
              </p>
            </div>
            
            {/* Role Switcher */}
            <RoleSwitcher 
              currentRole={currentRole} 
              onRoleChange={handleRoleChange}
            />
          </div>
        </div>
      </div>

      {/* Multi-Role Badge (if user has multiple roles) */}
      {user?.roles && user.roles.length > 1 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎭</span>
              <p className="text-sm text-purple-800">
                <span className="font-semibold">Multi-Role Account:</span> You have access to {user.roles.length} roles.
                Use the role switcher above to navigate between different dashboards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderDashboard()}
      </div>
    </div>
  )
}

export default MultiRoleDashboard

