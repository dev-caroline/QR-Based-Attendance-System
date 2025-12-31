import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AttendanceRecords from './pages/AttendanceRecords';
import CoursesManagement from './pages/CoursesManagement';
import SessionManagement from './pages/SessionManagement';
import ManualRequests from './pages/ManualRequests';
import Settings from './pages/Settings';
import QRCodeSession from './pages/QRCodeSession';
import StudentAttendance from './pages/StudentAttendance';
import StudentPortal from './pages/StudentPortal';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* Protected Routes with Layout */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<AttendanceRecords />} />
        <Route path="courses" element={<CoursesManagement />} />
        <Route path="sessions" element={<SessionManagement />} />
        <Route path="manual-requests" element={<ManualRequests />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* QR Code Session (Full Screen) */}
      <Route path="session/:sessionId/qr-code" element={<ProtectedRoute><QRCodeSession /></ProtectedRoute>} />

      {/* Student Attendance (Public - accessible via QR scan) */}
      <Route path="session/:sessionId/attendance" element={<StudentAttendance />} />

      {/* Manual Request (Public - for students who missed QR scan) */}
      <Route path="request" element={<StudentPortal />} />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
