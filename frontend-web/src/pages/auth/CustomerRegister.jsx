import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';
import {
  User,
  Phone,
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle,
  WarningCircle,
  Spinner,
  CaretDown
} from '@phosphor-icons/react';

const CustomerRegister = () => {
  // Steps: 1 = Personal Details, 2 = Security, 3 = Verify Email, 4 = Success
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    phone: '',
    email: '',
    district: '',
    city: '',
    streetAddress: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State (6 digits)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const firstInputRef = useRef(null);

  // Step definitions for stepper
  const STEP_NAMES = ['Personal Details', 'Security', 'Verify Email'];

  const handleFieldFocus = (name) => {
    setFocusedField(name);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return !value.trim() ? 'First name is required' : '';
      case 'lastName':
        return !value.trim() ? 'Last name is required' : '';
      case 'phone': {
        const raw = (value || '').trim();
        const digits = raw.replace(/\D/g, '');
        if (raw.startsWith('+')) {
          return digits.length !== 11 ? 'Phone number must be 11 digits with +' : '';
        }
        return digits.length !== 10 ? 'Phone number must be 10 digits' : '';
      }
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Email address is required';
        return !emailRegex.test(value.trim()) ? 'Enter a valid email address' : '';
      }
      case 'password': {
        if (!value) return 'Password is required';
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSymbol = /[^a-zA-Z0-9]/.test(value);
        if (value.length < 8 || !hasLetter || !hasNumber || !hasSymbol) {
          return 'Password must be 8+ chars with letters, numbers & symbols';
        }
        return '';
      }
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        return value !== formData.password ? "Passwords don't match" : '';
      default:
        return '';
    }
  };

  const handleBlur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setFieldErrors((e) => ({ ...e, [name]: validateField(name, formData[name] || '') }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, val) }));
    }
  };

  // Phone number typing & formatting: 77 123 4567
  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.startsWith('0')) {
      raw = raw.slice(1);
    }
    // Limit to 9 digits for Sri Lanka local after +94
    if (raw.length > 9) raw = raw.slice(0, 9);

    // Pass stored phone value (prepend 0 for standard Sri Lanka format expected by backend)
    const storedVal = raw.length > 0 ? `0${raw}` : '';
    setFormData((prev) => ({ ...prev, phone: storedVal }));

    if (touched.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: validateField('phone', storedVal) }));
    }
  };

  // Formatted phone for display
  const getDisplayPhone = () => {
    let digits = (formData.phone || '').replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
  };

  // Step 1 Validation & Next
  const isStep1Valid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    !validateField('phone', formData.phone);

  const handleStep1Next = (e) => {
    if (e) e.preventDefault();
    const errFirst = validateField('firstName', formData.firstName);
    const errLast = validateField('lastName', formData.lastName);
    const errPhone = validateField('phone', formData.phone);

    setTouched({ firstName: true, lastName: true, phone: true });
    setFieldErrors({ firstName: errFirst, lastName: errLast, phone: errPhone });

    if (errFirst || errLast || errPhone) {
      return toast.error('Please check the required fields');
    }

    setDirection('forward');
    setStep(2);
  };

  // Step 2 Validation & Register (Sends OTP)
  const isStep2Valid =
    formData.email.trim() !== '' &&
    !validateField('email', formData.email) &&
    formData.password.length >= 8 &&
    !validateField('password', formData.password) &&
    formData.confirmPassword === formData.password &&
    formData.termsAccepted;

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    const errEmail = validateField('email', formData.email);
    const errPass = validateField('password', formData.password);
    const errConfirm = validateField('confirmPassword', formData.confirmPassword);

    setTouched((t) => ({ ...t, email: true, password: true, confirmPassword: true }));
    setFieldErrors((fe) => ({ ...fe, email: errEmail, password: errPass, confirmPassword: errConfirm }));

    if (errEmail || errPass || errConfirm) {
      return toast.error('Please fix errors in the form');
    }
    if (!formData.termsAccepted) {
      return toast.error('You must accept terms and conditions');
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/send-email-otp', {
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone
      });
      toast.success('Verification code sent to your email!');
      if (response.data?.mockOtp && String(response.data.mockOtp).length === 6) {
        setOtp(String(response.data.mockOtp).split(''));
        toast.info(`Your OTP is: ${response.data.mockOtp}`);
      }
      if (response.data?.previewUrl) {
        console.log('Testing Email URL:', response.data.previewUrl);
      }
      setDirection('forward');
      setStep(3);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtp(['', '', '', '', '', '']);
      const response = await api.post('/auth/send-email-otp', {
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone
      });
      toast.success('A new verification code has been sent!');
      if (response.data?.previewUrl) {
        console.log('Testing Email URL:', response.data.previewUrl);
      }
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  // OTP Timer countdown
  useEffect(() => {
    if (step === 3 && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleOtpChange = (index, value) => {
    const clean = value.replace(/\D/g, '');
    if (!clean && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = clean.slice(-1);
    setOtp(newOtp);

    if (clean && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    otpInputRefs[focusIndex].current?.focus();
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) return toast.error('Enter full 6-digit OTP');

    setIsLoading(true);
    try {
      await api.post('/auth/verify-otp', {
        email: formData.email.trim().toLowerCase(),
        otp: fullOtp
      });

      const { confirmPassword, termsAccepted, ...submitData } = formData;
      submitData.email = submitData.email.trim().toLowerCase();

      const response = await api.post('/auth/register/customer', submitData);

      if (response.data.success) {
        login(response.data.user, response.data.token);
        setStep(4);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid verification code or registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setDirection('backward');
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 1) navigate(-1);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between bg-white overflow-x-hidden font-inter relative">
      {/* SCROLLABLE MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col justify-center items-center px-5 py-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-[440px] my-auto">
          {step < 4 && (
            <div
              className={`transition-all duration-250 ease-out ${
                direction === 'forward' ? 'animate-fadeIn' : 'animate-fadeIn'
              }`}
            >
              {/* Heading Area Centered (for registration steps 1 & 2) */}
              {step <= 2 && (
                <div className="text-center mb-6">
                  {/* Main Step Heading */}
                  <h1 className="font-poppins font-bold text-[28px] md:text-[30px] text-[#000000] leading-tight mb-2">
                    Customer Registration
                  </h1>

                  {/* Subtitle */}
                  <p className="text-[#6B6B6B] text-[15px] md:text-[16px] mb-4">
                    Join DoorStep and find the best workers in Sri Lanka
                  </p>

                  {/* 2-Segment Progress Bar (Visible on all devices) */}
                  <div
                    className="flex gap-1.5 max-w-[200px] mx-auto"
                    role="progressbar"
                    aria-valuenow={step}
                    aria-valuemin={1}
                    aria-valuemax={2}
                  >
                    {[1, 2].map((s) => (
                      <div
                        key={s}
                        className={`h-[4px] flex-1 rounded-full transition-colors duration-200 ${
                          s <= step ? 'bg-[#000000]' : 'bg-[#E8E2DB]'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}

                {/* ================================================= */}
                {/* STEP 1: PERSONAL DETAILS                          */}
                {/* ================================================= */}
                {step === 1 && (
                  <form onSubmit={handleStep1Next} noValidate className="space-y-4">
                    {/* First Name & Last Name (Side by side on desktop, stacked on mobile) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-[14px] font-semibold text-[#000000] mb-2"
                        >
                          First Name
                        </label>
                        <div className="relative">
                          <div
                            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                              focusedField === 'firstName'
                                ? 'text-[#000000]'
                                : 'text-[#6B6B6B]'
                            }`}
                          >
                            <User size={20} />
                          </div>
                          <input
                            ref={firstInputRef}
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('firstName')}
                            onBlur={() => handleBlur('firstName')}
                            autoComplete="given-name"
                            placeholder="e.g. Nimal"
                            className={`w-full h-[46px] sm:h-[56px] rounded-[12px] bg-white pl-[48px] pr-4 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                              touched.firstName && fieldErrors.firstName
                                ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                                : focusedField === 'firstName'
                                ? 'border-[2px] border-[#000000]'
                                : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                            }`}
                          />
                        </div>
                        {touched.firstName && fieldErrors.firstName && (
                          <div
                            aria-live="polite"
                            className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]"
                          >
                            <WarningCircle size={15} />
                            <span>{fieldErrors.firstName}</span>
                          </div>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-[14px] font-semibold text-[#000000] mb-2"
                        >
                          Last Name
                        </label>
                        <div className="relative">
                          <div
                            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                              focusedField === 'lastName'
                                ? 'text-[#000000]'
                                : 'text-[#6B6B6B]'
                            }`}
                          >
                            <User size={20} />
                          </div>
                          <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('lastName')}
                            onBlur={() => handleBlur('lastName')}
                            autoComplete="family-name"
                            placeholder="e.g. Perera"
                            className={`w-full h-[46px] sm:h-[56px] rounded-[12px] bg-white pl-[48px] pr-4 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                              touched.lastName && fieldErrors.lastName
                                ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                                : focusedField === 'lastName'
                                ? 'border-[2px] border-[#000000]'
                                : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                            }`}
                          />
                        </div>
                        {touched.lastName && fieldErrors.lastName && (
                          <div
                            aria-live="polite"
                            className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]"
                          >
                            <WarningCircle size={15} />
                            <span>{fieldErrors.lastName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gender Dropdown Selection */}
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-[14px] font-semibold text-[#000000] mb-2"
                      >
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('gender')}
                          onBlur={() => handleBlur('gender')}
                          className={`w-full h-[46px] sm:h-[56px] rounded-[12px] bg-white px-4 pr-10 text-[16px] text-[#000000] outline-none transition-colors duration-150 appearance-none cursor-pointer border ${
                            focusedField === 'gender'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6B6B]">
                          <CaretDown size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Phone Number (+94) with Fixed Chip */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[14px] font-semibold text-[#000000] mb-2"
                      >
                        Phone Number (+94)
                      </label>
                      <div className="relative">
                        {/* Left Phone Icon */}
                        <div
                          className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                            focusedField === 'phone'
                              ? 'text-[#000000]'
                              : 'text-[#6B6B6B]'
                          }`}
                        >
                          <Phone size={20} />
                        </div>

                        {/* Fixed +94 Chip with 1px divider */}
                        <div className="absolute left-[44px] top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                          <span className="text-[#000000] font-medium text-[15px]">
                            +94
                          </span>
                          <div className="w-[1px] h-[20px] bg-[#E8E2DB]"></div>
                        </div>

                        <input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel-national"
                          value={getDisplayPhone()}
                          onChange={handlePhoneChange}
                          onFocus={() => handleFieldFocus('phone')}
                          onBlur={() => handleBlur('phone')}
                          placeholder="77 123 4567"
                          className={`w-full h-[46px] sm:h-[56px] rounded-[12px] bg-white pl-[92px] pr-4 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                            touched.phone && fieldErrors.phone
                              ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                              : focusedField === 'phone'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        />
                      </div>
                      {touched.phone && fieldErrors.phone && (
                        <div
                          aria-live="polite"
                          className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]"
                        >
                          <WarningCircle size={15} />
                          <span>{fieldErrors.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Desktop Step 1 Submit Button */}
                    <div className="hidden md:block pt-4">
                      <button
                        type="submit"
                        disabled={!isStep1Valid}
                        className={`w-full h-[46px] sm:h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                          isStep1Valid
                            ? 'bg-[#000000] hover:bg-[#222222] active:bg-[#111111] active:scale-[0.99] text-white shadow-none'
                            : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed shadow-none'
                        }`}
                      >
                        <span>Next Step</span>
                        <ArrowRight size={18} weight="bold" />
                      </button>
                    </div>
                  </form>
                )}

                {/* ================================================= */}
                {/* STEP 2: SECURITY                                  */}
                {/* ================================================= */}
                {step === 2 && (
                  <form onSubmit={handleRegister} noValidate className="space-y-4">
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[14px] font-semibold text-[#000000] mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div
                          className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                            focusedField === 'email'
                              ? 'text-[#000000]'
                              : 'text-[#6B6B6B]'
                          }`}
                        >
                          <EnvelopeSimple size={20} />
                        </div>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('email')}
                          onBlur={() => handleBlur('email')}
                          autoComplete="email"
                          placeholder="name@example.com"
                          className={`w-full h-[46px] sm:h-[56px] rounded-[12px] bg-white pl-[48px] pr-4 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                            touched.email && fieldErrors.email
                              ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                              : focusedField === 'email'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        />
                      </div>
                      {touched.email && fieldErrors.email && (
                        <div
                          aria-live="polite"
                          className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]"
                        >
                          <WarningCircle size={15} />
                          <span>{fieldErrors.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-[14px] font-semibold text-[#000000] mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div
                          className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                            focusedField === 'password'
                              ? 'text-[#000000]'
                              : 'text-[#6B6B6B]'
                          }`}
                        >
                          <Lock size={20} />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('password')}
                          onBlur={() => handleBlur('password')}
                          autoComplete="new-password"
                          placeholder="8+ chars with letters, numbers & symbols"
                          className={`w-full h-[46px] sm:h-[56px] rounded-[12px] bg-white pl-[48px] pr-12 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                            touched.password && fieldErrors.password
                              ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                              : focusedField === 'password'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#000000] p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {touched.password && fieldErrors.password && (
                        <div
                          aria-live="polite"
                          className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]"
                        >
                          <WarningCircle size={15} />
                          <span>{fieldErrors.password}</span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-[14px] font-semibold text-[#000000] mb-2"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div
                          className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                            focusedField === 'confirmPassword'
                              ? 'text-[#000000]'
                              : 'text-[#6B6B6B]'
                          }`}
                        >
                          <Lock size={20} />
                        </div>
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('confirmPassword')}
                          onBlur={() => handleBlur('confirmPassword')}
                          autoComplete="new-password"
                          placeholder="Re-enter password"
                          className={`w-full h-[46px] sm:h-[56px] rounded-[12px] bg-white pl-[48px] pr-12 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                            touched.confirmPassword && fieldErrors.confirmPassword
                              ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                              : focusedField === 'confirmPassword'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#000000] p-1 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {touched.confirmPassword && fieldErrors.confirmPassword && (
                        <div
                          aria-live="polite"
                          className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]"
                        >
                          <WarningCircle size={15} />
                          <span>{fieldErrors.confirmPassword}</span>
                        </div>
                      )}
                    </div>

                    {/* Terms & Conditions Row */}
                    <div
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          termsAccepted: !prev.termsAccepted
                        }))
                      }
                      className="py-2 px-1 flex items-start gap-3 cursor-pointer select-none bg-white"
                    >
                      <div
                        className={`w-[20px] h-[20px] rounded-[6px] flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          formData.termsAccepted
                            ? 'bg-[#000000] text-white'
                            : 'border-2 border-[#E8E2DB] bg-white hover:border-[#000000]'
                        }`}
                      >
                        {formData.termsAccepted && <Check size={14} weight="bold" />}
                      </div>
                      <span className="text-[14px] text-[#3D3D3D] leading-snug">
                        I accept the{' '}
                        <a
                          href="#"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#E86100] font-semibold hover:underline"
                        >
                          Terms &amp; Conditions
                        </a>{' '}
                        and{' '}
                        <a
                          href="#"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#E86100] font-semibold hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </div>

                    {/* Desktop Step 2 Buttons (Back 35% + Register 65%) */}
                    <div className="hidden md:flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={goBack}
                        className="w-[35%] h-[46px] sm:h-[56px] rounded-[12px] border-[1.5px] border-[#E8E2DB] text-[#000000] font-poppins font-semibold text-[16px] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!isStep2Valid || isLoading}
                        className={`w-[65%] h-[46px] sm:h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                          isStep2Valid && !isLoading
                            ? 'bg-[#000000] hover:bg-[#222222] active:bg-[#111111] active:scale-[0.99] text-white shadow-none'
                            : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed shadow-none'
                        }`}
                      >
                        {isLoading ? (
                          <Spinner size={22} className="animate-spin text-white" />
                        ) : (
                          <>
                            <span>Register</span>
                            <ArrowRight size={18} weight="bold" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* ================================================= */}
                {/* STEP 3: OTP VERIFICATION                         */}
                {/* ================================================= */}
                {step === 3 && (
                  <div className="space-y-6 text-center">
                    <div className="mb-2">
                      <h1 className="font-poppins font-bold text-[28px] md:text-[30px] text-[#000000] leading-tight mb-2">
                        Verify Email Address
                      </h1>
                      <p className="text-[#6B6B6B] text-[15px] md:text-[16px]">
                        We've sent a 6-digit verification code to{' '}
                        <strong className="text-[#000000]">{formData.email}</strong>
                      </p>
                    </div>

                    {/* 6 OTP Input Boxes */}
                    <div
                      onPaste={handleOtpPaste}
                      className="flex justify-center gap-2 sm:gap-3 my-6"
                    >
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={otpInputRefs[index]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`w-[44px] sm:w-[50px] h-[46px] sm:h-[56px] rounded-[12px] text-center text-[22px] font-poppins font-bold text-[#000000] outline-none transition-colors border ${
                            digit
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] focus:border-[2px] focus:border-[#000000]'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Resend Cooldown */}
                    <div className="text-[14px]">
                      {timer > 0 ? (
                        <p className="text-[#6B6B6B]">
                          Resend code in{' '}
                          <span className="text-[#E86100] font-semibold">
                            {timer}s
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#E86100] font-semibold hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    {/* Desktop Step 3 Button (Full width, No back button) */}
                    <div className="hidden md:block pt-4">
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={otp.join('').length < 6 || isLoading}
                        className={`w-full h-[46px] sm:h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
                          otp.join('').length === 6 && !isLoading
                            ? 'bg-[#000000] hover:bg-[#222222] active:bg-[#111111] active:scale-[0.99] text-white'
                            : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                        }`}
                      >
                        {isLoading ? (
                          <Spinner size={22} className="animate-spin text-white" />
                        ) : (
                          'Verify & Complete'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================= */}
            {/* STEP 4: SUCCESS CONFIRMATION                      */}
            {/* ================================================= */}
            {step === 4 && (
              <div className="space-y-6 text-center py-8">
                <div className="w-[64px] h-[64px] rounded-full bg-[#2E9E5B] text-white flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} weight="bold" />
                </div>
                <h2 className="font-poppins font-bold text-[30px] text-[#000000]">
                  Welcome to DoorStep!
                </h2>
                <p className="text-[#6B6B6B] text-[16px] max-w-[340px] mx-auto">
                  Your customer account has been created successfully. You can now start searching and booking trusted workers.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/customer/dashboard')}
                  className="w-full h-[46px] sm:h-[56px] rounded-[12px] bg-[#000000] hover:bg-[#222222] text-white font-poppins font-semibold text-[16px] transition-colors cursor-pointer"
                >
                  Go to My Dashboard
                </button>
              </div>
            )}

            {/* Desktop Step 1 Footer Link */}
            {step === 1 && (
              <div className="hidden md:block text-center mt-6">
                <p className="text-[15px] text-[#3D3D3D]">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-[#E86100] font-[500] hover:underline"
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            )}
          </div>
        </main>

        {/* ========================================================= */}
        {/* MOBILE STICKY BOTTOM ACTION BAR (below 768px)             */}
        {/* ========================================================= */}
        {step < 4 && (
          <footer className="md:hidden sticky bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E2DB] px-5 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
            {step === 1 && (
              <div>
                <button
                  type="button"
                  onClick={handleStep1Next}
                  disabled={!isStep1Valid}
                  className={`w-full h-[46px] sm:h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-150 ${
                    isStep1Valid
                      ? 'bg-[#000000] active:bg-[#222222] text-white'
                      : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                  }`}
                >
                  <span>Next Step</span>
                  <ArrowRight size={18} weight="bold" />
                </button>
                <p className="text-center text-[14px] text-[#3D3D3D] mt-2.5">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-[#E86100] font-[500] hover:underline"
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={goBack}
                  className="w-[35%] h-[46px] sm:h-[56px] rounded-[12px] border-[1.5px] border-[#E8E2DB] text-[#000000] font-poppins font-semibold text-[16px] active:bg-gray-100"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={!isStep2Valid || isLoading}
                  className={`w-[65%] h-[46px] sm:h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 ${
                    isStep2Valid && !isLoading
                      ? 'bg-[#000000] active:bg-[#222222] text-white'
                      : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <Spinner size={22} className="animate-spin text-white" />
                  ) : (
                    <>
                      <span>Register</span>
                      <ArrowRight size={18} weight="bold" />
                    </>
                  )}
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={otp.join('').length < 6 || isLoading}
                  className={`w-full h-[46px] sm:h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 ${
                    otp.join('').length === 6 && !isLoading
                      ? 'bg-[#000000] active:bg-[#222222] text-white'
                      : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <Spinner size={22} className="animate-spin text-white" />
                  ) : (
                    'Verify & Complete'
                  )}
                </button>
              </div>
            )}
          </footer>
        )}
    </div>
  );
};

export default CustomerRegister;
