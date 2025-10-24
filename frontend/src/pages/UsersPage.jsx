import React from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import DashboardLayout from '../components/layout/DashboardLayout'
import './CommonPage.css'

const UsersPage = () => {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="users-page common-page">
        <div className="page-header">
          <h1 className="page-title">Users</h1>
          <p className="page-description">
            Manage users and their roles within your organization
          </p>
        </div>

        <div className="page-content">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>All Users</h3>
              <p>View and manage all organization users</p>
              <div className="feature-stats">
                <span className="stat-badge">250 Users</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Trainers</h3>
              <p>Manage trainer accounts and permissions</p>
              <div className="feature-stats">
                <span className="stat-badge">45 Trainers</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👨‍🎓</div>
              <h3>Learners</h3>
              <p>View learner accounts and progress</p>
              <div className="feature-stats">
                <span className="stat-badge">200 Learners</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👔</div>
              <h3>Administrators</h3>
              <p>Manage admin roles and permissions</p>
              <div className="feature-stats">
                <span className="stat-badge">5 Admins</span>
              </div>
            </div>
          </div>

          <div className="coming-soon-banner">
            <span className="banner-icon">🚧</span>
            <p>Full user management features coming soon!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UsersPage

