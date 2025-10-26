import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component for the application
 * Contains copyright information and footer links
 * 
 * @returns {JSX.Element} Footer component
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms of Service' },
    { path: '/support', label: 'Support' },
    { path: '/about', label: 'About' },
  ];

  return (
    <footer 
      className="footer" 
      data-testid="footer"
      role="contentinfo"
    >
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">MS8 Learning Analytics</h3>
            <p className="footer-description">
              Empowering learning through data-driven insights and comprehensive analytics.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li><Link to="/help" className="footer-link">Help Center</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/docs" className="footer-link">Documentation</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Connect</h3>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <span className="social-icon">💼</span>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <span className="social-icon">🐙</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} MS8 Learning Analytics. All rights reserved.
          </p>
          <p className="footer-note">
            Built with ❤️ for better learning experiences
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;