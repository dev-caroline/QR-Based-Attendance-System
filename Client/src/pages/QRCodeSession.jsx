import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, X } from 'lucide-react';
import QRCode from 'react-qr-code';
import { getSession } from '../services/apiService';
import '../styles/QRCodeSession.css';

const QRCodeSession = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    const fetchSession = async () => {
        try {
            const response = await getSession(sessionId);
            setSession(response.data);
            
            // Calculate remaining time
            const expiresAt = new Date(response.data.expiresAt);
            const now = new Date();
            const remainingSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
            setCountdown(remainingSeconds);
        } catch (error) {
            console.error('Error fetching session:', error);
            alert('Failed to load session');
            navigate('/sessions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const downloadQR = () => {
        const svg = document.querySelector('.qr-code-display svg');
        if (!svg) return;
        
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        canvas.width = 320;
        canvas.height = 320;

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${session.course?.code || 'session'}-qr-code.png`;
            link.href = url;
            link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    if (loading) {
        return (
            <div className="qr-session-page">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Loading session...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="qr-session-page">
            <div className="qr-session-card">
                <button 
                    onClick={() => navigate('/sessions')}
                    className="qr-close-button"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
                <div className="qr-session-header">
                    <h1 className="qr-session-title">
                        {session.course?.code} - {session.course?.name}
                    </h1>
                    <div className="qr-session-details">
                        <p className="qr-session-date">{session.sessionName}</p>
                        <p className="qr-session-time">{formatDate(session.date)} at {session.time}</p>
                        {session.location && <p className="qr-session-room">Location: {session.location}</p>}
                    </div>
                </div>

                <div className="qr-content-wrapper">
                    <div className="qr-code-display">
                        <QRCode
                            value={session.qrCode || `${window.location.origin}/session/${sessionId}/attendance`}
                            size={240}
                            level="H"
                        />
                    </div>

                    <div className="qr-countdown-card">
                        <p className="qr-countdown-label">Session closes in</p>
                        <p className="qr-countdown-time">{formatTime(countdown)}</p>
                    </div>
                </div>

                <div className="qr-actions">
                    <button 
                        onClick={downloadQR}
                        className="qr-action-button primary"
                    >
                        <Download size={20} />
                        Download QR
                    </button>
                    <button className="qr-action-button secondary">
                        <Share2 size={20} />
                        Share Session
                    </button>
                </div>

                <div className="qr-session-footer">
                    <p>
                        Students can scan this QR code to mark their attendance
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRCodeSession;
