import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Spaces = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await axios.get('http://localhost:8083/api/spaces');
                setSpaces(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching spaces:', error);
                setLoading(false);
            }
        };

        fetchSpaces();
    }, []);

    if (loading) {
        return <div className="text-center">Loading available spaces...</div>;
    }

    return (
        <div>
            <h2 className="mb-4">Available Farming Spaces</h2>
            <div className="row">
                {spaces.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info">No spaces available at the moment.</div>
                    </div>
                ) : (
                    spaces.map(space => (
                        <div key={space.id} className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{space.title}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">
                                        {space.spaceType} • {space.area} m²
                                    </h6>
                                    <p className="card-text">{space.description}</p>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <strong>Location:</strong> {space.address}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Sunlight:</strong> {space.sunlightHours} hours/day
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Water Access:</strong> {space.hasWaterAccess ? 'Yes' : 'No'}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Soil Quality:</strong> {space.soilQuality}/10
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Rent:</strong> RWF {space.rentPrice?.toLocaleString()}/month
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-success">Express Interest</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Spaces;