const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const Course = require('../models/Course');

exports.getAttendanceRecords = async (req, res) => {
    try {
        const { courseId, sessionId, date } = req.query;

        let query = {};

        // Filter by course
        if (courseId) {
            const course = await Course.findById(courseId);
            if (course.lecturer.toString() !== req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized to view this course attendance'
                });
            }
            query.course = courseId;
        }

        // Filter by session
        if (sessionId) {
            query.session = sessionId;
        }

        // Filter by date
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            query.markedAt = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const attendanceRecords = await Attendance.find(query)
            .populate('course', 'code name')
            .populate('session', 'sessionName date time')
            .sort('-markedAt');

        res.status(200).json({
            success: true,
            count: attendanceRecords.length,
            data: attendanceRecords
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { sessionId, studentId, token } = req.body;

        // Get client IP address
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';

        // Get device info from user agent
        const deviceInfo = req.headers['user-agent'] || 'Unknown device';

        // Find session
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Check if session is active
        if (session.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Session is not active'
            });
        }

        // Check if session has expired
        if (new Date() > session.expiresAt) {
            session.status = 'completed';
            await session.save();
            
            return res.status(400).json({
                success: false,
                message: 'Session has expired'
            });
        }

        // Check if this IP address has already marked attendance for this session
        const ipAttendance = await Attendance.findOne({
            session: sessionId,
            ipAddress: ipAddress
        });

        if (ipAttendance) {
            return res.status(400).json({
                success: false,
                message: 'This device has already marked attendance for this session'
            });
        }

        // Check if attendance already marked by this student
        const existingAttendance = await Attendance.findOne({
            session: sessionId,
            student: studentId
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked for this session'
            });
        }

        // Auto-enroll student in course if not already enrolled
        const course = await Course.findById(session.course);
        if (course && !course.students.includes(studentId)) {
            course.students.push(studentId);
            await course.save();
        }

        // Create attendance record
        const attendance = await Attendance.create({
            session: sessionId,
            student: studentId,
            course: session.course,
            status: 'present',
            method: 'qr',
            ipAddress: ipAddress,
            deviceInfo: deviceInfo
        });

        // Add attendance to session
        session.attendances.push(attendance._id);
        await session.save();

        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('course', 'code name');

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            data: populatedAttendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAttendanceStats = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { date } = req.query;

        // Verify course ownership
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.lecturer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this course statistics'
            });
        }

        // Build query
        let query = { course: courseId };
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            query.markedAt = {
                $gte: startDate,
                $lte: endDate
            };
        }

        // Get attendance records
        const attendanceRecords = await Attendance.find(query);
        
        // Calculate statistics
        const totalEnrolled = course.students?.length || 0;
        const totalPresent = attendanceRecords.filter(a => a.status === 'present').length;
        const totalAbsent = totalEnrolled - totalPresent;
        const attendancePercentage = totalEnrolled > 0 ? (totalPresent / totalEnrolled * 100).toFixed(2) : 0;

        // Get per-student statistics
        const studentStats = await Promise.all((course.students || []).map(async (matricNumber) => {
            const studentAttendance = await Attendance.find({
                course: courseId,
                student: matricNumber
            });

            const totalSessions = await Session.countDocuments({
                course: courseId,
                status: 'completed'
            });

            const present = studentAttendance.filter(a => a.status === 'present').length;
            const absent = totalSessions - present;
            const percentage = totalSessions > 0 ? (present / totalSessions * 100).toFixed(2) : 0;

            return {
                student: matricNumber,
                studentName: matricNumber,
                present,
                absent,
                percentage
            };
        }));

        res.status(200).json({
            success: true,
            data: {
                overall: {
                    totalEnrolled,
                    totalPresent,
                    totalAbsent,
                    attendancePercentage
                },
                students: studentStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
