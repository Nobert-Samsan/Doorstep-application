const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace('min-h-[85vh] lg:min-h-[88vh]', 'min-h-[90vh] lg:min-h-[96vh]');
code = code.replace('h-[55%]', 'h-[65%]');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Height increased.');
