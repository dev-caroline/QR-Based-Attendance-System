import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { getSession, markAttendance } from '../services/apiService';
import '../styles/StudentAttendance.css';

const StudentAttendance = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [matricNumber, setMatricNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', 'expired'
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    const fetchSession = async () => {
        try {
            const response = await getSession(sessionId);
            setSession(response.data);

            // Check if session is expired
            const expiresAt = new Date(response.data.expiresAt);
            const now = new Date();
            
            if (response.data.status !== 'active' || now > expiresAt) {
                setStatus('expired');
                setMessage('This session has expired and is no longer accepting attendance.');
            }
        } catch (error) {
            console.error('Error fetching session:', error);
            setStatus('error');
            setMessage('Session not found or has been deleted.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!matricNumber.trim()) {
            setStatus('error');
            setMessage('Please enter your matric number');
            return;
        }

        setSubmitting(true);
        setStatus(null);
        setMessage('');

        try {
            await markAttendance({
                sessionId: sessionId,
                studentId: matricNumber.trim(),
                method: 'qr'
            });

            setStatus('success');
            setMessage('Attendance marked successfully!');
            setMatricNumber('');
            
            // Redirect after 3 seconds
            setTimeout(() => {
                // Could redirect to a thank you page or just show success
            }, 3000);
        } catch (error) {
            setStatus('error');
            setMessage(
                error.response?.data?.message || 
                'Failed to mark attendance. Please try again or contact your lecturer.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="student-attendance-page">
                <div className="attendance-card">
                    <div className="loading-spinner"></div>
                    <p>Loading session...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="student-attendance-page">
                <div className="attendance-card">
                    <XCircle size={64} className="icon-error" />
                    <h2>Session Not Found</h2>
                    <p>This session does not exist or has been deleted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-attendance-page">
            <div className="attendance-card">
                {status === 'expired' ? (
                    <>
                        <Clock size={64} className="icon-warning" />
                        <h2>Session Expired</h2>
                        <p>{message}</p>
                        <div className="session-info-box">
                            <h3>{session.course?.code} - {session.course?.name}</h3>
                            <p>{session.sessionName}</p>
                            <p>{formatDate(session.date)} at {session.time}</p>
                        </div>
                        <p className="help-text">Please contact your lecturer for manual attendance.</p>
                    </>
                ) : status === 'success' ? (
                    <>
                        <CheckCircle size={64} className="icon-success" />
                        <h2>Attendance Marked!</h2>
                        <p>{message}</p>
                        <div className="session-info-box">
                            <h3>{session.course?.code} - {session.course?.name}</h3>
                            <p>{session.sessionName}</p>
                            <p>{formatDate(session.date)} at {session.time}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="attendance-header">
                            <h1>Mark Attendance</h1>
                            <div className="session-info-box">
                                <h3>{session.course?.code} - {session.course?.name}</h3>
                                <p>{session.sessionName}</p>
                                <p>{formatDate(session.date)} at {session.time}</p>
                                {session.location && <p>📍 {session.location}</p>}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="attendance-form">
                            <div className="form-group">
                                <label htmlFor="matricNumber">Matric Number</label>
                                <input
                                    id="matricNumber"
                                    type="text"
                                    value={matricNumber}
                                    onChange={(e) => setMatricNumber(e.target.value.toUpperCase())}
                                    placeholder="e.g., U2020/1234567"
                                    className="matric-input"
                                    disabled={submitting}
                                    autoFocus
                                />
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
                                disabled={submitting || !matricNumber.trim()}
                            >
                                {submitting ? 'Submitting...' : 'Submit Attendance'}
                            </button>
                        </form>

                        <p className="help-text">
                            Can't submit? Request <a href="/request">manual attendance</a> from your lecturer.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentAttendance;
