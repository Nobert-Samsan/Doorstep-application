const User = require('../models/User');
const Booking = require('../models/Booking');
const Commission = require('../models/Commission');
const Category = require('../models/Category');

exports.getDashboard = async (req, res) => {
  try {
    const WorkerProfile = require('../models/WorkerProfile');

    // 1. Total Revenue (sum of all PAID commissions to the platform)
    const paidCommissions = await Commission.find({ status: 'paid' });
    const totalRevenue = paidCommissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

    // 2. User Counts
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    // Active workers: count WorkerProfile where approvalStatus is 'approved' (or User where role is worker and isApproved is true or active)
    const activeWorkers = await WorkerProfile.countDocuments({ approvalStatus: 'approved' });
    
    // 3. Pending Approvals
    const pendingApprovals = await WorkerProfile.countDocuments({ approvalStatus: 'pending' });

    // 4. Recent Transactions
    const recentTransactions = await Commission.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('bookingId', 'serviceTitle');

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalCustomers,
        activeWorkers,
        pendingApprovals,
        recentTransactions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkers = async (req, res) => {
  try {
    const WorkerProfile = require('../models/WorkerProfile');
    const workers = await User.find({ role: 'worker' }).select('-password').sort({ createdAt: -1 }).lean();
    
    // Attach profile info so frontend can inspect approvalStatus, services, documents, and experience
    const workersWithProfile = await Promise.all(
      workers.map(async (w) => {
        const profile = await WorkerProfile.findOne({ userId: w._id }).lean();
        return {
          ...w,
          approvalStatus: profile?.approvalStatus || (w.isApproved ? 'approved' : 'pending'),
          isApproved: profile?.approvalStatus === 'approved' || w.isApproved === true,
          services: profile?.services || [],
          totalYearsExperience: profile?.totalYearsExperience || 0,
          documents: profile?.documents || {},
          bio: profile?.bio || '',
          serviceDistricts: profile?.serviceDistricts || [],
          maxTravelDistance: profile?.maxTravelDistance,
          workerProfileId: profile?._id
        };
      })
    );

    res.status(200).json({ success: true, data: workersWithProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, message: `User marked as ${user.isActive ? 'active' : 'inactive'}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveWorker = async (req, res) => {
  try {
    const worker = await User.findById(req.params.workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    
    worker.isApproved = true;
    await worker.save();

    // Also update WorkerProfile approvalStatus so worker appears on customer dashboard
    const WorkerProfile = require('../models/WorkerProfile');
    await WorkerProfile.findOneAndUpdate(
      { userId: worker._id },
      { approvalStatus: 'approved' }
    );
    
    res.status(200).json({ success: true, message: 'Worker approved successfully', data: worker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectWorker = async (req, res) => {
  try {
    // Optionally delete the user or mark as rejected
    const worker = await User.findByIdAndDelete(req.params.workerId);
    res.status(200).json({ success: true, message: 'Worker rejected and removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ nameEn: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { nameEn, descriptionEn, icon, color } = req.body;
    const category = await Category.create({ nameEn, descriptionEn, icon, color });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
