const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const start = code.indexOf('{/* 3. Mission and Vision (Redesigned - Light Theme) */}');
const end = code.indexOf('{/* 6. What We Stand For (Redesigned) */}');

if (start !== -1 && end !== -1) {
  const newSection = `{/* 3. Mission and Vision - Redesigned Dark */}
      <section className="relative bg-[#000000] py-16 md:py-24 overflow-hidden">
        
        {/* Background glow and patterns */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF7A00] opacity-[0.14] rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FF7A00] opacity-[0.08] rounded-full blur-[100px] pointer-events-none -z-10 translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute inset-0 z-0 opacity-4 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10">
          
          <div className="flex flex-col items-center text-center mb-16">
            <FadeIn delay={0}>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-[#FF7A00]/12 border border-[#FF7A00]/30 px-4 py-1.5 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse"></div>
                <span className="text-[#FF7A00] text-[13px] font-semibold uppercase tracking-[0.12em]">PURPOSE & FUTURE</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={150}>
              {/* Headline */}
              <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-white leading-tight mb-5">
                Our Mission & <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">Vision</span>
              </h2>
              {/* Decorative Line */}
              <div className="w-[60px] h-[4px] rounded-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] mx-auto"></div>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <FadeIn delay={300}>
              {/* Mission Card */}
              <div className="group relative bg-[#111111] border border-white/5 rounded-[28px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 hover:border-[#FF7A00]/50 hover:shadow-[0_20px_50px_rgba(255,122,0,0.15)] transition-all duration-300 flex flex-col h-full overflow-hidden">
                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]"></div>
                
                {/* Watermark */}
                <div className="absolute -top-4 -right-4 text-[#FF7A00] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 pointer-events-none">
                  <Target size={140} strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <div className="w-[64px] h-[64px] rounded-[18px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_10px_24px_rgba(255,122,0,0.35)]">
                      <Target size={32} className="text-white" strokeWidth={2} />
                    </div>
                  </div>
                  
                  <div className="text-[#FF7A00] font-poppins font-semibold text-[13px] tracking-[0.12em] mb-2">01</div>
                  <h3 className="text-[26px] font-poppins font-semibold text-white mb-4">Our Mission</h3>
                  <p className="font-inter text-[16px] md:text-[17px] text-white/75 leading-[1.75] mb-8">
                    To make finding and hiring skilled home service workers <span className="text-white font-semibold">fast, safe, and accessible</span> for every Sri Lankan family, while ensuring <span className="text-white font-semibold">fair wages</span> and <span className="text-white font-semibold">dignified work</span> for our professionals.
                  </p>
                  
                  {/* Tags */}
                  <div className="mt-auto pt-6 border-t border-white/10 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">
                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />
                      <span className="text-white text-[13px] font-medium">Fast</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">
                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />
                      <span className="text-white text-[13px] font-medium">Safe</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">
                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />
                      <span className="text-white text-[13px] font-medium">Accessible</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={450}>
              {/* Vision Card */}
              <div className="group relative bg-[#111111] border border-white/5 rounded-[28px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 hover:border-[#FF7A00]/50 hover:shadow-[0_20px_50px_rgba(255,122,0,0.15)] transition-all duration-300 flex flex-col h-full overflow-hidden">
                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]"></div>
                
                {/* Watermark */}
                <div className="absolute -top-4 -right-4 text-[#FF7A00] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 pointer-events-none">
                  <Telescope size={140} strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <div className="w-[64px] h-[64px] rounded-[18px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_10px_24px_rgba(255,122,0,0.35)]">
                      <Telescope size={32} className="text-white" strokeWidth={2} />
                    </div>
                  </div>
                  
                  <div className="text-[#FF7A00] font-poppins font-semibold text-[13px] tracking-[0.12em] mb-2">02</div>
                  <h3 className="text-[26px] font-poppins font-semibold text-white mb-4">Our Vision</h3>
                  <p className="font-inter text-[16px] md:text-[17px] text-white/75 leading-[1.75] mb-8">
                    To be the <span className="text-white font-semibold">most trusted and reliable</span> digital home services platform in South Asia, empowering <span className="text-white font-semibold">hundreds of thousands of skilled workers</span> to build better livelihoods.
                  </p>
                  
                  {/* Tags */}
                  <div className="mt-auto pt-6 border-t border-white/10 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">
                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />
                      <span className="text-white text-[13px] font-medium">Trusted</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">
                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />
                      <span className="text-white text-[13px] font-medium">Reliable</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">
                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />
                      <span className="text-white text-[13px] font-medium">Empowering</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>
      `;

  code = code.substring(0, start) + newSection + '\n      ' + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
  console.log('Successfully redesigned Mission & Vision section');
} else {
  console.log('Could not find start or end bounds for Mission & Vision section');
}
