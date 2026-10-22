import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import {
  ArrowLeft,
  Wrench,
  MapPin,
  ShieldCheck,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  Zap,
  Calendar,
  Wallet
} from 'lucide-react';
import {
  TrendUp,
  CheckCircle as PhCheckCircle,
  Star as PhStar,
  Wallet as PhWallet,
  CaretRight
} from '@phosphor-icons/react';

const formatProperCase = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

const WorkerMobileProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Desktop / Tablet redirect: If accessed on screen >= 768px, redirect to dashboard
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        navigate('/worker/dashboard', { replace: true });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/worker/dashboard');
        if (isMounted) {
          setData(response.data.data);
          if (response.data?.data?.profile && typeof response.data.data.profile.isAvailable === 'boolean') {
            setIsAvailable(response.data.data.profile.isAvailable);
          }
        }
      } catch (error) {
        console.error('Error fetching worker profile data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfileData();
    return () => { isMounted = false; };
  }, []);

  const handleToggleAvailability = async () => {
    if (isTogglingAvailability) return;
    setIsTogglingAvailability(true);
    try {
      const res = await api.put('/worker/availability-toggle');
      if (res.data?.success) {
        setIsAvailable(res.data.isAvailable);
      }
    } catch (error) {
      console.error('Failed to toggle availability', error);
    } finally {
      setIsTogglingAvailability(false);
    }
  };

  const workerId = user && (user._id || user.id) ? (user._id || user.id).slice(-6).toUpperCase() : '---';
  const firstName = formatProperCase(user?.firstName) || 'Worker';
  const lastName = formatProperCase(user?.lastName) || '';
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'W' : 'W';
  const district = user?.district || 'Colombo';
  const approvalStatus = data?.profile?.approvalStatus || 'pending';

  let specialistRole = 'Home Services Specialist';
  if (data?.profile?.services && data.profile.services.length > 0) {
    const firstService = data.profile.services[0]?.serviceTitle || 'Home Services';
    specialistRole = firstService.toLowerCase().includes('specialist') ? firstService : `${firstService} Specialist`;
  }

  const monthNetEarnings = (data?.stats?.monthEarnings || 0) * 0.9;
  const jobsCompleted = Number(data?.stats?.jobsCompleted || 0);
  const avgRating = Number(data?.stats?.avgRating || data?.profile?.averageRating || 0);
  const totalReviews = Number(data?.stats?.totalReviews || data?.profile?.totalReviews || 0);
  const walletBalance = Number(
    data?.stats?.walletBalance !== undefined 
      ? data.stats.walletBalance 
      : data?.profile?.walletBalance !== undefined 
        ? data.profile.walletBalance 
        : 0
  );

  const handleCopyId = () => {
    if (!workerId || workerId === '---') return;
    navigator.clipboard.writeText(workerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] pb-10 font-sans">
      <style>{`
        @keyframes profileFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .anim-stagger-1 {
          animation: profileFadeUp 250ms cubic-bezier(0.16, 1, 0.3, 1) 0ms both;
        }
        .anim-stagger-2 {
          animation: profileFadeUp 250ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both;
        }
        .anim-stagger-3 {
          animation: profileFadeUp 250ms cubic-bezier(0.16, 1, 0.3, 1) 160ms both;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-stagger-1, .anim-stagger-2, .anim-stagger-3 {
            animation: none !important;
          }
        }
        .profile-focus-ring:focus-visible {
          outline: 2px solid #FFFFFF;
          box-shadow: 0 0 0 4px #FF7A00;
        }
        .stat-tile-active:active {
          border-color: rgba(255, 122, 0, 0.5) !important;
          transform: scale(0.98);
        }
      `}</style>

      {/* TOP BAR (< 768px) with 44px tap target back button & "My Profile" title */}
      <header className="sticky top-0 z-30 bg-[#FFF8F1]/90 backdrop-blur-md border-b border-[#E8E2DB] px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/worker/dashboard')}
          aria-label="Back to Dashboard"
          className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-[#1C1917] hover:bg-[#E8E2DB]/50 active:bg-[#E8E2DB] transition-colors profile-focus-ring"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-poppins font-bold text-[17px] text-[#000000]">
          My Profile
        </h1>
        {/* Placeholder to balance the flex row */}
        <div className="w-11 h-11" aria-hidden="true" />
      </header>

      {/* MAIN CONTAINER: 16px side padding, compact gap between sections */}
      <main className="px-4 py-3 space-y-2 max-w-md mx-auto">
        
        {/* ======================================================== */}
        {/* SECTION 1: IDENTITY CARD                                 */}
        {/* ======================================================== */}
        <section 
          className="anim-stagger-1 relative bg-white rounded-[20px] border border-[#E8E2DB] shadow-[0_8px_24px_rgba(0,0,0,0.05)] overflow-hidden pt-5 pb-4 px-5 flex flex-col items-center text-center"
          aria-label="Worker Identity"
        >
          {/* 4px orange gradient accent bar across the top of the card */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
            aria-hidden="true"
          />

          {/* Centered 88px avatar with 3px orange gradient ring and 3px white gap */}
          <div className="relative w-[88px] h-[88px] rounded-full p-[3px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] shrink-0 mb-3">
            <div className="w-full h-full rounded-full bg-white p-[3px] flex items-center justify-center">
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-bold text-[30px] flex items-center justify-center">
                  {initials}
                </div>
              )}
            </div>
            {/* 22px status dot at bottom-right with 2px white border */}
            <span
              className={`absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full border-[3px] border-white transition-colors ${
                isAvailable ? 'bg-[#2E9E5B]' : 'bg-[#9A9A9A]'
              }`}
              aria-hidden="true"
            />
          </div>

          {/* FULL Name (never truncated, wraps to two lines if needed) */}
          <h2 className="font-poppins font-bold text-[22px] text-[#000000] leading-tight mb-2">
            {fullName}
          </h2>

          {/* Role and Location in #6B6B6B Inter 14px with small line icons */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[#6B6B6B] font-inter text-[14px] mb-3">
            <div className="flex items-center gap-1.5">
              <Wrench size={15} className="text-[#FF7A00]" />
              <span>{specialistRole}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={15} className="text-[#FF7A00]" />
              <span>{district}</span>
            </div>
          </div>

          {/* Verified Chip only if verified */}
          {approvalStatus === 'approved' && (
            <div className="inline-flex items-center gap-1.5 bg-[#2E9E5B]/[0.12] border border-[#2E9E5B]/30 rounded-full px-3.5 py-1 text-[#1F7A44] text-[13px] font-semibold mb-3">
              <ShieldCheck size={16} className="text-[#2E9E5B]" />
              <span>Verified Professional</span>
            </div>
          )}

          {/* Worker ID Pill (white background, 1px #E8E2DB, 999px radius) */}
          <div className="inline-flex items-center bg-white border border-[#E8E2DB] rounded-full px-4 py-2 text-[#3D3D3D]">
            <span className="font-inter text-[14px] font-medium text-[#3D3D3D]">
              Worker ID #{workerId}
            </span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* WALLET BALANCE CARD (Below Profile First Section, Above Overview) */}
        {/* ======================================================== */}
        <section 
          className="anim-stagger-2 -mt-1"
          aria-label="Wallet Balance Card"
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/worker/earnings')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/worker/earnings'); } }}
            className="stat-tile-active bg-white rounded-[20px] border border-[#E8E2DB] shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-4 flex items-center justify-between cursor-pointer profile-focus-ring transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-[12px] bg-[#FFF8F1] border border-[#E8E2DB] flex items-center justify-center shrink-0">
                <PhWallet size={24} weight="duotone" className="text-[#FF7A00]" />
              </div>
              <div className="text-left">
                <div className="font-poppins font-semibold text-[11px] text-[#6B6B6B] uppercase tracking-wider">
                  Wallet Balance
                </div>
                <div className="font-poppins font-bold text-[22px] text-[#000000] leading-tight">
                  <span className="font-inter text-[14px] font-semibold text-[#6B6B6B] mr-0.5">Rs.</span>
                  {walletBalance.toFixed(2)}
                </div>
                <div className="font-inter text-[11px] text-[#6B6B6B] mt-0.5">
                  Available to withdraw
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {walletBalance > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/worker/earnings');
                  }}
                  className="px-3.5 py-1.5 rounded-[10px] text-white font-poppins font-semibold text-[13px] shadow-sm transition-transform active:scale-95"
                  style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                >
                  Withdraw
                </button>
              )}
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#6B6B6B]">
                <CaretRight size={16} weight="bold" />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: STATS (Overview Grid: Jobs Completed & Average Rating) */}
        {/* ======================================================== */}
        <section className="anim-stagger-2 pt-0.5" aria-label="Worker Statistics">
          <div className="font-poppins font-semibold text-[12px] text-[#6B6B6B] uppercase tracking-[0.1em] px-1 mb-1.5">
            Overview
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Tile 1: Jobs Completed */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('/worker/activities')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/worker/activities'); } }}
              className="stat-tile-active bg-white rounded-[18px] border border-[#E8E2DB] shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-4 min-h-[120px] flex flex-col justify-between cursor-pointer profile-focus-ring transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#FFF8F1] border border-[#E8E2DB] flex items-center justify-center shrink-0">
                  <PhCheckCircle size={20} weight="duotone" className="text-[#FF7A00]" />
                </div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[#6B6B6B]">
                  <CaretRight size={14} weight="bold" />
                </div>
              </div>
              <div>
                <div className="font-poppins font-semibold text-[11px] text-[#6B6B6B] uppercase tracking-wider mb-0.5">
                  Jobs Completed
                </div>
                <div className="font-poppins font-bold text-[20px] text-[#000000] leading-tight">
                  {jobsCompleted}
                </div>
                <div className="font-inter text-[11px] text-[#6B6B6B] mt-1 truncate">
                  {jobsCompleted > 0 ? 'Total completed jobs' : 'Complete your first job'}
                </div>
              </div>
            </div>

            {/* Tile 2: Average Rating */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('/worker/settings')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/worker/settings'); } }}
              className="stat-tile-active bg-white rounded-[18px] border border-[#E8E2DB] shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-4 min-h-[120px] flex flex-col justify-between cursor-pointer profile-focus-ring transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#FFF8F1] border border-[#E8E2DB] flex items-center justify-center shrink-0">
                  <PhStar size={20} weight="duotone" className="text-[#FF7A00]" />
                </div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[#6B6B6B]">
                  <CaretRight size={14} weight="bold" />
                </div>
              </div>
              <div>
                <div className="font-poppins font-semibold text-[11px] text-[#6B6B6B] uppercase tracking-wider mb-0.5">
                  Average Rating
                </div>
                {avgRating > 0 ? (
                  <div className="font-poppins font-bold text-[20px] text-[#000000] leading-tight">
                    {avgRating.toFixed(1)} <span className="font-inter text-[13px] font-normal text-[#6B6B6B]">/ 5</span>
                  </div>
                ) : (
                  <div className="mt-0.5">
                    <span className="inline-block bg-[#FFF8F1] text-[#E86100] border border-[#E8E2DB] font-poppins font-semibold text-[11px] px-2 py-0.5 rounded-full">
                      New on DoorStep
                    </span>
                  </div>
                )}
                <div className="font-inter text-[11px] text-[#6B6B6B] mt-1 truncate">
                  {totalReviews > 0 ? `Based on ${totalReviews} reviews` : 'Rated after your first job'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: QUICK LINKS CARD                              */}
        {/* ======================================================== */}
        <section className="anim-stagger-3 pt-1" aria-label="Quick Actions">
          <div className="bg-white rounded-[20px] border border-[#E8E2DB] shadow-[0_8px_24px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-[#E8E2DB]">
            {/* Help & Support Row */}
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="w-full h-[52px] px-4 flex items-center justify-between text-left hover:bg-[#FFF8F1] active:bg-[#FFF1E3] transition-colors profile-focus-ring"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-[#6B6B6B]" />
                <span className="font-inter font-medium text-[15px] text-[#000000]">
                  Help & Support
                </span>
              </div>
              <ChevronRight size={18} className="text-[#6B6B6B]" />
            </button>

            {/* Log Out Row */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full h-[52px] px-4 flex items-center justify-between text-left hover:bg-[#FDECEC] active:bg-[#FCDCDC] transition-colors profile-focus-ring"
            >
              <div className="flex items-center gap-3">
                <LogOut size={20} className="text-[#B42318]" />
                <span className="font-inter font-medium text-[15px] text-[#B42318]">
                  Log out
                </span>
              </div>
              <ChevronRight size={18} className="text-[#B42318]" />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default WorkerMobileProfile;
