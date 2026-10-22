const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// 1. Remove sections
const howItWorksRegex = /\{\/\* 3\. How It Works \*\/\}[\s\S]*?<\/section>/;
code = code.replace(howItWorksRegex, '');

const exploreRegex = /\{\/\* 4\. Service Categories \*\/\}[\s\S]*?<\/section>/;
code = code.replace(exploreRegex, '');

const featuredWorkersRegex = /\{\/\* 4\.5 Featured Workers \*\/\}[\s\S]*?<\/section>/;
code = code.replace(featuredWorkersRegex, '');

const testimonialsRegex = /\{\/\* 4\.75 Testimonials \*\/\}[\s\S]*?<\/section>/;
code = code.replace(testimonialsRegex, '');

const liveStatsRegex = /\{\/\* 2\. Live Stats Bar \*\/\}[\s\S]*?<\/section>/;
code = code.replace(liveStatsRegex, '');

// 2. Mission Section Code
const missionSection = `
      {/* Mission Statement Section */}
      <section className="mission-section">
        <div className="mission-inner">
          {/* Layer 1 - Hook */}
          <div className="mission-hook">
            <div className="mission-hook-eyebrow"><span className="eyebrow-dot"></span> WHY DOORSTEP EXISTS</div>
            <h2 className="mission-hook-text">
              Finding reliable home help in Sri Lanka has always been a <span className="accent">change that.</span>
            </h2>
          </div>

          {/* Layer 3 - Two Columns */}
          <div className="mission-columns">
            <div className="mission-col-card">
              <div className="col-card-title">Who We Are</div>
              <div className="col-card-text" style={{fontSize: '16px'}}>
                We are Sri Lanka&apos;s dedicated home services marketplace — a platform that connects homeowners and tenants across <span className="orange-text">Western Province</span> with <strong>verified, background-checked skilled professionals</strong> for every home service need. From plumbing and electrical work to English tutoring, home cleaning, painting and beyond.
              </div>
            </div>
            <div className="mission-col-card">
              <div className="col-card-title">What We Do For You</div>
              <div className="col-card-text" style={{fontSize: '16px'}}>
                Whether you need a plumber urgently, a painter for your living room or a tutor for your child — <strong>DoorStep brings the right professional to your door.</strong> Quickly, safely and transparently. No word of mouth. No uncertainty. Just skilled, verified help when you need it.
              </div>
            </div>
          </div>

          {/* Layer 4 - Trust Strip */}
          <div className="mission-trust-strip">
            <div className="trust-strip-item">
              <div className="trust-strip-value">100%</div>
              <div className="trust-strip-underline"></div>
              <div className="trust-strip-label">NIC Verified Professionals</div>
            </div>
            <div className="trust-strip-item">
              <div className="trust-strip-value accent-orange">Western</div>
              <div className="trust-strip-underline"></div>
              <div className="trust-strip-label">Province covered</div>
            </div>
            <div className="trust-strip-item">
              <div className="trust-strip-value">50+</div>
              <div className="trust-strip-underline"></div>
              <div className="trust-strip-label">Types of home services available</div>
            </div>
          </div>
        </div>
      </section>
`;

// 3. Customer & Worker Sections Code
const newSections = `
      {/* Block 1: Customer - Redesigned */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="bg-[#FFF8F1] rounded-[32px] p-6 lg:p-12 border border-[#E8E2DB] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Image Column */}
              <div className="relative group w-full">
                {/* Offset decorative shape */}
                <div className="absolute top-4 left-4 right-[-16px] bottom-[-16px] rounded-[24px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] opacity-15 pointer-events-none transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                
                {/* Main Image */}
                <div className="aspect-[4/3] rounded-[24px] overflow-hidden relative z-10 shadow-lg">
                  <img src="/benefit-1.jpg" alt="Customer Benefits" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                {/* Floating Badge 1 - Bottom Left */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce-slow">
                  <div className="w-8 h-8 rounded-full bg-[#2E9E5B]/10 flex items-center justify-center text-[#2E9E5B]">
                    <CheckCircle size={18} strokeWidth={3} />
                  </div>
                  <span className="text-[#000000] font-bold text-[15px]">Verified Professionals</span>
                </div>

                {/* Floating Badge 2 - Top Right */}
                <div className="absolute -top-6 -right-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF1E3] flex items-center justify-center text-[#FF7A00]">
                    <Users size={18} strokeWidth={3} />
                  </div>
                  <span className="text-[#000000] font-bold text-[15px]">1000+ Experts</span>
                </div>
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
                <h2 className="text-[30px] lg:text-[44px] font-extrabold text-[#000000] leading-[1.15] mb-6 tracking-tight">
                  Satisfy Every Home Need <br/>With Our <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">
                    Exceptional Services
                    <span className="absolute bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] rounded-full opacity-80"></span>
                  </span>
                </h2>

                {/* Paragraphs */}
                <div className="space-y-4 text-[16px] lg:text-[17px] text-[#3D3D3D] leading-[1.7]">
                  <p>DoorStep is the leading home service solution in <span className="font-semibold text-black">Sri Lanka</span> that is seamlessly integrated into the busy lifestyle of everyday people.</p>
                  <p>We provide the ultimate convenience of instant doorstep service and enable our customers to explore over thousands of <span className="font-semibold text-black">verified professionals</span> ranging from plumbers, electricians, AC technicians, and much more in order to select the perfect match for your specific requirements.</p>
                </div>

                {/* 2x2 Trust Grid */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { icon: <Shield size={18} />, text: 'Verified Professionals' },
                    { icon: <Clock size={18} />, text: 'Instant Booking' },
                    { icon: <DollarSign size={18} />, text: 'Transparent Pricing' },
                    { icon: <Star size={18} />, text: 'Trusted Service' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF1E3] text-[#FF7A00] flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-[#000000] font-bold text-[20px]">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="flex flex-wrap items-center gap-4 mt-10">
                  <Link to="/services" className="group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-bold py-3.5 px-8 rounded-xl shadow-[0_8px_20px_rgba(255,122,0,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                    Explore Services
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link to="/how-it-works" className="border-2 border-[#000000] text-[#000000] font-bold py-3 px-8 rounded-xl hover:bg-[#000000] hover:text-white transition-all duration-300">
                    How It Works
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Block 2: Worker - Redesigned */}
          <div className="bg-[#000000] rounded-[32px] p-6 lg:p-12 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF7A00]/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
              
              {/* Image Column */}
              <div className="relative group w-full order-first lg:order-none">
                {/* Offset decorative shape */}
                <div className="absolute top-4 left-4 right-[-16px] bottom-[-16px] rounded-[24px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] opacity-25 pointer-events-none transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                
                {/* Main Image */}
                <div className="aspect-[4/3] rounded-[24px] overflow-hidden relative z-10 shadow-2xl border border-white/10">
                  <img src="/benefit-2.jpg" alt="Worker Benefits" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                {/* Floating Badge 1 - Top Left */}
                <div className="absolute -top-5 -left-5 z-20 bg-white rounded-2xl p-3.5 shadow-xl flex items-center gap-2.5 animate-bounce-slow">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2E9E5B] animate-pulse"></div>
                  <span className="text-[#000000] font-bold text-[14px]">Now Hiring</span>
                </div>

                {/* Floating Badge 2 - Bottom Right */}
                <div className="absolute -bottom-6 -right-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF1E3] flex items-center justify-center text-[#FF7A00]">
                    <Briefcase size={18} strokeWidth={3} />
                  </div>
                  <span className="text-[#000000] font-bold text-[15px]">Join 1000+ Professionals</span>
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
                <h2 className="text-[30px] lg:text-[48px] font-extrabold text-white leading-[1.15] mb-4 tracking-tight">
                  Got A Skill? <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">Grow With Us.</span>
                </h2>

                {/* Sub-headline */}
                <p className="text-[18px] lg:text-[20px] font-semibold text-white mb-4 leading-[1.4]">
                  We're hungry for the BEST! A world of customers now within your reach!
                </p>

                {/* Paragraphs */}
                <p className="text-[17px] font-bold text-white/70 leading-[1.7] mb-8">
                  DoorStep is a one app solution to the customers' household mobility needs. So why not join us as a Service Professional and grow your business with us?
                </p>

                {/* 3 Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 border-t border-white/10 pt-8">
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#FF7A00]/15 text-[#FF7A00] flex items-center justify-center">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-[15px] mb-1">More Customers</h4>
                      <p className="text-white/50 text-[13px] leading-snug">Steady job requests near you</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#FF7A00]/15 text-[#FF7A00] flex items-center justify-center">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-[15px] mb-1">Flexible Schedule</h4>
                      <p className="text-white/50 text-[13px] leading-snug">Work when you want</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#FF7A00]/15 text-[#FF7A00] flex items-center justify-center">
                      <Banknote size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-[15px] mb-1">Fast Payments</h4>
                      <p className="text-white/50 text-[13px] leading-snug">Get paid on time</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div>
                  <div className="flex flex-wrap items-center gap-6">
                    <Link to="/join-worker" className="group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-bold py-[14px] px-[28px] rounded-xl shadow-[0_8px_24px_rgba(255,122,0,0.35)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                      Partner With Us
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link to="/how-it-works" className="border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white hover:text-[#000000] transition-all duration-300">
                      How It Works
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
`;

// Insert after Hero Section
const heroEndIdx = code.indexOf('</section>') + '</section>'.length;
code = code.substring(0, heroEndIdx) + '\n' + missionSection + '\n' + newSections + code.substring(heroEndIdx);

// Add missing imports
if (!code.includes('DollarSign')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { DollarSign, CheckCircle, Users, ArrowRight, Briefcase, TrendingUp, Calendar, Banknote, $1 } from 'lucide-react';");
}

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log("Restored Landing.jsx perfectly!");
