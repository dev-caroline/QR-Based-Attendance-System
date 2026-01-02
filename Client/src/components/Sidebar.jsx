import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CalendarDays, CheckSquare, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLinkClick = () => {
        // Close sidebar on mobile after clicking a link
        if (window.innerWidth <= 500 && onClose) {
            onClose();
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <h2 className="sidebar-title">QR Attendance</h2>
                <button className="sidebar-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <Link 
                    to="/dashboard" 
                    className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                    onClick={handleLinkClick}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>

                <Link 
                    to="/courses" 
                    className={`sidebar-link ${location.pathname === '/courses' ? 'active' : ''}`}
                    onClick={handleLinkClick}
                >
                    <BookOpen size={20} />
                    <span>Courses Management</span>
                </Link>

                <Link 
                    to="/sessions" 
                    className={`sidebar-link ${location.pathname === '/sessions' ? 'active' : ''}`}
                    onClick={handleLinkClick}
                >
                    <CalendarDays size={20} />
                    <span>Session Management</span>
                </Link>

                <Link 
                    to="/manual-requests" 
                    className={`sidebar-link ${location.pathname === '/manual-requests' ? 'active' : ''}`}
                    onClick={handleLinkClick}
                >
                    <CheckSquare size={20} />
                    <span>Manual Requests</span>
                </Link>

                <Link 
                    to="/settings" 
                    className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}
                    onClick={handleLinkClick}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
            </nav>

            <button 
                onClick={handleLogout}
                className="logout-button"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
