const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// Find the stats row container and make it align to top/stretch
code = code.replace(
  '<div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">',
  '<div className="relative z-10 flex flex-col md:flex-row items-start md:items-stretch justify-between gap-8 md:gap-4">'
);

// We want the text to align, so let's add justify-start to the children. 
// They are currently: <div className="flex-1 flex flex-col items-center text-center w-full">
code = code.replace(
  /<div className="flex-1 flex flex-col items-center text-center w-full">/g,
  '<div className="flex-1 flex flex-col items-center justify-start text-center w-full h-full">'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Fixed alignment');
