
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8083/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUser(response.data);
            setFormData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8083/api/profile', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUser(formData);
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }

        setSaving(false);
    };

    if (loading) {
        return <div className="text-center">Loading profile...</div>;
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h4>User Profile</h4>
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setEditing(!editing)}
                        >
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                    <div className="card-body">
                        {editing ? (
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        rows="3"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">Bio</label>
                                    <textarea
                                        className="form-control"
                                        id="bio"
                                        name="bio"
                                        rows="3"
                                        value={formData.bio || ''}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        ) : (
                            <div>
                                <div className="row mb-4">
                                    <div className="col-md-4 text-center">
                                        <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                                             style={{ width: '100px', height: '100px' }}>
                                            <i className="fas fa-user fa-2x text-secondary"></i>
                                        </div>
                                        <h5 className="mt-3">{user.firstName} {user.lastName}</h5>
                                        <span className="badge bg-secondary">{user.userType}</span>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="row">
                                            <div className="col-6">
                                                <p className="mb-1"><strong>Email:</strong></p>
                                                <p>{user.email}</p>
                                            </div>
                                            <div className="col-6">
                                                <p className="mb-1"><strong>Phone:</strong></p>
                                                <p>{user.phoneNumber || 'Not provided'}</p>
                                            </div>
                                            <div className="col-12">
                                                <p className="mb-1"><strong>Address:</strong></p>
                                                <p>{user.address || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {user.bio && (
                                    <div className="mb-4">
                                        <h5>About Me</h5>
                                        <p>{user.bio}</p>
                                    </div>
                                )}

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {user.userType === 'LANDOWNER' ? user.ownedSpaces?.length || 0 :
                                                        user.userType === 'URBAN_FARMER' ? user.farmedSpaces?.length || 0 : 0}
                                                </h5>
                                                <p className="card-text">
                                                    {user.userType === 'LANDOWNER' ? 'Spaces Listed' :
                                                        user.userType === 'URBAN_FARMER' ? 'Farming Spaces' : 'Activities'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </h5>
                                                <p className="card-text">Member Since</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {user.isVerified ? 'Verified' : 'Not Verified'}
                                                </h5>
                                                <p className="card-text">Account Status</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;