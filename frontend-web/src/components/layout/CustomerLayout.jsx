import React, { useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, Search, Briefcase, MessageSquare, Settings, LogOut, Bell, Menu } from 'lucide-react';

const CustomerLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);

  // Scroll main content area to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/customer/dashboard', icon: Home, matchPaths: ['/customer/dashboard', '/customer/post-job', '/customer/category', '/customer/worker', '/customer/book'] },
    { name: 'My Bookings', path: '/customer/bookings', icon: Briefcase, matchPaths: ['/customer/bookings'] },
    { name: 'Notifications', path: '/customer/notifications', icon: Bell, matchPaths: ['/customer/notifications'] },
    { name: 'Settings', path: '/customer/settings', icon: Settings, matchPaths: ['/customer/settings'] },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#78350F] text-white hidden lg:flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-white shadow-lg">D</div>
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent to-white">DoorStep</h2>
          </Link>
        </div>
        
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="bg-white/5 rounded-xl p-4 flex items-center space-x-3 mb-8 border border-white/10 backdrop-blur-sm">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold shadow-inner text-white">
                {user?.firstName?.[0] || 'C'}
              </div>
            )}
            <div>
              <p className="font-semibold text-white">{user?.firstName || 'Customer'} {user?.lastName}</p>
              <p className="text-xs text-white/60">{user?.city || 'Colombo'}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary/80 to-secondary/80 text-white shadow-md font-medium' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-white/60'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pb-[72px] lg:pb-0">
        <header className="h-16 glass z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">Customer Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-primary relative rounded-full hover:bg-gray-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>
        
        <main ref={mainRef} className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around items-center pt-2 pb-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
        {navItems.map((item) => {
          const isActive = item.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
          const Icon = item.icon;
          return (
            <Link 
              key={item.name}
              to={item.path} 
              className={`flex flex-col items-center p-2 w-full ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              <Icon size={22} className={isActive ? 'text-primary' : 'text-gray-400'} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default CustomerLayout;
