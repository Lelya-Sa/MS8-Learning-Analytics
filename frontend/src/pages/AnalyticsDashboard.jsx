import React from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import LearnerAnalytics from '../components/analytics/LearnerAnalytics'
import TrainerAnalytics from '../components/analytics/TrainerAnalytics'
import OrganizationAnalytics from '../components/analytics/OrganizationAnalytics'
import Dashboard from '../components/dashboard/Dashboard'

export const AnalyticsDashboard = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Learning Analytics Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard user={user} />
      </div>
    </div>
  )
}
