const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const svgRegex = /<svg className="absolute w-full h-\[8px\].*?<\/svg>\s*/s;
code = code.replace(svgRegex, '');

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Removed underline from About.jsx');
