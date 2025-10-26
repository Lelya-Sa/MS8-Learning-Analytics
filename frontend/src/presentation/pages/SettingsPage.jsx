import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useTheme } from '../../application/state/ThemeContext';
import { useAuth } from '../../application/state/AuthContext';

export const SettingsPage = ({ userId, role = 'learner' }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    emailNotifications: true,
    pushNotifications: true,
    reportAlerts: true,
    dataSharing: false,
    analyticsTracking: true,
    profileVisibility: 'private',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Settings | MS8 Learning Analytics';
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validatePassword(passwordData.newPassword)) {
      setErrors({ password: 'Password must be at least 8 characters long' });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update password');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleExportData = () => {
    console.log(`Exporting user data for ${userId}`);
    // In a real implementation, this would trigger data export
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      logout();
      navigate('/');
    } catch (error) {
      setMessage('Failed to delete account');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getRoleSpecificSettings = () => {
    switch (role) {
      case 'learner':
        return (
          <div className="role-settings">
            <h3>Learning Preferences</h3>
            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  name="studyReminders"
                  checked={formData.studyReminders || false}
                  onChange={handleInputChange}
                />
                Study Reminders
              </label>
            </div>
          </div>
        );
      case 'trainer':
        return (
          <div className="role-settings">
            <h3>Teaching Preferences</h3>
            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  name="studentNotifications"
                  checked={formData.studentNotifications || false}
                  onChange={handleInputChange}
                />
                Student Notifications
              </label>
            </div>
          </div>
        );
      case 'organization':
        return (
          <div className="role-settings">
            <h3>Organization Settings</h3>
            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  name="teamManagement"
                  checked={formData.teamManagement || false}
                  onChange={handleInputChange}
                />
                Team Management
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <main role="main">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and application settings</p>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form role="form" onSubmit={handleSaveProfile}>
          {/* Profile Settings */}
          <Card className="settings-section">
            <h2>Profile Settings</h2>
            <div className="setting-group">
              <h3>Personal Information</h3>
              <div className="form-row">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="save-button">
              Save Changes
            </Button>
          </Card>

          {/* Theme Settings */}
          <Card className="settings-section">
            <h2>Appearance</h2>
            <div className="setting-group">
              <h3>Theme Preference</h3>
              <div className="theme-options">
                <label>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={() => toggleTheme()}
                  />
                  Light Mode
                </label>
                <label>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={() => toggleTheme()}
                  />
                  Dark Mode
                </label>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="settings-section">
            <h2>Notifications</h2>
            <div className="setting-group">
              <h3>Email Notifications</h3>
              <label>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleInputChange}
                  aria-label="Email Notifications"
                />
                Email Notifications
              </label>
            </div>
            <div className="setting-group">
              <h3>Push Notifications</h3>
              <label>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={formData.pushNotifications}
                  onChange={handleInputChange}
                  aria-label="Push Notifications"
                />
                Push Notifications
              </label>
            </div>
            <div className="setting-group">
              <h3>Report Generation Alerts</h3>
              <label>
                <input
                  type="checkbox"
                  name="reportAlerts"
                  checked={formData.reportAlerts}
                  onChange={handleInputChange}
                />
                Report Generation Alerts
              </label>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="settings-section">
            <h2>Privacy & Security</h2>
            <div className="setting-group">
              <h3>Data Sharing</h3>
              <label>
                <input
                  type="checkbox"
                  name="dataSharing"
                  checked={formData.dataSharing}
                  onChange={handleInputChange}
                />
                Data Sharing
              </label>
            </div>
            <div className="setting-group">
              <h3>Analytics Tracking</h3>
              <label>
                <input
                  type="checkbox"
                  name="analyticsTracking"
                  checked={formData.analyticsTracking}
                  onChange={handleInputChange}
                  aria-label="Analytics Tracking"
                />
                Analytics Tracking
              </label>
            </div>
            <div className="setting-group">
              <h3>Profile Visibility</h3>
              <select
                name="profileVisibility"
                value={formData.profileVisibility}
                onChange={handleInputChange}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </Card>

          {/* Role-specific Settings */}
          {getRoleSpecificSettings()}

          {/* Account Actions */}
          <Card className="settings-section">
            <h2>Account Actions</h2>
            <div className="action-buttons">
              <Button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                className="action-button"
              >
                Change Password
              </Button>
              <Button
                type="button"
                onClick={handleExportData}
                className="action-button"
              >
                Export Data
              </Button>
              <Button
                type="button"
                onClick={handleDeleteAccount}
                className="action-button danger"
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </form>

        {/* Password Change Modal */}
        {showPasswordForm && (
          <div className="modal-overlay">
            <Card className="modal">
              <h3>Change Password</h3>
              <form onSubmit={handlePasswordUpdate}>
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  required
                />
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  error={errors.confirmPassword}
                  required
                />
                <div className="modal-actions">
                  <Button type="submit" className="primary">
                    Update Password
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Delete Account Confirmation */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <Card className="modal">
              <h3>Delete Account</h3>
              <p>Are you sure you want to delete your account?</p>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <Button
                  type="button"
                  onClick={confirmDeleteAccount}
                  className="danger"
                >
                  Delete Account
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="secondary"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;
