import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'worker'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier, password } : { phone: identifier, password };
      
      const response = await api.post('/auth/login', payload);
      
      if (response.data.success) {
        // Optional: verify role match based on tab selected (if you want strict tab enforcement)
        if (activeTab === 'customer' && response.data.user.role === 'worker') {
           return setError('This account belongs to a worker. Please use the Worker tab.');
        }
        if (activeTab === 'worker' && response.data.user.role === 'customer') {
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
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google Login integration coming soon!");
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT COLUMN: Amber Hero */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-amber-600 text-white flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Subtle map overlay or pattern could go here */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        <div className="relative z-10">
          <Link to="/" className="text-4xl font-extrabold tracking-tight">DoorStep</Link>
          <p className="mt-4 text-xl font-medium text-amber-100 max-w-md">
            Connecting Sri Lankan homes with trusted, skilled professionals.
          </p>
        </div>

        <div className="relative z-10 mb-8">
          <blockquote className="text-2xl font-semibold leading-snug">
            "Finding reliable help for my home has never been easier. DoorStep changed everything."
          </blockquote>
          <p className="mt-4 font-medium text-amber-200">— Amara S., Colombo</p>
        </div>
      </div>

      {/* RIGHT COLUMN: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 bg-white relative">
        
        <div className="max-w-md w-full mx-auto">
          
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="text-4xl font-extrabold text-primary">DoorStep</Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>

          {/* Tabs */}
          <div className="flex mb-8 border-b border-gray-200">
            <button
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'customer' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => { setActiveTab('customer'); setError(''); }}
            >
              👤 I am a Customer
            </button>
            <button
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'worker' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => { setActiveTab('worker'); setError(''); }}
            >
              🔧 I am a Worker
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start animate-fadeIn">
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone Number</label>
              <input
                type="text"
                required
                placeholder={activeTab === 'customer' ? 'saman@example.com or 077...' : 'kamal@example.com or 071...'}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-amber-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30 mt-2"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                Sign in with Google
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to={activeTab === 'customer' ? "/register/customer" : "/register/worker"} className="font-bold text-primary hover:text-amber-700">
              Register here
            </Link>
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
