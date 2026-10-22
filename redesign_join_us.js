const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// Ensure necessary imports are present
if (!code.includes('Briefcase')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Search, Briefcase, Home } from 'lucide-react';");
}

const start = code.indexOf('{/* 7. Join Us Banner */}');
if (start !== -1) {
  const newSection = `{/* 7. Join Us Banner */}
      <section className="py-16 md:py-24 bg-white relative z-10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          
          <FadeIn delay={0}>
            <div className="relative rounded-[32px] p-12 md:p-16 lg:px-12 lg:py-20 overflow-hidden shadow-[0_20px_50px_rgba(255,122,0,0.2)]" 
                 style={{ background: 'linear-gradient(135deg, #FF9F0A 0%, #FF7A00 45%, #F94D1A 100%)' }}>
              
              {/* Decorative dotted pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:16px_16px] pointer-events-none"></div>

              {/* Decorative soft circles & outline arc */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '8s' }}></div>
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '10s' }}></div>
              <div className="absolute top-0 right-1/4 w-[200%] h-[200%] rounded-full border border-white/25 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

              {/* Watermark Icon */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 text-white opacity-5 pointer-events-none">
                <Home size={300} strokeWidth={1} />
              </div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col items-center text-center">
                
                <FadeIn delay={100}>
                  {/* Eyebrow */}
                  <div className="inline-flex items-center bg-black/18 border border-white/30 px-4 py-1.5 rounded-full mb-8">
                    <span className="text-white text-[13px] font-bold uppercase tracking-[0.12em]">Get Started Today</span>
                  </div>
                </FadeIn>

                <FadeIn delay={200}>
                  {/* Heading */}
                  <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-white leading-[1.15] mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
                    Ready to Join <span className="relative inline-block">
                      DoorStep?
                      <span className="absolute -bottom-1 left-0 w-full h-[4px] bg-[#000000] rounded-full"></span>
                    </span>
                  </h2>
                </FadeIn>

                <FadeIn delay={300}>
                  {/* Subtitle */}
                  <p className="font-inter text-[18px] md:text-[20px] text-white/95 leading-[1.7] max-w-[640px] mx-auto mb-12 drop-shadow-[0_1px_8px_rgba(0,0,0,0.12)]">
                    Whether you need a job done right or you're a skilled professional looking for work, we have a place for you.
                  </p>
                </FadeIn>

                {/* Buttons Container */}
                <FadeIn delay={400}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4 mb-14 w-full">
                    
                    {/* Find a Worker Button Group */}
                    <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                      <Link to="/search" className="group w-full sm:w-auto px-8 py-4 bg-[#000000] text-white font-poppins font-semibold text-[16px] rounded-[12px] shadow-[0_10px_28px_rgba(0,0,0,0.30)] hover:shadow-[0_10px_30px_rgba(255,122,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF7A00]">
                        <Search size={20} />
                        Find a Worker
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <span className="text-white/85 text-[13px] font-inter">Book a verified professional</span>
                    </div>

                    {/* Join as a Worker Button Group */}
                    <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                      <Link to="/register" className="group w-full sm:w-auto px-8 py-4 bg-white text-[#000000] font-poppins font-semibold text-[16px] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF7A00]">
                        <Briefcase size={20} />
                        Join as a Worker
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <span className="text-white/85 text-[13px] font-inter">Grow your business with us</span>
                    </div>

                  </div>
                </FadeIn>

                {/* Trust Row */}
                <FadeIn delay={500}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-white/95 text-[14px] font-medium">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-white" />
                      NIC Verified Professionals
                    </div>
                    <div className="hidden sm:block w-[1px] h-4 bg-white/35"></div>
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-white" />
                      Secure Payments
                    </div>
                    <div className="hidden sm:block w-[1px] h-4 bg-white/35"></div>
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-white" />
                      Western Province
                    </div>
                  </div>
                </FadeIn>

              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default About;
`;
  
  code = code.substring(0, start) + newSection;
  fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
  console.log('Successfully redesigned Join Us banner!');
} else {
  console.log('Join Us Banner section not found.');
}
