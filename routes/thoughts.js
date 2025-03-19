const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');
const authenticateJWT = require('../middleware/authenticateJWT');


// Post a new thought
router.post('/thoughts', authenticateJWT, async (req, res) => {
    console.log("Request Body:", req.body);  // Debugging

    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Thought text is required' });

        const thought = new Thought({
            text,
            user: req.user.id,
            username: req.user.username,
            userImage: req.user.profile?.photoUrl || 'assets/img/default.jpg',
        });

        await thought.save();
        res.status(201).json(thought);
    } catch (error) {
        console.error('Error posting thought:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// Get all thoughts
router.get('/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find().sort({ createdAt: -1 });
        res.json(thoughts);
    } catch (error) {
        console.error('Error fetching thoughts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Like a thought (only once per user)
router.post('/thoughts/:id/like', authenticateJWT, async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });

        if (thought.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have already liked this thought' });
        }

        thought.likes.push(req.user.id);
        await thought.save();

        res.json({ likes: thought.likes.length });
    } catch (error) {
        console.error('Error liking thought:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Post a comment on a thought
router.post('/thoughts/:id/comment', authenticateJWT, async (req, res) => {
    try {
        const comment = req.body.comment?.trim();  // Remove spaces
        if (!comment) return res.status(400).json({ message: 'Comment cannot be empty' });

        const thought = await Thought.findById(req.params.id);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });

        const newComment = {
            user: req.user.id,
            username: req.user.username,
            text: comment,
            createdAt: new Date()
        };

        thought.comments.push(newComment);
        await thought.save();

        res.json(thought.comments);
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
