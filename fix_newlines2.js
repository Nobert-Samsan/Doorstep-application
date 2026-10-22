const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');
code = code.split('\\\\n').join('\\n');
fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log("Fixed newlines for real!");
