const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(
  '<br />\n          <div className="col-card-navy-tag">🔵 NIC Verified Platform</div>',
  ''
);

code = code.replace(
  '<br />\n          <div className="col-card-navy-tag">🔵 Secure In-App Communication</div>',
  ''
);

// Fallback in case of formatting differences
code = code.replace(/<br \/>\s*<div className="col-card-navy-tag">🔵 NIC Verified Platform<\/div>/g, '');
code = code.replace(/<br \/>\s*<div className="col-card-navy-tag">🔵 Secure In-App Communication<\/div>/g, '');
code = code.replace(/<div className="col-card-navy-tag">🔵 NIC Verified Platform<\/div>/g, '');
code = code.replace(/<div className="col-card-navy-tag">🔵 Secure In-App Communication<\/div>/g, '');

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Removed navy tags from Landing.jsx');
