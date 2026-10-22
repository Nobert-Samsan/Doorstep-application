const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// 1. 1000+ Experts
const b1 = /\{\/\* Floating Badge 1 - Top Right \*\/\}[\s\S]*?<div className="absolute[^>]*?>\s*<div[^>]*?>\s*<[^\n]*?size=\{18\}[^>]*?>\s*<\/div>\s*<span[^>]*?>1000\+ Experts<\/span>\s*<\/div>/;
code = code.replace(b1, '');

// 2. Verified Professionals (Floating Badge 2 - Bottom Left)
const b2 = /\{\/\* Floating Badge 2 - Bottom Left \*\/\}[\s\S]*?<div className="absolute[^>]*?>\s*<div[^>]*?>\s*<[^\n]*?size=\{18\}[^>]*?>\s*<\/div>\s*<span[^>]*?>Verified Professionals<\/span>\s*<\/div>/;
code = code.replace(b2, '');

// 3. Now Hiring
const b3 = /\{\/\* Floating Badge 1 - Top Left \*\/\}[\s\S]*?<div className="absolute[^>]*?>\s*<div[^>]*?><\/div>\s*<span[^>]*?>Now Hiring<\/span>\s*<\/div>/;
code = code.replace(b3, '');

// 4. Join 1000+ Professionals
const b4 = /\{\/\* Floating Badge 2 - Bottom Right \*\/\}[\s\S]*?<div className="absolute[^>]*?>\s*<div[^>]*?>\s*<[^\n]*?size=\{18\}[^>]*?>\s*<\/div>\s*<span[^>]*?>Join 1000\+ Professionals<\/span>\s*<\/div>/;
code = code.replace(b4, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log("Safe badges removed!");
