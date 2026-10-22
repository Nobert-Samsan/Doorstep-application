const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');
code = code.replace(/\/hero-new\.png/g, '/hero-ultra.jpg');
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Updated image source');
