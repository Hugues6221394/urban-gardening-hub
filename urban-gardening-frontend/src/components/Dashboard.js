import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandownerDashboard from './dashboards/LandownerDashboard';
import FarmerDashboard from './dashboards/FarmerDashboard';
import BuyerDashboard from './dashboards/BuyerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:8083/api/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setDashboardData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard');
                setLoading(false);

                // If unauthorized, redirect to login
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger mt-4" role="alert">
                {error}
            </div>
        );
    }

    if (!dashboardData || !dashboardData.user) {
        return (
            <div className="alert alert-warning mt-4" role="alert">
                No dashboard data available.
            </div>
        );
    }

    const { user } = dashboardData;

    const renderDashboard = () => {
        switch (user.userType) {
            case 'LANDOWNER':
                return <LandownerDashboard data={dashboardData} />;
            case 'URBAN_FARMER':
                return <FarmerDashboard data={dashboardData} />;
            case 'RESTAURANT':
            case 'SUPERMARKET':
            case 'INDIVIDUAL':
                return <BuyerDashboard data={dashboardData} />;
            case 'ADMIN':
                return <AdminDashboard data={dashboardData} />;
            default:
                return (
                    <div className="alert alert-warning" role="alert">
                        No dashboard available for your user type: {user.userType}
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Welcome back, {user.name}!</h2>
                <span className="badge bg-secondary">{user.userType.toLowerCase().replace('_', ' ')}</span>
            </div>
            {renderDashboard()}
        </div>
    );
};

export default Dashboard;