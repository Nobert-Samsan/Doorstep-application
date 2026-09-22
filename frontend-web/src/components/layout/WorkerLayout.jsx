import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Inbox, Briefcase, DollarSign, MessageSquare, Settings, LogOut, Bell, Menu } from 'lucide-react';

const WorkerLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true
    });
    
    socket.on('connect', () => {
      socket.emit('join_room', user.id);
    });
    
    socket.on('new_job_broadcast', (jobPost) => {
      toast.info(`New Job Request: ${jobPost.title} in ${jobPost.district}`, {
        autoClose: false,
        onClick: () => navigate('/worker/requests')
      });
    });
    
    return () => socket.close();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard, matchPaths: ['/worker/dashboard'] },
    { name: 'Activities', path: '/worker/activities', icon: Briefcase, matchPaths: ['/worker/activities', '/worker/jobs'] },
    { name: 'Earnings', path: '/worker/earnings', icon: DollarSign },
    { name: 'Settings', path: '/worker/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white hidden lg:flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-primary shadow-lg">D</div>
            <h2 className="text-2xl font-bold tracking-tight text-white">DoorStep <span className="text-xs font-normal text-white/80">Pro</span></h2>
          </Link>
        </div>
        
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3 mb-8 border border-white/20 backdrop-blur-sm">
            {user?.profilePhoto ? (
              <img 
                src={user.profilePhoto} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover shadow-inner border-2 border-white/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl font-bold text-primary shadow-inner">
                {user?.firstName?.[0] || 'W'}
              </div>
            )}
            <div>
              <p className="font-semibold text-white">{user?.firstName || 'Worker'} {user?.lastName}</p>
              <div className="flex items-center gap-1 text-xs text-accent mt-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Online
              </div>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              let isActive = false;
              if (item.name === 'Dashboard' && location.search.includes('from=dashboard')) {
                isActive = true;
              } else if (item.name === 'Activities' && location.search.includes('from=dashboard')) {
                isActive = false;
              } else {
                isActive = item.matchPaths 
                  ? item.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
                  : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              }
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-sidebar text-white shadow-md font-medium' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-accent' : 'text-white/70'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/80 hover:bg-red-500 hover:text-white transition-colors font-medium"
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
            <h1 className="text-xl font-bold text-gray-800">Worker Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-primary relative rounded-full hover:bg-gray-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around items-center pt-2 pb-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
        {navItems.map((item) => {
          let isActive = false;
          if (item.name === 'Dashboard' && location.search.includes('from=dashboard')) {
            isActive = true;
          } else if (item.name === 'Activities' && location.search.includes('from=dashboard')) {
            isActive = false;
          } else {
            isActive = item.matchPaths 
              ? item.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          }
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

export default WorkerLayout;
