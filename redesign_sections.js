const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const startStr = '{/* 3. Mission and Vision */}';
const endStr = '{/* 7. Join Us Banner */}';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    const newSections = \`{/* 3. Mission and Vision (Redesigned) */}
      <section className="relative py-32 bg-[#0F0C0A] overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Purpose & Future</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Our Mission & Vision</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Mission Card */}
            <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-12 rounded-3xl hover:bg-white/[0.06] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-amber-400 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_30px_rgba(234,88,12,0.15)] group-hover:scale-110 transition-transform duration-300">
                <Target size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                To make finding and hiring skilled home service workers fast, safe, and accessible for every Sri Lankan family, while ensuring fair wages and dignified work for our professionals.
              </p>
            </div>
            
            {/* Vision Card */}
            <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-12 rounded-3xl hover:bg-white/[0.06] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-primary rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-400 rounded-2xl flex items-center justify-center mb-8 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover:scale-110 transition-transform duration-300">
                <Telescope size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                To be the most trusted and reliable digital home services platform in South Asia, empowering hundreds of thousands of skilled workers to build better livelihoods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. What We Stand For (Redesigned) */}
      <section className="py-32 bg-[#F9FAFB] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Core Values</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">What We Stand For</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[
              { icon: Shield, title: 'Trust', desc: 'Every worker is strictly police-verified and background checked.' },
              { icon: Lock, title: 'Safety', desc: 'Secure payments and no unnecessary contact sharing.' },
              { icon: Eye, title: 'Transparency', desc: 'Upfront pricing. No hidden fees or surprise charges.' },
              { icon: Heart, title: 'Community', desc: 'Dedicated to supporting Sri Lankan families and workers.' }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-white p-8 pt-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group hover:-translate-y-2 transition-transform duration-300 border border-gray-100/50">
                  {/* Floating Icon Overlap */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full p-2 shadow-sm border border-gray-50">
                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center mt-2">{value.title}</h4>
                  <p className="text-gray-500 text-center leading-relaxed font-medium">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      \`;
              
    code = code.substring(0, startIdx) + newSections + code.substring(endIdx);
    fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
    console.log("Successfully redesigned sections!");
} else {
    console.log("Could not find sections");
}
