const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { getIO } = require('../socket/socket');

exports.createBooking = async (req, res) => {
  try {
    const bookingData = { ...req.body, customerId: req.user.id };
    const booking = await Booking.create(bookingData);
    
    // Notify worker
    const io = getIO();
    io.to(booking.workerId.toString()).emit('new_booking_request', booking);
    
    await Notification.create({
      userId: booking.workerId,
      type: 'booking',
      title: 'New Booking Request',
      message: `You have a new booking request for ${booking.serviceTitle}`,
      data: { bookingId: booking._id }
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') query.customerId = req.user.id;
    else if (req.user.role === 'worker') query.workerId = req.user.id;
    else if (req.user.role === 'admin') query = {};

    const bookings = await Booking.find(query)
      .populate('customerId', 'firstName lastName profilePhoto')
      .populate('workerId', 'firstName lastName phone profilePhoto')
      .populate('categoryId', 'nameEn')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingDetail = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.bookingId)
      .populate('customerId', 'firstName lastName phone streetAddress city profilePhoto') // address revealed if accepted
      .populate('workerId', 'firstName lastName phone profilePhoto')
      .populate('categoryId', 'nameEn')
      .lean();
      
    if (!booking) {
      // Fallback to JobPost for broadcast jobs
      const JobPost = require('../models/JobPost');
      const jobPost = await JobPost.findById(req.params.bookingId)
        .populate('customerId', 'firstName lastName phone streetAddress city profilePhoto')
        .populate('categoryId', 'nameEn')
        .lean();
        
      if (!jobPost) {
        return res.status(404).json({ success: false, message: 'Booking or JobPost not found' });
      }
      
      booking = {
        ...jobPost,
        _id: jobPost._id,
        isBroadcast: true,
        serviceTitle: jobPost.title || 'Broadcast Job Request',
        scheduledDate: jobPost.preferredDate,
        scheduledTimeSlot: jobPost.preferredTimeSlot,
        jobDescription: jobPost.description,
        status: 'pending' // UI flow treats an open broadcast as 'pending'
      };
    }
    
    // Privacy protection
    if (booking.status === 'pending' && req.user.role === 'worker') {
      if (booking.customerId) {
        booking.customerId.streetAddress = undefined;
        booking.customerId.phone = undefined;
      }
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (bookingId, status, userId, ioEvent, title, message) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  
  booking.status = status;
  booking.statusHistory.push({ status, timestamp: new Date() });
  await booking.save();

  const notifyUserId = booking.customerId.toString() === userId.toString() ? booking.workerId : booking.customerId;

  const io = getIO();
  io.to(notifyUserId.toString()).emit(ioEvent, booking);

  await Notification.create({
    userId: notifyUserId,
    type: 'booking',
    title,
    message,
    data: { bookingId: booking._id }
  });

  return booking;
};

exports.acceptBooking = async (req, res) => {
  try {
    // Payment Lock Check: If the worker has any pending cash collections, block them
    const pendingCashJobs = await Booking.findOne({ 
      workerId: req.user.id, 
      paymentStatus: 'pending' 
    });
    
    if (pendingCashJobs) {
      return res.status(403).json({ 
        success: false, 
        message: 'You have a pending cash collection. You must confirm receipt of cash before accepting new jobs.' 
      });
    }

    let bookingId = req.params.bookingId;
    let isNewBooking = false;
    
    // Check if it's a broadcast JobPost
    const JobPost = require('../models/JobPost');
    const jobPost = await JobPost.findById(bookingId);
    
    if (jobPost) {
      if (jobPost.status !== 'active') {
        return res.status(400).json({ success: false, message: 'This job has already been claimed or is no longer active.' });
      }
      
      // Create a direct Booking on the fly linking this worker and the customer
      const booking = await Booking.create({
        customerId: jobPost.customerId,
        workerId: req.user.id,
        categoryId: jobPost.categoryId,
        serviceTitle: jobPost.title || 'Broadcast Job Request',
        jobDescription: jobPost.description,
        streetAddress: jobPost.streetAddress,
        city: jobPost.city,
        district: jobPost.district,
        province: jobPost.province,
        scheduledDate: jobPost.preferredDate,
        scheduledTimeSlot: jobPost.preferredTimeSlot,
        urgency: jobPost.urgency,
        budgetType: jobPost.budgetType,
        status: 'accepted',
        pricingType: 'variable',
        chargeType: 'job',
        statusHistory: [{ status: 'accepted', timestamp: new Date() }]
      });
      
      jobPost.status = 'filled'; // Mark the broadcast job as filled
      await jobPost.save();
      
      bookingId = booking._id;
      isNewBooking = true;
      
      // Notify customer
      const io = getIO();
      io.to(jobPost.customerId.toString()).emit('booking_status_update', booking);
      await Notification.create({
        userId: jobPost.customerId,
        type: 'booking',
        title: 'Broadcast Job Claimed',
        message: `Your broadcast job request has been claimed!`,
        data: { bookingId: booking._id }
      });
      
      return res.status(200).json({ success: true, data: booking, newBookingId: booking._id });
    }

    const booking = await updateBookingStatus(
      bookingId, 'accepted', req.user.id, 
      'booking_status_update', 'Booking Accepted', 'Your booking request has been accepted'
    );
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.declineBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.bookingId);
    
    // If it's a broadcast job, a single worker declining it shouldn't cancel the job for everyone.
    // We just return success so the frontend removes it (ideally we'd save it in a 'declined by' array).
    if (!booking) {
      const JobPost = require('../models/JobPost');
      const jobPost = await JobPost.findById(req.params.bookingId);
      if (jobPost) {
        return res.status(200).json({ success: true, message: 'Broadcast job ignored' });
      }
    }

    booking = await Booking.findByIdAndUpdate(req.params.bookingId, {
      status: 'cancelled',
      cancellationReason: req.body.reason,
      cancelledBy: req.user.id
    }, { new: true });
    
    const io = getIO();
    io.to(booking.customerId.toString()).emit('booking_status_update', booking);
    
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markEnRoute = async (req, res) => {
  try {
    const booking = await updateBookingStatus(
      req.params.bookingId, 'en_route', req.user.id, 
      'booking_status_update', 'Worker En Route', 'The worker is on their way'
    );
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markArrived = async (req, res) => {
  try {
    const booking = await updateBookingStatus(
      req.params.bookingId, 'arrived', req.user.id, 
      'booking_status_update', 'Worker Arrived', 'The worker has arrived at your location'
    );
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markInProgress = async (req, res) => {
  try {
    const booking = await updateBookingStatus(
      req.params.bookingId, 'in_progress', req.user.id, 
      'booking_status_update', 'Job Started', 'The worker has started the job'
    );
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markCompleted = async (req, res) => {
  try {
    const { finalAmount } = req.body || {};
    const booking = await Booking.findById(req.params.bookingId);
    booking.status = 'completed';
    if (finalAmount !== undefined) {
      booking.finalAmount = finalAmount;
    }
    booking.statusHistory.push({ status: 'completed', timestamp: new Date() });
    await booking.save();
    
    const io = getIO();
    io.to(booking.customerId.toString()).emit('booking_status_update', booking);

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmCashPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.workerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const Commission = require('../models/Commission');
    
    booking.paymentStatus = 'paid_cash';
    booking.status = 'completed';
    booking.statusHistory.push({ status: 'completed', timestamp: new Date() });
    await booking.save();
    
    // Create Commission Debt for the platform
    // Defaulting to booking.finalAmount or 0
    const jobAmount = booking.finalAmount || 0;
    if (jobAmount > 0) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days
      
      await Commission.create({
        workerId: req.user.id,
        bookingId: booking._id,
        jobAmount: jobAmount,
        commissionRate: 10,
        commissionAmount: jobAmount * 0.10,
        status: 'pending',
        dueDate: dueDate
      });
    }

    // Update Worker Profile Totals
    const WorkerProfile = require('../models/WorkerProfile');
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id });
    if (workerProfile) {
      workerProfile.totalJobsCompleted = (workerProfile.totalJobsCompleted || 0) + 1;
      workerProfile.totalEarnings = (workerProfile.totalEarnings || 0) + jobAmount;
      workerProfile.commissionDue = (workerProfile.commissionDue || 0) + (jobAmount * 0.10);
      await workerProfile.save();
    }

    // Notify customer that payment was received and job is complete
    const io = getIO();
    io.to(booking.customerId.toString()).emit('booking_status_update', booking);

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.bookingId, {
      status: 'cancelled',
      cancellationReason: req.body.reason,
      cancelledBy: req.user.id
    }, { new: true });
    
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStatusHistory = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).select('statusHistory');
    res.status(200).json({ success: true, data: booking.statusHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
