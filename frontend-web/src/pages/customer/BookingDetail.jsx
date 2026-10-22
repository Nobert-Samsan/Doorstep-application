import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, Copy, Check, MapPin, Calendar, MessageSquare, Phone, Info, Lock, Zap, ShieldCheck, Tag, Wrench, Navigation, ArrowRight, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { io } from 'socket.io-client';

const customStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseRing {
    0% { transform: scale(0.9); opacity: 0.7; }
    50% { transform: scale(1.4); opacity: 0; }
    100% { transform: scale(1.4); opacity: 0; }
  }
  @keyframes lineFill {
    from { height: 0; }
    to { height: 100%; }
  }

  /* ── Mobile Job Summary Card (max-width 767px) ── */
  @media (max-width: 767px) {
    .job-summary-mobile {
      background: #ffffff;
      border-radius: 24px;
      border: 1px solid #E8E2DB;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      padding: 20px;
      overflow: hidden;
      position: relative;
      width: 100%;
      animation: fadeUp 0.2s ease-out forwards;
    }
    .job-summary-mobile::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: #D97706;
      border-radius: 24px 24px 0 0;
    }
    .jsm-icon-box {
      width: 44px; height: 44px;
      border-radius: 14px;
      background: #D97706;
      display: flex; align-items: center; justify-content: center;
      color: #ffffff;
      box-shadow: 0 6px 16px rgba(217,119,6,0.25);
      flex-shrink: 0;
    }
    .jsm-header {
      display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px;
    }
    .jsm-header-left {
      display: flex; align-items: center; gap: 12px; min-width: 0;
    }
    .jsm-title {
      font-family: "Poppins", sans-serif;
      font-weight: 700;
      font-size: 20px;
      color: #000000;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .jsm-track-btn-top {
      display: inline-flex; align-items: center; justify-content: center; gap: 5px;
      height: 36px; min-height: 36px;
      padding: 0 14px;
      background: #000000;
      color: #ffffff;
      font-family: "Poppins", sans-serif; font-weight: 600; font-size: 13px;
      border: none; border-radius: 10px;
      cursor: pointer;
      flex-shrink: 0;
      text-decoration: none;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .jsm-track-btn-top:active {
      transform: scale(0.96);
    }
    .jsm-track-btn-top.disabled {
      background: #E8E2DB; color: #6B6B6B; cursor: default;
    }
    .jsm-details {
      display: flex; flex-direction: column; margin-bottom: 16px;
    }
    .jsm-detail-row {
      display: flex; align-items: flex-start; gap: 14px;
      padding: 14px 0;
    }
    .jsm-detail-row + .jsm-detail-row {
      border-top: 1px solid #E8E2DB;
    }
    .jsm-detail-icon {
      width: 40px; height: 40px; min-width: 40px;
      border-radius: 12px;
      background: #FFF8F1;
      border: 1px solid #E8E2DB;
      display: flex; align-items: center; justify-content: center;
      color: #E86100;
    }
    .jsm-detail-label {
      font-family: "Poppins", sans-serif;
      font-weight: 600;
      font-size: 11px;
      color: #6B6B6B;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }
    .jsm-detail-value {
      font-family: "Poppins", sans-serif;
      font-weight: 600;
      font-size: 16px;
      color: #000000;
      line-height: 1.35;
    }
    .jsm-date-row {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    }
    .jsm-tag-asap {
      display: inline-flex; align-items: center; gap: 4px;
      background: #FDECEC; color: #B42318;
      font-family: "Poppins", sans-serif; font-weight: 600; font-size: 12px;
      padding: 4px 10px; border-radius: 999px;
    }
    .jsm-tag-neutral {
      display: inline-flex; align-items: center; gap: 4px;
      background: #F3EFEA; color: #3D3D3D;
      font-family: "Poppins", sans-serif; font-weight: 600; font-size: 12px;
      padding: 4px 10px; border-radius: 999px;
    }
    .jsm-notes {
      background: #FFF8F1;
      border: 1px solid #E8E2DB;
      border-radius: 14px;
      padding: 12px 14px;
      display: flex; align-items: flex-start; gap: 10px;
      margin-bottom: 16px;
    }
    .jsm-notes-icon { color: #6B6B6B; flex-shrink: 0; margin-top: 1px; }
    .jsm-notes-text {
      font-style: italic;
      font-size: 14px;
      color: #6B6B6B;
      line-height: 1.6;
      margin: 0;
    }
    .jsm-notes-text.has-notes {
      font-style: normal; color: #3D3D3D;
      display: -webkit-box; -webkit-line-clamp: 3;
      -webkit-box-orient: vertical; overflow: hidden;
    }
    .jsm-track-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; height: 52px; min-height: 44px;
      background: linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%);
      color: #ffffff;
      font-family: "Poppins", sans-serif; font-weight: 600; font-size: 16px;
      border: none; border-radius: 12px;
      box-shadow: 0 8px 22px rgba(255,122,0,0.30);
      cursor: pointer;
      transition: box-shadow 0.18s ease, transform 0.15s ease;
      text-decoration: none;
    }
    .jsm-track-btn:active {
      transform: scale(0.98);
      box-shadow: 0 4px 10px rgba(255,122,0,0.25);
    }
    .jsm-track-btn:focus-visible {
      outline: 2px solid #FF7A00; outline-offset: 2px;
      box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px #FF7A00;
    }
    .jsm-track-btn.disabled {
      background: #E8E2DB; color: #6B6B6B; box-shadow: none; cursor: default;
    }
    .jsm-arrow { transition: transform 0.18s ease; display: flex; }
    .jsm-track-btn:hover .jsm-arrow { transform: translateX(4px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .job-summary-mobile { animation: none !important; opacity: 1 !important; }
  }
`;

const ROLE_MAP = {
  'Plumbing': 'Plumber',
  'plumbing': 'Plumber',
  'Plumber': 'Plumber',
  'plumber': 'Plumber',
  'Electrical': 'Electrician',
  'electrical': 'Electrician',
  'Electrician': 'Electrician',
  'electrician': 'Electrician',
  'Carpentry': 'Carpenter',
  'carpentry': 'Carpenter',
  'Carpenter': 'Carpenter',
  'carpenter': 'Carpenter',
  'Cleaning': 'Cleaner',
  'cleaning': 'Cleaner',
  'Cleaner': 'Cleaner',
  'cleaner': 'Cleaner',
  'Painting': 'Painter',
  'painting': 'Painter',
  'Painter': 'Painter',
  'painter': 'Painter',
  'AC Repair': 'AC Technician',
  'ac repair': 'AC Technician',
  'Masonry': 'Mason',
  'masonry': 'Mason',
  'Mason': 'Mason',
  'mason': 'Mason',
  'Appliance Repair': 'Appliance Tech',
  'Pest Control': 'Pest Controller',
  'Roofing': 'Roofer',
  'Landscaping': 'Landscaper',
  'Welding': 'Welder',
  'Tiling': 'Tiler',
  'CCTV & Security': 'CCTV Technician',
  'Solar Installation': 'Solar Tech',
  'Moving & Packing': 'Mover',
  'Mechanic': 'Mechanic',
  'Glass & Aluminum': 'Glass Specialist',
  'Interior Design': 'Interior Designer',
  'Locksmith': 'Locksmith',
  'Event Helper': 'Event Helper',
  'Handyman': 'Handyman'
};

const getJobRole = (title, fallback) => {
  const tryResolve = (str) => {
    if (!str) return null;
    const clean = str.replace(/\s*\(custom request\)/i, '').replace(/\s*\(custom service\)/i, '').trim();
    if (ROLE_MAP[clean]) return ROLE_MAP[clean];
    const lower = clean.toLowerCase();
    for (const [k, v] of Object.entries(ROLE_MAP)) {
      if (k.toLowerCase() === lower) return v;
    }
    if (clean && !['other', 'general'].includes(lower)) {
      return clean;
    }
    return null;
  };

  return tryResolve(title) || tryResolve(fallback) || 'Service';
};

const formatScheduleDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTimelineDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${day} ${month} ${year}, ${time}`;
};

const getStatusMessage = (status) => {
  switch(status) {
    case 'pending': return "Your booking request has been received and is awaiting a worker.";
    case 'accepted': return "A worker has accepted your booking and is preparing for the job.";
    case 'en_route': return "Your worker is on their way to your location.";
    case 'arrived': return "Your worker has arrived at your location.";
    case 'quote_provided': return "Your worker has provided a quote for your approval.";
    case 'in_progress': return "Your worker is currently working on your job.";
    case 'completed': return "This job has been successfully completed.";
    case 'cancelled': return "This booking has been cancelled.";
    case 'complaint': return "A complaint has been registered for this booking.";
    default: return "Your booking is currently active.";
  }
};

const Card = ({ children, className = '', index = 0 }) => (
  <div 
    className={`relative bg-white rounded-[24px] border border-[#E8E2DB] p-7 shadow-[0_12px_32px_rgba(0,0,0,0.06)] ${className}`}
    style={{ 
      animation: 'fadeUp 0.3s ease-out forwards',
      opacity: 0,
      animationDelay: `${index * 100}ms`
    }}
  >
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  if (status === 'in_progress') {
    return (
      <div className="flex items-center gap-2 bg-[#FFF1E3] border border-orange-500/35 rounded-full px-3.5 py-2 text-[#B84700] uppercase font-semibold text-[12px] tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="relative w-2 h-2">
          <div className="absolute inset-0 bg-[#FF7A00] rounded-full animate-ping opacity-75"></div>
          <div className="relative w-2 h-2 bg-[#FF7A00] rounded-full"></div>
        </div>
        In Progress
      </div>
    );
  }
  if (status === 'accepted') {
    return (
      <div className="flex items-center gap-2 bg-[#E9F5ED] rounded-full px-3.5 py-2 text-[#1F7A44] uppercase font-semibold text-[12px] tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="w-2 h-2 bg-[#2E9E5B] rounded-full"></div>
        Confirmed
      </div>
    );
  }
  if (status === 'completed') {
    return (
      <div className="flex items-center gap-2 bg-[#2E9E5B] rounded-full px-3.5 py-2 text-white uppercase font-semibold text-[12px] tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <Check size={14} strokeWidth={3} />
        Completed
      </div>
    );
  }
  if (status === 'cancelled') {
    return (
      <div className="bg-[#FDECEC] rounded-full px-3.5 py-2 text-[#B42318] uppercase font-semibold text-[12px] tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Cancelled
      </div>
    );
  }
  return (
    <div className="bg-[#F3EFEA] rounded-full px-3.5 py-2 text-[#3D3D3D] uppercase font-semibold text-[12px] tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {status.replace('_', ' ')}
    </div>
  );
};

const HeaderCard = ({ booking, handleCancel, index }) => (
  <Card index={index} className="!p-0 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#D97706]" />
    <div className="p-7 flex flex-col gap-4">
      {(!booking.workerId || typeof booking.workerId === 'string') && (
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="text-[#6B6B6B] uppercase text-[12px] tracking-[0.12em] font-semibold mb-1">
              Booking
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-black font-bold text-[30px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                #{booking._id.substring(booking._id.length - 6).toUpperCase()}
              </h2>
            </div>
          </div>
          <div>
            <StatusBadge status={booking.status} />
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-between items-end gap-4 mt-1">
        <p className="text-[#3D3D3D] text-[16px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {getStatusMessage(booking.status)}
        </p>
        {['pending', 'accepted', 'en_route', 'arrived', 'quote_provided'].includes(booking.status) && (
          <button 
            onClick={handleCancel}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-xl font-semibold shadow-sm transition-all text-[13px] whitespace-nowrap focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  </Card>
);

const JobDetailsCard = ({ booking, index }) => {
  const timeSlot = booking.scheduledTimeSlot || "";
  const isEmergency = timeSlot.toLowerCase().includes("asap") || timeSlot.toLowerCase().includes("emergency");
  const jobRole = (() => {
    const r = getJobRole(booking.serviceTitle, booking.workerSkill || booking.categoryId?.nameEn);
    if (!r || ["other","general","service"].includes(r.toLowerCase())) return "General Service";
    return r;
  })();
  const hasNotes = booking.jobDescription && booking.jobDescription.trim().length > 0;
  const location = [booking.streetAddress, booking.city].filter(Boolean).join(", ");

  return (
    <>
      {/* ── MOBILE view (< 768px) ── */}
      <div className="job-summary-mobile md:hidden">
        {/* Header with Title on Left and Track Job Button on Right */}
        <div className="jsm-header">
          <div className="jsm-header-left">
            <div className="jsm-icon-box">
              <Wrench size={22} strokeWidth={2} />
            </div>
            <span className="jsm-title">{jobRole}</span>
          </div>
          <a
            href={`/customer/bookings/${booking._id}`}
            className={`jsm-track-btn-top${!booking._id ? " disabled" : ""}`}
            onClick={e => { if (!booking._id) e.preventDefault(); }}
            aria-label="Track Job"
          >
            Track Job
          </a>
        </div>

        {/* Detail rows */}
        <div className="jsm-details">
          <div className="jsm-detail-row">
            <div className="jsm-detail-icon"><Calendar size={18} strokeWidth={2} /></div>
            <div>
              <div className="jsm-detail-label">Schedule</div>
              <div className="jsm-date-row jsm-detail-value">
                <span>{formatScheduleDate(booking.scheduledDate)}</span>
                {isEmergency ? (
                  <span className="jsm-tag-asap">
                    <Zap size={11} fill="currentColor" /> ASAP
                  </span>
                ) : timeSlot ? (
                  <span className="jsm-tag-neutral">{timeSlot}</span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="jsm-detail-row">
            <div className="jsm-detail-icon"><MapPin size={18} strokeWidth={2} /></div>
            <div>
              <div className="jsm-detail-label">Location</div>
              <div className="jsm-detail-value">{location || "-"}</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="jsm-notes" style={{ marginBottom: 0 }}>
          <FileText size={15} className="jsm-notes-icon" />
          <p className={`jsm-notes-text${hasNotes ? " has-notes" : ""}`}>
            {hasNotes ? booking.jobDescription : "No additional notes provided"}
          </p>
        </div>
      </div>
      {/* ── TABLET / DESKTOP view (>= 768px) — unchanged ── */}
      <Card index={index} className="hidden md:block">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] bg-[#D97706] flex items-center justify-center text-white shadow-md shadow-[#D97706]/20 shrink-0">
              <Wrench size={24} />
            </div>
            <div>
              <h3 className="text-black font-semibold text-[22px] capitalize" style={{ fontFamily: "Poppins, sans-serif" }}>
                {getJobRole(booking.serviceTitle, booking.workerSkill || booking.categoryId?.nameEn)}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-amber-50 flex items-center justify-center text-[#D97706] shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-[#6B6B6B] uppercase text-[12px] tracking-[0.1em] font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Schedule</div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-black font-semibold text-[17px]" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {formatScheduleDate(booking.scheduledDate)}
                  </span>
                  {isEmergency ? (
                    <span className="flex items-center gap-1 bg-[#FDECEC] text-[#B42318] px-2 py-0.5 rounded-full text-[12px] font-semibold">
                      <Zap size={12} fill="currentColor" /> ASAP
                    </span>
                  ) : (
                    <span className="bg-[#F3EFEA] text-[#3D3D3D] px-2 py-0.5 rounded-full text-[12px] font-semibold">
                      {timeSlot}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-amber-50 flex items-center justify-center text-[#D97706] shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-[#6B6B6B] uppercase text-[12px] tracking-[0.1em] font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Location</div>
                <p className="text-black font-semibold text-[17px]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {location || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F9FA] rounded-[16px] border border-[#E8E2DB] py-4 px-5 text-[#6B6B6B] italic text-[14px] flex gap-3 items-start">
            <Tag size={16} className="mt-0.5 shrink-0 text-[#D97706]" />
            <p>{booking.jobDescription || "No additional notes provided"}</p>
          </div>
        </div>
      </Card>
    </>
  );
};

const WorkerCard = ({ booking, navigate, handleCancel, index }) => {
  if (!booking.workerId || typeof booking.workerId === 'string') return null;

  return (
    <Card index={index}>
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="text-[#6B6B6B] uppercase text-[12px] tracking-[0.1em] font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Assigned Worker
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {booking.workerId.profilePhoto ? (
              <img 
                src={booking.workerId.profilePhoto} 
                alt="Worker Profile" 
                className="w-[56px] h-[56px] rounded-full object-cover p-[2px] bg-[#D97706]" 
              />
            ) : (
              <div className="w-[56px] h-[56px] bg-gray-100 rounded-full flex items-center justify-center font-bold text-xl text-gray-500 p-[2px] bg-[#D97706]">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  {booking.workerId.firstName?.[0]}{booking.workerId.lastName?.[0]}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-black font-semibold text-[18px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {booking.workerId.firstName} {booking.workerId.lastName}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-black text-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  #{booking._id.substring(booking._id.length - 6).toUpperCase()}
                </span>
              </div>
              {booking.workerId.averageRating > 0 && (
                <div className="flex items-center gap-1 text-[#D97706] font-semibold text-[13px]">
                  <Star size={14} fill="currentColor" />
                  {booking.workerId.averageRating.toFixed(1)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => navigate('/customer/messages')}
            className="order-1 flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-[#D97706] text-white font-semibold text-[15px] shadow-md shadow-[#D97706]/30 hover:bg-[#B45309] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D97706]/40 transition-all focus:ring-2 focus:ring-[#D97706] focus:ring-offset-2"
          >
            <MessageSquare size={18} /> Message
          </button>
          <button 
            className="order-2 flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-white border border-[#D97706] text-[#D97706] font-semibold text-[15px] hover:bg-amber-50 transition-colors focus:ring-2 focus:ring-amber-300"
          >
            <Phone size={18} /> Call
          </button>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-[#E8E2DB] flex flex-wrap justify-between items-center gap-4">
        <p className="text-[#3D3D3D] text-[15px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {getStatusMessage(booking.status)}
        </p>
        {['pending', 'accepted', 'en_route', 'arrived', 'quote_provided'].includes(booking.status) && (
          <button 
            onClick={handleCancel}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-xl font-semibold shadow-sm transition-all text-[13px] whitespace-nowrap focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </Card>
  );
};

const TimelineCard = ({ timeline, index }) => {
  const doneCount = timeline.filter(s => s.done).length;
  const totalCount = timeline.length;
  
  return (
    <Card index={index}>
      <h3 className="text-black font-semibold text-[20px] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Booking Timeline
      </h3>
      <div className="flex items-center justify-between mb-6">
        <span className="text-[#6B6B6B] text-[13px]">{doneCount} of {totalCount} steps done</span>
      </div>
      <div className="w-full h-[6px] bg-[#E8E2DB] rounded-full mb-8 overflow-hidden relative">
        <div 
          className="absolute top-0 bottom-0 left-0 bg-[#D97706] transition-all duration-1000 ease-out" 
          style={{ width: `${(doneCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="flex flex-col relative">
        {timeline.map((step, idx) => {
          const isLast = idx === timeline.length - 1;
          const isDone = step.done;
          const isCurrent = isDone && (isLast || !timeline[idx+1].done);
          const isNextDone = !isLast && timeline[idx+1].done;

          return (
            <div key={idx} className="relative flex gap-5 pb-8 last:pb-0">
              {!isLast && (
                <div 
                  className={`absolute left-[13px] top-[28px] bottom-[-4px] w-[2px] ${
                    isNextDone ? 'bg-[#2E9E5B] origin-top animate-[lineFill_1s_ease-out_forwards]' : 'border-l-[2px] border-dashed border-[#D9D2C9]'
                  }`}
                />
              )}

              <div className="relative z-10 flex flex-col items-center shrink-0 mt-0.5">
                {isCurrent ? (
                  <div className="relative w-8 h-8 -ml-[2px]">
                    <div className="absolute inset-0 bg-[#D97706] rounded-full animate-[pulseRing_2s_infinite]"></div>
                    <div className="relative w-8 h-8 bg-[#D97706] rounded-full flex items-center justify-center border-[2px] border-white shadow-sm"></div>
                  </div>
                ) : isDone ? (
                  <div className="w-7 h-7 bg-[#2E9E5B] rounded-full flex items-center justify-center text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-[2px] border-[#D9D2C9] bg-white"></div>
                )}
              </div>

              <div className="pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`${
                    isCurrent ? 'text-black font-bold text-[16px]' : 
                    isDone ? 'text-black font-semibold text-[15px]' : 
                    'text-[#6B6B6B] text-[15px]'
                  }`} style={isCurrent ? { fontFamily: 'Poppins, sans-serif' } : {}}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="bg-amber-50 text-[#B45309] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      NOW
                    </span>
                  )}
                </div>
                {step.time && (
                  <p className="text-[#6B6B6B] text-[13px]">{formatTimelineDate(step.time)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const PaymentCard = ({ booking, index }) => {
  const isPaid = booking.paymentStatus === 'paid';
  
  return (
    <Card index={index}>
      <h3 className="text-black font-semibold text-[20px] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Payment Summary
      </h3>
      
      <div className="flex justify-between items-center pb-4 border-b border-[#E8E2DB]">
        <span className="text-[#6B6B6B] text-[15px]">Status</span>
        {isPaid ? (
          <span className="bg-[#E9F5ED] text-[#1F7A44] px-3 py-1 rounded-full text-[13px] font-semibold uppercase tracking-wider">
            Paid
          </span>
        ) : (
          <span className="bg-[#F3EFEA] text-[#3D3D3D] px-3 py-1 rounded-full text-[13px] font-semibold uppercase tracking-wider">
            {booking.paymentStatus.replace('_', ' ')}
          </span>
        )}
      </div>

      <div className="pt-4 pb-5 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <span className="text-[#6B6B6B] text-[15px] pt-1">Total</span>
          <div className="text-right flex flex-col items-end">
            {(booking.status === 'completed' && booking.finalAmount) || (booking.pricingType === 'fixed' && booking.fixedRate) ? (
              <span className="text-black font-bold text-[28px] leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Rs. {booking.finalAmount || booking.fixedRate}
              </span>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <span className="text-black font-semibold text-[18px] flex items-center gap-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <Info size={16} className="text-[#FF7A00]" /> Pending Inspection
                </span>
              </div>
            )}
          </div>
        </div>
        {(!booking.finalAmount && booking.pricingType !== 'fixed') && (
           <p className="text-[#6B6B6B] text-[13px] text-right mt-1">
             Your final price is confirmed after the worker inspects the job.
           </p>
        )}
      </div>

      <div className="pt-4 border-t border-[#E8E2DB] flex items-center justify-center gap-2">
        <Lock size={14} className="text-[#2E9E5B]" />
        <span className="text-[#6B6B6B] text-[13px]">Pay securely online or in cash</span>
      </div>
    </Card>
  );
};

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchBooking = async () => {
    try {
      const { data: bData } = await api.get(`/bookings/${id}`);
      setBooking(bData.data);
      
      try {
        const { data: qData } = await api.get(`/quotations/booking/${id}`);
        setQuotations(qData.data);
      } catch (err) {
        console.warn('Could not fetch quotations', err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.on('booking_status_update', (updatedBooking) => {
      if (updatedBooking._id === id) {
        fetchBooking();
      }
    });

    socket.on('new_quotation', (quotation) => {
      if (quotation.bookingId === id) {
        fetchBooking();
      }
    });

    return () => socket.disconnect();
  }, [id]);

  const handleAcceptQuote = async (quoteId) => {
    try {
      await api.put(`/quotations/${quoteId}/accept`);
      toast.success("Quotation Accepted! Please pay the worker in cash after completion.");
      fetchBooking();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept quotation");
    }
  };

  const handleDeclineQuote = async (quoteId) => {
    try {
      await api.put(`/quotations/${quoteId}/reject`);
      toast.info("Quotation Declined. Worker will be notified.");
      fetchBooking();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to decline quotation");
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) return toast.error("Please select a star rating");
    try {
      setIsSubmittingReview(true);
      await api.post('/reviews', {
        bookingId: booking._id,
        workerId: booking.workerId._id || booking.workerId,
        rating,
        comment: reviewComment
      });
      toast.success("Thank you for your review!");
      fetchBooking();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt("Why do you want to cancel this booking?");
    if (reason === null) return;
    
    try {
      await api.put(`/bookings/${booking._id}/cancel`, {
        reason: reason || 'No reason provided'
      });
      const { data } = await api.get(`/bookings/${id}`);
      setBooking(data.data);
    } catch (err) {
      console.error("Failed to cancel booking", err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center font-semibold text-[#6B6B6B]">Loading...</div>;
  }

  if (!booking) {
    return <div className="p-8 text-center font-semibold text-[#B42318]">Booking not found</div>;
  }

  const baseTimelineSteps = [
    { key: 'pending', label: 'Requested' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'en_route', label: 'Worker En Route' },
    { key: 'arrived', label: 'Worker Arrived' },
    { key: 'quote_provided', label: 'Quote Pending Approval' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
  ];

  const hasStarted = booking.statusHistory?.some(h => h.status === 'in_progress') || booking.status === 'in_progress';
  const timelineSteps = (quotations.length > 0 && !hasStarted)
    ? baseTimelineSteps 
    : baseTimelineSteps.filter(s => s.key !== 'quote_provided');

  const timeline = timelineSteps.map(step => {
    const historyItem = booking.statusHistory?.find(h => h.status === step.key);
    const currentIndex = timelineSteps.findIndex(s => s.key === booking.status);
    const stepIndex = timelineSteps.findIndex(s => s.key === step.key);
    
    let done = false;
    if (booking.status === 'cancelled' || booking.status === 'complaint') {
      done = !!historyItem;
    } else {
      done = stepIndex <= currentIndex || !!historyItem;
    }

    return {
      status: step.key,
      label: step.label,
      time: historyItem ? historyItem.timestamp : null,
      done
    };
  });

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 font-sans text-[#3D3D3D]">
      <style>{customStyles}</style>
      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-[64%_calc(36%-24px)] gap-6 items-start">
          
          {/* Left Column Container */}
          <div className="flex flex-col gap-6 order-1">
            
            {/* Active Quotations */}
            {quotations.map(quote => {
              const isFinalBill = booking.statusHistory?.some(h => h.status === 'in_progress') || booking.status === 'in_progress';
              return quote.status === 'pending' && (
                <Card key={quote._id} className="!bg-white !border-[#D97706]/30" index={0}>
                  <h3 className="text-[20px] font-bold text-black mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {isFinalBill ? "Final Bill Ready for Review" : "Worker Quotation Ready"}
                  </h3>
                  <p className="text-[#3D3D3D] mb-5 text-[15px]">
                    {isFinalBill 
                       ? "The worker has finished the job and provided the final bill. Please review and accept to complete the service." 
                      : "The worker has provided an itemized quotation for your job. Please review and accept to proceed."}
                  </p>
                  
                  <div className="bg-white rounded-[16px] border border-[#E8E2DB] p-5 mb-5 space-y-3">
                    {quote.lineItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[15px]">
                        <span className="text-[#6B6B6B]">{item.description}</span>
                        <span className="font-semibold text-black">Rs. {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#E8E2DB] mt-3 pt-4 flex justify-between font-bold text-[18px] text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <span>Total Estimated Amount</span>
                      <span>Rs. {quote.totalAmount.toLocaleString()}</span>
                    </div>
                    {quote.estimatedDuration && (
                      <div className="text-[14px] text-[#6B6B6B] mt-2">Estimated Duration: <span className="font-medium text-[#3D3D3D]">{quote.estimatedDuration}</span></div>
                    )}
                    {quote.noteToCustomer && (
                      <div className="text-[14px] text-[#6B6B6B] mt-1 italic">"{quote.noteToCustomer}"</div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => handleAcceptQuote(quote._id)} className="px-6 py-3 bg-[#2E9E5B] text-white font-semibold rounded-[12px] shadow-sm hover:bg-[#268a4e] transition-colors focus:ring-2 focus:ring-green-300">
                      {isFinalBill ? "Accept Final Bill" : "Accept Quotation"}
                    </button>
                    <button onClick={() => handleDeclineQuote(quote._id)} className="px-6 py-3 border border-[#B42318] text-[#B42318] font-semibold rounded-[12px] hover:bg-[#FDECEC] transition-colors focus:ring-2 focus:ring-red-300">
                      Decline
                    </button>
                  </div>
                </Card>
              );
            })}

            {/* Review Prompt */}
            {booking.status === 'completed' && !booking.reviewId && (
              <Card className="!bg-white" index={0}>
                <h3 className="text-[20px] font-bold text-black mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Job Completed! Rate Your Experience</h3>
                <p className="text-[#6B6B6B] mb-5 text-[14px]">Your feedback helps {booking.workerId?.firstName} get more jobs and helps other customers.</p>
                
                <div className="flex gap-2 mb-5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={36} 
                        fill={(hoverRating || rating) >= star ? "#D97706" : "transparent"} 
                        className={(hoverRating || rating) >= star ? "text-[#D97706]" : "text-[#D9D2C9]"} 
                      />
                    </button>
                  ))}
                </div>
                
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Leave a comment about the service (optional)..."
                  className="w-full border border-[#E8E2DB] rounded-[16px] p-4 text-[15px] mb-5 focus:ring-2 focus:ring-[#D97706] focus:border-transparent outline-none bg-white"
                  rows="3"
                ></textarea>
                
                <button 
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview || rating === 0}
                  className="px-8 py-3 bg-[#D97706] text-white font-semibold rounded-[12px] hover:bg-[#B45309] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 shadow-md shadow-[#D97706]/30 focus:ring-2 focus:ring-[#D97706]"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </Card>
            )}
            
            {booking.status === 'completed' && booking.reviewId && (
              <div className="bg-[#E9F5ED] border border-[#2E9E5B]/20 rounded-[24px] p-6 mb-2 flex items-center gap-4" style={{ animation: 'fadeUp 0.3s ease-out forwards' }}>
                <div className="w-12 h-12 bg-[#2E9E5B] rounded-full flex items-center justify-center text-white shrink-0">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F7A44] text-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Review Submitted</h4>
                  <p className="text-[#2E9E5B] text-[14px]">Thank you for rating {booking.workerId?.firstName}!</p>
                </div>
              </div>
            )}

            <WorkerCard booking={booking} navigate={navigate} handleCancel={handleCancel} index={1} />
            
            <div className="md:hidden">
              <TimelineCard timeline={timeline} index={2} />
            </div>

            <JobDetailsCard booking={booking} index={3} />

            <div className="md:hidden">
              <PaymentCard booking={booking} index={4} />
            </div>

            {(!booking.workerId || typeof booking.workerId === 'string') && (
              <HeaderCard booking={booking} handleCancel={handleCancel} index={5} />
            )}

            
          </div>

          {/* Right Column Container (Desktop Only) */}
          <div className="hidden md:flex flex-col gap-6 sticky top-8 order-2">
            <TimelineCard timeline={timeline} index={2} />
            <PaymentCard booking={booking} index={5} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingDetail;

