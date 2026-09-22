const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/online', async (req, res) => {
  res.status(200).json({ success: true, message: 'Payment processed' });
});

router.post('/cash-confirm', async (req, res) => {
  res.status(200).json({ success: true, message: 'Cash confirmed' });
});

router.get('/history', async (req, res) => {
  res.status(200).json({ success: true, data: [] });
});

router.get('/receipt/:paymentId', async (req, res) => {
  res.status(200).json({ success: true, url: 'mocked_url' });
});

module.exports = router;
