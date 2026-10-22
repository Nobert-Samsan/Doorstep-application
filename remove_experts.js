const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const b1 = /<div className="absolute -top-6 -right-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">[\s\S]*?1000\+ Experts<\/span>\s*<\/div>\s*<\/div>/;
code = code.replace(b1, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
