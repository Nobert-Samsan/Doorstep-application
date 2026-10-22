const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// Remove 1000+ Experts
const b1 = /<div className="absolute -top-6 -right-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">[\s\S]*?1000\+ Experts<\/span>\s*<\/div>/;
code = code.replace(b1, '');

// Remove Verified Professionals
const b2 = /<div className="absolute -bottom-6 -left-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce-slow">[\s\S]*?Verified Professionals<\/span>\s*<\/div>/;
code = code.replace(b2, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Badges properly removed');
