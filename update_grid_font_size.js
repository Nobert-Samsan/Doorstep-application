const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// Replace the specific text-[15px] for the 2x2 trust grid
code = code.replace(
  '<span className="text-[#000000] font-semibold text-[15px]">{item.text}</span>',
  '<span className="text-[#000000] font-semibold text-[20px]">{item.text}</span>'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Updated font size to 20px in 2x2 grid');
