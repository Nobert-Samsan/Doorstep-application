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
  Check,
  CheckCircle,
  WarningCircle,
  Spinner,
  CaretDown,
  CalendarBlank,
  MapPin,
  Briefcase,
  UploadSimple,
  Trash
} from '@phosphor-icons/react';

const WorkerRegister = () => {
  // Steps: 1 = Personal & Location, 2 = Services, 3 = Document Verification, 4 = Security & Terms, 5 = OTP Verification, 6 = Success
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const otpInputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const [focusedField, setFocusedField] = useState('');
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'male',
    streetAddress: '',
    district: '',
    maxTravelDistance: '',
    city: '',
    services: [{ serviceTitle: '', yearsExperience: 0 }],
    termsAccepted: false
  });

  const [documents, setDocuments] = useState({
    nicFront: null,
    nicBack: null
  });

  const handleFieldFocus = (name) => {
    setFocusedField(name);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return !value?.trim() ? 'First name is required' : '';
      case 'lastName':
        return !value?.trim() ? 'Last name is required' : '';
      case 'phone': {
        const raw = (value || '').trim();
        const digits = raw.replace(/\D/g, '');
        if (raw.startsWith('+')) {
          return digits.length !== 11 ? 'Phone number must be 11 digits with +' : '';
        }
        return digits.length !== 10 ? 'Phone number must be 10 digits' : '';
      }
      case 'dateOfBirth':
        return !value ? 'Date of birth is required' : '';
      case 'district':
        return !value ? 'Please select a district' : '';
      case 'city':
        return !value ? 'Please select a city' : '';
      case 'streetAddress':
        return !value?.trim() ? 'Street address is required' : '';
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value?.trim()) return 'Email address is required';
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
    setFieldErrors((e) => ({ ...e, [name]: validateField(name, formData[name]) }));
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
    if (raw.startsWith('0')) raw = raw.slice(1);
    if (raw.length > 9) raw = raw.slice(0, 9);

    const storedVal = raw.length > 0 ? `0${raw}` : '';
    setFormData((prev) => ({ ...prev, phone: storedVal }));

    if (touched.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: validateField('phone', storedVal) }));
    }
  };

  const getDisplayPhone = () => {
    let digits = (formData.phone || '').replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const newServices = [...formData.services];
    newServices[index][name] = value;
    setFormData((prev) => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { serviceTitle: '', yearsExperience: 0 }]
    }));
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      const newServices = [...formData.services];
      newServices.splice(index, 1);
      setFormData((prev) => ({ ...prev, services: newServices }));
    }
  };

  // Step 1 Validation & Next
  const isStep1Valid =
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    !validateField('phone', formData.phone) &&
    formData.dateOfBirth &&
    formData.gender &&
    formData.district &&
    formData.city &&
    formData.streetAddress?.trim();

  const handleStep1Next = () => {
    if (!isStep1Valid) {
      return toast.error('Please fill in all personal and location details');
    }
    setDirection('forward');
    setStep(2);
  };

  // Step 2 Validation & Next
  const isStep2Valid = formData.services.every(
    (s) => s.serviceTitle && s.yearsExperience !== ''
  );

  const handleStep2Next = () => {
    if (!isStep2Valid) {
      return toast.error('Please complete all service details');
    }
    setDirection('forward');
    setStep(3);
  };

  // Step 3 Next
  const handleStep3Next = () => {
    setDirection('forward');
    setStep(4);
  };

  const handleOtpChange = (index, value) => {
    const clean = value.replace(/\D/g, '');
    if (!clean && value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = clean.slice(-1);
    setOtp(newOtp);
    if (clean && index < 5) otpInputRefs[index + 1].current?.focus();
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

  const handleResendOtp = async () => {
    try {
      setOtp(['', '', '', '', '', '']);
      await api.post('/auth/send-email-otp', {
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone
      });
      toast.success('A new verification code has been sent!');
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) return toast.error('Please enter complete 6-digit OTP');

    setIsLoading(true);
    try {
      await api.post('/auth/verify-otp', {
        email: formData.email.trim().toLowerCase(),
        otp: fullOtp
      });

      // Convert uploaded documents to base64 data URLs for storage
      const fileToBase64 = (f) => new Promise((res, rej) => {
        if (!f) return res('');
        const r = new FileReader();
        r.readAsDataURL(f);
        r.onload = () => res(r.result);
        r.onerror = rej;
      });

      const nicFrontBase64 = documents.nicFront ? await fileToBase64(documents.nicFront) : '';
      const nicBackBase64 = documents.nicBack ? await fileToBase64(documents.nicBack) : '';

      const { confirmPassword, termsAccepted, ...submitData } = formData;
      submitData.email = submitData.email.trim().toLowerCase();
      submitData.documents = {
        nicFront: nicFrontBase64,
        nicBack: nicBackBase64
      };
      const response = await api.post('/auth/register/worker', submitData);

      if (response.data.success) {
        setStep(6);
      }
    } catch (err) {
      let errorMsg = 'Invalid verification code or registration failed';
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMsg = err.response.data.errors.map((e) => e.msg).join(', ');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const isStep4Valid =
    formData.email?.trim() &&
    !validateField('email', formData.email) &&
    formData.password?.length >= 8 &&
    !validateField('password', formData.password) &&
    formData.confirmPassword === formData.password &&
    formData.termsAccepted;

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    if (!formData.email) return toast.error('Please provide an email address');
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
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone
      });
      toast.success('Verification code sent to your email!');
      if (response.data?.previewUrl) {
        console.log('Testing Email URL:', response.data.previewUrl);
      }
      setDirection('forward');
      setStep(5);
      setTimer(60);
    } catch (err) {
      let errorMsg = 'Registration failed';
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMsg = err.response.data.errors.map((e) => e.msg).join(', ');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setDirection('backward');
    if (step > 1) setStep((s) => s - 1);
    else navigate(-1);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between bg-white overflow-x-hidden font-inter relative">
      {/* SCROLLABLE MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col justify-center items-center px-5 py-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-[440px] my-auto">
          {step <= 4 && (
            <div
              className={`transition-all duration-250 ease-out ${
                direction === 'forward' ? 'animate-fadeIn' : 'animate-fadeIn'
              }`}
            >
              {/* Heading Area Centered */}
              <div className="text-center mb-6">
                <h1 className="font-poppins font-bold text-[28px] md:text-[30px] text-[#000000] leading-tight mb-2">
                  Worker Registration
                </h1>
                <p className="text-[#6B6B6B] text-[15px] md:text-[16px] mb-4">
                  Join our network and start earning today.
                </p>

                {/* 4-Segment Progress Bar (Visible on all devices) */}
                <div
                  className="flex gap-1.5 max-w-[280px] mx-auto"
                  role="progressbar"
                  aria-valuenow={step}
                  aria-valuemin={1}
                  aria-valuemax={4}
                >
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-[4px] flex-1 rounded-full transition-colors duration-200 ${
                        s <= step ? 'bg-[#000000]' : 'bg-[#E8E2DB]'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* ================================================= */}
              {/* STEP 1: PERSONAL & LOCATION DETAILS               */}
              {/* ================================================= */}
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); handleStep1Next(); }} noValidate className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-[14px] font-semibold text-[#000000] mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <div
                          className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                            focusedField === 'firstName' ? 'text-[#000000]' : 'text-[#6B6B6B]'
                          }`}
                        >
                          <User size={20} />
                        </div>
                        <input
                          id="firstName"
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('firstName')}
                          onBlur={() => handleBlur('firstName')}
                          placeholder="e.g. Nimal"
                          className={`w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-4 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                            touched.firstName && fieldErrors.firstName
                              ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                              : focusedField === 'firstName'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        />
                      </div>
                      {touched.firstName && fieldErrors.firstName && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]">
                          <WarningCircle size={15} />
                          <span>{fieldErrors.firstName}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-[14px] font-semibold text-[#000000] mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <div
                          className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                            focusedField === 'lastName' ? 'text-[#000000]' : 'text-[#6B6B6B]'
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
                          placeholder="e.g. Perera"
                          className={`w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-4 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                            touched.lastName && fieldErrors.lastName
                              ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                              : focusedField === 'lastName'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        />
                      </div>
                      {touched.lastName && fieldErrors.lastName && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]">
                          <WarningCircle size={15} />
                          <span>{fieldErrors.lastName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phone (+94) */}
                  <div>
                    <label htmlFor="phone" className="block text-[14px] font-semibold text-[#000000] mb-2">
                      Phone Number (+94)
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                          focusedField === 'phone' ? 'text-[#000000]' : 'text-[#6B6B6B]'
                        }`}
                      >
                        <Phone size={20} />
                      </div>
                      <div className="absolute left-[44px] top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                        <span className="text-[#000000] font-medium text-[15px]">+94</span>
                        <div className="w-[1px] h-[20px] bg-[#E8E2DB]"></div>
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        value={getDisplayPhone()}
                        onChange={handlePhoneChange}
                        onFocus={() => handleFieldFocus('phone')}
                        onBlur={() => handleBlur('phone')}
                        placeholder="77 123 4567"
                        className={`w-full h-[56px] rounded-[12px] bg-white pl-[92px] pr-4 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                          touched.phone && fieldErrors.phone
                            ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                            : focusedField === 'phone'
                            ? 'border-[2px] border-[#000000]'
                            : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                        }`}
                      />
                    </div>
                    {touched.phone && fieldErrors.phone && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]">
                        <WarningCircle size={15} />
                        <span>{fieldErrors.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Gender & Date of Birth */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gender" className="block text-[14px] font-semibold text-[#000000] mb-2">
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
                          className={`w-full h-[56px] rounded-[12px] bg-white px-4 pr-10 text-[16px] text-[#000000] outline-none transition-colors duration-150 appearance-none cursor-pointer border ${
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

                    <div>
                      <label htmlFor="dateOfBirth" className="block text-[14px] font-semibold text-[#000000] mb-2">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <input
                          id="dateOfBirth"
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('dateOfBirth')}
                          onBlur={() => handleBlur('dateOfBirth')}
                          className={`w-full h-[56px] rounded-[12px] bg-white px-4 text-[15px] text-[#000000] outline-none transition-colors duration-150 border ${
                            touched.dateOfBirth && fieldErrors.dateOfBirth
                              ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                              : focusedField === 'dateOfBirth'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        />
                      </div>
                      {touched.dateOfBirth && fieldErrors.dateOfBirth && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]">
                          <WarningCircle size={15} />
                          <span>{fieldErrors.dateOfBirth}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* District & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="district" className="block text-[14px] font-semibold text-[#000000] mb-2">
                        District
                      </label>
                      <div className="relative">
                        <select
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('district')}
                          onBlur={() => handleBlur('district')}
                          className={`w-full h-[56px] rounded-[12px] bg-white px-4 pr-10 text-[15px] text-[#000000] outline-none transition-colors duration-150 appearance-none cursor-pointer border ${
                            focusedField === 'district'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        >
                          <option value="">Select District</option>
                          <option value="Colombo">Colombo</option>
                          <option value="Gampaha">Gampaha</option>
                          <option value="Kalutara">Kalutara</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6B6B]">
                          <CaretDown size={18} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-[14px] font-semibold text-[#000000] mb-2">
                        City
                      </label>
                      <div className="relative">
                        <select
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!formData.district}
                          onFocus={() => handleFieldFocus('city')}
                          onBlur={() => handleBlur('city')}
                          className={`w-full h-[56px] rounded-[12px] bg-white px-4 pr-10 text-[15px] text-[#000000] outline-none transition-colors duration-150 appearance-none cursor-pointer border disabled:bg-gray-50 disabled:text-gray-400 ${
                            focusedField === 'city'
                              ? 'border-[2px] border-[#000000]'
                              : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                          }`}
                        >
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
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6B6B]">
                          <CaretDown size={18} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label htmlFor="streetAddress" className="block text-[14px] font-semibold text-[#000000] mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                          focusedField === 'streetAddress' ? 'text-[#000000]' : 'text-[#6B6B6B]'
                        }`}
                      >
                        <MapPin size={20} />
                      </div>
                      <input
                        id="streetAddress"
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        onFocus={() => handleFieldFocus('streetAddress')}
                        onBlur={() => handleBlur('streetAddress')}
                        placeholder="123 Main St"
                        className={`w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-4 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                          touched.streetAddress && fieldErrors.streetAddress
                            ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                            : focusedField === 'streetAddress'
                            ? 'border-[2px] border-[#000000]'
                            : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                        }`}
                      />
                    </div>
                    {touched.streetAddress && fieldErrors.streetAddress && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]">
                        <WarningCircle size={15} />
                        <span>{fieldErrors.streetAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!isStep1Valid}
                      className={`w-full h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                        isStep1Valid
                          ? 'bg-[#000000] hover:bg-[#222222] active:bg-[#111111] active:scale-[0.99] text-white'
                          : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                      }`}
                    >
                      <span>Next Step</span>
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </div>
                </form>
              )}

              {/* ================================================= */}
              {/* STEP 2: SERVICES OFFERED                          */}
              {/* ================================================= */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[17px] font-semibold text-[#000000]">Services Offered</h3>
                    <button
                      type="button"
                      onClick={addService}
                      className="text-[#E86100] font-semibold text-[14px] hover:underline cursor-pointer"
                    >
                      + Add Another
                    </button>
                  </div>

                  {formData.services.map((service, index) => (
                    <div key={index} className="p-4 border border-[#E8E2DB] rounded-[12px] space-y-3 bg-white relative">
                      {formData.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="absolute top-3 right-3 text-[#B42318] hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                      <div>
                        <label className="block text-[13px] font-medium text-[#3D3D3D] mb-1">
                          Service Category
                        </label>
                        <div className="relative">
                          <select
                            name="serviceTitle"
                            value={service.serviceTitle}
                            onChange={(e) => handleServiceChange(index, e)}
                            className="w-full h-[48px] rounded-[10px] bg-white px-3 pr-8 text-[15px] text-[#000000] outline-none border border-[#E8E2DB] appearance-none cursor-pointer focus:border-black"
                          >
                            <option value="">Select a service</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Carpentry">Carpentry</option>
                            <option value="Painting">Painting</option>
                            <option value="AC Repair & Maintenance">AC Repair & Maintenance</option>
                            <option value="House Cleaning">House Cleaning</option>
                            <option value="Pest Control">Pest Control</option>
                            <option value="Masonry & Concrete">Masonry & Concrete</option>
                            <option value="Roofing">Roofing</option>
                            <option value="Gardening & Landscaping">Gardening & Landscaping</option>
                            <option value="Appliance Repair">Appliance Repair</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6B6B]">
                            <CaretDown size={16} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-[#3D3D3D] mb-1">
                          Years Experience
                        </label>
                        <input
                          type="number"
                          min="0"
                          name="yearsExperience"
                          value={service.yearsExperience}
                          onChange={(e) => handleServiceChange(index, e)}
                          className="w-full h-[48px] rounded-[10px] bg-white px-3 text-[15px] text-[#000000] outline-none border border-[#E8E2DB] focus:border-black"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={goBack}
                      className="w-[35%] h-[56px] rounded-[12px] border-[1.5px] border-[#E8E2DB] text-[#000000] font-poppins font-semibold text-[16px] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleStep2Next}
                      disabled={!isStep2Valid}
                      className={`w-[65%] h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
                        isStep2Valid
                          ? 'bg-[#000000] hover:bg-[#222222] active:bg-[#111111] text-white'
                          : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                      }`}
                    >
                      <span>Next Step</span>
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* STEP 3: DOCUMENT VERIFICATION                     */}
              {/* ================================================= */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-left mb-2">
                    <h3 className="text-[17px] font-semibold text-[#000000]">Document Verification</h3>
                    <p className="text-[14px] text-[#6B6B6B] mt-1">Upload clear photos of your National Identity Card (NIC).</p>
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-[#000000] mb-2">
                      NIC Front
                    </label>
                    {!documents.nicFront ? (
                      <label className="flex flex-col items-center justify-center border border-dashed border-[#E8E2DB] rounded-[12px] p-6 cursor-pointer hover:border-black transition-colors bg-white">
                        <UploadSimple size={24} className="text-[#6B6B6B] mb-1" />
                        <span className="text-[14px] font-medium text-[#000000]">Choose photo</span>
                        <span className="text-[12px] text-[#6B6B6B] mt-0.5">JPG, PNG up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'nicFront')}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative border border-[#E8E2DB] rounded-[12px] p-3 bg-white flex items-center gap-3">
                        <img
                          src={URL.createObjectURL(documents.nicFront)}
                          alt="NIC Front"
                          className="h-16 w-24 object-cover rounded-[8px]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-medium text-[#000000] truncate">
                            {documents.nicFront.name}
                          </p>
                          <span className="text-[12px] text-[#2E9E5B] font-medium">Uploaded</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocuments({ ...documents, nicFront: null })}
                          className="text-[#B42318] hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-[#000000] mb-2">
                      NIC Back
                    </label>
                    {!documents.nicBack ? (
                      <label className="flex flex-col items-center justify-center border border-dashed border-[#E8E2DB] rounded-[12px] p-6 cursor-pointer hover:border-black transition-colors bg-white">
                        <UploadSimple size={24} className="text-[#6B6B6B] mb-1" />
                        <span className="text-[14px] font-medium text-[#000000]">Choose photo</span>
                        <span className="text-[12px] text-[#6B6B6B] mt-0.5">JPG, PNG up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'nicBack')}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative border border-[#E8E2DB] rounded-[12px] p-3 bg-white flex items-center gap-3">
                        <img
                          src={URL.createObjectURL(documents.nicBack)}
                          alt="NIC Back"
                          className="h-16 w-24 object-cover rounded-[8px]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-medium text-[#000000] truncate">
                            {documents.nicBack.name}
                          </p>
                          <span className="text-[12px] text-[#2E9E5B] font-medium">Uploaded</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocuments({ ...documents, nicBack: null })}
                          className="text-[#B42318] hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={goBack}
                      className="w-[35%] h-[56px] rounded-[12px] border-[1.5px] border-[#E8E2DB] text-[#000000] font-poppins font-semibold text-[16px] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleStep3Next}
                      className="w-[65%] h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 bg-[#000000] hover:bg-[#222222] active:bg-[#111111] text-white cursor-pointer"
                    >
                      <span>Next Step</span>
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* STEP 4: SECURITY & TERMS                          */}
              {/* ================================================= */}
              {step === 4 && (
                <form onSubmit={handleRegister} noValidate className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-[14px] font-semibold text-[#000000] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                          focusedField === 'email' ? 'text-[#000000]' : 'text-[#6B6B6B]'
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
                        placeholder="you@example.com"
                        className={`w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-4 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
                          touched.email && fieldErrors.email
                            ? 'border-[2px] border-[#B42318] bg-[#FDECEC]'
                            : focusedField === 'email'
                            ? 'border-[2px] border-[#000000]'
                            : 'border-[#E8E2DB] hover:border-[#CFC6BC]'
                        }`}
                      />
                    </div>
                    {touched.email && fieldErrors.email && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]">
                        <WarningCircle size={15} />
                        <span>{fieldErrors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-[14px] font-semibold text-[#000000] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                          focusedField === 'password' ? 'text-[#000000]' : 'text-[#6B6B6B]'
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
                        placeholder="8+ chars with letters, numbers & symbols"
                        className={`w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-12 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
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
                      <div className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]">
                        <WarningCircle size={15} />
                        <span>{fieldErrors.password}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-[14px] font-semibold text-[#000000] mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                          focusedField === 'confirmPassword' ? 'text-[#000000]' : 'text-[#6B6B6B]'
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
                        placeholder="Re-enter password"
                        className={`w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-12 text-[16px] text-[#000000] placeholder-[#6B6B6B] outline-none transition-colors duration-150 border ${
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
                      <div className="flex items-center gap-1.5 mt-1.5 text-[#B42318] text-[13px]">
                        <WarningCircle size={15} />
                        <span>{fieldErrors.confirmPassword}</span>
                      </div>
                    )}
                  </div>

                  {/* Terms & Conditions Row (Border-free) */}
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
                      <a href="#" onClick={(e) => e.stopPropagation()} className="text-[#E86100] font-[500] hover:underline">
                        Terms &amp; Conditions
                      </a>
                      , Commission Policy (10%), and{' '}
                      <a href="#" onClick={(e) => e.stopPropagation()} className="text-[#E86100] font-[500] hover:underline">
                        Code of Conduct
                      </a>
                      .
                    </span>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={goBack}
                      className="w-[35%] h-[56px] rounded-[12px] border-[1.5px] border-[#E8E2DB] text-[#000000] font-poppins font-semibold text-[16px] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!isStep4Valid || isLoading}
                      className={`w-[65%] h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
                        isStep4Valid && !isLoading
                          ? 'bg-[#000000] hover:bg-[#222222] active:bg-[#111111] text-white'
                          : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <Spinner size={22} className="animate-spin text-white" />
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <ArrowRight size={18} weight="bold" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ================================================= */}
          {/* STEP 5: OTP VERIFICATION                         */}
          {/* ================================================= */}
          {step === 5 && (
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
              <div onPaste={handleOtpPaste} className="flex justify-center gap-2 sm:gap-3 my-6">
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
                    className={`w-[44px] sm:w-[50px] h-[56px] rounded-[12px] text-center text-[22px] font-poppins font-bold text-[#000000] outline-none transition-colors border ${
                      digit ? 'border-[2px] border-[#000000]' : 'border-[#E8E2DB] focus:border-[2px] focus:border-[#000000]'
                    }`}
                  />
                ))}
              </div>

              {/* Resend Cooldown */}
              <div className="text-[14px]">
                {timer > 0 ? (
                  <p className="text-[#6B6B6B]">
                    Resend code in <span className="text-[#E86100] font-semibold">{timer}s</span>
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

              {/* Desktop Step 5 Button (Full width) */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={otp.join('').length < 6 || isLoading}
                  className={`w-full h-[56px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
                    otp.join('').length === 6 && !isLoading
                      ? 'bg-[#000000] hover:bg-[#222222] active:bg-[#111111] text-white'
                      : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed'
                  }`}
                >
                  {isLoading ? <Spinner size={22} className="animate-spin text-white" /> : 'Verify & Complete'}
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* STEP 6: SUCCESS CONFIRMATION                      */}
          {/* ================================================= */}
          {step === 6 && (
            <div className="space-y-6 text-center py-8">
              <div className="w-[64px] h-[64px] rounded-full bg-[#2E9E5B] text-white flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} weight="bold" />
              </div>
              <h2 className="font-poppins font-bold text-[30px] text-[#000000]">
                Application Submitted!
              </h2>
              <p className="text-[#6B6B6B] text-[16px] max-w-[340px] mx-auto">
                Your worker application has been submitted successfully and is awaiting admin approval. You will receive an update once reviewed.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full h-[56px] rounded-[12px] bg-[#000000] hover:bg-[#222222] text-white font-poppins font-semibold text-[16px] transition-colors cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Footer Link */}
          {step < 5 && (
            <div className="text-center mt-6">
              <p className="text-[15px] text-[#3D3D3D]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#E86100] font-[500] hover:underline">
                  Log in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkerRegister;
