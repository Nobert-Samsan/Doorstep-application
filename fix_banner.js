const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

code = code.replace(
  'Our support team is here to help you ΓÇö Monday to Saturday 8am to 6pm',
  'Our support team is here to help you — Monday to Saturday 8am to 6pm'
);

code = code.replace(
  '<div className="flex flex-col sm:flex-row justify-center gap-4">',
  '<div className="flex flex-col sm:flex-row justify-center items-center gap-4">'
);

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log("Fixed banner issue strictly with items-center!");
