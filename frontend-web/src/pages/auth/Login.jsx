import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Eye, EyeOff, AlertCircle, ShieldCheck, Lock, User, Wrench, Mail, Loader2, ArrowRight, Check } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'worker'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier, password } : { phone: identifier, password };
      
      const response = await api.post('/auth/login', payload);
      
      if (response.data.success) {
        if (activeTab === 'customer' && response.data.user.role === 'worker') {
           setIsLoading(false);
           return setError('This account belongs to a worker. Please use the Worker tab.');
        }
        if (activeTab === 'worker' && response.data.user.role === 'customer') {
           setIsLoading(false);
           return setError('This account belongs to a customer. Please use the Customer tab.');
        }

        login(response.data.user, response.data.token);
        
        if (response.data.user.role === 'customer') navigate('/customer/dashboard');
        else if (response.data.user.role === 'worker') navigate('/worker/dashboard');
        else if (response.data.user.role === 'admin') navigate('/admin/dashboard');
        else navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email/phone or password');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google Login integration coming soon!");
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
      
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="md:hidden w-full bg-[#000000] p-4 flex flex-col items-center justify-center">
        <Link to="/" className="flex items-center gap-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded">
          <img src="/logo-new.png" alt="DoorStep" className="h-8 object-contain" />
        </Link>
        <div className="flex items-center gap-1.5 text-white/80 text-[12px]">
          <ShieldCheck size={14} className="text-[#FF7A00]" />
          <span>Sri Lanka's trusted platform</span>
        </div>
      </div>

      {/* LEFT BRAND PANEL (Desktop Only) */}
      <div className="hidden md:flex flex-col w-[38%] lg:w-[45%] relative overflow-hidden p-10 justify-between bg-[#000000]">
        
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="/login-bg.jpg" 
            alt="Professional at work" 
            className="absolute inset-0 w-full h-full object-cover object-[center_top] pointer-events-none" 
            style={{ transformOrigin: 'top center' }}
          />
          {/* Dark shadow overlay as before to keep text crisp */}
          <div className="absolute inset-0 bg-[#000000]/20 pointer-events-none"></div>
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.92) 80%, #000000 100%)' }}
          ></div>
        </div>

        {/* Top Logo */}
        <FadeIn delay={0} className="relative z-10">
          <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded">
            <img src="/logo-new.png" alt="DoorStep" className="h-12 md:h-14 object-contain" />
            <p className="text-white/80 text-[14px] mt-3 font-inter">Sri Lanka's trusted home services platform</p>
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
      <div className="w-full md:w-[62%] lg:w-[55%] relative flex items-center justify-center bg-white">

        <FadeIn delay={150} className="w-full max-w-[440px] px-6 py-12 md:px-0">
          
          <div className="text-left mb-8">
            <h2 className="text-[32px] font-poppins font-bold text-[#000000] mb-2 leading-tight">
              Welcome Back
            </h2>
            <p className="text-[#6B6B6B] font-inter text-[16px]">Sign in to find trusted workers near you</p>
          </div>

          {/* Role Switcher */}
          <div className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-[14px] p-[5px] flex relative mb-8" role="tablist">
            <div 
              className="absolute top-[5px] bottom-[5px] left-[5px] bg-[#000000] rounded-[10px] shadow-sm transition-all duration-250 ease-out"
              style={{ width: 'calc(50% - 5px)', transform: activeTab === 'customer' ? 'translateX(0)' : 'translateX(100%)' }}
            ></div>
            
            <button 
              role="tab"
              aria-selected={activeTab === 'customer'}
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[15px] font-semibold transition-colors duration-200 relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-1 ${activeTab === 'customer' ? 'text-white' : 'text-[#000000] hover:text-black'}`}
              onClick={() => { setActiveTab('customer'); setError(''); }}
            >
              <User size={18} className={activeTab === 'customer' ? 'text-white' : 'text-[#6B6B6B]'} />
              I am a Customer
            </button>
            <button 
              role="tab"
              aria-selected={activeTab === 'worker'}
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[15px] font-semibold transition-colors duration-200 relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-1 ${activeTab === 'worker' ? 'text-white' : 'text-[#000000] hover:text-black'}`}
              onClick={() => { setActiveTab('worker'); setError(''); }}
            >
              <Wrench size={18} className={activeTab === 'worker' ? 'text-white' : 'text-[#6B6B6B]'} />
              I am a Worker
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-[#FDECEC] border border-[#B42318] rounded-[12px] flex items-start gap-2.5">
              <AlertCircle size={18} className="text-[#B42318] mt-0.5 flex-shrink-0" />
              <p className="text-[#B42318] text-[14px] font-medium leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[#000000] font-semibold text-[14px] mb-2 font-inter">Email or Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-[#6B6B6B] group-focus-within:text-[#000000] transition-colors" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or 077..."
                  className={`w-full h-[56px] bg-white rounded-[12px] pl-11 pr-4 font-inter text-[16px] text-[#000000] placeholder-[#6B6B6B] transition-colors duration-200 outline-none
                    ${error ? 'border-2 border-[#B42318]' : 'border border-[#E8E2DB] hover:border-[#CFC6BC] focus:border-2 focus:border-[#000000]'}`}
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[#000000] font-semibold text-[14px] mb-2 font-inter">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-[#6B6B6B] group-focus-within:text-[#000000] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-[56px] bg-white rounded-[12px] pl-11 pr-12 font-inter text-[16px] text-[#000000] placeholder-[#6B6B6B] transition-colors duration-200 outline-none
                    ${error ? 'border-2 border-[#B42318]' : 'border border-[#E8E2DB] hover:border-[#CFC6BC] focus:border-2 focus:border-[#000000]'}`}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6B6B6B] hover:text-[#000000] focus:outline-none focus:text-[#000000]"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 pb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded-[4px] border border-[#E8E2DB] bg-white group-hover:border-[#CFC6BC] transition-colors overflow-hidden">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="absolute opacity-0 cursor-pointer w-full h-full z-10"
                    disabled={isLoading}
                  />
                  {rememberMe && (
                    <div className="absolute inset-0 bg-[#FF7A00] flex items-center justify-center">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="text-[#3D3D3D] text-[14px] select-none font-inter">Remember me</span>
              </label>

              <Link to="/forgot-password" className="text-[14px] font-semibold text-[#E86100] hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded px-1 font-inter">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-[56px] bg-[#FF7A00] hover:bg-[#E86100] active:bg-[#CC5200] text-white font-poppins font-semibold text-[16px] rounded-[12px] transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6 text-[#6B6B6B] text-[13px] font-inter">
            <div className="flex-1 h-[1px] bg-[#E8E2DB]"></div>
            <span>or</span>
            <div className="flex-1 h-[1px] bg-[#E8E2DB]"></div>
          </div>

          {/* GOOGLE SIGN IN */}
          <button 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="w-full h-[56px] bg-white border border-[#E8E2DB] rounded-[12px] flex items-center justify-center gap-3 text-[#000000] font-semibold text-[15px] hover:bg-gray-50 hover:border-[#CFC6BC] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 font-inter"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-[20px] w-[20px]" />
            Sign in with Google
          </button>

          {/* REGISTER LINK */}
          <div className="text-center mt-8 text-[14px] text-[#3D3D3D] font-inter">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#E86100] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded px-1">
              Register here
            </Link>
          </div>
          
        </FadeIn>
      </div>
    </div>
  );
};

export default Login;
