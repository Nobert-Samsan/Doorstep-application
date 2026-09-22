const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageType: { 
    type: String, 
    enum: ['text', 'quotation_card', 'booking_card', 'payment_card', 'system'],
    default: 'text'
  },
  content: { type: String, required: true },
  isBlocked: { type: Boolean, default: false }, // Phone number detected
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
