import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, X } from 'lucide-react';
import QRCode from 'react-qr-code';
import { getSession } from '../services/apiService';
import axios from 'axios';
import Loader from '../components/Loader';
import '../styles/QRCodeSession.css';

const QRCodeSession = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentToken, setCurrentToken] = useState('');
    const [qrData, setQrData] = useState('');
    const [qrRefreshCount, setQrRefreshCount] = useState(0);

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    // Generate static QR code
    useEffect(() => {
        // Generate QR URL with just sessionId (no rotating token)
        const baseUrl = window.location.origin;
        const qrUrl = `${baseUrl}/session/${sessionId}/attendance`;
        setQrData(qrUrl);
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
        if (!qrData) {
            alert('QR code is not ready yet');
            return;
        }
        
        const svg = document.querySelector('.qr-code-display svg');
        if (!svg) {
            alert('QR code not found');
            return;
        }
        
        // Clone and modify SVG for high quality export
        const svgClone = svg.cloneNode(true);
        svgClone.setAttribute('width', '1024');
        svgClone.setAttribute('height', '1024');
        
        const svgData = new XMLSerializer().serializeToString(svgClone);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 1024;
        canvas.height = 1024;
        
        const img = new Image();
        img.onload = () => {
            // White background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 1024, 1024);
            // Draw QR code
            ctx.drawImage(img, 0, 0, 1024, 1024);
            
            // Download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `${session.course?.code || 'session'}-qr-code.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            }, 'image/png');
        };
        
        img.onerror = () => {
            alert('Failed to generate QR code image');
        };
        
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    };

    const shareSession = async () => {
        if (!qrData) {
            alert('QR code is not ready yet');
            return;
        }

        const shareData = {
            title: `${session.course?.code} - ${session.sessionName}`,
            text: `Join the attendance session for ${session.course?.name}`,
            url: qrData
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    // Fallback to copying link
                    copyToClipboard();
                }
            }
        } else {
            // Fallback for browsers without Web Share API
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(qrData).then(() => {
            alert('Session link copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = qrData;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Session link copied to clipboard!');
        });
    };

    if (loading) {
        return (
            <div className="qr-session-page">
                <Loader />
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
                        {qrData ? (
                            <QRCode
                                value={qrData}
                                size={window.innerWidth <= 640 ? 160 : window.innerWidth <= 768 ? 180 : 240}
                                level="H"
                            />
                        ) : (
                            <div style={{ width: window.innerWidth <= 640 ? 160 : window.innerWidth <= 768 ? 180 : 240, height: window.innerWidth <= 640 ? 160 : window.innerWidth <= 768 ? 180 : 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                                <p style={{ fontSize: window.innerWidth <= 640 ? '11px' : '13px' }}>Loading QR Code...</p>
                            </div>
                        )}
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
                    <button 
                        onClick={shareSession}
                        className="qr-action-button secondary"
                    >
                        <Share2 size={20} />
                        Share Session
                    </button>
                </div>

                <div className="qr-session-footer">
                    <p>
                        Students can scan this QR code to mark their attendance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRCodeSession;
