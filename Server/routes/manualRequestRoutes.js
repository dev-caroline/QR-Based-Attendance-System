const express = require('express');
const {
    getManualRequests,
    getManualRequest,
    createManualRequest,
    approveRequest,
    rejectRequest
} = require('../controllers/manualRequestController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for students
router.post('/public', async (req, res) => {
    try {
        const ManualRequest = require('../models/ManualRequest');
        const { student, course, session, reason } = req.body;

        // Check if request already exists
        const existingRequest = await ManualRequest.findOne({ session, student });
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted a request for this session'
            });
        }

        const request = await ManualRequest.create({
            student,
            course,
            session,
            reason
        });

        res.status(201).json({
            success: true,
            message: 'Request submitted successfully',
            data: request
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Public route for students to submit requests
router.post('/', createManualRequest);

// Protected routes for lecturers
router.get('/', protect, authorize('lecturer'), getManualRequests);
router.get('/:id', protect, authorize('lecturer'), getManualRequest);
router.put('/:id/approve', protect, authorize('lecturer'), approveRequest);
router.put('/:id/reject', protect, authorize('lecturer'), rejectRequest);

module.exports = router;
