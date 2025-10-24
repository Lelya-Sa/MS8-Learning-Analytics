import React from 'react';
import PropTypes from 'prop-types';

const CourseHealthDashboard = ({ trainerId, courseId, data, isLoading, error }) => {
  return <div>CourseHealthDashboard Stub</div>;
};

CourseHealthDashboard.propTypes = {
  trainerId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default CourseHealthDashboard;

