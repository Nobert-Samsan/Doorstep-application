const User = require('../models/User');
const Booking = require('../models/Booking');
const Commission = require('../models/Commission');
const Category = require('../models/Category');

exports.getDashboard = async (req, res) => {
  try {
    // 1. Total Revenue (sum of all PAID commissions to the platform)
    const paidCommissions = await Commission.find({ status: 'paid' });
    const totalRevenue = paidCommissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

    // 2. User Counts
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeWorkers = await User.countDocuments({ role: 'worker', isApproved: true });
    
    // 3. Pending Approvals
    const pendingApprovals = await User.countDocuments({ role: 'worker', isApproved: false });

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
    const workers = await User.find({ role: 'worker' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: workers });
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
