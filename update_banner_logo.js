const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/components/layout/MainLayout.jsx', 'utf8');

// Reduce banner padding and increase logo size
code = code.replace(
  'className="bg-amber-50 py-10 border-t border-gray-200"',
  'className="bg-amber-50 py-4 md:py-6 border-t border-gray-200"'
);

code = code.replace(
  '<img src="/logo-new.png" alt="DoorStep Logo" className="h-14 w-auto object-contain" />',
  '<img src="/logo-new.png" alt="DoorStep Logo" className="h-24 md:h-28 w-auto object-contain" />'
);

fs.writeFileSync('frontend-web/src/components/layout/MainLayout.jsx', code);

console.log("Updated banner padding and logo size!");
