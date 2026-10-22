const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const oldButtons = `{/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link to="/how-it-works" className="w-full sm:w-auto group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-bold py-[14px] px-[28px] rounded-[12px] shadow-[0_8px_24px_rgba(255,122,0,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,122,0,0.4)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                    Learn How It Works
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link to="/contact" className="text-[#000000] font-semibold text-[16px] underline hover:text-[#FF7A00] transition-colors decoration-2 underline-offset-4 focus-visible:outline-none">
                    Contact Us
                  </Link>
                </div>`;

const newButtons = `{/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link to="/contact" className="w-full sm:w-auto group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-bold py-[14px] px-[28px] rounded-[12px] shadow-[0_8px_24px_rgba(255,122,0,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,122,0,0.4)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                    Contact Us
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>`;

code = code.replace(oldButtons, newButtons);
fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Updated buttons in About.jsx');
