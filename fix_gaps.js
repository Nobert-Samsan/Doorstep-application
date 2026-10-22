const fs = require('fs');

function fixGaps(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/gap-24/g, 'gap-12 md:gap-24');
  code = code.replace(/gap-16/g, 'gap-8 md:gap-16');
  fs.writeFileSync(file, code);
}

fixGaps('frontend-web/src/pages/public/Landing.jsx');
fixGaps('frontend-web/src/pages/public/About.jsx');
fixGaps('frontend-web/src/pages/public/HowItWorks.jsx');
fixGaps('frontend-web/src/pages/public/Contact.jsx');

console.log("Fixed gap sizes!");
