const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    code: {
        type: String,
        default: ''
    },
    answeredBy: {
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
    isAccepted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for better query performance
answerSchema.index({ questionId: 1 });
answerSchema.index({ votes: -1 });

module.exports = mongoose.model('Answer', answerSchema);
