const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// Change Headline font weight from font-bold to font-extrabold (800)
code = code.replace(
  'text-[38px] lg:text-[72px] font-bold text-white',
  'text-[38px] lg:text-[72px] font-extrabold text-white'
);

// Add font-medium (500) to Subtitle
code = code.replace(
  'text-[18px] lg:text-[22px] text-white/80 leading-[1.7]',
  'text-[18px] lg:text-[22px] font-medium text-white/80 leading-[1.7]'
);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Updated font weights in About hero');
