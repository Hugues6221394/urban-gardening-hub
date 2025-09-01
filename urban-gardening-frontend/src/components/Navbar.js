
import React from 'react';
import { Link } from 'react-router-dom';

// Update Navbar.js to show different links based on authentication
const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setIsAuthenticated(true);
            const user = JSON.parse(userData);
            setUserType(user.userType);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUserType(null);
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    🌱 Urban Kitchen Gardening Hub
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
                        {isAuthenticated && userType === 'LANDOWNER' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/add-space">Add Space</Link>
                            </li>
                        )}
                        {isAuthenticated && userType === 'URBAN_FARMER' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/marketplace/sell">Sell Produce</Link>
                            </li>
                        )}
                        {isAuthenticated && userType === 'ADMIN' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">Admin</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">
                                        <i className="fas fa-tachometer-alt me-1"></i> Dashboard
                                    </Link>
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