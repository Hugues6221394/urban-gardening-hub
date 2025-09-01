import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandownerDashboard = ({ data }) => {
    const [showSpaces, setShowSpaces] = useState(false);

    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.totalSpaces || 0}</h5>
                            <p className="card-text">Total Spaces</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.rentedSpaces || 0}</h5>
                            <p className="card-text">Rented Spaces</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.availableSpaces || 0}</h5>
                            <p className="card-text">Available Spaces</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">RWF {data.monthlyRentalIncome ? data.monthlyRentalIncome.toLocaleString() : '0'}</h5>
                            <p className="card-text">Monthly Income</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Your Spaces</h4>
                <div>
                    <Link to="/add-space" className="btn btn-success me-2">
                        <i className="fas fa-plus me-1"></i> Add New Space
                    </Link>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setShowSpaces(!showSpaces)}
                    >
                        {showSpaces ? 'Hide' : 'Show'} Details
                    </button>
                </div>
            </div>

            {showSpaces && data.recentSpaces && data.recentSpaces.length > 0 ? (
                <div className="row">
                    {data.recentSpaces.map(space => (
                        <div key={space.id} className="col-md-6 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{space.title}</h5>
                                    <p className="card-text">{space.description}</p>
                                    <div className="d-flex justify-content-between">
                                        <span className="badge bg-info">{space.spaceType}</span>
                                        <span className="badge bg-success">RWF {space.rentPrice?.toLocaleString()}/month</span>
                                        <span className={`badge ${space.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning'}`}>
                      {space.status}
                    </span>
                                    </div>
                                    <div className="mt-2">
                                        <Link to={`/space/${space.id}`} className="btn btn-sm btn-outline-primary me-1">
                                            View
                                        </Link>
                                        <Link to={`/edit-space/${space.id}`} className="btn btn-sm btn-outline-secondary me-1">
                                            Edit
                                        </Link>
                                        <button className="btn btn-sm btn-outline-danger">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-info">
                    {data.recentSpaces && data.recentSpaces.length === 0
                        ? "You haven't added any spaces yet."
                        : "Click 'Show Details' to view your spaces."}
                </div>
            )}

            <div className="mt-4">
                <h4>Quick Actions</h4>
                <div className="d-flex gap-2">
                    <Link to="/spaces" className="btn btn-outline-primary">
                        Browse All Spaces
                    </Link>
                    <Link to="/marketplace" className="btn btn-outline-success">
                        Visit Marketplace
                    </Link>
                    <Link to="/profile" className="btn btn-outline-info">
                        Update Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandownerDashboard;