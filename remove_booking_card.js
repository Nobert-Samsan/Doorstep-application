const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/customer/Dashboard.jsx', 'utf8');

const start = code.indexOf('{/* Upcoming Booking Card (Desktop Only, positioned right) */}');
const end = code.indexOf('</div>', code.indexOf('</button>', start)) + '</div>'.length;

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/customer/Dashboard.jsx', code);
  console.log('Successfully removed Upcoming Booking Card!');
} else {
  console.log('Could not find Upcoming Booking Card block!');
}
