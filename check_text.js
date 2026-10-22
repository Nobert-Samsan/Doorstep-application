const fs = require('fs');
const code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');
const start = code.indexOf('<div className="space-y-4');
console.log(code.substring(start, start + 800));
