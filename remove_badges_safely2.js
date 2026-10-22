const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const b1 = /\{\/\* Floating Badge 1 - Top Right \*\/\}[\s\S]*?<div className="absolute -top-6 -right-6[\s\S]*?1000\+ Experts[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(b1, '');

const b2 = /\{\/\* Floating Badge 2 - Bottom Left \*\/\}[\s\S]*?<div className="absolute bottom-10 -left-10[\s\S]*?Verified Professionals[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(b2, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Badges removed safely 2.');
