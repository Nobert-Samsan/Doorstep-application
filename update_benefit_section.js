const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const oldBlock = code.substring(
  code.indexOf('{/* Block 1: Customer */}'),
  code.indexOf('{/* Block 2: Worker */}')
);

const newBlock = `{/* Block 1: Customer - Redesigned */}
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
                  Satisfy Every Home Need With Our <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">
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
                      <span className="text-[#000000] font-semibold text-[15px]">{item.text}</span>
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

          `;

// We need to make sure DollarSign is imported in Landing.jsx
if (!code.includes('DollarSign')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { DollarSign, $1 } from 'lucide-react';");
}

code = code.replace(oldBlock, newBlock);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Replaced benefits section');
