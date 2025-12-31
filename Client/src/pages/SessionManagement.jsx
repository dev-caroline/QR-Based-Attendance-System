import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Plus, X, Trash2 } from 'lucide-react';
import { getCourses, getSessions, createSession, endSession, deleteSession } from '../services/apiService';
import Loader from '../components/Loader';
import '../styles/SessionManagement.css';

const SessionManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [showModal, setShowModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        course: '',
        sessionName: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        location: '',
        duration: 10
    });

    useEffect(() => {
        fetchCourses();
        fetchSessions();
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [activeTab]);

    const fetchCourses = async () => {
        try {
            const response = await getCourses();
            setCourses(response.data);
        } catch (error) {
        }
    };

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const status = activeTab === 'active' ? 'active' : 'completed';
            const response = await getSessions(status);
            setSessions(response.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleStartSession = (session) => {
        navigate(`/session/${session._id}/qr-code`);
    };

    const handleEndSession = async (sessionId) => {
        if (window.confirm('Are you sure you want to end this session?')) {
            try {
                await endSession(sessionId);
                fetchSessions();
            } catch (error) {
                alert('Failed to end session');
            }
        }
    };

    const handleDeleteSession = async (sessionId) => {
        if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
            try {
                await deleteSession(sessionId);
                fetchSessions();
            } catch (error) {
                alert('Failed to delete session');
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await createSession(formData);
            const newSession = response.data;
            
            setShowModal(false);
            setFormData({
                course: '',
                sessionName: '',
                date: new Date().toISOString().split('T')[0],
                time: '',
                location: '',
                duration: 10
            });
            
            // Navigate to QR code page for the new session
            navigate(`/session/${newSession._id}/qr-code`);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create session');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError('');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="session-container">
            <div className="session-header">
                <div className="session-header-content">
                    <h1>Session Management</h1>
                    <p>Track and manage your lecture sessions</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="new-session-button"
                >
                    <Plus size={20} />
                    Start New Session
                </button>
            </div>

            {/* Tabs */}
            <div className="session-tabs">
                <button
                    className={`session-tab ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Sessions
                </button>
                <button
                    className={`session-tab ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past Sessions
                </button>
            </div>

            {/* Active Sessions */}
            {activeTab === 'active' && (
                <div className="session-content">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Loading sessions...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
                            <p>No active sessions</p>
                        </div>
                    ) : (
                        <div className="sessions-grid">
                            {sessions.map((session) => (
                                <div key={session._id} className="session-card">
                                    <div className="session-badge session-badge-live">
                                        <span className="session-badge-dot"></span>
                                        Live
                                    </div>
                                    <div className="session-course-code">{session.course?.code}</div>
                                    <h3 className="session-title">{session.sessionName}</h3>
                                    <div className="session-details">
                                        <div className="session-detail-item">
                                            <Calendar size={16} />
                                            <span>{formatDate(session.date)}</span>
                                        </div>
                                        <div className="session-detail-item">
                                            <Clock size={16} />
                                            <span>{session.time}</span>
                                        </div>
                                    </div>
                                    <div className="session-footer">
                                        <span className="session-attendees">{session.attendances?.length || 0} Students Attending</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                onClick={() => handleStartSession(session)}
                                                className="view-qr-button"
                                            >
                                                View QR
                                            </button>
                                            <button 
                                                onClick={() => handleEndSession(session._id)}
                                                className="end-session-button"
                                            >
                                                End
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Past Sessions */}
            {activeTab === 'past' && (
                <div className="session-content">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Loading sessions...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
                            <p>No past sessions</p>
                        </div>
                    ) : (
                        <div className="sessions-grid">
                            {sessions.map((session) => (
                                <div key={session._id} className="session-card">
                                    <div className="session-course-code">{session.course?.code}</div>
                                    <h3 className="session-title">{session.sessionName}</h3>
                                    <div className="session-details">
                                        <div className="session-detail-item">
                                            <Calendar size={16} />
                                            <span>{formatDate(session.date)}</span>
                                        </div>
                                        <div className="session-detail-item">
                                            <Clock size={16} />
                                            <span>{session.time}</span>
                                        </div>
                                    </div>
                                    <div className="session-footer">
                                        <span className="session-attendees">
                                            <span className="session-stats">{session.attendances?.length || 0}</span> Students Attended
                                        </span>
                                        <button 
                                            onClick={() => handleDeleteSession(session._id)}
                                            className="delete-session-button"
                                            title="Delete session"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Create Session Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Start New Session</h2>
                            <button 
                                onClick={handleCloseModal}
                                className="close-button"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#fee',
                                    border: '1px solid #fcc',
                                    borderRadius: '6px',
                                    color: '#c33',
                                    marginBottom: '20px',
                                    fontSize: '14px'
                                }}>
                                    {error}
                                </div>
                            )}
                            <form className="session-modal-form" onSubmit={handleCreateSession}>
                                <div className="session-form-group">
                                    <label className="session-form-label">Select Course *</label>
                                    <select
                                        name="course"
                                        value={formData.course}
                                        onChange={handleInputChange}
                                        required
                                        className="session-form-select"
                                    >
                                        <option value="">Choose a course...</option>
                                        {courses.map((course) => (
                                            <option key={course._id} value={course._id}>
                                                {course.code} - {course.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="session-form-group">
                                    <label className="session-form-label">Session Name *</label>
                                    <input
                                        type="text"
                                        name="sessionName"
                                        value={formData.sessionName}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Lecture 1, Lab Session, Tutorial"
                                        required
                                        className="session-form-input"
                                    />
                                </div>
                                <div className="session-form-group">
                                    <label className="session-form-label">Date *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        className="session-form-input"
                                    />
                                </div>
                                <div className="session-form-group">
                                    <label className="session-form-label">Time *</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        required
                                        className="session-form-input"
                                    />
                                </div>
                                <div className="session-form-group">
                                    <label className="session-form-label">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Room 101, Lab 3"
                                        className="session-form-input"
                                    />
                                </div>
                                <div className="session-form-group">
                                    <label className="session-form-label">Duration (minutes) *</label>
                                    <select
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        required
                                        className="session-form-select"
                                    >
                                        <option value={5}>5 minutes</option>
                                        <option value={10}>10 minutes</option>
                                        <option value={15}>15 minutes</option>
                                        <option value={20}>20 minutes</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={45}>45 minutes</option>
                                        <option value={60}>60 minutes</option>
                                    </select>
                                    <small style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                                        How long will the QR code be active for attendance
                                    </small>
                                </div>
                                <div className="session-modal-actions">
                                    <button 
                                        type="button" 
                                        onClick={handleCloseModal}
                                        className="session-modal-button session-modal-button-cancel"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="session-modal-button session-modal-button-submit"
                                    >
                                        Start Session
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionManagement;
