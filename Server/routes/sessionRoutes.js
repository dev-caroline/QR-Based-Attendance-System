const express = require('express');
const {
    getSessions,
    getSession,
    createSession,
    updateSession,
    deleteSession,
    endSession,
    getSessionToken
} = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for getting session token (for rotating QR codes)
router.get('/:id/token', getSessionToken);

// Public route
router.get('/public/:courseId', async (req, res) => {
    try {
        const Session = require('../models/Session');
        const sessions = await Session.find({ 
            course: req.params.courseId,
            status: 'completed'
        })
        .select('sessionName date time')
        .sort('-date')
        .limit(20);
        res.json({ success: true, data: sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.use(protect);
router.use(authorize('lecturer'));

router.route('/')
    .get(getSessions)
    .post(createSession);

router.route('/:id')
    .get(getSession)
    .put(updateSession)
    .delete(deleteSession);

router.put('/:id/end', endSession);

module.exports = router;
