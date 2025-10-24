import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import { AnalyticsDashboard } from './pages/AnalyticsDashboard'
import MultiRoleDashboard from './pages/MultiRoleDashboard'
import HomePage from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import ReportsPage from './pages/ReportsPage'
import StudentsPage from './pages/StudentsPage'
import CoursesPage from './pages/CoursesPage'
import OrganizationPage from './pages/OrganizationPage'
import UsersPage from './pages/UsersPage'
import SettingsPage from './pages/SettingsPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
          <Routes>
            {/* Landing page - always accessible */}
            <Route path="/" element={<HomePage />} />
            
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes - Full microservice frontend */}
            <Route path="/analytics" element={
              <ProtectedRoute>
                <MultiRoleDashboard />
              </ProtectedRoute>
            } />

            {/* Reports */}
            <Route path="/reports" element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            } />

            {/* Trainer Routes */}
            <Route path="/students" element={
              <ProtectedRoute requiredRoles={['trainer', 'org_admin']}>
                <StudentsPage />
              </ProtectedRoute>
            } />

            <Route path="/courses" element={
              <ProtectedRoute requiredRoles={['trainer', 'org_admin']}>
                <CoursesPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/organization" element={
              <ProtectedRoute requiredRoles={['org_admin']}>
                <OrganizationPage />
              </ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute requiredRoles={['org_admin']}>
                <UsersPage />
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute requiredRoles={['org_admin']}>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Legacy single-role dashboard (kept for backwards compatibility) */}
            <Route path="/analytics/legacy" element={
              <ProtectedRoute>
                <Layout>
                  <AnalyticsDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App