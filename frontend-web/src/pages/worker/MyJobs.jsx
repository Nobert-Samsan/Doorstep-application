import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

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

const MyJobs = () => {
  const [activeTab, setActiveTab] = useState('All Jobs');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/bookings');
        setJobs(data.data);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500';
      case 'quote_provided': return 'bg-pink-100 text-pink-700 border-l-4 border-pink-500';
      case 'accepted': return 'bg-teal-100 text-teal-700 border-l-4 border-teal-500';
      case 'en_route': return 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500';
      case 'arrived': return 'bg-cyan-100 text-cyan-700 border-l-4 border-cyan-500';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-l-4 border-blue-500';
      case 'completed': return 'bg-green-100 text-green-700 border-l-4 border-green-500';
      case 'cancelled': return 'bg-red-50 text-red-700 border-l-4 border-red-500';
      case 'complaint': return 'bg-purple-100 text-purple-700 border-l-4 border-purple-500';
      default: return 'bg-gray-100 text-gray-700 border-l-4 border-gray-500';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'All Jobs') return true;
    if (activeTab === 'Pending') return job.status === 'pending';
    if (activeTab === 'Active') {
      return ['in_progress', 'accepted', 'en_route', 'arrived', 'quote_provided'].includes(job.status);
    }
    if (activeTab === 'Completed') return job.status === 'completed';
    if (activeTab === 'Cancelled') return job.status === 'cancelled';
    if (activeTab === 'Complaint') return ['complaint', 'disputed'].includes(job.status);
    return true;
  });

  const tabs = ['All Jobs', 'Pending', 'Active', 'Completed', 'Cancelled', 'Complaint'];

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A00]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-['Poppins',sans-serif] text-gray-900">Worker Activities</h2>
      </div>

      <div className="flex space-x-4 sm:space-x-6 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 border-b-2 font-medium whitespace-nowrap text-sm sm:text-base shrink-0 transition-colors font-['Poppins',sans-serif] ${
              activeTab === tab 
                ? 'border-[#FF7A00] text-[#FF7A00] font-semibold' 
                : 'border-transparent text-[#6B6B6B] hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-xs">
            <p className="text-gray-500 font-medium font-['Inter',sans-serif]">No {activeTab.toLowerCase()} found.</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const customerName = job.customerId 
              ? `${job.customerId.firstName || ''} ${job.customerId.lastName || ''}`.trim() || 'Customer'
              : 'Customer';
            const scheduledDate = job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : '-';

            return (
              <div key={job._id} className="bg-white rounded-xl shadow-xs border border-[#E8E2DB] flex flex-col md:flex-row overflow-hidden hover:shadow-sm transition-shadow">
                <div className={`w-2 md:w-auto md:w-1 ${getStatusStyle(job.status).split(' ')[0]}`}></div>
                <div className="p-5 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 font-['Poppins',sans-serif] capitalize">
                      {getJobRole(job.serviceTitle, job.workerSkill || job.categoryId?.nameEn)}
                    </h3>
                    {job.jobDescription && job.jobDescription.trim() !== '' && job.jobDescription.toLowerCase() !== 'no additional notes provided' && (
                      <p className="text-xs text-[#6B6B6B] mt-0.5 max-w-md line-clamp-1 italic font-['Inter',sans-serif]">
                        "{job.jobDescription}"
                      </p>
                    )}
                    <div className="mt-1.5 space-y-0.5 text-sm text-[#6B6B6B] font-['Inter',sans-serif]">
                      <p><span className="font-medium text-gray-900">Customer Name:</span> {customerName}</p>
                      <p><span className="font-medium text-gray-900">Booking Date:</span> {scheduledDate}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end w-full md:w-auto gap-2">
                    <div className="flex justify-between w-full md:w-auto gap-4 items-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(job.status).replace('border-l-4 border-', '')}`}>
                        {getStatusText(job.status)}
                      </span>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Link 
                        to={`/worker/jobs/${job._id}`} 
                        className="flex-1 md:flex-none text-center px-4 py-2 border border-[#FF7A00] text-[#FF7A00] hover:bg-[#FFF8F1] rounded-xl text-sm font-semibold font-['Poppins',sans-serif] transition-colors"
                      >
                        Manage Job
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyJobs;
