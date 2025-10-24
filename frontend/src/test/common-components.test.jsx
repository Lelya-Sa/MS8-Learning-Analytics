/**
 * Tests for Common Reusable Components
 * Ensures refactored components maintain functionality
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../components/common/ProgressBar';
import GradientSection from '../components/common/GradientSection';
import StatCard from '../components/common/StatCard';

describe('ProgressBar Component', () => {
  it('should render with correct percentage', () => {
    const { container } = render(<ProgressBar value={75} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveStyle({ width: '75%' });
  });

  it('should display label when showLabel is true', () => {
    render(<ProgressBar value={50} showLabel={true} label="Test Progress" />);
    expect(screen.getByText('Test Progress')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should handle custom max value', () => {
    render(<ProgressBar value={30} max={50} showLabel={true} label="Progress" />);
    expect(screen.getByText('30/50')).toBeInTheDocument();
  });

  it('should cap percentage at 100%', () => {
    const { container } = render(<ProgressBar value={150} max={100} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('should apply custom colors', () => {
    const { container } = render(
      <ProgressBar value={50} fillColor="bg-red-500" bgColor="bg-gray-300" />
    );
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-gray-300')).toBeInTheDocument();
  });
});

describe('GradientSection Component', () => {
  it('should render children', () => {
    render(
      <GradientSection>
        <p>Test Content</p>
      </GradientSection>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply gradient preset', () => {
    const { container } = render(
      <GradientSection gradient="purple">
        <p>Content</p>
      </GradientSection>
    );
    expect(container.querySelector('.from-purple-50')).toBeInTheDocument();
  });

  it('should render title and icon', () => {
    render(
      <GradientSection title="Test Section" icon="🎯">
        <p>Content</p>
      </GradientSection>
    );
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('should apply custom gradient string', () => {
    const { container } = render(
      <GradientSection gradient="from-red-100 to-blue-100">
        <p>Content</p>
      </GradientSection>
    );
    expect(container.querySelector('.from-red-100')).toBeInTheDocument();
  });
});

describe('StatCard Component', () => {
  it('should display label and value', () => {
    render(<StatCard label="Total Users" value="1,234" />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('should render icon', () => {
    render(<StatCard label="Score" value="95" icon="📊" />);
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('should display trend indicator', () => {
    render(
      <StatCard 
        label="Growth" 
        value="100" 
        trend={{ direction: 'up', value: '15%' }} 
      />
    );
    expect(screen.getByText(/15%/)).toBeInTheDocument();
    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });

  it('should apply custom colors', () => {
    const { container } = render(
      <StatCard 
        label="Test" 
        value="50" 
        bgColor="bg-green-50" 
        textColor="text-green-700" 
      />
    );
    expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
    expect(container.querySelector('.text-green-700')).toBeInTheDocument();
  });

  it('should handle numeric values', () => {
    render(<StatCard label="Count" value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});

