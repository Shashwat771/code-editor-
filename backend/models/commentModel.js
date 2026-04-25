const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    parentType: {
        type: String,
        enum: ['Question', 'Answer'],
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 500
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for better query performance
commentSchema.index({ parentId: 1, parentType: 1 });

module.exports = mongoose.model('Comment', commentSchema);
