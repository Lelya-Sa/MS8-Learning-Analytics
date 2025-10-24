import React from 'react';
import PropTypes from 'prop-types';

const TeachingEffectivenessMetrics = ({ trainerId, data, isLoading, error }) => {
  return <div>TeachingEffectivenessMetrics Stub</div>;
};

TeachingEffectivenessMetrics.propTypes = {
  trainerId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default TeachingEffectivenessMetrics;

