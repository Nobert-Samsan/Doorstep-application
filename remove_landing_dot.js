const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const regex = /<div className="w-2\.5 h-2\.5 rounded-full bg-\[#2E9E5B\].*?><\/div>/s;
code = code.replace(regex, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Removed green dot from Landing.jsx');
