import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PeerComparisonCardSimple from '../../../../../presentation/components/analytics/comparison/PeerComparisonCardSimple';

describe('Simple Component Test', () => {
  it('should render simple component', () => {
    render(<PeerComparisonCardSimple />);
    expect(screen.getByText('Peer Comparison Card')).toBeInTheDocument();
  });
});
