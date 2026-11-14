import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Star, 
  Copy, 
  Check, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Info, 
  Lock, 
  Zap, 
  ShieldCheck, 
  Tag, 
  Wrench, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Plus, 
  Trash2, 
  FileText, 
  Clock, 
  Briefcase 
} from 'lucide-react';

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
      border-radius: 14px;
      border: 1.5px solid #C8C1B7;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      padding: 20px;
      overflow: hidden;
      position: relative;
      width: 100%;
      animation: fadeUp 0.2s ease-out forwards;
    }
    .job-summary-mobile::before {
      display: none;
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
      font-weight: 600;
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
      font-weight: 400;
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
      border-radius: 8px;
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
    case 'pending': return "This is a new job request awaiting your response.";
    case 'accepted': return "You have accepted this booking. Please prepare and mark En Route when traveling.";
    case 'en_route': return "You are marked as en route to the customer's location.";
    case 'arrived': return "You have arrived at the location. Inspect the work and begin the job.";
    case 'quote_provided': return "Quotation has been sent to customer. Awaiting customer approval.";
    case 'in_progress': return "Job is currently in progress.";
    case 'completed': return "This job has been successfully completed.";
    case 'cancelled': return "This booking has been cancelled.";
    case 'complaint': return "A complaint has been registered for this booking.";
    default: return "This booking is currently active.";
  }
};

const Card = ({ children, className = '', index = 0 }) => (
  <div 
    className={`relative bg-white rounded-[14px] md:rounded-[16px] border border-[#C8C1B7] p-[18px] md:p-7 shadow-[0_4px_16px_rgba(0,0,0,0.06)] ${className}`}
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
      {status ? status.replace('_', ' ') : 'Pending'}
    </div>
  );
};

const CustomerCard = ({ job, navigate, updateStatus, setShowQuoteModal, index }) => {
  const customer = job.customerId;
  const cName = customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() : 'Customer';
  const cInitials = customer ? `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase() || 'C' : 'C';
  const refId = job._id ? job._id.substring(job._id.length - 6).toUpperCase() : '';

  return (
    <Card index={index}>
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-black font-semibold text-[20px]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Customer Details
          </h3>
          {refId && (
            <div className="text-[#6B6B6B] font-bold text-[14px] mt-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              ID: #{refId}
            </div>
          )}
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {customer?.profilePhoto ? (
              <img 
                src={customer.profilePhoto} 
                alt={cName} 
                className="w-[56px] h-[56px] rounded-full object-cover p-[2px] bg-[#D97706]" 
              />
            ) : (
              <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center font-bold text-xl text-gray-700 p-[2px] bg-[#D97706]">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-semibold text-[#D97706]">
                  {cInitials}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-black font-semibold text-[18px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {cName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#6B6B6B] text-[15px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {cName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => navigate('/worker/messages')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-[#FF7A00] text-white font-semibold text-[15px] shadow-md shadow-[#FF7A00]/25 hover:bg-[#E86100] hover:-translate-y-0.5 hover:shadow-lg transition-all focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2"
          >
            <MessageSquare size={18} /> Message
          </button>
          {customer?.phone ? (
            <a 
              href={`tel:${customer.phone}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-white border-2 border-[#FF7A00] text-[#FF7A00] font-semibold text-[15px] hover:bg-orange-50 transition-colors focus:ring-2 focus:ring-orange-300"
            >
              <Phone size={18} className="text-[#FF7A00]" /> Call
            </a>
          ) : (
            <button 
              disabled
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-white border-2 border-[#FF7A00] text-[#FF7A00] font-semibold text-[15px] hover:bg-orange-50 transition-colors"
              title="Call Customer"
            >
              <Phone size={18} className="text-[#FF7A00]" /> Call
            </button>
          )}
        </div>
      </div>

      {/* Action / Status Message Row */}
      <div className="mt-5 pt-5 border-t border-[#E8E2DB] flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <p className="text-[#3D3D3D] text-[15px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {getStatusMessage(job.status)}
        </p>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {job.paymentStatus === 'pending' && job.status === 'in_progress' && (
            <button 
              onClick={() => updateStatus('confirm-cash')} 
              className="flex-1 md:flex-none bg-[#2E9E5B] hover:bg-[#268a4e] text-white px-5 py-2.5 rounded-[12px] font-semibold text-[14px] shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Check size={16} /> Confirm Cash Received
            </button>
          )}

          {job.status === 'pending' && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => updateStatus('decline')} 
                className="flex-1 md:flex-none btn-decline"
              >
                Decline
              </button>
              <button 
                onClick={() => updateStatus('accept')} 
                className="flex-1 md:flex-none btn-accept"
              >
                Accept
              </button>
            </div>
          )}

          {['accepted', 'en_route', 'in_progress'].includes(job.status) && (
            <button 
              onClick={() => setShowQuoteModal(true)} 
              className="bg-white border border-[#D97706] text-[#D97706] hover:bg-amber-50 px-4 py-2.5 rounded-[12px] font-semibold text-[13px] flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FileText size={16} /> Send Quotation / Bill
            </button>
          )}

          {['accepted', 'en_route'].includes(job.status) && (
            <button 
              onClick={() => updateStatus('cancel')} 
              className="bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] px-4 py-2.5 rounded-[12px] font-semibold text-[13px] flex items-center gap-1.5 transition-all"
            >
              <X size={16} /> Cancel Job
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

const JobDetailsCard = ({ job, index }) => {
  const timeSlot = job.scheduledTimeSlot || '';
  const isEmergency = job.urgency === 'urgent' || timeSlot.toLowerCase().includes('asap') || timeSlot.toLowerCase().includes('emergency');
  const isAddressRevealed = ['accepted', 'en_route', 'arrived', 'quote_provided', 'in_progress', 'completed'].includes(job.status);
  const locationText = isAddressRevealed 
    ? [job.streetAddress, job.city].filter(Boolean).join(', ')
    : (job.city || 'Location area');
  const hasNotes = job.jobDescription && job.jobDescription.trim().length > 0;

  return (
    <>
      {/* ── MOBILE view (< 768px) ── */}
      <div className="job-summary-mobile md:hidden">
        {/* Header with Title on Left and Track Job Button on Right */}
        <div className="jsm-header">
          <div className="jsm-header-left">
            <span className="jsm-title">Booking Details</span>
          </div>
          <Link
            to={`/worker/jobs/${job._id}?view=timeline`}
            className={`jsm-track-btn-top${!job._id ? ' disabled' : ''}`}
            aria-label="Track Job"
          >
            Track Job
          </Link>
        </div>

        {/* Detail rows */}
        <div className="jsm-details">
          <div className="jsm-detail-row">
            <div className="jsm-detail-icon"><Calendar size={18} strokeWidth={2} /></div>
            <div>
              <div className="jsm-detail-label">Schedule</div>
              <div className="jsm-date-row jsm-detail-value">
                <span>{formatScheduleDate(job.scheduledDate)}</span>
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
              <div className="jsm-detail-value">{locationText || '-'}</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="jsm-notes" style={{ marginBottom: 0 }}>
          <FileText size={15} className="jsm-notes-icon" />
          <p className={`jsm-notes-text${hasNotes ? ' has-notes' : ''}`}>
            {hasNotes ? job.jobDescription : 'No additional notes provided'}
          </p>
        </div>
      </div>

      {/* ── TABLET / DESKTOP view (>= 768px) ── */}
      <Card index={index} className="hidden md:block">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-black font-semibold text-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Booking Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-amber-50 flex items-center justify-center text-[#D97706] shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-[#6B6B6B] uppercase text-[12px] tracking-[0.1em] font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Schedule
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-black font-normal text-[17px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {formatScheduleDate(job.scheduledDate)}
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
                <div className="text-[#6B6B6B] uppercase text-[12px] tracking-[0.1em] font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Location
                </div>
                <p className="text-black font-normal text-[17px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {locationText}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F9FA] rounded-[10px] border border-[#E8E2DB] py-4 px-5 text-[#6B6B6B] italic text-[14px] flex gap-3 items-start">
            <Tag size={16} className="mt-0.5 shrink-0 text-[#D97706]" />
            <p>{job.jobDescription || 'No additional notes provided'}</p>
          </div>

          {isAddressRevealed && (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[16px] p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#166534] uppercase tracking-wider">
                  Full Address Revealed
                </div>
                <div className="text-[14px] font-semibold text-[#14532D]">
                  {[job.streetAddress, job.city].filter(Boolean).join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

const TimelineCard = ({ timeline, updateStatus, index }) => {
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
          className={`absolute top-0 bottom-0 left-0 ${doneCount === totalCount ? 'bg-[#2E9E5B]' : 'bg-[#D97706]'} transition-all duration-1000 ease-out`} 
          style={{ width: `${(doneCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="flex flex-col relative">
        {timeline.map((step, idx) => {
          const isLast = idx === timeline.length - 1;
          const isDone = step.done;
          // When a step is 'completed', it has reached the finished milestone and should be green!
          const isCompletedStep = step.status === 'completed' && isDone;
          const isCurrent = isDone && !isCompletedStep && (isLast || !timeline[idx+1].done);
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

              <div className="pt-1 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`${
                    isCurrent || isCompletedStep ? 'text-black font-bold text-[16px]' : 
                    isDone ? 'text-black font-semibold text-[15px]' : 
                    'text-[#6B6B6B] text-[15px]'
                  }`} style={isCurrent || isCompletedStep ? { fontFamily: 'Poppins, sans-serif' } : {}}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="bg-amber-50 text-[#B45309] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      NOW
                    </span>
                  )}
                  {isCompletedStep && (
                    <span className="bg-[#E9F5ED] text-[#1F7A44] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      COMPLETED
                    </span>
                  )}
                </div>
                {step.time && (
                  <p className="text-[#6B6B6B] text-[13px] mb-2">{formatTimelineDate(step.time)}</p>
                )}

                {/* Worker interactive action button on current active step */}
                {isCurrent && step.status === 'accepted' && (
                  <button 
                    onClick={() => updateStatus('en-route')} 
                    className="mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FF7A00] text-white font-semibold text-[14px] hover:bg-[#E86100] shadow-md shadow-[#FF7A00]/20 transition-all font-['Poppins',sans-serif]"
                  >
                    Mark as En Route <ArrowRight size={14} />
                  </button>
                )}
                {isCurrent && step.status === 'en_route' && (
                  <button 
                    onClick={() => updateStatus('start')} 
                    className="mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FF7A00] text-white font-semibold text-[14px] hover:bg-[#E86100] shadow-md shadow-[#FF7A00]/20 transition-all font-['Poppins',sans-serif]"
                  >
                    Mark Arrived & Start <ArrowRight size={14} />
                  </button>
                )}
                {isCurrent && step.status === 'in_progress' && (
                  <button 
                    onClick={() => updateStatus('complete')} 
                    className="mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2E9E5B] text-white font-semibold text-[14px] hover:bg-[#268a4e] shadow-md shadow-[#2E9E5B]/20 transition-all font-['Poppins',sans-serif]"
                  >
                    Mark Completed <ArrowRight size={14} />
                  </button>
                )}
                {isCurrent && step.status === 'quote_provided' && (
                  <div className="mt-2 text-[12px] text-[#B84700] p-2.5 bg-[#FFF1E3] rounded-xl border border-orange-200">
                    Waiting for customer to accept bill...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const PaymentCard = ({ job, index }) => {
  // Show Payment Summary ONLY once the job is completed
  const isJobDone = job?.status === 'completed';
  if (!isJobDone) return null;

  const isPaid = ['paid', 'paid_online', 'paid_cash'].includes(job?.paymentStatus);
  const totalAmount = job?.finalAmount || (job?.pricingType === 'fixed' ? job?.fixedRate : 0);
  
  return (
    <Card index={index}>
      <h3 className="text-black font-semibold text-[20px] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Payment Summary
      </h3>
      
      <div className="flex flex-col gap-4 pb-6 border-b border-[#E8E2DB]">
        {/* Payment Status Row */}
        <div className="flex items-center justify-between">
          <span className="text-[#6B6B6B] text-[15px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Payment Status
          </span>
          <div>
            {isPaid ? (
              <span className="bg-[#E9F5ED] text-[#1F7A44] px-3.5 py-1 rounded-full text-[13px] font-semibold uppercase tracking-wider">
                {job.paymentStatus === 'paid_cash' ? 'Paid via Cash' : 'Paid'}
              </span>
            ) : (
              <span className="bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] px-3.5 py-1 rounded-full text-[13px] font-semibold uppercase tracking-wider">
                Unpaid
              </span>
            )}
          </div>
        </div>

        {/* Total Amount Row */}
        <div className="flex items-center justify-between">
          <span className="text-[#6B6B6B] text-[15px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Total Amount
          </span>
          <span className="text-black font-normal text-[20px] leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Rs. {Number(totalAmount).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-center sm:justify-between flex-wrap gap-2">
        {isPaid ? (
          <>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-[#2E9E5B]" />
              <span className="text-[#2E9E5B] font-medium text-[13px]">Payment received & confirmed</span>
            </div>
            {totalAmount > 0 && (
              <span className="text-[#1F7A44] text-[13px] font-medium">
                Your Net Payout (90%): Rs. {(totalAmount * 0.9).toLocaleString()}
              </span>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <Lock size={14} className="text-[#FF7A00]" />
              <span className="text-[#6B6B6B] text-[13px]">Pay the worker directly in cash or online</span>
            </div>
            {totalAmount > 0 && (
              <span className="text-[#1F7A44] text-[13px] font-medium">
                Your Net Payout (90%): Rs. {(totalAmount * 0.9).toLocaleString()}
              </span>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

const WorkerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTimelineView = searchParams.get('view') === 'timeline';
  const [job, setJob] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quotation Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    estimatedDuration: '',
    noteToCustomer: '',
    lineItems: [{ description: '', amount: '' }]
  });

  const fetchJob = async () => {
    try {
      const { data } = await api.get(`/bookings/${id}`);
      setJob(data.data);
      
      try {
        const qRes = await api.get(`/quotations/booking/${id}`);
        setQuotations(qRes.data.data);
      } catch (err) {
        console.warn('Could not fetch quotations', err);
      }
    } catch (error) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    import('socket.io-client').then(({ io }) => {
      const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      
      socket.on('booking_status_update', (updatedBooking) => {
        if (updatedBooking._id === id) {
          fetchJob();
        }
      });

      socket.on('new_quotation', (quotation) => {
        if (quotation.bookingId === id) {
          fetchJob();
        }
      });

      return () => socket.disconnect();
    });
  }, [id]);

  const updateStatus = async (endpoint) => {
    try {
      let payload = {};
      if (endpoint === 'complete') {
        const hasAcceptedQuote = quotations.some(q => q.status === 'accepted');
        if (!hasAcceptedQuote) {
          toast.info("You must send a final quotation before marking the job as complete.");
          setShowQuoteModal(true);
          return;
        }
      }
      
      const res = await api.put(`/bookings/${id}/${endpoint}`, payload);
      toast.success('Status updated successfully');
      
      if (res.data?.newBookingId && res.data.newBookingId !== id) {
        navigate(`/worker/jobs/${res.data.newBookingId}`);
      } else {
        fetchJob();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddLineItem = () => {
    setQuoteData({
      ...quoteData,
      lineItems: [...quoteData.lineItems, { description: '', amount: '' }]
    });
  };

  const handleRemoveLineItem = (index) => {
    const newItems = quoteData.lineItems.filter((_, i) => i !== index);
    setQuoteData({ ...quoteData, lineItems: newItems });
  };

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...quoteData.lineItems];
    newItems[index][field] = value;
    setQuoteData({ ...quoteData, lineItems: newItems });
  };

  const handleSendQuotation = async () => {
    if (quoteData.lineItems.some(item => !item.description || !item.amount)) {
      return toast.error("Please fill in all line item details");
    }
    
    try {
      const res = await api.post('/quotations', {
        bookingId: id,
        ...quoteData
      });
      toast.success("Quotation sent to customer!");
      setShowQuoteModal(false);
      
      if (res.data.newBookingId && res.data.newBookingId !== id) {
        navigate(`/worker/jobs/${res.data.newBookingId}`);
      } else {
        fetchJob();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send quotation');
    }
  };

  if (loading) {
    return <div className="p-8 text-center font-semibold text-[#6B6B6B]">Loading...</div>;
  }

  if (!job) {
    return <div className="p-8 text-center font-semibold text-[#B42318]">Job not found</div>;
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

  const hasStarted = job.statusHistory?.some(h => h.status === 'in_progress') || job.status === 'in_progress';
  const timelineSteps = (quotations.length > 0 && !hasStarted)
    ? baseTimelineSteps 
    : baseTimelineSteps.filter(s => s.key !== 'quote_provided');

  const timeline = timelineSteps.map(step => {
    const historyItem = job.statusHistory?.find(h => h.status === step.key);
    const currentIndex = timelineSteps.findIndex(s => s.key === job.status);
    const stepIndex = timelineSteps.findIndex(s => s.key === step.key);
    
    let done = false;
    if (job.status === 'cancelled' || job.status === 'complaint') {
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

  const totalQuoteAmount = quoteData.lineItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const isEmergency = job.urgency === 'urgent';
  const refId = job._id ? job._id.substring(job._id.length - 6).toUpperCase() : '';

  // On mobile, if view=timeline is active, render dedicated Mobile Timeline Screen
  if (isTimelineView) {
    const jobRole = getJobRole(job.serviceTitle, job.workerSkill || job.categoryId?.nameEn);

    return (
      <div className="min-h-screen bg-white font-sans text-[#3D3D3D]">
        <style>{customStyles}</style>
        {/* Mobile Dedicated Timeline View (< 768px) */}
        <div className="md:hidden px-4 py-5 max-w-[500px] mx-auto">
          {/* Top navigation bar */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E8E2DB]">
            <button
              onClick={() => navigate(`/worker/jobs/${job._id}`)}
              className="flex items-center gap-2 text-black font-semibold text-[15px] hover:text-[#D97706] transition-colors py-1.5 pr-3 cursor-pointer"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider">Job</span>
              <span className="font-bold text-[#D97706] text-[13px] bg-[#FFF8F1] border border-[#D97706]/30 px-2.5 py-1 rounded-full">
                #{refId}
              </span>
            </div>
          </div>

          {/* Job Header */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Track Job
              </h1>
              <p className="text-[14px] text-[#6B6B6B] mt-0.5">{jobRole}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>

          {/* Full Timeline Card */}
          <TimelineCard timeline={timeline} updateStatus={updateStatus} index={0} className="w-full shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 md:py-4 font-sans text-[#3D3D3D]">
      <style>{customStyles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Emergency Alert Banner */}
        {isEmergency && (
          <div className="bg-[#FDECEC] border border-[#FECACA] rounded-[20px] p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-[12px] bg-[#FEE2E2] flex items-center justify-center text-[#B42318] shrink-0">
                <AlertCircle size={20} className="text-[#B42318]" />
              </span>
              <div>
                <h4 className="font-bold text-[#B42318] text-[15px]">Emergency Job Request</h4>
                <p className="text-[#DC2626] text-[13px]">This customer requested urgent assistance ASAP.</p>
              </div>
            </div>
            {job.status === 'pending' && (
              <span className="bg-[#B42318] text-white text-[12px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0">
                Respond ASAP
              </span>
            )}
          </div>
        )}

        {/* Main Grid: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-[64%_calc(36%-24px)] gap-6 items-stretch">
          
          {/* Left Column Container */}
          <div className="flex flex-col gap-6 order-1">
            
            {/* Customer Details Card (Matching Customer's Assigned Worker Card) */}
            <CustomerCard 
              job={job} 
              navigate={navigate} 
              updateStatus={updateStatus} 
              setShowQuoteModal={setShowQuoteModal} 
              index={0} 
            />



            {/* Job Details Card (Service, Schedule, Location, Notes) */}
            <JobDetailsCard job={job} index={3} />

          </div>

          {/* Right Column Container (Desktop Only) */}
          <div className="hidden md:flex flex-col h-full order-2">
            <TimelineCard timeline={timeline} updateStatus={updateStatus} index={2} className="h-full" />
          </div>

        </div>

        {/* Quotations (Full-width above Payment Summary) */}
        {quotations.length > 0 && (
          <div className="mt-6 w-full space-y-6">
            {quotations.map(quote => (
              <Card key={quote._id} className="!bg-white !border-[#D97706]/30" index={1}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-[18px] font-bold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Quotation #{quote._id.substring(quote._id.length - 6).toUpperCase()}
                    </h3>
                    <p className="text-[#6B6B6B] text-[13px]">Sent for customer approval</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider ${
                    quote.status === 'accepted' ? 'bg-[#E9F5ED] text-[#1F7A44]' :
                    quote.status === 'rejected' ? 'bg-[#FDECEC] text-[#B42318]' :
                    'bg-[#FFF1E3] text-[#B84700]'
                  }`}>
                    {quote.status === 'accepted' ? 'Accepted by Customer' :
                     quote.status === 'rejected' ? 'Declined by Customer' :
                     'Pending Approval'}
                  </span>
                </div>
                
                <div className="bg-white rounded-[10px] border border-[#E8E2DB] p-5 mb-2 space-y-3">
                  {quote.lineItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[15px]">
                      <span className="text-[#6B6B6B]">{item.description}</span>
                      <span className="font-semibold text-black">Rs. {Number(item.amount).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#E8E2DB] mt-3 pt-4 flex justify-between font-bold text-[18px] text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <span>Total Estimated Amount</span>
                    <span>Rs. {Number(quote.totalAmount).toLocaleString()}</span>
                  </div>
                  {quote.estimatedDuration && (
                    <div className="text-[14px] text-[#6B6B6B] mt-2">
                      Estimated Duration: <span className="font-medium text-[#3D3D3D]">{quote.estimatedDuration}</span>
                    </div>
                  )}
                  {quote.noteToCustomer && (
                    <div className="text-[14px] text-[#6B6B6B] mt-1 italic">"{quote.noteToCustomer}"</div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Full-width Payment Summary */}
        <div className="mt-6 w-full">
          <PaymentCard job={job} index={4} />
        </div>
      </div>

      {/* Quotation Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[24px] border border-[#E8E2DB] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-[#E8E2DB]">
              <div>
                <h2 className="text-[20px] font-bold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Create Quotation / Bill
                </h2>
                <p className="text-[#6B6B6B] text-[13px] mt-0.5">Send itemized quote for customer approval</p>
              </div>
              <button 
                onClick={() => setShowQuoteModal(false)} 
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-[13px] font-semibold text-black uppercase tracking-wider mb-1.5">
                  Estimated Duration
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 2 hours, 1 day" 
                  value={quoteData.estimatedDuration} 
                  onChange={(e) => setQuoteData({...quoteData, estimatedDuration: e.target.value})} 
                  className="w-full border border-[#E8E2DB] rounded-[12px] py-2.5 px-3.5 focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] outline-none text-[15px]" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[13px] font-semibold text-black uppercase tracking-wider">
                    Line Items
                  </label>
                  <button 
                    type="button" 
                    onClick={handleAddLineItem} 
                    className="text-[13px] text-[#D97706] font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={15} /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {quoteData.lineItems.map((item, index) => (
                    <div key={index} className="flex gap-2.5 items-center">
                      <input 
                        type="text" 
                        placeholder="Description (e.g. Parts, Labor)" 
                        value={item.description} 
                        onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} 
                        className="flex-1 border border-[#E8E2DB] rounded-[12px] py-2.5 px-3.5 focus:ring-2 focus:ring-[#D97706] outline-none text-[14px]" 
                      />
                      <div className="w-32 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#6B6B6B] font-medium">Rs.</span>
                        <input 
                          type="number" 
                          placeholder="0" 
                          value={item.amount} 
                          onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)} 
                          className="w-full border border-[#E8E2DB] rounded-[12px] py-2.5 pl-9 pr-3 focus:ring-2 focus:ring-[#D97706] outline-none text-[14px] font-semibold" 
                        />
                      </div>
                      {quoteData.lineItems.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveLineItem(index)} 
                          className="p-2 text-[#DC2626] hover:bg-[#FDECEC] rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center bg-[#F8F9FA] p-4 rounded-[14px] border border-[#E8E2DB]">
                <span className="font-semibold text-black text-[15px]">Total Amount:</span>
                <span className="text-[22px] font-bold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Rs. {totalQuoteAmount.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-black uppercase tracking-wider mb-1.5">
                  Note to Customer (Optional)
                </label>
                <textarea 
                  rows="3" 
                  placeholder="Add details about warranty, payment terms, or required materials..."
                  value={quoteData.noteToCustomer} 
                  onChange={(e) => setQuoteData({...quoteData, noteToCustomer: e.target.value})} 
                  className="w-full border border-[#E8E2DB] rounded-[12px] py-2.5 px-3.5 focus:ring-2 focus:ring-[#D97706] outline-none text-[14px] resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-[#E8E2DB] flex justify-end gap-3 bg-[#F8F9FA]">
              <button 
                onClick={() => setShowQuoteModal(false)} 
                className="px-5 py-2.5 border border-[#E8E2DB] rounded-[12px] font-semibold text-[14px] text-[#3D3D3D] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendQuotation} 
                className="px-6 py-2.5 bg-[#D97706] text-white rounded-[12px] font-semibold text-[14px] hover:bg-[#B45309] shadow-md shadow-[#D97706]/30 transition-all"
              >
                Send Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerJobDetail;
