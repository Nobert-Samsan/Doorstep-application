const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nameEn: { type: String, required: true },
  nameSi: { type: String, required: true },
  nameTa: { type: String, required: true },
  icon: { type: String }, // Cloudinary URL
  description: { type: String },
  commissionRate: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  workerCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
