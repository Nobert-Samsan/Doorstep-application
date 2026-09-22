import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, CheckCircle, Clock, ShieldCheck, 
  MessageSquare, Calendar, ChevronLeft 
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const WorkerProfile = () => {
  const { id } = useParams();

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchWorker = async () => {
      try {
        const { data } = await api.get(`/customer/worker/${id}`);
        const dbWorker = data.data;
        
        setWorker({
          id: dbWorker._id,
          userId: dbWorker.userId._id || dbWorker.userId,
          firstName: dbWorker.userId.firstName,
          lastName: dbWorker.userId.lastName,
          profilePhoto: dbWorker.userId.profilePhoto,
          services: [{
            serviceTitle: dbWorker.services?.[0]?.serviceTitle || 'Professional',
            description: dbWorker.services?.[0]?.serviceDescription || 'Ready to help with your project.'
          }],
          district: dbWorker.city || dbWorker.serviceDistricts?.[0] || 'Anywhere',
          averageRating: dbWorker.averageRating || 0,
          totalReviews: dbWorker.totalReviews || 0,
          verifiedBadge: dbWorker.verifiedBadge || false,
          isAvailable: dbWorker.isAvailable || false,
          bio: dbWorker.bio || 'I am a highly skilled professional with a passion for delivering quality service.',
          totalJobsCompleted: 12, // Keeping mock value as placeholder until job history is built
          skills: dbWorker.services?.[0]?.specificSkills || []
        });
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
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Back button */}
      <Link to="/customer/dashboard" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors">
        <ChevronLeft size={20} className="mr-1" /> Back
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN - Profile Details */}
        <div className="flex-1 space-y-8 w-full">
          
          {/* Main Profile Header */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-amber-500 to-primary relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>
            
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-24 relative z-10">
                  {/* Profile Avatar */}
                  <div className="w-32 h-32 bg-gray-100 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0 bg-white sm:translate-y-8">
                    {worker.profilePhoto ? (
                      <img src={worker.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">👷‍♂️</span>
                    )}
                  </div>
                
                <div className="pt-2 sm:pt-0 sm:pb-12">
                  <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 drop-shadow-md">
                    {worker.firstName} {worker.lastName}
                    {worker.verifiedBadge && <ShieldCheck className="text-white w-7 h-7 drop-shadow-md" title="Verified Professional" />}
                  </h1>
                  <p className="text-lg text-amber-50 font-bold mt-1 drop-shadow-sm">{worker.services[0].serviceTitle}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-12 text-sm font-medium text-gray-600">
                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <MapPin size={16} className="text-gray-400" /> {worker.district}
                </span>
                <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100">
                  <Star size={16} className="fill-current" /> {worker.averageRating} ({worker.totalReviews} Reviews)
                </span>
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100">
                  <CheckCircle size={16} /> {worker.totalJobsCompleted} Jobs Completed
                </span>
              </div>
            </div>
          </div>

          {/* About & Skills */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
              {worker.bio}
            </p>
            
            <h3 className="text-sm font-bold text-gray-900 mt-8 mb-3 uppercase tracking-wider">Specialized Skills</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, idx) => (
                <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Service Pricing Details */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Service & Pricing</h2>
            <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/30 transition-colors">
              <div>
                <h4 className="font-extrabold text-gray-900 text-lg">{worker.services[0].serviceTitle}</h4>
                <p className="text-gray-500 mt-1 max-w-md">{worker.services[0].description}</p>
              </div>
              <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 text-center flex-shrink-0">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estimated Pricing</span>
                <span className="text-lg font-extrabold text-primary">
                  After Inspection
                </span>
                <span className="block text-xs text-gray-500 font-medium mt-1">Custom Quote</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
            </div>
            
            <div className="space-y-6">
              {/* Single Review Mock */}
              <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      N
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Nimal Dissanayake</p>
                      <div className="flex text-amber-400 text-sm">
                        <Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" />
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">2 days ago</span>
                </div>
                <p className="text-gray-600 mt-3 pl-13">Kamal was very professional and fixed the leak quickly. He cleaned up after himself and the price was exactly what was quoted. Highly recommended!</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Simple CTA Widget */}
        <div className="w-full lg:w-80 flex-shrink-0 relative">
          <div className="lg:fixed lg:w-80 bg-white rounded-3xl shadow-xl border border-gray-100 p-6" style={{ top: '5.5rem' }}>
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
