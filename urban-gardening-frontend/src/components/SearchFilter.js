// src/components/SearchFilter.js
import React from 'react';

const SearchFilter = ({ filters, onFilterChange, searchPlaceholder = "Search..." }) => {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={searchPlaceholder}
                                value={filters.search || ''}
                                onChange={(e) => onFilterChange('search', e.target.value)}
                            />
                            <button className="btn btn-outline-secondary" type="button">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex flex-wrap gap-2">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="organicFilter"
                                    checked={filters.organic || false}
                                    onChange={(e) => onFilterChange('organic', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="organicFilter">
                                    Organic
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="localFilter"
                                    checked={filters.local || false}
                                    onChange={(e) => onFilterChange('local', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="localFilter">
                                    Local
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="availableFilter"
                                    checked={filters.available || false}
                                    onChange={(e) => onFilterChange('available', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="availableFilter">
                                    Available
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;