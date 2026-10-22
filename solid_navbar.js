const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/components/layout/MainLayout.jsx', 'utf8');

code = code.replace(
  '<nav className="glass sticky top-0 z-50 transition-all duration-300">',
  '<nav className="bg-white border-b border-[#E8E2DB] sticky top-0 z-50 transition-all duration-300">'
);

fs.writeFileSync('frontend-web/src/components/layout/MainLayout.jsx', code);
console.log('Made navbar solid white.');
