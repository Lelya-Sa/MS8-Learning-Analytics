import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SettingsPage } from '../../../presentation/pages/SettingsPage';

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock theme context
jest.mock('../../../application/state/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
}));

// Mock auth context
jest.mock('../../../application/state/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'learner',
    },
    logout: jest.fn(),
  }),
}));

describe('SettingsPage', () => {
  const mockProps = {
    userId: 'user123',
    role: 'learner',
  };

  describe('Rendering', () => {
    it('should render settings page with title and subtitle', () => {
      render(<SettingsPage {...mockProps} />);
      
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Manage your account preferences and application settings')).toBeInTheDocument();
    });

    it('should display user profile section', () => {
      render(<SettingsPage {...mockProps} />);
      
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    });

    it('should display theme settings section', () => {
      render(<SettingsPage {...mockProps} />);
      
      expect(screen.getByText('Appearance')).toBeInTheDocument();
      expect(screen.getByText('Theme Preference')).toBeInTheDocument();
      expect(screen.getByText('Light Mode')).toBeInTheDocument();
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('should display notification settings section', () => {
      render(<SettingsPage {...mockProps} />);
      
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByText('Push Notifications')).toBeInTheDocument();
      expect(screen.getByText('Report Generation Alerts')).toBeInTheDocument();
    });

    it('should display privacy settings section', () => {
      render(<SettingsPage {...mockProps} />);
      
      expect(screen.getByText('Privacy & Security')).toBeInTheDocument();
      expect(screen.getByText('Data Sharing')).toBeInTheDocument();
      expect(screen.getByText('Analytics Tracking')).toBeInTheDocument();
      expect(screen.getByText('Profile Visibility')).toBeInTheDocument();
    });

    it('should display account actions section', () => {
      render(<SettingsPage {...mockProps} />);
      
      expect(screen.getByText('Account Actions')).toBeInTheDocument();
      expect(screen.getByText('Change Password')).toBeInTheDocument();
      expect(screen.getByText('Export Data')).toBeInTheDocument();
      expect(screen.getByText('Delete Account')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should handle profile form submission', async () => {
      render(<SettingsPage {...mockProps} />);
      
      const nameInput = screen.getByDisplayValue('John Doe');
      fireEvent.change(nameInput, { target: { value: 'John Smith' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
      });
    });

    it('should handle theme toggle', () => {
      const mockToggleTheme = jest.fn();
      jest.doMock('../../../../application/state/ThemeContext', () => ({
        useTheme: () => ({
          theme: 'light',
          toggleTheme: mockToggleTheme,
        }),
      }));

      render(<SettingsPage {...mockProps} />);
      
      const darkModeToggle = screen.getByLabelText('Dark Mode');
      fireEvent.click(darkModeToggle);
      
      expect(mockToggleTheme).toHaveBeenCalled();
    });

    it('should handle notification toggles', () => {
      render(<SettingsPage {...mockProps} />);
      
      const emailToggle = screen.getByLabelText('Email Notifications');
      fireEvent.click(emailToggle);
      
      expect(emailToggle).toBeChecked();
    });

    it('should handle privacy setting changes', () => {
      render(<SettingsPage {...mockProps} />);
      
      const analyticsToggle = screen.getByLabelText('Analytics Tracking');
      fireEvent.click(analyticsToggle);
      
      expect(analyticsToggle).toBeChecked();
    });
  });

  describe('Account Actions', () => {
    it('should handle change password action', () => {
      render(<SettingsPage {...mockProps} />);
      
      const changePasswordButton = screen.getByText('Change Password');
      fireEvent.click(changePasswordButton);
      
      expect(screen.getByText('Change Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
      expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    });

    it('should handle export data action', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<SettingsPage {...mockProps} />);
      
      const exportButton = screen.getByText('Export Data');
      fireEvent.click(exportButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('Exporting user data for user123');
      
      consoleSpy.mockRestore();
    });

    it('should handle delete account action with confirmation', () => {
      render(<SettingsPage {...mockProps} />);
      
      const deleteButton = screen.getByText('Delete Account');
      fireEvent.click(deleteButton);
      
      expect(screen.getByText('Delete Account')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete your account?')).toBeInTheDocument();
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', async () => {
      render(<SettingsPage {...mockProps} />);
      
      const emailInput = screen.getByDisplayValue('john@example.com');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('should validate password strength', async () => {
      render(<SettingsPage {...mockProps} />);
      
      const changePasswordButton = screen.getByText('Change Password');
      fireEvent.click(changePasswordButton);
      
      const newPasswordInput = screen.getByLabelText('New Password');
      fireEvent.change(newPasswordInput, { target: { value: 'weak' } });
      
      const updateButton = screen.getByText('Update Password');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
      });
    });

    it('should validate password confirmation match', async () => {
      render(<SettingsPage {...mockProps} />);
      
      const changePasswordButton = screen.getByText('Change Password');
      fireEvent.click(changePasswordButton);
      
      const newPasswordInput = screen.getByLabelText('New Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
      
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      
      const updateButton = screen.getByText('Update Password');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<SettingsPage {...mockProps} />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<SettingsPage {...mockProps} />);
      
      const nameInput = screen.getByDisplayValue('John Doe');
      nameInput.focus();
      expect(nameInput).toHaveFocus();
      
      // Tab to next input
      fireEvent.keyDown(nameInput, { key: 'Tab' });
      const emailInput = screen.getByDisplayValue('john@example.com');
      expect(emailInput).toHaveFocus();
    });

    it('should have proper form labels', () => {
      render(<SettingsPage {...mockProps} />);
      
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Push Notifications')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render correctly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<SettingsPage {...mockProps} />);
      
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle save errors gracefully', async () => {
      render(<SettingsPage {...mockProps} />);
      
      const nameInput = screen.getByDisplayValue('John Doe');
      fireEvent.change(nameInput, { target: { value: 'John Smith' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      // Simulate error
      await waitFor(() => {
        expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
      });
    });
  });

  describe('Role-Based Features', () => {
    it('should show role-specific settings for learner', () => {
      render(<SettingsPage {...mockProps} role="learner" />);
      
      expect(screen.getByText('Learning Preferences')).toBeInTheDocument();
      expect(screen.getByText('Study Reminders')).toBeInTheDocument();
    });

    it('should show role-specific settings for trainer', () => {
      render(<SettingsPage {...mockProps} role="trainer" />);
      
      expect(screen.getByText('Teaching Preferences')).toBeInTheDocument();
      expect(screen.getByText('Student Notifications')).toBeInTheDocument();
    });

    it('should show role-specific settings for organization', () => {
      render(<SettingsPage {...mockProps} role="organization" />);
      
      expect(screen.getByText('Organization Settings')).toBeInTheDocument();
      expect(screen.getByText('Team Management')).toBeInTheDocument();
    });
  });
});
