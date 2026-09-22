const JobPost = require('../models/JobPost');
const WorkerProfile = require('../models/WorkerProfile');
const Notification = require('../models/Notification');
const { getIO } = require('../socket/socket');
const mongoose = require('mongoose');

exports.createJobPost = async (req, res) => {
  try {
    const jobData = { ...req.body, customerId: req.user.id };
    
    // Lookup category if it's passed as a string
    if (jobData.category && !mongoose.Types.ObjectId.isValid(jobData.category)) {
      const Category = require('../models/Category');
      const categoryDoc = await Category.findOne({ nameEn: jobData.category });
      if (categoryDoc) {
        jobData.categoryId = categoryDoc._id;
      }
    } else if (jobData.category) {
      jobData.categoryId = jobData.category;
    }

    // Map frontend fields to backend schema
    jobData.description = jobData.description || jobData.jobDescription;
    jobData.title = jobData.title || `${jobData.category} Request`;
    jobData.budgetType = jobData.budgetType || 'open';
    jobData.province = jobData.province || 'Unknown';
    
    if (!jobData.preferredDate) {
      jobData.preferredDate = new Date();
    }
    if (!jobData.preferredTimeSlot) {
      jobData.preferredTimeSlot = 'Anytime';
    }
    
    // Map urgency from frontend options if needed
    if (jobData.urgency === 'emergency') jobData.urgency = 'urgent';
    if (jobData.urgency === 'flexible') jobData.urgency = 'normal';
    if (jobData.urgency === 'specific') jobData.urgency = 'soon';
    
    // Default expiration to 7 days if not provided
    if (!jobData.expiresAt) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      jobData.expiresAt = expiresAt;
    }
    
    const jobPost = await JobPost.create(jobData);
    
    // Broadcast to relevant workers
    // Match workers who provide this category (by ID or Title) AND operate in the district
    const Category = require('../models/Category');
    const categoryDoc = await Category.findById(jobPost.categoryId);
    const catName = categoryDoc ? categoryDoc.nameEn.split(' ')[0] : 'nonexistent';

    const matchingWorkers = await WorkerProfile.find({
      $or: [
        { 'services.categoryId': jobPost.categoryId },
        { 'services.serviceTitle': { $regex: catName, $options: 'i' } }
      ],
      'serviceDistricts': jobPost.district,
      approvalStatus: 'approved'
    });
    
    const io = getIO();
    const notifications = [];
    
    for (const workerProfile of matchingWorkers) {
      const workerUserId = workerProfile.userId.toString();
      
      // Emit socket event to the worker's room
      io.to(workerUserId).emit('new_job_broadcast', jobPost);
      
      // Prepare notification
      notifications.push({
        userId: workerProfile.userId,
        type: 'job_broadcast',
        title: 'New Job in Your Area',
        message: `A new job for ${jobPost.title} is available in ${jobPost.district}`,
        data: { jobPostId: jobPost._id }
      });
    }
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
    
    res.status(201).json({ success: true, data: jobPost, matchedWorkers: matchingWorkers.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobPosts = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    }
    
    const jobs = await JobPost.find(query)
      .populate('categoryId', 'nameEn')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRelevantJobPostsForWorker = async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id });
    if (!workerProfile) {
      return res.status(404).json({ success: false, message: 'Worker profile not found' });
    }
    
    let categoryIds = workerProfile.services.map(s => s.categoryId).filter(Boolean);
    const serviceTitles = workerProfile.services.map(s => s.serviceTitle).filter(Boolean);
    
    const Category = require('../models/Category');
    // For workers registered without categoryId, try to match by title keyword
    for (const title of serviceTitles) {
       const keyword = title.split(' ')[0]; // e.g. "Masonry & Concrete" -> "Masonry"
       const cats = await Category.find({ nameEn: { $regex: keyword, $options: 'i' }});
       cats.forEach(c => {
         if (!categoryIds.find(id => id.toString() === c._id.toString())) {
           categoryIds.push(c._id);
         }
       });
    }
    
    const districts = workerProfile.serviceDistricts || [];
    
    const jobs = await JobPost.find({
      categoryId: { $in: categoryIds },
      district: { $in: districts },
      status: 'active',
      expiresAt: { $gt: new Date() }
    })
    .populate('customerId', 'firstName lastName profilePhoto')
    .populate('categoryId', 'nameEn')
    .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
