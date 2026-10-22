const fs = require('fs');
let css = fs.readFileSync('frontend-web/src/index.css', 'utf8');

const customAnimations = `
/* --- NEW HERO SECTION ANIMATIONS --- */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInZoom {
  from { opacity: 0; transform: scale(1.08); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes scrollDot {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(8px); opacity: 0; }
}

.animate-fade-up-stagger-1 { animation: fadeUp 0.6s ease-out 0.1s both; }
.animate-fade-up-stagger-2 { animation: fadeUp 0.6s ease-out 0.2s both; }
.animate-fade-up-stagger-3 { animation: fadeUp 0.6s ease-out 0.3s both; }
.animate-fade-up-stagger-4 { animation: fadeUp 0.6s ease-out 0.4s both; }
.animate-fade-in-zoom { animation: fadeInZoom 1.4s cubic-bezier(0.2, 0, 0, 1) both; }
.animate-float { animation: float 5s ease-in-out infinite; }
.animate-float-delayed { animation: float 6s ease-in-out infinite 1s; }
.animate-scroll-dot { animation: scrollDot 1.5s infinite; }
`;

if (!css.includes('NEW HERO SECTION ANIMATIONS')) {
  fs.writeFileSync('frontend-web/src/index.css', css + customAnimations);
}

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const heroStart = code.indexOf('{/* 1. Hero Section */}');
const heroEnd = code.indexOf('</section>', heroStart) + '</section>'.length;

const newHero = `{/* 1. Hero Section - Redesigned */}
      <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center bg-[#000000] overflow-hidden pt-[25vh] pb-16 lg:py-0">
        
        {/* Subtle dot grid overlay */}
        <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        {/* Radial Orange Glow */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF7A00]/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Image Container (Full width, masked by gradients) */}
        <div className="absolute top-0 right-0 w-full h-[55%] lg:h-full z-0 animate-fade-in-zoom">
          <img src="/hero-new.png" alt="DoorStep Home Services" className="w-full h-full object-cover lg:object-[center_20%]" />
          
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
          <div className="max-w-[620px]">
            
            {/* Eyebrow */}
            <div className="animate-fade-up-stagger-1 inline-flex items-center gap-2 bg-white/5 border border-white/15 px-4 py-2 rounded-full mb-6 mt-[20vh] lg:mt-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2E9E5B] animate-pulse shadow-[0_0_8px_rgba(46,158,91,0.6)]"></div>
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.05em]">Sri Lanka's Most Trusted Home Services</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-stagger-1 text-[38px] lg:text-[68px] font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Every Service, <br className="hidden lg:block" />
              <span className="relative inline-block mt-2 lg:mt-0">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">Right at Your DoorStep</span>
                <svg className="absolute w-full h-[12px] -bottom-2 left-0 text-[#FF7A00] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up-stagger-1 text-[17px] lg:text-[20px] text-white/80 leading-[1.7] max-w-[540px] mb-10">
              Connect with trusted, verified local skilled workers in Sri Lanka for all your home service needs. Book instantly, pay securely.
            </p>

            {/* Search Bar */}
            <div className="animate-fade-up-stagger-2 bg-white rounded-[16px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-2 mb-6 focus-within:ring-2 focus-within:ring-[#FF7A00]/50 transition-shadow">
              <div className="flex-1 flex items-center w-full px-4 py-3 md:py-0">
                <Search className="text-[#6B6B6B] mr-3 shrink-0" size={22} />
                <input type="text" placeholder="What service do you need?" className="w-full bg-transparent outline-none text-[#000000] placeholder-[#6B6B6B] text-[16px]" />
              </div>
              
              <div className="hidden md:block w-[1px] h-10 bg-[#E8E2DB]"></div>
              <div className="block md:hidden w-full h-[1px] bg-[#E8E2DB] my-1"></div>

              <div className="flex-1 flex items-center w-full px-4 py-3 md:py-0">
                <MapPin className="text-[#6B6B6B] mr-3 shrink-0" size={22} />
                <input type="text" placeholder="Your city" className="w-full bg-transparent outline-none text-[#000000] placeholder-[#6B6B6B] text-[16px]" />
              </div>

              <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-bold py-[14px] px-[28px] rounded-[12px] shadow-[0_8px_20px_rgba(255,122,0,0.25)] hover:-translate-y-1 transition-all duration-300 group mt-2 md:mt-0 shrink-0 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#FF7A00] outline-none">
                Search
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Popular Chips */}
            <div className="animate-fade-up-stagger-3 flex flex-wrap items-center gap-2.5 mb-12">
              <span className="text-white/70 text-[14px] mr-2">Popular:</span>
              {['Plumbing', 'Electrician', 'AC Repair', 'Cleaning', 'Painting'].map(cat => (
                <button key={cat} className="bg-white/10 border border-white/20 text-white text-[14px] px-4 py-1.5 rounded-full hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none">
                  {cat}
                </button>
              ))}
            </div>

            {/* Trust Row */}
            <div className="animate-fade-up-stagger-4 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 border-t border-white/15 pt-8">
              <div className="flex flex-col">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[22px] leading-tight mb-0.5">1000+</span>
                <span className="text-white/70 text-[13px] font-semibold uppercase tracking-wide">Verified Experts</span>
              </div>
              <div className="hidden sm:block w-[1px] h-[80%] bg-white/15 mx-auto self-center"></div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[22px] leading-tight">4.8/5</span>
                  <Star size={16} fill="#FF9F0A" color="#FF9F0A" />
                </div>
                <span className="text-white/70 text-[13px] font-semibold uppercase tracking-wide">Average Rating</span>
              </div>
              <div className="hidden sm:block w-[1px] h-[80%] bg-white/15 mx-auto self-center"></div>
              <div className="flex flex-col">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[22px] leading-tight mb-0.5">Secure</span>
                <span className="text-white/70 text-[13px] font-semibold uppercase tracking-wide">Online or Cash</span>
              </div>
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

code = code.substring(0, heroStart) + newHero + code.substring(heroEnd);
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Hero section redesigned!');
