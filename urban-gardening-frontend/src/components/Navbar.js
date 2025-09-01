
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './notifications/NotificationBell';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    🌱 Urban Kitchen Gardening Hub
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/spaces">Spaces</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/marketplace">Marketplace</Link>
                        </li>
                        {user && user.userType === 'LANDOWNER' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/add-space">Add Space</Link>
                            </li>
                        )}
                        {user && user.userType === 'URBAN_FARMER' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/marketplace/sell">Sell Produce</Link>
                            </li>
                        )}
                        {user && user.userType === 'ADMIN' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">Admin</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">
                                        <i className="fas fa-tachometer-alt me-1"></i> Dashboard
                                    </Link>
                                </li>
                                {user.userType === 'RESTAURANT' || user.userType === 'SUPERMARKET' ? (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/green-partner">
                                            <i className="fas fa-certificate me-1"></i> Green Partner
                                        </Link>
                                    </li>
                                ) : null}
                                {user.userType === 'URBAN_FARMER' && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/iot-dashboard">
                                            <i className="fas fa-microchip me-1"></i> IoT Dashboard
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <NotificationBell />
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        <i className="fas fa-user me-1"></i> Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt me-1"></i> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;