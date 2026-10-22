const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/components/layout/MainLayout.jsx', 'utf8');

code = code.replace(
  'src="/logo-new.png"',
  'src="/logo-new-3.png"'
);

fs.writeFileSync('frontend-web/src/components/layout/MainLayout.jsx', code);
console.log('Replaced logo in navbar.');
