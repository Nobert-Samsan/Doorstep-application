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
      comment
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

router.get('/worker/:workerId', async (req, res) => res.status(200).json({ success: true, data: [] }));
router.put('/:reviewId/reply', async (req, res) => res.status(200).json({ success: true, message: 'Reply sent' }));
router.post('/:reviewId/report', async (req, res) => res.status(200).json({ success: true, message: 'Reported' }));

module.exports = router;
