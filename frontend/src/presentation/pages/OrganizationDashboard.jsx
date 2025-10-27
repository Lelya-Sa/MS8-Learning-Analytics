import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { useAuth } from '../../application/state/AuthContext';
import { apiClient } from '../../infrastructure/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { OrgLearningVelocityCard } from '../components/analytics/organization/OrgLearningVelocityCard';
import { StrategicAlignmentCard } from '../components/analytics/organization/StrategicAlignmentCard';
import { LearningCultureCard } from '../components/analytics/organization/LearningCultureCard';

/**
 * Organization Admin Dashboard Page
 * 
 * Displays 4 organization-specific analytics cards as per the user journey documentation:
 * - AS-003 #11: Org Learning Velocity
 * - AS-003 #12: Strategic Alignment
 * - AS-003 #13: Department Analytics (placeholder)
 * - AS-003 #14: Learning Culture
 * 
 * Also includes at-risk departments banner for high risk warnings.
 * 
 * @component OrganizationDashboard
 * @description Main dashboard for organization administrators with org-wide analytics
 */
const OrganizationDashboard = () => {
  const { user } = useAuth();
  console.log('👤 Organization Dashboard - User:', user);
  const orgId = user?.organization_id || user?.organizationId || user?.id;
  console.log('🏢 Organization Dashboard - Org ID:', orgId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const wrapperRef = useRef(null);
  const cardRefs = useRef([]);

  // Fetch all organization analytics data
  const { data: analyticsData, error, isLoading } = useSWR(
    orgId ? `org-analytics-${orgId}` : null,
    async () => {
      const response = await apiClient.get(`/org-admin/analytics/overview/${orgId}`);
      console.log('📊 Organization Analytics Overview Response:', response);
      // The API returns { data: {...}, cached: ..., ... }, so we extract the data property
      const data = response.data || response;
      console.log('📦 Extracted Analytics Data:', data);
      return data;
    }
  );

  const totalCards = 4; // Organization has 4 cards

  // Update wrapper height to match active card height
  useEffect(() => {
    const updateHeight = () => {
      if (wrapperRef.current && cardRefs.current[currentIndex]) {
        const activeCard = cardRefs.current[currentIndex];
        const cardHeight = activeCard.offsetHeight;
        wrapperRef.current.style.height = `${cardHeight}px`;
      }
    };

    // Update height when index changes
    updateHeight();
    
    // Update height when window resizes
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalCards - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalCards - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!orgId) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p>Please wait while we load your dashboard.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-cyan-700 dark:text-cyan-400">
            🏢 Organization Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor organization-wide learning analytics and strategic alignment
          </p>
        </div>

        {/* At-Risk Departments Alert */}
        <div className="p-4 rounded-lg border-l-4 mb-6 bg-red-50 dark:bg-red-900 border-red-400 dark:border-red-600">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-100">
                At-Risk Departments Alert
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Engineering and Marketing departments showing high learning velocity decline. 
                Click to view detailed department analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Cards Carousel */}
        <div className="carousel-container relative">
          {/* Left Navigation Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous cards"
          >
            ←
          </button>

          {/* Cards Container */}
          <div ref={wrapperRef} className="cards-carousel-wrapper overflow-hidden">
            <div 
              ref={carouselRef}
              className="cards-carousel flex"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {/* AS-003 #11: Org Learning Velocity */}
              <div ref={(el) => cardRefs.current[0] = el} style={{ width: '100%', flexShrink: 0 }}>
                <OrgLearningVelocityCard 
                  organizationId={orgId}
                  data={analyticsData?.learningVelocity}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
              
              {/* AS-003 #12: Strategic Alignment */}
              <div ref={(el) => cardRefs.current[1] = el} style={{ width: '100%', flexShrink: 0 }}>
                <StrategicAlignmentCard 
                  organizationId={orgId}
                  data={analyticsData?.strategicAlignment}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
              
              {/* AS-003 #13: Department Analytics - Placeholder */}
              <div ref={(el) => cardRefs.current[2] = el} style={{ width: '100%', flexShrink: 0 }}>
                <div className="p-6 rounded-lg border-2 border-dashed bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🏢</div>
                    <h3 className="text-xl font-semibold mb-2 text-cyan-700 dark:text-cyan-400">
                      Department Analytics
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Coming Soon: Detailed department-level analytics and comparisons
                    </p>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                      AS-003 #13: Department Analytics
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AS-003 #14: Learning Culture */}
              <div ref={(el) => cardRefs.current[3] = el} style={{ width: '100%', flexShrink: 0 }}>
                <LearningCultureCard 
                  organizationId={orgId}
                  data={analyticsData?.learningCulture}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next cards"
          >
            →
          </button>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalCards }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? 'w-8 bg-emerald-500' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Organization Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-lg text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold mb-1 text-cyan-700 dark:text-cyan-400">
              1,247
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Learners
            </div>
          </div>
          <div className="p-4 rounded-lg text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold mb-1 text-amber-500 dark:text-amber-400">
              89
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Trainers
            </div>
          </div>
          <div className="p-4 rounded-lg text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold mb-1 text-purple-600 dark:text-purple-400">
              156
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Courses Available
            </div>
          </div>
          <div className="p-4 rounded-lg text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold mb-1 text-emerald-600 dark:text-emerald-400">
              92%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completion Rate
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4 text-cyan-700 dark:text-cyan-400">
            Quick Actions
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="quick-action-btn analytics-btn">
              👤 User Management
            </button>
            <button className="quick-action-btn report-btn">
              🏢 Department Analytics
            </button>
            <button className="quick-action-btn achievements-btn">
              ⚙️ Organization Settings
            </button>
            <button className="quick-action-btn analytics-btn">
              📊 Strategic Reports
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizationDashboard;
