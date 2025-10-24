import React from 'react';
import PropTypes from 'prop-types';

const StudentDistributionChart = ({ trainerId, courseId, data, isLoading, error }) => {
  return <div>StudentDistributionChart Stub</div>;
};

StudentDistributionChart.propTypes = {
  trainerId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default StudentDistributionChart;

