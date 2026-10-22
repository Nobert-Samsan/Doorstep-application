const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

code = code.replace(
  'className="relative bg-[#FFF8F1] py-16 md:py-24 overflow-hidden"',
  'className="relative bg-[#FFFFFF] py-16 md:py-24 overflow-hidden"'
);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Changed Our Story background to white');
