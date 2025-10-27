import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'
import HomePage from './pages/HomePage'
import PresentationPage from './pages/PresentationPage'
import { LoginPage } from './pages/LoginPage'
import ReportsPage from './pages/ReportsPage'
import LearnerDashboard from './pages/LearnerDashboard'
import TrainerDashboard from './pages/TrainerDashboard'
import OrganizationDashboard from './pages/OrganizationDashboard'

/**
 * MS8 Learning Analytics Microservice - Main Application Component
 * 
 * This is the root component of the MS8 Learning Analytics microservice,
 * implementing the Full-Stack Onion Architecture with Vibe Engineering.
 * 
 * Current Implementation:
 * - Landing Page (HomePage) with Dark Emerald Theme
 * - Authentication (LoginPage) with multi-role support
 * - Reports Generation (ReportsPage) with protected access
 * - Error Boundary for graceful error handling
 * - Protected Routes with authentication
 * 
 * Architecture Overview:
 * - 19 Analytics Categories (6 Learner, 4 Trainer, 4 Org, 2 Comparison, 3 Predictive)
 * - 3 User Roles (Learner, Trainer, Org Admin) with multi-role support
 * - 9 Integrated Microservices (Directory, Course Builder, LMS, etc.)
 * - Dark Emerald Theme (WCAG 2.2 AA Compliant)
 * - Performance: <2.5s Load Time, 6h Staleness Check, 3-layer Caching
 * 
 * User Journey Flow:
 * 1. Public Homepage → Login → Protected Routes
 * 2. Role-based access control for different features
 * 3. Error boundary catches and handles any runtime errors
 * 
 * @component App
 * @description Root application component with routing and authentication
 */
function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* ============================================ */}
        {/* PUBLIC ROUTES - No Authentication Required */}
        {/* ============================================ */}
        
        {/* Landing Page - MS8 Learning Analytics Project Overview */}
        <Route 
          path="/" 
          element={<HomePage />} 
        />
        
        {/* Presentation Page - Project Presentation for Meeting */}
        <Route 
          path="/presentation" 
          element={<PresentationPage />} 
        />
        
        {/* Authentication Page - Login with Multi-Role Support */}
        <Route 
          path="/login" 
          element={<LoginPage />} 
        />
        
        {/* ============================================ */}
        {/* PROTECTED ROUTES - Authentication Required */}
        {/* ============================================ */}
        
        {/* Dashboard Routes - Role-based */}
        <Route 
          path="/dashboard/learner" 
          element={
            <ProtectedRoute requiredRole="learner">
              <Layout>
                <LearnerDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/trainer" 
          element={
            <ProtectedRoute requiredRole="trainer">
              <Layout>
                <TrainerDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/organization" 
          element={
            <ProtectedRoute requiredRoles={['org_admin', 'org-admin']}>
              <Layout>
                <OrganizationDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/dashboard/learner" replace />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Reports Generation - All Roles */}
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Layout>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* ============================================ */}
        {/* FALLBACK ROUTES */}
        {/* ============================================ */}
        
        {/* 404 Fallback - Redirect to Homepage */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </ErrorBoundary>
  )
}

export default App