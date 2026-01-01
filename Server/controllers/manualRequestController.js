const ManualRequest = require('../models/ManualRequest');
const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const { createNotification } = require('./notificationController');

// @desc    Get all manual requests
// @route   GET /api/manual-requests
// @access  Private
exports.getManualRequests = async (req, res) => {
    try {
        const { status } = req.query;

        // Get sessions for current lecturer
        const sessions = await Session.find({ lecturer: req.user.id });
        const sessionIds = sessions.map(s => s._id);

        let query = { session: { $in: sessionIds } };
        
        if (status) {
            query.status = status;
        }

        const requests = await ManualRequest.find(query)
            .populate('student', 'fullName email')
            .populate('course', 'code name')
            .populate('session', 'sessionName date time')
            .populate('reviewedBy', 'fullName')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single manual request
// @route   GET /api/manual-requests/:id
// @access  Private
exports.getManualRequest = async (req, res) => {
    try {
        const request = await ManualRequest.findById(req.params.id)
            .populate('student', 'fullName email')
            .populate('course', 'code name')
            .populate('session', 'sessionName date time lecturer')
            .populate('reviewedBy', 'fullName');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Verify lecturer owns the session
        if (request.session.lecturer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this request'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create manual request
// @route   POST /api/manual-requests
// @access  Public (for students)
exports.createManualRequest = async (req, res) => {
    try {
        const { student, session, course, reason } = req.body;

        // Check if session exists
        const sessionExists = await Session.findById(session);
        if (!sessionExists) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Check if already has attendance
        const hasAttendance = await Attendance.findOne({ session, student });
        if (hasAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked for this session'
            });
        }

        // Check if request already exists
        const existingRequest = await ManualRequest.findOne({ session, student });
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'Request already submitted for this session'
            });
        }

        const request = await ManualRequest.create({
            student,
            session,
            course,
            reason
        });

        const populatedRequest = await ManualRequest.findById(request._id)
            .populate('student', 'fullName email')
            .populate('course', 'code name')
            .populate('session', 'sessionName date time');

        // Create notification for lecturer
        try {
            const session = await Session.findById(request.session).populate('lecturer');
            if (session && session.lecturer) {
                await createNotification(
                    session.lecturer._id,
                    'manual_request',
                    'New Manual Attendance Request',
                    `${populatedRequest.student.fullName} requested manual attendance for ${populatedRequest.course.code}`,
                    request._id,
                    'ManualRequest'
                );
            }
        } catch (notifError) {
            // Notification failed
        }

        res.status(201).json({
            success: true,
            message: 'Manual request submitted successfully',
            data: populatedRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Approve manual request
// @route   PUT /api/manual-requests/:id/approve
// @access  Private
exports.approveRequest = async (req, res) => {
    try {
        const request = await ManualRequest.findById(req.params.id).populate('session');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Verify lecturer owns the session
        if (request.session.lecturer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to approve this request'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request has already been reviewed'
            });
        }

        // Auto-enroll student in course if not already enrolled
        const Course = require('../models/Course');
        const course = await Course.findById(request.course);
        if (course && !course.students.includes(request.student)) {
            course.students.push(request.student);
            await course.save();
        }

        // Create attendance record
        const attendance = await Attendance.create({
            session: request.session._id,
            student: request.student,
            course: request.course,
            status: 'present',
            method: 'manual'
        });

        // Update request
        request.status = 'approved';
        request.reviewedBy = req.user.id;
        request.reviewedAt = Date.now();
        request.reviewNote = req.body.note || '';
        await request.save();

        // Add attendance to session
        request.session.attendances.push(attendance._id);
        await request.session.save();

        const populatedRequest = await ManualRequest.findById(request._id)
            .populate('student', 'fullName email')
            .populate('course', 'code name')
            .populate('session', 'sessionName date time')
            .populate('reviewedBy', 'fullName');
        
        // Create notification for student
        try {
            await createNotification(
                request.student,
                'manual_request',
                'Attendance Request Approved',
                `Your manual attendance request for ${populatedRequest.course.code} has been approved`,
                request._id,
                'ManualRequest'
            );
        } catch (notifError) {
            // Notification failed
        }

        res.status(200).json({
            success: true,
            message: 'Request approved successfully',
            data: populatedRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Reject manual request
// @route   PUT /api/manual-requests/:id/reject
// @access  Private
exports.rejectRequest = async (req, res) => {
    try {
        const request = await ManualRequest.findById(req.params.id).populate('session');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Verify lecturer owns the session
        if (request.session.lecturer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to reject this request'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request has already been reviewed'
            });
        }

        // Update request
        request.status = 'rejected';
        request.reviewedBy = req.user.id;
        request.reviewedAt = Date.now();
        request.reviewNote = req.body.note || '';
        await request.save();

        const populatedRequest = await ManualRequest.findById(request._id)
            .populate('student', 'fullName email')
            .populate('course', 'code name')
            .populate('session', 'sessionName date time')
            .populate('reviewedBy', 'fullName');

        res.status(200).json({
            success: true,
            message: 'Request rejected',
            data: populatedRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
