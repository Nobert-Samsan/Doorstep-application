const fs = require('fs');

const loginCode = `import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Eye, EyeOff, AlertCircle, ShieldCheck, Lock, Zap, User, Wrench, Mail, Loader2, ArrowRight } from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div 
      className={\`transition-all duration-500 ease-out \${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} \${className}\`}
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
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A]">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Door<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">Step</span></span>
        </Link>
        <div className="flex items-center gap-1.5 text-white/80 text-[12px]">
          <ShieldCheck size={14} className="text-[#FF7A00]" />
          <span>Sri Lanka's trusted platform</span>
        </div>
      </div>

      {/* LEFT BRAND PANEL (Desktop Only) */}
      <div className="hidden md:flex flex-col w-[38%] lg:w-[45%] bg-[#000000] relative overflow-hidden px-8 lg:px-16 py-12 justify-between">
        
        {/* Subtle Decorative Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#FF7A00]/22 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#FF7A00]/12 rounded-full blur-[80px] pointer-events-none"></div>
        
        {/* Floating Outline Circles */}
        <div className="absolute top-[20%] right-[10%] w-64 h-64 border border-white/5 rounded-full pointer-events-none animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[20%] left-[5%] w-80 h-80 border border-white/5 rounded-full pointer-events-none animate-[float_6s_ease-in-out_infinite_reverse]"></div>

        <style dangerouslySetInnerHTML={{__html: \`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
        \`}} />

        {/* Top Logo */}
        <FadeIn delay={0} className="relative z-10">
          <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] shadow-[0_4px_16px_rgba(255,122,0,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">Door<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">Step</span></span>
            </div>
            <p className="text-white/70 text-[14px] mt-2 font-inter">Sri Lanka's trusted home services platform</p>
          </Link>
        </FadeIn>

        {/* Center Content */}
        <div className="relative z-10 mt-12 mb-auto flex-1 flex flex-col justify-center">
          <FadeIn delay={100}>
            <h1 className="text-[32px] lg:text-[48px] font-poppins font-bold text-white leading-[1.15] mb-12 max-w-[480px]">
              Find trusted workers <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">right at your doorstep</span>
              <svg className="inline-block ml-3 w-8 h-8 lg:w-10 lg:h-10 text-white fill-[url(#orange-grad)]" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="orange-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF9F0A" />
                    <stop offset="100%" stopColor="#F94D1A" />
                  </linearGradient>
                </defs>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="url(#orange-grad)" stroke="none"></path>
                <polyline points="9 22 9 12 15 12 15 22" stroke="white" fill="none"></polyline>
              </svg>
            </h1>
          </FadeIn>

          <div className="flex flex-col gap-3.5">
            {[
              { icon: ShieldCheck, text: "Verified Workers Island-wide", highlight: "Verified Workers" },
              { icon: Lock, text: "Your contact details are always protected", highlight: "always protected" },
              { icon: Zap, text: "Average response time under 8 minutes", highlight: "under 8 minutes" }
            ].map((feature, idx) => (
              <FadeIn delay={200 + (idx * 100)} key={idx}>
                <div className="group flex items-center gap-4 bg-[#111111] border border-white/10 rounded-[16px] p-4 pr-5 hover:border-[#FF7A00]/50 hover:-translate-y-[3px] transition-all duration-300 shadow-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center">
                    <feature.icon size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-white/90 font-inter text-[15px] leading-snug">
                    {feature.text.split(feature.highlight).map((part, i) => 
                      i === 0 ? <React.Fragment key={i}>{part}<span className="text-white font-semibold">{feature.highlight}</span></React.Fragment> : <React.Fragment key={i}>{part}</React.Fragment>
                    )}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full md:w-[62%] lg:w-[55%] relative flex items-center justify-center bg-[#FFFFFF]">
        {/* Subtle top-right glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7A00]/[0.06] rounded-full blur-[80px] pointer-events-none"></div>

        <FadeIn delay={150} className="w-full max-w-[440px] px-6 py-12 md:px-0">
          
          <div className="text-center mb-8">
            <h2 className="text-[32px] md:text-[36px] font-poppins font-bold text-[#000000] mb-2 flex flex-col items-center">
              Welcome Back
              <span className="w-12 h-1 bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] rounded-full mt-2"></span>
            </h2>
            <p className="text-[#6B6B6B] font-inter text-[16px] mt-3">Sign in to find trusted workers near you</p>
          </div>

          {/* Role Switcher */}
          <div className="bg-[#FFF8F1] border border-[#E8E2DB] rounded-[14px] p-[5px] flex relative mb-8" role="tablist">
            <div 
              className="absolute top-[5px] bottom-[5px] left-[5px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] rounded-[10px] shadow-[0_6px_16px_rgba(255,122,0,0.3)] transition-all duration-250 ease-out"
              style={{ width: 'calc(50% - 5px)', transform: activeTab === 'customer' ? 'translateX(0)' : 'translateX(100%)' }}
            ></div>
            
            <button 
              role="tab"
              aria-selected={activeTab === 'customer'}
              type="button"
              className={\`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[15px] font-semibold transition-colors duration-200 relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-1 \${activeTab === 'customer' ? 'text-white' : 'text-[#000000] hover:bg-[#FFF1E3]'}\`}
              onClick={() => { setActiveTab('customer'); setError(''); }}
            >
              <User size={18} className={activeTab === 'customer' ? 'text-white' : 'text-[#6B6B6B]'} />
              I am a Customer
            </button>
            <button 
              role="tab"
              aria-selected={activeTab === 'worker'}
              type="button"
              className={\`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[15px] font-semibold transition-colors duration-200 relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-1 \${activeTab === 'worker' ? 'text-white' : 'text-[#000000] hover:bg-[#FFF1E3]'}\`}
              onClick={() => { setActiveTab('worker'); setError(''); }}
            >
              <Wrench size={18} className={activeTab === 'worker' ? 'text-white' : 'text-[#6B6B6B]'} />
              I am a Worker
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[12px] flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-[14px] font-medium leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[#000000] font-semibold text-[14px] mb-2">Email or Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-[#6B6B6B] group-focus-within:text-[#FF7A00] transition-colors" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or 077..."
                  className={\`w-full h-[52px] bg-white border rounded-[12px] pl-11 pr-4 font-inter text-[16px] text-[#000000] placeholder-[#6B6B6B] transition-all duration-200 outline-none
                    \${error ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15' : 'border-[#E8E2DB] hover:border-[#CFC6BC] focus:border-[#FF7A00] focus:ring-4 focus:ring-[#FF7A00]/15'}\`}
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[#000000] font-semibold text-[14px] mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-[#6B6B6B] group-focus-within:text-[#FF7A00] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={\`w-full h-[52px] bg-white border rounded-[12px] pl-11 pr-12 font-inter text-[16px] text-[#000000] placeholder-[#6B6B6B] transition-all duration-200 outline-none
                    \${error ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15' : 'border-[#E8E2DB] hover:border-[#CFC6BC] focus:border-[#FF7A00] focus:ring-4 focus:ring-[#FF7A00]/15'}\`}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6B6B6B] hover:text-[#000000] focus:outline-none focus:text-[#FF7A00]"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 pb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded-[6px] border border-[#E8E2DB] bg-white group-hover:border-[#CFC6BC] transition-colors overflow-hidden">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="absolute opacity-0 cursor-pointer w-full h-full z-10"
                    disabled={isLoading}
                  />
                  <div className={\`absolute inset-0 bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] transition-opacity duration-200 \${rememberMe ? 'opacity-100' : 'opacity-0'}\`}></div>
                  {rememberMe && <Check size={14} className="text-white relative z-10" strokeWidth={3} />}
                </div>
                <span className="text-[#3D3D3D] text-[14px] select-none">Remember me</span>
              </label>

              <Link to="/forgot-password" className="text-[14px] font-semibold text-[#E86100] hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded px-1">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="group relative w-full h-[54px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-semibold text-[16px] rounded-[12px] shadow-[0_10px_28px_rgba(255,122,0,0.3)] hover:shadow-[0_10px_32px_rgba(255,122,0,0.4)] hover:-translate-y-[2px] active:translate-y-[1px] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_10px_28px_rgba(255,122,0,0.3)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-[12px] my-6 text-[#6B6B6B] text-[13px]">
            <div className="flex-1 h-[1px] bg-[#E8E2DB]"></div>
            <span>Or continue with</span>
            <div className="flex-1 h-[1px] bg-[#E8E2DB]"></div>
          </div>

          {/* GOOGLE SIGN IN */}
          <button 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="w-full h-[52px] bg-white border border-[#E8E2DB] rounded-[12px] flex items-center justify-center gap-3 text-[#000000] font-semibold text-[15px] hover:bg-[#FFF8F1] hover:border-[#CFC6BC] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-1 disabled:opacity-70"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-[20px] w-[20px]" />
            Sign in with Google
          </button>

          {/* REGISTER LINK */}
          <div className="text-center mt-8 text-[14px] text-[#3D3D3D]">
            Don't have an account?{' '}
            <Link to={activeTab === 'customer' ? "/register/customer" : "/register/worker"} className="text-[#E86100] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded px-1">
              Register here
            </Link>
          </div>

          {/* Security Note */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-[#6B6B6B] text-[13px]">
            <Lock size={14} className="text-[#2E9E5B]" />
            Your details are encrypted and never shared.
          </div>
          
        </FadeIn>
      </div>
    </div>
  );
};

export default Login;
`;

fs.writeFileSync('frontend-web/src/pages/auth/Login.jsx', loginCode);
console.log('Successfully redesigned Login page!');
