const WorkerProfile = require('../models/WorkerProfile');
const Booking = require('../models/Booking');
const Commission = require('../models/Commission');
const Review = require('../models/Review');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id });
    if (!workerProfile) return res.status(404).json({ success: false, message: 'Worker profile not found' });

    // Calculate real dynamic stats from MongoDB collections
    const completedBookings = await Booking.find({ workerId: req.user.id, status: 'completed' });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalGross = 0;
    let monthGross = 0;
    let todayGross = 0;

    completedBookings.forEach(b => {
      const amt = Number(b.finalAmount || b.fixedRate || 0);
      const createdAt = new Date(b.createdAt);

      totalGross += amt;
      if (createdAt >= startOfMonth) {
        monthGross += amt;
      }
      if (createdAt >= startOfToday) {
        todayGross += amt;
      }
    });

    const jobsCompletedCount = completedBookings.length;
    const netEarningsMonth = monthGross * 0.90;
    const netEarningsTotal = totalGross * 0.90;
    const todayNet = todayGross * 0.90;

    // Real reviews count and average rating
    const reviews = await Review.find({ workerId: req.user.id });
    const totalReviewsCount = reviews.length;
    const averageRatingCalc = totalReviewsCount > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviewsCount
      : (workerProfile.averageRating || 0);

    const commissionDueCalc = totalGross * 0.10;
    const walletBalanceCalc = workerProfile.walletBalance > 0 ? workerProfile.walletBalance : netEarningsTotal;

    const stats = {
      todayEarnings: todayGross,
      todayNet: todayNet,
      monthEarnings: monthGross,
      monthNet: netEarningsMonth,
      totalEarnings: totalGross,
      totalNet: netEarningsTotal,
      jobsCompleted: jobsCompletedCount,
      avgRating: Number(averageRatingCalc.toFixed(1)),
      totalReviews: totalReviewsCount,
      commissionDue: commissionDueCalc,
      walletBalance: walletBalanceCalc
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
    const { bio, maxTravelDistance, bankDetails, firstName, lastName, phone, email, gender, preferredLanguage } = req.body;
    
    if (firstName || lastName || phone || email || gender || preferredLanguage) {
      await User.findByIdAndUpdate(req.user.id, {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(gender !== undefined && { gender }),
        ...(preferredLanguage !== undefined && { preferredLanguage })
      }, { new: true, runValidators: true });
    }

    if (bio !== undefined || maxTravelDistance !== undefined || bankDetails !== undefined) {
      await WorkerProfile.findOneAndUpdate(
        { userId: req.user.id },
        { 
          ...(bio !== undefined && { bio }), 
          ...(maxTravelDistance !== undefined && { maxTravelDistance }), 
          ...(bankDetails && { bankDetails }) 
        },
        { new: true }
      );
    }

    const updatedUser = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: updatedUser });
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
    const Commission = require('../models/Commission');
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id });
    
    // Find all completed bookings for this worker
    const bookings = await Booking.find({ workerId: req.user.id, status: 'completed' })
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Dynamic calculations from completed bookings
    let totalGross = 0;
    let monthlyGross = 0;
    let todayGross = 0;

    // Track weekly days: Monday to Sunday of current week
    const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday...
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
    startOfWeek.setHours(0, 0, 0, 0);

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyDataMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    bookings.forEach(b => {
      const amount = Number(b.finalAmount || b.fixedRate || 0);
      const createdAt = new Date(b.createdAt);

      totalGross += amount;

      if (createdAt >= startOfMonth) {
        monthlyGross += amount;
      }

      if (createdAt >= startOfToday) {
        todayGross += amount;
      }

      if (createdAt >= startOfWeek) {
        const dayIdx = createdAt.getDay(); // 0: Sun, 1: Mon, ...
        const dayKey = dayIdx === 0 ? 'Sun' : dayLabels[dayIdx - 1];
        if (weeklyDataMap[dayKey] !== undefined) {
          weeklyDataMap[dayKey] += amount * 0.90; // net earnings
        }
      }
    });

    const weeklyChartData = dayLabels.map(label => ({
      day: label,
      amount: weeklyDataMap[label]
    }));

    // Find commissions recorded for this worker
    const commissions = await Commission.find({ workerId: req.user.id });
    let totalCommissionPaid = 0;
    let commissionDue = 0;
    let nextDueDate = null;

    if (commissions.length > 0) {
      commissions.forEach(c => {
        if (c.status === 'paid') {
          totalCommissionPaid += (c.commissionAmount || 0);
        } else {
          commissionDue += (c.commissionAmount || 0);
          if (c.dueDate && (!nextDueDate || new Date(c.dueDate) < new Date(nextDueDate))) {
            nextDueDate = c.dueDate;
          }
        }
      });
    } else {
      // Default: Doorstep commission is 10% of total gross
      commissionDue = totalGross * 0.10;
      if (totalGross > 0) {
        const d = new Date(bookings[0]?.createdAt || now);
        d.setDate(d.getDate() + 7);
        nextDueDate = d;
      }
    }

    const netEarningsAllTime = totalGross * 0.90;
    const monthlyNet = monthlyGross * 0.90;
    const todayNet = todayGross * 0.90;
    const walletBalance = workerProfile?.walletBalance > 0 ? workerProfile.walletBalance : netEarningsAllTime;
      
    const formattedTransactions = bookings.map(b => {
      const jobAmount = Number(b.finalAmount || b.fixedRate || 0);
      const commissionAmount = jobAmount * 0.10;
      const netAmount = jobAmount - commissionAmount;
      return {
        _id: b._id,
        date: b.createdAt,
        description: `Job completed for ${b.customerId?.firstName || 'Customer'}`,
        jobAmount: jobAmount,
        commissionAmount: commissionAmount,
        netAmount: netAmount,
        status: b.paymentStatus === 'paid_cash' || b.paymentStatus === 'paid_online' ? 'PAID' : 'UNPAID'
      };
    });
      
    res.status(200).json({ 
      success: true, 
      data: {
        totalEarnings: totalGross,
        totalNet: netEarningsAllTime,
        monthlyEarnings: monthlyGross,
        monthlyNet: monthlyNet,
        todayEarnings: todayGross,
        todayNet: todayNet,
        walletBalance: walletBalance,
        commissionDue: commissionDue,
        totalCommissionPaid: totalCommissionPaid,
        nextDueDate: nextDueDate,
        weeklyChartData: weeklyChartData,
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
