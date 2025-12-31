import { Menu, X, Bell, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/apiService';
import '../styles/Navbar.css';

const Navbar = ({ sidebarOpen, toggleSidebar }) => {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        // Fetch notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.notifications);
            setUnreadCount(response.unreadCount);
        } catch (error) {
            // Error fetching notifications
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            try {
                await markNotificationAsRead(notification._id);
                await fetchNotifications();
            } catch (error) {
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            await fetchNotifications();
        } catch (error) {
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <header className="navbar">
            <button onClick={toggleSidebar} className="navbar-toggle">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="navbar-actions">
                <div className="notification-container" ref={notificationRef}>
                    <button 
                        className="notification-button"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="notification-header">
                                <h3>Notifications</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        className="mark-all-read"
                                        onClick={handleMarkAllAsRead}
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="notification-list">
                                {notifications.length === 0 ? (
                                    <div className="notification-empty">
                                        <Bell size={40} />
                                        <p>No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="notification-content">
                                                <h4>{notification.title}</h4>
                                                <p>{notification.message}</p>
                                                <span className="notification-time">
                                                    {getTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>
                                            {!notification.read && (
                                                <div className="notification-unread-dot"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <button className="user-button">
                    <User size={20} />
                    <span>{user?.fullName || 'User'}</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
