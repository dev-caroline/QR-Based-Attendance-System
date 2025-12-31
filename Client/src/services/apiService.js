import api from './api';

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
};

// Courses
export const getCourses = async () => {
    const response = await api.get('/courses');
    return response.data;
};

export const getCourse = async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
};

export const createCourse = async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
};

export const updateCourse = async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
};

export const deleteCourse = async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
};

// Sessions
export const getSessions = async (status) => {
    const response = await api.get('/sessions', { params: { status } });
    return response.data;
};

export const getSession = async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
};

export const createSession = async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
};

export const updateSession = async (id, sessionData) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
};

export const deleteSession = async (id) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
};

export const endSession = async (id) => {
    const response = await api.put(`/sessions/${id}/end`);
    return response.data;
};

// Attendance
export const getAttendanceRecords = async (params) => {
    const response = await api.get('/attendance', { params });
    return response.data;
};

export const markAttendance = async (attendanceData) => {
    const response = await api.post('/attendance/mark', attendanceData);
    return response.data;
};

export const getAttendanceStats = async (courseId, date) => {
    const response = await api.get(`/attendance/stats/${courseId}`, { params: { date } });
    return response.data;
};

// Manual Requests
export const getManualRequests = async (status) => {
    const response = await api.get('/manual-requests', { params: { status } });
    return response.data;
};

export const getManualRequest = async (id) => {
    const response = await api.get(`/manual-requests/${id}`);
    return response.data;
};

export const createManualRequest = async (requestData) => {
    const response = await api.post('/manual-requests', requestData);
    return response.data;
};

export const approveRequest = async (id, note) => {
    const response = await api.put(`/manual-requests/${id}/approve`, { note });
    return response.data;
};

export const rejectRequest = async (id, note) => {
    const response = await api.put(`/manual-requests/${id}/reject`, { note });
    return response.data;
};

// Notifications
export const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

export const markNotificationAsRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};
