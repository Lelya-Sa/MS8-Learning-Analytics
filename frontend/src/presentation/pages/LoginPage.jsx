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
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const [clickedDemoCredential, setClickedDemoCredential] = useState(null);

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

  const validateForm = (email, password) => {
    const emailToCheck = email !== undefined ? email : formData.email;
    const passwordToCheck = password !== undefined ? password : formData.password;
    const newErrors = {};

    if (!emailToCheck) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(emailToCheck)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!passwordToCheck) {
      newErrors.password = 'Password is required';
    } else if (passwordToCheck.length < 8) {
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

  const fillDemoCredentials = async (email) => {
    setClickedDemoCredential(email);
    setFormData({
      email: email,
      password: 'password123'
    });
    setErrors({});
    
    // Small delay to show the fields being filled
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate with the credentials we're about to use
    if (validateForm(email, 'password123')) {
      setIsLoading(true);
      setErrors({});

      try {
        const response = await login(email, 'password123');
        
        if (response && response.user) {
          const userRoles = response.user.roles || [];
          const activeRole = response.user.role || userRoles[0] || 'learner';
          
          if (userRoles.length > 1) {
            navigate('/dashboard');
          } else {
            const dashboardPath = (activeRole === 'org_admin' || activeRole === 'org-admin') 
              ? '/dashboard/organization' 
              : `/dashboard/${activeRole}`;
            navigate(dashboardPath);
          }
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        setErrors({ submit: error.message || 'Login failed' });
        setIsLoading(false);
        setClickedDemoCredential(null);
      }
    }
  };

  return (
    <div className={`login-page ${isDarkMode ? 'night-mode' : 'day-mode'}`} data-testid="login-page">
      {/* Split Layout Container */}
      <div className="login-split-container">
        {/* Left Side - Branding */}
        <div className="login-branding-section">
          <div className="login-branding-content">
            <Link to="/" className="login-logo-branding">
              <div className="login-logo-circle">
                <svg viewBox="0 0 24 24" className="login-logo-svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.9"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </Link>
            <h1 className="login-branding-title">MS8 Learning Analytics</h1>
            <p className="login-branding-subtitle">
              Transform your learning data into actionable insights
            </p>
            <div className="login-features">
              <div className="login-feature">
                <div className="login-feature-icon">✓</div>
                <span>Real-time analytics</span>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon">✓</div>
                <span>Comprehensive reporting</span>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon">✓</div>
                <span>Multi-role dashboards</span>
              </div>
            </div>
          </div>
          <button
            className="login-theme-toggle-bottom"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <header className="login-mobile-header">
            <Link to="/" className="login-mobile-logo">
              <span className="login-logo-circle">
                <svg viewBox="0 0 24 24" className="login-logo-svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.9"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </span>
              <span>MS8 Learning</span>
            </Link>
            <button
              className="login-mobile-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </header>

          <div className="login-card">
            {/* Login Header */}
            <div className="login-card-header">
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to your account to continue</p>
            </div>

            {/* Login Form */}
            <form className="login-form" data-testid="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
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
                  placeholder="name@company.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <span className="form-error-message" data-testid="email-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    data-testid="forgot-password-link"
                    className="forgot-password-link-inline"
                  >
                    Forgot?
                  </Link>
                </div>
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
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <span className="form-error-message" data-testid="password-error">
                    {errors.password}
                  </span>
                )}
              </div>

              {errors.submit && (
                <div className="form-submit-error">
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
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials - Collapsible */}
            <div className="demo-credentials-container">
              <button
                className="demo-credentials-toggle"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                aria-expanded={showDemoCredentials}
              >
                <span>Demo Credentials</span>
                <span className={`demo-credentials-arrow ${showDemoCredentials ? 'expanded' : ''}`}>
                  ↓
                </span>
              </button>
              
              {showDemoCredentials && (
                <div className="demo-credentials-content">
                  <p className="demo-credentials-hint">
                    Click any credential below to auto-sign in. Password for all users: <code className="demo-password-code">password123</code>
                  </p>
                  <div className="demo-credentials-list">
                    <button
                      className={`demo-credential-item ${clickedDemoCredential === 'learner@test.com' ? 'loading' : ''}`}
                      onClick={() => fillDemoCredentials('learner@test.com')}
                      disabled={isLoading}
                    >
                      <div className="demo-credential-avatar">L</div>
                      <div className="demo-credential-details">
                        <div className="demo-credential-name">Learner</div>
                        <div className="demo-credential-email">learner@test.com</div>
                      </div>
                    </button>
                    
                    <button
                      className={`demo-credential-item ${clickedDemoCredential === 'trainer@test.com' ? 'loading' : ''}`}
                      onClick={() => fillDemoCredentials('trainer@test.com')}
                      disabled={isLoading}
                    >
                      <div className="demo-credential-avatar">T</div>
                      <div className="demo-credential-details">
                        <div className="demo-credential-name">Trainer</div>
                        <div className="demo-credential-email">trainer@test.com</div>
                      </div>
                    </button>
                    
                    <button
                      className={`demo-credential-item ${clickedDemoCredential === 'admin@test.com' ? 'loading' : ''}`}
                      onClick={() => fillDemoCredentials('admin@test.com')}
                      disabled={isLoading}
                    >
                      <div className="demo-credential-avatar">A</div>
                      <div className="demo-credential-details">
                        <div className="demo-credential-name">Org Admin</div>
                        <div className="demo-credential-email">admin@test.com</div>
                      </div>
                    </button>
                    
                    <button
                      className={`demo-credential-item ${clickedDemoCredential === 'supertester@test.com' ? 'loading' : ''}`}
                      onClick={() => fillDemoCredentials('supertester@test.com')}
                      disabled={isLoading}
                    >
                      <div className="demo-credential-avatar">M</div>
                      <div className="demo-credential-details">
                        <div className="demo-credential-name">Multi-Role</div>
                        <div className="demo-credential-email">supertester@test.com</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login Footer */}
            <div className="login-footer">
              <span className="register-text">Don't have an account?</span>
              <Link 
                to="/register" 
                data-testid="register-link"
                className="register-link"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};