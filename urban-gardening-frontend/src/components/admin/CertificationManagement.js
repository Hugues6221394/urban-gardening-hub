import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CertificationManagement = () => {
    const [applications, setApplications] = useState([]);
    const [certifiedPartners, setCertifiedPartners] = useState([]);
    const [activeTab, setActiveTab] = useState('applications');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            let url = 'http://localhost:8083/api/admin/certification/';
            url += activeTab === 'applications' ? 'pending-applications' : 'certified-partners';

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (activeTab === 'applications') {
                setApplications(response.data);
            } else {
                setCertifiedPartners(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching certification data:', error);
            setLoading(false);
        }
    };

    const processApplication = async (userId, action) => {
        try {
            const token = localStorage.getItem('token');
            if (action === 'approve') {
                await axios.post(`http://localhost:8083/api/admin/certification/${userId}/approve`, {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                await axios.post(`http://localhost:8083/api/admin/certification/${userId}/reject`, {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            // Refresh data
            fetchData();
            alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
        } catch (error) {
            console.error('Error processing application:', error);
            alert('Error processing application');
        }
    };

    const revokeCertification = async (userId) => {
        if (!window.confirm('Are you sure you want to revoke this certification?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8083/api/admin/certification/${userId}/revoke`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Refresh data
            fetchData();
            alert('Certification revoked successfully!');
        } catch (error) {
            console.error('Error revoking certification:', error);
            alert('Error revoking certification');
        }
    };

    if (loading) {
        return <div className="text-center">Loading certification data...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Certification Management</h4>
            </div>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Pending Applications
                        {applications.length > 0 && (
                            <span className="badge bg-warning ms-2">{applications.length}</span>
                        )}
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'partners' ? 'active' : ''}`}
                        onClick={() => setActiveTab('partners')}
                    >
                        Certified Partners
                        {certifiedPartners.length > 0 && (
                            <span className="badge bg-success ms-2">{certifiedPartners.length}</span>
                        )}
                    </button>
                </li>
            </ul>

            {activeTab === 'applications' ? (
                <div className="card">
                    <div className="card-body">
                        {applications.length === 0 ? (
                            <div className="text-center py-4">
                                <i className="fas fa-check-circle fa-3x text-muted mb-3"></i>
                                <p className="text-muted">No pending applications.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>Business Name</th>
                                        <th>Contact</th>
                                        <th>Type</th>
                                        <th>Local Purchases</th>
                                        <th>Application Date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {applications.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.businessName || `${user.firstName} ${user.lastName}`}</td>
                                            <td>
                                                <div>{user.email}</div>
                                                <small className="text-muted">{user.phoneNumber}</small>
                                            </td>
                                            <td>
                                                <span className="badge bg-info">{user.userType}</span>
                                            </td>
                                            <td>{user.localPurchaseCount || 0}</td>
                                            <td>{new Date(user.certificationDate).toLocaleDateString()}</td>
                                            <td>
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => processApplication(user.id, 'approve')}
                                                    >
                                                        <i className="fas fa-check me-1"></i> Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => processApplication(user.id, 'reject')}
                                                    >
                                                        <i className="fas fa-times me-1"></i> Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        {certifiedPartners.length === 0 ? (
                            <div className="text-center py-4">
                                <i className="fas fa-certificate fa-3x text-muted mb-3"></i>
                                <p className="text-muted">No certified partners.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>Business Name</th>
                                        <th>Contact</th>
                                        <th>Type</th>
                                        <th>Certification Date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {certifiedPartners.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                {user.businessName || `${user.firstName} ${user.lastName}`}
                                                <span className="badge bg-success ms-2">Certified</span>
                                            </td>
                                            <td>
                                                <div>{user.email}</div>
                                                <small className="text-muted">{user.phoneNumber}</small>
                                            </td>
                                            <td>
                                                <span className="badge bg-info">{user.userType}</span>
                                            </td>
                                            <td>{new Date(user.certificationDate).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => revokeCertification(user.id)}
                                                >
                                                    <i className="fas fa-times me-1"></i> Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificationManagement;