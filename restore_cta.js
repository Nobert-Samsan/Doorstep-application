const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const stripStart = code.indexOf('{/* Closing Strip Redesigned */}');
const stripEnd = code.indexOf('</div>\n      </div>\n\n      {/* Commission Policy');

if (stripStart !== -1 && stripEnd !== -1) {
  const newClosingStrip = `{/* Closing Strip Redesigned */}
        <div className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 md:px-8">
            <div className="relative bg-[#000000] rounded-[32px] py-10 px-6 lg:py-14 lg:px-12 text-center overflow-hidden shadow-2xl">
              
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF7A00]/15 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#FF7A00]/15 rounded-full blur-[60px] pointer-events-none translate-y-1/2 animate-[pulse_4s_ease-in-out_infinite]"></div>
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
              
              <div className="relative z-10 flex flex-col items-center">
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
                  </div>
                </FadeIn>

                <FadeIn delay={300}>
                  <div className="flex items-center justify-center gap-2 text-white/65 font-inter text-[14px]">
                    <Check size={16} className="text-[#2E9E5B]" />
                    {activeTab === 'customer' ? "Free to join. No credit card required." : "Free to join. No hidden fees."}
                  </div>
                </FadeIn>

              </div>
            </div>
          </div>
        </div>`;
        
  code = code.substring(0, stripStart) + newClosingStrip + '\n      ' + code.substring(stripEnd);
  fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
  console.log('Restored CTA completely clean');
} else {
  console.log('Could not find strip bounds');
}
