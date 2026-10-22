const fs = require('fs');

function reduceHeroHeight(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/min-h-\[85vh\]/g, 'min-h-[55vh]');
  code = code.replace(/lg:min-h-\[800px\]/g, 'lg:min-h-[600px]');
  fs.writeFileSync(file, code);
}

reduceHeroHeight('frontend-web/src/pages/public/Landing.jsx');
reduceHeroHeight('frontend-web/src/pages/public/About.jsx');
reduceHeroHeight('frontend-web/src/pages/public/HowItWorks.jsx');
reduceHeroHeight('frontend-web/src/pages/public/Contact.jsx');

console.log("Reduced hero heights!");
