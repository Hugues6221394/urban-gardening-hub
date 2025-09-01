import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import GISMap from './GISMap';

const EditSpace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSpace = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8083/api/spaces/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setFormData({
                    title: response.data.title,
                    description: response.data.description,
                    spaceType: response.data.spaceType,
                    area: response.data.area,
                    address: response.data.address,
                    latitude: response.data.latitude,
                    longitude: response.data.longitude,
                    rentPrice: response.data.rentPrice,
                    hasWaterAccess: response.data.hasWaterAccess
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching space:', error);
                setError('Failed to load space details');
                setLoading(false);
            }
        };

        fetchSpace();
    }, [id]);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8083/api/spaces/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Space updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating space:', error);
            setError('Error updating space. Please try again.');
        }

        setSubmitting(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8083/api/spaces/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Space deleted successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting space:', error);
            setError('Error deleting space. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center">Loading space details...</div>;
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4>Edit Space</h4>
                    </div>
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}

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

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Updating...' : 'Update Space'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={submitting}
                                >
                                    Delete Space
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <GISMap
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onLocationSelect={handleLocationSelect}
                />
            </div>
        </div>
    );
};

export default EditSpace;