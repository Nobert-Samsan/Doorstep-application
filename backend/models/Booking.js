const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  serviceTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTimeSlot: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  streetAddress: { type: String, required: true },
  landmark: { type: String },
  urgency: { type: String, enum: ['normal', 'soon', 'urgent'] },
  photos: [{ type: String }],
  status: { 
    type: String, 
    enum: ['broadcast', 'pending', 'accepted', 'en_route', 'arrived', 'quote_provided', 'in_progress', 'completed', 'cancelled', 'complaint'],
    default: 'pending'
  },
  cancellationReason: { type: String },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pricingType: { type: String, enum: ['fixed', 'variable'], required: true },
  fixedRate: { type: Number },
  chargeType: { type: String, enum: ['hour', 'day', 'job', 'session'] },
  quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
  finalAmount: { type: Number },
  paymentStatus: { type: String, enum: ['unpaid', 'paid_online', 'paid_cash', 'pending'], default: 'unpaid' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
