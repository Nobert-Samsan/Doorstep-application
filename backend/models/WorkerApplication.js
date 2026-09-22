const mongoose = require('mongoose');

const workerApplicationSchema = new mongoose.Schema({
  jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposedDate: { type: Date, required: true },
  proposedTime: { type: String, required: true },
  priceApproach: { type: String, enum: ['fixed', 'quotation'], required: true },
  noteToCustomer: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('WorkerApplication', workerApplicationSchema);
