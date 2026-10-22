import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { DISTRICTS } from '../../constants/districts';
import { 
  Briefcase, Calendar, MapPin, DollarSign, 
  ChevronRight, ChevronLeft, UploadCloud, Shield, Clock, Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import MapLocationPicker from '../../components/MapLocationPicker';

const PostJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    category: location.state?.category || '', 
    jobDescription: location.state?.description || location.state?.jobDescription || '', 
    district: '', 
    city: '', 
    streetAddress: '', 
    urgency: 'normal' 
  });
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [urgency, setUrgency] = useState('emergency');
  const [budgetType, setBudgetType] = useState('open');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Full list of 22 Categories matching Dashboard.jsx
  const categories = [
    { id: 'Plumbing', name: 'Plumbing', icon: '🔧' }, 
    { id: 'Electrical', name: 'Electrical', icon: '⚡' }, 
    { id: 'Carpentry', name: 'Carpentry', icon: '🪚' },
    { id: 'Cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'Painting', name: 'Painting', icon: '🎨' },
    { id: 'AC Repair', name: 'AC Repair', icon: '❄️' },
    { id: 'Masonry', name: 'Masonry', icon: '🧱' },
    { id: 'Gardening', name: 'Gardening', icon: '🪴' },
    { id: 'Pest Control', name: 'Pest Control', icon: '🐜' },
    { id: 'Roofing', name: 'Roofing', icon: '🏠' },
    { id: 'Appliance Repair', name: 'Appliances', icon: '📺' },
    { id: 'CCTV Installation', name: 'Security', icon: '🎥' },
    { id: 'Moving', name: 'Moving', icon: '📦' },
    { id: 'TV Mounting', name: 'Mounting', icon: '🖥️' },
    { id: 'Handyman', name: 'Handyman', icon: '🛠️' },
    { id: 'Tiling', name: 'Tiling', icon: '🔲' },
    { id: 'Photography', name: 'Photography', icon: '📸' },
    { id: 'Catering', name: 'Catering', icon: '🍲' },
    { id: 'Beauty', name: 'Beauty', icon: '💅' },
    { id: 'Fitness', name: 'Fitness', icon: '🏋️' },
    { id: 'IT Support', name: 'IT Support', icon: '💻' },
    { id: 'Tutoring', name: 'Tutoring', icon: '📚' }
  ];

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        urgency,
        budgetType,
      };
      
      await api.post('/job-posts', payload);
      toast.success("Job broadcasted successfully!");
      setStep(3); // Transition to the success screen
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to broadcast job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Broadcast a Job</h1>
          <p className="text-gray-500 mt-1">Get quotes from available professionals in your area within minutes.</p>
        </div>
        <Link to="/customer/dashboard" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        
        {/* LEFT COLUMN - Wizard Form */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
            
            {/* Progress Bar (Hidden on success screen) */}
            {step < 3 && (
              <div className="mb-12">
                <div className="flex justify-between relative z-0">
                  {/* Background line */}
                  <div className="absolute top-6 left-0 right-0 h-1.5 bg-gray-100 -z-10 rounded-full -translate-y-1/2"></div>
                  {/* Progress fill */}
                  <div className="absolute top-6 left-0 h-1.5 bg-primary -z-10 rounded-full transition-all duration-500 ease-in-out -translate-y-1/2" style={{ width: `${Math.min((step - 1) / 1, 1) * 100}%` }}></div>
                  
                  {[
                    { label: 'Details' },
                    { label: 'Location' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm transition-colors duration-300 ${step > i ? 'bg-primary text-white border-none' : step === i + 1 ? 'bg-amber-100 text-primary border-2 border-primary' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                        {i + 1}
                      </div>
                      <span className={`text-xs font-bold ${step >= i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={step === 2 ? handleSubmit : handleNext}>
              
              {/* STEP 1: JOB DETAILS */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you need help with?</h2>
                    <p className="text-gray-500 mb-6">Select a category and describe the problem.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Service Category</label>
                    <div className="bg-gray-50 rounded-2xl p-2 border-2 border-gray-100">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto custom-scrollbar p-1">
                        {categories.map(c => (
                          <label key={c.id} className="cursor-pointer h-full">
                            <input type="radio" name="category" value={c.id} checked={formData.category === c.id} onChange={handleInputChange} className="peer hidden" required />
                            <div className="bg-white border-2 border-transparent rounded-xl p-3 text-center hover:shadow-md peer-checked:border-primary peer-checked:bg-amber-50 peer-checked:shadow-sm transition-all h-full flex flex-col items-center justify-center">
                              <div className="text-2xl mb-1.5">{c.icon}</div>
                              <div className="font-bold text-gray-700 peer-checked:text-primary text-xs">{c.name}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Describe the service you need</label>
                    <textarea name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} rows="4" placeholder="e.g. The pipe under the kitchen sink bursts every time I turn on the hot water. I need a plumber to fix or replace it." className="w-full border-2 border-gray-100 rounded-xl py-3.5 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 resize-none font-medium" required></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">When do you need this done?</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <label className="cursor-pointer">
                        <input 
                          type="radio" 
                          name="urgency" 
                          value="emergency"
                          checked={formData.urgency === 'emergency'} 
                          onChange={(e) => {
                            handleInputChange(e);
                            setUrgency(e.target.value);
                          }} 
                          className="peer hidden" 
                        />
                        <div className="border-2 border-gray-100 rounded-2xl p-5 hover:bg-gray-50 peer-checked:border-red-500 peer-checked:bg-red-50 transition-colors h-full">
                          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-3">
                            <Shield size={20} />
                          </div>
                          <div className="font-bold text-gray-900 mb-1">Emergency</div>
                          <div className="text-sm text-gray-500 font-medium">As soon as possible!</div>
                        </div>
                      </label>

                      <label className="cursor-pointer">
                        <input 
                          type="radio" 
                          name="urgency" 
                          value="flexible"
                          checked={formData.urgency === 'flexible'} 
                          onChange={(e) => {
                            handleInputChange(e);
                            setUrgency(e.target.value);
                          }} 
                          className="peer hidden" 
                        />
                        <div className="border-2 border-gray-100 rounded-2xl p-5 hover:bg-gray-50 peer-checked:border-amber-500 peer-checked:bg-amber-50 transition-colors h-full">
                          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-3">
                            <Clock size={20} />
                          </div>
                          <div className="font-bold text-gray-900 mb-1">Flexible</div>
                          <div className="text-sm text-gray-500 font-medium">Within a few days.</div>
                        </div>
                      </label>

                      <label className="cursor-pointer">
                        <input 
                          type="radio" 
                          name="urgency" 
                          value="specific"
                          checked={formData.urgency === 'specific'} 
                          onChange={(e) => {
                            handleInputChange(e);
                            setUrgency(e.target.value);
                          }} 
                          className="peer hidden" 
                        />
                        <div className="border-2 border-gray-100 rounded-2xl p-5 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors h-full">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                            <Calendar size={20} />
                          </div>
                          <div className="font-bold text-gray-900 mb-1">Specific Date</div>
                          <div className="text-sm text-gray-500 font-medium">Choose a preferred date.</div>
                        </div>
                      </label>

                    </div>
                  </div>

                  {urgency === 'specific' && (
                    <div className="animate-fadeIn">
                      <label className="block text-sm font-bold text-gray-900 mb-2">Preferred Date</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border-2 border-gray-100 rounded-xl py-3.5 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium" 
                        required={urgency === 'specific'}
                      />
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-bold text-gray-900 mb-1">Upload Photos of the Issue (Highly Recommended)</label>
                    <p className="text-xs text-gray-500 mb-3">Workers provide much more accurate quotes when they can see exactly what needs to be fixed or worked on.</p>
                    
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
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform text-primary">
                        <UploadCloud size={28} />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Click to upload photos of the problem</h4>
                      <p className="text-sm text-gray-500 font-medium">PNG, JPG up to 10MB</p>
                    </div>

                    {/* Image Previews */}
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
                        {uploadedPhotos.map((file, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 aspect-square flex items-center justify-center shadow-sm">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt="preview" 
                              className="object-cover w-full h-full" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => {
                                  setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx));
                                }}
                                className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors font-bold"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Where is the job located?</h2>
                    <p className="text-gray-500 mb-6">Workers use this to calculate travel distance and availability.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">District</label>
                      <select name="district" value={formData.district} onChange={handleInputChange} className="w-full border-2 border-gray-100 rounded-xl py-3.5 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium bg-white" required>
                        <option value="">Select District</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">City / Town</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Nugegoda" className="w-full border-2 border-gray-100 rounded-xl py-3.5 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Street Address</label>
                    <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} placeholder="e.g. 123 Main Street" className="w-full border-2 border-gray-100 rounded-xl py-3.5 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium mb-6" required />
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">Exact Location (Optional)</label>
                      
                      <div className="space-y-3">
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
                          className="w-full flex items-center p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-amber-50 transition-colors group text-left"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:text-primary transition-colors text-gray-500">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">Use Current Location</div>
                            <div className="text-xs text-gray-500 mt-0.5">Automatically find where you are right now</div>
                          </div>
                        </button>

                        {/* Option 2: Set on Map */}
                        <button 
                          type="button"
                          onClick={() => {
                            if (!showMap) {
                              setShowMap(true);
                              
                              // Optionally try to center map on their location if we don't have one yet
                              if (!mapCoordinates && navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                  (position) => {
                                    setMapCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
                                  },
                                  () => {}, // Ignore errors, it's just a helpful recenter
                                  { enableHighAccuracy: false, timeout: 5000 }
                                );
                              }
                            } else {
                              setShowMap(false);
                            }
                          }}
                          className="w-full flex items-center p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-amber-50 transition-colors group text-left"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:text-primary transition-colors text-gray-500">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">Set on Map</div>
                            <div className="text-xs text-gray-500 mt-0.5">Drop a pin exactly where you need the service</div>
                          </div>
                        </button>
                      </div>

                      {/* Map View Container */}
                      {showMap && (
                        <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                          <MapLocationPicker 
                            onLocationChange={setMapCoordinates} 
                            initialPosition={mapCoordinates ? [mapCoordinates.lat, mapCoordinates.lng] : null}
                          />
                        </div>
                      )}

                      <div className="mt-6 flex items-start bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-medium">
                        <Info size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                        <p>For your privacy, your exact street address and coordinates are hidden. They are only revealed to the specific worker you choose to hire.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SUCCESS SCREEN */}
              {step === 3 && (
                <div className="py-12 text-center animate-fadeIn">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Job Successfully Broadcasted!</h2>
                  <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
                    Your request has been sent to nearby professionals. You will be notified immediately when they send you a price quote.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button 
                      type="button"
                      onClick={() => navigate('/customer/dashboard')}
                      className="bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-primary/20 w-full sm:w-auto"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )}

              {/* Form Navigation (Hidden on success screen) */}
              {step < 3 && (
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                  {step > 1 ? (
                    <button type="button" onClick={handlePrevious} className="flex items-center text-gray-500 font-bold hover:text-gray-900 transition-colors px-4 py-2">
                      <ChevronLeft size={20} className="mr-1" /> Back
                    </button>
                  ) : <div></div>}
                  
                  <button type="submit" className="bg-primary text-white font-bold px-10 py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-primary/20 flex items-center">
                    {step === 2 ? 'Broadcast Job Now' : 'Continue'} 
                    {step !== 2 && <ChevronRight size={20} className="ml-1" />}
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN - Sticky How Job Broadcasts Work Card */}
        <div className="w-full lg:w-96">
          <style>{`
            @keyframes stepFadeUp {
              from {
                opacity: 0;
                transform: translateY(8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-stepFade {
              animation: stepFadeUp 250ms ease-out both;
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-stepFade {
                animation: none !important;
                transform: none !important;
                transition: none !important;
              }
            }
          `}</style>

          <div className="sticky top-28 bg-[#FFF8F1] rounded-[24px] border border-[#E8E2DB] p-7 text-gray-900 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
            {/* Top orange gradient accent bar (4px) */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 rounded-t-[24px]"
              style={{ background: 'linear-gradient(90deg, #FF9F0A 0%, #F94D1A 100%)' }}
            />

            {/* Top-right soft orange glow (rgba(255,122,0,0.10)) */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#FF7A00]/10 rounded-full blur-[40px] pointer-events-none" />

            {/* Top-left faint 5% black dotted pattern */}
            <div 
              className="absolute top-0 left-0 w-32 h-32 pointer-events-none opacity-60 rounded-tl-[24px]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
                backgroundSize: '12px 12px'
              }}
            />

            <div className="relative z-10">
              {/* HEADER */}
              {/* 52px Orange Gradient Rounded Square with Radio-waves SVG line icon */}
              <div 
                className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center text-white mb-5 shadow-[0_8px_20px_rgba(255,122,0,0.35)] shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF9F0A 0%, #F94D1A 100%)' }}
              >
                <svg 
                  className="w-6 h-6 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                  <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-[22px] md:text-[24px] font-poppins font-bold text-[#000000] leading-tight mb-6">
                How Job{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">
                  Broadcasts
                </span>{' '}
                Work
              </h3>

              {/* STEPS */}
              <div className="relative space-y-[22px]">
                {/* Thin dashed vertical line running through number circles */}
                <div className="absolute left-[17px] top-[20px] bottom-[20px] w-0 border-l-2 border-dashed border-[#FF7A00]/40 pointer-events-none" />

                {/* Step 1 */}
                <div className="relative flex items-start gap-3.5 group animate-stepFade" style={{ animationDelay: '0ms' }}>
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-poppins font-bold text-[14px] shrink-0 shadow-[0_4px_12px_rgba(255,122,0,0.30)] ring-2 ring-[#FF7A00]/20 ring-offset-2 ring-offset-[#FFF8F1] transition-transform duration-200 group-hover:scale-[1.08] relative z-10"
                    style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                  >
                    1
                  </div>
                  <div className="pt-0.5 flex-1 min-w-0">
                    <h4 className="font-poppins font-semibold text-[16px] text-[#000000] leading-tight">
                      Post Your Request
                    </h4>
                    <p className="font-inter text-[14px] text-[#3D3D3D] leading-[1.6] mt-1">
                      Fill out this quick form. The <span className="font-semibold text-black">more details</span>, the better.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-3.5 group animate-stepFade" style={{ animationDelay: '100ms' }}>
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-poppins font-bold text-[14px] shrink-0 shadow-[0_4px_12px_rgba(255,122,0,0.30)] ring-2 ring-[#FF7A00]/20 ring-offset-2 ring-offset-[#FFF8F1] transition-transform duration-200 group-hover:scale-[1.08] relative z-10"
                    style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                  >
                    2
                  </div>
                  <div className="pt-0.5 flex-1 min-w-0">
                    <h4 className="font-poppins font-semibold text-[16px] text-[#000000] leading-tight">
                      Receive Quotes
                    </h4>
                    <p className="font-inter text-[14px] text-[#3D3D3D] leading-[1.6] mt-1">
                      Available professionals in your area will send you their <span className="font-semibold text-black">price estimates</span>.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-3.5 group animate-stepFade" style={{ animationDelay: '200ms' }}>
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-poppins font-bold text-[14px] shrink-0 shadow-[0_4px_12px_rgba(255,122,0,0.30)] ring-2 ring-[#FF7A00]/20 ring-offset-2 ring-offset-[#FFF8F1] transition-transform duration-200 group-hover:scale-[1.08] relative z-10"
                    style={{ background: 'linear-gradient(180deg, #FF9F0A 0%, #F94D1A 100%)' }}
                  >
                    3
                  </div>
                  <div className="pt-0.5 flex-1 min-w-0">
                    <h4 className="font-poppins font-semibold text-[16px] text-[#000000] leading-tight">
                      Choose the Best
                    </h4>
                    <p className="font-inter text-[14px] text-[#3D3D3D] leading-[1.6] mt-1">
                      Review their profiles, compare prices, and <span className="font-semibold text-black">hire the perfect match</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-8 pt-5 border-t border-[#E8E2DB]">
                <div 
                  className="w-full py-2.5 px-3 rounded-full flex items-center justify-center gap-2 border"
                  style={{
                    backgroundColor: 'rgba(46, 158, 91, 0.12)',
                    borderColor: 'rgba(46, 158, 91, 0.3)'
                  }}
                >
                  <svg className="w-4 h-4 text-[#2E9E5B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="16 9 10 15 7 12" />
                  </svg>
                  <span className="text-[#1F7A44] font-poppins font-semibold text-[14px]">
                    100% Free to Broadcast
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostJob;
