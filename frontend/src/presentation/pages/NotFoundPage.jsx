import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../application/state/ThemeContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    // Apply theme class to body
    document.body.className = isDarkMode ? 'night-mode' : 'day-mode';
  }, [isDarkMode]);

  useEffect(() => {
    document.title = '404 - Page Not Found | MS8 Learning Analytics';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Page not found. Return to MS8 Learning Analytics homepage.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Page not found. Return to MS8 Learning Analytics homepage.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleContactSupport = () => {
    console.log('Opening support contact');
    // In a real implementation, this would open a support modal or redirect to support page
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log(`Searching for: ${searchQuery}`);
      // In a real implementation, this would perform the search
      if (searchQuery === 'invalid search') {
        setSearchError('No results found');
        setTimeout(() => setSearchError(''), 3000);
      }
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className={`not-found-page ${isDarkMode ? 'night-mode' : 'day-mode'}`}>
      <main role="main">
        <Card className="error-container">
          <div className="error-content">
            <h1 className="error-code">404</h1>
            <h2 className="error-title">Page Not Found</h2>
            <p className="error-message">
              Sorry, the page you are looking for does not exist.
            </p>
            
            <div className="suggestions">
              <h3>What you can do:</h3>
              <ul>
                <li>Check the URL for typos</li>
                <li>Go back to the previous page</li>
                <li>Return to the homepage</li>
              </ul>
            </div>

            <div className="search-section">
              <h3>Search for what you need:</h3>
              <form onSubmit={handleSearch} className="search-form">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  aria-label="Search for content"
                />
                <Button type="submit" className="search-button">
                  🔍 Search
                </Button>
              </form>
              {searchError && (
                <p className="search-error">{searchError}</p>
              )}
            </div>

            <div className="navigation-actions">
              <Button onClick={handleGoHome} className="primary">
                🏠 Go Home
              </Button>
              <Button onClick={handleGoBack} className="secondary">
                ⬅️ Go Back
              </Button>
              <Button onClick={handleContactSupport} className="tertiary">
                Contact Support
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default NotFoundPage;
