const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const jobPostController = require('../controllers/jobPost.controller');

router.use(protect);

router.post('/', authorize('customer'), jobPostController.createJobPost);
router.get('/', authorize('customer', 'admin'), jobPostController.getJobPosts);
router.get('/relevant', authorize('worker'), jobPostController.getRelevantJobPostsForWorker);

// Stubs for remaining endpoints
router.get('/:postId', async (req, res) => res.status(200).json({ success: true, data: {} }));
router.put('/:postId', async (req, res) => res.status(200).json({ success: true }));
router.delete('/:postId', async (req, res) => res.status(200).json({ success: true }));
router.get('/:postId/applications', async (req, res) => res.status(200).json({ success: true, data: [] }));
router.put('/:postId/applications/:appId/accept', async (req, res) => res.status(200).json({ success: true }));
router.put('/:postId/applications/:appId/reject', async (req, res) => res.status(200).json({ success: true }));

module.exports = router;
