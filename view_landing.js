const fs = require('fs');
const code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');
const start = code.indexOf('<section className="relative');
console.log(code.substring(start, start + 1500));
