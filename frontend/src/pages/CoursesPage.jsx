import React from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import DashboardLayout from '../components/layout/DashboardLayout'
import '../assets/css/pages-common.css'

const CoursesPage = () => {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="courses-page common-page">
        <div className="page-header">
          <h1 className="page-title">Courses</h1>
          <p className="page-description">
            Manage your courses and track their performance
          </p>
        </div>

        <div className="page-content">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>My Courses</h3>
              <p>View and manage all your courses</p>
              <div className="feature-stats">
                <span className="stat-badge">12 Courses</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Course Analytics</h3>
              <p>Track course completion and engagement rates</p>
              <div className="feature-stats">
                <span className="stat-badge">78% Completion</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Course Ratings</h3>
              <p>View student feedback and ratings</p>
              <div className="feature-stats">
                <span className="stat-badge">4.5/5.0</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Enrollments</h3>
              <p>Monitor student enrollments across courses</p>
              <div className="feature-stats">
                <span className="stat-badge">1,250 Total</span>
              </div>
            </div>
          </div>

          <div className="coming-soon-banner">
            <span className="banner-icon">🚧</span>
            <p>Full course management features coming soon!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CoursesPage

