import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Clock, AlertCircle } from 'lucide-react';

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

const JobRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/worker/job-requests');
      setRequests(res.data.data);
    } catch (error) {
      toast.error('Failed to load job requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.put(`/bookings/${id}/accept`);
      toast.success('Job request accepted successfully!');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept job');
    }
  };

  const handleDecline = async (id) => {
    try {
      await api.put(`/bookings/${id}/decline`, { reason: 'Schedule conflict' });
      toast.info('Job request declined.');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to decline job');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading incoming requests...</div>;

  return (
    <div>
      {requests.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-slate-100 rounded-full scale-[2.5] opacity-50 blur-xl"></div>
            <div className="w-20 h-24 bg-white rounded-lg border-2 border-slate-200 shadow-sm flex flex-col items-center pt-3 relative z-10">
              <div className="w-10 h-2 rounded-full bg-slate-200 mb-2"></div>
              <div className="w-12 h-1.5 rounded-full bg-slate-100 mb-1.5"></div>
              <div className="w-12 h-1.5 rounded-full bg-slate-100 mb-1.5"></div>
              <div className="w-8 h-1.5 rounded-full bg-slate-100"></div>
              
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#EA580C] rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm">
                <Clock size={16} />
              </div>
            </div>
          </div>
          <h3 className="text-gray-900 font-bold text-lg mb-1 relative z-10">No new job requests at the moment.</h3>
          <p className="text-gray-500 text-sm relative z-10">We'll notify you when a new request comes in.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {requests.map(request => (
            <div key={request._id} className="job-request-card">
              <div className="job-card-top">
                <div className="job-category-badge capitalize">
                  {getJobRole(request.serviceTitle, request.categoryId?.nameEn)}
                </div>
                {request.urgency === 'urgent' && (
                  <div className="urgency-badge emergency">Emergency</div>
                )}
              </div>
              
              {request.urgency === 'urgent' && (
                <>
                  <div className="countdown-text">
                    <AlertCircle size={14} /> Respond immediately
                  </div>
                  <div className="countdown-bar">
                    <div className="countdown-fill"></div>
                  </div>
                </>
              )}
              
              <div className="job-card-meta">
                <div className="meta-item">
                  <strong>Customer:</strong> {request.customerId?.firstName} {request.customerId?.lastName} &bull; {request.city || 'Location N/A'}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
                <div className="meta-item text-[12px] text-gray-500">
                  <Clock size={13} /> {new Date(request.scheduledDate).toLocaleDateString()} | {request.scheduledTimeSlot}
                </div>
                
                <div className="job-card-actions">
                  <div className="action-row-buttons">
                    <button onClick={() => handleDecline(request._id)} className="btn-decline">Decline</button>
                    <button onClick={() => handleAccept(request._id)} className="btn-accept">Accept</button>
                  </div>
                  <Link to={`/worker/jobs/${request._id}?from=dashboard`} className="btn-view" style={{textDecoration: 'none'}}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobRequests;
