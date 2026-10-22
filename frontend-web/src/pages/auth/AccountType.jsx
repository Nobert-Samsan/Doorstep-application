import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Wrench, ArrowRight, Check } from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div 
      className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const AccountType = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleKeyDown = (e, role) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setSelectedRole(role);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setSelectedRole('worker');
      document.getElementById('role-card-worker')?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setSelectedRole('customer');
      document.getElementById('role-card-customer')?.focus();
    }
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/register/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white relative py-12 px-6 sm:px-8 overflow-x-hidden">
      
      {/* Subtle Warm Ambient Glows */}
      <div 
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(255,122,0,0.05)' }}
      ></div>
      <div 
        className="absolute bottom-0 left-1/4 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(255,122,0,0.04)' }}
      ></div>

      {/* Main Centered Container */}
      <div className="w-full max-w-[540px] relative z-10 flex flex-col my-auto">
        


        {/* Step Label */}
        <FadeIn delay={100} className="mb-3 text-center">
          <span className="text-[#E86100] font-poppins font-bold text-[12px] uppercase tracking-[0.14em]">
            GET STARTED
          </span>
        </FadeIn>

        {/* Title & Short Underline */}
        <FadeIn delay={150} className="text-center">
          <h2 className="text-[32px] md:text-[36px] font-poppins font-bold text-[#000000] leading-tight tracking-tight">
            Join DoorStep
          </h2>
          <div className="w-[48px] h-[4px] rounded-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] mt-2 mb-3 mx-auto"></div>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={200} className="text-center">
          <p className="font-inter text-[16px] text-[#6B6B6B] mb-8">
            Choose how you want to use the platform.
          </p>
        </FadeIn>

        {/* Role Cards Group */}
        <FadeIn delay={250}>
          <div 
            role="radiogroup" 
            aria-label="Choose how you want to use the platform"
            className="space-y-4"
          >
            
            {/* Customer Role Card */}
            <div
              id="role-card-customer"
              role="radio"
              aria-checked={selectedRole === 'customer'}
              tabIndex={0}
              onClick={() => setSelectedRole('customer')}
              onDoubleClick={() => navigate('/register/customer')}
              onKeyDown={(e) => handleKeyDown(e, 'customer')}
              className={`group w-full text-left rounded-[20px] p-5 sm:p-6 transition-all duration-200 cursor-pointer flex items-start gap-4 sm:gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF7A00] ${
                selectedRole === 'customer'
                  ? 'border-2 border-[#FF7A00] bg-[#FFF8F1] shadow-[0_14px_36px_rgba(255,122,0,0.12)] ring-4 ring-[#FF7A00]/15'
                  : 'bg-white border-[1.5px] border-[#E8E2DB] shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-[#FF7A00]/50 hover:-translate-y-[3px] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)]'
              }`}
            >
              {/* 56px Orange Gradient Icon Tile */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-[16px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center flex-shrink-0 text-white shadow-[0_8px_20px_rgba(255,122,0,0.30)] transition-transform duration-200 group-hover:scale-105">
                <Home size={26} strokeWidth={2} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-poppins font-semibold text-[19px] sm:text-[20px] text-[#000000] mb-1 leading-snug">
                  Customer
                </h3>
                <p className="font-inter text-[14px] sm:text-[15px] text-[#3D3D3D] leading-[1.6]">
                  I want to find skilled workers for my home needs.
                </p>

                {/* Benefits Row */}
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 mt-2.5">
                  {['Verified professionals', 'Instant booking', 'Transparent pricing'].map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] text-[#3D3D3D] font-inter">
                      <Check size={14} className="text-[#2E9E5B] flex-shrink-0" strokeWidth={2.5} />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* 24px Radio Circle */}
              <div className="pt-0.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                  selectedRole === 'customer'
                    ? 'bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] border-none shadow-[0_2px_8px_rgba(255,122,0,0.35)]'
                    : 'border-2 border-[#E8E2DB] bg-white group-hover:border-[#FF7A00]/50'
                }`}>
                  {selectedRole === 'customer' && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
              </div>
            </div>

            {/* Worker Role Card */}
            <div
              id="role-card-worker"
              role="radio"
              aria-checked={selectedRole === 'worker'}
              tabIndex={0}
              onClick={() => setSelectedRole('worker')}
              onDoubleClick={() => navigate('/register/worker')}
              onKeyDown={(e) => handleKeyDown(e, 'worker')}
              className={`group w-full text-left rounded-[20px] p-5 sm:p-6 transition-all duration-200 cursor-pointer flex items-start gap-4 sm:gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF7A00] ${
                selectedRole === 'worker'
                  ? 'border-2 border-[#FF7A00] bg-[#FFF8F1] shadow-[0_14px_36px_rgba(255,122,0,0.12)] ring-4 ring-[#FF7A00]/15'
                  : 'bg-white border-[1.5px] border-[#E8E2DB] shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-[#FF7A00]/50 hover:-translate-y-[3px] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)]'
              }`}
            >
              {/* 56px Orange Gradient Icon Tile */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-[16px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center flex-shrink-0 text-white shadow-[0_8px_20px_rgba(255,122,0,0.30)] transition-transform duration-200 group-hover:scale-105">
                <Wrench size={26} strokeWidth={2} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-poppins font-semibold text-[19px] sm:text-[20px] text-[#000000] mb-1 leading-snug">
                  Worker
                </h3>
                <p className="font-inter text-[14px] sm:text-[15px] text-[#3D3D3D] leading-[1.6]">
                  I want to offer my services and find jobs.
                </p>

                {/* Benefits Row */}
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 mt-2.5">
                  {['Get job requests near you', 'Set your own availability', 'Grow your business'].map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] text-[#3D3D3D] font-inter">
                      <Check size={14} className="text-[#2E9E5B] flex-shrink-0" strokeWidth={2.5} />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* 24px Radio Circle */}
              <div className="pt-0.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                  selectedRole === 'worker'
                    ? 'bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] border-none shadow-[0_2px_8px_rgba(255,122,0,0.35)]'
                    : 'border-2 border-[#E8E2DB] bg-white group-hover:border-[#FF7A00]/50'
                }`}>
                  {selectedRole === 'worker' && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
              </div>
            </div>

          </div>
        </FadeIn>

        {/* Actions: Continue Button */}
        <FadeIn delay={300} className="mt-8">
          <button
            type="button"
            disabled={!selectedRole}
            onClick={handleContinue}
            className={`group w-full h-[54px] rounded-[12px] font-poppins font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 ${
              selectedRole
                ? 'bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white shadow-[0_10px_28px_rgba(255,122,0,0.30)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(255,122,0,0.40)] cursor-pointer'
                : 'bg-[#E8E2DB] text-[#6B6B6B] cursor-not-allowed shadow-none'
            }`}
          >
            Continue
            <ArrowRight size={18} className={`transition-transform duration-200 ${selectedRole ? 'group-hover:translate-x-1' : ''}`} />
          </button>
        </FadeIn>

        {/* Divider & Login Link */}
        <FadeIn delay={350}>
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8E2DB]"></div>
            </div>
            <span className="relative bg-white px-3 text-[14px] text-[#6B6B6B] font-inter">or</span>
          </div>

          <p className="text-center font-inter text-[15px] text-[#3D3D3D]">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-[#E86100] hover:underline focus:outline-none focus:ring-1 focus:ring-[#FF7A00] rounded"
            >
              Log in
            </Link>
          </p>
        </FadeIn>

      </div>
    </div>
  );
};

export default AccountType;
