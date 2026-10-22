const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Contact.jsx', 'utf8');

const heroStart = code.indexOf('{/* 1. Hero Banner Redesigned */}');
const heroEnd = code.indexOf('</section>', heroStart) + '</section>'.length;

const newHero = `{/* 1. Hero Banner Redesigned */}
      <section className="relative flex flex-col lg:flex-row items-center lg:items-stretch bg-[#000000] lg:min-h-[600px] pt-24 lg:pt-32 pb-12 lg:pb-20 overflow-hidden">
        
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
          {/* Black shadow only to the half of the width of the hero image */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #000000 0%, rgba(0,0,0,0.8) 15%, rgba(0,0,0,0) 50%)' }}></div>
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
          </div>
        </div>

        {/* Bottom Edge Gradient Line */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent opacity-60 z-30"></div>
      </section>`;

if (heroStart !== -1 && heroEnd > heroStart) {
  code = code.substring(0, heroStart) + newHero + code.substring(heroEnd);
  fs.writeFileSync('frontend-web/src/pages/public/Contact.jsx', code);
  console.log('Successfully updated Contact Hero section with height, half shadow and removed items');
} else {
  console.log('Failed to find Contact Hero section');
}
