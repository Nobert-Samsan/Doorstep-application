const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');
code = code.replace(
  '<svg className="absolute w-full h-[12px] -bottom-2 left-0 text-[#FF7A00] opacity-80"',
  '<svg className="absolute w-full h-[12px] -bottom-4 left-0 text-[#FF7A00] opacity-80"'
);
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Moved line down');
