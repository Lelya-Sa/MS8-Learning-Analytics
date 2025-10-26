import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Test infrastructure API import
describe('Infrastructure API Test', () => {
  it('should be able to import infrastructure API', () => {
    try {
      const { apiClient } = require('../../../../../infrastructure/api');
      expect(apiClient).toBeDefined();
    } catch (error) {
      console.error('Infrastructure API import error:', error);
      throw error;
    }
  });
});
