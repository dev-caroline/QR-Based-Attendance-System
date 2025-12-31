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
                                        <div className="student-avatar">
                                            {request.student?.substring(0, 2) || 'ST'}
                                        </div>
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
            )}
        </div>
    );
};

export default ManualRequests;
