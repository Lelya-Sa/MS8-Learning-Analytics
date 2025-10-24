import React from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import DashboardLayout from '../components/layout/DashboardLayout'
import '../assets/css/pages-common.css'

const StudentsPage = () => {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="students-page common-page">
        <div className="page-header">
          <h1 className="page-title">Students</h1>
          <p className="page-description">
            Manage and monitor student progress and performance
          </p>
        </div>

        <div className="page-content">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Student List</h3>
              <p>View all students enrolled in your courses</p>
              <div className="feature-stats">
                <span className="stat-badge">150 Students</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Performance Tracking</h3>
              <p>Monitor individual student progress and achievements</p>
              <div className="feature-stats">
                <span className="stat-badge">85% Avg Score</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚠️</div>
              <h3>At-Risk Students</h3>
              <p>Identify students who need additional support</p>
              <div className="feature-stats">
                <span className="stat-badge alert">15 At-Risk</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Engagement Metrics</h3>
              <p>Track student engagement and participation</p>
              <div className="feature-stats">
                <span className="stat-badge">92% Active</span>
              </div>
            </div>
          </div>

          <div className="coming-soon-banner">
            <span className="banner-icon">🚧</span>
            <p>Full student management features coming soon!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentsPage

