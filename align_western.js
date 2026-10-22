const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// Fix the text size of "Western" so it matches the other numbers
code = code.replace(
  'text-[36px] md:text-[44px]',
  'text-[44px] md:text-[52px]'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Fixed text size alignment.');
