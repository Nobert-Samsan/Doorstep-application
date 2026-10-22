const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

code = code.replace(/py-32/g, 'py-16 md:py-32');
fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log("Fixed py-32 sizes!");
