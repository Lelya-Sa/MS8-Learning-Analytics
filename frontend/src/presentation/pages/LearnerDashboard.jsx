import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { useAuth } from '../../application/state/AuthContext';
import { apiClient } from '../../infrastructure/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { LearningVelocityCard } from '../components/analytics/learner/LearningVelocityCard';
import { SkillGapMatrixCard } from '../components/analytics/learner/SkillGapMatrixCard';
import { EngagementMetricsCard } from '../components/analytics/learner/EngagementMetricsCard';
import { MasteryProgressionCard } from '../components/analytics/learner/MasteryProgressionCard';
import { PerformanceAnalyticsCard } from '../components/analytics/learner/PerformanceAnalyticsCard';
import { ContentEffectivenessCard } from '../components/analytics/learner/ContentEffectivenessCard';
import DropOffRiskCard from '../components/analytics/comparison/DropOffRiskCard';

/**
 * Learner Dashboard Page
 * 
 * Displays 6 learner-specific analytics cards as per the user journey documentation:
 * - AS-001 #1: Learning Velocity
 * - AS-001 #2: Skill Gap Matrix  
 * - AS-001 #3: Engagement Score
 * - AS-001 #4: Mastery Progress
 * - AS-001 #5: Performance Analytics
 * - AS-001 #6: Content Effectiveness
 * 
 * Also includes predictive insights banner for drop-off risk warnings.
 * 
 * @component LearnerDashboard
 * @description Main dashboard for learners with analytics overview
 */
const LearnerDashboard = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const carouselRef = useRef(null);

  // Fetch all learner analytics data
  const { data: analyticsData, error, isLoading } = useSWR(
    userId ? `learner-analytics-${userId}` : null,
    async () => {
      const response = await apiClient.get(`/learner/analytics/overview/${userId}`);
      // The API returns { data: {...}, cached: ..., ... }, so we extract the data property
      const data = response.data || response;
      console.log('📊 Learner Analytics Data:', data);
      return data;
    }
  );

  const totalCards = 7; // Total number of analytics cards (including Drop-off Risk)

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

  if (!userId) {
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
            🎓 Learner Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your learning progress and performance analytics
          </p>
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
          <div className="cards-carousel-wrapper overflow-hidden">
            <div 
              ref={carouselRef}
              className="cards-carousel flex"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.5s ease-in-out',
                width: `${totalCards * 100}%`,
              }}
            >
               {/* Drop-off Risk Analysis */}
               <div style={{ width: '100%', flexShrink: 0, padding: '0 0.75rem' }}>
                 <DropOffRiskCard userId={userId} />
               </div>

               {/* AS-001 #1: Learning Velocity */}
               <div style={{ width: '100%', flexShrink: 0, padding: '0 0.75rem' }}>
                 <LearningVelocityCard 
                   data={analyticsData?.learningVelocity}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #2: Skill Gap Matrix */}
               <div style={{ width: '100%', flexShrink: 0, padding: '0 0.75rem' }}>
                 <SkillGapMatrixCard 
                   data={analyticsData?.skillGap}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #3: Engagement Score */}
               <div style={{ width: '100%', flexShrink: 0, padding: '0 0.75rem' }}>
                 <EngagementMetricsCard 
                   data={analyticsData?.engagement}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #4: Mastery Progress */}
               <div style={{ width: '100%', flexShrink: 0, padding: '0 0.75rem' }}>
                 <MasteryProgressionCard 
                   data={analyticsData?.mastery}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #5: Performance Analytics */}
               <div style={{ width: '100%', flexShrink: 0, padding: '0 0.75rem' }}>
                 <PerformanceAnalyticsCard 
                   data={analyticsData?.performance}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #6: Content Effectiveness */}
               <div style={{ width: '100%', flexShrink: 0, padding: '0 0.75rem' }}>
                 <ContentEffectivenessCard 
                   data={analyticsData?.contentEffectiveness}
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
           <div className="flex justify-center mt-6 gap-2">
             {Array.from({ length: totalCards }, (_, index) => (
               <button
                 key={index}
                 onClick={() => setCurrentIndex(index)}
                 className={`w-2 h-2 rounded-full transition-all ${
                   index === currentIndex 
                     ? 'bg-cyan-700 dark:bg-cyan-400 w-8' 
                     : 'bg-gray-300 dark:bg-gray-600'
                 }`}
                 aria-label={`Go to card ${index + 1}`}
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
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-cyan-700 hover:bg-cyan-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              📊 View Detailed Analytics
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-amber-500 hover:bg-amber-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              📄 Generate Report
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-purple-600 hover:bg-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              🏆 View Achievements
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearnerDashboard;
