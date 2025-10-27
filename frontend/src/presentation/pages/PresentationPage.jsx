import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../application/state/ThemeContext';
import logoDaySrc from '../assets/img/logo_day.jpg';
import logoNightSrc from '../assets/img/logo_night.jpg';

// Fallback emoji icon
const emojiIcon = '📊';

const PresentationPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 8;

  useEffect(() => {
    // Apply theme class to body (both for CSS and Tailwind)
    document.body.className = isDarkMode ? 'night-mode dark' : 'day-mode';
  }, [isDarkMode]);

  const nextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (slide) => {
    setCurrentSlide(slide);
  };

  const slides = [
    // Slide 1: Self-Presentation (30 sec)
    {
      id: 1,
      title: "MS8 Learning Analytics",
      subtitle: "By Lelya Salman",
      content: (
        <div className="presentation-welcome">
          <div className="welcome-content">
            <h2>Welcome to My Presentation</h2>
            <p>Building a comprehensive learning analytics platform with modern architecture and best practices</p>
            <div className="presentation-stats">
              <div className="stat-item">
                <div className="stat-number">19</div>
                <div className="stat-label">Analytics</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">User Roles</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">9</div>
                <div className="stat-label">Microservices</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">6</div>
                <div className="stat-label">Development Phases</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 2: Project Overview & Value (30 sec)
    {
      id: 2,
      title: "Project Overview & Value",
      subtitle: "Comprehensive Learning Analytics Platform",
      content: (
        <div className="project-overview">
          <div className="overview-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Problem Solved</h3>
              <p>Provides actionable insights for learners, trainers, and organizations to optimize learning outcomes and teaching effectiveness</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Performance</h3>
              <p>Ultra-fast load times (&lt;2.5s initial, &lt;100ms cached) with 3-layer caching strategy and daily batch processing</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h3>Security & Privacy</h3>
              <p>WCAG 2.2 AA compliant, K-anonymity for comparisons, RBAC enforcement, and GDPR compliance</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🏗️</div>
              <h3>Architecture</h3>
              <p>Full-Stack Onion Architecture with Onion layers, circuit breakers, mock fallbacks, and scalable microservices</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: User Journey Flow (1 min)
    {
      id: 3,
      title: "User Journey Flow",
      subtitle: "Seamless Multi-Role Experience",
      content: (
        <div className="journey-flow">
          <div className="journey-steps">
            <div className="journey-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Login/Authentication</h3>
                <p>User logs in with JWT authentication, receiving multi-role token if applicable</p>
              </div>
            </div>
            <div className="journey-arrow">→</div>
            <div className="journey-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Role Selection</h3>
                <p>Multi-role users select their active role (Learner/Trainer/Org Admin)</p>
              </div>
            </div>
            <div className="journey-arrow">→</div>
            <div className="journey-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Dashboard Navigation</h3>
                <p>Access role-specific analytics dashboard with 19 comprehensive analytics</p>
              </div>
            </div>
            <div className="journey-arrow">→</div>
            <div className="journey-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Analytics Review</h3>
                <p>View insights, predictions, recommendations, and generate reports (PDF/CSV/Excel)</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: High-Level Overview (2 min)
    {
      id: 4,
      title: "High-Level Overview",
      subtitle: "What Makes This Special",
      content: (
        <div className="special-features">
          <div className="features-grid">
            <div className="feature-card highlight">
              <div className="feature-icon">🏗️</div>
              <h3>Full-Stack Onion Architecture</h3>
              <ul>
                <li>Domain → Application → Infrastructure → Presentation layers</li>
                <li>Dependency inversion for testability</li>
                <li>Clean separation of concerns</li>
              </ul>
            </div>
            <div className="feature-card highlight">
              <div className="feature-icon">📊</div>
              <h3>19 Comprehensive Analytics</h3>
              <ul>
                <li>6 Learner analytics (velocity, skill gaps, engagement)</li>
                <li>4 Trainer analytics (course performance, health)</li>
                <li>4 Organizational analytics (strategic alignment)</li>
                <li>3 Predictive analytics (forecasting)</li>
                <li>2 Comparison analytics (peer comparison)</li>
              </ul>
            </div>
            <div className="feature-card highlight">
              <div className="feature-icon">🔄</div>
              <h3>Multi-Role System</h3>
              <ul>
                <li>Single user with multiple roles</li>
                <li>Seamless role switching</li>
                <li>Separate dashboards per role</li>
                <li>RBAC enforcement</li>
              </ul>
            </div>
            <div className="feature-card highlight">
              <div className="feature-icon">⚡</div>
              <h3>3-Layer Caching</h3>
              <ul>
                <li>Railway in-memory cache (instant)</li>
                <li>Database cache (aggregated)</li>
                <li>Daily batch processing at 02:00 UTC</li>
                <li>6-hour staleness detection</li>
              </ul>
            </div>
            <div className="feature-card highlight">
              <div className="feature-icon">🛡️</div>
              <h3>Circuit Breaker Pattern</h3>
              <ul>
                <li>Resilient microservice integration</li>
                <li>Mock data fallbacks</li>
                <li>Graceful degradation</li>
                <li>Automatic recovery</li>
              </ul>
            </div>
            <div className="feature-card highlight">
              <div className="feature-icon">🎨</div>
              <h3>Emerald Theme</h3>
              <ul>
                <li>WCAG 2.2 AA compliant</li>
                <li>Day/night mode toggle</li>
                <li>Accessibility-first design</li>
                <li>Professional & beautiful UI</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Init Prompt (1 min)
    {
      id: 5,
      title: "Init Prompt - Vibe Engineering",
      subtitle: "The Development Framework That Guided This Project",
      content: (
        <div className="init-prompt-section">
          <div className="prompt-highlight">
            <h3>🎯 6-Phase Development Framework</h3>
            <div className="prompt-features">
              <div className="prompt-item">
                <strong>Phase 1:</strong> Requirements & Planning with mediated debates (15 rounds)
              </div>
              <div className="prompt-item">
                <strong>Phase 2:</strong> Design & Architecture (Frontend, Backend, Integration, Database)
              </div>
              <div className="prompt-item">
                <strong>Phase 3:</strong> TDD Implementation (RED-GREEN-REFACTOR cycles)
              </div>
              <div className="prompt-item">
                <strong>Phase 4:</strong> E2E Testing & Comprehensive QA (85%+ coverage)
              </div>
              <div className="prompt-item">
                <strong>Phase 5:</strong> Deployment & Release (Vercel + Railway)
              </div>
              <div className="prompt-item">
                <strong>Phase 6:</strong> Cybersecurity (Security assessment, penetration testing)
              </div>
            </div>
            <div className="prompt-principles">
              <h4>Core Principles:</h4>
              <ul>
                <li>🔒 Security-First throughout all phases</li>
                <li>🔴 TDD with test-first development</li>
                <li>🤔 Multi-role mediated decisions (15 rounds until consensus)</li>
                <li>📋 Hard validation gates - no progression without 100% completion</li>
                <li>📄 Actual file generation for working code</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Project Folder Structure (less than 1 min)
    {
      id: 6,
      title: "Project Architecture",
      subtitle: "Full-Stack Onion Architecture with Vibe Engineering",
      content: (
        <div className="project-structure">
          <div className="structure-grid">
            <div className="structure-item">
              <h3>📂 Frontend Structure</h3>
              <div className="folder-tree">
                <div className="tree-item">frontend/src/</div>
                <div className="tree-item">├── application/</div>
                <div className="tree-item">│   ├── hooks/ (5 custom hooks)</div>
                <div className="tree-item">│   ├── services/ (6 service files)</div>
                <div className="tree-item">│   ├── state/ (Auth, Theme context)</div>
                <div className="tree-item">│   └── useCases/ (Use case logic)</div>
                <div className="tree-item">├── infrastructure/</div>
                <div className="tree-item">│   └── api/ (API client, caching)</div>
                <div className="tree-item">├── presentation/</div>
                <div className="tree-item">│   ├── assets/ (CSS, images)</div>
                <div className="tree-item">│   ├── components/ (19 analytics cards)</div>
                <div className="tree-item">│   └── pages/ (8 page components)</div>
                <div className="tree-item">└── 153 files total</div>
              </div>
            </div>
            <div className="structure-item">
              <h3>📂 Backend Structure</h3>
              <div className="folder-tree">
                <div className="tree-item">backend/</div>
                <div className="tree-item">├── routes/ (13 API route files)</div>
                <div className="tree-item">├── services/ (BFF, circuit breaker)</div>
                <div className="tree-item">├── middleware/ (auth, validation)</div>
                <div className="tree-item">├── src/</div>
                <div className="tree-item">│   ├── domain/entities/ (12 entities)</div>
                <div className="tree-item">│   ├── application/services/</div>
                <div className="tree-item">│   └── infrastructure/data/</div>
                <div className="tree-item">└── tests/ (13 test suites)</div>
              </div>
            </div>
            <div className="structure-item">
              <h3>📂 Deployment Structure</h3>
              <div className="folder-tree">
                <div className="tree-item">MS8-Learning-Analytics/</div>
                <div className="tree-item">├── frontend/ → Vercel</div>
                <div className="tree-item">├── backend/ → Railway</div>
                <div className="tree-item">├── database/ → Supabase</div>
                <div className="tree-item">├── docs/ (Architecture, guides)</div>
                <div className="tree-item">└── scripts/ (Deployment)</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: Frontend Server Presentation (10 min)
    {
      id: 7,
      title: "Frontend Server Demo",
      subtitle: "Live Application Walkthrough",
      content: (
        <div className="demo-section">
          <div className="demo-nav">
            <Link to="/login" className="demo-button primary">
              <span className="button-icon">🚀</span>
              <span>Start Exploring</span>
            </Link>
          </div>
          
          <div className="demo-features">
            <h3>Demo Credentials:</h3>
            <div className="credentials-grid">
              <div className="credential-card">
                <h4>👨‍🎓 Learner</h4>
                <p><strong>Email:</strong> test@example.com</p>
                <p><strong>Password:</strong> test-password-123</p>
                <p>6 Analytics Dashboard</p>
              </div>
              <div className="credential-card">
                <h4>👨‍🏫 Trainer</h4>
                <p><strong>Email:</strong> trainer@example.com</p>
                <p><strong>Password:</strong> test-password-123</p>
                <p>4 Analytics Dashboard</p>
              </div>
              <div className="credential-card">
                <h4>👔 Organization Admin</h4>
                <p><strong>Email:</strong> admin@example.com</p>
                <p><strong>Password:</strong> test-password-123</p>
                <p>4 Analytics Dashboard</p>
              </div>
              <div className="credential-card highlight">
                <h4>🔄 Multi-Role User</h4>
                <p><strong>Email:</strong> superadmin@example.com</p>
                <p><strong>Password:</strong> test-password-123</p>
                <p>All Dashboards (Role Switching)</p>
              </div>
            </div>
          </div>

          <div className="demo-highlights">
            <h3>Key Features to Demonstrate:</h3>
            <ul>
              <li>✅ Multi-role authentication and role switching</li>
              <li>✅ 19 comprehensive analytics cards</li>
              <li>✅ Real-time data visualization</li>
              <li>✅ Theme toggle (Day/Night mode)</li>
              <li>✅ Responsive design</li>
              <li>✅ Report generation (PDF/CSV/Excel)</li>
              <li>✅ Gamification system (badges, points, streaks)</li>
              <li>✅ Accessibility features</li>
            </ul>
          </div>
        </div>
      )
    },

    // Slide 8: Thank You
    {
      id: 8,
      title: "Thank You!",
      subtitle: "Questions & Discussion",
      content: (
        <div className="thank-you-section">
          <div className="thank-you-content">
            <h2>Thank You for Your Time!</h2>
            <p className="thank-you-message">MS8 Learning Analytics - A Comprehensive Learning Analytics Platform</p>
            <div className="thank-you-highlights">
              <div className="highlight-box">
                <h3>🎯 What We Built</h3>
                <p>19 analytics across 3 roles with Full-Stack Onion Architecture</p>
              </div>
              <div className="highlight-box">
                <h3>⚡ How Fast</h3>
                <p>&lt;2.5s load time with 3-layer caching strategy</p>
              </div>
              <div className="highlight-box">
                <h3>🔒 How Secure</h3>
                <p>WCAG 2.2 AA compliant with K-anonymity and RBAC</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={`presentation-mode ${isDarkMode ? 'night-mode' : 'day-mode'}`}>
      {/* Background Gradient */}
      <div className="bg-animation"></div>

      {/* Header */}
      <header className="presentation-header">
        <div className="presentation-header-content">
          <Link to="/" className="logo">
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
          </Link>

          <div className="slide-indicator">
            <span>Slide {currentSlide} of {totalSlides}</span>
          </div>

          <div className="presentation-controls">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? '🌙' : '☀️'}
            </button>
            <Link to="/" className="exit-presentation">
              ✕ Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Slide Content */}
      <main className="presentation-main">
        <div className="presentation-slide">
          <div className="slide-header">
            <h1 className="slide-title">{slides[currentSlide - 1].title}</h1>
            <p className="slide-subtitle">{slides[currentSlide - 1].subtitle}</p>
          </div>
          <div className="slide-body">
            {slides[currentSlide - 1].content}
          </div>
        </div>
      </main>

      {/* Navigation */}
      <div className="presentation-navigation">
        <button 
          className="nav-button prev" 
          onClick={prevSlide}
          disabled={currentSlide === 1}
        >
          ← Previous
        </button>
        
        <div className="slide-dots">
          {slides.map((slide) => (
            <button
              key={slide.id}
              className={`slide-dot ${currentSlide === slide.id ? 'active' : ''}`}
              onClick={() => goToSlide(slide.id)}
              aria-label={`Go to slide ${slide.id}`}
            />
          ))}
        </div>

        <button 
          className="nav-button next" 
          onClick={nextSlide}
          disabled={currentSlide === totalSlides}
        >
          Next →
        </button>
      </div>

      {/* Keyboard Controls */}
      <div className="keyboard-hints">
        <span>← → Arrow keys to navigate | Esc to exit</span>
      </div>
    </div>
  );
};

export default PresentationPage;

