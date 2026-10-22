const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const regex = /\{\/\* 6\. App Download Banner \*\/\}[\s\S]*?<\/section>/;
code = code.replace(regex, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('App Download Banner removed successfully');
