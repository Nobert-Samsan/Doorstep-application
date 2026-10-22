const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace("Sri Lanka's", "Sri Lanka&apos;s");
code = code.replace("worker's", "worker&apos;s");

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Fixed apostrophes');
