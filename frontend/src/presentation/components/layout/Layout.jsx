import React from 'react'
import { useAuth } from '../../../application/state/AuthContext'

export const Layout = ({ children }) => {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-layout">
      {/* Navigation */}
      <nav className="header">
        <div className="nav-container">
          <div className="header-left">
            <div className="logo">
              <span className="logo-icon">📊</span>
              <h1>MS8 Learning Analytics</h1>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-profile">
              <div className="user-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.email}</span>
                <span className="user-role">{user?.role}</span>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  )
}