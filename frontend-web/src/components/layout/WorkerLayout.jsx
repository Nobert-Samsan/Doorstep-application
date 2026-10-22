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
    { name: 'Activities', path: '/worker/activities', icon: Briefcase, matchPaths: ['/worker/activities', '/worker/jobs'] },
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
            className="flex items-center justify-center lg:justify-start gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF7A00]"
          >
            <div 
              className="w-9 h-9 rounded-[10px] flex items-center justify-center font-black text-white text-[17px] shadow-none shrink-0"
              style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
            >
              D
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-white font-heading">DoorStep</h2>
              <span 
                className="text-[11px] font-semibold text-white px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
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

        {/* PROFILE CARD */}
        <div className="bg-[#111111] rounded-[16px] p-2.5 lg:p-[14px] mb-5 border border-white/10 shrink-0">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            {/* 44px avatar with 2px orange gradient ring and 2px black gap */}
            <div 
              className="w-[44px] h-[44px] p-[2px] rounded-full shrink-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
            >
              <div className="w-full h-full p-[2px] bg-black rounded-full flex items-center justify-center overflow-hidden">
                {user?.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={displayName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center font-bold text-white text-xs"
                    style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                  >
                    {initials}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Status (Desktop only) */}
            <div className="min-w-0 flex-1 hidden lg:block">
              <p className="font-semibold text-white truncate text-[15px] font-heading" title={displayName}>
                {displayName}
              </p>
              <div className="flex items-center gap-1.5 text-[13px] mt-0.5">
                <span 
                  className={`w-2 h-2 rounded-full shrink-0 ${isAvailable ? 'bg-[#2E9E5B]' : 'bg-[#9A9A9A]'}`}
                />
                <span className="text-white/75 font-normal">
                  {isAvailable ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

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
        <header className="h-16 glass z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">Worker Portal</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-primary relative rounded-full hover:bg-gray-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            {/* Mobile Top Bar Avatar: Tapping opens /worker/profile on mobile (< 768px) */}
            <button
              type="button"
              onClick={() => navigate('/worker/profile')}
              aria-label="View My Profile"
              className="md:hidden relative w-9 h-9 rounded-full p-[2px] shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
            >
              <div className="w-full h-full rounded-full bg-white p-[1px] flex items-center justify-center overflow-hidden">
                {user?.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={displayName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center font-bold text-white text-[11px]"
                    style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                  >
                    {initials}
                  </div>
                )}
              </div>
              <span 
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-[1.5px] border-white ${
                  isAvailable ? 'bg-[#2E9E5B]' : 'bg-[#9A9A9A]'
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM TAB BAR (< 768px)                           */}
      {/* ======================================================== */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2DB] z-50 flex justify-around items-center h-[60px] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]" 
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
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
          return (
            <Link 
              key={item.name}
              to={item.path} 
              className={`relative flex flex-col items-center justify-center py-1 flex-1 text-center transition-colors ${
                isActive ? 'text-[#E86100]' : 'text-[#78716C] hover:text-[#000000]'
              }`}
            >
              <Icon size={22} weight={isActive ? "fill" : "regular"} />
              <span className="text-[11px] mt-0.5 font-medium">{item.name}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default WorkerLayout;