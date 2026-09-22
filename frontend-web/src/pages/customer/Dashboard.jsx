import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import WorkerCard from '../../components/worker/WorkerCard';
import { DISTRICTS } from '../../constants/districts';
import { 
  Search, MapPin, Briefcase, Filter, X, 
  Wrench, Zap, Hammer, Broom, Paintbrush, 
  Wind, HardHat, TreePine, Bug, Home, 
  Monitor, ShieldCheck, Truck, Tv, PenTool, 
  Grid, Camera, ChefHat, Sparkles, Dumbbell, 
  Laptop, BookOpen
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

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

  // 22 Categories total with starting prices and search keywords
  const categories = [
    { id: 'Plumbing', name: 'Plumbing', price: 1500, keywords: ['plumber', 'pipe', 'leak', 'water'] }, 
    { id: 'Electrical', name: 'Electrical', price: 1200, keywords: ['electrician', 'wire', 'power', 'light'] }, 
    { id: 'Carpentry', name: 'Carpentry', price: 2000, keywords: ['carpenter', 'wood', 'furniture', 'door'] },
    { id: 'Cleaning', name: 'Cleaning', price: 2500, keywords: ['cleaner', 'maid', 'dust', 'wash'] },
    { id: 'Painting', name: 'Painting', price: 3000, keywords: ['painter', 'wall', 'color'] },
    { id: 'AC Repair', name: 'AC Repair', price: 2000, keywords: ['air condition', 'cooling', 'hvac'] },
    { id: 'Masonry', name: 'Masonry', price: 2200, keywords: ['mason', 'brick', 'concrete', 'cement'] },
    { id: 'Gardening', name: 'Gardening', price: 1800, keywords: ['gardener', 'lawn', 'grass', 'plant'] },
    { id: 'Pest Control', name: 'Pest Control', price: 3500, keywords: ['bug', 'insect', 'rat', 'termite'] },
    { id: 'Roofing', name: 'Roofing', price: 4000, keywords: ['roof', 'ceiling', 'leak'] },
    { id: 'Appliance Repair', name: 'Appliances', price: 1500, keywords: ['fridge', 'washer', 'oven', 'machine'] },
    { id: 'CCTV Installation', name: 'Security', price: 2500, keywords: ['camera', 'cctv', 'alarm'] },
    { id: 'Moving', name: 'Moving', price: 5000, keywords: ['mover', 'pack', 'transport', 'truck'] },
    { id: 'TV Mounting', name: 'Mounting', price: 1000, keywords: ['tv', 'mount', 'bracket', 'hang'] },
    { id: 'Handyman', name: 'Handyman', price: 1200, keywords: ['fix', 'repair', 'general'] },
    { id: 'Tiling', name: 'Tiling', price: 2800, keywords: ['tile', 'floor', 'ceramic'] },
    { id: 'Photography', name: 'Photography', price: 8000, keywords: ['photo', 'camera', 'shoot', 'video'] },
    { id: 'Catering', name: 'Catering', price: 10000, keywords: ['food', 'cook', 'chef', 'party'] },
    { id: 'Beauty', name: 'Beauty', price: 3500, keywords: ['makeup', 'hair', 'salon', 'spa'] },
    { id: 'Fitness', name: 'Fitness', price: 2000, keywords: ['gym', 'trainer', 'workout', 'yoga'] },
    { id: 'IT Support', name: 'IT Support', price: 1500, keywords: ['computer', 'laptop', 'network', 'wifi'] },
    { id: 'Tutoring', name: 'Tutoring', price: 1000, keywords: ['tutor', 'teacher', 'math', 'science', 'english'] }
  ];

  const filteredCategories = categories.filter(c => {
    const query = filters.searchQuery.toLowerCase();
    if (!query) return true;
    return c.name.toLowerCase().includes(query) || 
           c.id.toLowerCase().includes(query) || 
           (c.keywords && c.keywords.some(k => k.includes(query) || query.includes(k)));
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
  }, [activeFilters]); // Refetch when activeFilters change

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-amber-600 rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 w-64 h-64 bg-white rounded-full -mt-20 -mr-20"></div>
        <div className="relative z-10">
          <p className="text-amber-100 font-medium mb-1 tracking-wide uppercase text-sm">{today}</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            {getGreeting()}, {user?.firstName}! 👋
          </h1>
          <p className="text-amber-50 max-w-xl text-lg">
            Welcome back to DoorStep. Finding a verified professional in your area is just a quick search away.
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#0f172a] bg-gradient-to-br from-slate-900 via-[#1e293b] to-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white drop-shadow-sm">
            Find the right professional for the job
          </h2>
          <p className="text-slate-300 text-lg mb-8 font-medium">
            Search from thousands of verified and trusted workers across Sri Lanka.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
            <span className="text-slate-300 text-base font-medium">Not sure exactly who to hire for your problem?</span>
            <button 
              onClick={() => navigate('/customer/post-job')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-lg px-8 py-3.5 rounded-full transition-all duration-300 flex items-center gap-2 hover:-translate-y-1 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] border border-amber-400/50"
            >
              Post a Job <span className="text-2xl leading-none ml-1">&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {viewMode === 'categories' ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[75vh]">
            <div className="flex-shrink-0 bg-gray-50 p-4 sm:px-6 md:px-8 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 z-10 shadow-sm">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 whitespace-nowrap mr-auto">Explore Services</h2>
              
              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-xl p-1.5 flex items-center shadow-sm border border-gray-200 w-full md:w-72 lg:w-96 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                  <div className="flex items-center flex-1 w-full px-3 text-gray-900">
                    <Search size={18} className="text-primary mr-2 flex-shrink-0" />
                    <input 
                      type="text" 
                      name="searchQuery"
                      value={filters.searchQuery}
                      onChange={handleFilterChange}
                      placeholder="Find a service (e.g. Plumbing)..." 
                      className="w-full py-1.5 bg-transparent outline-none placeholder-gray-400 font-bold text-gray-900 text-sm"
                    />
                  </div>
                </form>

                <span className="hidden lg:inline-block text-sm font-bold text-gray-500 bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm whitespace-nowrap">
                  {filteredCategories.length} Categories
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredCategories.map((c) => (
                  <div 
                    key={c.id}
                    onClick={() => handleCategoryCardClick(c.id)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer border border-gray-100 group flex flex-col"
                  >
                    <div className="h-32 sm:h-40 overflow-hidden relative bg-gray-100">
                      <img 
                        src={`https://loremflickr.com/400/300/${c.name.toLowerCase().replace(/ & /g, ',').replace(/ /g, ',')},work`} 
                        alt={c.name} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-4 sm:p-5 text-center flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">{c.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={clearAllFilters}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm"
                >
                  <span className="font-bold text-lg">&larr;</span>
                </button>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    {activeFilters.category || activeFilters.searchQuery ? (
                      <>Results for <span className="text-primary">{activeFilters.category || activeFilters.searchQuery}</span></>
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
                  <div className={`block w-10 h-6 rounded-full transition-colors ${filters.verifiedOnly ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.verifiedOnly ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 font-bold text-sm text-gray-700 group-hover:text-primary transition-colors">
                  Verified Pros Only
                </div>
              </label>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-72 bg-white animate-pulse rounded-2xl border border-gray-100 shadow-sm"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {workers.map((worker, index) => (
                  <WorkerCard key={`${worker._id}-${index}`} worker={worker} />
                ))}
              </div>
            )}
            
            {!loading && workers.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto mt-8">
                <div className="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No professionals found</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">Try adjusting your filters or searching in a different location.</p>
                <button 
                  type="button"
                  onClick={clearAllFilters}
                  className="bg-primary text-white font-bold px-10 py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-md shadow-primary/20"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
