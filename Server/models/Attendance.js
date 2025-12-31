const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    student: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    studentName: {
        type: String,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        default: 'present'
    },
    markedAt: {
        type: Date,
        default: Date.now
    },
    method: {
        type: String,
        enum: ['qr', 'manual'],
        default: 'qr'
    },
    ipAddress: {
        type: String,
        required: false
    },
    deviceInfo: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Prevent duplicate attendance records
attendanceSchema.index({ session: 1, student: 1 }, { unique: true });
// Index for IP address tracking
attendanceSchema.index({ session: 1, ipAddress: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
