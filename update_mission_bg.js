const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// 1. Change section background to white
code = code.replace(
  'className="relative bg-[#000000] py-16 md:py-24 overflow-hidden"',
  'className="relative bg-[#FFFFFF] py-16 md:py-24 overflow-hidden"'
);

// 2. Change radial gradient dotted pattern from white dots to black dots
code = code.replace(
  "style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}",
  "style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}"
);

// 3. Change headline text from white to black
code = code.replace(
  'className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-white leading-tight mb-5"',
  'className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-black leading-tight mb-5"'
);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Updated Mission & Vision section background to white');
