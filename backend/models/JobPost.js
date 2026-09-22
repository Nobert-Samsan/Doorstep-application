const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  urgency: { type: String, enum: ['normal', 'soon', 'urgent'], required: true },
  preferredDate: { type: Date, required: true },
  preferredTimeSlot: { type: String, required: true },
  alternateDate: { type: Date },
  province: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  streetAddress: { type: String, required: true },
  landmark: { type: String },
  budgetType: { type: String, enum: ['fixed', 'open'], required: true },
  fixedBudget: { type: Number },
  estimatedMin: { type: Number },
  estimatedMax: { type: Number },
  photos: [{ type: String }], // Cloudinary URLs
  status: { type: String, enum: ['active', 'filled', 'expired', 'closed'], default: 'active' },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkerApplication' }],
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('JobPost', jobPostSchema);
