const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const generateOTP = require('../utils/generateOTP');
const sendSMS = require('../utils/sendSMS');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_here', {
    expiresIn: '30d',
  });
};

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = generateOTP();
    
    // Save OTP to DB
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    await OTP.create({ phoneOrEmail: phone, otp, expiresAt });

    // Send SMS
    await sendSMS(phone, `Your DoorStep OTP is ${otp}. Valid for 5 minutes.`);

    res.status(200).json({ success: true, message: 'OTP sent successfully', mockOtp: otp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendEmail = require('../utils/sendEmail');

exports.sendEmailOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    // Check if user already exists BEFORE sending OTP
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }
    
    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ success: false, message: 'An account with this phone number already exists' });
      }
    }

    const otp = generateOTP();
    
    // Save OTP to DB
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    await OTP.create({ phoneOrEmail: email, otp, expiresAt });

    // Send Email
    const result = await sendEmail({
      email,
      subject: 'DoorStep Verification Code',
      message: `Your DoorStep registration OTP is: ${otp}\n\nThis code will expire in 5 minutes.`
    });

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent to email', 
      previewUrl: result?.previewUrl 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;
    const identifier = phone || email;
    
    const otpRecord = await OTP.findOne({ 
      phoneOrEmail: identifier, 
      otp, 
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerCustomer = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, gender, dateOfBirth, nicNumber, province, district, city, streetAddress, postalCode, landmark, preferredLanguage } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }
    
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ success: false, message: 'An account with this phone number already exists' });
    }

    const user = await User.create({
      firstName, lastName, phone, email, password, gender, dateOfBirth, nicNumber,
      province, district, city, streetAddress, postalCode, landmark, preferredLanguage,
      role: 'customer',
      isPhoneVerified: true // Assuming they verified before submitting form
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Worker Registration Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerWorker = async (req, res) => {
  try {
    let { firstName, lastName, phone, email, password, bio, totalYearsExperience, gender, dateOfBirth, streetAddress, district, city, ...otherDetails } = req.body;

    // Generate dummy email if not provided since User schema requires unique email
    if (!email) {
      email = `${phone}@doorstep.local`;
    }

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      firstName, lastName, phone, email, password, gender, dateOfBirth, streetAddress, district, city, role: 'worker', isPhoneVerified: true
    });

    // Handle files via req.files if using real storage
    
    await WorkerProfile.create({
      userId: user._id,
      bio,
      totalYearsExperience: parseInt(totalYearsExperience) || 0,
      services: otherDetails.services || [],
      serviceDistricts: district ? [district] : [],
      // Set other details...
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    });
  } catch (error) {
    console.error('Worker Registration Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    
    if ((!email && !phone) || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/phone and password' });
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Account is banned: ' + user.banReason });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      const result = await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({ 
        success: true, 
        message: 'Email sent',
        previewUrl: result?.previewUrl
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyEmailChange = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      emailChangeToken: token,
      emailChangeExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Update email
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
