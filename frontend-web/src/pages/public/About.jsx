import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Target, Telescope, Shield, Lock, Eye, Heart, ArrowRight, Link as LinkIcon } from 'lucide-react';
import api from '../../services/api';

const About = () => {
  const [stats, setStats] = useState({
    workersOnline: 12840,
    jobsToday: 50000,
    verifiedPros: 25,
    avgResponse: '98%'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/public/stats');
        if (res.data.success) {
          // Mapping real stats to the spec's impact numbers if they exist
          setStats(prev => ({
            ...prev,
            workersOnline: res.data.data.verifiedPros || prev.workersOnline,
            jobsToday: res.data.data.jobsToday || prev.jobsToday,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner */}
      <section className="relative bg-gradient-to-r from-amber-600 to-amber-500 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Map Watermark (CSS Shapes for now) */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M45,-77.3C58.3,-68.8,69.1,-55.5,77.5,-40.7C85.9,-25.9,91.8,-9.6,90.4,6.2C89.1,21.9,80.4,37.1,70,50.7C59.5,64.2,47.3,76.1,32.3,81.4C17.2,86.8,-0.7,85.5,-16.8,80.2C-32.8,74.9,-47,65.6,-57.8,53.4C-68.6,41.2,-76,26.2,-79.6,10.2C-83.3,-5.7,-83.1,-22.6,-76.3,-36.8C-69.5,-51.1,-56,-62.7,-41.8,-70.9C-27.6,-79.1,-13.8,-83.9,1.4,-86.3C16.6,-88.7,31.7,-85.7,45,-77.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center text-amber-100 text-sm mb-8 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-white">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            About DoorStep
          </h1>
          <p className="text-lg md:text-xl text-amber-100 max-w-2xl mx-auto">
            Connecting Sri Lankan Families with Trusted Skilled Workers
          </p>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 font-bold text-sm rounded-full mb-6 uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Connecting Sri Lanka, One Home at a Time
              </h2>
              <div className="space-y-4 text-gray-600 text-lg mb-8">
                <p>
                  Founded in 2023 in Colombo, DoorStep was born out of a simple frustration: finding reliable, skilled, and safe home service workers was entirely too difficult for the average Sri Lankan family. 
                </p>
                <p>
                  We started with just 50 local plumbers and electricians. Today, we have grown into a massive community of over 12,840 verified professionals, covering everything from AC repair to masonry, across all 25 districts of the island.
                </p>
                <p>
                  Our platform ensures fixed pricing, police-verified backgrounds, and a seamless booking experience so you can get back to what matters most—enjoying your home.
                </p>
              </div>
              <button className="px-6 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-amber-50 transition-colors">
                Read Our Full Story
              </button>
            </div>
            
            {/* Right Column */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&auto=format&fit=crop&q=60" 
                  alt="DoorStep Community" 
                  className="w-full h-[500px] object-cover"
                />
              </div>
              
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20 flex justify-between items-center text-center">
                <div className="px-2">
                  <p className="font-bold text-gray-900">Founded</p>
                  <p className="text-sm text-primary font-semibold">2023</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="px-2">
                  <p className="font-bold text-gray-900">HQ</p>
                  <p className="text-sm text-primary font-semibold">Colombo</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="px-2">
                  <p className="font-bold text-gray-900">Coverage</p>
                  <p className="text-sm text-primary font-semibold">Island-wide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission and Vision */}
      <section className="py-24 bg-amber-50 mt-12 lg:mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission & Vision</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 text-primary rounded-xl flex items-center justify-center mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To make finding and hiring skilled home service workers fast, safe, and accessible for every Sri Lankan family, while ensuring fair wages and dignified work for our professionals.
              </p>
            </div>
            
            {/* Vision Card */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 text-primary rounded-xl flex items-center justify-center mb-6">
                <Telescope size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To be the most trusted and reliable digital home services platform in South Asia, empowering hundreds of thousands of skilled workers to build better livelihoods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Impact Numbers */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Our Impact Across Sri Lanka</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20 text-center">
            <div className="pt-8 md:pt-0">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 relative inline-block">
                {stats.workersOnline}+
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded-full"></span>
              </p>
              <p className="text-amber-100 mt-4 font-medium uppercase tracking-wider text-sm">Verified Workers</p>
            </div>
            <div className="pt-8 md:pt-0">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 relative inline-block">
                {stats.jobsToday}+
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded-full"></span>
              </p>
              <p className="text-amber-100 mt-4 font-medium uppercase tracking-wider text-sm">Jobs Completed</p>
            </div>
            <div className="pt-8 md:pt-0">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 relative inline-block">
                25
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded-full"></span>
              </p>
              <p className="text-amber-100 mt-4 font-medium uppercase tracking-wider text-sm">Districts Covered</p>
            </div>
            <div className="pt-8 md:pt-0">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 relative inline-block">
                98%
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded-full"></span>
              </p>
              <p className="text-amber-100 mt-4 font-medium uppercase tracking-wider text-sm">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 font-bold text-sm rounded-full mb-4 uppercase tracking-wider">
              The People Behind DoorStep
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Team</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Saman Kumara', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
              { name: 'Dilani Perera', role: 'Chief Technology Officer', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
              { name: 'Roshan Fernando', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' },
              { name: 'Chamari Silva', role: 'Customer Success Lead', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' }
            ].map((member, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-amber-50 group-hover:border-amber-400 transition-colors">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center hover:bg-amber-50">
                      <LinkIcon size={18} />
                    </button>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Our Values */}
      <section className="py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What We Stand For</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Trust', desc: 'Every worker is strictly police-verified and background checked.' },
              { icon: Lock, title: 'Safety', desc: 'Secure payments and no unnecessary contact sharing.' },
              { icon: Eye, title: 'Transparency', desc: 'Upfront pricing. No hidden fees or surprise charges.' },
              { icon: Heart, title: 'Community', desc: 'Dedicated to supporting Sri Lankan families and workers.' }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm text-center hover:-translate-y-1 transition-transform border border-amber-100">
                  <div className="w-16 h-16 mx-auto bg-amber-100 text-primary rounded-2xl flex items-center justify-center mb-6 transform -rotate-6">
                    <Icon size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Join Us Banner */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join DoorStep?</h2>
          <p className="text-xl text-amber-100 mb-10">
            Whether you need a job done right or you're a skilled professional looking for work, we have a place for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/search" className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 shadow-lg transition-all flex items-center justify-center gap-2">
              Find a Worker <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="px-8 py-4 bg-gray-900 text-yellow-400 font-bold rounded-xl hover:bg-gray-800 shadow-lg transition-all flex items-center justify-center gap-2">
              Join as a Worker <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
