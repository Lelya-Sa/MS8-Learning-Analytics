import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import { AnalyticsDashboard } from './pages/AnalyticsDashboard'
import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'

// Landing page with navigation to microservice features
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            🚀 MS8 Learning Analytics
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Advanced Microservice-Based Learning Analytics Platform
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Comprehensive analytics, real-time insights, and intelligent learning path recommendations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-6">Role-based analytics with real-time data visualization</p>
            <a 
              href="/analytics" 
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              View Analytics
            </a>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentication</h3>
            <p className="text-gray-600 mb-6">Secure login with role-based access control</p>
            <a 
              href="/login" 
              className="inline-block bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Login
            </a>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Microservices</h3>
            <p className="text-gray-600 mb-6">Distributed architecture with 9 integrated microservices</p>
            <div className="text-sm text-gray-500">
              Directory, Course Builder, Content Studio, Assessment, Skills Engine, Learner AI, DevLab, RAG Assistant, Auth
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Demo Credentials</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Email:</strong> test@example.com</p>
            <p><strong>Password:</strong> test-password-123</p>
            <p><strong>Role:</strong> Learner (with access to learning analytics)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing page - always accessible */}
            <Route path="/" element={<HomePage />} />
            
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes - Full microservice frontend */}
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Layout>
                  <AnalyticsDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App