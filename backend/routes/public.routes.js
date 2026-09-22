const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

router.get('/categories', publicController.getCategories);
router.get('/workers/search', publicController.searchWorkers);
router.get('/workers/featured', publicController.getFeaturedWorkers);
router.get('/workers/:id', publicController.getWorkerProfile);
router.get('/stats', publicController.getLandingStats);

module.exports = router;
