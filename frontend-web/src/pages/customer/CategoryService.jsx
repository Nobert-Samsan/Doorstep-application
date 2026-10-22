import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import api from '../../services/api';
import WorkerCard, { WorkerCardSkeleton } from '../../components/worker/WorkerCard';
import { DISTRICTS } from '../../constants/districts';
import { ALL_SERVICES } from '../../constants/allServices';
import '../../assets/css/customer-dashboard.css';

const CategoryService = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('');

  // Find if categoryName matches one of the main categories in ALL_SERVICES
  const matchedCategory = ALL_SERVICES.find(cat => {
    if (!categoryName) return false;
    const cleanCat = cat.category.replace(/^[^\w\s]+/, '').trim().toLowerCase();
    const cleanTarget = categoryName.replace(/^[^\w\s]+/, '').trim().toLowerCase();
    return cleanCat === cleanTarget || cleanCat.includes(cleanTarget) || cleanTarget.includes(cleanCat);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryName]);

  useEffect(() => {
    if (!matchedCategory) {
      fetchWorkers();
    } else {
      setLoading(false);
      setWorkers([]);
    }
  }, [categoryName, district, matchedCategory]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);

      // If it's a main category with sub-jobs, query workers whose services match any of the sub-jobs
      let queryCategory = categoryName;
      if (matchedCategory && matchedCategory.jobs.length > 0) {
        const subJobTitles = matchedCategory.jobs.map(j => {
          const match = j.match(/^(.*?)\s*\(/);
          return match ? match[1].trim() : j.trim();
        });
        queryCategory = subJobTitles.join('|');
      }

      const res = await api.get('/customer/dashboard', {
        params: {
          category: queryCategory,
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

  const getHeroImage = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('plumb')) return 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('electr')) return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('ac') || c.includes('air')) return 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('clean')) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('carpent') || c.includes('wood')) return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('paint')) return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('mason') || c.includes('tile')) return 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15b6?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('garden') || c.includes('lawn')) return 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('roof')) return 'https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('appliance') || c.includes('repair')) return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('cctv') || c.includes('secur')) return 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('pest')) return 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('cook') || c.includes('food')) return 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('tutor') || c.includes('educat')) return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('car') || c.includes('vehic')) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('pet') || c.includes('dog')) return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('health') || c.includes('fit')) return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('mov') || c.includes('shift')) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop';
    if (c.includes('it') || c.includes('tech') || c.includes('comput')) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1920&auto=format&fit=crop';
  };

  const displayCategoryTitle = matchedCategory ? matchedCategory.category : `${categoryName} Professionals`;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Hero Banner matching Home Page Hero height */}
      <div className="relative w-full min-h-[280px] sm:min-h-[360px] md:min-h-[90vh] lg:min-h-[96vh] bg-[#000000] flex flex-col justify-end overflow-hidden shadow-md">
        <img 
          src={getHeroImage(categoryName)} 
          alt={`${categoryName} services`} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 flex flex-col justify-end p-5 sm:p-8 md:p-16 lg:p-24 pb-8 sm:pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto w-full">
            <button 
              onClick={() => navigate('/customer/dashboard')}
              className="mb-6 text-white/90 hover:text-white flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full w-fit backdrop-blur-md transition-all shadow-sm"
            >
              &larr; Back to Dashboard
            </button>
            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-poppins font-extrabold text-white mb-2 sm:mb-4 tracking-tight drop-shadow-lg">
              {displayCategoryTitle}
            </h1>
            <p className="text-white/80 text-sm sm:text-lg md:text-2xl font-inter font-normal max-w-2xl leading-relaxed drop-shadow-md">
              {matchedCategory 
                ? `Browse all verified services under ${matchedCategory.category.replace(/^[^\w\s]+/, '').trim()} and hire trusted professionals in Sri Lanka.`
                : `Find and hire the best-rated ${categoryName.toLowerCase()} experts in your area.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* District Filter Section (Only for individual trades) */}
        {!matchedCategory && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-24 z-30">
            <div className="flex items-center flex-1 w-full md:max-w-md px-4 text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <MapPin size={20} className="text-primary mr-3 flex-shrink-0" />
              <select 
                value={district} 
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-3.5 bg-transparent outline-none text-gray-900 font-bold cursor-pointer"
              >
                <option value="">All Districts in Sri Lanka</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {district && (
              <button
                onClick={() => setDistrict('')}
                className="text-sm font-semibold text-primary hover:underline px-2 py-1"
              >
                Clear District Filter
              </button>
            )}
          </div>
        )}

        {/* If matchedCategory exists: Display the Services Grid matching Home Page UI pattern */}
        {matchedCategory && (
          <div className="category-block category-page-block mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292524] mb-6 flex items-center gap-3 border-b-2 border-[#F5F5F4] pb-4">
              {matchedCategory.category}
            </h2>

            <div className="services-grid category-vertical-grid">
              {matchedCategory.jobs.map((jobStr, jIndex) => {
                const match = jobStr.match(/^(.*?)\s*\((.*?)\)$/);
                const title = match ? match[1].trim() : jobStr.trim();
                const desc = match ? match[2].trim() : 'Professional service';
                const fallbackImg = `https://picsum.photos/seed/${encodeURIComponent(title)}/600/400`;

                return (
                  <div 
                    key={jIndex} 
                    onClick={() => navigate(`/customer/category/${encodeURIComponent(title)}`)} 
                    className="service-card"
                  >
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
        )}

        {/* Results / Verified Workers Section (Only shown when browsing specific individual services) */}
        {!matchedCategory && (
          <div className="mt-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Available {categoryName}s
                </h2>
                {district && (
                  <p className="text-sm text-gray-500 mt-1">Filtered by district: {district}</p>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-500 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm w-fit">
                {workers.length} {workers.length === 1 ? 'professional' : 'professionals'} found
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <WorkerCardSkeleton key={i} />
                ))}
              </div>
            ) : workers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {workers.map((worker, index) => (
                  <WorkerCard key={`${worker._id}-${index}`} worker={worker} />
                ))}
              </div>
            ) : (
              /* When viewing a specific trade without any active workers */
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto mt-6">
                <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <Search size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No professionals found</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto text-base">
                  We couldn't find any active {categoryName} workers in {district || 'Sri Lanka'}.
                </p>
                <div className="flex items-center justify-center gap-4">
                  {district && (
                    <button 
                      type="button"
                      onClick={() => setDistrict('')}
                      className="border border-gray-300 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Clear Location Filter
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={() => navigate('/customer/post-job')}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-amber-600 transition-colors shadow-md"
                  >
                    Post a Job
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryService;
