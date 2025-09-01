import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MarketplaceList = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        search: '',
        organic: false,
        local: false
    });

    useEffect(() => {
        fetchListings();
    }, [page, filters]);

    const fetchListings = async () => {
        try {
            const params = new URLSearchParams({
                page: page,
                size: 12,
                ...(filters.search && { search: filters.search }),
                ...(filters.organic && { organic: true }),
                ...(filters.local && { local: true })
            });

            const response = await axios.get(`http://localhost:8083/api/marketplace?${params}`);
            setListings(response.data.content);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setLoading(false);
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setPage(0); // Reset to first page when filters change
    };

    if (loading) {
        return <div className="text-center">Loading marketplace...</div>;
    }

    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>Fresh Produce Marketplace</h2>
                </div>
                <div className="col-md-6 text-end">
                    <Link to="/marketplace/sell" className="btn btn-success">
                        <i className="fas fa-plus me-1"></i> Sell Produce
                    </Link>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search for produce..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                                <button className="btn btn-outline-secondary" type="button">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="organicFilter"
                                    checked={filters.organic}
                                    onChange={(e) => handleFilterChange('organic', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="organicFilter">
                                    Organic Only
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="localFilter"
                                    checked={filters.local}
                                    onChange={(e) => handleFilterChange('local', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="localFilter">
                                    Local Only
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {listings.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <i className="fas fa-seedling fa-3x text-muted mb-3"></i>
                        <h5>No listings found</h5>
                        <p className="text-muted">Try adjusting your search filters or check back later.</p>
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
                                    <div className="d-grid gap-2">
                                        <button className="btn btn-success">Purchase</button>
                                        <Link to={`/marketplace/${listing.id}`} className="btn btn-outline-primary">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>
                                Previous
                            </button>
                        </li>

                        {[...Array(totalPages).keys()].map(pageNumber => (
                            <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(pageNumber)}>
                                    {pageNumber + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default MarketplaceList;