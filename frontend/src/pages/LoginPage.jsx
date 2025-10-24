import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthProvider'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, error, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
      // Redirect to analytics page after successful login
      navigate('/analytics')
    } catch (err) {
      // Error is handled by AuthProvider
      console.error('Login error:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <span className="text-2xl">📊</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            MS8 Learning Analytics
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account to access analytics
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">
              Demo Credentials (Password: test-password-123)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                <p className="font-medium text-blue-900 mb-1">👤 Learner Role</p>
                <p className="text-blue-700">test@example.com</p>
                <p className="text-blue-600 text-xs mt-1">Access: Learning analytics, progress tracking</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-md border border-green-200">
                <p className="font-medium text-green-900 mb-1">👨‍🏫 Trainer Role</p>
                <p className="text-green-700">trainer@example.com</p>
                <p className="text-green-600 text-xs mt-1">Access: Course analytics, student management</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                <p className="font-medium text-purple-900 mb-1">👔 Organization Admin</p>
                <p className="text-purple-700">admin@example.com</p>
                <p className="text-purple-600 text-xs mt-1">Access: Full organization analytics</p>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
                <p className="font-medium text-orange-900 mb-1">🎭 Multi-Role User</p>
                <p className="text-orange-700">multi@example.com</p>
                <p className="text-orange-600 text-xs mt-1">Roles: Learner + Trainer</p>
              </div>
              
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <p className="font-medium text-red-900 mb-1">⭐ Super Admin</p>
                <p className="text-red-700">superadmin@example.com</p>
                <p className="text-red-600 text-xs mt-1">Roles: All (Learner + Trainer + Org Admin)</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
