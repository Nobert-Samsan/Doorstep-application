const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/customer/Dashboard.jsx', 'utf8');

const start = code.indexOf('{/* Quick Actions (Grid) */}');
const endString = '                </div>\n\n              </div>\n            </div>';
const end = code.indexOf(endString, start);

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/customer/Dashboard.jsx', code);
  console.log('Successfully removed Quick Actions Grid!');
} else {
  console.log('Could not find Quick Actions Grid block!');
}
