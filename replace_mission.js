const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const startIdx = code.indexOf('{/* Mission Statement Section */}');
const endIdx = code.indexOf('<section className="py-20 bg-white">');

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `{/* Mission Statement Section */}
      <section className="relative bg-[#FFFFFF] py-16 md:py-24">
        {/* Subtle Warm Glow Behind Headline */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF7A00]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10">
          
          {/* Header Area */}
          <div className="flex flex-col items-center text-center mb-16">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-[#FFF1E3] border border-[#FF7A00]/30 px-4 py-1.5 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse"></div>
              <span className="text-[#E86100] text-[13px] font-bold uppercase tracking-[0.12em]">WHY DOORSTEP EXISTS</span>
            </div>

            {/* Headline */}
            <h2 className="text-[#000000] font-bold text-[30px] md:text-[48px] leading-[1.15] max-w-[820px] font-poppins">
              Finding reliable home help in Sri Lanka has always been a{' '}
              <span className="relative inline-block mt-2 md:mt-0">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">challenge.</span>
                <svg className="absolute w-[60px] h-[4px] -bottom-3 left-1/2 -translate-x-1/2 text-[#FF7A00]" viewBox="0 0 60 4" preserveAspectRatio="none">
                  <path d="M0 2 Q 30 4 60 2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Card 1 */}
            <div className="group relative bg-white rounded-[24px] border border-[#E8E2DB] p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:border-[#FF7A00]/50 transition-all duration-300 flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-[#FF7A00] focus-within:border-transparent">
              {/* Top Gradient Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center text-white shrink-0 shadow-md">
                  <Shield size={24} />
                </div>
                <h3 className="text-[#000000] font-semibold text-[22px] font-poppins m-0">Who We Are</h3>
              </div>
              
              <p className="text-[#3D3D3D] text-[16px] md:text-[17px] leading-[1.75] font-inter">
                We are Sri Lanka's dedicated home services marketplace — a platform that connects homeowners and tenants across <span className="text-[#000000] font-semibold relative z-10"><span className="absolute bottom-1 left-0 w-full h-[40%] bg-[#FF7A00]/15 -z-10"></span>Western Province</span> with <span className="text-[#000000] font-semibold">verified, background-checked skilled professionals</span> for every home service need. From plumbing and electrical work to English tutoring, home cleaning, painting and beyond.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white rounded-[24px] border border-[#E8E2DB] p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:border-[#FF7A00]/50 transition-all duration-300 flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-[#FF7A00] focus-within:border-transparent">
              {/* Top Gradient Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center text-white shrink-0 shadow-md">
                  <Home size={24} />
                </div>
                <h3 className="text-[#000000] font-semibold text-[22px] font-poppins m-0">What We Do For You</h3>
              </div>
              
              <p className="text-[#3D3D3D] text-[16px] md:text-[17px] leading-[1.75] font-inter flex-grow mb-6">
                Whether you need a plumber urgently, a painter for your living room or a tutor for your child — <span className="text-[#000000] font-semibold">DoorStep brings the right professional to your door.</span> Quickly, safely and transparently. No word of mouth. No uncertainty. Just skilled, verified help when you need it.
              </p>
              
              {/* Check-list items */}
              <div className="pt-5 border-t border-[#E8E2DB] flex flex-wrap items-center justify-between gap-4 mt-auto">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#2E9E5B]" />
                  <span className="text-[#000000] font-semibold text-[15px]">Quick</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#2E9E5B]" />
                  <span className="text-[#000000] font-semibold text-[15px]">Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#2E9E5B]" />
                  <span className="text-[#000000] font-semibold text-[15px]">Transparent</span>
                </div>
              </div>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="relative bg-[#000000] rounded-[24px] p-8 md:p-10 overflow-hidden shadow-xl">
            {/* Dotted pattern and glow */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-[#FF7A00]/15 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
              
              {/* Stat 1 */}
              <div className="flex-1 flex flex-col items-center text-center w-full">
                <div className="w-12 h-12 rounded-full bg-[#FF7A00]/15 flex items-center justify-center text-[#FF7A00] mb-4">
                  <Shield size={24} />
                </div>
                <div className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[44px] md:text-[52px] leading-none mb-4 font-poppins tabular-nums">
                  100%
                </div>
                <div className="w-8 h-[2px] bg-[#FF7A00] mb-4 rounded-full"></div>
                <p className="text-white/85 text-[14px] md:text-[15px] font-inter max-w-[200px]">
                  NIC Verified Professionals
                </p>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-[1px] h-[120px] bg-white/10"></div>
              <div className="block md:hidden w-full max-w-[150px] h-[1px] bg-white/10"></div>

              {/* Stat 2 */}
              <div className="flex-1 flex flex-col items-center text-center w-full">
                <div className="w-12 h-12 rounded-full bg-[#FF7A00]/15 flex items-center justify-center text-[#FF7A00] mb-4">
                  <MapPin size={24} />
                </div>
                <div className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[36px] md:text-[44px] leading-none mb-4 font-poppins">
                  Western
                </div>
                <div className="w-8 h-[2px] bg-[#FF7A00] mb-4 rounded-full"></div>
                <p className="text-white/85 text-[14px] md:text-[15px] font-inter max-w-[200px]">
                  Province covered
                </p>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-[1px] h-[120px] bg-white/10"></div>
              <div className="block md:hidden w-full max-w-[150px] h-[1px] bg-white/10"></div>

              {/* Stat 3 */}
              <div className="flex-1 flex flex-col items-center text-center w-full">
                <div className="w-12 h-12 rounded-full bg-[#FF7A00]/15 flex items-center justify-center text-[#FF7A00] mb-4">
                  <Wrench size={24} />
                </div>
                <div className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[44px] md:text-[52px] leading-none mb-4 font-poppins tabular-nums">
                  50+
                </div>
                <div className="w-8 h-[2px] bg-[#FF7A00] mb-4 rounded-full"></div>
                <p className="text-white/85 text-[14px] md:text-[15px] font-inter max-w-[200px]">
                  Types of home services available
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      `;
  
  code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
  fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
  console.log('Successfully replaced Mission Statement Section!');
} else {
  console.error('Could not find start or end markers for replacement');
}
