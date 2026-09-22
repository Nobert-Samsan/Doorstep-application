const User = require('../models/User');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const WorkerProfile = require('../models/WorkerProfile');
const bcrypt = require('bcryptjs');

exports.getDashboard = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { searchQuery, district, category, verifiedOnly } = req.query;
    
    const activeBookingsCount = await Booking.countDocuments({ 
      customerId, 
      status: { $in: ['pending', 'accepted', 'en_route', 'arrived', 'in_progress'] } 
    });
    
    const recentBookings = await Booking.find({ customerId })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('workerId', 'firstName lastName profilePhoto')
      .populate('categoryId', 'nameEn icon');
      
    const unreadNotifications = await Notification.find({ userId: customerId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5);
      
    const unreadMessagesCount = 0; 

    // Build dynamic query for workers
    let query = { approvalStatus: 'approved' };
    
    if (district) {
      query.serviceDistricts = district;
    } else if (!searchQuery && !category && req.user.district) {
      // Default to user's district if no search is active AND user has a district
      query.serviceDistricts = req.user.district;
    }
    
    // Here we'll do a simple regex on serviceTitle or bio for searchQuery
    if (searchQuery) {
      query.$or = [
        { 'services.serviceTitle': { $regex: searchQuery, $options: 'i' } },
        { bio: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (category) {
      // We will search inside the services array for the category name
      // since the frontend is sending the category name now
      query['services.serviceTitle'] = { $regex: category, $options: 'i' };
    }
    
    // If we had a verified flag on WorkerProfile we would add it here.
    if (verifiedOnly === 'true') {
      query.verifiedBadge = true;
    }

    const recommendedWorkers = await WorkerProfile.find(query)
    .populate({
      path: 'userId',
      select: 'firstName lastName profilePhoto',
      // If we wanted to search by user name: match: { firstName: regex }
    })
    .sort({ averageRating: -1 })
    .limit(20);

    // Filter out workers where populated userId failed (if name filter applied)
    const validWorkers = recommendedWorkers.filter(w => w.userId !== null);

    res.status(200).json({
      success: true,
      data: {
        activeBookingsCount,
        unreadMessagesCount,
        recentBookings,
        unreadNotifications,
        recommendedWorkers: validWorkers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, gender, dateOfBirth, nicNumber, province, district, city, streetAddress, postalCode, landmark, preferredLanguage } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      firstName, lastName, phone, gender, dateOfBirth, nicNumber, province, district, city, streetAddress, postalCode, landmark, preferredLanguage
    }, { new: true, runValidators: true }).select('-password');
    
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

const crypto = require('crypto');

exports.requestEmailChange = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Please provide a new email' });

    // Check if email already in use
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Generate token
    const token = crypto.randomBytes(20).toString('hex');
    
    await User.findByIdAndUpdate(req.user.id, {
      pendingEmail: email,
      emailChangeToken: token,
      emailChangeExpire: Date.now() + 10 * 60 * 1000 // 10 mins
    });

    // Mock sending email
    const verificationUrl = `http://localhost:5173/verify-email/${token}`;
    console.log(`\n\n[EMAIL MOCK] To: ${email} -> Click here to confirm email change: ${verificationUrl}\n\n`);

    res.status(200).json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { sms, email, push } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      notificationsPreferences: { sms, email, push }
    }, { new: true }).select('-password');
    
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    // Delete the user from the database
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Saved workers mocked in User model or a separate junction collection, 
// for simplicity in this massive mock, we will return empty or success
exports.getSavedWorkers = async (req, res) => {
  res.status(200).json({ success: true, data: [] });
};

exports.broadcastJob = async (req, res) => {
  try {
    const { category, jobDescription, district, city, streetAddress, urgency, lat, lng } = req.body;

    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
    }

    const Category = require('../models/Category');
    const mongoose = require('mongoose');
    let cat = null;
    if (mongoose.Types.ObjectId.isValid(category) && String(category).length === 24) {
      cat = await Category.findById(category);
    } else {
      cat = await Category.findOne({ nameEn: new RegExp('^' + category + '$', 'i') });
    }

    if (!cat) {
      return res.status(400).json({ success: false, message: 'Invalid category selected' });
    }

    const Booking = require('../models/Booking');
    const newJob = await Booking.create({
      customerId: req.user.id,
      categoryId: cat._id,
      serviceTitle: cat.nameEn,
      jobDescription,
      district,
      province: 'Western', // Defaulting for scope
      city,
      streetAddress,
      urgency: urgency || 'normal',
      photos,
      status: 'broadcast',
      scheduledDate: new Date(), // Mock immediate date
      scheduledTimeSlot: 'Flexible',
      pricingType: 'variable',
    });

    const { getIO } = require('../socket');
    getIO().emit('new_job_broadcast', newJob);

    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveWorker = async (req, res) => {
  res.status(200).json({ success: true, message: 'Worker saved' });
};

exports.unsaveWorker = async (req, res) => {
  res.status(200).json({ success: true, message: 'Worker unsaved' });
};

// Fetch full profile details of a specific worker
exports.getWorkerProfile = async (req, res) => {
  try {
    // Try to find by WorkerProfile ID first
    let worker = await WorkerProfile.findById(req.params.id)
      .populate('userId', 'firstName lastName profilePhoto createdAt')
      .populate('services.categoryId', 'nameEn icon');
      
    // If not found, try to find by User ID (useful when routing from Bookings)
    if (!worker) {
      worker = await WorkerProfile.findOne({ userId: req.params.id })
        .populate('userId', 'firstName lastName profilePhoto createdAt')
        .populate('services.categoryId', 'nameEn icon');
    }
      
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
