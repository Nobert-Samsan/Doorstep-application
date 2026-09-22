const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const workerController = require('../controllers/worker.controller');
const customerController = require('../controllers/customer.controller'); // Reuse standard User handlers
const upload = require('../middleware/upload.middleware');

router.use(protect);
router.use(authorize('worker'));

router.get('/dashboard', workerController.getDashboard);
router.get('/earnings', workerController.getEarnings);
router.get('/my-jobs', workerController.getJobs);
router.get('/profile', workerController.getProfile);
router.put('/profile', workerController.updateProfile);
router.put('/profile/photo', upload.single('profilePhoto'), workerController.updateProfilePhoto);
router.put('/profile/services', workerController.updateServices);
router.put('/profile/availability', workerController.updateAvailability);
router.put('/availability-toggle', workerController.toggleAvailability);

// Standard User Management Routes (reused from customer controller as they operate purely on the shared User model)
router.post('/profile/request-email-change', customerController.requestEmailChange);
router.put('/notification-preferences', customerController.updateNotificationPreferences);
router.put('/change-password', customerController.changePassword);
router.delete('/profile', customerController.deleteAccount);

router.get('/earnings', workerController.getEarnings);
router.get('/commission', workerController.getCommission);
router.post('/commission/pay', workerController.payCommission);

router.get('/reviews', workerController.getReviews);
router.put('/reviews/:reviewId/reply', workerController.replyToReview);

router.get('/jobs', workerController.getJobs);
router.get('/job-requests', workerController.getJobRequests);
router.get('/quotations', workerController.getQuotations);

module.exports = router;
