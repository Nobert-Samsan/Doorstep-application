const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(
  '<span className="text-[#000000] font-semibold text-[20px]">{item.text}</span>',
  '<span className="text-[#000000] font-bold text-[17px]">{item.text}</span>'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Updated font size to 17px and font weight to 700');
