const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const regex = /\{\/\* Subtle Warm Glow Behind Headline \*\/\}\s*<div className="absolute top-0 left-1\/2 -translate-x-1\/2 w-\[800px\] h-\[400px\] bg-\[#FF7A00\]\/10 rounded-full blur-\[100px\] pointer-events-none z-0"><\/div>/;
code = code.replace(regex, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Removed warm glow from Mission statement bg');
