const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { authorize: roleCheck } = require('../middleware/role.middleware');
const customerController = require('../controllers/customer.controller');
const upload = require('../middleware/upload.middleware');

// Apply protection and customer role check to all routes in this file
router.use(protect);
router.use(roleCheck('customer'));

router.get('/dashboard', customerController.getDashboard);
router.get('/worker/:id', customerController.getWorkerProfile);
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
router.post('/profile/request-email-change', customerController.requestEmailChange);
router.put('/profile/photo', upload.single('profilePhoto'), customerController.updateProfilePhoto);
router.put('/notification-preferences', customerController.updateNotificationPreferences);
router.put('/change-password', customerController.changePassword);

router.get('/saved-workers', customerController.getSavedWorkers);
router.route('/saved-workers/:workerId')
  .post(customerController.saveWorker)
  .delete(customerController.unsaveWorker);

router.post('/broadcast-job', upload.array('photos', 5), customerController.broadcastJob);

router.delete('/profile', customerController.deleteAccount);

module.exports = router;
