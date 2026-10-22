import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { 
  Plus, 
  Bell, 
  ChevronDown, 
  MapPin, 
  User, 
  Calendar, 
  HelpCircle, 
  LogOut, 
  Home, 
  Wrench, 
  MessageSquare, 
  CheckCircle2,
  Settings
} from 'lucide-react';
import '../../assets/css/customer-dashboard.css';
import { ALL_SERVICES } from '../../constants/allServices';

const CustomerLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);

  // Layout states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const servicesTimerRef = useRef(null);

  // Real data state
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  const avatarRef = useRef(null);

  // Hover handlers with debounce for smooth transitions
  const handleServicesMouseEnter = () => {
    if (servicesTimerRef.current) clearTimeout(servicesTimerRef.current);
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimerRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 180);
  };

  // Reset scroll and close menus on navigation
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
    setIsAvatarOpen(false);
    setIsServicesOpen(false);
  }, [location.pathname]);

  // Handle scroll detection for sticky navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = mainRef.current ? mainRef.current.scrollTop : window.scrollY;
      setIsScrolled(scrollY > 8);
    };

    const mainEl = mainRef.current;
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (mainEl) mainEl.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menus on outside click and Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setIsServicesOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsAvatarOpen(false);
        setIsServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (servicesTimerRef.current) clearTimeout(servicesTimerRef.current);
    };
  }, []);

  // Fetch real data for badges and notifications
  const fetchNavbarData = async () => {
    try {
      const [notifRes, convRes, bookRes] = await Promise.allSettled([
        api.get('/notifications'),
        api.get('/chat/conversations'),
        api.get('/bookings')
      ]);

      if (notifRes.status === 'fulfilled' && notifRes.value.data?.data) {
        const notifs = notifRes.value.data.data;
        setNotifications(notifs);
        setUnreadNotifCount(notifs.filter(n => !n.isRead).length);
      }

      if (convRes.status === 'fulfilled' && convRes.value.data?.data) {
        const convs = convRes.value.data.data;
        let count = 0;
        convs.forEach(c => {
          if (c.unreadCount) count += c.unreadCount;
        });
        setUnreadMessagesCount(count);
      }

      if (bookRes.status === 'fulfilled' && bookRes.value.data?.data) {
        const bookings = bookRes.value.data.data;
        const activeCount = bookings.filter(b => 
          ['pending', 'accepted', 'en_route', 'arrived', 'in_progress'].includes(b.status)
        ).length;
        setBookingCount(activeCount);
      }
    } catch (err) {
      console.error("Failed to fetch navbar data:", err);
    }
  };

  useEffect(() => {
    fetchNavbarData();
  }, [location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadNotifCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Proper case display formatting for name (e.g. "Nobert Dinesh")
  const formatProperCase = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const displayName = formatProperCase(`${user?.firstName || 'Customer'} ${user?.lastName || ''}`.trim());
  const initials = `${user?.firstName?.[0] || 'C'}${user?.lastName?.[0] || ''}`.toUpperCase();
  const displayLocation = user?.district || user?.city || 'Sri Lanka';

  // Desktop Menu items
  const menuLinks = [
    { name: 'Home', path: '/customer/dashboard', matchPaths: ['/customer/dashboard'] },
    { name: 'Services', path: '/customer/find-workers', matchPaths: ['/customer/find-workers', '/customer/category'] },
    { name: 'My Bookings', path: '/customer/bookings', matchPaths: ['/customer/bookings'] },
  ];

  // Parsed main categories from ALL_SERVICES for Services sub-menu
  const mainCategories = ALL_SERVICES.map(item => {
    const match = item.category.match(/^(\S+)\s+(.+)$/);
    const emoji = match ? match[1] : '🔧';
    const name = match ? match[2] : item.category;
    const sampleJobs = item.jobs.slice(0, 2).map(j => {
      const jMatch = j.match(/^(.*?)\s*\(/);
      return jMatch ? jMatch[1].trim() : j.split(' ')[0];
    }).join(', ');

    return {
      emoji,
      name,
      sampleJobs,
      count: item.jobs.length
    };
  });

  // Mobile Bottom Tabs
  // Mobile Bottom Tabs: Home, Bookings, Post a Job (Center), Notifications, Account
  const mobileTabs = [
    { name: 'Home', path: '/customer/dashboard', matchPaths: ['/customer/dashboard'], icon: Home },
    { name: 'Bookings', path: '/customer/bookings', matchPaths: ['/customer/bookings'], icon: Calendar, badge: bookingCount > 0 ? bookingCount : null },
    { name: 'Post a Job', path: '/customer/post-job', matchPaths: ['/customer/post-job'], icon: Plus },
    { name: 'Notifications', path: '/customer/notifications', matchPaths: ['/customer/notifications'], icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : null },
    { name: 'Account', path: '/customer/settings', matchPaths: ['/customer/settings'], icon: User },
  ];

  return (
    <div className="page-wrapper min-h-screen flex flex-col font-sans bg-white">
      {/* Inline styles for custom animations and focus states */}
      <style>{`
        @keyframes scaleInCenter {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleInCenter 250ms ease-out forwards;
          transform-origin: center;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* TOP NAVBAR (White #FFFFFF, 80px) */}
      <header 
        style={{ backgroundColor: '#FFFFFF' }}
        className={`fixed top-0 left-0 right-0 z-50 h-20 bg-white border-b border-[#E8E2DB] transition-all duration-200 ${
          isScrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]' : ''
        }`}
      >
        <div className="max-w-[1200px] mx-auto h-full px-6 md:px-8 flex items-center justify-between">
          
          {/* Zone 1: Logo (Left) */}
          <div className="flex items-center shrink-0">
            <Link 
              to="/customer/dashboard" 
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] rounded-lg"
              aria-label="DoorStep Home"
            >
              <img 
                src="/logo-new.png" 
                alt="DoorStep Logo" 
                className="h-16 md:h-20 w-auto object-contain" 
              />
            </Link>
          </div>

          {/* Zone 2: Main Menu (Center-Left Desktop) */}
          <nav className="hidden md:flex items-center ml-6 lg:ml-10 gap-1" aria-label="Main Navigation">
            {menuLinks.map((item) => {
              const isServices = item.name === 'Services';
              const isActive = item.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));

              if (isServices) {
                return (
                  <div
                    key={item.name}
                    ref={servicesRef}
                    className="relative"
                    onMouseEnter={handleServicesMouseEnter}
                    onMouseLeave={handleServicesMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setIsServicesOpen(prev => !prev)}
                      className={`relative px-[14px] py-[10px] rounded-[10px] text-[15px] font-['Inter',sans-serif] transition-colors duration-200 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] cursor-pointer ${
                        isActive || isServicesOpen
                          ? 'text-black font-semibold font-[\'Poppins\',sans-serif]' 
                          : 'text-[#6B6B6B] font-medium hover:text-black hover:bg-black/[0.04]'
                      }`}
                      aria-expanded={isServicesOpen}
                      aria-haspopup="true"
                    >
                      <span>{item.name}</span>
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${
                          isServicesOpen ? 'rotate-180 text-[#FF7A00]' : 'text-[#6B6B6B]'
                        }`}
                      />
                      {isActive && (
                        <span 
                          className="absolute -bottom-[6px] left-0 right-0 mx-auto h-[3px] w-full rounded-full animate-scaleIn pointer-events-none"
                          style={{
                            background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)'
                          }}
                        />
                      )}
                    </button>

                    {/* Services Sub-Menu Dropdown Panel */}
                    {isServicesOpen && (
                      <div 
                        className="absolute left-0 top-full pt-2 z-50 w-[580px] lg:w-[640px]"
                        role="menu"
                        aria-label="Services Submenu"
                      >
                        <div className="bg-white rounded-[20px] border border-[#E8E2DB] shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-4 sm:p-5 overflow-hidden animate-fadeIn">
                          {/* Sub-menu Header */}
                          <div className="pb-3 mb-3 border-b border-[#E8E2DB]/80 px-1">
                            <h3 className="text-[15px] font-['Poppins',sans-serif] font-bold text-[#111111]">
                              Main Categories
                            </h3>
                            <p className="text-[12px] text-[#6B6B6B]">
                              Explore verified home and business services
                            </p>
                          </div>

                          {/* 2-Column Categories Grid */}
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 max-h-[420px] overflow-y-auto pr-1">
                            {mainCategories.map((cat) => (
                              <Link
                                key={cat.name}
                                to={`/customer/category/${encodeURIComponent(cat.name)}`}
                                onClick={() => setIsServicesOpen(false)}
                                className="flex items-start gap-2.5 p-2 rounded-[12px] hover:bg-[#FFF8F1] group/cat transition-all duration-150"
                                role="menuitem"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] group-hover/cat:bg-[#FFEADA] flex items-center justify-center text-base shrink-0 transition-colors mt-0.5">
                                  <span>{cat.emoji}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[13px] font-semibold text-[#1C1917] group-hover/cat:text-[#FF7A00] truncate transition-colors leading-tight">
                                    {cat.name}
                                  </p>
                                  <p className="text-[11px] text-[#888888] truncate mt-0.5 leading-tight">
                                    {cat.sampleJobs}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Sub-menu Footer Strip */}
                          <div className="mt-3 pt-3 border-t border-[#E8E2DB]/80 flex items-center justify-between px-1 text-[12px]">
                            <span className="text-[#6B6B6B] flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#2E9E5B]" />
                              15 main categories
                            </span>
                            <Link
                              to="/customer/post-job"
                              onClick={() => setIsServicesOpen(false)}
                              className="font-semibold text-[#111111] hover:text-[#FF7A00] transition-colors"
                            >
                              Can't find a service? <span className="text-[#FF7A00] underline">Post a Job</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-[14px] py-[10px] rounded-[10px] text-[15px] font-['Inter',sans-serif] transition-colors duration-200 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] ${
                    isActive 
                      ? 'text-black font-semibold font-[\'Poppins\',sans-serif]' 
                      : 'text-[#6B6B6B] font-medium hover:text-black hover:bg-black/[0.04]'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-[#FF7A00] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span 
                      className="absolute -bottom-[6px] left-0 right-0 mx-auto h-[3px] w-full rounded-full animate-scaleIn pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)'
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Right Actions */}
          <div className="flex items-center gap-3 lg:gap-4 ml-auto">
            {/* "Post a Job" Button */}
            <Link
              to="/customer/post-job"
              className="hidden md:flex items-center gap-1.5 text-white font-semibold text-[14px] font-['Poppins',sans-serif] px-3 lg:px-[18px] py-[10px] rounded-[12px] shadow-[0_6px_16px_rgba(255,122,0,0.30)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,122,0,0.40)] active:translate-y-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]"
              style={{
                background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)'
              }}
              title="Post a Job"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden lg:inline">Post a Job</span>
            </Link>

            {/* Notification Bell */}
            <Link
              to="/customer/notifications"
              className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] ${
                location.pathname === '/customer/notifications'
                  ? 'text-black bg-black/[0.05]'
                  : 'text-[#6B6B6B] hover:text-black hover:bg-black/[0.04]'
              }`}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadNotifCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#FF7A00] ring-2 ring-white" />
              )}
            </Link>

            {/* Avatar Menu with Dropdown */}
            <div className="relative" ref={avatarRef}>
              <button
                type="button"
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] group"
                aria-label="User menu"
                aria-expanded={isAvatarOpen}
                aria-haspopup="true"
              >
                {/* 40px Circle with 2px orange gradient ring and 2px white gap */}
                <div 
                  className="w-10 h-10 rounded-full p-[2px] shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                >
                  <div className="w-full h-full p-[2px] bg-white rounded-full">
                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                      {user?.profilePhoto ? (
                        <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Name and District */}
                <div className="hidden sm:block text-left max-w-[150px]">
                  <p className="text-black font-semibold text-[14px] font-['Poppins',sans-serif] leading-tight truncate">
                    {displayName}
                  </p>
                  <p className="text-[#6B6B6B] text-[12px] leading-tight truncate mt-0.5">
                    {displayLocation}
                  </p>
                </div>

                {/* Rotating Chevron */}
                <ChevronDown 
                  size={14} 
                  className={`text-[#6B6B6B] group-hover:text-black transition-transform duration-200 hidden sm:block ${
                    isAvatarOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Avatar Dropdown Panel (Width 280px, #FFFFFF, 16px radius, #E8E2DB border) */}
              {isAvatarOpen && (
                <div 
                  className="absolute right-0 top-[calc(100%+8px)] w-[280px] bg-white rounded-[16px] border border-[#E8E2DB] shadow-[0_20px_50px_rgba(0,0,0,0.25)] z-50 overflow-hidden animate-fadeIn"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-[#E8E2DB] flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full p-[2px] shrink-0"
                      style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                    >
                      <div className="w-full h-full p-[2px] bg-white rounded-full">
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                          {user?.profilePhoto ? (
                            <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div 
                              className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
                              style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                            >
                              {initials}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-black font-semibold text-[16px] font-['Poppins',sans-serif] leading-tight truncate">
                        {displayName}
                      </p>
                      <p className="text-[#6B6B6B] text-[13px] flex items-center gap-1 mt-0.5 truncate">
                        <MapPin size={13} className="shrink-0 text-[#6B6B6B]" />
                        <span className="truncate">{displayLocation}</span>
                      </p>
                    </div>
                  </div>

                  {/* Dropdown Items (44px height, hover #FFF8F1 with orange icon) */}
                  <div className="py-1">
                    <Link
                      to="/customer/settings"
                      onClick={() => setIsAvatarOpen(false)}
                      className="hidden md:flex items-center gap-3 px-4 h-[44px] text-[15px] font-medium font-['Inter',sans-serif] text-black hover:bg-[#FFF8F1] group transition-colors"
                      role="menuitem"
                    >
                      <Settings size={20} className="text-[#6B6B6B] group-hover:text-[#FF7A00] transition-colors" />
                      <span>Settings</span>
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setIsAvatarOpen(false)}
                      className="flex items-center gap-3 px-4 h-[44px] text-[15px] font-medium font-['Inter',sans-serif] text-black hover:bg-[#FFF8F1] group transition-colors"
                      role="menuitem"
                    >
                      <HelpCircle size={20} className="text-[#6B6B6B] group-hover:text-[#FF7A00] transition-colors" />
                      <span>Help & Support</span>
                    </Link>

                    {/* 1px #E8E2DB Divider */}
                    <div className="border-t border-[#E8E2DB] my-1" />

                    {/* Log Out */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 h-[44px] text-[15px] font-medium font-['Inter',sans-serif] text-[#B42318] hover:bg-[#FDECEC] group transition-colors text-left"
                      role="menuitem"
                    >
                      <LogOut size={20} className="text-[#B42318]" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto pt-20 pb-[80px] md:pb-0">
        <Outlet />
      </main>

      {/* MOBILE FIXED BOTTOM TAB BAR (below 768px) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2DB] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] z-50 flex items-center justify-around h-[64px] px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Mobile Navigation"
      >
        {mobileTabs.map((tab) => {
















          const isActive = tab.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
          const IconComponent = tab.icon;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative min-w-[50px] min-h-[44px] ${
                isActive ? 'text-[#E86100]' : 'text-[#6B6B6B]'
              }`}
            >
              <div className="relative">
                <IconComponent size={20} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#FF7A00] text-white text-[10px] font-bold px-1 rounded-full leading-none min-w-[14px] text-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium mt-1 leading-none">
                {tab.name}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E86100] mt-1" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default CustomerLayout;
