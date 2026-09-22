import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import api from '../../services/api';
import WorkerCard from '../../components/worker/WorkerCard';
import { DISTRICTS } from '../../constants/districts';

const CategoryService = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [categoryName, district]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customer/dashboard', {
        params: {
          category: categoryName,
          district: district
        }
      });
      setWorkers(res.data.data.recommendedWorkers || []);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Hero Banner (Top 30%) */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden shadow-md">
        <img 
          src={`https://loremflickr.com/1600/600/${categoryName.toLowerCase().replace(/ & /g, ',').replace(/ /g, ',')},work`} 
          alt={`${categoryName} services`} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-12 md:p-16">
          <div className="max-w-7xl mx-auto w-full">
            <button 
              onClick={() => navigate('/customer/dashboard')}
              className="mb-4 text-white/80 hover:text-white flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-full w-fit backdrop-blur-sm transition-colors"
            >
              &larr; Back to Dashboard
            </button>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 shadow-sm drop-shadow-lg">
              {categoryName} Professionals
            </h1>
            <p className="text-gray-200 text-lg sm:text-xl font-medium max-w-2xl drop-shadow-md">
              Find and hire the best-rated {categoryName.toLowerCase()} experts in your area.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-6 z-30">
          
          <div className="flex items-center flex-1 w-full md:max-w-md px-4 text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <MapPin size={20} className="text-primary mr-3 flex-shrink-0" />
            <select 
              value={district} 
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full py-3.5 bg-transparent outline-none text-gray-900 font-bold cursor-pointer"
            >
              <option value="">Filter by any District in Sri Lanka</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

        </div>

        {/* Results Grid */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-extrabold text-gray-900">Available {categoryName}s</h2>
          <span className="text-sm font-semibold text-gray-500 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
            {workers.length} found
          </span>
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
            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">We couldn't find any {categoryName} workers in {district || 'Sri Lanka'}.</p>
            <button 
              type="button"
              onClick={() => setDistrict('')}
              className="bg-primary text-white font-bold px-10 py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-md shadow-primary/20"
            >
              Clear Location Filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryService;
