const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');
code = code.replace(
  '<h2 className="text-[#000000] font-bold text-[30px] md:text-[48px] leading-[1.15] max-w-[820px] font-poppins">',
  '<h2 className="text-[#000000] font-bold text-[30px] md:text-[48px] leading-[1.15] max-w-[820px] font-poppins tracking-tight">'
);
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Decreased letter spacing of headline.');
