const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const sectionStart = code.indexOf('{/* Closing Strip Redesigned */}');
const sectionEnd = code.indexOf('</FadeIn>\n\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      {/* Commission Policy');

if (sectionStart !== -1 && sectionEnd !== -1) {
  const newSection = `{/* Closing Strip Redesigned */}
        <div className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 md:px-8">
            <div className="relative bg-gradient-to-br from-[#FF9F0A] via-[#FF7A00] to-[#F94D1A] rounded-[32px] py-10 px-6 lg:py-14 lg:px-12 text-center overflow-hidden shadow-[0_24px_60px_rgba(249,77,26,0.30)]">
              
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-white/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
              <div className="absolute inset-0 opacity-8 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
              <div className="absolute inset-0 border border-white/25 rounded-[32px] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <FadeIn delay={100}>
                  <h3 className="text-[28px] md:text-[32px] lg:text-[40px] font-poppins font-bold text-white mb-4 leading-[1.2]" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                    {activeTab === 'customer' ? (
                      <>Ready to <span className="relative inline-block">start?<div className="absolute -bottom-1 left-0 w-full h-[4px] bg-[#000000] rounded-full"></div></span></>
                    ) : (
                      <>Ready to <span className="relative inline-block">grow?<div className="absolute -bottom-1 left-0 w-full h-[4px] bg-[#000000] rounded-full"></div></span></>
                    )}
                  </h3>
                  <p className="font-inter text-[16px] lg:text-[17px] text-white/95 max-w-[520px] mx-auto mb-8" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.12)' }}>
                    {activeTab === 'customer' 
                      ? "It takes about 2 minutes to create your account and find your first professional."
                      : "It takes about 2 minutes to apply and start getting verified job requests."}
                  </p>
                </FadeIn>

                <FadeIn delay={200}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-6">
                    <Link to={activeTab === 'customer' ? "/register" : "/register"} className="w-full sm:w-auto group bg-[#000000] text-white font-poppins font-semibold text-[16px] py-[16px] px-[32px] rounded-[12px] shadow-[0_10px_28px_rgba(0,0,0,0.30)] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.40)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF7A00]">
                      {activeTab === 'customer' ? <UserPlus size={18} /> : <Briefcase size={18} />}
                      {activeTab === 'customer' ? "Create Free Account" : "Join as a Worker"}
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </FadeIn>

                <FadeIn delay={300}>
                  <div className="flex items-center justify-center gap-2 text-white/90 font-inter text-[14px]">
                    <Check size={16} className="text-white" />
                    {activeTab === 'customer' ? "Free to join. No credit card required." : "Free to join. No hidden fees."}
                  </div>
`;

  code = code.substring(0, sectionStart) + newSection + code.substring(sectionEnd);
  fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
  console.log('Restyled closing banner');
} else {
  console.log('Could not find strip bounds');
}
