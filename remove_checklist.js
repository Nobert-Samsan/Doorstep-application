const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const checklistStart = code.indexOf('<FadeIn delay={300}>\n                {/* Checklist */}');
const checklistEnd = code.indexOf('</FadeIn>', checklistStart) + '</FadeIn>'.length;

if (checklistStart !== -1) {
  code = code.substring(0, checklistStart) + code.substring(checklistEnd);
  fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
  console.log('Removed checklist from Our Story');
} else {
  console.log('Could not find checklist');
}
