/**
 * @file LoginPage
 * @description Login page component following Onion Architecture
 * @author MS8 Learning Analytics Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../application/state/AuthContext';
import { useTheme } from '../../application/state/ThemeContext';

/**
 * LoginPage component
 * Handles user authentication with email and password
 */
export const LoginPage = () => {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRoles = user.roles || [];
      const activeRole = user.role || userRoles[0] || 'learner';
      
      // If user has multiple roles, let them select on the dashboard
      // Otherwise navigate directly to their dashboard
      if (userRoles.length > 1) {
        navigate('/dashboard');
      } else {
        // Handle both 'org-admin' and 'org_admin' role variations
        const dashboardPath = (activeRole === 'org_admin' || activeRole === 'org-admin') 
          ? '/dashboard/organization' 
          : `/dashboard/${activeRole}`;
        navigate(dashboardPath);
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Call login - this will authenticate with MS12 or use mock fallback
      const response = await login(formData.email, formData.password);
      
      if (response && response.user) {
        const userRoles = response.user.roles || [];
        const activeRole = response.user.role || userRoles[0] || 'learner';
        
        // For multi-role users, navigate to main dashboard where they can switch
        // For single-role users, navigate directly to their dashboard
        if (userRoles.length > 1) {
          navigate('/dashboard');
        } else {
          // Handle both 'org-admin' and 'org_admin' role variations
          const dashboardPath = (activeRole === 'org_admin' || activeRole === 'org-admin') 
            ? '/dashboard/organization' 
            : `/dashboard/${activeRole}`;
          navigate(dashboardPath);
        }
      } else {
        // Fallback navigation
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed' });
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fillDemoCredentials = (email) => {
    setFormData({
      email: email,
      password: 'password123'
    });
    setErrors({});
  };

  return (
    <div className={`login-page ${isDarkMode ? 'night-mode' : 'day-mode'}`} data-testid="login-page">
      {/* Background Elements */}
      <div className="login-bg-animation"></div>
      <div className="login-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="login-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="login-header">
        <div className="login-header-container">
          <Link to="/" className="login-logo">
            <span className="login-logo-icon">📊</span>
            <span className="login-logo-text">MS8 Learning Analytics</span>
          </Link>
          
          <button
            className="login-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Main Login Container */}
      <div className="login-container">
        <div className="login-card">
          {/* Login Header */}
          <div className="login-card-header">
            <div className="login-welcome-icon">🔐</div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your MS8 Learning Analytics account</p>
          </div>

          {/* Login Form */}
          <form className="login-form" data-testid="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="form-label-icon">📧</span>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                data-testid="email-input"
                value={formData.email}
                onChange={handleInputChange}
                aria-label="Email address"
                className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && (
                <span className="form-error-message" data-testid="email-error">
                  <span className="form-error-icon">⚠️</span>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="form-label-icon">🔒</span>
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  data-testid="password-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-label="Password"
                  className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  data-testid="password-toggle"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="form-error-message" data-testid="password-error">
                  <span className="form-error-icon">⚠️</span>
                  {errors.password}
                </span>
              )}
            </div>

            {errors.submit && (
              <div className="form-submit-error">
                <span className="form-error-icon">❌</span>
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              data-testid="login-button"
              className={`login-button ${isLoading ? 'login-button-loading' : ''}`}
              aria-label="Sign in"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span data-testid="loading-spinner" className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="login-button-icon">🚀</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Section */}
          <div className="demo-credentials">
            <div className="demo-credentials-header">
              <span className="demo-credentials-icon">🧪</span>
              <h3 className="demo-credentials-title">Demo Credentials</h3>
            </div>
            <p className="demo-credentials-password">
              <strong>Password (all users):</strong>
              <code className="demo-password-code">password123</code>
            </p>
            <div className="demo-credentials-grid">
              <button
                className="demo-credential-button"
                onClick={() => fillDemoCredentials('learner@test.com')}
                disabled={isLoading}
              >
                <span className="demo-credential-icon">👨‍🎓</span>
                <div className="demo-credential-info">
                  <div className="demo-credential-role">Learner</div>
                  <div className="demo-credential-email">learner@test.com</div>
                </div>
              </button>
              
              <button
                className="demo-credential-button"
                onClick={() => fillDemoCredentials('trainer@test.com')}
                disabled={isLoading}
              >
                <span className="demo-credential-icon">👨‍🏫</span>
                <div className="demo-credential-info">
                  <div className="demo-credential-role">Trainer</div>
                  <div className="demo-credential-email">trainer@test.com</div>
                </div>
              </button>
              
              <button
                className="demo-credential-button"
                onClick={() => fillDemoCredentials('admin@test.com')}
                disabled={isLoading}
              >
                <span className="demo-credential-icon">👔</span>
                <div className="demo-credential-info">
                  <div className="demo-credential-role">Org Admin</div>
                  <div className="demo-credential-email">admin@test.com</div>
                </div>
              </button>
              
              <button
                className="demo-credential-button"
                onClick={() => fillDemoCredentials('supertester@test.com')}
                disabled={isLoading}
              >
                <span className="demo-credential-icon">🔄</span>
                <div className="demo-credential-info">
                  <div className="demo-credential-role">Multi-Role</div>
                  <div className="demo-credential-email">supertester@test.com</div>
                </div>
              </button>
            </div>
          </div>

          {/* Login Footer */}
          <div className="login-footer">
            <Link 
              to="/forgot-password" 
              data-testid="forgot-password-link"
              className="forgot-password-link"
            >
              <span className="forgot-password-icon">🔑</span>
              Forgot your password?
            </Link>
            
            <div className="register-link-container">
              <span className="register-text">Don't have an account?</span>
              <Link 
                to="/register" 
                data-testid="register-link"
                className="register-link"
              >
                <span className="register-icon">✨</span>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};