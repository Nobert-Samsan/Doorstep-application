const fs = require('fs');

function fixPadding(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/p-24/g, 'p-12 md:p-24');
  code = code.replace(/p-16/g, 'p-8 md:p-16');
  code = code.replace(/p-12/g, 'p-8 md:p-12');
  fs.writeFileSync(file, code);
}

fixPadding('frontend-web/src/pages/public/Landing.jsx');
fixPadding('frontend-web/src/pages/public/About.jsx');
fixPadding('frontend-web/src/pages/public/HowItWorks.jsx');
fixPadding('frontend-web/src/pages/public/Contact.jsx');

console.log("Fixed internal padding sizes!");
