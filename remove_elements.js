const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// 1. Remove Breadcrumbs
const breadcrumbStart = code.indexOf('{/* Breadcrumb */}');
const eyebrowStart = code.indexOf('{/* Eyebrow */}');
if (breadcrumbStart !== -1 && eyebrowStart !== -1) {
  code = code.substring(0, breadcrumbStart) + code.substring(eyebrowStart);
}

// 2. Remove Buttons and Trust Chips
const buttonsStart = code.indexOf('{/* Buttons */}');
const endOfChips = code.indexOf('</div>\n\n          </div>\n        </div>\n\n      </section>');
if (buttonsStart !== -1 && endOfChips !== -1) {
  code = code.substring(0, buttonsStart) + code.substring(endOfChips);
}

// Write back
fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Removed Breadcrumbs, Buttons, and Trust Chips');
