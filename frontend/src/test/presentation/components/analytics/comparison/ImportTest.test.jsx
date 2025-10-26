import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test to check if basic imports work
describe('Import Test', () => {
  it('should be able to import React', () => {
    expect(React).toBeDefined();
  });

  it('should be able to import testing utilities', () => {
    expect(render).toBeDefined();
    expect(screen).toBeDefined();
  });
});
