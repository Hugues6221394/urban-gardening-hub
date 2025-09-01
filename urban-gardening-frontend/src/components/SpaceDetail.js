import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const SpaceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cropRecommendations, setCropRecommendations] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchSpaceData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');

                if (userData) {
                    setUser(JSON.parse(userData));
                }

                const response = await axios.get(`http://localhost:8083/api/spaces/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setSpace(response.data);

                // Fetch crop recommendations
                const cropResponse = await axios.get(`http://localhost:8083/api/spaces/${id}/crop-recommendations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setCropRecommendations(cropResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching space details:', error);
                setError('Failed to load space details');
                setLoading(false);
            }
        };

        fetchSpaceData();
    }, [id]);

    const handleRentSpace = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8083/api/spaces/${id}/assign-farmer/${user.id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Space rented successfully! You can now start farming here.');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error renting space:', error);
            alert('Error renting space. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center">Loading space details...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!space) {
        return <div className="alert alert-warning">Space not found.</div>;
    }

    const isOwner = user && space.owner && user.id === space.owner.id;
    const isFarmer = user && space.farmer && user.id === space.farmer.id;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{space.title}</h2>
                <span className={`badge ${space.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning'}`}>
          {space.status}
        </span>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Description</h5>
                            <p className="card-text">{space.description}</p>

                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <h6>Space Details</h6>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <strong>Type:</strong> {space.spaceType}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Area:</strong> {space.area} m²
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Rent:</strong> RWF {space.rentPrice?.toLocaleString()}/month
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Water Access:</strong> {space.hasWaterAccess ? 'Yes' : 'No'}
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <h6>Environmental Conditions</h6>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <strong>Sunlight:</strong> {space.sunlightHours} hours/day
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Soil Quality:</strong> {space.soilQuality}/10
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Address:</strong> {space.address}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <h5>AI Crop Recommendations</h5>
                        </div>
                        <div className="card-body">
                            {cropRecommendations.length > 0 ? (
                                <div className="row">
                                    {cropRecommendations.slice(0, 4).map((crop, index) => (
                                        <div key={index} className="col-md-6 mb-2">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h6 className="card-title">{crop.cropName}</h6>
                                                    <div className="d-flex justify-content-between">
                                                        <span className="badge bg-info">Suitability: {(crop.suitabilityScore * 100).toFixed(0)}%</span>
                                                        <span className="badge bg-success">Yield: {crop.estimatedYield.toFixed(1)} kg</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No crop recommendations available.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5>Owner Information</h5>
                        </div>
                        <div className="card-body">
                            {space.owner ? (
                                <>
                                    <h6>{space.owner.firstName} {space.owner.lastName}</h6>
                                    <p className="text-muted">{space.owner.email}</p>
                                    <p className="text-muted">{space.owner.phoneNumber}</p>
                                </>
                            ) : (
                                <p className="text-muted">Owner information not available.</p>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5>Actions</h5>
                        </div>
                        <div className="card-body">
                            {isOwner ? (
                                <div className="d-grid gap-2">
                                    <Link to={`/edit-space/${space.id}`} className="btn btn-primary">
                                        Edit Space
                                    </Link>
                                    <button className="btn btn-outline-secondary">
                                        View Applications
                                    </button>
                                </div>
                            ) : space.status === 'AVAILABLE' && user?.userType === 'URBAN_FARMER' ? (
                                <div className="d-grid gap-2">
                                    <button className="btn btn-success" onClick={handleRentSpace}>
                                        Rent This Space
                                    </button>
                                    <button className="btn btn-outline-primary">
                                        Contact Owner
                                    </button>
                                </div>
                            ) : isFarmer ? (
                                <div className="d-grid gap-2">
                                    <button className="btn btn-info">
                                        Manage Farming
                                    </button>
                                    <button className="btn btn-outline-secondary">
                                        Release Space
                                    </button>
                                </div>
                            ) : (
                                <div className="d-grid gap-2">
                                    <button className="btn btn-outline-primary" disabled>
                                        Space Not Available
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpaceDetail;