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
import PeerComparisonCard from '../components/analytics/comparison/PeerComparisonCard';
import SkillDemandCard from '../components/analytics/comparison/SkillDemandCard';
import PerformanceForecastCard from '../components/analytics/comparison/PerformanceForecastCard';
import RecommendationsCard from '../components/analytics/comparison/RecommendationsCard';

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
  const wrapperRef = useRef(null);
  const cardRefs = useRef([]);

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

  const totalCards = 11; // Total number of analytics cards: 6 learner-specific + 1 drop-off risk + 4 comparison/predictive

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
          <div ref={wrapperRef} className="cards-carousel-wrapper overflow-hidden">
            <div 
              ref={carouselRef}
              className="cards-carousel flex"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            
              }}
            >
               {/* Drop-off Risk Analysis */}
               <div ref={(el) => cardRefs.current[0] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <DropOffRiskCard userId={userId} />
               </div>

               {/* AS-001 #1: Learning Velocity */}
               <div ref={(el) => cardRefs.current[1] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <LearningVelocityCard 
                   data={analyticsData?.learningVelocity}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #2: Skill Gap Matrix */}
               <div ref={(el) => cardRefs.current[2] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <SkillGapMatrixCard 
                   data={analyticsData?.skillGap}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #3: Engagement Score */}
               <div ref={(el) => cardRefs.current[3] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <EngagementMetricsCard 
                   data={analyticsData?.engagement}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #4: Mastery Progress */}
               <div ref={(el) => cardRefs.current[4] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <MasteryProgressionCard 
                   data={analyticsData?.mastery}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #5: Performance Analytics */}
               <div ref={(el) => cardRefs.current[5] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <PerformanceAnalyticsCard 
                   data={analyticsData?.performance}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
             
               {/* AS-001 #6: Content Effectiveness */}
               <div ref={(el) => cardRefs.current[6] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <ContentEffectivenessCard 
                   data={analyticsData?.contentEffectiveness}
                   isLoading={isLoading}
                   error={error}
                 />
               </div>
               
               {/* Comparison/Predictive Cards - Role-Adaptive */}
               <div ref={(el) => cardRefs.current[7] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <PeerComparisonCard userId={userId} role="learner" />
               </div>
               
               <div ref={(el) => cardRefs.current[8] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <SkillDemandCard role="learner" />
               </div>
               
               <div ref={(el) => cardRefs.current[9] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <PerformanceForecastCard userId={userId} role="learner" />
               </div>
               
               <div ref={(el) => cardRefs.current[10] = el} style={{ width: '100%', flexShrink: 0 }}>
                 <RecommendationsCard userId={userId} role="learner" />
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
              className="quick-action-btn analytics-btn"
            >
              📊 View Detailed Analytics
            </button>
            <button 
              className="quick-action-btn report-btn"
            >
              📄 Generate Report
            </button>
            <button 
              className="quick-action-btn achievements-btn"
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
