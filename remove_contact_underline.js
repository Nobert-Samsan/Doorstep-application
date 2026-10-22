const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Contact.jsx', 'utf8');

const regex = /<div className="absolute -bottom-1 left-0 w-full h-\[6px\].*? rounded-full"><\/div>/s;
code = code.replace(regex, '');

fs.writeFileSync('frontend-web/src/pages/public/Contact.jsx', code);
console.log('Removed underline from Contact Us');
