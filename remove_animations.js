const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(/animate-fade-up-stagger-[1-4]/g, '');
code = code.replace(/animate-fade-in-zoom/g, '');
// Keep floating animations and scroll dot

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Removed entrance animations to fix potential black screen issue.');
