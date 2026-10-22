const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// Change tracking back to tracking-tight
code = code.replace(
  'font-poppins tracking-tighter">',
  'font-poppins tracking-tight">'
);

// Prevent "Sri Lanka" from wrapping by using whitespace-nowrap
code = code.replace(
  'Finding reliable home help in Sri Lanka has always been a',
  'Finding reliable home help in <span className="whitespace-nowrap">Sri Lanka</span> has always been a'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Adjusted spacing and fixed Sri Lanka wrapping.');
