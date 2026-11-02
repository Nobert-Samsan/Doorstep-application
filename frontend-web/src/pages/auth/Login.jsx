import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { AlertCircle, User, Wrench, Mail, Phone, Loader2, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div 
      className={`transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${className}`}
    >
      {children}
    </div>
  );
};

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('tab') === 'worker' || searchParams.get('role') === 'worker' ? 'worker' : 'customer';
  const [activeTab, setActiveTab] = useState(initialRole); // 'customer' or 'worker'
  
  // Step 1: Identifier (Email/Phone), Step 2: 6-digit OTP verification
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState(() => {
    return localStorage.getItem('doorstep_remembered_identifier') || '';
  });
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem('doorstep_remembered_identifier');
  });

  // OTP state (6 separate digit boxes)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null)
  ];
  const [cooldown, setCooldown] = useState(0);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [targetInfo, setTargetInfo] = useState(''); // E.g. email or phone sent to
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Step 1: Send Login OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      return setError('Please enter your registered email address or phone number');
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login-otp/send', {
        identifier: identifier.trim(),
        role: activeTab
      });

      if (response.data.success) {
        // Save to remembered if checked
        if (rememberMe) {
          localStorage.setItem('doorstep_remembered_identifier', identifier.trim());
        } else {
          localStorage.removeItem('doorstep_remembered_identifier');
        }

        setTargetInfo(response.data.identifier || identifier.trim());
        setStep(2);
        setOtp(['', '', '', '', '', '']);
        setCooldown(45); // 45 seconds cooldown for resend
        toast.success(response.data.message || 'Verification code sent!');
        
        // Auto-focus first OTP box
        setTimeout(() => {
          if (otpInputRefs[0]?.current) {
            otpInputRefs[0].current.focus();
          }
        }, 150);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send login code. Please check your input and try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP box changes
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      // Pasting full 6-digit code
      const pastedDigits = value.slice(0, 6).split('');
      pastedDigits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedDigits.length, 5);
      otpInputRefs[nextIndex]?.current?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        otpInputRefs[index + 1]?.current?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  // Handle Step 2: Verify Login OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      return setError('Please enter the full 6-digit verification code');
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login-otp/verify', {
        identifier: identifier.trim(),
        otp: fullOtp,
        role: activeTab
      });

      if (response.data.success) {
        toast.success('Signed in successfully!');
        login(response.data.user, response.data.token);

        if (response.data.user.role === 'customer') navigate('/customer/dashboard');
        else if (response.data.user.role === 'worker') navigate('/worker/dashboard');
        else if (response.data.user.role === 'admin') navigate('/admin/dashboard');
        else navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired verification code';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google Login integration coming soon!");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden">
      
      {/* LEFT BRAND PANEL (Desktop Only) */}
      <div className="hidden lg:flex flex-col lg:w-[45%] relative overflow-hidden p-10 justify-between bg-[#000000]">
        
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="/login-bg.jpg" 
            alt="Professional at work" 
            className="absolute inset-0 w-full h-full object-cover object-[center_top] pointer-events-none" 
            style={{ transformOrigin: 'top center' }}
          />
          {/* Dark shadow overlay to keep text crisp */}
          <div className="absolute inset-0 bg-[#000000]/20 pointer-events-none"></div>
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.92) 80%, #000000 100%)' }}
          ></div>
        </div>

        {/* Top Logo & Tagline */}
        <FadeIn delay={0} className="relative z-10">
          <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded">
            <img src="/logo-new.png" alt="DoorStep" className="h-10 md:h-12 w-auto object-contain" />
            <p className="text-white/90 text-[16px] mt-2.5 font-inter font-normal">Sri Lanka's trusted home services platform</p>
          </Link>
        </FadeIn>

        {/* Center Content */}
        <div className="relative z-10 mt-12 mb-auto flex-1 flex flex-col justify-end pb-4">
          <FadeIn delay={100}>
            <h1 className="text-[32px] lg:text-[44px] font-poppins font-bold text-white leading-[1.15] mb-3 max-w-[480px]">
              Find trusted workers <span className="text-[#FF7A00]">right at your doorstep</span>
            </h1>
          </FadeIn>
        </div>

      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full lg:w-[55%] relative flex items-center justify-center bg-white min-h-screen py-8">

        <FadeIn delay={150} className="w-full max-w-[440px] px-5 sm:px-6 md:px-0">
          
          {/* STEP 1: ENTER EMAIL OR PHONE */}
          {step === 1 && (
            <div>
              <div className="text-center lg:text-left mb-6 sm:mb-8">
                <h2 className="text-[28px] sm:text-[32px] font-poppins font-bold text-[#000000] mb-2 leading-tight">
                  Welcome Back
                </h2>
                <p className="text-[#6B6B6B] font-inter text-[15px] sm:text-[16px]">
                  {activeTab === 'customer' 
                    ? 'Sign in to find trusted workers near you' 
                    : 'Sign in to manage jobs and grow your business'}
                </p>
              </div>

              {/* Role Switcher */}
              <div className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-[12px] sm:rounded-[14px] p-1 sm:p-[5px] flex relative mb-6 sm:mb-8" role="tablist">
                <div 
                  className="absolute top-1 bottom-1 sm:top-[5px] sm:bottom-[5px] left-1 sm:left-[5px] bg-[#000000] rounded-[9px] sm:rounded-[10px] shadow-sm transition-all duration-250 ease-out"
                  style={{ width: 'calc(50% - 4px)', transform: activeTab === 'customer' ? 'translateX(0)' : 'translateX(100%)' }}
                ></div>
                
                <button 
                  role="tab"
                  aria-selected={activeTab === 'customer'}
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-[9px] sm:rounded-[10px] text-[13.5px] sm:text-[15px] font-semibold transition-colors duration-200 relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-1 ${activeTab === 'customer' ? 'text-white' : 'text-[#000000] hover:text-black'}`}
                  onClick={() => { setActiveTab('customer'); setError(''); }}
                >
                  <User size={16} className={`sm:w-[18px] sm:h-[18px] ${activeTab === 'customer' ? 'text-white' : 'text-[#6B6B6B]'}`} />
                  I am a Customer
                </button>
                <button 
                  role="tab"
                  aria-selected={activeTab === 'worker'}
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-[9px] sm:rounded-[10px] text-[13.5px] sm:text-[15px] font-semibold transition-colors duration-200 relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-1 ${activeTab === 'worker' ? 'text-white' : 'text-[#000000] hover:text-black'}`}
                  onClick={() => { setActiveTab('worker'); setError(''); }}
                >
                  <Wrench size={16} className={`sm:w-[18px] sm:h-[18px] ${activeTab === 'worker' ? 'text-white' : 'text-[#6B6B6B]'}`} />
                  I am a Worker
                </button>
              </div>

              {error && (
                <div className="mb-5 sm:mb-6 p-3.5 bg-[#FDECEC] border border-[#B42318] rounded-[12px] flex items-start gap-2.5">
                  <AlertCircle size={18} className="text-[#B42318] mt-0.5 flex-shrink-0" />
                  <p className="text-[#B42318] text-[14px] font-medium leading-snug">{error}</p>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-[#000000] font-semibold text-[14px] mb-2 font-inter">
                    Email or Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      {identifier.includes('@') ? (
                        <Mail size={19} className="text-[#6B6B6B] group-focus-within:text-[#000000] transition-colors" />
                      ) : (
                        <Phone size={19} className="text-[#6B6B6B] group-focus-within:text-[#000000] transition-colors" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="name@example.com or 077..."
                      className={`w-full h-[46px] sm:h-[56px] bg-white rounded-[12px] pl-11 pr-4 font-inter text-[15px] sm:text-[16px] text-[#000000] placeholder-[#6B6B6B] transition-colors duration-200 outline-none
                        ${error ? 'border-2 border-[#B42318]' : 'border border-[#E8E2DB] hover:border-[#CFC6BC] focus:border-2 focus:border-[#000000]'}`}
                      required
                      autoFocus
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-[13px] text-[#6B6B6B] mt-1.5 font-inter">
                    We will send a one-time verification code to this address. No password needed.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#000000] focus:ring-[#000000] border-gray-300 cursor-pointer"
                      disabled={isLoading}
                    />
                    <span className="text-[#3D3D3D] text-[13.5px] sm:text-[14px] select-none font-inter">Remember my email / phone</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-[46px] sm:h-[56px] bg-[#000000] hover:bg-[#1C1917] active:bg-[#2D2A26] text-white font-poppins font-semibold text-[15px] sm:text-[16px] rounded-[12px] transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      <span>Checking account...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue with OTP</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="flex items-center gap-3 my-5 sm:my-6 text-[#6B6B6B] text-[13px] font-inter">
                <div className="flex-1 h-[1px] bg-[#E8E2DB]"></div>
                <span>or</span>
                <div className="flex-1 h-[1px] bg-[#E8E2DB]"></div>
              </div>

              {/* GOOGLE SIGN IN */}
              <button 
                onClick={handleGoogleLogin} 
                disabled={isLoading}
                type="button"
                className="w-full h-[46px] sm:h-[56px] bg-white border border-[#E8E2DB] rounded-[12px] flex items-center justify-center gap-3 text-[#000000] font-semibold text-[14px] sm:text-[15px] hover:bg-gray-50 hover:border-[#CFC6BC] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 font-inter cursor-pointer"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-[20px] w-[20px]" />
                Sign in with Google
              </button>

              {/* REGISTER LINK */}
              <div className="text-center mt-7 sm:mt-8 text-[14px] text-[#3D3D3D] font-inter">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#E86100] font-[500] hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded px-1">
                  Register here
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 2 && (
            <div>
              {/* Back Button */}
              <div className="mb-4">
                <button 
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                  }}
                  className="group inline-flex items-center gap-1.5 font-inter font-semibold text-[14px] text-[#3D3D3D] hover:text-[#000000] transition-colors"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Change email or phone</span>
                </button>
              </div>

              <div className="text-left mb-6">
                <h2 className="text-[26px] sm:text-[30px] font-poppins font-bold text-[#000000] mb-2 leading-tight">
                  Enter Verification Code
                </h2>
                <p className="text-[#6B6B6B] font-inter text-[14.5px] sm:text-[15px] leading-relaxed">
                  We've sent a 6-digit verification code to <span className="font-semibold text-[#000000] break-all">{targetInfo}</span>
                </p>
              </div>

              {error && (
                <div className="mb-5 sm:mb-6 p-3.5 bg-[#FDECEC] border border-[#B42318] rounded-[12px] flex items-start gap-2.5">
                  <AlertCircle size={18} className="text-[#B42318] mt-0.5 flex-shrink-0" />
                  <p className="text-[#B42318] text-[14px] font-medium leading-snug">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 Digit OTP inputs */}
                <div>
                  <div className="flex justify-between items-center gap-2 sm:gap-2.5">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpInputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={`w-11 sm:w-14 h-12 sm:h-14 text-center text-[20px] sm:text-[22px] font-bold font-poppins rounded-[10px] sm:rounded-[12px] outline-none transition-all
                          ${digit ? 'border-2 border-[#000000] bg-white' : 'border border-[#E8E2DB] bg-white hover:border-[#CFC6BC]'}
                          focus:border-2 focus:border-[#000000]`}
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                </div>

                {/* Resend Code Section */}
                <div className="flex items-center justify-between text-[13.5px] sm:text-[14px] font-inter">
                  <span className="text-[#6B6B6B]">Didn't receive the code?</span>
                  {cooldown > 0 ? (
                    <span className="text-[#6B6B6B] font-medium">Resend in {cooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={isLoading}
                      className="text-[#E86100] font-semibold hover:underline inline-flex items-center gap-1 focus:outline-none"
                    >
                      <RefreshCw size={14} />
                      Resend code
                    </button>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full h-[46px] sm:h-[56px] bg-[#000000] hover:bg-[#1C1917] active:bg-[#2D2A26] text-white font-poppins font-semibold text-[15px] sm:text-[16px] rounded-[12px] transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      <span>Verifying code...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </FadeIn>
      </div>
    </div>
  );
};

export default Login;
