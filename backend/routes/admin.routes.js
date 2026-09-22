const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const adminController = require('../controllers/admin.controller');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', adminController.getDashboard);

router.get('/workers', adminController.getWorkers);
router.put('/workers/:workerId/approve', adminController.approveWorker);
router.put('/workers/:workerId/reject', adminController.rejectWorker);

// Stubs for future features
router.get('/customers', async (req, res) => res.status(200).json({ success: true, data: [] }));

router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);

module.exports = router;
