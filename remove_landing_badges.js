const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// 1. "1000+ Experts" badge
const b1 = /<div className="absolute[^>]+bg-white rounded-2xl[^>]+>[\s\S]*?1000\+ Experts[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(b1, '');

// 2. "Verified Professionals" badge
const b2 = /<div className="absolute[^>]+bg-white rounded-2xl[^>]+>[\s\S]*?Verified Professionals[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(b2, '');

// 3. "Now Hiring" badge
const b3 = /<div className="absolute[^>]+bg-white rounded-2xl[^>]+>[\s\S]*?Now Hiring[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(b3, '');

// 4. "Join 1000+ Professionals" badge
const b4 = /<div className="absolute[^>]+bg-white rounded-2xl[^>]+>[\s\S]*?Join 1000\+ Professionals[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(b4, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Removed all 4 badges from Landing.jsx');
