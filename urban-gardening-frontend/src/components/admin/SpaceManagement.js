import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SpaceManagement = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchSpaces();
    }, [page]);

    const fetchSpaces = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8083/api/admin/spaces?page=${page}&size=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setSpaces(response.data.content);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching spaces:', error);
            setLoading(false);
        }
    };

    const updateSpaceStatus = async (spaceId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8083/api/admin/spaces/${spaceId}/status?status=${status}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Refresh spaces list
            fetchSpaces();
        } catch (error) {
            console.error('Error updating space status:', error);
            alert('Error updating space status');
        }
    };

    if (loading) {
        return <div className="text-center">Loading spaces...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Space Management</h4>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Owner</th>
                                <th>Area</th>
                                <th>Status</th>
                                <th>Rent Price</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {spaces.map(space => (
                                <tr key={space.id}>
                                    <td>{space.title}</td>
                                    <td>
                                        <span className="badge bg-secondary">{space.spaceType}</span>
                                    </td>
                                    <td>{space.owner ? `${space.owner.firstName} ${space.owner.lastName}` : 'N/A'}</td>
                                    <td>{space.area} m²</td>
                                    <td>
                      <span className={`badge ${space.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning'}`}>
                        {space.status}
                      </span>
                                    </td>
                                    <td>RWF {space.rentPrice?.toLocaleString()}</td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <select
                                                className="form-select form-select-sm"
                                                value={space.status}
                                                onChange={(e) => updateSpaceStatus(space.id, e.target.value)}
                                            >
                                                <option value="AVAILABLE">Available</option>
                                                <option value="RENTED">Rented</option>
                                                <option value="UNDER_CULTIVATION">Under Cultivation</option>
                                                <option value="MAINTENANCE">Maintenance</option>
                                            </select>
                                            <button className="btn btn-primary" title="View Details">
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {spaces.length === 0 && (
                        <div className="text-center py-4">
                            <i className="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No spaces found.</p>
                        </div>
                    )}

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
            </div>
        </div>
    );
};

export default SpaceManagement;