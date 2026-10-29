import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import WorkerCard, { WorkerCardSkeleton } from '../../components/worker/WorkerCard';
import { DISTRICTS } from '../../constants/districts';
import { 
  Search, MapPin, Briefcase, Filter, X, 
  Wrench, Zap, Hammer, Broom, Paintbrush, 
  Wind, HardHat, TreePine, Bug, Home, 
  Monitor, ShieldCheck, Truck, Tv, PenTool, 
  Grid, Camera, ChefHat, Sparkles, Dumbbell, 
  Laptop, BookOpen, ArrowRight,
  ChevronUp
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ALL_SERVICES } from '../../constants/allServices';
import { filterJobsByPrefix } from '../../utils/jobSearch';

const Dashboard = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState('categories'); // 'categories' or 'workers'
  const [filters, setFilters] = useState({
    district: '',
    category: '',
    verifiedOnly: false,
    searchQuery: ''
  });
  const [postJobInput, setPostJobInput] = useState('');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [activeBooking, setActiveBooking] = useState(null);
  const [lastCompletedBooking, setLastCompletedBooking] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategoryExpand = (catName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // 22 Categories total with starting prices and search keywords
  const categories = [
    { id: 'Plumbing', name: 'Plumbing', price: 1500, keywords: ['plumber', 'pipe', 'leak', 'water', 'tap', 'drain', 'plumng', 'plumbinh', 'plumbin'] }, 
    { id: 'Electrical', name: 'Electrical', price: 1200, keywords: ['electrician', 'wire', 'power', 'light', 'socket', 'electric', 'electrion', 'electrcian', 'wiring'] }, 
    { id: 'Carpentry', name: 'Carpentry', price: 2000, keywords: ['carpenter', 'wood', 'furniture', 'door', 'cabinet', 'cerpentry', 'carpentri'] },
    { id: 'Cleaning', name: 'Cleaning', price: 2500, keywords: ['cleaner', 'maid', 'dust', 'wash', 'sweep', 'housekeeping', 'cleanin', 'clening'] },
    { id: 'Painting', name: 'Painting', price: 3000, keywords: ['painter', 'wall', 'color', 'colour', 'paint', 'paintin', 'paiting'] },
    { id: 'AC Repair', name: 'AC Repair', price: 2000, keywords: ['air condition', 'cooling', 'hvac', 'fan', 'ac', 'aircon', 'air con', 'aircondition', 'ac repir'] },
    { id: 'Masonry', name: 'Masonry', price: 2200, keywords: ['mason', 'brick', 'concrete', 'cement', 'plaster', 'masnory', 'masanry'] },
    { id: 'Gardening', name: 'Gardening', price: 1800, keywords: ['gardener', 'lawn', 'grass', 'plant', 'tree', 'hedge', 'gardenin', 'gardenng'] },
    { id: 'Pest Control', name: 'Pest Control', price: 3500, keywords: ['bug', 'insect', 'rat', 'termite', 'cockroach', 'mosquito', 'pest'] },
    { id: 'Roofing', name: 'Roofing', price: 4000, keywords: ['roof', 'ceiling', 'leak', 'tile', 'roofin', 'rufing'] },
    { id: 'Appliance Repair', name: 'Appliances', price: 1500, keywords: ['fridge', 'washer', 'oven', 'machine', 'appliance', 'washing machine', 'refrigerator', 'microwave'] },
    { id: 'CCTV Installation', name: 'Security', price: 2500, keywords: ['camera', 'cctv', 'alarm', 'security', 'cctv instalation'] },
    { id: 'Moving', name: 'Moving', price: 5000, keywords: ['mover', 'pack', 'transport', 'truck', 'shifting', 'move', 'relocate'] },
    { id: 'TV Mounting', name: 'Mounting', price: 1000, keywords: ['tv', 'mount', 'bracket', 'hang', 'television', 'tv mounting'] },
    { id: 'Handyman', name: 'Handyman', price: 1200, keywords: ['fix', 'repair', 'general', 'handiman', 'handymen', 'all round'] },
    { id: 'Tiling', name: 'Tiling', price: 2800, keywords: ['tile', 'floor', 'ceramic', 'tiiling', 'flooring'] },
    { id: 'Photography', name: 'Photography', price: 8000, keywords: ['photo', 'camera', 'shoot', 'video', 'photographer', 'photgraphy', 'photogrphy'] },
    { id: 'Catering', name: 'Catering', price: 10000, keywords: ['food', 'cook', 'chef', 'party', 'catering', 'caterin'] },
    { id: 'Beauty', name: 'Beauty', price: 3500, keywords: ['makeup', 'hair', 'salon', 'spa', 'beautician', 'beuty', 'beauti'] },
    { id: 'Fitness', name: 'Fitness', price: 2000, keywords: ['gym', 'trainer', 'workout', 'yoga', 'fitnes', 'fittness', 'exercise'] },
    { id: 'IT Support', name: 'IT Support', price: 1500, keywords: ['computer', 'laptop', 'network', 'wifi', 'it', 'tech', 'internet', 'software', 'hardware'] },
    { id: 'Tutoring', name: 'Tutoring', price: 1000, keywords: ['tutor', 'teacher', 'math', 'science', 'english', 'lesson', 'tutorin', 'tutoring'] }
  ];

  // --- Fuzzy Search Helpers ---
  // Levenshtein distance for typo tolerance
  const levenshtein = (a, b) => {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
  };

  const fuzzyMatch = (query, target) => {
    const q = query.toLowerCase().trim();
    const t = target.toLowerCase();
    if (!q) return false;
    if (t.includes(q)) return true;
    // Allow up to 2 typos for words longer than 4 chars, 1 typo for shorter
    const threshold = q.length > 4 ? 2 : 1;
    return levenshtein(q, t) <= threshold || (q.length >= 4 && levenshtein(q, t.slice(0, q.length)) <= 1);
  };

  const getSuggestions = (query) => {
    if (!query || query.trim().length === 0) return [];
    return filterJobsByPrefix(query.trim(), 8);
  };

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const searchRef = React.useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setFilters({ ...filters, searchQuery: val });
    setSuggestions(getSuggestions(val));
    setShowSuggestions(true);
    setHighlightedIdx(-1);
  };

  const handleSuggestionClick = (job) => {
    const jobTitle = job.title || job.name;
    setFilters({ ...filters, searchQuery: jobTitle });
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Redirect directly to the particular job's dedicated page!
    navigate(`/customer/category/${encodeURIComponent(jobTitle)}`);
  };

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && highlightedIdx >= 0) { e.preventDefault(); handleSuggestionClick(suggestions[highlightedIdx]); }
    else if (e.key === 'Escape') { setShowSuggestions(false); setHighlightedIdx(-1); }
  };

  const filteredCategories = categories.filter(c => {
    const query = filters.searchQuery.toLowerCase();
    if (!query) return true;
    return c.name.toLowerCase().includes(query) || 
           c.id.toLowerCase().includes(query) || 
           (c.keywords && c.keywords.some(k => k.includes(query) || query.includes(k))) ||
           fuzzyMatch(query, c.name) || c.keywords.some(k => fuzzyMatch(query, k));
  });

  // We'll use a separate state to trigger fetch when clicking "Search" button
  // so we don't spam the API on every keystroke
  const [activeFilters, setActiveFilters] = useState(filters);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/customer/dashboard', { params: activeFilters });
        // The backend now returns actual filtered results
        setWorkers(res.data?.data?.recommendedWorkers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, [activeFilters]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const res = await api.get('/bookings');
        if (res.data?.data) {
          const allB = res.data.data;
          const active = allB.find(b => ['pending', 'accepted', 'en_route', 'arrived', 'in_progress'].includes(b.status));
          setActiveBooking(active || null);
          const completed = allB.find(b => b.status === 'completed');
          setLastCompletedBooking(completed || null);
        }
      } catch (err) {
        console.error('Failed to fetch customer bookings', err);
      }
    };
    fetchUserBookings();
  }, []); // Refetch when activeFilters change

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => {
      const newFilters = { ...prev, [name]: newValue };
      
      // Auto-search when dropdowns or checkboxes change, but NOT when typing in the input
      if (name !== 'searchQuery') {
        setActiveFilters(newFilters);
      }
      
      return newFilters;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveFilters(filters);
    setViewMode('workers');
  };

  const handleCategoryCardClick = (categoryId) => {
    navigate(`/customer/category/${encodeURIComponent(categoryId)}`);
  };

  const clearAllFilters = () => {
    const cleared = { district: '', category: '', verifiedOnly: false, searchQuery: '' };
    setFilters(cleared);
    setActiveFilters(cleared);
    setViewMode('categories');
  };

  const handlePostJobQuickSubmit = (e) => {
    e.preventDefault();
    navigate('/customer/post-job', {
      state: {
        description: postJobInput.trim()
      }
    });
  };

  const handlePostJobChipClick = (catName) => {
    navigate('/customer/post-job', {
      state: {
        category: catName
      }
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });


  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-94px)] bg-white">
      {viewMode === 'categories' ? (
        <>
          {/* Hero Section */}
                    {/* Hero Section Redesign */}
          <section className="relative w-full min-h-[380px] md:min-h-[90vh] lg:min-h-[96vh] bg-[#000000] flex flex-col md:justify-center overflow-hidden">
            
            {/* Background Split Layout */}
            <div className="absolute inset-0 w-full h-full flex flex-col md:flex-row">
              <div className="hidden md:block w-[42%] bg-[#000000]"></div>
              <div className="w-full h-[200px] sm:h-[240px] md:h-full md:w-[58%] relative overflow-hidden">
                <img 
                  src="/customer-hero-bg.jpg" 
                  alt="A DoorStep electrician at work while a smiling homeowner relaxes" 
                  className="w-full h-full object-cover object-[center_right] animate-[slowZoomOut_1.2s_ease-out_forwards]"
                />
                {/* Mobile Fade Overlay */}
                <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-[#000000] pointer-events-none"></div>
              </div>
            </div>

            {/* Desktop Fade Overlay */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#000000] pointer-events-none" style={{ background: 'linear-gradient(90deg, #000000 0%, #000000 36%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.1) 100%)' }}></div>

            {/* Subtle Decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none mix-blend-screen opacity-50"></div>
            <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[400px] h-[400px] bg-[#FF7A00]/15 rounded-full blur-[100px] pointer-events-none"></div>

            <style dangerouslySetInnerHTML={{__html: `
              @keyframes slowZoomOut {
                from { transform: scale(1.06); }
                to { transform: scale(1); }
              }
              @keyframes pulseGreen {
                0% { box-shadow: 0 0 0 0 rgba(46, 158, 91, 0.7); }
                70% { box-shadow: 0 0 0 6px rgba(46, 158, 91, 0); }
                100% { box-shadow: 0 0 0 0 rgba(46, 158, 91, 0); }
              }
              @keyframes floatCard {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
              }
            `}} />

            {/* Bottom Edge Line */}
            

            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-12 pt-[140px] sm:pt-[170px] md:pt-0 pb-7 sm:pb-12 flex flex-col">
              
              {/* Content Container */}
              <div className="w-full max-w-[620px] text-left">
                
                {/* Headline */}
                <h1 className="text-[26px] sm:text-[36px] md:text-[48px] lg:text-[60px] font-poppins font-bold text-white leading-[1.15] mb-2 sm:mb-4">
                  Hello, <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] truncate max-w-[200px] md:max-w-[300px] align-bottom">
                    {user?.firstName || 'Nobert'}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-white/80 font-inter text-[15px] sm:text-[18px] md:text-[20px] leading-[1.5] mb-4 sm:mb-8">
                  What can we help you fix or clean today?
                </p>

                {/* Search Bar with Fuzzy Autocomplete */}
                <div ref={searchRef} className="relative w-full">
                  <form onSubmit={handleSearchSubmit} className="relative w-full h-[54px] sm:h-[60px] md:h-[64px] bg-white rounded-[14px] sm:rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex items-center p-1.5 sm:p-2 group transition-all duration-300 focus-within:ring-4 focus-within:ring-[#FF7A00]/25">
                    <div className="pl-3 sm:pl-4 pr-1.5 sm:pr-3 flex items-center justify-center pointer-events-none">
                      <Search className="text-[#555555] w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#FF7A00] transition-colors shrink-0" />
                    </div>
                    <input 
                      type="text" 
                      placeholder={isMobile ? "Search any home service..." : "Search any home service (e.g. AC repair, plumbing)..."} 
                      className="flex-1 min-w-0 h-full bg-transparent border-none outline-none font-inter text-[14px] sm:text-[16px] font-medium text-[#111111] placeholder-[#777777] pr-2"
                      value={filters.searchQuery}
                      onChange={handleSearchInputChange}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                      autoComplete="off"
                    />
                    {filters.searchQuery && (
                      <button type="button" onClick={() => { setFilters({...filters, searchQuery: ''}); setSuggestions([]); setShowSuggestions(false); }} className="px-2 text-[#6B6B6B] hover:text-[#000000] shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    )}
                    <button type="submit" className="h-full px-3.5 sm:px-6 bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] text-white font-semibold text-[13px] sm:text-[15px] rounded-[10px] sm:rounded-[12px] flex items-center gap-1 sm:gap-2 shrink-0 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 group/btn focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 focus:ring-offset-white">
                      <span>Search</span>
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  </form>

                  {/* Autocomplete Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-[68px] left-0 right-0 bg-white rounded-[14px] shadow-[0_16px_40px_rgba(0,0,0,0.18)] border border-[#E8E2DB] z-50 overflow-hidden divide-y divide-[#F3EDE7] animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-2.5 bg-[#FAF8F5] flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Matching Jobs & Services</span>
                        <span className="text-[11px] text-[#FF7A00] font-semibold">{suggestions.length} found</span>
                      </div>
                      <div className="max-h-[340px] overflow-y-auto">
                        {suggestions.map((job, idx) => (
                          <button
                            key={job.title || idx}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(job); }}
                            onMouseEnter={() => setHighlightedIdx(idx)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-100 ${highlightedIdx === idx ? 'bg-[#FFF8F1]' : 'hover:bg-[#FFF8F1]'}`}
                          >
                            <div className="w-8 h-8 rounded-[8px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Briefcase size={14} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="block text-[15px] font-semibold text-[#000000] truncate">
                                  {job.title}
                                </span>
                                {job.category && (
                                  <span className="text-[11px] font-medium text-[#FF7A00] bg-[#FFF1E3] px-2 py-0.5 rounded-full flex-shrink-0">
                                    {job.category}
                                  </span>
                                )}
                              </div>
                              {job.details && (
                                <span className="block text-[12px] text-[#6B6B6B] truncate mt-0.5">
                                  {job.details}
                                </span>
                              )}
                            </div>
                            <svg className="w-4 h-4 text-[#6B6B6B] flex-shrink-0 mt-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                          </button>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-[#F3EDE7] bg-[#FAFAFA]">
                        <span className="text-[12px] text-[#6B6B6B]">Press <kbd className="bg-[#E8E2DB] text-[#3D3D3D] px-1 py-0.5 rounded text-[11px] font-mono">↑↓</kbd> to navigate, <kbd className="bg-[#E8E2DB] text-[#3D3D3D] px-1 py-0.5 rounded text-[11px] font-mono">Enter</kbd> to select</span>
                      </div>
                    </div>
                  )}

                  {/* No results hint */}
                  {showSuggestions && filters.searchQuery.trim().length >= 1 && suggestions.length === 0 && (
                    <div className="absolute top-[68px] left-0 right-0 bg-white rounded-[14px] shadow-[0_16px_40px_rgba(0,0,0,0.18)] border border-[#E8E2DB] z-50 px-4 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFF1E3] flex items-center justify-center flex-shrink-0">
                        <Search size={14} className="text-[#FF7A00]" />
                      </div>
                      <div>
                        <p className="text-[14px] text-[#3D3D3D]">No service found for <span className="font-semibold">"{filters.searchQuery}"</span></p>
                        <p className="text-[12px] text-[#6B6B6B] mt-0.5">Try "plumbing", "cleaning", "AC repair"…</p>
                      </div>
                    </div>
                  )}
                </div>
                
                

              </div>
            </div>

            
          </section>

          {/* Active Booking Slim Bar */}
          {activeBooking && (
            <div className="w-full bg-white border-b border-[#E8E2DB] h-14 flex items-center px-4 sm:px-6 md:px-12">
              <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A00] shrink-0 animate-pulse" />
                  <p className="text-[14px] text-gray-900 truncate">
                    Active job with <span className="font-semibold">{activeBooking.workerId?.firstName || 'Worker'}</span> for <span className="font-semibold">{activeBooking.serviceTitle}</span>
                  </p>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#FFF1E3] text-[#E85D00] capitalize shrink-0">
                    {activeBooking.status?.replace('_', ' ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/customer/bookings/${activeBooking._id}`)}
                  className="text-[#E86100] hover:text-[#CC5200] font-semibold text-[13px] shrink-0 hover:underline"
                >
                  View
                </button>
              </div>
            </div>
          )}

          {/* Popular Services Section */}
          <section className="services-section bg-white">
            <div className="services-section-header">
              <div className="services-title-group">
                <h2 className="services-section-title">Popular Services</h2>
              </div>
              <a 
                href="#explore-all-services" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  const target = document.getElementById("explore-all-services");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }} 
                className="services-section-right"
              >
                View all services
              </a>
            </div>
            
            <div className="services-grid">
              
              {/* Card 1 */}
              <div onClick={() => handleCategoryCardClick('Plumbing')} className="service-card">
                <div className="service-card-image-wrap">
                  <img src="https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=600&auto=format&fit=crop" alt="Plumbing" />
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Plumbing</h3>
                  <p className="service-card-desc">Taps, leaks & pipe installations</p>
                  <div className="service-card-footer">

                    <span className="book-now-link">Book Now</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div onClick={() => handleCategoryCardClick('Electrical')} className="service-card">
                <div className="service-card-image-wrap">
                  <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop" alt="Electrical" />
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Electrical</h3>
                  <p className="service-card-desc">Wiring, switches & circuit repairs</p>
                  <div className="service-card-footer">

                    <span className="book-now-link">Book Now</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div onClick={() => handleCategoryCardClick('AC Repair')} className="service-card">
                <div className="service-card-image-wrap">
                  <img src="https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop" alt="AC Repair" />
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">AC Repair & Service</h3>
                  <p className="service-card-desc">Filter cleaning, gas refills & repairs</p>
                  <div className="service-card-footer">

                    <span className="book-now-link">Book Now</span>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div onClick={() => handleCategoryCardClick('Cleaning')} className="service-card">
                <div className="service-card-image-wrap">
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop" alt="Home Cleaning" />
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Home Cleaning</h3>
                  <p className="service-card-desc">Deep kitchen, sofa & house sanitizing</p>
                  <div className="service-card-footer">

                    <span className="book-now-link">Book Now</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Don't know who to hire? Post a Job Section Redesign */}
          <section className="w-full bg-white py-10 md:py-16">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
              <div className="relative w-full bg-[#FFF8F1] rounded-[32px] border border-[#E8E2DB] p-7 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                
                {/* Subtle Decorations */}
                {/* 5% black dotted pattern in top-left corner */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] bg-[size:16px_16px] pointer-events-none opacity-60"></div>
                {/* Content Area */}
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
                  
                  {/* Content */}
                  <div className="w-full flex flex-col text-left items-start">
                    
                    {/* Heading */}
                    <h2 className="text-[24px] md:text-[38px] lg:text-[42px] font-poppins font-bold text-[#000000] leading-[1.15] mb-3">
                      Don't know who to hire?
                      <span className="block mt-1 font-bold text-[#000000]">
                        Let the right workers{' '}
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">
                          come to you
                        </span>
                        .
                      </span>
                    </h2>

                    {/* Description */}
                    <p className="text-[#3D3D3D] font-inter text-[16px] md:text-[17px] leading-[1.7] mb-6 max-w-[540px]">
                      Describe what you need and get <span className="font-semibold text-black">quotes</span> from verified workers in <span className="font-semibold text-black">minutes</span>.
                    </p>

                    {/* Post a Job CTA Button */}
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-auto gap-4 mb-2">
                      <button
                        type="button"
                        onClick={() => navigate('/customer/post-job')}
                        className="w-full sm:w-auto h-[52px] px-8 bg-[#000000] text-white font-poppins font-semibold text-[16px] rounded-[14px] flex items-center justify-center gap-2.5 shadow-md hover:bg-[#1C1917] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2"
                      >
                        <span className="text-xl leading-none font-bold">+</span>
                        <span>Post a Job</span>
                        <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </button>
                    </div>

                    {/* Three Mini Steps */}
                    <div className="relative mt-8 pt-6 border-t border-[#E8E2DB]/60 w-full">
                      {/* Dashed line on desktop */}
                      

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative z-10 w-full">
                        {/* Step 1 */}
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-bold text-[14px] flex items-center justify-center shrink-0 shadow-sm">
                            1
                          </div>
                          <div className="text-left">
                            <h4 className="text-[15px] font-poppins font-semibold text-[#000000] leading-tight">
                              Describe the job
                            </h4>
                            <p className="text-[13px] font-inter text-[#6B6B6B] mt-0.5 leading-snug">
                              Tell workers what you need
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-bold text-[14px] flex items-center justify-center shrink-0 shadow-sm">
                            2
                          </div>
                          <div className="text-left">
                            <h4 className="text-[15px] font-poppins font-semibold text-[#000000] leading-tight">
                              Compare quotes
                            </h4>
                            <p className="text-[13px] font-inter text-[#6B6B6B] mt-0.5 leading-snug">
                              Review prices & ratings
                            </p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-bold text-[14px] flex items-center justify-center shrink-0 shadow-sm">
                            3
                          </div>
                          <div className="text-left">
                            <h4 className="text-[15px] font-poppins font-semibold text-[#000000] leading-tight">
                              Choose your worker
                            </h4>
                            <p className="text-[13px] font-inter text-[#6B6B6B] mt-0.5 leading-snug">
                              Hire with full confidence
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Caption with Green Check Icon */}
                    <div className="flex items-center justify-start gap-2 mt-5 text-[13px] font-inter text-[#6B6B6B]">
                      <svg className="w-4 h-4 text-[#2E9E5B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <span>Free to post. Takes about 2 minutes.</span>
                    </div>

                  </div>


                </div>

              </div>
            </div>
          </section>

{/* All Services Categories Sections */}
          <section id="explore-all-services" className="services-section bg-white scroll-mt-24" style={{ paddingTop: '64px', paddingBottom: '96px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto 64px auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.5px' }}>Explore All Services</h2>
              <p style={{ fontSize: '16px', color: '#78716C', marginTop: '12px', paddingLeft: '32px', paddingRight: '32px' }}>Browse our complete catalog of professional home services</p>
            </div>
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
              {ALL_SERVICES.map((cat, index) => {
                const isExpanded = !!expandedCategories[cat.category];
                const displayedJobs = isExpanded ? cat.jobs : cat.jobs.slice(0, 4);

                return (
                  <div key={index} className="category-block">
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #F5F5F4', paddingBottom: '16px' }}>
                      <h3 className="category-block-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                        {cat.category}
                      </h3>
                      {cat.jobs.length > 4 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.innerWidth < 1280) {
                              navigate(`/customer/category/${encodeURIComponent(cat.category)}`);
                            } else {
                              toggleCategoryExpand(cat.category);
                            }
                          }}
                          className="group flex items-center gap-1.5 text-[#FF7A00] hover:text-[#E86100] font-semibold text-[14px] sm:text-[15px] transition-all duration-200 cursor-pointer shrink-0 ml-3"
                          title={isExpanded ? "Show fewer services" : "View all services in this category"}
                        >
                          <span className="hidden sm:inline">{isExpanded ? 'Show Less' : 'View All'}</span>
                          <div className="w-8 h-8 rounded-full bg-[#FFF5EB] group-hover:bg-[#FF7A00] flex items-center justify-center transition-colors duration-200 shadow-sm">
                            {isExpanded && !isMobile ? (
                              <ChevronUp size={16} className="text-[#FF7A00] group-hover:text-white transition-colors duration-200" />
                            ) : (
                              <ArrowRight size={16} className="text-[#FF7A00] group-hover:text-white transition-colors duration-200 group-hover:translate-x-0.5" />
                            )}
                          </div>
                        </button>
                      )}
                    </div>
                    
                    <div className="services-grid">
                      {displayedJobs.map((jobStr, jIndex) => {
                        const match = jobStr.match(/^(.*?)\s*\((.*?)\)$/);
                        const title = match ? match[1] : jobStr;
                        const desc = match ? match[2] : 'Professional service';
                        const fallbackImg = `https://picsum.photos/seed/${encodeURIComponent(title)}/600/400`;
                        
                        return (
                          <div key={jIndex} onClick={() => handleCategoryCardClick(title)} className="service-card">
                            <div className="service-card-image-wrap">
                              <img src={fallbackImg} alt={title} loading="lazy" />
                            </div>
                            <div className="service-card-body">
                              <h3 className="service-card-title">{title}</h3>
                              <p className="service-card-desc">{desc}</p>
                              <div className="service-card-footer">
                                <span className="book-now-link">Book Now</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          </>
      ) : (
        <div className="content-wrapper w-full px-4 sm:px-6 py-12">
          {/* Workers Grid View */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 w-full">
            <div className="flex items-center gap-4">
              <button 
                onClick={clearAllFilters}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#C2410C] transition-colors shadow-sm"
              >
                <span className="font-bold text-lg">&larr;</span>
              </button>
              <div>
                <h2 className="text-2xl font-extrabold text-[#0B1B36]">
                  {activeFilters.category || activeFilters.searchQuery ? (
                    <>Results for <span className="text-[#C2410C]">{activeFilters.category || activeFilters.searchQuery}</span></>
                  ) : 'All Professionals'}
                </h2>
                <p className="text-gray-500 text-sm font-medium">{workers.length} professionals found</p>
              </div>
            </div>
            
            <label className="flex items-center cursor-pointer group bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="verifiedOnly" 
                  checked={filters.verifiedOnly} 
                  onChange={handleFilterChange} 
                  className="sr-only" 
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${filters.verifiedOnly ? 'bg-[#C2410C]' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.verifiedOnly ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 font-bold text-sm text-gray-700 group-hover:text-[#C2410C] transition-colors">
                Verified Pros Only
              </div>
            </label>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <WorkerCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {workers.map((worker, index) => (
                <WorkerCard key={`${worker._id}-${index}`} worker={worker} />
              ))}
            </div>
          )}
          
          {!loading && workers.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto mt-8 w-full">
              <div className="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No professionals found</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">Try adjusting your filters or searching in a different location.</p>
              <button 
                type="button"
                onClick={clearAllFilters}
                className="bg-[#C2410C] text-white font-bold px-10 py-3.5 rounded-xl hover:bg-orange-800 transition-colors shadow-md"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
