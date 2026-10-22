const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(
  'Satisfy Every Home Need With Our',
  'Satisfy Every Home <br /> Need With Our'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Added break before Need');
