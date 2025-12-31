const Session = require('../models/Session');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = { lecturer: req.user.id };
        if (status) {
            query.status = status;
        }

        const sessions = await Session.find(query)
            .populate('course', 'code name')
            .populate('attendances')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
exports.getSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('course', 'code name students')
            .populate({
                path: 'attendances',
                populate: {
                    path: 'student',
                    select: 'fullName email'
                }
            });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Make sure user is session owner
        if (session.lecturer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this session'
            });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res) => {
    try {
        const { course: courseId } = req.body;

        // Verify course exists and belongs to lecturer
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
                message: 'Not authorized to create session for this course'
            });
        }

        // Add lecturer to req.body
        req.body.lecturer = req.user.id;

        const session = await Session.create(req.body);

        // Generate QR code value with actual session ID
        const qrValue = `${process.env.CLIENT_URL || 'http://localhost:5174'}/session/${session._id}/attendance`;
        session.qrCode = qrValue;
        await session.save();

        const populatedSession = await Session.findById(session._id)
            .populate('course', 'code name');

        res.status(201).json({
            success: true,
            message: 'Session created successfully',
            data: populatedSession
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSession = async (req, res) => {
    try {
        let session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Make sure user is session owner
        if (session.lecturer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this session'
            });
        }

        session = await Session.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('course', 'code name');

        res.status(200).json({
            success: true,
            message: 'Session updated successfully',
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Make sure user is session owner
        if (session.lecturer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this session'
            });
        }

        await session.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Session deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    End session
// @route   PUT /api/sessions/:id/end
// @access  Private
exports.endSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Make sure user is session owner
        if (session.lecturer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to end this session'
            });
        }

        session.status = 'completed';
        session.endedAt = new Date();
        await session.save();

        res.status(200).json({
            success: true,
            message: 'Session ended successfully',
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
