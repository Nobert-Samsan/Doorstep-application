const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  against: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  raisedByRole: { type: String, enum: ['customer', 'worker'], required: true },
  complaintText: { type: String, required: true },
  evidence: [{ type: String }], // Cloudinary URLs
  status: { type: String, enum: ['open', 'under_review', 'resolved'], default: 'open' },
  adminNotes: { type: String },
  resolution: { type: String },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
