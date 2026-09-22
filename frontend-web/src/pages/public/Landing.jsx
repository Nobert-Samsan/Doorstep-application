import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, CheckCircle, Clock, Star, Shield, Smartphone, ArrowRight, Wrench, Zap, Droplets, Paintbrush, Truck, Home, ThermometerSnowflake, Leaf, Bug, Hammer, Tv, Video } from 'lucide-react';
import api from '../../services/api';
import WorkerCard from '../../components/worker/WorkerCard';

const Landing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllPros, setShowAllPros] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [stats, setStats] = useState({
    workersOnline: 0,
    jobsToday: 0,
    verifiedPros: 0,
    avgResponse: '< 15m'
  });

  // Map backend category names to Lucide Icons
  const getCategoryIcon = (name) => {
    const iconMap = {
      'Plumbing': <Droplets size={24} />,
      'Electrical': <Zap size={24} />,
      'Carpentry': <Wrench size={24} />,
      'Painting': <Paintbrush size={24} />,
      'Masonry': <Hammer size={24} />,
      'Cleaning': <Home size={24} />,
      'AC Repair': <ThermometerSnowflake size={24} />,
      'Gardening': <Leaf size={24} />,
      'Pest Control': <Bug size={24} />,
      'Roofing': <Home size={24} />,
      'Appliance Repair': <Tv size={24} />,
      'CCTV Installation': <Video size={24} />
    };
    return iconMap[name] || <Wrench size={24} />;
  };

  const [featuredWorkers, setFeaturedWorkers] = useState([]);
  
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [statsRes, catRes, workersRes] = await Promise.all([
          api.get('/public/stats'),
          api.get('/public/categories'),
          api.get('/public/workers/featured')
        ]);
        
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        
        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }

        if (workersRes.data.success) {
          setFeaturedWorkers(workersRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch landing data', err);
      }
    };
    fetchLandingData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}&district=${district}`);
  };

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Every Service, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-800">Right at Your DoorStep</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto font-medium">
            Connect with trusted, verified local skilled workers in Sri Lanka for all your home service needs. Book instantly, pay securely.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white p-2 md:p-3 rounded-full shadow-xl flex flex-col md:flex-row gap-2 border border-amber-100">
            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
              <Search className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                className="w-full outline-none text-gray-700 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-2 md:py-0">
              <MapPin className="text-gray-400 mr-2" size={20} />
              <select 
                className="w-full outline-none text-gray-700 bg-transparent appearance-none"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Select District</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kandy">Kandy</option>
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all w-full md:w-auto"
            >
              Search
            </button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Popular:</span>
            <span className="bg-white/60 px-3 py-1 rounded-full border border-gray-200 cursor-pointer hover:bg-amber-100">AC Repair</span>
            <span className="bg-white/60 px-3 py-1 rounded-full border border-gray-200 cursor-pointer hover:bg-amber-100">House Cleaning</span>
            <span className="bg-white/60 px-3 py-1 rounded-full border border-gray-200 cursor-pointer hover:bg-amber-100">Wiring</span>
            <span className="bg-white/60 px-3 py-1 rounded-full border border-gray-200 cursor-pointer hover:bg-amber-100">Leak Fix</span>
          </div>
        </div>
      </section>

      {/* 2. Live Stats Bar */}
      <section className="bg-gray-900 text-white py-8 border-y-4 border-primary shadow-2xl relative z-20 -mt-6 mx-4 md:mx-auto max-w-6xl rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-700">
          <div className="text-center px-4">
            <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-3xl font-bold">{stats.workersOnline}</p>
            </div>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Workers Online</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl font-bold text-amber-400 mb-1">{stats.jobsToday}</p>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Jobs Today</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl font-bold text-blue-400 mb-1">{stats.verifiedPros}</p>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Verified Pros</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl font-bold text-purple-400 mb-1">{stats.avgResponse}</p>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Avg. Response Time</p>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How DoorStep Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Getting your home tasks done has never been this simple. Just follow these 4 steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gray-200 z-0"></div>
            
            {[
              { num: '1', title: 'Search Service', desc: 'Tell us what you need and where you are located.', icon: <Search size={32} /> },
              { num: '2', title: 'Pick a Pro', desc: 'Browse profiles, reviews, and prices to find the perfect match.', icon: <Users size={32} /> },
              { num: '3', title: 'Book & Confirm', desc: 'Send a request and get matched instantly. Chat directly.', icon: <CheckCircle size={32} /> },
              { num: '4', title: 'Job Done', desc: 'Pay securely after the work is completed to your satisfaction.', icon: <Star size={32} /> }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-primary mb-6 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold border-2 border-white">{step.num}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Service Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Categories</h2>
              <p className="text-gray-600">Find the right professional for any job, big or small.</p>
            </div>
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-amber-700 focus:outline-none"
            >
              {showAllCategories ? 'Show Less' : 'View All Categories'} <ArrowRight size={16} className={showAllCategories ? "rotate-90 transition-transform" : "transition-transform"} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 transition-all duration-500 ease-in-out">
            {(showAllCategories ? categories : categories.slice(0, 6)).map((cat) => (
              <div 
                key={cat._id} 
                onClick={() => navigate(`/search?category=${cat._id}`)}
                className="group cursor-pointer border border-gray-100 rounded-2xl overflow-hidden text-center hover:shadow-xl hover:border-primary/30 transition-all bg-white relative h-48 flex flex-col justify-end animate-fadeIn"
              >
                {/* Background Image from Database */}
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" 
                  style={{ backgroundImage: `url(${cat.icon || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=60'})` }}
                ></div>
                
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Text Content */}
                <div className="relative z-10 p-4 pb-4">
                  <h3 className="font-bold text-white text-lg mb-1">{cat.nameEn}</h3>
                  <p className="text-xs text-amber-300 font-medium">{cat.workerCount || 0} Pros Available</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile view all button */}
          <div className="mt-8 text-center md:hidden">
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200"
            >
              {showAllCategories ? 'Show Less' : 'View All Categories'}
            </button>
          </div>
        </div>
      </section>

      {/* 4.5 Featured Workers */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Rated Professionals</h2>
              <p className="text-gray-600">Hire the highest rated workers in your area.</p>
            </div>
            <button 
              onClick={() => setShowAllPros(!showAllPros)}
              className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-amber-700 focus:outline-none"
            >
              {showAllPros ? 'Show Less' : 'See All Pros'} <ArrowRight size={16} className={showAllPros ? "rotate-90 transition-transform" : "transition-transform"} />
            </button>
          </div>
          
          {featuredWorkers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ease-in-out">
              {(showAllPros ? featuredWorkers : featuredWorkers.slice(0, 4)).map(worker => (
                <div key={worker._id} className="animate-fadeIn h-full">
                  <WorkerCard worker={worker} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Users className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Featured Pros Yet</h3>
              <p className="text-gray-500">Check back soon as our community grows!</p>
            </div>
          )}
        </div>
      </section>

      {/* 4.75 Testimonials */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute -right-20 top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-20 w-72 h-72 bg-amber-300/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real reviews from people who found the perfect pro on DoorStep.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Amal Perera", location: "Colombo", text: "I needed a plumber urgently on a Sunday. DoorStep found someone in 15 minutes, and they fixed my leak perfectly. The fixed pricing is a lifesaver!", rating: 5 },
              { name: "Sarah Fernando", location: "Gampaha", text: "The app is so easy to use. I was able to chat with the electrician, send photos of my broken panel, and agree on a price before he even arrived. Highly recommended.", rating: 5 },
              { name: "Kamal Silva", location: "Kandy", text: "Finding reliable carpenters has always been hard. The worker I hired had amazing reviews, and his work quality exceeded my expectations. Will use this app for everything now.", rating: 5 }
            ].map((review, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm relative">
                <div className="text-primary mb-6 flex gap-1">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                </div>
                <p className="text-gray-700 mb-8 italic">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why DoorStep */}
      <section className="py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose DoorStep?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We are Sri Lanka's most trusted home services platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100 flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0"><Shield size={24} /></div>
              <div>
                <h3 className="font-bold text-lg mb-2">Verified Professionals</h3>
                <p className="text-gray-600 text-sm">Every worker undergoes strict background checks, including NIC and police clearance verification.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100 flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Clock size={24} /></div>
              <div>
                <h3 className="font-bold text-lg mb-2">On-Demand Booking</h3>
                <p className="text-gray-600 text-sm">Need urgent help? Our emergency feature finds you the nearest available pro within minutes.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100 flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Star size={24} /></div>
              <div>
                <h3 className="font-bold text-lg mb-2">Transparent Pricing</h3>
                <p className="text-gray-600 text-sm">No hidden fees. See fixed prices or negotiate custom quotes directly through our chat system.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. App Download Banner */}
      <section className="bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Take DoorStep With You</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
              Download our mobile app to track your worker's live location, get instant push notifications, and book services on the go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                <Smartphone size={24} /> Download for iOS
              </button>
              <button className="flex items-center justify-center gap-3 bg-transparent border border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
                <Smartphone size={24} /> Download for Android
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            {/* Abstract phone mockup representation */}
            <div className="w-64 h-[500px] bg-gray-800 rounded-[3rem] border-[8px] border-gray-700 shadow-2xl relative overflow-hidden flex flex-col">
              <div className="w-32 h-6 bg-gray-700 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20"></div>
              <div className="flex-1 bg-gradient-to-b from-amber-50 to-white p-4 pt-10">
                <div className="w-full h-12 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="w-full h-32 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                <div className="w-full h-16 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
