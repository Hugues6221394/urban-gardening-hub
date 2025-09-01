// src/components/ErrorDisplay.js
import React from 'react';

const ErrorDisplay = ({ error, onRetry }) => {
    return (
        <div className="alert alert-danger" role="alert">
            <div className="d-flex align-items-center">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <h6 className="alert-heading mb-0">Something went wrong</h6>
            </div>
            <hr />
            <p className="mb-2">{error.message || 'An unexpected error occurred'}</p>
            {onRetry && (
                <button className="btn btn-outline-danger btn-sm" onClick={onRetry}>
                    <i className="fas fa-redo me-1"></i> Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorDisplay;