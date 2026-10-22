const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');
const start = code.indexOf('{/* Mission Statement Section */}');
let sections = [];
let i = start;
while ((i = code.indexOf('<section', i + 1)) !== -1) {
  sections.push(code.substring(i, i + 80));
}
console.log(sections);
