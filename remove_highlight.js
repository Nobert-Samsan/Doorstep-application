const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const target = '<span className="text-[#000000] font-semibold relative z-10"><span className="absolute bottom-1 left-0 w-full h-[40%] bg-[#FF7A00]/15 -z-10"></span>Western Province</span>';
const replacement = '<span className="text-[#000000] font-semibold relative z-10">Western Province</span>';

code = code.replace(target, replacement);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Highlight removed in Landing.jsx');
