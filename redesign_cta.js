const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

// Ensure necessary icons are imported
if (!code.includes('UserPlus')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, UserPlus, Check, FileQuestion } from 'lucide-react';");
}

const oldClosingStrip = `{/* Closing Strip */}
        <div className="py-16 text-center border-t border-[#E8E2DB] bg-white">
          <FadeIn delay={0}>
            <h3 className="text-[20px] font-poppins font-semibold text-[#000000] mb-6">Ready to start?</h3>
            <div className="flex flex-col items-center justify-center gap-3">
              <Link to={activeTab === 'customer' ? "/register" : "/register"} className="group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-semibold text-[16px] py-[14px] px-[28px] rounded-[12px] shadow-[0_8px_24px_rgba(255,122,0,0.35)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,122,0,0.45)] transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                {activeTab === 'customer' ? "Create Free Account" : "Join as a Worker"}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <span className="text-[13px] text-[#6B6B6B] font-medium">Free to join. No credit card required.</span>
            </div>
          </FadeIn>
        </div>`;

const newClosingStrip = `{/* Closing Strip Redesigned */}
        <div className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 md:px-8">
            <div className="relative bg-[#000000] rounded-[32px] py-10 px-6 lg:py-14 lg:px-12 text-center overflow-hidden shadow-2xl">
              
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF7A00]/15 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#FF7A00]/15 rounded-full blur-[60px] pointer-events-none translate-y-1/2 animate-[pulse_4s_ease-in-out_infinite]"></div>
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <FadeIn delay={0}>
                  <div className="inline-flex items-center gap-2 bg-[#FF7A00]/10 border border-[#FF7A00]/30 px-3 py-1.5 rounded-full mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse"></div>
                    <span className="text-[#FF7A00] text-[13px] font-semibold uppercase tracking-[0.12em]">Get Started</span>
                  </div>
                </FadeIn>

                <FadeIn delay={100}>
                  <h3 className="text-[28px] md:text-[32px] lg:text-[40px] font-poppins font-bold text-white mb-4 leading-[1.2]">
                    {activeTab === 'customer' ? (
                      <>Ready to <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">start?</span></>
                    ) : (
                      <>Ready to <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">grow?</span></>
                    )}
                  </h3>
                  <p className="font-inter text-[16px] lg:text-[17px] text-white/80 max-w-[520px] mx-auto mb-8">
                    {activeTab === 'customer' 
                      ? "It takes about 2 minutes to create your account and find your first professional."
                      : "It takes about 2 minutes to apply and start getting verified job requests."}
                  </p>
                </FadeIn>

                <FadeIn delay={200}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-6">
                    <Link to={activeTab === 'customer' ? "/register" : "/register"} className="w-full sm:w-auto group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-semibold text-[16px] py-[16px] px-[32px] rounded-[12px] shadow-[0_10px_28px_rgba(255,122,0,0.35)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,122,0,0.45)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                      {activeTab === 'customer' ? <UserPlus size={18} /> : <Briefcase size={18} />}
                      {activeTab === 'customer' ? "Create Free Account" : "Join as a Worker"}
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link to={activeTab === 'customer' ? "/services" : "/how-it-works"} className="w-full sm:w-auto group bg-transparent border border-white/30 text-white hover:bg-white hover:text-black font-poppins font-semibold text-[16px] py-[16px] px-[32px] rounded-[12px] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                      {activeTab === 'customer' ? <Search size={18} className="group-hover:text-black" /> : <FileQuestion size={18} className="group-hover:text-black" />}
                      {activeTab === 'customer' ? "Browse Services" : "How Payments Work"}
                    </Link>
                  </div>
                </FadeIn>

                <FadeIn delay={300}>
                  <div className="flex items-center justify-center gap-2 text-white/65 font-inter text-[14px] mb-8">
                    <Check size={16} className="text-[#2E9E5B]" />
                    {activeTab === 'customer' ? "Free to join. No credit card required." : "Free to join. No hidden fees."}
                  </div>

                  {/* Trust Row */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-white/75 font-inter">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#2E9E5B]/20 flex items-center justify-center">
                        <Check size={10} className="text-[#2E9E5B] stroke-[3]" />
                      </div>
                      {activeTab === 'customer' ? "NIC Verified Professionals" : "10% Flat Commission"}
                    </div>
                    <div className="hidden sm:block w-px h-3 bg-white/10"></div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#2E9E5B]/20 flex items-center justify-center">
                        <Check size={10} className="text-[#2E9E5B] stroke-[3]" />
                      </div>
                      Secure Payments
                    </div>
                    <div className="hidden sm:block w-px h-3 bg-white/10"></div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#2E9E5B]/20 flex items-center justify-center">
                        <Check size={10} className="text-[#2E9E5B] stroke-[3]" />
                      </div>
                      Islandwide Coverage
                    </div>
                  </div>
                </FadeIn>

              </div>
            </div>
          </div>
        </div>`;

if (code.includes('Ready to start?')) {
  // We'll replace using substring to be safe
  const stripStart = code.indexOf('{/* Closing Strip */}');
  const stripEnd = code.indexOf('</div>\n\n      </div>');
  if (stripStart !== -1 && stripEnd !== -1) {
    code = code.substring(0, stripStart) + newClosingStrip + code.substring(stripEnd);
    fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
    console.log('Replaced CTA strip');
  } else {
    console.log('Could not find strip bounds precisely');
  }
} else {
  console.log('Could not find Ready to start text');
}
