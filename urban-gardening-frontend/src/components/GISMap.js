// src/components/GISMap.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GISMap = ({ latitude, longitude, onLocationSelect }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleMapClick = (e) => {
        // In a real implementation, this would get coordinates from a map click
        const lat = latitude || -1.9706; // Default to Kigali
        const lng = longitude || 30.1044;

        setSelectedLocation({ lat, lng });
        if (onLocationSelect) {
            onLocationSelect({ lat, lng });
        }

        analyzeLocation(lat, lng);
    };

    const analyzeLocation = async (lat, lng) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8083/api/gis/analyze-space?lat=${lat}&lng=${lng}`);
            setAnalysis(response.data);
        } catch (error) {
            console.error('Error analyzing location:', error);
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5>Location Analysis</h5>
            </div>
            <div className="card-body">
                <div
                    style={{
                        height: '300px',
                        backgroundColor: '#e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        marginBottom: '1rem'
                    }}
                    onClick={handleMapClick}
                >
                    {/* In a real implementation, this would be an interactive map */}
                    <div className="text-center">
                        <i className="fas fa-map-marker-alt fa-3x text-success mb-2"></i>
                        <p>Click to select location on map</p>
                        {selectedLocation && (
                            <small>
                                Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                            </small>
                        )}
                    </div>
                </div>

                {loading && (
                    <div className="text-center">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {analysis && !loading && (
                    <div>
                        <h6>Location Analysis Results:</h6>
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Sunlight Hours
                                <span className="badge bg-primary rounded-pill">{analysis.sunlightHours.toFixed(1)} hrs/day</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Soil Quality
                                <span className="badge bg-info rounded-pill">{analysis.soilQuality.toFixed(1)}/10</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Suitability Score
                                <span className={`badge rounded-pill ${
                                    analysis.suitabilityScore === 'EXCELLENT' ? 'bg-success' :
                                        analysis.suitabilityScore === 'GOOD' ? 'bg-primary' :
                                            analysis.suitabilityScore === 'FAIR' ? 'bg-warning' : 'bg-danger'
                                }`}>
                  {analysis.suitabilityScore}
                </span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GISMap;