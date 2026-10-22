const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const heroStart = code.indexOf('{/* 1. Hero Section - Redesigned */}');
const nextSectionStart = code.indexOf('</section>', heroStart) + '</section>'.length;

const newHero = `{/* 1. Hero Section - Redesigned */}
      <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center bg-[#000000] overflow-hidden pt-[15vh] pb-16 lg:py-0">
        
        {/* Subtle dot grid overlay */}
        <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        {/* Radial Orange Glow */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF7A00]/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Image Container */}
        <div className="absolute top-0 right-0 w-full h-[55%] lg:h-full z-0">
          <img src="/hero-new.png" alt="DoorStep Home Services" className="w-full h-full object-cover lg:object-[center_20%] animate-fade-in-zoom" />
          
          {/* Gradient Overlay for Desktop (fades left to right) */}
          <div className="hidden lg:block absolute inset-0" style={{ background: 'linear-gradient(90deg, #000000 0%, #000000 38%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.15) 100%)' }}></div>

          {/* Gradient Overlay for Mobile (fades top to bottom) */}
          <div className="block lg:hidden absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, #000000 95%)' }}></div>
          
          {/* Floating Elements - Desktop Only */}
          <div className="hidden lg:flex absolute top-32 right-16 z-20 bg-white/10 backdrop-blur-[16px] border border-white/20 rounded-[16px] px-5 py-3 items-center gap-3 animate-float">
            <div className="text-[#FF7A00] shrink-0">
              <Clock size={24} />
            </div>
            <span className="text-white font-semibold text-[15px]">Arrives in 30 mins</span>
          </div>

          <div className="hidden lg:flex absolute bottom-32 left-[45%] z-20 bg-white/10 backdrop-blur-[16px] border border-white/20 rounded-[16px] p-4 items-center gap-4 animate-float-delayed">
            <div className="w-12 h-12 rounded-full bg-[#2E9E5B] flex items-center justify-center text-white shrink-0 shadow-lg">
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-[15px] mb-0.5">Verified Professional</h4>
              <p className="text-white text-[13px]">ID checked and skill tested</p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center h-full">
          <div className="max-w-[620px] mt-[15vh] lg:mt-0">
            
            {/* Eyebrow */}
            <div className="animate-fade-up-stagger-1 inline-flex items-center gap-2 bg-white/5 border border-white/15 px-4 py-2 rounded-full mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2E9E5B] animate-pulse shadow-[0_0_8px_rgba(46,158,91,0.6)]"></div>
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.05em]">Sri Lanka's Most Trusted Home Services</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-stagger-1 text-[44px] lg:text-[72px] font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
              Every Service, <br className="hidden lg:block" />
              <span className="relative inline-block mt-2 lg:mt-0">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">Right at Your DoorStep</span>
                <svg className="absolute w-full h-[12px] -bottom-2 left-0 text-[#FF7A00] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up-stagger-2 text-[18px] lg:text-[22px] text-white/80 leading-[1.7] max-w-[540px] mb-12 font-medium">
              Connect with trusted, verified local skilled workers in Sri Lanka for all your home service needs. Book instantly, pay securely.
            </p>

            {/* Call to Action Buttons */}
            <div className="animate-fade-up-stagger-3 flex flex-col sm:flex-row items-center gap-4">
              <Link to="/services" className="w-full sm:w-auto group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-bold py-[16px] px-[32px] rounded-[12px] shadow-[0_8px_20px_rgba(255,122,0,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(255,122,0,0.35)] transition-all duration-300 flex items-center justify-center gap-2">
                Explore Services
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link to="/join-worker" className="w-full sm:w-auto group bg-transparent border-2 border-white/20 text-white font-bold py-[14px] px-[32px] rounded-[12px] hover:bg-white hover:text-[#000000] hover:border-white transition-all duration-300 flex items-center justify-center gap-2">
                Join as a Professional
              </Link>
            </div>

          </div>
        </div>

        {/* Scroll Cue */}
        <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-60">
          <div className="w-[22px] h-[36px] border-2 border-white/70 rounded-full flex justify-center pt-2">
            <div className="w-1 h-1.5 bg-white rounded-full animate-scroll-dot"></div>
          </div>
        </div>
      </section>`;

code = code.substring(0, heroStart) + newHero + code.substring(nextSectionStart);
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Hero section simplified!');
