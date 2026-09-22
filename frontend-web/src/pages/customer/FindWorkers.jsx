import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import WorkerCard from '../../components/worker/WorkerCard';
import { DISTRICTS } from '../../constants/districts';
import { Search, MapPin, Briefcase, Filter, X } from 'lucide-react';

const FindWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    district: '',
    category: '',
    verifiedOnly: false,
    searchQuery: ''
  });

  // Mocked categories for search dropdown
  const categories = [
    { id: '1', name: 'Plumbing' }, 
    { id: '2', name: 'Electrical' }, 
    { id: '3', name: 'Carpentry' },
    { id: '4', name: 'Cleaning' },
    { id: '5', name: 'Painting' }
  ];

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/customer/dashboard');
        // Duplicate them to simulate a grid
        const dummyWorkers = [...(res.data?.data?.recommendedWorkers || []), ...(res.data?.data?.recommendedWorkers || []), ...(res.data?.data?.recommendedWorkers || [])];
        setWorkers(dummyWorkers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, [filters.district, filters.category, filters.verifiedOnly]); // Refetch on filter change

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 w-96 h-96 bg-white rounded-full -mt-32 -mr-32 blur-3xl"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Find the right professional for the job
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Search from thousands of verified and trusted workers across Sri Lanka.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row items-center shadow-lg gap-2">
            <div className="flex items-center flex-1 w-full px-4 text-gray-900 border-b md:border-b-0 md:border-r border-gray-100">
              <Search size={20} className="text-gray-400 mr-3 flex-shrink-0" />
              <input 
                type="text" 
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                placeholder="What service do you need?" 
                className="w-full py-4 bg-transparent outline-none placeholder-gray-400 font-medium"
              />
            </div>
            <div className="flex items-center flex-1 w-full px-4 text-gray-900">
              <MapPin size={20} className="text-gray-400 mr-3 flex-shrink-0" />
              <select 
                name="district" 
                value={filters.district} 
                onChange={handleFilterChange}
                className="w-full py-4 bg-transparent outline-none text-gray-900 font-medium cursor-pointer"
              >
                <option value="">Any Location</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button className="w-full md:w-auto bg-primary text-white font-bold px-10 py-4 rounded-xl hover:bg-amber-600 transition-colors shadow-md shadow-primary/20">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl font-bold text-gray-700 shadow-sm"
        >
          <Filter size={20} /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters Sidebar */}
        <div className={`w-full lg:w-72 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-900">Filters</h3>
              <button className="text-sm font-semibold text-primary hover:underline" onClick={() => setFilters({district:'', category:'', verifiedOnly:false, searchQuery:''})}>
                Clear All
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                  <Briefcase size={16} className="mr-2 text-primary" /> Category
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="category" value="" checked={filters.category === ''} onChange={handleFilterChange} className="w-4 h-4 text-primary focus:ring-primary border-gray-300" />
                    <span className="ml-3 text-sm font-medium text-gray-700">All Categories</span>
                  </label>
                  {categories.map(c => (
                    <label key={c.id} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${filters.category === c.id ? 'border-primary bg-amber-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <input type="radio" name="category" value={c.id} checked={filters.category === c.id} onChange={handleFilterChange} className="w-4 h-4 text-primary focus:ring-primary border-gray-300" />
                      <span className={`ml-3 text-sm font-medium ${filters.category === c.id ? 'text-primary' : 'text-gray-700'}`}>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-900 mb-3">Trust & Safety</label>
                <label className="flex items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="checkbox" name="verifiedOnly" checked={filters.verifiedOnly} onChange={handleFilterChange} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">Verified Pros Only</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Background checked</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Search Results</h2>
            <span className="text-sm font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              {workers.length} professionals found
            </span>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 bg-white animate-pulse rounded-2xl border border-gray-100 shadow-sm"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {workers.map((worker, index) => (
                <WorkerCard key={`${worker._id}-${index}`} worker={worker} />
              ))}
            </div>
          )}
          
          {!loading && workers.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No workers found</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Try adjusting your filters or searching in a different location.</p>
              <button 
                onClick={() => setFilters({district:'', category:'', verifiedOnly:false, searchQuery:''})}
                className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-amber-600 transition-colors shadow-md"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindWorkers;
