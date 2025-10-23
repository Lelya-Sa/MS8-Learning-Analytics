import React, { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = !!user

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.login(email, password)
      setUser(response.user)
      localStorage.setItem('auth_token', response.token)
    } catch (err) {
      setError('Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      localStorage.removeItem('auth_token')
    }
  }

  const refreshToken = async () => {
    try {
      const response = await api.refreshToken()
      localStorage.setItem('auth_token', response.token)
      return response
    } catch (err) {
      logout()
      throw err
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      // In a real app, you'd validate the token here
      // For now, we'll just set a mock user
      setUser({
        id: 'user-123',
        email: 'test@example.com',
        role: 'learner',
        organization_id: 'org-123'
      })
    }
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshToken
  }

  if (!isAuthenticated) {
    return (
      <AuthContext.Provider value={value}>
        <div className="auth-container">
          <form className="login-form" role="form" onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            login(formData.get('email'), formData.get('password'))
          }}>
            <h2>Sign In</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                aria-label="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                aria-label="password"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      <div>
        <div className="welcome-message">
          Welcome, {user.email}!
        </div>
        <button 
          onClick={logout}
          className="logout-button"
          aria-label="Logout"
        >
          Logout
        </button>
        {children}
      </div>
    </AuthContext.Provider>
  )
}
