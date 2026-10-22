const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/py-20/g, 'py-10 md:py-20');
  fs.writeFileSync(file, code);
}

fixFile('frontend-web/src/pages/public/Landing.jsx');
fixFile('frontend-web/src/pages/public/HowItWorks.jsx');
fixFile('frontend-web/src/pages/public/Contact.jsx');

console.log("Fixed py-20 sizes!");
