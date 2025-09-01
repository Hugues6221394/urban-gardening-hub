// src/components/admin/SystemSettings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        platformCommission: 5,
        minSunlightHours: 4,
        maxSunlightHours: 12,
        minSoilQuality: 3,
        maxSoilQuality: 10,
        waterAccessRequired: true,
        automaticIrrigation: false,
        irrigationThreshold: 30,
        notificationEnabled: true,
        emailNotifications: true,
        smsNotifications: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8083/api/admin/settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setSettings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8083/api/admin/settings', settings, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setMessage('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Error saving settings. Please try again.');
        }

        setSaving(false);
    };

    if (loading) {
        return <div className="text-center">Loading settings...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>System Settings</h4>
            </div>

            {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="card mb-4">
                    <div className="card-header">
                        <h5>Platform Settings</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="platformCommission" className="form-label">
                                    Platform Commission (%)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="platformCommission"
                                    name="platformCommission"
                                    min="0"
                                    max="20"
                                    step="0.5"
                                    value={settings.platformCommission}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5>Space Requirements</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="minSunlightHours" className="form-label">
                                    Minimum Sunlight Hours
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="minSunlightHours"
                                    name="minSunlightHours"
                                    min="0"
                                    max="24"
                                    step="0.5"
                                    value={settings.minSunlightHours}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="maxSunlightHours" className="form-label">
                                    Maximum Sunlight Hours
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="maxSunlightHours"
                                    name="maxSunlightHours"
                                    min="0"
                                    max="24"
                                    step="0.5"
                                    value={settings.maxSunlightHours}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="minSoilQuality" className="form-label">
                                    Minimum Soil Quality (1-10)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="minSoilQuality"
                                    name="minSoilQuality"
                                    min="1"
                                    max="10"
                                    value={settings.minSoilQuality}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="maxSoilQuality" className="form-label">
                                    Maximum Soil Quality (1-10)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="maxSoilQuality"
                                    name="maxSoilQuality"
                                    min="1"
                                    max="10"
                                    value={settings.maxSoilQuality}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-12 mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="waterAccessRequired"
                                        name="waterAccessRequired"
                                        checked={settings.waterAccessRequired}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="waterAccessRequired">
                                        Water Access Required
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5>IoT & Automation</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="automaticIrrigation"
                                        name="automaticIrrigation"
                                        checked={settings.automaticIrrigation}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="automaticIrrigation">
                                        Enable Automatic Irrigation
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="irrigationThreshold" className="form-label">
                                    Irrigation Threshold (% soil moisture)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="irrigationThreshold"
                                    name="irrigationThreshold"
                                    min="10"
                                    max="50"
                                    value={settings.irrigationThreshold}
                                    onChange={handleChange}
                                    disabled={!settings.automaticIrrigation}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5>Notifications</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="notificationEnabled"
                                        name="notificationEnabled"
                                        checked={settings.notificationEnabled}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="notificationEnabled">
                                        Enable Notifications
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="emailNotifications"
                                        name="emailNotifications"
                                        checked={settings.emailNotifications}
                                        onChange={handleChange}
                                        disabled={!settings.notificationEnabled}
                                    />
                                    <label className="form-check-label" htmlFor="emailNotifications">
                                        Email Notifications
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="smsNotifications"
                                        name="smsNotifications"
                                        checked={settings.smsNotifications}
                                        onChange={handleChange}
                                        disabled={!settings.notificationEnabled}
                                    />
                                    <label className="form-check-label" htmlFor="smsNotifications">
                                        SMS Notifications
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-grid">
                    <button
                        type="submit"
                        className="btn btn-success btn-lg"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SystemSettings;