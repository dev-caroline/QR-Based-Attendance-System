const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    sessionName: {
        type: String,
        required: [true, 'Session name is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Session date is required']
    },
    time: {
        type: String,
        required: [true, 'Session time is required']
    },
    location: {
        type: String,
        trim: true
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    qrCode: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    duration: {
        type: Number,
        default: 10,
        required: true
    },
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    },
    attendances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance'
    }]
}, {
    timestamps: true
});

// Set expiration time and start timestamp when session is created
sessionSchema.pre('save', function() {
    if (this.isNew && this.status === 'active') {
        this.startedAt = new Date();
        this.expiresAt = new Date(Date.now() + this.duration * 60 * 1000);
    }
});

module.exports = mongoose.model('Session', sessionSchema);
