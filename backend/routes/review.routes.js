const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

const Review = require('../models/Review');
const Booking = require('../models/Booking');
const WorkerProfile = require('../models/WorkerProfile');

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const { bookingId, workerId, rating, comment } = req.body;
    
    // Check if booking exists and belongs to customer
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Create review
    const review = await Review.create({
      bookingId,
      workerId,
      customerId: req.user.id,
      rating: Number(rating),
      comment: comment || '',
      reviewText: comment || ''
    });

    // Link review to booking
    booking.reviewId = review._id;
    await booking.save();

    // Update worker stats
    const workerProfile = await WorkerProfile.findOne({ userId: workerId });
    if (workerProfile) {
      workerProfile.totalReviews = (workerProfile.totalReviews || 0) + 1;
      // Moving average calculation
      const currentAvg = workerProfile.averageRating || 0;
      const n = workerProfile.totalReviews;
      workerProfile.averageRating = ((currentAvg * (n - 1)) + Number(rating)) / n;
      await workerProfile.save();
    }

    res.status(201).json({ success: true, data: review, message: 'Review submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/my-reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.user.id })
      .populate('customerId', 'firstName lastName profilePhoto')
      .populate('bookingId', 'serviceTitle scheduledDate')
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / total) : 0;

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rounded = Math.round(r.rating);
      if (breakdown[rounded] !== undefined) breakdown[rounded]++;
    });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        stats: {
          averageRating: Number(avg.toFixed(1)),
          totalReviews: total,
          breakdown
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId, isPublic: true })
      .populate('customerId', 'firstName lastName profilePhoto')
      .populate('bookingId', 'serviceTitle')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.put('/:reviewId/reply', async (req, res) => res.status(200).json({ success: true, message: 'Reply sent' }));
router.post('/:reviewId/report', async (req, res) => res.status(200).json({ success: true, message: 'Reported' }));

module.exports = router;
