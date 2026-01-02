import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/apiService';
import '../styles/CoursesManagement.css';
import Loader from '../components/Loader';

const CoursesManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', studentCount: '' });
    const [enrollmentData, setEnrollmentData] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await getCourses();
            setCourses(response.data);
        } catch (error) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editingCourse) {
                await updateCourse(editingCourse._id, {
                    code: formData.code,
                    name: formData.name,
                    studentCount: parseInt(formData.studentCount) || 0
                });
            } else {
                await createCourse({
                    code: formData.code,
                    name: formData.name,
                    studentCount: parseInt(formData.studentCount) || 0
                });
            }
            
            setShowModal(false);
            setFormData({ code: '', name: '', studentCount: '' });
            setEditingCourse(null);
            fetchCourses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save course');
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            code: course.code,
            name: course.name,
            studentCount: course.studentCount || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(courseId);
                fetchCourses();
            } catch (error) {
                alert('Failed to delete course');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCourse(null);
        setFormData({ code: '', name: '', studentCount: '' });
        setError('');
    };

    const handleEnrollStudents = (course) => {
        setSelectedCourse(course);
        setEnrollmentData(course.students?.join('\n') || '');
        setShowEnrollModal(true);
    };

    const handleSaveEnrollment = async () => {
        try {
            const studentsList = enrollmentData
                .split('\n')
                .map(s => s.trim().toUpperCase())
                .filter(s => s.length > 0);

            await updateCourse(selectedCourse._id, {
                code: selectedCourse.code,
                name: selectedCourse.name,
                students: studentsList
            });

            setShowEnrollModal(false);
            setSelectedCourse(null);
            setEnrollmentData('');
            fetchCourses();
        } catch (error) {
            alert('Failed to update enrollment');
        }
    };

    return (
        <div className="courses-container">
            {/* Page Header */}
            <div className="courses-header">
                <div className="courses-header-content">
                    <h1>Courses Management</h1>
                    <p>Manage your courses and class information</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingCourse(null);
                        setFormData({ code: '', name: '', studentCount: '' });
                        setShowModal(true);
                    }}
                    className="add-course-button"
                >
                    <Plus size={20} />
                    Add New Course
                </button>
            </div>

            {/* Search Section */}
            <div className="search-card">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by course name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="courses-search-input"
                    />
                </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Loading courses...</p>
                </div>
            ) : (
                <div className="courses-grid">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="course-card">
                            <div className="course-card-header">
                                <span className="course-code-badge">
                                    {course.code}
                                </span>
                                <div className="course-actions">
                                    <button 
                                        className="course-action-button edit"
                                        onClick={() => handleEdit(course)}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        className="course-action-button delete"
                                        onClick={() => handleDelete(course._id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="course-name">{course.name}</h3>
                            <div className="course-footer">
                                <span className="student-count">
                                    <span className="count">{course.students?.length || 0}</span> Students Enrolled
                                </span>
                            </div>
                            <button
                                onClick={() => handleEnrollStudents(course)}
                                className="enroll-button"
                                title="Students are auto-enrolled when they mark attendance. Use this to view or manually manage enrollment."
                            >
                                View/Manage Students
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Course Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                            <button 
                                onClick={handleCloseModal}
                                className="close-button"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            <form className="modal-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Course Code *</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., CS101" 
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                                        className="modal-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Course Name *</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g., Introduction to Computer Science"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="modal-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Student Count *</label>
                                    <input 
                                        type="number"
                                        placeholder="e.g., 30"
                                        required
                                        value={formData.studentCount}
                                        onChange={(e) => setFormData({...formData, studentCount: e.target.value})}
                                        className="modal-input"
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button 
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="modal-button-cancel"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="modal-button-submit"
                                    >
                                        {editingCourse ? 'Update Course' : 'Add Course'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Enrollment Modal */}
            {showEnrollModal && (
                <div className="modal-overlay" onClick={() => setShowEnrollModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Manage Students - {selectedCourse?.code}</h2>
                            <button 
                                onClick={() => setShowEnrollModal(false)}
                                className="close-button"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="info-box">
                                <p>
                                    💡 <strong>Auto-enrollment enabled:</strong> Students are automatically enrolled when they mark attendance for the first time. You can optionally pre-enroll students here.
                                </p>
                            </div>
                            <p className="enrollment-label">
                                Enter matric numbers (one per line):
                            </p>
                            <textarea
                                value={enrollmentData}
                                onChange={(e) => setEnrollmentData(e.target.value)}
                                placeholder="U2020/1234567&#10;U2020/1234568&#10;U2020/1234569"
                                className="enrollment-textarea"
                            />
                            <div className="modal-actions">
                                <button 
                                    type="button"
                                    onClick={() => setShowEnrollModal(false)}
                                    className="modal-button-cancel"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveEnrollment}
                                    className="modal-button-submit"
                                >
                                    Save Enrollment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesManagement;
