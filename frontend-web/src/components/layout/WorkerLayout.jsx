import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { 
  SquaresFour, 
  Briefcase, 
  CurrencyDollar, 
  Gear, 
  SignOut 
} from '@phosphor-icons/react';
import { Bell } from 'lucide-react';

const toProperCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


const WorkerLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAvailable, setIsAvailable] = useState(true);
  const [newRequestsCount, setNewRequestsCount] = useState(0);

  // Fetch initial availability and job requests count
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const [dashRes, reqRes] = await Promise.allSettled([
          api.get('/worker/dashboard'),
          api.get('/worker/job-requests')
        ]);

        if (isMounted && dashRes.status === 'fulfilled' && dashRes.value.data?.data?.profile) {
          const profile = dashRes.value.data.data.profile;
          if (typeof profile.isAvailable === 'boolean') {
            setIsAvailable(profile.isAvailable);
          }
        } else if (isMounted && typeof user?.isAvailable === 'boolean') {
          setIsAvailable(user.isAvailable);
        }

        if (isMounted && reqRes.status === 'fulfilled' && Array.isArray(reqRes.value.data?.data)) {
          setNewRequestsCount(reqRes.value.data.data.length);
        }
      } catch (err) {
        console.error('Error initializing worker layout data:', err);
      }
    };

    fetchInitialData();
    return () => { isMounted = false; };
  }, [user]);

  // Socket listener for real-time notifications
  useEffect(() => {
    if (!user) return;
    
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true
    });
    
    socket.on('connect', () => {
      socket.emit('join_room', user.id);
    });
    
    socket.on('new_job_broadcast', (jobPost) => {
      setNewRequestsCount(prev => prev + 1);
      toast.info(`New Job Request: ${jobPost.title} in ${jobPost.district}`, {
        autoClose: false,
        onClick: () => navigate('/worker/activities')
      });
    });
    
    return () => socket.close();
  }, [user, navigate]);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/worker/dashboard', icon: SquaresFour, matchPaths: ['/worker/dashboard'] },
    { name: 'Activities', path: '/worker/activities', icon: Briefcase, matchPaths: ['/worker/activities', '/worker/jobs', '/worker/requests'] },
    { name: 'Earnings', path: '/worker/earnings', icon: CurrencyDollar },
    { name: 'Settings', path: '/worker/settings', icon: Gear },
  ];

  const displayName = toProperCase(`${user?.firstName || 'Worker'} ${user?.lastName || ''}`.trim());
  const initials = `${user?.firstName?.[0] || 'W'}${user?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      
      {/* ======================================================== */}
      {/* DESKTOP & TABLET SIDEBAR                                  */}
      {/* ======================================================== */}
      <aside 
        className="hidden md:flex md:w-[76px] lg:w-[264px] h-screen sticky top-0 bg-[#000000] text-white flex-col p-5 md:px-2.5 lg:px-4 border-r border-white/[0.08] select-none shrink-0 overflow-y-auto overflow-x-hidden z-20"
      >
        
        {/* LOGO AREA */}
        <div className="pb-5 mb-5 border-b border-white/[0.08]">
          <Link 
            to="/" 
            className="flex items-center justify-center lg:justify-start gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF7A00]"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-white font-heading">
                <span className="lg:inline hidden">DoorStep</span>
                <span className="lg:hidden inline font-black text-[#FF9F0A]">D</span>
              </h2>
              <span 
                className="hidden lg:inline text-[11px] font-semibold text-white px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
                style={{ 
                  background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Pro
              </span>
            </div>
          </Link>
        </div>

        {/* NAVIGATION MENU */}
        <div>
          <div className="hidden lg:block text-white/40 text-[11px] font-semibold uppercase tracking-[0.12em] px-2 mb-2 font-heading">
            Menu
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
              const isActivities = item.name === 'Activities';
              const showBadge = isActivities && newRequestsCount > 0;

              if (isActive) {
                return (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    aria-current="page"
                    title={item.name}
                    className="group relative flex items-center justify-center lg:justify-start gap-3 px-3.5 h-[46px] rounded-[12px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF7A00]"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.10)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    {/* 3px by 20px rounded gradient bar INSIDE the item, 8px from left edge */}
                    <div 
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-[3px] h-[20px] rounded-full"
                      style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                    />
                    <Icon size={20} weight="regular" className="text-[#FF9F0A] shrink-0 lg:ml-1" />
                    <span 
                      className="hidden lg:inline text-white font-semibold text-[15px] font-heading flex-1 truncate"
                    >
                      {item.name}
                    </span>
                    {showBadge && (
                      <>
                        <span 
                          className="hidden lg:inline-flex items-center justify-center px-2 py-0.5 rounded-full text-white font-semibold text-[11px] shrink-0 font-heading"
                          style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                        >
                          {newRequestsCount}
                        </span>
                        <span 
                          className="lg:hidden absolute top-2 right-2 w-2 h-2 rounded-full"
                          style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                        />
                      </>
                    )}
                  </Link>
                );
              }

              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  title={item.name}
                  className="group relative flex items-center justify-center lg:justify-start gap-3 px-3.5 h-[46px] rounded-[12px] text-white/[0.72] hover:text-white hover:bg-white/[0.06] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF7A00]"
                >
                  <Icon 
                    size={20} 
                    weight="regular"
                    className="text-white/60 group-hover:text-white transition-colors duration-200 shrink-0 lg:ml-1" 
                  />
                  <span 
                    className="hidden lg:inline font-medium text-[15px] font-sans flex-1 truncate"
                  >
                    {item.name}
                  </span>
                  {showBadge && (
                    <>
                      <span 
                        className="hidden lg:inline-flex items-center justify-center px-2 py-0.5 rounded-full text-white font-semibold text-[11px] shrink-0 font-heading"
                        style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                      >
                        {newRequestsCount}
                      </span>
                      <span 
                        className="lg:hidden absolute top-2 right-2 w-2 h-2 rounded-full"
                        style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                      />
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FLEXIBLE FILLER SPACE */}
        <div className="flex-1 min-h-[16px]" />


        {/* LOGOUT BUTTON */}
        <div className="pt-3 mt-3 border-t border-white/[0.08] shrink-0">
          <button 
            onClick={handleLogout} 
            title="Logout"
            className="group flex items-center justify-center lg:justify-start gap-3 w-full px-3.5 h-[46px] rounded-[12px] text-white/[0.72] hover:text-[#FF9F0A] hover:bg-white/[0.06] transition-all duration-200 font-medium text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF7A00]"
          >
            <SignOut 
              size={20} 
              weight="regular"
              className="shrink-0 lg:ml-1 text-white/60 group-hover:text-[#FF9F0A] transition-colors duration-200" 
            />
            <span className="hidden lg:inline font-sans">Logout</span>
          </button>
        </div>

      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden pb-[72px] md:pb-0">
        
        {/* DESKTOP HEADER (>= 768px) */}
        <header className="hidden md:flex sticky top-0 left-0 right-0 z-50 h-20 bg-white border-b border-[#E8E2DB] shadow-none items-center justify-between px-5 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/worker/dashboard" className="flex items-center gap-2">
              <img 
                src="/logo-new.png" 
                alt="DoorStep Logo" 
                className="h-8 md:h-9 w-auto object-contain" 
              />
              <span 
                className="text-[11px] font-semibold text-white px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
                style={{ 
                  background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Pro
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex w-10 h-10 rounded-full items-center justify-center text-[#6B6B6B] hover:text-black hover:bg-black/[0.04] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#FF7A00] rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* MOBILE TOP NAVBAR (< 768px): Exact screenshot style with bottom border */}
        <header className="md:hidden sticky top-0 left-0 right-0 z-40 bg-white px-5 pt-3 pb-3 flex items-center justify-between shrink-0 border-b border-gray-200">
          <h1 className="text-[24px] font-bold text-[#1C1917] tracking-tight font-['Poppins',sans-serif]">
            Worker Portal
          </h1>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/worker/activities')}
              className="relative p-1.5 text-gray-500 hover:text-black focus:outline-none"
              aria-label="Notifications"
            >
              <Bell size={22} className="text-gray-500" />
              {newRequestsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Avatar with orange ring & availability dot */}
            <button
              type="button"
              onClick={() => navigate('/worker/profile')}
              aria-label="View My Profile"
              className="relative w-10 h-10 rounded-full p-[2px] shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
            >
              <div className="w-full h-full rounded-full bg-white p-[1.5px] flex items-center justify-center overflow-hidden">
                {user?.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={displayName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center font-bold text-white text-xs font-['Poppins',sans-serif]"
                    style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                  >
                    {initials}
                  </div>
                )}
              </div>
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isAvailable ? 'bg-[#2E9E5B]' : 'bg-[#9A9A9A]'
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-3 md:py-8 bg-white min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto transition-opacity duration-150">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM TAB BAR (< 768px)                           */}
      {/* ======================================================== */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2DB] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] z-50 flex items-center justify-around h-[64px] px-2" 
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Worker Mobile Navigation"
      >
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
          const isActivities = item.name === 'Activities';
          const showBadge = isActivities && newRequestsCount > 0;

          return (
            <Link 
              key={item.name}
              to={item.path} 
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative min-w-[50px] min-h-[44px] ${
                isActive ? 'text-[#E86100]' : 'text-[#6B6B6B] hover:text-black'
              }`}
            >
              <div className="relative">
                <Icon size={20} weight={isActive ? "fill" : "regular"} />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 bg-[#FF7A00] text-white text-[10px] font-bold px-1 rounded-full leading-none min-w-[14px] text-center">
                    {newRequestsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium mt-1 leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default WorkerLayout;