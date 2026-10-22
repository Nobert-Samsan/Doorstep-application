const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// The quote card is currently: bg-[#FFFFFF]
// I will change it to bg-[#FFF8F1]
code = code.replace(
  'className="relative bg-[#FFFFFF] rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.05)]',
  'className="relative bg-[#FFF8F1] rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.05)]'
);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Updated quote card background color');
