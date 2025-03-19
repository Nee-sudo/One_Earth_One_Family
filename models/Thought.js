const mongoose = require('mongoose');

const ThoughtSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    userImage: { type: String, default: 'assets/img/default.jpg' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked
    comments: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Thought', ThoughtSchema);
