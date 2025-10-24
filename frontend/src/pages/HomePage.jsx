import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/landing.css'

const HomePage = () => {
  const [theme, setTheme] = useState('day-mode')

  useEffect(() => {
    // Apply theme to body
    document.body.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'day-mode' ? 'night-mode' : 'day-mode')
  }

  return (
    <div className={theme}>
      {/* Background Animation */}
      <div className="bg-animation"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <Link to="/" className="logo" aria-label="MS8 Learning Analytics Home">
            <span className="logo-icon">📊</span>
            <span className="logo-text">MS8 Learning Analytics</span>
          </Link>

          <nav>
            <ul className="nav-links">
              <li><a href="#features"><i>✨</i> Features</a></li>
              <li><a href="#microservices"><i>⚡</i> Microservices</a></li>
              <li><a href="#roles"><i>👥</i> User Roles</a></li>
            </ul>
          </nav>

          <div className="header-controls">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'day-mode' ? 'Switch to night mode' : 'Switch to day mode'}
            >
              {theme === 'day-mode' ? '🌙' : '☀️'}
            </button>

            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                <span>🔐</span>
                <span>Login</span>
              </Link>
              <Link to="/analytics" className="btn btn-primary">
                <span>📊</span>
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Transform Learning with Data-Driven Insights</h1>
            <p className="subtitle">
              Comprehensive analytics, real-time insights, and intelligent learning path recommendations powered by advanced microservices architecture
            </p>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">9</span>
                <span className="stat-label">Microservices</span>
              </div>
              <div className="stat">
                <span className="stat-number">19</span>
                <span className="stat-label">Analytics Categories</span>
              </div>
              <div className="stat">
                <span className="stat-number">Real-time</span>
                <span className="stat-label">Data Processing</span>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
              <a href="#features" className="btn btn-secondary">
                Learn More
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-header">
                <div className="card-icon">📈</div>
                <div className="card-title">Learning Progress</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p className="progress-text">75% Complete - Keep going!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Microservices Section */}
      <section id="microservices" className="microservices-section">
        <div className="microservices-container">
          <h2 className="section-title">Integrated Microservices</h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
            Distributed architecture with 9 specialized microservices working together
          </p>

          <div className="microservices-grid">
            <div className="microservice-card">
              <div className="service-icon">📁</div>
              <h3>Directory</h3>
              <p>User and organization management</p>
            </div>

            <div className="microservice-card">
              <div className="service-icon">📚</div>
              <h3>Course Builder</h3>
              <p>Create and manage learning content</p>
            </div>

            <div className="microservice-card">
              <div className="service-icon">🎨</div>
              <h3>Content Studio</h3>
              <p>Rich media content creation</p>
            </div>

            <div className="microservice-card">
              <div className="service-icon">✅</div>
              <h3>Assessment</h3>
              <p>Quizzes and evaluations</p>
            </div>

            <div className="microservice-card">
              <div className="service-icon">🎯</div>
              <h3>Skills Engine</h3>
              <p>Skill tracking and recommendations</p>
            </div>

            <div className="microservice-card">
              <div className="service-icon">🤖</div>
              <h3>Learner AI</h3>
              <p>Personalized learning paths</p>
            </div>

            <div className="microservice-card">
              <div className="service-icon">💻</div>
              <h3>DevLab</h3>
              <p>Hands-on coding environment</p>
            </div>

            <div className="microservice-card">
              <div className="service-icon">💬</div>
              <h3>RAG Assistant</h3>
              <p>AI-powered learning assistant</p>
            </div>

            <div className="microservice-card">
              <div className="service-icon">🔐</div>
              <h3>Auth (MS12)</h3>
              <p>Secure authentication</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="roles" className="user-types">
        <div className="user-types-container">
          <h2 className="section-title">Built for Every Role</h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
            Tailored experiences for learners, trainers, and organizations
          </p>

          <div className="user-cards">
            <div className="user-card">
              <div className="user-icon">👨‍🎓</div>
              <h3 className="user-title">Learner</h3>
              <p className="user-description">
                Track your progress, master new skills, and achieve your learning goals
              </p>
              <ul className="user-features">
                <li>Personalized learning paths</li>
                <li>Real-time progress tracking</li>
                <li>Skill gap analysis</li>
                <li>Achievement badges</li>
              </ul>
              <Link to="/login" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
                Start Learning
              </Link>
            </div>

            <div className="user-card">
              <div className="user-icon">👨‍🏫</div>
              <h3 className="user-title">Trainer</h3>
              <p className="user-description">
                Monitor student progress, optimize courses, and enhance teaching effectiveness
              </p>
              <ul className="user-features">
                <li>Course performance analytics</li>
                <li>Student health monitoring</li>
                <li>Teaching effectiveness metrics</li>
                <li>At-risk student identification</li>
              </ul>
              <Link to="/login" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
                Start Teaching
              </Link>
            </div>

            <div className="user-card">
              <div className="user-icon">👔</div>
              <h3 className="user-title">Organization</h3>
              <p className="user-description">
                Gain insights into organizational learning, optimize resources, and drive ROI
              </p>
              <ul className="user-features">
                <li>Organization-wide analytics</li>
                <li>Department performance</li>
                <li>Resource optimization</li>
                <li>Strategic alignment tracking</li>
              </ul>
              <Link to="/login" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">Try It Now</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
            Use these demo credentials to explore the platform
          </p>
          
          <div style={{ 
            background: 'var(--gradient-card)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '12px', 
            padding: 'var(--spacing-xl)',
            textAlign: 'left'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', fontSize: '1.2rem' }}>
              Demo Credentials
            </h4>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>Password (all users):</strong> test-password-123</p>
              <br />
              <p><strong style={{ color: 'var(--text-primary)' }}>Learner:</strong> test@example.com</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Trainer:</strong> trainer@example.com</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Organization Admin:</strong> admin@example.com</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Multi-Role User:</strong> multi@example.com</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Super Admin:</strong> superadmin@example.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

