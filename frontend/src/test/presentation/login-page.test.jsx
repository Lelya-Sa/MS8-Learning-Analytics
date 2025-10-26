import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../application/state/AuthContext';
import { ThemeProvider } from '../../application/state/ThemeContext';
import { LoginPage } from '../../presentation/pages/LoginPage';

// Mock the AuthService
jest.mock('../../application/services/AuthService', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    validatePasswordStrength: jest.fn(),
  })),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useNavigate
    require('react-router-dom').useNavigate = () => mockNavigate;
  });

  it('should render login form with all required fields', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByTestId('forgot-password-link')).toBeInTheDocument();
    expect(screen.getByTestId('register-link')).toBeInTheDocument();
  });

  it('should display form validation errors', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const loginButton = screen.getByTestId('login-button');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByTestId('email-input');
    const loginButton = screen.getByTestId('login-button');

    await user.type(emailInput, 'invalid-email');
    
    // Submit the form directly
    const form = screen.getByTestId('login-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should validate password strength', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'weak');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const mockLogin = jest.fn().mockResolvedValue({
      user: { id: '1', email: 'test@example.com', roles: ['learner'] },
      token: 'mock-token'
    });

    // Mock AuthService login method
    const { AuthService } = require('../../application/services/AuthService');
    AuthService.mockImplementation(() => ({
      login: mockLogin,
      validatePasswordStrength: jest.fn().mockReturnValue({ isValid: true }),
    }));

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should handle login errors', async () => {
    const user = userEvent.setup();
    
    // Mock the AuthService login method to reject with an error
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    
    // Use jest.doMock to ensure the mock is applied before the module is loaded
    jest.doMock('../../application/services/AuthService', () => ({
      AuthService: jest.fn().mockImplementation(() => ({
        login: mockLogin,
        validatePasswordStrength: jest.fn().mockReturnValue({ isValid: true }),
      })),
    }));

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    
    // Submit the form directly
    const form = screen.getByTestId('login-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should show loading state during login', async () => {
    const user = userEvent.setup();
    const mockLogin = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        user: { id: '1', email: 'test@example.com', roles: ['learner'] },
        token: 'mock-token'
      }), 100))
    );

    const { AuthService } = require('../../application/services/AuthService');
    AuthService.mockImplementation(() => ({
      login: mockLogin,
      validatePasswordStrength: jest.fn().mockReturnValue({ isValid: true }),
    }));

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    expect(screen.getByTestId('login-button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const passwordInput = screen.getByTestId('password-input');
    const toggleButton = screen.getByTestId('password-toggle');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    expect(emailInput).toHaveAttribute('aria-label', 'Email address');
    expect(passwordInput).toHaveAttribute('aria-label', 'Password');
    expect(loginButton).toHaveAttribute('aria-label', 'Sign in');
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    emailInput.focus();
    await user.keyboard('{Tab}');
    expect(passwordInput).toHaveFocus();

    await user.keyboard('{Tab}');
    expect(loginButton).toHaveFocus();
  });

  it('should display forgot password link', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const forgotPasswordLink = screen.getByTestId('forgot-password-link');
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });

  it('should display register link', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const registerLink = screen.getByTestId('register-link');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
