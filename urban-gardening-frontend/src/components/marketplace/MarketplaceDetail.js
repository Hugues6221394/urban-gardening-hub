// src/components/marketplace/MarketplaceDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const MarketplaceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await axios.get(`http://localhost:8083/api/marketplace/${id}`);
                setListing(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching listing:', error);
                setError('Failed to load listing details');
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const handlePurchase = () => {
        navigate(`/checkout/${id}`);
    };

    if (loading) {
        return <div className="text-center">Loading listing details...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!listing) {
        return <div className="alert alert-warning">Listing not found.</div>;
    }

    return (
        <div className="row">
            <div className="col-md-8">
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <h2>{listing.title}</h2>
                            <div>
                                {listing.isOrganic && (
                                    <span className="badge bg-success me-1">Organic</span>
                                )}
                                {listing.isLocallyGrown && (
                                    <span className="badge bg-info text-dark">Locally Grown</span>
                                )}
                            </div>
                        </div>

                        <p className="card-text">{listing.description}</p>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <h5>Product Details</h5>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <strong>Quantity Available:</strong> {listing.quantity} {listing.unit}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Price:</strong> RWF {listing.pricePerUnit?.toLocaleString()}/{listing.unit}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Total Value:</strong> RWF {listing.totalPrice?.toLocaleString()}
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <h5>Availability</h5>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <strong>Available From:</strong> {listing.availableFrom ? new Date(listing.availableFrom).toLocaleDateString() : 'Immediately'}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Available Until:</strong> {listing.availableUntil ? new Date(listing.availableUntil).toLocaleDateString() : 'Not specified'}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Status:</strong>
                                        <span className={`badge ${listing.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'} ms-2`}>
                      {listing.status}
                    </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card mb-4">
                    <div className="card-header">
                        <h5>Seller Information</h5>
                    </div>
                    <div className="card-body">
                        {listing.seller ? (
                            <>
                                <h6>{listing.seller.firstName} {listing.seller.lastName}</h6>
                                <p className="text-muted">{listing.seller.email}</p>
                                <p className="text-muted">{listing.seller.phoneNumber}</p>
                                <div className="d-flex align-items-center">
                                    <span className="badge bg-secondary me-2">{listing.seller.userType}</span>
                                    {listing.seller.isVerified && (
                                        <span className="badge bg-success">
                      <i className="fas fa-check-circle me-1"></i> Verified
                    </span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-muted">Seller information not available.</p>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h5>Purchase</h5>
                    </div>
                    <div className="card-body">
                        {listing.status === 'ACTIVE' ? (
                            <>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-success btn-lg" onClick={handlePurchase}>
                                        <i className="fas fa-shopping-cart me-2"></i> Purchase Now
                                    </button>
                                    <button className="btn btn-outline-primary">
                                        <i className="fas fa-envelope me-2"></i> Contact Seller
                                    </button>
                                </div>
                                <div className="mt-3">
                                    <small className="text-muted">
                                        <i className="fas fa-info-circle me-1"></i>
                                        Platform fee: 5% (RWF {(listing.totalPrice * 0.05).toLocaleString()})
                                    </small>
                                </div>
                            </>
                        ) : (
                            <div className="alert alert-warning">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                This listing is no longer available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceDetail;