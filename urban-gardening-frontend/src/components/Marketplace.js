// src/components/Marketplace.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Marketplace = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:8083/api/marketplace');
                setListings(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching marketplace listings:', error);
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    if (loading) {
        return <div className="text-center">Loading marketplace listings...</div>;
    }

    return (
        <div>
            <h2 className="mb-4">Fresh Produce Marketplace</h2>
            <div className="row">
                {listings.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info">No produce available at the moment.</div>
                    </div>
                ) : (
                    listings.map(listing => (
                        <div key={listing.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{listing.title}</h5>
                                    {listing.isOrganic && (
                                        <span className="badge bg-success mb-2">Organic</span>
                                    )}
                                    {listing.isLocallyGrown && (
                                        <span className="badge bg-info text-dark mb-2 ms-1">Locally Grown</span>
                                    )}
                                    <p className="card-text">{listing.description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="h5 mb-0">RWF {listing.pricePerUnit?.toLocaleString()}/{listing.unit}</span>
                                        <span className="text-muted">Qty: {listing.quantity} {listing.unit}</span>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-success w-100">Purchase</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Marketplace;