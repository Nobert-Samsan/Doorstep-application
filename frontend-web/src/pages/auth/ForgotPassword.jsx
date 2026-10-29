import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  EnvelopeSimple, 
  WarningCircle, 
  Spinner,
  Lock,
  Eye,
  EyeSlash,
  CheckCircle
} from '@phosphor-icons/react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Multi-step State: 1 = Email, 2 = 6-digit OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form State
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // OTP State (6 digits)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const otpInputRefs = [
    useRef(null), useRef(null), useRef(null), 
    useRef(null), useRef(null), useRef(null)
  ];

  // Password State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const headingRef = useRef(null);
  const emailInputRef = useRef(null);

  // Email validation
  const isValidEmail = EMAIL_REGEX.test(email.trim());
  const showEmailError = touched && !isValidEmail && email.length > 0;

  // Password validation
  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password === confirmPassword;

  // 30s Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Focus heading on step transition for accessibility
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
    if (step === 2 && otpInputRefs[0]?.current) {
      setTimeout(() => otpInputRefs[0].current?.focus(), 150);
    }
  }, [step]);

  // ==========================================
  // HANDLERS
  // ==========================================

  // Step 1: Send OTP to Email
  const handleSendEmail = async (e) => {
    if (e) e.preventDefault();
    if (!isValidEmail || loading) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email: email.trim() });
      toast.success(response.data.message || 'Verification code sent to your email');
      setStep(2);
      setCooldown(30);
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message;
      if (status === 429) {
        setErrorMessage(msg || 'Too many attempts. Please try again later.');
      } else if (msg) {
        setErrorMessage(msg);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      toast.error(msg || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await api.post('/auth/forgot-password', { email: email.trim() });
      toast.success(response.data.message || 'New verification code sent');
      setCooldown(30);
      setOtp(['', '', '', '', '', '']);
      otpInputRefs[0]?.current?.focus();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to resend code';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP input typing & auto-focus
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (errorMessage) setErrorMessage('');

    if (digit && index < 5) {
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
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputRefs[nextIndex].current?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6 || loading) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await api.post('/auth/verify-reset-otp', {
        email: email.trim(),
        otp: fullOtp
      });
      setStep(3); // Move to Set New Password
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid or expired verification code';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save New Password
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    if (!isPasswordValid || !doPasswordsMatch || loading) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await api.post('/auth/reset-password-otp', {
        email: email.trim(),
        otp: otp.join(''),
        password
      });
      toast.success('Password reset successfully!');
      setStep(4); // Success screen
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to reset password';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.every(d => d !== '');

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden">
      
      {/* ======================================================== */}
      {/* MOBILE TOP BAR (below 768px: clean flat white page)      */}
      {/* ======================================================== */}
      <div className="md:hidden w-full h-[56px] border-b border-[#E8E2DB] bg-white px-4 flex items-center justify-between sticky top-0 z-20">
        <button 
          type="button"
          onClick={() => {
            if (step === 2) setStep(1);
            else if (step === 3) setStep(2);
            else navigate('/login');
          }}
          aria-label="Go back"
          className="w-11 h-11 flex items-center justify-center rounded-[12px] text-[#3D3D3D] hover:text-[#000000] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
        >
          <ArrowLeft size={22} weight="bold" />
        </button>
        <Link to="/" className="flex items-center justify-center">
          <img src="/logo-new.png" alt="DoorStep" className="h-6 w-auto object-contain" />
        </Link>
        <div className="w-11" aria-hidden="true" />
      </div>

      {/* ======================================================== */}
      {/* LEFT BRAND PANEL (DESKTOP >= 1024px, identical to Login) */}
      {/* ======================================================== */}
      <div className="hidden lg:flex flex-col lg:w-[45%] relative overflow-hidden p-10 justify-between bg-[#000000]">
        
        {/* Background Image and flat dark overlay */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="/login-bg.jpg" 
            alt="Professional at work" 
            className="absolute inset-0 w-full h-full object-cover object-[center_top] pointer-events-none" 
            style={{ transformOrigin: 'top center' }}
          />
          <div className="absolute inset-0 bg-[#000000]/20 pointer-events-none"></div>
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.92) 80%, #000000 100%)' }}
          ></div>
        </div>

        {/* Top Logo & Tagline */}
        <div className="relative z-10">
          <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded">
            <img src="/logo-new.png" alt="DoorStep" className="h-10 md:h-12 w-auto object-contain" />
            <p className="text-white/90 text-[16px] mt-2.5 font-inter font-normal">Sri Lanka's trusted home services platform</p>
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-10 mt-12 mb-auto flex-1 flex flex-col justify-end pb-4">
          <div>
            <h1 className="text-[32px] lg:text-[44px] font-poppins font-bold text-white leading-[1.15] mb-3 max-w-[480px]">
              Find trusted workers <span className="text-[#FF7A00]">right at your doorstep</span>
            </h1>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT CONTENT PANEL (White, flat, no outer card)        */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[55%] relative flex flex-col justify-between md:justify-center items-center bg-white min-h-[calc(100dvh-56px)] md:min-h-screen">
        
        <div className="w-full max-w-[400px] px-5 py-6 md:px-0 md:py-12 flex-1 md:flex-initial flex flex-col justify-center">

          {/* Desktop/Tablet Back Navigation */}
          {step < 4 && (
            <div className="hidden md:block mb-8">
              <button 
                type="button"
                onClick={() => {
                  if (step === 2) setStep(1);
                  else if (step === 3) setStep(2);
                  else navigate('/login');
                }}
                className="group inline-flex items-center gap-2 font-inter font-semibold text-[15px] text-[#3D3D3D] hover:text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000] rounded-md px-1 py-0.5 transition-colors"
              >
                <ArrowLeft 
                  size={18} 
                  weight="bold" 
                  className="transition-transform duration-200 group-hover:-translate-x-[3px]" 
                />
                <span>
                  {step === 1 ? 'Back to login' : 'Back'}
                </span>
              </button>
            </div>
          )}

          {/* Inline Error Banner */}
          {errorMessage && (
            <div 
              role="alert"
              aria-live="assertive"
              className="mb-6 p-3.5 bg-[#FDECEC] border border-[#F3B8B2] rounded-[12px] flex items-start gap-2.5 text-[#B42318] text-[14px] font-inter"
            >
              <WarningCircle size={20} weight="fill" className="shrink-0 mt-0.5 text-[#B42318]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: ENTER EMAIL                                     */}
          {/* ======================================================== */}
          {step === 1 && (
            <div className="text-left">
              <h2 
                ref={headingRef}
                tabIndex={-1}
                className="text-[30px] font-poppins font-bold text-[#000000] leading-tight mb-2 outline-none"
              >
                Reset your password
              </h2>
              <p className="text-[#6B6B6B] font-inter text-[16px] leading-[1.6] mb-6">
                Enter your email address and we'll send you a 6-digit verification code.
              </p>

              <form onSubmit={handleSendEmail} noValidate>
                <div className="mb-6">
                  <label 
                    htmlFor="reset-email" 
                    className="block font-inter font-semibold text-[14px] text-[#000000] mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <span 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none flex items-center"
                      aria-hidden="true"
                    >
                      <EnvelopeSimple size={20} weight="regular" />
                    </span>
                    <input
                      ref={emailInputRef}
                      id="reset-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      onBlur={() => setTouched(true)}
                      aria-invalid={showEmailError}
                      aria-describedby={showEmailError ? "email-error" : undefined}
                      className={`w-full h-[56px] pl-12 pr-4 bg-white rounded-[12px] font-inter text-[15px] text-[#000000] placeholder:text-[#6B6B6B] transition-colors focus:outline-none ${
                        showEmailError
                          ? 'border-2 border-[#B42318]'
                          : 'border border-[#E8E2DB] focus:border-2 focus:border-[#000000]'
                      }`}
                    />
                  </div>
                  {showEmailError && (
                    <p 
                      id="email-error" 
                      role="alert" 
                      aria-live="polite"
                      className="text-[13px] text-[#B42318] font-inter mt-1.5"
                    >
                      Enter a valid email address
                    </p>
                  )}
                </div>

                {/* Desktop Submit Button */}
                <div className="hidden md:block">
                  <button
                    type="submit"
                    disabled={!isValidEmail || loading}
                    className={`w-full h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#000000] ${
                      !isValidEmail || loading
                        ? 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                        : 'bg-[#000000] hover:bg-[#1A1A1A] active:bg-[#262626] text-white cursor-pointer'
                    }`}
                  >
                    {loading ? (
                      <Spinner size={22} className="animate-spin text-white" />
                    ) : (
                      'Send reset code'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: ENTER 6-DIGIT CODE                               */}
          {/* ======================================================== */}
          {step === 2 && (
            <div className="text-left" aria-live="polite">
              <h2 
                ref={headingRef}
                tabIndex={-1}
                className="text-[30px] font-poppins font-bold text-[#000000] leading-tight mb-2 outline-none"
              >
                Enter verification code
              </h2>
              <p className="text-[#6B6B6B] font-inter text-[16px] leading-[1.6] mb-6">
                We've sent a 6-digit code to <strong className="text-[#000000]">{email}</strong>.
              </p>

              <form onSubmit={handleVerifyOtp}>
                {/* 6 OTP Inputs */}
                <div 
                  className="flex justify-between gap-2 sm:gap-2.5 mb-6"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpInputRefs[index]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-[52px] h-[58px] text-center font-poppins font-bold text-[22px] text-[#000000] rounded-[12px] bg-white transition-all focus:outline-none ${
                        digit 
                          ? 'border-2 border-[#000000]' 
                          : 'border border-[#E8E2DB] focus:border-2 focus:border-[#000000]'
                      }`}
                    />
                  ))}
                </div>

                {/* Resend Timer / Button */}
                <div className="mb-6 flex items-center justify-between text-[14px] font-inter">
                  <span className="text-[#6B6B6B]">Didn't get the code?</span>
                  {cooldown > 0 ? (
                    <span className="font-semibold text-[#6B6B6B]">
                      Resend in 0:{cooldown < 10 ? `0${cooldown}` : cooldown}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="font-semibold text-[#E86100] hover:underline focus:outline-none rounded"
                    >
                      Resend code
                    </button>
                  )}
                </div>

                {/* Desktop Verify Button */}
                <div className="hidden md:block">
                  <button
                    type="submit"
                    disabled={!isOtpComplete || loading}
                    className={`w-full h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#000000] ${
                      !isOtpComplete || loading
                        ? 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                        : 'bg-[#000000] hover:bg-[#1A1A1A] active:bg-[#262626] text-white cursor-pointer'
                    }`}
                  >
                    {loading ? (
                      <Spinner size={22} className="animate-spin text-white" />
                    ) : (
                      'Verify code'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: SET NEW PASSWORD                                */}
          {/* ======================================================== */}
          {step === 3 && (
            <div className="text-left" aria-live="polite">
              <h2 
                ref={headingRef}
                tabIndex={-1}
                className="text-[30px] font-poppins font-bold text-[#000000] leading-tight mb-2 outline-none"
              >
                Set new password
              </h2>
              <p className="text-[#6B6B6B] font-inter text-[16px] leading-[1.6] mb-6">
                Create a strong new password with at least 6 characters.
              </p>

              <form onSubmit={handleResetPassword}>
                {/* New Password */}
                <div className="mb-4">
                  <label 
                    htmlFor="new-password" 
                    className="block font-inter font-semibold text-[14px] text-[#000000] mb-2"
                  >
                    New password
                  </label>
                  <div className="relative">
                    <span 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none flex items-center"
                      aria-hidden="true"
                    >
                      <Lock size={20} weight="regular" />
                    </span>
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      required
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      onBlur={() => setPasswordTouched(true)}
                      className="w-full h-[56px] pl-12 pr-12 bg-white rounded-[12px] border border-[#E8E2DB] font-inter text-[15px] text-[#000000] placeholder:text-[#6B6B6B] transition-colors focus:outline-none focus:border-2 focus:border-[#000000]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#000000] p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordTouched && !isPasswordValid && (
                    <p className="text-[13px] text-[#B42318] font-inter mt-1.5">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label 
                    htmlFor="confirm-password" 
                    className="block font-inter font-semibold text-[14px] text-[#000000] mb-2"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <span 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none flex items-center"
                      aria-hidden="true"
                    >
                      <Lock size={20} weight="regular" />
                    </span>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full h-[56px] pl-12 pr-12 bg-white rounded-[12px] border border-[#E8E2DB] font-inter text-[15px] text-[#000000] placeholder:text-[#6B6B6B] transition-colors focus:outline-none focus:border-2 focus:border-[#000000]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#000000] p-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && !doPasswordsMatch && (
                    <p className="text-[13px] text-[#B42318] font-inter mt-1.5">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Desktop Save Button */}
                <div className="hidden md:block">
                  <button
                    type="submit"
                    disabled={!isPasswordValid || !doPasswordsMatch || loading}
                    className={`w-full h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#000000] ${
                      !isPasswordValid || !doPasswordsMatch || loading
                        ? 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                        : 'bg-[#000000] hover:bg-[#1A1A1A] active:bg-[#262626] text-white cursor-pointer'
                    }`}
                  >
                    {loading ? (
                      <Spinner size={22} className="animate-spin text-white" />
                    ) : (
                      'Reset password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: SUCCESS CONFIRMATION                             */}
          {/* ======================================================== */}
          {step === 4 && (
            <div className="text-left" aria-live="polite">
              <div 
                className="w-14 h-14 rounded-full bg-[#E9F5ED] flex items-center justify-center shrink-0 mb-6 text-[#2E9E5B]"
                aria-hidden="true"
              >
                <CheckCircle size={32} weight="fill" />
              </div>

              <h2 
                ref={headingRef}
                tabIndex={-1}
                className="text-[30px] font-poppins font-bold text-[#000000] leading-tight mb-2 outline-none"
              >
                Password updated!
              </h2>

              <p className="text-[#6B6B6B] font-inter text-[16px] leading-[1.6] mb-8">
                Your password has been successfully reset. You can now log in using your new credentials.
              </p>

              <div className="hidden md:block">
                <Link
                  to="/login"
                  className="w-full h-[56px] rounded-[12px] bg-[#000000] hover:bg-[#1A1A1A] active:bg-[#262626] text-white font-poppins font-semibold text-[16px] flex items-center justify-center transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#000000]"
                >
                  Go to login
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* MOBILE STICKY BOTTOM ACTION BAR (below 768px)            */}
        {/* ======================================================== */}
        <div 
          className="md:hidden w-full bg-white border-t border-[#E8E2DB] p-3 sticky bottom-0 z-20"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {step === 1 && (
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={!isValidEmail || loading}
              className={`w-full h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center transition-colors min-h-[44px] ${
                !isValidEmail || loading
                  ? 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                  : 'bg-[#000000] hover:bg-[#1A1A1A] active:bg-[#262626] text-white'
              }`}
            >
              {loading ? <Spinner size={22} className="animate-spin text-white" /> : 'Send reset code'}
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || loading}
              className={`w-full h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center transition-colors min-h-[44px] ${
                !isOtpComplete || loading
                  ? 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                  : 'bg-[#000000] hover:bg-[#1A1A1A] active:bg-[#262626] text-white'
              }`}
            >
              {loading ? <Spinner size={22} className="animate-spin text-white" /> : 'Verify code'}
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={!isPasswordValid || !doPasswordsMatch || loading}
              className={`w-full h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center transition-colors min-h-[44px] ${
                !isPasswordValid || !doPasswordsMatch || loading
                  ? 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                  : 'bg-[#000000] hover:bg-[#1A1A1A] active:bg-[#262626] text-white'
              }`}
            >
              {loading ? <Spinner size={22} className="animate-spin text-white" /> : 'Reset password'}
            </button>
          )}

          {step === 4 && (
            <Link
              to="/login"
              className="w-full h-[56px] rounded-[12px] bg-[#000000] hover:bg-[#1A1A1A] active:bg-[#262626] text-white font-poppins font-semibold text-[16px] flex items-center justify-center min-h-[44px]"
            >
              Go to login
            </Link>
          )}
        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;
