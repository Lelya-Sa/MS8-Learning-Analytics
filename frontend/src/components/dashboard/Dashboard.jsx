import React from 'react'
import LearnerAnalytics from '../analytics/LearnerAnalytics'
import TrainerAnalytics from '../analytics/TrainerAnalytics'
import OrganizationAnalytics from '../analytics/OrganizationAnalytics'

const Dashboard = ({ user }) => {
  if (!user) {
    return <div>Please log in to view your dashboard.</div>
  }

  const renderLearnerDashboard = () => (
    <div className="learner-dashboard">
      <h1>My Learning Analytics</h1>
      <LearnerAnalytics userId={user.id} />
    </div>
  )

  const renderTrainerDashboard = () => (
    <div className="trainer-dashboard">
      <h1>Course Analytics</h1>
      <TrainerAnalytics userId={user.id} />
    </div>
  )

  const renderOrganizationDashboard = () => (
    <div className="organization-dashboard">
      <h1>Organization Analytics</h1>
      <OrganizationAnalytics organizationId={user.organizationId} />
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
      return <div>Unknown role</div>
  }
}

export default Dashboard
