const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// Replace the desktop gradient
const oldDesktopGradient = `<div className="hidden lg:block absolute inset-0" style={{ background: 'linear-gradient(90deg, #000000 0%, #000000 38%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.15) 100%)' }}></div>`;
const newDesktopGradient = `<div className="hidden lg:block absolute inset-0" style={{ background: 'linear-gradient(90deg, #000000 0%, #000000 40%, transparent 65%)' }}></div>`;
code = code.replace(oldDesktopGradient, newDesktopGradient);

// Replace the mobile gradient
const oldMobileGradient = `<div className="block lg:hidden absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, #000000 95%)' }}></div>`;
const newMobileGradient = `<div className="block lg:hidden absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, #000000 100%)' }}></div>`;
code = code.replace(oldMobileGradient, newMobileGradient);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Fixed masks!');
