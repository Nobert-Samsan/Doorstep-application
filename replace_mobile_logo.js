const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/components/layout/MainLayout.jsx', 'utf8');

code = code.replace(
  /<div className="w-10 h-10[^>]*>D<\/div>\s*<span className="text-3xl font-extrabold tracking-tight text-gray-900">DoorStep<\/span>/g,
  '<img src="/logo.jpg" alt="DoorStep Logo" className="h-12 w-auto object-contain" />'
);

fs.writeFileSync('frontend-web/src/components/layout/MainLayout.jsx', code);
console.log("Mobile logo replaced!");
