const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const Quotation = require('../models/Quotation');
const Booking = require('../models/Booking');

router.use(protect);

router.post('/', authorize('worker'), async (req, res) => {
  try {
    let { bookingId, lineItems, estimatedDuration, noteToCustomer } = req.body;
    let booking = await Booking.findById(bookingId);
    
    // If Booking not found, check if it's a broadcast JobPost
    if (!booking) {
      const JobPost = require('../models/JobPost');
      const jobPost = await JobPost.findById(bookingId);
      
      if (!jobPost) {
        return res.status(404).json({ success: false, message: 'Booking or JobPost not found' });
      }
      
      // Create a direct Booking on the fly linking this worker and the customer
      booking = await Booking.create({
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
        status: 'pending',
        pricingType: 'variable', // Added to pass mongoose validation
        chargeType: 'job'
      });
      
      // Update the reference so the quotation attaches to the newly created Booking
      bookingId = booking._id;
    }
    
    if (booking.workerId && booking.workerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    let totalAmount = 0;
    if (lineItems && lineItems.length > 0) {
      totalAmount = lineItems.reduce((acc, item) => acc + Number(item.amount), 0);
    }

    const commissionAmount = totalAmount * 0.10;
    const workerNetAmount = totalAmount - commissionAmount;

    // Default valid until 3 days from now
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 3);

    const quotation = await Quotation.create({
      bookingId,
      workerId: req.user.id,
      customerId: booking.customerId,
      lineItems,
      totalAmount,
      commissionAmount,
      workerNetAmount,
      estimatedDuration,
      validUntil,
      noteToCustomer,
      status: 'pending'
    });

    const hasStarted = booking.statusHistory && booking.statusHistory.some(h => h.status === 'in_progress');
    
    // If the work hasn't started, it's an estimate. If it has started, it's a final bill.
    if (!hasStarted && booking.status !== 'in_progress' && booking.status !== 'completed') {
      booking.status = 'quote_provided';
      booking.statusHistory.push({ status: 'quote_provided', timestamp: new Date() });
      await booking.save();
    }
    
    // Notify customer
    const { getIO } = require('../socket/socket');
    const Notification = require('../models/Notification');
    
    const io = getIO();
    io.to(booking.customerId.toString()).emit('new_quotation', quotation);
    
    await Notification.create({
      userId: booking.customerId,
      type: 'system',
      title: 'New Quotation Received',
      message: `You have received a new quotation for ${booking.serviceTitle}`,
      data: { quotationId: quotation._id, bookingId: booking._id }
    });

    res.status(201).json({ 
      success: true, 
      data: quotation,
      newBookingId: booking._id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/booking/:bookingId', async (req, res) => {
  try {
    const quotations = await Quotation.find({ bookingId: req.params.bookingId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: quotations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:quotationId/accept', authorize('customer'), async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.quotationId);
    if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
    
    // Simulate customer clicking "Accept & Pay Cash"
    quotation.status = 'accepted';
    await quotation.save();

    const booking = await Booking.findById(quotation.bookingId);
    if (booking) {
      booking.paymentStatus = 'pending'; // Triggers the "Confirm Cash Received" lock on worker side
      booking.status = 'in_progress'; // Officially unlocked for final completion once paid
      booking.finalAmount = quotation.totalAmount; // Set the agreed price
      booking.statusHistory.push({ status: 'in_progress', timestamp: new Date() });
      await booking.save();
    }

    res.status(200).json({ success: true, message: 'Quotation accepted, waiting for cash collection' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:quotationId/reject', authorize('customer'), async (req, res) => {
  res.status(200).json({ success: true, message: 'Quotation rejected' });
});

module.exports = router;
