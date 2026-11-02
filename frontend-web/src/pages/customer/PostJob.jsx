import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { DISTRICTS } from '../../constants/districts';
import { 
  Briefcase, Calendar, MapPin, DollarSign, 
  ChevronRight, ChevronLeft, UploadCloud, Shield, Clock, Info, Edit3, ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { ALL_SERVICES } from '../../constants/allServices';

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
  const [selectedSubJob, setSelectedSubJob] = useState('');
  const [budgetType, setBudgetType] = useState('open');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const { user } = useAuthStore();
  const [currentView, setCurrentView] = useState('form'); // 'form' or 'location'

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        district: prev.district || user.district || '',
        city: prev.city || user.city || '',
        streetAddress: prev.streetAddress || user.streetAddress || user.address || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Full list of 22 Categories matching Dashboard.jsx

  // Parse 15 Main Service Categories and their catalog of jobs from ALL_SERVICES
  const serviceCategories = ALL_SERVICES.map(catGroup => {
    const name = catGroup.category.trim();
    const parsedJobs = catGroup.jobs.map(jobStr => {
      const match = jobStr.match(/^(.*?)\s*\((.*?)\)$/);
      return {
        title: match ? match[1].trim() : jobStr.trim(),
        details: match ? match[2].trim() : ''
      };
    });
    return {
      rawCategory: catGroup.category,
      name,
      jobs: parsedJobs
    };
  });

  // State for selected main category (e.g. "Home Repairs & Maintenance")
  const [selectedMainCategory, setSelectedMainCategory] = useState(() => {
    if (location.state?.category) {
      // Find if location.state.category matches any main category or a subjob
      const found = serviceCategories.find(c => 
        c.name.toLowerCase().includes(location.state.category.toLowerCase()) ||
        c.jobs.some(j => j.title.toLowerCase().includes(location.state.category.toLowerCase()))
      );
      return found ? found.name : serviceCategories[0].name;
    }
    return serviceCategories[0]?.name || '';
  });

    const handleMainCategorySelect = (catName) => {
    setSelectedMainCategory(catName);
    // Auto-update category if not selected yet
    const group = serviceCategories.find(c => c.name === catName);
    if (group && group.jobs.length > 0) {
      // keep current or clear
    }
  };

  const handleJobSelect = (jobObj) => {
    // Map jobObj to formData.category for backend
    // E.g., if job is "Plumbing", backend Category matches "Plumbing"
    const jobTitle = jobObj.title;
    setFormData(prev => ({
      ...prev,
      category: jobTitle,
      jobDescription: (!prev.jobDescription || prev.jobDescription.startsWith('I need help with'))
        ? `I need help with ${jobTitle.toLowerCase()} (${jobObj.details || 'general service'}). `
        : prev.jobDescription
    }));
    setSelectedSubJob(jobTitle);
  };

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
        title: formData.category ? `${formData.category} Request` : `${selectedMainCategory} Job`,
        subJob: selectedSubJob,
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
    <div className="max-w-7xl mx-auto space-y-5 px-5 sm:px-6 pt-3 sm:pt-4 pb-10">
      
      {/* Header */}
      <div>
        <Link 
          to="/customer/dashboard" 
          aria-label="Back to dashboard"
          className="inline-flex items-center text-gray-700 hover:text-black transition-colors mb-1 -ml-1 py-1 pr-2 group"
        >
          <ChevronLeft size={26} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900">Broadcast a Job</h1>
        <p className="text-gray-500 mt-1">Get quotes from available professionals in your area within minutes.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        
        {/* LEFT COLUMN - Wizard Form */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
            


            <form onSubmit={(e) => {
    if (currentView === 'location') {
      e.preventDefault();
      setCurrentView('form');
      return;
    }
    handleSubmit(e);
  }}>
              
              {/* STEP 1: JOB DETAILS */}
              {step === 1 && currentView === 'form' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you need help with?</h2>
                    <p className="text-gray-500 mb-6">Select a category and describe the problem.</p>
                  </div>

                  <div>
                    {/* Step 1: Main Category Selection */}
                    <div className="mb-3">
                      <label className="block text-[18px] font-bold text-gray-900">
                        Select Category <span className="text-[#FF7A00]">*</span>
                      </label>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-2.5 border-0">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-56 sm:max-h-none overflow-y-auto sm:overflow-visible custom-scrollbar p-1">
                        {serviceCategories.map((cat, idx) => {
                          const isSelected = selectedMainCategory === cat.name;
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => handleMainCategorySelect(cat.name)}
                              className={`rounded-xl p-3 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer border-2 ${
                                isSelected
                                  ? 'border-[#FF7A00] bg-[#FFF8F1] shadow-sm ring-2 ring-[#FF7A00]/20 -translate-y-0.5'
                                  : 'bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
                              }`}
                            >
                              
                              <div className={`font-bold text-xs leading-tight ${isSelected ? 'text-[#E86100]' : 'text-gray-700'}`}>
                                {cat.name}
                              </div>
                              <span className="text-[10px] text-gray-400 mt-1 font-medium">
                                {cat.jobs.length} jobs
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Jobs list under the selected Main Category */}
                    {selectedMainCategory && (
                      <div className="mt-6">
                        {/* Heading placed OUTSIDE the box with black text */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                          <div>
                            <label className="block text-[18px] font-bold text-gray-900">
                              Choose Job under "{selectedMainCategory}" <span className="text-[#FF7A00]">*</span>
                            </label>
                          </div>
                          {formData.category && (
                            <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 bg-[#FFF8F1] text-[#E86100] border border-[#FF7A00]/30 rounded-full shadow-xs">
                              Selected: {formData.category}
                            </span>
                          )}
                        </div>

                        <div className="p-[18px] sm:p-5 rounded-2xl bg-white border-0 shadow-2xs transition-all duration-300">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                          {serviceCategories
                            .find(c => c.name === selectedMainCategory)
                            ?.jobs.map((job, jIdx) => {
                              const isJobSelected = formData.category === job.title;
                              return (
                                <button
                                  type="button"
                                  key={jIdx}
                                  onClick={() => handleJobSelect(job)}
                                  className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                                    isJobSelected
                                      ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm ring-2 ring-[#FF7A00]/30'
                                      : 'bg-white text-gray-800 border-[#E8E2DB] hover:border-[#FF7A00] hover:bg-orange-50/30'
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full mb-1">
                                    <span className={`font-bold text-[15px] leading-snug ${isJobSelected ? 'text-white' : 'text-gray-900'}`}>
                                      {job.title}
                                    </span>
                                    {isJobSelected ? (
                                      <span className="w-5 h-5 rounded-full bg-white text-[#FF7A00] flex items-center justify-center text-xs font-black shrink-0 ml-1">✓</span>
                                    ) : (
                                      <span className="text-gray-300 text-sm">○</span>
                                    )}
                                  </div>
                                  {job.details && (
                                    <p className={`text-[11px] line-clamp-2 leading-relaxed ${isJobSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                      {job.details}
                                    </p>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
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

                  {/* Service Location Summary Card with Edit Address Button */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="block text-sm font-bold text-gray-900">
                          Job Location & Address <span className="text-[#FF7A00]">*</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Where does the service need to take place?
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentView('location')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FFF8F1] text-[#E86100] border border-[#FF7A00]/30 hover:bg-[#FFEEDC] transition-all"
                      >
                        <Edit3 size={13} />
                        <span>Edit Address</span>
                      </button>
                    </div>

                    {/* Summary card of current address */}
                    <div 
                      onClick={() => setCurrentView('location')}
                      className="p-4 rounded-2xl bg-gray-50 hover:bg-[#FFFBF7] border border-gray-200 hover:border-[#FF7A00]/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#E86100] shrink-0 shadow-2xs group-hover:bg-[#FFF8F1]">
                          <MapPin size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Service Address
                          </div>
                          <div className="text-sm font-semibold text-gray-900 truncate mt-0.5">
                            {[formData.streetAddress, formData.city, formData.district].filter(Boolean).join(', ') || 'No address set — tap to add address'}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#E86100] shrink-0 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Change <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* LOCATION DETAILS PAGE (Separate View when clicking Edit Address) */}
              {currentView === 'location' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setCurrentView('form')}
                      className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors py-1 pr-3"
                    >
                      <ChevronLeft size={18} strokeWidth={2.5} />
                      <span>Back to Job Details</span>
                    </button>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Service Location</h2>
                    <p className="text-gray-500 text-sm">Where should the professional arrive to complete the work?</p>
                  </div>

                  {/* Form fields styled exactly like the screenshot */}
                  <div className="bg-white rounded-[20px] border border-gray-200 p-5 md:p-6 space-y-5 shadow-2xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          District <span className="text-red-500">*</span>
                        </label>
                        <select 
                          name="district" 
                          value={formData.district} 
                          onChange={handleInputChange} 
                          className="w-full border-2 border-gray-100 rounded-xl py-3 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium bg-white"
                        >
                          <option value="">Select District</option>
                          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          City / Town <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="city" 
                          value={formData.city} 
                          onChange={handleInputChange} 
                          placeholder="e.g. Nugegoda" 
                          className="w-full border-2 border-gray-100 rounded-xl py-3 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium bg-white" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="streetAddress" 
                        value={formData.streetAddress} 
                        onChange={handleInputChange} 
                        placeholder="e.g. 123 Main Street" 
                        className="w-full border-2 border-gray-100 rounded-xl py-3 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium bg-white" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2.5">
                        Pin Exact Location (Optional)
                      </label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Option 1: GPS Location */}
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
                              () => {
                                toast.dismiss(toastId);
                                toast.error("Could not get your location. Please check permissions or use the map.");
                              },
                              { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
                            );
                          }}
                          className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:bg-amber-50 transition-colors group text-left shadow-2xs"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-white group-hover:text-primary transition-colors text-gray-500 shrink-0">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">Use GPS Location</div>
                            <div className="text-xs text-gray-500 mt-0.5">Auto-locate where you are</div>
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
                          className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:bg-amber-50 transition-colors group text-left shadow-2xs"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-white group-hover:text-primary transition-colors text-gray-500 shrink-0">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">{showMap ? 'Hide Map' : 'Set on Map'}</div>
                            <div className="text-xs text-gray-500 mt-0.5">Drop a pin on exact location</div>
                          </div>
                        </button>
                      </div>

                      {/* Map View Container */}
                      {showMap && (
                        <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                          <MapLocationPicker 
                            onLocationChange={setMapCoordinates} 
                            initialPosition={mapCoordinates ? [mapCoordinates.lat, mapCoordinates.lng] : null}
                          />
                        </div>
                      )}

                      <div className="mt-4 flex items-start bg-blue-50 text-blue-700 p-3.5 rounded-xl text-xs font-medium">
                        <Info size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                        <p>For your privacy, your exact street address and coordinates are hidden. They are only revealed to the specific worker you choose to hire.</p>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setCurrentView('form')}
                        className="bg-primary text-white font-bold px-7 py-3 rounded-xl hover:bg-amber-600 transition-colors shadow-md shadow-primary/20"
                      >
                        Save &amp; Return to Job
                      </button>
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
              {step < 3 && currentView === 'form' && (
                <div className="flex justify-end items-center mt-10 pt-6 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary text-white font-bold px-10 py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-primary/20 flex items-center disabled:opacity-50"
                  >
                    {isSubmitting ? 'Broadcasting...' : 'Broadcast Job Now'}
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostJob;
