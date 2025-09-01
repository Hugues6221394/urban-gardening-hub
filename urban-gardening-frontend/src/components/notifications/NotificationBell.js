import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Set up polling for new notifications
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8083/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:8083/api/notifications/${notificationId}/read`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Update local state
            setNotifications(notifications.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            ));
            setUnreadCount(unreadCount - 1);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8083/api/notifications/mark-all-read', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Update local state
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    return (
        <div className="dropdown">
            <button
                className="btn btn-link nav-link position-relative"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
                )}
            </button>

            {showDropdown && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ width: '300px' }}>
                    <div className="dropdown-header d-flex justify-content-between align-items-center">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                className="btn btn-sm btn-link"
                                onClick={markAllAsRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="dropdown-divider"></div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div className="text-center py-3">
                                <i className="fas fa-bell-slash fa-2x text-muted mb-2"></i>
                                <p className="text-muted mb-0">No notifications</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`dropdown-item ${!notification.isRead ? 'bg-light' : ''}`}
                                    onClick={() => markAsRead(notification.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="d-flex justify-content-between">
                                        <h6 className="mb-1">{notification.title}</h6>
                                        <small className="text-muted">
                                            {new Date(notification.createdAt).toLocaleTimeString()}
                                        </small>
                                    </div>
                                    <p className="mb-0 small">{notification.message}</p>
                                    {!notification.isRead && (
                                        <span className="badge bg-primary float-end">New</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item text-center">
                        <a href="/notifications" className="btn btn-sm btn-outline-primary">
                            View All Notifications
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;