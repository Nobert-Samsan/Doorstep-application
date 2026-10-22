const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const trustRowStart = code.indexOf('{/* Trust Row */}');
const fadeInEnd = code.indexOf('</FadeIn>', trustRowStart);

if (trustRowStart !== -1 && fadeInEnd !== -1) {
  code = code.substring(0, trustRowStart) + code.substring(fadeInEnd);
}

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Removed Trust Row correctly');
