import React, { useState } from 'react'
import { useAuth } from './AuthProvider'

/**
 * RoleSwitcher Component
 * Allows users with multiple roles to switch between different role views
 */
const RoleSwitcher = ({ currentRole, onRoleChange }) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // If user only has one role, don't show the switcher
  if (!user || !user.roles || user.roles.length <= 1) {
    return null
  }

  const roleLabels = {
    learner: '👤 Learner',
    trainer: '👨‍🏫 Trainer',
    org_admin: '👔 Organization Admin'
  }

  const roleDescriptions = {
    learner: 'View your learning analytics and progress',
    trainer: 'Manage courses and view student analytics',
    org_admin: 'Access organization-wide analytics and reports'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          {roleLabels[currentRole] || currentRole}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-3 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Switch Role
              </p>
            </div>
            <div className="p-2 space-y-1">
              {user.roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(role)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    currentRole === role
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{roleLabels[role]?.split(' ')[0]}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {roleLabels[role]?.split(' ').slice(1).join(' ') || role}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {roleDescriptions[role]}
                      </p>
                    </div>
                    {currentRole === role && (
                      <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RoleSwitcher

