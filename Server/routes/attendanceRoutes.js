const express = require('express');
const {
    getAttendanceRecords,
    markAttendance,
    getAttendanceStats
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for marking attendance via QR
router.post('/mark', markAttendance);

// Protected routes
router.get('/', protect, authorize('lecturer'), getAttendanceRecords);
router.get('/stats/:courseId', protect, authorize('lecturer'), getAttendanceStats);

module.exports = router;
