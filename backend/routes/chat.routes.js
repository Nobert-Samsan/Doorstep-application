const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const detectPhoneNumber = require('../utils/detectPhoneNumber');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

router.use(protect);

router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'firstName lastName profilePhoto');
    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/conversations', async (req, res) => {
  try {
    const { receiverId } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    }).populate('participants', 'firstName lastName profilePhoto');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId]
      });
      conversation = await conversation.populate('participants', 'firstName lastName profilePhoto');
    }
    res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId }).sort('createdAt');
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    const isBlocked = detectPhoneNumber(content);
    
    const message = await Message.create({
      conversationId: req.params.conversationId,
      senderId: req.user.id,
      receiverId,
      content,
      isBlocked
    });

    if (isBlocked) {
      const io = require('../socket/socket').getIO();
      io.to(req.user.id.toString()).emit('phone_number_detected', { warning: 'Sharing phone numbers is not allowed before booking acceptance.' });
    } else {
      const io = require('../socket/socket').getIO();
      io.to(receiverId.toString()).emit('receive_message', message);
    }
    
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
