const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// 1. 1000+ Experts
const b1 = `                {/* Floating Badge 1 - Top Right */}
                <div className="absolute top-8 -right-8 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce-slow">
                  <div className="w-8 h-8 rounded-full bg-[#FFF1E3] flex items-center justify-center text-[#FF7A00]">
                    <Users size={18} strokeWidth={3} />
                  </div>
                  <span className="text-[#000000] font-bold text-[15px]">1000+ Experts</span>
                </div>`;
code = code.replace(b1, '');

// 2. Verified Professionals (Floating Badge 2 - Bottom Left)
const b2 = `                {/* Floating Badge 2 - Bottom Left */}
                <div className="absolute bottom-12 -left-10 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E5F5EB] flex items-center justify-center text-[#2E9E5B]">
                    <CheckCircle size={18} strokeWidth={3} />
                  </div>
                  <span className="text-[#000000] font-bold text-[15px]">Verified Professionals</span>
                </div>`;
code = code.replace(b2, '');

// 3. Now Hiring
const b3 = `                {/* Floating Badge 1 - Top Left */}
                <div className="absolute -top-5 -left-5 z-20 bg-white rounded-2xl p-3.5 shadow-xl flex items-center gap-2.5 animate-bounce-slow">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2E9E5B] animate-pulse"></div>
                  <span className="text-[#000000] font-bold text-[14px]">Now Hiring</span>
                </div>`;
code = code.replace(b3, '');

// 4. Join 1000+ Professionals
const b4 = `                {/* Floating Badge 2 - Bottom Right */}
                <div className="absolute -bottom-6 -right-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF1E3] flex items-center justify-center text-[#FF7A00]">
                    <Briefcase size={18} strokeWidth={3} />
                  </div>
                  <span className="text-[#000000] font-bold text-[15px]">Join 1000+ Professionals</span>
                </div>`;
code = code.replace(b4, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Badges removed safely.');
