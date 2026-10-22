const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/components/layout/MainLayout.jsx', 'utf8');

// 1. Revert navbar logo back to logo-new.png
// The navbar logo is currently logo-new-3.png
code = code.replace(
  'src="/logo-new-3.png"',
  'src="/logo-new.png"'
);

// 2. Change the App Download Banner logo to logo-new-3.png
// The App Download banner logo is: <img src="/logo-new.png" alt="DoorStep Logo" className="h-24 md:h-28 w-auto object-contain" />
code = code.replace(
  '<img src="/logo-new.png" alt="DoorStep Logo" className="h-24 md:h-28 w-auto object-contain" />',
  '<img src="/logo-new-3.png" alt="DoorStep Logo" className="h-24 md:h-28 w-auto object-contain" />'
);

fs.writeFileSync('frontend-web/src/components/layout/MainLayout.jsx', code);
console.log('Fixed logo positions!');
