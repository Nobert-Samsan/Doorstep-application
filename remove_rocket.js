const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(
  '🚀 DoorStep was built to',
  'DoorStep was built to'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Removed rocket emoji');
