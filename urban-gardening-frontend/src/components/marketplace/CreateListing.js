import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        crop: null,
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        isOrganic: true,
        isLocallyGrown: true,
        availableFrom: '',
        availableUntil: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8083/api/marketplace', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Listing created successfully!');
            navigate('/marketplace');
        } catch (error) {
            console.error('Error creating listing:', error);
            setError('Error creating listing. Please try again.');
        }

        setSubmitting(false);
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header">
                        <h4>Create New Listing</h4>
                    </div>
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="title" className="form-label">Product Title</label>
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
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="quantity" className="form-label">Quantity</label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="quantity"
                                            name="quantity"
                                            min="0.1"
                                            step="0.1"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            required
                                        />
                                        <select
                                            className="form-select"
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleChange}
                                        >
                                            <option value="kg">kg</option>
                                            <option value="g">g</option>
                                            <option value="pieces">pieces</option>
                                            <option value="bunch">bunch</option>
                                            <option value="bundle">bundle</option>
                                        </select>
                                    </div>
                                </div>
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
                                    <label htmlFor="pricePerUnit" className="form-label">Price Per Unit (RWF)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="pricePerUnit"
                                        name="pricePerUnit"
                                        min="0"
                                        step="10"
                                        value={formData.pricePerUnit}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="availableFrom" className="form-label">Available From</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="availableFrom"
                                        name="availableFrom"
                                        value={formData.availableFrom}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isOrganic"
                                            name="isOrganic"
                                            checked={formData.isOrganic}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="isOrganic">
                                            Organic Produce
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isLocallyGrown"
                                            name="isLocallyGrown"
                                            checked={formData.isLocallyGrown}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="isLocallyGrown">
                                            Locally Grown
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Creating...' : 'Create Listing'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/marketplace')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;