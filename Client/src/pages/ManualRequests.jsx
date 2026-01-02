import { useState, useEffect } from 'react';
import { Search, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getManualRequests, approveRequest, rejectRequest } from '../services/apiService';
import Loader from '../components/Loader';
import '../styles/ManualRequests.css';

const ManualRequests = () => {
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const status = filter === 'all' ? undefined : filter;
            const response = await getManualRequests(status);
            setRequests(response.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm('Approve this attendance request?')) {
            try {
                await approveRequest(id);
                fetchRequests();
            } catch (error) {
                alert('Failed to approve request');
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Reject this attendance request?')) {
            try {
                await rejectRequest(id);
                fetchRequests();
            } catch (error) {
                alert('Failed to reject request');
            }
        }
    };

    const filteredRequests = requests.filter(request => {
        const searchLower = searchQuery.toLowerCase();
        return (
            request.student?.toLowerCase().includes(searchLower) ||
            request.course?.code?.toLowerCase().includes(searchLower) ||
            request.course?.name?.toLowerCase().includes(searchLower)
        );
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="requests-container">
            <div className="requests-header">
                <h1>Manual Attendance Request Review</h1>
                <p>Review and approve student attendance requests</p>
            </div>

            <div style={{ 
                marginBottom: '24px', 
                padding: '16px', 
                background: '#f0f9ff', 
                border: '2px solid #667eea', 
                borderRadius: '12px',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600', marginBottom: '8px' }}>
                    📝 Manual Attendance Page
                </p>
                <p style={{ fontSize: '13px', color: '#075985', marginBottom: '10px' }}>
                    Link for students who can't scan the QR code:
                </p>
                <code style={{ 
                    fontSize: '12px', 
                    background: 'white', 
                    padding: '10px 16px', 
                    borderRadius: '6px',
                    display: 'inline-block',
                    color: '#667eea',
                    fontWeight: '600',
                    wordBreak: 'break-all',
                    border: '1px solid #bae6fd'
                }}>
                    /manual-attendance
                </code>
            </div>

            {/* Search and Filter */}
            <div className="requests-filters">
                <div className="requests-search-wrapper">
                    <Search size={20} className="requests-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by student name or course code..." 
                        className="requests-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-buttons">
                    <button
                        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`filter-button ${filter === 'approved' ? 'active' : ''}`}
                        onClick={() => setFilter('approved')}
                    >
                        Approved
                    </button>
                    <button
                        className={`filter-button ${filter === 'rejected' ? 'active' : ''}`}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : filteredRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
                    <p>No requests found</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="requests-table-container">
                        <table className="requests-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((request) => (
                                    <tr key={request._id}>
                                        <td>
                                            <div className="student-info">
                                                <span className="student-name">{request.student}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="course-name">{request.course?.code} - {request.course?.name}</div>
                                                <div className="course-date">{formatDate(request.session?.date)} at {request.session?.time}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="request-reason">{request.reason}</p>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${request.status}`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            {request.status === 'pending' && (
                                                <div className="request-actions">
                                                    <button
                                                        onClick={() => handleApprove(request._id)}
                                                        className="action-button approve"
                                                        title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request._id)}
                                                        className="action-button reject"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="requests-mobile-list">
                        {filteredRequests.map((request) => (
                            <div key={request._id} className="request-mobile-card">
                                <div className="request-mobile-header">
                                    <div className="request-mobile-student">
                                        <div className="student-name">{request.student}</div>
                                    </div>
                                    <span className={`status-badge ${request.status}`}>
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </span>
                                </div>
                                
                                <div className="request-mobile-body">
                                    <div className="request-mobile-row">
                                        <div className="request-mobile-label">Course</div>
                                        <div className="request-mobile-value">
                                            <div className="course-name">{request.course?.code} - {request.course?.name}</div>
                                            <div className="course-date">{formatDate(request.session?.date)} at {request.session?.time}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="request-mobile-row">
                                        <div className="request-mobile-label">Reason</div>
                                        <div className="request-mobile-value">{request.reason}</div>
                                    </div>
                                </div>

                                {request.status === 'pending' && (
                                    <div className="request-mobile-footer">
                                        <div className="request-actions">
                                            <button
                                                onClick={() => handleApprove(request._id)}
                                                className="action-button approve"
                                                title="Approve"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(request._id)}
                                                className="action-button reject"
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ManualRequests;
