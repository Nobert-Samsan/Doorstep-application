const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  quickTags: [{ type: String }],
  reviewText: { type: String },
  photos: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  workerReply: { type: String },
  workerRepliedAt: { type: Date },
  isReported: { type: Boolean, default: false },
  reportReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
