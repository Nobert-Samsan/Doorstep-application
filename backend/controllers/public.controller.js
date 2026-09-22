const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('nameEn');
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchWorkers = async (req, res) => {
  try {
    const { q, district, category } = req.query;
    
    // Build search criteria for User model (name)
    let userQuery = { role: 'worker' };
    if (q) {
      const regex = new RegExp(q, 'i');
      userQuery.$or = [{ firstName: regex }, { lastName: regex }];
    }

    // Find matching users first to get their IDs
    const users = await User.find(userQuery).select('_id firstName lastName profilePhoto');
    const userIds = users.map(u => u._id);

    // Build search criteria for WorkerProfile
    let profileQuery = { 
      userId: { $in: userIds },
      approvalStatus: 'approved' // Only show approved workers to the public
    };

    if (district) {
      profileQuery.serviceDistricts = district;
    }

    // Note: If category filter is needed, we'd need to look inside the services array
    if (category) {
      profileQuery['services.categoryId'] = category;
    }

    // Find profiles and populate user data
    const profiles = await WorkerProfile.find(profileQuery)
      .populate('userId', 'firstName lastName profilePhoto')
      .populate('services.categoryId', 'nameEn icon');

    res.status(200).json({ success: true, count: profiles.length, data: profiles });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkerProfile = async (req, res) => {
  try {
    const profile = await WorkerProfile.findById(req.params.id)
      .populate('userId', 'firstName lastName profilePhoto')
      .populate('services.categoryId', 'nameEn icon');
      
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLandingStats = async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    
    // 1. Workers Online (Workers who are approved and have isAvailable: true)
    const workersOnline = await WorkerProfile.countDocuments({ approvalStatus: 'approved', isAvailable: true });
    
    // 2. Jobs Today (Bookings created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const jobsToday = await Booking.countDocuments({ createdAt: { $gte: today } });
    
    // 3. Verified Pros (All approved workers)
    const verifiedPros = await WorkerProfile.countDocuments({ approvalStatus: 'approved' });
    
    // 4. Average Response time (Mocking this one for now since chat response logic is complex)
    const avgResponse = "< 15m";

    res.status(200).json({
      success: true,
      data: {
        workersOnline,
        jobsToday,
        verifiedPros,
        avgResponse
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedWorkers = async (req, res) => {
  try {
    const profiles = await WorkerProfile.find({ approvalStatus: 'approved' })
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(8)
      .populate('userId', 'firstName lastName profilePhoto')
      .populate('services.categoryId', 'nameEn icon');

    res.status(200).json({ success: true, count: profiles.length, data: profiles });
  } catch (error) {
    console.error('Featured workers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
