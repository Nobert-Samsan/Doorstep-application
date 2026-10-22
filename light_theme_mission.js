const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const startStr = '{/* 3. Mission and Vision (Redesigned) */}';
const endStr = '{/* 6. What We Stand For (Redesigned) */}';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    const lines = [
      '{/* 3. Mission and Vision (Redesigned - Light Theme) */}',
      '<section className="relative py-32 bg-white overflow-hidden">',
      '  {/* Decorative background glow */}',
      '  <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-50/50 rounded-full blur-[100px] pointer-events-none"></div>',
      '  <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-50/50 rounded-full blur-[80px] pointer-events-none"></div>',
      '  ',
      '  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">',
      '    <div className="text-center mb-20">',
      '      <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Purpose &amp; Future</span>',
      '      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Our Mission &amp; Vision</h2>',
      '    </div>',
      '    ',
      '    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">',
      '      {/* Mission Card */}',
      '      <div className="group relative bg-white border border-gray-100 p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(234,88,12,0.08)] hover:-translate-y-1 transition-all duration-300">',
      '        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-amber-400 rounded-t-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>',
      '        <div className="w-20 h-20 bg-amber-50 text-primary rounded-2xl flex items-center justify-center mb-8 border border-amber-100 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">',
      '          <Target size={40} strokeWidth={1.5} />',
      '        </div>',
      '        <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>',
      '        <p className="text-gray-600 text-lg leading-relaxed font-medium">',
      '          To make finding and hiring skilled home service workers fast, safe, and accessible for every Sri Lankan family, while ensuring fair wages and dignified work for our professionals.',
      '        </p>',
      '      </div>',
      '      ',
      '      {/* Vision Card */}',
      '      <div className="group relative bg-white border border-gray-100 p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.08)] hover:-translate-y-1 transition-all duration-300">',
      '        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-primary rounded-t-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>',
      '        <div className="w-20 h-20 bg-orange-50 text-amber-500 rounded-2xl flex items-center justify-center mb-8 border border-orange-100 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">',
      '          <Telescope size={40} strokeWidth={1.5} />',
      '        </div>',
      '        <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>',
      '        <p className="text-gray-600 text-lg leading-relaxed font-medium">',
      '          To be the most trusted and reliable digital home services platform in South Asia, empowering hundreds of thousands of skilled workers to build better livelihoods.',
      '        </p>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>',
      '',
      ''
    ];
              
    code = code.substring(0, startIdx) + lines.join('\n') + code.substring(endIdx);
    fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
    console.log("Successfully redesigned mission section to light theme!");
} else {
    console.log("Could not find sections");
}
