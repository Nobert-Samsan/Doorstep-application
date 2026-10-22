const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');
code = code.replace(/text-5xl md:text-7xl/g, 'text-4xl sm:text-5xl lg:text-7xl');
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);

console.log("Fixed Hero font size responsive!");
