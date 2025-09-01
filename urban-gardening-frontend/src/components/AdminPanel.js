// Update AdminPanel.js to include SystemSettings import
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import UserManagement from './admin/UserManagement';
import SpaceManagement from './admin/SpaceManagement';
import TransactionManagement from './admin/TransactionManagement';
import CertificationManagement from './admin/CertificationManagement';
import SystemSettings from './admin/SystemSettings'; // Added import

const AdminPanel = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8083/api/admin/stats/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const isActiveTab = (path) => {
        return location.pathname === `/admin${path}`;
    };

    if (loading) {
        return <div className="text-center">Loading admin panel...</div>;
    }

    return (
        <div>
            <h2 className="mb-4">Admin Panel</h2>

            <div className="row mb-4">
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{stats.totalUsers || 0}</h5>
                            <p className="card-text">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{stats.activeUsers || 0}</h5>
                            <p className="card-text">Active Users</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{stats.verifiedUsers || 0}</h5>
                            <p className="card-text">Verified Users</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{stats.landownerCount || 0}</h5>
                            <p className="card-text">Landowners</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{stats.urbanFarmerCount || 0}</h5>
                            <p className="card-text">Farmers</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{stats.restaurantCount || 0}</h5>
                            <p className="card-text">Restaurants</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-header">
                            <h6>Admin Navigation</h6>
                        </div>
                        <div className="list-group list-group-flush">
                            <Link
                                to="/admin/users"
                                className={`list-group-item list-group-item-action ${isActiveTab('/users') ? 'active' : ''}`}
                            >
                                <i className="fas fa-users me-2"></i> User Management
                            </Link>
                            <Link
                                to="/admin/spaces"
                                className={`list-group-item list-group-item-action ${isActiveTab('/spaces') ? 'active' : ''}`}
                            >
                                <i className="fas fa-map-marker-alt me-2"></i> Space Management
                            </Link>
                            <Link
                                to="/admin/transactions"
                                className={`list-group-item list-group-item-action ${isActiveTab('/transactions') ? 'active' : ''}`}
                            >
                                <i className="fas fa-money-bill-wave me-2"></i> Transactions
                            </Link>
                            <Link
                                to="/admin/certifications"
                                className={`list-group-item list-group-item-action ${isActiveTab('/certifications') ? 'active' : ''}`}
                            >
                                <i className="fas fa-certificate me-2"></i> Certifications
                            </Link>
                            <Link
                                to="/admin/settings"
                                className={`list-group-item list-group-item-action ${isActiveTab('/settings') ? 'active' : ''}`}
                            >
                                <i className="fas fa-cog me-2"></i> System Settings
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <Routes>
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/spaces" element={<SpaceManagement />} />
                        <Route path="/transactions" element={<TransactionManagement />} />
                        <Route path="/certifications" element={<CertificationManagement />} />
                        <Route path="/settings" element={<SystemSettings />} />
                        <Route path="/" element={
                            <div className="card">
                                <div className="card-body text-center py-5">
                                    <i className="fas fa-tachometer-alt fa-3x text-muted mb-3"></i>
                                    <h5>Admin Dashboard</h5>
                                    <p className="text-muted">Select a section from the menu to manage the platform.</p>
                                </div>
                            </div>
                        } />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;