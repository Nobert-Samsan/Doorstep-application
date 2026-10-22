const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');
code = code.replace(/lg:object-\[center_20%\]/g, 'lg:object-right');
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Updated object-position');
