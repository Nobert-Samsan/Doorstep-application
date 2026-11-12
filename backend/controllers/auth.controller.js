const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const generateOTP = require('../utils/generateOTP');
const sendSMS = require('../utils/sendSMS');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
    expiresIn: '90d',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_here', {
    expiresIn: '90d',
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

    // Send Email asynchronously so HTTP request responds immediately (< 500ms)
    sendEmail({
      email,
      subject: 'DoorStep Verification Code',
      message: `Your DoorStep registration OTP is: ${otp}\n\nThis code will expire in 5 minutes.`
    }).catch(emailErr => {
      console.warn('[sendEmailOtp] Email sending failed in background:', emailErr.message);
    });

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent to email', 
      mockOtp: otp
    });
  } catch (error) {
    console.error('[sendEmailOtp ERROR]:', error);
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
    let { firstName, lastName, phone, email, password, bio, totalYearsExperience, gender, dateOfBirth, streetAddress, district, city, documents, maxTravelDistance, ...otherDetails } = req.body;

    // Generate dummy email if not provided since User schema requires unique email
    if (!email) {
      email = `${phone}@doorstep.local`;
    }

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      phone,
      email,
      password,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      streetAddress,
      district,
      city,
      role: 'worker',
      isPhoneVerified: true,
      isApproved: false
    });

    // Format services
    const services = Array.isArray(otherDetails.services) ? otherDetails.services.map(s => ({
      serviceTitle: s.serviceTitle || '',
      yearsExperience: Number(s.yearsExperience) || 0
    })) : [];

    // Calculate total experience if not explicitly set
    const calcExperience = totalYearsExperience 
      ? parseInt(totalYearsExperience) 
      : services.reduce((max, s) => Math.max(max, s.yearsExperience || 0), 0);

    await WorkerProfile.create({
      userId: user._id,
      bio: bio || '',
      totalYearsExperience: calcExperience,
      services,
      serviceDistricts: district ? [district] : [],
      maxTravelDistance: maxTravelDistance ? Number(maxTravelDistance) : undefined,
      documents: {
        nicFront: documents?.nicFront || '',
        nicBack: documents?.nicBack || ''
      }
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
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous OTPs for this email
    await OTP.updateMany({ phoneOrEmail: email, isUsed: false }, { isUsed: true });

    // Save OTP to DB
    await OTP.create({ phoneOrEmail: email, otp, expiresAt });

    // Send formatted Email with 6-digit OTP
    const message = `Your DoorStep password reset code is: ${otp}\n\nThis code will expire in 10 minutes. If you did not request a password reset, please ignore this email.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #E8E2DB; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #000000; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #6B6B6B; font-size: 15px; margin-bottom: 24px;">Use the verification code below to reset your DoorStep password:</p>
        <div style="background: #FFF8F1; border: 1px dashed #FF7A00; border-radius: 10px; padding: 18px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #FF7A00;">${otp}</span>
        </div>
        <p style="color: #6B6B6B; font-size: 13px; line-height: 1.5;">This code will expire in <strong>10 minutes</strong>. If you did not request this code, you can safely ignore this email.</p>
      </div>
    `;

    try {
      const result = await sendEmail({
        email: user.email,
        subject: 'Your DoorStep Password Reset Code',
        message,
        html
      });

      res.status(200).json({ 
        success: true, 
        message: 'Password reset code sent to your email',
        previewUrl: result?.previewUrl
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const { otp } = req.body;

    const otpRecord = await OTP.findOne({
      phoneOrEmail: email,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    res.status(200).json({ success: true, message: 'Code verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const { otp, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const otpRecord = await OTP.findOne({
      phoneOrEmail: email,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Set new password
    user.password = password;
    await user.save();

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    });
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


// ==========================================
// PASSWORDLESS LOGIN (OTP via Email or Phone)
// ==========================================
exports.sendLoginOtp = async (req, res) => {
  try {
    const { identifier, role } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please provide an email or phone number' });
    }

    const trimmed = identifier.trim().toLowerCase();
    const isEmail = trimmed.includes('@');
    
    // Find user by email (case-insensitive) or phone
    let user;
    if (isEmail) {
      user = await User.findOne({ email: { $regex: new RegExp('^' + trimmed + '$', 'i') } });
    } else {
      user = await User.findOne({ phone: trimmed.replace(/[^0-9+]/g, '') });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered account found with this ' + (isEmail ? 'email address' : 'phone number') + '. Please register first.'
      });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Account is suspended: ' + (user.banReason || 'Contact support') });
    }

    // Role check: ensure user signs in via matching role tab
    if (role && user.role !== role) {
      const expectedTab = user.role === 'worker' ? 'Worker' : 'Customer';
      return res.status(400).json({
        success: false,
        message: 'This account belongs to a ' + expectedTab + '. Please switch to the ' + expectedTab + ' tab.'
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const contactTarget = isEmail ? user.email.toLowerCase() : user.phone;

    // Invalidate previous active OTPs for this target
    await OTP.updateMany({ phoneOrEmail: contactTarget, isUsed: false }, { isUsed: true });

    // Save new OTP
    await OTP.create({ phoneOrEmail: contactTarget, otp, expiresAt });

    if (isEmail) {
      // Send email without blocking the response in case of SMTP lag
      sendEmail({
        email: user.email,
        subject: 'Your DoorStep Login Code',
        message: `Hello ${user.firstName || 'User'},\n\nYour login verification code is: ${otp}\n\nThis code will expire in 5 minutes. Do not share this code with anyone.`
      }).catch(err => console.error('[sendLoginOtp Email Error]:', err.message));
    } else {
      await sendSMS(user.phone, 'Your DoorStep login OTP is ' + otp + '. Valid for 5 minutes.');
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully to your ' + (isEmail ? 'email address' : 'phone number'),
      identifier: isEmail ? user.email : user.phone,
      isEmail,
      mockOtp: otp // Always return mockOtp so client / dev never gets stuck
    });
  } catch (error) {
    console.error('[sendLoginOtp ERROR]:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send login code' });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { identifier, otp, role } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Identifier and OTP code are required' });
    }

    const trimmed = identifier.trim().toLowerCase();
    const isEmail = trimmed.includes('@');

    // Query user first
    let user;
    if (isEmail) {
      user = await User.findOne({ email: { $regex: new RegExp('^' + trimmed + '$', 'i') } });
    } else {
      user = await User.findOne({ phone: trimmed.replace(/[^0-9+]/g, '') });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const contactTarget = isEmail ? user.email.toLowerCase() : user.phone;

    const otpRecord = await OTP.findOne({
      phoneOrEmail: contactTarget,
      otp: otp.trim(),
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Account is suspended: ' + (user.banReason || 'Contact support') });
    }

    if (role && user.role !== role) {
      const expectedTab = user.role === 'worker' ? 'Worker' : 'Customer';
      return res.status(400).json({
        success: false,
        message: 'This account belongs to a ' + expectedTab + '. Please switch to the ' + expectedTab + ' tab.'
      });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
      user: userResponse
    });
  } catch (error) {
    console.error('[verifyLoginOtp ERROR]:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to verify login code' });
  }
};
