const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(/text-\[40px\]/g, 'text-3xl md:text-[40px]');
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log("Fixed text-[40px] sizes!");
