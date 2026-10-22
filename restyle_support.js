const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const sectionStart = code.indexOf('{/* Still Have Questions Banner Redesigned */}');
const sectionEnd = code.indexOf('</section>', sectionStart) + '</section>'.length;

if (sectionStart !== -1 && sectionEnd !== -1) {
  const newSection = `{/* Still Have Questions Banner Redesigned */}
      <section className="pt-8 pb-16 lg:pt-8 lg:pb-24 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8">
          <div className="relative bg-[#FFF8F1] border border-[#E8E2DB] rounded-[32px] py-10 px-6 lg:py-14 lg:px-12 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#FF7A00]/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-white/70 rounded-full blur-[60px] pointer-events-none translate-x-1/3 translate-y-1/3 animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
              
              {/* Text Column */}
              <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
                <FadeIn delay={0}>
                  <div className="w-[56px] h-[56px] rounded-[16px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_10px_24px_rgba(255,122,0,0.35)] mb-6">
                    <Headset size={28} className="text-white" />
                  </div>
                </FadeIn>
                
                <FadeIn delay={100}>
                  <h2 className="text-[28px] md:text-[32px] lg:text-[40px] font-poppins font-bold text-[#000000] mb-4 leading-[1.2] relative inline-block">
                    Still Have <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">Questions?</span>
                    <div className="absolute -bottom-2 left-1/2 lg:left-0 w-[60px] h-[4px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] rounded-full -translate-x-1/2 lg:translate-x-0"></div>
                  </h2>
                  <p className="font-inter text-[16px] lg:text-[17px] text-[#3D3D3D] max-w-[500px] leading-[1.7] mt-6">
                    Our support team is here to help you — <span className="text-black font-semibold">Monday to Saturday 8am to 6pm</span>
                  </p>
                  
                  {/* Availability Pill */}
                  {(() => {
                    const lkaTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
                    const day = lkaTime.getDay();
                    const hour = lkaTime.getHours();
                    const isOnline = day >= 1 && day <= 6 && hour >= 8 && hour < 18;
                    
                    return isOnline ? (
                      <div className="inline-flex items-center gap-2 bg-white border border-[#E8E2DB] px-3 py-1.5 rounded-full mt-6 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B] animate-pulse"></div>
                        <span className="text-[#000000] text-[13px] font-medium">Support team online now</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-white border border-[#E8E2DB] px-3 py-1.5 rounded-full mt-6 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        <span className="text-[#6B6B6B] text-[13px] font-medium">We'll reply next working day</span>
                      </div>
                    );
                  })()}
                </FadeIn>
              </div>

              {/* Buttons Column */}
              <div className="flex-shrink-0 w-full lg:w-[320px] flex flex-col gap-5">
                <FadeIn delay={200}>
                  <div className="w-full">
                    <a href="tel:+94112345678" className="w-full group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-semibold text-[16px] py-[16px] px-[28px] rounded-[12px] shadow-[0_10px_28px_rgba(255,122,0,0.30)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,122,0,0.40)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F1] outline-none">
                      <PhoneCall size={20} />
                      Call Us: +94 11 234 5678
                    </a>
                    <div className="text-[13px] text-[#6B6B6B] font-inter text-center mt-2.5">
                      Speak to our team directly
                    </div>
                  </div>
                </FadeIn>
                
                <FadeIn delay={300}>
                  <div className="w-full">
                    <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="w-full group bg-[#000000] text-white font-poppins font-semibold text-[16px] py-[16px] px-[28px] rounded-[12px] shadow-[0_10px_28px_rgba(0,0,0,0.20)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.30)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F1] outline-none">
                      <MessageSquare size={20} className="text-[#25D366]" />
                      WhatsApp Us
                    </a>
                    <div className="text-[13px] text-[#6B6B6B] font-inter text-center mt-2.5">
                      Usually replies within minutes
                    </div>
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </div>
      </section>`;

  code = code.substring(0, sectionStart) + newSection + code.substring(sectionEnd);
  fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
  console.log('Restyled support banner successfully');
} else {
  console.log('Could not find support banner');
}
