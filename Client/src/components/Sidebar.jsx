import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CalendarDays, CheckSquare, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <h2 className="sidebar-title">QR Attendance</h2>
            </div>

            <nav className="sidebar-nav">
                <Link 
                    to="/dashboard" 
                    className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>

                <Link 
                    to="/courses" 
                    className={`sidebar-link ${location.pathname === '/courses' ? 'active' : ''}`}
                >
                    <BookOpen size={20} />
                    <span>Courses Management</span>
                </Link>

                <Link 
                    to="/sessions" 
                    className={`sidebar-link ${location.pathname === '/sessions' ? 'active' : ''}`}
                >
                    <CalendarDays size={20} />
                    <span>Session Management</span>
                </Link>

                <Link 
                    to="/manual-requests" 
                    className={`sidebar-link ${location.pathname === '/manual-requests' ? 'active' : ''}`}
                >
                    <CheckSquare size={20} />
                    <span>Manual Requests</span>
                </Link>

                <Link 
                    to="/settings" 
                    className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}
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
