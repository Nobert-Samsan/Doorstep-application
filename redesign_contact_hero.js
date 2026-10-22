const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Contact.jsx', 'utf8');

// Add imports
if (!code.includes('FadeIn')) {
  code = code.replace("import React from 'react';", "import React from 'react';\nimport FadeIn from '../../components/animations/FadeIn';");
}

code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, p1) => {
  const newIcons = ['PhoneCall', 'MessageSquare', 'Mail', 'Headset', 'MessageCircle'];
  let existing = p1.split(',').map(i => i.trim());
  newIcons.forEach(i => {
    if (!existing.includes(i)) existing.push(i);
  });
  return `import { ${existing.join(', ')} } from 'lucide-react';`;
});


const heroStart = code.indexOf('{/* 1. Hero Banner */}');
const heroEnd = code.indexOf('</section>', heroStart) + '</section>'.length;

const newHero = `{/* 1. Hero Banner Redesigned */}
      <section className="relative flex flex-col lg:flex-row items-center lg:items-stretch bg-[#000000] lg:min-h-[540px] pt-24 lg:pt-32 pb-12 lg:pb-20 overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#FF7A00]/15 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"></div>
        <div className="absolute inset-0 opacity-5 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        {/* Desktop Image & Gradient */}
        <div className="hidden lg:block absolute right-0 top-0 w-[58%] h-full z-0">
          <img 
            src="/contact-hero.jpg" 
            alt="A friendly DoorStep support team member wearing a headset" 
            className="w-full h-full object-cover object-[right_center]"
          />
          {/* Faded into solid black on the left */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #000000 0%, #000000 36%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.1) 100%)' }}></div>
        </div>

        {/* Mobile Image & Gradient */}
        <div className="block lg:hidden relative w-full h-[300px] sm:h-[400px] z-0">
          <img 
            src="/contact-hero.jpg" 
            alt="A friendly DoorStep support team member wearing a headset" 
            className="w-full h-full object-cover object-[right_center]"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, #000000 95%)' }}></div>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 relative z-10 flex flex-col justify-center mt-[-40px] lg:mt-0">
          <div className="max-w-[600px] text-left">
            
            <FadeIn delay={0}>
              <div className="text-[14px] text-white/60 font-inter mb-6">
                <Link to="/" className="hover:text-[#FF7A00] transition-colors">Home</Link> / <span className="text-white">Contact</span>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B] animate-pulse"></div>
                <span className="text-white text-[13px] font-medium tracking-[0.12em] uppercase">WE'RE HERE TO HELP</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <h1 className="text-[38px] md:text-[52px] lg:text-[64px] font-poppins font-bold text-white mb-6 leading-[1.1]">
                Contact <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">
                  Us
                  <div className="absolute -bottom-1 left-0 w-full h-[6px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] rounded-full"></div>
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={300}>
              <p className="font-inter text-[18px] lg:text-[20px] text-white/80 max-w-[520px] leading-[1.7] mb-10">
                We're here to help. Get in touch with our support team for any questions or assistance.
              </p>
            </FadeIn>

            {/* Quick Contact Cards */}
            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a href="tel:+94112345678" className="group flex-1 bg-white/5 border border-white/10 rounded-[16px] p-3.5 md:p-[14px_18px] backdrop-blur-[12px] flex items-center gap-3 hover:-translate-y-1 hover:border-[#FF7A00]/60 transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(255,122,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                  <div className="w-10 h-10 shrink-0 rounded-[10px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.3)]">
                    <PhoneCall size={18} className="text-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-white font-semibold text-[14px] leading-tight">Call Us</span>
                    <span className="text-white/70 text-[13px] leading-tight mt-0.5">+94 11 234 5678</span>
                  </div>
                </a>

                <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="group flex-1 bg-white/5 border border-white/10 rounded-[16px] p-3.5 md:p-[14px_18px] backdrop-blur-[12px] flex items-center gap-3 hover:-translate-y-1 hover:border-[#FF7A00]/60 transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(255,122,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                  <div className="w-10 h-10 shrink-0 rounded-[10px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.3)]">
                    <MessageCircle size={18} className="text-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-white font-semibold text-[14px] leading-tight">WhatsApp</span>
                    <span className="text-white/70 text-[13px] leading-tight mt-0.5">Chat with us</span>
                  </div>
                </a>

                <a href="mailto:support@doorstep.lk" className="group flex-1 bg-white/5 border border-white/10 rounded-[16px] p-3.5 md:p-[14px_18px] backdrop-blur-[12px] flex items-center gap-3 hover:-translate-y-1 hover:border-[#FF7A00]/60 transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(255,122,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                  <div className="w-10 h-10 shrink-0 rounded-[10px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.3)]">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-white font-semibold text-[14px] leading-tight">Email Us</span>
                    <span className="text-white/70 text-[13px] leading-tight mt-0.5">support@doorstep.lk</span>
                  </div>
                </a>
              </div>
            </FadeIn>

            {/* Support Hours Pill */}
            <FadeIn delay={500}>
              {(() => {
                const lkaTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
                const day = lkaTime.getDay();
                const hour = lkaTime.getHours();
                const isOnline = day >= 1 && day <= 6 && hour >= 8 && hour < 18;
                
                return isOnline ? (
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B] animate-pulse"></div>
                    <span className="text-white text-[13px] font-medium">Support team online now</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span className="text-white/70 text-[13px] font-medium">We'll reply next working day</span>
                  </div>
                );
              })()}
            </FadeIn>
          </div>
        </div>

        {/* Floating Element on Image (Desktop Only) */}
        <div className="hidden lg:flex absolute bottom-16 right-16 xl:right-[15%] z-20 items-center gap-4 bg-white/10 backdrop-blur-[16px] border border-white/20 rounded-[16px] p-4 shadow-xl animate-[float_6s_ease-in-out_infinite]">
          <div className="w-12 h-12 shrink-0 rounded-[12px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-lg">
            <Headset size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-poppins font-semibold text-[15px]">Real people, real help</span>
            <span className="text-white/80 font-inter text-[13px]">Monday to Saturday, 8am to 6pm</span>
          </div>
        </div>

        {/* Bottom Edge Gradient Line */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent opacity-60 z-30"></div>
      </section>`;

if (heroStart !== -1 && heroEnd > heroStart) {
  code = code.substring(0, heroStart) + newHero + code.substring(heroEnd);
  fs.writeFileSync('frontend-web/src/pages/public/Contact.jsx', code);
  console.log('Successfully redesigned Contact Hero');
} else {
  console.log('Failed to find Contact Hero section');
}
