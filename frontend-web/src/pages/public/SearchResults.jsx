import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import WorkerCard from '../../components/worker/WorkerCard';
import { Search, MapPin, Filter } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const initialQuery = searchParams.get('q') || '';
  const initialDistrict = searchParams.get('district') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [district, setDistrict] = useState(initialDistrict);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/public/workers/search?q=${query}&district=${district}`);
      if (res.data.success) {
        setWorkers(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch search results', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Find a Professional</h1>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <Search className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                className="w-full outline-none text-gray-700"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <MapPin className="text-gray-400 mr-2" size={20} />
              <select 
                className="w-full outline-none text-gray-700 bg-transparent appearance-none"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Any District</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kandy">Kandy</option>
                {/* Add other districts */}
              </select>
            </div>
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-colors whitespace-nowrap">
              Search Now
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 font-bold text-gray-900 mb-6 pb-4 border-b">
                <Filter size={20} /> Filters
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wider">Availability</h3>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  <span className="text-gray-600 text-sm">Online Now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  <span className="text-gray-600 text-sm">Accepts Emergency Jobs</span>
                </label>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wider">Rating</h3>
                {[4, 3, 2].map(rating => (
                  <label key={rating} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                    <span className="text-gray-600 text-sm">{rating}+ Stars</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Worker List */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">
                {loading ? 'Searching...' : `${workers.length} Results Found`}
              </h2>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none">
                <option>Sort by: Recommended</option>
                <option>Sort by: Highest Rating</option>
                <option>Sort by: Lowest Price</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : workers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {workers.map((worker) => (
                  <WorkerCard key={worker._id} worker={worker} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No workers found</h3>
                <p className="text-gray-500 mb-6">We couldn't find any professionals matching your exact criteria.</p>
                <button 
                  onClick={() => { setQuery(''); setDistrict(''); fetchResults(); }}
                  className="text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
