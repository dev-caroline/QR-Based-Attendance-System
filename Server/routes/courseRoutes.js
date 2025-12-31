const express = require('express');
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route
router.get('/public', async (req, res) => {
    try {
        const Course = require('../models/Course');
        const courses = await Course.find().select('code name').sort('code');
        res.json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.use(protect);
router.use(authorize('lecturer'));

router.route('/')
    .get(getCourses)
    .post(createCourse);

router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;
