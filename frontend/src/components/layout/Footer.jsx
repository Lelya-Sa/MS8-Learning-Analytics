import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">MS8 Learning Analytics</h3>
            <p className="footer-description">
              Empowering learners with data-driven insights and personalized learning experiences.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/analytics">Dashboard</Link></li>
              <li><Link to="/reports">Reports</Link></li>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/gdpr">GDPR Compliance</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Connect</h4>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <span className="social-icon">💼</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <span className="social-icon">💻</span>
              </a>
              <a href="mailto:support@ms8analytics.com" aria-label="Email">
                <span className="social-icon">📧</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} MS8 Learning Analytics. All rights reserved.
          </p>
          <p className="footer-note">
            Built with ❤️ for learners worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

