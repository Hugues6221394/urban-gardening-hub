// src/components/AddSpace.js
import React, { useState } from 'react';
import axios from 'axios';
import GISMap from './GISMap';

const AddSpace = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        spaceType: 'ROOFTOP',
        area: '',
        address: '',
        latitude: '',
        longitude: '',
        rentPrice: '',
        hasWaterAccess: false
    });
    const [locationSelected, setLocationSelected] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLocationSelect = (location) => {
        setFormData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng
        }));
        setLocationSelected(true);
    };

    const handleAnalyzeLocation = async (analysisData) => {
        setAnalysis(analysisData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Get auth token from storage
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8083/api/spaces', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('Space added successfully!');
            // Reset form
            setFormData({
                title: '',
                description: '',
                spaceType: 'ROOFTOP',
                area: '',
                address: '',
                latitude: '',
                longitude: '',
                rentPrice: '',
                hasWaterAccess: false
            });
            setLocationSelected(false);
            setAnalysis(null);
        } catch (error) {
            console.error('Error adding space:', error);
            alert('Error adding space. Please try again.');
        }

        setSubmitting(false);
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4>Add New Space</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="spaceType" className="form-label">Space Type</label>
                                    <select
                                        className="form-select"
                                        id="spaceType"
                                        name="spaceType"
                                        value={formData.spaceType}
                                        onChange={handleChange}
                                    >
                                        <option value="ROOFTOP">Rooftop</option>
                                        <option value="BALCONY">Balcony</option>
                                        <option value="VACANT_LOT">Vacant Lot</option>
                                        <option value="PARKING_LOT">Parking Lot</option>
                                        <option value="COMMUNITY_GARDEN">Community Garden</option>
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="area" className="form-label">Area (m²)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="area"
                                        name="area"
                                        min="1"
                                        step="0.1"
                                        value={formData.area}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="hasWaterAccess"
                                    name="hasWaterAccess"
                                    checked={formData.hasWaterAccess}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="hasWaterAccess">
                                    Has water access
                                </label>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="rentPrice" className="form-label">Monthly Rent (RWF)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="rentPrice"
                                    name="rentPrice"
                                    min="0"
                                    step="1000"
                                    value={formData.rentPrice}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={!locationSelected || submitting}
                            >
                                {submitting ? 'Adding Space...' : 'Add Space'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <GISMap
                    onLocationSelect={handleLocationSelect}
                    onAnalysisComplete={handleAnalyzeLocation}
                />

                {analysis && (
                    <div className="card mt-3">
                        <div className="card-header">
                            <h6>AI Recommendations</h6>
                        </div>
                        <div className="card-body">
                            <p>Based on your location analysis, we recommend:</p>
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Tomatoes</span>
                                        <span className="badge bg-success">Highly Suitable</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Lettuce</span>
                                        <span className="badge bg-primary">Suitable</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Herbs</span>
                                        <span className="badge bg-primary">Suitable</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddSpace;