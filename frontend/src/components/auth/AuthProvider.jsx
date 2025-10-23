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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const isAuthenticated = !!user

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.login(email, password)
      setUser(response.user)
      localStorage.setItem('auth_token', response.token)
      return response
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
    setIsLoading(false)
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
