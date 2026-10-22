const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const startStr = '{/* Bottom-right Stat Card */}';
const start = code.indexOf(startStr);
const end = code.indexOf('</div>\n                </div>\n              </FadeIn>', start);

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
  console.log('Removed stat card from Our Story section');
} else {
  console.log('Could not find stat card');
}
