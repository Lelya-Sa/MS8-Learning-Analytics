/**
 * AS-002: Trainer Analytics Components Tests
 * TDD: RED Phase - Write failing tests first
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import CourseHealthDashboard from '../components/analytics/trainer/CourseHealthDashboard';
import CoursePerformanceDashboard from '../components/analytics/trainer/CoursePerformanceDashboard';
import StudentDistributionChart from '../components/analytics/trainer/StudentDistributionChart';
import TeachingEffectivenessMetrics from '../components/analytics/trainer/TeachingEffectivenessMetrics';

// Mock data matching backend structure
const mockCourseHealth = {
    courseId: 'course-123',
    courseName: 'Full Stack Web Development',
    overallHealth: 'good',
    healthScore: 78,
    metrics: {
        enrollments: {
            total: 245,
            active: 180,
            trend: '+15% this month',
            comparisonToAverage: '+8%'
        },
        completion: {
            rate: 68,
            target: 75,
            variance: '-7%',
            averageTimeToComplete: '8.5 weeks',
            targetTime: '8 weeks'
        },
        satisfaction: {
            averageRating: 4.3,
            totalReviews: 87,
            nps: 42,
            satisfactionScore: 85,
            ratingTrend: '+0.2 from last cohort'
        }
    },
    dropOffAnalysis: {
        overallDropOffRate: 32,
        dropOffPoints: [
            {
                moduleId: 'module_5',
                moduleName: 'Advanced JavaScript',
                dropOffRate: 35,
                studentsDropped: 63,
                avgProgressBeforeDrop: 45,
                likelyReasons: [
                    'Difficulty spike (30% of feedback)',
                    'Unclear instructions (25% of feedback)'
                ],
                recommendedActions: [
                    'Add prerequisite review module',
                    'Create video walkthrough for complex concepts'
                ],
                priority: 'high'
            }
        ]
    },
    contentPerformance: {
        strugglingTopics: [
            {
                topic: 'Async Programming',
                averageScore: 62,
                passRate: 58,
                averageAttempts: 2.3,
                studentFeedback: 'Needs more examples'
            }
        ],
        highPerformanceTopics: [
            {
                topic: 'HTML/CSS Basics',
                averageScore: 92,
                passRate: 98,
                averageAttempts: 1.1,
                studentFeedback: 'Clear and concise'
            }
        ]
    },
    recommendations: [
        {
            type: 'content_improvement',
            priority: 'high',
            suggestion: 'Revise Module 5: Add scaffolding content',
            expectedImpact: 'Reduce drop-off by 15%'
        }
    ]
};

const mockCoursePerformance = {
    courses: [
        {
            courseId: 'course-123',
            courseName: 'Full Stack Web Development',
            enrollments: 245,
            activeStudents: 180,
            completionRate: 68,
            averageScore: 78.5,
            healthScore: 78,
            trend: 'improving'
        },
        {
            courseId: 'course-456',
            courseName: 'React Advanced Patterns',
            enrollments: 128,
            activeStudents: 95,
            completionRate: 72,
            averageScore: 82.3,
            healthScore: 85,
            trend: 'stable'
        }
    ],
    summary: {
        totalCourses: 2,
        totalEnrollments: 373,
        averageCompletionRate: 70,
        averageHealthScore: 81.5
    }
};

const mockStudentDistribution = {
    courseId: 'course-123',
    courseName: 'Full Stack Web Development',
    totalStudents: 245,
    distribution: {
        excellent: { count: 45, percentage: 18.4, range: '90-100%' },
        good: { count: 98, percentage: 40.0, range: '75-89%' },
        average: { count: 67, percentage: 27.3, range: '60-74%' },
        struggling: { count: 35, percentage: 14.3, range: '<60%' }
    },
    insights: {
        averageScore: 78.5,
        medianScore: 79.0,
        passRate: 85.7,
        atRiskStudents: 35,
        topPerformers: 45
    }
};

const mockTeachingEffectiveness = {
    overallScore: 85.7,
    metrics: {
        studentSatisfaction: {
            score: 4.3,
            totalReviews: 187,
            trend: 'improving'
        },
        learningOutcomes: {
            averageScoreImprovement: 15.5,
            skillAcquisitionRate: 82.3,
            completionRate: 70.0
        },
        engagement: {
            responseTime: '2.5 hours',
            feedbackQuality: 4.5,
            availabilityScore: 92
        }
    },
    strengths: [
        'Clear explanations and examples',
        'Quick response to student questions',
        'Well-structured course content'
    ],
    improvementAreas: [
        'More hands-on exercises',
        'Additional office hours',
        'More video content'
    ]
};

// SWR test wrapper
const SWRWrapper = ({ children }) => (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {children}
    </SWRConfig>
);

describe('🔴 RED: AS-002 Trainer Analytics Components', () => {
    describe('CourseHealthDashboard', () => {
        it('should render loading state', () => {
            const { container } = render(
                <SWRWrapper>
                    <CourseHealthDashboard trainerId="trainer-123" courseId="course-123" isLoading={true} />
                </SWRWrapper>
            );
            expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
        });

        it('should render error state', () => {
            const error = new Error('Failed to fetch');
            render(
                <SWRWrapper>
                    <CourseHealthDashboard trainerId="trainer-123" courseId="course-123" error={error} />
                </SWRWrapper>
            );
            expect(screen.getByText(/error loading course health/i)).toBeInTheDocument();
        });

        it('should render course health data', () => {
            render(
                <SWRWrapper>
                    <CourseHealthDashboard trainerId="trainer-123" courseId="course-123" data={mockCourseHealth} />
                </SWRWrapper>
            );
            
            expect(screen.getByText('Full Stack Web Development')).toBeInTheDocument();
            expect(screen.getByText(/health score/i)).toBeInTheDocument();
            expect(screen.getByText('78')).toBeInTheDocument();
        });

        it('should display enrollment metrics', () => {
            render(
                <SWRWrapper>
                    <CourseHealthDashboard trainerId="trainer-123" courseId="course-123" data={mockCourseHealth} />
                </SWRWrapper>
            );
            
            expect(screen.getByText('245')).toBeInTheDocument(); // total enrollments
            expect(screen.getByText('180')).toBeInTheDocument(); // active students
        });

        it('should display drop-off analysis', () => {
            render(
                <SWRWrapper>
                    <CourseHealthDashboard trainerId="trainer-123" courseId="course-123" data={mockCourseHealth} />
                </SWRWrapper>
            );
            
            expect(screen.getByText(/Advanced JavaScript/i)).toBeInTheDocument();
            expect(screen.getByText(/Difficulty spike/i)).toBeInTheDocument();
        });

        it('should display recommendations', () => {
            render(
                <SWRWrapper>
                    <CourseHealthDashboard trainerId="trainer-123" courseId="course-123" data={mockCourseHealth} />
                </SWRWrapper>
            );
            
            expect(screen.getByText(/Revise Module 5/i)).toBeInTheDocument();
        });
    });

    describe('CoursePerformanceDashboard', () => {
        it('should render loading state', () => {
            const { container } = render(
                <SWRWrapper>
                    <CoursePerformanceDashboard trainerId="trainer-123" isLoading={true} />
                </SWRWrapper>
            );
            expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
        });

        it('should render error state', () => {
            const error = new Error('Failed to fetch');
            render(
                <SWRWrapper>
                    <CoursePerformanceDashboard trainerId="trainer-123" error={error} />
                </SWRWrapper>
            );
            expect(screen.getByText(/error loading course performance/i)).toBeInTheDocument();
        });

        it('should render all courses', () => {
            render(
                <SWRWrapper>
                    <CoursePerformanceDashboard trainerId="trainer-123" data={mockCoursePerformance} />
                </SWRWrapper>
            );
            
            expect(screen.getByText('Full Stack Web Development')).toBeInTheDocument();
            expect(screen.getByText('React Advanced Patterns')).toBeInTheDocument();
        });

        it('should display summary statistics', () => {
            render(
                <SWRWrapper>
                    <CoursePerformanceDashboard trainerId="trainer-123" data={mockCoursePerformance} />
                </SWRWrapper>
            );
            
            expect(screen.getByText('373')).toBeInTheDocument(); // total enrollments
            expect(screen.getAllByText('70').length).toBeGreaterThan(0); // average completion rate
        });
    });

    describe('StudentDistributionChart', () => {
        it('should render loading state', () => {
            const { container } = render(
                <SWRWrapper>
                    <StudentDistributionChart trainerId="trainer-123" courseId="course-123" isLoading={true} />
                </SWRWrapper>
            );
            expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
        });

        it('should render error state', () => {
            const error = new Error('Failed to fetch');
            render(
                <SWRWrapper>
                    <StudentDistributionChart trainerId="trainer-123" courseId="course-123" error={error} />
                </SWRWrapper>
            );
            expect(screen.getByText(/error loading student distribution/i)).toBeInTheDocument();
        });

        it('should render distribution data', () => {
            render(
                <SWRWrapper>
                    <StudentDistributionChart trainerId="trainer-123" courseId="course-123" data={mockStudentDistribution} />
                </SWRWrapper>
            );
            
            expect(screen.getByText('245')).toBeInTheDocument(); // total students
            expect(screen.getByText(/Excellent/i)).toBeInTheDocument();
            expect(screen.getByText(/Good/i)).toBeInTheDocument();
        });

        it('should display insights', () => {
            render(
                <SWRWrapper>
                    <StudentDistributionChart trainerId="trainer-123" courseId="course-123" data={mockStudentDistribution} />
                </SWRWrapper>
            );
            
            expect(screen.getByText(/78.5/)).toBeInTheDocument(); // average score
            expect(screen.getByText(/85.7/)).toBeInTheDocument(); // pass rate
        });
    });

    describe('TeachingEffectivenessMetrics', () => {
        it('should render loading state', () => {
            const { container } = render(
                <SWRWrapper>
                    <TeachingEffectivenessMetrics trainerId="trainer-123" isLoading={true} />
                </SWRWrapper>
            );
            expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
        });

        it('should render error state', () => {
            const error = new Error('Failed to fetch');
            render(
                <SWRWrapper>
                    <TeachingEffectivenessMetrics trainerId="trainer-123" error={error} />
                </SWRWrapper>
            );
            expect(screen.getByText(/error loading teaching effectiveness/i)).toBeInTheDocument();
        });

        it('should render overall score', () => {
            render(
                <SWRWrapper>
                    <TeachingEffectivenessMetrics trainerId="trainer-123" data={mockTeachingEffectiveness} />
                </SWRWrapper>
            );
            
            expect(screen.getByText(/85.7/)).toBeInTheDocument(); // overall score
        });

        it('should display metrics', () => {
            render(
                <SWRWrapper>
                    <TeachingEffectivenessMetrics trainerId="trainer-123" data={mockTeachingEffectiveness} />
                </SWRWrapper>
            );
            
            expect(screen.getByText(/4.3/)).toBeInTheDocument(); // student satisfaction
            expect(screen.getByText(/2.5 hours/i)).toBeInTheDocument(); // response time
        });

        it('should display strengths and improvement areas', () => {
            render(
                <SWRWrapper>
                    <TeachingEffectivenessMetrics trainerId="trainer-123" data={mockTeachingEffectiveness} />
                </SWRWrapper>
            );
            
            expect(screen.getByText(/Clear explanations/i)).toBeInTheDocument();
            expect(screen.getByText(/More hands-on exercises/i)).toBeInTheDocument();
        });
    });
});

