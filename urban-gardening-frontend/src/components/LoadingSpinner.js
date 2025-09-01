// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClass = {
        sm: 'spinner-border-sm',
        md: '',
        lg: 'spinner-border-lg'
    }[size];

    return (
        <div className="text-center my-4">
            <div className={`spinner-border text-success ${sizeClass}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            {text && <p className="mt-2">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;