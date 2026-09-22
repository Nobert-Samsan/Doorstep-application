const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  jobAmount: { type: Number, required: true },
  commissionRate: { type: Number, required: true, default: 10 },
  commissionAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  paymentReference: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Commission', commissionSchema);
