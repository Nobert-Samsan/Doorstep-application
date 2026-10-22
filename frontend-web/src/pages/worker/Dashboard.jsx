import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import JobRequests from './JobRequests';
import { useAuthStore } from '../../store/authStore';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Wrench, 
  Wallet, 
  CheckCircle, 
  Star, 
  AlertCircle, 
  Briefcase, 
  Inbox, 
  Calendar, 
  TrendingUp,
  Copy,
  Check,
  ChevronRight,
  Zap
} from 'lucide-react';
import { 
  TrendUp, 
  CheckCircle as PhCheckCircle, 
  Star as PhStar, 
  Wallet as PhWallet, 
  CaretRight 
} from '@phosphor-icons/react';

const CountUp = ({ end, decimals = 0, duration = 900 }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = Number(end) || 0;
    if (prefersReduced || target === 0) {
      setVal(target);
      return;
    }

    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(target * ease);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [end, duration]);

  return <>{val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(true);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get('/worker/dashboard');
        setData(response.data.data);
        if (response.data?.data?.profile && typeof response.data.data.profile.isAvailable === 'boolean') {
          setIsAvailable(response.data.data.profile.isAvailable);
        }
      } catch (error) {
        console.error('Error fetching dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
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

  const handleCopyId = () => {
    if (!workerId || workerId === '---') return;
    navigator.clipboard.writeText(workerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };


  const formatProperCase = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const workerId = user && (user._id || user.id) ? (user._id || user.id).slice(-6).toUpperCase() : '---';
  const firstName = formatProperCase(user?.firstName) || 'Worker';
  const lastName = formatProperCase(user?.lastName) || '';
  const properFullName = lastName ? `${firstName} ${lastName}` : firstName;
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
  const commissionDue = Number(data?.stats?.commissionDue || 0);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };
  const timeGreeting = getTimeGreeting();

  const newRequestsCount = Number(
    data?.incomingRequests?.length !== undefined 
      ? data.incomingRequests.length 
      : data?.stats?.newRequests !== undefined 
        ? data.stats.newRequests 
        : (data?.stats?.pendingRequests || 0)
  );
  const todayJobsCount = Number(
    data?.todaySchedule?.length !== undefined
      ? data.todaySchedule.length
      : data?.stats?.todayJobs !== undefined 
        ? data.stats.todayJobs 
        : (data?.stats?.scheduledToday || 0)
  );
  const todayEarningsVal = Number(data?.stats?.todayEarnings || 0);
  const hasLiveCounts = Boolean(data?.stats);


  return (
    <>
      <style>
        {`
/* WORKER DASHBOARD WELCOME PANEL */
.worker-welcome-panel {
  background-color: #FFF8F1;
  border-radius: 32px;
  border: 1px solid #E8E2DB;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
}
@media (max-width: 767px) {
  .worker-welcome-panel {
    border-radius: 24px !important;
    margin-left: 12px !important;
    margin-right: 12px !important;
    margin-bottom: 16px !important;
    padding: 16px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
  }
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.mobile-banner-focus:focus-visible {
  outline: 2px solid #FFFFFF;
  box-shadow: 0 0 0 4px #FF7A00;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}
@media (max-width: 767px) {
  .stats-grid {
    display: none !important;
  }
}
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.stat-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 22px;
  border: 1px solid #E8E2DB;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background-color 220ms ease;
  outline: none;
  text-decoration: none;
  min-height: 172px;
}
.stat-card:hover {
  transform: translateY(-4px);
  border-color: #C8C1B7;
  box-shadow: 0 20px 32px -8px rgba(0, 0, 0, 0.08), 0 6px 14px -3px rgba(0, 0, 0, 0.04);
}
.stat-card:focus-visible {
  outline: 2px solid #000000;
  outline-offset: 2px;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.stat-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #FFF8F1;
  border: 1px solid #E8E2DB;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  flex-shrink: 0;
  transition: background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.stat-icon-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 200ms ease;
}
.stat-card:hover .stat-icon-box {
  background: #FFF8F1;
  border-color: #D8D1C7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
.stat-card:hover .stat-icon-svg {
  transform: scale(1.06);
}
.stat-duotone-icon path[opacity] {
  fill: #FF7A00 !important;
  opacity: 0.35 !important;
}
.stat-duotone-icon path:not([opacity]) {
  fill: #000000 !important;
  opacity: 1 !important;
}
.stat-arrow-ghost {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #E8E2DB;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B6B6B;
  transition: background-color 200ms ease, border-color 200ms ease, color 200ms ease, box-shadow 200ms ease;
  flex-shrink: 0;
}
.stat-arrow-icon {
  transition: transform 200ms ease;
}
.stat-card:hover .stat-arrow-ghost {
  background: #000000;
  border-color: #000000;
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.stat-card:hover .stat-arrow-icon {
  transform: translateX(2px);
}

.stat-label {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #6B6B6B;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.stat-value {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  line-height: 1.15;
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}
.stat-currency {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #6B6B6B;
  letter-spacing: 0;
}
.stat-sub {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13.5px;
  color: #6B6B6B;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 20px;
}
.stat-sub-icon {
  color: #6B6B6B;
  flex-shrink: 0;
}

.stat-pay-btn {
  background: linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%);
  color: #FFFFFF;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(249, 77, 26, 0.25);
  transition: transform 200ms ease, box-shadow 200ms ease;
  margin-top: 10px;
  align-self: flex-start;
}
.stat-pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(249, 77, 26, 0.35);
}

@keyframes statFadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card-anim-1 {
  animation: statFadeUp 350ms cubic-bezier(0.16, 1, 0.3, 1) 0ms both;
}
.stat-card-anim-2 {
  animation: statFadeUp 350ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both;
}
.stat-card-anim-3 {
  animation: statFadeUp 350ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both;
}
.stat-card-anim-4 {
  animation: statFadeUp 350ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both;
}

@keyframes statShimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.stat-skeleton-shimmer {
  background: linear-gradient(90deg, #F0EDE9 25%, #FAFAF8 50%, #F0EDE9 75%);
  background-size: 200% 100%;
  animation: statShimmer 1.5s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .stat-card-anim-1,
  .stat-card-anim-2,
  .stat-card-anim-3,
  .stat-card-anim-4 {
    animation: none !important;
  }
  .stat-card,
  .stat-card::before,
  .stat-icon-box,
  .stat-icon-svg,
  .stat-arrow-ghost,
  .stat-arrow-icon,
  .stat-pay-btn {
    transition: none !important;
    transform: none !important;
  }
  .stat-skeleton-shimmer {
    animation: none !important;
  }
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #F0EDE9;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  overflow: hidden;
}
.section-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #F5F2EF;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1C1917;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-title-icon {
  width: 28px;
  height: 28px;
  background: #FFF7ED;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #EA580C;
}
.section-count-badge {
  background: #FEF3C7;
  color: #92400E;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}
.view-all-link {
  font-size: 13px;
  font-weight: 600;
  color: #EA580C;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: gap 0.15s;
}
.view-all-link:hover { gap: 7px; }

.job-request-card {
  padding: 18px 20px;
  background: #FFFFFF;
  border: 1px solid #E8E2DB;
  border-radius: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}
.job-request-card:hover {
  background: #FFFDFB;
  border-color: #FF7A00;
  box-shadow: 0 4px 12px rgba(255, 122, 0, 0.08);
}
.job-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}
.job-category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #C2410C;
}
.urgency-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
}
.urgency-badge.emergency {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
}
.urgency-badge.normal {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  color: #16A34A;
}
.job-card-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
  flex-wrap: wrap;
  row-gap: 6px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #78716C;
}
.meta-item strong {
  color: #1C1917;
  font-weight: 600;
}
.job-card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.action-row-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-view {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: white;
  border: 1.5px solid #E7E5E4;
  color: #57534E;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-view:hover {
  border-color: #D6D3D1;
  background: #FAFAF9;
}
.btn-accept {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(135deg, #22C55E, #16A34A);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(34,197,94,0.25);
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-accept:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34,197,94,0.35);
}
.btn-decline {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: #FEF2F2;
  border: 1.5px solid #FECACA;
  color: #DC2626;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-decline:hover {
  background: #FEE2E2;
  border-color: #FCA5A5;
}
.job-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}
.job-card-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
@media (max-width: 640px) {
  .job-card-actions {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    gap: 8px;
  }
  .action-row-buttons {
    display: flex;
    width: 100%;
    gap: 10px;
  }
  .action-row-buttons .btn-decline,
  .action-row-buttons .btn-accept {
    flex: 1;
    width: 50%;
  }
  .btn-view, .btn-accept, .btn-decline {
    width: 100%;
    text-align: center;
  }
  .job-request-card {
    padding: 14px 16px;
  }
  .section-header {
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px;
  }
  .stat-card {
    padding: 16px;
    min-height: 140px;
  }
  .stat-value {
    font-size: 24px;
  }
}
.countdown-bar {
  height: 3px;
  background: #FEE2E2;
  border-radius: 2px;
  margin-bottom: 12px;
  overflow: hidden;
}
.countdown-fill {
  height: 100%;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  border-radius: 2px;
  width: 75%;
  animation: countdown 30s linear infinite;
}
@keyframes countdown {
  from { width: 100%; }
  to { width: 0%; }
}
.countdown-text {
  font-size: 11px;
  color: #DC2626;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.schedule-section {
  background: white;
  border-radius: 16px;
  border: 1px solid #F0EDE9;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  overflow: hidden;
}
.schedule-empty {
  padding: 40px 24px;
  text-align: center;
}
.schedule-empty-icon {
  width: 56px;
  height: 56px;
  background: #FFF7ED;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 12px;
  color: #EA580C;
}
.schedule-empty-text {
  font-size: 14px;
  color: #A8A29E;
  line-height: 1.6;
}

.quick-stats-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #F0EDE9;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.quick-stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #F8F5F2;
}
.quick-stat-row:last-child { border-bottom: none; }
.quick-stat-label {
  font-size: 13px;
  color: #78716C;
  display: flex;
  align-items: center;
  gap: 8px;
}
.quick-stat-label-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
.quick-stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #1C1917;
}

.profile-completion-card {
  background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
  border: 1px solid #FED7AA;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}
.completion-title {
  font-size: 14px;
  font-weight: 700;
  color: #92400E;
  margin-bottom: 4px;
}
.completion-sub {
  font-size: 12px;
  color: #B45309;
  margin-bottom: 14px;
}
.completion-bar-bg {
  height: 6px;
  background: rgba(180,83,9,0.15);
  border-radius: 3px;
  margin-bottom: 8px;
  overflow: hidden;
}
.completion-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #EA580C, #C2410C);
  border-radius: 3px;
  width: 65%;
}
.completion-percent {
  font-size: 13px;
  font-weight: 700;
  color: #C2410C;
}
.completion-tip {
  font-size: 12px;
  color: #92400E;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(180,83,9,0.15);
  display: flex;
  align-items: center;
  gap: 6px;
}

        `}
      </style>

      {/* WELCOME BANNER (DOORSTEP DESIGN SYSTEM) */}
      <section className="worker-welcome-panel p-6 sm:p-8 md:p-12" aria-label="Welcome Banner">
        {/* Subtle Background Decorations: Desktop Only */}
        {/* 5% black dotted pattern in top-left corner */}
        <div 
          className="hidden md:block absolute top-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] bg-[size:16px_16px] pointer-events-none opacity-60" 
          aria-hidden="true"
        />
        {/* Blurred orange radial glow behind controls (desktop) */}
        <div 
          className="hidden md:block absolute top-1/2 right-[5%] -translate-y-1/2 w-80 md:w-96 h-80 md:h-96 bg-[#FF7A00]/10 rounded-full blur-[80px] pointer-events-none" 
          aria-hidden="true"
        />
        {/* Mobile subtle orange glow in top-right corner */}
        <div 
          className="md:hidden absolute -top-8 -right-8 w-44 h-44 rounded-full bg-[#FF7A00]/[0.08] blur-[40px] pointer-events-none"
          aria-hidden="true"
        />

        {/* ========================================================= */}
        {/* MOBILE ONLY LAYOUT (< 768px): Compact 160-205px Banner    */}
        {/* ========================================================= */}
        <div className="md:hidden relative z-10 flex flex-col">
          {/* TOP ROW: IDENTITY */}
          <div className="flex items-center gap-3">
            {/* 52px Avatar with 2px orange gradient ring & 2px white gap (Tappable to /worker/profile) */}
            <button
              type="button"
              onClick={() => navigate('/worker/profile')}
              aria-label="View My Profile"
              className="relative w-[52px] h-[52px] rounded-full p-[2px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] shrink-0 text-left focus:outline-none mobile-banner-focus cursor-pointer"
            >
              <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={properFullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-bold text-[18px] flex items-center justify-center">
                    {initials}
                  </div>
                )}
              </div>
              {/* 14px status dot at bottom-right with 2px white border */}
              <span
                className={`absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full border-2 border-white transition-colors ${
                  isAvailable ? 'bg-[#2E9E5B]' : 'bg-[#9A9A9A]'
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Middle: Greeting & Name (Truncated) */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-[#6B6B6B] font-inter text-[13px] leading-tight truncate">
                {timeGreeting}
              </p>
              <h1 className="font-poppins font-bold text-[22px] text-[#000000] leading-snug truncate">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">
                  {firstName}
                </span>
                {lastName ? ` ${lastName}!` : '!'}
              </h1>
            </div>
          </div>

          {/* CHIPS ROW: Single line horizontal scroll with fade */}
          <div className="relative mt-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pr-6">
              <div className="inline-flex items-center gap-1.5 bg-white border border-[#E8E2DB] rounded-full px-3 py-1.5 text-[#000000] text-[13px] font-medium whitespace-nowrap shrink-0">
                <Wrench size={16} className="text-[#FF7A00]" />
                <span>{specialistRole}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white border border-[#E8E2DB] rounded-full px-3 py-1.5 text-[#000000] text-[13px] font-medium whitespace-nowrap shrink-0">
                <MapPin size={16} className="text-[#FF7A00]" />
                <span>{district}</span>
              </div>
            </div>
            {/* 24px subtle right-edge fade indicator */}
            <div 
              className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-[#FFF8F1] to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* AVAILABILITY ROW: 52px slim white bar */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleToggleAvailability}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleAvailability();
              }
            }}
            aria-checked={isAvailable}
            aria-label={`Availability toggle: Currently ${isAvailable ? 'Online' : 'Offline'}`}
            className="w-full h-[52px] bg-white rounded-[14px] border border-[#E8E2DB] shadow-[0_6px_16px_rgba(0,0,0,0.04)] px-[14px] mt-3 flex items-center justify-between cursor-pointer focus:outline-none mobile-banner-focus select-none transition-colors"
          >
            {/* Left: Green/Gray dot + Two short un-truncated lines */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                  isAvailable ? 'bg-[#2E9E5B]' : 'bg-[#9A9A9A]'
                }`}
                aria-hidden="true"
              />
              <div className="flex flex-col text-left leading-none">
                <span className="font-poppins font-semibold text-[14px] text-[#000000] leading-tight">
                  {isAvailable ? 'Online' : 'Offline'}
                </span>
                <span className="text-[#6B6B6B] text-[12px] leading-tight mt-0.5">
                  {isAvailable ? 'Visible to customers' : 'Hidden from customers'}
                </span>
              </div>
            </div>

            {/* Right: 52px by 30px toggle switch */}
            <div
              className={`relative w-[52px] h-[30px] rounded-full p-[2px] transition-colors shrink-0 ${
                isAvailable ? 'bg-[#000000]' : 'bg-[#E8E2DB]'
              }`}
            >
              <span
                className={`w-[26px] h-[26px] rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-200 ease-out ${
                  isAvailable ? 'translate-x-[22px]' : 'translate-x-0'
                }`}
              >
                {isAvailable && <span className="w-2 h-2 rounded-full bg-[#2E9E5B]" />}
              </span>
            </div>
          </div>

          {/* LIVE COUNTS (new requests & today's earnings - stacked number & label) */}
          {hasLiveCounts && (
            <div className="flex items-center justify-around mt-3 pt-2.5 border-t border-[#E8E2DB]/70 text-[#000000]">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('incoming-requests');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 flex flex-col items-center justify-center text-center hover:opacity-80 transition-opacity focus:outline-none mobile-banner-focus rounded-lg py-0.5"
              >
                <div className="flex items-center gap-1 font-poppins font-bold text-[16px] text-[#000000] leading-tight">
                  <Zap size={14} className="text-[#FF7A00]" fill="#FF7A00" />
                  <span>{newRequestsCount}</span>
                </div>
                <span className="font-inter text-[11px] font-medium text-[#6B6B6B] leading-tight mt-0.5">
                  New Requests
                </span>
              </button>

              <span className="w-px h-7 bg-[#E8E2DB]" aria-hidden="true" />

              <button
                type="button"
                onClick={() => navigate('/worker/earnings')}
                className="flex-1 flex flex-col items-center justify-center text-center hover:opacity-80 transition-opacity focus:outline-none mobile-banner-focus rounded-lg py-0.5"
              >
                <div className="flex items-center gap-1 font-poppins font-bold text-[16px] text-[#000000] leading-tight">
                  <TrendingUp size={14} className="text-[#2E9E5B]" />
                  <span>Rs. {todayEarningsVal.toFixed(2)}</span>
                </div>
                <span className="font-inter text-[11px] font-medium text-[#6B6B6B] leading-tight mt-0.5">
                  Today's Earnings
                </span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* DESKTOP LAYOUT (>= 768px): Kept EXACTLY As-Is             */}
        {/* ========================================================= */}
        <div className="hidden md:flex relative z-10 flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* LEFT: IDENTITY */}
          <div className="flex flex-col text-left max-w-2xl">
            {/* Small label above heading */}
            <p className="text-[#6B6B6B] font-inter text-[15px] mb-1">
              Welcome back to DoorStep PRO,
            </p>

            {/* Heading with orange gradient on first name and underline */}
            <h1 
              className="text-[30px] sm:text-[40px] lg:text-[46px] font-poppins font-bold text-[#000000] leading-[1.15] mb-2"
              style={{ textWrap: 'balance' }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">
                {firstName}
              </span>
              {lastName ? ` ${lastName}!` : '!'}
              <div className="w-28 sm:w-36 h-1.5 rounded-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] mt-2 mb-2" />
              <span className="block text-[#000000] text-[22px] sm:text-[30px] lg:text-[34px] font-bold">
                Ready for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">
                  today's jobs
                </span>
                ?
              </span>
            </h1>

            {/* Chips row */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="inline-flex items-center gap-2 bg-white border border-[#E8E2DB] rounded-full px-3.5 py-2 text-[#000000] text-[14px] font-medium hover:border-[#FF7A00] hover:bg-[#FFF1E3] hover:text-[#E86100] transition-colors duration-200">
                <Wrench size={15} className="text-[#E86100]" />
                <span>{specialistRole}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white border border-[#E8E2DB] rounded-full px-3.5 py-2 text-[#000000] text-[14px] font-medium hover:border-[#FF7A00] hover:bg-[#FFF1E3] hover:text-[#E86100] transition-colors duration-200">
                <MapPin size={15} className="text-[#E86100]" />
                <span>{district}</span>
              </div>
              {approvalStatus === 'approved' && (
                <div className="inline-flex items-center gap-1.5 bg-[#2E9E5B]/10 border border-[#2E9E5B]/30 rounded-full px-3.5 py-2 text-[#1F7A44] text-[14px] font-semibold">
                  <ShieldCheck size={16} className="text-[#2E9E5B]" />
                  <span>Verified</span>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: CONTROLS (Availability Bar & Worker ID) */}
          <div className="w-full lg:w-auto lg:min-w-[360px] lg:max-w-[420px] flex flex-col items-start lg:items-end gap-3 shrink-0">
            {/* Availability Bar */}
            <div className="w-full min-h-[60px] bg-white rounded-[16px] border border-[#E8E2DB] shadow-[0_10px_30px_rgba(0,0,0,0.06)] px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span 
                  className={`w-3 h-3 rounded-full shrink-0 transition-colors ${
                    isAvailable ? 'bg-[#2E9E5B] shadow-[0_0_0_4px_rgba(46,158,91,0.2)]' : 'bg-[#9A9A9A]'
                  }`} 
                />
                <span className="font-inter text-[14px] sm:text-[15px] text-[#000000] font-medium truncate">
                  {isAvailable ? "You're online and visible to customers" : "You're offline, customers can't book you"}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                tabIndex={0}
                aria-checked={isAvailable}
                onClick={handleToggleAvailability}
                disabled={isTogglingAvailability}
                title={isAvailable ? "Click to go offline" : "Click to go online"}
                className={`relative w-[56px] h-[32px] rounded-full p-1 transition-colors shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 ${
                  isAvailable ? 'bg-[#000000]' : 'bg-[#E8E2DB]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-200 ease-out ${
                    isAvailable ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {isAvailable && <span className="w-2 h-2 rounded-full bg-[#2E9E5B]" />}
                </span>
              </button>
            </div>

            {/* Worker ID Caption */}
            <div className="flex items-center gap-2 text-[13px] font-inter text-[#6B6B6B]">
              <svg className="w-4 h-4 text-[#2E9E5B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span className="font-medium text-[#3D3D3D]">Worker ID #{workerId}</span>
              <button
                type="button"
                onClick={handleCopyId}
                aria-label="Copy worker ID"
                className="p-1 rounded-md text-[#6B6B6B] hover:text-[#000000] hover:bg-[#E8E2DB]/50 relative transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                title="Copy Worker ID"
              >
                {copiedId ? <Check size={14} className="text-[#2E9E5B]" /> : <Copy size={13} />}
                {copiedId && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#000000] text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-md pointer-events-none">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* DESKTOP & TABLET STATS CARDS ROW (hidden on < 768px)       */}
      {/* ========================================================= */}
      {loading ? (
        <div className="hidden md:grid stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card" style={{ cursor: 'default' }}>
              <div className="stat-header">
                <div className="w-[48px] h-[48px] rounded-[14px] stat-skeleton-shimmer" />
                <div className="w-[32px] h-[32px] rounded-full stat-skeleton-shimmer" />
              </div>
              <div className="w-24 h-3.5 rounded stat-skeleton-shimmer mb-3" />
              <div className="w-32 h-8 rounded stat-skeleton-shimmer mb-3" />
              <div className="w-40 h-4 rounded stat-skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="hidden md:grid stats-grid">
          {/* Card 1: Monthly Earnings */}
          <div 
            role="button"
            tabIndex={0}
            onClick={() => navigate('/worker/earnings')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/worker/earnings'); } }}
            className="stat-card stat-card-anim-1"
            aria-label={`Monthly Earnings: Rs. ${monthNetEarnings.toFixed(2)}`}
          >
            <div>
              <div className="stat-header">
                <div className="stat-icon-box">
                  <div className="stat-icon-svg">
                    <TrendUp size={24} weight="duotone" className="stat-duotone-icon" />
                  </div>
                </div>
                <div className="stat-arrow-ghost">
                  <CaretRight size={18} className="stat-arrow-icon" weight="bold" />
                </div>
              </div>
              <div className="stat-label">Monthly Earnings</div>
              <div className="stat-value">
                <span className="stat-currency">Rs.</span>{' '}
                {monthNetEarnings > 0 ? (
                  <CountUp end={monthNetEarnings} decimals={2} />
                ) : (
                  '0.00'
                )}
              </div>
            </div>
            <div className="stat-sub">
              <TrendUp size={14} className="stat-sub-icon" weight="regular" />
              <span>{monthNetEarnings > 0 ? 'Net earnings this month' : 'No earnings yet this month'}</span>
            </div>
          </div>

          {/* Card 2: Jobs Completed */}
          <div 
            role="button"
            tabIndex={0}
            onClick={() => navigate('/worker/activities')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/worker/activities'); } }}
            className="stat-card stat-card-anim-2"
            aria-label={`Jobs Completed: ${jobsCompleted}`}
          >
            <div>
              <div className="stat-header">
                <div className="stat-icon-box">
                  <div className="stat-icon-svg">
                    <PhCheckCircle size={24} weight="duotone" className="stat-duotone-icon" />
                  </div>
                </div>
                <div className="stat-arrow-ghost">
                  <CaretRight size={18} className="stat-arrow-icon" weight="bold" />
                </div>
              </div>
              <div className="stat-label">Jobs Completed</div>
              <div className="stat-value">
                {jobsCompleted > 0 ? (
                  <CountUp end={jobsCompleted} decimals={0} />
                ) : (
                  '0'
                )}
              </div>
            </div>
            <div className="stat-sub">
              <PhCheckCircle size={14} className="stat-sub-icon" weight="regular" />
              <span>{jobsCompleted > 0 ? 'Total completed jobs' : 'Complete your first job'}</span>
            </div>
          </div>

          {/* Card 3: Average Rating */}
          <div 
            role="button"
            tabIndex={0}
            onClick={() => navigate('/worker/settings')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/worker/settings'); } }}
            className="stat-card stat-card-anim-3"
            aria-label={`Average Rating: ${avgRating.toFixed(1)} / 5`}
          >
            <div>
              <div className="stat-header">
                <div className="stat-icon-box">
                  <div className="stat-icon-svg">
                    <PhStar size={24} weight="duotone" className="stat-duotone-icon" />
                  </div>
                </div>
                <div className="stat-arrow-ghost">
                  <CaretRight size={18} className="stat-arrow-icon" weight="bold" />
                </div>
              </div>
              <div className="stat-label">Average Rating</div>
              <div className="stat-value">
                {avgRating > 0 ? (
                  <CountUp end={avgRating} decimals={1} />
                ) : (
                  '0.0'
                )}{' '}
                <span className="stat-currency text-xl font-normal text-[#6B6B6B]">/ 5</span>
              </div>
            </div>
            <div className="stat-sub">
              <PhStar size={14} className="stat-sub-icon" weight="regular" />
              <span>
                {totalReviews > 0
                  ? `Based on ${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}`
                  : 'Rated after your first job'}
              </span>
            </div>
          </div>

          {/* Card 4: Wallet Balance */}
          <div 
            role="button"
            tabIndex={0}
            onClick={() => navigate('/worker/earnings')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/worker/earnings'); } }}
            className="stat-card stat-card-anim-4"
            aria-label={`Wallet Balance: Rs. ${walletBalance.toFixed(2)}`}
          >
            <div>
              <div className="stat-header">
                <div className="stat-icon-box">
                  <div className="stat-icon-svg">
                    <PhWallet size={24} weight="duotone" className="stat-duotone-icon" />
                  </div>
                </div>
                <div className="stat-arrow-ghost">
                  <CaretRight size={18} className="stat-arrow-icon" weight="bold" />
                </div>
              </div>
              <div className="stat-label">Wallet Balance</div>
              <div className="stat-value">
                <span className="stat-currency">Rs.</span>{' '}
                {walletBalance > 0 ? (
                  <CountUp end={walletBalance} decimals={2} />
                ) : (
                  '0.00'
                )}
              </div>
            </div>
            <div>
              <div className="stat-sub">
                <PhCheckCircle size={14} className="stat-sub-icon" weight="regular" />
                <span>Available to withdraw</span>
              </div>
              {walletBalance > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/worker/earnings');
                  }}
                  className="stat-pay-btn"
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT SECTIONS */}
      <div className="dashboard-grid">
        {/* INCOMING JOB REQUESTS */}
        <div id="incoming-requests" className="section-card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><Inbox size={16} /></div>
              Incoming Job Requests
              <span className="section-count-badge">0</span>
            </div>
            <Link to="/worker/requests" className="view-all-link">
              View All <span>&rarr;</span>
            </Link>
          </div>
          <div className="p-4 sm:p-5">
            <JobRequests />
          </div>
        </div>

        {/* TODAY'S SCHEDULE */}
        <div className="schedule-section">
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><Calendar size={16} /></div>
              Today's Schedule
            </div>
          </div>
          <div className="schedule-empty">
            <div className="schedule-empty-icon">📅</div>
            <div className="schedule-empty-text">No jobs scheduled for today.<br/>Turn on availability to get new requests.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
