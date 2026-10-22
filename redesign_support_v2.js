const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

if (!code.includes('Headset')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Headset } from 'lucide-react';");
}

const sectionStart = code.indexOf('{/* Still Have Questions Banner */}');
const sectionEnd = code.indexOf('</section>', sectionStart) + '</section>'.length;

if (sectionStart !== -1 && sectionEnd !== -1) {
  const newSection = `{/* Still Have Questions Banner Redesigned */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8">
          <div className="relative bg-[#000000] rounded-[32px] py-10 px-6 lg:py-14 lg:px-12 overflow-hidden shadow-2xl border border-[#FFFFFF]/5">
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#FF7A00]/18 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-[#FF7A00]/18 rounded-full blur-[60px] pointer-events-none translate-x-1/2 translate-y-1/2 animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute inset-0 border border-white/10 rounded-[32px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
              
              {/* Text Column */}
              <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
                <FadeIn delay={0}>
                  <div className="w-[56px] h-[56px] rounded-[16px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_10px_24px_rgba(255,122,0,0.35)] mb-6">
                    <Headset size={28} className="text-white" />
                  </div>
                </FadeIn>
                
                <FadeIn delay={100}>
                  <h2 className="text-[28px] md:text-[32px] lg:text-[40px] font-poppins font-bold text-white mb-4 leading-[1.2]">
                    Still Have <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">Questions?</span>
                  </h2>
                  <p className="font-inter text-[16px] lg:text-[17px] text-white/80 max-w-[500px] leading-[1.7]">
                    Our support team is here to help you — <span className="text-white font-semibold">Monday to Saturday 8am to 6pm</span>
                  </p>
                  
                  {/* Availability Pill */}
                  {(() => {
                    const lkaTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
                    const day = lkaTime.getDay();
                    const hour = lkaTime.getHours();
                    const isOnline = day >= 1 && day <= 6 && hour >= 8 && hour < 18;
                    
                    return isOnline ? (
                      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full mt-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B] animate-pulse"></div>
                        <span className="text-white text-[13px] font-medium">Support team online now</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full mt-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                        <span className="text-white/70 text-[13px] font-medium">We'll reply next working day</span>
                      </div>
                    );
                  })()}
                </FadeIn>
              </div>

              {/* Buttons Column */}
              <div className="flex-shrink-0 w-full lg:w-[320px] flex flex-col gap-5">
                <FadeIn delay={200}>
                  <div className="w-full">
                    <a href="tel:+94112345678" className="w-full group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-semibold text-[16px] py-[16px] px-[28px] rounded-[12px] shadow-[0_10px_28px_rgba(255,122,0,0.35)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,122,0,0.45)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none">
                      <PhoneCall size={20} />
                      Call Us: +94 11 234 5678
                    </a>
                    <div className="text-[13px] text-white/65 font-inter text-center mt-2.5">
                      Speak to our team directly
                    </div>
                  </div>
                </FadeIn>
                
                <FadeIn delay={300}>
                  <div className="w-full">
                    <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="w-full group bg-white text-black font-poppins font-semibold text-[16px] py-[16px] px-[28px] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none">
                      <MessageSquare size={20} className="text-[#25D366]" />
                      WhatsApp Us
                    </a>
                    <div className="text-[13px] text-white/65 font-inter text-center mt-2.5">
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
  console.log('Replaced Support Banner');
} else {
  console.log('Could not find support banner with actual comment text');
}
