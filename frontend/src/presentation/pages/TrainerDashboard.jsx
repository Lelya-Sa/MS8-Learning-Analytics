import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { useAuth } from '../../application/state/AuthContext';
import { apiClient } from '../../infrastructure/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CoursePerformanceCard } from '../components/analytics/trainer/CoursePerformanceCard';
import { CourseHealthCard } from '../components/analytics/trainer/CourseHealthCard';
import { StudentDistributionCard } from '../components/analytics/trainer/StudentDistributionCard';
import { TeachingEffectivenessCard } from '../components/analytics/trainer/TeachingEffectivenessCard';

/**
 * Trainer Dashboard Page
 * 
 * Displays 4 trainer-specific analytics cards as per the user journey documentation:
 * - AS-002 #7: Course Performance
 * - AS-002 #8: Course Health
 * - AS-002 #9: Student Distribution
 * - AS-002 #10: Teaching Effectiveness
 * 
 * Also includes at-risk students sidebar for high drop-off risk warnings.
 * 
 * @component TrainerDashboard
 * @description Main dashboard for trainers with course and student analytics
 */
const TrainerDashboard = () => {
  const { user } = useAuth();
  const trainerId = user?.id;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const wrapperRef = useRef(null);
  const cardRefs = useRef([]);

  // Fetch all trainer analytics data
  const { data: analyticsData, error, isLoading } = useSWR(
    trainerId ? `trainer-analytics-${trainerId}` : null,
    async () => {
      const response = await apiClient.get(`/trainer/analytics/overview/${trainerId}`);
      // The API returns { data: {...}, cached: ..., ... }, so we extract the data property
      const data = response.data || response;
      console.log('📊 Trainer Analytics Data:', data);
      return data;
    }
  );

  // Extract courseId from the first course in coursePerformance or use a default
  const courseId = analyticsData?.coursePerformance?.courses?.[0]?.id || 'default-course';
  
  const totalCards = 4; // Trainer has 4 cards

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

  if (!trainerId) {
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
            👨‍🏫 Trainer Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor course performance and student progress analytics
          </p>
        </div>

        {/* At-Risk Students Alert */}
        <div className="p-4 rounded-lg border-l-4 mb-6 bg-red-50 dark:bg-red-900 border-red-400 dark:border-red-600">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-100">
                At-Risk Students Alert
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                3 students showing high drop-off risk. Click to view details and send recommendations.
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
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              {/* AS-002 #7: Course Performance */}
              <div ref={(el) => cardRefs.current[0] = el} style={{ width: '100%', flexShrink: 0 }}>
                <CoursePerformanceCard 
                  data={analyticsData?.coursePerformance}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
              
              {/* AS-002 #8: Course Health */}
              <div ref={(el) => cardRefs.current[1] = el} style={{ width: '100%', flexShrink: 0 }}>
                <CourseHealthCard 
                  data={analyticsData?.courseHealth}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
              
              {/* AS-002 #9: Student Distribution */}
              <div ref={(el) => cardRefs.current[2] = el} style={{ width: '100%', flexShrink: 0 }}>
                <StudentDistributionCard 
                  trainerId={trainerId}
                  courseId={courseId}
                  data={analyticsData?.studentDistribution}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
              
              {/* AS-002 #10: Teaching Effectiveness */}
              <div ref={(el) => cardRefs.current[3] = el} style={{ width: '100%', flexShrink: 0 }}>
                <TeachingEffectivenessCard 
                  trainerId={trainerId}
                  data={analyticsData?.teachingEffectiveness}
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

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4 text-cyan-700 dark:text-cyan-400">
            Quick Actions
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="quick-action-btn analytics-btn">
              👥 Manage Students
            </button>
            <button className="quick-action-btn report-btn">
              📚 Course Management
            </button>
            <button className="quick-action-btn achievements-btn">
              📊 Detailed Analytics
            </button>
            <button className="quick-action-btn analytics-btn">
              📄 Generate Report
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainerDashboard;
