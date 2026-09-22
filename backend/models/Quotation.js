const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lineItems: [{
    description: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  commissionAmount: { type: Number, required: true }, // 10% auto calculated
  workerNetAmount: { type: Number, required: true },
  estimatedDuration: { type: String },
  validUntil: { type: Date, required: true },
  noteToCustomer: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'expired'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
