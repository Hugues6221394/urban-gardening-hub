import React from 'react';
import { Link } from 'react-router-dom';

const FarmerDashboard = ({ data }) => {
    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.farmingSpaces || 0}</h5>
                            <p className="card-text">Farming Spaces</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.activeListings || 0}</h5>
                            <p className="card-text">Active Listings</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">RWF {data.monthlyEarnings ? data.monthlyEarnings.toLocaleString() : '0'}</h5>
                            <p className="card-text">Monthly Earnings</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Your Active Listings</h5>
                        </div>
                        <div className="card-body">
                            {data.recentListings && data.recentListings.length > 0 ? (
                                <div className="list-group">
                                    {data.recentListings.map(listing => (
                                        <div key={listing.id} className="list-group-item">
                                            <div className="d-flex justify-content-between">
                                                <h6 className="mb-1">{listing.title}</h6>
                                                <span className="badge bg-success">RWF {listing.pricePerUnit?.toLocaleString()}/{listing.unit}</span>
                                            </div>
                                            <p className="mb-1 small">{listing.quantity} {listing.unit} available</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">You don't have any active listings.</p>
                            )}
                            <div className="mt-3">
                                <Link to="/marketplace/sell" className="btn btn-success">
                                    Create New Listing
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link to="/spaces" className="btn btn-outline-primary">
                                    Find Farming Spaces
                                </Link>
                                <Link to="/marketplace" className="btn btn-outline-success">
                                    Browse Marketplace
                                </Link>
                                <Link to="/crops" className="btn btn-outline-info">
                                    Manage Crops
                                </Link>
                                <Link to="/profile" className="btn btn-outline-secondary">
                                    Update Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;