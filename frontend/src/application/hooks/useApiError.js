/**
 * @file useApiError.js
 * @description Custom hook for handling API errors
 */

import { useState, useCallback } from 'react';

export const useApiError = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error) => {
    console.error('API Error:', error);
    setError(error);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeWithErrorHandling = useCallback(async (asyncFunction) => {
    try {
      setIsLoading(true);
      clearError();
      const result = await asyncFunction();
      setIsLoading(false);
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError, clearError]);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling
  };
};

export default useApiError;
