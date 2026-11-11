import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, CheckCircle, Clock, ShieldCheck, 
  MessageSquare, Calendar, ChevronLeft, User 
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ROLE_MAP = {
  'Plumbing': 'Plumber',
  'Electrical': 'Electrician',
  'Carpentry': 'Carpenter',
  'Painting': 'Painter',
  'Masonry': 'Mason',
  'Cleaning': 'Cleaner',
  'AC Repair': 'AC Technician',
  'Gardening': 'Gardener',
  'Pest Control': 'Pest Exterminator',
  'Roofing': 'Roofer',
  'Appliance Repair': 'Appliance Technician',
  'CCTV Installation': 'CCTV Technician'
};

const WorkerProfile = () => {
  const { id } = useParams();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchWorker = async () => {
      try {
        const { data } = await api.get(`/customer/worker/${id}`);
        const dbWorker = data.data;
        
        // Aggregate skills and service titles from all services registered
        const allServices = dbWorker.services && dbWorker.services.length > 0 
          ? dbWorker.services 
          : [{ serviceTitle: 'Professional', serviceDescription: '' }];
        
        const extractedSkills = allServices.reduce((acc, s) => {
          if (s.specificSkills && Array.isArray(s.specificSkills)) {
            acc.push(...s.specificSkills);
          } else if (s.serviceTitle) {
            acc.push(s.serviceTitle);
          }
          return acc;
        }, []);
        // Remove duplicates
        const uniqueSkills = [...new Set(extractedSkills)];

        // Compute location string from worker registration (city, district)
        const locationStr = [
          dbWorker.userId?.city || dbWorker.city,
          dbWorker.userId?.district || dbWorker.serviceDistricts?.[0]
        ].filter(Boolean).join(', ') || dbWorker.serviceDistricts?.[0] || 'Sri Lanka';

        const workerUserId = dbWorker.userId?._id || dbWorker.userId;

        setWorker({
          id: dbWorker._id,
          userId: workerUserId,
          firstName: dbWorker.userId?.firstName || 'Worker',
          lastName: dbWorker.userId?.lastName || '',
          profilePhoto: dbWorker.userId?.profilePhoto || null,
          services: allServices,
          district: locationStr,
          averageRating: typeof dbWorker.averageRating === 'number' ? dbWorker.averageRating : 0,
          totalReviews: dbWorker.totalReviews || 0,
          verifiedBadge: dbWorker.verifiedBadge || dbWorker.isVerified || false,
          isAvailable: dbWorker.isAvailable || false,
          bio: dbWorker.bio && dbWorker.bio.trim().length > 0 
            ? dbWorker.bio 
            : `Experienced professional specializing in ${allServices.map(s => s.serviceTitle).join(', ')}. Committed to high quality workmanship and customer satisfaction.`,
          totalJobsCompleted: dbWorker.totalJobsCompleted || 0,
          skills: uniqueSkills.length > 0 ? uniqueSkills : allServices.map(s => s.serviceTitle)
        });

        // Fetch real reviews for this worker
        try {
          if (workerUserId) {
            const revRes = await api.get(`/reviews/worker/${workerUserId}`);
            setReviews(revRes.data?.data || []);
          }
        } catch (rErr) {
          console.warn("Could not fetch worker reviews", rErr);
        }

        setLoading(false);
      } catch (err) {
        toast.error("Failed to load worker profile");
        setLoading(false);
      }
    };
    
    fetchWorker();
  }, [id]);
  
  // Form state for direct booking
  const [bookingData, setBookingData] = useState({
    serviceTask: '',
    date: '',
    time: '',
    notes: ''
  });
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const submitDirectBooking = (e) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.time) {
      return toast.error("Please select a date and time.");
    }
    
    // Simulate backend delay for realism
    setTimeout(() => {
      setIsBookingSuccess(true);
    }, 600);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!worker) {
    return <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-bold text-gray-400">Worker not found</h2>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-6 sm:pt-8 md:pt-10 pb-12 px-5 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <div className="pt-1">
        <Link to="/customer/dashboard" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Back
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN - Profile Details */}
        <div className="flex-1 space-y-8 w-full">
          
          {/* Main Profile Header */}
          <div className="bg-gradient-to-br from-[#FF9F0A] via-[#FF7A00] to-[#E65100] rounded-2xl md:rounded-3xl shadow-md p-4 sm:p-5 md:p-6 text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5 relative z-10">
              {/* Profile Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl border-2 sm:border-3 border-white/90 shadow-md flex items-center justify-center overflow-hidden shrink-0 bg-white">
                {worker.profilePhoto ? (
                  <img src={worker.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={38} className="text-[#FF7A00]" />
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm truncate">
                    {worker.firstName} {worker.lastName}
                  </h1>
                  {worker.verifiedBadge && (
                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full border border-white/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base text-amber-100 font-semibold mt-0.5">
                  {ROLE_MAP[worker.services[0].serviceTitle] || worker.services[0].serviceTitle}
                </p>

                {/* Compact badges row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-xs sm:text-sm font-medium">
                  <span className="inline-flex items-center gap-1.5 bg-white/95 text-gray-800 px-3 py-1 rounded-full shadow-sm">
                    <MapPin size={14} className="text-[#FF7A00]" />
                    <span className="font-semibold text-gray-700">{worker.district}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/95 text-gray-800 px-3 py-1 rounded-full shadow-sm">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-900">{worker.averageRating}</span>
                    <span className="text-gray-500 font-normal">({worker.totalReviews})</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/95 text-gray-800 px-3 py-1 rounded-full shadow-sm">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="font-semibold text-gray-700">{worker.totalJobsCompleted} Completed</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* About & Skills */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
              {worker.bio}
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Specialized Skills</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, idx) => (
                <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </div>



          {/* Reviews */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
              <span className="text-sm font-medium text-gray-500">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            
            {reviews.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm font-medium">No customer reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev) => {
                  const customerName = rev.customerId 
                    ? `${rev.customerId.firstName || ''} ${rev.customerId.lastName || ''}`.trim() 
                    : 'Verified Customer';
                  const initial = customerName.charAt(0).toUpperCase() || 'C';
                  const timeAgo = rev.createdAt 
                    ? new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                    : '';

                  return (
                    <div key={rev._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 text-[#FF7A00] rounded-full flex items-center justify-center font-bold text-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{customerName}</p>
                            <div className="flex text-amber-400 text-xs mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  size={13} 
                                  className={rev.rating >= star ? "fill-current text-amber-500" : "text-gray-200"} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {timeAgo && <span className="text-xs font-medium text-gray-400">{timeAgo}</span>}
                      </div>
                      <p className="text-gray-600 text-sm mt-2 pl-13 leading-relaxed">
                        {rev.comment || rev.reviewText || 'Service completed successfully.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN - Simple CTA Widget */}
        <div className="w-full lg:w-80 flex-shrink-0 relative">
          <div className="lg:fixed lg:w-80 bg-white rounded-3xl shadow-xl border border-gray-100 p-6" style={{ top: '11.375rem' }}>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Book Service</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">
              Pricing after inspection. Custom quotes based on your job scope.
            </p>
            
            <Link 
              to={`/customer/book/${worker.id}`}
              className="block w-full bg-primary text-center text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-0.5"
            >
              Book {worker.firstName}
            </Link>
            
            <button 
              type="button" 
              onClick={async () => {
                try {
                  await api.post('/chat/conversations', { receiverId: worker.userId._id || worker.userId });
                  navigate('/customer/messages');
                } catch (err) {
                  console.error("Chat error:", err.response?.data || err);
                  toast.error(err.response?.data?.message || err.message || 'Failed to open chat');
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors mt-3"
            >
              <MessageSquare size={18} /> Message {worker.firstName}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkerProfile;
