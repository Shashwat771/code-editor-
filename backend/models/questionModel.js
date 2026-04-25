const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        enum: ['javascript', 'python', 'java', 'cpp', 'php', 'html', 'css', 'other'],
        default: 'other'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    },
    viewedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    answerCount: {
        type: Number,
        default: 0
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    acceptedAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
        default: null
    }
}, {
    timestamps: true
});

// Index for better query performance
questionSchema.index({ tags: 1 });
questionSchema.index({ language: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ votes: -1 });

module.exports = mongoose.model('Question', questionSchema);
