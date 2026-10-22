const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const oldBlock = code.substring(
  code.indexOf('{/* Block 2: Worker */}'),
  code.indexOf('{/* 3. Why Choose DoorStep? */}')
);

const newBlock = `{/* Block 2: Worker - Redesigned */}
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
                <p className="text-[16px] lg:text-[17px] text-white/70 leading-[1.7] mb-8">
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
                    <Link to="/how-it-works" className="text-white text-[15px] font-semibold underline underline-offset-4 hover:text-[#FF7A00] transition-colors duration-200">
                      Learn how it works
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

// Make sure icons are imported
const requiredIcons = ['Briefcase', 'TrendingUp', 'Calendar', 'Banknote', 'CheckCircle'];
let imports = '';
for (const icon of requiredIcons) {
  if (!code.includes(icon + ',')) { // Simple check, might need better regex
    imports += icon + ', ';
  }
}

if (imports.length > 0) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { " + imports + "$1 } from 'lucide-react';");
}

code = code.replace(oldBlock, newBlock);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Replaced worker benefits section');
