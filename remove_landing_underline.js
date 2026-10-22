const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const svgRegex = /<svg className="absolute w-full h-\[12px\].*?<\/svg>\s*/s;
code = code.replace(svgRegex, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Removed underline from Landing.jsx');
