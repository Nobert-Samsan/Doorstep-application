const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

code = code.replace(/py-24/g, 'py-12 md:py-24');
fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log("Fixed py-24 sizes!");
