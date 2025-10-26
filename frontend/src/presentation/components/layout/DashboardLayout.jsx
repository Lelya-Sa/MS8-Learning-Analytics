import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { useTheme } from '../../../application/state/ThemeContext'

const DashboardLayout = ({ children }) => {
  // Get theme from context - it handles user preferences and localStorage
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'night-mode bg-gray-900' : 'day-mode bg-gray-50'}`}>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-1 pt-20 md:pt-[70px] sm:pt-[60px] min-h-[calc(100vh-80px)] pb-[70px] sm:pb-[70px]" role="main">
        <div className="max-w-[1400px] mx-auto px-8 py-12 md:px-6 md:py-8 sm:px-4 sm:py-4">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DashboardLayout

