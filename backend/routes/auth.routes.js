const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const authController = require('../controllers/auth.controller');

// @route   POST /api/auth/send-otp
router.post('/send-otp', authLimiter, [
  check('phone', 'Phone number is required').not().isEmpty()
], validate, authController.sendOtp);

// @route   POST /api/auth/send-email-otp
router.post('/send-email-otp', authLimiter, [
  check('email', 'Valid email is required').isEmail()
], validate, authController.sendEmailOtp);

// @route   POST /api/auth/verify-otp
router.post('/verify-otp', authLimiter, [
  check('otp', 'OTP is required').not().isEmpty()
], validate, authController.verifyOtp);

// @route   POST /api/auth/register/customer
router.post('/register/customer', upload.single('profilePhoto'), [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], validate, authController.registerCustomer);

// @route   POST /api/auth/register/worker
router.post('/register/worker', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'nicFront', maxCount: 1 },
  { name: 'nicBack', maxCount: 1 },
  { name: 'qualificationDocs', maxCount: 5 },
  { name: 'policeClearance', maxCount: 1 },
  { name: 'selfieWithNic', maxCount: 1 }
]), [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], validate, authController.registerWorker);

// @route   POST /api/auth/login
router.post('/login', authLimiter, [
  check('password', 'Password is required').exists()
], validate, authController.login);

// @route   GET /api/auth/me
router.get('/me', protect, authController.getMe);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], validate, authController.forgotPassword);

// @route   PUT /api/auth/reset-password/:resettoken
router.put('/reset-password/:resettoken', [
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], validate, authController.resetPassword);

// @route   POST /api/auth/verify-email-change/:token
router.post('/verify-email-change/:token', authController.verifyEmailChange);

module.exports = router;
