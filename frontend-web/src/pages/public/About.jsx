import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {    ChevronRight, Target, Telescope, Shield, Lock, Eye, Heart, ArrowRight, Link as LinkIcon , CheckCircle, Handshake, ChevronRight as ChevronRightIcon , ShieldCheck, Check , Search, Briefcase, Home } from 'lucide-react';
import api from '../../services/api';


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
      {/* 1. Hero Banner - Redesigned */}
      <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[96vh] flex items-center bg-[#000000] overflow-hidden pt-16 sm:pt-20 pb-8 lg:py-0">
        
        {/* Inline Styles for animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeUpStagger {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes subtleZoomOut {
            from { transform: scale(1.06); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes floatGentle {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }
          .animate-fade-up-1 { animation: fadeUpStagger 0.6s ease-out 0.1s both; }
          .animate-fade-up-2 { animation: fadeUpStagger 0.6s ease-out 0.2s both; }
          .animate-fade-up-3 { animation: fadeUpStagger 0.6s ease-out 0.3s both; }
          .animate-fade-up-4 { animation: fadeUpStagger 0.6s ease-out 0.4s both; }
          .animate-fade-up-5 { animation: fadeUpStagger 0.6s ease-out 0.5s both; }
          .animate-zoom-out { animation: subtleZoomOut 1.2s ease-out both; }
          
        `}} />

        {/* Subtle dot grid overlay */}
        
        
        {/* Radial Orange Glow */}
        {/* Radial glow removed for solid black bg */}

        {/* Image Container */}
        <div className="absolute top-0 right-0 w-full h-[50%] sm:h-[70%] md:h-[85%] lg:h-full z-0 animate-zoom-out">
          {/* Preload image */}
          <link rel="preload" as="image" href="/about-hero-new.jpg" />
          <img src="/about-hero-new.jpg" alt="A DoorStep professional shaking hands with a smiling Sri Lankan family" className="w-full h-full object-cover object-[30%_center] lg:object-[35%_center]" />
          
          {/* Gradient Overlay for Desktop (fades left to right) */}
          <div className="hidden md:block absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 25%, rgba(0,0,0,0.3) 45%, transparent 65%)' }}></div>

          {/* Gradient Overlay for Mobile (fades top to bottom) */}
          <div className="block md:hidden absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 70%, #000000 100%)' }}></div>
        </div>

        {/* Bottom edge gradient divider */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] z-20" style={{ background: 'linear-gradient(90deg, transparent 0%, #FF7A00 50%, transparent 100%)', opacity: 0.8 }}></div>

        {/* Content Container */}
        <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center h-full">
          <div className="max-w-[580px] mt-24 sm:mt-32 lg:mt-0">
            


            {/* Headline */}
            <h1 className="text-[32px] sm:text-[44px] lg:text-[72px] font-extrabold text-white leading-[1.1] mb-3 lg:mb-6 font-poppins tracking-tight animate-fade-up-3">
              About <span className="relative inline-block">
                <span className="text-[#FF7A00]">DoorStep</span>
                </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[16px] sm:text-[18px] lg:text-[22px] font-normal text-white/80 leading-[1.7] max-w-[520px] mb-4 lg:mb-10 font-inter animate-fade-up-4">
              Sri Lanka's trusted home services platform, connecting households with verified professionals.
            </p>

          </div>
        </div>

      </section>

      {/* 2. Our Story - Redesigned */}
      <section className="relative bg-[#FFFFFF] py-16 md:py-24 overflow-hidden">
        
        {/* Subtle radial glow & dotted pattern */}
        
        

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-center">
            
            {/* Left Column - Text Side */}
            <div className="order-last lg:order-first lg:pr-8">
              
              <FadeIn delay={0}>


                {/* Headline */}
                <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-[#000000] leading-[1.15] mb-8">
                  Connecting Sri Lanka, One <span className="text-[#E85D00]">Home</span> at a Time
                </h2>
              </FadeIn>

              <FadeIn delay={100}>
                {/* Pull-quote */}
                <div className="relative bg-[#FFF8F1] rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-5 md:p-6 mb-8 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF7A00]"></div>
                  <div className="absolute top-2 left-4 text-[60px] font-serif leading-none text-[#FF7A00] opacity-25 select-none">“</div>
                  <p className="relative z-10 text-[#000000] font-inter italic font-semibold text-[17px] md:text-[18px] leading-[1.6] pl-6 pt-2">
                    Finding a reliable, skilled and trustworthy home service worker in Sri Lanka has always been a challenge.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                {/* Paragraphs */}
                <div className="space-y-4 mb-8">
                  <p className="font-inter text-[16px] md:text-[17px] text-[#3D3D3D] leading-[1.75]">
                    DoorStep was built to change that. We are Sri Lanka's dedicated home services marketplace, a platform that connects homeowners and tenants across <span className="text-black font-semibold">Western Province</span> with <span className="text-black font-semibold">verified, background-checked skilled professionals</span> for every home service need.
                  </p>
                  <p className="font-inter text-[16px] md:text-[17px] text-[#3D3D3D] leading-[1.75]">
                    From plumbing and electrical work to English tutoring, home cleaning, painting and beyond. Whether you need a plumber urgently, a painter for your living room or a tutor for your child, DoorStep brings <span className="text-black font-semibold">the right professional to your door</span>. Quickly, safely and transparently.
                  </p>
                </div>
              </FadeIn>

              

              <FadeIn delay={400}>
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link to="/contact" className="w-full sm:w-auto group bg-[#FF7A00] hover:bg-[#E86100] active:bg-[#CC5200] text-white font-bold py-[14px] px-[28px] rounded-[12px] shadow-[0_4px_12px_rgba(255,122,0,0.20)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                    Contact Us
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </FadeIn>
              
            </div>

            {/* Right Column - Image Side */}
            <div className="relative order-first lg:order-last mx-auto max-w-[500px] lg:max-w-none w-full">
              
              <FadeIn delay={200}>
                <div className="relative">
                  {/* Offset Frame */}
                  
                  
                  {/* Image */}
                  <img src="/story-portrait.jpg" alt="A DoorStep professional at the front door of a Sri Lankan home" className="w-full aspect-[4/5] object-cover rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] relative z-0" />
                  
                  {/* Subtle warm overlay */}
                  <div className="absolute inset-0 rounded-[16px] pointer-events-none z-10"></div>
                  
                  

                </div>
              </FadeIn>
              
            </div>
            
          </div>
        </div>
      </section>

      {/* 3. Mission and Vision - Redesigned Dark */}
      <section className="relative bg-[#FFFFFF] py-16 md:py-24 overflow-hidden">
        
        {/* Background glow and patterns */}
        
        
        

        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          
          <div className="flex flex-col items-center text-center mb-16">
            
            
            <FadeIn delay={150}>
              {/* Headline */}
              <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-black leading-tight mb-5">
                Our Mission & <span className="text-[#E85D00]">Vision</span>
              </h2>
              {/* Decorative Line */}
              
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <FadeIn delay={300}>
              {/* Mission Card */}
              <div className="group relative bg-[#111111] border border-white/5 rounded-[16px] p-8 md:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-[#FF7A00]/50 transition-all duration-200 flex flex-col h-full overflow-hidden">
                {/* Top Accent Bar */}
                
                
                {/* Watermark */}
                <div className="absolute -top-4 -right-4 text-[#FF7A00] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 pointer-events-none">
                  <Target size={140} strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <div className="w-[56px] h-[56px] rounded-[16px] bg-[#FF7A00] flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.20)]">
                      <Target size={32} className="text-white" strokeWidth={2} />
                    </div>
                  </div>
                  
                  <h3 className="text-[26px] font-poppins font-semibold text-white mb-4">Our Mission</h3>
                  <p className="font-inter text-[16px] md:text-[17px] text-white/75 leading-[1.75] mb-8">
                    To make finding and hiring skilled home service workers <span className="text-white font-semibold">fast, safe, and accessible</span> for every Sri Lankan family, while ensuring <span className="text-white font-semibold">fair wages</span> and <span className="text-white font-semibold">dignified work</span> for our professionals.
                  </p>
                  
                  </div>
              </div>
            </FadeIn>

            <FadeIn delay={450}>
              {/* Vision Card */}
              <div className="group relative bg-[#111111] border border-white/5 rounded-[16px] p-8 md:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-[#FF7A00]/50 transition-all duration-200 flex flex-col h-full overflow-hidden">
                {/* Top Accent Bar */}
                
                
                {/* Watermark */}
                <div className="absolute -top-4 -right-4 text-[#FF7A00] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 pointer-events-none">
                  <Telescope size={140} strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <div className="w-[56px] h-[56px] rounded-[16px] bg-[#FF7A00] flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.20)]">
                      <Telescope size={32} className="text-white" strokeWidth={2} />
                    </div>
                  </div>
                  
                  <h3 className="text-[26px] font-poppins font-semibold text-white mb-4">Our Vision</h3>
                  <p className="font-inter text-[16px] md:text-[17px] text-white/75 leading-[1.75] mb-8">
                    To be the <span className="text-white font-semibold">most trusted and reliable</span> digital home services platform in Sri Lanka, empowering <span className="text-white font-semibold">hundreds of thousands of skilled workers</span> to build better livelihoods.
                  </p>
                  
                  </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>
      
      {/* 6. What We Stand For (Redesigned) */}
<section className="py-16 md:py-32 bg-[#F9FAFB] border-t border-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-24">
      <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Core Values</span>
      <h2 className="text-[26px] sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">What We Stand For</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
      {[
        { icon: Shield, title: 'Trust', desc: 'Every worker is strictly police-verified and background checked.' },
        { icon: Lock, title: 'Safety', desc: 'Secure payments and no unnecessary contact sharing.' },
        { icon: Eye, title: 'Transparency', desc: 'Upfront pricing. No hidden fees or surprise charges.' },
        { icon: Heart, title: 'Community', desc: 'Dedicated to supporting Sri Lankan families and workers.' }
      ].map((value, idx) => {
        const Icon = value.icon;
        return (
          <div key={idx} className="bg-white p-8 pt-12 rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] relative group hover:-translate-y-2 transition-transform duration-300 border border-gray-100/50">
            {/* Floating Icon Overlap */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full p-2 shadow-sm border border-gray-50">
              <div className="w-full h-full bg-[#FFF1E3] rounded-full flex items-center justify-center text-[#E85D00] transition-colors duration-200">
                <Icon size={32} strokeWidth={1.5} />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center mt-2">{value.title}</h4>
            <p className="text-gray-500 text-center leading-relaxed font-medium">{value.desc}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* 7. Join Us Banner */}
      <section className="py-16 md:py-24 bg-white relative z-10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeIn delay={0}>
            <div className="relative rounded-[16px] p-6 sm:p-10 md:p-16 lg:px-12 lg:py-20 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-white/10" 
                 style={{ background: '#000000' }}>
              
              {/* Decorative dotted pattern */}
              

              {/* Decorative soft circles & outline arc */}
              
              
              

              {/* Watermark Icon */}
              <div className="hidden">
                <Home size={300} strokeWidth={1} />
              </div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col items-center text-center">
                


                <FadeIn delay={200}>
                  {/* Heading */}
                  <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-white leading-[1.15] mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
                    Ready to Join DoorStep?
                  </h2>
                </FadeIn>

                <FadeIn delay={300}>
                  {/* Subtitle */}
                  <p className="font-inter text-[18px] md:text-[20px] text-white/95 leading-[1.7] max-w-[640px] mx-auto mb-12 drop-shadow-[0_1px_8px_rgba(0,0,0,0.12)]">
                    Whether you need a job done right or you're a skilled professional looking for work, we have a place for you.
                  </p>
                </FadeIn>

                {/* Buttons Container */}
                <FadeIn delay={400}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4 mb-14 w-full">
                    
                    {/* Find a Worker Button Group */}
                    <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                      <Link to="/register/customer" className="group w-full sm:w-auto px-8 py-4 bg-[#FF7A00] hover:bg-[#E86100] active:bg-[#CC5200] text-white font-poppins font-semibold text-[16px] rounded-[12px] shadow-[0_4px_12px_rgba(255,122,0,0.20)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF7A00]">
                        <Search size={20} />
                        Find a Worker
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <span className="text-white/85 text-[13px] font-inter">Book a verified professional</span>
                    </div>

                    {/* Join as a Worker Button Group */}
                    <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                      <Link to="/register/worker" className="group w-full sm:w-auto px-8 py-4 bg-white text-[#000000] font-poppins font-semibold text-[16px] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF7A00]">
                        <Briefcase size={20} />
                        Join as a Worker
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <span className="text-white/85 text-[13px] font-inter">Grow your business with us</span>
                    </div>

                  </div>
                </FadeIn>



              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default About;
