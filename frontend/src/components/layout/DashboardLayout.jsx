import React from 'react'
import Header from './Header'
import Footer from './Footer'
import './DashboardLayout.css'

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="main-content" role="main">
        <div className="content-container">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DashboardLayout

