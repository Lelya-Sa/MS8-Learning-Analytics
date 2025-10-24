import React from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import DashboardLayout from '../components/layout/DashboardLayout'
import OrganizationAnalytics from '../components/analytics/OrganizationAnalytics'
import './CommonPage.css'

const OrganizationPage = () => {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="organization-page common-page">
        <div className="page-header">
          <h1 className="page-title">Organization</h1>
          <p className="page-description">
            View organization-wide analytics and insights
          </p>
        </div>

        <div className="page-content">
          <OrganizationAnalytics organizationId={user?.organization_id} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default OrganizationPage

