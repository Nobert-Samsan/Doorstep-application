const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/customer/Dashboard.jsx', 'utf8');

// The original hero section block
const startHero = code.indexOf('<section className="hero-section">');
const endHero = code.indexOf('</section>', startHero) + '</section>'.length;

const newHero = `          {/* Hero Section Redesign */}
          <section className="relative w-full min-h-auto md:min-h-[500px] lg:min-h-[56vh] bg-[#000000] flex flex-col md:justify-center overflow-hidden">
            
            {/* Background Split Layout */}
            <div className="absolute inset-0 w-full h-full flex flex-col md:flex-row">
              <div className="hidden md:block w-[42%] bg-[#000000]"></div>
              <div className="w-full h-[38%] md:h-full md:w-[58%] relative overflow-hidden">
                <img 
                  src="/customer-hero-bg.jpg" 
                  alt="A DoorStep electrician at work while a smiling homeowner relaxes" 
                  className="w-full h-full object-cover object-[center_right] animate-[slowZoomOut_1.2s_ease-out_forwards]"
                />
                {/* Mobile Fade Overlay */}
                <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/10 to-[#000000] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, #000000 95%)' }}></div>
              </div>
            </div>

            {/* Desktop Fade Overlay */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#000000] pointer-events-none" style={{ background: 'linear-gradient(90deg, #000000 0%, #000000 36%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.1) 100%)' }}></div>

            {/* Subtle Decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none mix-blend-screen opacity-50"></div>
            <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[400px] h-[400px] bg-[#FF7A00]/15 rounded-full blur-[100px] pointer-events-none"></div>

            <style dangerouslySetInnerHTML={{__html: \`
              @keyframes slowZoomOut {
                from { transform: scale(1.06); }
                to { transform: scale(1); }
              }
              @keyframes pulseGreen {
                0% { box-shadow: 0 0 0 0 rgba(46, 158, 91, 0.7); }
                70% { box-shadow: 0 0 0 6px rgba(46, 158, 91, 0); }
                100% { box-shadow: 0 0 0 0 rgba(46, 158, 91, 0); }
              }
              @keyframes floatCard {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
              }
            \`}} />

            {/* Bottom Edge Line */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] pointer-events-none opacity-80" style={{ background: 'linear-gradient(90deg, transparent 0%, #FF7A00 50%, transparent 100%)' }}></div>

            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-[42vh] md:pt-0 pb-12 flex flex-col">
              
              {/* Content Container */}
              <div className="w-full max-w-[620px] text-left">
                
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/15 rounded-full px-3 py-1.5 mb-5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#2E9E5B] animate-[pulseGreen_2s_infinite]"></div>
                  <span className="text-white text-[13px] font-medium tracking-wide">{getGreeting()}</span>
                </div>

                {/* Headline */}
                <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-poppins font-bold text-white leading-[1.1] mb-4">
                  Hello, <span className="inline-block relative text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] truncate max-w-[200px] md:max-w-[300px] align-bottom">
                    {user?.firstName || 'Nobert'}
                    <span className="absolute -bottom-1 left-0 w-full h-[5px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] rounded-full"></span>
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-white/80 font-inter text-[18px] md:text-[20px] leading-[1.7] mb-8">
                  What can we help you fix or clean today?
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative w-full h-[64px] bg-white rounded-[16px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center p-2 group transition-all duration-300 focus-within:ring-4 focus-within:ring-[#FF7A00]/25">
                  <div className="pl-4 pr-3 flex items-center justify-center pointer-events-none">
                    <Search className="text-[#6B6B6B] w-5 h-5 group-focus-within:text-[#FF7A00] transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search any home service (e.g. AC repair, plumbing)..." 
                    className="flex-1 h-full bg-transparent border-none outline-none font-inter text-[16px] text-[#000000] placeholder-[#6B6B6B]"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                  />
                  <button type="submit" className="h-full px-6 bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] text-white font-semibold text-[15px] rounded-[12px] flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 group/btn focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 focus:ring-offset-white">
                    Search
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </form>

                {/* Popular Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-5">
                  <span className="text-white/70 text-[14px] font-medium mr-1">Popular:</span>
                  {['Plumbing', 'Electrician', 'AC Repair', 'Cleaning', 'Painting'].map(chip => (
                    <button 
                      key={chip}
                      type="button"
                      onClick={() => handleCategoryCardClick(chip)}
                      className="bg-white/10 border border-white/20 rounded-full px-3.5 py-1 text-white text-[14px] hover:border-[#FF7A00] hover:text-[#FF7A00] hover:bg-[#FF7A00]/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Quick Actions (Grid) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                  {[
                    { label: 'My Bookings', icon: Briefcase, path: '/customer/bookings' },
                    { label: 'Post a Job', icon: PenTool, path: '/customer/post-job' },
                    { label: 'Saved Workers', icon: ShieldCheck, path: '/customer/saved' },
                    { label: 'Messages', icon: Search, path: '/customer/messages' } // using search as placeholder icon if message not imported
                  ].map((action, i) => (
                    <button 
                      key={i}
                      onClick={() => navigate(action.path)}
                      className="group flex flex-col items-center justify-center gap-2 bg-white/5 backdrop-blur-[12px] border border-white/15 rounded-[16px] p-3 hover:border-[#FF7A00]/60 hover:bg-[#FF7A00]/10 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(255,122,0,0.15)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-md">
                        <action.icon size={20} className="text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-white font-semibold text-[13px]">{action.label}</span>
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Upcoming Booking Card (Desktop Only, positioned right) */}
            <div className="hidden lg:flex absolute bottom-[15%] right-[5%] z-20 w-[300px] bg-white/10 backdrop-blur-[16px] border border-white/20 rounded-[16px] p-5 flex-col shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-[floatCard_6s_ease-in-out_infinite]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#2E9E5B] animate-[pulseGreen_2s_infinite]"></div>
                <span className="text-white/90 text-[13px] font-medium tracking-wide uppercase">Upcoming Booking</span>
              </div>
              <h4 className="text-white font-bold text-[18px] leading-tight mb-1">AC Repair</h4>
              <p className="text-white/70 text-[14px] mb-4">with Sameera • Tomorrow, 10:00 AM</p>
              <button className="text-[#FF7A00] font-semibold text-[14px] flex items-center gap-1 hover:text-[#F94D1A] transition-colors group/link w-fit">
                View details 
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </section>`;

if (startHero !== -1 && endHero !== -1) {
  code = code.substring(0, startHero) + newHero + code.substring(endHero);
  fs.writeFileSync('frontend-web/src/pages/customer/Dashboard.jsx', code);
  console.log('Successfully redesigned Customer Dashboard Hero!');
} else {
  console.log('Could not find hero-section block!');
}
