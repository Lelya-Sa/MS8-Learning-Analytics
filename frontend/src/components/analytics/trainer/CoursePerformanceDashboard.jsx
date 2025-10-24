import React from 'react';
import PropTypes from 'prop-types';

const CoursePerformanceDashboard = ({ trainerId, data, isLoading, error }) => {
  return <div>CoursePerformanceDashboard Stub</div>;
};

CoursePerformanceDashboard.propTypes = {
  trainerId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default CoursePerformanceDashboard;

