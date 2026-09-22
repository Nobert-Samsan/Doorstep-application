const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const bookingController = require('../controllers/booking.controller');

router.use(protect);

router.route('/')
  .post(bookingController.createBooking)
  .get(bookingController.getBookings);

router.get('/:bookingId', bookingController.getBookingDetail);

router.put('/:bookingId/accept', bookingController.acceptBooking);
router.put('/:bookingId/decline', bookingController.declineBooking);
router.put('/:bookingId/en-route', bookingController.markEnRoute);
router.put('/:bookingId/arrived', bookingController.markArrived);
router.put('/:bookingId/start', bookingController.markInProgress);
router.put('/:bookingId/complete', bookingController.markCompleted);
router.put('/:bookingId/confirm-cash', bookingController.confirmCashPayment);
router.put('/:bookingId/cancel', bookingController.cancelBooking);

router.get('/:bookingId/status-history', bookingController.getStatusHistory);

module.exports = router;
