const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Course code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        type: String,
        trim: true,
        uppercase: true
    }],
    studentCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Update student count when students array changes
courseSchema.pre('save', function() {
    this.studentCount = this.students.length;
});

module.exports = mongoose.model('Course', courseSchema);
