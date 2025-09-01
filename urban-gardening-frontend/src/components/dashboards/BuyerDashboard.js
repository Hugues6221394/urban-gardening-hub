import React from 'react';
import { Link } from 'react-router-dom';

const BuyerDashboard = ({ data }) => {
    const isBusiness = data.user.userType === 'RESTAURANT' || data.user.userType === 'SUPERMARKET';

    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">{data.totalPurchases || 0}</h5>
                            <p className="card-text">Total Purchases</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">RWF {data.totalSpent ? data.totalSpent.toLocaleString() : '0'}</h5>
                            <p className="card-text">Total Spent</p>
                        </div>
                    </div>
                </div>
                {isBusiness && (
                    <div className="col-md-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {data.greenPartnerStatus === 'CERTIFIED' ? (
                                        <i className="fas fa-certificate text-success"></i>
                                    ) : data.greenPartnerStatus === 'PENDING' ? (
                                        <i className="fas fa-clock text-warning"></i>
                                    ) : (
                                        <i className="fas fa-times-circle text-secondary"></i>
                                    )}
                                </h5>
                                <p className="card-text">
                                    {data.greenPartnerStatus === 'CERTIFIED' ? 'Green Partner' :
                                        data.greenPartnerStatus === 'PENDING' ? 'Pending Certification' : 'Not Certified'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5>Recent Purchases</h5>
                            <Link to="/marketplace" className="btn btn-sm btn-success">
                                Shop Now
                            </Link>
                        </div>
                        <div className="card-body">
                            {data.recentPurchases && data.recentPurchases.length > 0 ? (
                                <div className="list-group">
                                    {data.recentPurchases.map(purchase => (
                                        <div key={purchase.id} className="list-group-item">
                                            <div className="d-flex justify-content-between">
                                                <h6 className="mb-1">{purchase.listing?.title}</h6>
                                                <span className="badge bg-primary">RWF {purchase.totalAmount?.toLocaleString()}</span>
                                            </div>
                                            <p className="mb-1 small">Purchased on {new Date(purchase.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">You haven't made any purchases yet.</p>
                                    <Link to="/marketplace" className="btn btn-success">
                                        Browse Marketplace
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h5>Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link to="/marketplace" className="btn btn-outline-primary">
                                    Browse Produce
                                </Link>
                                <Link to="/farms" className="btn btn-outline-success">
                                    Discover Local Farms
                                </Link>
                                {isBusiness && (
                                    <Link to="/green-partner" className="btn btn-outline-info">
                                        Green Partner Program
                                    </Link>
                                )}
                                <Link to="/profile" className="btn btn-outline-secondary">
                                    Update Profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {isBusiness && data.greenPartnerStatus === 'CERTIFIED' && (
                        <div className="card mt-3 border-success">
                            <div className="card-header bg-success text-white">
                                <h6 className="mb-0">Green City Partner</h6>
                            </div>
                            <div className="card-body">
                                <p className="small">You are a certified Green City Partner!</p>
                                <button className="btn btn-sm btn-outline-success">
                                    Download Certificate
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;