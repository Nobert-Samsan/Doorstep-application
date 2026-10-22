const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const start = code.indexOf('{/* Floating Glass Card (Desktop Only) */}');
const endStr = '</div>\n        </div>\n\n        {/* Bottom edge gradient divider */}';
const end = code.indexOf(endStr);

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
  console.log('Removed floating glass card');
} else {
  console.log('Could not find floating card');
}
