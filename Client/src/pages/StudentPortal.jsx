import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import '../styles/StudentPortal.css';

const StudentPortal = () => {
    const [courses, setCourses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [formData, setFormData] = useState({
        matricNumber: '',
        course: '',
        session: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (formData.course) {
            fetchSessions(formData.course);
        }
    }, [formData.course]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3500/api/courses/public');
            setCourses(response.data.data || []);
        } catch (error) {
        }
    };

    const fetchSessions = async (courseId) => {
        try {
            const response = await axios.get(`http://localhost:3500/api/sessions/public/${courseId}`);
            setSessions(response.data.data || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setSessions([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        setMessage('');

        try {
            await axios.post('http://localhost:3500/api/manual-requests/public', {
                student: formData.matricNumber.toUpperCase(),
                course: formData.course,
                session: formData.session,
                reason: formData.reason
            });

            setStatus('success');
            setMessage('Manual attendance request submitted successfully! Your lecturer will review it.');
            setFormData({
                matricNumber: '',
                course: '',
                session: '',
                reason: ''
            });
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="student-portal-page">
            <div className="portal-container">
                <div className="portal-header">
                    <h1>Manual Attendance Request</h1>
                    <p>Missed the QR scan? Submit a request to your lecturer</p>
                </div>

                <div className="portal-card">
                    {status === 'success' ? (
                        <div className="success-state">
                            <CheckCircle size={64} className="icon-success" />
                            <h2>Request Submitted!</h2>
                            <p>{message}</p>
                            <button 
                                onClick={() => setStatus(null)}
                                className="submit-button"
                                style={{ marginTop: '20px' }}
                            >
                                Submit Another Request
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="portal-form">
                            <div className="form-section">
                                <h3>Student Information</h3>
                                
                                <div className="form-group">
                                    <label>Matric Number *</label>
                                    <input
                                        type="text"
                                        value={formData.matricNumber}
                                        onChange={(e) => setFormData({...formData, matricNumber: e.target.value})}
                                        placeholder="e.g., U2020/1234567"
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Session Details</h3>
                                
                                <div className="form-group">
                                    <label>Course *</label>
                                    <select
                                        value={formData.course}
                                        onChange={(e) => setFormData({...formData, course: e.target.value, session: ''})}
                                        required
                                        className="form-select"
                                    >
                                        <option value="">Select a course...</option>
                                        {courses.map((course) => (
                                            <option key={course._id} value={course._id}>
                                                {course.code} - {course.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Session *</label>
                                    <select
                                        value={formData.session}
                                        onChange={(e) => setFormData({...formData, session: e.target.value})}
                                        required
                                        disabled={!formData.course}
                                        className="form-select"
                                    >
                                        <option value="">Select a session...</option>
                                        {sessions.map((session) => (
                                            <option key={session._id} value={session._id}>
                                                {session.sessionName} - {formatDate(session.date)} at {session.time}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Reason for Manual Request *</label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                        placeholder="Explain why you couldn't scan the QR code (e.g., phone issue, late arrival, network problem)"
                                        required
                                        rows={4}
                                        className="form-textarea"
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="error-message">
                                    <XCircle size={20} />
                                    <span>{message}</span>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="portal-info">
                    <p>📌 Your lecturer will review and approve/reject your request</p>
                    <p>📌 Make sure all information is accurate</p>
                    <p>📌 Submit as soon as possible after missing the session</p>
                </div>
            </div>
        </div>
    );
};

export default StudentPortal;
