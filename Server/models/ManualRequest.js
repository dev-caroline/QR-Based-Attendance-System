const mongoose = require('mongoose');

const manualRequestSchema = new mongoose.Schema({
    student: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    },
    reviewNote: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ManualRequest', manualRequestSchema);
