import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        notifications: true,
        emailUpdates: true
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('New passwords do not match');
            setSaving(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8083/api/settings/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setMessage('Password updated successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                notifications: formData.notifications,
                emailUpdates: formData.emailUpdates
            });
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage('Error updating password. Please try again.');
        }

        setSaving(false);
    };

    const handlePreferencesSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8083/api/settings/preferences', {
                notifications: formData.notifications,
                emailUpdates: formData.emailUpdates
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setMessage('Preferences updated successfully!');
        } catch (error) {
            console.error('Error updating preferences:', error);
            setMessage('Error updating preferences. Please try again.');
        }

        setSaving(false);
    };

    return (
        <div className="row">
            <div className="col-md-3">
                <div className="card">
                    <div className="list-group list-group-flush">
                        <button
                            className={`list-group-item list-group-item-action ${activeTab === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            <i className="fas fa-user me-2"></i> Account Settings
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                            onClick={() => setActiveTab('password')}
                        >
                            <i className="fas fa-lock me-2"></i> Password
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <i className="fas fa-bell me-2"></i> Notifications
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${activeTab === 'privacy' ? 'active' : ''}`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            <i className="fas fa-shield-alt me-2"></i> Privacy & Security
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-md-9">
                <div className="card">
                    <div className="card-header">
                        <h4>
                            {activeTab === 'account' && 'Account Settings'}
                            {activeTab === 'password' && 'Change Password'}
                            {activeTab === 'notifications' && 'Notification Preferences'}
                            {activeTab === 'privacy' && 'Privacy & Security'}
                        </h4>
                    </div>
                    <div className="card-body">
                        {message && (
                            <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                                {message}
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={saving}
                                >
                                    {saving ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'notifications' && (
                            <form onSubmit={handlePreferencesSubmit}>
                                <div className="mb-3">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notifications"
                                            name="notifications"
                                            checked={formData.notifications}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="notifications">
                                            Enable push notifications
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="emailUpdates"
                                            name="emailUpdates"
                                            checked={formData.emailUpdates}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="emailUpdates">
                                            Receive email updates
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={saving}
                                >
                                    {saving ? 'Updating...' : 'Save Preferences'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'account' && (
                            <div>
                                <p>Account settings allow you to manage your personal information and account preferences.</p>
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    To update your profile information, please visit the <a href="/profile">Profile page</a>.
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div>
                                <h5>Data Privacy</h5>
                                <p>We take your privacy seriously. Here's how we protect your data:</p>
                                <ul>
                                    <li>Your personal information is encrypted and stored securely</li>
                                    <li>We never share your data with third parties without your consent</li>
                                    <li>You can request to download or delete your data at any time</li>
                                </ul>

                                <div className="mt-4">
                                    <h5>Security</h5>
                                    <p>For your security, we recommend:</p>
                                    <ul>
                                        <li>Using a strong, unique password</li>
                                        <li>Enabling two-factor authentication if available</li>
                                        <li>Logging out from shared devices</li>
                                        <li>Regularly reviewing your account activity</li>
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <button className="btn btn-outline-danger me-2">
                                        <i className="fas fa-download me-1"></i> Download My Data
                                    </button>
                                    <button className="btn btn-danger">
                                        <i className="fas fa-trash me-1"></i> Delete My Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;