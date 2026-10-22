const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');
code = code.replace(
  'font-poppins tracking-tight">',
  'font-poppins tracking-tighter">'
);
fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Decreased letter spacing even more.');
