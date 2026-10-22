const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// Change Headline font size
code = code.replace(
  'text-[38px] lg:text-[64px] font-bold text-white',
  'text-[38px] lg:text-[72px] font-bold text-white'
);

// Change Subtitle font size
code = code.replace(
  'text-[18px] lg:text-[20px] text-white/80',
  'text-[18px] lg:text-[22px] text-white/80'
);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Updated font sizes in About hero');
