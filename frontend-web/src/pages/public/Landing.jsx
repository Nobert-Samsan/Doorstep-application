import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, TrendingUp, Calendar, Banknote, DollarSign, Target, Heart, Eye, Handshake,  Search, MapPin, Users, CheckCircle, Clock, Star, Shield, Smartphone, ArrowRight, Wrench, Zap, Droplets, Paintbrush, Truck, Home, ThermometerSnowflake, Leaf, Bug, Hammer, Tv, Video  } from 'lucide-react';
import api from '../../services/api';
import WorkerCard from '../../components/worker/WorkerCard';


const faqs = [
  { q: "How do I book a professional?", a: "Simply search for the service you need, choose a verified professional, and select a time that works for you." },
  { q: "Are all professionals verified?", a: "Yes, every professional on DoorStep goes through a strict identity check and skill verification process." },
  { q: "How does pricing work?", a: "We offer transparent pricing. You'll see upfront costs for fixed-price jobs or negotiate directly via chat for custom quotes." },
  { q: "What if I'm not satisfied with the service?", a: "We guarantee satisfaction. If you face any issues, our 24/7 customer support team is here to resolve them." }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b border-gray-100 py-6 last:border-0">
      <button className="flex w-full items-center justify-between text-left focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-[16px] md:text-xl font-bold text-gray-900">{question}</h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      <div className={`mt-4 text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {answer}
      </div>
    </div>
  );
};


// --- Animations for Landing Page ---
const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isIntersecting;
};

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  React.useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const FadeIn = ({ children, delay = 0 }) => {
  const ref = React.useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`
      }}
    >
      {children}
    </div>
  );
};
// ------------------------------------

const Landing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllPros, setShowAllPros] = useState(false);
  const [categories, setCategories] = useState([]);
  
  
  const heroImages = [
    '/hero-1.jpg',
    '/hero-2.jpg',
    '/hero-3.jpg'
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            {/* 1. Hero Section - Redesigned */}
      <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[96vh] flex items-center bg-[#000000] overflow-hidden pt-16 sm:pt-20 lg:py-0 pb-10">
        
        {/* Subtle dot grid overlay */}
        
        
        {/* Radial Orange Glow */}
        

        {/* Image Container */}
        <div className="absolute top-0 right-0 w-full h-[50%] sm:h-[70%] md:h-[85%] lg:h-full z-0">
          <img src="/hero-ultra.jpg" alt="DoorStep Home Services" className="w-full h-full object-cover lg:object-right " />
          
          {/* Gradient Overlay for Desktop (fades left to right) */}
          <div className="hidden md:block absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 25%, rgba(0,0,0,0.3) 45%, transparent 65%)' }}></div>

          {/* Gradient Overlay for Mobile (fades top to bottom) */}
          <div className="block md:hidden absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 70%, #000000 100%)' }}></div>
          
          
        </div>

        {/* Content Container */}
        <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center h-full">
          <div className="max-w-[620px] mt-4 sm:mt-8 lg:mt-0">
            

            {/* Headline */}
            <h1 className="text-[32px] sm:text-[44px] lg:text-[64px] xl:text-[72px] font-extrabold text-white leading-[1.08] mb-4 lg:mb-6 tracking-tight">
              Every Service, <br className="hidden lg:block" />
              <span className="relative inline-block mt-2 lg:mt-0">
                <span className="text-[#FF7A00]">Right at Your DoorStep</span>
                </span>
            </h1>

            {/* Subtitle */}
            <p className=" text-[15px] sm:text-[18px] lg:text-[22px] text-white/80 leading-[1.6] max-w-[540px] mb-6 lg:mb-12 font-normal">
              Connect with trusted, verified local skilled workers in Sri Lanka for all your home service needs. Book instantly, pay securely.
            </p>

            {/* Call to Action Buttons */}
            <div className=" flex flex-col sm:flex-row items-center gap-4">
              <Link to="/register/customer" className="w-full sm:w-auto group bg-[#FF7A00] hover:bg-[#E86100] active:bg-[#CC5200] text-white font-bold py-[16px] px-[32px] rounded-[12px] shadow-[0_4px_12px_rgba(255,122,0,0.20)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                Explore Services
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link to="/register/worker" className="w-full sm:w-auto group bg-transparent border-2 border-white/20 text-white font-bold py-[14px] px-[32px] rounded-[12px] hover:bg-white hover:text-[#000000] hover:border-white transition-all duration-300 flex items-center justify-center gap-2">
                Join as a Professional
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* Mission Statement Section */}
      <section className="relative bg-[#FFFFFF] pt-10 pb-4 sm:py-16 md:py-24">
        

        <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10">
          
          {/* Header Area */}
          <FadeIn delay={100}><div className="flex flex-col items-center text-center mb-16">

            {/* Headline */}
            <h2 className="text-[#000000] font-bold text-[30px] md:text-[48px] leading-[1.15] max-w-[820px] font-poppins tracking-tight">
              Finding reliable home help in <span className="whitespace-nowrap">Sri Lanka</span> has always been a{' '}
              <span className="text-[#E85D00]">challenge.</span>
            </h2>
          </div></FadeIn>

          {/* Cards Grid */}
          <FadeIn delay={200}><div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Card 1 */}
            <div className="group relative bg-white rounded-[16px] border border-[#E8E2DB] p-8 md:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-[#FF7A00]/50 transition-all duration-200 flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-[#FF7A00] focus-within:border-transparent">
              {/* Top Gradient Accent Bar */}
              
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-[16px] bg-[#FFF1E3] flex items-center justify-center text-[#E85D00] shrink-0">
                  <Shield size={24} />
                </div>
                <h3 className="text-[#000000] font-semibold text-[22px] font-poppins m-0">Who We Are</h3>
              </div>
              
              <p className="text-[#3D3D3D] text-[16px] md:text-[17px] leading-[1.75] font-inter">
                We are Sri Lanka's dedicated home services marketplace, a platform that connects homeowners and tenants across <span className="text-[#000000] font-semibold relative z-10">Western Province</span> with <span className="text-[#000000] font-semibold">verified, background-checked skilled professionals</span> for every home service need. From plumbing and electrical work to English tutoring, home cleaning, painting and beyond.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white rounded-[16px] border border-[#E8E2DB] p-8 md:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-[#FF7A00]/50 transition-all duration-200 flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-[#FF7A00] focus-within:border-transparent">
              {/* Top Gradient Accent Bar */}
              
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-[16px] bg-[#FFF1E3] flex items-center justify-center text-[#E85D00] shrink-0">
                  <Home size={24} />
                </div>
                <h3 className="text-[#000000] font-semibold text-[22px] font-poppins m-0">What We Do For You</h3>
              </div>
              
              <p className="text-[#3D3D3D] text-[16px] md:text-[17px] leading-[1.75] font-inter flex-grow mb-6">
                Whether you need a plumber urgently, a painter for your living room or a tutor for your child, <span className="text-[#000000] font-semibold">DoorStep brings the right professional to your door.</span> Quickly, safely and transparently. No word of mouth. No uncertainty. Just skilled, verified help when you need it.
              </p>
              
              {/* Check-list items - always one line */}
              <div className="pt-5 border-t border-[#E8E2DB] flex flex-row flex-nowrap items-center justify-between gap-2 sm:gap-4 mt-auto">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#2E9E5B] shrink-0" />
                  <span className="text-[#000000] font-semibold text-[13px] sm:text-[15px] whitespace-nowrap">Quick</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#2E9E5B] shrink-0" />
                  <span className="text-[#000000] font-semibold text-[13px] sm:text-[15px] whitespace-nowrap">Safe</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#2E9E5B] shrink-0" />
                  <span className="text-[#000000] font-semibold text-[13px] sm:text-[15px] whitespace-nowrap">Transparent</span>
                </div>
              </div>
            </div>

          </div></FadeIn>

          {/* Stats Bar */}
          <FadeIn delay={300}><div className="relative bg-[#000000] rounded-[16px] py-4 sm:py-6 md:py-8 px-3 sm:px-6 md:px-8 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            {/* Dotted pattern and glow */}
            
            
            
            <div className="relative z-10 flex flex-row items-stretch justify-between gap-1 sm:gap-4">
              
              {/* Stat 1 */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-1 sm:px-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#FF7A00]/15 flex items-center justify-center text-[#FF7A00] mb-1 sm:mb-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-[#FF7A00] font-bold text-[22px] sm:text-[32px] md:text-[52px] leading-tight mb-0.5 sm:mb-1.5 md:mb-3 font-poppins tabular-nums">
                  <CountUp end={100} suffix="%" />
                </div>
                <p className="text-white/85 text-[11px] sm:text-[13px] md:text-[15px] font-inter leading-tight max-w-[130px] md:max-w-[200px]">
                  Verified Professionals
                </p>
              </div>

              {/* Divider */}
              <div className="w-[1px] self-stretch my-1 sm:my-2 bg-white/10"></div>

              {/* Stat 2 */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-1 sm:px-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#FF7A00]/15 flex items-center justify-center text-[#FF7A00] mb-1 sm:mb-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-[#FF7A00] font-bold text-[20px] sm:text-[30px] md:text-[52px] leading-tight mb-0.5 sm:mb-1.5 md:mb-3 font-poppins">
                  Western
                </div>
                <p className="text-white/85 text-[11px] sm:text-[13px] md:text-[15px] font-inter leading-tight max-w-[130px] md:max-w-[200px]">
                  Province covered
                </p>
              </div>

              {/* Divider */}
              <div className="w-[1px] self-stretch my-1 sm:my-2 bg-white/10"></div>

              {/* Stat 3 */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-1 sm:px-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#FF7A00]/15 flex items-center justify-center text-[#FF7A00] mb-1 sm:mb-2">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-[#FF7A00] font-bold text-[22px] sm:text-[32px] md:text-[52px] leading-tight mb-0.5 sm:mb-1.5 md:mb-3 font-poppins tabular-nums">
                  <CountUp end={50} suffix="+" />
                </div>
                <p className="text-white/85 text-[11px] sm:text-[13px] md:text-[15px] font-inter leading-tight max-w-[130px] md:max-w-[200px]">
                  Types of home services available
                </p>
              </div>

            </div>
          </div></FadeIn>

        </div>
      </section>

      <section className="pt-4 pb-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="bg-[#FFF8F1] rounded-[16px] p-6 sm:p-8 md:p-12 lg:p-14 border border-[#E8E2DB] shadow-[0_4px_16px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
              
              {/* Image Column */}
              <div className="relative group w-full">
                {/* Offset decorative shape */}
                
                
                {/* Main Image */}
                <div className="aspect-[4/3] rounded-[16px] overflow-hidden relative z-10 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  <img src="/benefit-1.jpg" alt="Customer Benefits" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                {/* Floating Badge 1 - Bottom Left */}
                

                {/* Floating Badge 2 - Top Right */}
                
              </div>

              {/* Text Column */}
              <div className="w-full flex flex-col justify-center">
                {/* Eyebrow */}
                <div className="mb-6 inline-flex self-start">
                  <span className="bg-[#FFF1E3] text-[#FF7A00] text-[13px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.12em]">
                    Why DoorStep
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-[28px] sm:text-[34px] lg:text-[44px] font-extrabold text-[#000000] leading-[1.2] mb-4 lg:mb-6 tracking-tight">
                  Satisfy Every Home Need With Our <span className="relative inline-block text-[#E85D00]">Exceptional Services</span>
                </h2>

                {/* Paragraphs */}
                <div className="space-y-4 text-[16px] lg:text-[17px] text-[#3D3D3D] leading-[1.7]">
                  <p>DoorStep is the home service solution in <span className="font-semibold text-black">Sri Lanka</span> that is seamlessly integrated into the busy lifestyle of everyday people.</p>
                  <p>We provide the ultimate convenience of instant doorstep service and enable our customers to explore over hundreds of <span className="font-semibold text-black">verified professionals</span> ranging from plumbers, electricians, AC technicians, and much more in order to select the perfect match for your specific requirements.</p>
                </div>

                {/* 2x2 Trust Grid - 2 per line on mobile, 2 per line on desktop */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mt-6 sm:mt-8">
                  {[
                    { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, text: 'Verified Professionals' },
                    { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />, text: 'Instant Booking' },
                    { icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />, text: 'Transparent Pricing' },
                    { icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />, text: 'Trusted Service' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFF1E3] text-[#FF7A00] flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-[#000000] font-bold text-[13px] sm:text-[16px] leading-tight">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Call to Action - Same line on mobile */}
                <div className="flex flex-row items-center gap-2 sm:gap-4 mt-8 sm:mt-10 w-full max-w-full">
                  <Link to="/register/customer" className="flex-1 min-w-0 sm:flex-initial group bg-[#FF7A00] hover:bg-[#E86100] active:bg-[#CC5200] text-white font-bold py-3 sm:py-3.5 px-2.5 sm:px-8 rounded-xl shadow-[0_4px_12px_rgba(255,122,0,0.20)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-[13px] sm:text-[16px] whitespace-nowrap">
                    <span>Explore Services</span>
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 shrink-0 hidden xs:inline-block" />
                  </Link>
                  <Link to="/how-it-works?tab=customer" className="flex-1 min-w-0 sm:flex-initial border-2 border-[#000000] text-[#000000] font-bold py-2.5 sm:py-3 px-2 sm:px-8 rounded-xl hover:bg-[#000000] hover:text-white transition-all duration-300 text-center text-[13px] sm:text-[16px] whitespace-nowrap flex items-center justify-center">
                    <span>How It Works</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Block 2: Worker - Redesigned */}
          <div className="bg-[#000000] rounded-[16px] p-6 sm:p-8 md:p-12 lg:p-14 relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            {/* Ambient Background Glow */}
            
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center relative z-10">
              
              {/* Image Column */}
              <div className="relative group w-full order-first lg:order-none">
                {/* Offset decorative shape */}
                
                
                {/* Main Image */}
                <div className="aspect-[4/3] rounded-[16px] overflow-hidden relative z-10 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-white/10">
                  <img src="/benefit-2.jpg" alt="Worker Benefits" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                

                
              </div>

              {/* Text Column */}
              <div className="w-full flex flex-col justify-center text-left">
                {/* Eyebrow */}
                <div className="mb-6 inline-flex self-start">
                  <span className="bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] text-[13px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.12em]">
                    For Service Professionals
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-[30px] lg:text-[48px] font-extrabold text-white leading-[1.15] mb-2.5 tracking-tight">
                  Got A Skill? <br />
                  <span className="text-[#FF7A00]">Grow With Us.</span>
                </h2>

                {/* Sub-headline */}
                <p className="text-[18px] lg:text-[20px] font-semibold text-white mb-2.5 leading-[1.4]">
                  We're hungry for the BEST! A world of customers now within your reach!
                </p>

                {/* Paragraphs */}
                <p className="text-[16px] lg:text-[17px] font-normal text-white/70 leading-[1.7] mb-8">
                  DoorStep is a one app solution to the customers' household mobility needs. So why not join us as a Service Professional and grow your business with us?
                </p>

                {/* 3 Benefits Grid - 3 in one line */}
                <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-8 sm:mb-10 border-t border-white/10 pt-6 sm:pt-8">
                  <div className="flex flex-col items-start gap-1.5 sm:gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF7A00]/15 text-[#FF7A00] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-[13px] sm:text-[15px] mb-0.5 sm:mb-1 leading-tight">More Customers</h4>
                      <p className="text-white/50 text-[11px] sm:text-[13px] leading-snug">Steady job requests near you</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1.5 sm:gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF7A00]/15 text-[#FF7A00] flex items-center justify-center">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-[13px] sm:text-[15px] mb-0.5 sm:mb-1 leading-tight">Flexible Schedule</h4>
                      <p className="text-white/50 text-[11px] sm:text-[13px] leading-snug">Work when you want</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1.5 sm:gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF7A00]/15 text-[#FF7A00] flex items-center justify-center">
                      <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-[13px] sm:text-[15px] mb-0.5 sm:mb-1 leading-tight">Fast Payments</h4>
                      <p className="text-white/50 text-[11px] sm:text-[13px] leading-snug">Get paid on time</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action - Both buttons on same line */}
                <div>
                  <div className="flex flex-row items-center gap-2 sm:gap-6 w-full max-w-full">
                    <Link to="/register/worker" className="flex-1 min-w-0 sm:flex-initial group bg-[#FF7A00] hover:bg-[#E86100] active:bg-[#CC5200] text-white font-bold py-3 sm:py-[14px] px-2.5 sm:px-[28px] rounded-xl shadow-[0_4px_12px_rgba(255,122,0,0.20)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-[13px] sm:text-[16px] whitespace-nowrap">
                      <span>Partner With Us</span>
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 shrink-0 hidden xs:inline-block" />
                    </Link>
                    <Link to="/how-it-works?tab=worker" className="flex-1 min-w-0 sm:flex-initial border-2 border-white text-white font-bold py-2.5 sm:py-3 px-2 sm:px-8 rounded-xl hover:bg-white hover:text-[#000000] transition-all duration-300 text-center text-[13px] sm:text-[16px] whitespace-nowrap flex items-center justify-center">
                      <span>How It Works</span>
                    </Link>
                  </div>
                  <p className="text-white/55 text-[13px] mt-4 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-[#2E9E5B]" /> Free to join. No hidden fees.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      

      

      

      

      

      {/* 5. Why Choose DoorStep? */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            {/* Headline */}
            <h2 className="text-[30px] md:text-[44px] font-extrabold text-[#000000] mb-2.5 leading-tight">
              Why Choose <span className="text-[#E85D00]">DoorStep?</span>
            </h2>
            
            {/* Gradient Underline */}
            
            
            {/* Subtitle */}
            <p className="text-[17px] md:text-[18px] text-[#6B6B6B] max-w-[560px] mx-auto leading-relaxed">
              We are Sri Lanka's most trusted home services platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-[16px] border border-[#E8E2DB] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden group hover:-translate-y-0.5 hover:border-[#FF7A00]/50 transition-all duration-200 relative flex flex-col h-full">
              {/* Top animated border */}
              
              
              <div className="h-56 w-full relative shrink-0">
                <div className="absolute inset-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Verified Professionals" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>
                </div>
                
                {/* Number Tag */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-[14px] px-3 py-1 rounded-full">
                  01
                </div>

                {/* Icon Badge */}
                <div className="absolute -bottom-6 left-6 w-[56px] h-[56px] rounded-[16px] bg-[#FF7A00] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.20)] z-20">
                  <Shield size={26} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="p-8 pt-12 flex-1 flex flex-col bg-white z-10 relative">
                <h3 className="text-[20px] font-bold text-[#000000] mb-3">Verified Professionals</h3>
                <p className="text-[#3D3D3D] leading-[1.7] text-[16px]">Every worker undergoes strict identity checks, skill verification, and continuous quality monitoring.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[16px] border border-[#E8E2DB] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden group hover:-translate-y-0.5 hover:border-[#FF7A00]/50 transition-all duration-200 relative flex flex-col h-full">
              {/* Top animated border */}
              
              
              <div className="h-56 w-full relative shrink-0">
                <div className="absolute inset-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instant Booking" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>
                </div>
                
                {/* Number Tag */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-[14px] px-3 py-1 rounded-full">
                  02
                </div>

                {/* Icon Badge */}
                <div className="absolute -bottom-6 left-6 w-[56px] h-[56px] rounded-[16px] bg-[#FF7A00] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.20)] z-20">
                  <Clock size={26} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="p-8 pt-12 flex-1 flex flex-col bg-white z-10 relative">
                <h3 className="text-[20px] font-bold text-[#000000] mb-3">Instant Booking</h3>
                <p className="text-[#3D3D3D] leading-[1.7] text-[16px]">Book a service in seconds. Track your worker's arrival time and communicate securely via the app.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[16px] border border-[#E8E2DB] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden group hover:-translate-y-0.5 hover:border-[#FF7A00]/50 transition-all duration-200 relative flex flex-col h-full">
              {/* Top animated border */}
              
              
              <div className="h-56 w-full relative shrink-0">
                <div className="absolute inset-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Satisfaction Guaranteed" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>
                </div>
                
                {/* Number Tag */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-[14px] px-3 py-1 rounded-full">
                  03
                </div>

                {/* Icon Badge */}
                <div className="absolute -bottom-6 left-6 w-[56px] h-[56px] rounded-[16px] bg-[#FF7A00] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.20)] z-20">
                  <Star size={26} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="p-8 pt-12 flex-1 flex flex-col bg-white z-10 relative">
                <h3 className="text-[20px] font-bold text-[#000000] mb-3">Satisfaction Guaranteed</h3>
                <p className="text-[#3D3D3D] leading-[1.7] text-[16px]">Pay securely online or in cash. We ensure 100% satisfaction with dedicated customer support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-extrabold text-gray-900 mb-2.5 leading-tight">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-base">Everything you need to know about using DoorStep</p>
          </div>
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>


      
    </div>
  );
};

export default Landing;
