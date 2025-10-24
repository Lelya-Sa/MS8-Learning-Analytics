import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import Navigation from './Navigation'
import './Header.css'

const Header = () => {
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState('day-mode')

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'day-mode'
    setTheme(savedTheme)
    document.body.className = savedTheme
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'day-mode' ? 'night-mode' : 'day-mode'
    setTheme(newTheme)
    document.body.className = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const handleLogout = () => {
    logout()
  }

  const getUserInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : '?'
  }

  const getRoleColor = (role) => {
    const colors = {
      learner: 'var(--gradient-primary)',
      trainer: 'linear-gradient(135deg, #8b4513, #d2691e)',
      org_admin: 'linear-gradient(135deg, #1e40af, #3b82f6)'
    }
    return colors[role] || colors.learner
  }

  return (
    <header className="header" role="banner">
      <div className="nav-container">
        <Link to="/" className="logo" aria-label="MS8 Learning Analytics Home">
          <span className="logo-icon">📊</span>
          <span className="logo-text">MS8 Learning Analytics</span>
        </Link>

        <Navigation />

        <div className="header-controls">
          {user && (
            <div className="user-profile">
              <div 
                className="user-avatar" 
                style={{ background: getRoleColor(user.role) }}
                aria-label={`User avatar for ${user.email}`}
              >
                {getUserInitials(user.email)}
              </div>
              <div className="user-details">
                <span className="user-name">{user.email}</span>
                <span className="user-role">{user.role.replace('_', ' ')}</span>
              </div>
            </div>
          )}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'day-mode' ? 'night' : 'day'} mode`}
          >
            {theme === 'day-mode' ? '🌙' : '☀️'}
          </button>

          {user && (
            <button
              className="btn btn-secondary logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

