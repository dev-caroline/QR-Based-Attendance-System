import { useState, useEffect } from 'react';
import { Search, Calendar, Users, UserCheck, UserX } from 'lucide-react';
import { getCourses, getAttendanceStats } from '../services/apiService';
import Loader from '../components/Loader';
import '../styles/AttendanceRecords.css';

const AttendanceRecords = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchAttendanceStats();
        }
    }, [selectedCourse, selectedDate]);

    const fetchCourses = async () => {
        try {
            const response = await getCourses();
            setCourses(response.data);
            if (response.data.length > 0) {
                setSelectedCourse(response.data[0]._id);
            }
        } catch (error) {
            // Error fetching courses
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceStats = async () => {
        try {
            setLoading(true);
            const response = await getAttendanceStats(selectedCourse, selectedDate);
            setStats(response.data.overall);
            setStudents(response.data.students);
        } catch (error) {
            // Error fetching stats
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const searchLower = searchQuery.toLowerCase();
        return (
            student.studentName?.toLowerCase().includes(searchLower) ||
            student.studentId?.toLowerCase().includes(searchLower) ||
            student.student?.toLowerCase().includes(searchLower)
        );
    });

    if (loading && courses.length === 0) {
        return (
            <div className="attendance-container">
                <Loader />
            </div>
        );
    }

    const statsData = stats || { totalEnrolled: 0, totalPresent: 0, totalAbsent: 0 };

    return (
        <div className="attendance-container">
            {/* Page Header with Filters */}
            <div className="attendance-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1 className="attendance-title">Dashboard</h1>
                        <p className="attendance-subtitle">Overview of student attendance and performance metrics</p>
                    </div>
                    <div className="header-filters">
                        <div className="filter-group">
                            <label className="filter-label">Select Course</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="filter-select"
                            >
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.code}: {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Select Date</label>
                            <div className="date-input-wrapper">
                                <Calendar className="date-input-icon" size={20} />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="filter-select date-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card" style={{ borderLeft: '4px solid #667eea' }}>
                    <div className="stat-card-content">
                        <div className="stat-icon" style={{ background: '#ede9fe' }}>
                            <Users size={24} style={{ color: '#667eea' }} />
                        </div>
                        <div className="stat-info">
                            <h3 className="stat-value">{statsData.totalEnrolled}</h3>
                            <p className="stat-label">Total Enrolled</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid #48bb78' }}>
                    <div className="stat-card-content">
                        <div className="stat-icon" style={{ background: '#d1fae5' }}>
                            <UserCheck size={24} style={{ color: '#48bb78' }} />
                        </div>
                        <div className="stat-info">
                            <h3 className="stat-value">{statsData.totalPresent}</h3>
                            <p className="stat-label">Present</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid #f56565' }}>
                    <div className="stat-card-content">
                        <div className="stat-icon" style={{ background: '#fee2e2' }}>
                            <UserX size={24} style={{ color: '#f56565' }} />
                        </div>
                        <div className="stat-info">
                            <h3 className="stat-value">{statsData.totalAbsent}</h3>
                            <p className="stat-label">Absent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Attendance Table */}
            <div className="table-card">
                <div className="table-header">
                    <h2 className="table-title">Student Attendance Details</h2>
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search students..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th className="table-header-cell">Matric Number</th>
                                <th className="table-header-cell center">Present</th>
                                <th className="table-header-cell center">Absent</th>
                                <th className="table-header-cell center">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={index}>
                                    <td className="table-cell name">{student.studentName}</td>
                                    <td className="table-cell center">
                                        <span className="badge-present">{student.present}</span>
                                    </td>
                                    <td className="table-cell center">
                                        <span className="badge-absent">{student.absent}</span>
                                    </td>
                                    <td className="table-cell center">
                                        <span className={student.percentage >= 90 ? 'badge-success' : student.percentage >= 75 ? 'badge-warning' : 'badge-danger'}>
                                            {Number(student.percentage).toFixed(2)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStudents.length === 0 && (
                    <div className="empty-state">
                        <p>No students found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceRecords;
