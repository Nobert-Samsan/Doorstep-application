const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const start = code.indexOf('{/* 1. Hero Banner - Redesigned */}');
const end = code.indexOf('{/* 2. Tab Selector */}');

if (start !== -1 && end !== -1) {
  const newHero = `{/* 1. Hero Banner - Clean Minimalist */}
      <section className="relative min-h-[90vh] lg:min-h-[96vh] bg-[#000000] overflow-hidden flex items-center pt-20 lg:pt-0 pb-16 lg:pb-0">
        
        {/* Decorative background glow & pattern */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#FF7A00]/15 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/4"></div>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        {/* Image side (Mobile: top 42% height, Desktop: right 50% width) */}
        <div className="absolute top-0 right-0 w-full h-[42%] lg:h-full lg:w-1/2 overflow-hidden">
          <img 
            src="/how-it-works-hero-new.jpg" 
            alt="A smiling homeowner booking a DoorStep professional on her phone" 
            className="w-full h-full object-cover object-[center_center] lg:object-[center_center] scale-105 animate-[zoomOut_1.2s_ease-out_forwards]"
            fetchPriority="high"
          />
          {/* Mobile bottom fade to black */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black block lg:hidden"></div>
          {/* Desktop left fade to black */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent hidden lg:block pointer-events-none" style={{ background: 'linear-gradient(90deg, #000000 0%, rgba(0,0,0,0.5) 15%, transparent 40%)' }}></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10 w-full flex flex-col items-start mt-[40%] lg:mt-0">
          <div className="max-w-[600px] w-full pt-8 lg:pt-24">
            
            <FadeIn delay={100}>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-4 py-1.5 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-[#FF7A00]"></div>
                <span className="text-white text-[13px] font-semibold uppercase tracking-[0.12em]">SIMPLE AND TRANSPARENT</span>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              {/* Headline */}
              <h1 className="text-[38px] lg:text-[52px] xl:text-[72px] font-poppins font-extrabold text-white leading-[1.1] mb-6">
                How <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">DoorStep Works</span>
                  <div className="absolute -bottom-1 left-0 w-full h-[6px] lg:h-[8px] rounded-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]"></div>
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              {/* Subtitle */}
              <p className="font-inter text-[18px] md:text-[22px] font-medium text-white/80 leading-[1.7] max-w-[540px]">
                Your journey to a perfectly maintained home is simple and transparent. Here is how we connect you with the best professionals in Sri Lanka.
              </p>
            </FadeIn>
            
          </div>
        </div>

        {/* Bottom edge gradient divider */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent opacity-80 z-20"></div>

        {/* CSS for animations */}
        <style dangerouslySetInnerHTML={{__html: \`
          @keyframes zoomOut {
            from { transform: scale(1.06); }
            to { transform: scale(1); }
          }
        \`}} />
      </section>

      `;

  code = code.substring(0, start) + newHero + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
  console.log('Successfully redesigned minimalist HowItWorks hero');
} else {
  console.log('Could not find HowItWorks hero bounds');
}
