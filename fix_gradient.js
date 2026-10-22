const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// Update gradient to fade out much earlier so the worker's face is visible
code = code.replace(
  "background: 'linear-gradient(90deg, #000000 0%, #000000 40%, transparent 65%)'",
  "background: 'linear-gradient(90deg, #000000 0%, #000000 5%, transparent 30%)'"
);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Fixed gradient mask');
