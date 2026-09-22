import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';
import { CheckCircle2, ChevronRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const CustomerRegister = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: 'male', phone: '', email: '',
    district: '', city: '', streetAddress: '',
    password: '', confirmPassword: '', termsAccepted: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // Password Strength logic
  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 6) score += 25;
    if (pass.length > 10) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };
  const strength = calculateStrength(formData.password);

  const handleStep1Next = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      return toast.error("Please fill all required fields");
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }

    // Phone Validation
    const rawPhone = formData.phone.trim();
    const digitsOnly = rawPhone.replace(/\D/g, '');
    let phoneIsValid = false;
    
    if (rawPhone.startsWith('+')) {
      if (digitsOnly.length === 11) phoneIsValid = true;
    } else {
      if (digitsOnly.length === 10) phoneIsValid = true;
    }
    
    if (!phoneIsValid) {
      return toast.error("Phone number must be exactly 10 digits, or 11 digits if starting with +");
    }

    setStep(2);
  };

  const handleStep2Next = () => {
    if (!formData.district || !formData.city || !formData.streetAddress) {
      return toast.error("Please fill all location fields");
    }
    setStep(3);
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (!formData.termsAccepted) return toast.error('You must accept terms');
    
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(formData.password);
    
    if (formData.password.length < 8 || !hasLetter || !hasNumber || !hasSymbol) {
      return toast.error('Password must be 8+ characters with a mix of letters, numbers, and symbols');
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/auth/send-email-otp', { 
        email: formData.email,
        phone: formData.phone 
      });
      toast.success('Verification code sent to your email!');
      if (response.data.previewUrl) {
        console.log("Testing Email URL:", response.data.previewUrl);
        toast.info("Testing Mode: Check console for OTP link");
      }
      setStep(4);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtp(['', '', '', '', '', '']); // Clear current OTP input
      const response = await api.post('/auth/send-email-otp', { 
        email: formData.email,
        phone: formData.phone
      });
      toast.success('A new verification code has been sent!');
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  // OTP Timer
  useEffect(() => {
    if (step === 4 && timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) return toast.error('Enter full 6-digit OTP');

    try {
      // 1. Verify OTP first
      await api.post('/auth/verify-otp', { email: formData.email, otp: fullOtp });
      
      // 2. If successful, complete the registration
      const { confirmPassword, termsAccepted, ...submitData } = formData;
      const response = await api.post('/auth/register/customer', submitData);
      
      if (response.data.success) {
        login(response.data.user, response.data.token);
        setStep(5); // Success Screen
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid verification code or registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto">
        
        {step < 5 && (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900">Create Customer Account</h2>
              <p className="mt-2 text-gray-600">Join DoorStep and find the best workers in Sri Lanka</p>
            </div>

            {/* Stepper indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                <div className={`w-3 h-3 rounded-full transition-all ${step >= 1 ? 'bg-primary w-8' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full transition-all ${step >= 2 ? 'bg-primary w-8' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full transition-all ${step >= 3 ? 'bg-primary w-8' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full transition-all ${step === 4 ? 'bg-primary w-8' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white py-8 px-8 shadow-xl rounded-2xl border border-gray-100">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (+94)</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="771234567" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>

              <div className="pt-4">
                <button type="button" onClick={handleStep1Next} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                  Next Step <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Location Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District (Western Province Only)</label>
                <select name="district" value={formData.district} onChange={handleChange} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                  <option value="">Select District</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kalutara">Kalutara</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select name="city" value={formData.city} onChange={handleChange} disabled={!formData.district} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-100 disabled:text-gray-400">
                  <option value="">Select City</option>
                  {formData.district === 'Colombo' && (
                    <>
                      <option value="Avissawella">Avissawella</option>
                      <option value="Battaramulla">Battaramulla</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Dehiwala">Dehiwala</option>
                      <option value="Homagama">Homagama</option>
                      <option value="Kotte">Kotte</option>
                      <option value="Maharagama">Maharagama</option>
                      <option value="Malabe">Malabe</option>
                      <option value="Moratuwa">Moratuwa</option>
                      <option value="Mount Lavinia">Mount Lavinia</option>
                      <option value="Nugegoda">Nugegoda</option>
                      <option value="Padukka">Padukka</option>
                    </>
                  )}
                  {formData.district === 'Gampaha' && (
                    <>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Ja-Ela">Ja-Ela</option>
                      <option value="Kadawatha">Kadawatha</option>
                      <option value="Kelaniya">Kelaniya</option>
                      <option value="Minuwangoda">Minuwangoda</option>
                      <option value="Negombo">Negombo</option>
                      <option value="Nittambuwa">Nittambuwa</option>
                      <option value="Peliyagoda">Peliyagoda</option>
                      <option value="Ragama">Ragama</option>
                      <option value="Veyangoda">Veyangoda</option>
                      <option value="Wattala">Wattala</option>
                    </>
                  )}
                  {formData.district === 'Kalutara' && (
                    <>
                      <option value="Bandaragama">Bandaragama</option>
                      <option value="Beruwala">Beruwala</option>
                      <option value="Horana">Horana</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Matugama">Matugama</option>
                      <option value="Panadura">Panadura</option>
                      <option value="Wadduwa">Wadduwa</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button type="button" onClick={handleStep2Next} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Security</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Use 8+ characters with a mix of letters, numbers & symbols</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start mt-6 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="mt-1 h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary" />
                <label className="ml-3 text-sm text-gray-700">
                  I accept the <a href="#" className="text-primary font-bold hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>
                </label>
              </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button disabled={isLoading} type="button" onClick={handleRegister} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:bg-amber-400 disabled:cursor-not-allowed">
                    {isLoading ? 'Sending OTP...' : 'Register'}
                  </button>
                </div>
            </div>
          )}

          {/* STEP 4: OTP */}
          {step === 4 && (
            <div className="space-y-8 animate-fadeIn text-center py-4">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-primary mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Verify your email</h3>
              <p className="text-gray-600">We've sent a 6-digit code to <span className="font-bold text-gray-900">{formData.email}</span></p>
              
              <div className="flex justify-center gap-2 sm:gap-4 my-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpInputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 border-2 border-gray-300 rounded-xl text-center text-xl font-bold text-gray-900 focus:border-primary focus:ring-0 outline-none transition-colors"
                  />
                ))}
              </div>

              <div className="text-sm font-medium">
                {timer > 0 ? (
                  <p className="text-gray-500">Resend code in <span className="text-primary">{timer}s</span></p>
                ) : (
                  <button onClick={handleResendOtp} className="text-primary font-bold hover:underline">Resend OTP</button>
                )}
              </div>

              <button type="button" onClick={handleVerifyOTP} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30">
                Verify & Complete
              </button>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn text-center py-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Welcome to DoorStep!</h3>
              <p className="text-gray-600 mb-8">Your account has been created successfully. You can now start searching and booking trusted workers.</p>
              
              <button onClick={() => navigate('/customer/dashboard')} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg">
                Go to My Dashboard
              </button>
            </div>
          )}

        </div>
        
        {step < 5 && (
          <div className="mt-8 text-center">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Already have an account? <span className="text-primary font-bold">Log in here</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerRegister;
