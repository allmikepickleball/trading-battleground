const Message = require('../models/Message');
const User = require('../models/User');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { content, parentMessage } = req.body;

    // Validate content
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Create new message
    const newMessage = new Message({
      user: req.user.id,
      content,
      parentMessage: parentMessage || null
    });

    const message = await newMessage.save();

    // If this is a reply, add it to the parent message's replies array
    if (parentMessage) {
      await Message.findByIdAndUpdate(
        parentMessage,
        { $push: { replies: message._id } }
      );
    }

    // Populate user data
    await message.populate('user', 'username displayName profilePicture');

    res.status(201).json(message);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error during message creation' });
  }
};

// Get all top-level messages (not replies)
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ parentMessage: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username displayName profilePicture')
      .populate({
        path: 'replies',
        options: { sort: { createdAt: 1 }, limit: 3 },
        populate: { path: 'user', select: 'username displayName profilePicture' }
      });

    const totalMessages = await Message.countDocuments({ parentMessage: null });
    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      messages,
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
};

// Get replies for a specific message
exports.getMessageReplies = async (req, res) => {
  try {
    const messageId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const replies = await Message.find({ parentMessage: messageId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username displayName profilePicture');

    const totalReplies = await Message.countDocuments({ parentMessage: messageId });
    const totalPages = Math.ceil(totalReplies / limit);

    res.json({
      replies,
      pagination: {
        page,
        limit,
        totalReplies,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get message replies error:', error);
    res.status(500).json({ message: 'Server error while fetching replies' });
  }
};

// Like/unlike a message
exports.toggleLike = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already liked the message
    const alreadyLiked = message.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the message
      message.likes = message.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the message
      message.likes.push(userId);
    }

    await message.save();

    res.json({
      messageId,
      likes: message.likes.length,
      liked: !alreadyLiked
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error while toggling like' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the message author
    if (message.user.toString() !== userId) {
      return res.status(401).json({ message: 'Not authorized to delete this message' });
    }

    // If this is a parent message, delete all replies
    if (message.replies.length > 0) {
      await Message.deleteMany({ parentMessage: messageId });
    }

    // If this is a reply, remove it from parent's replies array
    if (message.parentMessage) {
      await Message.findByIdAndUpdate(
        message.parentMessage,
        { $pull: { replies: messageId } }
      );
    }

    await message.deleteOne();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error during message deletion' });
  }
};
