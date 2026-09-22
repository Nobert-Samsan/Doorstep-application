const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  serviceTitle: { type: String, required: true },
  yearsExperience: { type: Number, required: true },
  specificSkills: [{ type: String }],
  pricingType: { type: String, enum: ['fixed', 'variable'] },
  fixedRate: { type: Number },
  chargeType: { type: String, enum: ['hour', 'day', 'job', 'session'] },
  minimumCharge: { type: Number },
  weekendRate: { type: Number },
  estimatedMin: { type: Number },
  estimatedMax: { type: Number },
  serviceDescription: { type: String },
  samplePhotos: [{ type: String }] // Cloudinary URLs
});

const workerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, required: false },
  totalYearsExperience: { type: Number, default: 0 },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
  isVerified: { type: Boolean, default: false },
  hasPolicesClearance: { type: Boolean, default: false },
  verifiedBadge: { type: Boolean, default: false },
  services: [serviceSchema],
  serviceDistricts: [{ type: String }], // all 25 Sri Lanka districts
  maxTravelDistance: { type: Number },
  availableDays: [{ type: String }],
  workStartTime: { type: String },
  workEndTime: { type: String },
  acceptsEmergencyJobs: { type: Boolean, default: false },
  emergencyFee: { type: Number },
  isAvailable: { type: Boolean, default: false }, // online/offline toggle
  documents: {
    nicFront: { type: String },
    nicBack: { type: String },
    qualificationDocs: [{ type: String }],
    policeClearance: { type: String },
    selfieWithNic: { type: String }
  },
  bankDetails: {
    bankName: { type: String },
    accountHolderName: { type: String },
    accountNumber: { type: String },
    branchName: { type: String }
  },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalJobsCompleted: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  commissionDue: { type: Number, default: 0 },
  commissionPaid: { type: Number, default: 0 },
  adminNotes: { type: String },
  rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
