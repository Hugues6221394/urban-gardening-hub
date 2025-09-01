import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchUsers();
    }, [page, filter]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            let url = `http://localhost:8083/api/admin/users?page=${page}&size=10`;

            if (filter !== 'ALL') {
                url = `http://localhost:8083/api/admin/users/${filter}?page=${page}&size=10`;
            }

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const updateUserStatus = async (userId, isActive, isVerified) => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();

            if (isActive !== undefined) params.append('isActive', isActive);
            if (isVerified !== undefined) params.append('isVerified', isVerified);

            await axios.patch(`http://localhost:8083/api/admin/users/${userId}/status?${params}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Refresh users list
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Error updating user status');
        }
    };

    if (loading) {
        return <div className="text-center">Loading users...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>User Management</h4>
                <select
                    className="form-select w-auto"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="ALL">All Users</option>
                    <option value="LANDOWNER">Landowners</option>
                    <option value="URBAN_FARMER">Urban Farmers</option>
                    <option value="RESTAURANT">Restaurants</option>
                    <option value="SUPERMARKET">Supermarkets</option>
                    <option value="INDIVIDUAL">Individuals</option>
                    <option value="ADMIN">Admins</option>
                </select>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Verified</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className="badge bg-secondary">{user.userType}</span>
                                    </td>
                                    <td>
                      <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                                    </td>
                                    <td>
                      <span className={`badge ${user.isVerified ? 'bg-success' : 'bg-warning'}`}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                className={`btn ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() => updateUserStatus(user.id, !user.isActive, undefined)}
                                                title={user.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                <i className={`fas ${user.isActive ? 'fa-user-times' : 'fa-user-check'}`}></i>
                                            </button>
                                            <button
                                                className={`btn ${user.isVerified ? 'btn-warning' : 'btn-info'}`}
                                                onClick={() => updateUserStatus(user.id, undefined, !user.isVerified)}
                                                title={user.isVerified ? 'Unverify' : 'Verify'}
                                            >
                                                <i className={`fas ${user.isVerified ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
                                            </button>
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

                    {users.length === 0 && (
                        <div className="text-center py-4">
                            <i className="fas fa-users fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No users found.</p>
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

export default UserManagement;