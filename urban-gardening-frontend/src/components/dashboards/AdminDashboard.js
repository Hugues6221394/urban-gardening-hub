import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ data }) => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.totalUsers || 0}</h5>
                            <p className="card-text">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.totalSpaces || 0}</h5>
                            <p className="card-text">Total Spaces</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.totalListings || 0}</h5>
                            <p className="card-text">Active Listings</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.totalTransactions || 0}</h5>
                            <p className="card-text">Transactions</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.pendingVerifications || 0}</h5>
                            <p className="card-text">Pending Verifications</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">RWF {data.platformRevenue ? data.platformRevenue.toLocaleString() : '0'}</h5>
                            <p className="card-text">Platform Revenue</p>
                        </div>
                    </div>
                </div>
            </div>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'spaces' ? 'active' : ''}`}
                        onClick={() => setActiveTab('spaces')}
                    >
                        Spaces
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('transactions')}
                    >
                        Transactions
                    </button>
                </li>
            </ul>

            {activeTab === 'overview' && (
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Recent Signups</h5>
                                </div>
                                <div className="card-body">
                                    {data.recentSignups && data.recentSignups.length > 0 ? (
                                        <div className="list-group">
                                            {data.recentSignups.map(user => (
                                                <div key={user.id} className="list-group-item">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h6 className="mb-1">{user.firstName} {user.lastName}</h6>
                                                            <p className="mb-0 small">{user.email}</p>
                                                        </div>
                                                        <span className="badge bg-secondary">{user.userType}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted">No recent signups.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Admin Actions</h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-grid gap-2">
                                        <Link to="/admin/users" className="btn btn-outline-primary">
                                            Manage Users
                                        </Link>
                                        <Link to="/admin/spaces" className="btn btn-outline-success">
                                            Manage Spaces
                                        </Link>
                                        <Link to="/admin/transactions" className="btn btn-outline-info">
                                            View Transactions
                                        </Link>
                                        <Link to="/admin/certifications" className="btn btn-outline-warning">
                                            Manage Certifications
                                        </Link>
                                        <Link to="/admin/settings" className="btn btn-outline-secondary">
                                            System Settings
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5>User Management</h5>
                        <Link to="/admin/users" className="btn btn-sm btn-primary">
                            View All Users
                        </Link>
                    </div>
                    <div className="card-body">
                        <p>User management interface will be implemented here.</p>
                    </div>
                </div>
            )}

            {/* Other tabs would have similar content */}
        </div>
    );
};

export default AdminDashboard;