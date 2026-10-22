const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

code = code.replace(
  '<div className="flex flex-col sm:flex-row justify-center items-center gap-4">',
  '<div className="grid grid-cols-2 gap-3 max-w-[600px] mx-auto">'
);

// Modify first button
code = code.replace(
  '<a href="tel:+94112345678" className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 shadow-lg transition-all flex items-center justify-center gap-2">',
  '<a href="tel:+94112345678" className="w-full px-2 sm:px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 shadow-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[13px] sm:text-base text-center">'
);

// Modify second button
code = code.replace(
  '<a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="px-8 py-4 bg-gray-900 text-yellow-400 font-bold rounded-xl hover:bg-gray-800 shadow-lg transition-all flex items-center justify-center gap-2">',
  '<a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="w-full px-2 sm:px-8 py-4 bg-gray-900 text-yellow-400 font-bold rounded-xl hover:bg-gray-800 shadow-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[13px] sm:text-base text-center">'
);


fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log("Fixed banner buttons grid layout!");
