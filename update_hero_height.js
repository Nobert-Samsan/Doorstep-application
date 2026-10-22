const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/customer/Dashboard.jsx', 'utf8');

code = code.replace(
  '<section className="relative w-full min-h-auto md:min-h-[500px] lg:min-h-[56vh] bg-[#000000] flex flex-col md:justify-center overflow-hidden">',
  '<section className="relative w-full min-h-[90vh] lg:min-h-[96vh] bg-[#000000] flex flex-col md:justify-center overflow-hidden">'
);

fs.writeFileSync('frontend-web/src/pages/customer/Dashboard.jsx', code);
console.log('Successfully updated Dashboard hero height!');
