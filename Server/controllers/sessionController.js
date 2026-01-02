const Session = require('../models/Session');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const crypto = require('crypto');

// Helper function to generate time-based token (changes every 15 seconds)
const generateTimeToken = (sessionId, timeWindow) => {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const data = `${sessionId}-${timeWindow}`;
    return crypto.createHmac('sha256', secret).update(data).digest('hex').substring(0, 16);
};

// Helper function to get current time window (15-second intervals)
const getCurrentTimeWindow = () => {
    return Math.floor(Date.now() / 15000);
};

// Helper function to validate token (accepts current and previous window for 15-second grace period)
const validateTimeToken = (sessionId, token) => {
    const currentWindow = getCurrentTimeWindow();
    const previousWindow = currentWindow - 1;
    
    const currentToken = generateTimeToken(sessionId, currentWindow);
    const previousToken = generateTimeToken(sessionId, previousWindow);
    
    return token === currentToken || token === previousToken;
};

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

// @desc    Get current rotating token for session
// @route   GET /api/sessions/:id/token
// @access  Public
exports.getSessionToken = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

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
            return res.status(400).json({
                success: false,
                message: 'Session has expired'
            });
        }

        const currentWindow = getCurrentTimeWindow();
        const token = generateTimeToken(session._id.toString(), currentWindow);

        res.status(200).json({
            success: true,
            data: {
                token,
                timeWindow: currentWindow,
                expiresIn: 5 // seconds
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export helper functions for use in other controllers
exports.validateTimeToken = validateTimeToken;
exports.getCurrentTimeWindow = getCurrentTimeWindow;
exports.generateTimeToken = generateTimeToken;
