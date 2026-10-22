const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(
  'NIC Verified Professionals',
  'Verified Professionals'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Removed NIC');
