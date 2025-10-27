import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../application/state/ThemeContext'
import logoDaySrc from '../assets/img/logo_day.jpg'
import logoNightSrc from '../assets/img/logo_night.jpg'

// Fallback emoji icon
const emojiIcon = '📊'

const HomePage = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  useEffect(() => {
    // Apply theme class to body
    document.body.className = isDarkMode ? 'night-mode' : 'day-mode'
  }, [isDarkMode])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'night-mode' : 'day-mode'}`}>
      {/* Background Gradient */}
      <div className="bg-animation"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
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
      <header className="header">
        <div className="nav-container">
          <div className="header-left">
            <Link 
              to="/" 
              className="logo"
              aria-label="MS8 Learning Analytics Home"
            >
              <img 
                src={isDarkMode ? logoNightSrc : logoDaySrc}
                alt="MS8 Learning Analytics Logo"
                className={`logo-icon ${isDarkMode ? 'logo-night' : 'logo-day'}`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const backupIcon = e.target.nextElementSibling;
                  if (backupIcon && backupIcon.classList.contains('emoji-icon')) {
                    backupIcon.style.display = 'flex';
                  }
                }}
              />
              <div className={`logo-icon emoji-icon backup-icon ${isDarkMode ? 'logo-night' : 'logo-day'}`} style={{display: 'none'}}>
                {emojiIcon}
              </div>
              <h1>MS8 Learning Analytics</h1>
            </Link>
          </div>

          <div className="header-center">
            <nav>
              <ul className="nav-links">
                <li>
                  <a href="#features" className="nav-link">
                    <span className="nav-icon">✨</span>
                    <span className="nav-label">Features</span>
                  </a>
                </li>
                <li>
                  <a href="#analytics" className="nav-link">
                    <span className="nav-icon">📈</span>
                    <span className="nav-label">Analytics</span>
                  </a>
                </li>
                <li>
                  <a href="#roles" className="nav-link">
                    <span className="nav-icon">👥</span>
                    <span className="nav-label">User Roles</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-right">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>

            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                <span className="login-icon">🔐</span>
                <span>Login</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>MS8 Learning Analytics Microservice</h1>
            <p className="subtitle">
              Comprehensive learning analytics platform with 19 analytics across 3 user roles, advanced performance optimization, and beautiful emerald theme
            </p>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">19</span>
                <span className="stat-label">Analytics Categories</span>
              </div>
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">User Roles</span>
              </div>
              <div className="stat">
                <span className="stat-number">9</span>
                <span className="stat-label">Microservices</span>
              </div>
              <div className="stat">
                <span className="stat-number">&lt;2.5s</span>
                <span className="stat-label">Load Time</span>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
              <a href="#features" className="btn btn-secondary">
                Learn More
              </a>
              <Link to="/presentation" className="btn btn-secondary" style={{borderColor: '#10b981', color: '#10b981'}}>
                📊 View Presentation
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-header">
                <div className="card-icon">📈</div>
                <div className="card-title">Learning Velocity</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="progress-text">85% Complete - Accelerating!</div>
            </div>
            
            <div className="floating-card" style={{animationDelay: '1s'}}>
              <div className="card-header">
                <div className="card-icon">🎯</div>
                <div className="card-title">Skill Gap Analysis</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">JavaScript</span>
                  <span className="text-xs text-secondary">90%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '90%'}}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">React</span>
                  <span className="text-xs text-secondary">75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Showcase Section */}
      <section id="analytics" className="microservices-section">
        <div className="microservices-container">
          <h2 className="section-title">19 Comprehensive Analytics</h2>
          <p className="text-center text-xl max-w-3xl mx-auto text-secondary mb-16">
            Advanced analytics across learning velocity, skill gaps, engagement, and predictive insights
          </p>

          <div className="microservices-grid">
            <div className="microservice-card">
              <div className="service-icon">👨‍🎓</div>
              <h3>Learner Analytics (6)</h3>
              <ul className="text-left space-y-2">
                <li>📈 Learning Velocity & Momentum</li>
                <li>🎯 Skill Gap Matrix</li>
                <li>💪 Engagement Score</li>
                <li>🏆 Mastery Progress</li>
                <li>📊 Performance & Assessment</li>
                <li>📚 Content Effectiveness</li>
              </ul>
            </div>

            <div className="microservice-card">
              <div className="service-icon">👨‍🏫</div>
              <h3>Trainer Analytics (4)</h3>
              <ul className="text-left space-y-2">
                <li>📈 Course Performance Dashboard</li>
                <li>🏥 Course Health Dashboard</li>
                <li>📊 Student Performance Distribution</li>
                <li>🎓 Teaching Effectiveness</li>
              </ul>
            </div>

            <div className="microservice-card">
              <div className="service-icon">👔</div>
              <h3>Organizational Analytics (4)</h3>
              <ul className="text-left space-y-2">
                <li>🚀 Organizational Learning Velocity</li>
                <li>🎯 Strategic Alignment Tracking</li>
                <li>👥 Department Analytics</li>
                <li>💡 Learning Culture Metrics</li>
              </ul>
            </div>

            <div className="microservice-card">
              <div className="service-icon">🔮</div>
              <h3>Predictive Analytics (3)</h3>
              <ul className="text-left space-y-2">
                <li>⚠️ Drop-Off Risk Prediction</li>
                <li>🔮 Learning Outcome Forecasting</li>
                <li>💡 Personalized Recommendations</li>
              </ul>
            </div>

            <div className="microservice-card">
              <div className="service-icon">📊</div>
              <h3>Comparison Analytics (2)</h3>
              <ul className="text-left space-y-2">
                <li>📈 Platform Skill Demand Analytics</li>
                <li>👥 Peer Comparison (Privacy-Preserved)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="user-types">
        <div className="user-types-container">
          <h2 className="section-title">Advanced Features</h2>
          <p className="text-center text-xl max-w-3xl mx-auto text-secondary mb-16">
            Comprehensive features including gamification, reports, AI assistance, and multi-role support
          </p>

          <div className="user-cards">
            <div className="user-card">
              <div className="user-icon">🎮</div>
              <h3 className="user-title">Gamification System</h3>
              <p className="user-description">Badges, points, streaks, and leaderboards to motivate learning</p>
            </div>

            <div className="user-card">
              <div className="user-icon">📊</div>
              <h3 className="user-title">Report Export</h3>
              <p className="user-description">Generate reports in PDF, CSV, Excel, and JSON formats</p>
            </div>

            <div className="user-card">
              <div className="user-icon">💬</div>
              <h3 className="user-title">RAG Chatbot</h3>
              <p className="user-description">AI-powered assistant for natural language analytics queries</p>
            </div>

            <div className="user-card">
              <div className="user-icon">🔄</div>
              <h3 className="user-title">Multi-Role System</h3>
              <p className="user-description">Seamless role switching with separate analytics per role</p>
            </div>

            <div className="user-card">
              <div className="user-icon">🔒</div>
              <h3 className="user-title">Privacy-First</h3>
              <p className="user-description">K-anonymity for comparisons and GDPR compliance</p>
            </div>

            <div className="user-card">
              <div className="user-icon">♿</div>
              <h3 className="user-title">Accessibility</h3>
              <p className="user-description">WCAG 2.2 AA compliant with keyboard navigation</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="roles" className="microservices-section">
        <div className="microservices-container">
          <h2 className="section-title">Multi-Role Analytics Platform</h2>
          <p className="text-center text-xl max-w-3xl mx-auto text-secondary mb-16">
            Tailored analytics experiences for learners, trainers, and organization administrators
          </p>

          <div className="user-cards">
            <div className="user-card">
              <div className="user-icon">👨‍🎓</div>
              <h3 className="user-title">Learner</h3>
              <p className="user-description">
                Track personal learning progress with 6 comprehensive analytics including velocity, skill gaps, and mastery
              </p>
              <ul className="user-features">
                <li>Learning Velocity & Momentum tracking</li>
                <li>Skill Gap Matrix analysis</li>
                <li>Engagement Score monitoring</li>
                <li>Mastery Progress visualization</li>
                <li>Performance & Assessment analytics</li>
                <li>Content Effectiveness insights</li>
              </ul>
              <Link to="/login" className="btn btn-primary">
                Start Learning
              </Link>
            </div>

            <div className="user-card">
              <div className="user-icon">👨‍🏫</div>
              <h3 className="user-title">Trainer</h3>
              <p className="user-description">
                Monitor course performance and student progress with 4 specialized trainer analytics
              </p>
              <ul className="user-features">
                <li>Course Performance Dashboard</li>
                <li>Course Health monitoring</li>
                <li>Student Performance Distribution</li>
                <li>Teaching Effectiveness metrics</li>
                <li>At-risk student identification</li>
                <li>Student progress tracking</li>
              </ul>
              <Link to="/login" className="btn btn-primary">
                Start Teaching
              </Link>
            </div>

            <div className="user-card">
              <div className="user-icon">👔</div>
              <h3 className="user-title">Organization Admin</h3>
              <p className="user-description">
                Gain organizational insights with 4 comprehensive analytics for strategic decision-making
              </p>
              <ul className="user-features">
                <li>Organizational Learning Velocity</li>
                <li>Strategic Alignment Tracking</li>
                <li>Department Analytics</li>
                <li>Learning Culture Metrics</li>
                <li>Resource optimization insights</li>
                <li>ROI and performance tracking</li>
              </ul>
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Highlights Section */}
      <section className="user-types">
        <div className="user-types-container">
          <h2 className="section-title">Performance & Reliability</h2>
          <p className="text-center text-xl max-w-3xl mx-auto text-secondary mb-16">
            Optimized for speed, reliability, and scalability with advanced caching and batch processing
          </p>

          <div className="user-cards">
            <div className="user-card">
              <div className="user-icon">⚡</div>
              <h3 className="user-title">&lt;2.5s Load Time</h3>
              <p className="user-description">Initial dashboard load with &lt;100ms cached responses</p>
            </div>

            <div className="user-card">
              <div className="user-icon">🔄</div>
              <h3 className="user-title">3-Layer Caching</h3>
              <p className="user-description">Railway in-memory → Database → Aggregated with 6h staleness check</p>
            </div>

            <div className="user-card">
              <div className="user-icon">📊</div>
              <h3 className="user-title">Daily Batch Processing</h3>
              <p className="user-description">Automated analytics calculation at 02:00 UTC for all users</p>
            </div>

            <div className="user-card">
              <div className="user-icon">🛡️</div>
              <h3 className="user-title">Circuit Breaker</h3>
              <p className="user-description">Resilient microservice integration with mock data fallbacks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="microservices-section">
        <div className="microservices-container">
          <div className="text-center">
            <h2 className="section-title">Try the Multi-Role Platform</h2>
            <p className="text-xl mb-12 text-secondary">
              Experience the full analytics platform with these demo credentials. Each role provides different analytics and features.
            </p>
            
            <div className="microservice-card text-left">
              <h4 className="text-xl font-semibold mb-6 text-primary">Demo Credentials</h4>
              <div className="space-y-4 text-secondary">
                <p><strong className="text-primary">Password (all users):</strong> test-password-123</p>
                <div className="space-y-2">
                  <p><strong className="text-primary">👨‍🎓 Learner:</strong> test@example.com (6 analytics)</p>
                  <p><strong className="text-primary">👨‍🏫 Trainer:</strong> trainer@example.com (4 analytics)</p>
                  <p><strong className="text-primary">👔 Org Admin:</strong> admin@example.com (4 analytics)</p>
                  <p><strong className="text-primary">🔄 Multi-Role:</strong> superadmin@example.com (all roles)</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 rounded-lg border" style={{ 
                backgroundColor: 'var(--primary-blue)', 
                opacity: 0.1,
                borderColor: 'var(--primary-blue)',
                borderOpacity: 0.2
              }}>
                <p className="text-sm text-primary-cyan">
                  💡 <strong>Tip:</strong> Try the multi-role user to experience seamless role switching between Learner, Trainer, and Organization Admin dashboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage