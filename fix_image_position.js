const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

code = code.replace(
  'className="w-full h-full object-cover object-[center_center] lg:object-[center_center] scale-105 animate-[zoomOut_1.2s_ease-out_forwards]"',
  'className="w-full h-full object-cover object-[center_center] lg:object-right scale-105 animate-[zoomOut_1.2s_ease-out_forwards]"'
);

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Fixed object position to show the right side of the image');
