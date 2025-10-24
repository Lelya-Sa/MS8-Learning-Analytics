import React, { useState } from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import DashboardLayout from '../components/layout/DashboardLayout'
import './CommonPage.css'

const SettingsPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' }
  ]

  return (
    <DashboardLayout>
      <div className="settings-page common-page">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-description">
            Configure your organization settings and preferences
          </p>
        </div>

        <div className="page-content">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="settings-content">
            {activeTab === 'general' && (
              <div className="settings-section">
                <h3>General Settings</h3>
                <p>Configure general organization settings</p>
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🏢</div>
                    <h4>Organization Info</h4>
                    <p>Update organization details</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🌍</div>
                    <h4>Localization</h4>
                    <p>Language and timezone settings</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <h3>Security Settings</h3>
                <p>Manage security and access control</p>
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🔐</div>
                    <h4>Authentication</h4>
                    <p>Configure authentication methods</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h4>Permissions</h4>
                    <p>Manage role-based permissions</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h3>Notification Settings</h3>
                <p>Configure notification preferences</p>
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">📧</div>
                    <h4>Email Notifications</h4>
                    <p>Manage email alerts</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h4>Push Notifications</h4>
                    <p>Configure push alerts</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="settings-section">
                <h3>Integration Settings</h3>
                <p>Manage third-party integrations</p>
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🔌</div>
                    <h4>API Keys</h4>
                    <p>Manage API access</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🔄</div>
                    <h4>Webhooks</h4>
                    <p>Configure webhooks</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="coming-soon-banner">
            <span className="banner-icon">🚧</span>
            <p>Full settings management features coming soon!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage

