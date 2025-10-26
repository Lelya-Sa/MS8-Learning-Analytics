/**
 * @file CoursePerformance Entity
 * @description CoursePerformance domain entity following Onion Architecture
 */
export class CoursePerformance {
  constructor(courseData) {
    this.trainerId = courseData.trainerId;
    this.courseId = courseData.courseId;
    this.averageScore = courseData.averageScore;
    this.completionRate = courseData.completionRate;
    this.studentSatisfaction = courseData.studentSatisfaction;
    this.lastUpdated = courseData.lastUpdated || new Date();
  }

  toJSON() {
    return {
      trainerId: this.trainerId,
      courseId: this.courseId,
      averageScore: this.averageScore,
      completionRate: this.completionRate,
      studentSatisfaction: this.studentSatisfaction,
      lastUpdated: this.lastUpdated
    };
  }
}
