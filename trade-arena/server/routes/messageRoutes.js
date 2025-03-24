const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// @route   POST /api/messages
// @desc    Create a new message
// @access  Private
router.post('/', auth, messageController.createMessage);

// @route   GET /api/messages
// @desc    Get all top-level messages (not replies)
// @access  Public
router.get('/', messageController.getMessages);

// @route   GET /api/messages/:id/replies
// @desc    Get replies for a specific message
// @access  Public
router.get('/:id/replies', messageController.getMessageReplies);

// @route   PUT /api/messages/:id/like
// @desc    Like/unlike a message
// @access  Private
router.put('/:id/like', auth, messageController.toggleLike);

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;
