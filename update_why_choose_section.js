const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const startStr = '{/* 3. Why Choose DoorStep? */}';
const endStr = '{/* 4. Statistics Section */}';
const startIndex = code.lastIndexOf(startStr);
const endIndex = code.indexOf(endStr);

const oldBlock = code.substring(startIndex, endIndex);

const newBlock = `{/* 3. Why Choose DoorStep? - Redesigned */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF7A00]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            {/* Eyebrow */}
            <span className="bg-[#FFF1E3] text-[#FF7A00] text-[13px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.12em] mb-4">
              Why DoorStep
            </span>
            
            {/* Headline */}
            <h2 className="text-[30px] md:text-[44px] font-extrabold text-[#000000] mb-5 tracking-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">DoorStep?</span>
            </h2>
            
            {/* Gradient Underline */}
            <div className="w-[60px] h-[4px] rounded-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] mb-6"></div>

            {/* Subtitle */}
            <p className="text-[17px] md:text-[18px] text-[#6B6B6B] max-w-[560px] mx-auto leading-relaxed">
              We are Sri Lanka's most trusted home services platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#E8E2DB] overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-[#FF7A00]/50 transition-all duration-300 relative">
              {/* Top Animated Line */}
              <div className="absolute top-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] group-hover:w-full transition-all duration-500 z-20"></div>
              
              <div className="h-[220px] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Verified Professionals" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>
                
                {/* Number Pill */}
                <div className="absolute top-4 right-4 bg-white/18 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold px-3 py-1 rounded-full z-10">
                  01
                </div>

                {/* Icon Badge */}
                <div className="absolute -bottom-5 left-6 w-14 h-14 rounded-[16px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,122,0,0.35)] z-20">
                  <Shield size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="p-8 pt-10 flex flex-col h-[calc(100%-220px)]">
                <h3 className="text-[20px] lg:text-[22px] font-semibold text-[#000000] mb-3">Verified Professionals</h3>
                <p className="text-[#3D3D3D] text-[15px] lg:text-[16px] leading-[1.7] mb-6 flex-grow">Every worker undergoes strict identity checks, skill verification, and continuous quality monitoring.</p>
                
                <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-[#FF7A00] font-semibold text-[15px] group/link">
                  Learn more <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#E8E2DB] overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-[#FF7A00]/50 transition-all duration-300 relative">
              <div className="absolute top-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] group-hover:w-full transition-all duration-500 z-20"></div>
              
              <div className="h-[220px] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instant Booking" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-white/18 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold px-3 py-1 rounded-full z-10">
                  02
                </div>

                <div className="absolute -bottom-5 left-6 w-14 h-14 rounded-[16px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,122,0,0.35)] z-20">
                  <Clock size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="p-8 pt-10 flex flex-col h-[calc(100%-220px)]">
                <h3 className="text-[20px] lg:text-[22px] font-semibold text-[#000000] mb-3">Instant Booking</h3>
                <p className="text-[#3D3D3D] text-[15px] lg:text-[16px] leading-[1.7] mb-6 flex-grow">Book a service in seconds. Track your worker's arrival time and communicate securely via the app.</p>
                
                <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-[#FF7A00] font-semibold text-[15px] group/link">
                  Learn more <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#E8E2DB] overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-[#FF7A00]/50 transition-all duration-300 relative">
              <div className="absolute top-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] group-hover:w-full transition-all duration-500 z-20"></div>
              
              <div className="h-[220px] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Satisfaction Guaranteed" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-white/18 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold px-3 py-1 rounded-full z-10">
                  03
                </div>

                <div className="absolute -bottom-5 left-6 w-14 h-14 rounded-[16px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,122,0,0.35)] z-20">
                  <Star size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="p-8 pt-10 flex flex-col h-[calc(100%-220px)]">
                <h3 className="text-[20px] lg:text-[22px] font-semibold text-[#000000] mb-3">Satisfaction Guaranteed</h3>
                <p className="text-[#3D3D3D] text-[15px] lg:text-[16px] leading-[1.7] mb-6 flex-grow">Pay securely online or in cash. We ensure 100% satisfaction with dedicated customer support.</p>
                
                <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-[#FF7A00] font-semibold text-[15px] group/link">
                  Learn more <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="mt-16 pt-8 border-t border-[#E8E2DB] max-w-[800px] mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E8E2DB]">
            <div className="flex flex-col items-center px-8 w-full md:w-1/3">
              <span className="text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">1000+</span>
              <span className="text-[14px] text-[#6B6B6B] mt-1 font-medium">Verified Experts</span>
            </div>
            <div className="flex flex-col items-center px-8 pt-6 md:pt-0 w-full md:w-1/3">
              <span className="text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">4.8/5</span>
              <span className="text-[14px] text-[#6B6B6B] mt-1 font-medium">Average Rating</span>
            </div>
            <div className="flex flex-col items-center px-8 pt-6 md:pt-0 w-full md:w-1/3">
              <span className="text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">24/7</span>
              <span className="text-[14px] text-[#6B6B6B] mt-1 font-medium">Customer Support</span>
            </div>
          </div>

        </div>
      </section>

      `;

code = code.replace(oldBlock, newBlock);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Replaced Why Choose Doorstep section');
