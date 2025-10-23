import React from 'react'
import LearnerAnalytics from '../analytics/LearnerAnalytics'
import TrainerAnalytics from '../analytics/TrainerAnalytics'
import OrganizationAnalytics from '../analytics/OrganizationAnalytics'

const Dashboard = ({ user }) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-gray-500">Please log in to view your dashboard.</p>
        </div>
      </div>
    )
  }

  const renderLearnerDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Learning Analytics</h2>
        <LearnerAnalytics userId={user.id} />
      </div>
    </div>
  )

  const renderTrainerDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Analytics</h2>
        <TrainerAnalytics userId={user.id} />
      </div>
    </div>
  )

  const renderOrganizationDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Organization Analytics</h2>
        <OrganizationAnalytics organizationId={user.organization_id} />
      </div>
    </div>
  )

  switch (user.role) {
    case 'learner':
      return renderLearnerDashboard()
    case 'trainer':
      return renderTrainerDashboard()
    case 'org_admin':
      return renderOrganizationDashboard()
    default:
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-red-500">Unknown role: {user.role}</p>
          </div>
        </div>
      )
  }
}

export default Dashboard
