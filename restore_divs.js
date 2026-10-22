const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(/\{\/\* Text Column \*\/\}/g, '</div>\n\n              {/* Text Column */}');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Restored missing closing divs');
