const WorkerProfile = require('../models/WorkerProfile');
const Booking = require('../models/Booking');
const Commission = require('../models/Commission');
const Review = require('../models/Review');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id });
    if (!workerProfile) return res.status(404).json({ success: false, message: 'Worker profile not found' });

    // Mocked stats
    const stats = {
      todayEarnings: 0,
      monthEarnings: workerProfile.totalEarnings,
      jobsCompleted: workerProfile.totalJobsCompleted,
      avgRating: workerProfile.averageRating,
      commissionDue: workerProfile.commissionDue
    };

    const incomingRequests = await Booking.find({ workerId: req.user.id, status: 'pending' })
      .populate('customerId', 'firstName district')
      .lean();
      
    let categoryIds = workerProfile.services.map(s => s.categoryId).filter(Boolean);
    const serviceTitles = workerProfile.services.map(s => s.serviceTitle).filter(Boolean);
    
    const Category = require('../models/Category');
    for (const title of serviceTitles) {
       const keyword = title.split(' ')[0];
       const cats = await Category.find({ nameEn: { $regex: keyword, $options: 'i' }});
       cats.forEach(c => {
         if (!categoryIds.find(id => id.toString() === c._id.toString())) {
           categoryIds.push(c._id);
         }
       });
    }
    
    const JobPost = require('../models/JobPost');
    const broadcastJobs = await JobPost.find({
      status: 'active',
      categoryId: { $in: categoryIds },
      district: { $in: workerProfile.serviceDistricts || [] },
      expiresAt: { $gt: new Date() }
    }).populate('customerId', 'firstName district').lean();
    
    const mappedBroadcastJobs = broadcastJobs.map(job => ({
      ...job,
      _id: job._id,
      isBroadcast: true,
      serviceTitle: job.title || 'Broadcast Job Request',
      scheduledDate: job.preferredDate,
      scheduledTimeSlot: job.preferredTimeSlot
    }));
    
    const allRequests = [...incomingRequests, ...mappedBroadcastJobs].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const activeJobs = await Booking.find({ workerId: req.user.id, status: { $in: ['accepted', 'en_route', 'arrived', 'in_progress'] } });
    
    // Mocked today schedule
    const todaySchedule = []; 
    const recentReviews = await Review.find({ workerId: req.user.id }).sort({ createdAt: -1 }).limit(3).populate('customerId', 'firstName');

    res.status(200).json({
      success: true,
      data: {
        profile: workerProfile,
        stats,
        incomingRequests: allRequests,
        activeJobs,
        todaySchedule,
        recentReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id }).populate('userId', '-password');
    res.status(200).json({ success: true, data: workerProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { bio, maxTravelDistance, bankDetails } = req.body;
    const workerProfile = await WorkerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { bio, maxTravelDistance, bankDetails },
      { new: true }
    );
    res.status(200).json({ success: true, data: workerProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo provided' });
    }

    // Convert multer buffer to base64 Data URI for immediate frontend rendering
    const photoUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { profilePhoto: photoUrl }, { new: true }).select('-password');
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateServices = async (req, res) => {
  try {
    const { services } = req.body;
    const workerProfile = await WorkerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { services },
      { new: true }
    );
    res.status(200).json({ success: true, data: workerProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availableDays, workStartTime, workEndTime, acceptsEmergencyJobs, emergencyFee, serviceDistricts } = req.body;
    const workerProfile = await WorkerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { availableDays, workStartTime, workEndTime, acceptsEmergencyJobs, emergencyFee, serviceDistricts },
      { new: true }
    );
    res.status(200).json({ success: true, data: workerProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id });
    workerProfile.isAvailable = !workerProfile.isAvailable;
    await workerProfile.save();
    
    // Emit socket event for availability change (handled globally via io, simulated here)
    const io = require('../socket/socket').getIO();
    io.emit('worker_availability_change', { workerId: req.user.id, isAvailable: workerProfile.isAvailable });

    res.status(200).json({ success: true, isAvailable: workerProfile.isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEarnings = async (req, res) => {
  try {
    const WorkerProfile = require('../models/WorkerProfile');
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id });
    
    const bookings = await Booking.find({ workerId: req.user.id, status: 'completed' })
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 });
      
    const formattedTransactions = bookings.map(b => ({
      _id: b._id,
      date: b.createdAt,
      description: `Job completed for ${b.customerId?.firstName || 'Customer'}`,
      jobAmount: b.finalAmount || 0,
      commissionAmount: (b.finalAmount || 0) * 0.10,
      status: 'UNPAID'
    }));
      
    res.status(200).json({ 
      success: true, 
      data: {
        totalEarnings: workerProfile ? workerProfile.totalEarnings : 0,
        monthlyEarnings: workerProfile ? workerProfile.totalEarnings : 0, // Mocked to total for now
        commissionDue: workerProfile ? workerProfile.commissionDue : 0,
        transactions: formattedTransactions
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommission = async (req, res) => {
  try {
    const commissions = await Commission.find({ workerId: req.user.id })
      .populate('bookingId')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: commissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.payCommission = async (req, res) => {
  res.status(200).json({ success: true, message: 'Commission paid mock' });
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.user.id }).populate('customerId', 'firstName lastName profilePhoto');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.replyToReview = async (req, res) => {
  try {
    const { workerReply } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, workerId: req.user.id },
      { workerReply, workerRepliedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Booking.find({ workerId: req.user.id }).populate('customerId', 'firstName lastName city');
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobRequests = async (req, res) => {
  try {
    const directJobs = await Booking.find({ workerId: req.user.id, status: 'pending' })
      .populate('customerId', 'firstName lastName city')
      .lean();
      
    // Fetch relevant broadcast jobs from JobPost model
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id });
    let categoryIds = workerProfile ? workerProfile.services.map(s => s.categoryId).filter(Boolean) : [];
    const serviceTitles = workerProfile ? workerProfile.services.map(s => s.serviceTitle).filter(Boolean) : [];
    
    if (workerProfile) {
      const Category = require('../models/Category');
      for (const title of serviceTitles) {
         const keyword = title.split(' ')[0];
         const cats = await Category.find({ nameEn: { $regex: keyword, $options: 'i' }});
         cats.forEach(c => {
           if (!categoryIds.find(id => id.toString() === c._id.toString())) {
             categoryIds.push(c._id);
           }
         });
      }
    }
    
    const districts = workerProfile ? workerProfile.serviceDistricts || [] : [];
    
    const JobPost = require('../models/JobPost');
    const broadcastJobs = await JobPost.find({
      categoryId: { $in: categoryIds },
      district: { $in: districts },
      status: 'active',
      expiresAt: { $gt: new Date() }
    })
    .populate('customerId', 'firstName lastName city')
    .lean();
    
    // Map JobPosts to look like Bookings for the frontend
    const mappedBroadcastJobs = broadcastJobs.map(job => ({
      ...job,
      _id: job._id,
      isBroadcast: true,
      serviceTitle: job.title || 'Broadcast Job Request',
      scheduledDate: job.preferredDate,
      scheduledTimeSlot: job.preferredTimeSlot,
      customerId: job.customerId,
      city: job.city,
      urgency: job.urgency
    }));
    
    const allRequests = [...directJobs, ...mappedBroadcastJobs].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.status(200).json({ success: true, data: allRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuotations = async (req, res) => {
  res.status(200).json({ success: true, data: [] }); // Mocked
};
