const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// Ensure necessary icons are imported
if (!code.includes('CheckCircle')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, CheckCircle, Handshake, ChevronRight as ChevronRightIcon } from 'lucide-react';");
}

const start = code.indexOf('{/* 1. Hero Banner */}');
const end = code.indexOf('{/* 2. Our Story - Split Personality Redesign */}');

const replacement = `{/* 1. Hero Banner - Redesigned */}
      <section className="relative min-h-[560px] lg:min-h-[60vh] flex items-center bg-[#000000] overflow-hidden pt-28 pb-16 lg:py-0">
        
        {/* Inline Styles for animations */}
        <style dangerouslySetInnerHTML={{__html: \`
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
          .animate-float { animation: floatGentle 5s ease-in-out infinite; }
        \`}} />

        {/* Subtle dot grid overlay */}
        <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        {/* Radial Orange Glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FF7A00]/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Image Container */}
        <div className="absolute top-0 right-0 w-full h-[42%] lg:h-full lg:w-[65%] z-0 animate-zoom-out">
          {/* Preload image */}
          <link rel="preload" as="image" href="/about-hero-new.jpg" />
          <img src="/about-hero-new.jpg" alt="A DoorStep professional shaking hands with a smiling Sri Lankan family" className="w-full h-full object-cover object-[75%_center] lg:object-right" />
          
          {/* Gradient Overlay for Desktop (fades left to right) */}
          <div className="hidden lg:block absolute inset-0" style={{ background: 'linear-gradient(90deg, #000000 0%, #000000 36%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.1) 100%)' }}></div>

          {/* Gradient Overlay for Mobile (fades top to bottom) */}
          <div className="block lg:hidden absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, #000000 95%)' }}></div>
          
          {/* Floating Glass Card (Desktop Only) */}
          <div className="hidden lg:flex absolute bottom-[15%] left-[5%] animate-float flex-col bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] p-4 shadow-xl max-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[#FF7A00] bg-white/10 p-1.5 rounded-full">
                <Handshake size={18} />
              </div>
              <span className="text-white font-semibold text-[14px]">Built on trust</span>
            </div>
            <p className="text-white/80 text-[12px] leading-relaxed">
              Connecting homes with verified professionals
            </p>
          </div>
        </div>

        {/* Bottom edge gradient divider */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] z-20" style={{ background: 'linear-gradient(90deg, transparent 0%, #FF7A00 50%, transparent 100%)', opacity: 0.8 }}></div>

        {/* Content Container */}
        <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center h-full">
          <div className="max-w-[580px] mt-[40%] sm:mt-[30%] lg:mt-0">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 animate-fade-up-1">
              <Link to="/" className="text-white/60 text-[14px] hover:text-[#FF7A00] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] rounded">Home</Link>
              <ChevronRightIcon size={14} className="text-white/40" />
              <span className="text-white text-[14px] font-medium">About</span>
            </div>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-4 py-1.5 rounded-full mb-6 animate-fade-up-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7A00]"></div>
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.12em]">WHO WE ARE</span>
            </div>

            {/* Headline */}
            <h1 className="text-[38px] lg:text-[64px] font-bold text-white leading-[1.1] mb-6 font-poppins tracking-tight animate-fade-up-3">
              About <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">DoorStep</span>
                <svg className="absolute w-full h-[8px] lg:h-[12px] -bottom-2 lg:-bottom-3 left-0 text-[#FF7A00] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] lg:text-[20px] text-white/80 leading-[1.7] max-w-[520px] mb-10 font-inter animate-fade-up-4">
              Sri Lanka's most trusted home services platform, connecting households with verified professionals.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 animate-fade-up-5">
              <Link to="/services" className="w-full sm:w-auto group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-bold py-[14px] px-[28px] rounded-[12px] shadow-[0_8px_24px_rgba(255,122,0,0.35)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,122,0,0.4)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Book a Service
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link to="/join-worker" className="w-full sm:w-auto group bg-transparent border border-white text-white font-bold py-[14px] px-[28px] rounded-[12px] hover:bg-white hover:text-[#000000] transition-all duration-300 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                Become a Partner
              </Link>
            </div>

            {/* Trust Chips */}
            <div className="flex flex-wrap gap-3 animate-fade-up-5">
              <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-full py-1.5 px-3">
                <CheckCircle size={14} className="text-[#2E9E5B]" />
                <span className="text-white text-[13px] font-medium">NIC Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-full py-1.5 px-3">
                <CheckCircle size={14} className="text-[#2E9E5B]" />
                <span className="text-white text-[13px] font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-full py-1.5 px-3">
                <CheckCircle size={14} className="text-[#2E9E5B]" />
                <span className="text-white text-[13px] font-medium">Western Province</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      `;

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + replacement + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
  console.log('Replaced About Us hero section');
} else {
  console.log('Could not find start or end bounds in About.jsx');
}
