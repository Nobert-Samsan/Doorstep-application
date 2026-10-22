const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const startIdx = code.indexOf('{/* 5. Why Choose DoorStep? */}');
const endIdx = code.indexOf('</section>', startIdx) + '</section>'.length;

const redesignedWhyChoose = `{/* 5. Why Choose DoorStep? */}
      <section className="py-16 md:py-24 bg-white relative">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF7A00]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            {/* Eyebrow */}
            <span className="bg-[#FFF1E3] text-[#FF7A00] text-[13px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.12em] mb-4">
              WHY DOORSTEP
            </span>
            
            {/* Headline */}
            <h2 className="text-[30px] md:text-[44px] font-extrabold text-[#000000] mb-4 leading-tight">
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
            <div className="bg-white rounded-[24px] border border-[#E8E2DB] shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] hover:border-[#FF7A00]/50 transition-all duration-300 relative flex flex-col h-full">
              {/* Top animated border */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-20"></div>
              
              <div className="h-56 w-full overflow-hidden relative shrink-0">
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Verified Professionals" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>
                
                {/* Number Tag */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-[14px] px-3 py-1 rounded-full">
                  01
                </div>

                {/* Icon Badge */}
                <div className="absolute -bottom-6 left-6 w-[56px] h-[56px] rounded-[16px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,122,0,0.35)] z-20">
                  <Shield size={26} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="p-8 pt-12 flex-1 flex flex-col bg-white z-10 relative">
                <h3 className="text-[20px] font-bold text-[#000000] mb-3">Verified Professionals</h3>
                <p className="text-[#3D3D3D] leading-[1.7] text-[16px]">Every worker undergoes strict identity checks, skill verification, and continuous quality monitoring.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[24px] border border-[#E8E2DB] shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] hover:border-[#FF7A00]/50 transition-all duration-300 relative flex flex-col h-full">
              {/* Top animated border */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-20"></div>
              
              <div className="h-56 w-full overflow-hidden relative shrink-0">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instant Booking" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>
                
                {/* Number Tag */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-[14px] px-3 py-1 rounded-full">
                  02
                </div>

                {/* Icon Badge */}
                <div className="absolute -bottom-6 left-6 w-[56px] h-[56px] rounded-[16px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,122,0,0.35)] z-20">
                  <Clock size={26} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="p-8 pt-12 flex-1 flex flex-col bg-white z-10 relative">
                <h3 className="text-[20px] font-bold text-[#000000] mb-3">Instant Booking</h3>
                <p className="text-[#3D3D3D] leading-[1.7] text-[16px]">Book a service in seconds. Track your worker's arrival time and communicate securely via the app.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[24px] border border-[#E8E2DB] shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] hover:border-[#FF7A00]/50 transition-all duration-300 relative flex flex-col h-full">
              {/* Top animated border */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-20"></div>
              
              <div className="h-56 w-full overflow-hidden relative shrink-0">
                <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Satisfaction Guaranteed" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>
                
                {/* Number Tag */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-[14px] px-3 py-1 rounded-full">
                  03
                </div>

                {/* Icon Badge */}
                <div className="absolute -bottom-6 left-6 w-[56px] h-[56px] rounded-[16px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,122,0,0.35)] z-20">
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
      </section>`;

code = code.substring(0, startIdx) + redesignedWhyChoose + code.substring(endIdx);
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log("Updated Why Choose DoorStep successfully!");
