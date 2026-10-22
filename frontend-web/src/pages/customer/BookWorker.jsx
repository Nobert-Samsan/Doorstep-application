import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, ChevronLeft, ShieldCheck, Shield, Briefcase, MapPin, UploadCloud, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { DISTRICTS } from '../../constants/districts';
import MapLocationPicker from '../../components/MapLocationPicker';

const ROLE_MAP = {
  'Plumbing': 'Plumber',
  'Electrical': 'Electrician',
  'Carpentry': 'Carpenter',
  'Cleaning': 'Cleaner',
  'Painting': 'Painter',
  'AC Repair': 'AC Technician',
  'Masonry': 'Mason',
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

const BookWorker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [showMap, setShowMap] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    serviceTask: '',
    date: '',
    time: '',
    notes: '',
    streetAddress: '',
    city: ''
  });
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [urgency, setUrgency] = useState('emergency');

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await api.get(`/customer/worker/${id}`);
        setWorker(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load worker profile");
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const submitDirectBooking = async (e) => {
      e.preventDefault();
      
      if (urgency === 'specific' && (!bookingData.date || !bookingData.time)) {
          return toast.error("Please select a preferred date and time.");
      }
      if (!bookingData.streetAddress || !bookingData.city) {
          return toast.error("Please provide your service address details.");
      }

      let finalDate = bookingData.date || new Date().toISOString().split('T')[0];
      let finalTime = bookingData.time;

      if (urgency === 'emergency') {
        finalTime = 'ASAP (Emergency)';
      } else if (urgency === 'flexible') {
        finalTime = 'Flexible timeframe';
      }

      const rawWorkerSkill = worker.services?.[0]?.serviceTitle || 'Professional';
      const workerJobRole = ROLE_MAP[rawWorkerSkill] || rawWorkerSkill;
      const finalServiceTitle = (!bookingData.serviceTask || bookingData.serviceTask.trim().toLowerCase() === 'other')
        ? workerJobRole
        : bookingData.serviceTask;

      try {
          setLoading(true);
          await api.post('/bookings', {
              workerId: worker.userId._id || worker.userId,
              categoryId: worker.services[0]?.categoryId || '000000000000000000000000',
              serviceTitle: finalServiceTitle,
              jobDescription: bookingData.notes || 'No additional notes provided',
              scheduledDate: finalDate,
              scheduledTimeSlot: finalTime,
              province: 'Western',
              district: bookingData.city,
              city: bookingData.city,
              streetAddress: bookingData.streetAddress,
              pricingType: 'fixed'
          });
          setIsBookingSuccess(true);
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to create booking");
      } finally {
          setLoading(false);
      }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!worker) return null;

  const role = ROLE_MAP[worker.services?.[0]?.serviceTitle] || worker.services?.[0]?.serviceTitle || 'Professional';
  const locationInfo = [worker.district || worker.userId?.district, worker.city || worker.userId?.city].filter(Boolean).join(', ');

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 pt-6 sm:pt-8 md:pt-10 pb-16">
      <div className="pt-1">
        <Link to={`/customer/worker/${id}`} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Back to Profile
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header showing who we are booking */}
        <div className="bg-slate-50 p-6 sm:p-8 border-b border-gray-100 flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 text-primary font-bold text-2xl rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md shrink-0">
            {worker.userId?.profilePhoto || worker.profilePhoto ? (
              <img src={worker.userId?.profilePhoto || worker.profilePhoto} alt={worker.userId?.firstName || worker.firstName} className="w-full h-full object-cover" />
            ) : (
              <span>{(worker.userId?.firstName || worker.firstName)?.charAt(0)}{(worker.userId?.lastName || worker.lastName)?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Book {worker.userId?.firstName || worker.firstName} {worker.userId?.lastName || worker.lastName}
            </h2>
            <p className="text-gray-500 text-base font-medium flex items-center gap-2 mt-1.5">
              <Briefcase size={18} className="text-primary shrink-0" />
              <span>{role}</span>
              {locationInfo && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{locationInfo}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          {isBookingSuccess ? (
            <div className="py-12 px-4 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce-short">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Booking Confirmed!</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-8 max-w-md">
                Once {worker.userId?.firstName || worker.firstName} accepts your request, you will be notified immediately.
              </p>
              <button 
                onClick={() => navigate('/customer/dashboard')}
                className="w-full sm:w-auto px-8 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={submitDirectBooking} className="space-y-8">
              <div>
                <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2.5">
                  What do you need help with?
                </label>
                <div className="relative">
                  <select 
                    name="serviceTask"
                    value={bookingData.serviceTask}
                    onChange={handleBookingChange}
                    className="w-full border border-gray-200 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 text-base font-medium appearance-none bg-white cursor-pointer shadow-sm"
                    required
                  >
                    <option value="" disabled>Select a specific task...</option>
                    {worker.services?.[0]?.specificSkills?.map((skill, idx) => (
                      <option key={idx} value={skill}>{skill}</option>
                    ))}
                    <option value="Other">Other (Describe in notes)</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>
              
              <div>
                <label className="block text-base sm:text-lg font-bold text-gray-900 mb-3.5">
                  When do you need this done?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <label className="cursor-pointer">
                    <input type="radio" name="urgency" value="emergency" checked={urgency === 'emergency'} onChange={(e) => setUrgency(e.target.value)} className="peer hidden" />
                    <div className="border-2 border-gray-100 rounded-2xl p-5 sm:p-6 hover:bg-gray-50 peer-checked:border-red-500 peer-checked:bg-red-50/70 transition-all h-full shadow-sm">
                      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-3">
                        <Shield size={24} />
                      </div>
                      <div className="font-extrabold text-gray-900 mb-1 text-base sm:text-lg">Emergency</div>
                      <div className="text-sm text-gray-500 font-medium">As soon as possible!</div>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input type="radio" name="urgency" value="flexible" checked={urgency === 'flexible'} onChange={(e) => setUrgency(e.target.value)} className="peer hidden" />
                    <div className="border-2 border-gray-100 rounded-2xl p-5 sm:p-6 hover:bg-gray-50 peer-checked:border-amber-500 peer-checked:bg-amber-50/70 transition-all h-full shadow-sm">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-3">
                        <Clock size={24} />
                      </div>
                      <div className="font-extrabold text-gray-900 mb-1 text-base sm:text-lg">Flexible</div>
                      <div className="text-sm text-gray-500 font-medium">Within a few days.</div>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input type="radio" name="urgency" value="specific" checked={urgency === 'specific'} onChange={(e) => setUrgency(e.target.value)} className="peer hidden" />
                    <div className="border-2 border-gray-100 rounded-2xl p-5 sm:p-6 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50/70 transition-all h-full shadow-sm">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                        <Calendar size={24} />
                      </div>
                      <div className="font-extrabold text-gray-900 mb-1 text-base sm:text-lg">Specific Date</div>
                      <div className="text-sm text-gray-500 font-medium">Choose a preferred date.</div>
                    </div>
                  </label>

                </div>
              </div>

              {urgency === 'specific' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">Date</label>
                    <div className="relative">
                      <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="date" 
                        name="date" 
                        value={bookingData.date} 
                        onChange={handleBookingChange} 
                        min={new Date().toISOString().split('T')[0]} 
                        className="w-full border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 text-base font-medium shadow-sm" 
                        required={urgency === 'specific'} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">Time</label>
                    <div className="relative">
                      <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="time" 
                        name="time" 
                        value={bookingData.time} 
                        onChange={handleBookingChange} 
                        className="w-full border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 text-base font-medium shadow-sm" 
                        required={urgency === 'specific'} 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6 pt-6 border-t border-gray-100 mt-8">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 border-b pb-3 mb-6">Location Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">District</label>
                    <select 
                      name="district" 
                      value={bookingData.district || ''} 
                      onChange={handleBookingChange} 
                      className="w-full border border-gray-200 rounded-2xl py-3.5 sm:py-4 px-4 sm:px-5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 text-base font-medium bg-white shadow-sm" 
                      required
                    >
                      <option value="">Select District</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">City / Town</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={bookingData.city} 
                      onChange={handleBookingChange} 
                      placeholder="e.g. Nugegoda" 
                      className="w-full border border-gray-200 rounded-2xl py-3.5 sm:py-4 px-4 sm:px-5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 text-base font-medium shadow-sm" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-900 mb-2">Street Address</label>
                  <input 
                    type="text" 
                    name="streetAddress" 
                    value={bookingData.streetAddress} 
                    onChange={handleBookingChange} 
                    placeholder="e.g. 123 Main Street" 
                    className="w-full border border-gray-200 rounded-2xl py-3.5 sm:py-4 px-4 sm:px-5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 text-base font-medium shadow-sm mb-6" 
                    required 
                  />
                  
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-gray-900 mb-3">Exact Location (Optional)</label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Option 1: Current Location */}
                      <button 
                        type="button"
                        onClick={() => {
                          if (!navigator.geolocation) {
                            toast.error("Geolocation is not supported by your browser");
                            return;
                          }
                          
                          const toastId = toast.loading("Finding your location...");
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              toast.dismiss(toastId);
                              setMapCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
                              toast.success("Location found!");
                              setShowMap(true);
                            },
                            (error) => {
                              toast.dismiss(toastId);
                              toast.error("Could not get your location. Please check permissions or use the map.");
                            },
                            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
                          );
                        }}
                        className="w-full flex items-center p-5 bg-white border border-gray-200 rounded-2xl hover:border-primary hover:bg-amber-50/50 transition-colors group text-left shadow-sm"
                      >
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-white group-hover:text-primary transition-colors text-gray-500 shadow-sm shrink-0">
                          <MapPin size={22} />
                        </div>
                        <div>
                          <div className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors">Use Current Location</div>
                          <div className="text-sm text-gray-500 mt-0.5">Automatically find your spot</div>
                        </div>
                      </button>

                      {/* Option 2: Set on Map */}
                      <button 
                        type="button"
                        onClick={() => {
                          if (!showMap) {
                            setShowMap(true);
                            if (!mapCoordinates && navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  setMapCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
                                },
                                () => {},
                                { enableHighAccuracy: false, timeout: 5000 }
                              );
                            }
                          } else {
                            setShowMap(false);
                          }
                        }}
                        className="w-full flex items-center p-5 bg-white border border-gray-200 rounded-2xl hover:border-primary hover:bg-amber-50/50 transition-colors group text-left shadow-sm"
                      >
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-white group-hover:text-primary transition-colors text-gray-500 shadow-sm shrink-0">
                          <MapPin size={22} />
                        </div>
                        <div>
                          <div className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors">Set on Map</div>
                          <div className="text-sm text-gray-500 mt-0.5">Drop a pin on map</div>
                        </div>
                      </button>
                    </div>

                    {showMap && (
                      <div className="mt-4 animate-fadeIn border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <MapLocationPicker 
                          mapCoordinates={mapCoordinates} 
                          setMapCoordinates={setMapCoordinates} 
                        />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 bg-blue-50 text-blue-700 p-4 rounded-2xl mt-4 border border-blue-100">
                      <Info size={18} className="mt-0.5 shrink-0" />
                      <p className="text-sm font-medium leading-relaxed">For your privacy, your exact street address and coordinates are hidden. They are only revealed to the specific worker you choose to hire.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-gray-100 mt-8">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">Job Details & Photos</h3>
                
                <div>
                  <label className="block text-base font-bold text-gray-900 mb-1">Upload Photos of the Issue (Highly Recommended)</label>
                  <p className="text-sm text-gray-500 mb-4">Workers provide much more accurate quotes when they can see exactly what needs to be fixed or worked on.</p>
                  
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative overflow-hidden">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/png, image/jpeg" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          setUploadedPhotos((prev) => [...prev, ...Array.from(e.target.files)]);
                        }
                      }}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud size={28} className="text-primary" />
                      </div>
                      <p className="font-bold text-base text-gray-900 mb-1">Click to upload photos</p>
                      <p className="text-sm text-gray-500 font-medium">PNG, JPG up to 5MB (Max 3)</p>
                    </div>
                  </div>
                  
                  {/* Photo Previews */}
                  {uploadedPhotos.length > 0 && (
                    <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                      {uploadedPhotos.map((photo, idx) => (
                        <div key={idx} className="relative shrink-0">
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt="Preview" 
                            className="w-24 h-24 object-cover rounded-2xl border border-gray-200 shadow-sm"
                          />
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedPhotos(prev => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-base font-bold text-gray-900 mb-2">Additional Notes (Optional)</label>
                  <textarea 
                    name="notes"
                    rows="4"
                    value={bookingData.notes}
                    onChange={handleBookingChange}
                    placeholder="Describe what needs fixing in detail..."
                    className="w-full border border-gray-200 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 text-base font-medium resize-none shadow-sm"
                  ></textarea>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-primary text-white text-lg sm:text-xl font-extrabold py-4 sm:py-5 rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-0.5"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookWorker;
